from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.entities import (
    IssueCluster, Report, StatusHistory, ClusterMembershipHistory, PrioritySnapshot
)
from app.schemas.schemas import ClusterOut, ClusterStatusUpdate, PriorityExplanationOut
from app.ai.priority import calculate_transparent_priority_score
from app.services.audit_service import log_audit_action


def get_all_clusters(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    status_filter: Optional[str] = None
) -> List[ClusterOut]:
    """Get list of issue clusters with report counts and category names."""
    query = db.query(IssueCluster)
    if status_filter:
        query = query.filter(IssueCluster.status == status_filter)

    clusters = query.order_by(IssueCluster.current_priority_score.desc()).offset(skip).limit(limit).all()
    out_list = []
    for c in clusters:
        reports_count = db.query(Report).filter(Report.cluster_id == c.id).count()
        cat_name = "General"
        if c.reports and c.reports[0].category:
            cat_name = c.reports[0].category.name

        out = ClusterOut.model_validate(c)
        out.report_count = reports_count
        out.category_name = cat_name
        out_list.append(out)
    return out_list


def update_cluster_status(
    db: Session,
    cluster_id: str,
    update_in: ClusterStatusUpdate,
    actor_id: str
) -> ClusterOut:
    """Update cluster status with mandatory administrative reason."""
    cluster = db.query(IssueCluster).filter(IssueCluster.id == cluster_id).first()
    if not cluster:
        raise HTTPException(status_code=404, detail="Issue cluster not found.")

    prev_status = cluster.status
    cluster.status = update_in.status
    if update_in.status == "Resolved":
        cluster.resolved_at = datetime.now(timezone.utc)

    # Record status history
    st_history = StatusHistory(
        cluster_id=cluster.id,
        previous_status=prev_status,
        new_status=update_in.status,
        reason=update_in.reason,
        changed_by=actor_id
    )
    db.add(st_history)

    # Also update status of all reports within this cluster
    reports = db.query(Report).filter(Report.cluster_id == cluster.id).all()
    for r in reports:
        r.status = update_in.status
        if update_in.status == "Resolved":
            r.resolved_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(cluster)

    log_audit_action(
        db,
        action="update_cluster_status",
        entity_type="cluster",
        entity_id=cluster.id,
        actor_id=actor_id,
        reason=update_in.reason,
        metadata_json={"previous_status": prev_status, "new_status": update_in.status}
    )

    out = ClusterOut.model_validate(cluster)
    out.report_count = len(reports)
    return out


def get_cluster_priority_explanation(
    db: Session,
    cluster_id: str
) -> PriorityExplanationOut:
    """Calculate and return transparent component priority score explanation."""
    cluster = db.query(IssueCluster).filter(IssueCluster.id == cluster_id).first()
    if not cluster:
        raise HTTPException(status_code=404, detail="Issue cluster not found.")

    reports = db.query(Report).filter(Report.cluster_id == cluster.id).all()
    max_impact = max([r.impact for r in reports]) if reports else 5
    max_urgency = max([r.urgency for r in reports]) if reports else 5

    total_score, comps, weights, explanation = calculate_transparent_priority_score(
        impact_rating=max_impact,
        urgency_rating=max_urgency,
        recurrence_count=cluster.recurrence_count,
        report_count=len(reports),
        created_at=cluster.created_at
    )

    # Store priority snapshot record
    snapshot = PrioritySnapshot(
        cluster_id=cluster.id,
        total_score=total_score,
        impact_component=comps["impact"],
        urgency_component=comps["urgency"],
        recurrence_component=comps["recurrence"],
        age_component=comps["age"],
        weights_json=weights,
        formula_version="1.0.0",
        explanation_json={"text": explanation}
    )
    db.add(snapshot)
    db.commit()

    return PriorityExplanationOut(
        cluster_id=cluster.id,
        total_priority_score=total_score,
        components=comps,
        weights=weights,
        human_explanation=explanation
    )


def merge_clusters(
    db: Session,
    target_cluster_id: str,
    source_cluster_id: str,
    reason: str,
    actor_id: str
) -> ClusterOut:
    """Merge source_cluster into target_cluster and preserve complete membership audit trail."""
    target = db.query(IssueCluster).filter(IssueCluster.id == target_cluster_id).first()
    source = db.query(IssueCluster).filter(IssueCluster.id == source_cluster_id).first()

    if not target or not source:
        raise HTTPException(status_code=404, detail="Target or source cluster not found.")

    source_reports = db.query(Report).filter(Report.cluster_id == source.id).all()
    for r in source_reports:
        r.cluster_id = target.id
        membership = ClusterMembershipHistory(
            report_id=r.id,
            cluster_id=target.id,
            action="merged",
            reason=f"Merged from cluster '{source.representative_title}': {reason}",
            actor_id=actor_id
        )
        db.add(membership)

    # Delete or mark merged cluster
    db.delete(source)
    db.commit()
    db.refresh(target)

    log_audit_action(
        db,
        action="merge_clusters",
        entity_type="cluster",
        entity_id=target.id,
        actor_id=actor_id,
        reason=reason,
        metadata_json={"merged_source_id": source_cluster_id, "reports_reassigned": len(source_reports)}
    )

    out = ClusterOut.model_validate(target)
    out.report_count = db.query(Report).filter(Report.cluster_id == target.id).count()
    return out


def split_cluster(
    db: Session,
    cluster_id: str,
    report_ids_to_split: List[str],
    new_title: str,
    reason: str,
    actor_id: str
) -> ClusterOut:
    """Split selected reports from an existing cluster into a brand new cluster."""
    original_cluster = db.query(IssueCluster).filter(IssueCluster.id == cluster_id).first()
    if not original_cluster:
        raise HTTPException(status_code=404, detail="Original cluster not found.")

    reports_to_split = db.query(Report).filter(Report.id.in_(report_ids_to_split)).all()
    if not reports_to_split:
        raise HTTPException(status_code=400, detail="No valid reports selected for split.")

    first_rep = reports_to_split[0]
    init_score, comps, weights, exp = calculate_transparent_priority_score(
        impact_rating=max([r.impact for r in reports_to_split]),
        urgency_rating=max([r.urgency for r in reports_to_split]),
        recurrence_count=0,
        report_count=len(reports_to_split),
        created_at=datetime.now(timezone.utc)
    )

    new_cluster = IssueCluster(
        representative_title=new_title,
        representative_description=first_rep.description,
        category_id=first_rep.category_id,
        status="Under Review",
        current_priority_score=init_score,
        recurrence_count=0
    )
    db.add(new_cluster)
    db.commit()
    db.refresh(new_cluster)

    for r in reports_to_split:
        r.cluster_id = new_cluster.id
        membership = ClusterMembershipHistory(
            report_id=r.id,
            cluster_id=new_cluster.id,
            action="split",
            reason=f"Split from original cluster '{original_cluster.representative_title}': {reason}",
            actor_id=actor_id
        )
        db.add(membership)

    db.commit()

    log_audit_action(
        db,
        action="split_cluster",
        entity_type="cluster",
        entity_id=new_cluster.id,
        actor_id=actor_id,
        reason=reason,
        metadata_json={"original_cluster_id": cluster_id, "split_reports_count": len(reports_to_split)}
    )

    out = ClusterOut.model_validate(new_cluster)
    out.report_count = len(reports_to_split)
    return out

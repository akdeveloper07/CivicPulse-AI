from datetime import datetime, timezone
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.entities import (
    Report, ReportEmbedding, IssueCluster, ReportMatch, StatusHistory, IssueCategory, RecurrenceEvent
)
from app.schemas.schemas import ReportCreate, ReportUpdate, ReportOut, CandidateMatchOut
from app.ai.embeddings import generate_embedding, get_text_fingerprint
from app.ai.similarity import rank_candidate_matches
from app.ai.clustering import recommend_cluster_assignment
from app.ai.priority import calculate_transparent_priority_score
from app.services.audit_service import log_audit_action


def create_report(
    db: Session,
    submitter_id: str,
    report_in: ReportCreate
) -> ReportOut:
    """Submit a new citizen report, compute embeddings, check for duplicate candidates, and assign cluster."""
    # Verify category exists
    cat = db.query(IssueCategory).filter(IssueCategory.id == report_in.category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Selected issue category not found.")

    new_report = Report(
        submitter_id=submitter_id,
        category_id=report_in.category_id,
        title=report_in.title.strip(),
        description=report_in.description.strip(),
        impact=report_in.impact,
        urgency=report_in.urgency,
        approximate_area=report_in.approximate_area,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        image_url=report_in.image_url,
        status="Submitted"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # 1. Compute and persist sentence embedding
    full_text = f"{new_report.title}. {new_report.description}"
    vec, model_ver = generate_embedding(full_text)
    fingerprint = get_text_fingerprint(full_text)

    embedding_record = ReportEmbedding(
        report_id=new_report.id,
        model_name="SentenceTransformers",
        model_version=model_ver,
        embedding_json={"vector": vec},
        text_fingerprint=fingerprint
    )
    db.add(embedding_record)

    # 2. Record initial status history
    status_entry = StatusHistory(
        report_id=new_report.id,
        previous_status="None",
        new_status="Submitted",
        reason="Report submitted by citizen.",
        changed_by=submitter_id
    )
    db.add(status_entry)

    # 3. Match against existing active clusters
    clusters = db.query(IssueCluster).filter(IssueCluster.status != "Resolved").all()
    cluster_dicts = [
        {
            "id": c.id,
            "representative_title": c.representative_title,
            "representative_description": c.representative_description,
            "embedding": None
        }
        for c in clusters
    ]

    target_cluster_id, max_sim, explanation = recommend_cluster_assignment(
        report_title=new_report.title,
        report_description=new_report.description,
        existing_clusters=cluster_dicts,
        report_embedding=vec
    )

    if target_cluster_id:
        new_report.cluster_id = target_cluster_id
        cluster_obj = db.query(IssueCluster).filter(IssueCluster.id == target_cluster_id).first()
        if cluster_obj:
            # Update priority score of assigned cluster
            reports_in_cluster = db.query(Report).filter(Report.cluster_id == cluster_obj.id).all()
            total_score, comps, weights, exp = calculate_transparent_priority_score(
                impact_rating=max([r.impact for r in reports_in_cluster] + [new_report.impact]),
                urgency_rating=max([r.urgency for r in reports_in_cluster] + [new_report.urgency]),
                recurrence_count=cluster_obj.recurrence_count,
                report_count=len(reports_in_cluster) + 1,
                created_at=cluster_obj.created_at
            )
            cluster_obj.current_priority_score = total_score
    else:
        # Create a new issue cluster for this standalone report
        init_score, comps, weights, exp = calculate_transparent_priority_score(
            impact_rating=new_report.impact,
            urgency_rating=new_report.urgency,
            recurrence_count=0,
            report_count=1,
            created_at=datetime.now(timezone.utc)
        )
        new_cluster = IssueCluster(
            representative_title=new_report.title,
            representative_description=new_report.description,
            category_id=new_report.category_id,
            status="Under Review",
            current_priority_score=init_score,
            recurrence_count=0
        )
        db.add(new_cluster)
        db.commit()
        db.refresh(new_cluster)
        new_report.cluster_id = new_cluster.id

    # 4. Check for recurrence against resolved clusters
    resolved_clusters = db.query(IssueCluster).filter(IssueCluster.status == "Resolved").all()
    for res_c in resolved_clusters:
        res_text = f"{res_c.representative_title}. {res_c.representative_description}"
        res_vec, _ = generate_embedding(res_text)
        from app.ai.embeddings import compute_cosine_similarity
        rec_sim = compute_cosine_similarity(vec, res_vec)
        if rec_sim >= 0.70:
            rec_event = RecurrenceEvent(
                historical_cluster_id=res_c.id,
                new_report_id=new_report.id,
                similarity_score=round(rec_sim, 4),
                evidence=f"High similarity ({round(rec_sim*100, 1)}%) to previously resolved cluster '{res_c.representative_title}'.",
                status="Pending Review"
            )
            db.add(rec_event)

    db.commit()
    db.refresh(new_report)

    log_audit_action(
        db,
        action="create_report",
        entity_type="report",
        entity_id=new_report.id,
        actor_id=submitter_id,
        reason="New citizen report submitted.",
        metadata_json={"title": new_report.title, "cluster_id": new_report.cluster_id}
    )

    out = ReportOut.model_validate(new_report)
    if cat:
        out.category = cat
    return out


def get_reports(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    category_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    submitter_id: Optional[str] = None
) -> List[ReportOut]:
    """Retrieve list of reports with optional filtering."""
    query = db.query(Report)
    if category_id:
        query = query.filter(Report.category_id == category_id)
    if status_filter:
        query = query.filter(Report.status == status_filter)
    if submitter_id:
        query = query.filter(Report.submitter_id == submitter_id)

    reports = query.order_by(Report.created_at.desc()).offset(skip).limit(limit).all()
    result = []
    for r in reports:
        out = ReportOut.model_validate(r)
        if r.category:
            out.category = r.category
        if r.submitter:
            out.submitter_name = r.submitter.name
        result.append(out)
    return result


def find_similar_reports_for_precheck(
    db: Session,
    title: str,
    description: str,
    category_id: Optional[str] = None
) -> List[CandidateMatchOut]:
    """Find and rank similar existing reports BEFORE citizen submits."""
    all_reports = db.query(Report).filter(Report.status != "Rejected").all()
    candidates = []
    for r in all_reports:
        emb_record = db.query(ReportEmbedding).filter(ReportEmbedding.report_id == r.id).first()
        vec = emb_record.embedding_json.get("vector") if emb_record else None
        candidates.append({
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "category_name": r.category.name if r.category else "General",
            "status": r.status,
            "created_at": r.created_at,
            "embedding": vec
        })

    ranked = rank_candidate_matches(
        source_title=title,
        source_description=description,
        candidate_reports=candidates
    )

    return [
        CandidateMatchOut(
            report_id=item["report_id"],
            title=item["title"],
            description=item["description"],
            category_name=item["category_name"],
            similarity_score=item["similarity_score"],
            confidence_level=item["confidence_level"],
            matched_evidence=item["matched_evidence"],
            status=item["status"],
            created_at=item["created_at"]
        )
        for item in ranked[:5]
    ]

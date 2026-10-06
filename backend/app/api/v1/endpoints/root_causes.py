from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import RootCauseHypothesisOut, RootCauseDecisionRequest
from app.api.dependencies import get_current_administrator
from app.models.entities import User, RootCauseHypothesis, IssueCluster
from app.ai.root_cause import discover_root_cause_hypotheses
from app.services.audit_service import log_audit_action

router = APIRouter()


@router.get("/hypotheses", response_model=List[RootCauseHypothesisOut])
def get_root_cause_hypotheses(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Get candidate root-cause hypotheses with evidence strength and uncertainty labels."""
    hypotheses = db.query(RootCauseHypothesis).order_by(RootCauseHypothesis.score_or_strength.desc()).all()
    result = []
    for h in hypotheses:
        out = RootCauseHypothesisOut.model_validate(h)
        c1 = db.query(IssueCluster).filter(IssueCluster.id == h.source_cluster_id).first()
        c2 = db.query(IssueCluster).filter(IssueCluster.id == h.related_cluster_id).first()
        if c1:
            out.source_cluster_title = c1.representative_title
        if c2:
            out.related_cluster_title = c2.representative_title
        result.append(out)
    return result


@router.post("/analyze", response_model=List[RootCauseHypothesisOut])
def run_root_cause_analysis(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Trigger AI root-cause hypothesis discovery analysis across active clusters."""
    clusters = db.query(IssueCluster).all()
    cluster_dicts = [
        {
            "id": c.id,
            "representative_title": c.representative_title,
            "representative_description": c.representative_description,
            "category_name": c.reports[0].category.name if c.reports and c.reports[0].category else "General",
            "approximate_area": c.reports[0].approximate_area if c.reports else "",
            "report_count": len(c.reports)
        }
        for c in clusters
    ]

    discovered = discover_root_cause_hypotheses(cluster_dicts)

    saved_hypotheses = []
    for item in discovered:
        # Check if hypothesis already exists
        existing = db.query(RootCauseHypothesis).filter(
            RootCauseHypothesis.source_cluster_id == item["source_cluster_id"],
            RootCauseHypothesis.related_cluster_id == item["related_cluster_id"]
        ).first()

        if not existing:
            rec = RootCauseHypothesis(
                source_cluster_id=item["source_cluster_id"],
                related_cluster_id=item["related_cluster_id"],
                hypothesis_text=item["hypothesis_text"],
                evidence_json=item["evidence_json"],
                score_or_strength=item["score_or_strength"],
                uncertainty_label=item["uncertainty_label"],
                review_status="Proposed"
            )
            db.add(rec)
            db.flush()
            saved_hypotheses.append(rec)
        else:
            saved_hypotheses.append(existing)

    db.commit()
    result = []
    for h in saved_hypotheses:
        out = RootCauseHypothesisOut.model_validate(h)
        c1 = db.query(IssueCluster).filter(IssueCluster.id == h.source_cluster_id).first()
        c2 = db.query(IssueCluster).filter(IssueCluster.id == h.related_cluster_id).first()
        if c1:
            out.source_cluster_title = c1.representative_title
        if c2:
            out.related_cluster_title = c2.representative_title
        result.append(out)
    return result


@router.post("/hypotheses/{hypothesis_id}/decision", response_model=RootCauseHypothesisOut)
def record_root_cause_decision(
    hypothesis_id: str,
    decision_in: RootCauseDecisionRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Confirm, reject, or defer a root-cause hypothesis."""
    hyp = db.query(RootCauseHypothesis).filter(RootCauseHypothesis.id == hypothesis_id).first()
    if not hyp:
        raise HTTPException(status_code=404, detail="Root cause hypothesis not found.")

    hyp.review_status = decision_in.decision
    hyp.review_reason = decision_in.reason
    hyp.reviewer_id = admin.id
    hyp.reviewed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(hyp)

    log_audit_action(
        db,
        action="root_cause_decision",
        entity_type="root_cause_hypothesis",
        entity_id=hyp.id,
        actor_id=admin.id,
        reason=decision_in.reason,
        metadata_json={"decision": decision_in.decision}
    )

    out = RootCauseHypothesisOut.model_validate(hyp)
    return out

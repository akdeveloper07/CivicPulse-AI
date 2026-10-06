from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import MatchOut, MatchDecisionRequest
from app.api.dependencies import get_current_administrator
from app.models.entities import User, ReportMatch, Report
from app.ai.uncertainty import screen_prediction_uncertainty
from app.services.audit_service import log_audit_action

router = APIRouter()


@router.get("/review-queue", response_model=List[MatchOut])
def get_match_review_queue(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Get candidate report match suggestions awaiting administrative review."""
    matches = db.query(ReportMatch).order_by(ReportMatch.similarity_score.desc()).all()
    result = []
    for m in matches:
        out = MatchOut.model_validate(m)
        src = db.query(Report).filter(Report.id == m.source_report_id).first()
        cand = db.query(Report).filter(Report.id == m.candidate_report_id).first()
        if src:
            out.source_report = src
        if cand:
            out.candidate_report = cand
        result.append(out)
    return result


@router.post("/matches/{match_id}/decision", response_model=MatchOut)
def record_match_decision(
    match_id: str,
    decision_in: MatchDecisionRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Approve, reject, or defer AI match suggestion."""
    match = db.query(ReportMatch).filter(ReportMatch.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Report match record not found.")

    match.decision = decision_in.decision
    match.decision_reason = decision_in.reason
    match.reviewer_id = admin.id
    match.reviewed_at = datetime.now(timezone.utc)

    # If confirmed duplicate, merge candidate report into source report's cluster
    if decision_in.decision in ["Confirmed duplicate", "Confirmed related"]:
        src_report = db.query(Report).filter(Report.id == match.source_report_id).first()
        cand_report = db.query(Report).filter(Report.id == match.candidate_report_id).first()
        if src_report and cand_report and src_report.cluster_id:
            cand_report.cluster_id = src_report.cluster_id

    db.commit()
    db.refresh(match)

    log_audit_action(
        db,
        action="match_decision",
        entity_type="report_match",
        entity_id=match.id,
        actor_id=admin.id,
        reason=decision_in.reason,
        metadata_json={"decision": decision_in.decision, "similarity_score": match.similarity_score}
    )

    out = MatchOut.model_validate(match)
    return out


@router.get("/uncertainty", response_model=List[dict])
def get_uncertainty_review_items(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Get screened uncertain AI predictions flagged for mandatory human review."""
    matches = db.query(ReportMatch).filter(ReportMatch.decision == "Suggested").all()
    pred_dicts = []
    for m in matches:
        src = db.query(Report).filter(Report.id == m.source_report_id).first()
        pred_dicts.append({
            "id": m.id,
            "prediction_type": "Duplicate Match Suggestion",
            "similarity_score": m.similarity_score,
            "title": src.title if src else "Report",
            "description": m.decision_reason or (src.description if src else "")
        })
    return screen_prediction_uncertainty(pred_dicts)

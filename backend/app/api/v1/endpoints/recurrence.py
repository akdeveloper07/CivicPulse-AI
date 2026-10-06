from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import RecurrenceEventOut, RecurrenceDecisionRequest
from app.api.dependencies import get_current_administrator
from app.models.entities import User, RecurrenceEvent, IssueCluster, Report
from app.services.audit_service import log_audit_action

router = APIRouter()


@router.get("/events", response_model=List[RecurrenceEventOut])
def get_recurrence_events(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Retrieve possible recurrence events for administrative review."""
    events = db.query(RecurrenceEvent).order_by(RecurrenceEvent.created_at.desc()).all()
    result = []
    for ev in events:
        out = RecurrenceEventOut.model_validate(ev)
        hist_c = db.query(IssueCluster).filter(IssueCluster.id == ev.historical_cluster_id).first()
        new_r = db.query(Report).filter(Report.id == ev.new_report_id).first()
        if hist_c:
            out.historical_cluster_title = hist_c.representative_title
        if new_r:
            out.new_report_title = new_r.title
        result.append(out)
    return result


@router.post("/events/{event_id}/decision", response_model=RecurrenceEventOut)
def record_recurrence_decision(
    event_id: str,
    decision_in: RecurrenceDecisionRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Confirm or reject recurrence event."""
    ev = db.query(RecurrenceEvent).filter(RecurrenceEvent.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Recurrence event not found.")

    ev.status = decision_in.decision
    ev.review_reason = decision_in.reason
    ev.reviewed_by = admin.id
    ev.reviewed_at = datetime.now(timezone.utc)

    # If confirmed recurrence, increment recurrence count of historical cluster and reopen if needed
    if decision_in.decision == "Confirmed Recurrence":
        hist_c = db.query(IssueCluster).filter(IssueCluster.id == ev.historical_cluster_id).first()
        if hist_c:
            hist_c.recurrence_count += 1
            if decision_in.decision == "Reopened" or hist_c.status == "Resolved":
                hist_c.status = "Reopened"

    db.commit()
    db.refresh(ev)

    log_audit_action(
        db,
        action="recurrence_decision",
        entity_type="recurrence_event",
        entity_id=ev.id,
        actor_id=admin.id,
        reason=decision_in.reason,
        metadata_json={"decision": decision_in.decision}
    )

    out = RecurrenceEventOut.model_validate(ev)
    return out

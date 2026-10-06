from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.entities import AuditLog


def log_audit_action(
    db: Session,
    action: str,
    entity_type: str,
    entity_id: str,
    actor_id: Optional[str] = None,
    reason: Optional[str] = None,
    metadata_json: Optional[Dict[str, Any]] = None
) -> AuditLog:
    """Create a persistent immutable audit log record."""
    audit_entry = AuditLog(
        actor_id=actor_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        reason=reason,
        metadata_json=metadata_json or {}
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(audit_entry)
    return audit_entry

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import UserOut
from app.api.dependencies import get_current_system_admin
from app.models.entities import User, AuditLog, ModelEvaluation
from app.ai.evaluation import evaluate_semantic_matching_vs_baseline

router = APIRouter()


@router.get("/users", response_model=List[UserOut])
def list_users(
    db: Session = Depends(get_db),
    sysadmin: User = Depends(get_current_system_admin)
):
    """List all registered system users."""
    users = db.query(User).all()
    return [UserOut.model_validate(u) for u in users]


@router.patch("/users/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: str,
    role: str,
    db: Session = Depends(get_db),
    sysadmin: User = Depends(get_current_system_admin)
):
    """Update user role (citizen, administrator, system_admin)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.role = role
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


@router.get("/audit-logs", response_model=List[dict])
def list_audit_logs(
    db: Session = Depends(get_db),
    sysadmin: User = Depends(get_current_system_admin)
):
    """Get system audit logs."""
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(100).all()
    return [
        {
            "id": l.id,
            "action": l.action,
            "entity_type": l.entity_type,
            "entity_id": l.entity_id,
            "actor_id": l.actor_id,
            "reason": l.reason,
            "created_at": l.created_at
        }
        for l in logs
    ]


@router.get("/model-evaluations", response_model=dict)
def get_model_evaluations(
    db: Session = Depends(get_db),
    sysadmin: User = Depends(get_current_system_admin)
):
    """Run and return offline AI model evaluations vs baseline metrics."""
    return evaluate_semantic_matching_vs_baseline([])

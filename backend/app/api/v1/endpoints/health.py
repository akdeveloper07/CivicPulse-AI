from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.session import get_db

router = APIRouter()


@router.get("/health")
def health_check():
    """Liveness probe endpoint."""
    return {"status": "ok", "service": "CivicPulse API"}


@router.get("/ready")
def readiness_check(db: Session = Depends(get_db)):
    """Readiness probe endpoint checking database connection."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        return {"status": "not_ready", "database": str(e)}

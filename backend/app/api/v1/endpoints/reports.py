from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import ReportCreate, ReportOut, CandidateMatchOut, SimilarityCheckRequest
from app.services.report_service import create_report, get_reports, find_similar_reports_for_precheck
from app.api.dependencies import get_current_user
from app.models.entities import User, Report, IssueCategory

router = APIRouter()


@router.post("", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
def submit_report(
    report_in: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a new citizen report."""
    return create_report(db, current_user.id, report_in)


@router.post("/check-similarity", response_model=List[CandidateMatchOut])
def check_similar_reports(
    req: SimilarityCheckRequest,
    db: Session = Depends(get_db)
):
    """Find and rank semantically similar existing reports before submission."""
    return find_similar_reports_for_precheck(db, req.title, req.description, req.category_id)


@router.get("", response_model=List[ReportOut])
def list_reports(
    skip: int = 0,
    limit: int = 50,
    category_id: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve all reports with filtering options."""
    return get_reports(db, skip=skip, limit=limit, category_id=category_id, status_filter=status)


@router.get("/mine", response_model=List[ReportOut])
def list_my_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve reports submitted by current citizen."""
    return get_reports(db, submitter_id=current_user.id)


@router.get("/categories", response_model=List[dict])
def list_categories(db: Session = Depends(get_db)):
    """List active issue categories."""
    cats = db.query(IssueCategory).filter(IssueCategory.is_active == True).all()
    return [{"id": c.id, "name": c.name, "description": c.description} for c in cats]


@router.get("/{report_id}", response_model=ReportOut)
def get_report_by_id(report_id: str, db: Session = Depends(get_db)):
    """Get single report details."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    out = ReportOut.model_validate(report)
    if report.category:
        out.category = report.category
    if report.submitter:
        out.submitter_name = report.submitter.name
    return out

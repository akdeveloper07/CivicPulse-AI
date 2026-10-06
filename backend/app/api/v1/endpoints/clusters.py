from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import (
    ClusterOut, ClusterStatusUpdate, PriorityExplanationOut, ClusterMergeRequest, ClusterSplitRequest
)
from app.services.cluster_service import (
    get_all_clusters, update_cluster_status, get_cluster_priority_explanation, merge_clusters, split_cluster
)
from app.api.dependencies import get_current_administrator
from app.models.entities import User, IssueCluster, Report

router = APIRouter()


@router.get("", response_model=List[ClusterOut])
def list_clusters(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all issue clusters sorted by explainable priority score."""
    return get_all_clusters(db, skip=skip, limit=limit, status_filter=status)


@router.get("/{cluster_id}", response_model=ClusterOut)
def get_cluster(cluster_id: str, db: Session = Depends(get_db)):
    """Get single cluster details with associated report count."""
    cluster = db.query(IssueCluster).filter(IssueCluster.id == cluster_id).first()
    if not cluster:
        raise HTTPException(status_code=404, detail="Issue cluster not found.")
    out = ClusterOut.model_validate(cluster)
    out.report_count = db.query(Report).filter(Report.cluster_id == cluster.id).count()
    if cluster.reports and cluster.reports[0].category:
        out.category_name = cluster.reports[0].category.name
    return out


@router.post("/{cluster_id}/status", response_model=ClusterOut)
def change_cluster_status(
    cluster_id: str,
    update_in: ClusterStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Update cluster status with mandatory administrative reason."""
    return update_cluster_status(db, cluster_id, update_in, admin.id)


@router.get("/{cluster_id}/priority-explanation", response_model=PriorityExplanationOut)
def get_priority_explanation(cluster_id: str, db: Session = Depends(get_db)):
    """Get transparent component breakdown for a cluster's priority score."""
    return get_cluster_priority_explanation(db, cluster_id)


@router.post("/merge", response_model=ClusterOut)
def merge_two_clusters(
    merge_in: ClusterMergeRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Merge source cluster into target cluster."""
    return merge_clusters(db, merge_in.target_cluster_id, merge_in.source_cluster_id, merge_in.reason, admin.id)


@router.post("/split", response_model=ClusterOut)
def split_cluster_reports(
    split_in: ClusterSplitRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Split selected reports from an existing cluster into a new cluster."""
    return split_cluster(db, split_in.report_ids[0], split_in.report_ids, split_in.new_representative_title, split_in.reason, admin.id)

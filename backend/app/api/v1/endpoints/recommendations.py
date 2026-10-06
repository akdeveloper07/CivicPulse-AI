from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.schemas import RecommendationOut, RecommendationFeedbackRequest
from app.api.dependencies import get_current_administrator
from app.models.entities import User, IssueCluster, ResolutionRecommendation
from app.ai.recommendations import generate_resolution_recommendations

router = APIRouter()


@router.get("/clusters/{cluster_id}/recommendations", response_model=List[RecommendationOut])
def get_recommendations_for_cluster(
    cluster_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Retrieve or generate resolution action recommendations from past resolved cases."""
    target_cluster = db.query(IssueCluster).filter(IssueCluster.id == cluster_id).first()
    if not target_cluster:
        raise HTTPException(status_code=404, detail="Target cluster not found.")

    target_dict = {
        "id": target_cluster.id,
        "representative_title": target_cluster.representative_title,
        "representative_description": target_cluster.representative_description
    }

    resolved_clusters = db.query(IssueCluster).filter(
        IssueCluster.status == "Resolved",
        IssueCluster.id != cluster_id
    ).all()

    resolved_dicts = [
        {
            "id": rc.id,
            "representative_title": rc.representative_title,
            "representative_description": rc.representative_description,
            "category_name": rc.reports[0].category.name if rc.reports and rc.reports[0].category else "General",
            "resolution_notes": f"Applied standard repair protocol for '{rc.representative_title}'."
        }
        for rc in resolved_clusters
    ]

    generated = generate_resolution_recommendations(target_dict, resolved_dicts)

    out_list = []
    for g in generated:
        rec = ResolutionRecommendation(
            target_cluster_id=g["target_cluster_id"],
            historical_cluster_id=g["historical_cluster_id"],
            similarity_score=g["similarity_score"],
            recommendation_reason=g["recommendation_reason"],
            recorded_action=g["recorded_action"]
        )
        db.add(rec)
        db.flush()
        out = RecommendationOut.model_validate(rec)
        out.historical_title = g["historical_title"]
        out_list.append(out)

    db.commit()
    return out_list


@router.post("/recommendations/{recommendation_id}/feedback", response_model=RecommendationOut)
def record_recommendation_feedback(
    recommendation_id: str,
    feedback_in: RecommendationFeedbackRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_administrator)
):
    """Record administrator feedback (Useful / Not Useful) for recommendation quality tracking."""
    rec = db.query(ResolutionRecommendation).filter(ResolutionRecommendation.id == recommendation_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation record not found.")

    rec.feedback = feedback_in.feedback
    rec.feedback_by = admin.id
    db.commit()
    db.refresh(rec)

    out = RecommendationOut.model_validate(rec)
    return out

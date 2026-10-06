from typing import List, Dict, Any
from app.core.config import settings


def screen_prediction_uncertainty(
    predictions: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Filter predictions (matches, cluster recommendations, hypotheses) for cases with:
    - Similarity scores near decision boundary (0.55 - 0.85)
    - Short/ambiguous text descriptions (< 30 chars)
    - Conflicting category signals
    - High-uncertainty root-cause hypotheses
    """
    flagged_queue = []

    for pred in predictions:
        reason = None
        score = pred.get("similarity_score") or pred.get("score_or_strength") or 0.0
        desc = pred.get("description") or pred.get("hypothesis_text") or ""

        # Rule 1: Score near threshold boundary
        if settings.SIMILARITY_THRESHOLD_UNCERTAIN_LOW <= score <= settings.SIMILARITY_THRESHOLD_UNCERTAIN_HIGH:
            reason = f"Similarity score ({round(score, 3)}) is near decision threshold band ({settings.SIMILARITY_THRESHOLD_UNCERTAIN_LOW}-{settings.SIMILARITY_THRESHOLD_UNCERTAIN_HIGH})."

        # Rule 2: Short text description
        elif len(desc) < 30:
            reason = "Report description is short or ambiguous, requiring human verification."

        # Rule 3: Explicit high uncertainty label
        elif pred.get("uncertainty_label") == "High Uncertainty":
            reason = "Root-cause hypothesis has low statistical evidence strength."

        if reason:
            flagged_queue.append({
                "item_id": pred.get("id") or pred.get("report_id") or pred.get("source_cluster_id"),
                "prediction_type": pred.get("prediction_type", "Match Suggestion"),
                "score_or_indicator": round(score, 3),
                "title": pred.get("title") or pred.get("source_cluster_title") or "Item",
                "description": desc,
                "reason_flagged": reason,
                "recommended_action": "Administrator manual decision required.",
                "status": "Pending Review"
            })

    return flagged_queue

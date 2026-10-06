from datetime import datetime, timezone
from typing import Dict, Any, Tuple, Optional
from app.core.config import settings


def calculate_transparent_priority_score(
    impact_rating: int,        # 1-10
    urgency_rating: int,       # 1-10
    recurrence_count: int,     # Number of confirmed recurrences
    report_count: int,         # Total reports in cluster
    created_at: datetime,      # Cluster/Report creation date
    weights: Optional[Dict[str, float]] = None
) -> Tuple[float, Dict[str, float], Dict[str, float], str]:
    """
    Calculate explainable priority score $P = w_I \cdot I + w_U \cdot U + w_R \cdot R + w_A \cdot A$.
    Returns:
    (total_score, component_scores, weights_used, human_readable_explanation)
    """
    if weights is None:
        weights = {
            "impact": settings.PRIORITY_WEIGHT_IMPACT,
            "urgency": settings.PRIORITY_WEIGHT_URGENCY,
            "recurrence": settings.PRIORITY_WEIGHT_RECURRENCE,
            "age": settings.PRIORITY_WEIGHT_AGE
        }

    # 1. Impact Component (1-10 -> 0-100)
    norm_impact = float(max(1, min(10, impact_rating))) * 10.0

    # 2. Urgency Component (1-10 -> 0-100)
    norm_urgency = float(max(1, min(10, urgency_rating))) * 10.0

    # 3. Recurrence & Volume Component (0-100)
    # Recurrence events add 25 pts each, additional duplicate reports add 15 pts each
    norm_recurrence = min(100.0, float(recurrence_count * 25.0 + max(0, report_count - 1) * 15.0))

    # 4. Age / Waiting Time Component (0-100)
    now = datetime.now(timezone.utc)
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=timezone.utc)
    days_unresolved = max(0, (now - created_at).days)
    norm_age = min(100.0, float(days_unresolved * 5.0))  # Saturates at 20 days

    # Total Priority Score
    total_score = (
        weights["impact"] * norm_impact +
        weights["urgency"] * norm_urgency +
        weights["recurrence"] * norm_recurrence +
        weights["age"] * norm_age
    )
    total_score = round(total_score, 2)

    components = {
        "impact": round(norm_impact, 2),
        "urgency": round(norm_urgency, 2),
        "recurrence": round(norm_recurrence, 2),
        "age": round(norm_age, 2)
    }

    # Human-Readable Transparent Explanation Generator
    explanation_parts = []
    if norm_impact >= 70:
        explanation_parts.append(f"high reported impact ({int(norm_impact)}/100)")
    else:
        explanation_parts.append(f"moderate impact ({int(norm_impact)}/100)")

    if norm_urgency >= 70:
        explanation_parts.append(f"high citizen urgency ({int(norm_urgency)}/100)")

    if recurrence_count > 0:
        explanation_parts.append(f"confirmed issue recurrence history ({recurrence_count} event(s), score {int(norm_recurrence)})")
    elif report_count > 1:
        explanation_parts.append(f"multiple citizen reports ({report_count} complaints)")

    if days_unresolved >= 7:
        explanation_parts.append(f"extended waiting time of {days_unresolved} days")

    human_explanation = f"Priority score is {total_score}/100 based on " + ", ".join(explanation_parts) + "."

    return total_score, components, weights, human_explanation

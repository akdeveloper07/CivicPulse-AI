from typing import List, Dict, Any, Optional
from datetime import datetime
from app.ai.embeddings import compute_cosine_similarity, generate_embedding


# Pre-defined domain correlation heuristics for evidence-backed hypothesis discovery
KNOWN_CORRELATIONS = [
    ("Blocked Drains & Drainage", "Waterlogging & Flooding", "Blocked drainage networks frequently lead to surface waterlogging during rain events."),
    ("Water Supply & Leakage", "Road Damage & Potholes", "Underground pipe leakages weaken road sub-bases, leading to pavement erosion and potholes."),
    ("Garbage Accumulation", "Blocked Drains & Drainage", "Uncollected solid waste washes into storm drains, causing blockage and overflows."),
    ("Streetlight Failure", "Public Safety & Vandalism", "Unlit public spaces show higher rates of public infrastructure vandalism and safety hazards.")
]


def discover_root_cause_hypotheses(
    clusters: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Generate evidence-backed root-cause hypotheses between issue clusters.
    Uses category associations, semantic closeness, and location/temporal co-occurrence.
    Includes explicit uncertainty labels (High, Moderate, Low).
    """
    hypotheses = []

    if len(clusters) < 2:
        return hypotheses

    for i in range(len(clusters)):
        for j in range(i + 1, len(clusters)):
            c1 = clusters[i]
            c2 = clusters[j]

            cat1 = c1.get("category_name", "").lower()
            cat2 = c2.get("category_name", "").lower()
            area1 = c1.get("approximate_area", "")
            area2 = c2.get("approximate_area", "")

            # Check for domain heuristic correlation
            domain_match = None
            for pattern_a, pattern_b, explanation in KNOWN_CORRELATIONS:
                if (pattern_a.lower() in cat1 or pattern_b.lower() in cat1) and \
                   (pattern_a.lower() in cat2 or pattern_b.lower() in cat2) and \
                   cat1 != cat2:
                    domain_match = explanation
                    break

            # Calculate area match
            same_area = bool(area1 and area2 and area1.strip().lower() == area2.strip().lower())

            # Semantic similarity between cluster representatives
            vec1 = c1.get("embedding")
            vec2 = c2.get("embedding")
            if not vec1:
                vec1, _ = generate_embedding(f"{c1.get('representative_title')}. {c1.get('representative_description')}")
            if not vec2:
                vec2, _ = generate_embedding(f"{c2.get('representative_title')}. {c2.get('representative_description')}")

            sim = compute_cosine_similarity(vec1, vec2)

            if domain_match or same_area or sim > 0.45:
                # Calculate evidence strength
                strength = 0.4
                if domain_match:
                    strength += 0.35
                if same_area:
                    strength += 0.2
                if sim > 0.5:
                    strength += sim * 0.15

                strength = min(0.95, round(strength, 2))

                # Assign explicit uncertainty label
                if strength >= 0.75:
                    uncertainty = "Low Uncertainty"
                elif strength >= 0.55:
                    uncertainty = "Moderate Uncertainty"
                else:
                    uncertainty = "High Uncertainty"

                hypothesis_text = (
                    f"Possible root-cause link: '{c1.get('representative_title')}' may be contributing to "
                    f"'{c2.get('representative_title')}'. {domain_match or 'Statistical co-occurrence detected.'}"
                )

                evidence_json = {
                    "domain_heuristic": domain_match,
                    "same_area": same_area,
                    "area_name": area1 if same_area else None,
                    "semantic_similarity": round(sim, 3),
                    "cluster1_reports": c1.get("report_count", 1),
                    "cluster2_reports": c2.get("report_count", 1)
                }

                hypotheses.append({
                    "source_cluster_id": c1.get("id"),
                    "related_cluster_id": c2.get("id"),
                    "source_cluster_title": c1.get("representative_title"),
                    "related_cluster_title": c2.get("representative_title"),
                    "hypothesis_text": hypothesis_text,
                    "evidence_json": evidence_json,
                    "score_or_strength": strength,
                    "uncertainty_label": uncertainty,
                    "review_status": "Proposed"
                })

    hypotheses.sort(key=lambda x: x["score_or_strength"], reverse=True)
    return hypotheses

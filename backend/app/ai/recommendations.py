from typing import List, Dict, Any
from app.ai.embeddings import generate_embedding, compute_cosine_similarity


def generate_resolution_recommendations(
    target_cluster: Dict[str, Any],
    historical_resolved_clusters: List[Dict[str, Any]],
    top_k: int = 3
) -> List[Dict[str, Any]]:
    """
    Search historical resolved clusters for semantically similar past cases.
    Suggest recorded resolution steps and reported outcomes with explicit confidence levels.
    """
    if not historical_resolved_clusters:
        return []

    target_text = f"{target_cluster.get('representative_title', '')}. {target_cluster.get('representative_description', '')}"
    target_vec = target_cluster.get('embedding')
    if not target_vec:
        target_vec, _ = generate_embedding(target_text)

    recommendations = []
    for hist in historical_resolved_clusters:
        hist_text = f"{hist.get('representative_title', '')}. {hist.get('representative_description', '')}"
        hist_vec = hist.get('embedding')
        if not hist_vec:
            hist_vec, _ = generate_embedding(hist_text)

        sim = compute_cosine_similarity(target_vec, hist_vec)

        if sim >= 0.50:  # Minimum relevance threshold
            recorded_action = hist.get("resolution_notes") or hist.get("recorded_action") or "Standard municipal repair protocol applied."
            recommendations.append({
                "target_cluster_id": target_cluster.get("id"),
                "historical_cluster_id": hist.get("id"),
                "historical_title": hist.get("representative_title"),
                "similarity_score": round(sim, 4),
                "recorded_action": recorded_action,
                "recommendation_reason": f"Semantically similar resolved case ({round(sim*100, 1)}% match) in category '{hist.get('category_name', 'General')}'.",
                "feedback": None
            })

    recommendations.sort(key=lambda x: x["similarity_score"], reverse=True)
    return recommendations[:top_k]

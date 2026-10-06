from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from app.ai.embeddings import generate_embedding, compute_cosine_similarity
from app.core.config import settings


def recommend_cluster_assignment(
    report_title: str,
    report_description: str,
    existing_clusters: List[Dict[str, Any]],
    report_embedding: Optional[List[float]] = None
) -> Tuple[Optional[str], float, str]:
    """
    Incremental cluster workflow:
    Compare report against existing cluster representative descriptions.
    Returns (cluster_id_or_none, max_similarity_score, explanation_text).
    """
    if not existing_clusters:
        return None, 0.0, "No existing issue clusters to compare against."

    full_text = f"{report_title}. {report_description}"
    if not report_embedding:
        report_embedding, _ = generate_embedding(full_text)

    best_cluster_id = None
    max_sim = 0.0
    best_cluster_title = ""

    for cluster in existing_clusters:
        cluster_text = f"{cluster.get('representative_title', '')}. {cluster.get('representative_description', '')}"
        cluster_vec = cluster.get('embedding')
        if not cluster_vec:
            cluster_vec, _ = generate_embedding(cluster_text)

        sim = compute_cosine_similarity(report_embedding, cluster_vec)
        if sim > max_sim:
            max_sim = sim
            best_cluster_id = cluster.get("id")
            best_cluster_title = cluster.get("representative_title", "")

    if max_sim >= settings.SIMILARITY_THRESHOLD_RELATED:
        explanation = f"Matches cluster '{best_cluster_title}' with semantic similarity {round(max_sim, 3)}."
        return best_cluster_id, round(max_sim, 4), explanation

    return None, round(max_sim, 4), "No existing cluster met similarity threshold for automatic assignment."


def run_agglomerative_clustering(
    embeddings_matrix: np.ndarray,
    distance_threshold: float = 0.35
) -> List[int]:
    """
    Offline clustering tool using Scikit-Learn AgglomerativeClustering.
    Returns array of cluster labels.
    """
    if len(embeddings_matrix) < 2:
        return [0] * len(embeddings_matrix)

    from sklearn.cluster import AgglomerativeClustering

    clustering = AgglomerativeClustering(
        n_clusters=None,
        distance_threshold=distance_threshold,
        metric='cosine',
        linkage='average'
    )
    labels = clustering.fit_predict(embeddings_matrix)
    return labels.tolist()

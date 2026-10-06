from typing import List, Dict, Any, Optional
from app.ai.embeddings import generate_embedding, compute_cosine_similarity, normalize_text
from app.core.config import settings


def extract_matched_evidence(text1: str, text2: str) -> str:
    """Extract key overlapping terms/words between two reports for human explainability."""
    words1 = set(normalize_text(text1).split())
    words2 = set(normalize_text(text2).split())
    stop_words = {"the", "a", "an", "is", "in", "at", "of", "and", "or", "to", "for", "on", "with", "this", "that", "there", "has", "been", "reported", "issue", "problem", "near", "area"}
    
    overlap = (words1 & words2) - stop_words
    if overlap:
        terms = list(overlap)[:5]
        return f"Overlapping key terms: {', '.join(terms)}"
    return "High semantic contextual overlap across issue description."


def rank_candidate_matches(
    source_title: str,
    source_description: str,
    candidate_reports: List[Dict[str, Any]],
    source_embedding: Optional[List[float]] = None
) -> List[Dict[str, Any]]:
    """
    Rank candidate reports against a source report description.
    Returns sorted list of matches with similarity score, evidence, and uncertainty label.
    """
    full_source_text = f"{source_title}. {source_description}"
    if not source_embedding:
        source_embedding, _ = generate_embedding(full_source_text)

    ranked_matches = []
    for cand in candidate_reports:
        cand_text = f"{cand.get('title', '')}. {cand.get('description', '')}"
        cand_vec = cand.get('embedding')
        if not cand_vec:
            cand_vec, _ = generate_embedding(cand_text)

        sim_score = compute_cosine_similarity(source_embedding, cand_vec)
        
        # Determine confidence level & recommendation state
        if sim_score >= settings.SIMILARITY_THRESHOLD_DUPLICATE:
            confidence = "High"
            recommendation = "Suggested Duplicate"
        elif sim_score >= settings.SIMILARITY_THRESHOLD_RELATED:
            confidence = "Moderate"
            recommendation = "Suggested Related"
        elif sim_score >= settings.SIMILARITY_THRESHOLD_UNCERTAIN_LOW:
            confidence = "Low (Uncertain)"
            recommendation = "Requires Human Review"
        else:
            continue  # Below threshold

        evidence = extract_matched_evidence(full_source_text, cand_text)

        ranked_matches.append({
            "report_id": cand.get("id"),
            "title": cand.get("title"),
            "description": cand.get("description"),
            "category_name": cand.get("category_name", "General"),
            "similarity_score": round(sim_score, 4),
            "confidence_level": confidence,
            "recommendation": recommendation,
            "matched_evidence": evidence,
            "status": cand.get("status", "Submitted"),
            "created_at": cand.get("created_at")
        })

    # Sort descending by similarity score
    ranked_matches.sort(key=lambda x: x["similarity_score"], reverse=True)
    return ranked_matches

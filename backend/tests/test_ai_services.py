from app.ai.embeddings import generate_embedding, compute_cosine_similarity, normalize_text
from app.ai.priority import calculate_transparent_priority_score
from datetime import datetime, timezone


def test_text_normalization_and_embedding():
    raw_text = "Please call 9876543210 or email test@example.com regarding the pothole!"
    norm = normalize_text(raw_text)
    assert "[PHONE]" in norm
    assert "[EMAIL]" in norm
    assert "pothole" in norm

    vec, version = generate_embedding(raw_text)
    assert len(vec) == 384
    assert isinstance(vec, list)


def test_cosine_similarity():
    vec1, _ = generate_embedding("Pothole on MG Road near bus station")
    vec2, _ = generate_embedding("Deep crater on MG Road bus station tarmac")
    vec3, _ = generate_embedding("Broken streetlight in public park")

    sim_similar = compute_cosine_similarity(vec1, vec2)
    sim_different = compute_cosine_similarity(vec1, vec3)

    assert sim_similar > sim_different
    assert sim_similar > 0.60


def test_transparent_priority_scoring():
    score, comps, weights, explanation = calculate_transparent_priority_score(
        impact_rating=9,
        urgency_rating=8,
        recurrence_count=2,
        report_count=3,
        created_at=datetime.now(timezone.utc)
    )

    assert 0 <= score <= 100
    assert comps["impact"] == 90.0
    assert comps["urgency"] == 80.0
    assert "recurrence" in explanation.lower() or "priority" in explanation.lower()

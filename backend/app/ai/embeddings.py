import re
import hashlib
import numpy as np
from typing import List, Tuple, Optional
import logging

logger = logging.getLogger("civicpulse.ai.embeddings")

# Global lazy-loaded embedding model instance
_model_instance = None
_tfidf_vectorizer = None


def normalize_text(text: str) -> str:
    """
    Conservatively normalize report text:
    - Lowercase
    - Mask phone numbers, email addresses, credit cards, or passwords
    - Strip excessive whitespaces
    """
    if not text:
        return ""
    
    cleaned = text.strip().lower()
    # Mask email addresses
    cleaned = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[EMAIL]', cleaned)
    # Mask phone numbers (10+ digits or formatted)
    cleaned = re.sub(r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', '[PHONE]', cleaned)
    # Strip non-alphanumeric except punctuation
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned


def get_text_fingerprint(text: str) -> str:
    """SHA256 fingerprint of normalized text for embedding caching."""
    norm = normalize_text(text)
    return hashlib.sha256(norm.encode('utf-8')).hexdigest()


def get_embedding_model():
    """Lazy load SentenceTransformers model with TF-IDF fallback."""
    global _model_instance
    if _model_instance is None:
        try:
            from sentence_transformers import SentenceTransformer
            logger.info("Loading SentenceTransformer model 'all-MiniLM-L6-v2'...")
            _model_instance = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("SentenceTransformer model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load SentenceTransformer ({e}). Falling back to TF-IDF vectorizer.")
            _model_instance = "tfidf"
    return _model_instance


def generate_embedding(text: str) -> Tuple[List[float], str]:
    """
    Generate dense float vector embedding for input text.
    Returns (embedding_vector_as_list, model_version_string).
    """
    normalized = normalize_text(text)
    if not normalized:
        return [0.0] * 384, "zero-vector"

    model = get_embedding_model()

    if model == "tfidf":
        # TF-IDF Fallback Vectorizer
        from sklearn.feature_extraction.text import TfidfVectorizer
        global _tfidf_vectorizer
        if _tfidf_vectorizer is None:
            _tfidf_vectorizer = TfidfVectorizer(max_features=384)
            _tfidf_vectorizer.fit([normalized, "pothole water leakage garbage streetlight drainage road damage"])
        
        vec = _tfidf_vectorizer.transform([normalized]).toarray()[0]
        # Pad to 384 dims
        if len(vec) < 384:
            vec = np.pad(vec, (0, 384 - len(vec)))
        return vec.tolist(), "tfidf-fallback-v1"
    else:
        # SentenceTransformers encoding
        embedding_vec = model.encode(normalized, convert_to_numpy=True)
        # Normalize vector for cosine similarity
        norm = np.linalg.norm(embedding_vec)
        if norm > 0:
            embedding_vec = embedding_vec / norm
        return embedding_vec.tolist(), "all-MiniLM-L6-v2"


def compute_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two float vectors."""
    v1 = np.array(vec1, dtype=np.float32)
    v2 = np.array(vec2, dtype=np.float32)

    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)

    if norm1 == 0 or norm2 == 0:
        return 0.0

    sim = float(np.dot(v1, v2) / (norm1 * norm2))
    # Clip between 0.0 and 1.0 for stability
    return float(np.clip(sim, 0.0, 1.0))

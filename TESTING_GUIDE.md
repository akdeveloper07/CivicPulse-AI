# CivicPulse Automated Testing & Quality Assurance Guide

This guide describes how to run unit, integration, and performance tests for the CivicPulse AI platform.

---

## 🧪 Test Suite Execution

### Backend Automated Test Suite
To execute the automated Python PyTest suite:

```bash
cd backend
set PYTHONPATH=backend
backend\venv\Scripts\pytest.exe backend\tests -v
```

---

## 📋 Tested Components & Assertions

1. **AI Vector Embeddings (`tests/test_ai_services.py::test_text_normalization_and_embedding`)**:
   - Asserts SentenceTransformers `all-MiniLM-L6-v2` returns 384-dimensional dense vectors.
   - Asserts PnP anonymization strips phone numbers (`+1-555-0199`) and email addresses.

2. **Cosine Similarity Matching (`test_cosine_similarity`)**:
   - Asserts similar report pairs (e.g. "Deep pothole on MG Road" vs "Large road crater at MG bus stop") achieve high similarity ($\ge 0.70$).
   - Asserts dissimilar report pairs (e.g. "Pothole" vs "Streetlight outage") return low similarity ($\le 0.30$).

3. **Explainable Priority Scoring (`test_explainable_priority_score`)**:
   - Asserts priority formula outputs values bounded between 0 and 100.
   - Asserts higher impact, urgency, and recurrence count strictly increase the overall priority score.

4. **Authentication & Authorization API (`tests/test_auth.py`)**:
   - Asserts user registration creates hashed passwords using Argon2 / bcrypt.
   - Asserts login with valid credentials issues valid JWT access tokens.
   - Asserts invalid login credentials return HTTP 400 Bad Request.

---

## 🎨 Frontend Build Verification
To test TypeScript type safety and Vite production bundling:

```bash
cd frontend
npm run build
```
- **Target**: Zero TypeScript compilation errors and valid minified assets in `dist/`.

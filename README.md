# CivicPulse AI — Explainable Civic Issue Intelligence & Resolution Platform

**CivicPulse** is a full-stack, production-ready explainable AI platform designed for municipal civic issue intelligence, automated duplicate screening, transparent priority ranking, root-cause hypothesis discovery, and resolution tracking.

Built as an academic final-year software engineering project, CivicPulse addresses critical gaps in smart city governance by replacing black-box AI algorithms with explicit mathematical formulas, human-in-the-loop review queues, and complete audit logging.

---

## 🌟 Key Technical Features

### 1. Semantic Duplicate Screening & Pre-Check
- **SentenceTransformers Embedding Engine**: Utilizes `all-MiniLM-L6-v2` to generate 384-dimensional vector embeddings for citizen reports.
- **Pre-Submission Screening Modal**: Real-time pre-check screens citizen submissions against existing active complaints ($\ge 0.65$ similarity) before database persistence to prevent duplicate filings.
- **Side-by-Side Admin Review Queue**: Municipal administrators can review candidate duplicate pairs with matched evidence snippets, uncertainty badges, and record decisions with mandatory reason audit logs.

### 2. Transparent Explainable Priority Scoring
- **Component-Based Formula**: Replaces uninterpretable machine learning priorities with an explicit, human-auditable mathematical formula:
  $$P = w_I \cdot I + w_U \cdot U + w_R \cdot R + w_A \cdot A$$
  - $I$: Impact / Hazard Severity Score (weight $w_I = 0.35$)
  - $U$: Urgency Score (weight $w_U = 0.25$)
  - $R$: Recurrence History Bonus (weight $w_R = 0.25$)
  - $A$: Unresolved Aging Factor (weight $w_A = 0.15$)
- **Score Breakdown Modal**: Clicking any cluster's priority score opens an interactive visual breakdown of individual components and human-readable audit explanations.

### 3. Root-Cause Hypothesis Discovery
- **Cross-Category Correlation**: Identifies systemic infrastructure failures between categories (e.g. *Blocked Storm Drains* causing *Waterlogging* or *Underground Pipe Leaks* weakening *Road Pavements*).
- **Domain Heuristics & Uncertainty Scores**: Combines spatial/temporal co-occurrence with domain heuristics, tagging hypotheses with explicit uncertainty levels (*Low*, *Moderate*, *High*).

### 4. Historical Resolution Recommendations
- **Case-Based Reasoning**: Searches historical resolved clusters using cosine similarity to recommend proven resolution action steps to field engineers.
- **Feedback Loop**: Engineers provide feedback (*Useful* / *Not Useful*) to continuously refine ranking weights.

### 5. Predictive Time-Series Forecasting
- **Volume Forecasting**: Weighted moving average model projecting incoming issue counts across 1–8 week horizons.
- **Confidence Intervals & Evaluation**: Includes 95% upper and lower prediction bounds and reports holdout Mean Absolute Error (MAE) benchmarks.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts |
| **Backend API** | Python 3.12, FastAPI, Pydantic V2, Starlette |
| **AI / ML Layer** | PyTorch, SentenceTransformers (`all-MiniLM-L6-v2`), Scikit-Learn |
| **Database** | SQLite (`civicpulse_dev.db`) with PostgreSQL compatibility via SQLAlchemy & Alembic |
| **Testing** | PyTest with FastAPI TestClient and isolated memory database fixtures |

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+)

### 1. Backend Setup & Seed Data
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (if not created)
python -m venv venv
venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Run database migrations & synthetic data seeding
python -m app.db.seed

# Start FastAPI development server
python -m uvicorn app.main:app --reload --port 8000
```
- Swagger API Docs will be available at: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
- Frontend Web App will be available at: `http://localhost:3000`

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@civicpulse.org` | `CitizenPass123!` | Citizen Dashboard, Report Submission, Timeline View |
| **Administrator** | `admin@civicpulse.org` | `AdminPass123!` | AI Match Queue, Cluster Management, Root Cause & Recommendations |
| **System Admin** | `sysadmin@civicpulse.org` | `SysAdminPass123!` | RBAC Role Management, Audit Logs, Offline AI Model Benchmarks |

---

## 🧪 Running Automated Unit & Integration Tests

```bash
cd backend
set PYTHONPATH=backend
venv\Scripts\pytest.exe backend\tests
```
- **Test Results**: 100% Pass Rate across AI embeddings, transparent priority scoring formulas, text privacy masking, and FastAPI authentication endpoints.

---

## 📄 License & Academic Credits
Developed for the Academic Final-Year Software Engineering Capstone Project.

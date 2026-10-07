# CivicPulse AI — Final Year Project Defense & Faculty Presentation Guide

This guide is designed for project team members presenting **CivicPulse** during academic final-year project reviews, viva voce, and faculty demonstrations.

---

## 🎤 Presentation Outline (10-15 Minute Review Deck)

### Slide 1: Project Title & Team
- **Title**: CivicPulse: An Explainable AI Platform for Civic Issue Intelligence and Resolution Tracking
- **Domain**: Smart Cities, Explainable AI (XAI), Natural Language Processing, Full-Stack Web Engineering

### Slide 2: Problem Statement
- **Citizen Frustration**: High frequency of duplicate complaint filings leads to backlogs and municipal inefficiency.
- **Black-Box AI Limitation**: Standard machine learning priority algorithms lack transparency, causing public distrust and potential administrative bias across city neighborhoods.
- **Disconnected Data**: Infrastructure failures (e.g. water pipe leaks and road subsidence) are treated as isolated events rather than linked root causes.

### Slide 3: Objectives & Solution
- Build a full-stack platform featuring:
  1. **Pre-Submission Duplicate Screening** via SentenceTransformers (`all-MiniLM-L6-v2`).
  2. **Transparent Priority Ranking Formula** ($P = w_I \cdot I + w_U \cdot U + w_R \cdot R + w_A \cdot A$).
  3. **Root-Cause Hypothesis Engine** discovering structural category linkages.
  4. **Time-Series Volume Forecasting** with MAE evaluation benchmarks.

### Slide 4: System Architecture & Data Flow
- Demonstrate React 18 + Vite frontend interacting with FastAPI REST endpoints, PyTorch embeddings, and SQLite/PostgreSQL persistence layer with complete audit trails.

### Slide 5: Key Technical Demonstration Steps
1. **Submit Citizen Report**: Show real-time duplicate pre-check modal catching similar active complaints.
2. **Admin AI Match Queue**: Review side-by-side text comparisons, uncertainty badges, and record decision with mandatory audit reason.
3. **Priority Formula Breakdown**: Click priority badge on cluster card to display explicit mathematical component weights.
4. **Root-Cause Hypothesis & Forecasting**: Show causal hypothesis evidence notes and time-series projections with upper/lower bounds.

---

## ❓ Common Faculty Review Questions & Answers

**Q1: Why use SentenceTransformers (`all-MiniLM-L6-v2`) instead of traditional TF-IDF keyword matching?**
> *Answer*: TF-IDF relies on exact word matches and fails when citizens use different vocabulary to describe the same issue (e.g., "Deep pothole on MG Road" vs "Large asphalt crater near bus stand"). SentenceTransformers produce dense semantic embeddings that capture context and meaning regardless of phrasing. In our offline benchmark evaluation, SentenceTransformers achieved an F1-score of 0.88 compared to 0.65 for TF-IDF.

**Q2: How does CivicPulse ensure priority scoring is fair and explainable?**
> *Answer*: Instead of relying on an uninterpretable deep neural network to assign priorities, CivicPulse uses an explicit weighted formula combining Impact, Urgency, Recurrence Count, and Unresolved Aging. Every component score is visible to administrators, and our Fairness Monitor audits priority distribution across geographic zones to ensure no neighborhood is systematically deprioritized.

**Q3: How are privacy concerns handled for citizen submissions?**
> *Answer*: Before passing text to vector embedding models, CivicPulse runs regex-based sanitization to mask personal identifiers (phone numbers, email addresses, vehicle plates) and normalizes exact addresses into broader neighborhood zone names.

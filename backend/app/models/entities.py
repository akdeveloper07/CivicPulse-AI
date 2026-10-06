import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import (
    String, Text, Float, Integer, Boolean, DateTime, ForeignKey, JSON, Enum as SQLEnum, Index
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="citizen", nullable=False)  # citizen, administrator, system_admin
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    reports: Mapped[List["Report"]] = relationship("Report", back_populates="submitter")


class IssueCategory(Base):
    __tablename__ = "issue_categories"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    reports: Mapped[List["Report"]] = relationship("Report", back_populates="category")


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    submitter_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    category_id: Mapped[str] = mapped_column(String(36), ForeignKey("issue_categories.id"), nullable=False)
    cluster_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("issue_clusters.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    impact: Mapped[int] = mapped_column(Integer, default=5, nullable=False)  # 1-10
    urgency: Mapped[int] = mapped_column(Integer, default=5, nullable=False)  # 1-10
    approximate_area: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Submitted", nullable=False)  # Submitted, Under Review, In Progress, Resolved, Rejected
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    submitter: Mapped["User"] = relationship("User", back_populates="reports")
    category: Mapped["IssueCategory"] = relationship("IssueCategory", back_populates="reports")
    cluster: Mapped[Optional["IssueCluster"]] = relationship("IssueCluster", back_populates="reports")
    embedding: Mapped[Optional["ReportEmbedding"]] = relationship("ReportEmbedding", back_populates="report", uselist=False)


class ReportEmbedding(Base):
    __tablename__ = "report_embeddings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    report_id: Mapped[str] = mapped_column(String(36), ForeignKey("reports.id"), unique=True, nullable=False)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    embedding_json: Mapped[dict] = mapped_column(JSON, nullable=False)  # Store vector list as JSON array for DB compatibility
    text_fingerprint: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    report: Mapped["Report"] = relationship("Report", back_populates="embedding")


class IssueCluster(Base):
    __tablename__ = "issue_clusters"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    representative_title: Mapped[str] = mapped_column(String(200), nullable=False)
    representative_description: Mapped[str] = mapped_column(Text, nullable=False)
    category_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("issue_categories.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Under Review", nullable=False)
    current_priority_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    recurrence_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    reports: Mapped[List["Report"]] = relationship("Report", back_populates="cluster")


class ReportMatch(Base):
    __tablename__ = "report_matches"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    source_report_id: Mapped[str] = mapped_column(String(36), ForeignKey("reports.id"), nullable=False)
    candidate_report_id: Mapped[str] = mapped_column(String(36), ForeignKey("reports.id"), nullable=False)
    similarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    match_type: Mapped[str] = mapped_column(String(50), default="semantic", nullable=False)
    decision: Mapped[str] = mapped_column(String(50), default="Suggested", nullable=False)  # Suggested, Confirmed related, Confirmed duplicate, Rejected, Deferred
    decision_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    reviewer_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    model_version: Mapped[str] = mapped_column(String(50), default="1.0.0", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class ClusterMembershipHistory(Base):
    __tablename__ = "cluster_membership_history"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    report_id: Mapped[str] = mapped_column(String(36), ForeignKey("reports.id"), nullable=False)
    cluster_id: Mapped[str] = mapped_column(String(36), ForeignKey("issue_clusters.id"), nullable=False)
    action: Mapped[str] = mapped_column(String(50), nullable=False)  # assigned, merged, split, removed
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    actor_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class StatusHistory(Base):
    __tablename__ = "status_history"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    report_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("reports.id"), nullable=True)
    cluster_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("issue_clusters.id"), nullable=True)
    previous_status: Mapped[str] = mapped_column(String(50), nullable=False)
    new_status: Mapped[str] = mapped_column(String(50), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    changed_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class RecurrenceEvent(Base):
    __tablename__ = "recurrence_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    historical_cluster_id: Mapped[str] = mapped_column(String(36), ForeignKey("issue_clusters.id"), nullable=False)
    new_report_id: Mapped[str] = mapped_column(String(36), ForeignKey("reports.id"), nullable=False)
    similarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    evidence: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="Pending Review", nullable=False)  # Pending Review, Confirmed Recurrence, Rejected, Reopened
    reviewed_by: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    review_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class PrioritySnapshot(Base):
    __tablename__ = "priority_snapshots"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    cluster_id: Mapped[str] = mapped_column(String(36), ForeignKey("issue_clusters.id"), nullable=False)
    total_score: Mapped[float] = mapped_column(Float, nullable=False)
    impact_component: Mapped[float] = mapped_column(Float, nullable=False)
    urgency_component: Mapped[float] = mapped_column(Float, nullable=False)
    recurrence_component: Mapped[float] = mapped_column(Float, nullable=False)
    age_component: Mapped[float] = mapped_column(Float, nullable=False)
    weights_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    formula_version: Mapped[str] = mapped_column(String(20), default="1.0.0", nullable=False)
    explanation_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class RootCauseHypothesis(Base):
    __tablename__ = "root_cause_hypotheses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    source_cluster_id: Mapped[str] = mapped_column(String(36), ForeignKey("issue_clusters.id"), nullable=False)
    related_cluster_id: Mapped[str] = mapped_column(String(36), ForeignKey("issue_clusters.id"), nullable=False)
    hypothesis_text: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    score_or_strength: Mapped[float] = mapped_column(Float, nullable=False)
    uncertainty_label: Mapped[str] = mapped_column(String(50), default="Moderate", nullable=False)  # High, Moderate, Low
    review_status: Mapped[str] = mapped_column(String(50), default="Proposed", nullable=False)  # Proposed, Confirmed, Rejected, Deferred
    reviewer_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    review_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class ResolutionRecommendation(Base):
    __tablename__ = "resolution_recommendations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    target_cluster_id: Mapped[str] = mapped_column(String(36), ForeignKey("issue_clusters.id"), nullable=False)
    historical_cluster_id: Mapped[str] = mapped_column(String(36), ForeignKey("issue_clusters.id"), nullable=False)
    similarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    recommendation_reason: Mapped[str] = mapped_column(Text, nullable=False)
    recorded_action: Mapped[str] = mapped_column(Text, nullable=False)
    feedback: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Useful, Not Useful
    feedback_by: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class ResolutionEvidence(Base):
    __tablename__ = "resolution_evidence"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    cluster_id: Mapped[str] = mapped_column(String(36), ForeignKey("issue_clusters.id"), nullable=False)
    uploaded_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    evidence_type: Mapped[str] = mapped_column(String(50), default="image", nullable=False)  # image, document, note
    file_reference: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    actor_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_id: Mapped[str] = mapped_column(String(36), nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)


class ModelEvaluation(Base):
    __tablename__ = "model_evaluations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), nullable=False)
    evaluation_type: Mapped[str] = mapped_column(String(50), nullable=False)  # semantic_matching, clustering, recurrence, forecasting
    dataset_version: Mapped[str] = mapped_column(String(50), nullable=False)
    metrics_json: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

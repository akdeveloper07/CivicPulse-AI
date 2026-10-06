from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# --- AUTH SCHEMAS ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = "citizen"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime


# --- CATEGORY SCHEMAS ---
class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    description: Optional[str] = None
    is_active: bool
    created_at: datetime


# --- REPORT SCHEMAS ---
class ReportCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=15, max_length=3000)
    category_id: str
    impact: int = Field(5, ge=1, le=10)
    urgency: int = Field(5, ge=1, le=10)
    approximate_area: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None


class ReportUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    impact: Optional[int] = Field(None, ge=1, le=10)
    urgency: Optional[int] = Field(None, ge=1, le=10)
    approximate_area: Optional[str] = None


class SimilarityCheckRequest(BaseModel):
    title: str
    description: str
    category_id: Optional[str] = None


class ReportOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    submitter_id: str
    category_id: str
    cluster_id: Optional[str] = None
    title: str
    description: str
    impact: int
    urgency: int
    approximate_area: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None

    category: Optional[CategoryOut] = None
    submitter_name: Optional[str] = None


# --- MATCH SCHEMAS ---
class CandidateMatchOut(BaseModel):
    report_id: str
    title: str
    description: str
    category_name: str
    similarity_score: float
    confidence_level: str  # High, Moderate, Low
    matched_evidence: str
    status: str
    created_at: datetime


class MatchDecisionRequest(BaseModel):
    decision: str  # Confirmed duplicate, Confirmed related, Rejected, Deferred
    reason: str


class MatchOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    source_report_id: str
    candidate_report_id: str
    similarity_score: float
    match_type: str
    decision: str
    decision_reason: Optional[str] = None
    reviewer_id: Optional[str] = None
    model_version: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    source_report: Optional[ReportOut] = None
    candidate_report: Optional[ReportOut] = None


# --- CLUSTER SCHEMAS ---
class ClusterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    representative_title: str
    representative_description: str
    category_id: Optional[str] = None
    status: str
    current_priority_score: float
    recurrence_count: int
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    report_count: Optional[int] = 0
    category_name: Optional[str] = None


class ClusterStatusUpdate(BaseModel):
    status: str  # Under Review, In Progress, Resolved, Reopened
    reason: str


class ClusterMergeRequest(BaseModel):
    target_cluster_id: str
    source_cluster_id: str
    reason: str


class ClusterSplitRequest(BaseModel):
    report_ids: List[str]
    new_representative_title: str
    reason: str


# --- PRIORITY & RECURRENCE SCHEMAS ---
class PriorityExplanationOut(BaseModel):
    cluster_id: str
    total_priority_score: float
    components: Dict[str, float]  # impact, urgency, recurrence, age
    weights: Dict[str, float]
    human_explanation: str
    formula: str = "P = 0.35*Impact + 0.25*Urgency + 0.25*Recurrence + 0.15*Age"


class RecurrenceEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    historical_cluster_id: str
    new_report_id: str
    similarity_score: float
    evidence: str
    status: str
    reviewed_by: Optional[str] = None
    review_reason: Optional[str] = None
    created_at: datetime
    reviewed_at: Optional[datetime] = None

    historical_cluster_title: Optional[str] = None
    new_report_title: Optional[str] = None


class RecurrenceDecisionRequest(BaseModel):
    decision: str  # Confirmed Recurrence, Rejected, Reopened
    reason: str


# --- ROOT CAUSE SCHEMAS ---
class RootCauseHypothesisOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    source_cluster_id: str
    related_cluster_id: str
    hypothesis_text: str
    evidence_json: dict
    score_or_strength: float
    uncertainty_label: str
    review_status: str
    reviewer_id: Optional[str] = None
    review_reason: Optional[str] = None
    created_at: datetime

    source_cluster_title: Optional[str] = None
    related_cluster_title: Optional[str] = None


class RootCauseDecisionRequest(BaseModel):
    decision: str  # Confirmed, Rejected, Deferred
    reason: str


# --- RECOMMENDATION SCHEMAS ---
class RecommendationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    target_cluster_id: str
    historical_cluster_id: str
    similarity_score: float
    recommendation_reason: str
    recorded_action: str
    feedback: Optional[str] = None
    created_at: datetime

    historical_title: Optional[str] = None


class RecommendationFeedbackRequest(BaseModel):
    feedback: str  # Useful, Not Useful


# --- FORECASTING & ANALYTICS SCHEMAS ---
class ForecastDataPoint(BaseModel):
    period: str
    historical_count: Optional[int] = None
    forecast_count: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None


class ForecastResponse(BaseModel):
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    method: str
    mae: float
    historical_points: List[Dict[str, Any]]
    forecast_points: List[ForecastDataPoint]
    limitations_note: str


class AnalyticsSummary(BaseModel):
    total_reports: int
    open_reports: int
    resolved_reports: int
    total_clusters: int
    high_priority_clusters: int
    confirmed_recurrences: int
    pending_ai_reviews: int
    avg_resolution_days: float


class CategoryDistribution(BaseModel):
    category_name: str
    count: int
    percentage: float


class FairnessDistribution(BaseModel):
    area_or_category: str
    report_count: int
    avg_priority_score: float
    avg_resolution_hours: float
    uncertain_flag_count: int


# --- GOOGLE AUTH SCHEMAS ---
class GoogleLoginRequest(BaseModel):
    email: EmailStr
    name: str
    picture: Optional[str] = None
    google_id: Optional[str] = None


# --- GIS & HEATMAP SCHEMAS ---
class GISHeatmapPoint(BaseModel):
    id: str
    title: str
    category: str
    latitude: float
    longitude: float
    priority_score: float
    status: str
    ward: str
    created_at: str


class WardStat(BaseModel):
    ward_name: str
    total_issues: int
    resolved_issues: int
    avg_priority: float
    sla_health_pct: float


# --- DISPATCH SCHEMAS ---
class DispatchRouteOut(BaseModel):
    route_id: str
    ward: str
    crew_name: str
    crew_status: str
    issue_count: int
    estimated_hours: float
    fuel_saved_gallons: float
    priority_level: str
    cluster_ids: List[str]
    cluster_titles: List[str]


class DispatchAssignRequest(BaseModel):
    route_id: str
    crew_name: str
    notes: Optional[str] = None


# --- SLA RISK SCHEMAS ---
class SLARiskOut(BaseModel):
    cluster_id: str
    title: str
    category: str
    aging_days: float
    risk_level: str  # Critical, High, Moderate
    breach_probability: float
    department: str
    escalated: bool


# --- HERO & VERIFICATION SCHEMAS ---
class HeroStatsOut(BaseModel):
    karma_points: int
    badge_title: str
    verified_reports_count: int
    rank: int
    neighborhood_rank: str
    total_impact_contributions: int


class PhotoVerificationRequest(BaseModel):
    before_image_url: Optional[str] = None
    after_image_url: str
    notes: Optional[str] = None


class PhotoVerificationOut(BaseModel):
    report_id: str
    match_score: float
    is_verified: bool
    ai_confidence: str
    karma_awarded: int
    verification_summary: str


# --- EXECUTIVE REPORT SCHEMAS ---
class ExecutiveReportOut(BaseModel):
    total_duplicates_caught: int
    estimated_taxpayer_savings_usd: float
    overall_sla_compliance_pct: float
    highest_recurring_category: str
    ai_accuracy_rate: float
    total_reports_processed: int
    average_resolution_velocity_hours: float
    generated_at: str


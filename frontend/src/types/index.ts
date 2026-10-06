export type UserRole = 'citizen' | 'administrator' | 'system_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface IssueCategory {
  id: string;
  name: string;
  description: string;
}

export interface Report {
  id: string;
  submitter_id: string;
  submitter_name?: string;
  category_id: string;
  category?: IssueCategory;
  cluster_id?: string;
  title: string;
  description: string;
  impact: number;
  urgency: number;
  approximate_area?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  status: 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Reopened' | 'Rejected';
  created_at: string;
  resolved_at?: string;
}

export interface CandidateMatch {
  report_id: string;
  title: string;
  description: string;
  category_name: string;
  similarity_score: number;
  confidence_level: 'High' | 'Moderate' | 'Low';
  matched_evidence: string;
  status: string;
  created_at: string;
}

export interface ReportMatch {
  id: string;
  source_report_id: string;
  candidate_report_id: string;
  similarity_score: number;
  match_type: string;
  decision: 'Suggested' | 'Confirmed duplicate' | 'Confirmed related' | 'Rejected match' | 'Deferred';
  decision_reason?: string;
  reviewer_id?: string;
  reviewed_at?: string;
  source_report?: Report;
  candidate_report?: Report;
}

export interface IssueCluster {
  id: string;
  representative_title: string;
  representative_description: string;
  category_id: string;
  category_name?: string;
  status: string;
  current_priority_score: number;
  recurrence_count: number;
  report_count?: number;
  created_at: string;
  resolved_at?: string;
}

export interface PriorityExplanation {
  cluster_id: string;
  total_priority_score: number;
  components: {
    impact: number;
    urgency: number;
    recurrence: number;
    age: number;
  };
  weights: {
    impact: number;
    urgency: number;
    recurrence: number;
    age: number;
  };
  human_explanation: string;
}

export interface RecurrenceEvent {
  id: string;
  historical_cluster_id: string;
  historical_cluster_title?: string;
  new_report_id: string;
  new_report_title?: string;
  similarity_score: number;
  evidence: string;
  status: 'Pending Review' | 'Confirmed Recurrence' | 'Rejected Recurrence' | 'Reopened';
  created_at: string;
}

export interface RootCauseHypothesis {
  id: string;
  source_cluster_id: string;
  source_cluster_title?: string;
  related_cluster_id: string;
  related_cluster_title?: string;
  hypothesis_text: string;
  evidence_json: Record<string, any>;
  score_or_strength: number;
  uncertainty_label: 'Low Uncertainty' | 'Moderate Uncertainty' | 'High Uncertainty';
  review_status: 'Proposed' | 'Confirmed' | 'Rejected' | 'Deferred';
  created_at: string;
}

export interface ResolutionRecommendation {
  id: string;
  target_cluster_id: string;
  historical_cluster_id: string;
  historical_title?: string;
  similarity_score: number;
  recorded_action: string;
  recommendation_reason: string;
  feedback?: 'Useful' | 'Not Useful';
  created_at: string;
}

export interface ForecastPoint {
  period: string;
  historical_count?: number;
  forecast_count?: number;
  lower_bound?: number;
  upper_bound?: number;
}

export interface ForecastResponse {
  category_id?: string;
  method: string;
  mae: number;
  historical_points: ForecastPoint[];
  forecast_points: ForecastPoint[];
  limitations_note: string;
}

export interface AnalyticsSummary {
  total_reports: number;
  open_reports: number;
  resolved_reports: number;
  total_clusters: number;
  high_priority_clusters: number;
  confirmed_recurrences: number;
  pending_ai_reviews: number;
  avg_resolution_days: number;
}

export interface AuditLog {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  actor_id?: string;
  reason?: string;
  created_at: string;
}

export interface ModelEvaluation {
  model_name: string;
  dataset_size: number;
  metrics: {
    sentence_transformer: {
      precision: number;
      recall: number;
      f1_score: number;
      false_positives: number;
      false_negatives: number;
    };
    tfidf_baseline: {
      precision: number;
      recall: number;
      f1_score: number;
      false_positives: number;
      false_negatives: number;
    };
  };
  interpretation: string;
}

export interface GISHeatmapPoint {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  priority_score: number;
  status: string;
  ward: string;
  created_at: string;
}

export interface WardStat {
  ward_name: string;
  total_issues: number;
  resolved_issues: number;
  avg_priority: number;
  sla_health_pct: number;
}

export interface DispatchRoute {
  route_id: string;
  ward: string;
  crew_name: string;
  crew_status: string;
  issue_count: number;
  estimated_hours: number;
  fuel_saved_gallons: number;
  priority_level: string;
  cluster_ids: string[];
  cluster_titles: string[];
}

export interface SLARiskItem {
  cluster_id: string;
  title: string;
  category: string;
  aging_days: number;
  risk_level: 'Critical' | 'High' | 'Moderate';
  breach_probability: number;
  department: string;
  escalated: boolean;
}

export interface HeroStats {
  karma_points: number;
  badge_title: string;
  verified_reports_count: number;
  rank: number;
  neighborhood_rank: string;
  total_impact_contributions: number;
}

export interface PhotoVerificationResult {
  report_id: string;
  match_score: number;
  is_verified: boolean;
  ai_confidence: string;
  karma_awarded: number;
  verification_summary: string;
}

export interface ExecutiveReportData {
  total_duplicates_caught: number;
  estimated_taxpayer_savings_usd: number;
  overall_sla_compliance_pct: number;
  highest_recurring_category: string;
  ai_accuracy_rate: number;
  total_reports_processed: number;
  average_resolution_velocity_hours: number;
  generated_at: string;
}


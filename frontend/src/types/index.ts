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

// ==========================================
// 21 CIVICNEXUS AI FEATURE TYPES
// ==========================================
// 21 CIVICNEXUS AI FEATURE TYPES
// ==========================================

// #2 Nearby Problems Map
export interface NearbyCivicIssue {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  distance_meters?: number;
  distance_km?: number;
  support_count: number;
  user_supported?: boolean;
  status: string;
  reported_time?: string;
  last_confirmed?: string;
  is_verified_hazard?: boolean;
  address?: string;
  urgency?: string;
  description?: string;
  location_name?: string;
  department?: string;
}

// #3 & #19 RepairProof & Photo Change Detector
export interface RepairProofRecord {
  report_id: string;
  title: string;
  category: string;
  location: string;
  resolved_date: string;
  before_photo?: string;
  after_photo?: string;
  before_image_url?: string;
  after_image_url?: string;
  technician_name?: string;
  contractor_assigned?: string;
  department: string;
  ai_structural_match_pct?: number;
  ai_authenticity_score?: number;
  ai_authenticity_verdict?: string;
  ai_notes?: string;
  citizen_confirm_count: number;
  citizen_dispute_count: number;
  user_vote?: 'confirmed' | 'disputed';
  status: string;
}

// #4 & #9 Tamil Voice Assistant & Multimodal
export interface VoiceDraftResult {
  transcript: string;
  language: 'ta-IN' | 'en-IN' | 'en-US';
  translated_text: string;
  extracted_category: string;
  extracted_urgency: number;
  extracted_impact: number;
  suggested_department: string;
  summary: string;
}

// #5 Live Status Tracking Step
export interface ComplaintTrackingStep {
  step?: string;
  step_number?: number;
  title?: string;
  status?: 'completed' | 'in_progress' | 'pending';
  timestamp: string;
  completed?: boolean;
  active?: boolean;
  department: string;
  officer?: string;
  notes?: string;
  description?: string;
}

// #10 SafeRoute Civic Hazard
export interface SafeRouteHazard {
  id: string;
  title: string;
  type?: string;
  hazard_type?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Moderate' | 'Low';
  latitude: number;
  longitude: number;
  location_name: string;
  suggested_detour?: string;
  description?: string;
}

// #11 Public-Service Alerts
export interface PublicServiceAlert {
  id: string;
  title: string;
  category: string;
  severity?: string;
  urgency?: string;
  affected_areas?: string[];
  affected_wards?: string[];
  start_time: string;
  end_time: string;
  source_authority?: string;
  issuing_department?: string;
  source_verification_url?: string;
  is_verified?: boolean;
  subscriber_count: number;
  is_subscribed?: boolean;
  description?: string;
  alternative_arrangements?: string;
}

// #12 & #17 Overdue Escalation & Follow-up Assistant
export interface OverdueEscalationCase {
  report_id: string;
  title: string;
  category: string;
  submitted_date?: string;
  filed_date?: string;
  location?: string;
  sla_deadline?: string;
  sla_limit_days?: number;
  hours_overdue?: number;
  overdue_days?: number;
  assigned_department?: string;
  department?: string;
  current_officer?: string;
  assigned_officer?: string;
  escalated_to?: string;
  escalation_status: string;
  rti_draft_generated?: boolean;
}

// #13 Accessibility Barrier
export interface AccessibilityBarrier {
  id: string;
  title: string;
  barrier_type: string;
  severity: 'Severe' | 'Critical' | 'High' | 'Moderate' | 'Minor';
  latitude?: number;
  longitude?: number;
  location_name: string;
  wheelchair_impact: string;
  reported_by: string;
  status: string;
}

// #14 Public Help Finder
export interface PublicFacility {
  id: string;
  name: string;
  category?: string;
  facility_type?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  wheelchair_accessible?: boolean;
  is_wheelchair_accessible?: boolean;
  cleanliness_rating?: number;
  hygiene_rating?: number;
  operating_hours: string;
  contact_number?: string;
  contact_phone?: string;
  free_access?: boolean;
  is_verified?: boolean;
  distance_km?: number;
  ward?: string;
}

// #15 Community Action Matcher
export interface CommunityEvent {
  id: string;
  title: string;
  type?: string;
  category?: string;
  description?: string;
  location: string;
  event_date?: string;
  date?: string;
  time: string;
  organizer: string;
  volunteers_registered: number;
  target_volunteers?: number;
  volunteers_needed?: number;
  user_registered?: boolean;
  perks?: string[];
  karma_points?: number;
}

// #16 Offline Draft
export interface OfflineDraftReport {
  id?: string;
  local_id?: string;
  title: string;
  description: string;
  category?: string;
  category_name?: string;
  latitude?: number;
  longitude?: number;
  saved_at: string;
  image_data_url?: string;
  sync_status: 'pending' | 'syncing' | 'synced' | 'failed' | 'queued_offline';
}

// #18 Civic What-If Simulator
export interface SimulatorIntervention {
  id: string;
  name: string;
  cost_lakhs: number;
  estimated_flood_reduction_pct: number;
  pothole_prevented_count: number;
  citizens_benefited: number;
  roi_score: number;
  selected: boolean;
}

// #20 Civic Knowledge Graph
export interface CivicGraphNode {
  id: string;
  label: string;
  type: string;
  frequency?: number;
}

export interface CivicGraphLink {
  source: string;
  target: string;
  relationship: string;
  weight?: number;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: string;
  x?: number;
  y?: number;
  details?: string;
}

export interface KnowledgeGraphLink {
  source: string;
  target: string;
  relationship: string;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeGraphNode[];
  links: KnowledgeGraphLink[];
}

// #21 Civic Impact Analytics & Scorecard
export interface WardAccountabilityScore {
  ward: string;
  zone: string;
  total_reports: number;
  resolved_rate_pct: number;
  median_response_hours: number;
  sla_adherence_pct: number;
  reopened_rate_pct: number;
  citizen_satisfaction_score: number;
  performance_tier: 'Gold' | 'Silver' | 'Needs Improvement';
}




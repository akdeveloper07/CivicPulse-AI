import {
  User, IssueCategory, Report, IssueCluster, ReportMatch,
  RecurrenceEvent, RootCauseHypothesis, ResolutionRecommendation,
  ForecastResponse, AnalyticsSummary, GISHeatmapPoint, WardStat,
  DispatchRoute, SLARiskItem, HeroStats, ModelEvaluation, AuditLog,
  ExecutiveReportData, PriorityExplanation
} from '../types';

export const DEMO_USERS: Record<string, User> = {
  'citizen@civicpulse.org': {
    id: 'usr-cit-01',
    name: 'Sarah Jenkins (Citizen)',
    email: 'citizen@civicpulse.org',
    role: 'citizen',
    is_active: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  'admin@civicpulse.org': {
    id: 'usr-adm-01',
    name: 'Marcus Vance (City Administrator)',
    email: 'admin@civicpulse.org',
    role: 'administrator',
    is_active: true,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  'sysadmin@civicpulse.org': {
    id: 'usr-sys-01',
    name: 'Dr. Elena Rostova (System Director)',
    email: 'sysadmin@civicpulse.org',
    role: 'system_admin',
    is_active: true,
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  'citizen.google@gmail.com': {
    id: 'usr-goog-01',
    name: 'Alex Rivera (Google User)',
    email: 'citizen.google@gmail.com',
    role: 'citizen',
    is_active: true,
    created_at: new Date().toISOString(),
  },
};

export const MOCK_CATEGORIES: IssueCategory[] = [
  { id: 'cat-1', name: 'Potholes & Road Damage', description: 'Crater potholes, asphalt crumbling, and hazardous road fissures.' },
  { id: 'cat-2', name: 'Waterlogging & Drainage', description: 'Stormwater accumulation, clogged storm drains, and street flooding.' },
  { id: 'cat-3', name: 'Water Leakage & Pipeline', description: 'Underground main ruptures, drinking water line seepage, low pressure.' },
  { id: 'cat-4', name: 'Streetlight & Electrical', description: 'Dark road stretches, non-functioning LED lamps, exposed cabling.' },
  { id: 'cat-5', name: 'Garbage & Sanitation', description: 'Overflowing dumpsters, illegal municipal dumping, missed pickup routes.' },
  { id: 'cat-6', name: 'Public Infrastructure', description: 'Damaged sidewalks, broken guard rails, pedestrian footbridge issues.' },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rep-001',
    submitter_id: 'usr-cit-01',
    submitter_name: 'Sarah Jenkins',
    category_id: 'cat-1',
    category: MOCK_CATEGORIES[0],
    cluster_id: 'cls-001',
    title: 'Severe crater pothole causing vehicular damage on MG Road',
    description: 'Deep 12-inch crater pothole on the northbound lane near Metro Pillar 142. Two two-wheelers suffered rim damage this morning.',
    impact: 4,
    urgency: 5,
    approximate_area: 'MG Road Metro Corridor',
    latitude: 12.9716,
    longitude: 77.5946,
    status: 'In Progress',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rep-002',
    submitter_id: 'usr-cit-02',
    submitter_name: 'David Chen',
    category_id: 'cat-1',
    category: MOCK_CATEGORIES[0],
    cluster_id: 'cls-001',
    title: 'Hazardous asphalt sinkhole next to Pillar 143 on MG Road',
    description: 'Crumbling road surface right after the bus stop. Water has accumulated inside making it invisible at dusk.',
    impact: 4,
    urgency: 4,
    approximate_area: 'MG Road Pillar 143',
    latitude: 12.9721,
    longitude: 77.5951,
    status: 'In Progress',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    image_url: 'https://images.unsplash.com/photo-1584463699047-9f201088924b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'rep-003',
    submitter_id: 'usr-cit-03',
    submitter_name: 'Amina Patel',
    category_id: 'cat-2',
    category: MOCK_CATEGORIES[1],
    cluster_id: 'cls-002',
    title: 'Stormwater drain overflowing into shop basements on 4th Avenue',
    description: 'Debris from recent construction has completely plugged the primary culvert. 3 inches of water standing in commercial street.',
    impact: 5,
    urgency: 5,
    approximate_area: '4th Avenue Market Row',
    latitude: 12.9352,
    longitude: 77.6245,
    status: 'Submitted',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: 'rep-004',
    submitter_id: 'usr-cit-04',
    submitter_name: 'Vikram Rao',
    category_id: 'cat-3',
    category: MOCK_CATEGORIES[2],
    cluster_id: 'cls-003',
    title: 'High-pressure clean water main bursting under Central Market sidewalk',
    description: 'Continuous drinking water spray leaking under pavement slabs. Ground softening rapidly; risks pedestrian collapse.',
    impact: 4,
    urgency: 5,
    approximate_area: 'Central Market East Gate',
    latitude: 12.9698,
    longitude: 77.6499,
    status: 'Under Review',
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
  },
  {
    id: 'rep-005',
    submitter_id: 'usr-cit-01',
    submitter_name: 'Sarah Jenkins',
    category_id: 'cat-4',
    category: MOCK_CATEGORIES[3],
    title: 'All street lamps dark along Lakeview Promenade stretch',
    description: '6 consecutive high-mast streetlights have gone out, leaving the pedestrian jogger pathway in total darkness.',
    impact: 3,
    urgency: 3,
    approximate_area: 'Lakeview Promenade',
    latitude: 12.9830,
    longitude: 77.6080,
    status: 'Resolved',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    resolved_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const MOCK_CLUSTERS: IssueCluster[] = [
  {
    id: 'cls-001',
    representative_title: 'MG Road Corridor Roadbed Structural Deterioration',
    representative_description: 'Cluster of 4 severe crater potholes located between Metro Pillar 140 and 145 on MG Road.',
    category_id: 'cat-1',
    category_name: 'Potholes & Road Damage',
    status: 'In Progress',
    current_priority_score: 87.5,
    recurrence_count: 2,
    report_count: 4,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'cls-002',
    representative_title: '4th Avenue Commercial Drain Blockage & Waterlogging',
    representative_description: 'Sub-surface culvert blockage triggering stormwater overflow across 200 meters of retail avenue.',
    category_id: 'cat-2',
    category_name: 'Waterlogging & Drainage',
    status: 'Submitted',
    current_priority_score: 92.0,
    recurrence_count: 3,
    report_count: 5,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'cls-003',
    representative_title: 'Central Market Potable Water Main Rupture',
    representative_description: 'High-volume pipeline rupture eroding pedestrian sub-base pavement near East Gate.',
    category_id: 'cat-3',
    category_name: 'Water Leakage & Pipeline',
    status: 'Under Review',
    current_priority_score: 81.4,
    recurrence_count: 1,
    report_count: 3,
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
  },
];

export const MOCK_MATCH_QUEUE: ReportMatch[] = [
  {
    id: 'mtch-001',
    source_report_id: 'rep-002',
    candidate_report_id: 'rep-001',
    similarity_score: 0.942,
    match_type: 'Semantic & Spatial Duplicate',
    decision: 'Suggested',
    source_report: MOCK_REPORTS[1],
    candidate_report: MOCK_REPORTS[0],
  },
  {
    id: 'mtch-002',
    source_report_id: 'rep-003',
    candidate_report_id: 'rep-001',
    similarity_score: 0.735,
    match_type: 'Related Incident Root-Cause',
    decision: 'Suggested',
    source_report: MOCK_REPORTS[2],
    candidate_report: MOCK_REPORTS[0],
  },
];

export const MOCK_RECURRENCE_EVENTS: RecurrenceEvent[] = [
  {
    id: 'rec-001',
    historical_cluster_id: 'cls-001',
    historical_cluster_title: 'MG Road Monsoon Pothole Remediation (2025)',
    new_report_id: 'rep-001',
    new_report_title: 'Severe crater pothole causing vehicular damage on MG Road',
    similarity_score: 0.89,
    evidence: 'Identical coordinates (12.9716, 77.5946) within 15 meters of previous asphalt cold-mix patch that failed after heavy rain.',
    status: 'Confirmed Recurrence',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const MOCK_ROOT_CAUSES: RootCauseHypothesis[] = [
  {
    id: 'rch-001',
    source_cluster_id: 'cls-002',
    source_cluster_title: '4th Avenue Commercial Drain Blockage & Waterlogging',
    related_cluster_id: 'cls-001',
    related_cluster_title: 'MG Road Corridor Roadbed Structural Deterioration',
    hypothesis_text: 'Upstream stormwater retention failure is discharging unmanaged runoff into the MG Road sub-base, dissolving asphalt bitumen binding.',
    evidence_json: {
      spatial_distance_meters: 320,
      elevation_delta_meters: -3.4,
      temporal_correlation: 0.88,
      common_contractor: 'Metro Urban Infra Ltd'
    },
    score_or_strength: 0.86,
    uncertainty_label: 'Low Uncertainty',
    review_status: 'Proposed',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const MOCK_RECOMMENDATIONS: ResolutionRecommendation[] = [
  {
    id: 'rec-001',
    target_cluster_id: 'cls-001',
    historical_cluster_id: 'cls-hist-08',
    historical_title: 'Outer Ring Road Sub-base Pothole Overhaul',
    similarity_score: 0.91,
    recorded_action: 'Utilize high-viscosity mastic asphalt with geotextile waterproofing layer rather than standard cold-mix bitumen.',
    recommendation_reason: 'Historical data shows standard cold patches fail within 42 days in high groundwater corridors.',
    feedback: 'Useful',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'rec-002',
    target_cluster_id: 'cls-002',
    historical_cluster_id: 'cls-hist-14',
    historical_title: 'Commercial Culvert High-Pressure Jetting',
    similarity_score: 0.88,
    recorded_action: 'Deploy industrial hydro-vac excavator to clear concrete slurry sedimentation before surface resurfacing.',
    recommendation_reason: 'Culvert capacity restored by 94% with zero recurrence across 180 days.',
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
];

export const MOCK_PRIORITY_EXPLANATION: PriorityExplanation = {
  cluster_id: 'cls-001',
  total_priority_score: 87.5,
  components: {
    impact: 32.0,
    urgency: 25.0,
    recurrence: 20.0,
    age: 10.5,
  },
  weights: {
    impact: 0.35,
    urgency: 0.30,
    recurrence: 0.20,
    age: 0.15,
  },
  human_explanation: 'High traffic volume corridor (impact 4/5) combined with rapid vehicular hazard (urgency 5/5) and a repeat failure pattern within 6 months elevated this cluster to Tier-1 Emergency Dispatch.',
};

export const MOCK_FORECAST: ForecastResponse = {
  category_id: 'cat-1',
  method: 'Holt-Winters Seasonal Smoothing + Sentence-Transformer Drift',
  mae: 1.84,
  historical_points: [
    { period: 'Week 1', historical_count: 14 },
    { period: 'Week 2', historical_count: 18 },
    { period: 'Week 3', historical_count: 22 },
    { period: 'Week 4', historical_count: 27 },
    { period: 'Week 5', historical_count: 31 },
    { period: 'Week 6', historical_count: 38 },
  ],
  forecast_points: [
    { period: 'Week 7 (Proj)', forecast_count: 42, lower_bound: 36, upper_bound: 48 },
    { period: 'Week 8 (Proj)', forecast_count: 47, lower_bound: 39, upper_bound: 55 },
    { period: 'Week 9 (Proj)', forecast_count: 51, lower_bound: 41, upper_bound: 61 },
  ],
  limitations_note: 'Monsoon onset may trigger non-linear volume surge exceeding historical variance envelopes.',
};

export const MOCK_ANALYTICS_SUMMARY: AnalyticsSummary = {
  total_reports: 48,
  open_reports: 14,
  resolved_reports: 34,
  total_clusters: 11,
  high_priority_clusters: 3,
  confirmed_recurrences: 5,
  pending_ai_reviews: 2,
  avg_resolution_days: 3.2,
};

export const MOCK_HEATMAP_POINTS: GISHeatmapPoint[] = [
  { id: 'h-1', title: 'MG Road Potholes', category: 'Potholes', latitude: 12.9716, longitude: 77.5946, priority_score: 87.5, status: 'In Progress', ward: 'Ward 1 - Central CBD', created_at: new Date().toISOString() },
  { id: 'h-2', title: '4th Avenue Drain', category: 'Waterlogging', latitude: 12.9352, longitude: 77.6245, priority_score: 92.0, status: 'Submitted', ward: 'Ward 4 - Koramangala', created_at: new Date().toISOString() },
  { id: 'h-3', title: 'Central Water Leak', category: 'Water Supply', latitude: 12.9698, longitude: 77.6499, priority_score: 81.4, status: 'Under Review', ward: 'Ward 2 - Indiranagar', created_at: new Date().toISOString() },
  { id: 'h-4', title: 'Indiranagar 100ft Light Failure', category: 'Streetlight', latitude: 12.9784, longitude: 77.6408, priority_score: 64.0, status: 'Submitted', ward: 'Ward 2 - Indiranagar', created_at: new Date().toISOString() },
  { id: 'h-5', title: 'Koramangala 80ft Road Debris', category: 'Garbage', latitude: 12.9340, longitude: 77.6180, priority_score: 58.2, status: 'Resolved', ward: 'Ward 4 - Koramangala', created_at: new Date().toISOString() },
];

export const MOCK_WARD_STATS: WardStat[] = [
  { ward_name: 'Ward 1 - Central CBD', total_issues: 14, resolved_issues: 11, avg_priority: 78.4, sla_health_pct: 94.2 },
  { ward_name: 'Ward 2 - Indiranagar', total_issues: 12, resolved_issues: 9, avg_priority: 68.2, sla_health_pct: 91.5 },
  { ward_name: 'Ward 3 - Whitefield', total_issues: 9, resolved_issues: 6, avg_priority: 62.0, sla_health_pct: 88.0 },
  { ward_name: 'Ward 4 - Koramangala', total_issues: 13, resolved_issues: 8, avg_priority: 84.1, sla_health_pct: 79.4 },
];

export const MOCK_DISPATCH_ROUTES: DispatchRoute[] = [
  {
    route_id: 'rt-alpha',
    ward: 'Ward 1 - Central CBD',
    crew_name: 'Rapid Asphalt Taskforce Alpha',
    crew_status: 'Dispatched En Route',
    issue_count: 3,
    estimated_hours: 4.2,
    fuel_saved_gallons: 6.8,
    priority_level: 'High Priority',
    cluster_ids: ['cls-001'],
    cluster_titles: ['MG Road Corridor Roadbed Structural Deterioration'],
  },
  {
    route_id: 'rt-bravo',
    ward: 'Ward 4 - Koramangala',
    crew_name: 'Stormwater Hydro-Vac Unit 2',
    crew_status: 'On Site Remediating',
    issue_count: 2,
    estimated_hours: 3.5,
    fuel_saved_gallons: 4.5,
    priority_level: 'Critical Emergency',
    cluster_ids: ['cls-002'],
    cluster_titles: ['4th Avenue Commercial Drain Blockage & Waterlogging'],
  },
];

export const MOCK_SLA_RISK_ITEMS: SLARiskItem[] = [
  {
    cluster_id: 'cls-002',
    title: '4th Avenue Commercial Drain Blockage & Waterlogging',
    category: 'Waterlogging & Drainage',
    aging_days: 3.8,
    risk_level: 'Critical',
    breach_probability: 0.88,
    department: 'Stormwater Engineering',
    escalated: true,
  },
  {
    cluster_id: 'cls-001',
    title: 'MG Road Corridor Roadbed Structural Deterioration',
    category: 'Potholes & Road Damage',
    aging_days: 2.1,
    risk_level: 'High',
    breach_probability: 0.64,
    department: 'Roads & Bridges Division',
    escalated: false,
  },
];

export const MOCK_HERO_STATS: HeroStats = {
  karma_points: 540,
  badge_title: 'Civic Champion ⭐',
  verified_reports_count: 14,
  rank: 3,
  neighborhood_rank: 'Top 1% in Ward 1',
  total_impact_contributions: 42,
};

export const MOCK_MODEL_EVALUATION: ModelEvaluation = {
  model_name: 'Sentence-Transformers all-MiniLM-L6-v2 vs TF-IDF Baseline',
  dataset_size: 1420,
  metrics: {
    sentence_transformer: {
      precision: 0.934,
      recall: 0.892,
      f1_score: 0.912,
      false_positives: 14,
      false_negatives: 22,
    },
    tfidf_baseline: {
      precision: 0.741,
      recall: 0.685,
      f1_score: 0.712,
      false_positives: 58,
      false_negatives: 71,
    },
  },
  interpretation: 'MiniLM-L6-v2 outperforms lexical n-gram baselines by +20% F1 on civic duplicate deduplication, successfully matching paraphrased reports with disparate phrasing.',
};

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'aud-01', action: 'CLUSTER_PRIORITY_ESCALATED', entity_type: 'IssueCluster', entity_id: 'cls-002', actor_id: 'AI Engine', reason: 'Recurrence count breached threshold 3 in 30 days', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'aud-02', action: 'DUPLICATE_CONFIRMED', entity_type: 'ReportMatch', entity_id: 'mtch-001', actor_id: 'usr-adm-01', reason: 'Verified visual and spatial identity to MG Road report', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'aud-03', action: 'CREW_DISPATCHED', entity_type: 'DispatchRoute', entity_id: 'rt-alpha', actor_id: 'usr-adm-01', reason: 'Scheduled hot-mix asphalt patching team', created_at: new Date(Date.now() - 14400000).toISOString() },
];

export const MOCK_EXECUTIVE_REPORT: ExecutiveReportData = {
  total_duplicates_caught: 54,
  estimated_taxpayer_savings_usd: 24600,
  overall_sla_compliance_pct: 93.8,
  highest_recurring_category: 'Potholes & Road Damage',
  ai_accuracy_rate: 91.2,
  total_reports_processed: 142,
  average_resolution_velocity_hours: 28.4,
  generated_at: new Date().toISOString(),
};

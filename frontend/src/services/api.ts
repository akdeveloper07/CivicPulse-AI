import {
  AuthResponse, User, IssueCategory, Report, CandidateMatch, ReportMatch,
  IssueCluster, PriorityExplanation, RecurrenceEvent, RootCauseHypothesis,
  ResolutionRecommendation, ForecastResponse, AnalyticsSummary, AuditLog, ModelEvaluation,
  NearbyCivicIssue, RepairProofRecord, VoiceDraftResult, ComplaintTrackingStep,
  SafeRouteHazard, PublicServiceAlert, OverdueEscalationCase, AccessibilityBarrier,
  PublicFacility, CommunityEvent, OfflineDraftReport, SimulatorIntervention,
  CivicGraphNode, CivicGraphLink, WardAccountabilityScore,
  CivicDepartmentInfo, FloodRescuePoint, WardTenderContract, DetectedRoadDefect,
  NightSafetyLocation, WaterTankerStatus, WardSabhaVotingProposal, CivicPassRecord,
  AnimalRescueReport, NoisePollutionReading, UrbanTreeItem, PowerSubstationRadar,
  EmergencyHazardAlert
} from '../types';
import {
  DEMO_USERS, MOCK_CATEGORIES, MOCK_REPORTS, MOCK_CLUSTERS,
  MOCK_MATCH_QUEUE, MOCK_RECURRENCE_EVENTS, MOCK_ROOT_CAUSES,
  MOCK_RECOMMENDATIONS, MOCK_PRIORITY_EXPLANATION, MOCK_FORECAST,
  MOCK_ANALYTICS_SUMMARY, MOCK_HEATMAP_POINTS, MOCK_WARD_STATS,
  MOCK_DISPATCH_ROUTES, MOCK_SLA_RISK_ITEMS, MOCK_HERO_STATS,
  MOCK_MODEL_EVALUATION, MOCK_AUDIT_LOGS, MOCK_EXECUTIVE_REPORT,
  MOCK_NEARBY_ISSUES, MOCK_REPAIR_PROOFS, MOCK_TRACKING_STEPS,
  MOCK_SAFE_ROUTE_HAZARDS, MOCK_PUBLIC_ALERTS, MOCK_OVERDUE_CASES,
  MOCK_ACCESSIBILITY_BARRIERS, MOCK_PUBLIC_FACILITIES, MOCK_COMMUNITY_EVENTS,
  MOCK_SIMULATOR_INTERVENTIONS, MOCK_GRAPH_NODES, MOCK_GRAPH_LINKS, MOCK_WARD_SCORES,
  MOCK_DEPARTMENTS, MOCK_FLOOD_POINTS, MOCK_TENDERS, MOCK_ROAD_DEFECTS,
  MOCK_NIGHT_SAFETY, MOCK_WATER_TANKERS, MOCK_WARD_SABHA_PROPOSALS, MOCK_CIVIC_PASS,
  MOCK_ANIMAL_CASES, MOCK_NOISE_READINGS, MOCK_TREES, MOCK_POWER_GRID,
  MOCK_EMERGENCY_ALERTS
} from './mockData';

// Dynamic API Base URL determination
const getApiBase = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/$/, '');
  }
  // Default to relative /api/v1 so Vite local dev proxy forwards to http://127.0.0.1:8000
  return '/api/v1';
};

const API_BASE = getApiBase();

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('civicpulse_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// In-memory / localStorage state helpers for seamless offline demo persistence
function getStoredReports(): Report[] {
  try {
    const raw = localStorage.getItem('civicpulse_custom_reports');
    if (raw) return [...JSON.parse(raw), ...MOCK_REPORTS];
  } catch (e) {
    // ignore
  }
  return [...MOCK_REPORTS];
}

function saveCustomReport(rep: Report) {
  try {
    const existingRaw = localStorage.getItem('civicpulse_custom_reports');
    const list = existingRaw ? JSON.parse(existingRaw) : [];
    list.unshift(rep);
    localStorage.setItem('civicpulse_custom_reports', JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

function getStoredEmergencyAlerts(): EmergencyHazardAlert[] {
  try {
    const raw = localStorage.getItem('civicpulse_custom_emergency_alerts');
    if (raw) return [...JSON.parse(raw), ...MOCK_EMERGENCY_ALERTS];
  } catch (e) {
    // ignore
  }
  return [...MOCK_EMERGENCY_ALERTS];
}

function saveCustomEmergencyAlert(alert: EmergencyHazardAlert) {
  try {
    const existingRaw = localStorage.getItem('civicpulse_custom_emergency_alerts');
    const list = existingRaw ? JSON.parse(existingRaw) : [];
    list.unshift(alert);
    localStorage.setItem('civicpulse_custom_emergency_alerts', JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

function getStoredMatchQueue(): ReportMatch[] {
  try {
    const raw = localStorage.getItem('civicpulse_match_queue');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return [...MOCK_MATCH_QUEUE];
}

function saveMatchQueue(list: ReportMatch[]) {
  try {
    localStorage.setItem('civicpulse_match_queue', JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

/**
 * Intelligent Fallback Handler:
 * When the FastAPI backend is offline, unreachable, or deployed statically,
 * this function transparently fulfills API requests with rich, interactive seed data.
 */
function handleMockFallback<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  const cleanEndpoint = endpoint.split('?')[0];

  // 1. Auth: Login
  if (cleanEndpoint === '/auth/login' && method === 'POST') {
    let email = 'sysadmin@civicpulse.org';
    try {
      const body = JSON.parse((options.body as string) || '{}');
      if (body.email) email = body.email.toLowerCase().trim();
    } catch (e) {
      // ignore
    }

    const matchedUser: User = DEMO_USERS[email] || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email: email,
      role: email.includes('admin') ? 'administrator' : 'citizen',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    const authRes: AuthResponse = {
      access_token: `demo-jwt-${Date.now()}`,
      token_type: 'bearer',
      user: matchedUser,
    };
    localStorage.setItem('civicpulse_token', authRes.access_token);
    localStorage.setItem('civicpulse_current_user', JSON.stringify(matchedUser));
    return authRes as unknown as T;
  }

  // 2. Auth: Google Login
  if (cleanEndpoint === '/auth/google' && method === 'POST') {
    let googleUser = DEMO_USERS['citizen.google@gmail.com'];
    try {
      const body = JSON.parse((options.body as string) || '{}');
      if (body.email) {
        googleUser = {
          id: `usr-goog-${Date.now()}`,
          name: body.name || 'Google Citizen User',
          email: body.email,
          role: 'citizen',
          is_active: true,
          created_at: new Date().toISOString(),
        };
      }
    } catch (e) {
      // ignore
    }
    const authRes: AuthResponse = {
      access_token: `demo-google-jwt-${Date.now()}`,
      token_type: 'bearer',
      user: googleUser,
    };
    localStorage.setItem('civicpulse_token', authRes.access_token);
    localStorage.setItem('civicpulse_current_user', JSON.stringify(googleUser));
    return authRes as unknown as T;
  }

  // 3. Auth: Register
  if (cleanEndpoint === '/auth/register' && method === 'POST') {
    let body: any = {};
    try { body = JSON.parse((options.body as string) || '{}'); } catch (e) {}
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: body.name || 'New Registered Citizen',
      email: body.email || 'user@civicpulse.org',
      role: (body.role as any) || 'citizen',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    return newUser as unknown as T;
  }

  // 4. Auth: Get Current User
  if (cleanEndpoint === '/auth/me') {
    try {
      const raw = localStorage.getItem('civicpulse_current_user');
      if (raw) return JSON.parse(raw) as T;
    } catch (e) {
      // fallback
    }
    return DEMO_USERS['sysadmin@civicpulse.org'] as unknown as T;
  }

  // 5. Categories
  if (cleanEndpoint === '/reports/categories') {
    return MOCK_CATEGORIES as unknown as T;
  }

  // 6. Check Similarity (Pre-submission deduplication check across all categories)
  if (cleanEndpoint === '/reports/check-similarity') {
    let title = '';
    let description = '';
    let category_id = '';
    try {
      const body = JSON.parse((options.body as string) || '{}');
      title = (body.title || '').trim();
      description = (body.description || '').trim();
      category_id = (body.category_id || '').trim();
    } catch (e) {}

    const queryText = `${title} ${description}`.toLowerCase();
    const queryTokens = new Set(
      queryText.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2)
    );

    const allReports = getStoredReports();
    const matches: CandidateMatch[] = [];
    const stopWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'near', 'from', 'area', 'road', 'issue', 'reported']);

    for (const rep of allReports) {
      const repText = `${rep.title} ${rep.description}`.toLowerCase();
      const repTokens = new Set(
        repText.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2)
      );

      // 1. Calculate Jaccard Token Overlap
      let overlapCount = 0;
      const overlappingWords: string[] = [];
      queryTokens.forEach((t) => {
        if (repTokens.has(t)) {
          overlapCount++;
          if (!stopWords.has(t)) overlappingWords.push(t);
        }
      });

      const unionSize = new Set([...queryTokens, ...repTokens]).size;
      const tokenScore = unionSize > 0 ? overlapCount / unionSize : 0;

      // 2. Category Match bonus
      const isCategoryMatch = category_id && rep.category_id === category_id;
      const categoryBonus = isCategoryMatch ? 0.22 : 0;

      // 3. Substring / phrase match bonus
      const titleLower = title.toLowerCase();
      const repTitleLower = rep.title.toLowerCase();
      const phraseMatch =
        (titleLower.length > 6 && repTitleLower.includes(titleLower)) ||
        (repTitleLower.length > 6 && titleLower.includes(repTitleLower));
      const phraseBonus = phraseMatch ? 0.35 : 0;

      // 4. Spatial / Area keyword match
      let spatialBonus = 0;
      if (rep.approximate_area && queryText.includes(rep.approximate_area.toLowerCase())) {
        spatialBonus = 0.2;
      }

      // Compute composite similarity score
      let score = Math.min(0.98, tokenScore * 1.6 + categoryBonus + phraseBonus + spatialBonus);

      // Category semantic boosters
      if (/pothole|crater|asphalt|tire|rim/i.test(queryText) && /pothole|crater|asphalt/i.test(repText)) {
        score = Math.max(score, 0.89);
      } else if (/drain|flood|waterlog|stormwater|culvert/i.test(queryText) && /drain|flood|waterlog|culvert/i.test(repText)) {
        score = Math.max(score, 0.86);
      } else if (/pipe|leak|burst|potable/i.test(queryText) && /pipe|leak|burst|water/i.test(repText)) {
        score = Math.max(score, 0.85);
      } else if (/streetlight|dark|lamp|wire/i.test(queryText) && /street|lamp|dark|light/i.test(repText)) {
        score = Math.max(score, 0.84);
      } else if (/garbage|dump|waste|sanitation/i.test(queryText) && /garbage|dump|waste|sanitation/i.test(repText)) {
        score = Math.max(score, 0.83);
      }

      // Threshold: return candidate matches with score >= 0.50
      if (score >= 0.50) {
        const evidenceTerms =
          overlappingWords.length > 0
            ? `Matched key concepts: "${overlappingWords.slice(0, 4).join(', ')}"`
            : 'High semantic category & structural symptom alignment';
        const spatialNote = rep.approximate_area ? ` · Landmark: ${rep.approximate_area}` : '';

        matches.push({
          report_id: rep.id,
          title: rep.title,
          description: rep.description,
          category_name: rep.category?.name || 'General Civic Issue',
          similarity_score: Math.round(score * 1000) / 1000,
          confidence_level: score >= 0.80 ? 'High' : score >= 0.65 ? 'Moderate' : 'Low',
          matched_evidence: `${evidenceTerms}${spatialNote}`,
          status: rep.status,
          created_at: rep.created_at,
        });
      }
    }

    matches.sort((a, b) => b.similarity_score - a.similarity_score);
    return matches.slice(0, 5) as unknown as T;
  }

  // 7. Reports List & Creation
  if (cleanEndpoint === '/reports') {
    if (method === 'POST') {
      let body: any = {};
      try { body = JSON.parse((options.body as string) || '{}'); } catch (e) {}
      const newReport: Report = {
        id: `rep-${Date.now().toString().slice(-4)}`,
        submitter_id: 'usr-cit-01',
        submitter_name: 'Demo Citizen',
        category_id: body.category_id || 'cat-1',
        category: MOCK_CATEGORIES.find(c => c.id === body.category_id) || MOCK_CATEGORIES[0],
        title: body.title || 'Untitled Civic Issue',
        description: body.description || '',
        impact: Number(body.impact) || 3,
        urgency: Number(body.urgency) || 3,
        approximate_area: body.approximate_area || 'Central District',
        latitude: body.latitude || 12.9716,
        longitude: body.longitude || 77.5946,
        image_url: body.image_url,
        status: 'Submitted',
        created_at: new Date().toISOString(),
      };
      saveCustomReport(newReport);
      return newReport as unknown as T;
    }
    return getStoredReports() as unknown as T;
  }

  // 8. My Reports
  if (cleanEndpoint === '/reports/mine') {
    const all = getStoredReports();
    return all.filter(r => r.submitter_id === 'usr-cit-01' || r.submitter_id === 'usr-cit-02') as unknown as T;
  }

  // 9. Single Report
  if (cleanEndpoint.startsWith('/reports/')) {
    const id = cleanEndpoint.replace('/reports/', '');
    const found = getStoredReports().find(r => r.id === id) || MOCK_REPORTS[0];
    return found as unknown as T;
  }

  // 10. AI Review Queue
  if (cleanEndpoint === '/ai/review-queue') {
    return getStoredMatchQueue() as unknown as T;
  }

  if (cleanEndpoint.includes('/decision')) {
    const matchId = cleanEndpoint.split('/')[3] || 'mtch-001';
    let body: any = {};
    try { body = JSON.parse((options.body as string) || '{}'); } catch (e) {}
    const decision = body.decision || 'Confirmed duplicate';
    const queue = getStoredMatchQueue();
    const item = queue.find((m) => m.id === matchId);
    if (item) {
      item.decision = decision;
      item.decision_reason = body.reason || 'Reviewed by Administrator';
      saveMatchQueue(queue);
      return item as unknown as T;
    }
    return { ...MOCK_MATCH_QUEUE[0], decision } as unknown as T;
  }

  if (cleanEndpoint === '/ai/uncertainty') {
    return [
      { report_id: 'rep-003', ambiguity_score: 0.62, flag: 'Boundary Border Zone' }
    ] as unknown as T;
  }

  // 11. Clusters
  if (cleanEndpoint === '/clusters') {
    return MOCK_CLUSTERS as unknown as T;
  }

  if (cleanEndpoint.startsWith('/clusters/')) {
    if (cleanEndpoint.endsWith('/priority-explanation')) {
      return MOCK_PRIORITY_EXPLANATION as unknown as T;
    }
    if (cleanEndpoint.endsWith('/recommendations')) {
      return MOCK_RECOMMENDATIONS as unknown as T;
    }
    if (cleanEndpoint.endsWith('/status')) {
      return { ...MOCK_CLUSTERS[0], status: 'In Progress' } as unknown as T;
    }
    const id = cleanEndpoint.split('/')[2];
    const cluster = MOCK_CLUSTERS.find(c => c.id === id) || MOCK_CLUSTERS[0];
    return cluster as unknown as T;
  }

  if (cleanEndpoint === '/clusters/merge' || cleanEndpoint === '/clusters/split') {
    return MOCK_CLUSTERS[0] as unknown as T;
  }

  // 12. Recurrence
  if (cleanEndpoint === '/recurrence/events') {
    return MOCK_RECURRENCE_EVENTS as unknown as T;
  }

  // 13. Root Causes
  if (cleanEndpoint === '/root-causes/hypotheses' || cleanEndpoint === '/root-causes/analyze') {
    return MOCK_ROOT_CAUSES as unknown as T;
  }

  // 14. Recommendations
  if (cleanEndpoint.includes('/feedback')) {
    return { ...MOCK_RECOMMENDATIONS[0], feedback: 'Useful' } as unknown as T;
  }

  // 15. Analytics & Forecasting
  if (cleanEndpoint.startsWith('/analytics/forecasts')) {
    return MOCK_FORECAST as unknown as T;
  }

  if (cleanEndpoint === '/analytics/summary') {
    return MOCK_ANALYTICS_SUMMARY as unknown as T;
  }

  if (cleanEndpoint === '/analytics/categories') {
    return [
      { category_name: 'Potholes & Road Damage', count: 18, percentage: 37.5 },
      { category_name: 'Waterlogging & Drainage', count: 12, percentage: 25.0 },
      { category_name: 'Water Leakage & Pipeline', count: 8, percentage: 16.7 },
      { category_name: 'Streetlight & Electrical', count: 6, percentage: 12.5 },
      { category_name: 'Garbage & Sanitation', count: 4, percentage: 8.3 },
    ] as unknown as T;
  }

  if (cleanEndpoint === '/analytics/fairness') {
    return [
      { ward: 'Ward 1 - Central CBD', resolution_rate: 94.2, avg_days: 2.1, parity_index: 0.98 },
      { ward: 'Ward 2 - Indiranagar', resolution_rate: 91.5, avg_days: 2.5, parity_index: 0.95 },
      { ward: 'Ward 3 - Whitefield', resolution_rate: 88.0, avg_days: 3.4, parity_index: 0.91 },
      { ward: 'Ward 4 - Koramangala', resolution_rate: 79.4, avg_days: 4.2, parity_index: 0.84 },
    ] as unknown as T;
  }

  // 16. GIS & Dispatch
  if (cleanEndpoint === '/analytics/gis-heatmap') {
    return MOCK_HEATMAP_POINTS as unknown as T;
  }

  if (cleanEndpoint === '/analytics/ward-stats') {
    return MOCK_WARD_STATS as unknown as T;
  }

  if (cleanEndpoint === '/analytics/dispatch/routes') {
    return MOCK_DISPATCH_ROUTES as unknown as T;
  }

  if (cleanEndpoint === '/analytics/dispatch/assign') {
    return { success: true, message: 'Crew assigned successfully' } as unknown as T;
  }

  if (cleanEndpoint === '/analytics/sla-risk') {
    return MOCK_SLA_RISK_ITEMS as unknown as T;
  }

  if (cleanEndpoint.startsWith('/analytics/sla-escalate/')) {
    return { success: true, escalated: true, message: 'Tier-1 Escalation broadcasted' } as unknown as T;
  }

  if (cleanEndpoint === '/analytics/hero-stats') {
    return MOCK_HERO_STATS as unknown as T;
  }

  if (cleanEndpoint.startsWith('/analytics/verify-resolution/')) {
    return {
      report_id: 'rep-001',
      match_score: 0.94,
      is_verified: true,
      ai_confidence: 'High (0.94 cosine similarity against pre-resolution baseline)',
      karma_awarded: 50,
      verification_summary: 'Computer Vision analysis confirms asphalt pothole defect is fully patched and smooth.'
    } as unknown as T;
  }

  if (cleanEndpoint === '/analytics/executive-report') {
    return MOCK_EXECUTIVE_REPORT as unknown as T;
  }

  // 17. Admin Management
  if (cleanEndpoint === '/admin/users') {
    return Object.values(DEMO_USERS) as unknown as T;
  }

  if (cleanEndpoint.includes('/role')) {
    return DEMO_USERS['admin@civicpulse.org'] as unknown as T;
  }

  if (cleanEndpoint === '/admin/audit-logs') {
    return MOCK_AUDIT_LOGS as unknown as T;
  }

  if (cleanEndpoint === '/admin/model-evaluations') {
    return MOCK_MODEL_EVALUATION as unknown as T;
  }

  // 18. 21 CivicNexus Solutions Fallbacks
  if (cleanEndpoint === '/solutions/nearby-issues') {
    return MOCK_NEARBY_ISSUES as unknown as T;
  }
  if (cleanEndpoint.startsWith('/solutions/nearby-issues/') && cleanEndpoint.endsWith('/support')) {
    const id = cleanEndpoint.split('/')[3];
    const item = MOCK_NEARBY_ISSUES.find(i => i.id === id);
    if (item) {
      item.support_count += 1;
      item.user_supported = true;
      return item as unknown as T;
    }
    return { success: true } as unknown as T;
  }

  if (cleanEndpoint === '/solutions/repair-proofs') {
    return MOCK_REPAIR_PROOFS as unknown as T;
  }
  if (cleanEndpoint.startsWith('/solutions/repair-proofs/') && cleanEndpoint.endsWith('/vote')) {
    const id = cleanEndpoint.split('/')[3];
    let body: any = {};
    try { body = JSON.parse((options.body as string) || '{}'); } catch (e) {}
    const item = MOCK_REPAIR_PROOFS.find(p => p.report_id === id);
    if (item) {
      if (body.vote === 'confirmed') item.citizen_confirm_count += 1;
      if (body.vote === 'disputed') item.citizen_dispute_count += 1;
      item.user_vote = body.vote;
      return item as unknown as T;
    }
    return { success: true } as unknown as T;
  }

  if (cleanEndpoint.startsWith('/solutions/tracking/')) {
    const id = cleanEndpoint.replace('/solutions/tracking/', '');
    return (MOCK_TRACKING_STEPS[id] || MOCK_TRACKING_STEPS['rep-001']) as unknown as T;
  }

  if (cleanEndpoint === '/solutions/safe-route/hazards') {
    return MOCK_SAFE_ROUTE_HAZARDS as unknown as T;
  }

  if (cleanEndpoint === '/solutions/alerts') {
    return MOCK_PUBLIC_ALERTS as unknown as T;
  }
  if (cleanEndpoint.startsWith('/solutions/alerts/') && cleanEndpoint.endsWith('/toggle')) {
    const id = cleanEndpoint.split('/')[3];
    const alert = MOCK_PUBLIC_ALERTS.find(a => a.id === id);
    if (alert) {
      alert.is_subscribed = !alert.is_subscribed;
      alert.subscriber_count += alert.is_subscribed ? 1 : -1;
      return alert as unknown as T;
    }
    return { success: true } as unknown as T;
  }

  if (cleanEndpoint === '/solutions/overdue-cases') {
    return MOCK_OVERDUE_CASES as unknown as T;
  }
  if (cleanEndpoint.startsWith('/solutions/overdue-cases/') && cleanEndpoint.endsWith('/escalate')) {
    const id = cleanEndpoint.split('/')[3];
    const item = MOCK_OVERDUE_CASES.find(c => c.report_id === id);
    if (item) {
      item.escalation_status = 'Escalated to Zonal Commissioner';
      return item as unknown as T;
    }
    return { success: true } as unknown as T;
  }

  if (cleanEndpoint === '/solutions/accessibility-barriers') {
    if (method === 'POST') {
      let body: any = {};
      try { body = JSON.parse((options.body as string) || '{}'); } catch (e) {}
      const newBarrier: AccessibilityBarrier = {
        id: `bar-${Date.now().toString().slice(-4)}`,
        title: body.title || 'Reported Barrier',
        barrier_type: body.barrier_type || 'Broken Ramp',
        severity: body.severity || 'Moderate',
        latitude: body.latitude || 12.9716,
        longitude: body.longitude || 77.5946,
        location_name: body.location_name || 'City Pedestrian Zone',
        wheelchair_impact: body.wheelchair_impact || 'Impairs transit for wheelchair and mobility aid users.',
        reported_by: 'Active Citizen',
        status: 'Active Barrier',
      };
      MOCK_ACCESSIBILITY_BARRIERS.unshift(newBarrier);
      return newBarrier as unknown as T;
    }
    return MOCK_ACCESSIBILITY_BARRIERS as unknown as T;
  }

  if (cleanEndpoint === '/solutions/public-facilities') {
    return MOCK_PUBLIC_FACILITIES as unknown as T;
  }

  if (cleanEndpoint === '/solutions/community-events') {
    return MOCK_COMMUNITY_EVENTS as unknown as T;
  }
  if (cleanEndpoint.startsWith('/solutions/community-events/') && cleanEndpoint.endsWith('/rsvp')) {
    const id = cleanEndpoint.split('/')[3];
    const ev = MOCK_COMMUNITY_EVENTS.find(e => e.id === id);
    if (ev) {
      ev.user_registered = !ev.user_registered;
      ev.volunteers_registered += ev.user_registered ? 1 : -1;
      return ev as unknown as T;
    }
    return { success: true } as unknown as T;
  }

  if (cleanEndpoint === '/solutions/simulator/interventions') {
    return MOCK_SIMULATOR_INTERVENTIONS as unknown as T;
  }
  if (cleanEndpoint.startsWith('/solutions/simulator/interventions/') && cleanEndpoint.endsWith('/toggle')) {
    const id = cleanEndpoint.split('/')[4];
    const intv = MOCK_SIMULATOR_INTERVENTIONS.find(i => i.id === id);
    if (intv) {
      intv.selected = !intv.selected;
      return intv as unknown as T;
    }
    return { success: true } as unknown as T;
  }

  if (cleanEndpoint === '/solutions/knowledge-graph') {
    return {
      nodes: MOCK_GRAPH_NODES,
      links: MOCK_GRAPH_LINKS,
    } as unknown as T;
  }

  if (cleanEndpoint === '/solutions/ward-scores') {
    return MOCK_WARD_SCORES as unknown as T;
  }

  // 15 New Flagship Features Mock Fallbacks
  if (cleanEndpoint === '/solutions/departments') {
    return MOCK_DEPARTMENTS as unknown as T;
  }
  if (cleanEndpoint === '/solutions/tenders') {
    return MOCK_TENDERS as unknown as T;
  }
  if (cleanEndpoint === '/solutions/flood-points') {
    return MOCK_FLOOD_POINTS as unknown as T;
  }
  if (cleanEndpoint === '/solutions/road-defects') {
    return MOCK_ROAD_DEFECTS as unknown as T;
  }
  if (cleanEndpoint === '/solutions/night-safety') {
    return MOCK_NIGHT_SAFETY as unknown as T;
  }
  if (cleanEndpoint === '/solutions/water-tankers') {
    return MOCK_WATER_TANKERS as unknown as T;
  }
  if (cleanEndpoint === '/solutions/ward-sabha') {
    return MOCK_WARD_SABHA_PROPOSALS as unknown as T;
  }
  if (cleanEndpoint.startsWith('/solutions/ward-sabha/') && cleanEndpoint.endsWith('/vote')) {
    const id = cleanEndpoint.split('/')[3];
    const prop = MOCK_WARD_SABHA_PROPOSALS.find(p => p.id === id);
    if (prop) {
      prop.votes_for += 1;
      prop.user_voted = 'for';
      return prop as unknown as T;
    }
    return { success: true } as unknown as T;
  }
  if (cleanEndpoint === '/solutions/civic-pass') {
    return MOCK_CIVIC_PASS as unknown as T;
  }
  if (cleanEndpoint === '/solutions/animal-cases') {
    return MOCK_ANIMAL_CASES as unknown as T;
  }
  if (cleanEndpoint === '/solutions/noise-readings') {
    return MOCK_NOISE_READINGS as unknown as T;
  }
  if (cleanEndpoint === '/solutions/trees') {
    return MOCK_TREES as unknown as T;
  }
  if (cleanEndpoint === '/solutions/power-grid') {
    return MOCK_POWER_GRID as unknown as T;
  }
  if (cleanEndpoint === '/solutions/emergency-alerts') {
    if (method === 'POST') {
      let body: any = {};
      try { body = JSON.parse((options.body as string) || '{}'); } catch (e) {}
      const newAlert: EmergencyHazardAlert = {
        id: `sos-${Date.now().toString().slice(-4)}`,
        hazard_type: body.hazard_type || 'Live Wire / Electrocution',
        severity: body.severity || 'Immediate Danger to Life',
        location: body.location || 'Anna Nagar 2nd Avenue, near Roundtana',
        dispatched_agencies: Array.isArray(body.dispatched_agencies) && body.dispatched_agencies.length > 0
          ? body.dispatched_agencies
          : ['TANGEDCO Feeder Quick Reaction', 'TN Fire & Rescue 101', 'GCC Disaster Desk'],
        reported_by: body.reported_by || 'Citizen via Emergency Desk',
        eta_emergency_crew: body.eta_emergency_crew || '5 mins',
        status: body.status || 'Active Alert',
      };
      saveCustomEmergencyAlert(newAlert);
      return newAlert as unknown as T;
    }
    return getStoredEmergencyAlerts() as unknown as T;
  }

  // Generic fallback
  return {} as unknown as T;
}

/**
 * Robust HTTP client with automatic fallback to local demo data
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...getAuthHeaders(), ...options.headers };

  try {
    const res = await fetch(url, { ...options, headers });

    // Check if the response is valid JSON
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      // If server returned non-200, check if it returned a JSON error detail
      if (contentType.includes('application/json')) {
        let errorMsg = `API Error: ${res.statusText}`;
        try {
          const errJson = await res.json();
          // If backend returned 404 for a solution endpoint, gracefully fallback to mock data
          if (res.status === 404 && endpoint.startsWith('/solutions/')) {
            console.warn(`[CivicPulse API] Solution endpoint ${endpoint} returned 404 on backend. Falling back to local demo data.`);
            return handleMockFallback<T>(endpoint, options);
          }
          if (errJson.detail) {
            errorMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
          }
        } catch (e) {}
        throw new Error(errorMsg);
      }
      // If server returned HTML (e.g., Render 404 or bootloader page), fallback
      console.warn(`[CivicPulse API] Non-JSON response received from ${url} (${res.status}). Falling back to demo data.`);
      return handleMockFallback<T>(endpoint, options);
    }

    if (contentType.includes('application/json')) {
      return await res.json();
    }

    // In case endpoint returned OK but HTML (static server catch-all), fallback to mock
    console.warn(`[CivicPulse API] Static server catch-all detected on ${url}. Seamlessly using demo fallback.`);
    return handleMockFallback<T>(endpoint, options);

  } catch (networkError: any) {
    // If this is an explicit business logic error from the live API (e.g. 401 Incorrect password), rethrow
    if (networkError.message && networkError.message.startsWith('API Error:')) {
      throw networkError;
    }

    // Network failure (e.g. backend down, Failed to fetch, CORS blocked):
    console.info(`[CivicPulse AI] Backend is offline or unreachable at ${url}. Seamlessly activating Demo / Offline mode.`);
    return handleMockFallback<T>(endpoint, options);
  }
}

export const api = {
  // Auth
  register: (data: any) => request<User>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  googleLogin: (data: { email: string; name: string; picture?: string }) =>
    request<AuthResponse>('/auth/google', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request<User>('/auth/me'),

  // Categories & Pre-checks
  getCategories: () => request<IssueCategory[]>('/reports/categories'),
  checkSimilarity: (data: { title: string; description: string; category_id?: string }) =>
    request<CandidateMatch[]>('/reports/check-similarity', { method: 'POST', body: JSON.stringify(data) }),

  // Reports
  createReport: (data: any) => request<Report>('/reports', { method: 'POST', body: JSON.stringify(data) }),
  getReports: (params?: { category_id?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.category_id) query.append('category_id', params.category_id);
    if (params?.status) query.append('status', params.status);
    return request<Report[]>(`/reports?${query.toString()}`);
  },
  getMyReports: () => request<Report[]>('/reports/mine'),
  getReportById: (id: string) => request<Report>(`/reports/${id}`),

  // AI Match Review
  getMatchReviewQueue: () => request<ReportMatch[]>('/ai/review-queue'),
  recordMatchDecision: (matchId: string, decision: string, reason?: string) =>
    request<ReportMatch>(`/ai/matches/${matchId}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason })
    }),
  getUncertaintyItems: () => request<any[]>('/ai/uncertainty'),

  // Clusters
  getClusters: (status?: string) => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<IssueCluster[]>(`/clusters${query}`);
  },
  getClusterById: (id: string) => request<IssueCluster>(`/clusters/${id}`),
  updateClusterStatus: (clusterId: string, status: string, reason: string) =>
    request<IssueCluster>(`/clusters/${clusterId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, reason })
    }),
  getPriorityExplanation: (clusterId: string) =>
    request<PriorityExplanation>(`/clusters/${clusterId}/priority-explanation`),
  mergeClusters: (target_cluster_id: string, source_cluster_id: string, reason: string) =>
    request<IssueCluster>('/clusters/merge', {
      method: 'POST',
      body: JSON.stringify({ target_cluster_id, source_cluster_id, reason })
    }),
  splitCluster: (report_ids: string[], new_representative_title: string, reason: string) =>
    request<IssueCluster>('/clusters/split', {
      method: 'POST',
      body: JSON.stringify({ report_ids, new_representative_title, reason })
    }),

  // Recurrence
  getRecurrenceEvents: () => request<RecurrenceEvent[]>('/recurrence/events'),
  recordRecurrenceDecision: (eventId: string, decision: string, reason?: string) =>
    request<RecurrenceEvent>(`/recurrence/events/${eventId}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason })
    }),

  // Root Causes
  getRootCauses: () => request<RootCauseHypothesis[]>('/root-causes/hypotheses'),
  runRootCauseAnalysis: () => request<RootCauseHypothesis[]>('/root-causes/analyze', { method: 'POST' }),
  recordRootCauseDecision: (hypothesisId: string, decision: string, reason?: string) =>
    request<RootCauseHypothesis>(`/root-causes/hypotheses/${hypothesisId}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason })
    }),

  // Recommendations
  getClusterRecommendations: (clusterId: string) =>
    request<ResolutionRecommendation[]>(`/clusters/${clusterId}/recommendations`),
  recordRecommendationFeedback: (recommendationId: string, feedback: 'Useful' | 'Not Useful') =>
    request<ResolutionRecommendation>(`/recommendations/${recommendationId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ feedback })
    }),

  // Forecasting & Analytics
  getForecasts: (weeks = 4, category_id?: string) => {
    const query = new URLSearchParams({ weeks: weeks.toString() });
    if (category_id) query.append('category_id', category_id);
    return request<ForecastResponse>(`/analytics/forecasts?${query.toString()}`);
  },
  getAnalyticsSummary: () => request<AnalyticsSummary>('/analytics/summary'),
  getCategoryDistribution: () => request<any[]>('/analytics/categories'),
  getFairnessDistribution: () => request<any[]>('/analytics/fairness'),

  // GIS, Dispatch, SLA, Hero & Executive Features
  getGISHeatmap: () => request<any[]>('/analytics/gis-heatmap'),
  getWardStats: () => request<any[]>('/analytics/ward-stats'),
  getDispatchRoutes: () => request<any[]>('/analytics/dispatch/routes'),
  assignDispatchRoute: (route_id: string, crew_name: string) =>
    request<any>('/analytics/dispatch/assign', { method: 'POST', body: JSON.stringify({ route_id, crew_name }) }),
  getSLARiskAnalysis: () => request<any[]>('/analytics/sla-risk'),
  escalateSLA: (clusterId: string) => request<any>(`/analytics/sla-escalate/${clusterId}`, { method: 'POST' }),
  getHeroStats: () => request<any>('/analytics/hero-stats'),
  verifyPhotoResolution: (reportId: string, after_image_url: string) =>
    request<any>(`/analytics/verify-resolution/${reportId}`, {
      method: 'POST',
      body: JSON.stringify({ after_image_url })
    }),
  getExecutiveReport: () => request<any>('/analytics/executive-report'),

  // System Admin
  getUsers: () => request<User[]>('/admin/users'),
  updateUserRole: (userId: string, role: string) =>
    request<User>(`/admin/users/${userId}/role?role=${encodeURIComponent(role)}`, { method: 'PATCH' }),
  getAuditLogs: () => request<AuditLog[]>('/admin/audit-logs'),
  getModelEvaluations: () => request<ModelEvaluation>('/admin/model-evaluations'),

  // 21 CivicNexus Solutions
  getNearbyIssues: () => request<NearbyCivicIssue[]>('/solutions/nearby-issues'),
  supportNearbyIssue: (id: string) => request<NearbyCivicIssue>(`/solutions/nearby-issues/${id}/support`, { method: 'POST' }),
  getRepairProofs: () => request<RepairProofRecord[]>('/solutions/repair-proofs'),
  voteRepairProof: (report_id: string, vote: 'confirmed' | 'disputed') =>
    request<RepairProofRecord>(`/solutions/repair-proofs/${report_id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote }),
    }),
  getComplaintTracking: (id: string) => request<ComplaintTrackingStep[]>(`/solutions/tracking/${id}`),
  getSafeRouteHazards: () => request<SafeRouteHazard[]>('/solutions/safe-route/hazards'),
  getPublicAlerts: () => request<PublicServiceAlert[]>('/solutions/alerts'),
  toggleAlertSubscription: (id: string) => request<PublicServiceAlert>(`/solutions/alerts/${id}/toggle`, { method: 'POST' }),
  getOverdueCases: () => request<OverdueEscalationCase[]>('/solutions/overdue-cases'),
  escalateOverdueCase: (report_id: string) =>
    request<OverdueEscalationCase>(`/solutions/overdue-cases/${report_id}/escalate`, { method: 'POST' }),
  getAccessibilityBarriers: () => request<AccessibilityBarrier[]>('/solutions/accessibility-barriers'),
  reportAccessibilityBarrier: (data: Partial<AccessibilityBarrier>) =>
    request<AccessibilityBarrier>('/solutions/accessibility-barriers', { method: 'POST', body: JSON.stringify(data) }),
  getPublicFacilities: () => request<PublicFacility[]>('/solutions/public-facilities'),
  getCommunityEvents: () => request<CommunityEvent[]>('/solutions/community-events'),
  toggleEventRSVP: (id: string) => request<CommunityEvent>(`/solutions/community-events/${id}/rsvp`, { method: 'POST' }),
  getSimulatorInterventions: () => request<SimulatorIntervention[]>('/solutions/simulator/interventions'),
  toggleSimulatorIntervention: (id: string) =>
    request<SimulatorIntervention>(`/solutions/simulator/interventions/${id}/toggle`, { method: 'POST' }),
  getKnowledgeGraphData: () => request<{ nodes: CivicGraphNode[]; links: CivicGraphLink[] }>('/solutions/knowledge-graph'),
  getWardAccountabilityScores: () => request<WardAccountabilityScore[]>('/solutions/ward-scores'),

  // 15 New Flagship Civic Features
  getDepartments: () => request<CivicDepartmentInfo[]>('/solutions/departments'),
  getTenders: () => request<WardTenderContract[]>('/solutions/tenders'),
  getFloodPoints: () => request<FloodRescuePoint[]>('/solutions/flood-points'),
  getRoadDefects: () => request<DetectedRoadDefect[]>('/solutions/road-defects'),
  getNightSafety: () => request<NightSafetyLocation[]>('/solutions/night-safety'),
  getWaterTankers: () => request<WaterTankerStatus[]>('/solutions/water-tankers'),
  getWardSabhaProposals: () => request<WardSabhaVotingProposal[]>('/solutions/ward-sabha'),
  voteWardSabhaProposal: (id: string, vote: 'for' | 'against') =>
    request<WardSabhaVotingProposal>(`/solutions/ward-sabha/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ vote }),
    }),
  getCivicPass: () => request<CivicPassRecord>('/solutions/civic-pass'),
  getAnimalCases: () => request<AnimalRescueReport[]>('/solutions/animal-cases'),
  getNoiseReadings: () => request<NoisePollutionReading[]>('/solutions/noise-readings'),
  getTrees: () => request<UrbanTreeItem[]>('/solutions/trees'),
  getPowerGrid: () => request<PowerSubstationRadar[]>('/solutions/power-grid'),
  getEmergencyAlerts: () => request<EmergencyHazardAlert[]>('/solutions/emergency-alerts'),
  triggerEmergencySOS: (data: Partial<EmergencyHazardAlert>) =>
    request<EmergencyHazardAlert>('/solutions/emergency-alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  supportReport: (reportId: string) => {
    try {
      const all = getStoredReports();
      const found = all.find((r) => r.id === reportId);
      if (found) {
        found.impact = Math.min(10, (found.impact || 3) + 1);
        found.urgency = Math.min(10, (found.urgency || 3) + 1);
        saveCustomReport(found);
      }
    } catch (e) {}
    return Promise.resolve({ success: true, message: 'Existing complaint upvoted and prioritized.' });
  },
};

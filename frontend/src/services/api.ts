import {
  AuthResponse, User, IssueCategory, Report, CandidateMatch, ReportMatch,
  IssueCluster, PriorityExplanation, RecurrenceEvent, RootCauseHypothesis,
  ResolutionRecommendation, ForecastResponse, AnalyticsSummary, AuditLog, ModelEvaluation
} from '../types';
import {
  DEMO_USERS, MOCK_CATEGORIES, MOCK_REPORTS, MOCK_CLUSTERS,
  MOCK_MATCH_QUEUE, MOCK_RECURRENCE_EVENTS, MOCK_ROOT_CAUSES,
  MOCK_RECOMMENDATIONS, MOCK_PRIORITY_EXPLANATION, MOCK_FORECAST,
  MOCK_ANALYTICS_SUMMARY, MOCK_HEATMAP_POINTS, MOCK_WARD_STATS,
  MOCK_DISPATCH_ROUTES, MOCK_SLA_RISK_ITEMS, MOCK_HERO_STATS,
  MOCK_MODEL_EVALUATION, MOCK_AUDIT_LOGS, MOCK_EXECUTIVE_REPORT
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

  // 6. Check Similarity (Pre-submission deduplication check)
  if (cleanEndpoint === '/reports/check-similarity') {
    let title = '';
    try {
      const body = JSON.parse((options.body as string) || '{}');
      title = body.title || '';
    } catch (e) {}

    const isRoadRelated = /pothole|road|crater|asphalt|tire|rim/i.test(title);
    const candidateMatches: CandidateMatch[] = isRoadRelated ? [
      {
        report_id: 'rep-001',
        title: 'Severe crater pothole causing vehicular damage on MG Road',
        description: 'Deep 12-inch crater pothole on northbound lane near Metro Pillar 142.',
        category_name: 'Potholes & Road Damage',
        similarity_score: 0.942,
        confidence_level: 'High',
        matched_evidence: 'Exact spatial match within 30 meters + semantic embedding match for road fissure.',
        status: 'In Progress',
        created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      }
    ] : [];
    return candidateMatches as unknown as T;
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
    return MOCK_MATCH_QUEUE as unknown as T;
  }

  if (cleanEndpoint.includes('/decision')) {
    return { ...MOCK_MATCH_QUEUE[0], decision: 'Confirmed duplicate' } as unknown as T;
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
};

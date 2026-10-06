import {
  AuthResponse, User, IssueCategory, Report, CandidateMatch, ReportMatch,
  IssueCluster, PriorityExplanation, RecurrenceEvent, RootCauseHypothesis,
  ResolutionRecommendation, ForecastResponse, AnalyticsSummary, AuditLog, ModelEvaluation
} from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'https://civicpulse-ai-wz82.onrender.com/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('civicpulse_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...getAuthHeaders(), ...options.headers };
  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    let errorMsg = `API Error: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        errorMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch (e) {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return res.json();
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


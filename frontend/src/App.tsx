import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { SubmitReportPage } from './pages/SubmitReportPage';
import { ReportDetailsPage } from './pages/ReportDetailsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AIMatchReviewPage } from './pages/AIMatchReviewPage';
import { ClusterManagementPage } from './pages/ClusterManagementPage';
import { RootCauseDiscoveryPage } from './pages/RootCauseDiscoveryPage';
import { ResolutionRecommendationsPage } from './pages/ResolutionRecommendationsPage';
import { ForecastingPage } from './pages/ForecastingPage';
import { ConfidenceFairnessPage } from './pages/ConfidenceFairnessPage';
import { SystemAdminPage } from './pages/SystemAdminPage';
import { GISHeatmapPage } from './pages/GISHeatmapPage';
import { FieldDispatchPage } from './pages/FieldDispatchPage';
import { SLARiskPage } from './pages/SLARiskPage';
import { TransparencyHeroPage } from './pages/TransparencyHeroPage';
import { ExecutiveReportPage } from './pages/ExecutiveReportPage';

// 21 CivicNexus Solutions New Feature Pages
import { NearbyProblemsMapPage } from './pages/NearbyProblemsMapPage';
import { TamilVoiceAssistantPage } from './pages/TamilVoiceAssistantPage';
import { RepairProofPage } from './pages/RepairProofPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { SafeRoutePage } from './pages/SafeRoutePage';
import { PublicServiceAlertsPage } from './pages/PublicServiceAlertsPage';
import { AccessibilityMapperPage } from './pages/AccessibilityMapperPage';
import { PublicHelpFinderPage } from './pages/PublicHelpFinderPage';
import { CommunityActionPage } from './pages/CommunityActionPage';
import { OfflineReportingPage } from './pages/OfflineReportingPage';
import { OverdueEscalationPage } from './pages/OverdueEscalationPage';
import { CivicSimulatorPage } from './pages/CivicSimulatorPage';
import { CivicKnowledgeGraphPage } from './pages/CivicKnowledgeGraphPage';
import { CivicImpactAnalyticsPage } from './pages/CivicImpactAnalyticsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return <div className="py-20 text-center text-slate-500 font-medium">Checking authorization...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/gis-heatmap" element={<GISHeatmapPage />} />

              {/* 21 CivicNexus Solutions Accessible Routes */}
              <Route path="/nearby-map" element={<NearbyProblemsMapPage />} />
              <Route path="/voice-assistant" element={<TamilVoiceAssistantPage />} />
              <Route path="/repair-proof" element={<RepairProofPage />} />
              <Route path="/tracking/:id" element={<LiveTrackingPage />} />
              <Route path="/safe-route" element={<SafeRoutePage />} />
              <Route path="/public-alerts" element={<PublicServiceAlertsPage />} />
              <Route path="/accessibility" element={<AccessibilityMapperPage />} />
              <Route path="/public-help" element={<PublicHelpFinderPage />} />
              <Route path="/community" element={<CommunityActionPage />} />
              <Route path="/offline-reports" element={<OfflineReportingPage />} />
              <Route path="/escalations" element={<OverdueEscalationPage />} />
              <Route path="/simulator" element={<CivicSimulatorPage />} />
              <Route path="/knowledge-graph" element={<CivicKnowledgeGraphPage />} />
              <Route path="/impact-scorecard" element={<CivicImpactAnalyticsPage />} />

              {/* Citizen Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <CitizenDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hero-transparency"
                element={
                  <ProtectedRoute>
                    <TransparencyHeroPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/submit-report"
                element={
                  <ProtectedRoute>
                    <SubmitReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports/:id"
                element={
                  <ProtectedRoute>
                    <ReportDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Municipal Admin Intelligence Routes */}
              <Route
                path="/field-dispatch"
                element={
                  <ProtectedRoute adminOnly>
                    <FieldDispatchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sla-risk"
                element={
                  <ProtectedRoute adminOnly>
                    <SLARiskPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/executive-report"
                element={
                  <ProtectedRoute adminOnly>
                    <ExecutiveReportPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/match-review"
                element={
                  <ProtectedRoute adminOnly>
                    <AIMatchReviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/clusters"
                element={
                  <ProtectedRoute adminOnly>
                    <ClusterManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/root-causes"
                element={
                  <ProtectedRoute adminOnly>
                    <RootCauseDiscoveryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/recommendations"
                element={
                  <ProtectedRoute adminOnly>
                    <ResolutionRecommendationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/forecasting"
                element={
                  <ProtectedRoute adminOnly>
                    <ForecastingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/confidence-fairness"
                element={
                  <ProtectedRoute adminOnly>
                    <ConfidenceFairnessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/system"
                element={
                  <ProtectedRoute adminOnly>
                    <SystemAdminPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

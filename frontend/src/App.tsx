import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LiveTelemetryBar } from './components/common/LiveTelemetryBar';
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

// 21 Civic Solutions Existing Pages
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

// 15 Flagship Municipal Features Pages
import { DepartmentDirectoryPage } from './pages/DepartmentDirectoryPage';
import { WhatsAppBotSimulatorPage } from './pages/WhatsAppBotSimulatorPage';
import { MonsoonFloodDeskPage } from './pages/MonsoonFloodDeskPage';
import { WardTenderContractorPage } from './pages/WardTenderContractorPage';
import { AIRoadDefectScannerPage } from './pages/AIRoadDefectScannerPage';
import { NightSafetyRadarPage } from './pages/NightSafetyRadarPage';
import { DialATankerRadarPage } from './pages/DialATankerRadarPage';
import { DigitalWardSabhaPage } from './pages/DigitalWardSabhaPage';
import { CivicPassKarmaPage } from './pages/CivicPassKarmaPage';
import { StrayAnimalRescuePage } from './pages/StrayAnimalRescuePage';
import { StreetNoiseMonitorPage } from './pages/StreetNoiseMonitorPage';
import { UrbanTreeGuardianPage } from './pages/UrbanTreeGuardianPage';
import { PowerSubstationRadarPage } from './pages/PowerSubstationRadarPage';
import { EmergencyHazardDeskPage } from './pages/EmergencyHazardDeskPage';

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
          {/* Global Real-Time Incident Telemetry & Ticker */}
          <LiveTelemetryBar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/gis-heatmap" element={<GISHeatmapPage />} />

              {/* 15 Flagship Municipal Feature Routes */}
              <Route path="/departments" element={<DepartmentDirectoryPage />} />
              <Route path="/whatsapp-bot" element={<WhatsAppBotSimulatorPage />} />
              <Route path="/flood-desk" element={<MonsoonFloodDeskPage />} />
              <Route path="/tenders" element={<WardTenderContractorPage />} />
              <Route path="/road-scanner" element={<AIRoadDefectScannerPage />} />
              <Route path="/night-safety" element={<NightSafetyRadarPage />} />
              <Route path="/water-tanker" element={<DialATankerRadarPage />} />
              <Route path="/ward-sabha" element={<DigitalWardSabhaPage />} />
              <Route path="/civic-pass" element={<CivicPassKarmaPage />} />
              <Route path="/animal-rescue" element={<StrayAnimalRescuePage />} />
              <Route path="/noise-monitor" element={<StreetNoiseMonitorPage />} />
              <Route path="/tree-guardian" element={<UrbanTreeGuardianPage />} />
              <Route path="/power-grid" element={<PowerSubstationRadarPage />} />
              <Route path="/emergency-sos" element={<EmergencyHazardDeskPage />} />

              {/* 21 Civic Solutions Existing Routes */}
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

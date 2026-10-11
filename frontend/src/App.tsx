import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
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

import { RoleAccessGate } from './components/common/RoleAccessGate';

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

              {/* 15 Flagship Municipal Feature Routes with RBAC Enforcement */}
              <Route path="/departments" element={<DepartmentDirectoryPage />} />
              <Route path="/whatsapp-bot" element={<WhatsAppBotSimulatorPage />} />

              {/* Restricted: Officer Only */}
              <Route
                path="/flood-desk"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer']}
                    featureName="Monsoon Flood & Stormwater Drain Desk (#2)"
                    departmentName="Greater Chennai Corporation — Stormwater Drainage (SWD) Wing"
                    featureCode="SWD-02"
                    reason="SCADA dewatering pump controls, flood sensor telemetry, and relief camp logistics are restricted to designated Assistant Engineers and Nodal Officers under GCC Disaster Management Bylaws."
                  >
                    <MonsoonFloodDeskPage />
                  </RoleAccessGate>
                }
              />

              {/* Restricted: Contractor Only */}
              <Route
                path="/tenders"
                element={
                  <RoleAccessGate
                    allowedRoles={['contractor']}
                    featureName="Ward Tenders & Defect Liability Tracker (#3)"
                    departmentName="GCC Works Department & Infrastructure Wing"
                    featureCode="WORKS-03"
                    reason="Public infrastructure contract bidding, milestone billing, and defect liability retention funds are strictly restricted to verified municipal engineering contractors."
                  >
                    <WardTenderContractorPage />
                  </RoleAccessGate>
                }
              />

              {/* Restricted: Contractor & Officer */}
              <Route
                path="/road-scanner"
                element={
                  <RoleAccessGate
                    allowedRoles={['contractor', 'department_officer']}
                    featureName="AI Road Defect Scanner & Roughness Index (#4)"
                    departmentName="Highways Department & GCC Bus Route Roads Wing"
                    featureCode="HW-04"
                    reason="Automated road surface International Roughness Index (IRI) calculation and asphalt milling dispatch require certified field engineer credentials."
                  >
                    <AIRoadDefectScannerPage />
                  </RoleAccessGate>
                }
              />

              <Route path="/night-safety" element={<NightSafetyRadarPage />} />
              <Route path="/water-tanker" element={<DialATankerRadarPage />} />
              <Route path="/ward-sabha" element={<DigitalWardSabhaPage />} />
              <Route path="/civic-pass" element={<CivicPassKarmaPage />} />
              <Route path="/animal-rescue" element={<StrayAnimalRescuePage />} />
              <Route path="/noise-monitor" element={<StreetNoiseMonitorPage />} />
              <Route path="/tree-guardian" element={<UrbanTreeGuardianPage />} />

              {/* Restricted: Officer Only */}
              <Route
                path="/power-grid"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer']}
                    featureName="Substation Feeder & Transformer SCADA Radar (#12)"
                    departmentName="TANGEDCO — Electrical Grid Distribution Circle"
                    featureCode="TNEB-12"
                    reason="High-voltage substation feeder trip diagnostics, transformer load telemetry, and emergency shutdown switches are strictly restricted to licensed electrical engineers."
                  >
                    <PowerSubstationRadarPage />
                  </RoleAccessGate>
                }
              />

              <Route path="/emergency-sos" element={<EmergencyHazardDeskPage />} />

              {/* 21 Civic Features Routes */}
              <Route path="/nearby-map" element={<NearbyProblemsMapPage />} />
              <Route path="/voice-assistant" element={<TamilVoiceAssistantPage />} />
              <Route path="/repair-proof" element={<RepairProofPage />} />
              <Route path="/tracking/:id" element={<LiveTrackingPage />} />
              <Route path="/safe-route" element={<SafeRoutePage />} />
              <Route path="/public-alerts" element={<PublicServiceAlertsPage />} />
              <Route path="/accessibility" element={<AccessibilityMapperPage />} />
              <Route path="/public-help" element={<PublicHelpFinderPage />} />
              <Route path="/community" element={<CommunityActionPage />} />
              <Route
                path="/escalations"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer', 'administrator']}
                    featureName="Statutory Grievance Escalation & Overdue Desk (#12)"
                    departmentName="Chief Minister Grievance & GCC Vigilance Cell"
                    featureCode="ESC-12"
                    reason="Statutory penalty issuance, cross-departmental grievance reassignment, and SLA breach escalations are strictly restricted to municipal departmental officers."
                  >
                    <OverdueEscalationPage />
                  </RoleAccessGate>
                }
              />

              {/* Restricted: Officer / Planner Only */}
              <Route
                path="/simulator"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer']}
                    featureName="Civic What-If Infrastructure Simulator (#18)"
                    departmentName="Municipal Urban Planning & Finance Cell"
                    featureCode="SIM-18"
                    reason="Capital budget reallocation modeling and systemic infrastructure intervention simulation are restricted to municipal planning officers."
                  >
                    <CivicSimulatorPage />
                  </RoleAccessGate>
                }
              />

              {/* Restricted: Officer / Analyst Only */}
              <Route
                path="/knowledge-graph"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer']}
                    featureName="Civic Knowledge Graph & Recurrence Network (#20)"
                    departmentName="Smart City IT & Urban Data Analytics Cell"
                    featureCode="GRAPH-20"
                    reason="Deep systemic failure correlation graphs linking contractors, recurring geographic defects, and department performance are restricted to municipal analysts."
                  >
                    <CivicKnowledgeGraphPage />
                  </RoleAccessGate>
                }
              />

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

              {/* Municipal Admin & Officer Intelligence Routes */}
              <Route
                path="/field-dispatch"
                element={
                  <RoleAccessGate
                    allowedRoles={['contractor', 'department_officer']}
                    featureName="Field Crew Route Optimizer & Dispatch Desk"
                    departmentName="GCC Works & Field Operations Center"
                    featureCode="DISPATCH-01"
                    reason="Field crew real-time dispatching and route optimization tools are restricted to field contractors and dispatch supervisors."
                  >
                    <FieldDispatchPage />
                  </RoleAccessGate>
                }
              />
              <Route
                path="/sla-risk"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer']}
                    featureName="SLA Breach Risk & Urgency Matrix"
                    departmentName="Integrated Municipal Command Center"
                    featureCode="RISK-02"
                    reason="Dynamic priority radar scoring and automated breach mitigation are restricted to municipal departmental officers."
                  >
                    <SLARiskPage />
                  </RoleAccessGate>
                }
              />
              <Route
                path="/executive-report"
                element={
                  <RoleAccessGate
                    allowedRoles={['administrator']}
                    featureName="Executive ESG & Municipal Performance Report"
                    departmentName="Chief Minister Grievance & GCC Leadership"
                    featureCode="ESG-01"
                    reason="Executive mayoral briefs, budget audits, and contractor penalty assessments are restricted to Zonal Commissioners and System Administrators."
                  >
                    <ExecutiveReportPage />
                  </RoleAccessGate>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer', 'administrator']}
                    featureName="Municipal Command & Operations Dashboard"
                    departmentName="Municipal Administration"
                    featureCode="ADMIN-01"
                    reason="Citywide operational command and triaging console is restricted to departmental officers and administrators."
                  >
                    <AdminDashboard />
                  </RoleAccessGate>
                }
              />
              <Route
                path="/admin/match-review"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer', 'administrator']}
                    featureName="AI Duplicate Match Review Queue"
                    departmentName="GCC Grievance Cell"
                    featureCode="AI-MATCH"
                  >
                    <AIMatchReviewPage />
                  </RoleAccessGate>
                }
              />
              <Route
                path="/admin/clusters"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer', 'administrator']}
                    featureName="Civic Memory Cluster Manager"
                    departmentName="Urban Analytics Wing"
                    featureCode="AI-CLUSTER"
                  >
                    <ClusterManagementPage />
                  </RoleAccessGate>
                }
              />
              <Route
                path="/admin/root-causes"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer', 'administrator']}
                    featureName="Root-Cause Discovery Engine"
                    departmentName="Municipal Engineering Division"
                    featureCode="AI-ROOT"
                  >
                    <RootCauseDiscoveryPage />
                  </RoleAccessGate>
                }
              />
              <Route
                path="/admin/recommendations"
                element={
                  <RoleAccessGate
                    allowedRoles={['department_officer', 'administrator']}
                    featureName="Resolution Recommendation System"
                    departmentName="Municipal Engineering Division"
                    featureCode="AI-REC"
                  >
                    <ResolutionRecommendationsPage />
                  </RoleAccessGate>
                }
              />
              <Route
                path="/admin/forecasting"
                element={
                  <RoleAccessGate
                    allowedRoles={['administrator']}
                    featureName="Civic Volume & Incident Forecasting"
                    departmentName="Smart City Planning Directorate"
                    featureCode="AI-FORECAST"
                  >
                    <ForecastingPage />
                  </RoleAccessGate>
                }
              />
              <Route
                path="/admin/confidence-fairness"
                element={
                  <RoleAccessGate
                    allowedRoles={['administrator']}
                    featureName="Algorithmic Confidence & Ward Fairness Audit"
                    departmentName="Civic AI Ethics Committee"
                    featureCode="AI-ETHICS"
                  >
                    <ConfidenceFairnessPage />
                  </RoleAccessGate>
                }
              />
              <Route
                path="/admin/system"
                element={
                  <RoleAccessGate
                    allowedRoles={['administrator', 'system_admin']}
                    featureName="System Administration & Security Console"
                    departmentName="Directorate of e-Governance"
                    featureCode="SYS-ADMIN"
                  >
                    <SystemAdminPage />
                  </RoleAccessGate>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <Analytics />
    </AuthProvider>
  );
};

export default App;

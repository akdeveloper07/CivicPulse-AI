import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ShieldCheck, HelpCircle, AlertTriangle,
  FileCheck, MapPin, Building2, ExternalLink, Activity, Radio,
  Compass, Shield, CheckCircle2, Waves, Eye, Plus, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface FeatureItem {
  id: number;
  name: string;
  category: 'Citizen Services' | 'Accountability & Trust' | 'AI Intelligence' | 'Governance';
  targetRole: string;
  allowedRoles: ('citizen' | 'volunteer' | 'contractor' | 'department_officer' | 'admin')[];
  department: string;
  description: string;
  link: string;
  badge: string;
  icon: any;
}

export const CIVIC_FEATURES: FeatureItem[] = [
  {
    id: 1,
    name: 'Smart Civic Report',
    category: 'Citizen Services',
    targetRole: 'Citizen',
    allowedRoles: ['citizen', 'volunteer', 'admin'],
    department: 'Greater Chennai Corporation (GCC)',
    description: 'One-tap reporting with photo, GPS auto-detect, AI category suggestion, and real-time duplicate pre-screening.',
    link: '/submit-report',
    badge: 'Pre-Screening AI',
    icon: Plus,
  },
  {
    id: 2,
    name: 'Nearby Problems Map',
    category: 'Citizen Services',
    targetRole: 'Citizen',
    allowedRoles: ['citizen', 'volunteer', 'department_officer', 'admin'],
    department: 'Smart City GIS Cell',
    description: 'Interactive neighbourhood radar map showing reported issues with category filters and 1-click support.',
    link: '/nearby-map',
    badge: 'Radar & Support',
    icon: MapPin,
  },
  {
    id: 3,
    name: 'RepairProof',
    category: 'Accountability & Trust',
    targetRole: 'Citizen / Contractor / Officer',
    allowedRoles: ['citizen', 'contractor', 'department_officer', 'admin'],
    department: 'Works & Quality Control Wing',
    description: 'Before & after evidence verification slider, citizen confirmation ("Fixed" vs "Disputed"), and AI audit flagging.',
    link: '/repair-proof',
    badge: 'Evidence Slider',
    icon: FileCheck,
  },
  {
    id: 4,
    name: 'Tamil Voice Assistant',
    category: 'Citizen Services',
    targetRole: 'Citizen (Accessible)',
    allowedRoles: ['citizen', 'volunteer', 'admin'],
    department: 'Citizen Service Centers',
    description: 'Bilingual speech-to-text voice reporting in Tamil (வணக்கம்) & English, speech synthesis, and automatic complaint drafting.',
    link: '/voice-assistant',
    badge: 'Bilingual Speech',
    icon: Compass,
  },
  {
    id: 5,
    name: 'Live Status Tracking',
    category: 'Accountability & Trust',
    targetRole: 'Citizen / Officer',
    allowedRoles: ['citizen', 'contractor', 'department_officer', 'admin'],
    department: 'All 8 Municipal Wings',
    description: '5-stage complaint lifecycle (Submitted → Under Review → Assigned → In Progress → Resolved) with timestamps.',
    link: '/tracking/rep-001',
    badge: '5-Stage SLA',
    icon: Activity,
  },
  {
    id: 6,
    name: 'Civic Memory AI',
    category: 'AI Intelligence',
    targetRole: 'Municipal Officer / Admin',
    allowedRoles: ['department_officer', 'admin'],
    department: 'Urban Data Analytics Cell',
    description: 'Historical analysis uncovering recurring problems at the exact same location and chronic failure alerts.',
    link: '/admin/clusters',
    badge: 'Recurrence Memory',
    icon: ShieldCheck,
  },
  {
    id: 7,
    name: 'Civic Risk Radar',
    category: 'AI Intelligence',
    targetRole: 'Command Center & Zonal Commissioner',
    allowedRoles: ['department_officer', 'admin'],
    department: 'Disaster Management & Grievance Cell',
    description: 'Explainable, multi-factor priority scoring based on safety risk, school zone proximity, and population density.',
    link: '/sla-risk',
    badge: 'Formula-Based AI',
    icon: AlertTriangle,
  },
  {
    id: 8,
    name: 'RootCause AI',
    category: 'AI Intelligence',
    targetRole: 'Assistant Engineer & Dept Head',
    allowedRoles: ['department_officer', 'admin'],
    department: 'Engineering Vigilance Wing',
    description: 'Uncovers underlying systemic triggers like water pipe leaks eroding road sub-base before surfacing as potholes.',
    link: '/root-causes',
    badge: 'Causal Graph',
    icon: Compass,
  },
  {
    id: 9,
    name: 'Multimodal Assistant',
    category: 'Citizen Services',
    targetRole: 'Citizen',
    allowedRoles: ['citizen', 'volunteer', 'admin'],
    department: 'Public Grievance Cell',
    description: 'Cross-modal assistant supporting voice input, photo uploads, and conversational grievance registration.',
    link: '/voice-assistant',
    badge: 'Voice + Vision',
    icon: Sparkles,
  },
  {
    id: 10,
    name: 'SafeRoute Civic AI',
    category: 'Citizen Services',
    targetRole: 'Pedestrians, Women & Cyclists',
    allowedRoles: ['citizen', 'volunteer', 'admin'],
    department: 'Traffic Planning & Police Liaison',
    description: 'Interactive navigation avoiding reported dark stretches, flooding underpasses, open manholes, and stray cattle.',
    link: '/safe-route',
    badge: 'Hazard-Free Nav',
    icon: MapPin,
  },
  {
    id: 11,
    name: 'Public-Service Alerts',
    category: 'Citizen Services',
    targetRole: 'All Ward Residents',
    allowedRoles: ['citizen', 'volunteer', 'contractor', 'department_officer', 'admin'],
    department: 'District Collectorate & Municipal PRO',
    description: 'Verified public notices for water maintenance cutoffs, scheduled power shutdowns, and monsoon relief camps.',
    link: '/public-alerts',
    badge: 'Verified Notices',
    icon: Radio,
  },
  {
    id: 12,
    name: 'Statutory Overdue Escalation',
    category: 'Governance',
    targetRole: 'Vigilance Officer & Ombudsman',
    allowedRoles: ['department_officer', 'admin'],
    department: 'Chief Minister Grievance Cell',
    description: 'Automatic algorithmic escalation when grievances exceed mandated Citizen Charter SLA deadlines.',
    link: '/escalations',
    badge: 'SLA Enforcement',
    icon: Shield,
  },
  {
    id: 13,
    name: 'Accessibility Mapper',
    category: 'Citizen Services',
    targetRole: 'Differently-Abled & Senior Citizens',
    allowedRoles: ['citizen', 'volunteer', 'admin'],
    department: 'Social Welfare & Disability Rights',
    description: 'Maps wheelchair ramp availability, tactile paving breaks, audible signal defects, and pedestrian barriers.',
    link: '/accessibility',
    badge: 'Inclusion GIS',
    icon: Compass,
  },
  {
    id: 14,
    name: 'Public Help Finder',
    category: 'Citizen Services',
    targetRole: 'Residents & New Migrants',
    allowedRoles: ['citizen', 'volunteer', 'admin'],
    department: 'Public Health & Social Welfare',
    description: 'Locate public facilities including Urban Primary Health Centers (UPHC), night shelters, and water ATMs.',
    link: '/public-help',
    badge: 'Civic Amenities',
    icon: HelpCircle,
  },
  {
    id: 15,
    name: 'Community Action Matcher',
    category: 'Citizen Services',
    targetRole: 'Ward Volunteer & Citizen',
    allowedRoles: ['volunteer', 'citizen', 'admin'],
    department: 'Ward Volunteer Network & Parks',
    description: 'Verified citizen engagement hub for community cleanups, tree plantations, and civic volunteering.',
    link: '/community',
    badge: 'Volunteering',
    icon: Users,
  },
  {
    id: 16,
    name: 'Offline-First Reporting',
    category: 'Citizen Services',
    targetRole: 'Citizen in Low-Network Zones',
    allowedRoles: ['citizen', 'volunteer', 'contractor', 'department_officer', 'admin'],
    department: 'Digital Governance Cell',
    description: 'Offline queue that buffers reports when disconnected and auto-uploads when internet returns.',
    link: '/offline-reports',
    badge: 'Offline Sync Queue',
    icon: Compass,
  },
  {
    id: 17,
    name: 'Follow-up RTI Assistant',
    category: 'Accountability & Trust',
    targetRole: 'Citizen',
    allowedRoles: ['citizen', 'volunteer', 'admin'],
    department: 'RTI & Legal Cell',
    description: 'Automated timeline case assistant generating formal RTI inquiry letters for unresolved grievances.',
    link: '/escalations#rti',
    badge: 'RTI Generator',
    icon: FileCheck,
  },
  {
    id: 18,
    name: 'Civic What-If Simulator',
    category: 'AI Intelligence',
    targetRole: 'Administrator & Officers',
    allowedRoles: ['admin', 'department_officer'],
    department: 'Municipal Finance & Planning',
    description: 'Scenario planning sandbox simulating infrastructure interventions with projected impact & ROI.',
    link: '/simulator',
    badge: 'Policy Sandbox',
    icon: Compass,
  },
  {
    id: 19,
    name: 'Photo Change Detector',
    category: 'Accountability & Trust',
    targetRole: 'Contractor & Audit Officers',
    allowedRoles: ['contractor', 'department_officer', 'admin'],
    department: 'Engineering Vigilance Wing',
    description: 'Visual difference inspection tool comparing before and after photos, highlighting asphalt repairs.',
    link: '/repair-proof#detector',
    badge: 'Visual Difference AI',
    icon: Eye,
  },
  {
    id: 20,
    name: 'Civic Knowledge Graph',
    category: 'AI Intelligence',
    targetRole: 'Administrator & Analysts',
    allowedRoles: ['admin', 'department_officer'],
    department: 'IT & Smart Governance Cell',
    description: 'Interactive node-link graph connecting places, issues, contractors, and recurring failure clusters.',
    link: '/knowledge-graph',
    badge: 'Interactive Graph',
    icon: Compass,
  },
  {
    id: 21,
    name: 'Civic Impact Analytics',
    category: 'Governance',
    targetRole: 'All Users & Leadership',
    allowedRoles: ['citizen', 'volunteer', 'contractor', 'department_officer', 'admin'],
    department: 'Chief Minister Grievance & GCC',
    description: 'Public accountability scorecard displaying response times, SLA adherence, and department rankings.',
    link: '/impact-scorecard',
    badge: 'Ward Scorecards',
    icon: Activity,
  },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-slate-900 via-navy-900 to-slate-900 text-white rounded-3xl shadow-xl mx-4 sm:mx-6 lg:mx-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.25),transparent_50%)] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-500 opacity-40 blur-xl group-hover:opacity-75 transition duration-500" />
              <img
                src="/logo-icon.png"
                alt="CivicNexus AI Emblem"
                className="relative w-28 h-28 sm:w-36 sm:h-36 object-contain rounded-2xl bg-[#011023] p-2 shadow-2xl border border-teal-500/40 hover:scale-105 transition-transform"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-teal-400" />
            CivicNexus AI · Next-Generation Urban Governance Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Connecting Citizens.<br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Improving Communities.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Report hazards with instant GPS accuracy, get verified answers to local civic rules with Ask My Locality, detect flooding spikes with Neighbourhood Early Warning AI, and audit repairs with RepairProof.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/submit-report"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-base"
            >
              Report a Civic Issue <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/ask-locality"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-teal-200 border border-teal-500/30 font-semibold backdrop-blur-md transition-all text-base"
            >
              <HelpCircle className="w-5 h-5 text-teal-400" />
              Ask My Locality
            </Link>

            <Link
              to="/early-warning"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold backdrop-blur-md transition-all text-base"
            >
              <Radio className="w-5 h-5 text-rose-400" />
              Early Warning AI
            </Link>

            {user ? (
              <Link
                to={user.role === 'citizen' ? '/dashboard' : '/admin/dashboard'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all text-base"
              >
                Open Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all text-base"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Modern Spotlight Cards for Key Civic Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Core Civic Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
            Intelligent Solutions for Residents & City Teams
          </h2>
          <p className="text-sm text-slate-500">
            Direct access to verified municipal rules, emergency anomaly detection, and transparent repair proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {/* Card 1: Ask My Locality */}
          <div className="glass-panel p-6 rounded-3xl border border-teal-200 bg-white shadow-md hover:shadow-xl hover:border-teal-400 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                Verified Directory
              </span>
              <h3 className="font-extrabold text-lg text-navy-900 group-hover:text-teal-700 transition-colors">
                Ask My Locality
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ask “Where can I report a blocked drain?” or “Which office handles streetlights?” Answers from verified bylaws with source citations.
              </p>
            </div>
            <Link
              to="/ask-locality"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:text-teal-700 hover:underline pt-2 border-t border-slate-100"
            >
              <span>Ask a Question</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Neighbourhood Early Warning AI */}
          <div className="glass-panel p-6 rounded-3xl border border-rose-200 bg-white shadow-md hover:shadow-xl hover:border-rose-400 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Waves className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                High Impact AI
              </span>
              <h3 className="font-extrabold text-lg text-navy-900 group-hover:text-rose-700 transition-colors">
                Early Warning AI
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Detect abnormal spikes in reports of flooding, transmission water leaks, and road cavities to alert nearby residents with actionable advice.
              </p>
            </div>
            <Link
              to="/early-warning"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:text-rose-700 hover:underline pt-2 border-t border-slate-100"
            >
              <span>View Live Hazard Spikes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: RepairProof Evidence Verification */}
          <div className="glass-panel p-6 rounded-3xl border border-indigo-200 bg-white shadow-md hover:shadow-xl hover:border-indigo-400 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                Accountability
              </span>
              <h3 className="font-extrabold text-lg text-navy-900 group-hover:text-indigo-700 transition-colors">
                RepairProof & Vision AI
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before & after evidence slider with AI structural difference detection. Citizens audit repairs and confirm "Fixed" vs "Disputed".
              </p>
            </div>
            <Link
              to="/repair-proof"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:text-indigo-700 hover:underline pt-2 border-t border-slate-100"
            >
              <span>Explore Proof Slider</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 4: High-Accuracy GPS Reporting */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-200 bg-white shadow-md hover:shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                1-Tap Reporting
              </span>
              <h3 className="font-extrabold text-lg text-navy-900 group-hover:text-emerald-700 transition-colors">
                Smart Civic Report
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Report civic hazards with real device coordinates, photo upload to cloud storage, and automated duplicate issue pre-screening.
              </p>
            </div>
            <Link
              to="/submit-report"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 group-hover:text-emerald-700 hover:underline pt-2 border-t border-slate-100"
            >
              <span>Submit a Hazard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dedicated Directory Callout Banner */}
        <div className="pt-6">
          <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Governance & Administration
              </span>
              <h4 className="text-base font-bold">
                Looking for the Complete 21 Civic Features & Role Matrix?
              </h4>
              <p className="text-xs text-slate-300">
                Explore the dedicated operating directory covering all 21 modules, department workflows, and role permissions.
              </p>
            </div>
            <Link
              to="/features-directory"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shrink-0 shadow-md transition-all flex items-center gap-2"
            >
              <span>Open 21 Features Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Transparent AI Formula Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white rounded-3xl space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-teal-400" />
            <h3 className="text-2xl font-bold">Transparent Civic Intelligence</h3>
          </div>

          <p className="text-slate-300 leading-relaxed max-w-4xl text-sm sm:text-base">
            In community administration, trust is paramount. CivicNexus AI eliminates black-box opacity through mathematical certainty, confidence intervals, and public verification for every civic decision.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center pt-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-extrabold text-teal-300">0.35 × Impact</div>
              <div className="text-xs text-slate-400 mt-1">Severity & Safety Risk</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-extrabold text-teal-300">0.25 × Urgency</div>
              <div className="text-xs text-slate-400 mt-1">SLA Critical Threshold</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-extrabold text-teal-300">0.20 × Recurrence</div>
              <div className="text-xs text-slate-400 mt-1">Civic Memory History</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-extrabold text-teal-300">0.20 × Population</div>
              <div className="text-xs text-slate-400 mt-1">Affected Ward Density</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Layers, ShieldCheck, Cpu, ArrowRight, CheckCircle2,
  AlertTriangle, GitMerge, Lightbulb, TrendingUp, Sparkles,
  MapPin, Mic, FileCheck, Navigation, Bell, AlertOctagon, Accessibility,
  HelpCircle, Users, WifiOff, FileText, Sliders, Eye, Network, BarChart3,
  Search, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SolutionItem {
  id: number;
  name: string;
  category: 'Citizen Services' | 'Accountability & Trust' | 'AI Intelligence' | 'Governance';
  targetRole: string;
  description: string;
  link: string;
  badge: string;
  icon: React.ElementType;
}

const CIVIC_SOLUTIONS: SolutionItem[] = [
  {
    id: 1,
    name: 'Smart Civic Report',
    category: 'Citizen Services',
    targetRole: 'Citizen',
    description: 'One-tap reporting with photo, GPS auto-detect, AI category & department suggestion, and pre-submission duplicate screening.',
    link: '/submit-report',
    badge: 'Pre-Screening AI',
    icon: Layers,
  },
  {
    id: 2,
    name: 'Nearby Problems Map',
    category: 'Citizen Services',
    targetRole: 'Citizen',
    description: 'Interactive neighbourhood radar map showing reported issues with category filters and 1-click "Support this Issue" without duplicating.',
    link: '/nearby-map',
    badge: 'Radar & +1 Support',
    icon: MapPin,
  },
  {
    id: 3,
    name: 'RepairProof',
    category: 'Accountability & Trust',
    targetRole: 'Citizen / Authority',
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
    description: 'Bilingual speech-to-text voice reporting in Tamil (வணக்கம்) & English, speech synthesis aloud, and automatic complaint drafting.',
    link: '/voice-assistant',
    badge: 'Bilingual Speech',
    icon: Mic,
  },
  {
    id: 5,
    name: 'Live Status Tracking',
    category: 'Accountability & Trust',
    targetRole: 'Citizen',
    description: '5-stage complaint lifecycle (Submitted → Under Review → Assigned → In Progress → Resolved) with timestamps and department details.',
    link: '/tracking/rep-001',
    badge: '5-Stage SLA',
    icon: Activity,
  },
  {
    id: 6,
    name: 'Civic Memory AI',
    category: 'AI Intelligence',
    targetRole: 'Authority / Citizen',
    description: 'Historical analysis uncovering recurring problems at the exact same location, chronic failure alerts, and repair attempt histories.',
    link: '/admin/clusters',
    badge: 'Recurrence Memory',
    icon: GitMerge,
  },
  {
    id: 7,
    name: 'Civic Risk Radar',
    category: 'AI Intelligence',
    targetRole: 'Authority',
    description: 'Dynamic priority radar scoring issues based on safety risk, affected population, recurrence, time unresolved, and evidence quality.',
    link: '/sla-risk',
    badge: 'Dynamic Scoring',
    icon: AlertTriangle,
  },
  {
    id: 8,
    name: 'RootCause AI',
    category: 'AI Intelligence',
    targetRole: 'Authority / Engineering',
    description: 'Geographic and systemic correlation engine finding root infrastructure causes (e.g., recurring potholes from drainage blockages).',
    link: '/admin/root-causes',
    badge: 'Causal Correlation',
    icon: Lightbulb,
  },
  {
    id: 9,
    name: 'Multimodal Assistant',
    category: 'Citizen Services',
    targetRole: 'Citizen',
    description: 'Unified reporting studio supporting voice notes, photos, Tamil/English text, and auto-generated issue summaries.',
    link: '/submit-report?mode=multimodal',
    badge: 'Multimodal Studio',
    icon: Cpu,
  },
  {
    id: 10,
    name: 'SafeRoute',
    category: 'Citizen Services',
    targetRole: 'Citizen / Commuters',
    description: 'Civic hazard navigation tool mapping active potholes, flooding, unlit streets, and calculating safer alternative paths.',
    link: '/safe-route',
    badge: 'Hazard Detours',
    icon: Navigation,
  },
  {
    id: 11,
    name: 'Public-Service Alerts',
    category: 'Accountability & Trust',
    targetRole: 'Public',
    description: 'Verified municipal alerts for scheduled water interruptions, road closures, and power maintenance with subscription toggles.',
    link: '/public-alerts',
    badge: 'Verified Bulletins',
    icon: Bell,
  },
  {
    id: 12,
    name: 'Overdue Escalation',
    category: 'Accountability & Trust',
    targetRole: 'Citizen / Ombudsman',
    description: 'SLA auto-escalation engine flagging overdue complaints and routing them to Higher Zonal Authorities with audit logging.',
    link: '/escalations',
    badge: 'Auto Escalation',
    icon: AlertOctagon,
  },
  {
    id: 13,
    name: 'Accessibility Mapper',
    category: 'Citizen Services',
    targetRole: 'Citizens with Disabilities / Elders',
    description: 'Dedicated barrier reporting and discovery tool for broken wheelchair ramps, missing tactile paving, unlit walkways, and high curbs.',
    link: '/accessibility',
    badge: 'Universal Access',
    icon: Accessibility,
  },
  {
    id: 14,
    name: 'Public Help Finder',
    category: 'Citizen Services',
    targetRole: 'Public',
    description: 'Civic facility locator with accessibility filters for public restrooms, drinking water booths, bus shelters, and government offices.',
    link: '/public-help',
    badge: 'Civic Amenities',
    icon: HelpCircle,
  },
  {
    id: 15,
    name: 'Community Action Matcher',
    category: 'Citizen Services',
    targetRole: 'Active Citizens',
    description: 'Verified citizen engagement hub for community cleanups, tree plantations, and civic volunteering with hours tracking.',
    link: '/community',
    badge: 'Volunteering & Karma',
    icon: Users,
  },
  {
    id: 16,
    name: 'Offline-First Reporting',
    category: 'Citizen Services',
    targetRole: 'Citizens in Low-connectivity Zones',
    description: 'Offline queue using IndexedDB/LocalStorage that buffers reports when disconnected and auto-uploads when internet returns.',
    link: '/offline-reports',
    badge: 'Offline Sync Queue',
    icon: WifiOff,
  },
  {
    id: 17,
    name: 'Follow-up Assistant',
    category: 'Accountability & Trust',
    targetRole: 'Citizen',
    description: 'Automated timeline case assistant generating 1-click formal RTI (Right to Information) and municipal follow-up inquiry letters.',
    link: '/escalations#rti',
    badge: 'RTI Generator',
    icon: FileText,
  },
  {
    id: 18,
    name: 'Civic What-If Simulator',
    category: 'AI Intelligence',
    targetRole: 'Municipal Planners / Public',
    description: 'Scenario planning sandbox simulating infrastructure interventions (e.g. fixing 5 drainage points) with projected impact & ROI.',
    link: '/simulator',
    badge: 'Policy Sandbox',
    icon: Sliders,
  },
  {
    id: 19,
    name: 'Photo Change Detector',
    category: 'Accountability & Trust',
    targetRole: 'Verification Officers',
    description: 'Visual difference inspection tool comparing before and after photos, highlighting asphalt repairs, and flagging suspicious images.',
    link: '/repair-proof#detector',
    badge: 'Visual Difference AI',
    icon: Eye,
  },
  {
    id: 20,
    name: 'Civic Knowledge Graph',
    category: 'AI Intelligence',
    targetRole: 'Data Analysts / Authorities',
    description: 'Interactive node-link graph connecting places, issues, contractors, departments, and recurring failure clusters.',
    link: '/knowledge-graph',
    badge: 'Interactive Graph',
    icon: Network,
  },
  {
    id: 21,
    name: 'Civic Impact Analytics',
    category: 'Governance',
    targetRole: 'Public / Leadership',
    description: 'Public accountability scorecard displaying median response time, SLA adherence, repeat problem indices, and department rankings.',
    link: '/impact-scorecard',
    badge: 'Ward Scorecards',
    icon: BarChart3,
  },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSolutions = useMemo(() => {
    return CIVIC_SOLUTIONS.filter((sol) => {
      const matchesCategory =
        selectedCategory === 'All' || sol.category === selectedCategory;
      const matchesSearch =
        sol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sol.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sol.targetRole.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
            CivicNexus AI · 21 Verified Smart Civic Solutions
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Connecting Citizens.<br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Improving Communities.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            CivicNexus AI transforms municipal governance with 21 intelligent civic solutions: from bilingual Tamil voice reporting and RepairProof sliders to predictive risk radar and public accountability scorecards.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {user ? (
              <Link
                to={user.role === 'citizen' ? '/dashboard' : '/admin/dashboard'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-base"
              >
                Open Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/submit-report"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-base"
                >
                  One-Tap Civic Report <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all text-base"
                >
                  Join Community
                </Link>
              </>
            )}
            <a
              href="#solutions-matrix"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-teal-200 border border-teal-500/30 font-semibold backdrop-blur-md transition-all text-base"
            >
              Explore 21 Solutions ↓
            </a>
          </div>
        </div>
      </section>

      {/* 21 Smart Civic Solutions Matrix Showcase */}
      <section id="solutions-matrix" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-bold text-xs border border-teal-200">
            <Sparkles className="w-3.5 h-3.5" /> 21-FEATURE CIVIC MATRIX
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Smart Civic Solutions for a Better Tomorrow
          </h2>
          <p className="text-slate-600 text-base">
            An end-to-end civic operating platform connecting citizens, municipal authorities, and AI intelligence.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All (21)', value: 'All' },
              { label: '👥 Citizen Services', value: 'Citizen Services' },
              { label: '🛡️ Accountability & Trust', value: 'Accountability & Trust' },
              { label: '🧠 AI Intelligence', value: 'AI Intelligence' },
              { label: '📊 Governance', value: 'Governance' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === tab.value
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 21 solutions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
            />
          </div>
        </div>

        {/* 21 Solutions Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSolutions.map((sol) => {
            const Icon = sol.icon;
            const categoryColors = {
              'Citizen Services': 'bg-teal-50 text-teal-700 border-teal-200',
              'Accountability & Trust': 'bg-indigo-50 text-indigo-700 border-indigo-200',
              'AI Intelligence': 'bg-purple-50 text-purple-700 border-purple-200',
              'Governance': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            }[sol.category];

            return (
              <div
                key={sol.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                      #{sol.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${categoryColors}`}>
                      {sol.badge}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-teal-50 text-slate-700 group-hover:text-teal-600 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-navy-900 group-hover:text-teal-700 transition-colors">
                        {sol.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Target: {sol.targetRole}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {sol.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Link
                    to={sol.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:text-teal-700 hover:underline"
                  >
                    <span>Launch Solution</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Transparent AI Formula Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white rounded-2xl space-y-6">
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
              <div className="text-xs text-slate-400 mt-1">Citizen Time Sensitivity</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-extrabold text-teal-300">0.25 × Recurrence</div>
              <div className="text-xs text-slate-400 mt-1">Re-opened Issue History</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-extrabold text-teal-300">0.15 × Aging</div>
              <div className="text-xs text-slate-400 mt-1">Days Unresolved</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

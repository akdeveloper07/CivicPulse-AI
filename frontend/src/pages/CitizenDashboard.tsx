import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Report, IssueCategory, RecurrenceEvent } from '../types';
import { StatusBadge } from '../components/common/Badge';
import {
  Plus, Search, Filter, Calendar, MapPin, ArrowRight, Activity, Clock,
  Sparkles, ShieldCheck, Camera, Navigation, AlertTriangle, Layers, Award,
  Compass, Mic, Users, HelpCircle, CheckCircle, Building2, Droplets, Waves,
  Hammer, Moon, Vote, Heart, Volume2, Trees, Zap, Siren, MessageSquare,
  Lock, ShieldAlert
} from 'lucide-react';
import { UserRole } from '../types';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [recurrenceAlerts, setRecurrenceAlerts] = useState<RecurrenceEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'critical' | 'resolved'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyCitizenFeatures, setOnlyCitizenFeatures] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repData, catData, recData] = await Promise.all([
          api.getReports(),
          api.getCategories(),
          api.getRecurrenceEvents().catch(() => [])
        ]);
        setReports(repData);
        setCategories(catData);
        setRecurrenceAlerts(recData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.approximate_area && r.approximate_area.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || r.category_id === selectedCategory;

    let matchesTab = true;
    if (activeTab === 'mine') {
      matchesTab = r.submitter_id === user?.id || r.submitter_name === user?.name;
    } else if (activeTab === 'critical') {
      matchesTab = r.impact >= 7;
    } else if (activeTab === 'resolved') {
      matchesTab = r.status === 'Resolved';
    }

    return matchesSearch && matchesCategory && matchesTab;
  });

  const submittedCount = reports.filter(r => r.status === 'Submitted').length;
  const activeCount = reports.filter(r => ['Under Review', 'In Progress'].includes(r.status)).length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  const userRole = user?.role || 'citizen';

  const roleMeta: Record<UserRole, {
    badge: string;
    title: string;
    desc: string;
    primaryBtn: { text: string; link: string; icon: any };
    secondaryBtn: { text: string; link: string; icon: any };
    isolationNotice: string;
  }> = {
    citizen: {
      badge: 'Citizen Action Hub',
      title: 'Community Issue Intelligence',
      desc: 'Connecting Citizens. Improving Communities. Experience seamless one-tap GPS reporting, transparent duplicate prevention, and AI-audited municipal resolution.',
      primaryBtn: { text: 'One-Tap Report Issue', link: '/submit-report', icon: Plus },
      secondaryBtn: { text: 'Civic Transparency', link: '/hero-transparency', icon: Award },
      isolationNotice: 'Non-citizen tools (contractor tenders, flood pumps, substation grids) are restricted by municipal security bylaws.',
    },
    volunteer: {
      badge: 'Ward Volunteer Hub',
      title: 'Community Stewardship & Action',
      desc: 'Empowering active ward volunteers. Coordinate tree adoption censuses, audit RepairProof completions, and guide citizens with localized assistance.',
      primaryBtn: { text: 'Tree Guardian Canopy', link: '/tree-guardian', icon: Trees },
      secondaryBtn: { text: 'Civic Pass Karma', link: '/civic-pass', icon: Award },
      isolationNotice: 'High-voltage power substation grids, contractor tenders, and flood pump SCADA controls are restricted.',
    },
    contractor: {
      badge: 'Contractor Operations Hub',
      title: 'Work Orders & Defect Liability',
      desc: 'Authorized municipal engineering contractor workspace. Submit AI road roughness scans, monitor defect liability retention, and upload repair evidence.',
      primaryBtn: { text: 'Open Ward Tenders', link: '/tenders', icon: Hammer },
      secondaryBtn: { text: 'AI Road Scanner', link: '/road-scanner', icon: Camera },
      isolationNotice: 'SCADA flood pumps, power substation grids, and municipal budget voting are restricted.',
    },
    department_officer: {
      badge: 'Municipal Command Center',
      title: 'Departmental Triage & SCADA Telemetry',
      desc: 'Nodal authority command console. Monitor real-time stormwater flood telemetry, manage high-voltage feeders, and resolve escalated civic grievances.',
      primaryBtn: { text: 'Monsoon Flood Desk', link: '/flood-desk', icon: Waves },
      secondaryBtn: { text: 'Power Grid SCADA', link: '/power-grid', icon: Zap },
      isolationNotice: 'Contractor tender bidding and root administrative configurations are restricted.',
    },
    administrator: {
      badge: 'Executive Zonal Command',
      title: 'Citywide Governance & Intelligence',
      desc: 'Executive mayoral and zonal oversight. Analyze cross-departmental SLA risk radars, review duplicate AI clusters, and run infrastructure what-if simulations.',
      primaryBtn: { text: 'Admin Operations', link: '/admin/dashboard', icon: Activity },
      secondaryBtn: { text: 'SLA Risk Radar', link: '/sla-risk', icon: AlertTriangle },
      isolationNotice: 'Full executive oversight active across all 15 municipal flagship features.',
    },
    system_admin: {
      badge: 'System Admin Console',
      title: 'Platform Security & Architecture',
      desc: 'DevOps & Root system management. Benchmark algorithmic fairness, configure API access policies, and audit system-wide security.',
      primaryBtn: { text: 'System Administration', link: '/admin/system', icon: ShieldAlert },
      secondaryBtn: { text: 'Operations Dashboard', link: '/admin/dashboard', icon: Activity },
      isolationNotice: 'Full platform root control active across all civic microservices.',
    },
  };

  const currentRoleMeta = roleMeta[userRole] || roleMeta.citizen;
  const PrimaryIcon = currentRoleMeta.primaryBtn.icon;
  const SecondaryIcon = currentRoleMeta.secondaryBtn.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner - Dynamic per Role */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> CivicNexus AI · {currentRoleMeta.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {currentRoleMeta.title}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {currentRoleMeta.desc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to={currentRoleMeta.primaryBtn.link}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-sm group"
            >
              <PrimaryIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{currentRoleMeta.primaryBtn.text}</span>
            </Link>
            <Link
              to={currentRoleMeta.secondaryBtn.link}
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold backdrop-blur-md transition-all"
            >
              <SecondaryIcon className="w-4 h-4 text-teal-400" />
              <span>{currentRoleMeta.secondaryBtn.text}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-navy-900">{submittedCount}</div>
            <div className="text-xs font-semibold text-slate-500">Newly Submitted</div>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-navy-900">{activeCount}</div>
            <div className="text-xs font-semibold text-slate-500">In Active Resolution</div>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-navy-900">{resolvedCount}</div>
            <div className="text-xs font-semibold text-slate-500">Resolved & Verified</div>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-navy-900">
              {reports.length > 0 ? `${Math.round((resolvedCount / reports.length) * 100)}%` : '100%'}
            </div>
            <div className="text-xs font-semibold text-slate-500">Resolution Rate</div>
          </div>
        </div>
      </div>

      {/* Role-Specific Workspace Banner */}
      {user && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-teal-500/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-black text-sm uppercase">
              {user.role === 'citizen' ? 'CIT' : user.role === 'volunteer' ? 'VOL' : user.role === 'contractor' ? 'CTR' : user.role === 'department_officer' ? 'OFC' : 'ADM'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-teal-400">
                  {user.role.replace('_', ' ')} Workspace
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  RBAC Active
                </span>
              </div>
              <div className="text-base font-bold text-white">{user.name}</div>
              <div className="text-xs text-slate-400">
                {user.role === 'citizen' && 'Access to one-tap reporting, neighborhood tracking, WhatsApp Bot, and Civic Pass.'}
                {user.role === 'volunteer' && 'Authorized for tree canopy adoption, community cleanup mobilization, and verified RepairProof audits.'}
                {user.role === 'contractor' && 'Authorized for municipal tender defect liability, pothole AI scans, and repair photographic evidence submission.'}
                {user.role === 'department_officer' && 'Authorized for nodal grievance triage, SCADA substation grid, and flood pump telemetry command.'}
                {user.role === 'administrator' && 'Full executive access to SLA risk forecasting, GIS heatmap, and cross-department benchmarks.'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {user.role === 'citizen' && (
              <>
                <Link to="/whatsapp-bot" className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Bot
                </Link>
                <Link to="/civic-pass" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all">
                  Civic Pass & Karma
                </Link>
              </>
            )}
            {user.role === 'volunteer' && (
              <>
                <Link to="/tree-guardian" className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                  <Trees className="w-3.5 h-3.5" /> Tree Guardian
                </Link>
                <Link to="/community" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all">
                  Community Action
                </Link>
              </>
            )}
            {user.role === 'contractor' && (
              <>
                <Link to="/road-scanner" className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> AI Road Scanner
                </Link>
                <Link to="/tenders" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all">
                  Ward Tenders
                </Link>
              </>
            )}
            {user.role === 'department_officer' && (
              <>
                <Link to="/departments" className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Dept Directory
                </Link>
                <Link to="/power-grid" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all">
                  Power Grid SCADA
                </Link>
              </>
            )}
            {user.role === 'administrator' && (
              <>
                <Link to="/admin/dashboard" className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Admin Console
                </Link>
                <Link to="/sla-risk" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all">
                  SLA Breach Radar
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* 15 Flagship Municipal Services Hub */}
      {(() => {
        const FLAGSHIP_SERVICES = [
          {
            id: 1,
            name: 'WhatsApp Bot (#1)',
            subtitle: 'Multilingual Chat Desk',
            link: '/whatsapp-bot',
            deptCode: 'GCC IT',
            roleBadgeText: 'Citizen',
            allowedRoles: ['citizen', 'volunteer', 'contractor', 'department_officer', 'administrator', 'system_admin'] as UserRole[],
            icon: MessageSquare,
            iconBg: 'bg-emerald-50 text-emerald-600',
            deptTag: 'text-emerald-700 bg-emerald-50',
          },
          {
            id: 2,
            name: 'Flood Desk (#2)',
            subtitle: 'Pumps & Relief Shelters',
            link: '/flood-desk',
            deptCode: 'SWD Dept',
            roleBadgeText: 'Officer Only',
            allowedRoles: ['department_officer', 'administrator', 'system_admin'] as UserRole[],
            icon: Waves,
            iconBg: 'bg-cyan-50 text-cyan-600',
            deptTag: 'text-cyan-700 bg-cyan-50',
          },
          {
            id: 3,
            name: 'Ward Tenders (#3)',
            subtitle: 'Defect Liability Claims',
            link: '/tenders',
            deptCode: 'GCC Works',
            roleBadgeText: 'Contractor Only',
            allowedRoles: ['contractor', 'administrator', 'system_admin'] as UserRole[],
            icon: Hammer,
            iconBg: 'bg-amber-50 text-amber-600',
            deptTag: 'text-amber-700 bg-amber-50',
          },
          {
            id: 4,
            name: 'Road Scanner (#4)',
            subtitle: 'AI Pothole Detection',
            link: '/road-scanner',
            deptCode: 'Highways',
            roleBadgeText: 'Contractor Only',
            allowedRoles: ['contractor', 'department_officer', 'administrator', 'system_admin'] as UserRole[],
            icon: Camera,
            iconBg: 'bg-indigo-50 text-indigo-600',
            deptTag: 'text-indigo-700 bg-indigo-50',
          },
          {
            id: 5,
            name: 'Night Safety (#5)',
            subtitle: 'Illumination & Patrols',
            link: '/night-safety',
            deptCode: 'GCTP Police',
            roleBadgeText: 'Citizen',
            allowedRoles: ['citizen', 'volunteer', 'administrator', 'system_admin'] as UserRole[],
            icon: Moon,
            iconBg: 'bg-purple-50 text-purple-600',
            deptTag: 'text-purple-700 bg-purple-50',
          },
          {
            id: 6,
            name: 'Dial-a-Tanker (#6)',
            subtitle: 'GPS & Potability Lab',
            link: '/water-tanker',
            deptCode: 'CMWSSB',
            roleBadgeText: 'Citizen',
            allowedRoles: ['citizen', 'volunteer', 'contractor', 'department_officer', 'administrator', 'system_admin'] as UserRole[],
            icon: Droplets,
            iconBg: 'bg-blue-50 text-blue-600',
            deptTag: 'text-blue-700 bg-blue-50',
          },
          {
            id: 7,
            name: 'Ward Sabha (#7)',
            subtitle: 'Citizen Budget Voting',
            link: '/ward-sabha',
            deptCode: 'Ward Council',
            roleBadgeText: 'Citizen',
            allowedRoles: ['citizen', 'volunteer', 'administrator', 'system_admin'] as UserRole[],
            icon: Vote,
            iconBg: 'bg-emerald-50 text-emerald-600',
            deptTag: 'text-emerald-700 bg-emerald-50',
          },
          {
            id: 8,
            name: 'Civic Pass (#8)',
            subtitle: 'Tax Rebates & Rewards',
            link: '/civic-pass',
            deptCode: 'Karma Pass',
            roleBadgeText: 'Volunteer & Citizen',
            allowedRoles: ['citizen', 'volunteer', 'administrator', 'system_admin'] as UserRole[],
            icon: Award,
            iconBg: 'bg-amber-50 text-amber-600',
            deptTag: 'text-amber-700 bg-amber-50',
          },
          {
            id: 9,
            name: 'Animal Rescue (#9)',
            subtitle: '24/7 Veterinary Van',
            link: '/animal-rescue',
            deptCode: 'Health Wing',
            roleBadgeText: 'Volunteer & Citizen',
            allowedRoles: ['citizen', 'volunteer', 'department_officer', 'administrator', 'system_admin'] as UserRole[],
            icon: Heart,
            iconBg: 'bg-rose-50 text-rose-600',
            deptTag: 'text-rose-700 bg-rose-50',
          },
          {
            id: 10,
            name: 'Noise Monitor (#10)',
            subtitle: 'Acoustic Decibel Radar',
            link: '/noise-monitor',
            deptCode: 'TNPCB',
            roleBadgeText: 'Citizen',
            allowedRoles: ['citizen', 'volunteer', 'department_officer', 'administrator', 'system_admin'] as UserRole[],
            icon: Volume2,
            iconBg: 'bg-indigo-50 text-indigo-600',
            deptTag: 'text-indigo-700 bg-indigo-50',
          },
          {
            id: 11,
            name: 'Tree Guardian (#11)',
            subtitle: 'Ward Canopy & Saplings',
            link: '/tree-guardian',
            deptCode: 'Parks Dept',
            roleBadgeText: 'Volunteer & Citizen',
            allowedRoles: ['citizen', 'volunteer', 'administrator', 'system_admin'] as UserRole[],
            icon: Trees,
            iconBg: 'bg-emerald-50 text-emerald-600',
            deptTag: 'text-emerald-700 bg-emerald-50',
          },
          {
            id: 12,
            name: 'Power Grid (#12)',
            subtitle: 'Substation SCADA Breakers',
            link: '/power-grid',
            deptCode: 'TANGEDCO',
            roleBadgeText: 'Officer Only',
            allowedRoles: ['department_officer', 'administrator', 'system_admin'] as UserRole[],
            icon: Zap,
            iconBg: 'bg-amber-50 text-amber-600',
            deptTag: 'text-amber-700 bg-amber-50',
          },
          {
            id: 13,
            name: 'Emergency SOS (#13)',
            subtitle: 'Multi-Agency First Alarm',
            link: '/emergency-sos',
            deptCode: '1070 SOS',
            roleBadgeText: 'All Users',
            allowedRoles: ['citizen', 'volunteer', 'contractor', 'department_officer', 'administrator', 'system_admin'] as UserRole[],
            icon: Siren,
            iconBg: 'bg-rose-50 text-rose-600',
            deptTag: 'text-rose-700 bg-rose-50',
          },
        ];

        const userRole = user?.role || 'citizen';
        const citizenServices = FLAGSHIP_SERVICES.filter((s) => s.allowedRoles.includes(userRole));
        const displayedServices = onlyCitizenFeatures ? citizenServices : FLAGSHIP_SERVICES;

        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                <h3 className="text-base font-extrabold text-navy-900 tracking-tight">
                  15 Municipal Flagship Civic Services
                </h3>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {citizenServices.length} Authorized for Your Role
                </span>
              </div>
              <Link
                to="/departments"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                All 8 Municipal Departments <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Role Protection Banner & View Toggle */}
            <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="text-teal-950 font-medium">
                  <strong>Role Isolation Active:</strong> Logged in as <strong className="text-teal-900 capitalize">{userRole.replace('_', ' ')}</strong>. {currentRoleMeta.isolationNotice}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setOnlyCitizenFeatures(true)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    onlyCitizenFeatures
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-100/50'
                  }`}
                >
                  My Features Only ({citizenServices.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOnlyCitizenFeatures(false)}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                    !onlyCitizenFeatures
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All 15 Services (Transparency View)
                </button>
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {displayedServices.map((svc) => {
                const Icon = svc.icon;
                const isPermitted = svc.allowedRoles.includes(userRole);

                return (
                  <Link
                    key={svc.id}
                    to={svc.link}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-2.5 relative group ${
                      isPermitted
                        ? 'bg-white border-slate-200 hover:border-teal-500 hover:shadow-md'
                        : 'bg-slate-50/70 border-slate-200 hover:border-rose-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {!isPermitted && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="p-1 rounded-md bg-rose-100 text-rose-700 inline-flex items-center justify-center shadow-2xs" title="Restricted to authorized role">
                          <Lock className="w-3 h-3" />
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${svc.iconBg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${svc.deptTag}`}>
                        {svc.deptCode}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-navy-900 flex items-center gap-1">
                        <span>{svc.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">{svc.subtitle}</div>

                      <div className="mt-1.5">
                        {isPermitted ? (
                          <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded inline-block">
                            Role: {svc.roleBadgeText}
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> {svc.roleBadgeText}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Civic Memory AI Insights Section */}
      {recurrenceAlerts.length > 0 && (
        <div className="glass-panel p-6 border-l-4 border-l-teal-600 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-navy-900">Civic Memory AI · Recurring Issue Shield</h3>
                <p className="text-xs text-slate-500">
                  Historical pattern analysis prevents temporary patches and holds municipal crews accountable.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              {recurrenceAlerts.length} Active Memory Traces
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {recurrenceAlerts.slice(0, 2).map((rec) => (
              <div key={rec.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {rec.new_report_title || 'Recurring Structural Defect'}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 shrink-0">
                    {rec.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  <span className="font-semibold text-slate-700">Audit Trace: </span>
                  {rec.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Tabs & Filters */}
      <div className="glass-panel p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'mine'
                  ? 'bg-white text-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Reports
            </button>
            <button
              onClick={() => setActiveTab('critical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'critical'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical Hazards
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'resolved'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 outline-none"
          >
            <option value="all">All Service Sectors</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search reports by title, description, or landmark / GPS location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium bg-white"
          />
        </div>
      </div>

      {/* Reports Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-500 text-sm">
          <div className="animate-pulse">Loading CivicNexus issue reports...</div>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700">No civic issues match your current filters</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting search criteria or report a new issue in your area.</p>
          </div>
          <Link
            to="/submit-report"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Submit New Report
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="glass-card p-6 flex flex-col justify-between space-y-4 hover:border-teal-500/50 transition-all group">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                    {report.category?.name || 'Civic Issue'}
                  </span>
                  <StatusBadge status={report.status} />
                </div>

                <h3 className="text-base font-bold text-navy-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>

                {/* Evidence & Location Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                  {report.approximate_area && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" /> {report.approximate_area}
                    </span>
                  )}
                  {report.image_url && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                      <Camera className="w-3 h-3 text-emerald-600" /> Photo Evidence Attached
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                <div className="text-xs text-slate-500 font-medium">
                  Impact Priority: <b className="text-slate-800">{report.impact}/10</b>
                </div>
                <Link
                  to={`/reports/${report.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all"
                >
                  View Timeline <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

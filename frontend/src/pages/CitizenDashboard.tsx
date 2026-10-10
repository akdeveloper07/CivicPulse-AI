import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Report, IssueCategory, RecurrenceEvent } from '../types';
import { StatusBadge } from '../components/common/Badge';
import {
  Plus, Search, Filter, Calendar, MapPin, ArrowRight, Activity, Clock,
  Sparkles, ShieldCheck, Camera, Navigation, AlertTriangle, Layers, Award
} from 'lucide-react';

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> CivicNexus AI · Citizen Action Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Community Issue Intelligence
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Connecting Citizens. Improving Communities. Experience seamless one-tap GPS reporting, transparent duplicate prevention, and AI-audited municipal resolution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/submit-report"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-sm group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>One-Tap Report Issue</span>
            </Link>
            <Link
              to="/hero-transparency"
              className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold backdrop-blur-md transition-all"
            >
              <Award className="w-4 h-4 text-teal-400" />
              <span>Civic Transparency</span>
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

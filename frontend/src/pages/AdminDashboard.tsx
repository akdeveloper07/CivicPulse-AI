import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { AnalyticsSummary } from '../types';
import {
  Activity, Layers, AlertTriangle, Lightbulb, TrendingUp, Cpu,
  Clock, ArrowRight, ShieldAlert, CheckCircle2, GitMerge
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAnalyticsSummary(),
      api.getCategoryDistribution()
    ]).then(([sum, cat]) => {
      setSummary(sum);
      setCategoryData(cat);
    }).finally(() => setIsLoading(false));
  }, []);

  const COLORS = ['#0d9488', '#059669', '#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" /> Municipal Intelligence Operations
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Executive Dashboard</h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Real-time AI matching queue, transparent priority cluster ranking, root-cause hypothesis review, and volume forecasting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/match-review"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <Layers className="w-4 h-4" /> AI Review Queue
          </Link>
          <Link
            to="/admin/clusters"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <GitMerge className="w-4 h-4" /> Issue Clusters
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Total Reports</span>
            <Activity className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-navy-900">{summary?.total_reports || 0}</div>
          <div className="text-[11px] text-slate-500 font-medium">Submitted across city zones</div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Awaiting AI Match Review</span>
            <Layers className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-navy-900">{summary?.pending_ai_reviews || 0}</div>
          <div className="text-[11px] text-purple-700 font-semibold">Human approval required</div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Critical Clusters</span>
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-navy-900">{summary?.high_priority_clusters || 0}</div>
          <div className="text-[11px] text-rose-700 font-semibold">Priority Score &ge; 70</div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase">Confirmed Recurrences</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-navy-900">{summary?.confirmed_recurrences || 0}</div>
          <div className="text-[11px] text-amber-700 font-semibold">Reopened past issues</div>
        </div>
      </div>

      {/* Analytics Visualization & Quick Tool Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Breakdown Chart */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-navy-900">Issue Category Distribution</h3>
            <span className="text-xs font-semibold text-slate-500">Percentage Breakdown</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="category_name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value: any) => [`${value} reports`, 'Count']} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intelligence Module Links */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-lg font-bold text-navy-900">AI Intelligence Suite</h3>
          <div className="space-y-3">
            <Link to="/admin/match-review" className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 flex items-center justify-between group transition-all">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-teal-600" />
                <div>
                  <div className="text-xs font-bold text-navy-900">Duplicate Match Review</div>
                  <div className="text-[11px] text-slate-500">Screen candidate duplicate pairs</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/admin/root-causes" className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 flex items-center justify-between group transition-all">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-xs font-bold text-navy-900">Root-Cause Hypotheses</div>
                  <div className="text-[11px] text-slate-500">Discovered co-occurrence links</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/admin/recommendations" className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between group transition-all">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs font-bold text-navy-900">Resolution Recommendations</div>
                  <div className="text-[11px] text-slate-500">Suggest steps from past resolved cases</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/admin/forecasting" className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 flex items-center justify-between group transition-all">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-navy-900">Volume Forecasting</div>
                  <div className="text-[11px] text-slate-500">Time-series predictive models</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/admin/confidence-fairness" className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 flex items-center justify-between group transition-all">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="text-xs font-bold text-navy-900">Uncertainty & Fairness</div>
                  <div className="text-[11px] text-slate-500">Audit boundary cases & area priority</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

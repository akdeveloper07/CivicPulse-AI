import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WardStat } from '../types';
import {
  BarChart3, Award, TrendingUp, Clock, CheckCircle2, ShieldCheck,
  RefreshCw, Star, AlertTriangle, Download, ArrowUpRight, Building2
} from 'lucide-react';

export const CivicImpactAnalyticsPage: React.FC = () => {
  const [wardStats, setWardStats] = useState<WardStat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getWardStats();
      setWardStats(data);
    } catch (err) {
      console.error('Failed to load ward metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  const departments = [
    { name: 'Corporation Works (Roads)', resolvedPct: 94.2, avgHours: 16.5, rating: 4.6, total: 420 },
    { name: 'Metro Water & Sewerage Board', resolvedPct: 91.8, avgHours: 19.2, rating: 4.4, total: 310 },
    { name: 'TANGEDCO (Electrical Wing)', resolvedPct: 96.5, avgHours: 8.4, rating: 4.8, total: 185 },
    { name: 'Solid Waste Management', resolvedPct: 88.0, avgHours: 22.0, rating: 4.1, total: 295 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> Feature #21 · Governance & Public Trust
            </span>
            <span className="text-xs text-slate-400 font-medium">Public Accountability Scorecard</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Civic Impact Analytics & Ward Performance
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Real-time public transparency scorecard measuring municipal response time, SLA adherence percentages, and department accountability rankings.
          </p>
        </div>

        <button
          onClick={loadData}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Scorecard
        </button>
      </div>

      {/* Top Level KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-md bg-white space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Median Turnaround Time</span>
          <div className="text-3xl font-black text-navy-900 flex items-center gap-2">
            <span>18.4h</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              ↓ 4.2h
            </span>
          </div>
          <p className="text-xs text-slate-500">Across all municipal sectors</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-md bg-white space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Overall SLA Adherence</span>
          <div className="text-3xl font-black text-teal-600">92.4%</div>
          <p className="text-xs text-slate-500">Target benchmark: &ge; 85%</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-md bg-white space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Citizen Satisfaction</span>
          <div className="text-3xl font-black text-amber-500 flex items-center gap-1.5">
            <Star className="w-6 h-6 fill-current" />
            <span>4.6</span>
            <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <p className="text-xs text-slate-500">Based on 2,840 verified audits</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 shadow-md bg-white space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Repeat Failure Index</span>
          <div className="text-3xl font-black text-indigo-600">12.1%</div>
          <p className="text-xs text-slate-500">Dropped 8% via RootCause AI</p>
        </div>
      </div>

      {/* Ward Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ward Leaderboard */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200 bg-white">
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Award className="w-4 h-4 text-amber-500" />
            Ward Infrastructure Health Rankings
          </h2>

          <div className="space-y-3">
            {wardStats.map((w, idx) => (
              <div
                key={w.ward_name}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-navy-900 text-white font-black flex items-center justify-center text-xs">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-navy-900 text-sm">{w.ward_name}</h4>
                    <span className="text-slate-500 text-[11px]">{w.total_issues} Total Reports</span>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-extrabold text-teal-700 text-sm">
                    {w.sla_health_pct}% SLA Health
                  </div>
                  <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      style={{ width: `${w.sla_health_pct}%` }}
                      className="h-full bg-teal-500 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Accountability Table */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200 bg-white">
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-teal-600" />
            Departmental Efficiency Matrix
          </h2>

          <div className="space-y-3">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-navy-900 text-sm">{dept.name}</h4>
                  <div className="flex items-center gap-1 font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{dept.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[9px]">Resolution Rate</div>
                    <div className="font-extrabold text-teal-700 mt-0.5">{dept.resolvedPct}%</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[9px]">Avg Speed</div>
                    <div className="font-extrabold text-navy-900 mt-0.5">{dept.avgHours} Hours</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-400 font-bold uppercase text-[9px]">Total Handled</div>
                    <div className="font-extrabold text-slate-700 mt-0.5">{dept.total} Tickets</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

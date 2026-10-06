import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ExecutiveReportData } from '../types';
import { FileText, Download, ShieldCheck, DollarSign, Award, Activity, Printer, CheckCircle } from 'lucide-react';

export const ExecutiveReportPage: React.FC = () => {
  const [data, setData] = useState<ExecutiveReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const res = await api.getExecutiveReport();
      setData(res);
    } catch (err) {
      console.error('Failed to load executive report', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1 w-fit">
            <FileText className="w-3.5 h-3.5" /> Governance & ESG Audit
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Executive Audit & ESG Performance Report</h1>
          <p className="text-xs md:text-sm text-slate-300">
            One-click exportable summary of municipal AI duplicate prevention, budget savings, and SLA compliance.
          </p>
        </div>

        <button
          onClick={handlePrintDownload}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4" /> Export Report (PDF / Print)
        </button>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 space-y-2 border border-slate-200 shadow-md">
              <div className="text-xs font-bold uppercase text-slate-400">AI Duplicates Caught</div>
              <div className="text-3xl font-black text-navy-900">{data.total_duplicates_caught}</div>
              <p className="text-[11px] text-teal-600 font-semibold">Prevented duplicate crew dispatches</p>
            </div>

            <div className="glass-panel p-5 space-y-2 border border-slate-200 shadow-md">
              <div className="text-xs font-bold uppercase text-slate-400">Est. Taxpayer Savings</div>
              <div className="text-3xl font-black text-emerald-600">${data.estimated_taxpayer_savings_usd.toLocaleString()}</div>
              <p className="text-[11px] text-emerald-700 font-semibold">Saved in municipal operating budget</p>
            </div>

            <div className="glass-panel p-5 space-y-2 border border-slate-200 shadow-md">
              <div className="text-xs font-bold uppercase text-slate-400">Overall SLA Compliance</div>
              <div className="text-3xl font-black text-navy-900">{data.overall_sla_compliance_pct}%</div>
              <p className="text-[11px] text-slate-500 font-semibold">Target $\ge 90.0\%$ achieved</p>
            </div>

            <div className="glass-panel p-5 space-y-2 border border-slate-200 shadow-md">
              <div className="text-xs font-bold uppercase text-slate-400">AI Model Accuracy Rate</div>
              <div className="text-3xl font-black text-purple-600">{data.ai_accuracy_rate}%</div>
              <p className="text-[11px] text-purple-700 font-semibold">SentenceTransformers F1 Benchmark</p>
            </div>
          </div>

          {/* Detailed Audit Table */}
          <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-navy-900">Municipal Audit Summary breakdown</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-slate-500 font-bold uppercase text-[10px]">Total Complaints Processed</div>
                <div className="text-lg font-extrabold text-navy-900">{data.total_reports_processed} Reports</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-slate-500 font-bold uppercase text-[10px]">Avg Resolution Velocity</div>
                <div className="text-lg font-extrabold text-navy-900">{data.average_resolution_velocity_hours} Hours</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-slate-500 font-bold uppercase text-[10px]">Highest Recurring Infrastructure Category</div>
                <div className="text-lg font-extrabold text-navy-900">{data.highest_recurring_category}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-slate-500 font-bold uppercase text-[10px]">Report Audit Stamp</div>
                <div className="text-lg font-extrabold text-teal-700">{data.generated_at}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

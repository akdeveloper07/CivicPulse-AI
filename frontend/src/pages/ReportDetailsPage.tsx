import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Report, PriorityExplanation } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { ArrowLeft, MapPin, Calendar, CheckCircle, Clock, AlertTriangle, Layers } from 'lucide-react';

export const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [priorityExp, setPriorityExp] = useState<PriorityExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getReportById(id)
        .then(async (rep) => {
          setReport(rep);
          if (rep.cluster_id) {
            try {
              const exp = await api.getPriorityExplanation(rep.cluster_id);
              setPriorityExp(exp);
            } catch (e) {
              // Priority fallback
            }
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return <div className="py-16 text-center text-slate-500">Loading report details...</div>;
  }

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto my-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-900">Report Not Found</h2>
        <Link to="/dashboard" className="text-teal-600 font-semibold hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 px-4 space-y-8">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-navy-900">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Main Report Card */}
      <div className="glass-panel p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
              {report.category?.name || 'General Category'}
            </span>
            <h1 className="text-2xl font-extrabold text-navy-900">{report.title}</h1>
          </div>
          <StatusBadge status={report.status} />
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {report.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">Location Area</div>
            <div className="text-sm font-bold text-navy-900 flex items-center gap-1 mt-0.5">
              <MapPin className="w-4 h-4 text-teal-600" /> {report.approximate_area || 'Citywide'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">Submission Date</div>
            <div className="text-sm font-bold text-navy-900 flex items-center gap-1 mt-0.5">
              <Calendar className="w-4 h-4 text-teal-600" /> {new Date(report.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500">Impact & Urgency Ratings</div>
            <div className="text-sm font-bold text-navy-900 mt-0.5">
              Impact {report.impact}/10 · Urgency {report.urgency}/10
            </div>
          </div>
        </div>

        {/* Priority Explanation Card */}
        {priorityExp && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-navy-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-bold">Assigned Issue Cluster Priority</span>
              </div>
              <PriorityBadge score={priorityExp.total_priority_score} />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {priorityExp.human_explanation}
            </p>
          </div>
        )}
      </div>

      {/* Resolution Timeline Component */}
      <div className="glass-panel p-8 space-y-6">
        <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" /> Resolution Timeline & Audit Log
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          <div className="relative flex items-start gap-3">
            <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-white flex items-center justify-center text-white">
              <CheckCircle className="w-2.5 h-2.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy-900">Report Submitted</div>
              <div className="text-[11px] text-slate-500">{new Date(report.created_at).toLocaleString()}</div>
              <p className="text-xs text-slate-600 mt-1">Submitted by citizen and passed real-time duplicate pre-check.</p>
            </div>
          </div>

          <div className="relative flex items-start gap-3">
            <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full ${report.status !== 'Submitted' ? 'bg-teal-600' : 'bg-slate-300'} ring-4 ring-white`} />
            <div>
              <div className="text-xs font-bold text-navy-900">Assigned to Issue Cluster & Under Review</div>
              <div className="text-[11px] text-slate-500">AI Cluster Service</div>
              <p className="text-xs text-slate-600 mt-1">Report grouped into representative issue cluster for department action.</p>
            </div>
          </div>

          <div className="relative flex items-start gap-3">
            <div className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full ${['In Progress', 'Resolved'].includes(report.status) ? 'bg-teal-600' : 'bg-slate-300'} ring-4 ring-white`} />
            <div>
              <div className="text-xs font-bold text-navy-900">Work Order Dispatched</div>
              <div className="text-[11px] text-slate-500">Municipal Services Team</div>
              <p className="text-xs text-slate-600 mt-1">Field engineers dispatched with historical resolution recommendations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

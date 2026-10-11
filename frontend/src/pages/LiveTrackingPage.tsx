import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ComplaintTrackingStep } from '../types';
import {
  Activity, CheckCircle2, Clock, AlertTriangle, Shield, User,
  FileText, ArrowRight, RefreshCw, Phone, MapPin, Sparkles
} from 'lucide-react';

export const LiveTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const reportId = id || 'rep-001';

  const [steps, setSteps] = useState<ComplaintTrackingStep[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTracking();
  }, [reportId]);

  const loadTracking = async () => {
    setIsLoading(true);
    try {
      const data = await api.getComplaintTracking(reportId);
      setSteps(data);
    } catch (err) {
      console.error('Failed to load tracking data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentStep = steps.find((s) => s.status === 'in_progress') || steps[steps.length - 1];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Feature #5 · Accountability & Trust
            </span>
            <span className="text-xs text-slate-400 font-medium">Lifecycle SLA Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Live Complaint Status Tracking
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Transparent 5-stage progress lifecycle for ticket <strong className="text-teal-400 font-mono">#{reportId}</strong> with real-time municipal SLA timeline.
          </p>
        </div>

        <button
          onClick={loadTracking}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Status
        </button>
      </div>

      {/* Ticket Overview Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-md bg-white grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Complaint ID</span>
          <div className="font-mono font-bold text-base text-navy-900">{reportId}</div>
          <div className="text-xs text-slate-500">Water Supply Defect</div>
        </div>
        <div className="space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Location & Ward</span>
          <div className="font-bold text-sm text-navy-900">Anna Nagar East</div>
          <div className="text-xs text-slate-500">Ward 104 · Zone VII</div>
        </div>
        <div className="space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">SLA Countdown</span>
          <div className="font-extrabold text-base text-teal-600 flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> 18h 42m remaining
          </div>
          <div className="text-xs text-slate-500">Target: Within 24 Hours</div>
        </div>
        <div className="space-y-1">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Responsible Officer</span>
          <div className="font-bold text-sm text-navy-900">K. Sundararajan (AE)</div>
          <div className="text-xs text-teal-600 font-medium">Metro Water Field Wing</div>
        </div>
      </div>

      {/* 5-Stage Visual Progress Bar */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md bg-white space-y-8">
        <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600" /> 5-Stage Complaint Lifecycle
        </h2>

        {/* Desktop Step Bar */}
        <div className="relative">
          {/* Connector Line */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0" />

          <div className="grid grid-cols-5 gap-2 relative z-10 text-center">
            {steps.map((st, idx) => {
              const isCompleted = st.status === 'completed';
              const isInProgress = st.status === 'in_progress';
              const isPending = st.status === 'pending';

              return (
                <div key={st.step_number} className="flex flex-col items-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-md ${
                      isCompleted
                        ? 'bg-teal-600 text-white'
                        : isInProgress
                        ? 'bg-amber-500 text-white ring-4 ring-amber-300/50 scale-110 animate-pulse'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : st.step_number}
                  </div>
                  <div className="space-y-0.5">
                    <div
                      className={`text-xs font-bold leading-tight ${
                        isInProgress ? 'text-amber-700' : isCompleted ? 'text-teal-700' : 'text-slate-400'
                      }`}
                    >
                      {st.title}
                    </div>
                    <div className="text-[10px] text-slate-400 hidden sm:block">
                      {st.timestamp || 'Pending'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Timeline Events */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-navy-900">Audit History & Department Remarks</h3>
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.step_number}
                className={`p-4 rounded-xl border transition-all text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  step.status === 'in_progress'
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : step.status === 'completed'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-dashed border-slate-200 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-900 text-sm">
                      Stage {step.step_number}: {step.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        step.status === 'completed'
                          ? 'bg-teal-100 text-teal-800'
                          : step.status === 'in_progress'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {(step.status || 'pending').replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">{step.description}</p>
                  {step.department && (
                    <div className="text-[11px] text-teal-700 font-semibold">
                      Department: {step.department}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono text-slate-500 text-[11px]">
                    {step.timestamp || 'Pending trigger'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Link to RepairProof / Escalations */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="font-bold text-sm text-teal-300">Need to audit resolution photos or file an escalation?</div>
            <div className="text-xs text-slate-300">
              Verify Before/After evidence on RepairProof or monitor SLA breach rules.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/repair-proof"
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all"
            >
              RepairProof Slider
            </Link>
            <Link
              to="/escalations"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              Overdue Escalations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

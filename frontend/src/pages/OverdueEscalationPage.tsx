import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { OverdueEscalationCase } from '../types';
import {
  AlertOctagon, FileText, ShieldAlert, CheckCircle2, Clock,
  ArrowRight, Copy, Check, Download, RefreshCw, Send, AlertTriangle
} from 'lucide-react';

export const OverdueEscalationPage: React.FC = () => {
  const [cases, setCases] = useState<OverdueEscalationCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<OverdueEscalationCase | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const data = await api.getOverdueCases();
      setCases(data);
      if (data.length > 0) setSelectedCase(data[0]);
    } catch (err) {
      console.error('Failed to load overdue cases', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalate = async (reportId: string) => {
    try {
      await api.escalateOverdueCase(reportId);
      setCases((prev) =>
        prev.map((c) =>
          c.report_id === reportId
            ? { ...c, escalation_status: 'Escalated to Zonal Commissioner' }
            : c
        )
      );
      if (selectedCase?.report_id === reportId) {
        setSelectedCase((prev) =>
          prev ? { ...prev, escalation_status: 'Escalated to Zonal Commissioner' } : null
        );
      }
      setFeedback('Ticket officially escalated to the Zonal Joint Commissioner with priority dispatch audit.');
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      console.error('Failed to escalate case', err);
    }
  };

  const generateRTIDraft = (item: OverdueEscalationCase) => {
    return `TO:
The Public Information Officer (PIO),
Greater Chennai Corporation / Municipal Administration Dept,
Ripon Building, Chennai - 600003.

SUBJECT: Application under Section 6(1) of the Right to Information Act, 2005.

Sir / Madam,
Regarding Complaint Ticket Ref: ${item.report_id}
Title: "${item.title}"
Location: ${item.location || 'Anna Nagar West'}
Filed On: ${item.filed_date || item.submitted_date || 'Recent'} (SLA Threshold: ${item.sla_limit_days || 3} Days; Currently Overdue by ${item.overdue_days || Math.round((item.hours_overdue || 48) / 24)} Days)

Kindly provide certified copies / information regarding the following:
1. The daily progress report and action-taken log for the above-referenced complaint.
2. The name and designation of the officials and contractors responsible for resolving this issue within the stipulated Citizen Charter SLA.
3. Details of reasons for non-compliance with the citizen charter timelines.
4. Details of any penalty or liquidated damages levied on the contractor for delay.
5. Expected date of completion and certified before/after audit report.

Applicant: Citizen of Ward ${(item.location || 'Ward 104').split(',')[0]}
Mode: Online / Registered Post RTI Application`;
  };

  const handleCopyRTI = () => {
    if (!selectedCase) return;
    const text = generateRTIDraft(selectedCase);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30 flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" /> Feature #12 & #17 · Accountability & Trust
            </span>
            <span className="text-xs text-slate-400 font-medium">SLA Breach & Legal RTI Assistant</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Overdue Escalation & RTI Follow-up Bot
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Empowering citizens when municipal timelines breach. Auto-escalate delayed tickets to higher zonal authorities and generate formal RTI inquiry documents with 1 click.
          </p>
        </div>

        <button
          onClick={loadCases}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Cases
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 text-sm flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Grid: Overdue Tickets Ledger + RTI Document Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Overdue Cases List */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200 bg-white">
          <h2 className="text-base font-bold text-navy-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              SLA Breached Complaints ({cases.length})
            </span>
            <span className="text-xs text-slate-400 font-normal">Select a case to generate RTI</span>
          </h2>

          <div className="space-y-3">
            {cases.map((item) => {
              const isSelected = selectedCase?.report_id === item.report_id;
              const isEscalated = item.escalation_status.includes('Escalated');

              return (
                <div
                  key={item.report_id}
                  onClick={() => setSelectedCase(item)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all text-xs space-y-3 ${
                    isSelected
                      ? 'bg-rose-50/50 border-rose-400 ring-2 ring-rose-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-500">
                      #{item.report_id} · {item.department}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-rose-100 text-rose-800">
                      +{item.overdue_days} Days Overdue
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-navy-900 leading-snug">{item.title}</h4>
                    <div className="text-[11px] text-slate-500 mt-0.5">📍 {item.location}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="space-x-2">
                      <span className="text-[11px] text-slate-400">Officer: {item.assigned_officer}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEscalate(item.report_id);
                      }}
                      disabled={isEscalated}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                        isEscalated
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{isEscalated ? 'Escalated to Zonal' : '1-Click Escalate'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Feature #17 RTI Follow-up Generator */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200 bg-white flex flex-col justify-between" id="rti">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Feature #17 · RTI Follow-up Assistant
              </h2>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                RTI Act 2005 Compliant
              </span>
            </div>

            {selectedCase ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatically drafted Right to Information inquiry letter requiring official explanation and penalty records for SLA breaches:
                </p>

                {/* Formatted Letter Paper Preview */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner max-h-[380px] overflow-y-auto">
                  {generateRTIDraft(selectedCase)}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-400 text-sm">
                Select an overdue complaint on the left to generate an RTI draft.
              </div>
            )}
          </div>

          {selectedCase && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={handleCopyRTI}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy RTI Letter'}</span>
              </button>

              <button
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([generateRTIDraft(selectedCase)], { type: 'text/plain' });
                  element.href = URL.createObjectURL(file);
                  element.download = `RTI_Inquiry_${selectedCase.report_id}.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download .TXT</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

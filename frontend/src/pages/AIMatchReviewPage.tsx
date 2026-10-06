import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ReportMatch } from '../types';
import { UncertaintyBadge } from '../components/common/Badge';
import { Layers, CheckCircle2, XCircle, Clock, Sparkles, MessageSquare } from 'lucide-react';

export const AIMatchReviewPage: React.FC = () => {
  const [matches, setMatches] = useState<ReportMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<ReportMatch | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchQueue = async () => {
    try {
      const data = await api.getMatchReviewQueue();
      setMatches(data);
      if (data.length > 0 && !selectedMatch) {
        setSelectedMatch(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleDecision = async (decision: string) => {
    if (!selectedMatch) return;
    setIsProcessing(true);
    try {
      await api.recordMatchDecision(selectedMatch.id, decision, decisionReason || 'Reviewed in AI Match Review Workspace.');
      setDecisionReason('');
      await fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Failed to record decision.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-8 rounded-2xl shadow-lg space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" /> Human-in-the-Loop AI Review Queue
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Semantic Duplicate Match Review Workspace</h1>
        <p className="text-slate-300 text-sm max-w-3xl">
          Review candidate pairs flagged by SentenceTransformers embeddings. Approve duplicates to auto-merge reports into single issue clusters with complete audit tracking.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500">Loading AI match review queue...</div>
      ) : matches.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-navy-900">Queue is Clear</h3>
          <p className="text-xs text-slate-500">All candidate report matches have been reviewed by municipal administrators.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Matches List Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Pending Candidates ({matches.length})
            </h3>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {matches.map((m) => {
                const isSelected = selectedMatch?.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMatch(m)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="badge-pill bg-teal-100 text-teal-800 font-bold">
                        {(m.similarity_score * 100).toFixed(1)}% Match
                      </span>
                      <UncertaintyBadge
                        label={
                          m.similarity_score >= 0.85
                            ? 'High Confidence'
                            : m.similarity_score >= 0.65
                            ? 'Moderate Uncertainty'
                            : 'High Uncertainty'
                        }
                      />
                    </div>
                    <div className="text-xs font-bold text-navy-900 line-clamp-1">
                      {m.source_report?.title || 'Source Report'}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      vs {m.candidate_report?.title || 'Candidate Report'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Comparison Workspace */}
          {selectedMatch && (
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg font-bold text-navy-900">Side-by-Side Semantic Analysis</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-teal-600">
                      {(selectedMatch.similarity_score * 100).toFixed(1)}% Cosine Similarity
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">Embedding: all-MiniLM-L6-v2</div>
                  </div>
                </div>

                {/* Report 1 vs Report 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Source Report (Incoming)</span>
                    <h4 className="text-sm font-bold text-navy-900">{selectedMatch.source_report?.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedMatch.source_report?.description}</p>
                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      Area: <b>{selectedMatch.source_report?.approximate_area || 'Not specified'}</b>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Candidate Existing Report</span>
                    <h4 className="text-sm font-bold text-navy-900">{selectedMatch.candidate_report?.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{selectedMatch.candidate_report?.description}</p>
                    <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      Area: <b>{selectedMatch.candidate_report?.approximate_area || 'Not specified'}</b>
                    </div>
                  </div>
                </div>

                {/* Evidence Highlight Box */}
                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-teal-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-teal-800">
                    <Sparkles className="w-4 h-4" /> AI Evidence Breakdown
                  </div>
                  <p className="leading-relaxed">
                    High semantic overlap detected in category, issue location keywords, and structural symptom descriptions. Decision boundary indicator: <b>{selectedMatch.similarity_score >= 0.75 ? 'Automatic Candidate' : 'Requires Oversight'}</b>.
                  </p>
                </div>

                {/* Decision Form & Reason */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Audit Log Decision Reason (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Confirmed duplicate pothole complaint at MG Road junction..."
                      value={decisionReason}
                      onChange={(e) => setDecisionReason(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      disabled={isProcessing}
                      onClick={() => handleDecision('Confirmed duplicate')}
                      className="px-3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Duplicate
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => handleDecision('Confirmed related')}
                      className="px-3 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <Layers className="w-4 h-4" /> Related
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => handleDecision('Rejected match')}
                      className="px-3 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => handleDecision('Deferred')}
                      className="px-3 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <Clock className="w-4 h-4" /> Defer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

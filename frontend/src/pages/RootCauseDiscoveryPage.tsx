import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RootCauseHypothesis } from '../types';
import { UncertaintyBadge } from '../components/common/Badge';
import { AlertTriangle, Sparkles, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

export const RootCauseDiscoveryPage: React.FC = () => {
  const [hypotheses, setHypotheses] = useState<RootCauseHypothesis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchHypotheses = async () => {
    try {
      const data = await api.getRootCauses();
      setHypotheses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHypotheses();
  }, []);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await api.runRootCauseAnalysis();
      await fetchHypotheses();
    } catch (err: any) {
      alert(err.message || 'Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDecision = async (id: string, decision: string) => {
    try {
      await api.recordRootCauseDecision(id, decision, 'Reviewed in Root-Cause Discovery Console.');
      await fetchHypotheses();
    } catch (err: any) {
      alert(err.message || 'Decision update failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-8 rounded-2xl shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-purple-400" /> Signature Feature: AI Cause-and-Effect Analysis
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Root-Cause Hypothesis Discovery</h1>
          <p className="text-purple-100 text-sm max-w-3xl">
            Detects structural co-occurrences between civic categories (e.g. Blocked Drains causing Waterlogging or Pipe Bursts weakening Road Pavements) with explicit statistical evidence and uncertainty bounds.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md transition-all text-sm shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing Clusters...' : 'Re-Run Discovery'}
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500">Discovering root-cause correlations...</div>
      ) : hypotheses.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-purple-400 mx-auto" />
          <h3 className="text-lg font-bold text-navy-900">No Hypotheses Discovered Yet</h3>
          <p className="text-xs text-slate-500">Click "Re-Run Discovery" to run spatial and domain heuristic correlations across active clusters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hypotheses.map((hyp) => (
            <div key={hyp.id} className="glass-card p-6 flex flex-col justify-between space-y-4 border border-purple-100">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <UncertaintyBadge label={hyp.uncertainty_label} />
                  <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                    {(hyp.score_or_strength * 100).toFixed(0)}% Evidence Strength
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                  <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Causal Hypothesis</div>
                  <p className="text-xs font-medium leading-relaxed text-slate-200">
                    {hyp.hypothesis_text}
                  </p>
                </div>

                {/* Evidence Details */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-700 block">Domain Evidence Note:</span>
                  <p className="text-slate-600 leading-relaxed">
                    {hyp.evidence_json?.domain_heuristic || 'Statistical spatial/temporal co-occurrence detected.'}
                  </p>
                </div>
              </div>

              {/* Administrative Action Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Status: <b>{hyp.review_status}</b>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDecision(hyp.id, 'Confirmed')}
                    className="p-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
                    title="Confirm Hypothesis"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDecision(hyp.id, 'Rejected')}
                    className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                    title="Reject Hypothesis"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDecision(hyp.id, 'Deferred')}
                    className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                    title="Defer Decision"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { IssueCluster, ResolutionRecommendation } from '../types';
import { Lightbulb, ThumbsUp, ThumbsDown, CheckCircle2, ArrowRight } from 'lucide-react';

export const ResolutionRecommendationsPage: React.FC = () => {
  const [clusters, setClusters] = useState<IssueCluster[]>([]);
  const [selectedClusterId, setSelectedClusterId] = useState<string>('');
  const [recommendations, setRecommendations] = useState<ResolutionRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingRecs, setIsFetchingRecs] = useState(false);

  useEffect(() => {
    api.getClusters().then((cls) => {
      setClusters(cls);
      if (cls.length > 0) {
        setSelectedClusterId(cls[0].id);
        fetchRecsForCluster(cls[0].id);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  const fetchRecsForCluster = async (clusterId: string) => {
    setIsFetchingRecs(true);
    try {
      const data = await api.getClusterRecommendations(clusterId);
      setRecommendations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingRecs(false);
    }
  };

  const handleClusterSelect = (clusterId: string) => {
    setSelectedClusterId(clusterId);
    fetchRecsForCluster(clusterId);
  };

  const handleFeedback = async (recommendationId: string, feedback: 'Useful' | 'Not Useful') => {
    try {
      await api.recordRecommendationFeedback(recommendationId, feedback);
      setRecommendations((prev) =>
        prev.map((r) => (r.id === recommendationId ? { ...r, feedback } : r))
      );
    } catch (err: any) {
      alert(err.message || 'Feedback recording failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
          <Lightbulb className="w-3.5 h-3.5 text-blue-400" /> Historical Resolution Intelligence
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Resolution Recommendation Engine</h1>
        <p className="text-slate-300 text-sm max-w-3xl">
          Retrieves recorded resolution protocols from semantically similar historical cases. Provides field teams with proven fix steps and gathers feedback for continuous improvement.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500">Loading active issue clusters...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Target Cluster Selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Select Active Cluster
            </h3>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {clusters.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleClusterSelect(c.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    selectedClusterId === c.id
                      ? 'bg-blue-50/80 border-blue-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold text-navy-900 line-clamp-1">{c.representative_title}</div>
                  <div className="text-[11px] text-slate-500">Priority Score: <b>{c.current_priority_score.toFixed(1)}</b></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Display */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recommended Fix Protocols for Selected Case
            </h3>

            {isFetchingRecs ? (
              <div className="py-12 text-center text-slate-500">Searching historical resolved cases...</div>
            ) : recommendations.length === 0 ? (
              <div className="glass-panel p-12 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-navy-900">No Similar Historical Cases Found</h4>
                <p className="text-xs text-slate-500">As more issues are resolved, CivicPulse automatically builds resolution recommendations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="glass-card p-6 space-y-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <span className="badge-pill bg-blue-100 text-blue-800 font-bold">
                        {(rec.similarity_score * 100).toFixed(1)}% Historical Match
                      </span>
                      <span className="text-xs text-slate-500">{rec.recommendation_reason}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recorded Resolution Action Protocol</span>
                      <p className="text-xs font-medium text-slate-800 leading-relaxed">
                        {rec.recorded_action}
                      </p>
                    </div>

                    {/* Feedback Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">Was this recommendation helpful?</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFeedback(rec.id, 'Useful')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            rec.feedback === 'Useful'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" /> Useful
                        </button>
                        <button
                          onClick={() => handleFeedback(rec.id, 'Not Useful')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            rec.feedback === 'Not Useful'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" /> Not Useful
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

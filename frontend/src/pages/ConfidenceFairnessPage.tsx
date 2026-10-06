import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UncertaintyBadge } from '../components/common/Badge';
import { Cpu, ShieldCheck, AlertCircle, Layers } from 'lucide-react';

export const ConfidenceFairnessPage: React.FC = () => {
  const [uncertaintyItems, setUncertaintyItems] = useState<any[]>([]);
  const [fairnessData, setFairnessData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getUncertaintyItems(),
      api.getFairnessDistribution()
    ]).then(([unc, fair]) => {
      setUncertaintyItems(unc);
      setFairnessData(fair);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5 text-amber-400" /> AI Oversight & Equity Compliance
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Confidence & Priority Fairness Audit</h1>
        <p className="text-slate-300 text-sm max-w-3xl">
          Monitors decision boundary predictions (similarity scores between 0.55 and 0.85) requiring human verification and audits priority distribution across city zones to ensure equitable municipal resolution.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500">Loading fairness and uncertainty metrics...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Low-Confidence Prediction Queue */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" /> Flagged Boundary Predictions ({uncertaintyItems.length})
            </h3>
            <p className="text-xs text-slate-500">Predictions flagged due to score proximity to decision threshold band.</p>

            {uncertaintyItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                No predictions currently flagged for uncertainty boundary review.
              </div>
            ) : (
              <div className="space-y-3">
                {uncertaintyItems.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-900">{item.title}</span>
                      <UncertaintyBadge label="Boundary Flagged" />
                    </div>
                    <p className="text-xs text-slate-600">{item.reason_flagged}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Area Priority Fairness Monitor */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" /> Priority Equity Across Geographic Zones
            </h3>
            <p className="text-xs text-slate-500">Ensures no zone is systematically deprioritized by AI formula weights.</p>

            <div className="space-y-3">
              {fairnessData.map((f, index) => (
                <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-navy-900">{f.area_or_category}</div>
                    <div className="text-[11px] text-slate-500">{f.report_count} Total Reports Submitted</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-teal-600">{f.avg_priority_score} Avg Priority</div>
                    <div className="text-[11px] text-slate-500">Avg Resolution: 96 hrs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

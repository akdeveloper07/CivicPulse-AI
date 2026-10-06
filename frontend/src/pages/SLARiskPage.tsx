import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SLARiskItem } from '../types';
import { ShieldAlert, Clock, AlertTriangle, Send, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export const SLARiskPage: React.FC = () => {
  const [items, setItems] = useState<SLARiskItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [escalatedMap, setEscalatedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSLARiskData();
  }, []);

  const fetchSLARiskData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSLARiskAnalysis();
      setItems(data);
      const initialMap: Record<string, boolean> = {};
      data.forEach(item => {
        if (item.escalated) initialMap[item.cluster_id] = true;
      });
      setEscalatedMap(initialMap);
    } catch (err) {
      console.error('Failed to fetch SLA risk analysis', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEscalate = async (clusterId: string) => {
    try {
      await api.escalateSLA(clusterId);
      setEscalatedMap(prev => ({ ...prev, [clusterId]: true }));
    } catch (err: any) {
      alert(err.message || 'Escalation failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 bg-gradient-to-r from-rose-950 via-navy-900 to-slate-900 text-white rounded-2xl shadow-xl">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30 flex items-center gap-1 w-fit">
            <ShieldAlert className="w-3.5 h-3.5" /> Predictive SLA Monitoring
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">SLA Breach Risk Predictor</h1>
          <p className="text-xs md:text-sm text-slate-300">
            Identifies complaints at risk of missing resolution Service Level Agreements (SLAs) before deadline breach occurs.
          </p>
        </div>

        {/* Health Gauge */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center">
          <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Overall SLA Compliance</div>
          <div className="text-2xl font-black text-emerald-400">94.2%</div>
        </div>
      </div>

      {/* Risk Items Table / Cards */}
      <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200">
        <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-600" /> High-Risk SLA Breach Radar
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                <th className="p-3">Complaint Cluster</th>
                <th className="p-3">Category</th>
                <th className="p-3">Assigned Department</th>
                <th className="p-3">Aging (Days)</th>
                <th className="p-3">Breach Risk</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {items.map((item) => {
                const isEscalated = escalatedMap[item.cluster_id];
                return (
                  <tr key={item.cluster_id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="p-3 text-slate-600">{item.category}</td>
                    <td className="p-3 text-slate-700">{item.department}</td>
                    <td className="p-3 text-slate-800 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> {item.aging_days} days
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`badge-pill ${
                            item.risk_level === 'Critical'
                              ? 'bg-rose-100 text-rose-800'
                              : item.risk_level === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {item.risk_level} ({item.breach_probability}%)
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {isEscalated ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Escalated
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEscalate(item.cluster_id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1 ml-auto transition-all"
                        >
                          <Send className="w-3 h-3" /> Auto-Escalate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

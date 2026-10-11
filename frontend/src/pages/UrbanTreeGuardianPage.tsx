import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { UrbanTreeItem } from '../types';
import { realTimeService } from '../services/realtime';
import {
  Trees, Building2, Shield, Heart, AlertTriangle, CheckCircle2,
  Leaf, Sparkles, Award, UserCheck
} from 'lucide-react';

export const UrbanTreeGuardianPage: React.FC = () => {
  const [trees, setTrees] = useState<UrbanTreeItem[]>([]);
  const [adoptedId, setAdoptedId] = useState<string | null>(null);

  useEffect(() => {
    api.getTrees().then((data) => setTrees(data));
  }, []);

  const handleAdopt = (id: string, name: string) => {
    setAdoptedId(id);
    setTrees((prev) =>
      prev.map((t) => (t.id === id ? { ...t, adopted_by: 'You (Ward Guardian)' } : t))
    );

    realTimeService.broadcast({
      id: `evt-tree-${Date.now()}`,
      timestamp: 'Just now',
      type: 'REPAIR_VERIFIED',
      title: `Urban Tree Adopted: ${name}`,
      description: 'Citizen pledged weekly watering and canopy inspection. +150 Civic Karma awarded.',
      ward: 'Ward 104 (Zone VII)',
      department: 'GCC Parks & Horticulture Wing',
      status: 'Adoption Certified',
      urgency: 'low',
    });

    setTimeout(() => setAdoptedId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5" /> Boost Feature #11 · Green Urbanism
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 text-[10px] font-black uppercase">
              GPS Tree Census
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Urban Tree Guardian & Green Canopy Adoptive Ledger
          </h1>
          <p className="text-xs text-emerald-200/90 max-w-2xl">
            Protecting Chennai’s green lungs: Digital census of municipal avenue trees. Adopt neighborhood shade trees, track annual CO2 absorption, and prevent illegal tree felling.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-emerald-300">Ward Canopy Index</div>
          <div className="text-base font-black text-white font-mono">18.4%</div>
          <div className="text-[10px] text-emerald-300/80">3,450 Tagged Trees</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> GCC Parks & Horticulture Wing
            <span className="text-slate-400 ml-2">(Nodal: Dr. M. Sangeetha, SWM & Parks Director · Helpline: 1913 Ext 4)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 shrink-0">
          👥 Accessible by: Citizens & Green Volunteers
        </span>
      </div>

      {/* Trees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trees.map((t) => {
          const isAtRisk = t.health_status === 'Illegal Felling Risk';
          const isAdopted = t.adopted_by !== 'Unadopted';

          return (
            <div
              key={t.id}
              className={`glass-panel p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                isAtRisk
                  ? 'border-rose-300/80 bg-rose-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    isAtRisk ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {t.health_status}
                  </span>
                  <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    Age: {t.age_years} Years
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-navy-900">
                    {t.tree_species}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    📍 {t.location} · {t.ward}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-0.5">
                    <div className="text-[10px] text-emerald-700 font-bold uppercase">CO2 Absorption</div>
                    <div className="font-black text-emerald-900 text-sm">{t.co2_absorption_kg} kg / year</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Adopted Steward</div>
                    <div className="font-bold text-navy-900 truncate">{t.adopted_by}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleAdopt(t.id, t.tree_species)}
                  disabled={isAdopted}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                    isAdopted
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{isAdopted ? 'Adopted by Steward' : 'Adopt This Tree (+150 Karma)'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { NightSafetyLocation } from '../types';
import { realTimeService } from '../services/realtime';
import {
  ShieldAlert, Moon, Sun, Camera, ShieldCheck, Building2,
  Phone, Eye, Sparkles, AlertTriangle, CheckCircle2, Navigation
} from 'lucide-react';

export const NightSafetyRadarPage: React.FC = () => {
  const [routes, setRoutes] = useState<NightSafetyLocation[]>([]);
  const [requestedEscortId, setRequestedEscortId] = useState<string | null>(null);

  useEffect(() => {
    api.getNightSafety().then((data) => setRoutes(data));
  }, []);

  const handleRequestPinkPatrol = (id: string, routeName: string) => {
    setRequestedEscortId(id);
    realTimeService.broadcast({
      id: `evt-patrol-${Date.now()}`,
      timestamp: 'Just now',
      type: 'CREW_DISPATCHED',
      title: 'Pink Patrol Beat Dispatched',
      description: `Police Women's Mobile Patrol unit routed to ${routeName}. High-visibility beacon active.`,
      ward: 'Ward 104 / Zone VII',
      department: 'Greater Chennai Traffic Police (GCTP) Pink Patrol',
      status: 'En Route',
      urgency: 'high',
    });
    setTimeout(() => setRequestedEscortId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5" /> Boost Feature #5 · Night Mobility
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-black uppercase border border-pink-500/30">
              Pink Patrol Grid Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Women’s Night Safety & Street Illumination Radar
          </h1>
          <p className="text-xs text-purple-200/90 max-w-2xl">
            Empowering nocturnal mobility: Audited street lux illumination, CCTV density, active police beats, and verified well-lit walking corridors for women and solo night commuters.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-pink-300">Women Helpline Toll-Free</div>
          <div className="text-base font-black text-white font-mono">1091 / 112</div>
          <div className="text-[10px] text-pink-300/80">Chennai Pink Police Patrol</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-purple-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
          <span>
            <strong>Operated jointly by:</strong> TANGEDCO Electrical Wing & Greater Chennai Police Pink Patrol
            <span className="text-slate-400 ml-2">(Nodal: Thiru. R. Sudhakar, IPS · Additional Commissioner)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30 shrink-0">
          👥 Accessible by: All Citizens & Police Responders
        </span>
      </div>

      {/* Route Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {routes.map((rt) => {
          const isSafe = rt.safety_score >= 80;
          const isRequested = requestedEscortId === rt.id;

          return (
            <div
              key={rt.id}
              className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isSafe
                  ? 'border-slate-200 bg-white hover:shadow-md'
                  : 'border-rose-300/80 bg-rose-50/20 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {rt.recommendation}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Safety Score</span>
                    <div className={`text-base font-black ${isSafe ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {rt.safety_score}/100
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy-900 leading-snug">
                    {rt.route_name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    📍 {rt.ward}
                  </div>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Illumination</div>
                    <div className="font-black text-purple-700">{rt.lux_illumination} Lux</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">CCTV Feeds</div>
                    <div className="font-black text-slate-800">{rt.cctv_count} Cams</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Pink Booth</div>
                    <div className="font-black text-pink-600">{rt.pink_booth_nearby ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
                  <div className="text-[10px] text-purple-700 font-bold uppercase">Recommended Walking Window:</div>
                  <div className="font-bold text-purple-900">{rt.safest_time_window}</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleRequestPinkPatrol(rt.id, rt.route_name)}
                disabled={isRequested}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                  isRequested
                    ? 'bg-emerald-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isRequested ? 'Pink Patrol Dispatched!' : 'Request Police Beat Patrol'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

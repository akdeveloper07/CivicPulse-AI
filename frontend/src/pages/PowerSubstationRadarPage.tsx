import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PowerSubstationRadar } from '../types';
import { realTimeService } from '../services/realtime';
import {
  Zap, Building2, Shield, Phone, AlertTriangle, CheckCircle2,
  Activity, Clock, Power, ShieldAlert
} from 'lucide-react';

export const PowerSubstationRadarPage: React.FC = () => {
  const [substations, setSubstations] = useState<PowerSubstationRadar[]>([]);
  const [reportedId, setReportedId] = useState<string | null>(null);

  useEffect(() => {
    api.getPowerGrid().then((data: PowerSubstationRadar[]) => setSubstations(data));
  }, []);

  const handleReportSparking = (id: string, name: string) => {
    setReportedId(id);
    realTimeService.broadcast({
      id: `evt-power-${Date.now()}`,
      timestamp: 'Just now',
      type: 'EMERGENCY_ALERT',
      title: `Electrical Hazard Reported: ${name}`,
      description: 'Sparking transformer / low tension line fault logged. Emergency feeder isolator alerted.',
      ward: 'Ward 104 (Zone VII)',
      department: 'TANGEDCO Electrical Engineering Wing',
      status: 'Emergency Cutoff En Route',
      urgency: 'critical',
    });
    setTimeout(() => setReportedId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-yellow-950 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Boost Feature #12 · Power Resilience
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 text-[10px] font-black uppercase">
              SCADA Substation Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Power Substation Outage & Transformer Telemetry Radar
          </h1>
          <p className="text-xs text-amber-200/90 max-w-2xl">
            Real-time grid stability: Voltage monitoring, transformer load telemetry, live feeder trip detection, and direct contact for designated electrical line engineers.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-amber-300">TANGEDCO Helpline</div>
          <div className="text-base font-black text-white font-mono">94987 94987</div>
          <div className="text-[10px] text-amber-300/80">Minnagam 24/7 Power Desk</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> Tamil Nadu Generation & Distribution Corp (TANGEDCO)
            <span className="text-slate-400 ml-2">(Nodal: Er. V. Kalyanasundaram, SE Distribution · Minnagam: 9498794987)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30 shrink-0">
          👥 Accessible by: Citizens & Electrical Linesmen
        </span>
      </div>

      {/* Substations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {substations.map((s) => {
          const isOverloaded = s.load_status === 'Overloaded';
          const isReported = reportedId === s.substation_id;

          return (
            <div
              key={s.substation_id}
              className={`glass-panel p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                isOverloaded
                  ? 'border-rose-400/80 bg-rose-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    isOverloaded ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    Load: {s.load_status}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    Last Maintenance: {s.last_maintenance}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-navy-900">
                    {s.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {s.zone} · Substation ID: {s.substation_id}
                  </div>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Transformer Outages</div>
                    <div className={`font-black text-sm ${s.transformer_outages > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {s.transformer_outages} Units
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Spark Hazards</div>
                    <div className={`font-black text-sm ${s.open_spark_hazards > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {s.open_spark_hazards} Logged
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Next Power Cut</div>
                    <div className="font-bold text-xs text-slate-700 truncate">
                      {s.next_scheduled_cut || 'None Scheduled'}
                    </div>
                  </div>
                </div>

                {/* Engineer Info */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Emergency Feeder Desk:</div>
                    <div className="font-bold text-navy-900">{s.helpline}</div>
                  </div>
                  <a
                    href={`tel:${s.helpline.replace(/\s+/g, '')}`}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call AE Desk
                  </a>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleReportSparking(s.substation_id, s.name)}
                disabled={isReported}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                  isReported
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isReported ? 'Emergency Grid Cutoff Dispatched!' : 'Report Sparking Wire / Transformer Hazard'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

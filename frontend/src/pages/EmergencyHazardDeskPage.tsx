import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EmergencyHazardAlert } from '../types';
import { realTimeService } from '../services/realtime';
import {
  ShieldAlert, AlertTriangle, Building2, Phone, CheckCircle2,
  Zap, LifeBuoy, Radio, Siren, Send, Clock, MapPin
} from 'lucide-react';

export const EmergencyHazardDeskPage: React.FC = () => {
  const [hazards, setHazards] = useState<EmergencyHazardAlert[]>([]);
  const [hazardType, setHazardType] = useState<EmergencyHazardAlert['hazard_type']>('Live Wire / Electrocution');
  const [locationText, setLocationText] = useState('Anna Nagar 2nd Avenue, near Roundtana');
  const [isTriggering, setIsTriggering] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  useEffect(() => {
    api.getEmergencyAlerts().then((data: EmergencyHazardAlert[]) => setHazards(data));
  }, []);

  const handleTriggerSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTriggering(true);

    try {
      const createdAlert = await api.triggerEmergencySOS({
        hazard_type: hazardType,
        severity: 'Immediate Danger to Life',
        location: locationText,
        dispatched_agencies: ['TANGEDCO Feeder Quick Reaction', 'TN Fire & Rescue 101', 'GCC Disaster Desk'],
        reported_by: 'Citizen via Emergency Desk',
        eta_emergency_crew: '7 mins',
        status: 'Active Alert',
      });

      setHazards([createdAlert, ...hazards]);
      setIsTriggering(false);
      setDispatchedSuccess(true);

      realTimeService.broadcast({
        id: `evt-sos-${Date.now()}`,
        timestamp: 'Just now',
        type: 'EMERGENCY_ALERT',
        title: `CRITICAL HAZARD SOS: ${hazardType}`,
        description: `Multi-agency first responders dispatched to ${locationText}. Immediate perimeter cordoning ordered.`,
        ward: 'Ward 104 (Zone VII)',
        department: 'Integrated Disaster Command Center (1070)',
        status: 'Multi-Agency En Route',
        urgency: 'critical',
      });

      setTimeout(() => setDispatchedSuccess(false), 4000);
    } catch {
      setIsTriggering(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30 flex items-center gap-1.5">
              <Siren className="w-3.5 h-3.5 animate-bounce" /> Boost Feature #13 · Life Safety SOS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase">
              Priority 0 Incident
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Emergency Civic Hazard SOS & Multi-Agency Dispatch
          </h1>
          <p className="text-xs text-rose-200/90 max-w-2xl">
            Zero-latency life safety triggers: High tension wire snaps, toxic sewer fumes, deep open manholes, or structural cave-ins trigger immediate simultaneous alarms to Fire, Power, and Police.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-rose-300">Disaster Command Hotline</div>
          <div className="text-base font-black text-white font-mono">1070 / 112</div>
          <div className="text-[10px] text-rose-300/80">State Emergency Operation Center</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-rose-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> Integrated Disaster Command Center (GCC + Fire 101 + TANGEDCO + Police)
            <span className="text-slate-400 ml-2">(Nodal: State Disaster Management Commissioner · Direct Line: 1070)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[11px] border border-rose-500/30 shrink-0">
          👥 Accessible by: All Citizens & Emergency Command
        </span>
      </div>

      {/* Two Column Layout: SOS Trigger & Active Critical Hazards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Rapid SOS Trigger Card */}
        <div className="glass-panel p-6 rounded-3xl border border-rose-300 bg-rose-50/30 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm uppercase">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            1-Tap Emergency SOS Trigger
          </div>

          <form onSubmit={handleTriggerSOS} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Select Life-Threatening Hazard
              </label>
              <select
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-rose-500 font-medium"
              >
                <option value="Live Wire / Electrocution">⚡ Live Wire / Electrocution Snapped on Road</option>
                <option value="Toxic Gas Leak">🧪 Toxic Sewer Gas Leak / Chemical Fumes</option>
                <option value="Collapsed Wall">🏚️ Structural Collapsed Wall / Deep Sinkhole</option>
                <option value="Burst Main Canal">🌊 Burst Main Water Canal / Severe Flooding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Exact Landmark / Street
              </label>
              <input
                type="text"
                required
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="e.g. Near Shanthi Colony Signal, Anna Nagar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isTriggering}
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
            >
              <Siren className="w-4 h-4" />
              <span>{isTriggering ? 'Triggering Emergency Alarms...' : 'Broadcast Multi-Agency SOS'}</span>
            </button>

            {dispatchedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Alarms broadcasted to Fire 101, Power Cutoff, and Police Mobile Patrol!</span>
              </div>
            )}
          </form>
        </div>

        {/* Active Emergency Incidents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-navy-900">
              Active Priority-0 Civic Hazards
            </h3>
            <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-ping" /> Real-Time Telemetry
            </span>
          </div>

          <div className="space-y-4">
            {hazards.map((h) => (
              <div
                key={h.id}
                className="glass-panel p-5 rounded-2xl border border-rose-200 bg-white hover:border-rose-400 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                    {h.severity}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ETA Responders: {h.eta_emergency_crew}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-navy-900">{h.hazard_type}</h4>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    📍 {h.location} · Logged by: {h.reported_by}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">
                    Coordinated Responding Agencies:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {h.dispatched_agencies.map((agency: string) => (
                      <span
                        key={agency}
                        className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-bold text-[10px] border border-rose-200"
                      >
                        {agency}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    ● Status: {h.status}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    SLA Response: &lt; 15 mins
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EmergencyHazardAlert } from '../types';
import { realTimeService } from '../services/realtime';
import {
  ShieldAlert, AlertTriangle, Building2, Phone, CheckCircle2,
  Zap, LifeBuoy, Radio, Siren, Send, Clock, MapPin, Crosshair, Navigation, AlertCircle
} from 'lucide-react';

export const EmergencyHazardDeskPage: React.FC = () => {
  const [hazards, setHazards] = useState<EmergencyHazardAlert[]>([]);
  const [hazardType, setHazardType] = useState<EmergencyHazardAlert['hazard_type']>('Live Wire / Electrocution');
  const [locationText, setLocationText] = useState('Anna Nagar 2nd Avenue, near Roundtana');
  const [isTriggering, setIsTriggering] = useState(false);
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);

  const fetchHazards = async () => {
    try {
      const data = await api.getEmergencyAlerts();
      if (Array.isArray(data)) {
        setHazards(data);
      }
    } catch (err) {
      console.error('Failed to load emergency alerts', err);
    }
  };

  useEffect(() => {
    fetchHazards();
  }, []);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your device browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        setLocationText(`GPS Incident Site: (${lat}, ${lng}) - Near Active Sector`);
        setIsLocating(false);
        setGpsLocked(true);
      },
      (err) => {
        setIsLocating(false);
        setErrorMessage(`Could not acquire GPS: ${err.message}. Please enter landmark manually.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleTriggerSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTriggering(true);
    setErrorMessage(null);

    try {
      const createdAlert = await api.triggerEmergencySOS({
        hazard_type: hazardType,
        severity: 'Immediate Danger to Life',
        location: locationText,
        dispatched_agencies: ['TANGEDCO Feeder Quick Reaction', 'TN Fire & Rescue 101', 'GCC Disaster Desk'],
        reported_by: 'Citizen via Emergency Desk',
        eta_emergency_crew: '4 mins',
        status: 'Active Alert',
      });

      if (createdAlert && !Array.isArray(createdAlert) && createdAlert.id) {
        setHazards((prev) => [createdAlert, ...prev.filter((item) => item.id !== createdAlert.id)]);
      } else {
        await fetchHazards();
      }

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

      setTimeout(() => setDispatchedSuccess(false), 5000);
    } catch (err: any) {
      setIsTriggering(false);
      setErrorMessage(err.message || 'Failed to trigger SOS alarm. Please dial 1070 or 112 immediately.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
              <Siren className="w-3.5 h-3.5" /> Boost Feature #13 · Life Safety SOS Desk
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase shadow-xs">
              Priority 0 Incident
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Emergency Civic Hazard SOS & Multi-Agency Dispatch
          </h1>
          <p className="text-xs md:text-sm text-rose-200/90 max-w-2xl leading-relaxed">
            Zero-latency life safety alarms: High tension wire snaps, toxic sewer fumes, deep open manholes, or structural cave-ins trigger immediate simultaneous alarms to Fire, Power, and Police.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
          <a
            href="tel:1070"
            className="bg-rose-600 hover:bg-rose-500 border border-rose-400 px-4 py-3 rounded-2xl text-center text-white transition-all shadow-lg flex items-center gap-2 justify-center"
          >
            <Phone className="w-4 h-4 text-white animate-bounce" />
            <div>
              <div className="text-[10px] uppercase font-bold text-rose-100">State Disaster Center</div>
              <div className="text-sm font-black font-mono">Dial 1070</div>
            </div>
          </a>
          <a
            href="tel:112"
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-2xl text-center text-white transition-all flex items-center gap-2 justify-center"
          >
            <ShieldAlert className="w-4 h-4 text-rose-300" />
            <div>
              <div className="text-[10px] uppercase font-bold text-rose-300">National Emergency</div>
              <div className="text-sm font-black font-mono">Dial 112</div>
            </div>
          </a>
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

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Two Column Layout: SOS Trigger & Active Critical Hazards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Rapid SOS Trigger Card */}
        <div className="glass-panel p-6 rounded-3xl border border-rose-300 bg-rose-50/40 shadow-md space-y-4">
          <div className="flex items-center justify-between text-rose-800 font-extrabold text-sm uppercase">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              1-Tap Emergency SOS Trigger
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-bold">
              Instant Dispatch
            </span>
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Exact Landmark / Street
                </label>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1"
                >
                  <Crosshair className="w-3 h-3" />
                  {isLocating ? 'Locating...' : gpsLocked ? 'GPS Locked ✓' : 'Use My GPS'}
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g. Near Shanthi Colony Signal, Anna Nagar"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-rose-500 bg-white font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isTriggering}
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <Siren className={`w-5 h-5 ${isTriggering ? 'animate-spin' : 'animate-bounce'}`} />
              <span>{isTriggering ? 'Broadcasting Multi-Agency Alarms...' : 'Broadcast Multi-Agency SOS'}</span>
            </button>

            {dispatchedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md animate-fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Alarms broadcasted to Fire 101, Power Cutoff, and Police Mobile Patrol!</span>
              </div>
            )}
          </form>

          {/* Quick Helplines */}
          <div className="pt-3 border-t border-rose-200 space-y-2">
            <div className="text-[10px] font-bold uppercase text-slate-500">Quick Emergency Speed Dials:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
              <a href="tel:101" className="p-2 rounded-lg bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 flex items-center justify-center gap-1">
                <Phone className="w-3 h-3" /> Fire (101)
              </a>
              <a href="tel:1912" className="p-2 rounded-lg bg-white border border-rose-200 text-amber-800 hover:bg-amber-100 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" /> TNEB Power (1912)
              </a>
            </div>
          </div>
        </div>

        {/* Active Emergency Incidents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-navy-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Active Priority-0 Civic Hazards ({hazards.length})
            </h3>
            <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 animate-ping" /> Real-Time Telemetry
            </span>
          </div>

          <div className="space-y-4">
            {hazards.map((h) => {
              const agencies = Array.isArray(h.dispatched_agencies) && h.dispatched_agencies.length > 0
                ? h.dispatched_agencies
                : ['TANGEDCO Feeder Quick Reaction', 'TN Fire & Rescue 101', 'GCC Disaster Desk'];

              return (
                <div
                  key={h.id}
                  className="glass-panel p-5 rounded-2xl border border-rose-200 bg-white hover:border-rose-400 shadow-sm space-y-3 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                      {h.severity || 'Immediate Danger to Life'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono font-bold">
                      ETA Responders: {h.eta_emergency_crew || '5 mins'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-navy-900">{h.hazard_type}</h4>
                    <div className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{h.location} · Logged by: {h.reported_by || 'Citizen'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">
                      Coordinated Responding Agencies:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {agencies.map((agency: string) => (
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
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Status: {h.status || 'Active Alert'}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      SLA Response: &lt; 15 mins
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


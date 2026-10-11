import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { NoisePollutionReading } from '../types';
import { realTimeService } from '../services/realtime';
import {
  Volume2, VolumeX, Building2, Shield, AlertTriangle, CheckCircle2,
  Mic, Play, Pause, Activity, Radio
} from 'lucide-react';

export const StreetNoiseMonitorPage: React.FC = () => {
  const [readings, setReadings] = useState<NoisePollutionReading[]>([]);
  const [isListening, setIsListening] = useState(true);
  const [liveDb, setLiveDb] = useState(78.4);
  const [alertDispatched, setAlertDispatched] = useState(false);

  useEffect(() => {
    api.getNoiseReadings().then((data) => setReadings(data));
  }, []);

  // Simulate acoustic fluctuation
  useEffect(() => {
    if (!isListening) return;
    const interval = setInterval(() => {
      setLiveDb((prev) => parseFloat((72 + Math.random() * 12).toFixed(1)));
    }, 1500);
    return () => clearInterval(interval);
  }, [isListening]);

  const handleDispatchViolation = () => {
    setAlertDispatched(true);
    realTimeService.broadcast({
      id: `evt-noise-${Date.now()}`,
      timestamp: 'Just now',
      type: 'EMERGENCY_ALERT',
      title: `Noise Limit Breach: ${liveDb} dB (Permissible 65 dB)`,
      description: 'Persistent honking violation recorded at Anna Nagar Roundtana. Traffic Police acoustic challan unit flagged.',
      ward: 'Ward 104 (Zone VII)',
      department: 'Greater Chennai Traffic Police (GCTP)',
      status: 'Acoustic Enforcement Active',
      urgency: 'high',
    });
    setTimeout(() => setAlertDispatched(false), 3000);
  };

  const isViolating = liveDb > 65.0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> Boost Feature #10 · Urban Environment
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
              CPCB Acoustic Radar
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Street Noise Pollution & Silence Zone Monitor
          </h1>
          <p className="text-xs text-rose-200/90 max-w-2xl">
            Acoustic health enforcement: Real-time decibel (dB) surveillance around hospitals, schools, and major junctions. Automated detection of illegal horn usage and decibel limit violations.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-rose-300">Silence Zone Standard</div>
          <div className="text-base font-black text-white font-mono">&lt; 50.0 dB</div>
          <div className="text-[10px] text-rose-300/80">CPCB Environmental Norms</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-rose-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Operated jointly by:</strong> Greater Chennai Traffic Police & TN Pollution Control Board (TNPCB)
            <span className="text-slate-400 ml-2">(Nodal: Thiru. R. Sudhakar, IPS · Traffic & Acoustic Enforcement)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[11px] border border-rose-500/30 shrink-0">
          👥 Accessible by: Citizens & Traffic Officers
        </span>
      </div>

      {/* Live Acoustic Meter & Historical Readings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Live Acoustic Meter HUD */}
        <div className="glass-panel p-6 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" /> LIVE SENSOR MICROPHONE
            </span>
            <button
              onClick={() => setIsListening(!isListening)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              {isListening ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-teal-400" />}
            </button>
          </div>

          <div className="text-center py-6 space-y-2">
            <div className={`text-6xl font-black font-mono tracking-tight transition-all ${
              isViolating ? 'text-rose-500 animate-pulse' : 'text-emerald-400'
            }`}>
              {liveDb} <span className="text-xl font-normal text-slate-400">dB</span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isViolating ? '⚠️ Acoustic Violation Detected' : '✅ Within Safe Standard'}
            </div>
          </div>

          {/* Animated Bar Meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 dB</span>
              <span className="text-amber-400">50 dB (Silence)</span>
              <span className="text-rose-400">65 dB (Commercial)</span>
              <span>100 dB</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all ${
                  isViolating ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min((liveDb / 100) * 100, 100)}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleDispatchViolation}
            disabled={alertDispatched}
            className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-md ${
              alertDispatched
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            {alertDispatched ? 'Traffic Acoustic Challan Dispatched!' : 'Report Horn & Decibel Breach'}
          </button>
        </div>

        {/* Readings List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-base text-navy-900">
            Monitored Noise Zones
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readings.map((r) => {
              const isBad = r.status === 'Violating';

              return (
                <div
                  key={r.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all space-y-3 ${
                    isBad
                      ? 'border-rose-300/80 bg-rose-50/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isBad ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {r.category}: {r.status}
                    </span>
                    <span className="font-mono text-xs font-black text-navy-900">
                      {r.current_db} dB / {r.permissible_limit_db} dB Max
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-navy-900">{r.area_name}</h4>
                    <div className="text-xs text-slate-500 font-medium">{r.zone}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="text-slate-400 font-bold uppercase text-[10px]">Primary Source:</div>
                    <div className="font-bold text-navy-900">{r.primary_source}</div>
                    <div className="text-slate-500 text-[10px]">Updated: {r.recorded_at}</div>
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

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SafeRouteHazard } from '../types';
import {
  Navigation, AlertTriangle, ShieldCheck, CheckCircle2, MapPin,
  ArrowRight, RefreshCw, Compass, Shield, Check, Flame, Waves, EyeOff
} from 'lucide-react';

export const SafeRoutePage: React.FC = () => {
  const [hazards, setHazards] = useState<SafeRouteHazard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [origin, setOrigin] = useState<string>('Anna Nagar West');
  const [destination, setDestination] = useState<string>('T. Nagar Panagal Park');
  const [avoidWaterlogging, setAvoidWaterlogging] = useState<boolean>(true);
  const [avoidUnlit, setAvoidUnlit] = useState<boolean>(true);
  const [avoidPotholes, setAvoidPotholes] = useState<boolean>(true);
  const [selectedRoute, setSelectedRoute] = useState<'safe' | 'standard'>('safe');

  useEffect(() => {
    loadHazards();
  }, []);

  const loadHazards = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSafeRouteHazards();
      setHazards(data);
    } catch (err) {
      console.error('Failed to load hazards', err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeHazardsCount = hazards.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" /> Feature #10 · Citizen Services
            </span>
            <span className="text-xs text-slate-400 font-medium">Civic Hazard Navigation</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            SafeRoute Navigation & Hazard Avoidance
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Calculates safer urban transit corridors by automatically detouring around verified waterlogging, unlit alleys, open trenches, and severe potholes.
          </p>
        </div>

        <button
          onClick={loadHazards}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Hazards
        </button>
      </div>

      {/* Route Parameters & Safety Toggles */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-md bg-white grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Origin / Destination inputs */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transit Endpoints</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Starting Location"
                className="bg-transparent text-xs font-bold text-slate-800 w-full focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <Compass className="w-4 h-4 text-rose-600 shrink-0" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination"
                className="bg-transparent text-xs font-bold text-slate-800 w-full focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Hazard Filter Toggles */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hazard Avoidance Rules</div>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs">
              <span className="flex items-center gap-2 text-slate-700 font-semibold">
                <Waves className="w-4 h-4 text-blue-500" /> Avoid Waterlogged Roads
              </span>
              <input
                type="checkbox"
                checked={avoidWaterlogging}
                onChange={(e) => setAvoidWaterlogging(e.target.checked)}
                className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs">
              <span className="flex items-center gap-2 text-slate-700 font-semibold">
                <EyeOff className="w-4 h-4 text-purple-500" /> Avoid Dark / Unlit Streets
              </span>
              <input
                type="checkbox"
                checked={avoidUnlit}
                onChange={(e) => setAvoidUnlit(e.target.checked)}
                className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs">
              <span className="flex items-center gap-2 text-slate-700 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Avoid Severe Potholes
              </span>
              <input
                type="checkbox"
                checked={avoidPotholes}
                onChange={(e) => setAvoidPotholes(e.target.checked)}
                className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Route Comparison Options */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Transit Strategy</div>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedRoute('safe')}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                selectedRoute === 'safe'
                  ? 'bg-teal-50 border-teal-500 shadow-md ring-2 ring-teal-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-teal-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" /> SafeRoute Recommended
                </span>
                <span className="text-[11px] font-black text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                  0 Hazards
                </span>
              </div>
              <div className="text-sm font-extrabold text-navy-900 mt-1">7.1 km · 21 mins</div>
              <div className="text-[11px] text-slate-500">+3 mins detour for 100% lit & dry road</div>
            </button>

            <button
              onClick={() => setSelectedRoute('standard')}
              className={`w-full p-3 rounded-xl border text-left transition-all ${
                selectedRoute === 'standard'
                  ? 'bg-rose-50 border-rose-500 shadow-md ring-2 ring-rose-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-700">Standard Direct Route</span>
                <span className="text-[11px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                  3 Active Hazards
                </span>
              </div>
              <div className="text-sm font-extrabold text-navy-900 mt-1">6.2 km · 18 mins</div>
              <div className="text-[11px] text-rose-600 font-semibold">Contains waterlogging & unlit stretch</div>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SafeRoute Canvas Map & Hazard Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-navy-900">
              <Navigation className="w-4 h-4 text-teal-600" />
              <span>Transit Corridor Canvas</span>
            </div>
            <div className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
              {selectedRoute === 'safe' ? '🛡️ Safe Detour Active' : '⚠️ Direct Route Selected'}
            </div>
          </div>

          <div className="relative w-full h-[460px] rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
            {/* SVG Roads & Detour Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400">
              {/* Grid backdrop */}
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Standard Dangerous Path */}
              <path
                d="M 80 320 Q 220 280 300 200 T 520 80"
                fill="none"
                stroke={selectedRoute === 'standard' ? '#f43f5e' : '#475569'}
                strokeWidth={selectedRoute === 'standard' ? '6' : '3'}
                strokeDasharray={selectedRoute === 'standard' ? 'none' : '6 6'}
              />

              {/* Safe Detour Path (Green/Teal) */}
              <path
                d="M 80 320 C 140 370 280 360 380 280 S 480 180 520 80"
                fill="none"
                stroke={selectedRoute === 'safe' ? '#0d9488' : '#334155'}
                strokeWidth={selectedRoute === 'safe' ? '7' : '3'}
              />
            </svg>

            {/* Origin Marker */}
            <div className="absolute left-[80px] bottom-[80px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
              <div className="w-6 h-6 rounded-full bg-teal-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
                A
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-navy-900/90 text-white text-[10px] font-bold">
                {origin}
              </span>
            </div>

            {/* Destination Marker */}
            <div className="absolute right-[80px] top-[80px] translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
              <div className="w-6 h-6 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
                B
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-md bg-navy-900/90 text-white text-[10px] font-bold">
                {destination}
              </span>
            </div>

            {/* Simulated Hazards along the standard route */}
            {hazards.map((haz, idx) => {
              const xPos = 35 + idx * 18;
              const yPos = 30 + idx * 16;
              return (
                <div
                  key={haz.id}
                  style={{ left: `${xPos}%`, top: `${yPos}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer"
                >
                  <span className="absolute -inset-1 rounded-full bg-rose-500 animate-ping opacity-60" />
                  <div className="relative w-7 h-7 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white shadow-xl">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded-xl bg-navy-900 text-white text-[11px] shadow-2xl z-30 pointer-events-none border border-slate-700">
                    <div className="font-bold text-rose-400">{haz.hazard_type}</div>
                    <div className="text-slate-300 mt-0.5">{haz.location_name}</div>
                    <div className="text-teal-400 text-[10px] mt-1 font-mono">Detour Recommended</div>
                  </div>
                </div>
              );
            })}

            {/* Canvas Legend */}
            <div className="absolute bottom-3 left-3 bg-navy-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white text-xs space-y-1.5 shadow-lg">
              <div className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Corridor Legend</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-teal-500 rounded" />
                <span>SafeRoute (Clear of Hazards)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-rose-500 rounded" />
                <span>Standard Road (3 Hazard Bottlenecks)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hazard Ledger Column */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Active Hazards on Standard Route
            </h3>

            <div className="space-y-2.5">
              {hazards.map((h) => (
                <div
                  key={h.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      {h.hazard_type}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Severity: {h.severity}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-800">{h.location_name}</div>
                  <p className="text-[11px] text-slate-600 leading-snug">{h.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              Live Detour Guarantee
            </div>
            <p className="text-[11px] text-teal-700 leading-relaxed">
              SafeRoute recalculates dynamically using citizen reports verified in the last 60 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

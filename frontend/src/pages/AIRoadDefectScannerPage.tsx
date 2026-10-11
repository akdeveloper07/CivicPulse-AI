import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DetectedRoadDefect } from '../types';
import { realTimeService } from '../services/realtime';
import {
  Camera, Sparkles, Building2, Shield, Scan, AlertTriangle,
  Play, Pause, RefreshCw, CheckCircle2, Crosshair, MapPin
} from 'lucide-react';

export const AIRoadDefectScannerPage: React.FC = () => {
  const [defects, setDefects] = useState<DetectedRoadDefect[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [activeDefectIndex, setActiveDefectIndex] = useState(0);
  const [loggedDefectsCount, setLoggedDefectsCount] = useState(14);
  const [justLogged, setJustLogged] = useState(false);

  useEffect(() => {
    api.getRoadDefects().then((data) => setDefects(data));
  }, []);

  // Simulate scanning bounding box cycle
  useEffect(() => {
    if (!isScanning || defects.length === 0) return;
    const interval = setInterval(() => {
      setActiveDefectIndex((prev) => (prev + 1) % defects.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isScanning, defects.length]);

  const activeDefect = defects[activeDefectIndex] || defects[0];

  const handleLogActiveDefect = () => {
    if (!activeDefect) return;
    setJustLogged(true);
    setLoggedDefectsCount((prev) => prev + 1);

    realTimeService.broadcast({
      id: `evt-cv-${Date.now()}`,
      timestamp: 'Just now',
      type: 'NEW_REPORT',
      title: `AI Dashcam Detected: ${activeDefect.type} (${Math.round(activeDefect.confidence * 100)}% Conf)`,
      description: `Surface anomaly logged at ${activeDefect.street_name}. Priority: ${activeDefect.severity}`,
      ward: 'Ward 104 (Zone VII)',
      department: 'GCC Works & Highways Department',
      status: 'Auto-Logged via CV',
      urgency: activeDefect.severity === 'Severe' ? 'critical' : 'high',
    });

    setTimeout(() => setJustLogged(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" /> Boost Feature #4 · Vision AI
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 text-[10px] font-black uppercase">
              YOLOv8 Edge Inference
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            AI Dashcam Road Scanner & Surface Profiler
          </h1>
          <p className="text-xs text-indigo-200/90 max-w-2xl">
            Automated road surface surveillance: Municipal patrol vehicles and citizen dashcams run real-time Computer Vision to detect potholes, asphalt fissures, and open manhole hazards.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-indigo-300">Total Scanned KM</div>
          <div className="text-base font-black text-white font-mono">1,420 km</div>
          <div className="text-[10px] text-indigo-300/80">98.4% Surface Coverage</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> GCC Works & Highways Department
            <span className="text-slate-400 ml-2">(Nodal: Er. R. Manivannan, CE · Road Pavement Engineering Wing)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[11px] border border-indigo-500/30 shrink-0">
          👥 Accessible by: Field Contractors & Citizens
        </span>
      </div>

      {/* Main Scanner Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Dashcam HUD Viewport */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span className="text-emerald-400 font-bold">DASHCAM STREAM ACTIVE</span>
              <span className="text-slate-500">| 1080p @ 30 FPS</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsScanning(!isScanning)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {isScanning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isScanning ? 'Pause CV' : 'Resume CV'}</span>
              </button>
            </div>
          </div>

          {/* Simulated HUD Camera Frame */}
          <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center border border-slate-800">
            {/* Background Road Image / Simulation Grid */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Road Perspective Lines */}
            <div className="absolute inset-x-0 bottom-0 h-48 border-b-2 border-dashed border-teal-500/40 transform perspective-[400px] rotate-x-[45deg]" />

            {/* Scanning Laser Beam */}
            {isScanning && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-pulse shadow-[0_0_15px_#2dd4bf]" />
            )}

            {/* Computer Vision Bounding Box Target */}
            {activeDefect && (
              <div className="absolute z-10 border-2 border-rose-500 bg-rose-500/20 rounded-lg p-2 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-fade-in flex flex-col justify-between"
                style={{
                  width: `${activeDefect.bounding_box.width + 40}px`,
                  height: `${activeDefect.bounding_box.height + 40}px`,
                }}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded">
                  <span>{activeDefect.type}</span>
                  <span>{Math.round(activeDefect.confidence * 100)}%</span>
                </div>
                <div className="text-[9px] font-mono text-rose-300 bg-black/60 px-1 py-0.5 rounded truncate">
                  {activeDefect.street_name}
                </div>
              </div>
            )}

            {/* GPS HUD Corner Overlay */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[11px] font-mono space-y-0.5">
              <div className="text-teal-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> LAT: {activeDefect?.latitude || 13.0850}° N | LNG: {activeDefect?.longitude || 80.2102}° E
              </div>
              <div className="text-slate-400">VEHICLE SPEED: 24 km/h · ACCURACY: ±0.3m</div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between p-2">
            <span className="text-xs text-slate-400">
              Auto-log trigger: Confidence threshold &gt; 85%
            </span>
            <button
              onClick={handleLogActiveDefect}
              disabled={justLogged}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                justLogged
                  ? 'bg-emerald-600 text-white'
                  : 'bg-teal-600 hover:bg-teal-500 text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>{justLogged ? 'Defect Dispatched to GCC!' : 'Capture & Log This Defect'}</span>
            </button>
          </div>
        </div>

        {/* Right: Detected Road Anomalies List */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-navy-900 flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-teal-600" />
              Detected Road Fissures
            </h3>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {loggedDefectsCount} Total Logged
            </span>
          </div>

          <div className="space-y-3">
            {defects.map((d, idx) => {
              const isCurrent = activeDefectIndex === idx;

              return (
                <div
                  key={d.id}
                  onClick={() => setActiveDefectIndex(idx)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                    isCurrent
                      ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy-900">{d.type}</span>
                    <span className="font-mono text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {Math.round(d.confidence * 100)}% Confidence
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {d.street_name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Severity: <strong className="text-rose-600">{d.severity}</strong></span>
                    <span>Zone VII · Ward 104</span>
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { realTimeService } from '../../services/realtime';
import { RealTimeCivicEvent } from '../../types';
import {
  Activity, Radio, Zap, Shield, ChevronRight, Pause, Play,
  AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';

export const LiveTelemetryBar: React.FC = () => {
  const [events, setEvents] = useState<RealTimeCivicEvent[]>(realTimeService.getRecentEvents());
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState<boolean>(realTimeService.isStreamActive());
  const [justTriggered, setJustTriggered] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = realTimeService.subscribe((newEvent) => {
      setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
      setCurrentIdx(0);
    });
    return () => unsubscribe();
  }, []);

  // Cycle through top 4 events every 4 seconds
  useEffect(() => {
    if (!isStreaming || events.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % Math.min(events.length, 5));
    }, 4500);
    return () => clearInterval(interval);
  }, [isStreaming, events.length]);

  const handleTriggerLive = () => {
    setJustTriggered(true);
    realTimeService.triggerSimulatedIncident();
    setTimeout(() => setJustTriggered(false), 2000);
  };

  const handleToggleStreaming = () => {
    const active = realTimeService.toggleStreaming();
    setIsStreaming(active);
  };

  const currentEvent = events[currentIdx] || events[0];

  return (
    <div className="bg-slate-950 text-slate-200 border-b border-teal-500/20 text-xs px-3 sm:px-6 py-2 select-none shadow-inner relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Real-Time Status & Department Latency Indicators */}
        <div className="flex items-center gap-3 shrink-0 overflow-x-auto w-full md:w-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-950/80 border border-teal-500/40 text-teal-300 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping inline-block" />
            <Radio className="w-3 h-3 text-teal-400" />
            <span>REAL-TIME ONLINE</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span className="text-slate-500">NODES:</span>
            <span className="text-emerald-400">GCC 12ms</span>
            <span className="text-slate-600">·</span>
            <span className="text-teal-400">CMWSSB 18ms</span>
            <span className="text-slate-600">·</span>
            <span className="text-amber-400">TANGEDCO 15ms</span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-400">GCTP 14ms</span>
          </div>
        </div>

        {/* Center: Live Incident Ticker */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-center px-2">
          {currentEvent && (
            <div className="flex items-center gap-2 text-slate-300 truncate text-[11px] animate-fade-in">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                currentEvent.urgency === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                currentEvent.urgency === 'high' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-teal-500/20 text-teal-300 border border-teal-500/40'
              }`}>
                {currentEvent.timestamp}
              </span>
              <span className="font-semibold text-white truncate">
                {currentEvent.title}
              </span>
              <span className="text-slate-500 hidden sm:inline">→</span>
              <span className="text-teal-400 font-medium hidden sm:inline truncate">
                [{currentEvent.department}]
              </span>
              <span className="text-slate-400 text-[10px] hidden md:inline truncate">
                ({currentEvent.ward})
              </span>
            </div>
          )}
        </div>

        {/* Right: Interactive Live Simulation Controls & Department Directory Link */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleTriggerLive}
            disabled={justTriggered}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
              justTriggered
                ? 'bg-teal-400 text-slate-950 font-extrabold shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30'
            }`}
            title="Simulate an instant real-time civic incident"
          >
            <Zap className={`w-3 h-3 ${justTriggered ? 'animate-bounce' : 'text-teal-400'}`} />
            <span>{justTriggered ? 'Dispatched!' : 'Simulate Event'}</span>
          </button>

          <button
            onClick={handleToggleStreaming}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
            title={isStreaming ? 'Pause live stream' : 'Resume live stream'}
          >
            {isStreaming ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-teal-400" />}
          </button>

          <Link
            to="/departments"
            className="px-2 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-[10px] font-semibold flex items-center gap-1 border border-teal-500/30 transition-all"
          >
            <span>Departments</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

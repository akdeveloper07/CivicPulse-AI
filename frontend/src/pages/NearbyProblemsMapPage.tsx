import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { NearbyCivicIssue } from '../types';
import {
  MapPin, ThumbsUp, CheckCircle2, Filter, Compass, AlertCircle,
  Eye, RefreshCw, Shield, Sparkles, Navigation, Layers
} from 'lucide-react';

export const NearbyProblemsMapPage: React.FC = () => {
  const [issues, setIssues] = useState<NearbyCivicIssue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRadius, setSelectedRadius] = useState<number>(2.0); // km
  const [activeIssue, setActiveIssue] = useState<NearbyCivicIssue | null>(null);
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  useEffect(() => {
    loadNearbyIssues();
  }, []);

  const loadNearbyIssues = async () => {
    setIsLoading(true);
    try {
      const data = await api.getNearbyIssues();
      setIssues(data);
      if (data.length > 0) setActiveIssue(data[0]);
    } catch (err) {
      console.error('Failed to load nearby issues', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupport = async (issueId: string) => {
    try {
      const updated = await api.supportNearbyIssue(issueId);
      setIssues((prev) =>
        prev.map((item) =>
          item.id === issueId
            ? { ...item, support_count: item.support_count + 1, user_supported: true }
            : item
        )
      );
      if (activeIssue?.id === issueId) {
        setActiveIssue((prev) =>
          prev ? { ...prev, support_count: prev.support_count + 1, user_supported: true } : null
        );
      }
      setSupportMessage('Your support was added! This report has gained higher municipal priority without duplicating tickets.');
      setTimeout(() => setSupportMessage(null), 4000);
    } catch (err) {
      console.error('Failed to support issue', err);
    }
  };

  const categories = ['All', 'Roads', 'Water', 'Waste', 'Electrical', 'Sanitation'];

  const filteredIssues = issues.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const itemDistance = item.distance_km ?? ((item.distance_meters || 500) / 1000);
    const matchesRadius = itemDistance <= selectedRadius;
    return matchesCat && matchesRadius;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Feature #2 · Citizen Services
            </span>
            <span className="text-xs text-slate-400 font-medium">Pre-Submission Radar</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Nearby Problems Map</h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Inspect reported infrastructure problems around your current location. Back existing tickets with 1-click support instead of creating duplicate requests.
          </p>
        </div>

        <button
          onClick={loadNearbyIssues}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Radar
        </button>
      </div>

      {/* Support Feedback Toast */}
      {supportMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{supportMessage}</span>
        </div>
      )}

      {/* Radius and Category Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Radius Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Radius:</span>
          {[0.5, 1.0, 2.0, 5.0].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRadius(r)}
              className={`px-2.5 py-1 rounded-lg font-bold ${
                selectedRadius === r
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Map Radar + Problem Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Radar Canvas Map */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4 shadow-lg border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-navy-900">
              <Navigation className="w-4 h-4 text-teal-600" />
              <span>Neighbourhood Radar Map</span>
              <span className="text-xs text-slate-500 font-normal">({filteredIssues.length} issues in {selectedRadius} km)</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              GPS Locked: Anna Nagar (13.0850° N, 80.2101° E)
            </div>
          </div>

          {/* Radar Map Canvas */}
          <div className="relative w-full h-[460px] rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
            {/* Concentric Radar Rings */}
            <div className="absolute w-[180px] h-[180px] rounded-full border border-teal-500/30 animate-pulse pointer-events-none" />
            <div className="absolute w-[320px] h-[320px] rounded-full border border-teal-500/20 pointer-events-none" />
            <div className="absolute w-[440px] h-[440px] rounded-full border border-slate-700/40 pointer-events-none" />

            {/* Radar Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-teal-500/15 pointer-events-none" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-teal-500/15 pointer-events-none" />

            {/* User Location Pulse Center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
              <div className="w-5 h-5 rounded-full bg-teal-400 border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
                <div className="w-2 h-2 rounded-full bg-teal-900" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-navy-900/90 text-teal-300 text-[10px] font-bold border border-teal-500/30">
                You Are Here
              </span>
            </div>

            {/* Nearby Problem Hotspots */}
            {filteredIssues.map((item, idx) => {
              // Calculate spatial scatter relative to center
              const itemDistance = item.distance_km ?? ((item.distance_meters || 500) / 1000);
              const angle = (idx * 67 + 35) * (Math.PI / 180);
              const distFactor = Math.min(itemDistance / selectedRadius, 0.9);
              const radiusPixels = distFactor * 190;
              const xOffset = Math.cos(angle) * radiusPixels;
              const yOffset = Math.sin(angle) * radiusPixels;

              const isSelected = activeIssue?.id === item.id;
              const isUrgent = item.urgency === 'High' || item.urgency === 'Critical';

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveIssue(item)}
                  style={{
                    transform: `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px))`,
                  }}
                  className="absolute left-1/2 top-1/2 cursor-pointer group z-10 transition-transform duration-200 hover:scale-125"
                >
                  {isUrgent && (
                    <span className="absolute -inset-1 rounded-full bg-rose-500 animate-ping opacity-60" />
                  )}
                  <div
                    className={`relative px-2.5 py-1 rounded-full flex items-center gap-1 text-white text-[11px] font-bold shadow-xl border-2 ${
                      isSelected
                        ? 'bg-teal-500 border-white ring-4 ring-teal-400/50 scale-110'
                        : isUrgent
                        ? 'bg-rose-600 border-white'
                        : 'bg-indigo-600 border-white'
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{item.category}</span>
                  </div>

                  {/* Hover Tag */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded-xl bg-navy-900 text-white text-[11px] shadow-2xl z-30 pointer-events-none border border-slate-700">
                    <div className="font-bold truncate">{item.title}</div>
                    <div className="text-teal-400 mt-0.5">{itemDistance.toFixed(1)} km away · {item.support_count} supporters</div>
                  </div>
                </div>
              );
            })}

            {/* Radar Legend */}
            <div className="absolute bottom-3 left-3 bg-navy-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white text-xs space-y-1 shadow-lg">
              <div className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Radar Key</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span>Your Location (0.0 km)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span>High Urgency Issue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>Moderate Issue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Issue Details & Support Action */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" /> Issue Dossier
            </h3>

            {activeIssue ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
                      {activeIssue.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {(activeIssue.distance_km ?? ((activeIssue.distance_meters || 500) / 1000)).toFixed(1)} km away
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base leading-snug">
                    {activeIssue.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeIssue.description}
                  </p>
                  <div className="text-[11px] text-slate-500 font-medium">
                    📍 {activeIssue.location_name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-slate-500 font-semibold">Department</div>
                    <div className="text-sm font-bold text-navy-900 mt-0.5 truncate">{activeIssue.department}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-slate-500 font-semibold">Community Support</div>
                    <div className="text-lg font-black text-teal-600 mt-0.5">{activeIssue.support_count} Citizens</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Civic Duplicate Shield
                  </span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    By clicking <strong>Support this Issue</strong>, you upvote this existing ticket. The municipal dashboard merges community weight without clogging field crews with redundant tickets!
                  </p>
                </div>

                {/* 1-Click Support Button */}
                <button
                  onClick={() => handleSupport(activeIssue.id)}
                  disabled={activeIssue.user_supported}
                  className={`w-full py-3 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
                    activeIssue.user_supported
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'bg-teal-600 hover:bg-teal-500 text-white hover:shadow-teal-500/25'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {activeIssue.user_supported ? 'You Supported This Issue (+1 Registered)' : 'Support this Issue (+1 Weight)'}
                </button>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-sm space-y-2">
                <MapPin className="w-10 h-10 mx-auto text-slate-300" />
                <p>Select any issue marker on the radar map to view details.</p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-200 pt-3 text-center">
            Integrated with CivicNexus Deduplication Engine.
          </div>
        </div>
      </div>
    </div>
  );
};

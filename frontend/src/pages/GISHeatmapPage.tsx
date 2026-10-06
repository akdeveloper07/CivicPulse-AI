import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GISHeatmapPoint, WardStat } from '../types';
import { MapPin, Layers, Shield, Activity, Filter, RefreshCw, AlertTriangle, Eye } from 'lucide-react';

export const GISHeatmapPage: React.FC = () => {
  const [points, setPoints] = useState<GISHeatmapPoint[]>([]);
  const [wardStats, setWardStats] = useState<WardStat[]>([]);
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activePoint, setActivePoint] = useState<GISHeatmapPoint | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [heatmapData, wardData] = await Promise.all([
        api.getGISHeatmap(),
        api.getWardStats()
      ]);
      setPoints(heatmapData);
      setWardStats(wardData);
    } catch (err) {
      console.error('Failed to load GIS Heatmap data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPoints = points.filter(p => {
    const wardMatch = selectedWard === 'All' || p.ward.toLowerCase().includes(selectedWard.toLowerCase());
    const catMatch = selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return wardMatch && catMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Spatial GIS Intelligence
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Interactive GIS Spatial Heatmap</h1>
          <p className="text-xs md:text-sm text-slate-300">
            Real-time geospatial visualization of active civic complaint clusters and ward-by-ward infrastructure health.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh GIS Radar
        </button>
      </div>

      {/* Ward Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {wardStats.map((w, i) => (
          <div
            key={i}
            onClick={() => setSelectedWard(selectedWard === w.ward_name ? 'All' : w.ward_name)}
            className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
              selectedWard === w.ward_name
                ? 'bg-teal-500 text-white border-teal-600 shadow-md ring-2 ring-teal-400'
                : 'glass-card hover:border-teal-300'
            }`}
          >
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-80">{w.ward_name}</div>
            <div className="text-xl font-black mt-1">{w.total_issues} <span className="text-xs font-normal opacity-80">Issues</span></div>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span>SLA Health:</span>
              <span className="font-bold">{w.sla_health_pct}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Map & Filter View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas Representation */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4 shadow-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-navy-900">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Municipal Infrastructure Density Map</span>
              <span className="text-xs text-slate-500 font-normal">({filteredPoints.length} Active Hotspots)</span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              {['All', 'Roads', 'Water', 'Garbage', 'Electrical'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Map View Representation */}
          <div className="relative w-full h-[440px] rounded-xl bg-slate-900 overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>

            {/* Simulated Geographic Landmass Shape */}
            <div className="absolute inset-8 rounded-full border border-teal-500/20 bg-teal-950/20 blur-xl pointer-events-none"></div>

            {/* Interactive Hotspot Markers */}
            {filteredPoints.map((pt, idx) => {
              const xPos = 15 + ((idx * 23) % 70);
              const yPos = 15 + ((idx * 31) % 65);
              const isHighPriority = pt.priority_score >= 65;

              return (
                <div
                  key={pt.id}
                  onClick={() => setActivePoint(pt)}
                  style={{ left: `${xPos}%`, top: `${yPos}%` }}
                  className="absolute cursor-pointer group transform -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-200 hover:scale-125"
                >
                  {/* Ping Animation for High Priority */}
                  {isHighPriority && (
                    <span className="absolute -inset-1 rounded-full bg-rose-500 animate-ping opacity-75"></span>
                  )}
                  <div
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white ${
                      isHighPriority ? 'bg-rose-600' : 'bg-amber-500'
                    }`}
                  >
                    {Math.round(pt.priority_score)}
                  </div>

                  {/* Tooltip Hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 rounded-lg bg-navy-900 text-white text-[11px] shadow-xl z-30 pointer-events-none">
                    <div className="font-bold truncate">{pt.title}</div>
                    <div className="text-teal-400">{pt.ward} • {pt.category}</div>
                  </div>
                </div>
              );
            })}

            {/* Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-navy-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white text-xs space-y-1.5 shadow-lg">
              <div className="font-bold text-[11px] text-slate-300 uppercase tracking-wider">Priority Density</div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span>
                <span>Critical Priority (&ge; 65)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span>Moderate Priority (&lt; 65)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Hotspot Details */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" /> Hotspot Intelligence Detail
            </h3>

            {activePoint ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="badge-pill bg-teal-100 text-teal-800">{activePoint.ward}</span>
                  <h4 className="font-bold text-slate-900 text-base">{activePoint.title}</h4>
                  <p className="text-xs text-slate-500">Category: {activePoint.category}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-slate-500 font-semibold">Priority Score</div>
                    <div className="text-xl font-extrabold text-rose-600 mt-0.5">{activePoint.priority_score}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="text-slate-500 font-semibold">Status</div>
                    <div className="text-sm font-bold text-navy-900 mt-1">{activePoint.status}</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Geographic proximity suggests potential cross-category root cause co-occurrence.</span>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-sm space-y-2">
                <MapPin className="w-10 h-10 mx-auto text-slate-300" />
                <p>Click any numbered marker on the map to inspect spatial details.</p>
              </div>
            )}
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-200 pt-4 text-center">
            Updated live with SentenceTransformers spatial vector embeddings.
          </div>
        </div>
      </div>
    </div>
  );
};

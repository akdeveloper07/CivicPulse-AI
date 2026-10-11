import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FloodRescuePoint } from '../types';
import { realTimeService } from '../services/realtime';
import {
  Waves, AlertTriangle, Shield, Building2, Phone, LifeBuoy,
  CheckCircle2, Compass, Droplet, ArrowUpRight, Zap
} from 'lucide-react';

export const MonsoonFloodDeskPage: React.FC = () => {
  const [floodPoints, setFloodPoints] = useState<FloodRescuePoint[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Critical' | 'Severe'>('All');
  const [requestedPumpId, setRequestedPumpId] = useState<string | null>(null);

  useEffect(() => {
    api.getFloodPoints().then((data) => setFloodPoints(data));
  }, []);

  const handleRequestPump = (id: string, name: string) => {
    setRequestedPumpId(id);
    realTimeService.broadcast({
      id: `evt-flood-${Date.now()}`,
      timestamp: 'Just now',
      type: 'CREW_DISPATCHED',
      title: 'High-Capacity Dewatering Pump Dispatched',
      description: `Emergency 100-HP pump en route to ${name}. Water discharge active.`,
      ward: 'SWD Flood Response Corridor',
      department: 'GCC Stormwater Drain & Flood Relief Cell',
      status: 'En Route',
      urgency: 'critical',
    });
    setTimeout(() => setRequestedPumpId(null), 3000);
  };

  const filtered = floodPoints.filter((pt) => {
    if (selectedFilter === 'All') return true;
    return pt.risk_level === selectedFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-blue-950 via-cyan-950 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5" /> Boost Feature #2 · Disaster Safety
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase border border-rose-500/30">
              Live Sensor Inundation
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Monsoon Flood Relief Radar & Rescue Desk
          </h1>
          <p className="text-xs text-cyan-200/90 max-w-2xl">
            Real-time urban flood telemetry: Inundation depths, deployed 100-HP dewatering pumps, NDRF rescue boats, and certified relief shelters across low-lying vulnerable wards.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-cyan-300">State Disaster Control</div>
          <div className="text-base font-black text-white font-mono">1070 / 1913</div>
          <div className="text-[10px] text-cyan-300/80">Toll-Free Emergency Response</div>
        </div>
      </div>

      {/* Department & Access Dossier */}
      <div className="bg-slate-900 text-white border border-cyan-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> GCC Stormwater Drain & Flood Relief Cell
            <span className="text-slate-400 ml-2">(Nodal: Er. P. Thirunavukkarasu, SE · Tel: 044-25619206)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[11px] border border-cyan-500/30 shrink-0">
          👥 Accessible by: All Citizens & Disaster Responders
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['All', 'Critical', 'Severe'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedFilter === filter
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {filter} Spots
          </button>
        ))}
      </div>

      {/* Live Inundation Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((pt) => {
          const isCritical = pt.risk_level === 'Critical';
          const isSevere = pt.risk_level === 'Severe';
          const isRequested = requestedPumpId === pt.id;

          return (
            <div
              key={pt.id}
              className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isCritical
                  ? 'border-rose-400/80 bg-rose-50/30'
                  : isSevere
                  ? 'border-amber-400/80 bg-amber-50/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    isCritical ? 'bg-rose-500 text-white border-rose-600 animate-pulse' :
                    isSevere ? 'bg-amber-500 text-white border-amber-600' :
                    'bg-emerald-500 text-white border-emerald-600'
                  }`}>
                    {pt.risk_level} Inundation Risk
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Updated {pt.updated_at}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-navy-900">{pt.location_name}</h3>
                  <div className="text-xs text-slate-500 font-medium">{pt.zone}</div>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Water Depth</div>
                    <div className={`text-base font-black ${isCritical ? 'text-rose-600' : 'text-cyan-700'}`}>
                      {pt.water_depth_inches}"
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Active Pumps</div>
                    <div className="text-base font-black text-slate-800">
                      {pt.pumps_operational} Units
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Rescue Boats</div>
                    <div className="text-base font-black text-slate-800">
                      {pt.boats_deployed} Boats
                    </div>
                  </div>
                </div>

                {/* Designated Relief Shelter */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="text-slate-500 font-bold uppercase text-[10px]">
                    Designated Dry Relief Shelter:
                  </div>
                  <div className="font-bold text-navy-900">{pt.relief_camp}</div>
                  <div className="text-slate-500 text-[11px]">Capacity: {pt.shelter_capacity} persons · Hot meals & medical camp active</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                <a
                  href={`tel:${pt.helpline}`}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call {pt.helpline}
                </a>

                <button
                  onClick={() => handleRequestPump(pt.id, pt.location_name)}
                  disabled={isRequested}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                    isRequested
                      ? 'bg-emerald-600 text-white'
                      : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  }`}
                >
                  <LifeBuoy className={`w-3.5 h-3.5 ${isRequested ? 'animate-spin' : ''}`} />
                  <span>{isRequested ? 'Pump Unit Dispatched!' : 'Request Dewatering Pump'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

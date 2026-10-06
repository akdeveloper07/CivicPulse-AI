import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DispatchRoute } from '../types';
import { Navigation, Truck, Fuel, Clock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const FieldDispatchPage: React.FC = () => {
  const [routes, setRoutes] = useState<DispatchRoute[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDispatchRoutes();
      setRoutes(data);
    } catch (err) {
      console.error('Failed to load dispatch routes', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssign = async (routeId: string, crewName: string) => {
    try {
      const res = await api.assignDispatchRoute(routeId, crewName);
      setAssignedSuccess(res.message);
      setTimeout(() => setAssignedSuccess(null), 4000);
      fetchRoutes();
    } catch (err: any) {
      alert(err.message || 'Assignment failed.');
    }
  };

  const totalFuelSaved = routes.reduce((sum, r) => sum + r.fuel_saved_gallons, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-navy-900 text-white rounded-2xl shadow-xl">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1 w-fit">
            <Truck className="w-3.5 h-3.5" /> AI Resource Optimization
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Field Crew Dispatch & Route Optimizer</h1>
          <p className="text-xs md:text-sm text-slate-300">
            Groups high-priority clusters geographically into optimal work orders to reduce travel time and fuel cost.
          </p>
        </div>

        {/* Savings Metric Widget */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center flex items-center gap-4">
          <Fuel className="w-8 h-8 text-emerald-400 shrink-0" />
          <div className="text-left">
            <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Est. Fuel Savings</div>
            <div className="text-2xl font-black text-white">{totalFuelSaved.toFixed(1)} <span className="text-xs font-normal text-emerald-300">Gallons</span></div>
          </div>
        </div>
      </div>

      {assignedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{assignedSuccess}</span>
        </div>
      )}

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((route) => (
          <div key={route.route_id} className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-pill bg-navy-900 text-white font-mono text-xs">{route.route_id}</span>
                <span className="badge-pill bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {route.priority_level}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-navy-900">{route.ward}</h3>
                <p className="text-xs text-slate-500 font-medium">Assigned Unit: <span className="text-teal-700 font-semibold">{route.crew_name}</span></p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200 text-center text-xs">
                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Clustered Issues</div>
                  <div className="text-base font-extrabold text-navy-900">{route.issue_count}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Est. Hours</div>
                  <div className="text-base font-extrabold text-navy-900 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" /> {route.estimated_hours}h
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-bold uppercase text-[10px]">Fuel Saved</div>
                  <div className="text-base font-extrabold text-emerald-600">{route.fuel_saved_gallons} gal</div>
                </div>
              </div>

              {/* Batched Work Items */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700">Batched Repair Work Orders:</div>
                <div className="space-y-1.5">
                  {route.cluster_titles.map((title, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleAssign(route.route_id, route.crew_name)}
              className="w-full mt-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Confirm & Dispatch Crew</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

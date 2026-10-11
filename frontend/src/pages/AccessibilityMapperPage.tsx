import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AccessibilityBarrier } from '../types';
import {
  Accessibility, AlertCircle, CheckCircle2, Plus, MapPin,
  RefreshCw, Shield, Layers, Filter, Compass, AlertTriangle
} from 'lucide-react';

export const AccessibilityMapperPage: React.FC = () => {
  const [barriers, setBarriers] = useState<AccessibilityBarrier[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newBarrierType, setNewBarrierType] = useState<string>('Broken Ramp');
  const [newSeverity, setNewSeverity] = useState<'Moderate' | 'High' | 'Critical'>('High');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newImpact, setNewImpact] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBarriers();
  }, []);

  const loadBarriers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAccessibilityBarriers();
      setBarriers(data);
    } catch (err) {
      console.error('Failed to load accessibility barriers', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBarrier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLocation.trim()) return;

    try {
      const created = await api.reportAccessibilityBarrier({
        title: newTitle,
        barrier_type: newBarrierType,
        severity: newSeverity,
        location_name: newLocation,
        wheelchair_impact: newImpact || 'Prevents safe passage for wheelchairs and mobility assistance users.',
        status: 'Active Barrier',
      });
      setBarriers([created, ...barriers]);
      setShowAddModal(false);
      setNewTitle('');
      setNewLocation('');
      setNewImpact('');
      setToastMessage('Accessibility barrier successfully registered and flagged to Ward Disability Officer.');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to report barrier', err);
    }
  };

  const barrierTypes = ['All', 'Broken Ramp', 'Missing Tactile Paving', 'High Curb', 'Blocked Walkway'];

  const filteredBarriers = barriers.filter(
    (b) => filterType === 'All' || b.barrier_type === filterType
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
              <Accessibility className="w-3.5 h-3.5" /> Feature #13 · Citizen Services
            </span>
            <span className="text-xs text-slate-400 font-medium">Universal Mobility Access</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Accessibility Mapper & Barrier Radar
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Empowering wheelchair users, senior citizens, and visually impaired commuters with verified pedestrian obstacle audits and barrier reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Report Barrier
          </button>
          <button
            onClick={loadBarriers}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 text-sm flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Barrier Type:
        </span>
        {barrierTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              filterType === type
                ? 'bg-navy-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Barrier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBarriers.map((barrier) => {
          const isCritical = barrier.severity === 'Critical';

          return (
            <div
              key={barrier.id}
              className={`p-6 rounded-2xl border transition-all bg-white shadow-xs hover:shadow-md space-y-4 flex flex-col justify-between ${
                isCritical ? 'border-rose-300' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                    {barrier.barrier_type}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {barrier.severity} Severity
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-navy-900">{barrier.title}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{barrier.location_name}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-[11px] text-slate-500 uppercase">Mobility Impact:</div>
                  <p className="text-[11px] leading-relaxed">{barrier.wheelchair_impact}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Audited by: {barrier.reported_by}</span>
                <span className="font-bold text-teal-600">{barrier.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Barrier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-navy-900 flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-teal-600" />
                Report Pedestrian Barrier
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBarrier} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Barrier Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken wheelchair ramp at Metro entrance"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barrier Category</label>
                  <select
                    value={newBarrierType}
                    onChange={(e) => setNewBarrierType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Broken Ramp">Broken Ramp</option>
                    <option value="Missing Tactile Paving">Missing Tactile Paving</option>
                    <option value="High Curb">High Curb (&gt;15cm)</option>
                    <option value="Blocked Walkway">Blocked Walkway</option>
                    <option value="Broken Sidewalk">Broken Sidewalk</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical (Impassable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location / Landmark</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near T. Nagar Bus Terminus Gate 2"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Impact on Mobility Users</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Wheelchairs cannot mount pavement, forcing users onto active roadway"
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-500 shadow-md"
                >
                  Submit Barrier Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

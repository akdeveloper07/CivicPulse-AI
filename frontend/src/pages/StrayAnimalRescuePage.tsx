import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AnimalRescueReport } from '../types';
import { realTimeService } from '../services/realtime';
import {
  Heart, Building2, Shield, Phone, AlertCircle, CheckCircle2,
  Clock, MapPin, Sparkles, Plus, Send
} from 'lucide-react';

export const StrayAnimalRescuePage: React.FC = () => {
  const [cases, setCases] = useState<AnimalRescueReport[]>([]);
  const [animalType, setAnimalType] = useState<'Dog' | 'Cat' | 'Cattle'>('Dog');
  const [issue, setIssue] = useState<'Injured' | 'Cattle Blocking Traffic' | 'Rabies Suspect'>('Injured');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justReported, setJustReported] = useState(false);

  useEffect(() => {
    api.getAnimalCases().then((data) => setCases(data));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newCase: AnimalRescueReport = {
        id: `an-${Date.now()}`,
        animal_type: animalType,
        issue: issue,
        location: location,
        reported_at: 'Just now',
        status: 'Rescue Van Dispatched',
        assigned_vet: 'Dr. S. Kulanthaivel, BVSc (GCC Mobile Unit)',
        shelter_name: 'GCC Animal Welfare Center, Kannammapet',
      };

      setCases([newCase, ...cases]);
      setIsSubmitting(false);
      setJustReported(true);
      setLocation('');

      realTimeService.broadcast({
        id: `evt-animal-${Date.now()}`,
        timestamp: 'Just now',
        type: 'CREW_DISPATCHED',
        title: `Animal Rescue Van Dispatched: ${animalType} (${issue})`,
        description: `Mobile veterinary ambulance en route to ${location}.`,
        ward: 'Ward 104 (Zone VII)',
        department: 'GCC Public Health & Vector Control',
        status: 'En Route',
        urgency: issue === 'Injured' ? 'critical' : 'high',
      });

      setTimeout(() => setJustReported(false), 3000);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" /> Boost Feature #9 · Compassionate City
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 text-[10px] font-black uppercase">
              24/7 Veterinary Van
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Stray Animal Rescue & Veterinary Ambulance Dispatch
          </h1>
          <p className="text-xs text-rose-200/90 max-w-2xl">
            Humane urban wildlife management: Report injured stray animals, aggressive cattle impeding traffic, and anti-rabies vaccination drives with designated municipal veterinarians.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-rose-300">Animal Control Helpline</div>
          <div className="text-base font-black text-white font-mono">1913 (Ext 2)</div>
          <div className="text-[10px] text-rose-300/80">GCC Veterinary Unit</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-rose-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> GCC Public Health & Vector Control
            <span className="text-slate-400 ml-2">(Nodal: Dr. C. Jagadeesan, City Health Officer · Toll-Free: 104)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[11px] border border-rose-500/30 shrink-0">
          👥 Accessible by: Citizens & Animal Welfare Volunteers
        </span>
      </div>

      {/* Two Column Layout: Report Form & Active Rescues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Report Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-4">
          <h3 className="font-bold text-base text-navy-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-rose-600" />
            Report Stray in Distress
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Animal Species
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Dog', 'Cat', 'Cattle'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAnimalType(t)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      animalType === t
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t === 'Dog' ? '🐕 Dog' : t === 'Cat' ? '🐈 Cat' : '🐄 Cattle'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Distress Condition
              </label>
              <select
                value={issue}
                onChange={(e) => setIssue(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="Injured">Injured / Hit by Vehicle</option>
                <option value="Cattle Blocking Traffic">Cattle Obstructing Traffic / Stray</option>
                <option value="Rabies Suspect">Rabies Suspect / Aggressive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Exact Landmark / Street
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Near Shanthi Colony Signal, Anna Nagar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-rose-500"
              >
              </input>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Dispatching Van...' : 'Dispatch Mobile Veterinary Van'}</span>
            </button>

            {justReported && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rescue van dispatched! Assigned veterinarian is en route.</span>
              </div>
            )}
          </form>
        </div>

        {/* Active Rescue Cases Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-navy-900">
              Active Animal Rescue Dispatches
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Live Field Updates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cases.map((c) => (
              <div
                key={c.id}
                className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                    {c.animal_type}: {c.issue}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {c.reported_at}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-navy-900">{c.location}</h4>
                  <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                    ● {c.status}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="text-slate-400 font-bold uppercase text-[10px]">
                    Assigned Veterinary Surgeon:
                  </div>
                  <div className="font-bold text-navy-900">{c.assigned_vet}</div>
                  <div className="text-slate-500 text-[11px]">Center: {c.shelter_name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

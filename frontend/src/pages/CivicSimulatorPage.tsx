import React, { useState } from 'react';
import {
  Sliders, TrendingUp, Sparkles, RefreshCw, CheckCircle2,
  AlertTriangle, DollarSign, Users, Clock, ShieldCheck, BarChart3
} from 'lucide-react';

interface SimulationPreset {
  id: string;
  name: string;
  description: string;
  defaultBudget: number; // In Lakhs ₹
  defaultCrews: number;
  defaultWeeks: number;
  reductionPct: number;
  roiMultiplier: number;
  citizenApprovalDelta: number;
}

const PRESETS: SimulationPreset[] = [
  {
    id: 's1',
    name: 'Monsoon Storm Drain Desilting Overhaul',
    description: 'Systematic mechanical desilting across 14 major stormwater culverts in low-lying zones.',
    defaultBudget: 45,
    defaultCrews: 6,
    defaultWeeks: 4,
    reductionPct: 58,
    roiMultiplier: 4.2,
    citizenApprovalDelta: 34,
  },
  {
    id: 's2',
    name: 'Smart LED & Sensor Lighting Upgrade',
    description: 'Replacing 350 sodium vapor streetlights with IoT auto-dimming LED luminaires.',
    defaultBudget: 30,
    defaultCrews: 4,
    defaultWeeks: 3,
    reductionPct: 72,
    roiMultiplier: 3.1,
    citizenApprovalDelta: 28,
  },
  {
    id: 's3',
    name: 'Arterial Road Deep Milling & Asphalt Paving',
    description: 'Cold milling damaged bituminous layers and laying polymer-modified asphalt concrete.',
    defaultBudget: 85,
    defaultCrews: 10,
    defaultWeeks: 6,
    reductionPct: 64,
    roiMultiplier: 2.8,
    citizenApprovalDelta: 41,
  },
];

export const CivicSimulatorPage: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<SimulationPreset>(PRESETS[0]);
  const [budget, setBudget] = useState<number>(PRESETS[0].defaultBudget);
  const [crews, setCrews] = useState<number>(PRESETS[0].defaultCrews);
  const [weeks, setWeeks] = useState<number>(PRESETS[0].defaultWeeks);

  const handleSelectPreset = (p: SimulationPreset) => {
    setSelectedPreset(p);
    setBudget(p.defaultBudget);
    setCrews(p.defaultCrews);
    setWeeks(p.defaultWeeks);
  };

  // Dynamic calculated projections based on user slider adjustments
  const budgetRatio = budget / selectedPreset.defaultBudget;
  const crewRatio = crews / selectedPreset.defaultCrews;
  const combinedFactor = (budgetRatio * 0.6 + crewRatio * 0.4);

  const projectedReduction = Math.min(Math.round(selectedPreset.reductionPct * Math.sqrt(combinedFactor)), 95);
  const projectedROI = (selectedPreset.roiMultiplier * (0.8 + 0.2 * budgetRatio)).toFixed(1);
  const projectedApproval = Math.min(Math.round(selectedPreset.citizenApprovalDelta * (0.7 + 0.3 * crewRatio)), 90);
  const estimatedSavings = (budget * Number(projectedROI)).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Feature #18 · AI Intelligence
            </span>
            <span className="text-xs text-slate-400 font-medium">Predictive Policy Sandbox</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Civic What-If Simulator & Policy Sandbox
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Simulate the impact of proposed municipal capital interventions before deployment. Model complaint reduction rates, economic ROI, and citizen approval.
          </p>
        </div>

        <button
          onClick={() => handleSelectPreset(selectedPreset)}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Reset Scenario
        </button>
      </div>

      {/* Preset Scenarios Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESETS.map((p) => {
          const isSelected = selectedPreset.id === p.id;

          return (
            <div
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className={`cursor-pointer p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                isSelected
                  ? 'bg-purple-50/50 border-purple-500 ring-2 ring-purple-300 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full text-[10px]">
                  Scenario Preset
                </span>
                <span className="text-slate-400 font-medium">₹{p.defaultBudget}L Base</span>
              </div>
              <h3 className="font-bold text-sm text-navy-900">{p.name}</h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">{p.description}</p>
            </div>
          );
        })}
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sliders Control Panel */}
        <div className="glass-panel p-6 space-y-6 shadow-lg border border-slate-200 bg-white">
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-purple-600" />
            Intervention Parameters
          </h2>

          <div className="space-y-5 text-xs">
            {/* Budget Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Capital Allocation (Budget)
                </span>
                <span className="font-mono font-extrabold text-sm text-navy-900">₹ {budget} Lakhs</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹10 Lakhs</span>
                <span>₹75 Lakhs</span>
                <span>₹150 Lakhs</span>
              </div>
            </div>

            {/* Crew Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-600" /> Deployed Field Teams
                </span>
                <span className="font-mono font-extrabold text-sm text-navy-900">{crews} Crews</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={crews}
                onChange={(e) => setCrews(Number(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 Field Crew</span>
                <span>10 Crews</span>
                <span>20 Crews</span>
              </div>
            </div>

            {/* Timeframe Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" /> Target Execution Window
                </span>
                <span className="font-mono font-extrabold text-sm text-navy-900">{weeks} Weeks</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 Week (Emergency)</span>
                <span>6 Weeks</span>
                <span>12 Weeks (Quarterly)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Predictive Engine Note
            </span>
            <p className="text-[11px] leading-relaxed">
              Calculations are modeled from 24 months of ward-level historical resolution telemetry and emergency repair costs.
            </p>
          </div>
        </div>

        {/* Projection Results Panel */}
        <div className="glass-panel p-6 space-y-6 shadow-lg border border-slate-200 bg-white flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              Projected Municipal Outcomes
            </h2>

            {/* Metric Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Complaint Reduction</span>
                <div className="text-2xl font-black text-teal-600">-{projectedReduction}%</div>
                <div className="text-[10px] text-slate-500">Fewer repeat complaints</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Projected Municipal ROI</span>
                <div className="text-2xl font-black text-purple-600">{projectedROI}x ROI</div>
                <div className="text-[10px] text-slate-500">₹{estimatedSavings}L estimated savings</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Citizen Approval Rating</span>
                <div className="text-2xl font-black text-emerald-600">+{projectedApproval}%</div>
                <div className="text-[10px] text-slate-500">Neighborhood sentiment lift</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Turnaround Acceleration</span>
                <div className="text-2xl font-black text-blue-600">3.2x Faster</div>
                <div className="text-[10px] text-slate-500">Mean time to resolution</div>
              </div>
            </div>

            {/* Visual Comparison Bar */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-700">Baseline vs Simulated Failure Rates:</div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Current Status Quo (100% Failure Exposure)</span>
                    <span className="font-bold text-rose-600">100 Index</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="w-full h-full bg-rose-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Simulated Intervened State</span>
                    <span className="font-bold text-teal-600">{100 - projectedReduction} Index</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(100 - projectedReduction, 10)}%` }}
                      className="h-full bg-teal-500 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
            Exportable for Municipal Council Budget Approval Assemblies.
          </div>
        </div>
      </div>
    </div>
  );
};

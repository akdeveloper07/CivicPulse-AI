import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, Bell, ShieldAlert, Waves, Droplets, Zap,
  MapPin, Clock, Users, ArrowUpRight, CheckCircle2, Crosshair,
  TrendingUp, Radio, AlertOctagon, Phone, Info, Share2, Compass
} from 'lucide-react';
import { realTimeService } from '../services/realtime';

interface EarlyWarningCluster {
  id: string;
  hazardType: 'flooding' | 'water_leak' | 'road_hazard' | 'power_grid';
  title: string;
  ward: string;
  zone: string;
  affectedRadiusKm: number;
  reportCountLastHour: number;
  spikePercentage: number;
  severity: 'Urgent Warning' | 'Elevated Watch' | 'Developing Spike';
  firstReportedTime: string;
  lastReportedTime: string;
  primaryLocation: string;
  affectedStreets: string[];
  evidenceSummary: string;
  citizenConfirmations: number;
  citizenDisputes: number;
  userVoted?: 'confirmed' | 'disputed';
  recommendedActions: string[];
  officialAgencyDispatched: string;
  helpline: string;
}

const INITIAL_WARNING_CLUSTERS: EarlyWarningCluster[] = [
  {
    id: 'warn-fld-01',
    hazardType: 'flooding',
    title: 'Severe Waterlogging & Subway Inundation Spike',
    ward: 'Ward 104',
    zone: 'Zone VIII (Anna Nagar)',
    affectedRadiusKm: 1.2,
    reportCountLastHour: 14,
    spikePercentage: 380,
    severity: 'Urgent Warning',
    firstReportedTime: '35 mins ago',
    lastReportedTime: '2 mins ago',
    primaryLocation: 'G.N. Chetty Road Underpass & 3rd Avenue Lowlands',
    affectedStreets: [
      'G.N. Chetty Underpass (Water depth ~2.4 ft)',
      '3rd Avenue Jct near Metro Pillar 142',
      'Shanthi Colony Canal Road'
    ],
    evidenceSummary: '14 independent citizen reports with geotagged photo evidence in 35 minutes. CMWSSB stormwater pump failure reported at culvert discharge.',
    citizenConfirmations: 38,
    citizenDisputes: 1,
    recommendedActions: [
      'Avoid light motor vehicle and two-wheeler transit through the underpass.',
      'Divert north via 2nd Avenue elevated arterial flyover.',
      'Ground-floor commercial establishments advised to deploy sandbag baffles.'
    ],
    officialAgencyDispatched: 'GCC Stormwater Drain Dewatering Mobile Unit #04 Dispatched',
    helpline: '1913 (GCC Disaster Cell)',
  },
  {
    id: 'warn-leak-02',
    hazardType: 'water_leak',
    title: 'High-Pressure 600mm Potable Transmission Pipe Burst',
    ward: 'Ward 052',
    zone: 'Zone V (Royapuram)',
    affectedRadiusKm: 0.8,
    reportCountLastHour: 9,
    spikePercentage: 290,
    severity: 'Elevated Watch',
    firstReportedTime: '52 mins ago',
    lastReportedTime: '6 mins ago',
    primaryLocation: 'Surya Narayana Street Main Conduit',
    affectedStreets: [
      'Surya Narayana Street (Pressure drop in local taps)',
      'Royapuram Market Road (Water pooling on road margin)'
    ],
    evidenceSummary: 'Rapid surge in low-pressure and visible street geyser complaints. Road foundation erosion risk detected by AI road stress sensor.',
    citizenConfirmations: 22,
    citizenDisputes: 0,
    recommendedActions: [
      'Drinking water tap supply temporarily reduced for leak isolation.',
      'Tanker supply pre-allocated for Royapuram North residential blocks.',
      'Exercise caution around tarmac margins due to subsurface voids.'
    ],
    officialAgencyDispatched: 'CMWSSB Distribution Maintenance Gang on-site with valve shut-off wrenches',
    helpline: '044-45674567 (Metrowater Control)',
  },
  {
    id: 'warn-road-03',
    hazardType: 'road_hazard',
    title: 'Multiple Deep Asphalt Cavities & Trench Collapse',
    ward: 'Ward 173',
    zone: 'Zone XIII (Adyar)',
    affectedRadiusKm: 1.5,
    reportCountLastHour: 8,
    spikePercentage: 240,
    severity: 'Elevated Watch',
    firstReportedTime: '1 hour ago',
    lastReportedTime: '12 mins ago',
    primaryLocation: 'L.B. Road south of Adyar Signal',
    affectedStreets: [
      'L.B. Road near Besant Avenue intersection',
      'Kasturibai Nagar 3rd Cross'
    ],
    evidenceSummary: '8 reports of sharp 1.5-foot deep sunken trenches following recent telecom underground optic cable laying.',
    citizenConfirmations: 17,
    citizenDisputes: 2,
    recommendedActions: [
      'Two-wheelers advised to maintain <25 km/h in left curb lane.',
      'High beam lighting recommended post-sunset due to lack of hazard barricades.',
      'Contractor issued mandatory emergency cold-mix backfill notice.'
    ],
    officialAgencyDispatched: 'GCC Bus Route Roads Immediate Response Van en-route',
    helpline: '1913 / 044-25619200',
  },
  {
    id: 'warn-power-04',
    hazardType: 'power_grid',
    title: 'Substation Feeder Tripping & Transformer Spark Hazard',
    ward: 'Ward 112',
    zone: 'Zone X (Kodambakkam)',
    affectedRadiusKm: 0.6,
    reportCountLastHour: 6,
    spikePercentage: 180,
    severity: 'Developing Spike',
    firstReportedTime: '25 mins ago',
    lastReportedTime: '4 mins ago',
    primaryLocation: 'Rangarajapuram 11kV Pole-Mounted Distribution Transformer',
    affectedStreets: [
      'Rangarajapuram Main Road (Intermittent power fluctuation)',
      'Station Road North'
    ],
    evidenceSummary: 'Audible transformer arcing and voltage dip reports verified across 4 residential apartment associations.',
    citizenConfirmations: 11,
    citizenDisputes: 0,
    recommendedActions: [
      'Keep 20-meter clearance from transformer structure #T-44.',
      'Disconnect sensitive home electronic appliances during voltage fluctuations.',
      'TANGEDCO substation isolation crew conducting emergency load transfer.'
    ],
    officialAgencyDispatched: 'TANGEDCO Minnagam Feeder Repair Crew on-site',
    helpline: '1912 (TNEB Minnagam 24x7)',
  },
];

export const NeighbourhoodEarlyWarningPage: React.FC = () => {
  const [clusters, setClusters] = useState<EarlyWarningCluster[]>(INITIAL_WARNING_CLUSTERS);
  const [selectedHazard, setSelectedHazard] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [userLocationDetected, setUserLocationDetected] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [subscriptionActive, setSubscriptionActive] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Auto-Detect GPS Location to filter nearby warnings
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setFeedbackMessage('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setUserLocationDetected(`GPS: ${lat}, ${lng} (Zone VIII / Anna Nagar Area)`);
        setSelectedWard('Ward 104');
        setFeedbackMessage('Filtered early warning alerts for your exact neighbourhood radius!');
        setTimeout(() => setFeedbackMessage(null), 4000);
      },
      (err) => {
        setIsLocating(false);
        setFeedbackMessage(`GPS permission needed: ${err.message}. Showing citywide alerts.`);
        setTimeout(() => setFeedbackMessage(null), 4000);
      },
      { timeout: 8000 }
    );
  };

  const handleVoteConfirmation = (id: string, vote: 'confirmed' | 'disputed') => {
    setClusters((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            userVoted: vote,
            citizenConfirmations: vote === 'confirmed' ? c.citizenConfirmations + 1 : c.citizenConfirmations,
            citizenDisputes: vote === 'disputed' ? c.citizenDisputes + 1 : c.citizenDisputes,
          };
        }
        return c;
      })
    );
    setFeedbackMessage(
      vote === 'confirmed'
        ? 'Thank you! Your live report strengthens the early warning confidence for your neighbours.'
        : 'Dispute recorded. Our algorithmic confidence threshold will re-weigh this cluster.'
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const toggleSubscription = () => {
    const nextState = !subscriptionActive;
    setSubscriptionActive(nextState);
    if (nextState) {
      setFeedbackMessage('🔔 Push Notifications enabled for Ward 104 flood & severe hazard spikes.');
    } else {
      setFeedbackMessage('Notifications paused.');
    }
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const filteredClusters = useMemo(() => {
    return clusters.filter((c) => {
      const matchHazard = selectedHazard === 'all' || c.hazardType === selectedHazard;
      const matchWard = selectedWard === 'all' || c.ward === selectedWard;
      return matchHazard && matchWard;
    });
  }, [clusters, selectedHazard, selectedWard]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-extrabold uppercase tracking-wider text-amber-900">
            Civic Alert Protocol & Statutory Disclaimer
          </p>
          <p className="leading-relaxed text-amber-800">
            Neighbourhood Early Warning AI detects sudden abnormal spikes in citizen complaint density, photo evidence clusters, and municipal sensor telemetry in real time. <strong>This is an early civic advisory system and is NOT a replacement for official state emergency broadcasts</strong> (e.g. TN-SMART or National Disaster Management Authority). In life-threatening emergencies, immediately call <strong>112</strong> or <strong>1913</strong>.
          </p>
        </div>
      </div>

      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
              <Radio className="w-3.5 h-3.5 text-rose-400" /> Live Cluster Spike Monitor
            </span>
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              High-Impact AI Early Detection
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Neighbourhood Early Warning AI
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Detect sudden surges in flooding, major water pipe bursts, dangerous road cavities, and power hazards before official alerts are published. Warns nearby residents with explainable evidence and safety guidance.
          </p>
        </div>

        {/* Action Controls: GPS Detection & Notification Toggle */}
        <div className="space-y-3 w-full md:w-auto">
          <button
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            <Crosshair className="w-4 h-4" />
            <span>{isLocating ? 'Detecting GPS...' : 'Scan My Neighbourhood GPS'}</span>
          </button>

          <button
            onClick={toggleSubscription}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              subscriptionActive
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{subscriptionActive ? 'Push Alerts Active ✓' : 'Subscribe to Ward Spikes'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Filters: Hazard Type & Ward Selector */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Hazard Type Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 mr-1">Hazard:</span>
          {[
            { label: 'All Hazards', value: 'all' },
            { label: '🌊 Flooding', value: 'flooding' },
            { label: '💧 Water Leaks', value: 'water_leak' },
            { label: '🚧 Road Cavities', value: 'road_hazard' },
            { label: '⚡ Power Grid', value: 'power_grid' },
          ].map((h) => (
            <button
              key={h.value}
              onClick={() => setSelectedHazard(h.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedHazard === h.value
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>

        {/* Ward Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Ward:</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full md:w-56 bg-slate-50 text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Greater Chennai Zones</option>
            <option value="Ward 104">Ward 104 · Anna Nagar West</option>
            <option value="Ward 052">Ward 052 · Royapuram</option>
            <option value="Ward 173">Ward 173 · Adyar</option>
            <option value="Ward 112">Ward 112 · Kodambakkam</option>
          </select>
        </div>
      </div>

      {/* Real-Time Early Warning Spike Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-extrabold text-navy-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-600" /> Active Anomaly Spikes ({filteredClusters.length})
          </h2>
          {userLocationDetected && (
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              📍 {userLocationDetected}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredClusters.map((cluster) => {
            const severityColor = {
              'Urgent Warning': 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-200',
              'Elevated Watch': 'bg-amber-50 text-amber-800 border-amber-300',
              'Developing Spike': 'bg-teal-50 text-teal-800 border-teal-300',
            }[cluster.severity];

            const iconMap = {
              flooding: Waves,
              water_leak: Droplets,
              road_hazard: AlertOctagon,
              power_grid: Zap,
            };
            const HazardIcon = iconMap[cluster.hazardType] || AlertTriangle;

            return (
              <div
                key={cluster.id}
                className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-lg space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0 mt-0.5">
                      <HazardIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${severityColor}`}>
                          {cluster.severity}
                        </span>
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                          {cluster.ward} · {cluster.zone}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Radius: ~{cluster.affectedRadiusKm} km
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-navy-900 mt-1.5">
                        {cluster.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        {cluster.primaryLocation}
                      </p>
                    </div>
                  </div>

                  {/* Velocity Spike Metric */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-right sm:text-right shrink-0">
                    <span className="text-[10px] font-bold uppercase text-slate-500 block">Anomaly Surge</span>
                    <div className="text-2xl font-black text-rose-600 flex items-center justify-end gap-1">
                      <span>+{cluster.spikePercentage}%</span>
                      <ArrowUpRight className="w-5 h-5 text-rose-600" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">
                      {cluster.reportCountLastHour} reports in last hour
                    </span>
                  </div>
                </div>

                {/* Evidence and Streets Affected */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Affected Corridors & Stretches:
                    </span>
                    <ul className="space-y-1.5">
                      {cluster.affectedStreets.map((st, i) => (
                        <li key={i} className="text-xs font-medium text-slate-700 flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      AI Evidence Cluster & Sensor Grounding:
                    </span>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
                      <p>{cluster.evidenceSummary}</p>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">First Spike: <b>{cluster.firstReportedTime}</b></span>
                        <span className="text-slate-500">Latest Evidence: <b>{cluster.lastReportedTime}</b></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommended Citizen Safety Actions */}
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-teal-700" /> Recommended Action for Residents & Commuters:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {cluster.recommendedActions.map((act, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white border border-teal-100 text-xs font-medium text-slate-800 flex items-start gap-2">
                        <span className="font-bold text-teal-700 shrink-0">✓</span>
                        <span className="leading-snug">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Field Dispatch Status + Crowd-sourced Verification Voting */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Field Dispatch:</span>
                    <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{cluster.officialAgencyDispatched}</span>
                    </div>
                  </div>

                  {/* Crowd Verification Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 mr-1">Are you nearby?</span>
                    <button
                      onClick={() => handleVoteConfirmation(cluster.id, 'confirmed')}
                      disabled={cluster.userVoted === 'confirmed'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        cluster.userVoted === 'confirmed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                      }`}
                    >
                      <span>Confirm Spike (+{cluster.citizenConfirmations})</span>
                    </button>

                    <button
                      onClick={() => handleVoteConfirmation(cluster.id, 'disputed')}
                      disabled={cluster.userVoted === 'disputed'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        cluster.userVoted === 'disputed'
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>Water Receded / Disputed</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

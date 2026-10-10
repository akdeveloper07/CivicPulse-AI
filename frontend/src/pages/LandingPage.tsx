import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Layers, ShieldCheck, Cpu, ArrowRight, CheckCircle2,
  AlertTriangle, GitMerge, Lightbulb, TrendingUp, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-slate-900 via-navy-900 to-slate-900 text-white rounded-3xl shadow-xl mx-4 sm:mx-6 lg:mx-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.25),transparent_50%)] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-teal-400" />
            CivicNexus AI · Next-Generation Civic Intelligence
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Connecting Citizens.<br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Improving Communities.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            CivicNexus AI unifies citizens and municipal administrators through One-Tap Reporting, real-time duplicate screening, Civic Memory AI, and transparent municipal action.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {user ? (
              <Link
                to={user.role === 'citizen' ? '/dashboard' : '/admin/dashboard'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-base"
              >
                Open Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/submit-report"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-base"
                >
                  One-Tap Civic Report <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all text-base"
                >
                  Join Community
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Citizen-First Civic Intelligence Suite
          </h2>
          <p className="text-slate-600">
            CivicNexus AI transforms community reports into coordinated, explainable municipal resolutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">One-Tap Civic Reporting</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Instant GPS capture, camera photo preview, and rapid issue tagging. Report municipal hazards in seconds from any mobile device or browser.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Smart Duplicate Screening</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Real-time semantic matching alerts citizens if their issue was already reported. Citizens can upvote existing reports to eliminate municipal backlogs.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Civic Memory AI</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Indexes historical resolution playbooks across neighborhoods to recommend proven municipal solutions and prevent recurring infrastructure issues.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Civic Risk Radar & RootCause AI</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Discovers hidden co-occurrence patterns between municipal sectors (e.g., storm drain clogs degrading asphalt) and flags SLA breach risks proactively.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Transparent Priority Scoring</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Explainable multi-factor formula evaluating Impact, Urgency, Recurrence, and Aging with complete audit trails for every civic decision.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Volume Forecasting</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Predictive seasonal demand forecasts help city departments allocate maintenance crews ahead of seasonal weather spikes.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent AI Formula Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-teal-400" />
            <h3 className="text-2xl font-bold">Transparent Civic Intelligence</h3>
          </div>

          <p className="text-slate-300 leading-relaxed max-w-4xl">
            In community administration, trust is paramount. CivicNexus AI eliminates black-box mystery by providing clear mathematical formulas, confidence metrics, and citizen visibility.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center pt-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-extrabold text-teal-300">0.35 × Impact</div>
              <div className="text-xs text-slate-400 mt-1">Severity & Safety Risk</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-extrabold text-teal-300">0.25 × Urgency</div>
              <div className="text-xs text-slate-400 mt-1">Citizen Time Sensitivity</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-extrabold text-teal-300">0.25 × Recurrence</div>
              <div className="text-xs text-slate-400 mt-1">Re-opened Issue History</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-extrabold text-teal-300">0.15 × Aging</div>
              <div className="text-xs text-slate-400 mt-1">Days Unresolved</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

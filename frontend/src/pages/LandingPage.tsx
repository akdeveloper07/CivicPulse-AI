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
            Explainable AI Framework for Smart Cities
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Civic Issue Intelligence & <br />
            <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Transparent Resolution Tracking
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Eliminate duplicate reports, discover root-cause infrastructure links, and prioritize municipal actions with transparent, component-based AI scoring.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {user ? (
              <Link
                to={user.role === 'citizen' ? '/dashboard' : '/admin/dashboard'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-base"
              >
                Go to Your Hub <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-base"
                >
                  Submit Citizen Report <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all text-base"
                >
                  Sign In
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
            Advanced Explainable AI Capabilities
          </h2>
          <p className="text-slate-600">
            CivicPulse transforms unorganized citizen complaints into structured, actionable municipal intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Semantic Duplicate Matching</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Uses SentenceTransformers embeddings (all-MiniLM-L6-v2) to identify duplicate issues worded differently (e.g. "Pothole on MG Rd" vs "Deep crater near bus stop").
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Transparent Priority Scoring</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              No black-box decisions. Priority scores use explicit weighted mathematical formulas (Impact, Urgency, Recurrence, Aging) with human-readable audit explanations.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Root-Cause Discovery</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Discovers hidden co-occurrence patterns between categories (e.g. Blocked Drains causing Waterlogging or Water Leaks causing Potholes) with uncertainty labels.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <GitMerge className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Incremental Clustering</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Automatically aggregates incoming citizen reports into representative issue clusters with administrative merge and split controls.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Resolution Recommendations</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Searches historical resolved clusters to suggest successful resolution steps for similar active complaints, backed by feedback loops.
            </p>
          </div>

          <div className="glass-card p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-navy-900">Predictive Forecasting</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Time-series volume forecasting with MAE baseline benchmarks to help city managers prepare for upcoming seasonal spikes.
            </p>
          </div>
        </div>
      </section>

      {/* Transparent AI Formula Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white rounded-2xl space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-teal-400" />
            <h3 className="text-2xl font-bold">Why Explainability Matters in Civic Tech</h3>
          </div>

          <p className="text-slate-300 leading-relaxed max-w-4xl">
            In public administration, citizens and officials must trust AI decisions. CivicPulse replaces uninterpretable deep learning scores with explicit mathematical components, clear confidence intervals, and human-in-the-loop review queues.
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

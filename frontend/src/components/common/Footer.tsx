import React from 'react';
import { Activity, ShieldCheck, Cpu, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">CivicPulse AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An Explainable AI Platform for Civic Issue Intelligence and Resolution Tracking. Empowering local government departments with transparent priority scoring, semantic duplicate detection, and root-cause discovery.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4" /> System Operational — SentenceTransformers & SQLite active
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Core AI Modules</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-teal-400" /> Semantic Match Engine</li>
              <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-teal-400" /> Incremental Issue Clustering</li>
              <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-teal-400" /> Transparent Priority Scoring</li>
              <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-teal-400" /> Recurrence & Root-Cause AI</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Academic Review</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Final Year Project Demonstration</li>
              <li>Tech: React, Vite, FastAPI, PyTest</li>
              <li>DB: PostgreSQL / SQLite Fallback</li>
              <li className="text-slate-400 text-xs pt-2 flex items-center gap-1">
                <Code className="w-3.5 h-3.5" /> Full Audit Trail & Security
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CivicPulse AI Project Team. Academic Final Year Software Engineering Project.</p>
          <p className="mt-2 sm:mt-0">Explainable AI Framework for Smart Cities</p>
        </div>
      </div>
    </footer>
  );
};

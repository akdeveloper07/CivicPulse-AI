import React from 'react';
import { Activity, ShieldCheck, Cpu, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-icon.png"
                alt="CivicNexus AI"
                className="w-10 h-10 rounded-xl object-contain bg-[#011023] shadow-md border border-navy-700 p-0.5"
              />
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
                  CivicNexus <span className="text-teal-400 text-xs font-black px-1.5 py-0.5 rounded-md bg-teal-950 border border-teal-700">AI</span>
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-400">
                  Connecting Citizens · Improving Communities
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              CivicNexus AI empowers citizens and municipal teams with citizen-first One-Tap Reporting, real-time Smart Duplicate Detection, Civic Memory AI, transparent priority scoring, and proactive root-cause discovery.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4" /> System Operational — Firebase & Civic Intelligence Active
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
          <p>© {new Date().getFullYear()} CivicNexus AI. Connecting Citizens. Improving Communities.</p>
          <p className="mt-2 sm:mt-0">Explainable AI Framework for Smart Cities</p>
        </div>
      </div>
    </footer>
  );
};

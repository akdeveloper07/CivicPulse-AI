import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CivicPassRecord } from '../types';
import {
  Award, QrCode, Shield, Building2, CheckCircle2, Sparkles,
  Zap, Heart, Trophy, Gift, ArrowRight, Share2
} from 'lucide-react';

export const CivicPassKarmaPage: React.FC = () => {
  const [pass, setPass] = useState<CivicPassRecord | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    api.getCivicPass().then((data) => setPass(data));
  }, []);

  const handleShare = () => {
    setIsCopied(true);
    navigator.clipboard?.writeText(pass?.citizen_id || 'TN-CHN-2026-88194');
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Boost Feature #8 · Citizen Rewards
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
              Gold Tier Status
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Citizen Civic Pass & Digital Karma Card
          </h1>
          <p className="text-xs text-teal-200/90 max-w-2xl">
            Gamified civic stewardship: Verified reporting, repair audit confirmations, and volunteer hours earn verifiable Karma points redeemable for municipal property tax rebates and transit credits.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-teal-300">Total Karma Points</div>
          <div className="text-xl font-black text-white font-mono">{pass?.karma_points || 1420} PTS</div>
          <div className="text-[10px] text-teal-300/80">Ward Rank: #{pass?.rank_in_ward || 3}</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-teal-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> GCC Town Planning, Welfare & e-Governance Cell
            <span className="text-slate-400 ml-2">(Nodal: Smt. Anitha Balakrishnan, IAS · Municipal Citizen Pass)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold text-[11px] border border-teal-500/30 shrink-0">
          👥 Accessible by: Verified Citizens & Ward Champions
        </span>
      </div>

      {/* Main Digital Civic Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Holographic Styled Digital Pass */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border-2 border-teal-500/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Award className="w-48 h-48 text-teal-300" />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logo-icon.png" alt="CivicNexus" className="w-10 h-10 rounded-xl bg-white/10 p-1 border border-white/20" />
                <div>
                  <div className="font-extrabold text-sm tracking-wide">GREATER CHENNAI CORPORATION</div>
                  <div className="text-[10px] text-teal-300 uppercase font-mono">CIVICNEXUS CITIZEN PASS</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase border border-amber-400/40">
                {pass?.tier || 'Gold Champion'}
              </span>
            </div>

            <div className="pt-2">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Holder Name</div>
              <div className="text-lg font-black text-white">{pass?.full_name || 'Kavitha Ramachandran'}</div>
              <div className="text-xs text-teal-300 font-medium">{pass?.ward}</div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Reports Verified</div>
                <div className="text-sm font-black text-white">{pass?.verified_reports_count}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Repair Audits</div>
                <div className="text-sm font-black text-white">{pass?.repair_audits_count}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Cleanups</div>
                <div className="text-sm font-black text-white">{pass?.cleanups_attended}</div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between relative z-10">
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-mono">Civic ID</div>
              <div className="text-xs font-mono font-bold text-teal-400">{pass?.citizen_id}</div>
            </div>

            <div className="p-2 bg-white rounded-xl text-slate-900 shadow-md">
              <QrCode className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* Karma Redemption & Perks */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-bold text-base text-navy-900 flex items-center gap-2">
              <Gift className="w-4 h-4 text-teal-600" />
              Eligible Civic Karma Perks
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              You have accumulated <strong>{pass?.karma_points} Karma Points</strong>. Redeem them for official city incentives:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-navy-900">5% Property Tax Rebate</div>
                  <div className="text-slate-500 text-[11px]">GCC Assessment Year 2026-27</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  Unlocked (1,000 pts)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-navy-900">Chennai Metro Rail 30-Day Pass</div>
                  <div className="text-slate-500 text-[11px]">Green & Blue Corridor Transit</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px]">
                  Unlocked (800 pts)
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-navy-900">Mayoral Civic Certificate</div>
                  <div className="text-slate-500 text-[11px]">Official Honor for Ward Leadership</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                  Claimable
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Civic ID Copied to Clipboard!' : 'Share Civic Pass & Karma Score'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

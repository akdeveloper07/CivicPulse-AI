import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WardSabhaVotingProposal } from '../types';
import {
  Vote, Building2, Shield, ThumbsUp, ThumbsDown, CheckCircle2,
  Calendar, IndianRupee, Users, Sparkles, Award
} from 'lucide-react';

export const DigitalWardSabhaPage: React.FC = () => {
  const [proposals, setProposals] = useState<WardSabhaVotingProposal[]>([]);
  const [votedMap, setVotedMap] = useState<Record<string, 'for' | 'against'>>({});

  useEffect(() => {
    api.getWardSabhaProposals().then((data) => setProposals(data));
  }, []);

  const handleVote = async (id: string, voteType: 'for' | 'against') => {
    setVotedMap((prev) => ({ ...prev, [id]: voteType }));
    try {
      await api.voteWardSabhaProposal(id, voteType);
      setProposals((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            return {
              ...p,
              votes_for: voteType === 'for' ? p.votes_for + 1 : p.votes_for,
              votes_against: voteType === 'against' ? p.votes_against + 1 : p.votes_against,
              user_voted: voteType,
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
              <Vote className="w-3.5 h-3.5" /> Boost Feature #7 · Direct Democracy
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-400 text-slate-950 text-[10px] font-black uppercase">
              74th Constitutional Amendment
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Digital Ward Sabha & Participatory Budget Voting
          </h1>
          <p className="text-xs text-emerald-200/90 max-w-2xl">
            Citizen-powered resource allocation: Direct democratic voting on neighborhood civic proposals. Decide where municipal tax funds are spent in your ward before the budget is ratified.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-emerald-300">Ward 104 Allocation</div>
          <div className="text-base font-black text-white font-mono">₹25.7 Lakhs</div>
          <div className="text-[10px] text-emerald-300/80">Discretionary Fund Pool</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> GCC Town Planning, Welfare & e-Governance Cell
            <span className="text-slate-400 ml-2">(Nodal: Smt. Anitha Balakrishnan, IAS · Democratic Ward Sabhas)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 shrink-0">
          👥 Accessible by: Ward Residents & Ward Councillors
        </span>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {proposals.map((p) => {
          const totalVotes = p.votes_for + p.votes_against;
          const approvalPct = totalVotes > 0 ? Math.round((p.votes_for / totalVotes) * 100) : 0;
          const userVote = votedMap[p.id] || p.user_voted;

          return (
            <div
              key={p.id}
              className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    {p.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {p.days_remaining} Days Left
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy-900 leading-snug">
                    {p.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    Proposed by: {p.proposer} · {p.ward}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Estimated Cost:</span>
                    <span className="font-black text-navy-900">₹{p.estimated_cost_lakhs} Lakhs</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {p.impact_summary}
                  </p>
                </div>

                {/* Voting Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Citizen Approval:</span>
                    <span className="font-black text-emerald-600">{approvalPct}% ({p.votes_for} Yes)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all rounded-full"
                      style={{ width: `${approvalPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Vote Buttons */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleVote(p.id, 'for')}
                  disabled={!!userVote}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    userVote === 'for'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{userVote === 'for' ? 'Voted YES' : 'Vote YES'}</span>
                </button>

                <button
                  onClick={() => handleVote(p.id, 'against')}
                  disabled={!!userVote}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    userVote === 'against'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{userVote === 'against' ? 'Voted NO' : 'Vote NO'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HeroStats, PhotoVerificationResult } from '../types';
import { Award, ShieldCheck, CheckCircle2, Sparkles, Camera, ArrowRight, UserCheck, Star } from 'lucide-react';

export const TransparencyHeroPage: React.FC = () => {
  const [heroStats, setHeroStats] = useState<HeroStats | null>(null);
  const [reportIdInput, setReportIdInput] = useState<string>('sample-report-id-101');
  const [afterUrl, setAfterUrl] = useState<string>('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400');
  const [verificationResult, setVerificationResult] = useState<PhotoVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    fetchHeroStats();
  }, []);

  const fetchHeroStats = async () => {
    try {
      const data = await api.getHeroStats();
      setHeroStats(data);
    } catch (err) {
      console.error('Failed to load hero stats', err);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const res = await api.verifyPhotoResolution(reportIdInput, afterUrl);
      setVerificationResult(res);
      fetchHeroStats();
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-navy-900 text-white rounded-2xl shadow-xl">
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30 flex items-center gap-1 w-fit">
            <Award className="w-3.5 h-3.5" /> Civic Trust & Gamification
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Public Resolution & Civic Hero Hub</h1>
          <p className="text-xs md:text-sm text-slate-300">
            Transparent before/after AI repair verification and neighborhood citizen karma impact rankings.
          </p>
        </div>

        {/* Karma Widget */}
        {heroStats && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-lg">
              <Star className="w-7 h-7 fill-white" />
            </div>
            <div className="text-left">
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Civic Karma Points</div>
              <div className="text-2xl font-black text-white">{heroStats.karma_points} <span className="text-xs text-amber-300">Pts</span></div>
              <div className="text-[10px] text-purple-200">{heroStats.badge_title}</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before / After AI Photo Verification Component */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200">
          <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" /> AI Photo Resolution Verification
          </h3>
          <p className="text-xs text-slate-500">
            Compare maintenance completion photos against citizen original report to verify repair accuracy.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Resolution Photo URL</label>
              <input
                type="text"
                value={afterUrl}
                onChange={(e) => setAfterUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> {isVerifying ? 'Running AI Verification...' : 'Run Before/After AI Match Check'}
            </button>
          </form>

          {/* Verification Result Showcase */}
          {verificationResult && (
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="badge-pill bg-purple-600 text-white text-xs">
                  Match Score: {verificationResult.match_score}%
                </span>
                <span className="text-xs font-bold text-purple-800">+{verificationResult.karma_awarded} Karma Awarded!</span>
              </div>
              <p className="text-xs text-purple-950 font-medium">{verificationResult.verification_summary}</p>
            </div>
          )}
        </div>

        {/* Neighborhood Leaderboard */}
        <div className="glass-panel p-6 space-y-4 shadow-lg border border-slate-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-indigo-600" /> Neighborhood Cleanliness & Hero Leaderboard
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Alex Rivera (You)', karma: 450, rank: '#1', badge: 'Master Civic Guardian' },
                { name: 'Sarah Jenkins', karma: 380, rank: '#2', badge: 'Eagle Eye Neighbor' },
                { name: 'Marcus Vance', karma: 290, rank: '#3', badge: 'Infrastructure Champion' },
                { name: 'Elena Rostova', karma: 210, rank: '#4', badge: 'Active Citizen' },
              ].map((hero, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
                      {hero.rank}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{hero.name}</div>
                      <div className="text-[10px] text-slate-500">{hero.badge}</div>
                    </div>
                  </div>

                  <div className="font-extrabold text-purple-700 text-sm">{hero.karma} Pts</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-500 border-t border-slate-200 pt-4 text-center">
            Points earned by filing non-duplicate, verified reports and verifying neighborhood fixes.
          </div>
        </div>
      </div>
    </div>
  );
};

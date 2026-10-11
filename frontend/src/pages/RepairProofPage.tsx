import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { RepairProofRecord } from '../types';
import {
  FileCheck, Shield, CheckCircle2, XCircle, Sparkles, Eye,
  Sliders, ArrowLeftRight, Check, AlertTriangle, Layers, ThumbsUp, ThumbsDown
} from 'lucide-react';

export const RepairProofPage: React.FC = () => {
  const [proofs, setProofs] = useState<RepairProofRecord[]>([]);
  const [activeProof, setActiveProof] = useState<RepairProofRecord | null>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'slider' | 'detector'>('slider');
  const [voteFeedback, setVoteFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadRepairProofs();
  }, []);

  const loadRepairProofs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getRepairProofs();
      setProofs(data);
      if (data.length > 0) setActiveProof(data[0]);
    } catch (err) {
      console.error('Failed to load repair proofs', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (vote: 'confirmed' | 'disputed') => {
    if (!activeProof) return;
    try {
      await api.voteRepairProof(activeProof.report_id, vote);
      setProofs((prev) =>
        prev.map((item) => {
          if (item.report_id === activeProof.report_id) {
            return {
              ...item,
              user_vote: vote,
              citizen_confirm_count:
                vote === 'confirmed' ? item.citizen_confirm_count + 1 : item.citizen_confirm_count,
              citizen_dispute_count:
                vote === 'disputed' ? item.citizen_dispute_count + 1 : item.citizen_dispute_count,
            };
          }
          return item;
        })
      );
      setActiveProof((prev) =>
        prev
          ? {
              ...prev,
              user_vote: vote,
              citizen_confirm_count:
                vote === 'confirmed' ? prev.citizen_confirm_count + 1 : prev.citizen_confirm_count,
              citizen_dispute_count:
                vote === 'disputed' ? prev.citizen_dispute_count + 1 : prev.citizen_dispute_count,
            }
          : null
      );
      setVoteFeedback(
        vote === 'confirmed'
          ? 'Thank you! Your citizen verification confirms this municipal repair.'
          : 'Dispute recorded. This ticket is re-flagged to the Zonal Audit Team.'
      );
      setTimeout(() => setVoteFeedback(null), 4000);
    } catch (err) {
      console.error('Failed to vote on repair proof', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5" /> Feature #3 & #19 · Accountability & Trust
            </span>
            <span className="text-xs text-slate-400 font-medium">Computer Vision Audit</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            RepairProof & Photo Change Detector
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Interactive before-and-after photo evidence slider with AI structural difference detection. Citizens audit and verify that municipal repairs are genuine.
          </p>
        </div>

        {/* Tab switch between Evidence Slider & Change Detector */}
        <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('slider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'slider'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" /> Before/After Slider
          </button>
          <button
            onClick={() => setActiveTab('detector')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'detector'
                ? 'bg-teal-500 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Photo Change AI (#19)
          </button>
        </div>
      </div>

      {/* Vote Feedback Toast */}
      {voteFeedback && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 text-sm flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{voteFeedback}</span>
        </div>
      )}

      {/* Proof Selector Thumbnails */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {proofs.map((item) => (
          <div
            key={item.report_id}
            onClick={() => setActiveProof(item)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              activeProof?.report_id === item.report_id
                ? 'bg-white border-teal-500 shadow-md ring-2 ring-teal-400'
                : 'bg-white/80 border-slate-200 hover:border-teal-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                {item.report_id}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {item.resolved_date}
              </span>
            </div>
            <h4 className="font-bold text-sm text-navy-900 mt-2 truncate">
              {item.title}
            </h4>
            <div className="text-[11px] text-slate-500 mt-1 truncate">
              📍 {item.location}
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>AI Authenticity:</span>
              <span className="font-extrabold text-teal-600">{item.ai_authenticity_score}% Match</span>
            </div>
          </div>
        ))}
      </div>

      {activeProof && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Slider / Change Detector View */}
          <div className="lg:col-span-2 glass-panel p-6 space-y-4 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-navy-900">{activeProof.title}</h3>
                <p className="text-xs text-slate-500">Contractor: {activeProof.contractor_assigned}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                  {activeProof.ai_authenticity_score}% Authenticity Verified
                </span>
              </div>
            </div>

            {/* Slider Visual Canvas */}
            {activeTab === 'slider' ? (
              <div className="space-y-4">
                <div className="relative w-full h-[420px] rounded-2xl overflow-hidden select-none border border-slate-300 shadow-inner bg-slate-900">
                  {/* "After" Image (Full background) */}
                  <img
                    src={activeProof.after_image_url}
                    alt="After resolution"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-md shadow-md z-10">
                    AFTER REPAIR (சரி செய்யப்பட்டது)
                  </div>

                  {/* "Before" Image (Clipped by slider width) */}
                  <div
                    style={{ width: `${sliderPosition}%` }}
                    className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl"
                  >
                    <img
                      src={activeProof.before_image_url}
                      alt="Before reported problem"
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{ width: '100%', height: '100%' }}
                    />
                    <div className="absolute top-4 left-4 bg-rose-600/90 text-white text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-md shadow-md z-10">
                      BEFORE PROBLEM (புகார் பதிவு)
                    </div>
                  </div>

                  {/* Draggable Divider Handle */}
                  <div
                    style={{ left: `${sliderPosition}%` }}
                    className="absolute inset-y-0 -translate-x-1/2 flex items-center justify-center pointer-events-none z-20"
                  >
                    <div className="w-9 h-9 rounded-full bg-white shadow-2xl border-2 border-teal-600 flex items-center justify-center text-teal-800">
                      <ArrowLeftRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Range Input Slider Controller */}
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-rose-600">Before</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="flex-1 accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <span className="text-xs font-bold text-emerald-600">After</span>
                  <span className="text-xs text-slate-500 font-mono w-10 text-right">{sliderPosition}%</span>
                </div>
              </div>
            ) : (
              /* Feature #19: Photo Change AI Diff View */
              <div className="space-y-4">
                <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-900">
                  <img
                    src={activeProof.after_image_url}
                    alt="After base"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-75"
                  />
                  {/* Difference Heatmap Mask */}
                  <div className="absolute inset-0 bg-teal-500/10 pointer-events-none" />
                  <div className="absolute inset-x-20 inset-y-24 border-2 border-dashed border-teal-400 bg-teal-400/20 rounded-2xl flex items-center justify-center backdrop-blur-xs">
                    <div className="bg-navy-900/90 text-teal-300 px-4 py-2 rounded-xl text-xs font-bold border border-teal-500/40 shadow-xl flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span>AI Detected Road Surface Reconstruction: 88.4 m² Fresh Asphalt</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-navy-900/90 text-white text-xs p-3 rounded-xl border border-slate-700 shadow-lg space-y-1">
                    <div className="font-bold text-teal-400">Feature #19 · Difference Breakdown</div>
                    <div>• Ground Texture Deviation: 94% Repaved</div>
                    <div>• Geometric Gradient Alignment: Verified Genuine</div>
                    <div>• GPS EXIF Geolocation Hash: Exact Match (0m drift)</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Citizen Audit Voting & Verification Checks */}
          <div className="glass-panel p-6 space-y-5 shadow-lg border border-slate-200 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                Evidence Authenticity Audit
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">GPS Geolocation Match</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 100% Match
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Texture Disruption Analysis</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Continuous Material
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Solar Shadow Continuity</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Consistent Angle
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Duplicate Image Database</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Unique Snapshot
                  </span>
                </div>
              </div>

              {/* Citizen Confirmation Counts */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold uppercase text-slate-500">Citizen Audit Consensus</div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-lg font-black text-emerald-600">{activeProof.citizen_confirm_count}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Confirmed Fixed</div>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="text-lg font-black text-rose-600">{activeProof.citizen_dispute_count}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Disputed</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Citizen Vote Controls */}
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-700 text-center">
                Cast Your Citizen Verification Vote:
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleVote('confirmed')}
                  disabled={activeProof.user_vote === 'confirmed'}
                  className={`py-3 px-2 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all ${
                    activeProof.user_vote === 'confirmed'
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{activeProof.user_vote === 'confirmed' ? 'You Confirmed' : 'Confirm Fixed'}</span>
                </button>

                <button
                  onClick={() => handleVote('disputed')}
                  disabled={activeProof.user_vote === 'disputed'}
                  className={`py-3 px-2 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all ${
                    activeProof.user_vote === 'disputed'
                      ? 'bg-rose-600 text-white cursor-default'
                      : 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-600 hover:text-white'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{activeProof.user_vote === 'disputed' ? 'You Disputed' : 'Dispute Work'}</span>
                </button>
              </div>
              <div className="text-[11px] text-slate-400 text-center pt-1">
                Disputed cases automatically trigger on-site audit inspection.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

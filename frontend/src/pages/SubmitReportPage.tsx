import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { IssueCategory, CandidateMatch } from '../types';
import { Modal } from '../components/common/Modal';
import { AlertCircle, Sparkles, CheckCircle2, Send, MapPin, Layers } from 'lucide-react';

export const SubmitReportPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [impact, setImpact] = useState(5);
  const [urgency, setUrgency] = useState(5);
  const [approximateArea, setApproximateArea] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Pre-check Duplicate Suggestions Modal State
  const [similarCandidates, setSimilarCandidates] = useState<CandidateMatch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  useEffect(() => {
    api.getCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    });
  }, []);

  const handlePreCheckAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long.');
      return;
    }

    if (description.trim().length < 15) {
      setError('Description must be at least 15 characters long.');
      return;
    }

    setIsCheckingDuplicates(true);
    try {
      // Check for semantically similar existing reports
      const matches = await api.checkSimilarity({
        title,
        description,
        category_id: categoryId
      });

      const highMatches = matches.filter(m => m.similarity_score >= 0.65);
      if (highMatches.length > 0) {
        setSimilarCandidates(highMatches);
        setIsModalOpen(true);
      } else {
        // Proceed directly with submission
        await executeFinalSubmission();
      }
    } catch (err: any) {
      setError(err.message || 'Duplicate pre-check failed.');
    } finally {
      setIsCheckingDuplicates(false);
    }
  };

  const executeFinalSubmission = async () => {
    setIsSubmitting(true);
    setIsModalOpen(false);
    try {
      await api.createReport({
        title,
        description,
        category_id: categoryId,
        impact,
        urgency,
        approximate_area: approximateArea
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="glass-panel p-8 space-y-6 shadow-xl border border-slate-200">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Real-Time AI Duplicate Screening Active
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Report a Civic Issue</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Provide details about the civic problem. CivicPulse AI will screen for existing reports in your area to prevent duplicate filings and accelerate municipal resolution.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePreCheckAndSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Issue Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hazardous Deep Pothole at MG Road Bus Stop"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Approximate Area / Landmark</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={approximateArea}
                  onChange={(e) => setApproximateArea(e.target.value)}
                  placeholder="e.g. MG Road, Near City Bus Stop"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue clearly. Mention exact location details, safety risks, or severity..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Perceived Impact ({impact}/10)</label>
                <span className="text-[11px] font-semibold text-slate-500">Public Hazard</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={impact}
                onChange={(e) => setImpact(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Perceived Urgency ({urgency}/10)</label>
                <span className="text-[11px] font-semibold text-slate-500">Speed Needed</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={urgency}
                onChange={(e) => setUrgency(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isCheckingDuplicates || isSubmitting}
            className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCheckingDuplicates ? (
              'Screening for Duplicates...'
            ) : isSubmitting ? (
              'Submitting Report...'
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Report for AI Screening
              </>
            )}
          </button>
        </form>
      </div>

      {/* AI Pre-check Duplicate Suggestions Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Similar Existing Issues Detected"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <Layers className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              CivicPulse AI found existing report(s) that appear semantically similar to your complaint. Is your issue related to one of these?
            </span>
          </div>

          <div className="space-y-3">
            {similarCandidates.map((cand) => (
              <div key={cand.report_id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-navy-900">{cand.title}</span>
                  <span className="badge-pill bg-teal-100 text-teal-800 font-bold">
                    {(cand.similarity_score * 100).toFixed(1)}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{cand.description}</p>
                <div className="text-[11px] text-slate-500 italic">{cand.matched_evidence}</div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel & View Dashboard
            </button>
            <button
              onClick={executeFinalSubmission}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit as New Standalone Issue
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

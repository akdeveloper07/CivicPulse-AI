import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { IssueCategory, CandidateMatch } from '../types';
import { Modal } from '../components/common/Modal';
import {
  AlertCircle, Sparkles, CheckCircle2, Send, MapPin, Layers,
  Camera, Upload, X, Navigation, Crosshair, HelpCircle, ArrowRight
} from 'lucide-react';

export const SubmitReportPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [impact, setImpact] = useState(5);
  const [urgency, setUrgency] = useState(5);
  const [approximateArea, setApproximateArea] = useState('');

  // Geolocation state
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Photo upload & preview state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Pre-check Duplicate Suggestions Modal State
  const [similarCandidates, setSimilarCandidates] = useState<CandidateMatch[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  useEffect(() => {
    api.getCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    });
  }, []);

  // One-Tap Geolocation Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring high-accuracy GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        setIsLocating(false);
        setLocationStatus(`GPS Locked: ${lat}, ${lng} (±${Math.round(pos.coords.accuracy)}m)`);
        
        // Auto-fill landmark field if empty
        if (!approximateArea) {
          setApproximateArea(`Ward Sector (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(`GPS unavailable: ${err.message}. You can enter landmark manually.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Photo Attachment Handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setImagePreview(null);
    setImageName(null);
  };

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

      const highMatches = (matches || []).filter((m) => m.similarity_score >= 0.65);
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
        approximate_area: approximateArea,
        latitude: latitude || undefined,
        longitude: longitude || undefined,
        image_url: imagePreview || undefined
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick preset helper
  const applyPreset = (lvl: 'low' | 'med' | 'high') => {
    if (lvl === 'low') { setImpact(3); setUrgency(3); }
    else if (lvl === 'med') { setImpact(6); setUrgency(6); }
    else if (lvl === 'high') { setImpact(9); setUrgency(9); }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="glass-panel p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200">
        {/* Header Banner */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> CivicNexus AI · One-Tap Civic Reporting
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              Real-time Duplicate Shield
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Report a Civic Issue</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Connecting Citizens. Improving Communities. Submit hazards with instant GPS detection and photo evidence. CivicNexus AI ensures no duplicate backlog and tracks resolution in real time.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePreCheckAndSubmit} className="space-y-6">
          {/* Issue Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hazardous Deep Pothole at MG Road Bus Stop"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium"
            />
          </div>

          {/* One-Tap Category Quick Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex flex-col gap-1 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/80 text-teal-900 shadow-sm ring-1 ring-teal-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold line-clamp-1">{cat.name}</span>
                    <span className="text-[11px] font-normal text-slate-500 line-clamp-1">{cat.description || 'Public service'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* One-Tap GPS Auto-Detection & Landmark Area */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Location & Spatial Coordinates
                </label>
                <span className="text-[11px] text-slate-500">
                  Auto-detect using GPS for instant dispatch mapping
                </span>
              </div>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs disabled:opacity-60 transition-all"
              >
                <Crosshair className="w-3.5 h-3.5" />
                {isLocating ? 'Detecting GPS...' : 'Auto-Detect My GPS'}
              </button>
            </div>

            {locationStatus && (
              <div className="text-xs font-medium px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{locationStatus}</span>
              </div>
            )}

            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={approximateArea}
                onChange={(e) => setApproximateArea(e.target.value)}
                placeholder="Landmark or street details (e.g. Near Metro Pillar 142, Northbound Lane)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none text-xs font-medium bg-white"
              />
            </div>
          </div>

          {/* Photo Evidence Upload */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Photo Evidence (Optional)
                </label>
                <span className="text-[11px] text-slate-500">
                  Attach photo for AI verification and accelerated crew dispatch
                </span>
              </div>
            </div>

            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white p-2">
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Issue preview"
                    className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{imageName || 'Attached Photo'}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Photo attached successfully
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl cursor-pointer bg-white transition-colors group">
                <div className="flex items-center gap-2 text-slate-500 group-hover:text-teal-600">
                  <Camera className="w-5 h-5" />
                  <span className="text-xs font-semibold">Take Photo or Browse Image</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WebP up to 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue clearly. Mention safety risks, duration observed, or specific conditions..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm leading-relaxed"
            />
          </div>

          {/* Impact and Urgency Presets & Sliders */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Priority Indicators
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-slate-500 mr-1">Quick Presets:</span>
                <button
                  type="button"
                  onClick={() => applyPreset('low')}
                  className="px-2 py-1 rounded text-[11px] font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('med')}
                  className="px-2 py-1 rounded text-[11px] font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('high')}
                  className="px-2 py-1 rounded text-[11px] font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                >
                  High
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Perceived Impact ({impact}/10)</span>
                  <span className="text-[11px] font-semibold text-teal-700">
                    {impact >= 8 ? 'Critical Hazard' : impact >= 5 ? 'Moderate Inconvenience' : 'Minor'}
                  </span>
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
                  <span className="text-xs font-bold text-slate-700">Perceived Urgency ({urgency}/10)</span>
                  <span className="text-[11px] font-semibold text-teal-700">
                    {urgency >= 8 ? 'Immediate Action' : urgency >= 5 ? 'Standard SLA' : 'Routine'}
                  </span>
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isCheckingDuplicates || isSubmitting}
            className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg hover:shadow-teal-500/25 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCheckingDuplicates ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Screening for Duplicate Issues...</span>
              </>
            ) : isSubmitting ? (
              <span>Submitting Report to CivicNexus AI...</span>
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
        title="Similar Existing Reports Detected"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <Layers className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">CivicNexus AI Duplicate Screening Alert</p>
              <p className="mt-0.5 text-amber-800">
                We detected existing open complaints in your area with high semantic similarity. You can back an existing issue to boost its municipal priority or submit your report as a standalone issue.
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {similarCandidates.map((cand) => (
              <div key={cand.report_id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-navy-900 truncate">{cand.title}</span>
                  <span className="badge-pill bg-teal-100 text-teal-800 font-bold shrink-0">
                    {(cand.similarity_score * 100).toFixed(1)}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{cand.description}</p>
                <div className="text-[11px] text-slate-500 italic bg-white p-2 rounded border border-slate-200">
                  <span className="font-semibold text-slate-600 not-italic">Match Evidence: </span>
                  {cand.matched_evidence}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Back to Dashboard
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

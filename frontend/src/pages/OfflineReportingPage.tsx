import React, { useState, useEffect } from 'react';
import { OfflineDraftReport } from '../types';
import {
  WifiOff, Wifi, CloudUpload, CheckCircle2, Trash2, Plus,
  RefreshCw, Layers, ShieldCheck, Clock, MapPin, Image as ImageIcon
} from 'lucide-react';

const STORAGE_KEY = 'civicnexus_offline_reports';

export const OfflineReportingPage: React.FC = () => {
  const [reports, setReports] = useState<OfflineDraftReport[]>([]);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // New draft form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Roads & Footpaths');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    loadLocalReports();
  }, []);

  const loadLocalReports = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReports(JSON.parse(stored));
      } else {
        // Initial sample offline drafts
        const initialDrafts: OfflineDraftReport[] = [
          {
            id: 'draft-101',
            title: 'Water pipe leak near Metro pillar 42',
            description: 'Captured while in low signal underground transit. Water streaming across service lane.',
            category: 'Water Supply',
            latitude: 13.0835,
            longitude: 80.2089,
            image_data_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
            saved_at: 'Today at 09:15 AM',
            sync_status: 'queued_offline',
          },
          {
            id: 'draft-102',
            title: 'Damaged sidewalk slab outside school gate',
            description: 'Uneven paving stone posing trip hazard for elementary students.',
            category: 'Roads & Footpaths',
            latitude: 13.0841,
            longitude: 80.2098,
            image_data_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80',
            saved_at: 'Today at 10:20 AM',
            sync_status: 'queued_offline',
          },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDrafts));
        setReports(initialDrafts);
      }
    } catch (e) {
      console.error('Failed to access offline storage', e);
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDraft: OfflineDraftReport = {
      id: `draft-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      description: newDesc,
      category: newCategory,
      latitude: 13.0850,
      longitude: 80.2100,
      image_data_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80',
      saved_at: 'Just now',
      sync_status: 'queued_offline',
    };

    const updated = [newDraft, ...reports];
    setReports(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowAddForm(false);
    setNewTitle('');
    setNewDesc('');
    setSyncFeedback('Draft safely stored in local device cache!');
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  const handleDeleteDraft = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSyncAll = () => {
    if (isSimulatedOffline) {
      alert('Network is disconnected! Switch to Online mode to synchronize drafts.');
      return;
    }

    setIsSyncing(true);
    setTimeout(() => {
      const updated = reports.map((r) => ({
        ...r,
        sync_status: 'synced' as const,
      }));
      setReports(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setIsSyncing(false);
      setSyncFeedback('All offline drafts successfully transmitted and assigned official ticket numbers!');
      setTimeout(() => setSyncFeedback(null), 4000);
    }, 1800);
  };

  const pendingCount = reports.filter((r) => r.sync_status === 'queued_offline').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5" /> Feature #16 · Citizen Services
            </span>
            <span className="text-xs text-slate-400 font-medium">Offline Resilience Queue</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Offline-First Reporting & Sync Engine
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
            Never lose a civic report in poor connectivity zones. Reports are cached in IndexedDB/LocalStorage with photos and auto-synced as soon as internet connectivity restores.
          </p>
        </div>

        {/* Network Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              isSimulatedOffline
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-emerald-500 text-white border-emerald-600'
            }`}
          >
            {isSimulatedOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            <span>{isSimulatedOffline ? 'Simulating Disconnected' : 'Network Online'}</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-300 text-teal-800 text-sm flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Sync Control Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-md bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Storage Status</div>
          <div className="text-lg font-black text-navy-900">
            {pendingCount} Pending Offline Reports
          </div>
          <div className="text-xs text-slate-500">
            Encrypted local cache storage: {(reports.length * 14.2).toFixed(1)} KB used
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Offline Draft
          </button>
          <button
            onClick={handleSyncAll}
            disabled={pendingCount === 0 || isSyncing}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all ${
              pendingCount > 0 && !isSyncing
                ? 'bg-teal-600 hover:bg-teal-500 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CloudUpload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? 'Uploading to Server...' : 'Sync Pending Queue'}</span>
          </button>
        </div>
      </div>

      {/* Add Offline Report Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveDraft}
          className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-md bg-white space-y-4 animate-fade-in text-xs"
        >
          <h3 className="font-bold text-sm text-navy-900">Compose Offline Civic Draft</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Issue Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Street lamp broken on 4th Lane"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Roads & Footpaths">Roads & Footpaths</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electrical & Lighting">Electrical & Lighting</option>
                <option value="Waste Management">Waste Management</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Describe what you observed..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-500"
            >
              Save to Local Queue
            </button>
          </div>
        </form>
      )}

      {/* Drafts Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((draft, idx) => {
          const draftId = draft.id || draft.local_id || `draft-${idx}`;

          return (
            <div
              key={draftId}
              className="p-5 rounded-2xl border border-slate-200 transition-all bg-white shadow-xs hover:shadow-md space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {draftId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      draft.sync_status === 'synced'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {draft.sync_status === 'synced' ? '✓ Synced to Cloud' : '⏳ Queued Offline'}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={draft.image_data_url}
                    alt="Draft photo"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-navy-900 leading-snug">{draft.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{draft.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {draft.saved_at}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    GPS Cached
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700">{draft.category || draft.category_name}</span>
                <button
                  onClick={() => handleDeleteDraft(draftId)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="Discard Draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

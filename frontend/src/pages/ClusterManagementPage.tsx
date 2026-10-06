import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { IssueCluster, PriorityExplanation } from '../types';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { GitMerge, Layers, HelpCircle, CheckCircle2, Split, ArrowRight, Activity, MessageSquare } from 'lucide-react';

export const ClusterManagementPage: React.FC = () => {
  const [clusters, setClusters] = useState<IssueCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status Change Modal State
  const [selectedCluster, setSelectedCluster] = useState<IssueCluster | null>(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [statusReason, setStatusReason] = useState('');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Priority Explanation Modal State
  const [priorityExp, setPriorityExp] = useState<PriorityExplanation | null>(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  // Merge Modal State
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [targetClusterId, setTargetClusterId] = useState('');
  const [sourceClusterId, setSourceClusterId] = useState('');
  const [mergeReason, setMergeReason] = useState('');

  const fetchClusters = async () => {
    try {
      const data = await api.getClusters();
      setClusters(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const openStatusModal = (cluster: IssueCluster) => {
    setSelectedCluster(cluster);
    setNewStatus(cluster.status);
    setStatusReason('');
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCluster) return;
    if (statusReason.trim().length < 5) {
      alert('Mandatory reason must be at least 5 characters long.');
      return;
    }
    try {
      await api.updateClusterStatus(selectedCluster.id, newStatus, statusReason);
      setIsStatusModalOpen(false);
      fetchClusters();
    } catch (err: any) {
      alert(err.message || 'Failed to update cluster status.');
    }
  };

  const openExplanationModal = async (cluster: IssueCluster) => {
    setSelectedCluster(cluster);
    try {
      const exp = await api.getPriorityExplanation(cluster.id);
      setPriorityExp(exp);
      setIsExpModalOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch priority breakdown.');
    }
  };

  const handleMergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetClusterId === sourceClusterId) {
      alert('Target and source clusters must be different.');
      return;
    }
    try {
      await api.mergeClusters(targetClusterId, sourceClusterId, mergeReason || 'Merged clusters via admin console.');
      setIsMergeModalOpen(false);
      fetchClusters();
    } catch (err: any) {
      alert(err.message || 'Merge failed.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-8 rounded-2xl shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
            <GitMerge className="w-3.5 h-3.5" /> Aggregated Issue Intelligence
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Issue Cluster Management</h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            View aggregated issue clusters ranked by transparent priority scores. Update resolution status with mandatory audit reasons or merge related clusters.
          </p>
        </div>

        <button
          onClick={() => setIsMergeModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md transition-all text-sm shrink-0"
        >
          <GitMerge className="w-4 h-4" /> Merge Clusters
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500">Loading issue clusters...</div>
      ) : clusters.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-2">
          <Layers className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-navy-900">No Clusters Found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {clusters.map((cluster) => (
            <div key={cluster.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-md">
                    {cluster.category_name || 'General Category'}
                  </span>
                  <StatusBadge status={cluster.status} />
                  <span className="badge-pill bg-slate-100 text-slate-700">
                    {cluster.report_count || 1} Reports Aggregated
                  </span>
                  {cluster.recurrence_count > 0 && (
                    <span className="badge-pill bg-amber-100 text-amber-800 font-bold">
                      {cluster.recurrence_count} Recurrences
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-navy-900">{cluster.representative_title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{cluster.representative_description}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 shrink-0">
                <div className="text-right space-y-1">
                  <PriorityBadge score={cluster.current_priority_score} />
                  <button
                    onClick={() => openExplanationModal(cluster)}
                    className="flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline ml-auto mt-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Explain Score
                  </button>
                </div>

                <button
                  onClick={() => openStatusModal(cluster)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
                >
                  Change Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Status Update Modal */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={`Update Cluster Status — ${selectedCluster?.representative_title}`}
      >
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">New Resolution Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
            >
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mandatory Administrative Reason (Audit Logged)
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide reason for status change (e.g. Field repair crew dispatched, issue resolved)..."
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsStatusModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md"
            >
              Save Status Update
            </button>
          </div>
        </form>
      </Modal>

      {/* Priority Explanation Modal */}
      <Modal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        title="Transparent Priority Formula Breakdown"
      >
        {priorityExp && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Total Calculated Score</span>
              <span className="text-2xl font-extrabold text-teal-400">{priorityExp.total_priority_score.toFixed(1)} / 100</span>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Formula Components</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Impact Component (w = {priorityExp.weights.impact})</span>
                  <span>{priorityExp.components.impact} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${priorityExp.components.impact}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Urgency Component (w = {priorityExp.weights.urgency})</span>
                  <span>{priorityExp.components.urgency} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${priorityExp.components.urgency}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Recurrence Bonus (w = {priorityExp.weights.recurrence})</span>
                  <span>{priorityExp.components.recurrence} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${priorityExp.components.recurrence}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Aging Component (w = {priorityExp.weights.age})</span>
                  <span>{priorityExp.components.age} / 100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: `${priorityExp.components.age}%` }} />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-1">
              <span className="font-bold text-navy-900 block">Human-Readable Explanation:</span>
              <p>{priorityExp.human_explanation}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Merge Clusters Modal */}
      <Modal
        isOpen={isMergeModalOpen}
        onClose={() => setIsMergeModalOpen(false)}
        title="Merge Issue Clusters"
      >
        <form onSubmit={handleMergeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Primary Cluster (Retained)</label>
            <select
              value={targetClusterId}
              onChange={(e) => setTargetClusterId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="">Select target cluster...</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>{c.representative_title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Source Cluster (Merged into Target)</label>
            <select
              value={sourceClusterId}
              onChange={(e) => setSourceClusterId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
            >
              <option value="">Select source cluster...</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>{c.representative_title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Reason for Merge</label>
            <input
              type="text"
              placeholder="e.g. Both complaints refer to the exact same storm drain blockage..."
              value={mergeReason}
              onChange={(e) => setMergeReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsMergeModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md"
            >
              Confirm Merge
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

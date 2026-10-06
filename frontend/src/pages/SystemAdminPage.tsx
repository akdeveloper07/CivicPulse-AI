import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, AuditLog, ModelEvaluation } from '../types';
import { Shield, KeyRound, Code, Activity, Cpu, CheckCircle2 } from 'lucide-react';

export const SystemAdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [evaluation, setEvaluation] = useState<ModelEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getUsers(),
      api.getAuditLogs(),
      api.getModelEvaluations()
    ]).then(([u, a, e]) => {
      setUsers(u);
      setAuditLogs(a);
      setEvaluation(e);
    }).finally(() => setIsLoading(false));
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5 text-teal-400" /> System Control & Evaluation Console
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">System Administration & Offline Benchmarks</h1>
        <p className="text-slate-300 text-sm max-w-3xl">
          Manage user RBAC permissions, inspect system audit logs, and review offline model evaluation metrics comparing SentenceTransformers against TF-IDF baseline models.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500">Loading system administration data...</div>
      ) : (
        <div className="space-y-8">
          {/* AI Model Evaluation Benchmarks */}
          {evaluation && (
            <div className="glass-panel p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Cpu className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-navy-900">AI Model Evaluation Benchmarks vs Baseline</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-teal-900">SentenceTransformers (all-MiniLM-L6-v2)</span>
                    <span className="badge-pill bg-teal-600 text-white font-bold">Target Model</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                      <div className="text-xs text-slate-500 font-medium">Precision</div>
                      <div className="text-lg font-extrabold text-teal-700">{evaluation.metrics.sentence_transformer.precision}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                      <div className="text-xs text-slate-500 font-medium">Recall</div>
                      <div className="text-lg font-extrabold text-teal-700">{evaluation.metrics.sentence_transformer.recall}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-teal-100">
                      <div className="text-xs text-slate-500 font-medium">F1-Score</div>
                      <div className="text-lg font-extrabold text-teal-700">{evaluation.metrics.sentence_transformer.f1_score}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">TF-IDF & Cosine Baseline</span>
                    <span className="badge-pill bg-slate-200 text-slate-700 font-bold">Baseline</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="text-xs text-slate-500 font-medium">Precision</div>
                      <div className="text-lg font-extrabold text-slate-700">{evaluation.metrics.tfidf_baseline.precision}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="text-xs text-slate-500 font-medium">Recall</div>
                      <div className="text-lg font-extrabold text-slate-700">{evaluation.metrics.tfidf_baseline.recall}</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="text-xs text-slate-500 font-medium">F1-Score</div>
                      <div className="text-lg font-extrabold text-slate-700">{evaluation.metrics.tfidf_baseline.f1_score}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-white text-xs leading-relaxed">
                <span className="font-bold text-teal-400 block mb-1">Academic Benchmark Conclusion:</span>
                {evaluation.interpretation}
              </div>
            </div>
          )}

          {/* User RBAC Management */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">User Role Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-navy-900">{u.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="badge-pill bg-slate-100 text-slate-700 capitalize">
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                        >
                          <option value="citizen">Citizen</option>
                          <option value="administrator">Administrator</option>
                          <option value="system_admin">System Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">System Audit Trail</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-navy-900 uppercase tracking-wider mr-2">[{log.action}]</span>
                    <span className="text-slate-600">{log.reason || 'Action recorded.'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WardTenderContract } from '../types';
import {
  FileText, Shield, Building2, Phone, AlertTriangle, CheckCircle2,
  Calendar, Award, IndianRupee, Clock, ArrowRight, Check
} from 'lucide-react';

export const WardTenderContractorPage: React.FC = () => {
  const [tenders, setTenders] = useState<WardTenderContract[]>([]);
  const [reportedTenderId, setReportedTenderId] = useState<string | null>(null);

  useEffect(() => {
    api.getTenders().then((data) => setTenders(data));
  }, []);

  const handleReportWarrantyDefect = (tenderId: string) => {
    setReportedTenderId(tenderId);
    setTimeout(() => setReportedTenderId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Boost Feature #3 · Public Integrity
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase border border-emerald-500/30">
              Defect Liability Act 2026
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Ward Tenders & Contractor Accountability Tracker
          </h1>
          <p className="text-xs text-amber-200/90 max-w-2xl">
            Democratizing public funds: View who won the municipal contract for your street, sanctioned budget, contractor contact, warranty period, and trigger automated defect liability claims.
          </p>
        </div>

        <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-amber-300">Sanctioned Ward Budget</div>
          <div className="text-base font-black text-white font-mono">₹1.54 Crores</div>
          <div className="text-[10px] text-amber-300/80">3 Active Ward Works</div>
        </div>
      </div>

      {/* Department & Role Governance Banner */}
      <div className="bg-slate-900 text-white border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Operated by:</strong> GCC Works & Highways Department
            <span className="text-slate-400 ml-2">(Nodal: Er. R. Manivannan, CE · Helpline: 1913)</span>
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30 shrink-0">
          👥 Accessible by: Citizens, Contractors & Auditors
        </span>
      </div>

      {/* Tenders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tenders.map((t) => {
          const isReported = reportedTenderId === t.id;

          return (
            <div
              key={t.id}
              className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                    {t.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    t.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy-900 leading-snug">
                    {t.work_name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    📍 {t.ward}
                  </div>
                </div>

                {/* Budget & Contractor Details */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Sanctioned Cost:</span>
                    <span className="font-black text-navy-900 text-sm">
                      ₹{t.sanctioned_amount_lakhs} Lakhs
                    </span>
                  </div>

                  <div className="pt-1 border-t border-slate-200/60">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Contractor:</div>
                    <div className="font-bold text-navy-900">{t.contractor_name}</div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-teal-600" /> {t.contractor_phone}
                    </div>
                  </div>
                </div>

                {/* Warranty & Liability */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-teal-50 text-teal-900 border border-teal-100">
                    <div className="text-[10px] text-teal-600 font-bold uppercase">Warranty</div>
                    <div className="font-black">{t.warranty_period_years} Years Covered</div>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-900 border border-rose-100">
                    <div className="text-[10px] text-rose-600 font-bold uppercase">Penalties</div>
                    <div className="font-black">₹{t.penalties_incurred_inr.toLocaleString()} Incurred</div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Award: {t.award_date}</span>
                  <span>Deadline: {t.completion_deadline}</span>
                </div>
              </div>

              {/* Citizen Action */}
              <button
                onClick={() => handleReportWarrantyDefect(t.id)}
                disabled={isReported}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                  isReported
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {isReported ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Claim Registered! Auditor Notified</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Report Warranty Defect / Penalty</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

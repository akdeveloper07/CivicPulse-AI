import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CivicDepartmentInfo } from '../types';
import {
  Building2, Phone, Mail, Clock, CheckCircle2, Shield, Hammer, Droplets,
  Zap, Trash2, HeartPulse, Waves, ShieldAlert, Users, Search, ArrowRight, ExternalLink
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Hammer,
  Droplets,
  Zap,
  Trash2,
  HeartPulse,
  Waves,
  ShieldAlert,
  Users,
};

export const DepartmentDirectoryPage: React.FC = () => {
  const [departments, setDepartments] = useState<CivicDepartmentInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<CivicDepartmentInfo | null>(null);

  useEffect(() => {
    api.getDepartments().then((data) => {
      setDepartments(data);
      if (data.length > 0) setSelectedDept(data[0]);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(departments.map((d) => d.category)))];

  const filtered = departments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.short_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nodal_officer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.services_operated.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Municipal Governance Directory
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              8 Live Departments
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Municipal Department Directory & Nodal Officers
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Total transparency: View which civic body operates each service, designated nodal engineers, direct emergency helplines, active crew counts, and real-time SLA adherence.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Systemwide SLA</div>
            <div className="text-lg font-black text-teal-400">93.8%</div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-left">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Active Field Crews</div>
            <div className="text-lg font-black text-white">169</div>
          </div>
        </div>
      </div>

      {/* Role & Access Transparency Pill */}
      <div className="bg-teal-950/60 border border-teal-500/30 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-teal-200">
          <Shield className="w-4 h-4 text-teal-400 shrink-0" />
          <span><strong>Accountability Standard:</strong> Citizens have the constitutional right to know the exact public authority responsible for each public asset.</span>
        </div>
        <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 font-bold text-[11px] shrink-0">
          👥 Public Access: All Citizens & Officials
        </span>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search department, nodal officer, or service..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-teal-500 outline-none shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((dept) => {
          const Icon = ICON_MAP[dept.icon_name || 'Building2'] || Building2;
          const isSelected = selectedDept?.id === dept.id;

          return (
            <div
              key={dept.id}
              onClick={() => setSelectedDept(dept)}
              className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between border ${
                isSelected
                  ? 'border-teal-500 ring-2 ring-teal-500/30 shadow-md bg-teal-50/20'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm bg-white'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black font-mono uppercase bg-slate-100 text-slate-700 border border-slate-200">
                    {dept.short_code}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-navy-900 leading-snug line-clamp-2">
                    {dept.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[11px]">
                  <div className="text-slate-500 font-medium">Nodal Authority:</div>
                  <div className="font-bold text-navy-900 truncate">{dept.nodal_officer}</div>
                  <div className="text-[10px] text-slate-400 truncate">{dept.designation}</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">SLA Adherence:</span>
                  <span className="font-black text-emerald-600">{dept.sla_compliance_pct}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Active Crews:</span>
                  <span className="font-bold text-slate-700">{dept.active_crews} Units</span>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-teal-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {dept.helpline}
                  </span>
                  <span className="text-[10px] text-slate-400">Avg {dept.avg_response_time_hours}h</span>
                </div>

                <div className="pt-2 border-t border-slate-50 text-[10px] flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase">Role Access:</span>
                  <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 font-bold">
                    Citizens · Officers · Contractors
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Dossier for Selected Department */}
      {selectedDept && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-md space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-teal-100 text-teal-800">
                  {selectedDept.short_code}
                </span>
                <span className="text-xs font-bold text-slate-500">{selectedDept.category}</span>
              </div>
              <h2 className="text-xl font-bold text-navy-900 mt-1">{selectedDept.name}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`tel:${selectedDept.helpline}`}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" /> Call Helpline ({selectedDept.helpline})
              </a>
              <a
                href={`mailto:${selectedDept.email}`}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300"
              >
                <Mail className="w-3.5 h-3.5" /> Email Department
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-navy-900 uppercase text-[10px] tracking-wider text-slate-500">
                Department Overview
              </span>
              <p className="text-slate-600 leading-relaxed font-medium">
                {selectedDept.description}
              </p>
              <div className="pt-2 text-[11px] text-slate-500">
                <strong>Toll-Free Emergency:</strong> {selectedDept.toll_free}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-navy-900 uppercase text-[10px] tracking-wider text-slate-500">
                Assigned Nodal Authority
              </span>
              <div className="font-bold text-sm text-navy-900">{selectedDept.nodal_officer}</div>
              <div className="text-slate-600 font-medium">{selectedDept.designation}</div>
              <div className="text-[11px] text-teal-700 font-mono pt-1">
                📧 {selectedDept.email}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-navy-900 uppercase text-[10px] tracking-wider text-slate-500">
                Services Operated by this Department
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDept.services_operated.map((svc) => (
                  <span
                    key={svc}
                    className="px-2.5 py-1 rounded-lg bg-teal-100/70 text-teal-800 font-bold text-[10px] border border-teal-200"
                  >
                    {svc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

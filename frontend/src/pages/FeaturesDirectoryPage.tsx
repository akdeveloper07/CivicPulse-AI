import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, MapPin, FileCheck, Mic, Activity, GitMerge, AlertTriangle,
  Lightbulb, Sparkles, Navigation, Bell, AlertOctagon, Accessibility,
  HelpCircle, Users, WifiOff, FileText, Sliders, Eye, Network, BarChart3,
  Search, Shield, ChevronDown, Building2, ExternalLink
} from 'lucide-react';
import { CIVIC_FEATURES } from './LandingPage';

export const FeaturesDirectoryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMatrixTable, setShowMatrixTable] = useState<boolean>(true);

  const filteredFeatures = useMemo(() => {
    return CIVIC_FEATURES.filter((feat) => {
      const matchesCategory =
        selectedCategory === 'All' || feat.category === selectedCategory;
      const matchesRole =
        selectedRole === 'all' ||
        feat.allowedRoles.includes(selectedRole as any);
      const matchesSearch =
        feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feat.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesRole && matchesSearch;
    });
  }, [selectedCategory, selectedRole, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-800 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Complete 21-Feature Operating Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            21 Smart Civic Features & Role Matrix
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Full governance directory detailing all 21 civic modules: department jurisdictions, role access controls (Citizen, Volunteer, Contractor, Officer, Admin), and direct module links.
          </p>
        </div>

        <Link
          to="/"
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all shrink-0"
        >
          ← Back to Overview
        </Link>
      </div>

      {/* Role Matrix Collapsible */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-x-auto space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h3 className="font-bold text-base text-navy-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" /> Complete Role-Based Access Control Matrix (21 Features)
          </h3>
          <button
            onClick={() => setShowMatrixTable(!showMatrixTable)}
            className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
          >
            <span>{showMatrixTable ? 'Hide Table' : 'Show Table'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMatrixTable ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showMatrixTable && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Feature Name</th>
                <th className="py-2.5 px-3">Governing Wing</th>
                <th className="py-2.5 px-3 text-center">Citizen</th>
                <th className="py-2.5 px-3 text-center">Volunteer</th>
                <th className="py-2.5 px-3 text-center">Contractor</th>
                <th className="py-2.5 px-3 text-center">Dept Officer</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {CIVIC_FEATURES.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-mono text-slate-400">#{f.id}</td>
                  <td className="py-2 px-3 font-bold text-navy-900">{f.name}</td>
                  <td className="py-2 px-3 text-slate-600">{f.department}</td>
                  <td className="py-2 px-3 text-center">
                    {f.allowedRoles.includes('citizen') ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold text-[10px]">Access</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {f.allowedRoles.includes('volunteer') ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">Access</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {f.allowedRoles.includes('contractor') ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">Access</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {f.allowedRoles.includes('department_officer') ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px]">Access</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {f.allowedRoles.includes('admin') ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">Full</span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Filters: Category & Role */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-teal-600" /> Filter by User Role Access:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: 'All Roles', value: 'all' },
              { label: '👤 Citizens', value: 'citizen' },
              { label: '🤝 Volunteers', value: 'volunteer' },
              { label: '🔨 Contractors', value: 'contractor' },
              { label: '🏛️ Officers', value: 'department_officer' },
              { label: '🛡️ Admins', value: 'admin' },
            ].map((role) => (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRole === role.value
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'All (21)', value: 'All' },
              { label: '👥 Citizen Services', value: 'Citizen Services' },
              { label: '🛡️ Accountability', value: 'Accountability & Trust' },
              { label: '🧠 AI Intelligence', value: 'AI Intelligence' },
              { label: '📊 Governance', value: 'Governance' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === tab.value
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Grid of Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFeatures.map((feat) => {
          const Icon = feat.icon;
          const categoryColors = {
            'Citizen Services': 'bg-teal-50 text-teal-700 border-teal-200',
            'Accountability & Trust': 'bg-indigo-50 text-indigo-700 border-indigo-200',
            'AI Intelligence': 'bg-purple-50 text-purple-700 border-purple-200',
            'Governance': 'bg-emerald-50 text-emerald-700 border-emerald-200',
          }[feat.category];

          return (
            <div
              key={feat.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                    #{feat.id}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${categoryColors}`}>
                    {feat.badge}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-teal-50 text-slate-700 group-hover:text-teal-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-navy-900 group-hover:text-teal-700 transition-colors">
                      {feat.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" /> {feat.department}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                    👥 Role Access: {feat.targetRole}
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={feat.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 group-hover:text-teal-700 hover:underline"
                >
                  <span>Open Feature</span>
                  <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  {feat.allowedRoles.map((r) => (
                    <span key={r} className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono capitalize">
                      {r === 'department_officer' ? 'Officer' : r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

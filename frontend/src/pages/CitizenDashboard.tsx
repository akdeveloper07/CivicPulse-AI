import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Report, IssueCategory } from '../types';
import { StatusBadge } from '../components/common/Badge';
import { Plus, Search, Filter, Calendar, MapPin, ArrowRight, Activity, Clock } from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repData, catData] = await Promise.all([
          api.getReports(),
          api.getCategories()
        ]);
        setReports(repData);
        setCategories(catData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.approximate_area && r.approximate_area.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || r.category_id === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const submittedCount = reports.filter(r => r.status === 'Submitted').length;
  const activeCount = reports.filter(r => ['Under Review', 'In Progress'].includes(r.status)).length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white p-8 rounded-2xl shadow-lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" /> Citizen Action Hub
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Civic Issue Tracker</h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Track submitted reports, view transparent AI priority status, and follow resolution timelines in real time.
          </p>
        </div>

        <Link
          to="/submit-report"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md hover:shadow-teal-500/25 transition-all text-sm shrink-0"
        >
          <Plus className="w-5 h-5" /> Report Civic Issue
        </Link>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-navy-900">{submittedCount}</div>
            <div className="text-xs font-semibold text-slate-500">Newly Submitted</div>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-navy-900">{activeCount}</div>
            <div className="text-xs font-semibold text-slate-500">In Active Resolution</div>
          </div>
        </div>

        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-navy-900">{resolvedCount}</div>
            <div className="text-xs font-semibold text-slate-500">Resolved Issues</div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search reports by title, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-white text-slate-700 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-white text-slate-700 outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports Grid / List */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-500">Loading civic reports...</div>
      ) : filteredReports.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-3">
          <div className="text-slate-400 font-semibold">No civic reports found matching filters.</div>
          <p className="text-xs text-slate-500">Try adjusting your search keywords or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                    {report.category?.name || 'Civic Issue'}
                  </span>
                  <StatusBadge status={report.status} />
                </div>

                <h3 className="text-lg font-bold text-navy-900 line-clamp-1">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  {report.approximate_area && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {report.approximate_area}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs text-slate-400 font-medium">
                  Impact Rating: <b className="text-slate-700">{report.impact}/10</b>
                </div>
                <Link
                  to={`/reports/${report.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline"
                >
                  View Timeline <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Activity, Shield, FileText, Layers, GitMerge, AlertTriangle,
  Lightbulb, TrendingUp, Cpu, LogOut, LogIn, UserPlus, Menu, X, CheckCircle2
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, isAdmin, isSysAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-navy-900">
                CivicPulse <span className="text-teal-600">AI</span>
              </span>
              <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Explainable Civic Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${isActive('/') ? 'bg-slate-100 text-teal-600 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'}`}
            >
              Overview
            </Link>

            <Link
              to="/gis-heatmap"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${isActive('/gis-heatmap') ? 'bg-slate-100 text-teal-600 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'}`}
            >
              <span className="w-2 h-2 rounded-full bg-teal-500"></span> GIS Heatmap
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-slate-100 text-teal-600 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'}`}
                >
                  Citizen Hub
                </Link>
                <Link
                  to="/hero-transparency"
                  className={`px-3 py-2 rounded-lg transition-colors ${isActive('/hero-transparency') ? 'bg-slate-100 text-teal-600 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'}`}
                >
                  Hero & Trust Hub
                </Link>
                <Link
                  to="/submit-report"
                  className={`px-3 py-2 rounded-lg transition-colors ${isActive('/submit-report') ? 'bg-slate-100 text-teal-600 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'}`}
                >
                  Submit Issue
                </Link>
              </>
            )}

            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold">
                  <Shield className="w-4 h-4 text-teal-600" />
                  Admin Console
                </button>

                {/* Admin Dropdown Menu */}
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 hidden group-hover:block animate-fade-in z-50">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Intelligence Workspace
                  </div>
                  <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <Activity className="w-4 h-4" /> Operations Dashboard
                  </Link>
                  <Link to="/field-dispatch" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <Activity className="w-4 h-4 text-emerald-600" /> Field Route Optimizer
                  </Link>
                  <Link to="/sla-risk" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> SLA Breach Risk Radar
                  </Link>
                  <Link to="/executive-report" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <FileText className="w-4 h-4 text-purple-600" /> Executive ESG Report
                  </Link>
                  <Link to="/admin/match-review" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <Layers className="w-4 h-4" /> AI Match Review Queue
                  </Link>
                  <Link to="/admin/clusters" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <GitMerge className="w-4 h-4" /> Issue Cluster Manager
                  </Link>
                  <Link to="/admin/root-causes" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <AlertTriangle className="w-4 h-4" /> Root-Cause Hypotheses
                  </Link>
                  <Link to="/admin/recommendations" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <Lightbulb className="w-4 h-4" /> Resolution Engine
                  </Link>
                  <Link to="/admin/forecasting" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <TrendingUp className="w-4 h-4" /> Volume Forecasting
                  </Link>
                  <Link to="/admin/confidence-fairness" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <Cpu className="w-4 h-4" /> Uncertainty & Fairness
                  </Link>

                  {isSysAdmin && (
                    <>
                      <div className="border-t border-slate-100 my-1" />
                      <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        System Control
                      </div>
                      <Link to="/admin/system" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                        <Shield className="w-4 h-4" /> System Admin & Benchmarks
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}

          </nav>

          {/* User Status & Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="block text-xs font-bold text-navy-900">{user.name}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 capitalize">
                    <CheckCircle2 className="w-3 h-3" /> {user.role.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-sm transition-all"
                >
                  <UserPlus className="w-4 h-4" /> Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Overview</Link>
          {user && (
            <>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Citizen Hub</Link>
              <Link to="/submit-report" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Submit Issue</Link>
            </>
          )}
          {isAdmin && (
            <>
              <div className="border-t border-slate-100 pt-2 text-xs font-bold text-slate-400 uppercase">Admin Console</div>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Operations Dashboard</Link>
              <Link to="/admin/match-review" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">AI Match Review</Link>
              <Link to="/admin/clusters" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Issue Clusters</Link>
              <Link to="/admin/root-causes" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Root Cause Engine</Link>
              <Link to="/admin/recommendations" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Resolution Engine</Link>
              <Link to="/admin/forecasting" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Volume Forecasting</Link>
            </>
          )}
          <div className="border-t border-slate-100 pt-3">
            {user ? (
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-rose-600 bg-rose-50 font-semibold">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 rounded-lg border border-slate-200 text-slate-700 font-medium">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 rounded-lg bg-teal-600 text-white font-semibold">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

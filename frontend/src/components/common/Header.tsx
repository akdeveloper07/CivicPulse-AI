import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Activity, Shield, FileText, Layers, GitMerge, AlertTriangle,
  Lightbulb, TrendingUp, Cpu, LogOut, LogIn, UserPlus, Menu, X, CheckCircle2,
  Sparkles, MapPin, Mic, Navigation, Bell, AlertOctagon, Accessibility,
  HelpCircle, Users, WifiOff, FileCheck, Network, BarChart3, ChevronDown,
  Eye, Sliders
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, isAdmin, isSysAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Close solutions menu on route change or click outside
  useEffect(() => {
    setSolutionsOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo-icon.png"
              alt="CivicNexus AI"
              className="w-10 h-10 rounded-xl object-contain bg-[#011023] shadow-md group-hover:scale-105 transition-all p-0.5 border border-slate-200"
            />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-navy-900 flex items-center gap-1.5">
                CivicNexus <span className="text-teal-600 text-sm font-black px-1.5 py-0.5 rounded-md bg-teal-50 border border-teal-200">AI</span>
              </span>
              <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                Connecting Citizens · Improving Communities
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

            {/* 21 Civic Solutions Mega-Menu Dropdown */}
            <div className="relative" ref={solutionsRef}>
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all font-semibold ${
                  solutionsOpen || location.pathname.startsWith('/nearby-') || location.pathname.startsWith('/voice-') || location.pathname.startsWith('/repair-') || location.pathname.startsWith('/tracking') || location.pathname.startsWith('/safe-route') || location.pathname.startsWith('/public-') || location.pathname.startsWith('/accessibility') || location.pathname.startsWith('/community') || location.pathname.startsWith('/offline-') || location.pathname.startsWith('/escalations') || location.pathname.startsWith('/simulator') || location.pathname.startsWith('/knowledge-graph') || location.pathname.startsWith('/impact-')
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
                <span>21 Solutions</span>
                <span className="text-[10px] bg-teal-600 text-white font-black px-1.5 py-0.2 rounded-full">21</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega-Menu Panel */}
              {solutionsOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[880px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-50 animate-fade-in grid grid-cols-4 gap-6">
                  {/* Category 1: Citizen Services */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider pb-1 border-b border-teal-100">
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      Citizen Services
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      <li>
                        <Link to="/submit-report" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <Layers className="w-3.5 h-3.5 text-teal-600" />
                          <span>#1 Smart Civic Report</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/nearby-map" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-teal-600" />
                          <span>#2 Nearby Problems Map</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/voice-assistant" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <Mic className="w-3.5 h-3.5 text-teal-600" />
                          <span>#4 Tamil Voice Studio</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/submit-report?mode=multimodal" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <Cpu className="w-3.5 h-3.5 text-teal-600" />
                          <span>#9 Multimodal Assistant</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/safe-route" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <Navigation className="w-3.5 h-3.5 text-teal-600" />
                          <span>#10 SafeRoute Planner</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/accessibility" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <Accessibility className="w-3.5 h-3.5 text-teal-600" />
                          <span>#13 Accessibility Mapper</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/public-help" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                          <span>#14 Public Help Finder</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/community" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <Users className="w-3.5 h-3.5 text-teal-600" />
                          <span>#15 Community Action</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/offline-reports" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <WifiOff className="w-3.5 h-3.5 text-teal-600" />
                          <span>#16 Offline-First Sync</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Category 2: Accountability & Trust */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider pb-1 border-b border-indigo-100">
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      Accountability & Trust
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      <li>
                        <Link to="/repair-proof" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium">
                          <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>#3 RepairProof Slider</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/tracking/rep-001" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium">
                          <Activity className="w-3.5 h-3.5 text-indigo-600" />
                          <span>#5 Live Status Tracking</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/public-alerts" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium">
                          <Bell className="w-3.5 h-3.5 text-indigo-600" />
                          <span>#11 Public Alerts Hub</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/escalations" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium">
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                          <span>#12 Overdue Escalation</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/escalations#rti" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" />
                          <span>#17 RTI Follow-up Bot</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/repair-proof#detector" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium">
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          <span>#19 Photo Change AI</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Category 3: AI Intelligence */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider pb-1 border-b border-purple-100">
                      <Cpu className="w-3.5 h-3.5 text-purple-600" />
                      AI Intelligence
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      <li>
                        <Link to="/admin/clusters" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
                          <GitMerge className="w-3.5 h-3.5 text-purple-600" />
                          <span>#6 Civic Memory AI</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/sla-risk" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>#7 Civic Risk Radar</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/root-causes" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
                          <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
                          <span>#8 RootCause AI Engine</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/simulator" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
                          <Sliders className="w-3.5 h-3.5 text-purple-600" />
                          <span>#18 What-If Simulator</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/knowledge-graph" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
                          <Network className="w-3.5 h-3.5 text-purple-600" />
                          <span>#20 Civic Knowledge Graph</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Category 4: Governance & Scorecard */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider pb-1 border-b border-emerald-100">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                      Governance
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      <li>
                        <Link to="/impact-scorecard" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium">
                          <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>#21 Impact Scorecard</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/gis-heatmap" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>City Heatmap Overlay</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/hero-transparency" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium">
                          <Shield className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Hero Karma & Trust</span>
                        </Link>
                      </li>
                    </ul>
                    <div className="mt-4 p-3 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100 text-[11px] text-teal-800">
                      <span className="font-bold block mb-1">CivicNexus AI Engine</span>
                      Empowering 21 verified solutions for sustainable communities.
                    </div>
                  </div>
                </div>
              )}
            </div>

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
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 max-h-[85vh] overflow-y-auto">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Overview</Link>
          <Link to="/gis-heatmap" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">GIS Heatmap</Link>

          <div className="border-t border-slate-100 pt-2 text-xs font-bold text-teal-700 uppercase">👥 Citizen Services</div>
          <Link to="/submit-report" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#1 Smart Civic Report</Link>
          <Link to="/nearby-map" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#2 Nearby Problems Map</Link>
          <Link to="/voice-assistant" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#4 Tamil Voice Assistant</Link>
          <Link to="/safe-route" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#10 SafeRoute Navigation</Link>
          <Link to="/accessibility" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#13 Accessibility Mapper</Link>
          <Link to="/public-help" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#14 Public Help Finder</Link>
          <Link to="/community" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#15 Community Action Matcher</Link>
          <Link to="/offline-reports" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#16 Offline-First Reporting</Link>

          <div className="border-t border-slate-100 pt-2 text-xs font-bold text-indigo-700 uppercase">🛡️ Accountability & Trust</div>
          <Link to="/repair-proof" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#3 RepairProof Slider</Link>
          <Link to="/tracking/rep-001" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#5 Live Status Tracking</Link>
          <Link to="/public-alerts" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#11 Public Alerts Hub</Link>
          <Link to="/escalations" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#12 Overdue Escalation</Link>

          <div className="border-t border-slate-100 pt-2 text-xs font-bold text-purple-700 uppercase">🧠 AI Intelligence & Governance</div>
          <Link to="/simulator" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#18 Civic What-If Simulator</Link>
          <Link to="/knowledge-graph" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#20 Civic Knowledge Graph</Link>
          <Link to="/impact-scorecard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">#21 Civic Impact Analytics</Link>

          {user && (
            <>
              <div className="border-t border-slate-100 pt-2 text-xs font-bold text-slate-400 uppercase">Citizen Account</div>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Citizen Hub</Link>
              <Link to="/hero-transparency" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Hero & Trust Hub</Link>
            </>
          )}

          {isAdmin && (
            <>
              <div className="border-t border-slate-100 pt-2 text-xs font-bold text-slate-400 uppercase">Admin Console</div>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Operations Dashboard</Link>
              <Link to="/sla-risk" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">SLA Breach Radar</Link>
              <Link to="/field-dispatch" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Field Route Optimizer</Link>
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


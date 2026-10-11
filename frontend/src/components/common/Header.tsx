import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Activity, Shield, FileText, Layers, GitMerge, AlertTriangle,
  Lightbulb, TrendingUp, Cpu, LogOut, LogIn, UserPlus, Menu, X, CheckCircle2,
  Sparkles, MapPin, Mic, Navigation, Bell, AlertOctagon, Accessibility,
  HelpCircle, Users, WifiOff, FileCheck, Network, BarChart3, ChevronDown,
  Eye, Sliders, Building2, Droplets, Waves, Hammer, Moon, Vote, Award,
  Heart, Volume2, Trees, Zap, Siren, MessageSquare, Camera, Lock
} from 'lucide-react';

const ROLE_LABELS: Record<UserRole, { label: string; badge: string; color: string }> = {
  citizen: { label: 'Citizen', badge: 'Public Resident', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  volunteer: { label: 'Ward Volunteer', badge: 'Community Steward', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  contractor: { label: 'Field Contractor', badge: 'Field Ops', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  department_officer: { label: 'Municipal Officer', badge: 'Nodal Authority', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  administrator: { label: 'Zonal Commissioner', badge: 'Executive Admin', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  system_admin: { label: 'System Admin', badge: 'DevOps / Root', color: 'bg-slate-200 text-slate-800 border-slate-300' },
};

export const Header: React.FC = () => {
  const { user, logout, isAdmin, isSysAdmin, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const solutionsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const roleSwitcherRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSwitch = (role: UserRole) => {
    loginAsDemoRole(role);
    setRoleSwitcherOpen(false);
    navigate(role === 'administrator' ? '/admin/dashboard' : '/dashboard');
  };

  const isActive = (path: string) => location.pathname === path;

  // Close menus on route change or outside click
  useEffect(() => {
    setSolutionsOpen(false);
    setFeaturesOpen(false);
    setRoleSwitcherOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsOpen(false);
      }
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false);
      }
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(event.target as Node)) {
        setRoleSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeRoleConfig = user ? ROLE_LABELS[user.role] || ROLE_LABELS.citizen : null;
  const isPermitted = (roles: UserRole[]) => (user ? roles.includes(user.role) || isAdmin : true);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
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

            {/* NEW: 15 Municipal Flagship Features Dropdown */}
            <div className="relative" ref={featuresRef}>
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all font-semibold ${
                  featuresOpen ||
                  [
                    '/departments', '/whatsapp-bot', '/flood-desk', '/tenders',
                    '/road-scanner', '/night-safety', '/water-tanker', '/ward-sabha',
                    '/civic-pass', '/animal-rescue', '/noise-monitor', '/tree-guardian',
                    '/power-grid', '/emergency-sos'
                  ].some((p) => location.pathname.startsWith(p))
                    ? 'bg-gradient-to-r from-teal-50 to-indigo-50 text-teal-800 border border-teal-200 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>15 Civic Features</span>
                <span className="text-[10px] bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-black px-1.5 py-0.2 rounded-full">
                  15
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* 15 Features Mega Menu Panel */}
              {featuresOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[860px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-50 animate-fade-in grid grid-cols-4 gap-5">
                  {/* Column 1: Citizen Channels */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider pb-1 border-b border-teal-100">
                      <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                      Citizen Channels
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li>
                        <Link to="/whatsapp-bot" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>WhatsApp Bot (#1)</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 shrink-0">Citizen</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/night-safety" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                          <div className="flex items-center gap-2">
                            <Moon className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>Night Safety (#5)</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 shrink-0">Citizen</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/water-tanker" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                            <span>Dial-a-Tanker (#6)</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 shrink-0">Citizen</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/civic-pass" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                          <div className="flex items-center gap-2">
                            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Civic Pass (#8)</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">Citizen</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/ward-sabha" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-800">
                          <div className="flex items-center gap-2">
                            <Vote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Ward Sabha (#7)</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">Citizen</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Column 2: Infrastructure & Works */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider pb-1 border-b border-amber-100">
                      <Hammer className="w-3.5 h-3.5 text-amber-600" />
                      Field & Operations
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li>
                        <Link to="/road-scanner" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-amber-50 hover:text-amber-800">
                          <div className="flex items-center gap-2">
                            <Camera className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>Road Scanner (#4)</span>
                          </div>
                          {isPermitted(['contractor', 'department_officer']) ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">Contractor</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 shrink-0 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Contractor
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link to="/tenders" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-amber-50 hover:text-amber-800">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Ward Tenders (#3)</span>
                          </div>
                          {isPermitted(['contractor']) ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">Contractor</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 shrink-0 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Contractor
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link to="/power-grid" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-amber-50 hover:text-amber-800">
                          <div className="flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
                            <span>Power Grid (#12)</span>
                          </div>
                          {isPermitted(['department_officer']) ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 shrink-0">Officer</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 shrink-0 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Officer
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link to="/tree-guardian" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-amber-50 hover:text-amber-800">
                          <div className="flex items-center gap-2">
                            <Trees className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Tree Guardian (#11)</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 shrink-0">Volunteer</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Column 3: Emergency & Relief */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider pb-1 border-b border-rose-100">
                      <Siren className="w-3.5 h-3.5 text-rose-600" />
                      Emergency & Relief
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li>
                        <Link to="/flood-desk" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-800">
                          <div className="flex items-center gap-2">
                            <Waves className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                            <span>Flood Desk (#2)</span>
                          </div>
                          {isPermitted(['department_officer']) ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 shrink-0">Officer</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 shrink-0 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Officer
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link to="/emergency-sos" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-800">
                          <div className="flex items-center gap-2">
                            <Siren className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>SOS Desk (#13)</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">All Users</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/animal-rescue" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-800">
                          <div className="flex items-center gap-2">
                            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>Animal Rescue (#9)</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 shrink-0">Volunteer</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/noise-monitor" className="flex items-center justify-between p-1.5 rounded-lg text-slate-700 hover:bg-rose-50 hover:text-rose-800">
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>Noise Radar (#10)</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 shrink-0">Citizen</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Column 4: Department Directory */}
                  <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                        <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                          Nodal Directory
                        </span>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                          All Users
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-medium">
                        Directory of all 8 municipal departments with official nodal contacts, escalation SLAs, and citizen helplines.
                      </p>
                    </div>

                    <Link
                      to="/departments"
                      className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Department Directory</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 21 Civic Features Mega-Menu Dropdown */}
            <div className="relative" ref={solutionsRef}>
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all font-semibold ${
                  solutionsOpen ||
                  location.pathname.startsWith('/nearby-') ||
                  location.pathname.startsWith('/voice-') ||
                  location.pathname.startsWith('/repair-') ||
                  location.pathname.startsWith('/tracking') ||
                  location.pathname.startsWith('/safe-route') ||
                  location.pathname.startsWith('/public-') ||
                  location.pathname.startsWith('/accessibility') ||
                  location.pathname.startsWith('/community') ||
                  location.pathname.startsWith('/offline-') ||
                  location.pathname.startsWith('/escalations') ||
                  location.pathname.startsWith('/simulator') ||
                  location.pathname.startsWith('/knowledge-graph') ||
                  location.pathname.startsWith('/impact-')
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>21 Features</span>
                <span className="text-[10px] bg-teal-600 text-white font-black px-1.5 py-0.2 rounded-full">
                  21
                </span>
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
                        <Link to="/submit-report" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <div className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>#1 Civic Report</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">Citizen</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/nearby-map" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>#2 Nearby Map</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">Citizen</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/voice-assistant" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <div className="flex items-center gap-2">
                            <Mic className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>#4 Tamil Voice</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">Citizen</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/safe-route" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <div className="flex items-center gap-2">
                            <Navigation className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>#10 SafeRoute</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">Citizen</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/accessibility" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <div className="flex items-center gap-2">
                            <Accessibility className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>#13 Access Mapper</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Volunteer</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/community" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium">
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>#15 Community</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Volunteer</span>
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Category 2: Accountability & Trust */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider pb-1 border-b border-indigo-100">
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      Accountability
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      <li>
                        <Link to="/repair-proof" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>#3 RepairProof</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Contractor</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/tracking/rep-001" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium">
                          <div className="flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>#5 Status Tracking</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">Citizen</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/public-alerts" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium">
                          <div className="flex items-center gap-2">
                            <Bell className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>#11 Public Alerts</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">All Users</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/escalations" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium">
                          <div className="flex items-center gap-2">
                            <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>#12 Escalation</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">Officer</span>
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
                        <Link to="/admin/clusters" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
                          <div className="flex items-center gap-2">
                            <GitMerge className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>#6 Civic Memory</span>
                          </div>
                          {isPermitted(['department_officer', 'administrator']) ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Admin</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Admin
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link to="/sla-risk" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>#7 Risk Radar</span>
                          </div>
                          {isPermitted(['department_officer', 'administrator']) ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">Officer</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Officer
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link to="/admin/root-causes" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>#8 RootCause AI</span>
                          </div>
                          {isPermitted(['department_officer', 'administrator']) ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Admin</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Admin
                            </span>
                          )}
                        </Link>
                      </li>
                      <li>
                        <Link to="/simulator" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
                          <div className="flex items-center gap-2">
                            <Sliders className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>#18 What-If Sim</span>
                          </div>
                          {isPermitted(['department_officer', 'administrator']) ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Admin</span>
                          ) : (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Admin
                            </span>
                          )}
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* Category 4: Analytics */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider pb-1 border-b border-emerald-100">
                      <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                      Transparency
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      <li>
                        <Link to="/impact-scorecard" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>#21 Impact Score</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">All Users</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/gis-heatmap" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>GIS Heatmap</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">All Users</span>
                        </Link>
                      </li>
                      <li>
                        <Link to="/hero-transparency" className="flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium">
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Karma Hub</span>
                          </div>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">Volunteer</span>
                        </Link>
                      </li>
                    </ul>
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

          {/* User Status & Auth Buttons + 1-Click Role Switcher */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5" ref={roleSwitcherRef}>
                <div className="text-right">
                  <span className="block text-xs font-bold text-navy-900 leading-tight">{user.name}</span>
                  {activeRoleConfig && (
                    <span className={`inline-block text-[10px] font-black px-1.5 py-0.2 rounded border ${activeRoleConfig.color}`}>
                      {activeRoleConfig.label}
                    </span>
                  )}
                </div>

                {/* Role Switcher Button */}
                <div className="relative">
                  <button
                    onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[11px] font-bold flex items-center gap-1 transition-all"
                    title="Switch Role for Demo"
                  >
                    <span>Role</span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>

                  {/* Switch Role Popup */}
                  {roleSwitcherOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Active Role:
                      </div>
                      {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => {
                        const isCurrent = user.role === r;
                        const cfg = ROLE_LABELS[r];
                        return (
                          <button
                            key={r}
                            onClick={() => handleRoleSwitch(r)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              isCurrent
                                ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <div>{cfg.label}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{cfg.badge}</div>
                            </div>
                            {isCurrent && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
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

          <div className="border-t border-slate-100 pt-2 text-xs font-bold text-teal-700 uppercase">🌟 15 Municipal Features</div>
          <Link to="/departments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">🏛️ Department Directory</Link>
          <Link to="/whatsapp-bot" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">💬 WhatsApp Bot (#1)</Link>
          <Link to="/flood-desk" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">🌊 Monsoon Flood Desk (#2)</Link>
          <Link to="/tenders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">📄 Ward Tenders & Contractors (#3)</Link>
          <Link to="/road-scanner" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">📷 AI Road Defect Scanner (#4)</Link>
          <Link to="/night-safety" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">🌙 Night Safety Radar (#5)</Link>
          <Link to="/water-tanker" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">💧 Dial-a-Tanker (#6)</Link>
          <Link to="/ward-sabha" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">🗳️ Digital Ward Sabha (#7)</Link>
          <Link to="/civic-pass" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">🏆 Civic Pass & Karma (#8)</Link>
          <Link to="/animal-rescue" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">🐕 Stray Animal Care (#9)</Link>
          <Link to="/noise-monitor" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">🔊 Silence Zone dB (#10)</Link>
          <Link to="/tree-guardian" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">🌳 Urban Tree Guardian (#11)</Link>
          <Link to="/power-grid" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">⚡ Power Grid Telemetry (#12)</Link>
          <Link to="/emergency-sos" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50">🚨 Emergency Hazard SOS (#13)</Link>

          {user && (
            <>
              <div className="border-t border-slate-100 pt-2 text-xs font-bold text-slate-400 uppercase">Citizen Account</div>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">Citizen Hub</Link>
            </>
          )}

          {isAdmin && (
            <>
              <div className="border-t border-slate-100 pt-2 text-xs font-bold text-slate-400 uppercase">Admin Console</div>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">Operations Dashboard</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Activity, Shield, FileText, Layers, GitMerge, AlertTriangle,
  Lightbulb, TrendingUp, Cpu, LogOut, LogIn, UserPlus, Menu, X, CheckCircle2,
  Sparkles, MapPin, Building2, ChevronDown, Lock, Plus, Hammer, Camera, Waves, Zap, Siren
} from 'lucide-react';

const ROLE_LABELS: Record<UserRole, { label: string; badge: string; color: string; dashboardTitle: string }> = {
  citizen: { label: 'Citizen', badge: 'Public Resident', color: 'bg-teal-100 text-teal-800 border-teal-200', dashboardTitle: 'Citizen Hub' },
  volunteer: { label: 'Ward Volunteer', badge: 'Community Steward', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', dashboardTitle: 'Volunteer Hub' },
  contractor: { label: 'Field Contractor', badge: 'Field Ops', color: 'bg-amber-100 text-amber-800 border-amber-200', dashboardTitle: 'Contractor Hub' },
  department_officer: { label: 'Municipal Officer', badge: 'Nodal Authority', color: 'bg-purple-100 text-purple-800 border-purple-200', dashboardTitle: 'Officer Hub' },
  administrator: { label: 'Zonal Commissioner', badge: 'Executive Admin', color: 'bg-rose-100 text-rose-800 border-rose-200', dashboardTitle: 'Executive Hub' },
  system_admin: { label: 'System Admin', badge: 'DevOps / Root', color: 'bg-slate-200 text-slate-800 border-slate-300', dashboardTitle: 'Admin Console' },
};

export const Header: React.FC = () => {
  const { user, logout, isAdmin, isSysAdmin, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const roleSwitcherRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);

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
    setRoleSwitcherOpen(false);
    setAdminMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(event.target as Node)) {
        setRoleSwitcherOpen(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeRoleConfig = user ? ROLE_LABELS[user.role] || ROLE_LABELS.citizen : null;

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

          {/* Clean Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'bg-slate-100 text-teal-600 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              Overview
            </Link>

            <Link
              to="/departments"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/departments') ? 'bg-slate-100 text-teal-600 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>Departments</span>
            </Link>

            <Link
              to="/gis-heatmap"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/gis-heatmap') ? 'bg-slate-100 text-teal-600 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>GIS Heatmap</span>
            </Link>

            {/* Role-Aware Navigation Links */}
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 font-bold ${
                    isActive('/dashboard') ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-700 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>{activeRoleConfig?.dashboardTitle || 'Dashboard'}</span>
                </Link>

                {/* Citizen & Volunteer Quick Action */}
                {(user.role === 'citizen' || user.role === 'volunteer') && (
                  <Link
                    to="/submit-report"
                    className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                      isActive('/submit-report') ? 'bg-slate-100 text-teal-600 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                    }`}
                  >
                    <Plus className="w-4 h-4 text-teal-600" />
                    <span>Report Issue</span>
                  </Link>
                )}

                {/* Contractor Quick Actions */}
                {user.role === 'contractor' && (
                  <>
                    <Link
                      to="/tenders"
                      className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                        isActive('/tenders') ? 'bg-slate-100 text-amber-700 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                      }`}
                    >
                      <Hammer className="w-4 h-4 text-amber-600" />
                      <span>Ward Tenders</span>
                    </Link>
                    <Link
                      to="/road-scanner"
                      className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                        isActive('/road-scanner') ? 'bg-slate-100 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                      }`}
                    >
                      <Camera className="w-4 h-4 text-indigo-600" />
                      <span>AI Road Scanner</span>
                    </Link>
                  </>
                )}

                {/* Officer Quick Actions */}
                {user.role === 'department_officer' && (
                  <>
                    <Link
                      to="/flood-desk"
                      className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                        isActive('/flood-desk') ? 'bg-slate-100 text-cyan-700 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                      }`}
                    >
                      <Waves className="w-4 h-4 text-cyan-600" />
                      <span>Flood Desk</span>
                    </Link>
                    <Link
                      to="/power-grid"
                      className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                        isActive('/power-grid') ? 'bg-slate-100 text-amber-700 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Power Grid</span>
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Officer & Admin Console Dropdown */}
            {isAdmin && (
              <div className="relative group" ref={adminMenuRef}>
                <button
                  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  <Shield className="w-4 h-4 text-teal-600" />
                  <span>Admin Console</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 hidden group-hover:block animate-fade-in z-50">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Executive Workspace
                  </div>
                  <Link to="/admin/dashboard" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <Activity className="w-4 h-4 text-teal-600" /> Operations Dashboard
                  </Link>
                  <Link to="/field-dispatch" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <Activity className="w-4 h-4 text-emerald-600" /> Field Route Optimizer
                  </Link>
                  <Link to="/sla-risk" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <AlertTriangle className="w-4 h-4 text-rose-600" /> SLA Breach Radar
                  </Link>
                  <Link to="/executive-report" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <FileText className="w-4 h-4 text-purple-600" /> Executive ESG Report
                  </Link>
                  <Link to="/admin/match-review" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <Layers className="w-4 h-4" /> AI Match Review
                  </Link>
                  <Link to="/admin/clusters" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <GitMerge className="w-4 h-4" /> Issue Clusters
                  </Link>
                  <Link to="/admin/root-causes" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <Lightbulb className="w-4 h-4" /> Root-Cause Engine
                  </Link>
                  <Link to="/admin/forecasting" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                    <TrendingUp className="w-4 h-4" /> Volume Forecasting
                  </Link>

                  {isSysAdmin && (
                    <>
                      <div className="border-t border-slate-100 my-1" />
                      <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        System Control
                      </div>
                      <Link to="/admin/system" className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600">
                        <Shield className="w-4 h-4" /> System Administration
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Quick 1-Tap Life Safety SOS Button */}
            <Link
              to="/emergency-sos"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-600/30 transition-all hover:scale-105 active:scale-95 animate-pulse ml-1"
              title="1070 Emergency Civic Hazard SOS"
            >
              <Siren className="w-3.5 h-3.5" />
              <span>SOS 1070</span>
            </Link>
          </nav>

          {/* User Status, 1-Click Role Switcher, & Auth Buttons */}
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
                              <div className="font-semibold">{cfg.label}</div>
                              <div className="text-[10px] text-slate-400">{cfg.badge}</div>
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

      {/* Clean Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2 max-h-[85vh] overflow-y-auto">
          {/* Mobile Emergency SOS */}
          <Link
            to="/emergency-sos"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-600 text-white font-black text-xs shadow-md shadow-rose-600/30 uppercase tracking-wider animate-pulse"
          >
            <Siren className="w-4 h-4" />
            <span>🚨 1070 Emergency SOS Desk</span>
          </Link>

          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
            Overview
          </Link>
          <Link to="/departments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
            Municipal Departments
          </Link>
          <Link to="/gis-heatmap" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
            GIS Heatmap
          </Link>

          {user && (
            <>
              <div className="border-t border-slate-100 pt-2 text-xs font-bold text-teal-700 uppercase">
                {activeRoleConfig?.label} Workspace
              </div>
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium">
                {activeRoleConfig?.dashboardTitle || 'Dashboard'}
              </Link>
              {(user.role === 'citizen' || user.role === 'volunteer') && (
                <Link to="/submit-report" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">
                  Report Issue
                </Link>
              )}
              {user.role === 'contractor' && (
                <>
                  <Link to="/tenders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">
                    Ward Tenders
                  </Link>
                  <Link to="/road-scanner" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">
                    AI Road Scanner
                  </Link>
                </>
              )}
              {user.role === 'department_officer' && (
                <>
                  <Link to="/flood-desk" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">
                    Monsoon Flood Desk
                  </Link>
                  <Link to="/power-grid" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">
                    Power Grid SCADA
                  </Link>
                </>
              )}
            </>
          )}

          {isAdmin && (
            <>
              <div className="border-t border-slate-100 pt-2 text-xs font-bold text-slate-400 uppercase">Admin Console</div>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">
                Operations Dashboard
              </Link>
              <Link to="/field-dispatch" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">
                Field Crew Dispatch
              </Link>
              <Link to="/sla-risk" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50">
                SLA Breach Radar
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

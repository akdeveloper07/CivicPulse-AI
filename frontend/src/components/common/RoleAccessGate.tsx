import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  ShieldAlert, Lock, ArrowLeft, RefreshCw, CheckCircle2,
  AlertTriangle, Building2, User, Hammer, ShieldCheck, Users
} from 'lucide-react';

interface RoleAccessGateProps {
  allowedRoles: UserRole[];
  featureName: string;
  departmentName: string;
  featureCode?: string;
  reason?: string;
  children: React.ReactNode;
}

const ROLE_DISPLAY_NAMES: Record<UserRole, { title: string; tamil: string; icon: React.ElementType; color: string }> = {
  citizen: { title: 'Citizen', tamil: 'பொதுமக்கள்', icon: User, color: 'bg-teal-100 text-teal-800 border-teal-300' },
  volunteer: { title: 'Ward Volunteer', tamil: 'வார்டு தொண்டர்', icon: Users, color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  contractor: { title: 'Field Contractor', tamil: 'களப் பொறியாளர்', icon: Hammer, color: 'bg-amber-100 text-amber-800 border-amber-300' },
  department_officer: { title: 'Department Officer', tamil: 'துறை அலுவலர்', icon: Building2, color: 'bg-purple-100 text-purple-800 border-purple-300' },
  administrator: { title: 'Zonal Administrator', tamil: 'மண்டல ஆணையர்', icon: ShieldCheck, color: 'bg-rose-100 text-rose-800 border-rose-300' },
  system_admin: { title: 'System Administrator', tamil: 'கணினி நிர்வாகி', icon: ShieldCheck, color: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export const RoleAccessGate: React.FC<RoleAccessGateProps> = ({
  allowedRoles,
  featureName,
  departmentName,
  featureCode,
  reason,
  children,
}) => {
  const { user, isLoading, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500">Verifying civic role credentials...</p>
      </div>
    );
  }

  // Not logged in -> Redirect to login
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-navy-900">Authentication Required</h2>
          <p className="text-xs text-slate-500">
            Please log in to verify your role and access {featureName}.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/login"
            className="w-full inline-block py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Log In to CivicNexus AI
          </Link>
        </div>
      </div>
    );
  }

  // Admins always bypass for auditing purposes
  const isAllowed = allowedRoles.includes(user.role) || user.role === 'system_admin' || user.role === 'administrator';

  if (isAllowed) {
    return <>{children}</>;
  }

  // ACCESS DENIED VIEW
  const currentRoleInfo = ROLE_DISPLAY_NAMES[user.role] || ROLE_DISPLAY_NAMES.citizen;
  const CurrentIcon = currentRoleInfo.icon;

  const handleSwitchRole = (targetRole: UserRole) => {
    loginAsDemoRole(targetRole);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      {/* Access Restriction Banner */}
      <div className="glass-panel p-8 bg-white rounded-3xl border-2 border-rose-200 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-rose-50 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 shadow-xs">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider border border-rose-200">
                Access Restricted · Role Mismatch
              </span>
              {featureCode && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                  {featureCode}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">
              {featureName}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Governed by: <strong className="text-navy-900">{departmentName}</strong>
            </p>
          </div>
        </div>

        {/* Status Callout */}
        <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Your Current Signed-in Role:</span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border flex items-center gap-1.5 ${currentRoleInfo.color}`}>
                <CurrentIcon className="w-3.5 h-3.5" />
                {currentRoleInfo.title} ({currentRoleInfo.tamil})
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500 truncate">{user.email}</span>
          </div>

          <p className="text-xs text-rose-950 leading-relaxed font-medium">
            {reason || `As a signed-in ${currentRoleInfo.title}, your account does not possess the requisite operational credentials for this service. Access is strictly restricted to authorized roles under municipal governance bylaws.`}
          </p>
        </div>

        {/* Required Roles Matrix */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider">
            Authorized Roles Permitted to Access This Feature:
          </h3>
          <div className="flex flex-wrap gap-2">
            {allowedRoles.map((role) => {
              const info = ROLE_DISPLAY_NAMES[role] || ROLE_DISPLAY_NAMES.citizen;
              const RoleIcon = info.icon;
              return (
                <div
                  key={role}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5"
                >
                  <RoleIcon className="w-3.5 h-3.5 text-teal-600" />
                  <span>{info.title}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({info.tamil})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Workspace Dashboard</span>
          </button>

          <Link
            to="/submit-report"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 transition-all"
          >
            <span>Submit a Civic Report Instead</span>
          </Link>
        </div>

        {/* Quick Demo Role Switcher for Testing */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 text-teal-600" /> Demo & Evaluation Mode: Switch Role to Unlock
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1-Click Live Switch</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allowedRoles.map((role) => {
              const info = ROLE_DISPLAY_NAMES[role] || ROLE_DISPLAY_NAMES.citizen;
              return (
                <button
                  key={role}
                  onClick={() => handleSwitchRole(role)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Switch to {info.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

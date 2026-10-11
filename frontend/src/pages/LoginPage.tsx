import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  LogIn, AlertCircle, Shield, User, Users, Hammer, Building2,
  ShieldCheck, CheckCircle2, ArrowRight
} from 'lucide-react';

interface DemoRoleCard {
  role: UserRole;
  title: string;
  tamilTitle: string;
  badge: string;
  email: string;
  icon: React.ElementType;
  accessibleServices: string;
}

const DEMO_ROLES: DemoRoleCard[] = [
  {
    role: 'citizen',
    title: 'Citizen',
    tamilTitle: 'பொதுமக்கள்',
    badge: 'Public Resident',
    email: 'citizen@civicpulse.org',
    icon: User,
    accessibleServices: 'Smart Civic Report, Tamil Voice, SafeRoute, Nearby Map, Night Safety Radar, Civic Pass',
  },
  {
    role: 'volunteer',
    title: 'Ward Volunteer',
    tamilTitle: 'வார்டு தொண்டர்',
    badge: 'Community Steward',
    email: 'volunteer@civicpulse.org',
    icon: Users,
    accessibleServices: 'Community Cleanups, Tree Guardian, RepairProof Audits, Ward Leaderboard',
  },
  {
    role: 'contractor',
    title: 'Field Crew / Contractor',
    tamilTitle: 'களப் பொறியாளர்',
    badge: 'Field Ops',
    email: 'contractor@civicpulse.org',
    icon: Hammer,
    accessibleServices: 'Crew Dispatch Routing, AI Road Scanner, Repair Proof Upload, Work Orders',
  },
  {
    role: 'department_officer',
    title: 'Municipal Dept Officer',
    tamilTitle: 'துறை அலுவலர்',
    badge: 'Nodal Authority',
    email: 'officer@civicpulse.org',
    icon: Building2,
    accessibleServices: 'Command Center, Live Department Triage, Ward Tenders, Power Grid, Water Tankers',
  },
  {
    role: 'administrator',
    title: 'Zonal Commissioner / Admin',
    tamilTitle: 'மண்டல ஆணையர்',
    badge: 'Executive',
    email: 'admin@civicpulse.org',
    icon: ShieldCheck,
    accessibleServices: 'Citywide Analytics, Civic Simulator, RootCause AI, SLA Escalation Engine, Audit Logs',
  },
];

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole>('citizen');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleInstantDemoLogin = (role: UserRole) => {
    setSelectedDemoRole(role);
    loginAsDemoRole(role);
    navigate(role === 'administrator' ? '/admin' : '/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto my-10 px-4 space-y-6">
      <div className="glass-panel p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200">
        <div className="text-center space-y-2">
          <img
            src="/logo-icon.png"
            alt="CivicNexus AI"
            className="w-14 h-14 rounded-2xl object-contain bg-[#011023] p-1.5 mx-auto shadow-md border border-teal-500/30"
          />
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">Sign In to CivicNexus AI</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select your role or enter credentials to access civic services</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-CLICK INSTANT ROLE LOGIN DEMO SELECTOR */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> 1-Click Role Demonstration Login
            </span>
            <span className="text-[10px] text-slate-400">Instant Access</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Test CivicNexus AI instantly under any municipal user role. Click any role below to sign in immediately:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
            {DEMO_ROLES.map((dr) => {
              const Icon = dr.icon;
              return (
                <button
                  key={dr.role}
                  type="button"
                  onClick={() => handleInstantDemoLogin(dr.role)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-teal-400/50 text-left transition-all group flex flex-col justify-between space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs text-white">{dr.title}</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {dr.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate font-mono">
                    {dr.email}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Google Sign-In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleSubmitting || isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-xs transition-all text-xs flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          {isGoogleSubmitting ? 'Signing in with Google...' : 'Continue with Google'}
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            or sign in with password
          </span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. citizen@civicpulse.org"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md hover:shadow-teal-500/25 transition-all text-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Need a new account?{' '}
          <Link to="/register" className="font-bold text-teal-600 hover:underline">
            Register with Role Selection
          </Link>
        </div>
      </div>
    </div>
  );
};

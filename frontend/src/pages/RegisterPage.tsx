import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  UserPlus, AlertCircle, Shield, Users, Hammer, Building2,
  CheckCircle2, Sparkles, User, ShieldCheck
} from 'lucide-react';

interface RoleOption {
  value: UserRole;
  title: string;
  tamilTitle: string;
  badge: string;
  color: string;
  icon: React.ElementType;
  description: string;
  accessibleServices: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: 'citizen',
    title: 'Citizen',
    tamilTitle: 'பொதுமக்கள்',
    badge: 'Public Resident',
    color: 'border-teal-500 bg-teal-50/40 text-teal-900',
    icon: User,
    description: 'Everyday resident reporting neighborhood hazards and tracking civic solutions.',
    accessibleServices: 'Smart Reports, Tamil Voice, Nearby Map, SafeRoute, Night Safety, Water Tanker, Ward Sabha Voting, Civic Pass',
  },
  {
    value: 'volunteer',
    title: 'Ward Volunteer',
    tamilTitle: 'வார்டு தொண்டர்',
    badge: 'Community Steward',
    color: 'border-indigo-500 bg-indigo-50/40 text-indigo-900',
    icon: Users,
    description: 'Active community leader organizing cleanups, tree planting, and local civic audits.',
    accessibleServices: 'All Citizen Services + Community Action Matcher, Tree Guardian, RepairProof Audits, Ward Leaderboard',
  },
  {
    value: 'contractor',
    title: 'Field Engineer / Contractor',
    tamilTitle: 'களப் பொறியாளர்',
    badge: 'Field Operations',
    color: 'border-amber-500 bg-amber-50/40 text-amber-900',
    icon: Hammer,
    description: 'Road repair crews, pipeline mechanics, and private municipal contractors.',
    accessibleServices: 'Crew Dispatch Routing, AI Road Scanner, Work Order Execution, Before/After RepairProof Submissions',
  },
  {
    value: 'department_officer',
    title: 'Municipal Department Officer',
    tamilTitle: 'துறை அலுவலர்',
    badge: 'Nodal Authority',
    color: 'border-purple-500 bg-purple-50/40 text-purple-900',
    icon: Building2,
    description: 'Designated Assistant / Executive Engineer from GCC, CMWSSB, TANGEDCO, or GCTP.',
    accessibleServices: 'Department Command Center, Live Triage, Contractor Tenders, Substation Power Grids, Water Distribution',
  },
  {
    value: 'administrator',
    title: 'Zonal Commissioner / Admin',
    tamilTitle: 'மண்டல ஆணையர்',
    badge: 'Executive Leadership',
    color: 'border-rose-500 bg-rose-50/40 text-rose-900',
    icon: ShieldCheck,
    description: 'Executive city leadership, ombudsman, and system administrators.',
    accessibleServices: 'Citywide Analytics, Civic Simulator, Root Cause AI, SLA Escalation Engine, Algorithmic Equity Audits',
  },
];

export const RegisterPage: React.FC = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({ name, email, password, role: selectedRole });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google registration failed.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const activeRoleData = ROLE_OPTIONS.find((r) => r.value === selectedRole) || ROLE_OPTIONS[0];

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="glass-panel p-6 sm:p-8 space-y-6 shadow-xl border border-slate-200">
        <div className="text-center space-y-2">
          <img
            src="/logo-icon.png"
            alt="CivicNexus AI"
            className="w-14 h-14 rounded-2xl object-contain bg-[#011023] p-1.5 mx-auto shadow-md border border-teal-500/30"
          />
          <div>
            <h2 className="text-2xl font-extrabold text-navy-900 tracking-tight">Create CivicNexus AI Account</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select your role to access customized civic tools & services</p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Google Sign-Up */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isGoogleSubmitting || isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-xs transition-all text-xs flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          {isGoogleSubmitting ? 'Registering with Google...' : 'Quick Sign Up with Google'}
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            or register with role details
          </span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* USER ROLE SELECTION SECTION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                Select Your Civic Role (பங்கு தேர்வு)
              </label>
              <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                {activeRoleData.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedRole === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedRole(opt.value)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? `border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/30 shadow-xs`
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-navy-900">{opt.title}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{opt.tamilTitle}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Role Access Clarity Dossier */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 mt-2">
              <div className="flex items-center gap-1.5 font-bold text-navy-900 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Services Accessible to {activeRoleData.title}:
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                {activeRoleData.accessibleServices}
              </p>
            </div>
          </div>

          {/* Form Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kavitha Ramachandran"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kavitha@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-xs transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md hover:shadow-teal-500/25 transition-all text-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? 'Registering Account...' : `Register as ${activeRoleData.title}`}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-teal-600 hover:underline">
            Sign In with Role Selection
          </Link>
        </div>
      </div>
    </div>
  );
};

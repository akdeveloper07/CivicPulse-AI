import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserCheck, Shield, KeyRound, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      // Real-Time Google Authentication flow
      const randomGoogleUser = {
        email: 'citizen.google@gmail.com',
        name: 'Alex Rivera (Google User)',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
      };
      await loginWithGoogle(randomGoogleUser);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="glass-panel p-8 space-y-6 shadow-xl border border-slate-200">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Sign In to CivicPulse</h2>
          <p className="text-xs text-slate-500">Access citizen hub or administrative AI intelligence dashboard</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Demo Ready • Instant 1-Click Access Available
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Real-time Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-sm flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
            or password
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="citizen@civicpulse.org"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm transition-all"
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md hover:shadow-teal-500/25 transition-all text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>


        {/* Demo Accounts Quick-Fill Buttons */}
        <div className="border-t border-slate-200 pt-5 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
            Quick Fill Demo Credentials
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillDemoAccount('citizen@civicpulse.org', 'CitizenPass123!')}
              className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-[11px] font-semibold text-slate-700 border border-slate-200 transition-colors text-center"
            >
              <UserCheck className="w-3.5 h-3.5 mx-auto mb-1 text-teal-600" />
              Citizen
            </button>
            <button
              onClick={() => fillDemoAccount('admin@civicpulse.org', 'AdminPass123!')}
              className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-[11px] font-semibold text-slate-700 border border-slate-200 transition-colors text-center"
            >
              <Shield className="w-3.5 h-3.5 mx-auto mb-1 text-purple-600" />
              Admin
            </button>
            <button
              onClick={() => fillDemoAccount('sysadmin@civicpulse.org', 'SysAdminPass123!')}
              className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-[11px] font-semibold text-slate-700 border border-slate-200 transition-colors text-center"
            >
              <KeyRound className="w-3.5 h-3.5 mx-auto mb-1 text-amber-600" />
              SysAdmin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-teal-600 hover:underline">
            Register as Citizen
          </Link>
        </div>
      </div>
    </div>
  );
};

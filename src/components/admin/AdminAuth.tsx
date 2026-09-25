import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, Eye, EyeOff, Clock, ShieldAlert } from 'lucide-react';
import { db } from '../../services/db';

interface AdminAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminAuth({ onSuccess, onCancel }: AdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockMinsLeft, setLockMinsLeft] = useState(0);

  // Check lockout state on mount and keep it refreshed
  useEffect(() => {
    const checkLock = () => {
      try {
        const lockoutUntil = parseInt(localStorage.getItem('aura_auth_lockout') || '0', 10);
        if (lockoutUntil && Date.now() < lockoutUntil) {
          setIsLocked(true);
          setLockMinsLeft(Math.ceil((lockoutUntil - Date.now()) / 60000));
        } else {
          setIsLocked(false);
          setLockMinsLeft(0);
        }
      } catch { /* ignore */ }
    };
    checkLock();
    const interval = setInterval(checkLock, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError('');
    setIsLoading(true);

    try {
      const res = await db.signIn(email.trim(), password);
      if (res.success) {
        onSuccess();
      } else {
        const msg = res.error || 'Authentication failed.';
        setError(msg);
        // Re-check lockout after a failed attempt
        const lockoutUntil = parseInt(localStorage.getItem('aura_auth_lockout') || '0', 10);
        if (lockoutUntil && Date.now() < lockoutUntil) {
          setIsLocked(true);
          setLockMinsLeft(Math.ceil((lockoutUntil - Date.now()) / 60000));
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-8 bg-[#08090c] text-white overflow-y-auto">
      {/* Background dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md p-6 sm:p-10 my-auto rounded-3xl glass-surface border border-white/10 shadow-2xl bg-[#0f1118]/90 backdrop-blur-2xl"
      >
        <button
          onClick={onCancel}
          className="absolute top-5 left-5 sm:top-6 sm:left-6 flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Site</span>
        </button>

        <div className="text-center mt-6 mb-8">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${isLocked ? 'bg-red-500/10 border-red-500/30' : 'bg-white/[0.05] border-white/10'}`}>
            {isLocked ? (
              <ShieldAlert className="w-6 h-6 text-red-400" />
            ) : (
              <Shield className="w-6 h-6 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Admin Console
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Secure access — SRK Works Management Portal
          </p>
        </div>

        {/* Lockout Banner */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs"
          >
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span className="font-semibold text-red-300">Account Temporarily Locked</span>
            </div>
            <p className="text-red-400/80 leading-relaxed pl-6">
              Too many failed attempts detected. Access will be restored in{' '}
              <span className="font-mono font-bold text-red-300">{lockMinsLeft} minute{lockMinsLeft !== 1 ? 's' : ''}</span>.
            </p>
          </motion.div>
        )}

        {/* Error Banner (non-lockout) */}
        {error && !isLocked && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Hidden dummy inputs — prevents ALL major browsers (Chrome/Firefox/Safari/Edge) from autofilling the real fields */}
        <input type="text" name="fake-email-prevent-autofill" style={{ display: 'none' }} autoComplete="username" tabIndex={-1} aria-hidden="true" readOnly />
        <input type="password" name="fake-pass-prevent-autofill" style={{ display: 'none' }} autoComplete="new-password" tabIndex={-1} aria-hidden="true" readOnly />

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                id="admin-email-field"
                name="admin-email-field"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                autoComplete="off"
                spellCheck={false}
                disabled={isLocked}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password-field"
                name="admin-password-field"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLocked}
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
                className="absolute right-3 top-2.5 p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-neutral-300" />
                ) : (
                  <Eye className="w-4 h-4 text-neutral-400" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="admin-submit-btn"
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full py-3 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Verifying...' : isLocked ? 'Account Locked' : 'Authenticate & Enter'}</span>
              {!isLocked && <ArrowRight className="w-4 h-4" />}
              {isLocked && <Clock className="w-4 h-4" />}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
          <p className="text-[11px] text-neutral-500">
            Protected by session expiry &amp; brute-force lockout.
            <br />
            Use your Supabase admin account credentials.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

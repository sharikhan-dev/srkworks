import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { db } from '../../services/db';

interface AdminAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdminAuth({ onSuccess, onCancel }: AdminAuthProps) {
  const [email, setEmail] = useState('admin@srkworks.design');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await db.signIn(email, password);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-8 bg-[#08090c] text-white overflow-y-auto">
      {/* Background blur and grid */}
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
          <div className="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center mx-auto mb-4 bg-white/[0.05] border border-white/10">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Sharik Khan • Admin
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Protected Supabase / Local Management Console
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@srkworks.design"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
            >
              <span>{isLoading ? 'Verifying Session...' : 'Authenticate & Enter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
          <p className="text-[11px] text-neutral-400">
            Demo Credentials Pre-filled: <span className="text-neutral-300 font-mono">admin@srkworks.design</span> / <span className="text-neutral-300 font-mono">admin123</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

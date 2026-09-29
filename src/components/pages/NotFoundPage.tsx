import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, Layers, Mail, Compass } from 'lucide-react';
import { SiteSettings } from '../../types';

interface NotFoundPageProps {
  settings: SiteSettings;
  onNavigate: (target: string) => void;
}

export function NotFoundPage({ settings, onNavigate }: NotFoundPageProps) {
  useEffect(() => {
    document.title = '404 - Page Not Found | SRK Works';
    const robots = document.querySelector('meta[name="robots"]');
    if (robots) {
      robots.setAttribute('content', 'noindex, follow');
    }
    return () => {
      if (robots) {
        robots.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      }
    };
  }, []);

  const brandName = settings?.name || 'SRK Works';

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 text-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl mx-auto p-8 sm:p-12 rounded-3xl glass-surface border border-white/10 relative"
      >
        {/* Brand badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill mb-6 border border-white/10">
          <Compass className="w-3.5 h-3.5 text-neutral-300 animate-spin" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-300">
            {brandName}
          </span>
        </div>

        {/* 404 Headline */}
        <h1 className="text-6xl sm:text-8xl font-mono font-extrabold tracking-tight text-white mb-2">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3">
          Page Not Found
        </h2>

        <p className="text-xs sm:text-sm text-neutral-400 mb-8 max-w-sm mx-auto leading-relaxed">
          The page you are looking for has been moved, removed, or never existed. You can return to the homepage or explore our services below.
        </p>

        {/* Navigation Action Buttons required by SEO spec */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </button>

          <button
            onClick={() => onNavigate('services')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full glass-pill border border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Explore Services</span>
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full glass-pill border border-white/15 text-neutral-300 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Us</span>
          </button>
        </div>
      </motion.div>
    </main>
  );
}

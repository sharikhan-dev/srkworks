import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowDown, ArrowUpRight, Layout, Code2, Cpu, Bot } from 'lucide-react';
import { HeroSettings, SiteSettings } from '../../types';

interface HeroProps {
  settings: SiteSettings;
  hero?: HeroSettings;
  onNavigate: (sectionId: string) => void;
}

const DEFAULT_HERO_PHRASES = [
  'UI/UX EXPERIENCES',
  'WEBSITES',
  'AI AUTOMATIONS',
  'AI SOLUTIONS',
  'DIGITAL EXPERIENCES'
];

export function Hero({ settings, hero, onNavigate }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  // Extract phrases from HeroSettings (filter enabled) or fallback to settings/defaults
  const phrases =
    hero?.phrases && hero.phrases.length > 0
      ? hero.phrases.filter((p) => p.enabled).map((p) => p.text)
      : settings.hero_phrases && settings.hero_phrases.length > 0
      ? settings.hero_phrases
      : DEFAULT_HERO_PHRASES;

  const eyebrow = hero?.eyebrow || settings.title_badge || "HEY, I'M SHARIK";
  const headline = hero?.headline || settings.headline || "I CREATE";
  const supportingText =
    hero?.supporting_text ||
    settings.hero_supporting_text ||
    'Designing digital experiences, building modern websites, and creating AI-powered systems for the next generation of businesses.';
  const primaryCtaText = hero?.primary_cta_label || settings.primary_cta_label || 'View My Work';
  const primaryCtaUrl = hero?.primary_cta_url || '#work';
  const secondaryCtaText = hero?.secondary_cta_label || settings.secondary_cta_label || "Let's Work Together";
  const secondaryCtaUrl = hero?.secondary_cta_url || '#contact';
  const heroVisual = hero?.hero_image || settings.profile_image || '/hero-sculpture.jpg';

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroCardRef = useRef<HTMLDivElement>(null);

  // Auto-rotate phrases every 2.8 seconds
  useEffect(() => {
    if (prefersReducedMotion || phrases.length <= 1) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [phrases.length, prefersReducedMotion]);

  // Subtle cursor parallax effect inside hero container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 20, y: y * 20 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleCtaClick = (target: string) => {
    if (target.startsWith('#')) {
      onNavigate(target.substring(1));
    } else if (target.startsWith('http')) {
      window.open(target, '_blank', 'noopener,noreferrer');
    } else {
      onNavigate(target);
    }
  };

  return (
    <section
      id="hero"
      className="relative px-3 sm:px-6 lg:px-8 pt-24 pb-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Large Rounded Hero Container */}
      <div
        ref={heroCardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hero-glass-container specular-border-top relative rounded-[2.25rem] sm:rounded-[3rem] overflow-hidden p-6 sm:p-12 md:p-16 min-h-[82vh] md:min-h-[86vh] flex flex-col justify-between border border-white/[0.12] transition-shadow duration-700 hover:shadow-[0_40px_90px_-20px_rgba(0,0,0,0.85)]"
      >
        {/* Ambient Backlight Glows */}
        <div className="absolute -top-24 -right-24 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] bg-gradient-to-br from-white/[0.06] via-neutral-400/[0.03] to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute -bottom-32 -left-24 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Integrated 3D Glass Sculpture with cursor parallax */}
        <motion.div
          style={{
            transform: prefersReducedMotion
              ? 'none'
              : `translate3d(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px, 0)`
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="absolute right-[-10%] sm:right-[-4%] md:right-[2%] top-[14%] md:top-[8%] w-[340px] sm:w-[500px] md:w-[620px] lg:w-[680px] aspect-square pointer-events-none select-none -z-0 opacity-40 sm:opacity-55 md:opacity-75 transition-opacity duration-700"
        >
          <div className="relative w-full h-full">
            <img
              src={heroVisual}
              alt="Liquid Frosted Glass Sculpture"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] mix-blend-screen"
            />
            {/* Subtle atmospheric gradient over the visual */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f14] via-[#0d0f14]/40 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Floating Availability Badge */}
        <motion.div
          style={{
            transform: prefersReducedMotion
              ? 'none'
              : `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 0)`
          }}
          className="hidden lg:flex absolute right-12 top-16 items-center gap-2.5 glass-pill px-4 py-2 rounded-full pointer-events-none border border-white/10"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono tracking-tight text-neutral-300">
            {settings.availability_status || 'Available for selected projects'}
          </span>
        </motion.div>

        {/* Hero Content Area */}
        <div className="relative z-10 max-w-2xl pt-2 sm:pt-4">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill mb-6 sm:mb-8 border border-white/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] text-neutral-300 font-medium">
              {eyebrow}
            </span>
          </motion.div>

          {/* Headline + Dynamic Word Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 select-none"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-semibold tracking-[-0.03em] text-white leading-[1.06]">
              <span className="block text-white/90 font-medium">
                {headline}
              </span>

              {/* Dynamic Animated Word Carousel */}
              <div className="h-[1.18em] relative overflow-hidden mt-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIndex}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="block absolute inset-0 bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent font-semibold tracking-[-0.03em] drop-shadow-sm whitespace-nowrap"
                  >
                    {phrases[phraseIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>
          </motion.div>

          {/* Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-neutral-300/90 font-light sm:font-normal leading-relaxed mb-8 sm:mb-10 max-w-xl text-balance"
          >
            {supportingText}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto"
          >
            <button
              id="hero-primary-cta"
              onClick={() => handleCtaClick(primaryCtaUrl)}
              className="px-7 py-3.5 text-sm font-semibold text-black bg-white hover:bg-neutral-200 rounded-full transition-all duration-300 shadow-[0_0_35px_rgba(255,255,255,0.25)] hover:shadow-[0_0_45px_rgba(255,255,255,0.4)] active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{primaryCtaText}</span>
              <ArrowDown className="w-4 h-4 text-black transition-transform group-hover:translate-y-0.5" />
            </button>

            <button
              id="hero-secondary-cta"
              onClick={() => handleCtaClick(secondaryCtaUrl)}
              className="px-7 py-3.5 text-sm font-medium text-neutral-200 hover:text-white glass-pill hover:bg-white/10 rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 border border-white/15 cursor-pointer"
            >
              <span>{secondaryCtaText}</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </motion.div>
        </div>

        {/* Lower Tier Service Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mt-14 sm:mt-16 pt-8 border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          <div
            onClick={() => onNavigate('services')}
            className="group p-4 sm:p-5 rounded-2xl glass-surface glass-surface-hover cursor-pointer border border-white/[0.08] flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">01 / CRAFT</span>
              <Layout className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-semibold text-white block">UI/UX Design</span>
              <span className="text-xs text-neutral-400 mt-0.5 block">Design Systems & Figma</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('services')}
            className="group p-4 sm:p-5 rounded-2xl glass-surface glass-surface-hover cursor-pointer border border-white/[0.08] flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">02 / CODE</span>
              <Code2 className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-semibold text-white block">Web Development</span>
              <span className="text-xs text-neutral-400 mt-0.5 block">React, Next.js, Motion</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('services')}
            className="group p-4 sm:p-5 rounded-2xl glass-surface glass-surface-hover cursor-pointer border border-white/[0.08] flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">03 / FLOW</span>
              <Cpu className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-semibold text-white block">AI Automation</span>
              <span className="text-xs text-neutral-400 mt-0.5 block">Pipelines & Workflows</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('services')}
            className="group p-4 sm:p-5 rounded-2xl glass-surface glass-surface-hover cursor-pointer border border-white/[0.08] flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">04 / INTEL</span>
              <Bot className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-semibold text-white block">AI Solutions</span>
              <span className="text-xs text-neutral-400 mt-0.5 block">Chatbots & LLM Tools</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { HeroSettings, SiteSettings } from '../../types';

interface HeroProps {
  settings: SiteSettings;
  hero?: HeroSettings;
  onNavigate: (sectionId: string) => void;
}

const DEFAULT_TYPING_PHRASES = [
  'Experiences',
  'Websites',
  'UI/UX Design',
  'AI Solutions',
  'Automations'
];

export function Hero({ settings, hero, onNavigate }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();

  // Extract phrases from database (HeroSettings) or fallback
  const phrases = useMemo(() => {
    const fromHero = hero?.phrases && hero.phrases.length > 0
      ? hero.phrases.filter((p) => p.enabled).map((p) => p.text.trim())
      : null;

    const fromSettings = settings.hero_phrases && settings.hero_phrases.length > 0
      ? settings.hero_phrases.map((p) => p.trim())
      : null;

    return fromHero || fromSettings || DEFAULT_TYPING_PHRASES;
  }, [hero?.phrases, settings.hero_phrases]);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState(phrases[0] || 'Experiences');
  const [isDeleting, setIsDeleting] = useState(false);

  // Smooth typing and deleting animation effect
  useEffect(() => {
    if (prefersReducedMotion || phrases.length === 0) {
      setCurrentText(phrases[phraseIndex] || 'Experiences');
      return;
    }

    const targetPhrase = phrases[phraseIndex] || 'Experiences';
    const typingSpeed = isDeleting ? 45 : 85;
    const pauseAtEnd = 2200;
    const pauseBeforeNext = 300;

    let timer: NodeJS.Timeout;

    if (!isDeleting && currentText === targetPhrase) {
      // Completed typing the phrase, hold before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseAtEnd);
    } else if (isDeleting && currentText === '') {
      // Completed deleting, move to next phrase
      timer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, pauseBeforeNext);
    } else {
      // Actively typing or deleting
      timer = setTimeout(() => {
        const next = isDeleting
          ? targetPhrase.slice(0, currentText.length - 1)
          : targetPhrase.slice(0, currentText.length + 1);
        setCurrentText(next);
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex, phrases, prefersReducedMotion]);

  const supportingText =
    hero?.supporting_text ||
    settings.hero_supporting_text ||
    "Hi, I'm Sharikhan — a designer and developer passionate about creating modern websites, intuitive user interfaces, and innovative digital experiences. I combine creativity, technology, and AI to turn ideas into meaningful digital solutions.";

  const primaryCtaText = hero?.primary_cta_label || settings.primary_cta_label || 'View My Work ↗';
  const primaryCtaUrl = hero?.primary_cta_url || '#work';
  const secondaryCtaText = hero?.secondary_cta_label || settings.secondary_cta_label || "Let's connect";
  const secondaryCtaUrl = hero?.secondary_cta_url || '#contact';

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
      className="relative min-h-[88vh] pt-36 sm:pt-44 lg:pt-48 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Delicate Architectural Background Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[550px] sm:w-[800px] h-[300px] bg-gradient-to-r from-blue-100/40 via-indigo-50/30 to-sky-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative Corner Registration Markers */}
      <span className="hidden lg:block absolute top-32 left-8 text-neutral-300 font-mono text-sm select-none pointer-events-none">+</span>
      <span className="hidden lg:block absolute top-32 right-8 text-neutral-300 font-mono text-sm select-none pointer-events-none">+</span>
      <span className="hidden lg:block absolute bottom-10 left-8 text-neutral-300 font-mono text-sm select-none pointer-events-none">+</span>
      <span className="hidden lg:block absolute bottom-10 right-8 text-neutral-300 font-mono text-sm select-none pointer-events-none">+</span>

      {/* Main Hero Center Content (scaled down by ~20%) */}
      <div className="relative z-20 max-w-3xl mx-auto flex flex-col items-center text-center mt-4 sm:mt-8 lg:mt-10">
        {/* Main Headline (Sora, scaled down by 20%: 60px desktop) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-sora text-[28px] sm:text-[46px] md:text-[56px] lg:text-[60px] font-bold tracking-[-0.03em] leading-[1.07] sm:leading-[1.08] select-none text-neutral-950 flex flex-col items-center"
        >
          {/* Permanent Top Line */}
          <span className="block text-neutral-950">Let’s Build Digital</span>

          {/* Dynamic Typed Middle Line */}
          <span className="inline-flex items-center justify-center py-0.5 min-h-[1.12em]">
            <span className="hero-experiences-gradient">
              {currentText}
            </span>
            {/* Blinking Typing Cursor */}
            <span
              className="inline-block w-[2.5px] sm:w-[3.5px] lg:w-[4px] h-[0.8em] ml-1 sm:ml-1.5 bg-blue-600 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] align-middle shadow-[0_0_8px_rgba(37,99,235,0.45)]"
              aria-hidden="true"
            />
          </span>

          {/* Permanent Bottom Line */}
          <span className="block text-neutral-950">For Every Vision.</span>
        </motion.h1>

        {/* Supporting Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-inter text-xs sm:text-[14.5px] md:text-[15px] text-neutral-600 leading-relaxed sm:leading-relaxed max-w-xl sm:max-w-2xl mt-5 sm:mt-6 px-2 text-balance font-normal"
        >
          {supportingText}
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 mt-7 sm:mt-8 w-full sm:w-auto"
        >
          {/* Primary CTA */}
          <button
            id="hero-primary-cta"
            onClick={() => handleCtaClick(primaryCtaUrl)}
            className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-neutral-950 text-white font-inter text-xs sm:text-[13px] font-semibold hover:bg-neutral-800 transition-all duration-200 shadow-sm active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{primaryCtaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {/* Secondary CTA */}
          <button
            id="hero-secondary-cta"
            onClick={() => handleCtaClick(secondaryCtaUrl)}
            className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white text-neutral-900 border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 font-inter text-xs sm:text-[13px] font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <span>{secondaryCtaText}</span>
          </button>
        </motion.div>

        {/* Minimalist Apple-Style Mouse Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onNavigate('about')}
          className="mt-11 sm:mt-13 flex flex-col items-center gap-1.5 cursor-pointer group select-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('about');
            }
          }}
          aria-label="Scroll to next section"
        >
          <div className="w-[19px] h-[31px] rounded-full border-[1.5px] border-neutral-400/80 group-hover:border-neutral-900 transition-colors duration-200 flex items-start justify-center p-1 shadow-2xs">
            <motion.div
              animate={prefersReducedMotion ? {} : {
                y: [0, 7, 0],
                opacity: [1, 0.3, 1]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-1 h-1.5 rounded-full bg-neutral-700 group-hover:bg-neutral-950 transition-colors"
            />
          </div>
          <span className="text-[9px] font-inter uppercase tracking-[0.16em] text-neutral-400 group-hover:text-neutral-700 transition-colors font-medium">
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}
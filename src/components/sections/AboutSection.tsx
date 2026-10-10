import { motion } from 'motion/react';
import { User, ArrowRight, MapPin, Instagram, ArrowUpRight } from 'lucide-react';
import { Skill, Experience, SiteSettings, AboutSettings } from '../../types';

interface AboutSectionProps {
  settings: SiteSettings;
  about?: AboutSettings;
  skills: Skill[];
  experience: Experience[];
  onNavigate: (sectionId: string) => void;
}

export function AboutSection({ settings, about, skills, experience, onNavigate }: AboutSectionProps) {
  const badge = about?.badge || 'The Philosophy';
  const heading = about?.heading || 'DESIGN × CODE × AI';
  const introduction =
    about?.introduction ||
    'I combine UI/UX design, frontend development, AI, automation, and creative technology.';
  const detailedDescription =
    about?.detailed_description ||
    'Guided by Apple-inspired restraint and engineering discipline, I eliminate unnecessary complexity to create interfaces that feel effortless, websites that load instantly, and autonomous AI systems that free teams from repetitive operational drag.';
  const ctaText = about?.cta_text || 'Work With Me';
  const ctaUrl = about?.cta_url || '#contact';

  const tags =
    about?.skills_tags && about.skills_tags.length > 0
      ? about.skills_tags
      : [
          'Design Systems',
          'Next.js & Vite',
          'TypeScript Rigor',
          'Gemini AI Models',
          'Autonomous Pipelines',
          'Sub-Second Vitals'
        ];

  const metrics =
    about?.metrics && about.metrics.length > 0
      ? about.metrics
      : [
          { id: '1', label: 'Experience', value: '5+', subtext: 'Years of craft' },
          { id: '2', label: 'Production', value: '24+', subtext: 'Deployed systems' },
          { id: '3', label: 'Reliability', value: '99.8%', subtext: 'Uptime & satisfaction' },
          { id: '4', label: 'Speed', value: '<1s', subtext: 'First contentful paint' }
        ];

  const handleCtaClick = () => {
    const clean = ctaUrl.replace('#', '');
    onNavigate(clean);
  };

  return (
    <section id="about" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-white/[0.02] rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Glass Grid */}
      <div className="rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-10 md:p-14 bg-white border border-neutral-200/80 shadow-xs relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Heading & Core Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 mb-4 sm:mb-6 border border-neutral-200/80 shadow-2xs">
              <User className="w-3.5 h-3.5 text-neutral-700" />
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-700 font-medium">
                {badge}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 mb-4 sm:mb-6 uppercase font-sora">
              {heading}
            </h2>

            <p className="text-sm sm:text-lg text-neutral-800 leading-relaxed mb-4 sm:mb-6 font-normal font-inter">
              {introduction}
            </p>

            <p className="text-xs sm:text-base text-neutral-600 leading-relaxed mb-6 sm:mb-8 font-inter">
              {detailedDescription}
            </p>

            {/* Quick Core Capabilities Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
              {tags.map((pill, i) => (
                <span
                  key={i}
                  className="text-[11px] sm:text-xs font-inter font-medium text-neutral-700 bg-neutral-100 border border-neutral-200/80 px-2.5 sm:px-3 py-1 rounded-full shadow-2xs"
                >
                  {pill}
                </span>
              ))}
            </div>

            {/* Location Indicator */}
            <div className="flex items-center gap-2 mb-6 sm:mb-8 text-xs text-neutral-500 font-inter">
              <MapPin className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" />
              <span>Based in Delhi, India — partnering with clients across India &amp; worldwide.</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCtaClick}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-full transition-all duration-200 shadow-sm active:scale-95 cursor-pointer font-inter"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                href="https://www.instagram.com/imsharikhan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Sharik Khan on Instagram @imsharikhan"
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-inter font-medium text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-full border border-neutral-200 transition-all cursor-pointer group shadow-2xs"
              >
                <Instagram className="w-3.5 h-3.5 text-neutral-500 group-hover:text-pink-600 transition-colors" />
                <span>@imsharikhan</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-neutral-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>

          {/* Right Column: Editorial Metric Cards & Values */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4"
          >
            {metrics.map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-neutral-50/80 border border-neutral-200/80 flex flex-col justify-between shadow-2xs"
              >
                <span className="text-[10px] sm:text-xs font-inter font-medium text-neutral-500 uppercase tracking-wider">{m.label}</span>
                <div className="my-2 sm:my-4">
                  <span className="text-2xl sm:text-4xl font-bold text-neutral-950 tracking-tight font-sora">{m.value}</span>
                  <span className="text-[10px] sm:text-xs text-neutral-500 block mt-0.5 sm:mt-1 font-inter">{m.subtext}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}

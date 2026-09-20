import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { SiteSettings, SocialLink } from '../../types';

interface FooterProps {
  settings: SiteSettings;
  socials?: SocialLink[];
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export function Footer({ settings, socials, onNavigate, onOpenAdmin }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const defaultSocialLinks = [
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'LinkedIn', url: 'https://linkedin.com' },
    { label: 'GitHub', url: 'https://github.com' },
    { label: 'Behance', url: 'https://behance.net' }
  ];

  const activeSocials =
    socials && socials.length > 0
      ? socials.filter((s) => s.enabled)
      : defaultSocialLinks;

  const brandName = settings.name || 'SHARIK KHAN';
  const logoInitial = settings.logo_initial || 'S';
  const shortTitle = settings.short_title || 'UI/UX Designer • Web Developer • AI Automation';

  return (
    <footer className="border-t border-white/[0.08] bg-[#07080a] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        {/* Left: Brand Wordmark & Core Disciplines */}
        <div className="flex flex-col items-start space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-black">
              {logoInitial}
            </div>
            <span className="text-base font-extrabold tracking-tight text-white uppercase font-mono">
              {brandName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-neutral-400 font-medium">
            <span>{shortTitle}</span>
          </div>
        </div>

        {/* Center: Dynamic CMS Social Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-medium">
          {activeSocials.map((social) => (
            <a
              key={social.label || (social as any).id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1 group cursor-pointer"
            >
              <span>{social.label}</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-white transition-colors" />
            </a>
          ))}
        </div>

        {/* Right: Scroll to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors group cursor-pointer"
        >
          <span>Back to Top</span>
          <div className="w-8 h-8 rounded-full glass-pill flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
            <ArrowUp className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono gap-4">
        <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
        <span className="hidden sm:inline text-neutral-500">Editorial Liquid Glass Aesthetics</span>
      </div>
    </footer>
  );
}


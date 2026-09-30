import { ArrowUp, ArrowUpRight, Instagram } from 'lucide-react';
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

  const instagramDefault: SocialLink = {
    id: 'soc-instagram',
    platform: 'Instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/imsharikhan/',
    icon: 'instagram',
    enabled: true,
    display_order: 1
  };

  const filteredSocials = (socials || []).filter((s) => s.enabled);
  const hasInstagram = filteredSocials.some(
    (s) => s.url?.toLowerCase().includes('instagram.com/imsharikhan')
  );
  const activeSocials = hasInstagram
    ? filteredSocials
    : [instagramDefault, ...filteredSocials];

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
          {activeSocials.map((social) => {
            const isInstagram = social.url?.toLowerCase().includes('instagram.com');
            return (
              <a
                key={social.label || (social as any).id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit Sharik Khan on ${social.label || social.platform}`}
                className="hover:text-white transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                {isInstagram && (
                  <Instagram className="w-3.5 h-3.5 text-neutral-400 group-hover:text-pink-400 transition-colors" />
                )}
                <span>{social.label}</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-white transition-colors" />
              </a>
            );
          })}
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

      {/* Secondary Service & Internal Links Navigation */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="/services/web-development"
            onClick={(e) => { e.preventDefault(); onNavigate('services/web-development'); }}
            className="hover:text-white transition-colors"
          >
            Web Development Services
          </a>
          <a
            href="/services/ui-ux-design"
            onClick={(e) => { e.preventDefault(); onNavigate('services/ui-ux-design'); }}
            className="hover:text-white transition-colors"
          >
            UI/UX Design
          </a>
          <a
            href="/services/ai-solutions"
            onClick={(e) => { e.preventDefault(); onNavigate('services/ai-solutions'); }}
            className="hover:text-white transition-colors"
          >
            AI Solutions &amp; Automation
          </a>
          <a
            href="/store"
            onClick={(e) => { e.preventDefault(); onNavigate('store'); }}
            className="hover:text-white transition-colors text-amber-300/90 font-medium"
          >
            Service Store &amp; Pricing
          </a>
          <a
            href="#faq"
            onClick={(e) => { e.preventDefault(); onNavigate('faq'); }}
            className="hover:text-white transition-colors"
          >
            FAQ
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
            className="hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>
        <p className="text-[11px] font-mono text-neutral-400">
          Based in Delhi, India — working with clients across India &amp; worldwide.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 font-mono gap-4">
        <span>© {new Date().getFullYear()} SRK Works ({brandName}). All rights reserved.</span>
        <span className="text-neutral-400">Built with modern web standards, sub-second vitals &amp; accessible UX</span>
      </div>
    </footer>
  );
}


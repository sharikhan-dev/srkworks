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
    <footer className="border-t border-neutral-200 bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        {/* Left: Brand Wordmark & Core Disciplines */}
        <div className="flex flex-col items-start space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 flex items-center justify-center shrink-0 text-neutral-950">
              <svg className="w-5 h-5 fill-neutral-950" viewBox="0 0 24 24">
                <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
              </svg>
            </div>
            <span className="text-base font-bold tracking-[0.03em] text-neutral-950 font-sora">
              {brandName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-neutral-500 font-medium font-inter">
            <span>{shortTitle}</span>
          </div>
        </div>

        {/* Center: Dynamic CMS Social Links */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-600 font-medium font-inter">
          {activeSocials.map((social) => {
            const isInstagram = social.url?.toLowerCase().includes('instagram.com');
            return (
              <a
                key={social.label || (social as any).id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit Sharik Khan on ${social.label || social.platform}`}
                className="hover:text-neutral-950 transition-colors flex items-center gap-1.5 group cursor-pointer"
              >
                {isInstagram && (
                  <Instagram className="w-3.5 h-3.5 text-neutral-500 group-hover:text-pink-600 transition-colors" />
                )}
                <span>{social.label}</span>
                <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
              </a>
            );
          })}
        </div>

        {/* Right: Scroll to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs font-inter font-medium text-neutral-600 hover:text-neutral-950 transition-colors group cursor-pointer"
        >
          <span>Back to Top</span>
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200 group-hover:bg-neutral-950 group-hover:text-white transition-all">
            <ArrowUp className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Secondary Service & Internal Links Navigation */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500 font-inter">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a
            href="/services/web-development"
            onClick={(e) => { e.preventDefault(); onNavigate('services/web-development'); }}
            className="hover:text-neutral-950 transition-colors"
          >
            Web Development Services
          </a>
          <a
            href="/services/ui-ux-design"
            onClick={(e) => { e.preventDefault(); onNavigate('services/ui-ux-design'); }}
            className="hover:text-neutral-950 transition-colors"
          >
            UI/UX Design
          </a>
          <a
            href="/services/ai-solutions"
            onClick={(e) => { e.preventDefault(); onNavigate('services/ai-solutions'); }}
            className="hover:text-neutral-950 transition-colors"
          >
            AI Solutions &amp; Automation
          </a>
          <a
            href="/store"
            onClick={(e) => { e.preventDefault(); onNavigate('store'); }}
            className="hover:text-neutral-950 transition-colors font-medium text-blue-600"
          >
            Service Store &amp; Pricing
          </a>
          <a
            href="#faq"
            onClick={(e) => { e.preventDefault(); onNavigate('faq'); }}
            className="hover:text-neutral-950 transition-colors"
          >
            FAQ
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}
            className="hover:text-neutral-950 transition-colors"
          >
            Contact
          </a>
        </div>
        <p className="text-[11px] font-inter text-neutral-400">
          Based in Delhi, India — working with clients across India &amp; worldwide.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-inter gap-4">
        <span>© {new Date().getFullYear()} SRKWorks ({brandName}). All rights reserved.</span>
        <span className="text-neutral-400">Designed with minimal precision &amp; modern web engineering</span>
      </div>
    </footer>
  );
}


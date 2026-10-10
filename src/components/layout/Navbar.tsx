import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Instagram } from 'lucide-react';
import { NavbarSettings, SiteSettings } from '../../types';

interface NavbarProps {
  settings: SiteSettings;
  navbar?: NavbarSettings;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export function Navbar({ settings, navbar, activeSection, onNavigate, onOpenAdmin }: NavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);
  const logoTapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollYRef = useRef(0);

  // Smart Scroll: Smoothly hide on scroll down, reveal on scroll up
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    const scrollThreshold = 10; // Prevent flickering from tiny jitter

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const diff = currentScrollY - lastScrollY;

      // Always keep navbar visible at the very top of the page
      if (currentScrollY <= 25) {
        setIsVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // Avoid edge rubber-banding triggers
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (currentScrollY > maxScroll - 30) {
        return;
      }

      // Only toggle state when movement exceeds threshold
      if (Math.abs(diff) < scrollThreshold) {
        return;
      }

      if (diff > 0 && currentScrollY > 70) {
        // Scrolling DOWN -> Slide navbar up out of view
        setIsVisible(false);
      } else if (diff < 0) {
        // Scrolling UP -> Reveal navbar smoothly
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Brand name: Ensure SRKWorks is used and legacy 'Sharik khan' is replaced
  const rawBrand = navbar?.brand_name || settings.name || 'SRKWorks';
  const brandName = rawBrand.toLowerCase().includes('sharik') ? 'SRKWorks' : rawBrand;

  const rawCta = navbar?.cta_text || "Let's Connect ↗";
  const ctaText = rawCta.toLowerCase().includes('talk')
    ? "Let's Connect ↗"
    : (rawCta.includes('↗') ? rawCta : `${rawCta} ↗`);
  const ctaUrl = navbar?.cta_url || '#contact';

  const figmaNavItems = [
    { id: 'nav-home', label: 'Home', url: '#hero', enabled: true },
    { id: 'nav-about', label: 'About', url: '#about', enabled: true },
    { id: 'nav-works', label: 'Works', url: '#work', enabled: true },
    { id: 'nav-services', label: 'Service', url: '#services', enabled: true },
    { id: 'nav-testimonials', label: 'Testimonials', url: '#testimonials', enabled: true },
    { id: 'nav-contact', label: 'Contact Us', url: '#contact', enabled: true }
  ];

  // If saved navbar has old items like 'Clients' or 'Process', use the new Figma items
  const hasLegacyItems = navbar?.nav_items?.some((i) => i.label === 'Clients' || i.label === 'Process');
  const activeItems = (!navbar?.nav_items || navbar.nav_items.length === 0 || hasLegacyItems)
    ? figmaNavItems
    : navbar.nav_items.filter((i) => i.enabled);

  const handleItemClick = (target: string) => {
    const cleanId = target.replace(/^[#/]+/, '').toLowerCase();
    if (cleanId === 'admin' || target.toLowerCase().includes('admin')) {
      if (onOpenAdmin) {
        onOpenAdmin();
        setMobileMenuOpen(false);
      }
      return;
    }

    onNavigate(cleanId);
    setMobileMenuOpen(false);
  };

  // Secret 5-tap gesture on brand logo to open Admin console
  const handleBrandClick = () => {
    setLogoTapCount((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 5) {
        if (onOpenAdmin) onOpenAdmin();
        return 0;
      }
      return nextCount;
    });

    if (logoTapTimerRef.current) {
      clearTimeout(logoTapTimerRef.current);
    }
    logoTapTimerRef.current = setTimeout(() => {
      setLogoTapCount(0);
    }, 2500);

    handleItemClick('hero');
  };

  // Always keep visible when mobile drawer is open
  const isNavbarShown = isVisible || mobileMenuOpen;

  return (
    <>
      {/* Outer Navbar: Transparent canvas with smooth smart-scroll slide animation */}
      <header
        style={{
          transform: isNavbarShown ? 'translateY(0%)' : 'translateY(-125%)'
        }}
        className="fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] px-4 sm:px-8 py-3.5 sm:py-5 flex items-center justify-between bg-transparent pointer-events-none select-none"
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Left: SRKWorks Sparkle Wordmark */}
          <button
            id="nav-brand-logo"
            onClick={handleBrandClick}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0 text-neutral-900">
              <svg className="w-5 h-5 fill-neutral-900" viewBox="0 0 24 24">
                <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-sora text-sm sm:text-base font-bold tracking-[0.03em] text-neutral-900 leading-tight">
                {brandName}
              </span>
              <span className="font-inter text-[10px] sm:text-[11px] text-neutral-500 font-normal leading-tight tracking-[0.01em]">
                Digital Studio · By Sharikhan
              </span>
            </div>
          </button>

          {/* Center: Apple-Style Glassmorphism Navigation Pill (Desktop) */}
          <nav
            style={{
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)'
            }}
            className="hidden md:flex items-center bg-white/65 text-neutral-800 px-3 lg:px-4 py-1.5 rounded-full border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.85)] transition-all"
          >
            <div className="flex items-center gap-1 lg:gap-1.5">
              {activeItems.map((item) => {
                const cleanId = item.url.replace('#', '');
                const isActive = activeSection === cleanId || (cleanId === 'hero' && activeSection === 'hero');
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${cleanId}`}
                    onClick={() => handleItemClick(item.url)}
                    className={`relative px-3.5 lg:px-4 py-1.5 text-xs lg:text-[13px] font-inter transition-all duration-200 cursor-pointer rounded-full ${
                      isActive
                        ? 'text-neutral-950 font-semibold bg-white/90 shadow-xs border border-white/80'
                        : 'text-neutral-700 hover:text-neutral-950 font-medium hover:bg-black/[0.04]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Right: Solid Black CTA Pill */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              id="nav-cta-talk"
              onClick={() => handleItemClick(ctaUrl)}
              className="px-5 lg:px-6 py-2.5 text-xs sm:text-[13px] font-inter font-medium text-white bg-neutral-950 hover:bg-neutral-800 rounded-full transition-all duration-200 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {ctaText}
            </button>
          </div>

          {/* Mobile Right Controls: Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200/80 text-neutral-800 cursor-pointer shadow-2xs"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-2xl pt-24 px-6 pb-8 md:hidden overflow-y-auto"
          >
            <div className="min-h-full flex flex-col justify-between">
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase block pl-2 mb-2">
                  Menu
                </span>

                {activeItems.map((item) => {
                  const cleanId = item.url.replace('#', '');
                  const isActive = activeSection === cleanId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.url)}
                      className={`w-full text-left py-3 px-4 rounded-xl text-base font-inter font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'text-neutral-950 bg-neutral-100 border border-neutral-200'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400" />
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-neutral-200 mt-6 space-y-4">
                <button
                  onClick={() => handleItemClick(ctaUrl)}
                  className="w-full py-3.5 text-sm font-semibold text-white bg-neutral-950 rounded-full text-center shadow-sm cursor-pointer active:scale-98 transition-transform"
                >
                  {ctaText}
                </button>

                <div className="flex items-center justify-center pt-2">
                  <a
                    href="https://www.instagram.com/imsharikhan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Sharik Khan on Instagram @imsharikhan"
                    className="flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-neutral-900 transition-colors py-1.5 px-3 rounded-full bg-neutral-100 border border-neutral-200"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram: @imsharikhan</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

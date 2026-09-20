import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { NavbarSettings, SiteSettings } from '../../types';

interface NavbarProps {
  settings: SiteSettings;
  navbar?: NavbarSettings;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export function Navbar({ settings, navbar, activeSection, onNavigate, onOpenAdmin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);
  const logoTapTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
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

  // Fallback defaults if navbar prop is not populated
  const brandName = navbar?.brand_name || settings.name || 'SHARIK KHAN';
  const logoInitial = navbar?.logo_initial || settings.logo_initial || 'S';
  const ctaText = navbar?.cta_text || "Let's Talk";
  const ctaUrl = navbar?.cta_url || '#contact';

  const defaultNavItems = [
    { id: 'work', label: 'Work', url: '#work', enabled: true },
    { id: 'services', label: 'Services', url: '#services', enabled: true },
    { id: 'clients', label: 'Clients', url: '#clients', enabled: true },
    { id: 'about', label: 'About', url: '#about', enabled: true },
    { id: 'process', label: 'Process', url: '#process', enabled: true },
    { id: 'contact', label: 'Contact', url: '#contact', enabled: true }
  ];

  const activeItems = navbar?.nav_items && navbar.nav_items.length > 0
    ? navbar.nav_items.filter((i) => i.enabled)
    : defaultNavItems;

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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 sm:py-4 px-4 sm:px-6 md:px-8 flex justify-center ${
          isScrolled ? 'backdrop-blur-md bg-black/20' : 'bg-transparent'
        }`}
      >
        <nav
          className={`w-full max-w-5xl rounded-full transition-all duration-300 flex items-center justify-between px-3.5 sm:px-5 py-2 sm:py-2.5 ${
            isScrolled
              ? 'glass-surface shadow-2xl border border-white/10'
              : 'glass-surface border border-white/[0.08]'
          }`}
        >
          {/* Left: Personal Wordmark & Logo Initial (Tap 5x secretly opens Admin) */}
          <button
            id="nav-brand-logo"
            onClick={handleBrandClick}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-white/30 via-white/80 to-white flex items-center justify-center p-[1px] shadow-sm overflow-hidden shrink-0">
              <div className="w-full h-full rounded-full bg-[#090a0d] flex items-center justify-center overflow-hidden">
                <img
                  src="/favicon.png"
                  alt={brandName}
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-[10px] font-black tracking-tighter text-white uppercase">
                  {logoInitial}
                </span>
              </div>
            </div>
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-white/80 transition-colors uppercase">
              <span className="hidden sm:inline">{brandName}</span>
              <span className="sm:hidden">{brandName.split(' ')[0] || brandName}</span>
            </span>
          </button>

          {/* Center/Right Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.02] p-1 rounded-full border border-white/[0.05]">
            {activeItems.map((item) => {
              const cleanId = item.url.replace('#', '');
              const isActive = activeSection === cleanId;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${cleanId}`}
                  onClick={() => handleItemClick(item.url)}
                  className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                    isActive ? 'text-white font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/15"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="nav-cta-talk"
              onClick={() => handleItemClick(ctaUrl)}
              className="group flex items-center gap-2 px-5 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.35)] active:scale-95 cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Right Controls: Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </nav>
      </header>

      {/* Mobile Fullscreen Glass Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[#090a0d]/95 backdrop-blur-3xl pt-20 px-6 pb-8 md:hidden overflow-y-auto"
          >
            <div className="min-h-full flex flex-col justify-between">
              <div className="space-y-3 pt-4">
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block pl-2">
                  Navigation
                </span>

                {activeItems.map((item) => {
                  const cleanId = item.url.replace('#', '');
                  const isActive = activeSection === cleanId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.url)}
                      className={`w-full text-left py-3 px-4 rounded-2xl text-lg sm:text-xl font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'text-white bg-white/10 border border-white/15'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-4 h-4 text-neutral-500" />
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <button
                  onClick={() => handleItemClick(ctaUrl)}
                  className="w-full py-3.5 text-sm font-bold text-black bg-white rounded-2xl text-center shadow-lg cursor-pointer active:scale-98 transition-transform"
                >
                  {ctaText}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';
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
      } else {
        onNavigate('admin');
      }
    } else {
      onNavigate(target.replace('#', ''));
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3.5 sm:pt-5 transition-all duration-500 pointer-events-none">
        <nav
          id="main-nav"
          className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl rounded-full px-4 sm:px-6 transition-all duration-500 ${
            isScrolled
              ? 'py-2.5 bg-[#0a0c10]/80 backdrop-blur-2xl border border-white/12 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.8)]'
              : 'py-3.5 bg-white/[0.03] backdrop-blur-xl border border-white/[0.07]'
          }`}
        >
          {/* Left: Personal Wordmark & Logo Initial */}
          <button
            id="nav-brand-logo"
            onClick={() => handleItemClick('hero')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-white/20 via-white/80 to-white flex items-center justify-center p-[1px] shadow-sm">
              <div className="w-full h-full rounded-full bg-[#090a0d] flex items-center justify-center text-[10px] font-black tracking-tighter text-white uppercase">
                {logoInitial}
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

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/[0.05] border border-white/10 text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
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

              <div className="space-y-3 pt-6 border-t border-white/10 mt-6">
                <button
                  onClick={() => handleItemClick(ctaUrl)}
                  className="w-full py-3.5 text-sm font-bold text-black bg-white rounded-2xl text-center shadow-lg cursor-pointer active:scale-98 transition-transform"
                >
                  {ctaText}
                </button>

                {/* Direct Admin Console Access on Mobile */}
                <button
                  onClick={() => handleItemClick('#admin')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/5 flex items-center justify-between border border-white/5 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Admin CMS Portal</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}

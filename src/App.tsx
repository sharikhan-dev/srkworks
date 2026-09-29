import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { WorkShowcase } from './components/sections/WorkShowcase';
import { ServicesSection } from './components/sections/ServicesSection';
import { AutomationShowcase } from './components/sections/AutomationShowcase';
import { ProcessSection } from './components/sections/ProcessSection';
import { AboutSection } from './components/sections/AboutSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { FAQSection } from './components/sections/FAQSection';
import { ContactSection } from './components/sections/ContactSection';
import { ServiceDetailPage } from './components/pages/ServiceDetailPage';
import { ProjectDetailPage } from './components/pages/ProjectDetailPage';
import { ServicesStorePage } from './components/pages/ServicesStorePage';
import { ServiceStoreSection } from './components/sections/ServiceStoreSection';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuth } from './components/admin/AdminAuth';
import {
  Project,
  Service,
  Skill,
  Experience,
  Testimonial,
  SiteSettings,
  ThemeSettings,
  HeroSettings,
  NavbarSettings,
  AboutSettings,
  SectionVisibility,
  SocialLink
} from './types';
import { db, initializeLocalStorageIfNeeded } from './services/db';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_THEME_SETTINGS,
  INITIAL_HERO_SETTINGS,
  INITIAL_NAVBAR_SETTINGS,
  INITIAL_ABOUT_SETTINGS,
  INITIAL_SECTION_VISIBILITY
} from './services/seedData';

export type CurrentRoute =
  | { type: 'home' }
  | { type: 'store' }
  | { type: 'service'; slug: string }
  | { type: 'project'; slug: string }
  | { type: '404' };

function parseRoute(pathname: string, hash: string): { route: CurrentRoute; isAdmin: boolean } {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  const cleanHash = hash.toLowerCase();

  const isAdmin =
    cleanPath.includes('/admin') ||
    cleanHash.includes('admin') ||
    window.location.search.toLowerCase().includes('admin');

  if (isAdmin) {
    return { route: { type: 'home' }, isAdmin: true };
  }

  if (cleanPath === '/' || cleanPath === '') {
    return { route: { type: 'home' }, isAdmin: false };
  }

  if (cleanPath === '/store' || cleanPath === '/pricing' || cleanPath === '/services') {
    return { route: { type: 'store' }, isAdmin: false };
  }

  if (cleanPath.startsWith('/services/')) {
    const slug = cleanPath.replace('/services/', '').trim();
    if (slug === 'web-development' || slug === 'ui-ux-design' || slug === 'ai-solutions') {
      return { route: { type: 'service', slug }, isAdmin: false };
    }
    if (slug === 'ai-automation' || slug === 'ai-powered-products') {
      return { route: { type: 'service', slug: 'ai-solutions' }, isAdmin: false };
    }
    return { route: { type: '404' }, isAdmin: false };
  }

  if (cleanPath.startsWith('/projects/')) {
    const slug = cleanPath.replace('/projects/', '').trim();
    if (slug) {
      return { route: { type: 'project', slug }, isAdmin: false };
    }
    return { route: { type: '404' }, isAdmin: false };
  }

  return { route: { type: '404' }, isAdmin: false };
}

export default function App() {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [theme, setTheme] = useState<ThemeSettings>(INITIAL_THEME_SETTINGS);
  const [hero, setHero] = useState<HeroSettings>(INITIAL_HERO_SETTINGS);
  const [navbar, setNavbar] = useState<NavbarSettings>(INITIAL_NAVBAR_SETTINGS);
  const [about, setAbout] = useState<AboutSettings>(INITIAL_ABOUT_SETTINGS);
  const [sections, setSections] = useState<SectionVisibility>(INITIAL_SECTION_VISIBILITY);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentRoute, setCurrentRoute] = useState<CurrentRoute>(() => {
    const { route } = parseRoute(window.location.pathname || '', window.location.hash || '');
    return route;
  });

  const handleSelectServiceOrder = (service: Service) => {
    setSelectedServiceForOrder(service.title);
    handleNavigate('contact');
  };

  // Initialize DB and load public content
  const loadData = async () => {
    initializeLocalStorageIfNeeded();
    try {
      const [
        setData,
        themeData,
        heroData,
        navData,
        aboutData,
        secData,
        socData,
        projData,
        servData,
        skData,
        testData,
        expData
      ] = await Promise.all([
        db.getSiteSettings(),
        db.getThemeSettings(),
        db.getHeroSettings(),
        db.getNavbarSettings(),
        db.getAboutSettings(),
        db.getSectionVisibility(),
        db.getSocialLinks(),
        db.getProjects(true), // public only
        db.getServices(true), // active only
        db.getSkills(),
        db.getTestimonials(true),
        db.getExperience()
      ]);

      setSettings(setData);
      setTheme(themeData);
      setHero(heroData);
      setNavbar(navData);
      setAbout(aboutData);
      setSections(secData);
      setSocials(socData);
      setProjects(projData);
      setServices(servData);
      setSkills(skData);
      setTestimonials(testData);
      setExperience(expData);

      // Check current auth status
      const auth = db.getAuthSession();
      if (auth?.isAdmin) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error initializing app data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Check if URL specifies admin route or subpage route
    const checkRoute = () => {
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';
      const { route, isAdmin } = parseRoute(path, hash);
      setIsAdminOpen(isAdmin);
      if (!isAdmin) {
        setCurrentRoute(route);
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);

    // Global keyboard shortcut to toggle admin: Ctrl + Shift + A or Alt + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') ||
        (e.altKey && e.key.toLowerCase() === 'a')
      ) {
        e.preventDefault();
        setIsAdminOpen((prev) => {
          if (!prev) {
            window.location.hash = 'admin';
            return true;
          } else {
            handleCloseAdmin();
            return false;
          }
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Dynamically apply Theme CSS Variables to root element
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;

    root.style.setProperty('--primary', theme.primary_color);
    root.style.setProperty('--secondary', theme.secondary_color);
    root.style.setProperty('--accent', theme.accent_color);
    root.style.setProperty('--background', theme.background_color);
    root.style.setProperty('--surface', theme.surface_color);
    root.style.setProperty('--text', theme.text_color);
    root.style.setProperty('--muted', theme.secondary_text_color);
    root.style.setProperty('--border', theme.border_color);
    root.style.setProperty(
      '--font-heading',
      `'${theme.heading_font}', -apple-system, BlinkMacSystemFont, sans-serif`
    );
    root.style.setProperty(
      '--font-body',
      `'${theme.body_font}', -apple-system, BlinkMacSystemFont, sans-serif`
    );
  }, [theme]);

  // Update document title, favicon, and SEO metadata dynamically from site settings when on homepage
  useEffect(() => {
    if (currentRoute.type !== 'home') return;

    const defaultTitle = 'SRK Works | Web Development, UI/UX Design & AI Solutions';
    const defaultDesc =
      'SRK Works builds modern websites, UI/UX designs and AI-powered digital solutions for businesses, creators and startups.';

    document.title = settings.seo_title || defaultTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', settings.seo_description || defaultDesc);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://srkworks.vercel.app/');

    const robots = document.querySelector('meta[name="robots"]');
    if (robots) {
      robots.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // OG Title & Desc
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', settings.social_title || settings.seo_title || defaultTitle);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', settings.social_description || settings.seo_description || defaultDesc);
    }

    // Favicon
    if (settings.favicon_url) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }, [settings, currentRoute]);

  // Track active section via IntersectionObserver on homepage
  useEffect(() => {
    if (currentRoute.type !== 'home') return;
    const sectionIds = ['hero', 'services', 'pricing', 'work', 'clients', 'about', 'process', 'faq', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id);
              }
            });
          },
          { threshold: 0.25 }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [loading, currentRoute]);

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminOpen(true);
  };

  const handleNavigate = (target: string) => {
    let clean = target.replace(/^[#/]+/, '').trim();

    if (clean.toLowerCase() === 'admin') {
      handleOpenAdmin();
      return;
    }

    if (clean === '' || clean === 'home' || clean === 'hero') {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
      setCurrentRoute({ type: 'home' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (clean === 'store' || clean === 'packages' || clean === 'services-store') {
      window.history.pushState(null, '', '/store');
      setCurrentRoute({ type: 'store' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (clean.startsWith('services/')) {
      const slug = clean.replace('services/', '');
      window.history.pushState(null, '', `/services/${slug}`);
      setCurrentRoute({ type: 'service', slug });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (clean.startsWith('projects/')) {
      const slug = clean.replace('projects/', '');
      window.history.pushState(null, '', `/projects/${slug}`);
      setCurrentRoute({ type: 'project', slug });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (clean === 'reviews' || clean === 'testimonials') {
      clean = 'clients';
    }

    // Anchor on homepage
    if (currentRoute.type !== 'home') {
      window.history.pushState(null, '', `/#${clean}`);
      setCurrentRoute({ type: 'home' });
      setTimeout(() => {
        const el = document.getElementById(clean);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.history.replaceState(null, '', `/#${clean}`);
      const el = document.getElementById(clean);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash.toLowerCase().includes('admin')) {
      window.history.replaceState(null, '', window.location.pathname || '/');
    }
    if (window.location.pathname.toLowerCase().includes('/admin')) {
      window.history.replaceState(null, '', '/');
      setCurrentRoute({ type: 'home' });
    }
    loadData();
  };

  const handleSignOut = async () => {
    await db.signOut();
    setIsAuthenticated(false);
    handleCloseAdmin();
  };

  if (isAdminOpen) {
    return isAuthenticated ? (
      <AdminDashboard
        onClose={handleCloseAdmin}
        onSignOut={handleSignOut}
      />
    ) : (
      <AdminAuth
        onSuccess={() => setIsAuthenticated(true)}
        onCancel={handleCloseAdmin}
      />
    );
  }

  return (
    <div
      className="min-h-screen font-sans selection:bg-white/20 selection:text-white relative transition-colors duration-500 overflow-x-hidden"
      style={{
        backgroundColor: theme?.background_color || 'var(--background)',
        color: theme?.text_color || 'var(--text)'
      }}
    >
      {/* Floating Glass Navigation */}
      <Navbar
        settings={settings}
        navbar={navbar}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Dedicated Service Detail Page */}
      {currentRoute.type === 'service' && (
        <ServiceDetailPage
          slug={currentRoute.slug}
          projects={projects}
          settings={settings}
          onNavigate={handleNavigate}
        />
      )}

      {/* Dedicated Project / Case Study Detail Page */}
      {currentRoute.type === 'project' && (
        <ProjectDetailPage
          slug={currentRoute.slug}
          projects={projects}
          settings={settings}
          onNavigate={handleNavigate}
        />
      )}

      {/* Dedicated Services Store & Selling Page */}
      {currentRoute.type === 'store' && (
        <ServicesStorePage
          services={services}
          settings={settings}
          onNavigate={handleNavigate}
          onSelectServiceOrder={handleSelectServiceOrder}
        />
      )}

      {/* Custom 404 Page */}
      {currentRoute.type === '404' && (
        <NotFoundPage
          settings={settings}
          onNavigate={handleNavigate}
        />
      )}

      {/* Main Single-Page Continuous Narrative Flow */}
      {currentRoute.type === 'home' && (
        <main className="relative">
          {/* Hero Section */}
          {sections.hero && (
            <Hero
              settings={settings}
              hero={hero}
              onNavigate={handleNavigate}
            />
          )}

          {/* Dynamic Services Section: WHAT I BUILD */}
          {sections.services && (
            <ServicesSection
              services={services}
              onNavigate={handleNavigate}
              onSelectServiceCTA={() => handleNavigate('contact')}
            />
          )}

          {/* eCommerce Pricing & Fixed-Scope Packages Store Section */}
          {sections.services && (
            <ServiceStoreSection
              services={services}
              onNavigate={handleNavigate}
              onSelectServiceOrder={handleSelectServiceOrder}
            />
          )}

          {/* Selected Work Showcase: EDITORIAL CASE STUDIES */}
          {sections.projects && (
            <WorkShowcase
              projects={projects}
              onNavigate={handleNavigate}
            />
          )}

          {/* About, Stack & Capabilities: DESIGN × CODE × AI */}
          {sections.about && (
            <AboutSection
              settings={settings}
              about={about}
              skills={skills}
              experience={experience}
              onNavigate={handleNavigate}
            />
          )}

          {/* 4-Step Process Section: HOW I WORK */}
          {sections.process && (
            <ProcessSection />
          )}

          {/* AI Automation Interactive Workflow Simulator */}
          {sections.automation && (
            <AutomationShowcase />
          )}

          {/* Client Testimonials & Work */}
          {sections.testimonials && (
            <TestimonialsSection
              testimonials={testimonials}
              onNavigateContact={() => handleNavigate('contact')}
            />
          )}

          {/* FAQ Section */}
          {(sections.faq ?? true) && (
            <FAQSection
              onNavigateContact={() => handleNavigate('contact')}
            />
          )}

          {/* Contact: LET'S BUILD SOMETHING USEFUL */}
          {sections.contact && (
            <ContactSection
              settings={settings}
              preselectedService={selectedServiceForOrder}
            />
          )}
        </main>
      )}

      {/* Footer */}
      {sections.footer && (
        <Footer
          settings={settings}
          socials={socials}
          onNavigate={handleNavigate}
          onOpenAdmin={handleOpenAdmin}
        />
      )}
    </div>
  );
}

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
import { ContactSection } from './components/sections/ContactSection';
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
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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
        testData
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
        db.getTestimonials(true)
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

    // Check if URL specifies admin route (e.g. /#admin, /admin, or ?admin=true)
    const checkRoute = () => {
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      const search = (window.location.search || '').toLowerCase();
      const isPathAdmin =
        path.includes('/admin') ||
        hash.includes('admin') ||
        search.includes('admin');
      setIsAdminOpen(isPathAdmin);
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

  // Update document title, favicon, and SEO metadata dynamically from site settings
  useEffect(() => {
    if (settings.seo_title) {
      document.title = settings.seo_title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && settings.seo_description) {
      metaDesc.setAttribute('content', settings.seo_description);
    }

    // OG Title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', settings.social_title || settings.seo_title);
    }

    // OG Description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', settings.social_description || settings.seo_description);
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
  }, [settings]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ['hero', 'services', 'work', 'clients', 'about', 'process', 'contact'];
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
  }, [loading]);

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setIsAdminOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    let cleanId = sectionId.replace(/^[#/]+/, '').toLowerCase();
    if (cleanId === 'admin') {
      handleOpenAdmin();
      return;
    }
    if (cleanId === 'reviews' || cleanId === 'testimonials') {
      cleanId = 'clients';
    }
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash.toLowerCase().includes('admin')) {
      window.history.replaceState(null, '', window.location.pathname || '/');
    }
    if (window.location.pathname.toLowerCase().includes('/admin')) {
      window.history.replaceState(null, '', '/');
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

      {/* Main Single-Page Continuous Narrative Flow */}
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
            onSelectServiceCTA={() => handleNavigate('contact')}
          />
        )}

        {/* Selected Work Showcase: EDITORIAL CASE STUDIES */}
        {sections.projects && (
          <WorkShowcase
            projects={projects}
          />
        )}

        {/* About, Stack & Capabilities: DESIGN × CODE × AI */}
        {sections.about && (
          <AboutSection
            settings={settings}
            about={about}
            skills={skills}
            experience={[
              {
                id: 'exp-1',
                title: 'Principal Digital Product Designer & AI Engineer',
                role: 'Lead Creator',
                company: 'SHARIK',
                period: '2023 — Present',
                description: 'Designing and deploying production web applications and autonomous AI systems.',
                technologies: ['React', 'TypeScript', 'Figma', 'Supabase', 'Gemini API'],
                display_order: 1
              },
              {
                id: 'exp-2',
                title: 'Senior Product Designer & UI Engineer',
                role: 'Senior Designer',
                company: 'Vanguard Interactive',
                period: '2021 — 2023',
                description: 'Spearheaded design system unification across 4 web platforms.',
                technologies: ['Design Systems', 'React', 'Tailwind CSS', 'Storybook'],
                display_order: 2
              }
            ]}
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

        {/* Contact: LET'S BUILD SOMETHING USEFUL */}
        {sections.contact && (
          <ContactSection
            settings={settings}
          />
        )}
      </main>

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

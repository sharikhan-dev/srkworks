import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Mail,
  Sliders,
  LogOut,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
  TrendingUp,
  Clock,
  Database,
  Eye,
  X,
  ChevronRight,
  Palette,
  Navigation,
  User,
  Share2,
  Plus
} from 'lucide-react';
import {
  Project,
  Service,
  SiteSettings,
  ContactMessage,
  ThemeSettings,
  HeroSettings,
  NavbarSettings,
  AboutSettings,
  SectionVisibility,
  SocialLink
} from '../../types';
import { db } from '../../services/db';
import { ProjectsManager } from './ProjectsManager';
import { ServicesManager } from './ServicesManager';
import { MessagesManager } from './MessagesManager';
import { SettingsManager } from './SettingsManager';
import { ThemeManager } from './ThemeManager';
import { HeroManager } from './HeroManager';
import { NavbarManager } from './NavbarManager';
import { AboutManager } from './AboutManager';
import { SectionsManager } from './SectionsManager';
import { SocialLinksManager } from './SocialLinksManager';

interface AdminDashboardProps {
  onClose: () => void;
  onSignOut: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'settings'
  | 'theme'
  | 'hero'
  | 'navbar'
  | 'services'
  | 'projects'
  | 'about'
  | 'socials'
  | 'sections'
  | 'messages';

export function AdminDashboard({ onClose, onSignOut }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [hero, setHero] = useState<HeroSettings | null>(null);
  const [navbar, setNavbar] = useState<NavbarSettings | null>(null);
  const [about, setAbout] = useState<AboutSettings | null>(null);
  const [sections, setSections] = useState<SectionVisibility | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        projData,
        servData,
        setData,
        msgData,
        themeData,
        heroData,
        navData,
        aboutData,
        secData,
        socData
      ] = await Promise.all([
        db.getProjects(false),
        db.getServices(false),
        db.getSiteSettings(),
        db.getContactMessages(),
        db.getThemeSettings(),
        db.getHeroSettings(),
        db.getNavbarSettings(),
        db.getAboutSettings(),
        db.getSectionVisibility(),
        db.getSocialLinks()
      ]);
      setProjects(projData);
      setServices(servData);
      setSettings(setData);
      setMessages(msgData);
      setTheme(themeData);
      setHero(heroData);
      setNavbar(navData);
      setAbout(aboutData);
      setSections(secData);
      setSocials(socData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const newMessagesCount = messages.filter((m) => m.status === 'new').length;
  const publishedProjectsCount = projects.filter((p) => p.published).length;
  const activeServicesCount = services.filter((s) => s.enabled).length;

  const navTabs = [
    { id: 'dashboard' as AdminTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'settings' as AdminTab, label: 'Website Settings', icon: Sliders },
    { id: 'theme' as AdminTab, label: 'Theme & Colors', icon: Palette },
    { id: 'hero' as AdminTab, label: 'Hero Section', icon: Sparkles },
    { id: 'navbar' as AdminTab, label: 'Navbar CMS', icon: Navigation },
    { id: 'projects' as AdminTab, label: 'Projects', icon: FolderGit2, count: projects.length },
    { id: 'services' as AdminTab, label: 'Services', icon: Cpu, count: services.length },
    { id: 'about' as AdminTab, label: 'About Section', icon: User },
    { id: 'socials' as AdminTab, label: 'Social Links', icon: Share2, count: socials.length },
    { id: 'sections' as AdminTab, label: 'Sections Visibility', icon: Layers },
    { id: 'messages' as AdminTab, label: 'Inquiries', icon: Mail, count: newMessagesCount, alert: newMessagesCount > 0 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col md:flex-row bg-[#08090d] text-[#e6e7eb] font-sans antialiased overflow-hidden">
      {/* MOBILE TOP BAR (Screens < 768px) */}
      <header className="md:hidden flex-shrink-0 bg-[#0d0e14]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black font-black text-[11px]">
            {settings?.logo_initial || 'S'}
          </div>
          <div>
            <span className="text-xs font-bold text-white block leading-tight">{settings?.name || 'Sharik Khan'}</span>
            <span className="text-[10px] font-mono text-neutral-400">Admin Console</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white border border-white/10 transition-colors cursor-pointer"
          >
            <span>Live Site</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          <button
            onClick={onSignOut}
            title="Sign Out"
            className="p-2 rounded-full text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MOBILE HORIZONTAL TABS (Screens < 768px) */}
      <nav className="md:hidden flex-shrink-0 bg-[#0a0b10] border-b border-white/[0.08] px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 z-10">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? 'bg-black/20 text-black'
                      : tab.alert
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* DESKTOP SIDEBAR (Screens >= 768px) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a0b10] border-r border-white/10 flex-shrink-0 select-none">
        {/* Brand header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-black font-black text-xs shadow-md">
              {settings?.logo_initial || 'S'}
            </div>
            <div>
              <span className="text-sm font-bold text-white block leading-tight tracking-tight">
                {settings?.name || 'SHARIK KHAN'}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 tracking-wider uppercase">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tab Links */}
        <div className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                  <span>{tab.label}</span>
                </div>

                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isActive
                        ? 'bg-black/15 text-black'
                        : tab.alert
                        ? 'bg-red-500/20 text-red-400 font-bold animate-pulse'
                        : 'bg-white/10 text-neutral-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-neutral-400" />
              <span>Preview Live Site</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
          </button>

          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-[#08090d]/80 backdrop-blur-md border-b border-white/[0.08] sticky top-0 z-30">
          <div>
            <h1 className="text-sm font-bold text-white capitalize font-mono tracking-wider">
              {navTabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Supabase Connected
            </span>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>View Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-8 flex-1">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-xs font-mono text-neutral-400">
              Loading CMS data...
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 max-w-5xl">
                  {/* Status Headline */}
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      Welcome back, {settings?.name?.split(' ')[0] || 'Sharik'}
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">
                      Here is an overview of your CMS portfolio status, active theme, and quick action shortcuts.
                    </p>
                  </div>

                  {/* 4 Overview Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-1">
                      <span className="text-xs font-mono uppercase text-neutral-400">Website Status</span>
                      <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-2">
                        <span>Live</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[11px] text-neutral-500 block">CMS Powered</span>
                    </div>

                    <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-1">
                      <span className="text-xs font-mono uppercase text-neutral-400">Published Projects</span>
                      <div className="text-2xl font-extrabold text-white">
                        {publishedProjectsCount}
                      </div>
                      <span className="text-[11px] text-neutral-500 block">External Case Studies</span>
                    </div>

                    <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-1">
                      <span className="text-xs font-mono uppercase text-neutral-400">Active Services</span>
                      <div className="text-2xl font-extrabold text-white">
                        {activeServicesCount}
                      </div>
                      <span className="text-[11px] text-neutral-500 block">Rupee (₹) Pricing</span>
                    </div>

                    <div className="p-5 rounded-2xl glass-surface border border-white/10 space-y-1">
                      <span className="text-xs font-mono uppercase text-neutral-400">Active Theme</span>
                      <div className="text-2xl font-extrabold text-cyan-400 capitalize truncate">
                        {theme?.preset || 'Default'}
                      </div>
                      <span className="text-[11px] text-neutral-500 block">{theme?.heading_font}</span>
                    </div>
                  </div>

                  {/* Quick Actions Card */}
                  <div className="p-6 rounded-2xl glass-surface border border-white/10 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Quick Action Shortcuts
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      <button
                        onClick={() => setActiveTab('projects')}
                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 flex flex-col items-start gap-2 transition-all cursor-pointer group"
                      >
                        <div className="p-2 rounded-lg bg-white/10 text-white group-hover:scale-105 transition-transform">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-white">Add Project</span>
                        <span className="text-[10px] text-neutral-400">External case-study</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('services')}
                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 flex flex-col items-start gap-2 transition-all cursor-pointer group"
                      >
                        <div className="p-2 rounded-lg bg-white/10 text-white group-hover:scale-105 transition-transform">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-white">Add Service</span>
                        <span className="text-[10px] text-neutral-400">Manage offerings</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('theme')}
                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 flex flex-col items-start gap-2 transition-all cursor-pointer group"
                      >
                        <div className="p-2 rounded-lg bg-white/10 text-white group-hover:scale-105 transition-transform">
                          <Palette className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-white">Edit Theme</span>
                        <span className="text-[10px] text-neutral-400">Colors & fonts</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('hero')}
                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 flex flex-col items-start gap-2 transition-all cursor-pointer group"
                      >
                        <div className="p-2 rounded-lg bg-white/10 text-white group-hover:scale-105 transition-transform">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-white">Edit Hero</span>
                        <span className="text-[10px] text-neutral-400">Rotating phrases</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('settings')}
                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 flex flex-col items-start gap-2 transition-all cursor-pointer group"
                      >
                        <div className="p-2 rounded-lg bg-white/10 text-white group-hover:scale-105 transition-transform">
                          <Sliders className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-white">Website Settings</span>
                        <span className="text-[10px] text-neutral-400">SEO & branding</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: WEBSITE SETTINGS */}
              {activeTab === 'settings' && settings && (
                <SettingsManager
                  settings={settings}
                  onRefresh={loadAllData}
                />
              )}

              {/* TAB 3: THEME & COLOR CUSTOMIZER */}
              {activeTab === 'theme' && theme && (
                <ThemeManager
                  theme={theme}
                  onRefresh={loadAllData}
                />
              )}

              {/* TAB 4: HERO SECTION CMS */}
              {activeTab === 'hero' && hero && (
                <HeroManager
                  hero={hero}
                  onRefresh={loadAllData}
                />
              )}

              {/* TAB 5: NAVBAR CMS */}
              {activeTab === 'navbar' && navbar && (
                <NavbarManager
                  navbar={navbar}
                  onRefresh={loadAllData}
                />
              )}

              {/* TAB 6: PROJECTS */}
              {activeTab === 'projects' && (
                <ProjectsManager
                  projects={projects}
                  onRefresh={loadAllData}
                />
              )}

              {/* TAB 7: SERVICES */}
              {activeTab === 'services' && (
                <ServicesManager
                  services={services}
                  onRefresh={loadAllData}
                />
              )}

              {/* TAB 8: ABOUT CMS */}
              {activeTab === 'about' && about && (
                <AboutManager
                  about={about}
                  onRefresh={loadAllData}
                />
              )}

              {/* TAB 9: SOCIAL LINKS */}
              {activeTab === 'socials' && (
                <SocialLinksManager
                  socials={socials}
                  onRefresh={loadAllData}
                />
              )}

              {/* TAB 10: SECTIONS VISIBILITY */}
              {activeTab === 'sections' && sections && (
                <SectionsManager
                  visibility={sections}
                  onRefresh={loadAllData}
                />
              )}

              {/* TAB 11: INQUIRIES & MESSAGES */}
              {activeTab === 'messages' && (
                <MessagesManager />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

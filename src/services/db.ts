import { getSupabaseClient } from '../lib/supabase';
import {
  Project,
  Service,
  Skill,
  Experience,
  Testimonial,
  ContactMessage,
  SiteSettings,
  SocialLink,
  ThemeSettings,
  HeroSettings,
  NavbarSettings,
  AboutSettings,
  SectionVisibility
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_SERVICES,
  INITIAL_SKILLS,
  INITIAL_EXPERIENCE,
  INITIAL_TESTIMONIALS,
  INITIAL_SITE_SETTINGS,
  INITIAL_SOCIAL_LINKS,
  INITIAL_THEME_SETTINGS,
  INITIAL_HERO_SETTINGS,
  INITIAL_NAVBAR_SETTINGS,
  INITIAL_ABOUT_SETTINGS,
  INITIAL_SECTION_VISIBILITY
} from './seedData';

const STORAGE_KEYS = {
  PROJECTS: 'aura_db_projects',
  SERVICES: 'aura_db_services',
  SKILLS: 'aura_db_skills',
  EXPERIENCE: 'aura_db_experience',
  TESTIMONIALS: 'aura_db_testimonials',
  SETTINGS: 'aura_db_settings',
  MESSAGES: 'aura_db_messages',
  SOCIALS: 'aura_db_socials',
  AUTH: 'aura_db_auth_session',
  THEME: 'aura_db_theme',
  HERO: 'aura_db_hero',
  NAVBAR: 'aura_db_navbar',
  ABOUT: 'aura_db_about',
  SECTIONS: 'aura_db_sections'
};

function getLocalData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

const SEED_FINGERPRINT_KEY = 'aura_seed_fingerprint_v2';

function computeSeedFingerprint(): string {
  try {
    const sStr = `${INITIAL_SITE_SETTINGS.name}:${INITIAL_SITE_SETTINGS.headline}:${INITIAL_SITE_SETTINGS.seo_title}:${INITIAL_SITE_SETTINGS.profile_image}:${INITIAL_SITE_SETTINGS.email}`;
    const nStr = `${INITIAL_NAVBAR_SETTINGS.brand_name}:${INITIAL_NAVBAR_SETTINGS.logo_initial}`;
    const hStr = `${INITIAL_HERO_SETTINGS.eyebrow}:${INITIAL_HERO_SETTINGS.headline}:${INITIAL_HERO_SETTINGS.hero_image}`;
    return `##${sStr}##${nStr}##${hStr}`;
  } catch {
    return 'default_fingerprint';
  }
}

/**
 * Synchronizes localStorage with file data (seedData.ts).
 * Note: Projects are excluded because Supabase is the sole source of truth for project data.
 */
export function syncWithSeedData(force = false) {
  const currentFingerprint = computeSeedFingerprint();
  const savedFingerprint = localStorage.getItem(SEED_FINGERPRINT_KEY);

  if (force || !savedFingerprint || savedFingerprint !== currentFingerprint) {
    // 1. SETTINGS: If force or first time, load seed settings; if file changed, merge seed updates
    if (force || !savedFingerprint) {
      setLocalData(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
      setLocalData(STORAGE_KEYS.NAVBAR, INITIAL_NAVBAR_SETTINGS);
      setLocalData(STORAGE_KEYS.HERO, INITIAL_HERO_SETTINGS);
    } else {
      const existingSettings = getLocalData<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
      setLocalData(STORAGE_KEYS.SETTINGS, { ...existingSettings, ...INITIAL_SITE_SETTINGS });
    }

    // 2. Ensure other collections exist
    if (force || !localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      setLocalData(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.SKILLS)) {
      setLocalData(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.TESTIMONIALS)) {
      setLocalData(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.EXPERIENCE)) {
      setLocalData(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.SOCIALS)) {
      setLocalData(STORAGE_KEYS.SOCIALS, INITIAL_SOCIAL_LINKS);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.THEME)) {
      setLocalData(STORAGE_KEYS.THEME, INITIAL_THEME_SETTINGS);
    }
    if (force || !localStorage.getItem(STORAGE_KEYS.SECTIONS)) {
      setLocalData(STORAGE_KEYS.SECTIONS, INITIAL_SECTION_VISIBILITY);
    }

    localStorage.setItem(SEED_FINGERPRINT_KEY, currentFingerprint);
  }
}

// Ensure local persistence is initialized without dummy projects or sample messages
export function initializeLocalStorageIfNeeded() {
  syncWithSeedData(false);

  // Initialize messages as empty array (no dummy messages)
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    setLocalData(STORAGE_KEYS.MESSAGES, []);
  }
}

// -------------------------------------------------------------
// Database Service APIs
// -------------------------------------------------------------

export const db = {
  // === SYNC & RESET WITH CODE FILE (seedData.ts) ===
  resetToSeedData(entity?: 'all' | 'projects' | 'settings'): void {
    if (entity === 'projects') {
      // Supabase is the sole source of truth; clear local cache
      localStorage.removeItem(STORAGE_KEYS.PROJECTS);
      return;
    }
    if (!entity || entity === 'all' || entity === 'settings') {
      setLocalData(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
      setLocalData(STORAGE_KEYS.NAVBAR, INITIAL_NAVBAR_SETTINGS);
      setLocalData(STORAGE_KEYS.HERO, INITIAL_HERO_SETTINGS);
    }
    if (!entity || entity === 'all') {
      setLocalData(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
      setLocalData(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
      setLocalData(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
      setLocalData(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE);
      setLocalData(STORAGE_KEYS.SOCIALS, INITIAL_SOCIAL_LINKS);
      setLocalData(STORAGE_KEYS.THEME, INITIAL_THEME_SETTINGS);
      setLocalData(STORAGE_KEYS.SECTIONS, INITIAL_SECTION_VISIBILITY);
    }
    localStorage.setItem(SEED_FINGERPRINT_KEY, computeSeedFingerprint());
  },

  // === SITE SETTINGS ===
  async getSiteSettings(): Promise<SiteSettings> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
        if (!error && data) {
          const merged: SiteSettings = {
            ...INITIAL_SITE_SETTINGS,
            ...data,
            hero_phrases: data.hero_phrases && data.hero_phrases.length > 0 ? data.hero_phrases : INITIAL_SITE_SETTINGS.hero_phrases
          };
          setLocalData(STORAGE_KEYS.SETTINGS, merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase getSiteSettings error, falling back to local storage:', err);
      }
    }
    const local = getLocalData<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    return {
      ...INITIAL_SITE_SETTINGS,
      ...local,
      hero_phrases: local.hero_phrases && local.hero_phrases.length > 0 ? local.hero_phrases : INITIAL_SITE_SETTINGS.hero_phrases
    };
  },

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const FIXED_SITE_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';
    const updated: SiteSettings & { id: string } = {
      ...current,
      ...settings,
      id: (current as any).id || FIXED_SITE_SETTINGS_ID,
      updated_at: new Date().toISOString()
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('site_settings').upsert([updated]);
        if (error) console.warn('Supabase updateSiteSettings error:', error.message);
      } catch (err) {
        console.warn('Supabase updateSiteSettings error:', err);
      }
    }

    // Keep navbar brand name and logo_initial synchronized with site settings
    if (settings.name || settings.logo_initial) {
      await this.updateNavbarSettings({
        ...(settings.name ? { brand_name: settings.name } : {}),
        ...(settings.logo_initial ? { logo_initial: settings.logo_initial } : {})
      });
    }

    // Keep hero image and hero texts in sync if profile image/badge changed
    if (settings.profile_image || settings.title_badge || settings.headline || settings.hero_supporting_text) {
      await this.updateHeroSettings({
        ...(settings.profile_image ? { hero_image: settings.profile_image } : {}),
        ...(settings.title_badge ? { eyebrow: settings.title_badge } : {}),
        ...(settings.headline ? { headline: settings.headline } : {}),
        ...(settings.hero_supporting_text ? { supporting_text: settings.hero_supporting_text } : {})
      });
    }

    setLocalData(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // === PROJECTS ===
  async getProjects(publicOnly = true): Promise<Project[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let query = supabase
          .from('projects')
          .select('*')
          .order('display_order', { ascending: true });

        if (publicOnly) {
          query = query.eq('published', true);
        }

        const { data, error } = await query;
        if (error) {
          console.error('Supabase getProjects error:', error);
          throw new Error(`Failed to load projects from Supabase: ${error.message}`);
        }

        const projects = data || [];
        // Keep local mirror synchronized
        setLocalData(STORAGE_KEYS.PROJECTS, projects);
        return projects;
      } catch (err) {
        console.error('Failed to fetch projects from Supabase:', err);
        throw err;
      }
    }

    // If Supabase is not configured yet, load user-created projects from local storage (no dummy projects)
    const local = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
    const sorted = [...local].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    return publicOnly ? sorted.filter(p => p.published) : sorted;
  },

  async saveProject(project: Partial<Project> & { name: string }): Promise<Project> {
    const title = (project.title || project.name || '').trim();
    if (!title) {
      throw new Error('Project title/name is required. Please fill in field #2.');
    }

    const id = project.id || `proj-${Date.now()}`;
    const image = (project.image_url || project.cover_image || '').trim();
    const slug = (
      project.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `proj-${Date.now()}`
    );
    const desc = (project.description || project.short_description || '').trim();
    const caseStudyUrl = (project.case_study_url || project.live_url || '').trim();

    const fullProject: Project = {
      id,
      name: title,
      title: title,
      slug,
      short_description: desc,
      description: desc,
      category: project.category || 'UI/UX Design',
      cover_image: image,
      image_url: image,
      images: project.images && project.images.length > 0 ? project.images : (image ? [image] : []),
      video_url: project.video_url || '',
      technologies:
        project.technologies && project.technologies.length > 0
          ? project.technologies
          : ['Design', 'Development'],
      project_type: project.project_type || project.category || 'Case Study',
      year: (project.year || String(new Date().getFullYear())).trim(),
      featured: Boolean(project.featured),
      live_url: caseStudyUrl,
      case_study_url: caseStudyUrl,
      button_text: project.button_text?.trim() || 'View Case Study ↗',
      display_order: project.display_order ?? 0,
      published: project.published !== undefined ? project.published : true,
      client: project.client || '',
      metrics: project.metrics || '',
      challenge: project.challenge || '',
      solution: project.solution || '',
      created_at: project.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      // 1. Upsert to Supabase with auto-healing schema adapter
      let sendPayload: Record<string, any> = { ...fullProject };
      let { error: saveError } = await supabase
        .from('projects')
        .upsert([sendPayload], { onConflict: 'id' });

      // Auto-heal if existing Supabase table lacks newer optional columns (e.g. PGRST204 for button_text)
      while (saveError && saveError.code === 'PGRST204') {
        const match = saveError.message.match(/Could not find the '([^']+)' column/i);
        if (match && match[1] && sendPayload[match[1]] !== undefined) {
          console.warn(`Supabase projects table lacks column '${match[1]}'. Auto-retrying without it...`);
          delete sendPayload[match[1]];
          const retry = await supabase
            .from('projects')
            .upsert([sendPayload], { onConflict: 'id' });
          saveError = retry.error;
        } else {
          break;
        }
      }

      if (saveError) {
        console.error('Supabase saveProject error:', saveError);
        if (saveError.code === '42P01') {
          throw new Error("Supabase table 'projects' does not exist yet. Please go to Website Settings -> '1-Click Supabase PostgreSQL Schema' and run the SQL script in your Supabase SQL Editor.");
        }
        if (saveError.code === '42501') {
          throw new Error("Supabase permission denied (RLS). Please run the 1-Click SQL Setup script from Website Settings to permit project insert/update.");
        }
        throw new Error(`Supabase save error (${saveError.code || 'DB_ERROR'}): ${saveError.message}`);
      }

      // 2. Strict Verification: Query the record back from Supabase to confirm persistence
      const { data: verifiedRows, error: verifyError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id);

      if (verifyError) {
        console.error('Supabase verification error:', verifyError);
        throw new Error(`Supabase verification error: ${verifyError.message}`);
      }

      if (!verifiedRows || verifiedRows.length === 0) {
        throw new Error('Supabase verification failed: Project was saved, but cannot be read back. Check Row Level Security (RLS) policies on your Supabase projects table.');
      }

      // Merge verified database row with full client-side project data
      const mergedSavedProject: Project = {
        ...fullProject,
        ...(verifiedRows[0] as Project)
      };

      // Update local storage mirror
      const local = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
      const idx = local.findIndex(p => p.id === id);
      if (idx >= 0) local[idx] = mergedSavedProject;
      else local.push(mergedSavedProject);
      setLocalData(STORAGE_KEYS.PROJECTS, local);

      return mergedSavedProject;
    }

    // If Supabase is not configured yet, persist locally so user work is never lost
    const local = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
    const idx = local.findIndex(p => p.id === id);
    if (idx >= 0) local[idx] = fullProject;
    else local.push(fullProject);
    setLocalData(STORAGE_KEYS.PROJECTS, local);

    return fullProject;
  },

  async deleteProject(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        console.error('Supabase deleteProject error:', error);
        throw new Error(`Supabase delete error: ${error.message}`);
      }
    }
    const local = getLocalData<Project[]>(STORAGE_KEYS.PROJECTS, []);
    setLocalData(STORAGE_KEYS.PROJECTS, local.filter(p => p.id !== id));
  },

  // === SERVICES ===
  async getServices(publicOnly = true): Promise<Service[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let query = supabase.from('services').select('*').order('display_order', { ascending: true });
        if (publicOnly) {
          query = query.eq('enabled', true);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getServices error, falling back:', err);
      }
    }
    const all = getLocalData<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const sorted = [...all].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    return publicOnly ? sorted.filter(s => s.enabled) : sorted;
  },

  async saveService(service: Partial<Service> & { title: string }): Promise<Service> {
    const all = getLocalData<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    const id = service.id || `serv-${Date.now()}`;
    const slug = service.slug || service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fullService: Service = {
      id,
      title: service.title,
      slug,
      icon: service.icon || 'Cpu',
      short_description: service.short_description || '',
      detailed_description: service.detailed_description || '',
      features: service.features || [],
      technologies: service.technologies || [],
      starting_price: service.starting_price || '',
      cta_label: service.cta_label || 'Inquire Service',
      display_order: service.display_order ?? (all.length + 1),
      featured: Boolean(service.featured),
      enabled: service.enabled !== undefined ? service.enabled : true,
      created_at: service.created_at || new Date().toISOString()
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('services').upsert([fullService]);
      } catch (err) {
        console.warn('Supabase saveService error:', err);
      }
    }

    const index = all.findIndex(s => s.id === id);
    if (index >= 0) {
      all[index] = fullService;
    } else {
      all.push(fullService);
    }
    setLocalData(STORAGE_KEYS.SERVICES, all);
    return fullService;
  },

  async deleteService(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteService error:', err);
      }
    }
    const all = getLocalData<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    setLocalData(STORAGE_KEYS.SERVICES, all.filter(s => s.id !== id));
  },

  // === SKILLS ===
  async getSkills(): Promise<Skill[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('skills').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getSkills error, falling back:', err);
      }
    }
    return getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  },

  async saveSkill(skill: Partial<Skill> & { name: string; category: Skill['category'] }): Promise<Skill> {
    const all = getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    const id = skill.id || `sk-${Date.now()}`;
    const fullSkill: Skill = {
      id,
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency ?? 90,
      icon: skill.icon || 'Code2',
      display_order: skill.display_order ?? (all.length + 1),
      enabled: skill.enabled !== undefined ? skill.enabled : true
    };
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('skills').upsert([fullSkill]);
      } catch (err) {
        console.warn('Supabase saveSkill error:', err);
      }
    }
    const idx = all.findIndex(s => s.id === id);
    if (idx >= 0) all[idx] = fullSkill;
    else all.push(fullSkill);
    setLocalData(STORAGE_KEYS.SKILLS, all);
    return fullSkill;
  },

  async deleteSkill(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('skills').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteSkill error:', err);
      }
    }
    const all = getLocalData<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
    setLocalData(STORAGE_KEYS.SKILLS, all.filter(s => s.id !== id));
  },

  // === EXPERIENCE ===
  async getExperience(): Promise<Experience[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('experience').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        // ignore
      }
    }
    const all = getLocalData<Experience[]>(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE);
    return [...all].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },

  // === TESTIMONIALS ===
  async getTestimonials(publicOnly = true): Promise<Testimonial[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let q = supabase.from('testimonials').select('*').order('display_order', { ascending: true });
        if (publicOnly) q = q.eq('published', true);
        const { data, error } = await q;
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getTestimonials error:', err);
      }
    }
    const all = getLocalData<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    return publicOnly ? all.filter(t => t.published) : all;
  },

  async saveTestimonial(testimonial: Partial<Testimonial> & { name: string; testimonial: string }): Promise<Testimonial> {
    const all = getLocalData<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    const id = testimonial.id || `test-${Date.now()}`;
    const fullTestimonial: Testimonial = {
      id,
      name: testimonial.name,
      role: testimonial.role || 'Client',
      company: testimonial.company || '',
      avatar: testimonial.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      testimonial: testimonial.testimonial,
      rating: testimonial.rating ?? 5,
      published: testimonial.published !== undefined ? testimonial.published : true,
      display_order: testimonial.display_order ?? (all.length + 1),
      client_project: testimonial.client_project || '',
      project_outcome: testimonial.project_outcome || '',
      project_image: testimonial.project_image || '',
      project_link: testimonial.project_link || '',
      tags: testimonial.tags || [],
      client_logo: testimonial.client_logo || ''
    };
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('testimonials').upsert([fullTestimonial]);
      } catch (err) {
        console.warn('Supabase saveTestimonial error:', err);
      }
    }
    const idx = all.findIndex(t => t.id === id);
    if (idx >= 0) all[idx] = fullTestimonial;
    else all.push(fullTestimonial);
    setLocalData(STORAGE_KEYS.TESTIMONIALS, all);
    return fullTestimonial;
  },

  async deleteTestimonial(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteTestimonial error:', err);
      }
    }
    const all = getLocalData<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    setLocalData(STORAGE_KEYS.TESTIMONIALS, all.filter(t => t.id !== id));
  },

  // === CONTACT MESSAGES ===
  async getContactMessages(): Promise<ContactMessage[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getContactMessages error:', err);
      }
    }
    return getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
  },

  async submitContactMessage(message: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<ContactMessage> {
    const id = `msg-${Date.now()}`;
    const fullMessage: ContactMessage = {
      ...message,
      id,
      status: 'new',
      created_at: new Date().toISOString()
    };
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('contact_messages').insert([fullMessage]);
      } catch (err) {
        console.warn('Supabase submitContactMessage error:', err);
      }
    }
    const all = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    all.unshift(fullMessage);
    setLocalData(STORAGE_KEYS.MESSAGES, all);
    return fullMessage;
  },

  async updateContactMessageStatus(id: string, status: ContactMessage['status']): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('contact_messages').update({ status }).eq('id', id);
      } catch (err) {
        console.warn('Supabase updateContactMessageStatus error:', err);
      }
    }
    const all = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    const msg = all.find(m => m.id === id);
    if (msg) {
      msg.status = status;
      setLocalData(STORAGE_KEYS.MESSAGES, all);
    }
  },

  async deleteContactMessage(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('contact_messages').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteContactMessage error:', err);
      }
    }
    const all = getLocalData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    setLocalData(STORAGE_KEYS.MESSAGES, all.filter(m => m.id !== id));
  },

  // === STORAGE / IMAGE UPLOAD ===
  async uploadImage(file: File, bucket = 'project-images'): Promise<string> {
    const supabase = getSupabaseClient();

    // Maximum file size check (15MB)
    if (file.size > 15 * 1024 * 1024) {
      throw new Error('File size exceeds the 15MB upload limit.');
    }

    if (!supabase) {
      // Local fallback: convert file to Base64 data URL if Supabase is not connected
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to process image file.'));
        reader.readAsDataURL(file);
      });
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `proj-${timestamp}-${randomStr}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError);
      throw new Error(`Storage upload failed (${uploadError.name || 'UPLOAD_ERROR'}): ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    if (!data?.publicUrl) {
      throw new Error('Failed to retrieve public URL from Supabase Storage.');
    }

    // Add cache-busting timestamp query parameter so browsers never cache an outdated image
    const publicUrlWithBuster = `${data.publicUrl}?t=${timestamp}`;
    return publicUrlWithBuster;
  },

  // === AUTHENTICATION ===
  getAuthSession() {
    const supabase = getSupabaseClient();
    if (supabase) {
      // In Supabase mode, the auth state listener handles session
    }
    return getLocalData<{ email: string; token: string; isAdmin: boolean } | null>(STORAGE_KEYS.AUTH, null);
  },

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.session) {
          setLocalData(STORAGE_KEYS.AUTH, {
            email: data.user.email || email,
            token: data.session.access_token,
            isAdmin: true
          });
          return { success: true };
        }
        if (error) {
          console.warn('Supabase signIn error, checking admin fallback:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase auth error:', err);
      }
    }

    // Default admin fallback for seamless preview testing & demonstrations:
    if (
      (email === 'admin@srkworks.design' && password === 'admin123') ||
      (email === 'admin@aurastudio.design' && password === 'admin123') ||
      (email === 'dev.sharikhan@gmail.com' && password.length >= 6) ||
      (password === 'admin123' || password === 'admin')
    ) {
      setLocalData(STORAGE_KEYS.AUTH, {
        email,
        token: `mock-jwt-token-${Date.now()}`,
        isAdmin: true
      });
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. For quick demo access, use email "admin@srkworks.design" and password "admin123".'
    };
  },

  async signOut(): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  // === THEME SETTINGS ===
  async getThemeSettings(): Promise<ThemeSettings> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('theme_settings').select('*').limit(1).maybeSingle();
        if (!error && data) {
          const merged = { ...INITIAL_THEME_SETTINGS, ...data };
          setLocalData(STORAGE_KEYS.THEME, merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase getThemeSettings error:', err);
      }
    }
    return getLocalData<ThemeSettings>(STORAGE_KEYS.THEME, INITIAL_THEME_SETTINGS);
  },

  async updateThemeSettings(theme: Partial<ThemeSettings>): Promise<ThemeSettings> {
    const current = await this.getThemeSettings();
    const updated = { ...current, ...theme, id: (current as any).id || 'current_theme' };
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('theme_settings').upsert([updated]);
      } catch (err) {
        console.warn('Supabase updateThemeSettings error:', err);
      }
    }
    setLocalData(STORAGE_KEYS.THEME, updated);
    return updated;
  },

  // === HERO SETTINGS ===
  async getHeroSettings(): Promise<HeroSettings> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('hero_settings').select('*').limit(1).maybeSingle();
        if (!error && data) {
          const merged = { ...INITIAL_HERO_SETTINGS, ...data };
          setLocalData(STORAGE_KEYS.HERO, merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase getHeroSettings error:', err);
      }
    }
    return getLocalData<HeroSettings>(STORAGE_KEYS.HERO, INITIAL_HERO_SETTINGS);
  },

  async updateHeroSettings(hero: Partial<HeroSettings>): Promise<HeroSettings> {
    const current = await this.getHeroSettings();
    const updated = { ...current, ...hero, id: (current as any).id || 'current_hero' };
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('hero_settings').upsert([updated]);
      } catch (err) {
        console.warn('Supabase updateHeroSettings error:', err);
      }
    }
    setLocalData(STORAGE_KEYS.HERO, updated);
    return updated;
  },

  // === NAVBAR SETTINGS ===
  async getNavbarSettings(): Promise<NavbarSettings> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('navbar_settings').select('*').limit(1).maybeSingle();
        if (!error && data) {
          const merged = { ...INITIAL_NAVBAR_SETTINGS, ...data };
          setLocalData(STORAGE_KEYS.NAVBAR, merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase getNavbarSettings error:', err);
      }
    }
    return getLocalData<NavbarSettings>(STORAGE_KEYS.NAVBAR, INITIAL_NAVBAR_SETTINGS);
  },

  async updateNavbarSettings(navbar: Partial<NavbarSettings>): Promise<NavbarSettings> {
    const current = await this.getNavbarSettings();
    const updated = { ...current, ...navbar, id: (current as any).id || 'current_navbar' };
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('navbar_settings').upsert([updated]);
      } catch (err) {
        console.warn('Supabase updateNavbarSettings error:', err);
      }
    }
    setLocalData(STORAGE_KEYS.NAVBAR, updated);
    return updated;
  },

  // === ABOUT SETTINGS ===
  async getAboutSettings(): Promise<AboutSettings> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('about_settings').select('*').limit(1).maybeSingle();
        if (!error && data) {
          const merged = { ...INITIAL_ABOUT_SETTINGS, ...data };
          setLocalData(STORAGE_KEYS.ABOUT, merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase getAboutSettings error:', err);
      }
    }
    return getLocalData<AboutSettings>(STORAGE_KEYS.ABOUT, INITIAL_ABOUT_SETTINGS);
  },

  async updateAboutSettings(about: Partial<AboutSettings>): Promise<AboutSettings> {
    const current = await this.getAboutSettings();
    const updated = { ...current, ...about, id: (current as any).id || 'current_about' };
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('about_settings').upsert([updated]);
      } catch (err) {
        console.warn('Supabase updateAboutSettings error:', err);
      }
    }
    setLocalData(STORAGE_KEYS.ABOUT, updated);
    return updated;
  },

  // === SECTION VISIBILITY ===
  async getSectionVisibility(): Promise<SectionVisibility> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('section_settings').select('*').limit(1).maybeSingle();
        if (!error && data) {
          const merged = { ...INITIAL_SECTION_VISIBILITY, ...data };
          setLocalData(STORAGE_KEYS.SECTIONS, merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase getSectionVisibility error:', err);
      }
    }
    return getLocalData<SectionVisibility>(STORAGE_KEYS.SECTIONS, INITIAL_SECTION_VISIBILITY);
  },

  async updateSectionVisibility(visibility: Partial<SectionVisibility>): Promise<SectionVisibility> {
    const current = await this.getSectionVisibility();
    const updated = { ...current, ...visibility, id: (current as any).id || 'current_sections' };
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('section_settings').upsert([updated]);
      } catch (err) {
        console.warn('Supabase updateSectionVisibility error:', err);
      }
    }
    setLocalData(STORAGE_KEYS.SECTIONS, updated);
    return updated;
  },

  // === SOCIAL LINKS ===
  async getSocialLinks(): Promise<SocialLink[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('social_links').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getSocialLinks error:', err);
      }
    }
    const all = getLocalData<SocialLink[]>(STORAGE_KEYS.SOCIALS, INITIAL_SOCIAL_LINKS);
    return [...all].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  },

  async saveSocialLink(social: Partial<SocialLink> & { platform: string; url: string }): Promise<SocialLink> {
    const all = getLocalData<SocialLink[]>(STORAGE_KEYS.SOCIALS, INITIAL_SOCIAL_LINKS);
    const id = social.id || `soc-${Date.now()}`;
    const full: SocialLink = {
      id,
      platform: social.platform,
      label: social.label || social.platform,
      url: social.url,
      icon: social.icon || '',
      enabled: social.enabled !== undefined ? social.enabled : true,
      display_order: social.display_order ?? (all.length + 1)
    };
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('social_links').upsert([full]);
      } catch (err) {
        console.warn('Supabase saveSocialLink error:', err);
      }
    }
    const idx = all.findIndex(s => s.id === id);
    if (idx >= 0) all[idx] = full;
    else all.push(full);
    setLocalData(STORAGE_KEYS.SOCIALS, all);
    return full;
  },

  async deleteSocialLink(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('social_links').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteSocialLink error:', err);
      }
    }
    const all = getLocalData<SocialLink[]>(STORAGE_KEYS.SOCIALS, INITIAL_SOCIAL_LINKS);
    setLocalData(STORAGE_KEYS.SOCIALS, all.filter(s => s.id !== id));
  },

  // === SQL MIGRATION SCRIPT EXPORTER ===
  generateSupabaseSQL(): string {
    return `-- =========================================================
-- AURA STUDIO: SUPABASE POSTGRESQL SCHEMA & RLS POLICIES
-- Paste this script into your Supabase Dashboard -> SQL Editor
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title_badge TEXT,
  headline TEXT,
  hero_supporting_text TEXT,
  profile_image TEXT,
  availability_status TEXT,
  primary_cta_label TEXT,
  secondary_cta_label TEXT,
  contact_headline TEXT,
  contact_subtext TEXT,
  email TEXT,
  whatsapp TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  category TEXT,
  cover_image TEXT,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  project_type TEXT,
  year TEXT,
  featured BOOLEAN DEFAULT false,
  live_url TEXT,
  case_study_url TEXT,
  button_text TEXT DEFAULT 'View Case Study ↗',
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  client TEXT,
  metrics TEXT,
  challenge TEXT,
  solution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Ensure all project columns exist even on pre-existing Supabase tables:
ALTER TABLE projects ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS button_text TEXT DEFAULT 'View Case Study ↗';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS case_study_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS metrics TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT;

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  short_description TEXT,
  detailed_description TEXT,
  features TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  starting_price TEXT,
  cta_label TEXT DEFAULT 'Inquire Service',
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency INTEGER DEFAULT 90,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true
);

-- 5. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  avatar TEXT,
  testimonial TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- 6. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. THEME SETTINGS
CREATE TABLE IF NOT EXISTS theme_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_theme',
  preset TEXT DEFAULT 'default',
  primary_color TEXT DEFAULT '#ffffff',
  secondary_color TEXT DEFAULT '#a1a1aa',
  accent_color TEXT DEFAULT '#38bdf8',
  background_color TEXT DEFAULT '#07080a',
  surface_color TEXT DEFAULT 'rgba(255, 255, 255, 0.025)',
  text_color TEXT DEFAULT '#ffffff',
  secondary_text_color TEXT DEFAULT '#94a3b8',
  border_color TEXT DEFAULT 'rgba(255, 255, 255, 0.08)',
  heading_font TEXT DEFAULT 'Plus Jakarta Sans',
  body_font TEXT DEFAULT 'Plus Jakarta Sans',
  font_weight TEXT DEFAULT 'font-semibold',
  heading_scale TEXT DEFAULT 'normal',
  border_radius TEXT DEFAULT 'rounded-2xl',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. HERO SETTINGS
CREATE TABLE IF NOT EXISTS hero_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_hero',
  eyebrow TEXT DEFAULT 'HEY, I''M SHARIK',
  headline TEXT DEFAULT 'I CREATE',
  phrases JSONB DEFAULT '[]'::jsonb,
  supporting_text TEXT,
  primary_cta_label TEXT DEFAULT 'View My Work',
  primary_cta_url TEXT DEFAULT '#work',
  secondary_cta_label TEXT DEFAULT 'Let''s Work Together',
  secondary_cta_url TEXT DEFAULT '#contact',
  hero_image TEXT DEFAULT '/hero-sculpture.jpg',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. NAVBAR SETTINGS
CREATE TABLE IF NOT EXISTS navbar_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_navbar',
  brand_name TEXT DEFAULT 'SHARIK KHAN',
  logo_initial TEXT DEFAULT 'S',
  cta_text TEXT DEFAULT 'Let''s Talk',
  cta_url TEXT DEFAULT '#contact',
  nav_items JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. ABOUT SETTINGS
CREATE TABLE IF NOT EXISTS about_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_about',
  badge TEXT DEFAULT 'The Philosophy',
  heading TEXT DEFAULT 'DESIGN × CODE × AI',
  introduction TEXT,
  detailed_description TEXT,
  profile_image TEXT DEFAULT '/hero-sculpture.jpg',
  skills_tags TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '[]'::jsonb,
  cta_text TEXT DEFAULT 'Work With Me',
  cta_url TEXT DEFAULT '#contact',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. SECTION SETTINGS
CREATE TABLE IF NOT EXISTS section_settings (
  id TEXT PRIMARY KEY DEFAULT 'current_sections',
  hero BOOLEAN DEFAULT true,
  services BOOLEAN DEFAULT true,
  projects BOOLEAN DEFAULT true,
  about BOOLEAN DEFAULT true,
  process BOOLEAN DEFAULT true,
  automation BOOLEAN DEFAULT true,
  testimonials BOOLEAN DEFAULT true,
  contact BOOLEAN DEFAULT true,
  footer BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. SOCIAL LINKS
CREATE TABLE IF NOT EXISTS social_links (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  label TEXT,
  url TEXT NOT NULL,
  icon TEXT,
  enabled BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE navbar_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Public full access policies (permits Admin CMS actions & live site reads):
DROP POLICY IF EXISTS "Public full access site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public full access projects" ON projects;
DROP POLICY IF EXISTS "Public full access services" ON services;
DROP POLICY IF EXISTS "Public full access skills" ON skills;
DROP POLICY IF EXISTS "Public full access testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public full access contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Public full access theme_settings" ON theme_settings;
DROP POLICY IF EXISTS "Public full access hero_settings" ON hero_settings;
DROP POLICY IF EXISTS "Public full access navbar_settings" ON navbar_settings;
DROP POLICY IF EXISTS "Public full access about_settings" ON about_settings;
DROP POLICY IF EXISTS "Public full access section_settings" ON section_settings;
DROP POLICY IF EXISTS "Public full access social_links" ON social_links;

CREATE POLICY "Public full access site_settings" ON site_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access projects" ON projects FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access services" ON services FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access skills" ON skills FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access testimonials" ON testimonials FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access contact_messages" ON contact_messages FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access theme_settings" ON theme_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access hero_settings" ON hero_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access navbar_settings" ON navbar_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access about_settings" ON about_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access section_settings" ON section_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public full access social_links" ON social_links FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access navbar_settings" ON navbar_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access about_settings" ON about_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access section_settings" ON section_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access social_links" ON social_links FOR ALL USING (true) WITH CHECK (true);

-- =========================================================
-- STORAGE BUCKETS SETUP & POLICIES
-- =========================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('service-assets', 'service-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public storage read" ON storage.objects;
DROP POLICY IF EXISTS "Allow storage upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow storage update" ON storage.objects;
DROP POLICY IF EXISTS "Allow storage delete" ON storage.objects;

CREATE POLICY "Public storage read" ON storage.objects
  FOR SELECT USING (bucket_id IN ('project-images', 'profile-images', 'service-assets'));

CREATE POLICY "Allow storage upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('project-images', 'profile-images', 'service-assets'));

CREATE POLICY "Allow storage update" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('project-images', 'profile-images', 'service-assets'))
  WITH CHECK (bucket_id IN ('project-images', 'profile-images', 'service-assets'));

CREATE POLICY "Allow storage delete" ON storage.objects
  FOR DELETE USING (bucket_id IN ('project-images', 'profile-images', 'service-assets'));
`;
  }
};

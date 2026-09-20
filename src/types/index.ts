export interface Project {
  id: string;
  name: string;
  title?: string;
  slug?: string;
  short_description: string;
  description?: string;
  category: string;
  cover_image: string;
  image_url?: string;
  images?: string[];
  video_url?: string;
  technologies?: string[];
  project_type?: string;
  year: string;
  featured?: boolean;
  live_url?: string;
  case_study_url?: string;
  button_text?: string;
  display_order?: number;
  published?: boolean;
  client?: string;
  metrics?: string;
  challenge?: string;
  solution?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string;
  short_description: string;
  detailed_description?: string;
  features?: string[];
  technologies?: string[];
  starting_price?: string;
  cta_label?: string;
  link_url?: string;
  display_order: number;
  featured?: boolean;
  enabled: boolean;
  created_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Design' | 'Frontend' | 'AI & Backend' | 'Tools & Infra';
  proficiency?: number;
  icon?: string;
  display_order: number;
  enabled: boolean;
}

export interface Experience {
  id: string;
  title: string;
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  display_order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  testimonial: string;
  rating: number;
  published: boolean;
  display_order: number;
  client_project?: string;
  project_outcome?: string;
  project_image?: string;
  project_link?: string;
  tags?: string[];
  client_logo?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  project_type: string;
  budget: string;
  message: string;
  status: 'new' | 'contacted' | 'completed' | 'archived';
  created_at: string;
}

// -------------------------------------------------------------
// CMS Customization Interfaces
// -------------------------------------------------------------

export interface ThemeSettings {
  preset: 'default' | 'midnight' | 'minimal' | 'monochrome' | 'warm' | 'ocean' | 'custom';
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  secondary_text_color: string;
  border_color: string;
  heading_font: 'Plus Jakarta Sans' | 'Inter' | 'Manrope' | 'DM Sans' | 'Space Grotesk';
  body_font: 'Plus Jakarta Sans' | 'Inter' | 'Manrope' | 'DM Sans';
  font_weight: 'font-normal' | 'font-medium' | 'font-semibold' | 'font-bold' | 'font-extrabold';
  heading_scale: 'normal' | 'large' | 'compact';
  border_radius: 'rounded-none' | 'rounded-lg' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-full';
}

export interface HeroPhrase {
  id: string;
  text: string;
  enabled: boolean;
  display_order: number;
}

export interface HeroSettings {
  eyebrow: string;
  headline: string;
  phrases: HeroPhrase[];
  supporting_text: string;
  primary_cta_label: string;
  primary_cta_url: string;
  secondary_cta_label: string;
  secondary_cta_url: string;
  hero_image: string;
}

export interface NavItem {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
  display_order: number;
}

export interface NavbarSettings {
  brand_name: string;
  logo_initial: string;
  nav_items: NavItem[];
  cta_text: string;
  cta_url: string;
}

export interface AboutMetric {
  id: string;
  label: string;
  value: string;
  subtext: string;
}

export interface AboutSettings {
  badge: string;
  heading: string;
  introduction: string;
  detailed_description: string;
  profile_image: string;
  skills_tags: string[];
  metrics: AboutMetric[];
  cta_text: string;
  cta_url: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon?: string;
  enabled: boolean;
  display_order: number;
}

export interface SectionVisibility {
  hero: boolean;
  services: boolean;
  projects: boolean;
  about: boolean;
  process: boolean;
  automation: boolean;
  testimonials: boolean;
  contact: boolean;
  footer: boolean;
}

export interface SiteSettings {
  id?: string;
  // Personal branding
  name: string;
  logo_initial?: string;
  short_title?: string;
  location?: string;
  title_badge: string;
  headline: string;
  hero_phrases?: string[];
  hero_supporting_text: string;
  profile_image: string;
  availability_status: string;
  primary_cta_label: string;
  secondary_cta_label: string;
  contact_headline: string;
  contact_subtext: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  github: string;
  twitter: string;
  // SEO
  seo_title: string;
  seo_description: string;
  favicon_url?: string;
  og_image: string;
  social_title?: string;
  social_description?: string;
  accent_gradient?: string;
}

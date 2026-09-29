import {
  Project,
  Service,
  Skill,
  Experience,
  Testimonial,
  SiteSettings,
  SocialLink,
  ThemeSettings,
  HeroSettings,
  NavbarSettings,
  AboutSettings,
  SectionVisibility
} from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  name: "SHARIK KHAN",
  title_badge: "HEY, I'M SHARIK",
  headline: "I CREATE",
  hero_phrases: [
    "UI/UX EXPERIENCES",
    "WEBSITES",
    "AI AUTOMATIONS",
    "AI SOLUTIONS",
    "DIGITAL EXPERIENCES"
  ],
  hero_supporting_text: "Designing digital experiences, building modern websites, and creating AI-powered systems for the next generation of businesses.",
  profile_image: "/hero-sculpture.jpg",
  availability_status: "Available for selected projects",
  primary_cta_label: "View My Work",
  secondary_cta_label: "Let's Work Together",
  contact_headline: "LET'S BUILD SOMETHING\nUSEFUL.",
  contact_subtext: "Have an idea, product or business that needs a better digital experience?",
  email: "",
  whatsapp: "",
  linkedin: "",
  github: "",
  twitter: "",
  seo_title: "SRK Works | Web Development, UI/UX Design & AI Solutions",
  seo_description: "SRK Works builds modern websites, UI/UX designs and AI-powered digital solutions for businesses, creators and startups.",
  og_image: "/og-image.jpg",
  favicon_url: "/favicon.png"
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'serv-webdev',
    title: 'Custom Web Development (Full-Stack MVP)',
    slug: 'web-development',
    icon: 'Code2',
    category: 'Web Development',
    badge: 'Most Popular',
    price: '$1,200',
    starting_price: '$1,200',
    delivery_time: '14 - 21 Days',
    image_url: '/hero-sculpture.jpg',
    cover_image: '/hero-sculpture.jpg',
    short_description: 'Fast, responsive, and type-safe modern website engineered with sub-second Core Web Vitals and complete SEO.',
    detailed_description: 'Building modern web platforms with React 19, TypeScript, and Tailwind CSS. We deliver mobile-first experiences, sub-second LCP, zero layout shift, Supabase/database integration, and production deployment on Vercel.',
    features: [
      'Mobile-First Responsive Layouts across 320px–4K displays',
      'Sub-Second Core Web Vitals (<1s First Contentful Paint)',
      'Custom CMS & Supabase Database Integration',
      'Technical SEO: Canonical tags, XML Sitemap, Schema.org',
      'SSL, Custom Domain Setup & Edge CDN Deployment',
      '14 Days Complimentary Post-Launch Support'
    ],
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite/Next.js', 'Supabase', 'Vercel'],
    cta_label: 'Order Website Package',
    display_order: 1,
    featured: true,
    enabled: true
  },
  {
    id: 'serv-uiux',
    title: 'UI/UX Design & Design System',
    slug: 'ui-ux-design',
    icon: 'Layout',
    category: 'UI/UX Design',
    badge: 'High Craft',
    price: '$800',
    starting_price: '$800',
    delivery_time: '7 - 14 Days',
    image_url: '/hero-sculpture.jpg',
    cover_image: '/hero-sculpture.jpg',
    short_description: 'Human-centric user interfaces, comprehensive design systems, and interactive clickable prototypes in Figma.',
    detailed_description: 'Translating product vision into intuitive digital journeys. We design mathematically structured layout grids, WCAG AA accessible contrast palettes, design tokens, and high-fidelity interactive prototypes.',
    features: [
      'User Research, Persona Mapping & Wireframes',
      'Full Component Library with Auto-Layout in Figma',
      'Interactive Clickable Prototype for User Testing',
      'Design Tokens for Typography, Spacing, and Colors',
      'Developer Handoff Documentation & Asset Export',
      '2 Comprehensive Revision Rounds Included'
    ],
    technologies: ['Figma', 'Design Tokens', 'Protopie', 'WCAG AA/AAA Guidelines'],
    cta_label: 'Book UI/UX Sprint',
    display_order: 2,
    featured: true,
    enabled: true
  },
  {
    id: 'serv-ai',
    title: 'AI Automation & Custom Knowledge Bot',
    slug: 'ai-solutions',
    icon: 'Cpu',
    category: 'AI Automation',
    badge: 'High ROI',
    price: '$650',
    starting_price: '$650',
    delivery_time: '5 - 10 Days',
    image_url: '/hero-sculpture.jpg',
    cover_image: '/hero-sculpture.jpg',
    short_description: 'Bespoke AI chatbots trained on your company data plus automated webhook pipelines connecting your business tools.',
    detailed_description: 'Designing autonomous business systems that eliminate repetitive operational drag. We connect LLMs (Gemini / OpenAI) to your customer chat, CRM, and databases with strict privacy guardrails and telemetry logging.',
    features: [
      'Smart Customer Support RAG Bot trained on your docs',
      'Automated Multi-Step Event Pipelines (n8n / Make)',
      'Lead Qualification & Instant CRM/Email Syncing',
      'Gemini 2.5 / OpenAI API Integration with Guardrails',
      'Error Recovery Logic & Discord/Slack Telemetry Alerts',
      'Complete Training Walkthrough & Video Documentation'
    ],
    technologies: ['Gemini 2.5 API', 'OpenAI', 'n8n', 'Make', 'Vector Embeddings', 'Webhooks'],
    cta_label: 'Deploy AI Automation',
    display_order: 3,
    featured: true,
    enabled: true
  },
  {
    id: 'serv-enterprise',
    title: 'Turnkey Digital Transformation (Design + Web + AI)',
    slug: 'web-development',
    icon: 'Bot',
    category: 'Full-Stack Solution',
    badge: 'All-In-One',
    price: '$2,400',
    starting_price: '$2,400',
    delivery_time: '3 - 4 Weeks',
    image_url: '/hero-sculpture.jpg',
    cover_image: '/hero-sculpture.jpg',
    short_description: 'The complete digital package: end-to-end Figma UI/UX design, full-stack web application, and integrated AI automation.',
    detailed_description: 'Everything your brand needs to launch with authority. We handle the full product lifecycle from brand and UI design to responsive frontend engineering, database architecture, and intelligent workflow automation.',
    features: [
      'End-to-End Bespoke UI/UX Design System in Figma',
      'Production Web Application built with React & TypeScript',
      'Custom AI Knowledge Assistant & Automated Lead Routing',
      'Complete Technical SEO, Core Web Vitals & Analytics',
      'Priority Turnaround & Direct Dedicated Communication',
      '30 Days Dedicated Maintenance & Feature Adjustments'
    ],
    technologies: ['Figma', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Gemini AI', 'Vercel'],
    cta_label: 'Start Full Transformation',
    display_order: 4,
    featured: true,
    enabled: true
  }
];

export const INITIAL_PROJECTS: Project[] = [];

export const INITIAL_SKILLS: Skill[] = [];

export const INITIAL_EXPERIENCE: Experience[] = [];

export const INITIAL_TESTIMONIALS: Testimonial[] = [];

export const INITIAL_SOCIAL_LINKS: SocialLink[] = [];


export const THEME_PRESETS: Record<string, ThemeSettings> = {
  default: {
    preset: 'default',
    primary_color: '#ffffff',
    secondary_color: '#a1a1aa',
    accent_color: '#38bdf8',
    background_color: '#07080a',
    surface_color: 'rgba(255, 255, 255, 0.025)',
    text_color: '#ffffff',
    secondary_text_color: '#94a3b8',
    border_color: 'rgba(255, 255, 255, 0.08)',
    heading_font: 'Plus Jakarta Sans',
    body_font: 'Plus Jakarta Sans',
    font_weight: 'font-semibold',
    heading_scale: 'normal',
    border_radius: 'rounded-2xl'
  },
  midnight: {
    preset: 'midnight',
    primary_color: '#e0e7ff',
    secondary_color: '#818cf8',
    accent_color: '#6366f1',
    background_color: '#090d16',
    surface_color: 'rgba(30, 41, 59, 0.25)',
    text_color: '#f8fafc',
    secondary_text_color: '#94a3b8',
    border_color: 'rgba(99, 102, 241, 0.15)',
    heading_font: 'Inter',
    body_font: 'Inter',
    font_weight: 'font-semibold',
    heading_scale: 'normal',
    border_radius: 'rounded-2xl'
  },
  minimal: {
    preset: 'minimal',
    primary_color: '#ffffff',
    secondary_color: '#71717a',
    accent_color: '#ffffff',
    background_color: '#0d0d0d',
    surface_color: 'rgba(255, 255, 255, 0.02)',
    text_color: '#f4f4f5',
    secondary_text_color: '#a1a1aa',
    border_color: 'rgba(255, 255, 255, 0.06)',
    heading_font: 'Manrope',
    body_font: 'Manrope',
    font_weight: 'font-medium',
    heading_scale: 'normal',
    border_radius: 'rounded-xl' as any
  },
  monochrome: {
    preset: 'monochrome',
    primary_color: '#ffffff',
    secondary_color: '#a3a3a3',
    accent_color: '#d4d4d4',
    background_color: '#000000',
    surface_color: 'rgba(255, 255, 255, 0.03)',
    text_color: '#ffffff',
    secondary_text_color: '#737373',
    border_color: 'rgba(255, 255, 255, 0.12)',
    heading_font: 'Space Grotesk',
    body_font: 'Inter',
    font_weight: 'font-bold',
    heading_scale: 'large',
    border_radius: 'rounded-none'
  },
  warm: {
    preset: 'warm',
    primary_color: '#fef3c7',
    secondary_color: '#d97706',
    accent_color: '#f59e0b',
    background_color: '#120f0d',
    surface_color: 'rgba(245, 158, 11, 0.03)',
    text_color: '#fffbeb',
    secondary_text_color: '#d6d3d1',
    border_color: 'rgba(245, 158, 11, 0.12)',
    heading_font: 'DM Sans',
    body_font: 'DM Sans',
    font_weight: 'font-semibold',
    heading_scale: 'normal',
    border_radius: 'rounded-3xl'
  },
  ocean: {
    preset: 'ocean',
    primary_color: '#ccfbf1',
    secondary_color: '#2dd4bf',
    accent_color: '#14b8a6',
    background_color: '#061317',
    surface_color: 'rgba(20, 184, 166, 0.04)',
    text_color: '#f0fdfa',
    secondary_text_color: '#99f6e4',
    border_color: 'rgba(20, 184, 166, 0.14)',
    heading_font: 'Plus Jakarta Sans',
    body_font: 'Plus Jakarta Sans',
    font_weight: 'font-semibold',
    heading_scale: 'normal',
    border_radius: 'rounded-2xl'
  }
};

export const INITIAL_THEME_SETTINGS: ThemeSettings = THEME_PRESETS.default;

export const INITIAL_HERO_SETTINGS: HeroSettings = {
  eyebrow: "HEY, I'M SHARIK",
  headline: "I CREATE",
  phrases: [
    { id: "hp-1", text: "UI/UX EXPERIENCES", enabled: true, display_order: 1 },
    { id: "hp-2", text: "WEBSITES", enabled: true, display_order: 2 },
    { id: "hp-3", text: "AI AUTOMATIONS", enabled: true, display_order: 3 },
    { id: "hp-4", text: "AI SOLUTIONS", enabled: true, display_order: 4 },
    { id: "hp-5", text: "DIGITAL EXPERIENCES", enabled: true, display_order: 5 }
  ],
  supporting_text: "Designing digital experiences, building modern websites, and creating AI-powered systems for the next generation of businesses.",
  primary_cta_label: "View My Work",
  primary_cta_url: "#work",
  secondary_cta_label: "Let's Work Together",
  secondary_cta_url: "#contact",
  hero_image: "/hero-sculpture.jpg"
};

export const INITIAL_NAVBAR_SETTINGS: NavbarSettings = {
  brand_name: "SHARIK KHAN",
  logo_initial: "S",
  cta_text: "Let's Talk",
  cta_url: "#contact",
  nav_items: [
    { id: "nav-work", label: "Work", url: "#work", enabled: true, display_order: 1 },
    { id: "nav-services", label: "Services", url: "#services", enabled: true, display_order: 2 },
    { id: "nav-pricing", label: "Pricing", url: "#pricing", enabled: true, display_order: 3 },
    { id: "nav-clients", label: "Clients", url: "#clients", enabled: true, display_order: 4 },
    { id: "nav-about", label: "About", url: "#about", enabled: true, display_order: 5 },
    { id: "nav-process", label: "Process", url: "#process", enabled: true, display_order: 6 },
    { id: "nav-contact", label: "Contact", url: "#contact", enabled: true, display_order: 7 }
  ]
};

export const INITIAL_ABOUT_SETTINGS: AboutSettings = {
  badge: "The Philosophy",
  heading: "DESIGN × CODE × AI",
  introduction: "I combine UI/UX design, frontend development, AI, automation, and creative technology.",
  detailed_description: "Guided by Apple-inspired restraint and engineering discipline, I eliminate unnecessary complexity to create interfaces that feel effortless, websites that load instantly, and autonomous AI systems that free teams from repetitive operational drag.",
  profile_image: "/hero-sculpture.jpg",
  skills_tags: [
    "Design Systems",
    "Next.js & Vite",
    "TypeScript Rigor",
    "Gemini AI Models",
    "Autonomous Pipelines",
    "Sub-Second Vitals"
  ],
  metrics: [
    { id: "m-1", label: "Experience", value: "5+", subtext: "Years of craft" },
    { id: "m-2", label: "Production", value: "24+", subtext: "Deployed systems" },
    { id: "m-3", label: "Reliability", value: "99.8%", subtext: "Uptime & satisfaction" },
    { id: "m-4", label: "Speed", value: "<1s", subtext: "First contentful paint" }
  ],
  cta_text: "Work With Me",
  cta_url: "#contact"
};

export const INITIAL_SECTION_VISIBILITY: SectionVisibility = {
  hero: true,
  services: true,
  projects: true,
  about: true,
  process: true,
  automation: true,
  testimonials: true,
  faq: true,
  contact: true,
  footer: true
};


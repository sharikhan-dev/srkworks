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
  name: "SRKWorks",
  title_badge: "HEY, I'M SHARIKHAN",
  headline: "Let’s Build Digital\nExperiences\nFor Every Vision.",
  hero_phrases: [
    "Digital Experiences",
    "Modern Websites",
    "UI/UX Design",
    "AI Solutions",
    "Automations"
  ],
  hero_supporting_text: "Hi, I'm Sharikhan — a designer and developer passionate about creating modern websites, intuitive user interfaces, and innovative digital experiences. I combine creativity, technology, and AI to turn ideas into meaningful digital solutions.",
  profile_image: "/hero-sculpture.jpg",
  availability_status: "Available for selected projects",
  primary_cta_label: "View My Work ↗",
  secondary_cta_label: "Let's connect",
  contact_headline: "LET'S BUILD SOMETHING\nUSEFUL.",
  contact_subtext: "Have an idea, product or business that needs a better digital experience?",
  email: "",
  whatsapp: "",
  instagram: "https://www.instagram.com/imsharikhan/",
  linkedin: "",
  github: "",
  twitter: "",
  seo_title: "SRKWorks | Digital Studio · By Sharikhan",
  seo_description: "SRKWorks builds modern websites, intuitive UI/UX designs, and innovative digital experiences for businesses, creators, and startups.",
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
    image_url: '/service-webdev.jpg',
    cover_image: '/service-webdev.jpg',
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
    image_url: '/service-uiux.jpg',
    cover_image: '/service-uiux.jpg',
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
    image_url: '/og-image.jpg',
    cover_image: '/og-image.jpg',
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

export const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'soc-instagram',
    platform: 'Instagram',
    label: 'Instagram',
    url: 'https://www.instagram.com/imsharikhan/',
    icon: 'instagram',
    enabled: true,
    display_order: 1
  }
];


export const THEME_PRESETS: Record<string, ThemeSettings> = {
  default: {
    preset: 'default',
    primary_color: '#0a0a0c',
    secondary_color: '#4b5563',
    accent_color: '#2563eb',
    background_color: '#ffffff',
    surface_color: 'rgba(0, 0, 0, 0.03)',
    text_color: '#0a0a0c',
    secondary_text_color: '#4b5563',
    border_color: 'rgba(0, 0, 0, 0.08)',
    heading_font: 'Sora',
    body_font: 'Inter',
    font_weight: 'font-bold',
    heading_scale: 'normal',
    border_radius: 'rounded-full'
  },
  minimal: {
    preset: 'minimal',
    primary_color: '#18181b',
    secondary_color: '#71717a',
    accent_color: '#2563eb',
    background_color: '#fafafa',
    surface_color: 'rgba(0, 0, 0, 0.02)',
    text_color: '#18181b',
    secondary_text_color: '#71717a',
    border_color: 'rgba(0, 0, 0, 0.06)',
    heading_font: 'Sora',
    body_font: 'Inter',
    font_weight: 'font-bold',
    heading_scale: 'normal',
    border_radius: 'rounded-full'
  },
  midnight: {
    preset: 'midnight',
    primary_color: '#0f172a',
    secondary_color: '#64748b',
    accent_color: '#4f46e5',
    background_color: '#f8fafc',
    surface_color: 'rgba(15, 23, 42, 0.03)',
    text_color: '#0f172a',
    secondary_text_color: '#64748b',
    border_color: 'rgba(15, 23, 42, 0.08)',
    heading_font: 'Sora',
    body_font: 'Inter',
    font_weight: 'font-bold',
    heading_scale: 'normal',
    border_radius: 'rounded-full'
  },
  monochrome: {
    preset: 'monochrome',
    primary_color: '#000000',
    secondary_color: '#525252',
    accent_color: '#000000',
    background_color: '#ffffff',
    surface_color: 'rgba(0, 0, 0, 0.04)',
    text_color: '#000000',
    secondary_text_color: '#525252',
    border_color: 'rgba(0, 0, 0, 0.12)',
    heading_font: 'Sora',
    body_font: 'Inter',
    font_weight: 'font-bold',
    heading_scale: 'normal',
    border_radius: 'rounded-full'
  },
  warm: {
    preset: 'warm',
    primary_color: '#1c1917',
    secondary_color: '#78716c',
    accent_color: '#d97706',
    background_color: '#faf8f5',
    surface_color: 'rgba(28, 25, 23, 0.03)',
    text_color: '#1c1917',
    secondary_text_color: '#78716c',
    border_color: 'rgba(28, 25, 23, 0.08)',
    heading_font: 'Sora',
    body_font: 'Inter',
    font_weight: 'font-bold',
    heading_scale: 'normal',
    border_radius: 'rounded-full'
  },
  ocean: {
    preset: 'ocean',
    primary_color: '#0f172a',
    secondary_color: '#475569',
    accent_color: '#0284c7',
    background_color: '#f0fdfa',
    surface_color: 'rgba(2, 132, 199, 0.04)',
    text_color: '#0f172a',
    secondary_text_color: '#475569',
    border_color: 'rgba(2, 132, 199, 0.08)',
    heading_font: 'Sora',
    body_font: 'Inter',
    font_weight: 'font-bold',
    heading_scale: 'normal',
    border_radius: 'rounded-full'
  }
};

export const INITIAL_THEME_SETTINGS: ThemeSettings = THEME_PRESETS.default;

export const INITIAL_HERO_SETTINGS: HeroSettings = {
  eyebrow: "HEY, I'M SHARIKHAN",
  headline: "Let’s Build Digital\nExperiences\nFor Every Vision.",
  phrases: [
    { id: "hp-1", text: "Experiences", enabled: true, display_order: 1 },
    { id: "hp-2", text: "Websites", enabled: true, display_order: 2 },
    { id: "hp-3", text: "UI/UX Design", enabled: true, display_order: 3 },
    { id: "hp-4", text: "AI Solutions", enabled: true, display_order: 4 },
    { id: "hp-5", text: "Automations", enabled: true, display_order: 5 }
  ],
  supporting_text: "Hi, I'm Sharikhan — a designer and developer passionate about creating modern websites, intuitive user interfaces, and innovative digital experiences. I combine creativity, technology, and AI to turn ideas into meaningful digital solutions.",
  primary_cta_label: "View My Work ↗",
  primary_cta_url: "#work",
  secondary_cta_label: "Let's connect",
  secondary_cta_url: "#contact",
  hero_image: "/hero-sculpture.jpg"
};

export const INITIAL_NAVBAR_SETTINGS: NavbarSettings = {
  brand_name: "SRKWorks",
  logo_initial: "✦",
  cta_text: "Let's connect",
  cta_url: "#contact",
  nav_items: [
    { id: "nav-home", label: "Home", url: "#hero", enabled: true, display_order: 1 },
    { id: "nav-about", label: "About", url: "#about", enabled: true, display_order: 2 },
    { id: "nav-works", label: "Works", url: "#work", enabled: true, display_order: 3 },
    { id: "nav-services", label: "Service", url: "#services", enabled: true, display_order: 4 },
    { id: "nav-testimonials", label: "Testimonials", url: "#testimonials", enabled: true, display_order: 5 },
    { id: "nav-contact", label: "Contact Us", url: "#contact", enabled: true, display_order: 6 }
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


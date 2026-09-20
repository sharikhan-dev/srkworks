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
  email: "hello@sharikworks.com",
  whatsapp: "+1 (555) 234-8900",
  linkedin: "https://linkedin.com",
  github: "https://github.com",
  twitter: "https://x.com",
  seo_title: "SHARIK — UI/UX Design, Web Development & AI Automation",
  seo_description: "Designing digital experiences, building modern websites, and creating AI-powered systems for the next generation of businesses.",
  og_image: "/hero-sculpture.jpg"
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: "serv-uiux",
    title: "UI/UX DESIGN",
    slug: "ui-ux-design",
    icon: "Layout",
    short_description: "Research, wireframes, design systems, prototypes and high-fidelity interfaces.",
    detailed_description: "Translating complex product vision into high-craft design systems, intuitive user journeys, and tactile interaction models. Rooted in mathematical spacing, accessibility, and high-fidelity micro-interactions.",
    features: [
      "User Research & Wireframing",
      "Comprehensive Design Systems",
      "Interactive High-Fi Prototypes",
      "Production-Grade Handoff"
    ],
    technologies: ["Figma", "Design Tokens", "Protopie", "Tailwind CSS"],
    starting_price: "₹35,000",
    cta_label: "Start UI/UX Project",
    display_order: 1,
    featured: true,
    enabled: true,
    created_at: new Date().toISOString()
  },
  {
    id: "serv-webdev",
    title: "WEB DEVELOPMENT",
    slug: "web-development",
    icon: "Code2",
    short_description: "Fast, responsive and modern websites with polished interactions.",
    detailed_description: "High-performance web applications built with modern type-safe architectures, sub-second load times, fluid responsive typography, and resilient API integrations.",
    features: [
      "Modern React / TypeScript Stack",
      "Sub-Second Core Web Vitals & SEO",
      "Fluid Motion & Micro-Interactions",
      "API & Database Persistence"
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Vite"],
    starting_price: "₹45,000",
    cta_label: "Build Modern Website",
    display_order: 2,
    featured: true,
    enabled: true,
    created_at: new Date().toISOString()
  },
  {
    id: "serv-automation",
    title: "AI AUTOMATION",
    slug: "ai-automation",
    icon: "Cpu",
    short_description: "AI-powered workflows, chatbots and business automation systems.",
    detailed_description: "End-to-end autonomous business workflows that capture event triggers, process unstructured data via AI models, apply business rules, and eliminate repetitive operational bottlenecks.",
    features: [
      "Autonomous Multi-Step Workflows",
      "Smart RAG Chatbots & Assistants",
      "Event-Driven API & Webhook Triggers",
      "Error Recovery & Monitoring Telemetry"
    ],
    technologies: ["Make / n8n", "Gemini API", "Python", "Supabase Functions"],
    starting_price: "₹38,000",
    cta_label: "Automate Workflows",
    display_order: 3,
    featured: true,
    enabled: true,
    created_at: new Date().toISOString()
  },
  {
    id: "serv-ai-products",
    title: "AI-POWERED PRODUCTS",
    slug: "ai-powered-products",
    icon: "Bot",
    short_description: "AI interfaces, tools and digital products designed around real business problems.",
    detailed_description: "Bespoke intelligent applications combining intuitive, frictionless user interfaces with powerful foundation models to unlock real user utility and commercial value.",
    features: [
      "Custom AI Interface Architecture",
      "Domain-Specific Tooling & Prompts",
      "Scalable Vector Retrieval Pipelines",
      "Enterprise Grade Privacy & Guardrails"
    ],
    technologies: ["Gemini 2.5", "Embeddings", "Vector DBs", "TypeScript"],
    starting_price: "₹50,000",
    cta_label: "Launch AI Product",
    display_order: 4,
    featured: true,
    enabled: true,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-zwigato",
    name: "Zwigato — Food Delivery UI",
    title: "Zwigato — Food Delivery UI",
    slug: "zwigato-food-delivery-ui",
    short_description: "Hyper-fast food ordering platform with real-time predictive delivery tracking and micro-animations.",
    category: "UI/UX Design",
    project_type: "UI/UX Design",
    year: "2026",
    cover_image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["Figma", "Design Tokens", "Micro-Interactions"],
    featured: true,
    live_url: "https://behance.net",
    case_study_url: "https://behance.net",
    button_text: "View Case Study ↗",
    display_order: 1,
    published: true,
    client: "Zwigato Inc.",
    metrics: "42% faster checkout flow, 99.8% customer satisfaction score",
    challenge: "Modern delivery users abandon orders due to friction during customization and unclear real-time driver progression.",
    solution: "Architected an instant-search drawer with optimistic state updates, buttery smooth motion cues, and reliable websocket telemetry for sub-second visual tracking."
  },
  {
    id: "proj-top-muscle",
    name: "Top Muscle Nutrition — Storefront",
    title: "Top Muscle Nutrition — Storefront",
    slug: "top-muscle-nutrition",
    short_description: "High-impact editorial e-commerce experience designed for elite athlete performance and conversion.",
    category: "Web Development",
    project_type: "Web Development",
    year: "2026",
    cover_image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    image_url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    featured: true,
    live_url: "https://dribbble.com",
    case_study_url: "https://dribbble.com",
    button_text: "View Case Study ↗",
    display_order: 2,
    published: true,
    client: "Top Muscle Global",
    metrics: "+38% conversion rate, 2.4x average session duration",
    challenge: "Traditional supplement websites overwhelm buyers with medical jargon and cramped layout patterns.",
    solution: "Devised a dark aesthetic with high-contrast typography, interactive nutrition calculators, and single-tap checkout triggers."
  },
  {
    id: "proj-palettegen",
    name: "PaletteGen — AI Color Tokens",
    title: "PaletteGen — AI Color Tokens",
    slug: "palettegen-ai-colors",
    short_description: "Intelligent color palette generator producing mathematically calibrated WCAG AA/AAA tokens for design teams.",
    category: "AI Automation",
    project_type: "AI Automation",
    year: "2025",
    cover_image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    image_url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["TypeScript", "Color Spaces (OKLCH)", "Gemini API", "Tailwind"],
    featured: true,
    live_url: "https://github.com",
    case_study_url: "https://github.com",
    button_text: "View Case Study ↗",
    display_order: 3,
    published: true,
    client: "Internal Product",
    metrics: "140k+ palettes generated, 12,000 active monthly designers",
    challenge: "Designers spend hours adjusting shades across lighting variations to comply with WCAG accessibility standards.",
    solution: "Built an OKLCH perceived-brightness engine that generates harmonious shades with instant automated Figma token exports."
  },
  {
    id: "proj-cinematic",
    name: "Cinematic Stream Interface",
    title: "Cinematic Stream Interface",
    slug: "cinematic-stream-interface",
    short_description: "Netflix-inspired streaming dashboard featuring immersive video ambient backdrops and spatial card layouts.",
    category: "Branding",
    project_type: "Branding",
    year: "2025",
    cover_image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80",
    image_url: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["Figma", "Design Systems", "Motion"],
    featured: false,
    live_url: "https://figma.com",
    case_study_url: "https://figma.com",
    button_text: "View Case Study ↗",
    display_order: 4,
    published: true,
    client: "Apex Media",
    metrics: "60 FPS rendering on mid-tier mobile browsers",
    challenge: "High media density typically causes layout thrashing and severe memory leaks on continuous scroll.",
    solution: "Engineered virtualized carousel tracks with dynamically throttled blur canvas filters that keep GPU usage under 8%."
  },
  {
    id: "proj-ai-support-agent",
    name: "Synapse AI Support Copilot",
    title: "Synapse AI Support Copilot",
    slug: "synapse-ai-copilot",
    short_description: "Multi-tenant RAG chatbot resolving 84% of enterprise customer queries autonomously without human intervention.",
    category: "AI Automation",
    project_type: "AI Automation",
    year: "2026",
    cover_image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["Gemini 1.5 Pro", "Vector DB", "TypeScript", "Node.js"],
    featured: false,
    live_url: "https://github.com",
    case_study_url: "https://github.com",
    button_text: "View Case Study ↗",
    display_order: 5,
    published: true,
    client: "CloudScale SaaS",
    metrics: "₹10,00,000+ annual support cost reduction, 1.2s response latency",
    challenge: "Tier-1 support tickets overwhelmed team members during product launch cycles.",
  },
  {
    id: "proj-lead-orchestrator",
    name: "Autonomous Lead Flow",
    slug: "autonomous-lead-flow",
    short_description: "End-to-end AI automation pipeline that extracts, enriches, qualifies, and sequences inbound B2B prospects.",
    category: "AI Automation",
    project_type: "Workflow Engine",
    year: "2024",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
    ],
    technologies: ["Python", "Supabase", "OpenAI / Gemini", "HubSpot API"],
    featured: false,
    live_url: "https://github.com",
    case_study_url: "https://github.com",
    button_text: "View Case Study ↗",
    display_order: 6,
    published: true,
    client: "Nexus Capital",
    metrics: "12 hours saved weekly per account executive",
    challenge: "Manual qualification caused warm leads to go cold before first contact.",
    solution: "Built asynchronous webhook listeners that verify company financials, score fit using AI, and draft custom introductory emails."
  }
];

export const INITIAL_SKILLS: Skill[] = [
  { id: "sk-figma", name: "Figma & Design Systems", category: "Design", proficiency: 96, icon: "Figma", display_order: 1, enabled: true },
  { id: "sk-ux", name: "UI/UX & Prototyping", category: "Design", proficiency: 94, icon: "Layout", display_order: 2, enabled: true },
  { id: "sk-react", name: "React & TypeScript", category: "Frontend", proficiency: 98, icon: "Code2", display_order: 3, enabled: true },
  { id: "sk-tailwind", name: "Tailwind CSS & Motion", category: "Frontend", proficiency: 95, icon: "Palette", display_order: 4, enabled: true },
  { id: "sk-next", name: "Next.js & Web Performance", category: "Frontend", proficiency: 92, icon: "Globe", display_order: 5, enabled: true },
  { id: "sk-supabase", name: "Supabase & PostgreSQL", category: "AI & Backend", proficiency: 90, icon: "Database", display_order: 6, enabled: true },
  { id: "sk-ai-apis", name: "Gemini & LLM APIs", category: "AI & Backend", proficiency: 95, icon: "Bot", display_order: 7, enabled: true },
  { id: "sk-rag", name: "RAG & Vector Embeddings", category: "AI & Backend", proficiency: 88, icon: "Cpu", display_order: 8, enabled: true },
  { id: "sk-automation", name: "Workflow Automation (n8n)", category: "AI & Backend", proficiency: 92, icon: "Workflow", display_order: 9, enabled: true },
  { id: "sk-github", name: "Git, CI/CD & Vercel", category: "Tools & Infra", proficiency: 90, icon: "GitBranch", display_order: 10, enabled: true },
  { id: "sk-analytics", name: "SEO & Core Web Vitals", category: "Tools & Infra", proficiency: 89, icon: "BarChart3", display_order: 11, enabled: true }
];

export const INITIAL_EXPERIENCE: Experience[] = [
  {
    id: "exp-1",
    title: "Principal Digital Product Designer & AI Engineer",
    role: "Lead Creator",
    company: "srkworks",
    period: "2023 — Present",
    description: "Designing end-to-end digital experiences, full-stack web applications, and autonomous AI systems for technology startups and high-growth brands.",
    technologies: ["React", "TypeScript", "Figma", "Supabase", "Gemini API"],
    display_order: 1
  },
  {
    id: "exp-2",
    title: "Senior Product Designer & UI Engineer",
    role: "Senior Designer",
    company: "Vanguard Interactive",
    period: "2021 — 2023",
    description: "Spearheaded design system unification across 4 web platforms and increased design-to-development velocity by 60%.",
    technologies: ["Design Systems", "React", "Tailwind CSS", "Storybook"],
    display_order: 2
  },
  {
    id: "exp-3",
    title: "Frontend Developer & Creative Technologist",
    role: "Frontend Developer",
    company: "Studio Mono",
    period: "2019 — 2021",
    description: "Crafted interactive web campaigns, award-winning editorial experiences, and bespoke e-commerce destinations.",
    technologies: ["JavaScript", "HTML/CSS", "WebGL / Three.js", "WordPress"],
    display_order: 3
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Marcus Vance",
    role: "Head of Product",
    company: "Synthetix Labs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    testimonial: "The rare ability to operate seamlessly across high-end visual design, production code, and LLM automation made our launch an enormous success. Cleanest craft I have seen.",
    rating: 5,
    published: true,
    display_order: 1
  },
  {
    id: "test-2",
    name: "Elena Rostova",
    role: "Founder & CEO",
    company: "Aura Wellness",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    testimonial: "Our conversion rate jumped 42% in our first month post-redesign. The attention to spacing, micro-interactions, and instant page speeds created an unmatched impression.",
    rating: 5,
    published: true,
    display_order: 2
  },
  {
    id: "test-3",
    name: "Julian Chen",
    role: "VP Engineering",
    company: "OmniFlow Systems",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    testimonial: "The AI customer chatbot and automated triage pipeline deployed in just two weeks now handles 80% of our tier-1 support with zero errors. Absolute craftsmanship.",
    rating: 5,
    published: true,
    display_order: 3
  }
];

export const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  { id: "soc-insta", platform: "Instagram", label: "Instagram", url: "https://instagram.com", enabled: true, display_order: 1 },
  { id: "soc-linkedin", platform: "LinkedIn", label: "LinkedIn", url: "https://linkedin.com", enabled: true, display_order: 2 },
  { id: "soc-github", platform: "GitHub", label: "GitHub", url: "https://github.com", enabled: true, display_order: 3 },
  { id: "soc-behance", platform: "Behance", label: "Behance", url: "https://behance.net", enabled: true, display_order: 4 },
  { id: "soc-x", platform: "X", label: "X (Twitter)", url: "https://x.com", enabled: true, display_order: 5 },
  { id: "soc-email", platform: "Email", label: "Email", url: "mailto:hello@sharikworks.com", enabled: true, display_order: 6 }
];

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
    { id: "nav-about", label: "About", url: "#about", enabled: true, display_order: 3 },
    { id: "nav-process", label: "Process", url: "#process", enabled: true, display_order: 4 },
    { id: "nav-contact", label: "Contact", url: "#contact", enabled: true, display_order: 5 }
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
  contact: true,
  footer: true
};


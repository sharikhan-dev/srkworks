import { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Code2,
  Layout,
  Cpu,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Sparkles,
  Zap,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Project, SiteSettings } from '../../types';

export interface ServiceDetailData {
  slug: string;
  badge: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  tagline: string;
  icon: typeof Code2;
  overview: string;
  whatIsIncluded: string[];
  features: { title: string; desc: string }[];
  process: { step: string; title: string; desc: string }[];
  technologies: string[];
  faqs: { q: string; a: string }[];
  relatedServices: { title: string; slug: string }[];
}

export const SERVICE_DETAILS: Record<string, ServiceDetailData> = {
  'web-development': {
    slug: 'web-development',
    badge: 'Engineering & Performance',
    title: 'Web Development Services',
    seoTitle: 'Web Development Services | SRK Works',
    seoDescription: 'Custom web development services by SRK Works. We build fast, responsive, and SEO-optimized websites with React, TypeScript, and modern engineering.',
    h1: 'Custom Web Development Services',
    tagline: 'High-performance, type-safe web engineering crafted for speed, search visibility, and conversion.',
    icon: Code2,
    overview: 'At SRK Works, web development is approached with architectural rigor. We avoid bloated templates in favor of bespoke, type-safe React and TypeScript codebases. Every website is built mobile-first, passes Core Web Vitals with sub-second speeds, and comes structured with semantic HTML and Schema.org markup for maximum search engine indexability.',
    whatIsIncluded: [
      'Custom frontend development (React, TypeScript, Vite/Next.js)',
      'Responsive mobile-first engineering across all screen sizes',
      'Core Web Vitals profiling (sub-second LCP and near-zero CLS)',
      'Complete Technical SEO: semantic HTML5, Schema.org, sitemap & robots.txt',
      'Database and backend integrations (Supabase, Node, REST/GraphQL APIs)',
      'Production deployment on edge CDNs (Vercel) with SSL and automated CI/CD'
    ],
    features: [
      {
        title: 'Sub-Second Loading Vitals',
        desc: 'Optimized image loading, minimal bundle footprints, and zero render-blocking dependencies ensure immediate page loads.'
      },
      {
        title: 'Type-Safe & Clean Architecture',
        desc: 'Strict TypeScript interfaces ensure long-term stability, rapid maintainability, and effortless feature expansion.'
      },
      {
        title: 'Production SEO Readiness',
        desc: 'Pre-configured OpenGraph metadata, structured JSON-LD schemas, and clean heading hierarchies built into the foundation.'
      },
      {
        title: 'Fluid 60fps Micro-Animations',
        desc: 'Polished, hardware-accelerated transitions that delight visitors without triggering layout shifts or battery drain.'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Architecture & Tech Scoping',
        desc: 'Auditing product objectives, outlining database requirements, and establishing component architecture.'
      },
      {
        step: '02',
        title: 'Modular Frontend Engineering',
        desc: 'Developing pixel-accurate, responsive components in React with accessible semantic markup.'
      },
      {
        step: '03',
        title: 'API & State Integration',
        desc: 'Connecting databases, authentication, serverless functions, and third-party webhooks.'
      },
      {
        step: '04',
        title: 'Vitals Profiling & Launch',
        desc: 'Benchmarking performance under simulated network constraints before edge CDN deployment.'
      }
    ],
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js', 'Supabase', 'Node.js', 'Vercel'],
    faqs: [
      {
        q: 'Which technologies do you use for website development?',
        a: 'We primarily use modern React, TypeScript, Tailwind CSS, Vite, and Next.js, combined with serverless backends like Supabase or Node.js. This stack delivers top-tier speed and scalability.'
      },
      {
        q: 'Will my website be mobile-friendly and responsive?',
        a: 'Yes, 100%. Every page is designed and tested mobile-first to function smoothly across smartphones, tablets, laptops, and desktop monitors.'
      },
      {
        q: 'How do you ensure search engines can rank the site?',
        a: 'We implement semantic HTML5 tags, a single H1 per page, Open Graph metadata, canonical links, robots.txt, dynamic XML sitemaps, and Schema.org structured data.'
      }
    ],
    relatedServices: [
      { title: 'UI/UX Design Services', slug: 'ui-ux-design' },
      { title: 'AI Solutions & Automation', slug: 'ai-solutions' }
    ]
  },
  'ui-ux-design': {
    slug: 'ui-ux-design',
    badge: 'Product Strategy & Craft',
    title: 'UI/UX Design Services',
    seoTitle: 'UI/UX Design Services | SRK Works',
    seoDescription: 'Professional UI/UX design services by SRK Works. Human-centric interfaces, design systems, interactive Figma prototypes, and conversion-focused UX.',
    h1: 'UI/UX Design Services & Design Systems',
    tagline: 'Translating complex software and business ideas into intuitive, editorial, and tactile user interfaces.',
    icon: Layout,
    overview: 'Great user interfaces eliminate cognitive friction. We combine user research with mathematical spacing, disciplined typographic scales, and high-fidelity prototypes in Figma. Whether creating a greenfield MVP or redesigning a legacy dashboard, we deliver design systems that engineers love to build from and users enjoy navigating.',
    whatIsIncluded: [
      'Comprehensive user journeys, wireframing, and information architecture',
      'Bespoke visual identity and UI design tailored to your product category',
      'Scalable design systems with tokens for typography, spacing, and colors',
      'Clickable, interactive Figma prototypes for stakeholder alignment',
      'WCAG AA/AAA accessible color contrast and readable typography scales',
      'Developer handoff specs with component variants and layout rules'
    ],
    features: [
      {
        title: 'Systematic Token Architecture',
        desc: 'Design tokens mapped directly to CSS variables or Tailwind presets for seamless design-to-code parity.'
      },
      {
        title: 'Conversion-Focused Layouts',
        desc: 'Strategic CTA placements, visual hierarchies, and progressive disclosure patterns that guide user decisions.'
      },
      {
        title: 'Accessible by Foundation',
        desc: 'Carefully audited contrast ratios, readable font scales, and focus states designed for everyone.'
      },
      {
        title: 'Interactive High-Fi Prototyping',
        desc: 'Realistic interactive states and transition previews before engineering begins, saving costly revisions.'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Problem Discovery',
        desc: 'Uncovering user pain points, auditing competitor benchmarks, and clarifying primary conversion goals.'
      },
      {
        step: '02',
        title: 'Information Architecture',
        desc: 'Structuring page flows, content hierarchies, and low-fidelity wireframes to validate layout concepts.'
      },
      {
        step: '03',
        title: 'High-Fidelity System Design',
        desc: 'Applying typography, colors, dark/light surface tokens, and component sets in Figma.'
      },
      {
        step: '04',
        title: 'Interactive Prototype & Handoff',
        desc: 'Testing micro-interactions and packaging detailed specifications for engineering teams.'
      }
    ],
    technologies: ['Figma', 'Design Tokens', 'Protopie', 'WCAG Guidelines', 'Tailwind Specs', 'Micro-interactions'],
    faqs: [
      {
        q: 'Do you provide the complete Figma files?',
        a: 'Yes. You receive full ownership of clean, component-driven Figma files complete with auto-layout, style guides, and design tokens.'
      },
      {
        q: 'Can you redesign our existing app or dashboard?',
        a: 'Yes. We audit your current product analytics and UX bottlenecks, identify UX friction, and propose an updated, modern interface that respects your existing user base.'
      },
      {
        q: 'How do you coordinate with our development team?',
        a: 'We provide structured design tokens, component variant matrices, and export assets ready for frontend implementation.'
      }
    ],
    relatedServices: [
      { title: 'Web Development Services', slug: 'web-development' },
      { title: 'AI Solutions & Automation', slug: 'ai-solutions' }
    ]
  },
  'ai-solutions': {
    slug: 'ai-solutions',
    badge: 'Intelligent Workflows',
    title: 'AI Solutions & Automation',
    seoTitle: 'AI Solutions & Automation | SRK Works',
    seoDescription: 'AI solutions and workflow automations by SRK Works. We build autonomous pipelines, RAG chatbots, and AI-powered interfaces for businesses.',
    h1: 'AI Solutions & Business Workflow Automations',
    tagline: 'Practical artificial intelligence engineered to eliminate manual operational drag and augment your team.',
    icon: Cpu,
    overview: 'Beyond buzzwords and theoretical AI demos, SRK Works engineers dependable, production-ready AI systems. We connect LLMs (Gemini, Claude, GPT) to your operational databases, webhooks, and communication channels to resolve tier-1 queries, automate content pipelines, and streamline complex business operations with zero human lag.',
    whatIsIncluded: [
      'Custom AI assistants and support chatbots grounded in company knowledge (RAG)',
      'Automated event-driven workflows connecting CRMs, databases, and APIs',
      'Document parsing, intelligent summarization, and data extraction pipelines',
      'Integration of modern LLM APIs (Gemini 2.5, OpenAI) with guardrails',
      'Webhooks, middleware, and automation platforms (n8n, Make, Python)',
      'Telemetry logging, error recovery, and rate-limit mitigation'
    ],
    features: [
      {
        title: 'Enterprise Privacy & Guardrails',
        desc: 'Strict context isolation and prompt safeguards prevent hallucination and keep sensitive data secure.'
      },
      {
        title: 'Zero-Lag Webhook Triggers',
        desc: 'Instant event execution connecting your website, Stripe, Supabase, and customer support channels.'
      },
      {
        title: 'Semantic Context Retrieval',
        desc: 'Vector embeddings and retrieval-augmented generation ensure responses cite your actual company documentation.'
      },
      {
        title: 'Telemetry & Fail-Safe Architecture',
        desc: 'Automated retry mechanisms and alert notifications ensure critical business workflows never fail silently.'
      }
    ],
    process: [
      {
        step: '01',
        title: 'Workflow Friction Audit',
        desc: 'Pinpointing repetitive manual tasks, customer support bottlenecks, and data entry silos.'
      },
      {
        step: '02',
        title: 'Pipeline Architecture & Prompts',
        desc: 'Designing event flows, testing prompt boundaries, and selecting appropriate LLM parameters.'
      },
      {
        step: '03',
        title: 'API & Integration Wiring',
        desc: 'Building webhook receivers, vector search pipelines, and database updates.'
      },
      {
        step: '04',
        title: 'Telemetry & Continuous Tuning',
        desc: 'Deploying with observability monitoring to continuously track accuracy, latency, and costs.'
      }
    ],
    technologies: ['Gemini 2.5 API', 'OpenAI', 'n8n', 'Make', 'Vector Embeddings', 'Python', 'Webhooks', 'Supabase'],
    faqs: [
      {
        q: 'How does AI automation help my business practically?',
        a: 'It handles routine operational tasks 24/7 — answering customer queries, validating form leads, syncing records across tools, and generating reports — freeing your team for higher-value creative work.'
      },
      {
        q: 'Is our company data secure with these AI integrations?',
        a: 'Yes. We use enterprise API endpoints where data is not used for model training, and we implement strict data sanitation filters.'
      },
      {
        q: 'What happens if an AI API has an outage or rate limit?',
        a: 'We build exponential backoff retries, fallback processing, and telemetry alerts so that operations are securely queued without data loss.'
      }
    ],
    relatedServices: [
      { title: 'Web Development Services', slug: 'web-development' },
      { title: 'UI/UX Design Services', slug: 'ui-ux-design' }
    ]
  }
};

interface ServiceDetailPageProps {
  slug: string;
  projects?: Project[];
  settings: SiteSettings;
  onNavigate: (target: string) => void;
}

export function ServiceDetailPage({
  slug,
  projects = [],
  settings,
  onNavigate
}: ServiceDetailPageProps) {
  const service = SERVICE_DETAILS[slug] || SERVICE_DETAILS['web-development'];
  const Icon = service.icon;

  // Dynamically update document title and canonical meta for this service route
  useEffect(() => {
    document.title = service.seoTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', service.seoDescription);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', service.seoTitle);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', service.seoDescription);
    }
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://srkworks.vercel.app/services/${service.slug}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [service]);

  // Schema.org Service structured data
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.title,
    "provider": {
      "@type": "ProfessionalService",
      "name": "SRK Works",
      "url": "https://srkworks.vercel.app/"
    },
    "areaServed": ["Delhi NCR", "India", "Worldwide"],
    "description": service.seoDescription,
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.title,
      "itemListElement": service.whatIsIncluded.map((item, idx) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": item
        }
      }))
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://srkworks.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Services",
        "item": "https://srkworks.vercel.app/#services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": service.title,
        "item": `https://srkworks.vercel.app/services/${service.slug}`
      }
    ]
  };

  return (
    <article className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative text-white">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono text-neutral-400">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => onNavigate('services')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Services
        </button>
        <span>/</span>
        <span className="text-white font-semibold">{service.title}</span>
      </nav>

      {/* Back to Home Link */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Services</span>
        </button>
      </div>

      {/* Hero Header */}
      <header className="mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill mb-4 border border-white/10">
          <Icon className="w-3.5 h-3.5 text-neutral-300" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-300">
            {service.badge}
          </span>
        </div>

        {/* Primary H1 */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 uppercase leading-[1.08]">
          {service.h1}
        </h1>

        <p className="text-base sm:text-xl text-neutral-300 max-w-3xl leading-relaxed font-light">
          {service.tagline}
        </p>

        {/* Quick CTA button */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            <span>Start a {service.title} Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('work')}
            className="px-6 py-3 rounded-full glass-pill border border-white/15 text-neutral-200 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-all cursor-pointer"
          >
            <span>Explore Related Work</span>
          </button>
        </div>
      </header>

      {/* Service Overview Block */}
      <section className="p-6 sm:p-10 rounded-3xl glass-surface border border-white/10 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/[0.02] rounded-full blur-[90px] pointer-events-none" />
        <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white mb-4">
          Service Overview
        </h2>
        <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          {service.overview}
        </p>
      </section>

      {/* What is Included (Deliverables) */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            What Is Included
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Everything provided as part of this service engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.whatIsIncluded.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl glass-surface border border-white/10 flex items-start gap-3.5 hover:border-white/20 transition-all"
            >
              <div className="w-6 h-6 rounded-full glass-pill flex items-center justify-center flex-shrink-0 text-emerald-400 border border-emerald-500/20 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                {item}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features & Architectural Highlights */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Key Capabilities &amp; Standards
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Engineered around performance, scalability, and long-term maintainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {service.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl glass-surface border border-white/10 hover:border-white/25 transition-all group"
            >
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-neutral-100">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2">
            Execution Process
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm">
            A structured path from idea to deployment with zero guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {service.process.map((step) => (
            <div
              key={step.step}
              className="p-5 rounded-2xl glass-surface border border-white/10 flex flex-col justify-between"
            >
              <div>
                <span className="text-xl font-mono font-bold text-neutral-500 mb-2 block">
                  {step.step}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies Used */}
      <section className="mb-16">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-4">
          Core Technologies &amp; Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {service.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="text-xs font-mono text-neutral-300 glass-pill px-3.5 py-1.5 rounded-full border border-white/10"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Service-Specific FAQs */}
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Common questions regarding this specific service.
          </p>
        </div>

        <div className="space-y-3">
          {service.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-surface border border-white/10"
            >
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Cross-Linking to Other Services */}
      <section className="mb-16 p-6 rounded-3xl glass-surface border border-white/10">
        <h2 className="text-lg font-bold text-white mb-3">Explore Other Services</h2>
        <div className="flex flex-wrap gap-3">
          {service.relatedServices.map((rel) => (
            <button
              key={rel.slug}
              onClick={() => onNavigate(`services/${rel.slug}`)}
              className="px-4 py-2 rounded-full glass-pill border border-white/10 text-xs text-neutral-300 hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{rel.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </section>

      {/* Dedicated Conversion Call to Action */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Ready to Discuss Your {service.title}?
          </h2>
          <p className="text-neutral-300 text-xs sm:text-base mb-6 leading-relaxed">
            Based in Delhi, India — collaborating with startups, creators, and brands worldwide. Let's discuss your timeline and roadmap.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-7 py-3.5 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-neutral-200 transition-all shadow-[0_0_35px_rgba(255,255,255,0.3)] inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </article>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Sparkles, Layout, Code2, Cpu, Bot } from 'lucide-react';
import { Service } from '../../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceCTA?: (service: Service) => void;
  onNavigate?: (target: string) => void;
}

export function ServicesSection({ services, onSelectServiceCTA, onNavigate }: ServicesSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fallback 4 curated services matching the prompt specification exactly
  const displayServices = services && services.length >= 4 ? services : [
    {
      id: 'serv-uiux',
      title: 'UI/UX DESIGN',
      slug: 'ui-ux-design',
      icon: 'Layout',
      short_description: 'Research, wireframes, design systems, prototypes and high-fidelity interfaces.',
      detailed_description: 'Creating intuitive digital journeys grounded in mathematical layout grids, accessible contrast ratios, and tactile micro-interactions.',
      features: ['User Research & Wireframes', 'Design Systems & Tokens', 'Interactive Prototypes', 'High-Fidelity Interfaces'],
      technologies: ['Figma', 'Design Tokens', 'Protopie', 'Tailwind CSS'],
      display_order: 1,
      featured: true,
      enabled: true
    },
    {
      id: 'serv-webdev',
      title: 'WEB DEVELOPMENT',
      slug: 'web-development',
      icon: 'Code2',
      short_description: 'Fast, responsive and modern websites with polished interactions.',
      detailed_description: 'Building modern web platforms with type-safe engineering, sub-second load times, smooth 60fps animations, and resilient APIs.',
      features: ['Modern React / TypeScript', 'Sub-Second Core Web Vitals', 'Fluid Motion & Animations', 'API Integration'],
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vite'],
      display_order: 2,
      featured: true,
      enabled: true
    },
    {
      id: 'serv-automation',
      title: 'AI AUTOMATION',
      slug: 'ai-solutions',
      icon: 'Cpu',
      short_description: 'AI-powered workflows, chatbots and business automation systems.',
      detailed_description: 'Designing autonomous business systems that capture events, process data via LLMs, and automate manual operations with zero human lag.',
      features: ['Autonomous Workflows', 'Smart RAG Chatbots', 'Event-Driven Triggers', 'Telemetry & Error Handling'],
      technologies: ['Make / n8n', 'Gemini API', 'Python', 'Webhooks'],
      display_order: 3,
      featured: true,
      enabled: true
    },
    {
      id: 'serv-ai-products',
      title: 'AI-POWERED PRODUCTS',
      slug: 'ai-solutions',
      icon: 'Bot',
      short_description: 'AI interfaces, tools and digital products designed around real business problems.',
      detailed_description: 'Bespoke intelligent tools and generative UI applications engineered around genuine business ROI and delightful user experiences.',
      features: ['Custom AI Interfaces', 'Domain-Specific Workflows', 'Vector Retrieval Pipelines', 'Enterprise Privacy Guardrails'],
      technologies: ['Gemini 2.5', 'Vector DBs', 'Embeddings', 'TypeScript'],
      display_order: 4,
      featured: true,
      enabled: true
    }
  ];

  const handleServiceClick = (serv: any) => {
    const targetSlug = serv.slug === 'ai-automation' || serv.slug === 'ai-powered-products' ? 'ai-solutions' : serv.slug;
    if (onNavigate) {
      onNavigate(`services/${targetSlug}`);
    } else if (onSelectServiceCTA) {
      onSelectServiceCTA(serv as Service);
    }
  };

  return (
    <section id="services" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 mb-3 sm:mb-4 border border-neutral-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-700 font-medium">
              Core Expertise
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 uppercase font-sora">
            What I Build
          </h2>
          <p className="text-neutral-600 text-xs sm:text-base max-w-xl mt-2.5 sm:mt-3 leading-relaxed font-inter">
            Disciplined design and engineering to build digital products, high-velocity websites, and autonomous intelligence systems.
          </p>
        </div>

        {/* Quick jump to packages and pricing */}
        {onNavigate && (
          <button
            onClick={() => onNavigate('pricing')}
            className="self-start md:self-end text-xs font-inter font-medium text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-full border border-neutral-200 flex items-center gap-1.5 cursor-pointer group transition-colors shadow-2xs"
          >
            <span>View Packages &amp; Pricing</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        )}
      </motion.div>

      {/* Editorial Services List */}
      <div className="border-t border-neutral-200 divide-y divide-neutral-200/80">
        {displayServices.map((service, index) => {
          const stepNumber = String(index + 1).padStart(2, '0');
          const isHovered = hoveredIndex === index;
          const targetSlug = service.slug === 'ai-automation' || service.slug === 'ai-powered-products' ? 'ai-solutions' : service.slug;
          const headingTitle = service.title;

          return (
            <motion.div
              key={service.id || service.slug || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleServiceClick(service)}
              className={`group relative py-6 sm:py-12 px-2.5 sm:px-6 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 ${
                isHovered ? 'bg-neutral-50 shadow-2xs' : 'hover:bg-neutral-50/70'
              }`}
            >
              {/* Left Column: Number & Main Title */}
              <div className="flex items-start md:items-baseline gap-4 sm:gap-10">
                <span className="text-xs sm:text-base font-inter font-bold text-neutral-400 group-hover:text-neutral-950 transition-colors duration-300 pt-1 md:pt-0">
                  {stepNumber}
                </span>

                <div>
                  <h3 className="font-sora text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-neutral-950 group-hover:text-blue-600 transition-colors duration-300">
                    <a
                      href={`/services/${targetSlug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleServiceClick(service);
                      }}
                      className="hover:underline hover:decoration-blue-400"
                    >
                      {headingTitle}
                    </a>
                  </h3>

                  <p className="text-xs sm:text-base text-neutral-600 max-w-xl mt-2 leading-relaxed font-inter font-normal">
                    {service.short_description}
                  </p>

                  {/* Capability Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                    {service.technologies?.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] sm:text-[11px] font-inter text-neutral-600 bg-white border border-neutral-200 px-2.5 py-0.5 rounded-full shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Interaction Arrow & Action Indicator */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-100">
                <span className="text-xs font-inter font-medium uppercase tracking-wider text-neutral-500 group-hover:text-neutral-950 transition-colors">
                  View Service
                </span>

                <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:text-white group-hover:bg-neutral-950 transition-all duration-300 group-hover:scale-105 shadow-2xs">
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

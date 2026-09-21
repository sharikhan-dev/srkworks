import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Sparkles, Layout, Code2, Cpu, Bot } from 'lucide-react';
import { Service } from '../../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceCTA?: (service: Service) => void;
}

export function ServicesSection({ services, onSelectServiceCTA }: ServicesSectionProps) {
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
      slug: 'ai-automation',
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
      slug: 'ai-powered-products',
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
        className="mb-16 sm:mb-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill mb-3 sm:mb-4 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-300">
            Core Expertise
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-sans">
          WHAT I BUILD
        </h2>
        <p className="text-neutral-400 text-xs sm:text-base max-w-xl mt-3 sm:mt-4 leading-relaxed">
          Disciplined design and engineering to build digital products, high-velocity websites, and autonomous intelligence systems.
        </p>
      </motion.div>

      {/* Editorial Services List — No Generic Boxed Cards */}
      <div className="border-t border-white/10 divide-y divide-white/[0.08]">
        {displayServices.map((service, index) => {
          const stepNumber = String(index + 1).padStart(2, '0');
          const isHovered = hoveredIndex === index;

          return (
            <motion.div
              key={service.id || service.slug || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSelectServiceCTA && onSelectServiceCTA(service as Service)}
              className={`group relative py-6 sm:py-12 px-2.5 sm:px-6 rounded-2xl transition-all duration-500 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 ${
                isHovered ? 'bg-white/[0.025] backdrop-blur-md' : 'hover:bg-white/[0.015]'
              }`}
            >
              {/* Left Column: Number & Main Title */}
              <div className="flex items-start md:items-baseline gap-4 sm:gap-10">
                <span className="text-xs sm:text-base font-mono font-bold text-neutral-500 group-hover:text-white transition-colors duration-300 pt-1 md:pt-0">
                  {stepNumber}
                </span>

                <div>
                  <h3 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white group-hover:text-neutral-100 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-base text-neutral-400 max-w-xl mt-2 leading-relaxed font-normal">
                    {service.short_description}
                  </p>

                  {/* Capability Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                    {service.technologies?.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] sm:text-[11px] font-mono text-neutral-400 bg-white/[0.03] border border-white/[0.06] px-2 sm:px-2.5 py-0.5 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>


              {/* Right Column: Interaction Arrow & Action Indicator */}
              <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
                  Inquire
                </span>

                <div className="w-10 h-10 rounded-full glass-pill flex items-center justify-center text-neutral-400 group-hover:text-black group-hover:bg-white transition-all duration-300 group-hover:scale-105 border border-white/10">
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

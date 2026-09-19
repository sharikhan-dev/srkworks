import { motion } from 'motion/react';
import { Compass, PenTool, Terminal, Rocket, CheckCircle2 } from 'lucide-react';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'DISCOVER',
    subtitle: 'Research & Strategy',
    icon: Compass,
    description: 'Auditing user bottlenecks, clarifying the product requirements, and mapping technical feasibility before writing code or pushing pixels.',
    deliverables: ['Product Architecture Brief', 'Technical Feasibility Map', 'User Journey Flows']
  },
  {
    step: '02',
    title: 'DESIGN',
    subtitle: 'Craft & Precision',
    icon: PenTool,
    description: 'Translating strategic insights into high-craft design systems. Mathematical spacing, typography hierarchy, and interactive prototypes in Figma.',
    deliverables: ['Clickable High-Fi Prototypes', 'Design System & Tokens', 'Interaction Specifications']
  },
  {
    step: '03',
    title: 'BUILD',
    subtitle: 'Type-Safe Engineering',
    icon: Terminal,
    description: 'Writing maintainable, modular frontend and backend code. Integrating AI pipelines, database schemas, and sub-second rendering.',
    deliverables: ['Type-Safe TypeScript Code', 'AI Pipelines & APIs', 'Clean Database Schemas']
  },
  {
    step: '04',
    title: 'LAUNCH',
    subtitle: 'Performance & Scale',
    icon: Rocket,
    description: 'Rigorous cross-browser profiling, Core Web Vitals audits, edge CDN deployments, and production telemetry monitoring.',
    deliverables: ['Edge CDN Deployment', 'Core Web Vitals Profiling', 'Telemetry & Documentation']
  }
];

export function ProcessSection() {
  return (
    <section id="process" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-white/[0.015] rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-16 sm:mb-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill mb-4 border border-white/10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-300">
            Methodology
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-sans">
          HOW I WORK
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base max-w-xl mt-4 leading-relaxed">
          A disciplined, four-phase delivery cycle that ensures mathematical clarity, zero surprises, and rapid velocity.
        </p>
      </motion.div>

      {/* Horizontal Editorial Layout on Desktop, Vertical on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {PROCESS_STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-surface glass-surface-hover rounded-3xl p-7 flex flex-col justify-between relative overflow-hidden group border border-white/10 transition-all duration-500"
            >
              {/* Step Top Header */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-white/40 group-hover:text-white transition-colors duration-300">
                    {step.step}
                  </span>

                  <div className="w-10 h-10 rounded-2xl glass-pill flex items-center justify-center text-neutral-300 group-hover:bg-white group-hover:text-black transition-all duration-300 border border-white/10">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-white mb-1 group-hover:text-neutral-100 transition-colors">
                  {step.title}
                </h3>
                <span className="text-xs font-mono text-neutral-400 block mb-4">
                  {step.subtitle}
                </span>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Deliverables Checklist */}
              <div className="pt-4 border-t border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                  Deliverables
                </span>
                {step.deliverables.map((item, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-white/60 flex-shrink-0" />
                    <span className="text-xs text-neutral-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ArrowUpRight } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export const FAQS: FAQItem[] = [
  {
    question: "How much does a website or digital project cost?",
    answer: "Pricing depends strictly on project scope, complexity, and specific requirements. A streamlined marketing landing page with custom UI/UX design and sub-second performance typically has a different budget than a full-scale web application with custom databases, CMS, and AI automations. Every proposal begins with a clear, transparent scope breakdown with zero hidden fees.",
    category: "Pricing & Scope"
  },
  {
    question: "How long does website development typically take?",
    answer: "Most custom design and web development projects launch within 2 to 4 weeks. Complex digital platforms, multi-role SaaS web apps, or deep AI pipeline integrations generally take 4 to 8 weeks depending on feedback cycles and scope iterations. Milestones and delivery dates are agreed upon before any code is written.",
    category: "Timeline"
  },
  {
    question: "Do you build responsive, mobile-first websites?",
    answer: "Yes, every website is engineered mobile-first and tested rigorously across viewports ranging from 320px smartphones to high-resolution 4K desktop displays. Layouts fluidly adapt using modern CSS grids, flexbox, and performance-tuned typography without broken elements or horizontal scrolling.",
    category: "Development"
  },
  {
    question: "Do you provide dedicated UI/UX design services?",
    answer: "Yes. UI/UX design is a core discipline at SRK Works. We produce wireframes, user flow diagrams, design systems, design tokens, and clickable high-fidelity prototypes in Figma before proceeding to development, ensuring the product looks refined and solves real user needs.",
    category: "Design"
  },
  {
    question: "Can you redesign or improve an existing website?",
    answer: "Absolutely. We routinely audit existing platforms to identify UX bottlenecks, outdated design systems, slow Core Web Vitals, and poor mobile performance. We then modernize the UI and rebuild the frontend with modern frameworks like React and TypeScript for maximum speed and conversion.",
    category: "Design & Development"
  },
  {
    question: "Do you provide post-launch website maintenance and support?",
    answer: "Yes. Post-launch support includes uptime monitoring, security updates, framework patches, performance optimization, and regular feature updates. Maintenance arrangements can be structured on an ongoing retainer or scheduled on-demand.",
    category: "Support"
  },
  {
    question: "Can you integrate AI into my website or business workflow?",
    answer: "Yes. We engineer practical AI solutions — such as smart customer support assistants trained on custom knowledge bases, automated document processing, content workflows, and event-driven automation pipelines using APIs like Gemini, OpenAI, and platforms like n8n or Make.",
    category: "AI Solutions"
  },
  {
    question: "Do you work with clients outside Delhi?",
    answer: "Yes. While SRK Works is based in Delhi, India, we work with startups, founders, creators, and businesses across India, North America, Europe, and worldwide. All collaboration is conducted smoothly via asynchronous updates, video consultations, and clear milestones.",
    category: "Location & Remote"
  },
  {
    question: "How does the collaboration process work?",
    answer: "Our process follows four disciplined phases: 1) Discover (auditing goals, mapping requirements), 2) Design (interactive Figma prototypes & systems), 3) Build (type-safe React/TypeScript engineering & AI integration), and 4) Launch (Core Web Vitals profiling, CDN setup & deployment handoff).",
    category: "Process"
  }
];

interface FAQSectionProps {
  onNavigateContact?: () => void;
}

export function FAQSection({ onNavigateContact }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Structured schema for search engine rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
      {/* Schema for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/[0.015] rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-14 sm:mb-18 text-center max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill mb-3 sm:mb-4 border border-white/10">
          <HelpCircle className="w-3.5 h-3.5 text-neutral-300" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-300">
            Common Inquiries
          </span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
          FREQUENTLY ASKED QUESTIONS
        </h2>
        <p className="text-neutral-400 text-xs sm:text-base mt-3 leading-relaxed">
          Transparent answers about process, pricing, technical capabilities, and remote collaboration.
        </p>
      </motion.div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQS.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? 'glass-surface border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
                  : 'bg-white/[0.02] hover:bg-white/[0.035] border-white/10'
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-mono text-neutral-500 font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white tracking-tight">
                    {item.question}
                  </h3>
                </div>

                <div
                  className={`w-7 h-7 rounded-full glass-pill flex items-center justify-center flex-shrink-0 transition-transform duration-300 border border-white/10 ${
                    isOpen ? 'rotate-180 bg-white text-black' : 'text-neutral-400'
                  }`}
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-white/[0.06] text-neutral-300 text-xs sm:text-sm leading-relaxed sm:pl-12">
                      <p>{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Conversion Banner below FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 p-6 sm:p-8 rounded-3xl glass-surface border border-white/10 text-center flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="text-left">
          <h3 className="text-base sm:text-lg font-bold text-white">Have a specific question not covered here?</h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">Get in touch for a detailed, no-obligation discussion about your project.</p>
        </div>
        <button
          onClick={onNavigateContact}
          className="flex-shrink-0 px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <span>Ask Directly</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </section>
  );
}

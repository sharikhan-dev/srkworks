import { motion } from 'motion/react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { Testimonial } from '../../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const publishedTestimonials = testimonials.filter((t) => t.published);
  if (publishedTestimonials.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto relative">
      <div className="text-center max-w-xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill mb-3">
          <MessageSquareQuote className="w-3.5 h-3.5 text-neutral-300" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300">
            Endorsements
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Trusted by Builders & Founders.
        </h2>
        <p className="text-neutral-400 text-sm">
          Feedback from startup leaders, product teams, and enterprise clients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {publishedTestimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-surface glass-surface-hover rounded-3xl p-7 flex flex-col justify-between"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                ))}
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed italic mb-6">
                "{t.testimonial}"
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border border-white/10"
              />
              <div>
                <h4 className="text-sm font-semibold text-white leading-tight">
                  {t.name}
                </h4>
                <span className="text-xs text-neutral-400">
                  {t.role} {t.company && `• ${t.company}`}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

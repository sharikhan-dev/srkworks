import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  MessageSquareQuote,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Building2,
  Send,
  User,
  Briefcase,
  Mail,
  MessageSquare,
  X,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Testimonial } from '../../types';
import { db } from '../../services/db';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onNavigateContact?: () => void;
}

type ViewFilter = 'all' | 'work' | 'reviews';

const CLIENT_BRANDS = [
  { name: 'Synthetix Labs', domain: 'AI & Machine Learning', metric: '84% Automated Triage' },
  { name: 'Aura Wellness', domain: 'Health & Meditation SaaS', metric: '+42% Conversion' },
  { name: 'OmniFlow Systems', domain: 'Enterprise Automation', metric: '99.9% Uptime' },
  { name: 'Top Muscle Global', domain: 'Performance E-Commerce', metric: '2.4x Session Time' },
  { name: 'Zwigato Inc.', domain: 'On-Demand Delivery', metric: '42% Faster Checkout' },
  { name: 'Vanguard Interactive', domain: 'Digital Product Agency', metric: '60% Faster Handoff' }
];

const TRUST_METRICS = [
  { value: '100%', label: '5-Star Feedback', subtext: 'Verified client reviews' },
  { value: '+40%', label: 'Average Metric Lift', subtext: 'Conversion & speed gains' },
  { value: '15+', label: 'Shipped Systems', subtext: 'Production web apps & AI' },
  { value: '0', label: 'Downtime Regressions', subtext: 'Engineered for resilience' }
];

interface ReviewFormState {
  name: string;
  role: string;
  company: string;
  email: string;
  project_worked_on: string;
  testimonial: string;
  rating: number;
}

const INITIAL_FORM: ReviewFormState = {
  name: '',
  role: '',
  company: '',
  email: '',
  project_worked_on: '',
  testimonial: '',
  rating: 5
};

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              (hovered || value) >= star
                ? 'fill-amber-300 text-amber-300'
                : 'text-neutral-600 fill-neutral-700/50'
            }`}
          />
        </button>
      ))}
      <span className="text-xs text-neutral-400 ml-1">
        {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][hovered || value]}
      </span>
    </div>
  );
}

function ReviewForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<ReviewFormState>(INITIAL_FORM);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field: keyof ReviewFormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.testimonial.trim() || form.testimonial.trim().length < 20) {
      setErrorMsg('Please provide your name and a review of at least 20 characters.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await db.submitPublicReview({
        name: form.name,
        role: form.role,
        company: form.company,
        testimonial: form.testimonial,
        rating: form.rating,
        email: form.email,
        project_worked_on: form.project_worked_on
      });
      if (res.success) {
        setStatus('success');
      } else {
        setErrorMsg(res.error || 'Failed to submit. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 px-6 text-center flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-2">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Review Submitted!</h3>
        <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
          Thank you, <span className="text-white font-semibold">{form.name}</span>! Your review has been received and will be published after a quick review.
        </p>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          Done
        </button>
      </motion.div>
    );
  }

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-white/30 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      {/* Rating */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
          Your Rating *
        </label>
        <StarRatingInput value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
      </div>

      {/* Name + Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={form.name}
              onChange={set('name')}
              placeholder="Jane Smith"
              className={`${inputClass} pl-10`}
            />
            <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
            Your Role
          </label>
          <div className="relative">
            <input
              type="text"
              value={form.role}
              onChange={set('role')}
              placeholder="Founder, CEO, CTO..."
              className={`${inputClass} pl-10`}
            />
            <Briefcase className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Company + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
            Company / Brand
          </label>
          <div className="relative">
            <input
              type="text"
              value={form.company}
              onChange={set('company')}
              placeholder="Your Company"
              className={`${inputClass} pl-10`}
            />
            <Building2 className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
            Email (private)
          </label>
          <div className="relative">
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="jane@company.com"
              className={`${inputClass} pl-10`}
            />
            <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Project */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
          Project We Worked On (optional)
        </label>
        <input
          type="text"
          value={form.project_worked_on}
          onChange={set('project_worked_on')}
          placeholder="e.g. Brand website redesign, AI automation system..."
          className={inputClass}
        />
      </div>

      {/* Review */}
      <div>
        <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
          Your Review *
        </label>
        <div className="relative">
          <textarea
            required
            rows={4}
            value={form.testimonial}
            onChange={set('testimonial')}
            minLength={20}
            placeholder="Share your experience working with Sharik — results delivered, communication, quality..."
            className={`${inputClass} resize-none pl-10 pt-2.5`}
          />
          <MessageSquare className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3 pointer-events-none" />
        </div>
        <p className="text-[11px] text-neutral-500 mt-1">
          {form.testimonial.length}/20 min characters
          {form.testimonial.length >= 20 && <span className="text-emerald-400 ml-1">✓</span>}
        </p>
      </div>

      {/* Error */}
      {(status === 'error' || errorMsg) && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span>Submit My Review</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-[11px] text-neutral-500 text-center">
        Your review will appear after approval. Email is kept private and never shared.
      </p>
    </form>
  );
}

export function TestimonialsSection({ testimonials, onNavigateContact }: TestimonialsSectionProps) {
  const [filter, setFilter] = useState<ViewFilter>('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const publishedTestimonials = testimonials.filter((t) => t.published);

  if (publishedTestimonials.length === 0) return null;

  const handleContactClick = () => {
    if (onNavigateContact) {
      onNavigateContact();
      return;
    }
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = 'contact';
    }
  };

  return (
    <section id="clients" data-section="clients" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill mb-4 border border-white/10 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-200">
            Client Work & Verified Reviews
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Proven Outcomes. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-cyan-300">
            Endorsed by Founders.
          </span>
        </h2>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Explore production web applications, high-converting platforms, and AI automations built for forward-thinking clients — paired with their authentic reviews.
        </p>
      </div>

      {/* Client Brand Marquee / Ticker */}
      <div className="mb-14 pb-8 border-b border-white/[0.06]">
        <div className="text-center mb-6">
          <p className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 flex items-center justify-center gap-2">
            <Building2 className="w-3 h-3 text-neutral-400" />
            Trusted by Leaders & High-Growth Companies
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CLIENT_BRANDS.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="glass-surface rounded-2xl p-3.5 text-center flex flex-col items-center justify-center border border-white/[0.06] hover:border-white/20 transition-all group"
            >
              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                {brand.name}
              </span>
              <span className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                {brand.domain}
              </span>
              <div className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <span>{brand.metric}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust & Impact Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-12">
        {TRUST_METRICS.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="glass-surface rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white/[0.06] flex flex-col justify-between"
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-neutral-400">
              {stat.value}
            </div>
            <div className="mt-1">
              <div className="text-xs sm:text-sm font-semibold text-neutral-200">{stat.label}</div>
              <div className="text-[11px] text-neutral-400">{stat.subtext}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Interactive Filter Pills */}
      <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
            filter === 'all'
              ? 'bg-white text-black shadow-lg shadow-white/10 font-semibold'
              : 'glass-surface text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
        >
          All Client Stories ({publishedTestimonials.length})
        </button>
        <button
          onClick={() => setFilter('work')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
            filter === 'work'
              ? 'bg-white text-black shadow-lg shadow-white/10 font-semibold'
              : 'glass-surface text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Client Deliverables & Work
        </button>
        <button
          onClick={() => setFilter('reviews')}
          className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
            filter === 'reviews'
              ? 'bg-white text-black shadow-lg shadow-white/10 font-semibold'
              : 'glass-surface text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Client Reviews & Ratings
        </button>
      </div>

      {/* Main Grid: Client Work & Reviews Showcase */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {publishedTestimonials.map((t, index) => {
            const hasWork = Boolean(t.client_project || t.project_image || t.project_outcome);

            return (
              <motion.div
                layout
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="glass-surface glass-surface-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/[0.08] hover:border-white/20 transition-all relative overflow-hidden group shadow-xl"
              >
                {/* Top Header: Company Pill + Verified Status */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/10">
                      {t.company || 'Client Partner'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  {/* 5-Star Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    ))}
                  </div>
                </div>

                {/* Mid Section: Client Work Preview (if available and not reviews-only) */}
                {hasWork && filter !== 'reviews' && (
                  <div className="mb-5 rounded-2xl overflow-hidden border border-white/10 bg-black/40 relative">
                    {t.project_image ? (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                        <img
                          src={t.project_image}
                          alt={t.client_project || 'Client Project Work'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        {/* Floating Live Link or Case Study button */}
                        {t.project_link && (
                          <a
                            href={t.project_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 hover:bg-white hover:text-black text-white text-[11px] font-medium backdrop-blur-md transition-all flex items-center gap-1 border border-white/15"
                          >
                            Explore Work <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}

                        {/* Title overlay on image */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 block">
                            Work Delivered
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-white drop-shadow-md">
                            {t.client_project}
                          </h4>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-white/[0.02]">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 block mb-1">
                          Work Delivered
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {t.client_project}
                        </h4>
                      </div>
                    )}

                    {/* Outcome / Impact Pill */}
                    {t.project_outcome && (
                      <div className="px-4 py-2.5 bg-white/[0.04] border-t border-white/[0.08] flex items-center justify-between text-xs">
                        <span className="text-neutral-400 font-mono text-[11px] flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          Delivered Metric:
                        </span>
                        <span className="font-semibold text-emerald-300 font-mono text-[11px]">
                          {t.project_outcome}
                        </span>
                      </div>
                    )}

                    {/* Deliverable Tags */}
                    {t.tags && t.tags.length > 0 && (
                      <div className="px-4 py-2 bg-black/20 border-t border-white/[0.04] flex items-center gap-1.5 flex-wrap">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono text-neutral-300 bg-white/5 px-2 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Review Text / Quote (if not work-only) */}
                {filter !== 'work' && (
                  <div className="relative mb-6">
                    <MessageSquareQuote className="w-7 h-7 text-white/10 absolute -top-3 -left-2 pointer-events-none" />
                    <p className="text-sm sm:text-base text-neutral-200 leading-relaxed italic relative z-10 pl-3 border-l-2 border-cyan-400/40">
                      "{t.testimonial}"
                    </p>
                  </div>
                )}

                {/* Client Author Info */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-white/[0.08] mt-auto">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white/15 shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white leading-tight truncate">
                      {t.name}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {t.role} {t.company && <span className="text-neutral-500">• {t.company}</span>}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Leave a Review CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 relative"
      >
        <AnimatePresence mode="wait">
          {!showReviewForm ? (
            <motion.div
              key="review-cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-surface rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-300 mb-1">
                  <Star className="w-3.5 h-3.5 fill-violet-300 text-violet-300" />
                  Leave a Review
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Worked with me recently?
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md">
                  I'd love to hear your experience. Share an honest review — it helps others make informed decisions and helps me improve.
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10 shrink-0 flex items-center gap-2 cursor-pointer"
              >
                <span>Write a Review</span>
                <Star className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="review-form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-surface rounded-3xl border border-white/10 overflow-hidden relative"
            >
              {/* Form header */}
              <div className="flex items-center justify-between p-6 sm:px-8 pb-4 border-b border-white/[0.07]">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-300 mb-0.5">
                    <Star className="w-3 h-3 fill-violet-300 text-violet-300" />
                    Client Review
                  </div>
                  <h3 className="text-lg font-bold text-white">Share Your Experience</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">Takes less than 2 minutes — reviews go live after approval</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close review form"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 sm:p-8 pt-5">
                <ReviewForm onClose={() => setShowReviewForm(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom Conversion Callout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-8 glass-surface rounded-3xl p-6 sm:p-8 border border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> High-Performance Engineering & UI/UX
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Have a project or product you want to bring to life?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Let's collaborate to design high-craft interfaces, build resilient websites, and deploy intelligent AI systems.
          </p>
        </div>

        <button
          onClick={handleContactClick}
          className="px-6 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10 shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span>Start a Project</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </motion.div>
    </section>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  CheckCircle2,
  Mail,
  MessageSquare,
  Linkedin,
  Github,
  ArrowUpRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { db } from '../../services/db';

interface ContactSectionProps {
  settings: SiteSettings;
}

const SERVICE_OPTIONS = [
  'UI/UX Design',
  'Web Development',
  'AI Automation',
  'AI-Powered Products',
  'Full Scope Design & Code'
];

export function ContactSection({ settings }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const headlineLines = (settings.contact_headline || "LET'S BUILD SOMETHING\nUSEFUL.").split('\n');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name, email, and a brief description.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await db.submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        project_type: service,
        budget: 'Not Specified',
        message: message.trim()
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setErrorMessage('Unable to submit your message right now. Please email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-white/[0.015] rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Strong Editorial Final CTA */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill mb-6 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-300">
                Direct Collaboration
              </span>
            </div>

            {/* Required Headline: LET'S BUILD SOMETHING USEFUL. */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 uppercase leading-[1.08] font-sans">
              {headlineLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>

            {/* Required Supporting Text */}
            <p className="text-sm sm:text-lg text-neutral-400 leading-relaxed mb-6 sm:mb-10 max-w-lg">
              {settings.contact_subtext ||
                'Have an idea, product or business that needs a better digital experience?'}
            </p>

            {/* Direct Channels */}
            {(settings.email || settings.whatsapp) && (
              <div className="space-y-3 mb-8 sm:mb-10">
                {settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl glass-surface glass-surface-hover border border-white/10 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl glass-pill flex items-center justify-center text-neutral-300 group-hover:text-white">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-xs text-neutral-400 block font-mono">Direct Email</span>
                        <span className="text-xs sm:text-sm font-semibold text-white break-all">{settings.email}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}

                {settings.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl glass-surface glass-surface-hover border border-white/10 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl glass-pill flex items-center justify-center text-neutral-300 group-hover:text-white">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-xs text-neutral-400 block font-mono">Instant Chat</span>
                        <span className="text-xs sm:text-sm font-semibold text-white">{settings.whatsapp}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Proposal Form */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-10 glass-surface border border-white/10 relative">
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white mb-1.5 sm:mb-2">
              Start a Conversation
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mb-5 sm:mb-6">
              Tell me about your roadmap, timeline, and goals. You'll receive a detailed response within 24 hours.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 sm:p-8 rounded-2xl bg-white/[0.04] border border-white/15 text-center my-6"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mb-2">Message Received</h4>
                <p className="text-xs sm:text-sm text-neutral-300 mb-6">
                  Thank you for reaching out. I'll review your project details and get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 text-xs font-semibold text-black bg-white rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Send Another Note
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 text-base sm:text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 text-base sm:text-sm focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Select Focus Area
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {SERVICE_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setService(opt)}
                        className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          service === opt
                            ? 'bg-white text-black font-semibold'
                            : 'bg-white/[0.03] text-neutral-400 hover:text-white border border-white/[0.06]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-1.5">
                    Project Overview *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your current product, target goals, or bottlenecks..."
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-neutral-500 text-base sm:text-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>

                {/* Required CTA: Start a Project → */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold text-black bg-white hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Sending Request...' : 'Start a Project →'}</span>
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

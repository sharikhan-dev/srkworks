import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  CheckCircle2,
  Mail,
  MessageSquare,
  Linkedin,
  Github,
  Instagram,
  ArrowUpRight,
  Sparkles,
  AlertCircle,
  X
} from 'lucide-react';
import { SiteSettings, SocialLink } from '../../types';
import { db } from '../../services/db';

interface ContactSectionProps {
  settings: SiteSettings;
  preselectedService?: string;
  socials?: SocialLink[];
}

const SERVICE_OPTIONS = [
  'Web Development',
  'UI/UX Design',
  'AI Automation',
  'AI-Powered Products',
  'Full Scope Design & Code'
];

export function ContactSection({ settings, preselectedService, socials }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(preselectedService || SERVICE_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-populate when user clicks Order on a specific service package
  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
      setMessage((prev) =>
        prev ? prev : `Hi Sharik, I would like to order/discuss the "${preselectedService}" package. Let's talk about timeline and requirements.`
      );
    }
  }, [preselectedService]);

  const instagramUrl = settings.instagram || 'https://www.instagram.com/imsharikhan/';
  const whatsappNumber = settings.whatsapp ? settings.whatsapp.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Sharik, I just submitted a project inquiry on your website!')}`
    : socials?.find((s) => s.platform.toLowerCase().includes('whatsapp'))?.url || null;

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
      setShowPopup(true);
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
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      {/* Ambient background lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-100/30 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Strong Editorial Final CTA */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 mb-6 border border-neutral-200/80 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-700 font-medium">
                Direct Collaboration
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 mb-4 sm:mb-6 uppercase leading-[1.08] font-sora">
              {headlineLines.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6 sm:mb-10 max-w-lg font-inter">
              {settings.contact_subtext ||
                'Have an idea, product or business that needs a better digital experience?'}
            </p>

            {/* Direct Channels */}
            <div className="space-y-3 mb-8 sm:mb-10">
              {/* Official Instagram Profile */}
              <a
                href="https://www.instagram.com/imsharikhan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Direct message Sharik Khan on Instagram @imsharikhan"
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200/80 group cursor-pointer transition-all shadow-2xs hover:border-neutral-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:text-pink-600 group-hover:border-pink-200 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-neutral-500 block font-inter">Instagram Direct</span>
                    <span className="text-xs sm:text-sm font-semibold text-neutral-950 font-inter">@imsharikhan</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200/80 group cursor-pointer transition-all shadow-2xs hover:border-neutral-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:text-neutral-950">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs text-neutral-500 block font-inter">Direct Email</span>
                      <span className="text-xs sm:text-sm font-semibold text-neutral-950 break-all font-inter">{settings.email}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}

              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200/80 group cursor-pointer transition-all shadow-2xs hover:border-neutral-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 group-hover:text-emerald-600">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs text-neutral-500 block font-inter">Instant Chat</span>
                      <span className="text-xs sm:text-sm font-semibold text-neutral-950 font-inter">{settings.whatsapp}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Proposal Form */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl sm:rounded-3xl p-5 sm:p-10 bg-white border border-neutral-200/80 shadow-xs relative">
            <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-neutral-950 mb-1.5 sm:mb-2 font-sora">
              Start a Conversation
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 mb-5 sm:mb-6 font-inter">
              Tell me about your roadmap, timeline, and goals. You'll receive a detailed response within 24 hours.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 sm:p-8 rounded-2xl bg-neutral-50 border border-neutral-200 text-center my-6"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base sm:text-lg font-bold text-neutral-950 mb-2 font-sora">Query Sent to Our Team</h4>
                <p className="text-xs sm:text-sm text-neutral-600 mb-5 leading-relaxed font-inter">
                  Thank you! Your query has been sent to our team. We will review your project requirements and contact you shortly.
                </p>

                {/* Fast-reply channels */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200 mb-6 text-left">
                  <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-mono uppercase tracking-wider text-amber-600 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>For a Faster Reply:</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mb-3 font-inter">
                    Reach out directly on Instagram or WhatsApp for immediate response:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 text-xs font-semibold transition-all group cursor-pointer font-inter"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-600 group-hover:scale-110 transition-transform" />
                      <span>Instagram</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all group cursor-pointer font-inter"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                        <span>WhatsApp</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 font-inter">
                  <button
                    onClick={() => setShowPopup(true)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer border border-neutral-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setShowPopup(false);
                    }}
                    className="px-5 py-2 text-xs font-semibold text-white bg-neutral-950 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
                  >
                    Send Another Note
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] sm:text-xs font-inter font-medium uppercase tracking-wider text-neutral-600 block mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 placeholder-neutral-400 text-base sm:text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] sm:text-xs font-inter font-medium uppercase tracking-wider text-neutral-600 block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 placeholder-neutral-400 text-base sm:text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-inter font-medium uppercase tracking-wider text-neutral-600 block mb-2">
                    Select Focus Area
                  </label>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {SERVICE_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setService(opt)}
                        className={`px-3 py-1.5 rounded-full text-xs font-inter transition-all cursor-pointer ${service === opt
                            ? 'bg-neutral-950 text-white font-semibold shadow-xs'
                            : 'bg-neutral-100 text-neutral-600 hover:text-neutral-950 border border-neutral-200 hover:bg-neutral-200/60'
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-inter font-medium uppercase tracking-wider text-neutral-600 block mb-1.5">
                    Project Overview *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your current product, target goals, or bottlenecks..."
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-950 placeholder-neutral-400 text-base sm:text-sm focus:outline-none focus:border-neutral-900 focus:bg-white transition-colors resize-none"
                  />
                </div>

                {/* CTA: Start a Project → */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer font-inter"
                >
                  <span>{isSubmitting ? 'Sending Request...' : 'Start a Project →'}</span>
                  {!isSubmitting && <Send className="w-4 h-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* POPUP MODAL: INQUIRY SENT CONFIRMATION & FAST REPLY CHANNELS */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0e1017]/95 border border-white/15 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-center overflow-hidden"
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close popup"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              {/* Headline */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                Query Sent to Our Team!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                Your query has been sent to our team. We will review your project details and contact you shortly.
              </p>

              {/* Fast-reply channels */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 mb-6 text-left">
                <div className="flex items-center gap-1.5 mb-1.5 text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>For a Fast Reply:</span>
                </div>
                <p className="text-xs text-neutral-400 mb-3.5">
                  Need immediate response? Reach out directly via Instagram or WhatsApp:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/25 text-xs font-semibold transition-all group cursor-pointer"
                  >
                    <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                    <span>Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/25 text-xs font-semibold transition-all group cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>WhatsApp</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowPopup(false);
                  setSubmitted(false);
                }}
                className="w-full py-3 px-6 rounded-full text-xs sm:text-sm font-semibold text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg active:scale-[0.99]"
              >
                Send Another Message
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

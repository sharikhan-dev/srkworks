import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  Layout,
  Cpu,
  Layers,
  HelpCircle,
  FolderGit2
} from 'lucide-react';
import { Service, SiteSettings } from '../../types';

interface ServicesStorePageProps {
  services: Service[];
  settings: SiteSettings;
  onNavigate: (target: string) => void;
  onSelectServiceOrder?: (service: Service) => void;
}

export function ServicesStorePage({
  services,
  settings,
  onNavigate,
  onSelectServiceOrder
}: ServicesStorePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Update SEO head tags for store / pricing page
  useEffect(() => {
    document.title = 'Services & Pricing | SRK Works Digital Store';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Transparent pricing and fixed-scope packages for custom web development, UI/UX design, and AI automation. Guaranteed delivery times.'
      );
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://srkworks.vercel.app/services');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'All') return services;
    return services.filter(
      (s) => s.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [services, selectedCategory]);

  const handleOrderService = (service: Service) => {
    if (onSelectServiceOrder) {
      onSelectServiceOrder(service);
    } else {
      // Navigate to contact with hash and service pre-selection
      onNavigate(`contact?service=${encodeURIComponent(service.title)}`);
    }
  };

  // eCommerce Store Schema.org JSON-LD
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "SRK Works Digital Services & Packages",
    "description": "Fixed-scope design, development, and AI packages with transparent pricing.",
    "itemListElement": services.map((s, idx) => ({
      "@type": "Offer",
      "position": idx + 1,
      "name": s.title,
      "description": s.short_description || s.detailed_description,
      "price": (s.price || s.starting_price || '').replace(/[^0-9]/g, '') || undefined,
      "priceCurrency": "USD",
      "itemOffered": {
        "@type": "Service",
        "name": s.title,
        "description": s.short_description
      }
    }))
  };

  return (
    <article className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative text-white">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-mono text-neutral-400">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <span className="text-white font-semibold">Services &amp; Pricing Store</span>
      </nav>

      {/* Back button */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Homepage</span>
        </button>
      </div>

      {/* Hero Header */}
      <header className="mb-14 sm:mb-20 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill mb-4 border border-white/10">
          <ShoppingBag className="w-3.5 h-3.5 text-neutral-300" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-300">
            eCommerce Service Store
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 uppercase leading-[1.08]">
          SERVICES &amp; FIXED-SCOPE PACKAGES
        </h1>

        <p className="text-sm sm:text-lg text-neutral-300 leading-relaxed font-light">
          Transparent pricing, guaranteed turnaround timelines, and production-grade engineering. Choose a curated package or customize scope to your roadmap.
        </p>

        {/* Value Prop Badges Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-1.5 glass-pill px-3 py-1 rounded-full border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Code Ownership
          </span>
          <span className="flex items-center gap-1.5 glass-pill px-3 py-1 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Guaranteed Delivery Dates
          </span>
          <span className="flex items-center gap-1.5 glass-pill px-3 py-1 rounded-full border border-white/10">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Sub-Second Vitals Standard
          </span>
        </div>
      </header>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-full transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.25)]'
                  : 'glass-pill text-neutral-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* eCommerce Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
        {filteredServices.map((service, index) => {
          const price = service.price || service.starting_price || 'Custom Scope';
          const delivery = service.delivery_time || '7 - 14 Days';
          const badge = service.badge;

          let img = service.image_url || service.cover_image;
          if (!img || img === '/hero-sculpture.jpg') {
            const slug = (service.slug || '').toLowerCase();
            const cat = (service.category || '').toLowerCase();
            if (slug.includes('web') || cat.includes('web')) img = '/service-webdev.jpg';
            else if (slug.includes('ui') || slug.includes('ux') || cat.includes('design')) img = '/service-uiux.jpg';
            else if (slug.includes('ai') || cat.includes('ai')) img = '/og-image.jpg';
            else img = '/hero-sculpture.jpg';
          }

          return (
            <motion.div
              key={service.id || index}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="rounded-3xl glass-surface glass-surface-hover border border-white/10 overflow-hidden flex flex-col justify-between group transition-all duration-500 hover:border-white/25 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
            >
              <div>
                {/* Product Cover Image with eCommerce Overlays */}
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900 border-b border-white/10">
                  <img
                    src={img}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-transparent to-black/30 pointer-events-none" />

                  {/* Ribbon Badge */}
                  {badge && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-black shadow-lg">
                        {badge}
                      </span>
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="glass-pill px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider text-neutral-200 border border-white/15">
                      {service.category || 'Package'}
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-neutral-400 block">Package Price</span>
                      <span className="text-xl sm:text-2xl font-extrabold text-white font-mono drop-shadow">
                        {price}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 glass-pill px-2.5 py-1 rounded-full border border-white/15 text-neutral-200 text-xs font-mono">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{delivery}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2 group-hover:text-neutral-100 transition-colors">
                    {service.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                    {service.short_description || service.detailed_description}
                  </p>

                  {/* Included Deliverables Checklist */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2 mb-6 pt-4 border-t border-white/[0.08]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                        What's Included:
                      </span>
                      {service.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech stack pills */}
                  {service.technologies && service.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {service.technologies.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono text-neutral-400 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => handleOrderService(service)}
                  className="w-full py-3 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(255,255,255,0.3)] active:scale-98 cursor-pointer"
                >
                  <span>{service.cta_label || 'Order Service Package'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {service.slug && (
                  <button
                    onClick={() => onNavigate(`services/${service.slug}`)}
                    className="w-full py-2 text-center text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View In-Depth Technical Scope →
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Custom Scope / Enterprise Consultation Banner */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent border border-white/15 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 glass-pill px-3 py-1 rounded-full border border-white/10 mb-4 inline-block">
            Need a Bespoke Solution?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Have Custom Architecture or Multiple Requirements?
          </h2>
          <p className="text-neutral-300 text-xs sm:text-base mb-6 leading-relaxed">
            If your project involves multi-tenant architectures, proprietary AI pipelines, or complex design sprints, we prepare tailored fixed-cost proposals within 24 hours.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3.5 rounded-full bg-white text-black text-xs sm:text-sm font-semibold hover:bg-neutral-200 transition-all shadow-[0_0_35px_rgba(255,255,255,0.3)] inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Request Custom Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </article>
  );
}

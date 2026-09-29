import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Service } from '../../types';

interface ServiceStoreSectionProps {
  services: Service[];
  onNavigate: (target: string) => void;
  onSelectServiceOrder?: (service: Service) => void;
}

export function ServiceStoreSection({
  services,
  onNavigate,
  onSelectServiceOrder
}: ServiceStoreSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Filter categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return ['All', ...Array.from(set)];
  }, [services]);

  const filteredServices = useMemo(() => {
    if (activeCategory === 'All') return services;
    return services.filter(
      (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [services, activeCategory]);

  const handleOrderService = (service: Service) => {
    if (onSelectServiceOrder) {
      onSelectServiceOrder(service);
    } else {
      onNavigate(`contact?service=${encodeURIComponent(service.title)}`);
    }
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-white/[0.015] rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-pill mb-3 sm:mb-4 border border-white/10">
            <ShoppingBag className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-neutral-300">
              Transparent Pricing &amp; Packages
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-sans">
            PACKAGES &amp; PRICING
          </h2>
          <p className="text-neutral-400 text-xs sm:text-base max-w-xl mt-3 sm:mt-4 leading-relaxed">
            Transparent fixed-cost packages. Guaranteed delivery turnarounds, complete source code ownership, and zero hidden fees.
          </p>
        </div>

        {/* View full store link + category filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={() => onNavigate('store')}
            className="text-xs font-mono text-neutral-300 hover:text-white glass-pill px-4 py-2 rounded-full border border-white/10 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Full Store Page</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* eCommerce Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredServices.slice(0, 6).map((service, index) => {
          const price = service.price || service.starting_price || 'Custom Scope';
          const delivery = service.delivery_time || '7 - 14 Days';
          const img = service.image_url || service.cover_image || '/hero-sculpture.jpg';
          const badge = service.badge;

          return (
            <motion.div
              key={service.id || index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
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
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2 group-hover:text-neutral-100 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
                    {service.short_description || service.detailed_description}
                  </p>

                  {/* Included Deliverables Checklist */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2 mb-4 pt-4 border-t border-white/[0.08]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                        Key Deliverables:
                      </span>
                      {service.features.slice(0, 4).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => handleOrderService(service)}
                  className="w-full py-3 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.15)] active:scale-98 cursor-pointer"
                >
                  <span>{service.cta_label || 'Order Service Package'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {service.slug && (
                  <button
                    onClick={() => onNavigate(`services/${service.slug}`)}
                    className="w-full py-1.5 text-center text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    View Technical Scope →
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

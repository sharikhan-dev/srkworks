import { useState, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowUp,
  ArrowDown,
  X,
  Layers,
  Cpu,
  Layout,
  Code2,
  Bot,
  Upload,
  Image as ImageIcon,
  Clock,
  Tag,
  DollarSign,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Service } from '../../types';
import { db } from '../../services/db';

interface ServicesManagerProps {
  services: Service[];
  onRefresh: () => void;
}

const AVAILABLE_ICONS = [
  'Layout',
  'Code2',
  'Bot',
  'Cpu',
  'Sparkles',
  'Layers',
  'Smartphone',
  'ShieldCheck',
  'Zap'
];

const CATEGORY_PRESETS = [
  'Web Development',
  'UI/UX Design',
  'AI Automation',
  'Full-Stack Solution',
  'E-Commerce',
  'Consulting & Audit'
];

const BADGE_PRESETS = [
  '',
  'Most Popular',
  'Best Value',
  'Turnkey',
  'High Craft',
  'High ROI',
  'All-In-One',
  'Enterprise',
  'Limited Availability'
];

export function ServicesManager({ services, onRefresh }: ServicesManagerProps) {
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (msg: string, type: 'success' | 'error') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateNew = () => {
    setEditingService({
      title: '',
      slug: '',
      category: 'Web Development',
      badge: 'Most Popular',
      price: '$999',
      starting_price: '$999',
      delivery_time: '7 - 14 Days',
      image_url: '/hero-sculpture.jpg',
      cover_image: '/hero-sculpture.jpg',
      icon: 'Code2',
      short_description: '',
      detailed_description: '',
      features: [
        'Mobile-First Responsive Engineering',
        'Sub-Second Core Web Vitals (<1s)',
        'Full Technical SEO & Structured Data',
        'Direct Developer Support'
      ],
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      cta_label: 'Order Package',
      display_order: services.length + 1,
      featured: false,
      enabled: true
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await db.uploadImage(file, 'project-images');
      setEditingService((prev) =>
        prev
          ? {
              ...prev,
              image_url: url,
              cover_image: url
            }
          : null
      );
      showFeedback('Service package image uploaded successfully!', 'success');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      showFeedback(err?.message || 'Failed to upload image.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title?.trim()) {
      showFeedback('Please provide a service package title.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Service> & { title: string } = {
        ...editingService,
        title: editingService.title.trim(),
        price: (editingService.price || editingService.starting_price || '').trim(),
        starting_price: (editingService.price || editingService.starting_price || '').trim(),
        image_url: (editingService.image_url || editingService.cover_image || '').trim(),
        cover_image: (editingService.image_url || editingService.cover_image || '').trim()
      };

      await db.saveService(payload);
      setEditingService(null);
      showFeedback(`Service "${payload.title}" saved & synchronized with Supabase!`, 'success');
      onRefresh();
    } catch (err: any) {
      console.error('Error saving service:', err);
      showFeedback(err?.message || 'Failed to save service.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service package?')) {
      try {
        await db.deleteService(id);
        showFeedback('Service package deleted.', 'success');
        onRefresh();
      } catch (err: any) {
        showFeedback(err?.message || 'Failed to delete service.', 'error');
      }
    }
  };

  const handleToggleEnabled = async (service: Service) => {
    await db.saveService({
      ...service,
      enabled: !service.enabled
    });
    onRefresh();
  };

  const handleToggleFeatured = async (service: Service) => {
    await db.saveService({
      ...service,
      featured: !service.featured
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-mono flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <span>{feedback.msg}</span>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>eCommerce Service Store &amp; Pricing</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Live in Supabase
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Create and sell digital services with custom pricing, turnaround times, showcase images, and deliverable checklists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            type="button"
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 glass-pill hover:text-white border border-white/10 hover:border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Refresh from Supabase"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service Package</span>
          </button>
        </div>
      </div>

      {/* Services Grid (eCommerce Card Preview) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <div className="col-span-full py-16 text-center glass-surface rounded-2xl border border-white/10">
            <div className="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center text-neutral-400 mx-auto mb-3">
              <DollarSign className="w-6 h-6" />
            </div>
            <p className="text-neutral-400 text-sm">No service packages created yet.</p>
            <button
              onClick={handleCreateNew}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Add First Service
            </button>
          </div>
        ) : (
          services.map((serv) => {
            const img = serv.image_url || serv.cover_image;
            const price = serv.price || serv.starting_price || 'Custom';
            const delivery = serv.delivery_time || '7 - 14 Days';

            return (
              <div
                key={serv.id}
                className={`rounded-3xl p-5 glass-surface border ${
                  serv.enabled ? 'border-white/10 hover:border-white/25' : 'border-white/5 opacity-60'
                } flex flex-col justify-between transition-all duration-300 relative overflow-hidden`}
              >
                <div>
                  {/* Top Image Preview + Category Banner */}
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-neutral-900 border border-white/5">
                    {img ? (
                      <img
                        src={img}
                        alt={serv.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02] text-neutral-500">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-[10px] font-mono">No Image Uploaded</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Badge Chip */}
                    {serv.badge && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white text-black shadow-md">
                          {serv.badge}
                        </span>
                      </div>
                    )}

                    {/* Price Tag in Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-white font-mono bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15">
                        {price}
                      </span>
                      <span className="text-xs font-mono text-neutral-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        {delivery}
                      </span>
                    </div>
                  </div>

                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                        {serv.category || 'Service Package'}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                        {serv.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleToggleFeatured(serv)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          serv.featured ? 'text-amber-400 bg-amber-400/10' : 'text-neutral-600 hover:text-neutral-400'
                        }`}
                        title={serv.featured ? 'Featured Package' : 'Mark as Featured'}
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleToggleEnabled(serv)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          serv.enabled ? 'text-emerald-400 bg-emerald-400/10' : 'text-neutral-600'
                        }`}
                        title={serv.enabled ? 'Active & Published' : 'Disabled (Hidden)'}
                      >
                        {serv.enabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-4 line-clamp-2">
                    {serv.short_description || serv.detailed_description}
                  </p>

                  {/* What is Included checklist preview */}
                  {serv.features && serv.features.length > 0 && (
                    <div className="space-y-1.5 mb-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                        Included Deliverables ({serv.features.length})
                      </span>
                      {serv.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="text-[11px] text-neutral-300 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                      {serv.features.length > 3 && (
                        <span className="text-[10px] font-mono text-neutral-500 block pt-0.5">
                          + {serv.features.length - 3} more deliverables
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Controls */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-400">
                    Order: #{serv.display_order} · {serv.cta_label || 'Order Service'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingService(serv)}
                      className="px-3 py-1.5 rounded-xl glass-pill text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 cursor-pointer border border-white/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(serv.id)}
                      className="p-1.5 rounded-xl glass-pill text-neutral-500 hover:text-red-400 cursor-pointer border border-white/10"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit / Create Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#10121a] border border-white/15 rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingService.id ? 'Edit Service Package' : 'Create New Service Package'}
                </h3>
                <p className="text-xs text-neutral-400">
                  Configure package details, price, showcase image, and deliverables.
                </p>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-full glass-pill cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* 1. SERVICE IMAGE (Upload or Paste URL) */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <label className="text-xs font-mono uppercase text-neutral-300 block font-medium">
                  Service Package Showcase Image *
                </label>

                {editingService.image_url || editingService.cover_image ? (
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10 bg-neutral-900 group">
                    <img
                      src={editingService.image_url || editingService.cover_image}
                      alt="Service preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-white text-black text-xs font-semibold cursor-pointer"
                      >
                        Replace Image
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingService({ ...editingService, image_url: '', cover_image: '' })
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-red-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 px-4 rounded-xl border border-dashed border-white/15 text-center flex flex-col items-center justify-center bg-white/[0.01]">
                    <ImageIcon className="w-8 h-8 text-neutral-500 mb-2" />
                    <p className="text-xs text-neutral-400 mb-3">Upload package graphic or enter image URL</p>
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading...' : 'Choose Image File'}</span>
                    </button>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingService.image_url || editingService.cover_image || ''}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        image_url: e.target.value,
                        cover_image: e.target.value
                      })
                    }
                    placeholder="Or paste direct image URL (e.g. /hero-sculpture.jpg or https://...)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* 2. TITLE & CATEGORY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, title: e.target.value })
                    }
                    placeholder="e.g. Custom MVP Web Development"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                    Category *
                  </label>
                  <select
                    value={editingService.category || 'Web Development'}
                    onChange={(e) =>
                      setEditingService({ ...editingService, category: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141620] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 cursor-pointer"
                  >
                    {CATEGORY_PRESETS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. PRICE & DELIVERY TIME & BADGE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                    Price (Selling / Starting) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.price || editingService.starting_price || ''}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: e.target.value,
                        starting_price: e.target.value
                      })
                    }
                    placeholder="e.g. $1,200 or ₹85,000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                    Turnaround / Delivery Time
                  </label>
                  <input
                    type="text"
                    value={editingService.delivery_time || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, delivery_time: e.target.value })
                    }
                    placeholder="e.g. 7 - 14 Days"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                    Ribbon Badge
                  </label>
                  <select
                    value={editingService.badge || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, badge: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141620] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 cursor-pointer"
                  >
                    {BADGE_PRESETS.map((b) => (
                      <option key={b} value={b}>
                        {b || 'No Badge'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4. SHORT DESCRIPTION */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                  Short Tagline (eCommerce Card Summary) *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.short_description || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, short_description: e.target.value })
                  }
                  placeholder="e.g. Fast, responsive, and type-safe modern website engineered with sub-second Core Web Vitals."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              {/* 5. DETAILED DESCRIPTION */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                  Detailed Scope &amp; Deliverables
                </label>
                <textarea
                  rows={3}
                  value={editingService.detailed_description || ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      detailed_description: e.target.value
                    })
                  }
                  placeholder="Comprehensive explanation of what the client receives upon booking..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 resize-none"
                />
              </div>

              {/* 6. WHAT IS INCLUDED (DELIVERABLE CHECKLIST) */}
              <div>
                <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                  Key Deliverables / Checklist (comma separated)
                </label>
                <textarea
                  rows={2}
                  value={editingService.features?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  placeholder="Mobile-First Responsive Layouts, Sub-Second Vitals, Supabase DB Setup, 14 Days Support"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 resize-none"
                />
              </div>

              {/* 7. TECHNOLOGIES & CTA LABEL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingService.technologies?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })
                    }
                    placeholder="React 19, TypeScript, Tailwind CSS, Supabase"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={editingService.cta_label || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, cta_label: e.target.value })
                    }
                    placeholder="e.g. Order Service or Book Sprint"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* 8. DISPLAY ORDER & TOGGLES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-mono uppercase text-neutral-300 block mb-1 font-medium">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingService.display_order ?? 1}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        display_order: parseInt(e.target.value, 10) || 1
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="service-featured"
                    checked={editingService.featured ?? false}
                    onChange={(e) =>
                      setEditingService({ ...editingService, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-white bg-white/10 border-white/20 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="service-featured" className="text-xs text-neutral-300 cursor-pointer font-medium">
                    Featured on Store
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="service-enabled"
                    checked={editingService.enabled ?? true}
                    onChange={(e) =>
                      setEditingService({ ...editingService, enabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-white bg-white/10 border-white/20 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="service-enabled" className="text-xs text-neutral-300 cursor-pointer font-medium">
                    Published &amp; Active
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl glass-pill text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSaving ? 'Saving to Supabase...' : 'Save Service Package'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
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
  Bot
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

export function ServicesManager({ services, onRefresh }: ServicesManagerProps) {
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateNew = () => {
    setEditingService({
      title: '',
      icon: 'Cpu',
      short_description: '',
      detailed_description: '',
      features: ['Enterprise Support', 'Production Delivery', 'Documentation'],
      technologies: ['TypeScript', 'AI APIs'],
      starting_price: '₹35,000',
      cta_label: 'Inquire Service',
      display_order: services.length + 1,
      featured: false,
      enabled: true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title?.trim()) return;

    setIsSaving(true);
    try {
      await db.saveService(editingService as any);
      setEditingService(null);
      onRefresh();
    } catch (err) {
      console.error('Error saving service:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      await db.deleteService(id);
      onRefresh();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Services & Offerings</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure current and future services dynamically. Changes appear immediately on the public website.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((serv) => (
          <div
            key={serv.id}
            className={`rounded-2xl p-6 glass-surface border ${
              serv.enabled ? 'border-white/10' : 'border-white/5 opacity-60'
            } flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl glass-pill flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{serv.title}</h3>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Icon: {serv.icon} • Order: {serv.display_order}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleFeatured(serv)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      serv.featured ? 'text-amber-400 bg-amber-400/10' : 'text-neutral-600 hover:text-neutral-400'
                    }`}
                    title={serv.featured ? 'Featured Service' : 'Mark as Featured'}
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleEnabled(serv)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      serv.enabled ? 'text-emerald-400 bg-emerald-400/10' : 'text-neutral-600'
                    }`}
                    title={serv.enabled ? 'Enabled' : 'Disabled'}
                  >
                    {serv.enabled ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-neutral-300 font-medium italic mb-2">
                "{serv.short_description}"
              </p>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                {serv.detailed_description}
              </p>

              {serv.features && serv.features.length > 0 && (
                <div className="space-y-1 mb-4">
                  {serv.features.map((f, i) => (
                    <div key={i} className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-300">
                {serv.starting_price ? `Starts ${serv.starting_price}` : 'Custom Pricing'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingService(serv)}
                  className="p-1.5 rounded-lg glass-pill text-neutral-400 hover:text-white"
                  title="Edit Service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(serv.id)}
                  className="p-1.5 rounded-lg glass-pill text-red-400 hover:text-red-300"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#10121a] border border-white/15 rounded-3xl p-6 sm:p-8 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 text-neutral-400 hover:text-white rounded-full glass-pill"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, title: e.target.value })
                    }
                    placeholder="e.g. AI Agents & Workflows"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                    Icon Name
                  </label>
                  <select
                    value={editingService.icon || 'Cpu'}
                    onChange={(e) =>
                      setEditingService({ ...editingService, icon: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#141620] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                  Tagline / Short Summary *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.short_description || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, short_description: e.target.value })
                  }
                  placeholder="e.g. Autonomous AI workflows designed for real-world operations."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService.detailed_description || ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      detailed_description: e.target.value
                    })
                  }
                  placeholder="In-depth explanation of how this service is delivered..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                    Starting Price
                  </label>
                  <input
                    type="text"
                    value={editingService.starting_price || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, starting_price: e.target.value })
                    }
                    placeholder="e.g. ₹35,000"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                    Button CTA Label
                  </label>
                  <input
                    type="text"
                    value={editingService.cta_label || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, cta_label: e.target.value })
                    }
                    placeholder="e.g. Request AI Workflow"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                  Key Features (comma separated)
                </label>
                <input
                  type="text"
                  value={editingService.features?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      features: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  placeholder="Feature 1, Feature 2, Feature 3"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
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
                  placeholder="Python, Gemini API, Supabase Functions"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingService.enabled ?? true}
                    onChange={(e) =>
                      setEditingService({ ...editingService, enabled: e.target.checked })
                    }
                    className="rounded bg-white/10 border-white/20 text-white"
                  />
                  <span>Enabled (Visible on public site)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                  <input
                    type="checkbox"
                    checked={editingService.featured ?? false}
                    onChange={(e) =>
                      setEditingService({ ...editingService, featured: e.target.checked })
                    }
                    className="rounded bg-white/10 border-white/20 text-white"
                  />
                  <span>Popular / Featured Badge</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl glass-pill text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200"
                >
                  {isSaving ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

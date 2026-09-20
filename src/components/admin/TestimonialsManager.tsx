import { useState, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  MessageSquareQuote,
  Upload,
  ExternalLink,
  X,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Testimonial } from '../../types';
import { db } from '../../services/db';

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

export function TestimonialsManager({ testimonials, onRefresh }: TestimonialsManagerProps) {
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Testimonial | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectImgInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNew = () => {
    setTagsInput('');
    setEditingItem({
      name: '',
      role: '',
      company: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      testimonial: '',
      rating: 5,
      published: true,
      display_order: testimonials.length + 1,
      client_project: '',
      project_outcome: '',
      project_image: '',
      project_link: '',
      tags: []
    });
  };

  const handleStartEdit = (t: Testimonial) => {
    setTagsInput((t.tags || []).join(', '));
    setEditingItem({ ...t });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'avatar' | 'project_image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await db.uploadImage(file, 'testimonial-images');
      setEditingItem((prev) => (prev ? { ...prev, [targetField]: publicUrl } : null));
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.testimonial) return;

    setIsSaving(true);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await db.saveTestimonial({
        ...editingItem,
        tags: parsedTags
      } as any);

      setEditingItem(null);
      onRefresh();
    } catch (err) {
      console.error('Failed to save testimonial:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsSaving(true);
    try {
      await db.deleteTestimonial(itemToDelete.id);
      setItemToDelete(null);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.08] p-5 sm:p-6 rounded-3xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <MessageSquareQuote className="w-5 h-5 text-cyan-400" />
            Client Work & Testimonials CMS
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your client deliverables, outcome metrics, and verified reviews shown in the Client Work section.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all cursor-pointer shadow-lg shadow-white/10"
        >
          <Plus className="w-4 h-4" />
          Add Client Story / Review
        </button>
      </div>

      {/* Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="glass-surface rounded-3xl p-5 sm:p-6 border border-white/[0.08] flex flex-col justify-between hover:border-white/20 transition-all group"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/15"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-xs text-neutral-400">
                      {item.role} {item.company && `• ${item.company}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      item.published
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-neutral-500/10 text-neutral-400 border border-white/10'
                    }`}
                  >
                    {item.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(item.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-300 text-amber-300" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs text-neutral-300 italic line-clamp-3 mb-4 pl-2.5 border-l-2 border-cyan-400/30">
                "{item.testimonial}"
              </p>

              {/* Work Deliverable Preview if exists */}
              {item.client_project && (
                <div className="mb-4 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-cyan-300 uppercase tracking-wider text-[9px]">
                      Delivered Project
                    </span>
                    {item.project_outcome && (
                      <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {item.project_outcome}
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-white truncate">{item.client_project}</div>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/[0.06]">
              <button
                onClick={() => handleStartEdit(item)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Edit Client Story"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setItemToDelete(item)}
                className="p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#0f1118] border border-white/10 rounded-3xl w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {editingItem.id ? 'Edit Client Story & Review' : 'New Client Story & Review'}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Client Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1.5 font-medium">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1.5 font-medium">Role / Executive Title</label>
                  <input
                    type="text"
                    value={editingItem.role || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. Founder & CEO"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1.5 font-medium">Company Name</label>
                  <input
                    type="text"
                    value={editingItem.company || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="e.g. Aura Wellness"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1.5 font-medium">Star Rating (1 - 5)</label>
                  <select
                    value={editingItem.rating || 5}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full bg-[#161822] border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:border-white/30 focus:outline-none"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              {/* Avatar URL or Upload */}
              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">Client Avatar Headshot URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingItem.avatar || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, avatar: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'avatar')}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {isUploading ? '...' : 'Upload'}
                  </button>
                </div>
              </div>

              {/* Testimonial Quote */}
              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">Client Review / Testimonial *</label>
                <textarea
                  required
                  rows={3}
                  value={editingItem.testimonial || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, testimonial: e.target.value })}
                  placeholder="Share what the client said about your craftsmanship, communication, and outcomes..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Work Deliverables Section */}
              <div className="pt-3 border-t border-white/10">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-3">
                  Delivered Work & Outcomes (Optional)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1.5 font-medium">Deliverable / Project Title</label>
                    <input
                      type="text"
                      value={editingItem.client_project || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, client_project: e.target.value })}
                      placeholder="e.g. Aura Meditation Web App"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1.5 font-medium">Delivered Metric / Outcome</label>
                    <input
                      type="text"
                      value={editingItem.project_outcome || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, project_outcome: e.target.value })}
                      placeholder="e.g. +42% Conversion Rate"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-neutral-400 mb-1.5 font-medium">Project Preview Screenshot URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingItem.project_image || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, project_image: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
                      />
                      <input
                        type="file"
                        ref={projectImgInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'project_image')}
                      />
                      <button
                        type="button"
                        onClick={() => projectImgInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {isUploading ? '...' : 'Upload'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1.5 font-medium">Live Work / Case Study Link</label>
                    <input
                      type="text"
                      value={editingItem.project_link || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, project_link: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-neutral-400 mb-1.5 font-medium">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Next.js, UI/UX Design, Streaming AI"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>

              {/* Published Toggle */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-neutral-300 font-medium">Publish on Live Website</span>
                <button
                  type="button"
                  onClick={() => setEditingItem({ ...editingItem, published: !editingItem.published })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    editingItem.published ? 'bg-emerald-500' : 'bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editingItem.published ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Client Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12141d] border border-red-500/20 rounded-3xl w-full max-w-md p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Delete Client Review?</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Are you sure you want to remove the review and work entry for <span className="text-white font-semibold">{itemToDelete.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors cursor-pointer text-xs"
              >
                {isSaving ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

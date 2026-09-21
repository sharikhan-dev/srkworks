import { useState, useEffect } from 'react';
import {
  User,
  Plus,
  Trash2,
  Check,
  Upload,
  BarChart3
} from 'lucide-react';
import { AboutSettings, AboutMetric } from '../../types';
import { db } from '../../services/db';

interface AboutManagerProps {
  about: AboutSettings;
  onRefresh: () => void;
}

export function AboutManager({ about, onRefresh }: AboutManagerProps) {
  const [formData, setFormData] = useState<AboutSettings>(about);
  const [newSkillTag, setNewSkillTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFormData(about);
  }, [about]);

  const handleAddSkill = () => {
    if (!newSkillTag.trim()) return;
    if (!formData.skills_tags.includes(newSkillTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills_tags: [...prev.skills_tags, newSkillTag.trim()]
      }));
    }
    setNewSkillTag('');
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills_tags: prev.skills_tags.filter((_, i) => i !== index)
    }));
  };

  const handleMetricChange = (index: number, key: keyof AboutMetric, value: string) => {
    const updated = [...formData.metrics];
    updated[index] = { ...updated[index], [key]: value };
    setFormData({ ...formData, metrics: updated });
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await db.uploadImage(file, 'profile-images');
      setFormData((prev) => ({ ...prev, profile_image: url }));
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await db.updateAboutSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      onRefresh();
    } catch (err) {
      console.error('Error saving about section:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-neutral-300" />
            <span>About Section CMS</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Edit your philosophy statement, professional introduction, core capability pills, and metric numbers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <User className="w-4 h-4" />}
          <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved Live!' : 'Save About'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Headings & Narrative */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Narrative & Philosophy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                Badge Label
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="The Philosophy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                Main Heading
              </label>
              <input
                type="text"
                value={formData.heading}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                placeholder="DESIGN × CODE × AI"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
              Short Introduction (High impact)
            </label>
            <textarea
              rows={2}
              value={formData.introduction}
              onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              placeholder="I combine UI/UX design, frontend development, AI, automation, and creative technology."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={formData.detailed_description}
              onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
              placeholder="Guided by Apple-inspired restraint and engineering discipline..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Core Capabilities Skills Pills */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Capability Tags / Pills
          </h3>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillTag}
              onChange={(e) => setNewSkillTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Add skill tag (e.g. Design Systems, Next.js, Supabase)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tag</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {formData.skills_tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 text-xs font-mono text-neutral-300 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(idx)}
                  className="text-neutral-500 hover:text-red-400 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Metrics Cards Editor */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-neutral-300" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Editorial Metrics (Right Column Cards)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {formData.metrics.map((metric, idx) => (
              <div key={metric.id || idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block">
                      Label
                    </label>
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-neutral-400 block">
                      Value / Number
                    </label>
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs font-bold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block">
                    Subtext
                  </label>
                  <input
                    type="text"
                    value={metric.subtext}
                    onChange={(e) => handleMetricChange(idx, 'subtext', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-neutral-300 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Image & CTA */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Profile Image & Action Button
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-3">
              {formData.profile_image ? (
                <img
                  src={formData.profile_image}
                  alt="About Profile"
                  className="w-14 h-14 rounded-xl object-cover border border-white/10"
                />
              ) : null}
              <div className="space-y-1 flex-1">
                <input
                  type="text"
                  value={formData.profile_image}
                  onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                  placeholder="Image URL"
                  className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs"
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-md glass-pill text-[11px] text-neutral-300 hover:text-white">
                  <Upload className="w-3 h-3" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                  CTA Label
                </label>
                <input
                  type="text"
                  value={formData.cta_text}
                  onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  placeholder="Work With Me"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                  CTA URL
                </label>
                <input
                  type="text"
                  value={formData.cta_url}
                  onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                  placeholder="#contact"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

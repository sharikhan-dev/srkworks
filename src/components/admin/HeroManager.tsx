import { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Upload,
  Check,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  ExternalLink
} from 'lucide-react';
import { HeroSettings, HeroPhrase } from '../../types';
import { db } from '../../services/db';

interface HeroManagerProps {
  hero: HeroSettings;
  onRefresh: () => void;
}

export function HeroManager({ hero, onRefresh }: HeroManagerProps) {
  const [formData, setFormData] = useState<HeroSettings>(hero);
  const [newPhraseText, setNewPhraseText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFormData(hero);
  }, [hero]);

  const handleAddPhrase = () => {
    if (!newPhraseText.trim()) return;
    const newPhrase: HeroPhrase = {
      id: `hp-${Date.now()}`,
      text: newPhraseText.trim().toUpperCase(),
      enabled: true,
      display_order: formData.phrases.length + 1
    };
    setFormData((prev) => ({
      ...prev,
      phrases: [...prev.phrases, newPhrase]
    }));
    setNewPhraseText('');
  };

  const handleTogglePhrase = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      phrases: prev.phrases.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    }));
  };

  const handleDeletePhrase = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      phrases: prev.phrases.filter((p) => p.id !== id)
    }));
  };

  const handleMovePhrase = (index: number, direction: 'up' | 'down') => {
    const list = [...formData.phrases];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    list.forEach((item, idx) => {
      item.display_order = idx + 1;
    });
    setFormData((prev) => ({ ...prev, phrases: list }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await db.uploadImage(file, 'profile-images');
      setFormData((prev) => ({ ...prev, hero_image: url }));
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
      await db.updateHeroSettings(formData);
      // Also sync phrases into site_settings.hero_phrases for backward compatibility
      await db.updateSiteSettings({
        title_badge: formData.eyebrow,
        headline: formData.headline,
        hero_phrases: formData.phrases.filter((p) => p.enabled).map((p) => p.text),
        hero_supporting_text: formData.supporting_text,
        primary_cta_label: formData.primary_cta_label,
        secondary_cta_label: formData.secondary_cta_label,
        profile_image: formData.hero_image
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      onRefresh();
    } catch (err) {
      console.error('Error saving hero:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-neutral-300" />
            <span>Hero Section CMS</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage your opening headline, dynamic rotating phrases carousel, supporting text, and action buttons.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved Live!' : 'Save Hero'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Core Headlines */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Headline & Copy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={formData.eyebrow}
                onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                placeholder="HEY, I'M SHARIK"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                Static Main Heading
              </label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="I CREATE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
              Supporting Narrative Description
            </label>
            <textarea
              rows={3}
              value={formData.supporting_text}
              onChange={(e) => setFormData({ ...formData, supporting_text: e.target.value })}
              placeholder="Designing digital experiences, building modern websites..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Dynamic Phrases Carousel Editor */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Dynamic Rotating Phrases
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                These phrases animate continuously beneath "I CREATE" on the public homepage.
              </p>
            </div>
          </div>

          {/* Add Phrase Input */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newPhraseText}
              onChange={(e) => setNewPhraseText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPhrase();
                }
              }}
              placeholder="e.g. AI AUTOMATIONS"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 uppercase"
            />
            <button
              type="button"
              onClick={handleAddPhrase}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phrase</span>
            </button>
          </div>

          {/* Phrases List */}
          <div className="divide-y divide-white/[0.06] pt-2">
            {formData.phrases.map((phrase, idx) => (
              <div
                key={phrase.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-white/[0.01] px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-neutral-500 w-5">0{idx + 1}</span>
                  <input
                    type="text"
                    value={phrase.text}
                    onChange={(e) => {
                      const updated = [...formData.phrases];
                      updated[idx].text = e.target.value.toUpperCase();
                      setFormData({ ...formData, phrases: updated });
                    }}
                    className={`bg-transparent text-xs font-bold font-mono tracking-wider focus:outline-none border-b border-transparent focus:border-white/30 text-white uppercase ${
                      !phrase.enabled ? 'opacity-40 line-through' : ''
                    }`}
                  />
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMovePhrase(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMovePhrase(idx, 'down')}
                    disabled={idx === formData.phrases.length - 1}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTogglePhrase(phrase.id)}
                    className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer ${
                      phrase.enabled ? 'text-emerald-400' : 'text-neutral-500'
                    }`}
                    title={phrase.enabled ? 'Enabled' : 'Disabled'}
                  >
                    {phrase.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePhrase(phrase.id)}
                    className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                    title="Delete Phrase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons & URLs */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Call to Action Buttons
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-neutral-300 block font-medium">
                Primary CTA (Dark / White Button)
              </label>
              <input
                type="text"
                value={formData.primary_cta_label}
                onChange={(e) => setFormData({ ...formData, primary_cta_label: e.target.value })}
                placeholder="View My Work"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
              <input
                type="text"
                value={formData.primary_cta_url}
                onChange={(e) => setFormData({ ...formData, primary_cta_url: e.target.value })}
                placeholder="#work or URL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 font-mono"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-neutral-300 block font-medium">
                Secondary CTA (Glass Pill)
              </label>
              <input
                type="text"
                value={formData.secondary_cta_label}
                onChange={(e) => setFormData({ ...formData, secondary_cta_label: e.target.value })}
                placeholder="Let's Work Together"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
              <input
                type="text"
                value={formData.secondary_cta_url}
                onChange={(e) => setFormData({ ...formData, secondary_cta_url: e.target.value })}
                placeholder="#contact or URL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Hero Visual Image */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Hero Visual Image
          </h3>

          <div className="flex items-center gap-4">
            {formData.hero_image ? (
              <img
                src={formData.hero_image}
                alt="Hero Visual"
                className="w-16 h-16 rounded-xl object-cover border border-white/10"
              />
            ) : null}

            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={formData.hero_image}
                onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                placeholder="/hero-sculpture.jpg or image URL"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-pill text-xs text-neutral-300 hover:text-white">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Uploading...' : 'Upload New Hero Visual'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

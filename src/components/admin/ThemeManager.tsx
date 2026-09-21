import { useState, useEffect } from 'react';
import {
  Palette,
  Check,
  RotateCcw,
  Sparkles,
  Type,
  Maximize2
} from 'lucide-react';
import { ThemeSettings } from '../../types';
import { db } from '../../services/db';
import { THEME_PRESETS } from '../../services/seedData';

interface ThemeManagerProps {
  theme: ThemeSettings;
  onRefresh: () => void;
}

const FONT_OPTIONS: Array<ThemeSettings['heading_font']> = [
  'Plus Jakarta Sans',
  'Inter',
  'Manrope',
  'DM Sans',
  'Space Grotesk'
];

const WEIGHT_OPTIONS = [
  { label: 'Normal (400)', value: 'font-normal' as const },
  { label: 'Medium (500)', value: 'font-medium' as const },
  { label: 'SemiBold (600)', value: 'font-semibold' as const },
  { label: 'Bold (700)', value: 'font-bold' as const },
  { label: 'ExtraBold (800)', value: 'font-extrabold' as const }
];

const RADIUS_OPTIONS = [
  { label: 'Sharp (0px)', value: 'rounded-none' as const },
  { label: 'Compact (8px)', value: 'rounded-lg' as const },
  { label: 'Smooth (16px)', value: 'rounded-2xl' as const },
  { label: 'Large (24px)', value: 'rounded-3xl' as const },
  { label: 'Full Pill', value: 'rounded-full' as const }
];

export function ThemeManager({ theme, onRefresh }: ThemeManagerProps) {
  const [formData, setFormData] = useState<ThemeSettings>(theme);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(theme);
  }, [theme]);

  const handleSelectPreset = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      setFormData({
        ...preset,
        preset: presetKey as any
      });
    }
  };

  const handleColorChange = (key: keyof ThemeSettings, val: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: val,
      preset: 'custom'
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await db.updateThemeSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      onRefresh();
    } catch (err) {
      console.error('Error saving theme:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-neutral-300" />
            <span>Theme & Visual Styling</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Customize site colors, surface transparency, typography fonts, and border styles. Values are applied in real-time via CSS variables.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaving ? 'Saving Theme...' : saveSuccess ? 'Saved Live!' : 'Save Theme'}</span>
        </button>
      </div>

      {/* 1. PREDEFINED THEMES */}
      <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              1. Theme Presets
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select an Apple-grade curated color harmony or build a Custom Theme.
            </p>
          </div>
          <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/15">
            Active: {formData.preset}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {Object.entries(THEME_PRESETS).map(([key, p]) => {
            const isSelected = formData.preset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between h-24 ${
                  isSelected
                    ? 'border-white bg-white/10 shadow-md ring-1 ring-white/50'
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-white capitalize">{key}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                </div>

                {/* Color swatches preview */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: p.background_color }}
                    title="Background"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: p.primary_color }}
                    title="Primary"
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: p.accent_color }}
                    title="Accent"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. LIVE PREVIEW */}
      <div className="rounded-2xl border border-white/10 p-6 space-y-4" style={{ backgroundColor: formData.background_color }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Real-Time Theme Preview</span>
          </span>
          <span className="text-[11px] text-neutral-400 font-mono">
            Previewing CSS Variables
          </span>
        </div>

        <div
          className="p-6 sm:p-8 rounded-2xl border transition-all duration-300 space-y-4"
          style={{
            backgroundColor: formData.surface_color,
            borderColor: formData.border_color,
            fontFamily: formData.heading_font
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-mono uppercase px-3 py-1 rounded-full border"
              style={{
                color: formData.accent_color,
                borderColor: formData.border_color,
                backgroundColor: 'rgba(255, 255, 255, 0.03)'
              }}
            >
              Editorial Showcase
            </span>
            <span className="text-xs font-mono" style={{ color: formData.secondary_text_color }}>
              2026
            </span>
          </div>

          <h4
            className={`text-2xl sm:text-3xl tracking-tight transition-colors ${formData.font_weight}`}
            style={{ color: formData.text_color }}
          >
            Zwigato — Food Delivery Architecture
          </h4>

          <p
            className="text-xs sm:text-sm leading-relaxed max-w-xl font-normal"
            style={{ color: formData.secondary_text_color, fontFamily: formData.body_font }}
          >
            Designing digital experiences, building modern websites, and creating AI-powered systems with sub-second responsiveness.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="px-5 py-2 text-xs font-semibold rounded-full transition-transform active:scale-95 shadow-sm"
              style={{
                backgroundColor: formData.primary_color,
                color: formData.background_color
              }}
            >
              View Case Study ↗
            </button>
            <button
              type="button"
              className="px-5 py-2 text-xs font-medium rounded-full border transition-colors"
              style={{
                borderColor: formData.border_color,
                color: formData.text_color,
                backgroundColor: 'rgba(255, 255, 255, 0.04)'
              }}
            >
              Inquire Service
            </button>
          </div>
        </div>
      </div>

      {/* 3. COLOR PICKERS */}
      <form onSubmit={handleSave} className="space-y-8">
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              2. Palette & Color Controls
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Click any color swatch to pick a color or manually enter a HEX / RGBA string.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {/* Background Color */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.background_color.startsWith('#') ? formData.background_color : '#07080a'}
                  onChange={(e) => handleColorChange('background_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.background_color}
                  onChange={(e) => handleColorChange('background_color', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {/* Primary Color */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Primary / Button CTA
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primary_color.startsWith('#') ? formData.primary_color : '#ffffff'}
                  onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primary_color}
                  onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Accent Highlight
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.accent_color.startsWith('#') ? formData.accent_color : '#38bdf8'}
                  onChange={(e) => handleColorChange('accent_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.accent_color}
                  onChange={(e) => handleColorChange('accent_color', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {/* Surface / Card Color */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Surface / Card (RGBA)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value="#161822"
                  onChange={(e) => handleColorChange('surface_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.surface_color}
                  onChange={(e) => handleColorChange('surface_color', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {/* Main Text Color */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Main Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.text_color.startsWith('#') ? formData.text_color : '#ffffff'}
                  onChange={(e) => handleColorChange('text_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.text_color}
                  onChange={(e) => handleColorChange('text_color', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {/* Secondary Text Color */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Secondary Text (Muted)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondary_text_color.startsWith('#') ? formData.secondary_text_color : '#94a3b8'}
                  onChange={(e) => handleColorChange('secondary_text_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondary_text_color}
                  onChange={(e) => handleColorChange('secondary_text_color', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {/* Border Color */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Border & Dividers
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value="#262626"
                  onChange={(e) => handleColorChange('border_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.border_color}
                  onChange={(e) => handleColorChange('border_color', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            {/* Secondary Accent */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.secondary_color.startsWith('#') ? formData.secondary_color : '#a1a1aa'}
                  onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  className="w-9 h-9 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondary_color}
                  onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4. TYPOGRAPHY SETTINGS */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Type className="w-4 h-4 text-neutral-300" />
              <span>3. Typography & Corner Radius</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Select premium Google Fonts and typography styling. Only chosen fonts are loaded.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {/* Heading Font */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Heading Font
              </label>
              <select
                value={formData.heading_font}
                onChange={(e) =>
                  setFormData({ ...formData, heading_font: e.target.value as any, preset: 'custom' })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 cursor-pointer"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font} value={font} className="bg-[#161822]">
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Body Font */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Body Font
              </label>
              <select
                value={formData.body_font}
                onChange={(e) =>
                  setFormData({ ...formData, body_font: e.target.value as any, preset: 'custom' })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 cursor-pointer"
              >
                {FONT_OPTIONS.filter((f) => f !== 'Space Grotesk').map((font) => (
                  <option key={font} value={font} className="bg-[#161822]">
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Weight */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Heading Weight
              </label>
              <select
                value={formData.font_weight}
                onChange={(e) =>
                  setFormData({ ...formData, font_weight: e.target.value as any, preset: 'custom' })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 cursor-pointer"
              >
                {WEIGHT_OPTIONS.map((w) => (
                  <option key={w.value} value={w.value} className="bg-[#161822]">
                    {w.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Border Radius */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block">
                Border Radius Style
              </label>
              <select
                value={formData.border_radius}
                onChange={(e) =>
                  setFormData({ ...formData, border_radius: e.target.value as any, preset: 'custom' })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161822] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 cursor-pointer"
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value} className="bg-[#161822]">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer save button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => handleSelectPreset('default')}
            className="px-4 py-2.5 rounded-xl glass-pill text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors shadow-md cursor-pointer flex items-center gap-2"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Sparkles className="w-4 h-4" />}
            <span>{isSaving ? 'Saving Theme...' : saveSuccess ? 'Saved to Supabase!' : 'Save Theme & Styling'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

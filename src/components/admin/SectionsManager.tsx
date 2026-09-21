import { useState, useEffect } from 'react';
import {
  Layers,
  Check,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { SectionVisibility } from '../../types';
import { db } from '../../services/db';

interface SectionsManagerProps {
  visibility: SectionVisibility;
  onRefresh: () => void;
}

const SECTION_CONFIG = [
  { key: 'hero' as const, label: 'Hero Section', description: 'Opening dynamic title, typography carousel, and call-to-actions.' },
  { key: 'services' as const, label: 'Services Section', description: 'Curated technical capabilities, starting prices, and offerings.' },
  { key: 'projects' as const, label: 'Projects / Work Section', description: 'Large editorial case study showcase cards with external links.' },
  { key: 'about' as const, label: 'About / Philosophy Section', description: 'Core principles, bio statement, capability tags, and metric stats.' },
  { key: 'process' as const, label: 'Process Section', description: '4-step engineering and design methodology (Discover, Design, Build, Launch).' },
  { key: 'automation' as const, label: 'AI Automation Interactive Simulator', description: 'Interactive visual workflow diagram simulator.' },
  { key: 'testimonials' as const, label: 'Client Work & Reviews Section', description: 'Showcase of client deliverables, tangible metrics, and verified reviews & ratings.' },
  { key: 'contact' as const, label: 'Contact Section', description: 'Direct email, WhatsApp triggers, and contact message submission form.' },
  { key: 'footer' as const, label: 'Footer', description: 'Bottom brand wordmark, social links, and scroll-to-top button.' }
];

export function SectionsManager({ visibility, onRefresh }: SectionsManagerProps) {
  const [formData, setFormData] = useState<SectionVisibility>(visibility);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(visibility);
  }, [visibility]);

  const handleToggle = (key: keyof SectionVisibility) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await db.updateSectionVisibility(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      onRefresh();
    } catch (err) {
      console.error('Error saving section visibility:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-neutral-300" />
            <span>Section Visibility & Layout</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Turn sections ON or OFF instantly. Disabled sections disappear from the public website in real time without code modifications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Sparkles className="w-4 h-4" />}
          <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved Live!' : 'Save Visibility'}</span>
        </button>
      </div>

      <div className="rounded-2xl glass-surface border border-white/10 divide-y divide-white/[0.06] overflow-hidden">
        {SECTION_CONFIG.map(({ key, label, description }) => {
          const isEnabled = formData[key] ?? true;
          return (
            <div
              key={key}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.015] transition-colors"
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm font-semibold text-white">{label}</h4>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isEnabled
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-neutral-800 text-neutral-400 border-white/10'
                    }`}
                  >
                    {isEnabled ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl">{description}</p>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleToggle(key)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  isEnabled ? 'bg-white justify-end' : 'bg-white/10 justify-start'
                }`}
                title={isEnabled ? 'Click to Disable' : 'Click to Enable'}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-all ${
                    isEnabled ? 'bg-black shadow-sm' : 'bg-neutral-400'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Menu,
  Plus,
  Trash2,
  Check,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Navigation
} from 'lucide-react';
import { NavbarSettings, NavItem } from '../../types';
import { db } from '../../services/db';

interface NavbarManagerProps {
  navbar: NavbarSettings;
  onRefresh: () => void;
}

export function NavbarManager({ navbar, onRefresh }: NavbarManagerProps) {
  const [formData, setFormData] = useState<NavbarSettings>(navbar);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(navbar);
  }, [navbar]);

  const handleAddNavItem = () => {
    if (!newLabel.trim()) return;
    const item: NavItem = {
      id: `nav-${Date.now()}`,
      label: newLabel.trim(),
      url: newUrl.trim() || `#${newLabel.trim().toLowerCase()}`,
      enabled: true,
      display_order: formData.nav_items.length + 1
    };
    setFormData((prev) => ({
      ...prev,
      nav_items: [...prev.nav_items, item]
    }));
    setNewLabel('');
    setNewUrl('');
  };

  const handleToggleItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      nav_items: prev.nav_items.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i))
    }));
  };

  const handleDeleteItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      nav_items: prev.nav_items.filter((i) => i.id !== id)
    }));
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const list = [...formData.nav_items];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const temp = list[index];
    list[index] = list[target];
    list[target] = temp;
    list.forEach((item, idx) => {
      item.display_order = idx + 1;
    });
    setFormData((prev) => ({ ...prev, nav_items: list }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await db.updateNavbarSettings(formData);
      // Keep site settings in sync
      if (formData.brand_name || formData.logo_initial) {
        await db.updateSiteSettings({
          name: formData.brand_name,
          logo_initial: formData.logo_initial
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      onRefresh();
    } catch (err) {
      console.error('Error saving navbar:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-neutral-300" />
            <span>Navbar & Navigation CMS</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure brand name wordmark, circular logo initial, navigation pills, and header action button.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Navigation className="w-4 h-4" />}
          <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved Live!' : 'Save Navbar'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand & CTA Settings */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Branding & Action
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                Brand Name (Desktop Wordmark)
              </label>
              <input
                type="text"
                value={formData.brand_name}
                onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                placeholder="SHARIK KHAN"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                Logo Initial
              </label>
              <input
                type="text"
                maxLength={2}
                value={formData.logo_initial}
                onChange={(e) => setFormData({ ...formData, logo_initial: e.target.value.toUpperCase() })}
                placeholder="S"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 uppercase font-bold text-center"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-300 block mb-1.5 font-medium">
                CTA Button Text
              </label>
              <input
                type="text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Let's Talk"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="rounded-2xl glass-surface border border-white/10 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Navigation Links
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Add custom pages, smooth scroll anchors (e.g. #work, #services, #about, #contact), or external links.
            </p>
          </div>

          {/* Add Navigation Link */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Label (e.g. Work, Blog)"
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
            />
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Anchor / URL (e.g. #work)"
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 font-mono"
            />
            <button
              type="button"
              onClick={handleAddNavItem}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Link</span>
            </button>
          </div>

          {/* Nav Items List */}
          <div className="divide-y divide-white/[0.06] pt-3">
            {formData.nav_items.map((item, idx) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-white/[0.01] px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-neutral-500 w-5">0{idx + 1}</span>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...formData.nav_items];
                      updated[idx].label = e.target.value;
                      setFormData({ ...formData, nav_items: updated });
                    }}
                    className="px-2 py-1 rounded bg-transparent border-b border-transparent focus:border-white/30 text-white text-xs font-medium focus:outline-none w-32"
                  />
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => {
                      const updated = [...formData.nav_items];
                      updated[idx].url = e.target.value;
                      setFormData({ ...formData, nav_items: updated });
                    }}
                    className="px-2 py-1 rounded bg-transparent border-b border-transparent focus:border-white/30 text-neutral-400 text-xs font-mono focus:outline-none flex-1 max-w-xs"
                  />
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move Up"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveItem(idx, 'down')}
                    disabled={idx === formData.nav_items.length - 1}
                    className="p-1 text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    title="Move Down"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleItem(item.id)}
                    className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1 cursor-pointer ${
                      item.enabled ? 'text-emerald-400' : 'text-neutral-500'
                    }`}
                    title={item.enabled ? 'Enabled' : 'Disabled'}
                  >
                    {item.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

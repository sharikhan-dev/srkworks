import { useState, useEffect } from 'react';
import {
  Share2,
  Plus,
  Trash2,
  Check,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { SocialLink } from '../../types';
import { db } from '../../services/db';

interface SocialLinksManagerProps {
  socials: SocialLink[];
  onRefresh: () => void;
}

const COMMON_PLATFORMS = [
  'Instagram',
  'LinkedIn',
  'GitHub',
  'Behance',
  'X',
  'Email',
  'Dribbble',
  'YouTube',
  'Custom'
];

export function SocialLinksManager({ socials, onRefresh }: SocialLinksManagerProps) {
  const [links, setLinks] = useState<SocialLink[]>(socials);
  const [platform, setPlatform] = useState('Instagram');
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLinks(socials);
  }, [socials]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsSaving(true);
    try {
      await db.saveSocialLink({
        platform,
        label: label.trim() || platform,
        url: url.trim(),
        enabled: true,
        display_order: links.length + 1
      });
      setUrl('');
      setLabel('');
      onRefresh();
    } catch (err) {
      console.error('Error saving social link:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async (item: SocialLink) => {
    await db.saveSocialLink({
      ...item,
      enabled: !item.enabled
    });
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await db.deleteSocialLink(id);
    onRefresh();
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-neutral-300" />
            <span>Social Links CMS</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage your external social profiles and email links displayed in the footer and contact sections.
          </p>
        </div>
      </div>

      {/* Add New Link Form */}
      <form onSubmit={handleAdd} className="rounded-2xl glass-surface border border-white/10 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Add Social Link
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value);
                if (!label) setLabel(e.target.value);
              }}
              className="w-full px-3 py-2 rounded-xl bg-[#161822] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 cursor-pointer"
            >
              {COMMON_PLATFORMS.map((p) => (
                <option key={p} value={p} className="bg-[#161822]">
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
              Display Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Behance"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
              Profile URL or mailto:
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Adding...' : 'Add Link'}</span>
          </button>
        </div>
      </form>

      {/* Links List */}
      <div className="rounded-2xl glass-surface border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-neutral-400 font-mono uppercase">
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Label</th>
                <th className="py-3 px-4">URL</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {links.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-neutral-500">
                    No social links configured. Add your first link above.
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {link.platform}
                    </td>
                    <td className="py-3 px-4 text-neutral-300">
                      {link.label || link.platform}
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-400 max-w-xs truncate">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors inline-flex items-center gap-1"
                      >
                        <span className="truncate">{link.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 text-neutral-500" />
                      </a>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(link)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${
                          link.enabled
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {link.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{link.enabled ? 'Active' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(link.id)}
                        className="p-1.5 rounded-lg glass-pill text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

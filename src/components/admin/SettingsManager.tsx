import { useState, useEffect } from 'react';
import {
  Save,
  Check,
  Copy,
  Database,
  Globe,
  Upload,
  Shield,
  Sparkles,
  Link,
  CheckCircle2,
  RefreshCw,
  Code
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { db } from '../../services/db';
import {
  saveCustomSupabaseConfig,
  getSupabaseConnectionInfo,
  testSupabaseConnection
} from '../../lib/supabase';

interface SettingsManagerProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export function SettingsManager({ settings, onRefresh }: SettingsManagerProps) {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // Sync state whenever settings prop updates
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Supabase Custom Config State
  const connInfo = getSupabaseConnectionInfo();
  const [supabaseUrl, setSupabaseUrl] = useState(() => {
    try {
      return localStorage.getItem('aura_custom_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
    } catch {
      return import.meta.env.VITE_SUPABASE_URL || '';
    }
  });
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(() => {
    try {
      return localStorage.getItem('aura_custom_supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    } catch {
      return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    }
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [supabaseStatusMsg, setSupabaseStatusMsg] = useState('');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await db.updateSiteSettings(formData);
      setSaveSuccess(true);
      setFeedbackMsg('Site settings saved and synchronized with Navbar & Hero!');
      setTimeout(() => {
        setSaveSuccess(false);
        setFeedbackMsg('');
      }, 3500);
      onRefresh();
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSyncWithSeedData = () => {
    if (window.confirm('Reload settings from src/services/seedData.ts? This will update settings to match your code file.')) {
      db.resetToSeedData('settings');
      onRefresh();
      setSaveSuccess(true);
      setFeedbackMsg('Reloaded settings from seedData.ts code file!');
      setTimeout(() => {
        setSaveSuccess(false);
        setFeedbackMsg('');
      }, 3500);
    }
  };

  const handleCopyCode = () => {
    const code = `export const INITIAL_SITE_SETTINGS: SiteSettings = ${JSON.stringify(formData, null, 2)};`;
    navigator.clipboard.writeText(code);
    setFeedbackMsg('Copied INITIAL_SITE_SETTINGS code to clipboard! You can paste it into seedData.ts.');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await db.uploadImage(file, 'profile-images');
      setFormData((prev) => ({ ...prev, profile_image: url }));
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleCopySql = () => {
    const sql = db.generateSupabaseSQL();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleConnectSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setSupabaseStatusMsg('Connecting and verifying Supabase access...');
    try {
      saveCustomSupabaseConfig(supabaseUrl, supabaseAnonKey);
      const testResult = await testSupabaseConnection();
      setSupabaseStatusMsg(testResult.message);
      onRefresh();
    } catch (err: any) {
      setSupabaseStatusMsg(`Connection failed: ${err?.message || err}`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* SECTION 1: GENERAL BRAND & HERO */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">Brand & Site Settings</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Customize your headlines, availability, links, and SEO metadata.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <button
              type="button"
              onClick={handleSyncWithSeedData}
              className="px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 glass-pill hover:text-white border border-white/10 hover:border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reload settings directly from src/services/seedData.ts"
            >
              <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
              <span>Sync with seedData.ts</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 glass-pill hover:text-white border border-white/10 hover:border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy current settings as TypeScript code to paste into seedData.ts"
            >
              <Code className="w-3.5 h-3.5 text-neutral-400" />
              <span>Copy as Code</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-neutral-200 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Saved Successfully</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Site Settings'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Identity & Availability */}
        <div className="p-6 rounded-2xl glass-surface border border-white/10 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-300" />
            <span>Personal Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="SHARIK KHAN"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                Logo / Initial
              </label>
              <input
                type="text"
                maxLength={2}
                value={formData.logo_initial || 'S'}
                onChange={(e) => setFormData({ ...formData, logo_initial: e.target.value.toUpperCase() })}
                placeholder="S"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 font-bold uppercase text-center"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                Short Professional Title
              </label>
              <input
                type="text"
                value={formData.short_title || ''}
                onChange={(e) => setFormData({ ...formData, short_title: e.target.value })}
                placeholder="UI/UX Designer & AI Engineer"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco, CA / Remote"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                Availability Status
              </label>
              <input
                type="text"
                value={formData.availability_status || ''}
                onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
                placeholder="Available for selected projects"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
              Profile Image
            </label>
            <div className="flex items-center gap-4">
              <img
                src={formData.profile_image}
                alt="Profile avatar"
                className="w-12 h-12 rounded-full object-cover border border-white/10 bg-neutral-900"
              />
              <input
                type="text"
                value={formData.profile_image || ''}
                onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                placeholder="Image URL"
                className="flex-grow px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
              <label className="cursor-pointer px-3.5 py-2 rounded-xl glass-pill text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 flex-shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                Primary Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                WhatsApp / Phone
              </label>
              <input
                type="text"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+1 (555) 234-8900"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>
        </div>

        {/* SEO & Social Sharing Metadata */}
        <div className="p-6 rounded-2xl glass-surface border border-white/10 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-neutral-300" />
            <span>SEO & Social Sharing Metadata</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                Website Title (&lt;title&gt;)
              </label>
              <input
                type="text"
                value={formData.seo_title || ''}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="SHARIK KHAN — Digital Product Designer & AI Engineer"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                Favicon URL
              </label>
              <input
                type="text"
                value={formData.favicon_url || ''}
                onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                placeholder="/favicon.ico or https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
              Meta Description
            </label>
            <textarea
              rows={2}
              value={formData.seo_description || ''}
              onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                Social Sharing Title (og:title)
              </label>
              <input
                type="text"
                value={formData.social_title || ''}
                onChange={(e) => setFormData({ ...formData, social_title: e.target.value })}
                placeholder="SHARIK KHAN — Portfolio"
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
                OG Cover Image (og:image)
              </label>
              <input
                type="text"
                value={formData.og_image || ''}
                onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-neutral-400 block mb-1">
              Social Sharing Description (og:description)
            </label>
            <textarea
              rows={2}
              value={formData.social_description || ''}
              onChange={(e) => setFormData({ ...formData, social_description: e.target.value })}
              placeholder="Summary shown when link is shared on Twitter, LinkedIn, etc."
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 resize-none"
            />
          </div>
        </div>
      </form>

      {/* SECTION 2: SUPABASE DATABASE ARCHITECTURE & ONE-CLICK SQL EXPORT */}
      <div className="p-6 rounded-2xl glass-surface border border-white/10 space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Supabase Cloud Integration & Schema Exporter</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Connect directly to your live Supabase project, or copy the automated PostgreSQL setup script.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-mono flex items-center gap-1.5 ${
                connInfo.hasConfig
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{connInfo.hasConfig ? 'Supabase Connected' : 'Local Persistence (Active)'}</span>
            </span>
          </div>
        </div>

        {/* Custom Supabase Credentials Input */}
        <form onSubmit={handleConnectSupabase} className="space-y-4 pt-2 border-t border-white/10">
          <span className="text-xs font-mono uppercase text-neutral-300 block">
            Direct Supabase Project Connection
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            {supabaseStatusMsg && (
              <span className="text-xs text-emerald-400">{supabaseStatusMsg}</span>
            )}
            <button
              type="submit"
              disabled={isConnecting}
              className="ml-auto px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              Save & Test Connection
            </button>
          </div>
        </form>

        {/* Copy SQL Script */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-white block">
              1-Click Supabase PostgreSQL Schema & RLS Setup
            </span>
            <p className="text-[11px] text-neutral-400">
              Includes tables (projects, services, skills, testimonials, messages), storage buckets, and public/admin Row Level Security policies.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="px-4 py-2 rounded-xl glass-pill text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-1.5 flex-shrink-0"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Supabase SQL Script</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

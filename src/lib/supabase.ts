import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getStoredSupabaseConfig = () => {
  try {
    const customUrl = localStorage.getItem('aura_custom_supabase_url');
    const customKey = localStorage.getItem('aura_custom_supabase_anon_key');
    if (customUrl && customKey) {
      return { url: customUrl, anonKey: customKey, isCustom: true };
    }
  } catch {
    // ignore
  }
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return {
    url: envUrl || '',
    anonKey: envKey || '',
    isCustom: false
  };
};

let cachedClient: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }
  const key = `${config.url}_${config.anonKey}`;
  if (!cachedClient || currentConfigKey !== key) {
    try {
      cachedClient = createClient(config.url, config.anonKey);
      currentConfigKey = key;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return cachedClient;
}

export function isSupabaseConfigured(): boolean {
  const config = getStoredSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

export function getSupabaseConnectionInfo() {
  const config = getStoredSupabaseConfig();
  return {
    hasConfig: Boolean(config.url && config.anonKey),
    url: config.url ? `${config.url.substring(0, 24)}...` : '',
    isCustom: config.isCustom
  };
}

export function saveCustomSupabaseConfig(url: string, anonKey: string) {
  if (!url || !anonKey) {
    localStorage.removeItem('aura_custom_supabase_url');
    localStorage.removeItem('aura_custom_supabase_anon_key');
  } else {
    localStorage.setItem('aura_custom_supabase_url', url.trim());
    localStorage.setItem('aura_custom_supabase_anon_key', anonKey.trim());
  }
  cachedClient = null;
}

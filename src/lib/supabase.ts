import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getStoredSupabaseConfig = () => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

  // If env variables are configured, they are the primary source of truth across all devices
  if (envUrl && envKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      isCustom: false
    };
  }

  // Fallback to locally stored credentials if not present in env
  try {
    const customUrl = localStorage.getItem('aura_custom_supabase_url');
    const customKey = localStorage.getItem('aura_custom_supabase_anon_key');
    if (customUrl && customKey) {
      return { url: customUrl.trim(), anonKey: customKey.trim(), isCustom: true };
    }
  } catch {
    // ignore
  }

  // Production hardcoded fallback — ensures the live site always connects to
  // Supabase even when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY env vars are
  // not configured on the deployment host (Vercel, Netlify, etc.).
  // The anon/publishable key is intentionally public and safe to embed here.
  const PROD_URL = 'https://oouftndgjvvdqaztvrpc.supabase.co';
  const PROD_KEY = 'sb_publishable_GkRoH4tW7-CDf_PnsxhgyQ_c2OpjwYx';
  return { url: PROD_URL, anonKey: PROD_KEY, isCustom: false };
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
      cachedClient = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      currentConfigKey = key;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
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
    url: config.url ? `${config.url.substring(0, 28)}...` : '',
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

export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  projectsTableOk: boolean;
  storageOk: boolean;
  message: string;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      connected: false,
      projectsTableOk: false,
      storageOk: false,
      message: 'Supabase client is not configured. Please supply URL and Anon Key.'
    };
  }

  let projectsTableOk = false;
  let storageOk = false;
  let errorDetails = '';

  try {
    // 1. Test projects table query
    const { error: tableError } = await supabase.from('projects').select('id').limit(1);
    if (tableError) {
      errorDetails += `Database table check: ${tableError.message}. `;
    } else {
      projectsTableOk = true;
    }

    // 2. Test storage bucket access
    const { error: storageError } = await supabase.storage.from('project-images').list('', { limit: 1 });
    if (storageError) {
      errorDetails += `Storage bucket check: ${storageError.message}. `;
    } else {
      storageOk = true;
    }

    const connected = projectsTableOk || storageOk;
    return {
      connected,
      projectsTableOk,
      storageOk,
      message: connected
        ? (projectsTableOk && storageOk
            ? 'Supabase database & storage connected successfully!'
            : `Partial connection: ${errorDetails}`)
        : `Connection test failed: ${errorDetails}`
    };
  } catch (err: any) {
    return {
      connected: false,
      projectsTableOk: false,
      storageOk: false,
      message: `Supabase connection exception: ${err.message || err}`
    };
  }
}

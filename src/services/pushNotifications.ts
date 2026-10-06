// =====================================================================
// ADMIN PUSH NOTIFICATION CLIENT SERVICE
// Manages Service Worker registration, PushManager subscriptions,
// and synchronization with Supabase backend.
// =====================================================================

import { getSupabaseClient } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'srk_admin_push_subscribed';

// VAPID Public Key — safe and intended for client-side applicationServerKey usage.
// Private VAPID key is NEVER in frontend code and is kept strictly in Supabase Edge Function secrets.
const FALLBACK_VAPID_PUBLIC_KEY =
  'BLJkmgWOzMD35C2LMtuobyjb9zIBr_6vp430octYlzK6Pq8i74v4QbhNw0jOKe-ZcwxHPVoM49R_jPk1r8BBQKA';

export function getVapidPublicKey(): string {
  const envKey = (import.meta.env.VITE_VAPID_PUBLIC_KEY || '').trim();
  return envKey || FALLBACK_VAPID_PUBLIC_KEY;
}

/**
 * Checks whether the current browser environment supports Web Push notifications.
 */
export function isPushNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Get current browser notification permission status.
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Convert URL-safe base64 string to a Uint8Array for PushManager subscription.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Registers the background Service Worker (/sw.js)
 */
export async function registerPushServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushNotificationSupported()) return null;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    await navigator.serviceWorker.ready;
    return registration;
  } catch (err) {
    console.error('Service worker registration failed:', err);
    return null;
  }
}

/**
 * Retrieves any existing push subscription from the browser.
 */
export async function getExistingPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushNotificationSupported()) return null;
  try {
    const reg = await navigator.serviceWorker.getRegistration('/sw.js');
    if (!reg) return null;
    return await reg.pushManager.getSubscription();
  } catch (err) {
    console.warn('Error reading push subscription:', err);
    return null;
  }
}

/**
 * Check if notifications are currently active for this device.
 */
export async function isDeviceSubscribed(): Promise<boolean> {
  if (!isPushNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;
  const sub = await getExistingPushSubscription();
  return sub !== null;
}

/**
 * Subscribes the admin browser to Web Push and saves the subscription in Supabase.
 */
export async function subscribeAdminToPush(): Promise<{
  success: boolean;
  error?: string;
  isDenied?: boolean;
}> {
  if (!isPushNotificationSupported()) {
    return {
      success: false,
      error: 'Push notifications are not supported in this browser. Please use Chrome, Edge, Safari, or Firefox.'
    };
  }

  // 1. Request browser notification permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return {
      success: false,
      isDenied: permission === 'denied',
      error:
        permission === 'denied'
          ? 'Notification permission was denied. Please allow notifications in your browser site permissions to receive alerts.'
          : 'Notification permission prompt was dismissed.'
    };
  }

  // 2. Register Service Worker
  const reg = await registerPushServiceWorker();
  if (!reg) {
    return { success: false, error: 'Could not initialize the background Service Worker.' };
  }

  // 3. Create or get PushSubscription with VAPID applicationServerKey
  const vapidPublicKey = getVapidPublicKey();
  let subscription: PushSubscription | null = null;
  try {
    subscription = await reg.pushManager.getSubscription();
    if (!subscription) {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as unknown as BufferSource
      });
    }
  } catch (subErr: any) {
    console.error('PushManager subscription failed:', subErr);
    return {
      success: false,
      error: subErr.message || 'Failed to create browser push subscription.'
    };
  }

  if (!subscription) {
    return { success: false, error: 'Unable to obtain browser push subscription.' };
  }

  // 4. Save subscription securely in Supabase backend
  const subJson = subscription.toJSON();
  const endpoint = subscription.endpoint;
  const p256dh = subJson.keys?.p256dh || '';
  const auth = subJson.keys?.auth || '';
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  if (!endpoint || !p256dh || !auth) {
    return { success: false, error: 'Push subscription keys were missing or malformed.' };
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id || null;

      // 4a. Try secure RPC function first
      const { error: rpcError } = await supabase.rpc('save_admin_push_subscription', {
        p_endpoint: endpoint,
        p_p256dh: p256dh,
        p_auth: auth,
        p_user_agent: userAgent
      });

      // 4b. Fallback to direct table upsert if RPC is not yet created
      if (rpcError) {
        console.warn('RPC save_admin_push_subscription note:', rpcError.message);
        const { error: upsertError } = await supabase
          .from('admin_push_subscriptions')
          .upsert(
            {
              admin_user_id: userId,
              endpoint,
              p256dh,
              auth,
              user_agent: userAgent,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'endpoint' }
          );

        if (upsertError) {
          console.warn('Direct upsert note:', upsertError.message);
        }
      }
    } catch (saveErr) {
      console.warn('Backend subscription save exception:', saveErr);
    }
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  return { success: true };
}

/**
 * Unsubscribes the current admin browser and cleans up from Supabase backend.
 */
export async function unsubscribeAdminFromPush(): Promise<{ success: boolean; error?: string }> {
  try {
    const sub = await getExistingPushSubscription();
    if (sub) {
      const endpoint = sub.endpoint;
      await sub.unsubscribe();

      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          await supabase.rpc('delete_admin_push_subscription', { p_endpoint: endpoint });
        } catch {
          await supabase.from('admin_push_subscriptions').delete().eq('endpoint', endpoint);
        }
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return { success: true };
  } catch (err: any) {
    console.error('Error during push unsubscription:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Triggers a real backend test push notification to verify the end-to-end setup.
 */
export async function sendTestNotification(): Promise<{
  success: boolean;
  sentCount?: number;
  message?: string;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: false, error: 'Supabase client is not connected.' };
  }

  try {
    let { data, error } = await supabase.functions.invoke('admin-notification', {
      body: { action: 'test' }
    });

    if (error) {
      const fallback = await supabase.functions.invoke('send-admin-push', {
        body: { action: 'test' }
      });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    if (data?.success === false) {
      return { success: false, message: data.message || 'No registered devices found.' };
    }

    return {
      success: true,
      sentCount: data?.sent || 0,
      message: data?.message || 'Test notification dispatched successfully!'
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to invoke backend notification function.'
    };
  }
}

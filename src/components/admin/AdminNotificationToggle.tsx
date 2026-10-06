import { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing, Check, AlertCircle, Loader2, Send } from 'lucide-react';
import {
  isPushNotificationSupported,
  getNotificationPermission,
  isDeviceSubscribed,
  subscribeAdminToPush,
  unsubscribeAdminFromPush,
  sendTestNotification
} from '../../services/pushNotifications';

interface AdminNotificationToggleProps {
  compact?: boolean;
}

export function AdminNotificationToggle({ compact = false }: AdminNotificationToggleProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const supported = isPushNotificationSupported();
      setIsSupported(supported);
      if (!supported) return;

      const perm = getNotificationPermission();
      setPermission(perm);

      const subscribed = await isDeviceSubscribed();
      setIsSubscribed(subscribed);
    };

    checkStatus();
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    const result = await subscribeAdminToPush();
    setIsLoading(false);

    if (result.success) {
      setIsSubscribed(true);
      setPermission('granted');
      setStatusMessage('Device registered for real-time alerts.');
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      if (result.isDenied) {
        setPermission('denied');
      }
      setStatusMessage(result.error || 'Failed to enable notifications.');
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    setShowMenu(false);
    const result = await unsubscribeAdminFromPush();
    setIsLoading(false);
    if (result.success) {
      setIsSubscribed(false);
      setStatusMessage('Notifications disabled.');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setShowMenu(false);
    const result = await sendTestNotification();
    setIsTesting(false);
    if (result.success) {
      setStatusMessage('Test notification sent! Check your screen.');
      setTimeout(() => setStatusMessage(null), 5000);
    } else {
      setStatusMessage(result.error || result.message || 'Test dispatch failed.');
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  if (!isSupported) {
    return null; // Don't show in unsupported browsers
  }

  return (
    <div className="relative inline-block text-left">
      {/* 1. STATE: PERMISSION DENIED */}
      {permission === 'denied' && (
        <button
          onClick={() =>
            setStatusMessage(
              'Notifications are blocked in your browser. Click the site settings icon in the URL bar to allow notifications.'
            )
          }
          title="Notifications blocked by browser permissions"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors cursor-pointer"
        >
          <BellOff className="w-3.5 h-3.5" />
          <span>{compact ? 'Blocked' : 'Notifications Blocked'}</span>
        </button>
      )}

      {/* 2. STATE: NOTIFICATIONS ACTIVE */}
      {permission !== 'denied' && isSubscribed && (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 transition-all cursor-pointer shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>🔔 {compact ? 'Enabled' : 'Notifications enabled'}</span>
          </button>
        </div>
      )}

      {/* 3. STATE: NOT ENABLED (DEFAULT / READY TO ACTIVATE) */}
      {permission !== 'denied' && !isSubscribed && (
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-neutral-300 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Enabling...</span>
            </>
          ) : (
            <>
              <Bell className="w-3.5 h-3.5 text-neutral-300" />
              <span>Enable Notifications</span>
            </>
          )}
        </button>
      )}

      {/* ACTION DROPDOWN FOR ACTIVE NOTIFICATIONS */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0e1017] border border-white/15 shadow-2xl p-1.5 z-50 text-xs">
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-blue-400" />}
            <span>Send Test Alert</span>
          </button>

          <button
            onClick={handleUnsubscribe}
            disabled={isLoading}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
          >
            <BellOff className="w-3.5 h-3.5" />
            <span>Disable on this device</span>
          </button>
        </div>
      )}

      {/* MINIMAL STATUS / FEEDBACK TOAST */}
      {statusMessage && (
        <div className="absolute right-0 mt-2 max-w-xs p-2.5 rounded-xl bg-[#14161f] border border-white/20 text-[11px] text-neutral-200 shadow-2xl z-50 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{statusMessage}</p>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-neutral-400 hover:text-white text-xs ml-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

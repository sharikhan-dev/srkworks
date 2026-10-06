// =====================================================================
// SERVICE WORKER — ADMIN WEB PUSH NOTIFICATIONS
// Background notification receiver and click handler
// =====================================================================

self.addEventListener('install', (event) => {
  // Activate worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim all active clients immediately
  event.waitUntil(self.clients.claim());
});

// Receive background Web Push events
self.addEventListener('push', (event) => {
  let payload = {
    title: 'New Project Inquiry',
    body: 'A new project inquiry has been submitted.',
    icon: '/favicon.png',
    badge: '/favicon.png',
    data: {
      url: '/#admin?tab=messages'
    }
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload.body = event.data.text();
    }
  }

  const notificationOptions = {
    body: payload.body,
    icon: payload.icon || '/favicon.png',
    badge: payload.badge || '/favicon.png',
    vibrate: [150, 50, 150, 50, 250],
    tag: payload.data?.submissionId || 'project-inquiry',
    renotify: true,
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'View Inquiry' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'New Project Inquiry', notificationOptions)
  );
});

// Handle notification interaction / click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const submissionId = event.notification.data?.submissionId;
  const targetPath = submissionId
    ? `/#admin?tab=messages&messageId=${encodeURIComponent(submissionId)}`
    : (event.notification.data?.url || '/#admin?tab=messages');

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. Try to find any open client tab on the same origin
      for (const client of windowClients) {
        if ('focus' in client) {
          client.navigate(targetPath);
          return client.focus();
        }
      }
      // 2. If no window is currently open, open a new window directly to the admin submission
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetPath);
      }
    })
  );
});

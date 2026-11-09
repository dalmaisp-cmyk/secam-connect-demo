const BASE = "/secam-connect-demo/app";
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { corps: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titre || 'SECAM Connect', {
    body: d.corps || '', icon: BASE + '/icon-192.png', badge: BASE + '/icon-192.png', lang: 'fr',
    data: { url: BASE + (d.url || '/') },
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || BASE + '/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((fenetres) => {
    for (const f of fenetres) if (f.url.startsWith(self.registration.scope)) return f.focus();
    return self.clients.openWindow(url);
  }));
});

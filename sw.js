// Service worker mínimo: abre o app mesmo com internet ruim (rede primeiro, cópia local como reserva).
const V = 'domotica-v2';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  // 'no-cache' revalida a cada abertura: atualizações do app (inclusive de segurança) chegam na hora, sem esperar o cache de 10 min do GitHub Pages.
  e.respondWith(fetch(r, { cache: 'no-cache' }).then(res => { const c = res.clone(); caches.open(V).then(ca => ca.put(r, c)); return res; }).catch(() => caches.match(r)));
});

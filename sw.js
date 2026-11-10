// Desescarcha — guarda la app para usarla sin cobertura. Versión 83736bcf8a85
var CACHE='desescarcha-83736bcf8a85';
var FICHEROS=['./','index.html','manifest.webmanifest','icono-192.png','icono-512.png'];
self.addEventListener('install',function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FICHEROS); })); self.skipWaiting(); });
self.addEventListener('activate',function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); })); })); self.clients.claim(); });
// la página: primero la red (así llega la versión nueva), y si no hay cobertura, la guardada
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(function(r){ var c=r.clone(); caches.open(CACHE).then(function(k){ k.put('index.html',c); }); return r; })
      .catch(function(){ return caches.match('index.html'); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r){ return r||fetch(e.request); }));
});

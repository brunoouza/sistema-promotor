// sw.js - Service Worker do App Promotor (modo offline)
const CACHE_NAME = 'app-promotor-cache-v1';
const ARQUIVOS_ESSENCIAIS = [
    '/app.html',
    '/manifest.json',
    '/launchericon-192x192.png',
    '/launchericon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_ESSENCIAIS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((nomes) =>
            Promise.all(
                nomes.filter((nome) => nome !== CACHE_NAME).map((nome) => caches.delete(nome))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((resposta) => {
                const copia = resposta.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
                return resposta;
            })
            .catch(() => caches.match(event.request))
    );
});
const CACHE_NAME = "anti-aging-v1";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./anti-aging.png",
  "./manifest.webmanifest"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("firestore") || event.request.url.includes("firebase")) {
    return; // nikdy necache Firestore/Firebase
  }
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Activate (cleanup old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

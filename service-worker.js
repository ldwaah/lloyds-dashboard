var CACHE_NAME = "lloyds-dashboard-v8";

var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./reminders.js",
  "./tasks.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

function assetUrl(path) {
  return new URL(path, self.location).href;
}

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(ASSETS.map(assetUrl));
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== CACHE_NAME;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        if (!response || response.status !== 200 || response.type === "opaque") {
          return response;
        }

        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });

        return response;
      });
    })
  );
});

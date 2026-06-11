var CACHE_NAME = "ks4-monitoring-v3";

var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./ks4-students.js",
  "./monitoring.js",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

function assetUrl(path) {
  return new URL(path, self.location).href;
}

function isAppShellRequest(requestUrl) {
  var path = requestUrl.pathname;
  if (requestUrl.search) return true;
  if (path.endsWith("/") || path.endsWith(".html")) return true;
  if (path.endsWith(".js") || path.endsWith(".css")) return true;
  return false;
}

function cachePut(request, response) {
  if (!response || response.status !== 200 || response.type === "opaque") {
    return;
  }
  var copy = response.clone();
  caches.open(CACHE_NAME).then(function (cache) {
    cache.put(request, copy);
  });
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

  if (isAppShellRequest(requestUrl) || event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          cachePut(event.request, response);
          return response;
        })
        .catch(function () {
          return caches.match(event.request).then(function (cached) {
            if (cached) return cached;
            if (event.request.mode === "navigate") {
              return caches.match(assetUrl("./index.html"));
            }
            return Response.error();
          });
        })
    );
  }
});

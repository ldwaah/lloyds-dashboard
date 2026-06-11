var CACHE_NAME = "lloyds-dashboard-v19";

var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./reminders.js",
  "./tasks.js",
  "./notes.js",
  "./calendar.js",
  "./notifications.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./ks4-monitoring/",
  "./ks4-monitoring/index.html",
  "./ks4-monitoring/styles.css",
  "./ks4-monitoring/app.js",
  "./ks4-monitoring/monitoring.js",
  "./ks4-monitoring/ks4-students.js",
  "./ks4-monitoring/manifest.json",
  "./ks4-monitoring/service-worker.js",
  "./ks4-monitoring/icons/icon-192.png",
  "./ks4-monitoring/icons/icon-512.png",
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
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        cachePut(event.request, response);
        return response;
      });
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  var data = event.notification.data || {};
  var action = event.action;

  if (action === "extend" && data.type && data.id) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            client.postMessage({
              type: "extend-deadline",
              itemType: data.type,
              itemId: data.id,
            });
            return client.focus();
          }
          return clients.openWindow("./#extend=" + data.type + ":" + data.id);
        })
    );
    return;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (var j = 0; j < clientList.length; j++) {
          return clientList[j].focus();
        }
        return clients.openWindow("./");
      })
  );
});

var CACHE_NAME = "lloyds-dashboard-v10";

var ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./reminders.js",
  "./tasks.js",
  "./ks4-students.js",
  "./calendar.js",
  "./notifications.js",
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

(function () {
  var dateEl = document.getElementById("today-date");
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  var tabs = document.querySelectorAll(".tab");
  var panels = document.querySelectorAll(".panel");

  function switchTab(tabName) {
    tabs.forEach(function (tab) {
      var isActive = tab.getAttribute("data-tab") === tabName;
      tab.classList.toggle("tab--active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    panels.forEach(function (panel) {
      var panelId = "panel-" + tabName;
      var isActive = panel.id === panelId;
      panel.classList.toggle("panel--active", isActive);
      panel.hidden = !isActive;
    });

    if (tabName === "calendar" && window.LloydsCalendar) {
      window.LloydsCalendar.refresh();
    }
    if (tabName === "ks4" && window.LloydsKS4) {
      window.LloydsKS4.render();
    }
  }

  var ks4Card = document.getElementById("home-ks4-card");
  if (ks4Card) {
    function openKs4() {
      switchTab("ks4");
    }
    ks4Card.addEventListener("click", openKs4);
    ks4Card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openKs4();
      }
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      switchTab(tab.getAttribute("data-tab"));
    });
  });

  switchTab("home");

  if ("serviceWorker" in navigator) {
    var swRefreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (swRefreshing) return;
      swRefreshing = true;
      window.location.reload();
    });

    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("./service-worker.js", { scope: "./" })
        .then(function (registration) {
          function checkForUpdates() {
            registration.update().catch(function () {});
          }

          checkForUpdates();
          document.addEventListener("visibilitychange", function () {
            if (!document.hidden) checkForUpdates();
          });

          if (window.LloydsNotifications) {
            window.LloydsNotifications.checkDeadlines();
          }
        })
        .catch(function () {});
    });
  }
})();

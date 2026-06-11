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

  var tabs = document.querySelectorAll(".tab[data-tab]");
  var panels = document.querySelectorAll(".panel");
  var otherView = "menu";

  var otherMenu = document.getElementById("other-menu");
  var otherNotes = document.getElementById("other-notes");
  var otherTeaching = document.getElementById("other-teaching");
  var otherBackBtn = document.getElementById("other-back-btn");
  var otherTitle = document.getElementById("other-title");
  var otherSubtitle = document.getElementById("other-subtitle");

  function showOtherView(view) {
    otherView = view;

    if (otherMenu) otherMenu.hidden = view !== "menu";
    if (otherNotes) otherNotes.hidden = view !== "notes";
    if (otherTeaching) otherTeaching.hidden = view !== "teaching";
    if (otherBackBtn) otherBackBtn.hidden = view === "menu";

    if (!otherTitle || !otherSubtitle) return;

    if (view === "menu") {
      otherTitle.textContent = "Other";
      otherSubtitle.textContent = "More workspaces";
      otherSubtitle.hidden = false;
    } else if (view === "notes") {
      otherTitle.textContent = "Notes";
      otherSubtitle.hidden = true;
    } else if (view === "teaching") {
      otherTitle.textContent = "Teaching";
      otherSubtitle.hidden = true;
    }
  }

  function switchTab(tabName) {
    if (tabName !== "other" && otherView !== "menu") {
      showOtherView("menu");
    }

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
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      switchTab(tab.getAttribute("data-tab"));
    });
  });

  document.querySelectorAll("[data-other-view]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      showOtherView(btn.getAttribute("data-other-view"));
    });
  });

  if (otherBackBtn) {
    otherBackBtn.addEventListener("click", function () {
      showOtherView("menu");
    });
  }

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

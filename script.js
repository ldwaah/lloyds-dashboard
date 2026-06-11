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
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      switchTab(tab.getAttribute("data-tab"));
    });
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("./service-worker.js", { scope: "./" })
        .catch(function () {});
    });
  }
})();

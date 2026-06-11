(function () {
  var STORAGE_KEY = "lloyds-notes";
  var saveTimer = null;

  function load() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function save(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* ignore quota errors */
    }
  }

  function init() {
    var textarea = document.getElementById("notes-content");
    if (!textarea) return;

    textarea.value = load();
    textarea.addEventListener("input", function () {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        save(textarea.value);
      }, 200);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

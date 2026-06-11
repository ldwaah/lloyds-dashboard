(function () {
  var STORAGE_KEY = "lloyds-daily-actions";

  var DAILY_ACTIONS = [
    { id: "gpt-adhoc-todo", label: "Check TD List" },
  ];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function todayDateString() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { date: "", done: {} };
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return { date: "", done: {} };
      return {
        date: parsed.date || "",
        done: parsed.done && typeof parsed.done === "object" ? parsed.done : {},
      };
    } catch (e) {
      return { date: "", done: {} };
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getTodayState() {
    var state = loadState();
    var today = todayDateString();
    if (state.date !== today) {
      return { date: today, done: {} };
    }
    return state;
  }

  function isDone(id) {
    return !!getTodayState().done[id];
  }

  function setDone(id, completed) {
    var state = getTodayState();
    state.date = todayDateString();
    if (completed) {
      state.done[id] = true;
    } else {
      delete state.done[id];
    }
    saveState(state);
    render();
  }

  function render() {
    var container = document.getElementById("home-daily-actions-list");
    if (!container) return;

    var ul = document.createElement("ul");
    ul.className = "daily-actions-list";

    DAILY_ACTIONS.forEach(function (action) {
      var done = isDone(action.id);
      var li = document.createElement("li");
      li.className =
        "daily-action-item" + (done ? " daily-action-item--done" : "");

      var label = document.createElement("label");
      label.className = "daily-action-item__label";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "daily-action-item__checkbox";
      checkbox.checked = done;
      checkbox.setAttribute("aria-label", action.label);
      checkbox.addEventListener("change", function () {
        setDone(action.id, checkbox.checked);
      });

      var span = document.createElement("span");
      span.className = "daily-action-item__text";
      span.textContent = action.label;

      label.appendChild(checkbox);
      label.appendChild(span);
      li.appendChild(label);
      ul.appendChild(li);
    });

    container.innerHTML = "";
    container.appendChild(ul);
  }

  window.LloydsDailyActions = { refresh: render };

  document.addEventListener("DOMContentLoaded", function () {
    render();
  });
})();

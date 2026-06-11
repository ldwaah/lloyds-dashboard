(function () {
  var NOTIFIED_PREFIX = "lloyds-notified-";

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function todayDateString() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function notifiedKey() {
    return NOTIFIED_PREFIX + todayDateString();
  }

  function loadNotifiedIds() {
    try {
      var raw = localStorage.getItem(notifiedKey());
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveNotifiedIds(ids) {
    localStorage.setItem(notifiedKey(), JSON.stringify(ids));
  }

  function markNotified(id) {
    var ids = loadNotifiedIds();
    if (ids.indexOf(id) === -1) {
      ids.push(id);
      saveNotifiedIds(ids);
    }
  }

  function itemKey(type, id) {
    return type + ":" + id;
  }

  function extendDeadline(type, id) {
    if (type === "task" && window.LloydsTasks && window.LloydsTasks.extendDueDate) {
      window.LloydsTasks.extendDueDate(id, 1);
      return true;
    }
    if (type === "reminder" && window.LloydsReminders && window.LloydsReminders.extendDate) {
      window.LloydsReminders.extendDate(id, 1);
      return true;
    }
    return false;
  }

  function parseExtendHash() {
    var hash = window.location.hash;
    if (!hash || hash.indexOf("#extend=") !== 0) return null;
    var payload = decodeURIComponent(hash.slice(8));
    var sep = payload.indexOf(":");
    if (sep === -1) return null;
    return {
      type: payload.slice(0, sep),
      id: payload.slice(sep + 1),
    };
  }

  function clearExtendHash() {
    if (window.location.hash.indexOf("#extend=") === 0) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  function handleExtendFromHash() {
    var parsed = parseExtendHash();
    if (!parsed) return;
    extendDeadline(parsed.type, parsed.id);
    clearExtendHash();
  }

  function collectDueItems() {
    var today = todayDateString();
    var items = [];

    var tasks = window.LloydsTasks ? window.LloydsTasks.load() : [];
    tasks.forEach(function (task) {
      if (!task.dueDate || task.status === "Done") return;
      if (task.dueDate <= today) {
        items.push({
          key: itemKey("task", task.id),
          type: "task",
          id: task.id,
          title: task.title,
          overdue: task.dueDate < today,
          body:
            task.dueDate < today
              ? "Overdue — was due " + formatShortDate(task.dueDate)
              : "Due today",
        });
      }
    });

    var reminders = window.LloydsReminders ? window.LloydsReminders.load() : [];
    reminders.forEach(function (reminder) {
      if (reminder.date <= today) {
        var overdue = reminder.date < today;
        items.push({
          key: itemKey("reminder", reminder.id),
          type: "reminder",
          id: reminder.id,
          title: reminder.title,
          overdue: overdue,
          body: overdue
            ? "Overdue — was " + formatShortDate(reminder.date)
            : "Reminder today at " + formatTime(reminder.time),
        });
      }
    });

    return items;
  }

  function formatShortDate(dateStr) {
    var parts = dateStr.split("-");
    var d = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  }

  function formatTime(timeStr) {
    var parts = timeStr.split(":");
    var h = parseInt(parts[0], 10);
    var m = parts[1];
    var suffix = h >= 12 ? "pm" : "am";
    var hour12 = h % 12 || 12;
    return hour12 + ":" + m + suffix;
  }

  function showNotification(item) {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return Promise.resolve();
    }

    var title = (item.overdue ? "Overdue: " : "Due today: ") + item.title;

    return navigator.serviceWorker.ready
      .then(function (registration) {
        return registration.showNotification(title, {
          body: item.body,
          tag: item.key,
          renotify: true,
          icon: "./icons/icon-192.png",
          badge: "./icons/icon-192.png",
          data: { type: item.type, id: item.id },
          actions: [{ action: "extend", title: "Extend 1 day" }],
        });
      })
      .catch(function () {});
  }

  function checkDeadlines() {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    var notified = loadNotifiedIds();
    var dueItems = collectDueItems();
    var promises = [];

    dueItems.forEach(function (item) {
      if (notified.indexOf(item.key) !== -1) return;
      promises.push(
        showNotification(item).then(function () {
          markNotified(item.key);
        })
      );
    });

    return Promise.all(promises);
  }

  function updatePromptUI() {
    var prompt = document.getElementById("notification-prompt");
    if (!prompt) return;

    if (!("Notification" in window)) {
      prompt.hidden = true;
      return;
    }

    if (Notification.permission === "granted") {
      prompt.hidden = true;
      return;
    }

    prompt.hidden = false;
    var status = prompt.querySelector(".notification-prompt__status");
    if (status) {
      status.textContent =
        Notification.permission === "denied"
          ? "Notifications blocked — enable in browser settings."
          : "Get deadline alerts when you open the app.";
    }

    var enableBtn = document.getElementById("notification-enable-btn");
    if (enableBtn) {
      enableBtn.hidden = Notification.permission === "denied";
    }
  }

  function requestPermission() {
    if (!("Notification" in window)) return Promise.resolve("unsupported");

    return Notification.requestPermission().then(function (result) {
      updatePromptUI();
      if (result === "granted") {
        return checkDeadlines();
      }
      return result;
    });
  }

  function initServiceWorkerMessages() {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.addEventListener("message", function (event) {
      if (!event.data || event.data.type !== "extend-deadline") return;
      extendDeadline(event.data.itemType, event.data.itemId);
    });
  }

  function initPrompt() {
    var enableBtn = document.getElementById("notification-enable-btn");
    if (enableBtn) {
      enableBtn.addEventListener("click", function () {
        requestPermission();
      });
    }
    updatePromptUI();
  }

  window.LloydsNotifications = {
    checkDeadlines: checkDeadlines,
    requestPermission: requestPermission,
    extendDeadline: extendDeadline,
  };

  document.addEventListener("DOMContentLoaded", function () {
    initServiceWorkerMessages();
    initPrompt();
    handleExtendFromHash();

    if (Notification.permission === "granted") {
      checkDeadlines();
    }

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        checkDeadlines();
        if (window.LloydsCalendar) window.LloydsCalendar.refresh();
      }
    });

    window.addEventListener("lloyds-data-changed", function () {
      if (window.LloydsCalendar) window.LloydsCalendar.refresh();
    });
  });
})();

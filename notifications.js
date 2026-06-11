(function () {
  var NOTIFIED_PREFIX = "lloyds-notified-";
  var STANDALONE_PROMPT_KEY = "lloyds-notif-standalone-prompted";

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function todayDateString() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function isIOS() {
    return /iPhone|iPod|iPad/i.test(navigator.userAgent || "");
  }

  function isMobilePhone() {
    var ua = navigator.userAgent || "";
    if (/iPhone|iPod/i.test(ua)) return true;
    if (/Android/i.test(ua) && /Mobile/i.test(ua)) return true;
    return false;
  }

  function isStandalonePwa() {
    if (window.navigator.standalone === true) return true;
    if (window.matchMedia("(display-mode: standalone)").matches) return true;
    if (window.matchMedia("(display-mode: fullscreen)").matches) return true;
    return false;
  }

  /** Alerts only for phone apps opened from the Home Screen (not desktop/laptop). */
  function notificationsEnabledHere() {
    if (!("Notification" in window)) return false;
    return isMobilePhone() && isStandalonePwa();
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
              ? "Overdue, was due " + formatShortDate(task.dueDate)
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
            ? "Overdue, was " + formatShortDate(reminder.date)
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

  function notificationTitle(item) {
    return (item.overdue ? "Overdue: " : "Due today: ") + item.title;
  }

  function buildNotificationOptions(item) {
    var options = {
      body: item.body,
      tag: item.key,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      data: { type: item.type, id: item.id },
    };

    if (!isIOS()) {
      options.renotify = true;
      options.actions = [{ action: "extend", title: "Extend 1 day" }];
    }

    return options;
  }

  function showPageNotification(title, options) {
    try {
      new Notification(title, options);
      return true;
    } catch (e) {
      return false;
    }
  }

  function showNotification(item) {
    if (!notificationsEnabledHere()) {
      return Promise.resolve();
    }
    if (Notification.permission !== "granted") {
      return Promise.resolve();
    }

    var title = notificationTitle(item);
    var options = buildNotificationOptions(item);

    if (isIOS() && document.visibilityState === "visible") {
      if (showPageNotification(title, options)) {
        return Promise.resolve();
      }
    }

    if (!("serviceWorker" in navigator)) {
      if (document.visibilityState === "visible") {
        showPageNotification(title, options);
      }
      return Promise.resolve();
    }

    return navigator.serviceWorker.ready
      .then(function (registration) {
        return registration.showNotification(title, options);
      })
      .catch(function () {
        if (document.visibilityState === "visible") {
          showPageNotification(title, options);
        }
      });
  }

  function checkDeadlines() {
    if (!notificationsEnabledHere()) {
      return;
    }
    if (Notification.permission !== "granted") {
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

  function setPromptText(prompt, title, status, note, showEnable) {
    var titleEl = prompt.querySelector(".notification-prompt__title");
    var statusEl = prompt.querySelector(".notification-prompt__status");
    var noteEl = prompt.querySelector(".notification-prompt__note");
    var enableBtn = document.getElementById("notification-enable-btn");

    if (titleEl) titleEl.textContent = title;
    if (statusEl) statusEl.textContent = status;
    if (noteEl) noteEl.textContent = note;
    if (enableBtn) enableBtn.hidden = !showEnable;
  }

  function updatePromptUI() {
    var prompt = document.getElementById("notification-prompt");
    if (!prompt) return;

    if (!("Notification" in window)) {
      prompt.hidden = true;
      return;
    }

    if (!isMobilePhone()) {
      prompt.hidden = true;
      return;
    }

    if (!isStandalonePwa()) {
      prompt.hidden = false;
      setPromptText(
        prompt,
        "Install for phone alerts",
        "Add this dashboard to your Home Screen, then open it from the icon to enable deadline notifications.",
        "In Safari: Share → Add to Home Screen. Alerts do not run from a normal browser tab on iPhone.",
        false
      );
      return;
    }

    if (Notification.permission === "granted") {
      prompt.hidden = true;
      return;
    }

    prompt.hidden = false;

    if (Notification.permission === "denied") {
      setPromptText(
        prompt,
        "Deadline alerts",
        "Notifications are blocked for this app.",
        isIOS()
          ? "iPhone: Settings → Notifications → Lloyd's Dashboard (or Safari) → Allow Notifications. Then reopen the app from your Home Screen."
          : "Allow notifications for this installed app in system settings, then reopen the app.",
        false
      );
      return;
    }

    setPromptText(
      prompt,
      "Deadline alerts",
      "Turn on alerts for due and overdue tasks while you use the phone app.",
      isIOS()
        ? "iOS only shows these while the app is open (no background push without a server). Tap Enable, then allow when iOS asks."
        : "Alerts appear when you open the app. Tap a notification to extend deadlines where supported.",
      true
    );
  }

  function maybePromptStandaloneInstall() {
    if (!notificationsEnabledHere()) return;
    if (Notification.permission !== "default") return;
    try {
      if (localStorage.getItem(STANDALONE_PROMPT_KEY)) return;
      localStorage.setItem(STANDALONE_PROMPT_KEY, "1");
    } catch (e) {
      return;
    }
    updatePromptUI();
  }

  function requestPermission() {
    if (!notificationsEnabledHere()) return Promise.resolve("skipped");

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
    maybePromptStandaloneInstall();
  }

  window.LloydsNotifications = {
    checkDeadlines: checkDeadlines,
    requestPermission: requestPermission,
    extendDeadline: extendDeadline,
    notificationsEnabledHere: notificationsEnabledHere,
  };

  document.addEventListener("DOMContentLoaded", function () {
    initServiceWorkerMessages();
    initPrompt();
    handleExtendFromHash();

    if (notificationsEnabledHere() && Notification.permission === "granted") {
      checkDeadlines();
    }

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState !== "visible") return;
      if (notificationsEnabledHere()) {
        checkDeadlines();
      }
      if (window.LloydsCalendar) window.LloydsCalendar.refresh();
    });

    window.addEventListener("lloyds-data-changed", function () {
      if (window.LloydsCalendar) window.LloydsCalendar.refresh();
    });
  });
})();

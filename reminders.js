(function () {
  var STORAGE_KEY = "lloyds-reminders";

  var CATEGORIES = [
    "Work",
    "Personal",
    "Teaching Qualification",
    "Health",
    "Money",
    "Other",
  ];

  function loadReminders() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveReminders(reminders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    window.dispatchEvent(new CustomEvent("lloyds-data-changed"));
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function todayDateString() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function parseReminderDateTime(reminder) {
    return new Date(reminder.date + "T" + reminder.time + ":00");
  }

  function isToday(dateStr) {
    return dateStr === todayDateString();
  }

  function groupReminders(reminders) {
    var now = new Date();
    var overdue = [];
    var dueToday = [];
    var upcoming = [];

    reminders.forEach(function (reminder) {
      var dt = parseReminderDateTime(reminder);
      if (dt < now) {
        overdue.push(reminder);
      } else if (isToday(reminder.date)) {
        dueToday.push(reminder);
      } else {
        upcoming.push(reminder);
      }
    });

    function byDateTime(a, b) {
      return parseReminderDateTime(a) - parseReminderDateTime(b);
    }

    overdue.sort(byDateTime);
    dueToday.sort(byDateTime);
    upcoming.sort(byDateTime);

    return { overdue: overdue, dueToday: dueToday, upcoming: upcoming };
  }

  function getTodaysReminders(reminders) {
    return reminders
      .filter(function (r) {
        return isToday(r.date);
      })
      .sort(function (a, b) {
        return parseReminderDateTime(a) - parseReminderDateTime(b);
      });
  }

  function formatTime(timeStr) {
    var parts = timeStr.split(":");
    var h = parseInt(parts[0], 10);
    var m = parts[1];
    var suffix = h >= 12 ? "pm" : "am";
    var hour12 = h % 12 || 12;
    return hour12 + ":" + m + suffix;
  }

  function formatDate(dateStr) {
    var parts = dateStr.split("-");
    var d = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
    return d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  function categoryClass(category) {
    return (
      "reminder-category reminder-category--" +
      category.toLowerCase().replace(/\s+/g, "-")
    );
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function createReminderItem(reminder, options) {
    options = options || {};
    var li = document.createElement("li");
    li.className = "reminder-item";
    if (options.compact) li.classList.add("reminder-item--compact");

    var isPast = parseReminderDateTime(reminder) < new Date();
    if (isPast && isToday(reminder.date)) {
      li.classList.add("reminder-item--past");
    }

    li.innerHTML =
      '<div class="reminder-item__body">' +
      '<p class="reminder-item__title">' +
      escapeHtml(reminder.title) +
      "</p>" +
      '<div class="reminder-item__meta">' +
      '<span class="reminder-item__time">' +
      formatTime(reminder.time) +
      "</span>" +
      (!options.hideDate && !isToday(reminder.date)
        ? '<span class="reminder-item__date">' +
          formatDate(reminder.date) +
          "</span>"
        : "") +
      '<span class="' +
      categoryClass(reminder.category) +
      '">' +
      escapeHtml(reminder.category) +
      "</span>" +
      "</div>" +
      "</div>" +
      (options.showDelete
        ? '<button type="button" class="reminder-item__delete" aria-label="Delete reminder" data-id="' +
          reminder.id +
          '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">' +
          '<path d="M18 6L6 18M6 6l12 12" />' +
          "</svg>" +
          "</button>"
        : "");

    return li;
  }

  function renderGroup(title, reminders, options) {
    if (!reminders.length) return "";

    var items = reminders
      .map(function (r) {
        return createReminderItem(r, options).outerHTML;
      })
      .join("");

    return (
      '<section class="reminder-group">' +
      "<h3 class=\"reminder-group__title\">" +
      escapeHtml(title) +
      "</h3>" +
      '<ul class="reminder-list">' +
      items +
      "</ul>" +
      "</section>"
    );
  }

  function renderRemindersPanel(reminders) {
    var container = document.getElementById("reminders-groups");
    if (!container) return;

    var groups = groupReminders(reminders);
    var html = "";

    html += renderGroup("Overdue", groups.overdue, { showDelete: true });
    html += renderGroup("Due Today", groups.dueToday, { showDelete: true });
    html += renderGroup("Upcoming", groups.upcoming, { showDelete: true });

    if (!html) {
      container.innerHTML =
        '<p class="empty-state">No reminders yet. Add one above to get started.</p>';
      return;
    }

    container.innerHTML = html;
    bindDeleteButtons(container, reminders);
  }

  function renderHomeReminders(reminders) {
    var container = document.getElementById("home-reminders-list");
    if (!container) return;

    var todays = getTodaysReminders(reminders);

    if (!todays.length) {
      container.innerHTML =
        '<p class="empty-state empty-state--compact">Nothing scheduled for today.</p>';
      return;
    }

    container.innerHTML = "";
    var ul = document.createElement("ul");
    ul.className = "reminder-list reminder-list--home";

    todays.forEach(function (reminder) {
      ul.appendChild(
        createReminderItem(reminder, { compact: true, hideDate: true })
      );
    });

    container.appendChild(ul);
  }

  function bindDeleteButtons(container, reminders) {
    container.querySelectorAll(".reminder-item__delete").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-id");
        var updated = reminders.filter(function (r) {
          return r.id !== id;
        });
        saveReminders(updated);
        refresh(updated);
      });
    });
  }

  function refresh(reminders) {
    reminders = reminders || loadReminders();
    renderRemindersPanel(reminders);
    renderHomeReminders(reminders);
  }

  function initForm() {
    var form = document.getElementById("reminder-form");
    if (!form) return;

    var dateInput = document.getElementById("reminder-date");
    var timeInput = document.getElementById("reminder-time");

    if (dateInput) dateInput.value = todayDateString();
    if (timeInput) {
      var now = new Date();
      timeInput.value = pad(now.getHours()) + ":" + pad(now.getMinutes());
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var title = document.getElementById("reminder-title").value.trim();
      var date = dateInput.value;
      var time = timeInput.value;
      var category = document.getElementById("reminder-category").value;

      if (!title || !date || !time || CATEGORIES.indexOf(category) === -1) {
        return;
      }

      var reminders = loadReminders();
      reminders.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        title: title,
        date: date,
        time: time,
        category: category,
      });

      saveReminders(reminders);
      refresh(reminders);

      document.getElementById("reminder-title").value = "";
      if (dateInput) dateInput.value = todayDateString();
    });
  }

  function extendDate(id, days) {
    days = days || 1;
    var reminders = loadReminders();
    var updated = reminders.map(function (r) {
      if (r.id !== id) return r;
      var parts = r.date.split("-");
      var d = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
      d.setDate(d.getDate() + days);
      return {
        id: r.id,
        title: r.title,
        date:
          d.getFullYear() +
          "-" +
          pad(d.getMonth() + 1) +
          "-" +
          pad(d.getDate()),
        time: r.time,
        category: r.category,
      };
    });
    saveReminders(updated);
    refresh(updated);
    return updated;
  }

  window.LloydsReminders = {
    refresh: refresh,
    load: loadReminders,
    extendDate: extendDate,
  };

  document.addEventListener("DOMContentLoaded", function () {
    initForm();
    refresh();
  });
})();

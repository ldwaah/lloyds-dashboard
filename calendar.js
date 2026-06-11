(function () {
  var MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  var WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  var viewYear;
  var viewMonth;
  var selectedDate = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function toDateString(y, m, d) {
    return y + "-" + pad(m + 1) + "-" + pad(d);
  }

  function todayParts() {
    var now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
      dateStr: toDateString(now.getFullYear(), now.getMonth(), now.getDate()),
    };
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDisplayDate(dateStr) {
    var parts = dateStr.split("-");
    var d = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
    return d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
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

  function loadItemsByDate() {
    var map = {};

    function add(dateStr, item) {
      if (!dateStr) return;
      if (!map[dateStr]) map[dateStr] = { tasks: [], reminders: [] };
      map[dateStr][item.kind].push(item);
    }

    var tasks = window.LloydsTasks ? window.LloydsTasks.load() : [];
    tasks.forEach(function (task) {
      if (task.dueDate && task.status !== "Done") {
        add(task.dueDate, {
          kind: "tasks",
          id: task.id,
          title: task.title,
          category: task.category,
          priority: task.priority,
          status: task.status,
        });
      }
    });

    var reminders = window.LloydsReminders ? window.LloydsReminders.load() : [];
    reminders.forEach(function (reminder) {
      add(reminder.date, {
        kind: "reminders",
        id: reminder.id,
        title: reminder.title,
        category: reminder.category,
        time: reminder.time,
      });
    });

    return map;
  }

  function renderDayDetail(dateStr, itemsByDate) {
    var panel = document.getElementById("calendar-day-detail");
    if (!panel) return;

    var dayItems = itemsByDate[dateStr];
    if (!dayItems) {
      panel.hidden = true;
      panel.innerHTML = "";
      return;
    }

    var html =
      '<div class="calendar-day-detail__header">' +
      "<h2 class=\"calendar-day-detail__title\">" +
      escapeHtml(formatDisplayDate(dateStr)) +
      "</h2>" +
      "</div>";

    if (dayItems.tasks.length) {
      html +=
        '<section class="calendar-day-section">' +
        '<h3 class="calendar-day-section__title">Tasks</h3>' +
        '<ul class="calendar-day-list">';
      dayItems.tasks.forEach(function (task) {
        html +=
          '<li class="calendar-day-item calendar-day-item--task">' +
          '<p class="calendar-day-item__title">' +
          escapeHtml(task.title) +
          "</p>" +
          '<div class="calendar-day-item__meta">' +
          '<span class="task-category task-category--' +
          task.category.toLowerCase().replace(/[\/\s]+/g, "-") +
          '">' +
          escapeHtml(task.category) +
          "</span>" +
          (task.priority
            ? '<span class="task-priority task-priority--' +
              task.priority.toLowerCase().replace(/\s+/g, "-") +
              '">' +
              escapeHtml(task.priority) +
              "</span>"
            : "") +
          "</div>" +
          "</li>";
      });
      html += "</ul></section>";
    }

    if (dayItems.reminders.length) {
      html +=
        '<section class="calendar-day-section">' +
        '<h3 class="calendar-day-section__title">Reminders</h3>' +
        '<ul class="calendar-day-list">';
      dayItems.reminders
        .slice()
        .sort(function (a, b) {
          return a.time < b.time ? -1 : a.time > b.time ? 1 : 0;
        })
        .forEach(function (reminder) {
          html +=
            '<li class="calendar-day-item calendar-day-item--reminder">' +
            '<p class="calendar-day-item__title">' +
            escapeHtml(reminder.title) +
            "</p>" +
            '<div class="calendar-day-item__meta">' +
            '<span class="calendar-day-item__time">' +
            formatTime(reminder.time) +
            "</span>" +
            '<span class="reminder-category reminder-category--' +
            reminder.category.toLowerCase().replace(/\s+/g, "-") +
            '">' +
            escapeHtml(reminder.category) +
            "</span>" +
            "</div>" +
            "</li>";
        });
      html += "</ul></section>";
    }

    panel.innerHTML = html;
    panel.hidden = false;
  }

  function renderCalendar() {
    var root = document.getElementById("calendar-root");
    if (!root) return;

    var today = todayParts();
    if (viewYear === undefined) {
      viewYear = today.year;
      viewMonth = today.month;
    }

    var itemsByDate = loadItemsByDate();
    var firstOfMonth = new Date(viewYear, viewMonth, 1);
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    var startOffset = (firstOfMonth.getDay() + 6) % 7;

    var html =
      '<div class="calendar">' +
      '<div class="calendar__nav">' +
      '<button type="button" class="calendar__nav-btn" id="calendar-prev" aria-label="Previous month">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>' +
      "</button>" +
      '<h2 class="calendar__month">' +
      escapeHtml(MONTH_NAMES[viewMonth] + " " + viewYear) +
      "</h2>" +
      '<button type="button" class="calendar__nav-btn" id="calendar-next" aria-label="Next month">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>' +
      "</button>" +
      "</div>" +
      '<div class="calendar__weekdays" aria-hidden="true">';

    WEEKDAY_LABELS.forEach(function (label) {
      html += '<span class="calendar__weekday">' + label + "</span>";
    });
    html += '</div><div class="calendar__grid" role="grid" aria-label="Month view">';

    for (var i = 0; i < startOffset; i++) {
      html += '<span class="calendar__cell calendar__cell--empty" role="presentation"></span>';
    }

    for (var day = 1; day <= daysInMonth; day++) {
      var dateStr = toDateString(viewYear, viewMonth, day);
      var dayItems = itemsByDate[dateStr];
      var hasTasks = dayItems && dayItems.tasks.length > 0;
      var hasReminders = dayItems && dayItems.reminders.length > 0;
      var isToday = dateStr === today.dateStr;
      var isSelected = dateStr === selectedDate;
      var isPast =
        dateStr <
        today.dateStr;

      html +=
        '<button type="button" class="calendar__cell calendar__day' +
        (isToday ? " calendar__day--today" : "") +
        (isSelected ? " calendar__day--selected" : "") +
        (isPast && (hasTasks || hasReminders) ? " calendar__day--past-due" : "") +
        '" role="gridcell" data-date="' +
        escapeHtml(dateStr) +
        '" aria-label="' +
        escapeHtml(formatDisplayDate(dateStr)) +
        (hasTasks || hasReminders ? ", has items" : "") +
        '">' +
        '<span class="calendar__day-num">' +
        day +
        "</span>";

      if (hasTasks || hasReminders) {
        html += '<span class="calendar__dots" aria-hidden="true">';
        if (hasTasks) html += '<span class="calendar__dot calendar__dot--task"></span>';
        if (hasReminders) {
          html += '<span class="calendar__dot calendar__dot--reminder"></span>';
        }
        html += "</span>";
      }

      html += "</button>";
    }

    html += "</div></div>";

    root.innerHTML = html;

    document.getElementById("calendar-prev").addEventListener("click", function () {
      viewMonth -= 1;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear -= 1;
      }
      renderCalendar();
    });

    document.getElementById("calendar-next").addEventListener("click", function () {
      viewMonth += 1;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear += 1;
      }
      renderCalendar();
    });

    root.querySelectorAll(".calendar__day").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectedDate = btn.getAttribute("data-date");
        renderCalendar();
        renderDayDetail(selectedDate, itemsByDate);
      });
    });

    if (selectedDate) {
      renderDayDetail(selectedDate, itemsByDate);
    }
  }

  function refresh() {
    renderCalendar();
  }

  window.LloydsCalendar = {
    refresh: refresh,
  };

  document.addEventListener("DOMContentLoaded", function () {
    renderCalendar();
    window.addEventListener("lloyds-data-changed", refresh);
  });
})();

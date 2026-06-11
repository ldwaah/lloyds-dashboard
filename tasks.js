(function () {
  var STORAGE_KEY = "lloyds-tasks";

  var STATUSES = ["Not Started", "In Progress", "Done"];
  var PRIORITIES = ["Low", "Medium", "High"];
  var CATEGORIES = [
    "Work",
    "Student Induction",
    "Risk Assessment",
    "SEND/EHCP",
    "Curriculum/Qualification",
    "Student Reports",
    "Staff Follow-Up",
    "Personal",
    "Other",
  ];

  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function toDateString(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function startOfToday() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function addDays(date, days) {
    var d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  function getMondayOfNextWeek(from) {
    var d = new Date(from);
    d.setHours(0, 0, 0, 0);
    var day = d.getDay();
    var add = (8 - day) % 7;
    if (add === 0) add = 7;
    return addDays(d, add);
  }

  function getNextWeekday(from, targetDay) {
    var d = new Date(from);
    d.setHours(0, 0, 0, 0);
    var day = d.getDay();
    var add = (targetDay - day + 7) % 7;
    return addDays(d, add);
  }

  function parseDueDate(line) {
    var today = startOfToday();

    if (/\btoday\b/i.test(line)) return toDateString(today);
    if (/\btomorrow\b/i.test(line)) return toDateString(addDays(today, 1));
    if (/\bearly next week\b/i.test(line)) {
      return toDateString(getMondayOfNextWeek(today));
    }
    if (/\bnext week\b/i.test(line)) {
      return toDateString(getMondayOfNextWeek(today));
    }
    if (/\bfriday\b/i.test(line)) {
      return toDateString(getNextWeekday(today, 5));
    }
    return "";
  }

  function detectCategory(line) {
    var lower = line.toLowerCase();
    if (lower.indexOf("induction") !== -1) return "Student Induction";
    if (lower.indexOf("risk assessment") !== -1) return "Risk Assessment";
    if (lower.indexOf("ehcp") !== -1 || lower.indexOf("send") !== -1) {
      return "SEND/EHCP";
    }
    if (
      lower.indexOf("qar") !== -1 ||
      lower.indexOf("king's trust") !== -1 ||
      lower.indexOf("kings trust") !== -1 ||
      lower.indexOf("qualification") !== -1
    ) {
      return "Curriculum/Qualification";
    }
    if (lower.indexOf("report") !== -1) return "Student Reports";
    if (lower.indexOf("meeting outcome") !== -1 || /\bstaff\b/i.test(line)) {
      return "Staff Follow-Up";
    }
    return "Work";
  }

  function createTaskFromLine(line) {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title: line,
      status: "Not Started",
      priority: "Medium",
      category: detectCategory(line),
      dueDate: parseDueDate(line),
    };
  }

  function parseImportLines(text) {
    return text
      .split("\n")
      .map(function (line) {
        return line.replace(/^[\s\-•*]+/, "").trim();
      })
      .filter(function (line) {
        return line.length > 0;
      });
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function categoryClass(category) {
    return (
      "task-category task-category--" +
      category.toLowerCase().replace(/[\/\s]+/g, "-")
    );
  }

  function statusClass(status) {
    return (
      "task-status task-status--" +
      status.toLowerCase().replace(/\s+/g, "-")
    );
  }

  function priorityClass(priority) {
    return (
      "task-priority task-priority--" + priority.toLowerCase()
    );
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
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

  function sortTasks(tasks) {
    var statusOrder = { "Not Started": 0, "In Progress": 1, "Done": 2 };
    var priorityOrder = { High: 0, Medium: 1, Low: 2 };

    return tasks.slice().sort(function (a, b) {
      var sa = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 9;
      var sb = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 9;
      if (sa !== sb) return sa - sb;

      if (a.dueDate && b.dueDate) {
        if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
      } else if (a.dueDate) {
        return -1;
      } else if (b.dueDate) {
        return 1;
      }

      var pa = priorityOrder[a.priority] !== undefined ? priorityOrder[a.priority] : 9;
      var pb = priorityOrder[b.priority] !== undefined ? priorityOrder[b.priority] : 9;
      return pa - pb;
    });
  }

  function optionsHtml(values, selected) {
    return values
      .map(function (v) {
        return (
          '<option value="' +
          escapeHtml(v) +
          '"' +
          (v === selected ? " selected" : "") +
          ">" +
          escapeHtml(v) +
          "</option>"
        );
      })
      .join("");
  }

  function renderTaskView(task) {
    return (
      '<article class="task-item" data-id="' +
      escapeHtml(task.id) +
      '">' +
      '<div class="task-item__view">' +
      '<div class="task-item__body">' +
      '<p class="task-item__title' +
      (task.status === "Done" ? " task-item__title--done" : "") +
      '">' +
      escapeHtml(task.title) +
      "</p>" +
      '<div class="task-item__meta">' +
      '<span class="' +
      statusClass(task.status) +
      '">' +
      escapeHtml(task.status) +
      "</span>" +
      '<span class="' +
      priorityClass(task.priority) +
      '">' +
      escapeHtml(task.priority) +
      "</span>" +
      '<span class="' +
      categoryClass(task.category) +
      '">' +
      escapeHtml(task.category) +
      "</span>" +
      (task.dueDate
        ? '<span class="task-item__due">Due ' +
          formatDate(task.dueDate) +
          "</span>"
        : "") +
      "</div>" +
      "</div>" +
      '<div class="task-item__actions">' +
      '<button type="button" class="task-item__edit" aria-label="Edit task">Edit</button>' +
      '<button type="button" class="task-item__delete" aria-label="Delete task">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">' +
      '<path d="M18 6L6 18M6 6l12 12" />' +
      "</svg>" +
      "</button>" +
      "</div>" +
      "</div>" +
      '<form class="task-item__edit-form" hidden>' +
      '<div class="form-field">' +
      '<label>Title</label>' +
      '<input type="text" name="title" value="' +
      escapeHtml(task.title) +
      '" required />' +
      "</div>" +
      '<div class="form-row form-row--3">' +
      '<div class="form-field">' +
      "<label>Status</label>" +
      '<select name="status">' +
      optionsHtml(STATUSES, task.status) +
      "</select>" +
      "</div>" +
      '<div class="form-field">' +
      "<label>Priority</label>" +
      '<select name="priority">' +
      optionsHtml(PRIORITIES, task.priority) +
      "</select>" +
      "</div>" +
      '<div class="form-field">' +
      "<label>Due date</label>" +
      '<input type="date" name="dueDate" value="' +
      escapeHtml(task.dueDate || "") +
      '" />' +
      "</div>" +
      "</div>" +
      '<div class="form-field">' +
      "<label>Category</label>" +
      '<select name="category">' +
      optionsHtml(CATEGORIES, task.category) +
      "</select>" +
      "</div>" +
      '<div class="task-item__edit-actions">' +
      '<button type="submit" class="btn btn--primary btn--sm">Save</button>' +
      '<button type="button" class="btn btn--ghost btn--sm task-item__cancel">Cancel</button>' +
      "</div>" +
      "</form>" +
      "</article>"
    );
  }

  function renderTaskList(tasks) {
    var container = document.getElementById("task-list");
    if (!container) return;

    if (!tasks.length) {
      container.innerHTML =
        '<p class="empty-state">No tasks yet. Paste an email action list above to get started.</p>';
      return;
    }

    var sorted = sortTasks(tasks);
    container.innerHTML =
      '<div class="task-list__header">' +
      "<h2 class=\"task-list__title\">" +
      sorted.length +
      " task" +
      (sorted.length === 1 ? "" : "s") +
      "</h2>" +
      "</div>" +
      sorted.map(renderTaskView).join("");

    bindTaskEvents(container, tasks);
  }

  function bindTaskEvents(container, tasks) {
    container.querySelectorAll(".task-item").forEach(function (el) {
      var id = el.getAttribute("data-id");
      var view = el.querySelector(".task-item__view");
      var form = el.querySelector(".task-item__edit-form");
      var editBtn = el.querySelector(".task-item__edit");
      var cancelBtn = el.querySelector(".task-item__cancel");
      var deleteBtn = el.querySelector(".task-item__delete");

      editBtn.addEventListener("click", function () {
        view.hidden = true;
        form.hidden = false;
      });

      cancelBtn.addEventListener("click", function () {
        form.hidden = true;
        view.hidden = false;
      });

      deleteBtn.addEventListener("click", function () {
        var updated = tasks.filter(function (t) {
          return t.id !== id;
        });
        saveTasks(updated);
        refresh(updated);
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var title = form.querySelector('[name="title"]').value.trim();
        var status = form.querySelector('[name="status"]').value;
        var priority = form.querySelector('[name="priority"]').value;
        var category = form.querySelector('[name="category"]').value;
        var dueDate = form.querySelector('[name="dueDate"]').value;

        if (!title) return;
        if (STATUSES.indexOf(status) === -1) return;
        if (PRIORITIES.indexOf(priority) === -1) return;
        if (CATEGORIES.indexOf(category) === -1) return;

        var updated = tasks.map(function (t) {
          if (t.id !== id) return t;
          return {
            id: t.id,
            title: title,
            status: status,
            priority: priority,
            category: category,
            dueDate: dueDate || "",
          };
        });

        saveTasks(updated);
        refresh(updated);
      });
    });
  }

  function refresh(tasks) {
    tasks = tasks || loadTasks();
    renderTaskList(tasks);
  }

  function initImport() {
    var textarea = document.getElementById("task-import-text");
    var convertBtn = document.getElementById("task-convert-btn");
    if (!textarea || !convertBtn) return;

    convertBtn.addEventListener("click", function () {
      var lines = parseImportLines(textarea.value);
      if (!lines.length) return;

      var tasks = loadTasks();
      lines.forEach(function (line) {
        tasks.push(createTaskFromLine(line));
      });

      saveTasks(tasks);
      refresh(tasks);
      textarea.value = "";
    });
  }

  window.LloydsTasks = {
    refresh: refresh,
    load: loadTasks,
  };

  document.addEventListener("DOMContentLoaded", function () {
    initImport();
    refresh();
  });
})();

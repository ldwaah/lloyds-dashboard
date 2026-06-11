(function () {
  var STORAGE_KEY = "lloyds-tasks";
  var WORKFLOWS_KEY = "lloyds-workflows";
  var YEAR11_WORKFLOW_ID = "wf-year11-profiles";
  var YEAR10_WORKFLOW_ID = "wf-year10-reviews";

  var STATUSES = ["Not Started", "In Progress", "Done"];
  var PRIORITIES = ["Low", "Medium", "Medium-High", "High"];
  var CATEGORIES = [
    "Work",
    "Student Induction",
    "Risk Assessment",
    "SEND/EHCP",
    "Curriculum/Qualification",
    "Student Reports",
    "Student Profiles",
    "School Communication",
    "Student Reviews",
    "Staff Follow-Up",
    "Personal",
    "Other",
  ];

  var currentFilter = "all";

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

  function loadWorkflows() {
    try {
      var raw = localStorage.getItem(WORKFLOWS_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveWorkflows(workflows) {
    localStorage.setItem(WORKFLOWS_KEY, JSON.stringify(workflows));
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function seedYear11Workflow() {
    var workflows = loadWorkflows();
    var tasks = loadTasks();
    var changed = false;

    if (!workflows.some(function (w) { return w.id === YEAR11_WORKFLOW_ID; })) {
      workflows.push({
        id: YEAR11_WORKFLOW_ID,
        name: "Year 11 Student Profiles",
      });
      changed = true;
    }

    var seedTasks = [
      {
        id: "task-year11-create-profiles",
        title: "Create Year 11 student profiles",
        category: "Student Profiles",
        priority: "High",
        dueDate: "2026-06-15",
        status: "Not Started",
        workflowId: YEAR11_WORKFLOW_ID,
      },
      {
        id: "task-year11-send-profiles",
        title: "Send Year 11 student profiles to schools",
        category: "School Communication",
        priority: "High",
        dueDate: "2026-06-19",
        status: "Not Started",
        workflowId: YEAR11_WORKFLOW_ID,
      },
    ];

    seedTasks.forEach(function (seed) {
      if (!tasks.some(function (t) { return t.id === seed.id; })) {
        tasks.push(seed);
        changed = true;
      }
    });

    if (changed) {
      saveWorkflows(workflows);
      saveTasks(tasks);
    }

    return { workflows: workflows, tasks: tasks };
  }

  function seedYear10Workflow() {
    var workflows = loadWorkflows();
    var tasks = loadTasks();
    var changed = false;

    if (!workflows.some(function (w) { return w.id === YEAR10_WORKFLOW_ID; })) {
      workflows.push({
        id: YEAR10_WORKFLOW_ID,
        name: "Year 10 End-of-Year Reviews",
      });
      changed = true;
    }

    var seedTasks = [
      {
        id: "task-year10-identify-students",
        title: "Identify all Year 10 students needing end-of-year review",
        category: "Student Reviews",
        priority: "High",
        dueDate: "2026-06-15",
        status: "Not Started",
        workflowId: YEAR10_WORKFLOW_ID,
      },
      {
        id: "task-year10-arrange-meetings",
        title: "Arrange end-of-year review meetings for Year 10 students",
        category: "Student Reviews",
        priority: "High",
        dueDate: "2026-06-19",
        status: "Not Started",
        workflowId: YEAR10_WORKFLOW_ID,
      },
      {
        id: "task-year10-prepare-notes",
        title: "Prepare review notes/questions for each Year 10 student",
        category: "Student Reviews",
        priority: "Medium-High",
        dueDate: "2026-06-19",
        status: "Not Started",
        workflowId: YEAR10_WORKFLOW_ID,
      },
    ];

    seedTasks.forEach(function (seed) {
      if (!tasks.some(function (t) { return t.id === seed.id; })) {
        tasks.push(seed);
        changed = true;
      }
    });

    if (changed) {
      saveWorkflows(workflows);
      saveTasks(tasks);
    }

    return { workflows: workflows, tasks: tasks };
  }

  function seedDefaultTasks() {
    var tasks = loadTasks();
    var changed = false;
    var added = [];
    var merged = [];
    var skipped = [];

    var seeds = [
      {
        id: "seed-task-kamari-induction",
        title: "Contact Barking Abbey for Kamari induction, cc Bal",
        category: "Student Induction",
        priority: "High",
        dueDate: "2026-06-12",
        status: "Not Started",
        notes:
          "Contact Barking Abbey to arrange/confirm Kamari induction and cc Bal.",
      },
      {
        id: "seed-task-kings-trust-qar",
        title: "Complete King's Trust QAR documentation",
        category: "Curriculum/Qualification",
        priority: "High",
        dueDate: "2026-06-12",
        status: "Not Started",
        notes: "Complete outstanding King's Trust QAR documentation.",
      },
      {
        id: "seed-task-tyler-risk-assessment",
        title: "Chase Tyler risk assessment if not received",
        category: "Risk Assessment",
        priority: "High",
        dueDate: "2026-06-12",
        status: "Not Started",
        notes: "Chase Tyler's risk assessment if it has not been received.",
      },
      {
        id: "seed-task-ehcp-cease",
        title: "Chase EHCP Cease full correspondence if not received",
        category: "SEND/EHCP",
        priority: "Medium-High",
        dueDate: "2026-06-16",
        status: "Not Started",
        notes:
          "Chase full EHCP Cease correspondence early next week if not received.",
      },
      {
        id: "seed-task-harrison-ronny-report",
        title: "Chase Harrison/Ronny report clarification if no reply",
        category: "Student Reports",
        priority: "Medium",
        dueDate: "2026-06-16",
        status: "Not Started",
        notes:
          "Chase clarification regarding Harrison/Ronny report next week if no reply received.",
      },
      {
        id: "seed-task-amir-meeting",
        title: "Ask for Amir meeting outcome if not updated",
        category: "Staff Follow-Up",
        priority: "Medium",
        dueDate: "2026-06-15",
        status: "Not Started",
        notes:
          "Ask for the outcome of the Amir meeting after Friday if no update has been provided.",
      },
      {
        id: "task-year11-create-profiles",
        mergeOnly: true,
        title: "Create Year 11 student profiles",
        category: "Student Profiles",
        priority: "High",
        dueDate: "2026-06-15",
        status: "Not Started",
        notes:
          "Create student profiles for all Year 11 students ready to send to schools.",
        workflowId: YEAR11_WORKFLOW_ID,
      },
      {
        id: "task-year11-send-profiles",
        mergeOnly: true,
        title: "Send Year 11 student profiles to schools",
        category: "School Communication",
        priority: "High",
        dueDate: "2026-06-19",
        status: "Not Started",
        notes:
          "Send completed Year 11 student profiles to relevant schools by next Friday.",
        workflowId: YEAR11_WORKFLOW_ID,
      },
      {
        id: "task-year10-arrange-meetings",
        mergeOnly: true,
        title: "Arrange end-of-year reviews for Year 10 students",
        category: "Student Reviews",
        priority: "High",
        dueDate: "2026-06-19",
        status: "Not Started",
        notes:
          "Arrange end-of-year review meetings with all Year 10 students in preparation for next year.",
        workflowId: YEAR10_WORKFLOW_ID,
      },
    ];

    seeds.forEach(function (seed) {
      var existingIdx = -1;
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === seed.id) {
          existingIdx = i;
          break;
        }
      }

      if (existingIdx >= 0) {
        var existing = tasks[existingIdx];
        var updated = false;

        if (seed.notes && !existing.notes) {
          existing.notes = seed.notes;
          updated = true;
        }
        if (seed.workflowId && !existing.workflowId) {
          existing.workflowId = seed.workflowId;
          updated = true;
        }

        if (updated) {
          merged.push(seed.id);
          changed = true;
        } else {
          skipped.push(seed.id);
        }
        return;
      }

      if (seed.mergeOnly) {
        skipped.push(seed.id);
        return;
      }

      tasks.push({
        id: seed.id,
        title: seed.title,
        status: seed.status || "Not Started",
        priority: seed.priority,
        category: seed.category,
        dueDate: seed.dueDate || "",
        notes: seed.notes || "",
        workflowId: seed.workflowId || "",
      });
      added.push(seed.id);
      changed = true;
    });

    if (changed) saveTasks(tasks);

    return { added: added, merged: merged, skipped: skipped, tasks: tasks };
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

  function createTaskFromLine(line, workflowId) {
    return {
      id: generateId(),
      title: line,
      status: "Not Started",
      priority: "Medium",
      category: detectCategory(line),
      dueDate: parseDueDate(line),
      notes: "",
      workflowId: workflowId || "",
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

  function getWorkflowById(workflows, id) {
    if (!id) return null;
    for (var i = 0; i < workflows.length; i++) {
      if (workflows[i].id === id) return workflows[i];
    }
    return null;
  }

  function getWorkflowName(workflows, workflowId) {
    var wf = getWorkflowById(workflows, workflowId);
    return wf ? wf.name : "";
  }

  function getTasksForWorkflow(tasks, workflowId) {
    return tasks.filter(function (t) {
      return t.workflowId === workflowId;
    });
  }

  function getWorkflowStatus(wfTasks) {
    if (!wfTasks.length) return "Not Started";
    var allDone = wfTasks.every(function (t) { return t.status === "Done"; });
    if (allDone) return "Complete";
    var allNotStarted = wfTasks.every(function (t) {
      return t.status === "Not Started";
    });
    if (allNotStarted) return "Not Started";
    return "In Progress";
  }

  function getWorkflowProgress(wfTasks) {
    var done = wfTasks.filter(function (t) { return t.status === "Done"; }).length;
    return { done: done, total: wfTasks.length };
  }

  function getWorkflowNextDeadline(wfTasks) {
    var incomplete = wfTasks.filter(function (t) {
      return t.status !== "Done" && t.dueDate;
    });
    if (!incomplete.length) return "";
    incomplete.sort(function (a, b) {
      return a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0;
    });
    return incomplete[0].dueDate;
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

  function workflowStatusClass(status) {
    return (
      "workflow-status workflow-status--" +
      status.toLowerCase().replace(/\s+/g, "-")
    );
  }

  function priorityClass(priority) {
    return (
      "task-priority task-priority--" +
      priority.toLowerCase().replace(/\s+/g, "-")
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
    var priorityOrder = { High: 0, "Medium-High": 1, Medium: 2, Low: 3 };

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

  function filterTasks(tasks) {
    if (currentFilter === "all") return tasks;
    if (currentFilter === "none") {
      return tasks.filter(function (t) { return !t.workflowId; });
    }
    return tasks.filter(function (t) { return t.workflowId === currentFilter; });
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

  function workflowOptionsHtml(workflows, selected, includeEmpty) {
    var html = "";
    if (includeEmpty) {
      html +=
        '<option value=""' +
        (!selected ? " selected" : "") +
        ">None</option>";
    }
    workflows.forEach(function (wf) {
      html +=
        '<option value="' +
        escapeHtml(wf.id) +
        '"' +
        (wf.id === selected ? " selected" : "") +
        ">" +
        escapeHtml(wf.name) +
        "</option>";
    });
    return html;
  }

  function renderTaskView(task, workflows) {
    var workflowName = getWorkflowName(workflows, task.workflowId);

    return (
      '<article class="task-item" data-id="' +
      escapeHtml(task.id) +
      '">' +
      '<button type="button" class="task-item__summary" aria-expanded="false">' +
      '<div class="task-item__summary-body">' +
      '<p class="task-item__title' +
      (task.status === "Done" ? " task-item__title--done" : "") +
      '">' +
      escapeHtml(task.title) +
      "</p>" +
      '<div class="task-item__summary-meta">' +
      '<span class="' +
      statusClass(task.status) +
      '">' +
      escapeHtml(task.status) +
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
      '<svg class="task-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
      '<path d="M6 9l6 6 6-6" />' +
      "</svg>" +
      "</button>" +
      '<div class="task-item__details" hidden>' +
      '<div class="task-item__details-meta">' +
      '<span class="' +
      priorityClass(task.priority) +
      '">' +
      escapeHtml(task.priority) +
      "</span>" +
      (workflowName
        ? '<span class="task-workflow">' + escapeHtml(workflowName) + "</span>"
        : "") +
      "</div>" +
      (task.notes
        ? '<p class="task-item__notes">' + escapeHtml(task.notes) + "</p>"
        : "") +
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
      "<label>Title</label>" +
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
      '<div class="form-field">' +
      "<label>Parent Workflow</label>" +
      '<select name="workflowId">' +
      workflowOptionsHtml(workflows, task.workflowId || "", true) +
      "</select>" +
      "</div>" +
      '<div class="form-field">' +
      "<label>Notes</label>" +
      '<textarea name="notes" rows="2">' +
      escapeHtml(task.notes || "") +
      "</textarea>" +
      "</div>" +
      '<div class="task-item__edit-actions">' +
      '<button type="submit" class="btn btn--primary btn--sm">Save</button>' +
      '<button type="button" class="btn btn--ghost btn--sm task-item__cancel">Cancel</button>' +
      "</div>" +
      "</form>" +
      "</article>"
    );
  }

  function renderFilterBar(workflows, tasks) {
    var filtered = filterTasks(tasks);
    var options =
      '<option value="all"' +
      (currentFilter === "all" ? " selected" : "") +
      ">All tasks</option>" +
      '<option value="none"' +
      (currentFilter === "none" ? " selected" : "") +
      ">No workflow</option>";

    workflows.forEach(function (wf) {
      options +=
        '<option value="' +
        escapeHtml(wf.id) +
        '"' +
        (currentFilter === wf.id ? " selected" : "") +
        ">" +
        escapeHtml(wf.name) +
        "</option>";
    });

    return (
      '<div class="task-list__toolbar">' +
      '<div class="task-list__header">' +
      "<h2 class=\"task-list__title\">" +
      filtered.length +
      " task" +
      (filtered.length === 1 ? "" : "s") +
      "</h2>" +
      "</div>" +
      '<div class="form-field form-field--inline">' +
      '<label for="task-workflow-filter">Filter</label>' +
      '<select id="task-workflow-filter" class="task-filter">' +
      options +
      "</select>" +
      "</div>" +
      "</div>"
    );
  }

  function renderTaskList(tasks, workflows) {
    var container = document.getElementById("task-list");
    if (!container) return;

    var filtered = filterTasks(tasks);

    if (!tasks.length) {
      container.innerHTML =
        '<p class="empty-state">No tasks yet. Tap Import from email to add tasks.</p>';
      return;
    }

    var sorted = sortTasks(filtered);
    container.innerHTML =
      renderFilterBar(workflows, tasks) +
      (sorted.length
        ? sorted.map(function (t) { return renderTaskView(t, workflows); }).join("")
        : '<p class="empty-state empty-state--compact">No tasks match this filter.</p>');

    bindFilterEvents();
    bindTaskEvents(container, tasks, workflows);
  }

  function bindFilterEvents() {
    var filterEl = document.getElementById("task-workflow-filter");
    if (!filterEl) return;
    filterEl.addEventListener("change", function () {
      currentFilter = filterEl.value;
      refresh();
    });
  }

  function bindTaskEvents(container, tasks, workflows) {
    container.querySelectorAll(".task-item").forEach(function (el) {
      var id = el.getAttribute("data-id");
      var summary = el.querySelector(".task-item__summary");
      var details = el.querySelector(".task-item__details");
      var form = el.querySelector(".task-item__edit-form");
      var editBtn = el.querySelector(".task-item__edit");
      var cancelBtn = el.querySelector(".task-item__cancel");
      var deleteBtn = el.querySelector(".task-item__delete");

      summary.addEventListener("click", function () {
        if (form && !form.hidden) return;
        var expanded = summary.getAttribute("aria-expanded") === "true";
        summary.setAttribute("aria-expanded", expanded ? "false" : "true");
        details.hidden = expanded;
        el.classList.toggle("task-item--expanded", !expanded);
      });

      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        summary.hidden = true;
        details.hidden = true;
        form.hidden = false;
        el.classList.remove("task-item--expanded");
      });

      cancelBtn.addEventListener("click", function () {
        form.hidden = true;
        summary.hidden = false;
        summary.setAttribute("aria-expanded", "false");
        details.hidden = true;
      });

      deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation();
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
        var workflowId = form.querySelector('[name="workflowId"]').value;
        var notes = form.querySelector('[name="notes"]').value.trim();

        if (!title) return;
        if (STATUSES.indexOf(status) === -1) return;
        if (PRIORITIES.indexOf(priority) === -1) return;
        if (CATEGORIES.indexOf(category) === -1) return;
        if (workflowId && !getWorkflowById(workflows, workflowId)) return;

        var updated = tasks.map(function (t) {
          if (t.id !== id) return t;
          return {
            id: t.id,
            title: title,
            status: status,
            priority: priority,
            category: category,
            dueDate: dueDate || "",
            notes: notes,
            workflowId: workflowId || "",
          };
        });

        saveTasks(updated);
        refresh(updated);
      });
    });
  }

  function renderHomeWorkflows(tasks, workflows) {
    var container = document.getElementById("home-workflows-list");
    if (!container) return;

    if (!workflows.length) {
      container.innerHTML =
        '<p class="empty-state empty-state--compact">No workflows yet.</p>';
      return;
    }

    var html = '<ul class="workflow-home-list">';
    workflows.forEach(function (wf) {
      var wfTasks = getTasksForWorkflow(tasks, wf.id);
      var progress = getWorkflowProgress(wfTasks);
      var status = getWorkflowStatus(wfTasks);
      var nextDeadline = getWorkflowNextDeadline(wfTasks);

      html +=
        '<li class="workflow-home-item">' +
        '<button type="button" class="workflow-home-item__toggle" aria-expanded="false">' +
        '<div class="workflow-home-item__summary">' +
        '<p class="workflow-home-item__name">' +
        escapeHtml(wf.name) +
        "</p>" +
        '<div class="workflow-home-item__meta">' +
        '<span class="workflow-home-item__progress">' +
        progress.done +
        "/" +
        progress.total +
        " done</span>" +
        '<span class="' +
        workflowStatusClass(status) +
        '">' +
        escapeHtml(status) +
        "</span>" +
        "</div>" +
        (nextDeadline
          ? '<p class="workflow-home-item__deadline">Next: ' +
            formatDate(nextDeadline) +
            "</p>"
          : status === "Complete"
            ? '<p class="workflow-home-item__deadline">All tasks complete</p>'
            : "") +
        "</div>" +
        '<svg class="workflow-home-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
        '<path d="M6 9l6 6 6-6" />' +
        "</svg>" +
        "</button>";

      if (wfTasks.length) {
        html += '<div class="workflow-home-item__panel" hidden><ul class="workflow-home-item__tasks">';
        wfTasks.forEach(function (task) {
          var done = task.status === "Done";
          html +=
            '<li class="workflow-home-item__task' +
            (done ? " workflow-home-item__task--done" : "") +
            '">' +
            escapeHtml(task.title) +
            "</li>";
        });
        html += "</ul></div>";
      }

      html += "</li>";
    });
    html += "</ul>";

    container.innerHTML = html;
    bindWorkflowEvents(container);
  }

  function bindWorkflowEvents(container) {
    container.querySelectorAll(".workflow-home-item__toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".workflow-home-item");
        var panel = item ? item.querySelector(".workflow-home-item__panel") : null;
        if (!panel) return;

        var expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", expanded ? "false" : "true");
        panel.hidden = expanded;
        if (item) item.classList.toggle("workflow-home-item--expanded", !expanded);
      });
    });
  }

  function updateWorkflowDropdowns(workflows) {
    var importSelect = document.getElementById("task-import-workflow");
    if (importSelect) {
      var current = importSelect.value;
      importSelect.innerHTML = workflowOptionsHtml(workflows, current, true);
    }
  }

  function refresh(tasks) {
    var workflows = loadWorkflows();
    tasks = tasks || loadTasks();
    updateWorkflowDropdowns(workflows);
    renderTaskList(tasks, workflows);
    renderHomeWorkflows(tasks, workflows);
  }

  function initImport() {
    var toggle = document.getElementById("task-import-toggle");
    var panel = document.getElementById("task-import-panel");
    var textarea = document.getElementById("task-import-text");
    var convertBtn = document.getElementById("task-convert-btn");
    var workflowSelect = document.getElementById("task-import-workflow");
    var importSection = document.querySelector(".task-import");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
        panel.hidden = expanded;
        if (importSection) {
          importSection.classList.toggle("task-import--expanded", !expanded);
        }
        if (!expanded) {
          setTimeout(function () {
            if (textarea) textarea.focus();
          }, 50);
        }
      });
    }

    if (!textarea || !convertBtn) return;

    convertBtn.addEventListener("click", function () {
      var lines = parseImportLines(textarea.value);
      if (!lines.length) return;

      var workflowId = workflowSelect ? workflowSelect.value : "";
      var tasks = loadTasks();
      lines.forEach(function (line) {
        tasks.push(createTaskFromLine(line, workflowId));
      });

      saveTasks(tasks);
      refresh(tasks);
      textarea.value = "";
      if (workflowSelect) workflowSelect.value = "";

      if (toggle && panel) {
        toggle.setAttribute("aria-expanded", "false");
        panel.hidden = true;
        if (importSection) importSection.classList.remove("task-import--expanded");
      }
    });
  }

  window.LloydsTasks = {
    refresh: refresh,
    load: loadTasks,
    loadWorkflows: loadWorkflows,
  };

  document.addEventListener("DOMContentLoaded", function () {
    seedYear11Workflow();
    seedYear10Workflow();
    seedDefaultTasks();
    initImport();
    refresh();
  });
})();

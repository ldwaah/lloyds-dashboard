(function () {
  var STORAGE_KEY = "lloyds-ks4-monitoring";
  var STATUS_OPTIONS = ["Not Started", "In Progress", "Complete", "Needed", "N/A"];

  var REPORT_TERMS = ["Autumn", "Spring", "Summer"];
  var REPORT_STATUS_OPTIONS = ["Not sent", "Sent", "N/A"];

  var INTERVENTION_TYPES = [
    "Mentoring",
    "Restorative conversation",
    "Parent meeting",
    "Parent contact",
    "Remote learning",
    "Futures meeting",
    "Navigation support",
    "SEMH referral",
    "Safeguarding referral",
    "Other",
  ];

  var SECTION_DEFS = [
    { key: "induction", title: "Induction", type: "induction" },
    { key: "ilp", title: "Individual Learning Plans (ILP)" },
    { key: "riskAssessment", title: "Risk Assessments" },
    { key: "studentPassport", title: "Student Passport", hasSource: true },
    { key: "behaviour", title: "Behaviour Instances", type: "log", logKind: "behaviour" },
    { key: "interventions", title: "Interventions & Supports", type: "log", logKind: "interventions" },
    { key: "attainment", title: "Attainment", type: "attainment" },
    { key: "reports", title: "Reports", type: "reports" },
    { key: "reviews", title: "Reviews", type: "reviews" },
    { key: "removal", title: "Removal / Provision Exit", type: "removal" },
  ];

  var view = "list";
  var activeStudentId = null;
  var activeSection = "induction";
  var hashBound = false;

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function uid() {
    return "m-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function getStudents() {
    if (window.LloydsKS4) {
      if (window.LloydsKS4.migrateStudents) {
        return window.LloydsKS4.migrateStudents();
      }
      if (window.LloydsKS4.getStudents) {
        return window.LloydsKS4.getStudents();
      }
    }
    return [];
  }

  function emptySection() {
    return { status: "Not Started", link: "", notes: "" };
  }

  function reportTermId(term) {
    return "report-" + String(term).toLowerCase();
  }

  function emptyReports() {
    if (window.LloydsKS4MonitoringSeed && window.LloydsKS4MonitoringSeed.emptyReports) {
      return window.LloydsKS4MonitoringSeed.emptyReports();
    }
    return REPORT_TERMS.map(function (term) {
      return {
        id: reportTermId(term),
        term: term,
        dateSent: "",
        driveLink: "",
        status: "Not sent",
      };
    });
  }

  function emptyRecord(studentId) {
    return {
      studentId: studentId,
      updatedAt: new Date().toISOString(),
      induction: {
        status: "Not Started",
        startDate: "",
        homeCentreAgreementLink: "",
        notes: "",
      },
      ilp: emptySection(),
      riskAssessment: emptySection(),
      studentPassport: { status: "Not Started", source: "", link: "", notes: "" },
      behaviour: [],
      interventions: [],
      attainment: [],
      reports: emptyReports(),
      reviews: [],
      removal: {
        flagged: false,
        status: "Not Started",
        warnings: "",
        evidenceLinks: "",
        notes: "",
      },
    };
  }

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent("lloyds-ks4-monitoring-changed"));
  }

  function ensureMigrated() {
    if (window.LloydsKS4MonitoringSeed && window.LloydsKS4MonitoringSeed.migrate) {
      window.LloydsKS4MonitoringSeed.migrate();
    }
  }

  function getRecord(studentId) {
    ensureMigrated();
    var store = loadStore();
    if (!store[studentId]) {
      store[studentId] = emptyRecord(studentId);
      saveStore(store);
    }
    return store[studentId];
  }

  function updateRecord(studentId, patch) {
    var store = loadStore();
    var record = store[studentId] || emptyRecord(studentId);
    Object.keys(patch).forEach(function (k) {
      record[k] = patch[k];
    });
    record.updatedAt = new Date().toISOString();
    store[studentId] = record;
    saveStore(store);
    return record;
  }

  function statusClass(status) {
    if (!status) return "";
    var v = String(status).toLowerCase();
    if (v === "complete" || v === "current") return "mon-badge--ok";
    if (v === "in progress") return "mon-badge--progress";
    if (v === "not started") return "mon-badge--warn";
    if (v === "n/a" || v === "proposed") return "mon-badge--muted";
    if (v === "sent") return "mon-badge--ok";
    if (v === "not sent") return "mon-badge--warn";
    return "";
  }

  function sectionSummary(record, key) {
    var def = SECTION_DEFS.find(function (d) {
      return d.key === key;
    });
    if (!def) return "";
    if (def.type === "log") {
      var kind = def.logKind || def.key;
      var count = (record[kind] || []).length;
      if (kind === "interventions") {
        return count ? count + " logged" : "None logged";
      }
      return count ? count + " logged" : "No incidents";
    }
    if (def.type === "attainment") {
      var a = (record.attainment || []).length;
      return a ? a + " entries" : "No entries";
    }
    if (def.type === "reviews") {
      var r = (record.reviews || []).length;
      return r ? r + " reviews" : "No reviews";
    }
    if (def.type === "reports") {
      var reports = record.reports || [];
      var sent = reports.filter(function (item) {
        return item.status === "Sent";
      }).length;
      if (!sent) return "None sent";
      return sent + " of " + reports.length + " sent";
    }
    if (def.type === "removal") {
      if (!record.removal || !record.removal.flagged) return "Not flagged";
      return record.removal.status || "Flagged";
    }
    if (key === "induction" && record.induction) {
      return inductionStatusFromDate(record.induction.startDate) || record.induction.status || "Not Started";
    }
    var sec = record[key];
    return sec && sec.status ? sec.status : "Not Started";
  }

  function inductionStatusFromDate(startDate) {
    if (window.LloydsKS4MonitoringSeed && window.LloydsKS4MonitoringSeed.inductionStatusFromDate) {
      return window.LloydsKS4MonitoringSeed.inductionStatusFromDate(startDate);
    }
    return startDate ? "Not Started" : "Not Started";
  }

  function renderList() {
    var students = getStudents()
      .filter(function (s) {
        return s.yearGroup === "Year 10";
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });

    var cards = students
      .map(function (s) {
        return (
          '<button type="button" class="mon-student-card" data-id="' +
          escapeHtml(s.id) +
          '">' +
          '<span class="mon-student-card__name">' +
          escapeHtml(s.name) +
          "</span>" +
          '<span class="mon-student-card__meta">' +
          escapeHtml(s.school) +
          " · " +
          escapeHtml(s.yearGroup) +
          "</span></button>"
        );
      })
      .join("");

    var root = document.getElementById("mon-root");
    if (!root) return;

    root.innerHTML =
      students.length > 0
        ? '<div class="mon-list">' + cards + "</div>"
        : '<p class="mon-empty">Student list did not load. Pull down to refresh or close and reopen the app.</p>';

    root.querySelectorAll(".mon-student-card").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openStudent(btn.dataset.id);
      });
    });

    document.getElementById("mon-back-btn").hidden = true;
    document.getElementById("mon-profile-header").hidden = true;
    document.querySelector(".mon-header__title").textContent = "KS4 Monitoring";
    document.querySelector(".mon-header__subtitle").textContent =
      "Student lifecycle tracker";
  }

  function statusSelect(name, value) {
    var opts = STATUS_OPTIONS.map(function (opt) {
      return (
        '<option value="' +
        escapeHtml(opt) +
        '"' +
        (opt === value ? " selected" : "") +
        ">" +
        escapeHtml(opt) +
        "</option>"
      );
    }).join("");
    return (
      '<label class="form-field"><span>' +
      escapeHtml(name) +
      '</span><select name="status" class="mon-status-select">' +
      opts +
      "</select></label>"
    );
  }

  function renderInductionSection(record) {
    var sec = record.induction || emptyRecord("").induction;
    var derived = inductionStatusFromDate(sec.startDate);
    var status = sec.startDate ? derived : sec.status || "Not Started";
    var link = sec.homeCentreAgreementLink || sec.link || "";

    return (
      '<form class="mon-section-form" data-section="induction">' +
      '<label class="form-field"><span>Start date with centre</span><input type="date" name="startDate" value="' +
      escapeHtml(sec.startDate || "") +
      '"></label>' +
      '<p class="mon-derived-status">Status: <strong>' +
      escapeHtml(status) +
      "</strong> <span class=\"mon-derived-status__hint\">(from start date)</span></p>" +
      '<input type="hidden" name="status" value="' +
      escapeHtml(status) +
      '">' +
      '<label class="form-field"><span>Home Centre Agreement</span><input type="url" name="homeCentreAgreementLink" value="' +
      escapeHtml(link) +
      '" placeholder="Google Drive link" inputmode="url"></label>' +
      '<label class="form-field"><span>Notes</span><textarea name="notes" rows="3" placeholder="Your notes">' +
      escapeHtml(sec.notes || "") +
      "</textarea></label>" +
      '<button type="submit" class="btn btn--primary">Save</button></form>'
    );
  }

  function renderDocSection(record, key, def) {
    var sec = record[key] || emptySection();
    var extra = "";
    if (def.hasSource) {
      extra +=
        '<label class="form-field"><span>Source (school / in-house)</span><input type="text" name="source" value="' +
        escapeHtml(sec.source || "") +
        '" placeholder="e.g. From Robert Clack"></label>';
    }
    return (
      '<form class="mon-section-form" data-section="' +
      escapeHtml(key) +
      '">' +
      statusSelect("Status", sec.status) +
      extra +
      '<label class="form-field"><span>Document link</span><input type="url" name="link" value="' +
      escapeHtml(sec.link || "") +
      '" placeholder="https://…" inputmode="url"></label>' +
      '<label class="form-field"><span>Notes</span><textarea name="notes" rows="3" placeholder="Optional notes">' +
      escapeHtml(sec.notes || "") +
      "</textarea></label>" +
      '<button type="submit" class="btn btn--primary">Save</button></form>'
    );
  }

  function renderInterventions(record) {
    var items = record.interventions || [];
    var list =
      items.length === 0
        ? '<p class="mon-empty">No interventions or supports logged yet.</p>'
        : '<ul class="mon-log">' +
          items
            .slice()
            .reverse()
            .map(function (item) {
              return (
                '<li class="mon-log__item">' +
                (item.type
                  ? '<p class="mon-log__meta" style="margin-top:0"><strong>' +
                    escapeHtml(item.type) +
                    "</strong></p>"
                  : "") +
                '<div class="mon-log__date">' +
                escapeHtml(item.date) +
                "</div>" +
                '<p class="mon-log__text">' +
                escapeHtml(item.description) +
                "</p>" +
                (item.outcome
                  ? '<p class="mon-log__meta"><strong>Outcome:</strong> ' +
                    escapeHtml(item.outcome) +
                    "</p>"
                  : "") +
                '<button type="button" class="mon-log__delete" data-kind="interventions" data-id="' +
                escapeHtml(item.id) +
                '">Remove</button></li>'
              );
            })
            .join("") +
          "</ul>";

    var typeOpts = INTERVENTION_TYPES.map(function (opt) {
      return '<option value="' + escapeHtml(opt) + '">' + escapeHtml(opt) + "</option>";
    }).join("");

    return (
      list +
      '<form class="mon-add-form" data-kind="interventions">' +
      '<h3 class="mon-form-title">Log intervention or support</h3>' +
      '<div class="form-row">' +
      '<label class="form-field"><span>Date</span><input type="date" name="date" required></label>' +
      '<label class="form-field"><span>Type</span><select name="type" required>' +
      typeOpts +
      "</select></label>" +
      "</div>" +
      '<label class="form-field"><span>Description</span><textarea name="description" rows="3" required placeholder="What support was provided? Include mentor name, focus, or context."></textarea></label>' +
      '<label class="form-field"><span>Outcome</span><input type="text" name="outcome" placeholder="Result / follow-up"></label>' +
      '<button type="submit" class="btn btn--primary">Add entry</button></form>'
    );
  }

  function renderBehaviour(record) {
    var items = record.behaviour || [];
    var list =
      items.length === 0
        ? '<p class="mon-empty">No behaviour instances logged yet.</p>'
        : '<ul class="mon-log">' +
          items
            .slice()
            .reverse()
            .map(function (item) {
              return (
                '<li class="mon-log__item">' +
                '<div class="mon-log__date">' +
                escapeHtml(item.date) +
                "</div>" +
                '<p class="mon-log__text">' +
                escapeHtml(item.description) +
                "</p>" +
                (item.intervention
                  ? '<p class="mon-log__meta"><strong>Intervention:</strong> ' +
                    escapeHtml(item.intervention) +
                    "</p>"
                  : "") +
                (item.outcome
                  ? '<p class="mon-log__meta"><strong>Outcome:</strong> ' +
                    escapeHtml(item.outcome) +
                    "</p>"
                  : "") +
                '<button type="button" class="mon-log__delete" data-kind="behaviour" data-id="' +
                escapeHtml(item.id) +
                '">Remove</button></li>'
              );
            })
            .join("") +
          "</ul>";

    return (
      list +
      '<form class="mon-add-form" data-kind="behaviour">' +
      '<h3 class="mon-form-title">Log behaviour instance</h3>' +
      '<label class="form-field"><span>Date</span><input type="date" name="date" required></label>' +
      '<label class="form-field"><span>Description</span><textarea name="description" rows="3" required placeholder="What happened?"></textarea></label>' +
      '<label class="form-field"><span>Intervention</span><input type="text" name="intervention" placeholder="Action taken"></label>' +
      '<label class="form-field"><span>Outcome</span><input type="text" name="outcome" placeholder="Result / follow-up"></label>' +
      '<button type="submit" class="btn btn--primary">Add instance</button></form>'
    );
  }

  function renderAttainment(record) {
    var items = record.attainment || [];
    var list =
      items.length === 0
        ? '<p class="mon-empty">No attainment entries yet.</p>'
        : '<ul class="mon-log">' +
          items
            .slice()
            .reverse()
            .map(function (item) {
              return (
                '<li class="mon-log__item">' +
                '<div class="mon-log__date">' +
                escapeHtml(item.date) +
                " · " +
                escapeHtml(item.qualification) +
                "</div>" +
                (item.notes
                  ? '<p class="mon-log__text">' + escapeHtml(item.notes) + "</p>"
                  : "") +
                '<button type="button" class="mon-log__delete" data-kind="attainment" data-id="' +
                escapeHtml(item.id) +
                '">Remove</button></li>'
              );
            })
            .join("") +
          "</ul>";

    return (
      list +
      '<form class="mon-add-form" data-kind="attainment">' +
      '<h3 class="mon-form-title">Add attainment entry</h3>' +
      '<div class="form-row">' +
      '<label class="form-field"><span>Date</span><input type="date" name="date" required></label>' +
      '<label class="form-field"><span>Qualification / certification</span><input type="text" name="qualification" required placeholder="e.g. GCSE English"></label>' +
      "</div>" +
      '<label class="form-field"><span>Progress notes</span><textarea name="notes" rows="3" placeholder="Progress, grades, milestones"></textarea></label>' +
      '<button type="submit" class="btn btn--primary">Add entry</button></form>'
    );
  }

  function reportStatusSelect(value) {
    var opts = REPORT_STATUS_OPTIONS.map(function (opt) {
      return (
        '<option value="' +
        escapeHtml(opt) +
        '"' +
        (opt === value ? " selected" : "") +
        ">" +
        escapeHtml(opt) +
        "</option>"
      );
    }).join("");
    return (
      '<label class="form-field mon-report-status"><span>Status</span><select name="status" class="mon-status-select">' +
      opts +
      "</select></label>"
    );
  }

  function renderReports(record) {
    var items = record.reports || emptyReports();
    var list =
      '<p class="mon-reports-intro">Term reports sent to home school. Paste a Google Drive link for each term; tap the link to open in a new tab.</p>' +
      '<ul class="mon-log mon-reports">' +
      items
        .map(function (item) {
          var termLabel = item.term + " Term Report";
          var link = String(item.driveLink || "").trim();
          var linkBlock = link
            ? '<p class="mon-report-link"><a href="' +
              escapeHtml(link) +
              '" target="_blank" rel="noopener noreferrer">Open in Google Drive</a></p>'
            : "";
          return (
            '<li class="mon-log__item mon-report-term">' +
            '<form class="mon-report-form" data-report-id="' +
            escapeHtml(item.id) +
            '">' +
            '<div class="mon-report-term__header">' +
            '<span class="mon-report-term__name">' +
            escapeHtml(termLabel) +
            "</span>" +
            '<span class="mon-badge ' +
            statusClass(item.status) +
            '">' +
            escapeHtml(item.status || "Not sent") +
            "</span>" +
            "</div>" +
            linkBlock +
            reportStatusSelect(item.status || "Not sent") +
            '<label class="form-field"><span>Date sent</span><input type="date" name="dateSent" value="' +
            escapeHtml(item.dateSent || "") +
            '"></label>' +
            '<label class="form-field"><span>Google Drive link</span><input type="url" name="driveLink" value="' +
            escapeHtml(link) +
            '" placeholder="https://drive.google.com/…" inputmode="url"></label>' +
            '<button type="submit" class="btn btn--primary mon-report-save">Save term report</button>' +
            "</form></li>"
          );
        })
        .join("") +
      "</ul>";
    return list;
  }

  function renderReviews(record) {
    var items = record.reviews || [];
    var list =
      items.length === 0
        ? '<p class="mon-empty">No reviews recorded yet.</p>'
        : '<ul class="mon-log">' +
          items
            .slice()
            .reverse()
            .map(function (item) {
              return (
                '<li class="mon-log__item">' +
                '<div class="mon-log__date">' +
                escapeHtml(item.date) +
                "</div>" +
                (item.outcome
                  ? '<p class="mon-log__text">' + escapeHtml(item.outcome) + "</p>"
                  : "") +
                (item.notes
                  ? '<p class="mon-log__meta">' + escapeHtml(item.notes) + "</p>"
                  : "") +
                '<button type="button" class="mon-log__delete" data-kind="reviews" data-id="' +
                escapeHtml(item.id) +
                '">Remove</button></li>'
              );
            })
            .join("") +
          "</ul>";

    return (
      list +
      '<form class="mon-add-form" data-kind="reviews">' +
      '<h3 class="mon-form-title">Add review</h3>' +
      '<label class="form-field"><span>Review date</span><input type="date" name="date" required></label>' +
      '<label class="form-field"><span>Outcome</span><input type="text" name="outcome" placeholder="Summary outcome"></label>' +
      '<label class="form-field"><span>Notes</span><textarea name="notes" rows="3"></textarea></label>' +
      '<button type="submit" class="btn btn--primary">Add review</button></form>'
    );
  }

  function renderRemoval(record) {
    var rem = record.removal || emptyRecord("").removal;
    return (
      '<form class="mon-removal-form">' +
      '<label class="mon-toggle">' +
      '<input type="checkbox" name="flagged"' +
      (rem.flagged ? " checked" : "") +
      "> Flag removal / provision exit process</label>" +
      '<div class="mon-removal-fields"' +
      (rem.flagged ? "" : " hidden") +
      ">" +
      statusSelect("Process status", rem.status) +
      '<label class="form-field"><span>Warnings issued</span><textarea name="warnings" rows="3" placeholder="Centre Home Agreement breaches, warnings timeline">' +
      escapeHtml(rem.warnings || "") +
      "</textarea></label>" +
      '<label class="form-field"><span>Evidence links (one per line)</span><textarea name="evidenceLinks" rows="4" placeholder="https://…">' +
      escapeHtml(rem.evidenceLinks || "") +
      "</textarea></label>" +
      '<label class="form-field"><span>Notes</span><textarea name="notes" rows="3">' +
      escapeHtml(rem.notes || "") +
      "</textarea></label>" +
      "</div>" +
      '<button type="submit" class="btn btn--primary">Save removal record</button></form>'
    );
  }

  function renderProfile() {
    var student = getStudents().find(function (s) {
      return s.id === activeStudentId;
    });
    if (!student) {
      view = "list";
      activeStudentId = null;
      render();
      return;
    }

    var record = getRecord(activeStudentId);
    var def = SECTION_DEFS.find(function (d) {
      return d.key === activeSection;
    });
    if (!def) activeSection = "induction";

    var nav = SECTION_DEFS.map(function (d) {
      return (
        '<button type="button" class="mon-section-tab' +
        (d.key === activeSection ? " mon-section-tab--active" : "") +
        '" data-section="' +
        escapeHtml(d.key) +
        '">' +
        escapeHtml(d.title) +
        '<span class="mon-section-tab__meta">' +
        escapeHtml(sectionSummary(record, d.key)) +
        "</span></button>"
      );
    }).join("");

    var body = "";
    if (def.type === "log" && def.logKind === "interventions") {
      body = renderInterventions(record);
    } else if (def.type === "log" && def.logKind === "behaviour") {
      body = renderBehaviour(record);
    } else if (def.type === "attainment") {
      body = renderAttainment(record);
    } else if (def.type === "reports") {
      body = renderReports(record);
    } else if (def.type === "reviews") {
      body = renderReviews(record);
    } else if (def.type === "removal") {
      body = renderRemoval(record);
    } else if (def.type === "induction") {
      body = renderInductionSection(record);
    } else {
      body = renderDocSection(record, def.key, def);
    }

    var root = document.getElementById("mon-root");
    root.innerHTML =
      '<nav class="mon-section-nav" aria-label="Profile sections">' +
      nav +
      "</nav>" +
      '<section class="mon-section-panel" aria-live="polite">' +
      "<h2 class=\"mon-section-panel__title\">" +
      escapeHtml(def.title) +
      "</h2>" +
      body +
      "</section>";

    document.getElementById("mon-back-btn").hidden = false;
    document.getElementById("mon-profile-header").hidden = false;
    document.querySelector(".mon-header__title").textContent = student.name;
    document.querySelector(".mon-header__subtitle").textContent =
      student.yearGroup + " · " + student.school;

    bindProfileEvents(root);
  }

  function bindProfileEvents(root) {
    root.querySelectorAll(".mon-section-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        activeSection = tab.dataset.section;
        location.hash = "student/" + activeStudentId + "/" + activeSection;
        renderProfile();
      });
    });

    var sectionForm = root.querySelector(".mon-section-form");
    if (sectionForm) {
      sectionForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var key = sectionForm.dataset.section;
        var fd = new FormData(sectionForm);
        var patch = {};
        var sec = Object.assign({}, getRecord(activeStudentId)[key] || emptySection());
        if (key === "induction") {
          sec.startDate = String(fd.get("startDate") || "").trim();
          sec.homeCentreAgreementLink = String(fd.get("homeCentreAgreementLink") || "").trim();
          sec.notes = String(fd.get("notes") || "").trim();
          sec.status = inductionStatusFromDate(sec.startDate);
          delete sec.link;
          delete sec.centreAgreementLink;
        } else {
          sec.status = fd.get("status");
          sec.link = String(fd.get("link") || "").trim();
          sec.notes = String(fd.get("notes") || "").trim();
          if (fd.get("source") !== null) sec.source = String(fd.get("source") || "").trim();
        }
        patch[key] = sec;
        updateRecord(activeStudentId, patch);
        renderProfile();
      });
    }

    root.querySelectorAll(".mon-report-form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var reportId = form.dataset.reportId;
        var fd = new FormData(form);
        var rec = getRecord(activeStudentId);
        var reports = (rec.reports || emptyReports()).map(function (item) {
          if (item.id !== reportId) return item;
          return {
            id: item.id,
            term: item.term,
            status: String(fd.get("status") || "Not sent").trim(),
            dateSent: String(fd.get("dateSent") || "").trim(),
            driveLink: String(fd.get("driveLink") || "").trim(),
          };
        });
        updateRecord(activeStudentId, { reports: reports });
        renderProfile();
      });
    });

    root.querySelectorAll(".mon-add-form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var kind = form.dataset.kind;
        var fd = new FormData(form);
        var rec = getRecord(activeStudentId);
        var list = (rec[kind] || []).slice();
        var entry = { id: uid() };
        fd.forEach(function (val, name) {
          entry[name] = String(val).trim();
        });
        list.push(entry);
        var patch = {};
        patch[kind] = list;
        updateRecord(activeStudentId, patch);
        form.reset();
        renderProfile();
      });
    });

    root.querySelectorAll(".mon-log__delete").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var kind = btn.dataset.kind;
        var id = btn.dataset.id;
        var rec = getRecord(activeStudentId);
        var patch = {};
        patch[kind] = (rec[kind] || []).filter(function (item) {
          return item.id !== id;
        });
        updateRecord(activeStudentId, patch);
        renderProfile();
      });
    });

    var removalForm = root.querySelector(".mon-removal-form");
    if (removalForm) {
      var flaggedInput = removalForm.querySelector('[name="flagged"]');
      var fields = removalForm.querySelector(".mon-removal-fields");
      flaggedInput.addEventListener("change", function () {
        fields.hidden = !flaggedInput.checked;
      });
      removalForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(removalForm);
        updateRecord(activeStudentId, {
          removal: {
            flagged: !!fd.get("flagged"),
            status: fd.get("status"),
            warnings: String(fd.get("warnings") || "").trim(),
            evidenceLinks: String(fd.get("evidenceLinks") || "").trim(),
            notes: String(fd.get("notes") || "").trim(),
          },
        });
        if (activeSection === "removal" && !fd.get("flagged")) {
          activeSection = "reviews";
        }
        renderProfile();
      });
    }
  }

  function openStudent(id, section) {
    view = "profile";
    activeStudentId = id;
    activeSection = section || "induction";
    location.hash = "student/" + id + "/" + activeSection;
    renderProfile();
  }

  function parseHash() {
    var h = location.hash.replace(/^#/, "");
    var parts = h.split("/");
    if (parts[0] === "student" && parts[1]) {
      openStudent(parts[1], parts[2] || "induction");
      return true;
    }
    return false;
  }

  function render() {
    if (view === "profile" && activeStudentId) {
      renderProfile();
    } else {
      view = "list";
      activeStudentId = null;
      renderList();
    }
  }

  function goBack() {
    view = "list";
    activeStudentId = null;
    location.hash = "";
    renderList();
  }

  function registerSw() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./service-worker.js").catch(function () {});
    });
  }

  function init() {
    ensureMigrated();
    document.getElementById("mon-back-btn").addEventListener("click", goBack);

    if (!parseHash()) {
      renderList();
    }

    window.addEventListener("hashchange", function () {
      if (!parseHash()) {
        goBack();
      }
    });

    window.addEventListener("lloyds-data-changed", render);
    window.addEventListener("storage", function (e) {
      if (e.key === "lloyds-ks4-students" || e.key === STORAGE_KEY) render();
    });

    registerSw();
  }

  window.LloydsKS4Monitoring = {
    getRecord: getRecord,
    updateRecord: updateRecord,
    STORAGE_KEY: STORAGE_KEY,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

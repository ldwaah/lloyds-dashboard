(function () {
  var STORAGE_KEY = "lloyds-ks4-students";
  var VERSION_KEY = "lloyds-ks4-seed-version";
  var SEED_VERSION = 5;
  var SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1kMZy6UPEICCHABe7Fa9FIf_ij0z79l84aAYsRhzn-qc/edit";

  /* Excluded from dashboard — Y11 leavers / KS-flexi winding down (see sheet evidence in repo notes) */
  var EXCLUDED_IDS = [
    "ks4-vinnie-lane",
    "ks4-lexi-penny",
    "ks4-amishael-mufata",
    "ks4-sylvin-pun",
    "ks4-flynn-hurley",
    "ks4-charlie-archer",
  ];

  var SEED_STUDENTS = [
    {
      id: "ks4-calum-mison",
      name: "Calum Mison",
      keyStage: "KS4",
      yearGroup: "Year 10",
      school: "Jo Richardson Community School",
      placementType: "Flexi",
      currentStatus: "Proposed",
      inductionStatus: "Not Started",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Unknown",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Y10 provision tab",
      evidenceWording:
        "KS 4, Year Group 10, Jo Richardson Community School, Start Date 03/11/2026; Provision: Flexi Full Time; BFL: Final Warning; King's Trust Theory/Practical: Not Engaged",
      missingInfo:
        "Placement live/paid status, induction completion, risk assessment, ILP, student profile",
      suggestedAction:
        "Confirm induction plan before Nov 2026 start; chase King's Trust engagement",
      confidence: "High",
    },
    {
      id: "ks4-jayden-obrien",
      name: "Jayden O'Brien",
      keyStage: "KS4",
      yearGroup: "Year 10",
      school: "Jo Richardson Community School",
      placementType: "Flexi",
      currentStatus: "Current",
      inductionStatus: "Unknown",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Unknown",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Y10 provision tab",
      evidenceWording:
        "KS 4, Year Group 10, Jo Richardson Community School, Start Date 26/03/2026; Provision: Flexi Full Time; BFL: Doing Well / OK; King's Trust: Completed (Theory, Practical, Level 1 Award)",
      missingInfo: "Induction status, risk assessment, ILP, student profile",
      suggestedAction: "Confirm 12-week review date (18/06/2026)",
      confidence: "High",
    },
    {
      id: "ks4-stacey-grail",
      name: "Stacey Grail",
      keyStage: "KS4",
      yearGroup: "Year 10",
      school: "Jo Richardson Community School",
      placementType: "KS4",
      currentStatus: "Current",
      inductionStatus: "Unknown",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Unknown",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Y10 provision tab",
      evidenceWording:
        "KS 4, Year Group 10, Jo Richardson Community School, Start Date 12/08/2025; Provision: KS4; BFL: Final Warning; Interventions: Mentoring; Agencies: Social Services; King's Trust: Completed",
      missingInfo: "Funding type (LA/Commissioned), induction, risk assessment, ILP, profile",
      suggestedAction: "Monitor BFL Final Warning; confirm next review milestone",
      confidence: "High",
    },
    {
      id: "ks4-tyrell-allassani",
      name: "Tyrell Allassani",
      keyStage: "KS4",
      yearGroup: "Year 10",
      school: "Jo Richardson Community School",
      placementType: "Flexi",
      currentStatus: "Current",
      inductionStatus: "Unknown",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Unknown",
      reviewNeeded: "Unknown",
      evidenceSource: "Google Sheet — Master list + Y10 provision tab",
      evidenceWording:
        "KS 4, Year Group 10, Jo Richardson Community School; Provision: Flexi Full Time; BFL: Doing Well / OK; Interventions: Reduced Timetable; King's Trust: Completed",
      missingInfo: "Start date, review dates, induction, risk assessment, ILP, profile",
      suggestedAction: "Add start/review dates to tracker; confirm placement status",
      confidence: "High",
    },
    {
      id: "ks4-ronny-burletson",
      name: "Ronny Burletson",
      keyStage: "KS4",
      yearGroup: "Year 10",
      school: "Robert Clack",
      placementType: "KS4",
      currentStatus: "Current",
      inductionStatus: "Unknown",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Unknown",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Y10 provision tab",
      evidenceWording:
        "KS 4, Year Group 10, Robert Clack, Start Date 02/10/2025; Provision: KS4; BFL: Doing Well / OK; Interventions: Reduced Timetable; Agencies: Social Services; King's Trust: Completed",
      missingInfo: "Funding type, induction, risk assessment, ILP, profile",
      suggestedAction: "Confirm 32-week review (14/05/2026) preparation",
      confidence: "High",
    },
    {
      id: "ks4-mason-taylor",
      name: "Mason Taylor",
      keyStage: "KS4",
      yearGroup: "Year 10",
      school: "Dagenham Park School",
      placementType: "KS4",
      currentStatus: "Current",
      inductionStatus: "Unknown",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Unknown",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Y10 provision tab",
      evidenceWording:
        "KS 4, Year Group 10, Dagenham Park School, Start Date 09/08/2025; Provision: KS4; BFL: Doing Well / OK; Interventions: Mentoring; King's Trust: N/A",
      missingInfo: "Funding type, induction, risk assessment, ILP, profile",
      suggestedAction: "Confirm 32-week review (21/03/2026) completed",
      confidence: "High",
    },
    {
      id: "ks4-jovan-lane",
      name: "Jovan Lane",
      keyStage: "KS4",
      yearGroup: "Year 10",
      school: "Robert Clack",
      placementType: "KS4",
      currentStatus: "Current",
      inductionStatus: "Unknown",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Unknown",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Y10 provision + Engagement tab",
      evidenceWording:
        "KS 4, Year Group 10, Robert Clack, Start Date 27/01/2026; Provision: KS4; BFL: Report; Interventions: FLZ; Agencies: Subwize; Engagement (Jovan Lane Ridge): Occasionally Late, Mostly Engaged, Low Concern",
      missingInfo: "Funding type, induction, risk assessment, ILP, profile",
      suggestedAction: "Follow up home contact (No Contact on engagement tab)",
      confidence: "High",
    },
    {
      id: "ks4-harrison-jones",
      name: "Harrison Jones",
      keyStage: "KS4",
      yearGroup: "Year 10",
      school: "Robert Clack",
      placementType: "KS4",
      currentStatus: "Current",
      inductionStatus: "Unknown",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Unknown",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Y10 provision tab",
      evidenceWording:
        "KS 4, Year Group 10, Robert Clack, Start Date 07/10/2025; Provision: KS4; BFL: Doing Well / OK; Interventions: Reduced Timetable; King's Trust: N/A",
      missingInfo: "Funding type, induction, risk assessment, ILP, profile",
      suggestedAction: "Confirm 32-week review (19/05/2026)",
      confidence: "High",
    },
    {
      id: "ks4-joshua-lang",
      name: "Joshua Lang",
      keyStage: "KS4",
      yearGroup: "Year 10",
      school: "All Saints",
      placementType: "KS4",
      currentStatus: "Current",
      inductionStatus: "Unknown",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Unknown",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Y10 provision tab",
      evidenceWording:
        "KS 4, Year Group 10, All Saints, Start Date 03/05/2026; Provision: KS4; BFL: Doing Well / OK; Interventions: Mentoring; King's Trust: Completed",
      missingInfo: "Funding type, induction, risk assessment, ILP, profile",
      suggestedAction: "Confirm 6-week review (14/06/2026)",
      confidence: "High",
    },
    {
      id: "ks4-tyler-fredreick",
      name: "Tyler Fredreick",
      keyStage: "KS4",
      yearGroup: "Year 10",
      school: "Robert Clack",
      placementType: "Unknown",
      currentStatus: "Proposed",
      inductionStatus: "Not Started",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Unknown",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Engagement tab",
      evidenceWording:
        "KS 4, Year Group 10, Robert Clack, Start Date 03/07/2026; BFL: Doing Well / OK; Engagement tab lists 'Tyler Frederick' — Frequently Late, Refusing/Disengaged, Not Accessing Learning",
      missingInfo:
        "Risk assessment status, placement type, induction, ILP, profile (name spelling differs on engagement tab)",
      suggestedAction: "Confirm July 2026 start; address disengagement on engagement tab",
      confidence: "High",
    },
  ];

  function loadStudents() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    window.dispatchEvent(new CustomEvent("lloyds-data-changed"));
  }

  function applyExclusions(students) {
    return students.filter(function (s) {
      return EXCLUDED_IDS.indexOf(s.id) === -1;
    });
  }

  function migrateStudents() {
    var version = parseInt(localStorage.getItem(VERSION_KEY) || "0", 10);
    var students = loadStudents();
    var changed = false;

    if (!students || students.length === 0) {
      students = SEED_STUDENTS.slice();
      changed = true;
    } else if (version < SEED_VERSION) {
      var before = students.length;
      students = applyExclusions(students);
      if (students.length !== before) changed = true;

      var seedById = {};
      SEED_STUDENTS.forEach(function (s) {
        seedById[s.id] = s;
      });

      var existing = {};
      students.forEach(function (s) {
        existing[s.id] = true;
        var seed = seedById[s.id];
        if (seed && version < 3) {
          if (seed.placementType && seed.placementType !== "Unknown") {
            s.placementType = seed.placementType;
          }
          s.evidenceSource = seed.evidenceSource;
          s.evidenceWording = seed.evidenceWording;
          s.missingInfo = seed.missingInfo;
          s.suggestedAction = seed.suggestedAction;
          changed = true;
        }
      });
      SEED_STUDENTS.forEach(function (s) {
        if (!existing[s.id]) {
          students.push(s);
          changed = true;
        }
      });
    } else {
      var existingIds = {};
      students.forEach(function (s) {
        existingIds[s.id] = true;
      });
      SEED_STUDENTS.forEach(function (s) {
        if (!existingIds[s.id]) {
          students.push(s);
          changed = true;
        }
      });
    }

    students = applyExclusions(students);

    if (students.length === 0) {
      students = applyExclusions(SEED_STUDENTS.slice());
      changed = true;
    }

    if (changed || version < SEED_VERSION) {
      saveStudents(students);
      localStorage.setItem(VERSION_KEY, String(SEED_VERSION));
    }

    return students;
  }

  function getStudents() {
    return migrateStudents();
  }

  function groupStudents(students) {
    var a = [];
    var b = [];
    var c = [];
    var d = [];
    var e = [];

    students.forEach(function (s) {
      if (s.yearGroup === "Year 10") {
        a.push(s);
      } else if (s.yearGroup === "Year 11") {
        b.push(s);
      } else if (s.keyStage === "KS4" || s.keyStage === "4") {
        c.push(s);
      }

      if (
        s.currentStatus === "Proposed" ||
        s.currentStatus === "Historical" ||
        s.currentStatus === "Unclear"
      ) {
        d.push(s);
      }

      if (
        s.riskAssessmentStatus === "Needed" ||
        s.riskAssessmentStatus === "Not Started" ||
        s.studentProfileStatus === "Not Started" ||
        s.reviewNeeded === "Yes" ||
        s.inductionStatus === "Not Started"
      ) {
        e.push(s);
      }
    });

    return { year10: a, year11: b, ks4UnknownYear: c, proposedUnclear: d, actions: e };
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function listStudents() {
    return getStudents()
      .filter(function (s) {
        return s.yearGroup === "Year 10";
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
  }

  function renderStudentCard(student, expanded) {
    var html =
      '<article class="ks4-card" data-id="' +
      escapeHtml(student.id) +
      '">' +
      '<button type="button" class="ks4-card__toggle" aria-expanded="' +
      (expanded ? "true" : "false") +
      '">' +
      '<div class="ks4-card__summary">' +
      '<span class="ks4-card__name">' +
      escapeHtml(student.name) +
      "</span>" +
      '<span class="ks4-card__meta">' +
      escapeHtml(student.school) +
      " · " +
      escapeHtml(student.yearGroup) +
      "</span>" +
      "</div>" +
      '<svg class="ks4-card__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
      "</button>";

    if (expanded) {
      html +=
        '<div class="ks4-card__detail">' +
        '<dl class="ks4-detail-grid">' +
        detailRow("Placement", student.placementType) +
        detailRow("Status", student.currentStatus) +
        detailRow("Induction", student.inductionStatus) +
        "</dl>" +
        '<p class="ks4-profile-link"><a href="ks4-monitoring/#student/' +
        escapeHtml(student.id) +
        '/induction">Open monitoring profile</a></p>' +
        "</div>";
    }

    html += "</article>";
    return html;
  }

  function detailRow(label, value) {
    return (
      "<div><dt>" +
      escapeHtml(label) +
      "</dt><dd>" +
      escapeHtml(value) +
      "</dd></div>"
    );
  }

  function renderHomeSummary() {
    var students = listStudents();
    var el = document.getElementById("home-ks4-summary");
    if (!el) return;
    el.innerHTML =
      '<p class="home-ks4-summary__stat"><strong>' +
      students.length +
      "</strong> Year 10 students</p>";
  }

  var expandedId = null;

  function render() {
    var root = document.getElementById("ks4-root");
    if (!root) return;

    var students = listStudents();
    var cards = students
      .map(function (s) {
        return renderStudentCard(s, expandedId === s.id);
      })
      .join("");

    root.innerHTML =
      '<p class="ks4-header-link"><a href="ks4-monitoring/">KS4 Monitoring</a></p>' +
      '<div class="ks4-list">' +
      cards +
      "</div>";

    root.querySelectorAll(".ks4-card__toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".ks4-card");
        expandedId = expandedId === card.dataset.id ? null : card.dataset.id;
        render();
      });
    });

    renderHomeSummary();
  }

  function init() {
    migrateStudents();
    if (document.getElementById("ks4-root")) {
      render();
      window.addEventListener("lloyds-data-changed", function () {
        renderHomeSummary();
      });
    }
  }

  window.LloydsKS4 = {
    getStudents: getStudents,
    migrateStudents: migrateStudents,
    saveStudents: saveStudents,
    groupStudents: groupStudents,
    render: render,
    renderHomeSummary: renderHomeSummary,
    SHEET_URL: SHEET_URL,
    SEED_COUNT: SEED_STUDENTS.length,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

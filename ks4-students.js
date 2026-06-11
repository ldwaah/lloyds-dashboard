(function () {
  var STORAGE_KEY = "lloyds-ks4-students";
  var VERSION_KEY = "lloyds-ks4-seed-version";
  var SEED_VERSION = 3;
  var SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1kMZy6UPEICCHABe7Fa9FIf_ij0z79l84aAYsRhzn-qc/edit";

  /* Excluded from dashboard — Y11 leavers / KS-flexi winding down (see sheet evidence in repo notes) */
  var EXCLUDED_IDS = [
    "ks4-vinnie-lane",
    "ks4-lexi-penny",
    "ks4-amishael-mufata",
    "ks4-sylvin-pun",
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
    {
      id: "ks4-flynn-hurley",
      name: "Flynn Hurley",
      keyStage: "KS4",
      yearGroup: "Year 11",
      school: "Robert Clack",
      placementType: "KS4",
      currentStatus: "Proposed",
      inductionStatus: "Not Started",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Not Started",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Y11 provision tab",
      evidenceWording:
        "KS 4, Year Group 11, Robert Clack, Start Date 01/09/2026; Intended Destination: College; Provision: KS4; GCSE courses In Progress; future reviews through 13/04/2027",
      missingInfo: "Funding type (LA/Commissioned), induction, risk assessment, ILP",
      suggestedAction: "Prepare for Sept 2026 start; create student profile",
      confidence: "High",
    },
    {
      id: "ks4-charlie-archer",
      name: "Charlie Archer",
      keyStage: "KS4",
      yearGroup: "Year 11",
      school: "Greatfields School",
      placementType: "KS4",
      currentStatus: "Current",
      inductionStatus: "Unknown",
      riskAssessmentStatus: "Unknown",
      ilpStatus: "Unknown",
      studentProfileStatus: "Not Started",
      reviewNeeded: "Yes",
      evidenceSource: "Google Sheet — Master list + Y11 provision tab",
      evidenceWording:
        "KS 4, Year Group 11, Greatfields School, Start Date 20/10/2025; Provision: KS4; GCSE English/Maths In Progress; Interventions: FLZ; Agencies: CAMHS; active review cycle through 01/06/2026",
      missingInfo: "Funding type, induction, risk assessment, ILP",
      suggestedAction: "Create/send Year 11 student profile",
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

    if (!students) {
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
    }

    students = applyExclusions(students);

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

  function statusClass(value) {
    if (!value) return "";
    var v = String(value).toLowerCase();
    if (v.indexOf("complete") !== -1 || v === "current") return "ks4-badge--ok";
    if (v.indexOf("not started") !== -1 || v === "needed") return "ks4-badge--warn";
    if (v === "proposed" || v === "unclear") return "ks4-badge--muted";
    if (v === "unknown") return "ks4-badge--unknown";
    return "";
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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
      escapeHtml(student.yearGroup) +
      " · " +
      escapeHtml(student.school) +
      "</span>" +
      '<div class="ks4-card__badges">' +
      '<span class="ks4-badge ' +
      statusClass(student.currentStatus) +
      '">' +
      escapeHtml(student.currentStatus) +
      "</span>" +
      '<span class="ks4-badge ' +
      statusClass(student.placementType) +
      '">' +
      escapeHtml(student.placementType) +
      "</span>" +
      '<span class="ks4-badge ks4-badge--confidence">' +
      escapeHtml(student.confidence) +
      "</span>" +
      "</div></div>" +
      '<svg class="ks4-card__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
      "</button>";

    if (expanded) {
      html +=
        '<div class="ks4-card__detail">' +
        '<dl class="ks4-detail-grid">' +
        detailRow("Key Stage", student.keyStage) +
        detailRow("Year Group", student.yearGroup) +
        detailRow("School / Referrer", student.school) +
        detailRow("Placement Type", student.placementType) +
        detailRow("Current Status", student.currentStatus) +
        detailRow("Induction", student.inductionStatus) +
        detailRow("Risk Assessment", student.riskAssessmentStatus) +
        detailRow("ILP", student.ilpStatus) +
        detailRow("Student Profile", student.studentProfileStatus) +
        detailRow("Review Needed", student.reviewNeeded) +
        detailRow("Confidence", student.confidence) +
        "</dl>" +
        '<p class="ks4-detail-block"><strong>Evidence source</strong><br>' +
        escapeHtml(student.evidenceSource) +
        "</p>" +
        '<p class="ks4-detail-block"><strong>Exact wording</strong><br>' +
        escapeHtml(student.evidenceWording) +
        "</p>" +
        '<p class="ks4-detail-block"><strong>Missing information</strong><br>' +
        escapeHtml(student.missingInfo) +
        "</p>" +
        '<p class="ks4-detail-block"><strong>Suggested next action</strong><br>' +
        escapeHtml(student.suggestedAction) +
        "</p>" +
        "</div>";
    }

    html += "</article>";
    return html;
  }

  function detailRow(label, value) {
    return (
      "<div><dt>" +
      escapeHtml(label) +
      '</dt><dd class="ks4-badge ' +
      statusClass(value) +
      '">' +
      escapeHtml(value) +
      "</dd></div>"
    );
  }

  function renderGroup(title, students, expandedId) {
    if (!students.length) {
      return (
        '<section class="ks4-group"><h3 class="ks4-group__title">' +
        escapeHtml(title) +
        ' <span class="ks4-group__count">0</span></h3><p class="ks4-empty">None</p></section>'
      );
    }
    var cards = students
      .map(function (s) {
        return renderStudentCard(s, expandedId === s.id);
      })
      .join("");
    return (
      '<section class="ks4-group"><h3 class="ks4-group__title">' +
      escapeHtml(title) +
      ' <span class="ks4-group__count">' +
      students.length +
      "</span></h3>" +
      '<div class="ks4-list">' +
      cards +
      "</div></section>"
    );
  }

  function renderHomeSummary() {
    var students = getStudents();
    var groups = groupStudents(students);
    var el = document.getElementById("home-ks4-summary");
    if (!el) return;
    el.innerHTML =
      '<p class="home-ks4-summary__stat"><strong>' +
      students.length +
      "</strong> KS4 students tracked</p>" +
      '<p class="home-ks4-summary__breakdown">Y10: ' +
      groups.year10.length +
      " · Y11: " +
      groups.year11.length +
      " · Actions: " +
      groups.actions.length +
      "</p>" +
      '<p class="home-ks4-summary__source">Source: Google Sheet (no emails in workspace)</p>';
  }

  var expandedId = null;

  function render() {
    var root = document.getElementById("ks4-root");
    if (!root) return;

    var students = getStudents();
    var groups = groupStudents(students);

    root.innerHTML =
      '<div class="ks4-notice">' +
      "<p><strong>Data sources:</strong> Google Sheet exported " +
      new Date().toLocaleDateString("en-GB") +
      '. No .eml/.mbox emails found in workspace.</p>' +
      "<p><strong>Y11 leavers excluded:</strong> Vinnie Lane, Lexi Penny (Flexi Full Time + Apprenticeship, review cycle ended); Amishael Mufata (review cycle ended Jul 2025, no future reviews); Sylvin Pun (Special provision only, not on Y11 KS4 provision tab).</p>" +
      '<p class="ks4-notice__link"><a href="' +
      SHEET_URL +
      '" target="_blank" rel="noopener">Open source spreadsheet</a></p>' +
      "</div>" +
      renderGroup("A. Confirmed Year 10", groups.year10, expandedId) +
      renderGroup("B. Confirmed Year 11", groups.year11, expandedId) +
      renderGroup("C. KS4 — year group unknown", groups.ks4UnknownYear, expandedId) +
      renderGroup("D. Proposed / unclear / historical", groups.proposedUnclear, expandedId) +
      renderGroup("E. Immediate actions needed", groups.actions, expandedId);

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
    render();
    window.addEventListener("lloyds-data-changed", function () {
      renderHomeSummary();
    });
  }

  window.LloydsKS4 = {
    getStudents: getStudents,
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

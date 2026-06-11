(function () {
  var STORAGE_KEY = "lloyds-ks4-monitoring";
  var VERSION_KEY = "lloyds-ks4-monitoring-seed-version";
  var SEED_VERSION = 1;

  var SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1kMZy6UPEICCHABe7Fa9FIf_ij0z79l84aAYsRhzn-qc/edit";

  function ukToIso(uk) {
    if (!uk || uk === "N/A") return "";
    var parts = String(uk).trim().split("/");
    if (parts.length !== 3) return "";
    var d = parts[0].padStart(2, "0");
    var m = parts[1].padStart(2, "0");
    var y = parts[2];
    return y + "-" + m + "-" + d;
  }

  function reviewEntries(dates, source) {
    var out = [];
    var map = [
      ["6-week review", dates.w6],
      ["12-week review", dates.w12],
      ["24-week review", dates.w24],
      ["32-week review", dates.w32],
    ];
    map.forEach(function (pair) {
      if (!pair[1] || pair[1] === "N/A") return;
      out.push({
        id: "seed-review-" + pair[1].replace(/\//g, ""),
        date: ukToIso(pair[1]),
        outcome: "Scheduled (" + pair[0] + ")",
        notes: "Source: " + source + ". Date from master list — outcome not yet recorded in sheet.",
      });
    });
    return out;
  }

  function docSection(status, notes, extra) {
    var sec = { status: status || "Not Started", link: "", notes: notes || "" };
    if (extra) {
      Object.keys(extra).forEach(function (k) {
        sec[k] = extra[k];
      });
    }
    return sec;
  }

  var SEED_RECORDS = {
    "ks4-calum-mison": {
      studentId: "ks4-calum-mison",
      metadata: {
        school: "Jo Richardson Community School",
        yearGroup: "Year 10",
        placementType: "Flexi",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Reduced Timetable",
        agencies: "",
        intendedDestination: "",
        dataSources:
          "Master list (data/ks4-master-export.csv), Y10 provision (Flexi Full Time), King's Trust tab, SEMH tab, DofE tab. No emails in workspace.",
      },
      induction: docSection("Not Started", "Provision: Flexi Full Time (Y10 provision tab). BFL: Final Warning (master list). Proposed start with centre.", {
        startDate: ukToIso("03/11/2026"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet or emails."),
      riskAssessment: docSection("Not Started", "SEMH tab: Significant Concern / Occasionally Dysregulated — this is SEMH risk, not a completed risk assessment document."),
      studentPassport: docSection("Not Started", "No student profile/passport status in sheet."),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-calum",
          date: "",
          qualification: "King's Trust — Theory, Practical, Level 1 Award",
          notes: "Sheet (King's Trust tab): Not Engaged on all three.",
        },
        {
          id: "seed-att-y10-calum",
          date: "",
          qualification: "Y10 provision courses (H&S L1, First Aid L1, Safeguarding, EE Play Maker)",
          notes: "Sheet (Y10 provision tab): Not Engaged on all.",
        },
        {
          id: "seed-att-dofe-calum",
          date: "",
          qualification: "DofE sections",
          notes: "Sheet (DofE tab): Account Not Set Up; all sections Not Started.",
        },
      ],
      reviews: reviewEntries(
        { w6: "15/12/2026", w12: "26/01/2027", w24: "20/04/2027", w32: "15/06/2027" },
        "Master list"
      ),
      removal: {
        flagged: true,
        status: "In Progress",
        warnings: "BFL Final Warning on master list (Previous WK BFL Status). Monitor Centre Home Agreement compliance.",
        evidenceLinks: SHEET_URL,
        notes: "Flagged for BFL Final Warning evidence from sheet — not an active removal unless provision exit is initiated.",
      },
    },
    "ks4-jayden-obrien": {
      studentId: "ks4-jayden-obrien",
      metadata: {
        school: "Jo Richardson Community School",
        yearGroup: "Year 10",
        placementType: "Flexi",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Mentoring",
        agencies: "",
        intendedDestination: "",
        dataSources: "Master list, Y10 provision (Flexi Full Time), King's Trust tab, SEMH tab.",
      },
      induction: docSection("Not Started", "Provision: Flexi Full Time. BFL: Doing Well / OK. Current placement on master list.", {
        startDate: ukToIso("26/03/2026"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection("Not Started", "SEMH tab: Emerging Concern / Regulated — SEMH data only, not RA document status."),
      studentPassport: docSection("Not Started", "No passport/profile status in sheet."),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-jayden",
          date: "",
          qualification: "King's Trust — Theory, Practical, Level 1 Award",
          notes: "Sheet: Completed on all three.",
        },
      ],
      reviews: reviewEntries(
        { w6: "07/05/2026", w12: "18/06/2026", w24: "10/09/2026", w32: "05/11/2026" },
        "Master list"
      ),
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-stacey-grail": {
      studentId: "ks4-stacey-grail",
      metadata: {
        school: "Jo Richardson Community School",
        yearGroup: "Year 10",
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Mentoring",
        agencies: "Social Services",
        intendedDestination: "",
        dataSources: "Master list, Y10 provision (KS4), King's Trust tab, SEMH tab, DofE tab.",
      },
      induction: docSection("Not Started", "Provision: KS4 (Y10 provision tab). BFL: Final Warning. Agencies: Social Services.", {
        startDate: ukToIso("12/08/2025"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection("Not Started", "SEMH tab: High Risk / Severely Dysregulated — SEMH data only."),
      studentPassport: docSection("Not Started", "No passport status in sheet."),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-stacey",
          date: "",
          qualification: "King's Trust — Level 1 Award",
          notes: "Sheet: Completed (Theory, Practical, Level 1 Award).",
        },
        {
          id: "seed-att-y10-stacey",
          date: "",
          qualification: "Y10 provision courses",
          notes: "Sheet: Started on H&S L1, First Aid L1, Safeguarding, EE Play Maker.",
        },
        {
          id: "seed-att-dofe-stacey",
          date: "",
          qualification: "DofE — Volunteer section",
          notes: "Sheet: In Progress on Volunteer; other sections Not Started.",
        },
      ],
      reviews: reviewEntries(
        { w6: "23/09/2025", w12: "04/11/2025", w24: "27/01/2026", w32: "24/03/2026" },
        "Master list"
      ),
      removal: {
        flagged: true,
        status: "In Progress",
        warnings: "BFL Final Warning on master list. Agencies: Social Services.",
        evidenceLinks: SHEET_URL,
        notes: "BFL Final Warning from sheet — monitor; not confirmed provision exit.",
      },
    },
    "ks4-tyrell-allassani": {
      studentId: "ks4-tyrell-allassani",
      metadata: {
        school: "Jo Richardson Community School",
        yearGroup: "Year 10",
        placementType: "Flexi",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Reduced Timetable",
        agencies: "",
        intendedDestination: "",
        dataSources: "Master list (no start date), Y10 provision (Flexi Full Time), King's Trust tab.",
      },
      induction: docSection("Not Started", "Provision: Flexi Full Time. BFL: Doing Well / OK. No start date on master list.", {
        startDate: "",
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection("Not Started", "SEMH tab: Low Risk / Occasionally Dysregulated."),
      studentPassport: docSection("Not Started", "No passport status in sheet."),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-tyrell",
          date: "",
          qualification: "King's Trust — Level 1 Award",
          notes: "Sheet: Completed on Theory, Practical, Level 1 Award.",
        },
        {
          id: "seed-att-y10-tyrell",
          date: "",
          qualification: "Y10 provision courses",
          notes: "Sheet: Started on all four listed courses.",
        },
      ],
      reviews: [],
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-ronny-burletson": {
      studentId: "ks4-ronny-burletson",
      metadata: {
        school: "Robert Clack",
        yearGroup: "Year 10",
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Reduced Timetable",
        agencies: "Social Services",
        intendedDestination: "",
        dataSources: "Master list, Y10 provision (KS4), King's Trust tab, SEMH tab, DofE tab.",
      },
      induction: docSection("Not Started", "Provision: KS4. BFL: Doing Well / OK. Agencies: Social Services.", {
        startDate: ukToIso("02/10/2025"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection("Not Started", "SEMH tab: High Risk / Frequently Dysregulated."),
      studentPassport: docSection("Not Started", "No passport status in sheet."),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-ronny",
          date: "",
          qualification: "King's Trust",
          notes: "Sheet: Completed (Theory, Practical, Level 1 Award). Y10 provision courses: N/A.",
        },
        {
          id: "seed-att-dofe-ronny",
          date: "",
          qualification: "DofE",
          notes: "Sheet: Account Set Up; all sections Not Started.",
        },
      ],
      reviews: reviewEntries(
        { w6: "13/11/2025", w12: "25/12/2025", w24: "19/03/2026", w32: "14/05/2026" },
        "Master list"
      ),
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-mason-taylor": {
      studentId: "ks4-mason-taylor",
      metadata: {
        school: "Dagenham Park School",
        yearGroup: "Year 10",
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Mentoring",
        agencies: "",
        intendedDestination: "",
        dataSources: "Master list, Y10 provision (KS4), King's Trust tab, SEMH tab.",
      },
      induction: docSection("Not Started", "Provision: KS4. BFL: Doing Well / OK.", {
        startDate: ukToIso("09/08/2025"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection("Not Started", "SEMH tab: Significant Concern / Occasionally Dysregulated."),
      studentPassport: docSection("Not Started", "No passport status in sheet."),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-y10-mason",
          date: "",
          qualification: "Y10 provision courses",
          notes: "Sheet: H&S and First Aid Not Engaged; Safeguarding Completed; EE Play Maker Started. King's Trust: N/A.",
        },
      ],
      reviews: reviewEntries(
        { w6: "20/09/2025", w12: "01/11/2025", w24: "24/01/2026", w32: "21/03/2026" },
        "Master list"
      ),
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-jovan-lane": {
      studentId: "ks4-jovan-lane",
      metadata: {
        school: "Robert Clack",
        yearGroup: "Year 10",
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "FLZ (Focused Learning Zone)",
        agencies: "Subwize",
        intendedDestination: "",
        dataSources: "Master list, Y10 provision (KS4), Engagement tab (as Jovan Lane Ridge), SEMH tab.",
      },
      induction: docSection("Not Started", "Provision: KS4. BFL: Report. Agencies: Subwize. Interventions: FLZ.", {
        startDate: ukToIso("27/01/2026"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection("Not Started", "SEMH tab: Significant Concern / Frequently Dysregulated. No risk assessment document status in sheet."),
      studentPassport: docSection("Not Started", "No passport status in sheet."),
      behaviour: [
        {
          id: "seed-beh-jovan-eng",
          date: "",
          description:
            "Engagement tab snapshot (name: Jovan Lane Ridge): Punctuality — Occasionally Late; Lesson engagement — Mostly Engaged; Purple Ruler — Attending & Completing Work; Concern — Low Concern; Home contact — No Contact; Trend — Stable.",
          intervention: "FLZ (master list). Follow up home contact.",
          outcome: "Ongoing monitoring per engagement tab.",
        },
      ],
      attainment: [
        {
          id: "seed-att-kt-jovan",
          date: "",
          qualification: "King's Trust — Level 1 Award",
          notes: "Sheet: Completed on all three.",
        },
        {
          id: "seed-att-y10-jovan",
          date: "",
          qualification: "Y10 provision courses",
          notes: "Sheet: Started on all four listed courses.",
        },
      ],
      reviews: reviewEntries(
        { w6: "10/03/2026", w12: "21/04/2026", w24: "14/07/2026", w32: "08/09/2026" },
        "Master list"
      ),
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-harrison-jones": {
      studentId: "ks4-harrison-jones",
      metadata: {
        school: "Robert Clack",
        yearGroup: "Year 10",
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Reduced Timetable",
        agencies: "",
        intendedDestination: "",
        dataSources: "Master list, Y10 provision (KS4), SEMH tab.",
      },
      induction: docSection("Not Started", "Provision: KS4. BFL: Doing Well / OK.", {
        startDate: ukToIso("07/10/2025"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection("Not Started", "SEMH tab: High Risk / Severely Dysregulated."),
      studentPassport: docSection("Not Started", "No passport status in sheet."),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-harrison",
          date: "",
          qualification: "King's Trust / Y10 provision",
          notes: "Sheet: King's Trust N/A; Y10 provision courses N/A.",
        },
      ],
      reviews: reviewEntries(
        { w6: "18/11/2025", w12: "30/12/2025", w24: "24/03/2026", w32: "19/05/2026" },
        "Master list"
      ),
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-joshua-lang": {
      studentId: "ks4-joshua-lang",
      metadata: {
        school: "All Saints",
        yearGroup: "Year 10",
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Mentoring",
        agencies: "",
        intendedDestination: "",
        dataSources: "Master list, Y10 provision (KS4), King's Trust tab, SEMH tab.",
      },
      induction: docSection("Not Started", "Provision: KS4. BFL: Doing Well / OK.", {
        startDate: ukToIso("03/05/2026"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection("Not Started", "SEMH tab: Emerging Concern / Occasionally Dysregulated."),
      studentPassport: docSection("Not Started", "No passport status in sheet."),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-joshua",
          date: "",
          qualification: "King's Trust — Level 1 Award",
          notes: "Sheet: Completed on all three.",
        },
        {
          id: "seed-att-y10-joshua",
          date: "",
          qualification: "Y10 provision courses",
          notes: "Sheet: Started on all four listed courses.",
        },
      ],
      reviews: reviewEntries(
        { w6: "14/06/2026", w12: "26/07/2026", w24: "18/10/2026", w32: "13/12/2026" },
        "Master list"
      ),
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-tyler-fredreick": {
      studentId: "ks4-tyler-fredreick",
      metadata: {
        school: "Robert Clack",
        yearGroup: "Year 10",
        placementType: "Unknown",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Mentoring",
        agencies: "",
        intendedDestination: "",
        dataSources:
          "Master list, Engagement tab (Tyler Frederick — spelling differs), SEMH tab. Not on Y10 provision tab. No emails in workspace.",
      },
      induction: docSection("Not Started", "Proposed start 03/07/2026. Not listed on Y10 provision tab — placement type unknown. BFL: Doing Well / OK on master list.", {
        startDate: ukToIso("03/07/2026"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection(
        "Not Started",
        "No risk assessment receipt in sheet or emails. (A dashboard task exists to chase Tyler's risk assessment — not used as evidence of document status.) SEMH tab: Significant Concern / Frequently Dysregulated."
      ),
      studentPassport: docSection("Not Started", "No passport status in sheet."),
      behaviour: [
        {
          id: "seed-beh-tyler-eng",
          date: "",
          description:
            "Engagement tab snapshot (Tyler Frederick): Punctuality — Frequently Late; Lesson engagement — Refusing / Disengaged; Purple Ruler — Not Accessing Learning; Concern — Monitor; Home contact — No Contact; Trend — Stable.",
          intervention: "Mentoring (master list).",
          outcome: "Ongoing — address disengagement per engagement tab.",
        },
      ],
      attainment: [],
      reviews: reviewEntries(
        { w6: "14/08/2026", w12: "25/09/2026", w24: "18/12/2026", w32: "12/02/2027" },
        "Master list"
      ),
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-flynn-hurley": {
      studentId: "ks4-flynn-hurley",
      metadata: {
        school: "Robert Clack",
        yearGroup: "Year 11",
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Mentoring",
        agencies: "",
        intendedDestination: "College",
        dataSources: "Master list, Y11 provision (KS4), King's Trust tab, SEMH tab.",
      },
      induction: docSection("Not Started", "Provision: KS4 (Y11 provision tab). Proposed start 01/09/2026. Intended destination: College.", {
        startDate: ukToIso("01/09/2026"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection("Not Started", "SEMH tab: Low Risk / Regulated."),
      studentPassport: docSection("Not Started", "Student profile not started (per KS4 tracker evidence)."),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-flynn",
          date: "",
          qualification: "King's Trust",
          notes: "Sheet: Completed (Theory, Practical, Level 1 Award).",
        },
        {
          id: "seed-att-y11-flynn",
          date: "",
          qualification: "GCSE English, GCSE Maths, Sports Leaders L1/L2",
          notes: "Y11 provision tab: In Progress on GCSE English, GCSE Maths, Sports Leaders; Safeguarding Completed.",
        },
      ],
      reviews: reviewEntries(
        { w6: "13/10/2026", w12: "24/11/2026", w24: "16/02/2027", w32: "13/04/2027" },
        "Master list"
      ),
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-charlie-archer": {
      studentId: "ks4-charlie-archer",
      metadata: {
        school: "Greatfields School",
        yearGroup: "Year 11",
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "JC",
        interventions: "FLZ (Focused Learning Zone)",
        agencies: "CAMHS",
        intendedDestination: "Apprenticeship",
        dataSources: "Master list, Y11 provision (KS4), King's Trust tab, DofE tab, SEMH tab.",
      },
      induction: docSection("Not Started", "Provision: KS4. Start 20/10/2025. Agencies: CAMHS. Interventions: FLZ.", {
        startDate: ukToIso("20/10/2025"),
      }),
      ilp: docSection("Not Started", "No ILP status in sheet."),
      riskAssessment: docSection("Not Started", "SEMH tab: High Risk / Frequently Dysregulated."),
      studentPassport: docSection("Not Started", "Student profile not started (per KS4 tracker). Create/send to school.", {
        source: "In-house (to be created)",
      }),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-charlie",
          date: "",
          qualification: "King's Trust",
          notes: "Sheet: Completed on all three.",
        },
        {
          id: "seed-att-y11-charlie",
          date: "",
          qualification: "GCSE English/Maths, Functional Skills Maths, Sports Leaders",
          notes: "Y11 provision: In Progress on GCSE English, GCSE Maths, Functional Skills Maths, Sports Leaders; H&S/First Aid/Safeguarding Completed.",
        },
        {
          id: "seed-att-dofe-charlie",
          date: "",
          qualification: "DofE — Physical & Skills sections",
          notes: "Sheet: Completed on Physical and Skills; Volunteer and Expedition Not Started.",
        },
      ],
      reviews: reviewEntries(
        { w6: "01/12/2025", w12: "12/01/2026", w24: "06/04/2026", w32: "01/06/2026" },
        "Master list"
      ),
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
  };

  function isEmptySection(sec) {
    if (!sec) return true;
    return (
      (!sec.link || sec.link === "") &&
      (!sec.notes || sec.notes === "") &&
      (!sec.startDate || sec.startDate === "") &&
      (!sec.source || sec.source === "") &&
      (sec.status === "Not Started" || !sec.status)
    );
  }

  function mergeSection(existing, seed) {
    if (!seed) return existing;
    if (!existing || isEmptySection(existing)) return JSON.parse(JSON.stringify(seed));
    var out = JSON.parse(JSON.stringify(existing));
    if (!out.link && seed.link) out.link = seed.link;
    if (!out.startDate && seed.startDate) out.startDate = seed.startDate;
    if (!out.source && seed.source) out.source = seed.source;
    if ((!out.notes || out.notes === "") && seed.notes) out.notes = seed.notes;
    if (out.status === "Not Started" && seed.status && seed.status !== "Not Started") {
      out.status = seed.status;
    }
    return out;
  }

  function mergeArray(existing, seed, idField) {
    if (!seed || !seed.length) return existing || [];
    if (!existing || !existing.length) return JSON.parse(JSON.stringify(seed));
    var ids = {};
    existing.forEach(function (item) {
      if (item[idField]) ids[item[idField]] = true;
    });
    var out = existing.slice();
    seed.forEach(function (item) {
      if (item[idField] && !ids[item[idField]]) out.push(item);
    });
    return out;
  }

  function mergeRecord(existing, seed) {
    if (!existing) return JSON.parse(JSON.stringify(seed));
    var out = JSON.parse(JSON.stringify(existing));
    out.metadata = out.metadata || {};
    if (seed.metadata) {
      Object.keys(seed.metadata).forEach(function (k) {
        if (!out.metadata[k] || out.metadata[k] === "Unknown" || out.metadata[k] === "") {
          out.metadata[k] = seed.metadata[k];
        }
      });
    }
    ["induction", "ilp", "riskAssessment", "studentPassport"].forEach(function (key) {
      out[key] = mergeSection(out[key], seed[key]);
    });
    out.behaviour = mergeArray(out.behaviour, seed.behaviour, "id");
    out.attainment = mergeArray(out.attainment, seed.attainment, "id");
    out.reviews = mergeArray(out.reviews, seed.reviews, "id");
    if (seed.removal && seed.removal.flagged) {
      if (!out.removal || !out.removal.flagged) {
        out.removal = JSON.parse(JSON.stringify(seed.removal));
      } else {
        if (!out.removal.warnings && seed.removal.warnings) out.removal.warnings = seed.removal.warnings;
        if (!out.removal.evidenceLinks && seed.removal.evidenceLinks) {
          out.removal.evidenceLinks = seed.removal.evidenceLinks;
        }
        if (!out.removal.notes && seed.removal.notes) out.removal.notes = seed.removal.notes;
      }
    }
    if (!out.studentId) out.studentId = seed.studentId;
    out.seedVersion = SEED_VERSION;
    return out;
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

  function ensureKs4Students() {
    if (window.LloydsKS4 && window.LloydsKS4.migrateStudents) {
      return window.LloydsKS4.migrateStudents();
    }
    if (window.LloydsKS4 && window.LloydsKS4.getStudents) {
      return window.LloydsKS4.getStudents();
    }
    return [];
  }

  function migrateMonitoring() {
    ensureKs4Students();
    var version = parseInt(localStorage.getItem(VERSION_KEY) || "0", 10);
    var store = loadStore();
    var changed = false;

    Object.keys(SEED_RECORDS).forEach(function (id) {
      var seed = SEED_RECORDS[id];
      seed.updatedAt = new Date().toISOString();
      if (!store[id]) {
        store[id] = JSON.parse(JSON.stringify(seed));
        changed = true;
      } else if (version < SEED_VERSION) {
        store[id] = mergeRecord(store[id], seed);
        changed = true;
      }
    });

    if (changed || version < SEED_VERSION) {
      saveStore(store);
      localStorage.setItem(VERSION_KEY, String(SEED_VERSION));
    }

    return store;
  }

  window.LloydsKS4MonitoringSeed = {
    migrate: migrateMonitoring,
    ensureKs4Students: ensureKs4Students,
    loadStore: loadStore,
    SEED_VERSION: SEED_VERSION,
    SEED_RECORDS: SEED_RECORDS,
    STORAGE_KEY: STORAGE_KEY,
  };
})();

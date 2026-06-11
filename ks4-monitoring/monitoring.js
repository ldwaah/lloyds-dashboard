(function () {
  var STORAGE_KEY = "lloyds-ks4-monitoring";
  var VERSION_KEY = "lloyds-ks4-monitoring-seed-version";
  var SEED_VERSION = 7;

  var EXCLUDED_IDS = [
    "ks4-flynn-hurley",
    "ks4-charlie-archer",
  ];

  var SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1wTcqd1c7nLRK0HjS_UvCHFszBYytDKCy/edit?gid=1377154515";
  var MASTER_SHEET_URL =
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
        notes: "",
      });
    });
    return out;
  }

  function inductionStatusFromDate(startDate) {
    if (!startDate) return "Not Started";
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var parts = String(startDate).split("-");
    if (parts.length !== 3) return "Not Started";
    var start = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
    start.setHours(0, 0, 0, 0);
    if (start.getTime() < today.getTime()) return "Complete";
    if (start.getTime() > today.getTime()) return "Not Started";
    return "In Progress";
  }

  function inductionSection(startDateIso) {
    return {
      startDate: startDateIso || "",
      status: inductionStatusFromDate(startDateIso || ""),
      homeCentreAgreementLink: "",
      notes: "",
    };
  }

  function docSection(status) {
    return { status: status || "Not Started", link: "", notes: "" };
  }

  function normalizeRecord(record, clearSectionNotes) {
    if (!record) return record;
    if (record.induction) {
      var ind = record.induction;
      var hcaLink =
        ind.homeCentreAgreementLink || ind.centreAgreementLink || ind.link || "";
      record.induction = {
        startDate: ind.startDate || "",
        status: inductionStatusFromDate(ind.startDate || ""),
        homeCentreAgreementLink: hcaLink,
        notes: clearSectionNotes ? "" : ind.notes || "",
      };
    }
    ["ilp", "riskAssessment"].forEach(function (key) {
      if (record[key]) {
        record[key].notes = clearSectionNotes ? "" : record[key].notes || "";
        if (record[key].status) {
          record[key].status = record[key].status;
        }
      }
    });
    if (record.studentPassport) {
      record.studentPassport.notes = clearSectionNotes
        ? ""
        : record.studentPassport.notes || "";
    }
    if (clearSectionNotes && record.attainment) {
      record.attainment.forEach(function (a) {
        a.notes = "";
      });
    }
    if (clearSectionNotes && record.reviews) {
      record.reviews.forEach(function (r) {
        r.notes = "";
      });
    }
    if (record.removal && clearSectionNotes) {
      record.removal.notes = "";
    }
    return record;
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
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust",
      },
      induction: inductionSection(ukToIso("03/11/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-calum",
          date: "",
          qualification: "King's Trust - Theory, Practical, Level 1 Award",
          notes: "",
        },
        {
          id: "seed-att-y10-calum",
          date: "",
          qualification: "Y10 provision courses (H&S L1, First Aid L1, Safeguarding, EE Play Maker)",
          notes: "",
        },
        {
          id: "seed-att-dofe-calum",
          date: "",
          qualification: "DofE sections",
          notes: "",
        },
      ],
      reviews: reviewEntries(
        { w6: "15/12/2026", w12: "26/01/2027", w24: "20/04/2027", w32: "15/06/2027" },
        "Master list"
      ),
      removal: {
        flagged: true,
        status: "In Progress",
        warnings: "",
        evidenceLinks: MASTER_SHEET_URL,
        notes: "",
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
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust",
      },
      induction: inductionSection(ukToIso("26/03/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-jayden",
          date: "",
          qualification: "King's Trust - Theory, Practical, Level 1 Award",
          notes: "",
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
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust",
      },
      induction: inductionSection(ukToIso("12/08/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-stacey",
          date: "",
          qualification: "King's Trust - Level 1 Award",
          notes: "",
        },
        {
          id: "seed-att-y10-stacey",
          date: "",
          qualification: "Y10 provision courses",
          notes: "",
        },
        {
          id: "seed-att-dofe-stacey",
          date: "",
          qualification: "DofE - Volunteer section",
          notes: "",
        },
      ],
      reviews: reviewEntries(
        { w6: "23/09/2025", w12: "04/11/2025", w24: "27/01/2026", w32: "24/03/2026" },
        "Master list"
      ),
      removal: {
        flagged: true,
        status: "In Progress",
        warnings: "",
        evidenceLinks: MASTER_SHEET_URL,
        notes: "",
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
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust",
      },
      induction: inductionSection(""),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-tyrell",
          date: "",
          qualification: "King's Trust - Level 1 Award",
          notes: "",
        },
        {
          id: "seed-att-y10-tyrell",
          date: "",
          qualification: "Y10 provision courses",
          notes: "",
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
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust",
      },
      induction: inductionSection(ukToIso("02/10/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-ronny",
          date: "",
          qualification: "King's Trust",
          notes: "",
        },
        {
          id: "seed-att-dofe-ronny",
          date: "",
          qualification: "DofE",
          notes: "",
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
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust",
      },
      induction: inductionSection(ukToIso("09/08/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-y10-mason",
          date: "",
          qualification: "Y10 provision courses",
          notes: "",
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
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust",
      },
      induction: inductionSection(ukToIso("27/01/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-jovan",
          date: "",
          qualification: "King's Trust - Level 1 Award",
          notes: "",
        },
        {
          id: "seed-att-y10-jovan",
          date: "",
          qualification: "Y10 provision courses",
          notes: "",
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
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust",
      },
      induction: inductionSection(ukToIso("07/10/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-harrison",
          date: "",
          qualification: "King's Trust / Y10 provision",
          notes: "",
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
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust",
      },
      induction: inductionSection(ukToIso("03/05/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [
        {
          id: "seed-att-kt-joshua",
          date: "",
          qualification: "King's Trust - Level 1 Award",
          notes: "",
        },
        {
          id: "seed-att-y10-joshua",
          date: "",
          qualification: "Y10 provision courses",
          notes: "",
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
        agencies: "Robert Clack (Sean Webber, John Course)",
        intendedDestination: "",
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust",
      },
      induction: inductionSection(ukToIso("03/07/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [],
      reviews: reviewEntries(
        { w6: "14/08/2026", w12: "25/09/2026", w24: "18/12/2026", w32: "12/02/2027" },
        "Master list"
      ),
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-kamari-emanuel": {
      studentId: "ks4-kamari-emanuel",
      metadata: {
        school: "Barking Abbey",
        yearGroup: "Unknown",
        placementType: "Unknown",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "",
        agencies: "",
        intendedDestination: "",
        dataSources:
          "Outlook emails Jun 2026 (not on weekly concerns tab export)",
      },
      induction: inductionSection(""),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [],
      attainment: [],
      reviews: [],
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
  };

  function isEmptySection(sec) {
    if (!sec) return true;
    return (
      (!sec.link || sec.link === "") &&
      (!sec.homeCentreAgreementLink || sec.homeCentreAgreementLink === "") &&
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
    if (!out.homeCentreAgreementLink && seed.homeCentreAgreementLink) {
      out.homeCentreAgreementLink = seed.homeCentreAgreementLink;
    }
    if (!out.startDate && seed.startDate) out.startDate = seed.startDate;
    if (!out.source && seed.source) out.source = seed.source;
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

    EXCLUDED_IDS.forEach(function (id) {
      if (store[id]) {
        delete store[id];
        changed = true;
      }
    });

    var clearingNotes = version < SEED_VERSION;

    Object.keys(SEED_RECORDS).forEach(function (id) {
      var seed = SEED_RECORDS[id];
      seed.updatedAt = new Date().toISOString();
      if (!store[id]) {
        store[id] = normalizeRecord(JSON.parse(JSON.stringify(seed)), true);
        changed = true;
      } else if (version < SEED_VERSION) {
        store[id] = mergeRecord(store[id], seed);
        changed = true;
      }
    });

    if (version < 7) {
      Object.keys(SEED_RECORDS).forEach(function (id) {
        if (!store[id]) return;
        store[id].behaviour = [];
        if (store[id].attainment) {
          store[id].attainment.forEach(function (a) {
            a.notes = "";
          });
        }
        if (store[id].removal) {
          store[id].removal.warnings = "";
          store[id].removal.notes = "";
        }
        if (store[id].riskAssessment && store[id].riskAssessment.status === "Needed") {
          store[id].riskAssessment.status = "Not Started";
        }
        changed = true;
      });
    }

    Object.keys(store).forEach(function (id) {
      var before = JSON.stringify(store[id]);
      store[id] = normalizeRecord(store[id], clearingNotes);
      if (JSON.stringify(store[id]) !== before) changed = true;
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
    inductionStatusFromDate: inductionStatusFromDate,
    normalizeRecord: normalizeRecord,
    SEED_VERSION: SEED_VERSION,
    SEED_RECORDS: SEED_RECORDS,
    STORAGE_KEY: STORAGE_KEY,
  };
})();

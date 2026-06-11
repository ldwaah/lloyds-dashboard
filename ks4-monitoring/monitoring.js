(function () {
  var STORAGE_KEY = "lloyds-ks4-monitoring";
  var VERSION_KEY = "lloyds-ks4-monitoring-seed-version";
  var SEED_VERSION = 10;

  var REPORT_TERMS = ["Autumn", "Spring", "Summer"];

  function reportTermId(term) {
    return "report-" + String(term).toLowerCase();
  }

  function emptyReports() {
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

  function sheetStatus(cell) {
    var s = String(cell || "");
    if (s.indexOf("Not Engaged") >= 0) return "Not Engaged";
    if (s.indexOf("Started") >= 0) return "Started";
    if (s.indexOf("Completed") >= 0) return "Complete";
    if (s.indexOf("N/A") >= 0) return "N/A";
    return "";
  }

  function att(id, qualification) {
    return { id: id, date: "", qualification: qualification, notes: "" };
  }

  function beh(id, date, description, intervention, outcome) {
    return {
      id: id,
      date: date,
      description: description,
      intervention: intervention || "",
      outcome: outcome || "",
    };
  }

  function intv(id, date, type, description, outcome) {
    return {
      id: id,
      date: date,
      type: type,
      description: description,
      outcome: outcome || "",
    };
  }

  function kingsTrustAtt(slug, theory, practical, award) {
    var out = [];
    if (sheetStatus(theory)) {
      out.push(att("seed-att-kt-" + slug + "-theory", "King's Trust - Theory: " + sheetStatus(theory)));
    }
    if (sheetStatus(practical)) {
      out.push(att("seed-att-kt-" + slug + "-practical", "King's Trust - Practical: " + sheetStatus(practical)));
    }
    if (sheetStatus(award)) {
      out.push(
        att("seed-att-kt-" + slug + "-award", "King's Trust - Level 1 Award: " + sheetStatus(award))
      );
    }
    return out;
  }

  function y10ProvisionAtt(slug, hs, fa, sg, ee) {
    var out = [];
    if (sheetStatus(hs)) out.push(att("seed-att-y10-" + slug + "-hs", "Health & Safety L1: " + sheetStatus(hs)));
    if (sheetStatus(fa)) out.push(att("seed-att-y10-" + slug + "-fa", "First Aid L1: " + sheetStatus(fa)));
    if (sheetStatus(sg)) {
      out.push(att("seed-att-y10-" + slug + "-sg", "Safeguarding in Sport: " + sheetStatus(sg)));
    }
    if (sheetStatus(ee)) out.push(att("seed-att-y10-" + slug + "-ee", "EE Play Maker: " + sheetStatus(ee)));
    return out;
  }

  function applyEvidenceSeed(record, seed) {
    if (!record || !seed) return record;
    if (seed.metadata) {
      ["school", "yearGroup", "placementType", "leadMentor", "interventions", "agencies", "dataSources"].forEach(
        function (k) {
          if (seed.metadata[k]) record.metadata[k] = seed.metadata[k];
        }
      );
    }
    if (seed.induction) {
      record.induction = record.induction || inductionSection("");
      if (seed.induction.startDate) record.induction.startDate = seed.induction.startDate;
      record.induction.status = inductionStatusFromDate(record.induction.startDate || "");
      record.induction.homeCentreAgreementLink = record.induction.homeCentreAgreementLink || "";
      record.induction.notes = record.induction.notes || "";
    }
    ["ilp", "riskAssessment", "studentPassport"].forEach(function (key) {
      if (!seed[key]) return;
      record[key] = record[key] || docSection("Not Started");
      if (seed[key].status) record[key].status = seed[key].status;
      record[key].link = record[key].link || "";
      record[key].notes = record[key].notes || "";
    });
    record.behaviour = JSON.parse(JSON.stringify(seed.behaviour || []));
    record.interventions = JSON.parse(JSON.stringify(seed.interventions || []));
    record.attainment = JSON.parse(JSON.stringify(seed.attainment || []));
    record.reviews = mergeArray(record.reviews, seed.reviews, "id");
    if (seed.removal) {
      record.removal = record.removal || {
        flagged: false,
        status: "Not Started",
        warnings: "",
        evidenceLinks: "",
        notes: "",
      };
      if (seed.removal.flagged) record.removal.flagged = true;
      if (seed.removal.status) record.removal.status = seed.removal.status;
      record.removal.warnings = record.removal.warnings || seed.removal.warnings || "";
      if (!record.removal.evidenceLinks) record.removal.evidenceLinks = "";
      record.removal.notes = record.removal.notes || "";
    }
    return record;
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
    if (!record.interventions) {
      record.interventions = [];
    }
    if (!record.reports || !record.reports.length) {
      record.reports = emptyReports();
    } else {
      var byTerm = {};
      record.reports.forEach(function (r) {
        if (r && r.term) byTerm[r.term] = r;
      });
      record.reports = REPORT_TERMS.map(function (term) {
        var existing = byTerm[term];
        if (existing) {
          return {
            id: existing.id || reportTermId(term),
            term: term,
            dateSent: existing.dateSent || "",
            driveLink: existing.driveLink || "",
            status: existing.status || "Not sent",
          };
        }
        return {
          id: reportTermId(term),
          term: term,
          dateSent: "",
          driveLink: "",
          status: "Not sent",
        };
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
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust; Outlook behaviour thread Apr 2026",
      },
      induction: inductionSection(ukToIso("03/11/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-calum-20260428",
          "2026-04-28",
          "Final Warning Behaviour Contract issued following multi-agency meeting. Escalating concerns reported to JRCS.",
          "Weekly report system with behaviour targets introduced",
          "Core subjects only, 09:00-11:00 daily timetable"
        ),
        beh(
          "seed-beh-calum-20260429",
          "2026-04-29",
          "Arrived late. Two warnings for refusing to hand over aftershave bottle. Two warnings for playing video games. Vape in pocket. Dismissed at 11:00am.",
          "Behaviour warnings issued",
          "Placed on remote learning as interim measure"
        ),
      ],
      interventions: [
        intv(
          "seed-int-calum-20260428",
          "2026-04-28",
          "Parent meeting",
          "Formal behaviour update sent to JRCS (Gurjit Kaur). Final Warning Behaviour Contract in place.",
          "Weekly reviews agreed"
        ),
        intv(
          "seed-int-calum-20260501",
          "2026-05-01",
          "Futures meeting",
          "Meeting arranged with mum at Future Youth Zone, Tuesday 2:15pm.",
          "Mum confirmed availability"
        ),
        intv(
          "seed-int-calum-20260505",
          "2026-05-05",
          "Parent meeting",
          "CEO meeting with Calum, parent, and Miss Kaur JRCS. Behaviour expectations and monitoring plan agreed.",
          "Weekly reviews to Ms Core; remote learning pending school meeting"
        ),
        intv(
          "seed-int-calum-remote",
          "2026-04-30",
          "Remote learning",
          "Interim remote learning following behaviour incidents on 29 April.",
          "JRCS expressed concern about remote learning arrangement"
        ),
      ],
      attainment: kingsTrustAtt("calum", "Not Engaged", "Not Engaged", "Not Engaged").concat(
        y10ProvisionAtt("calum", "Not Engaged", "Not Engaged", "Not Engaged", "Not Engaged")
      ),
      reviews: reviewEntries(
        { w6: "15/12/2026", w12: "26/01/2027", w24: "20/04/2027", w32: "15/06/2027" },
        "Master list"
      ),
      removal: {
        flagged: true,
        status: "In Progress",
        warnings: "Final Warning",
        evidenceLinks: "",
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
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust; Outlook placement thread Mar-May 2026",
      },
      induction: inductionSection(ukToIso("26/03/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-jayden-weekly",
          "2026-06-11",
          "On full timetable but frequently asks to go home. Often reports feeling unwell. May lack confidence or comfort in centre.",
          "Health concerns monitored; full timetable maintained",
          "Weekly concerns tab: 41.38% attendance"
        ),
      ],
      interventions: [
        intv(
          "seed-int-jayden-20260317",
          "2026-03-17",
          "Other",
          "4-week respite placement started (mum confirmed Monday 17 March). Part-time timetable at JRCS since September 2025.",
          "Engaging well with work experience per JRCS"
        ),
        intv(
          "seed-int-jayden-20260515",
          "2026-05-15",
          "Futures meeting",
          "Review meeting 2pm at Future Youth Zone. Charlotte Bolton (JRCS) attending.",
          "4-week placement ended 16 May"
        ),
        intv(
          "seed-int-jayden-uniform",
          "2026-06-11",
          "Other",
          "Provide uniform so student does not wear hoodie and feels more comfortable.",
          "Agreed action on weekly concerns tab"
        ),
      ],
      attainment: kingsTrustAtt("jayden", "Completed", "Completed", "Completed").concat(
        y10ProvisionAtt("jayden", "N/A", "N/A", "N/A", "N/A")
      ),
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
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust; Outlook safeguarding threads May 2026",
      },
      induction: inductionSection(ukToIso("12/08/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Needed"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-stacey-20260210",
          "2026-02-10",
          "Horseplay escalated; punched student in private area.",
          "Removed from class; Tier 1 consequence",
          "3-day consequence issued"
        ),
        beh(
          "seed-beh-stacey-20260226",
          "2026-02-26",
          "Absconded from site. Mother disclosed police protection arrangements.",
          "Social worker informed",
          "Safeguarding monitoring escalated"
        ),
        beh(
          "seed-beh-stacey-20260227",
          "2026-02-27",
          "Suspected vaping; vape device located in blazer pocket.",
          "Vape confiscated",
          "Incident logged"
        ),
        beh(
          "seed-beh-stacey-20260302",
          "2026-03-02",
          "Assault of Year 8 pupil (Snapchat footage).",
          "Safeguarding chronology updated",
          "Final Warning issued"
        ),
        beh(
          "seed-beh-stacey-20260327",
          "2026-03-27",
          "Physical altercation with female student (provoked; retaliated).",
          "Two-week behaviour report",
          "No further incidents during report period"
        ),
        beh(
          "seed-beh-stacey-20260508",
          "2026-05-08",
          "Missing overnight / leaving site incident.",
          "Police-arranged safe location",
          "Safeguarding escalation"
        ),
        beh(
          "seed-beh-stacey-20260511",
          "2026-05-11",
          "Left site without permission at break time.",
          "Not permitted to return until risk assessment and meeting",
          "Remote learning from 11 May"
        ),
      ],
      interventions: [
        intv(
          "seed-int-stacey-ceo",
          "2026-05-18",
          "Parent meeting",
          "CEO issued final warning and conducted meeting with Stacey and mum.",
          "Comprehensive behaviour and safeguarding report circulated"
        ),
        intv(
          "seed-int-stacey-remote",
          "2026-05-11",
          "Remote learning",
          "Remote learning until risk assessment and multi-party meeting completed.",
          "CAD 3543/11May26 shared"
        ),
        intv(
          "seed-int-stacey-prof",
          "2026-05-12",
          "Safeguarding referral",
          "Professionals meeting reschedule requested urgently (Tiara Hutchinson, LBBD). Police escorted student home 11 May.",
          "Tracked to address; safe with mum"
        ),
        intv(
          "seed-int-stacey-mentor",
          "2026-02-09",
          "Mentoring",
          "Completed 1-to-1 mentoring session with SMART targets (Bromcom).",
          ""
        ),
      ],
      attainment: kingsTrustAtt("stacey", "Completed", "Completed", "Completed").concat(
        y10ProvisionAtt("stacey", "Started", "Started", "Started", "Started")
      ),
      reviews: reviewEntries(
        { w6: "23/09/2025", w12: "04/11/2025", w24: "27/01/2026", w32: "24/03/2026" },
        "Master list"
      ),
      removal: {
        flagged: true,
        status: "In Progress",
        warnings: "Final Warning",
        evidenceLinks: "",
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
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust; Outlook incident thread Mar 2026",
      },
      induction: inductionSection(""),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Needed"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-tyrell-20260324",
          "2026-03-24",
          "Serious safeguarding incident at local bus stop near provision. Dispute involving vape; physical punches exchanged; situation escalated into road with oncoming traffic.",
          "CCTV secured via Future Youth Zone Facilities Management",
          "Not permitted to attend until full risk assessment and safety plan completed"
        ),
      ],
      interventions: [
        intv(
          "seed-int-tyrell-safety",
          "2026-03-24",
          "Safeguarding referral",
          "Urgent meeting with JRCS following bus stop incident. Suspension discussed.",
          "Risk assessment and safety plan required before return"
        ),
        intv(
          "seed-int-tyrell-rt",
          "2026-06-11",
          "Other",
          "Reduced timetable with 12:15 finish for safety reasons (weekly concerns tab, 72.15% attendance).",
          "Monitor placement; review when external safety concerns updated"
        ),
        intv(
          "seed-int-tyrell-mentor",
          "2026-01-21",
          "Mentoring",
          "1-to-1 mentoring session (Bromcom, 21/01/2026).",
          ""
        ),
      ],
      attainment: kingsTrustAtt("tyrell", "Completed", "Completed", "Completed").concat(
        y10ProvisionAtt("tyrell", "Started", "Started", "Started", "Started")
      ),
      reviews: [],
      removal: { flagged: false, status: "Not Started", warnings: "", evidenceLinks: "", notes: "" },
    },
    "ks4-ronny-burletson": {
      studentId: "ks4-ronny-burletson",
      metadata: {
        school: "Jo Richardson Community School",
        yearGroup: "Year 10",
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Reduced Timetable",
        agencies: "Social Services",
        intendedDestination: "",
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust; Outlook attendance thread Apr 2026; Autumn 2 school report",
      },
      induction: inductionSection(ukToIso("02/10/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-ronny-20251117",
          "2025-11-17",
          "Physical aggression towards staff (hit staff on head with object). Removal from class; swearing including shouted slur.",
          "Tier 2 and Tier 3 consequences (Bromcom)",
          "Restorative session 24/11/2025"
        ),
        beh(
          "seed-beh-ronny-20260203",
          "2026-02-03",
          "Off-task, inappropriate language, refused instructions. Escalated to health and safety risk.",
          "Remote learning with immediate effect",
          "Pending review"
        ),
        beh(
          "seed-beh-ronny-20260416",
          "2026-04-16",
          "Attendance approximately 18%. Has not returned since Easter break. Multiple parent contact attempts with no response.",
          "Urgent support requested from parent school",
          "Parent school informed"
        ),
        beh(
          "seed-beh-ronny-20260417",
          "2026-04-17",
          "Seen roaming the streets during school time.",
          "Attendance monitoring",
          "Refer back to Rapid Response"
        ),
      ],
      interventions: [
        intv(
          "seed-int-ronny-restorative",
          "2025-11-24",
          "Restorative conversation",
          "Restorative session following RED level behaviour (unsafe/disruptive conduct).",
          ""
        ),
        intv(
          "seed-int-ronny-mentor",
          "2026-02-10",
          "Mentoring",
          "Completed 1-to-1 mentoring session (Bromcom, 10/02/2026).",
          ""
        ),
        intv(
          "seed-int-ronny-rr",
          "2026-06-11",
          "Safeguarding referral",
          "Refer back to Rapid Response; parent school informed of non-attendance (44.58% weekly concerns).",
          "Report submission to Bal pending clarification"
        ),
        intv(
          "seed-int-ronny-parent",
          "2026-04-16",
          "Parent contact",
          "Multiple contact attempts with parent regarding post-Easter non-return; no response.",
          "School liaison with JRCS (SIMPSON R)"
        ),
      ],
      attainment: kingsTrustAtt("ronny", "Completed", "Completed", "Completed").concat(
        y10ProvisionAtt("ronny", "N/A", "N/A", "N/A", "N/A")
      ),
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
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust; Autumn 2 school report Dec 2025",
      },
      induction: inductionSection(ukToIso("09/08/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-mason-report",
          "2025-12-14",
          "Autumn 2 report: Final Warning stage. Poor lesson engagement; refuses tasks (head down, dismissive). Significant punctuality concerns.",
          "Hybrid timetable for health and safety when onsite",
          "Reflection+ ineffective; mother consistently supportive"
        ),
        beh(
          "seed-beh-mason-weekly",
          "2026-06-11",
          "On reduced timetable. No new concerns raised this week (weekly concerns tab, 40.61% attendance).",
          "Remain on reduced timetable",
          "Continue monitoring"
        ),
      ],
      interventions: [
        intv(
          "seed-int-mason-restorative",
          "2025-11-03",
          "Restorative conversation",
          "Reset meeting with Mason's mum and step father (Bromcom, 03/11/2025).",
          ""
        ),
        intv(
          "seed-int-mason-mentor",
          "2025-12-04",
          "Mentoring",
          "1-to-1 mentoring during reduced timetable; agreed targets (Bromcom, 04/12/2025).",
          ""
        ),
        intv(
          "seed-int-mason-parent",
          "2025-12-14",
          "Parent contact",
          "Weekly parent contact noted on Autumn 2 school report.",
          "Mother consistently supportive"
        ),
      ],
      attainment: kingsTrustAtt("mason", "N/A", "N/A", "N/A").concat(
        y10ProvisionAtt("mason", "Not Engaged", "Not Engaged", "Completed", "Started")
      ),
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
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust; ks4-engagement.csv",
      },
      induction: inductionSection(ukToIso("27/01/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-jovan-weekly",
          "2026-06-11",
          "Full timetable but appears dysregulated and struggling with centre systems (weekly concerns tab, 79.41% attendance).",
          "Two 5-minute time-out breaks per day",
          "Maintain FLZ placement; follow BFL process for escalation"
        ),
      ],
      interventions: [
        intv(
          "seed-int-jovan-flz",
          "2026-06-11",
          "Other",
          "Focused Learning Zone placement with structured time-out breaks (weekly concerns agreed action).",
          "Engagement tab: Mostly Engaged, Low Concern"
        ),
        intv(
          "seed-int-jovan-reflection",
          "2026-02-13",
          "Other",
          "Positive message sent home for good conduct (Bromcom reflection, 13/02/2026).",
          ""
        ),
      ],
      attainment: kingsTrustAtt("jovan", "Completed", "Completed", "Completed").concat(
        y10ProvisionAtt("jovan", "Started", "Started", "Started", "Started")
      ),
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
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust; WhatsApp induction notes Jul 2025",
      },
      induction: inductionSection(ukToIso("07/10/2025")),
      ilp: docSection("In Progress"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-harrison-weekly",
          "2026-06-11",
          "Attends approximately once a week. Limited engagement and insufficient progress (weekly concerns, 12.27% attendance).",
          "Refer Rapid Response; FLZ when in centre positioned outside room",
          "Parent school informed"
        ),
      ],
      interventions: [
        intv(
          "seed-int-harrison-mentor",
          "2026-02-12",
          "Mentoring",
          "Completed 1-to-1 mentoring session (Bromcom, 12/02/2026).",
          ""
        ),
        intv(
          "seed-int-harrison-rr",
          "2026-06-11",
          "Safeguarding referral",
          "Refer back to Rapid Response per weekly concerns agreed action.",
          "Report submission to Bal pending clarification"
        ),
        intv(
          "seed-int-harrison-induction",
          "2025-07-08",
          "Other",
          "Induction completed. Staff noted potential classroom disruption risk; student understood centre policies.",
          "Permanent placement from September 2025 planned"
        ),
      ],
      attainment: kingsTrustAtt("harrison", "N/A", "N/A", "N/A").concat(
        y10ProvisionAtt("harrison", "N/A", "N/A", "N/A", "N/A")
      ),
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
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; Y10 provision; King's Trust; Outlook KS4 100% thread Jun 2026",
      },
      induction: inductionSection(ukToIso("03/05/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-joshua-incident",
          "2026-06-05",
          "Accidentally struck on nose by football during King's Trust Teamwork session. Nosebleed; first aid provided.",
          "Parent contacted",
          "Accidental; student later reported feeling okay"
        ),
      ],
      interventions: [
        intv(
          "seed-int-joshua-rr",
          "2026-06-03",
          "Safeguarding referral",
          "Rapid Response referral (Bal Gill). All Saints supportive of 100% SEC placement; Joshua already with provision.",
          "School liaison with All Saints"
        ),
        intv(
          "seed-int-joshua-review",
          "2026-06-11",
          "Parent meeting",
          "Parent school review scheduled; intervention plan to follow (weekly concerns, 76.09% attendance).",
          ""
        ),
      ],
      attainment: kingsTrustAtt("joshua", "Completed", "Completed", "Completed").concat(
        y10ProvisionAtt("joshua", "Started", "Started", "Started", "Started")
      ),
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
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "Mentoring",
        agencies: "Robert Clack (Sean Webber, John Course)",
        intendedDestination: "",
        dataSources:
          "Weekly concerns tab (gid 1377154515, exported 2026-06-11); master list; ks4-engagement.csv; Outlook punctuality thread Jun 2026",
      },
      induction: inductionSection(ukToIso("03/07/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Needed"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-tyler-20260608",
          "2026-06-08",
          "Arrived 12:35 despite 9:00am start expectation. Pattern of 2-3 hour lateness. Defensive when staff discuss lateness; rudeness, inappropriate language, difficulty following instructions.",
          "CEO invited mum to meeting",
          "Engagement tab: Frequently Late, Refusing/Disengaged"
        ),
      ],
      interventions: [
        intv(
          "seed-int-tyler-remote",
          "2026-06-09",
          "Remote learning",
          "Temporarily on remote learning package (not excluded). Safeguarding concerns re lateness, attendance, activities outside provision.",
          "Urgent review with school and parent"
        ),
        intv(
          "seed-int-tyler-meeting",
          "2026-06-12",
          "Futures meeting",
          "Review meeting Thursday 9:30am at Futures with mum and Tyler. Robert Clack (Sean Webber) invited.",
          "Rapid Response report shared 10 June"
        ),
        intv(
          "seed-int-tyler-ceo",
          "2026-06-11",
          "Parent meeting",
          "Meeting with CEO; risk assessment noted on cohort list. DSL (John Course) requested next steps plan.",
          "Completed risk assessment requested post-meeting"
        ),
      ],
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
        yearGroup: "Year 10",
        placementType: "KS4",
        fundingType: "Unknown",
        leadMentor: "LD",
        interventions: "",
        agencies: "",
        intendedDestination: "",
        dataSources:
          "Outlook emails Jun 2026 (not on weekly concerns tab export); Rapid Response batch referral",
      },
      induction: inductionSection(""),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        beh(
          "seed-beh-kamari-rr",
          "2026-06-09",
          "Rapid Response referral: two physical altercations since returning to school. Key issue: anger management.",
          "Referral ACCEPT; suitable for 100% SEC",
          ""
        ),
      ],
      interventions: [
        intv(
          "seed-int-kamari-induction",
          "2026-06-11",
          "Parent contact",
          "Lloyd to contact Barking Abbey and cc Bal regarding Kamari Emanuel induction arrangements.",
          "Barking Abbey live place per cohort list 10/06/2026"
        ),
        intv(
          "seed-int-kamari-rr",
          "2026-06-09",
          "Safeguarding referral",
          "Rapid Response referral ACCEPT. Suitable for 100% Sports and Education Centre.",
          "Induction pending"
        ),
      ],
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
    out.interventions = mergeArray(out.interventions, seed.interventions, "id");
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

    if (version < 8) {
      Object.keys(store).forEach(function (id) {
        if (!store[id].interventions) {
          store[id].interventions = [];
          changed = true;
        }
      });
    }

    if (version < 9) {
      Object.keys(store).forEach(function (id) {
        if (!store[id].reports || !store[id].reports.length) {
          store[id].reports = emptyReports();
          changed = true;
        } else {
          var before = JSON.stringify(store[id].reports);
          store[id].reports = normalizeRecord({ reports: store[id].reports }).reports;
          if (JSON.stringify(store[id].reports) !== before) changed = true;
        }
      });
    }

    if (version < 10) {
      Object.keys(SEED_RECORDS).forEach(function (id) {
        if (!store[id]) return;
        applyEvidenceSeed(store[id], SEED_RECORDS[id]);
        changed = true;
      });
    }

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
    emptyReports: emptyReports,
    REPORT_TERMS: REPORT_TERMS,
    SEED_VERSION: SEED_VERSION,
    SEED_RECORDS: SEED_RECORDS,
    STORAGE_KEY: STORAGE_KEY,
  };
})();

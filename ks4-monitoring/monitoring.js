(function () {
  var STORAGE_KEY = "lloyds-ks4-monitoring";
  var VERSION_KEY = "lloyds-ks4-monitoring-seed-version";
  var SEED_VERSION = 6;

  var EXCLUDED_IDS = [
    "ks4-flynn-hurley",
    "ks4-charlie-archer",
  ];

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
          "Master list, Y10 provision, King's Trust, SEMH, DofE tabs; Outlook desktop cache (HxStore.hxd, extracted 2026-06-11).",
      },
      induction: inductionSection(ukToIso("03/11/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        {
          id: "email-beh-calum-1",
          date: "",
          description: "Outlook email thread: RE: Calum Mison Behaviour Update (subject line in local cache).",
          intervention: "",
          outcome: "Behaviour update correspondence - see data/emails-extracted/calum-mison.txt.",
        },
      ],
      attainment: [
        {
          id: "seed-att-kt-calum",
          date: "",
          qualification: "King's Trust - Theory, Practical, Level 1 Award",
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
        notes: "Flagged for BFL Final Warning evidence from sheet - not an active removal unless provision exit is initiated.",
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
        dataSources: "Master list, Y10 provision, King's Trust, SEMH tabs; Outlook desktop cache (2026-06-11).",
      },
      induction: inductionSection(ukToIso("26/03/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        {
          id: "email-beh-jayden-1",
          date: "",
          description:
            "Outlook: Re: Jayden O Brien - Year 10 4 week placement; school requested progress update and confirmation of return following work experience placement.",
          intervention: "",
          outcome: "See data/emails-extracted/jayden-obrien.txt.",
        },
      ],
      attainment: [
        {
          id: "seed-att-kt-jayden",
          date: "",
          qualification: "King's Trust - Theory, Practical, Level 1 Award",
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
        dataSources: "Master list, Y10 provision, King's Trust, SEMH, DofE tabs; Outlook desktop cache (2026-06-11).",
      },
      induction: inductionSection(ukToIso("12/08/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        {
          id: "email-beh-stacey-1",
          date: "2026-05-08",
          description:
            "Outlook: Safeguarding Update re Stacey Grail (LAC) - email dated 8 May 2026; separate thread URGENT SAFEGUARDING UPDATE re arrival/whereabouts.",
          intervention: "Social Services (master list).",
          outcome: "See data/emails-extracted/stacey-grail.txt.",
        },
        {
          id: "email-beh-stacey-2",
          date: "",
          description: "Outlook: Stacey Grail (LAC) - final warning (subject line in local cache).",
          intervention: "",
          outcome: "Final warning referenced in email subject - correlate with BFL on master list.",
        },
      ],
      attainment: [
        {
          id: "seed-att-kt-stacey",
          date: "",
          qualification: "King's Trust - Level 1 Award",
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
          qualification: "DofE - Volunteer section",
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
        notes: "BFL Final Warning from sheet - monitor; not confirmed provision exit.",
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
        dataSources: "Master list, Y10 provision, King's Trust tabs; Outlook desktop cache (2026-06-11).",
      },
      induction: inductionSection(""),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        {
          id: "email-beh-tyrell-1",
          date: "",
          description:
            "Outlook: request to review Tyrell's Zoho email access; listed in KS4 rapid-response referral batch (with Charlie A, Stacey G, Flynn H, Jovan L, Calum M, Tyrell).",
          intervention: "",
          outcome: "See data/emails-extracted/tyrell-allassani.txt.",
        },
      ],
      attainment: [
        {
          id: "seed-att-kt-tyrell",
          date: "",
          qualification: "King's Trust - Level 1 Award",
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
        dataSources: "Master list, Y10 provision, King's Trust, SEMH, DofE tabs; Outlook Rapid Response Referrals email (2026-06-11 extract).",
      },
      induction: inductionSection(ukToIso("02/10/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        {
          id: "email-beh-ronny-1",
          date: "",
          description: "Outlook: Ronny Burletson listed in Rapid Response Referrals (6) table - Robert Clack, live placement.",
          intervention: "Reduced Timetable (master list).",
          outcome: "Referral batch email in local cache.",
        },
      ],
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
        dataSources: "Master list, Y10 provision, King's Trust, SEMH tabs; Outlook Rapid Response Referrals email (2026-06-11 extract).",
      },
      induction: inductionSection(ukToIso("09/08/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        {
          id: "email-beh-mason-1",
          date: "",
          description: "Outlook: Mason Taylor listed in Rapid Response Referrals table - Dagenham Park School.",
          intervention: "Mentoring (master list).",
          outcome: "Referral batch email in local cache.",
        },
      ],
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
        dataSources: "Master list, Y10 provision, Engagement tab (Jovan Lane Ridge), SEMH tab; Outlook Rapid Response Referrals + Purple Ruler guide email (2026-06-11).",
      },
      induction: inductionSection(ukToIso("27/01/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        {
          id: "email-beh-jovan-1",
          date: "",
          description:
            "Outlook: Jovan Lane-Ridge in Rapid Response Referrals batch; Purple Ruler parent guide email includes jovan lane-ridge@robertclack.co.uk student login.",
          intervention: "FLZ (master list).",
          outcome: "See data/emails-extracted/jovan-lane.txt.",
        },
        {
          id: "seed-beh-jovan-eng",
          date: "",
          description:
            "Engagement tab snapshot (name: Jovan Lane Ridge): Punctuality - Occasionally Late; Lesson engagement - Mostly Engaged; Purple Ruler - Attending & Completing Work; Concern - Low Concern; Home contact - No Contact; Trend - Stable.",
          intervention: "FLZ (master list). Follow up home contact.",
          outcome: "Ongoing monitoring per engagement tab.",
        },
      ],
      attainment: [
        {
          id: "seed-att-kt-jovan",
          date: "",
          qualification: "King's Trust - Level 1 Award",
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
        dataSources: "Master list, Y10 provision, SEMH tab; Outlook Rapid Response Referrals + Purple Ruler guide email (2026-06-11).",
      },
      induction: inductionSection(ukToIso("07/10/2025")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: { status: "In Progress", source: "", link: "", notes: "" },
      behaviour: [
        {
          id: "email-beh-harrison-1",
          date: "",
          description: "Outlook: Harrison Jones in Rapid Response Referrals table - Robert Clack, live placement.",
          intervention: "Reduced Timetable (master list).",
          outcome: "Report submission to Barking Abbey referenced in email subject line.",
        },
      ],
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
        dataSources: "Master list, Y10 provision, King's Trust, SEMH tabs; Outlook desktop cache (2026-06-11).",
      },
      induction: inductionSection(ukToIso("03/05/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        {
          id: "email-beh-joshua-1",
          date: "",
          description: "Outlook: See below regarding Joshua Lang; Joshua Lang and Daniel Jolaoso (email subjects in cache).",
          intervention: "Mentoring (master list).",
          outcome: "See data/emails-extracted/joshua-lang.txt.",
        },
      ],
      attainment: [
        {
          id: "seed-att-kt-joshua",
          date: "",
          qualification: "King's Trust - Level 1 Award",
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
        agencies: "Robert Clack (Sean Webber, John Course)",
        intendedDestination: "",
        dataSources:
          "Master list, Engagement tab (Tyler Frederick), SEMH tab, Outlook Web emails Jun 2026 (URGENT: Tyler Fredrick Punctuality and Behaviour Concern).",
      },
      induction: inductionSection(ukToIso("03/07/2026")),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Needed"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        {
          id: "seed-beh-tyler-eng",
          date: "",
          description:
            "Engagement tab (Tyler Frederick): Frequently Late; Refusing/Disengaged; Not Accessing Learning; Monitor; No Contact; Stable.",
          intervention: "Mentoring (master list).",
          outcome: "Ongoing.",
        },
        {
          id: "seed-beh-tyler-email-0806",
          date: ukToIso("08/06/2026"),
          description:
            "Email (Admin Support to Sean Webber, Robert Clack): Tyler arrived 12:35, expected from 9:00am; ongoing punctuality concerns (often 2–3 hours late); defensive when staff discuss lateness; conduct concerns - rudeness to staff, inappropriate language, difficulty following instructions.",
          intervention: "CEO invited mum to meeting to discuss concerns.",
          outcome: "Meeting planned.",
        },
        {
          id: "seed-beh-tyler-email-1106",
          date: ukToIso("11/06/2026"),
          description:
            "Email (John Course, Robert Clack DSL): Rapid Response report shared; requesting clarification of plan/next steps for Tyler; offering to support and attend meetings.",
          intervention: "School liaison (Sean Webber also offered to attend review).",
          outcome: "Pending response.",
        },
      ],
      attainment: [],
      reviews: reviewEntries(
        { w6: "14/08/2026", w12: "25/09/2026", w24: "18/12/2026", w32: "12/02/2027" },
        "Master list"
      ).concat([
        {
          id: "seed-review-tyler-futures-0906",
          date: ukToIso("12/06/2026"),
          outcome: "Scheduled - Futures review meeting",
          notes:
            "Email 09/06/2026 (Amy Dwaah, Admin Support): meeting arranged Thursday 9:30am with mum and Tyler at Futures; Robert Clack (Sean Webber) invited.",
        },
      ]),
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
          "Outlook Web emails Jun 2026; Outlook desktop HxStore cache extract 2026-06-11 (data/emails-extracted/kamari.txt).",
      },
      induction: inductionSection(""),
      ilp: docSection("Not Started"),
      riskAssessment: docSection("Not Started"),
      studentPassport: docSection("Not Started"),
      behaviour: [
        {
          id: "email-beh-kamari-1",
          date: "",
          description:
            "HxStore: Kamari Emanuel - contact school cc Bal for induction; Barking Abbey referenced in referral batch email.",
          intervention: "",
          outcome: "See data/emails-extracted/kamari.txt.",
        },
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

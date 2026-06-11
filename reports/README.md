# Year 10 Email Evidence Reports

Generated: 2026-06-11 (updated)  
**Progress trackers:** Google Sheets (primary); cached CSVs in `data/`  
**Bromcom extraction:** 2026-06-11 (supplementary; Profile view per student)  
**Outlook Web full extract:** 2026-06-11 (cursor-ide-browser MCP, reading pane via CDP `Runtime.evaluate`)

## Reports

| Student | File | Progress & gaps | Outlook full extract |
|---------|------|-----------------|----------------------|
| Calum Mison | [year-10/calum-mison.md](year-10/calum-mison.md) | Yes | Behaviour thread |
| Jayden O'Brien | [year-10/jayden-obrien.md](year-10/jayden-obrien.md) | Yes | Placement thread |
| Stacey Grail | [year-10/stacey-grail.md](year-10/stacey-grail.md) | Yes | Safeguarding + behaviour threads |
| Tyrell Allassani | [year-10/tyrell-allassani.md](year-10/tyrell-allassani.md) | Yes | Incident thread |
| Ronny Burletson | [year-10/ronny-burletson.md](year-10/ronny-burletson.md) | Yes | Attendance + cohort threads |
| Mason Taylor | [year-10/mason-taylor.md](year-10/mason-taylor.md) | Yes | Cohort list |
| Jovan Lane | [year-10/jovan-lane.md](year-10/jovan-lane.md) | Yes | Cohort list |
| Harrison Jones | [year-10/harrison-jones.md](year-10/harrison-jones.md) | Yes | Cohort list |
| Joshua Lang | [year-10/joshua-lang.md](year-10/joshua-lang.md) | Yes | KS4 100% thread |
| Tyler Fredreick | [year-10/tyler-fredreick.md](year-10/tyler-fredreick.md) | Yes | URGENT punctuality thread |
| Kamari Emanuel (optional) | [year-10/kamari-emanuel.md](year-10/kamari-emanuel.md) | Yes | Cohort list + HxStore |

Student list verified from `ks4-monitoring/ks4-students.js` (10 Year 10 students + Kamari as optional).

## Search methodology

### 1. Google Sheets progress trackers (PRIMARY)

**Master tracker:** `https://docs.google.com/spreadsheets/d/1kMZy6UPEICCHABe7Fa9FIf_ij0z79l84aAYsRhzn-qc/`

| Cached file | Tab / content |
|-------------|---------------|
| `data/ks4-master-export.csv` | Master list: BFL, interventions, review dates, start dates |
| `data/ks4-year10-provision.csv` | Y10 provision courses (H&S, First Aid, Safeguarding, EE Play Maker) |
| `data/ks4-kings-trust.csv` | King's Trust theory/practical/award |
| `data/ks4-engagement.csv` | Engagement tab (punctuality, lesson engagement, concern level) |

**Weekly concerns:** `https://docs.google.com/spreadsheets/d/1wTcqd1c7nLRK0HjS_UvCHFszBYytDKCy/` gid=1377154515

| Cached file | Content |
|-------------|---------|
| `data/ks4-weekly-concerns-export.csv` | Att%, present concerns, strengths, agreed actions |

**Live re-fetch (2026-06-11):** CSV export URLs returned auth/page-not-found from this environment. Progress data taken from cached exports above (same gids referenced in `ks4-monitoring/monitoring.js`).

Each `year-10/{slug}.md` includes `## Progress & gaps summary` cross-referencing sheet + email + Bromcom evidence.

### 2. Outlook Web (cursor-ide-browser MCP)

- Tab: `https://outlook.cloud.microsoft/mail/` (signed in as Lloyd Dwaah, ldwaah@evolution-sportsgroup.com)
- Workflow: `browser_lock` → search combobox fill + Enter → click `[role=option]` → expand conversation → CDP extract `document.querySelector('[role=main][aria-label="Reading Pane"]').innerText`
- Raw extracts saved to `data/outlook-extracts/`:
  - `stacey-grail-urgent-safeguarding-thread.txt` (Tiara Hutchinson)
  - `student-updates-10-june-2026-thread.txt` (cohort list + Kamari/Harrison/Ronny/Tyler)
  - `ronny-attendance-concern-thread.txt` (Ronny and Teddy)
  - `tyler-fredrick-urgent-thread.txt`, `tyrell-allassani-incident-thread.txt` (prior pass)
- **Newly opened this pass:** URGENT SAFEGUARDING UPDATE (Stacey); Student updates 10 June 2026; Attendance Concern Ronny and Teddy
- **Cohort list:** captured inside Eugene Dwaah `Student updates 10 June 2026` email (not a separate subject line)

### 3. Desktop Outlook AppleScript

```applescript
tell application "Microsoft Outlook" to count of messages of inbox
```

- **Result:** 0 messages in all folders via AppleScript
- **Cause:** New Outlook mode (`IsRunningNewOutlook = 1`). Classic AppleScript mail model not populated.

### 4. HxStore.hxd local cache

- **Path:** `~/Library/Group Containers/UBF8T346G9.Office/Outlook/Outlook 15 Profiles/Main Identity/HxStore.hxd`
- **Method:** Read-only binary extract; audit in `data/emails-extracted/*.txt`

### 5. Bromcom MIS (supplementary)

- **URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/People/StudentList.aspx` (Evolution Education, signed in)
- **Profile URL pattern:** `StudentDetails.aspx?StudentIDs={id}#Profile`
- **Date confirmed:** 2026-06-11
- **Access:** OK. All 10 target Year 10 students located (Y10 / KS4 Reg).
- **Captured:** Profile "All panels" view per student (enrolment, attendance summary, contacts, support events where visible).
- **Not captured:** Assessment tab, dedicated Attendance/Behaviour/SEN/Safeguarding sub-pages (sidebar tabs not opened; Assessment click returned zero-dimension element). No qualification progress data from Bromcom.
- **Progress tracker answer:** Bromcom does not replace Google Sheets for course/review tracking in this pass.

### 6. Existing audit files

- `data/emails-extracted/` (per-student `.txt`, `_summary.txt`, `outlook-search-report.txt`, `general-ks4-terms.txt`)

## Access blockers

| Source | Status |
|--------|--------|
| Google Sheets (live CSV export) | Blocked without auth (cached CSVs used) |
| Outlook Web | Available |
| AppleScript (New Outlook) | Blocked |
| HxStore | Available (fragments) |
| Bromcom MIS | Available (Profile only; not progress/qualification tabs) |

## Rules applied

- Evidence only from sources above
- No guessing or fabrication
- Gaps explicitly noted per student
- No em dashes in generated summaries

# Year 10 Email Evidence Reports

Generated: 2026-06-11  
**Bromcom extraction:** 2026-06-11 (all 10 Year 10 students located in Bromcom MIS)  
**Outlook Web full extract:** 2026-06-11 (cursor-ide-browser MCP, reading pane via CDP `Runtime.evaluate`)

## Reports

| Student | File | Threads found | Excerpts (HxStore audit) |
|---------|------|---------------|--------------------------|
| Calum Mison | [year-10/calum-mison.md](year-10/calum-mison.md) | 2 | 3 |
| Jayden O'Brien | [year-10/jayden-obrien.md](year-10/jayden-obrien.md) | 1 | 4 |
| Stacey Grail | [year-10/stacey-grail.md](year-10/stacey-grail.md) | 4 | 3 |
| Tyrell Allassani | [year-10/tyrell-allassani.md](year-10/tyrell-allassani.md) | 2 | 2 |
| Ronny Burletson | [year-10/ronny-burletson.md](year-10/ronny-burletson.md) | 2 | 0 (batch table only) |
| Mason Taylor | [year-10/mason-taylor.md](year-10/mason-taylor.md) | 1 | 0 (batch table only) |
| Jovan Lane | [year-10/jovan-lane.md](year-10/jovan-lane.md) | 2 | 1 |
| Harrison Jones | [year-10/harrison-jones.md](year-10/harrison-jones.md) | 2 | 1 |
| Joshua Lang | [year-10/joshua-lang.md](year-10/joshua-lang.md) | 4 | 2 |
| Tyler Fredreick | [year-10/tyler-fredreick.md](year-10/tyler-fredreick.md) | 3 | 2 (+ full Outlook Web thread) |
| Kamari Emanuel (optional) | [year-10/kamari-emanuel.md](year-10/kamari-emanuel.md) | 2 | 2 |

Student list verified from `ks4-monitoring/ks4-students.js` (10 Year 10 students + Kamari as optional).

## Search methodology

### 1. Outlook Web (cursor-ide-browser MCP)

- Tab: `https://outlook.cloud.microsoft/mail/` (signed in as Lloyd Dwaah, ldwaah@evolution-sportsgroup.com)
- Workflow: `browser_lock` → search combobox fill + Enter → click `[role=option]` → expand conversation → CDP extract `document.querySelector('[role=main][aria-label="Reading Pane"]').innerText`
- Raw extracts saved to `data/outlook-extracts/` where full threads captured
- **Emails fully opened (reading pane):** Calum Mison Behaviour Update; Tyler Fredrick URGENT thread; Stacey Grail Comprehensive Behaviour & Safeguarding Report; Jayden O Brien 4-week placement; Joshua Lang KS4 100%; Tyrell Allassani incident; Student updates / Current Cohort / Rapid Response / Ronny attendance (partial or batch references)
- **Access:** OK when search returns results; search UI sometimes returns empty message list until retry
- Each `year-10/{slug}.md` includes `## Outlook Web (full extract)` with quoted evidence only

### 2. Desktop Outlook AppleScript

```applescript
tell application "Microsoft Outlook" to count of messages of inbox
```

- **Result:** 0 messages in all folders via AppleScript
- **Cause:** New Outlook mode (`IsRunningNewOutlook = 1`). Classic AppleScript mail model not populated.
- **Workaround:** Revert to Legacy Outlook, or use Outlook Web / HxStore cache

### 3. HxStore.hxd local cache

- **Path:** `~/Library/Group Containers/UBF8T346G9.Office/Outlook/Outlook 15 Profiles/Main Identity/HxStore.hxd` (~37 MB, read 2026-06-11)
- **Method:** Read-only binary extract (ASCII runs + context windows); prior audit saved to `data/emails-extracted/*.txt`
- **Note:** Earlier extract used `.../Main Profile/Data/HxStore.hxd`; current file is under `Main Identity/`

### 4. Bromcom MIS (cursor-ide-browser MCP)

- Tab: `https://cloudmis.bromcom.com/Nucleus/UI/Areas/People/StudentList.aspx` (Evolution Education, signed in)
- Method: Students List grid (38 on roll) plus per-student Profile (`StudentDetails.aspx?StudentIDs={id}#Profile`)
- **Access:** OK. All 10 target students found as Y10 / KS4 Reg.
- **Evidence appended:** `## Bromcom data` section in each `year-10/{slug}.md`
- **Not extracted in this pass:** dedicated Behaviour, Attendance, SEN, Health Background, Safeguarding sub-tabs (Profile "All panels" view used); behaviour point totals from list additional columns did not render after column save

### 5. Existing audit files

- `data/emails-extracted/` (per-student `.txt`, `_summary.txt`, `outlook-search-report.txt`, `general-ks4-terms.txt`)
- Extracted 2026-06-11 from HxStore; cross-checked against live cache re-read on 2026-06-11

## Access blockers

| Source | Status |
|--------|--------|
| Outlook Web | Available |
| AppleScript (New Outlook) | Blocked - 0 messages returned |
| HxStore | Available (subjects/snippets; full bodies often truncated) |
| Full email bodies | Partial - cache fragments and Outlook Web reading pane only where opened |
| Bromcom MIS | Available (Students List + Student Details Profile) |

## Rules applied

- Evidence only from sources above (email + Bromcom UI)
- No guessing or fabrication
- Gaps explicitly noted per student

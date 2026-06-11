# Year 10 Email Evidence Reports

Generated: 2026-06-11

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
| Tyler Fredreick | [year-10/tyler-fredreick.md](year-10/tyler-fredreick.md) | 3 | 2 (+ 1 full Outlook Web thread) |
| Kamari Emanuel (optional) | [year-10/kamari-emanuel.md](year-10/kamari-emanuel.md) | 2 | 2 |

Student list verified from `ks4-monitoring/ks4-students.js` (10 Year 10 students + Kamari as optional).

## Search methodology

### 1. Outlook Web (cursor-ide-browser MCP)

- Tab: `https://outlook.cloud.microsoft/mail/` (signed in as Lloyd Dwaah, ldwaah@evolution-sportsgroup.com)
- Searched student names; opened and expanded full thread for Tyler Fredrick
- **Access:** OK for inbox search and reading pane

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

### 4. Existing audit files

- `data/emails-extracted/` (per-student `.txt`, `_summary.txt`, `outlook-search-report.txt`, `general-ks4-terms.txt`)
- Extracted 2026-06-11 from HxStore; cross-checked against live cache re-read on 2026-06-11

## Access blockers

| Source | Status |
|--------|--------|
| Outlook Web | Available |
| AppleScript (New Outlook) | Blocked - 0 messages returned |
| HxStore | Available (subjects/snippets; full bodies often truncated) |
| Full email bodies | Partial - cache fragments and Outlook Web reading pane only where opened |

## Rules applied

- Evidence only from email sources above
- No guessing or fabrication
- Gaps explicitly noted per student

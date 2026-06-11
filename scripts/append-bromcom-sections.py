#!/usr/bin/env python3
"""Append Bromcom evidence sections to Year 10 student reports."""

from pathlib import Path

REPORTS = Path(__file__).resolve().parent.parent / "reports" / "year-10"

SECTIONS = {
    "calum-mison.md": """
## Bromcom data

**Extraction date:** 2026-06-11  
**Source:** Bromcom MIS (`https://cloudmis.bromcom.com`), signed-in session  
**Student list URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/People/StudentList.aspx`  
**Profile URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/Students/StudentDetails.aspx?StudentIDs=129#Profile`  
**Record located:** Yes (Bromcom Student ID 129)

### Enrolment (profile panel)

| Field | Value (Bromcom UI) |
|-------|-------------------|
| Legal name | Calum Mison |
| Sex | Male |
| Date of birth | 04/08/2011 |
| Age | 14y 10m |
| Year group | Y10 |
| Tutor group | KS4 Reg |
| Tutor name | A Dwaah |
| Admission number | 000033 |
| Enrolment status (list view) | ONROLL |
| UPN | N/A |
| EAL | No |

### Attendance highlights (profile panel)

| Metric | Value |
|--------|-------|
| Sessions absent | 16/94 |
| Absent percentage | 17.02% |

Recent attendance communications (latest 5, outbound to JRCS contact): AM session codes on 11 Jun (/), 10 Jun (N), 9 Jun (/), 8 Jun (/), 5 Jun (N).

### Contacts (profile panel)

| Contact | Relationship | Priority | Email / phone |
|---------|--------------|----------|---------------|
| Mr and Ms Jo Richardson Attendance #40 | Other Non-Family Contact | 1 | a_student_services@jorichardson.onmicrosoft.com |

Student contact line: "No contact information available". Address: "No address information available". Emergency contacts: none listed.

### SEN / EHCP / medical / safeguarding

- SEN tab not opened separately; no SEN status text visible on Profile (All panels) view.
- Health Background, Safeguarding tabs not extracted in this pass.
- Interventions, Access Arrangements, Support Events: "There is no data available for this module."
- Support Documents: none listed.

### Behaviour

Behaviour tab not opened; no behaviour points totals visible on Profile view.

### Data quality flags (Bromcom UI)

5 issues: Parental Responsibility, Contact 1 Phone, Contact 2, Contact 2 Phone, Contact 2 Email.

### Gaps

- Dedicated Attendance, Behaviour, SEN, Health Background, Safeguarding sub-pages not scraped in this extraction.
- No medical conditions visible on Profile view.
""",
    "tyrell-allassani.md": """
## Bromcom data

**Extraction date:** 2026-06-11  
**Source:** Bromcom MIS (`https://cloudmis.bromcom.com`), signed-in session  
**Student list URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/People/StudentList.aspx`  
**Profile URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/Students/StudentDetails.aspx?StudentIDs=105#Profile`  
**Record located:** Yes (Bromcom Student ID 105)

### Enrolment (profile panel)

| Field | Value (Bromcom UI) |
|-------|-------------------|
| Legal name | Tyrell Allassani |
| Sex | Male |
| Date of birth | 31/07/2011 |
| Age | 14y 10m |
| Year group | Y10 |
| Tutor group | KS4 Reg |
| Tutor name | A Dwaah |
| Admission number | 000001 |
| Admission date (list view) | 05/01/2026 |
| Enrolment status (list view) | ONROLL |
| UPN | N/A |
| EAL | No |

### Attendance highlights

| Metric | Value |
|--------|-------|
| Sessions absent | 25/184 |
| Absent percentage | 13.59% |

Recent AM session codes (communications): 11 Jun (L), 10 Jun (N), 9 Jun (/), 8 Jun (N), 5 Jun (N).

### Contacts

| Contact | Relationship | Priority | Email / phone |
|---------|--------------|----------|---------------|
| Mr and Ms Jo Richardson Attendance #40 | Other Non-Family Contact | 1 | a_student_services@jorichardson.onmicrosoft.com |
| Miss Amy Dwaah #104 | Other Non-Family Contact | 2 | (no email shown) |

No student phone or address on profile. Emergency contacts: none.

### Support events (visible on profile)

| Date | Type | Description (truncated) |
|------|------|-------------------------|
| 21/01/2026 | Mentoring (1-to-1) | Tyrell at start of mentoring session made very ... |
| 20/01/2026 | Mentoring (Group) | Group work activity and discussion about Strong... |

### SEN / medical / safeguarding

No SEN, EHCP, or medical data visible on Profile view. Interventions and Access Arrangements: no data.

### Data quality flags

4 issues: Parental Responsibility, Contact 1 Phone, Contact 2 Phone, Contact 2 Email.
""",
    "jayden-obrien.md": """
## Bromcom data

**Extraction date:** 2026-06-11  
**Source:** Bromcom MIS (`https://cloudmis.bromcom.com`), signed-in session  
**Profile URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/Students/StudentDetails.aspx?StudentIDs=142#Profile`  
**Record located:** Yes (Bromcom Student ID 142)

### Enrolment

| Field | Value |
|-------|-------|
| Legal name | Jayden O'Brien |
| Sex | Male |
| DOB | 24/08/2011 |
| Age | 14y 9m |
| Year group | Y10 |
| Tutor group | KS4 Reg |
| Tutor name | A Dwaah |
| Admission number | 000039 |
| Admission date (list view) | 10/04/2026 |
| Enrolment | ONROLL |
| EAL | No |

### Attendance highlights

| Metric | Value |
|--------|-------|
| Sessions absent | 20/74 |
| Absent percentage | 27.03% |

Recent AM codes: 11 Jun (/), 10 Jun (N), 9 Jun (/), 8 Jun (M), 5 Jun (M).

### Contacts

| Contact | Relationship | Priority | Email |
|---------|--------------|----------|-------|
| Mr and Ms Jo Richardson Attendance #40 | Other Non-Family Contact | 1 | a_student_services@jorichardson.onmicrosoft.com |

No student phone or address. Emergency contacts: none. Support events: no data.

### Data quality flags

5 issues: Parental Responsibility, Contact 1 Phone, Contact 2, Contact 2 Phone, Contact 2 Email.
""",
    "stacey-grail.md": """
## Bromcom data

**Extraction date:** 2026-06-11  
**Source:** Bromcom MIS (`https://cloudmis.bromcom.com`), signed-in session  
**Profile URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/Students/StudentDetails.aspx?StudentIDs=97#Profile`  
**Record located:** Yes (Bromcom Student ID 97)

### Enrolment

| Field | Value |
|-------|-------|
| Legal name | Stacey Grail |
| Sex | Female |
| DOB | 16/09/2010 |
| Age | 15y 8m |
| Year group | Y10 |
| Tutor group | KS4 Reg |
| Tutor name | A Dwaah |
| Admission number | 000013 |
| Admission date (list view) | 08/12/2025 |
| Student phone (profile header) | 07476 844955 |
| EAL | No |

### Attendance highlights

| Metric | Value |
|--------|-------|
| Sessions absent | 41/200 |
| Absent percentage | 20.50% |

### Contacts

| Contact | Relationship | Priority | Phone / email |
|---------|--------------|----------|---------------|
| Mr and Ms Jo Richardson Attendance #40 | Other Non-Family Contact | 1 | a_student_services@jorichardson.onmicrosoft.com |
| Miss Helen Grail #98 | Mother | 2 | 07476 844955 |
| Mr David Grail #99 | Father | 3 | 07561787304 |

### Support events and documents

| Date | Type | Notes |
|------|------|-------|
| 09/02/2026 | Mentoring (1-to-1) | Completed mentoring session with Stacey Grail (...); SMART targets attached |
| 08/12/2025 | Mentoring (1-to-1) | First Day / First mentoring session |
| 08/12/2025 | Mentoring (1-to-1) | Check-In Session Day 1 Following SG and MC's... |
| 08/12/2025 | Educational Psychologists | SEMH Results (first day assessment) |

Support document: **SEMH Results** (start 08/12/2025), Support Area: Behaviour & Education Support.

### SEN / safeguarding

No explicit EHCP or SEN code on Profile view. Emergency contacts: none listed.

### Data quality flags

3 issues: Parental Responsibility, Contact 1 Phone, Contact 2 Email.
""",
    "ronny-burletson.md": """
## Bromcom data

**Extraction date:** 2026-06-11  
**Source:** Bromcom MIS (`https://cloudmis.bromcom.com`), signed-in session  
**Profile URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/Students/StudentDetails.aspx?StudentIDs=24#Profile`  
**Record located:** Yes (Bromcom Student ID 24)

### Enrolment

| Field | Value |
|-------|-------|
| Legal name | Ronny Burletson |
| Sex | Male |
| DOB | 10/02/2011 |
| Age | 15y 4m |
| Year group | Y10 |
| Tutor group | KS4 Reg |
| Tutor name | A Dwaah |
| Admission number | 000008 |
| Admission date (list view) | 04/08/2025 |
| Address | 148, Arden Crescent, Dagenham, RM9 4SA |
| EAL | No |

Profile banner: "There is an important document for this student. Please click to download" (document name not extracted).

### Attendance highlights

| Metric | Value |
|--------|-------|
| Sessions absent | 97/326 |
| Absent percentage | 29.75% |

Recent AM codes (communications): all N on 11, 10, 9, 8, 5 Jun.

### Contacts

| Contact | Relationship | Priority | Phone / email |
|---------|--------------|----------|---------------|
| Mr and Ms Jo Richardson Attendance #40 | Other Non-Family Contact | 1 | a_student_services@jorichardson.onmicrosoft.com |
| Ms Ronny B's Mum #63 | Mother | 5 | 07984 638140 |

### Support events

| Date | Type | Description (truncated) |
|------|------|-------------------------|
| 10/02/2026 | Mentoring (1-to-1) | Completed mentoring session with Ronny Burlesto... |
| 02/02/2026 | Mentoring (1-to-1) | Had a catch up discussion as he had not been in... |
| 24/11/2025 | Restorative | Student reached RED level due to unsafe/disrupt... |
| 24/11/2025 | Mentoring (1-to-1) | Ronnie is aware that his behaviour has been a c... |

### Data quality flags

3 issues: Parental Responsibility, Contact 1 Phone, Contact 2 Email.
""",
    "mason-taylor.md": """
## Bromcom data

**Extraction date:** 2026-06-11  
**Source:** Bromcom MIS (`https://cloudmis.bromcom.com`), signed-in session  
**Profile URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/Students/StudentDetails.aspx?StudentIDs=30#Profile`  
**Record located:** Yes (Bromcom Student ID 30)

### Enrolment

| Field | Value |
|-------|-------|
| Legal name | Mason Taylor |
| Sex | Male |
| DOB | 30/06/2011 |
| Age | 14y 11m |
| Year group | Y10 |
| Tutor group | KS4 Reg |
| Tutor name | A Dwaah |
| Admission number | 000014 |
| Admission date (list view) | 04/08/2025 |
| Address | 9, Ridgewell Close, Dagenham, RM10 9AJ |
| EAL | No |

### Attendance highlights

| Metric | Value |
|--------|-------|
| Sessions absent | 96/326 |
| Absent percentage | 29.45% |

Recent AM codes: 11 Jun (/), 10 Jun (B), 9 Jun (I), 8 Jun (N), 5 Jun (N). Communications sent to Ms Nicole B (Dagenham Park).

### Contacts

| Contact | Relationship | Priority | Phone / email |
|---------|--------------|----------|---------------|
| Ms Nicole B #51 | Other Non-Family Contact | 1 | NBorg@dagenhampark.org.uk |
| Ms Mason Mum #75 | Mother | 4 | 07751 44159 |
| Ms Mason Dad #74 | Father | 5 | 07399 354562 |

### Support events

| Date | Type | Description (truncated) |
|------|------|-------------------------|
| 04/12/2025 | Mentoring (1-to-1) | During his reduced timetable Mason has agreed ... |
| 03/11/2025 | Restorative | Reset meeting had with Mason's mum and step fat... |
| 20/10/2025 | Mentoring (1-to-1) | Weekly targets for 20-25 October |
| 06/10/2025 | Mentoring (1-to-1) | weekly target setting |

### Data quality flags

3 issues: Parental Responsibility, Contact 1 Phone, Contact 2 Email.
""",
    "jovan-lane.md": """
## Bromcom data

**Extraction date:** 2026-06-11  
**Source:** Bromcom MIS (`https://cloudmis.bromcom.com`), signed-in session  
**Profile URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/Students/StudentDetails.aspx?StudentIDs=115#Profile`  
**Record located:** Yes (Bromcom lists surname **Lane-Ridge**, Student ID 115)

### Enrolment

| Field | Value |
|-------|-------|
| Legal name | Jovan Lane-Ridge |
| Sex | Male |
| DOB | 11/06/2011 |
| Age | 15y |
| Year group | Y10 |
| Tutor group | KS4 Reg |
| Tutor name | A Dwaah |
| Admission number | 000025 |
| Admission date (list view) | 26/01/2026 |
| EAL | No |

### Attendance highlights

| Metric | Value |
|--------|-------|
| Sessions absent | 9/154 |
| Absent percentage | 5.84% |

Recent AM codes include / and B (11-10 Jun). Communications to Robert Clack contacts.

### Contacts

| Contact | Relationship | Priority | Email |
|---------|--------------|----------|-------|
| Mr Robert Clack Attendance 2 #50 | Other Non-Family Contact | 1 | FShirley@robertclack.co.uk |
| Mr Alex Lee #116 | Other Non-Family Contact | 2 | alee@robertclack.co.uk |
| Miss S S #117 | Other Non-Family Contact | 3 | sstpierre@robertclack.co.uk |

### Support events

| Date | Type | Description (truncated) |
|------|------|-------------------------|
| 13/02/2026 | Reflection | Positive message sent home for good conduct and... |

### Data quality flags

3 issues: Parental Responsibility, Contact 1 Phone, Contact 2 Phone.
""",
    "harrison-jones.md": """
## Bromcom data

**Extraction date:** 2026-06-11  
**Source:** Bromcom MIS (`https://cloudmis.bromcom.com`), signed-in session  
**Profile URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/Students/StudentDetails.aspx?StudentIDs=25#Profile`  
**Record located:** Yes (Bromcom Student ID 25)

### Enrolment

| Field | Value |
|-------|-------|
| Legal name | Harrison Jones |
| Sex | Male |
| DOB | 04/07/2011 |
| Age | 14y 11m |
| Year group | Y10 |
| Tutor group | KS4 Reg |
| Tutor name | A Dwaah |
| Admission number | 000009 |
| Admission date (list view) | 04/08/2025 |
| Address | 157, Burnside Road, Dagenham, RM8 2PJ |
| EAL | No |

Profile banner: important document available (name not extracted).

### Attendance highlights

| Metric | Value |
|--------|-------|
| Sessions absent | 121/326 |
| Absent percentage | 37.12% |

Recent AM codes predominantly B (authorised absence) in latest communications.

### Contacts

| Contact | Relationship | Priority | Phone / email |
|---------|--------------|----------|---------------|
| Mr Robert Clack Attendance Contacts #47 | Other Non-Family Contact | 1 | larch@robertclack.co.uk |
| Mr Robert Clack Attendance 2 #50 | Other Non-Family Contact | 2 | FShirley@robertclack.co.uk |
| Ms Harrison's Nan #67 | Other Family Member | 5 | 07852 908888 |

### Support events

| Date | Type | Description (truncated) |
|------|------|-------------------------|
| 12/02/2026 | Mentoring (1-to-1) | Completed mentoring session with Harrison Jones... |
| 04/12/2025 | Mentoring (1-to-1) | Mentoring Check-In Summary - Miss L Gavillet H... |

### Data quality flags

3 issues: Parental Responsibility, Contact 1 Phone, Contact 2 Phone.
""",
    "joshua-lang.md": """
## Bromcom data

**Extraction date:** 2026-06-11  
**Source:** Bromcom MIS (`https://cloudmis.bromcom.com`), signed-in session  
**Profile URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/Students/StudentDetails.aspx?StudentIDs=125#Profile`  
**Record located:** Yes (Bromcom Student ID 125)

### Enrolment

| Field | Value |
|-------|-------|
| Legal name | Joshua Lang |
| Sex | Male |
| DOB | 25/05/2011 |
| Age | 15y |
| Year group | Y10 |
| Tutor group | KS4 Reg |
| Tutor name | A Dwaah |
| Admission number | 000030 |
| Admission date (list view) | 05/03/2026 |
| EAL | No |

### Attendance highlights

| Metric | Value |
|--------|-------|
| Sessions absent | 14/108 |
| Absent percentage | 12.96% |

Recent AM codes: N on 11 and 10 Jun (communications to All Saints contacts).

### Contacts

| Contact | Relationship | Priority | Email |
|---------|--------------|----------|-------|
| Miss Patricia Martin #87 | Other Non-Family Contact | 1 | pmartin@AllSaintsSchool.co.uk |
| Mr All Saints Attendance Contacts #48 | Other Non-Family Contact | 2 | mincedal@allsaintsschool.co.uk |
| Miss C Spicer #126 | Other Non-Family Contact | 3 | Cspicer@allsaintsschool.co.uk |

Support events: no data on profile. Emergency contacts: none.

### Data quality flags

3 issues: Parental Responsibility, Contact 1 Phone, Contact 2 Phone.
""",
    "tyler-fredreick.md": """
## Bromcom data

**Extraction date:** 2026-06-11  
**Source:** Bromcom MIS (`https://cloudmis.bromcom.com`), signed-in session  
**Profile URL:** `https://cloudmis.bromcom.com/Nucleus/UI/Areas/Students/StudentDetails.aspx?StudentIDs=149#Profile`  
**Record located:** Yes (Bromcom Student ID 149; spelling **Fredreick** in MIS)

### Enrolment

| Field | Value |
|-------|-------|
| Legal name | Tyler Fredreick |
| Sex | Male |
| DOB | 20/03/2011 |
| Age | 15y 2m |
| Year group | Y10 |
| Tutor group | KS4 Reg |
| Tutor name | A Dwaah |
| Admission number | 000044 |
| Admission date (list view) | 07/05/2026 |
| EAL | No |

Profile banner: important document available (name not extracted).

### Attendance highlights

| Metric | Value |
|--------|-------|
| Sessions absent | 14/40 |
| Absent percentage | 35.00% |

Recent AM codes: O (11 Jun), B (10 Jun) in communications to Robert Clack contacts.

### Contacts

| Contact | Relationship | Priority | Email |
|---------|--------------|----------|-------|
| Mr Robert Clack Attendance 2 #50 | Other Non-Family Contact | 1 | FShirley@robertclack.co.uk |
| Mr Robert Clack Attendance Contacts #47 | Other Non-Family Contact | 2 | larch@robertclack.co.uk |
| Mr S Webber #150 | Other Non-Family Contact | 3 | swebber@robertclack.co.uk |

Support events: no data. Emergency contacts: none.

### Data quality flags

3 issues: Parental Responsibility, Contact 1 Phone, Contact 2 Phone.
""",
}


def main() -> None:
    for filename, section in SECTIONS.items():
        path = REPORTS / filename
        text = path.read_text(encoding="utf-8")
        if "## Bromcom data" in text:
            print(f"skip (already has Bromcom section): {filename}")
            continue
        path.write_text(text.rstrip() + "\n" + section.strip() + "\n", encoding="utf-8")
        print(f"updated: {filename}")


if __name__ == "__main__":
    main()

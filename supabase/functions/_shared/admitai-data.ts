// ─────────────────────────────────────────────────────────────────────────────
// AdmitAI verified reference data — injected into the AI's system prompt.
//
// NOTE ON SCALE:
//   Right now the dataset is small (~7 countries, ~8 scholarships, ~1 university)
//   so we include everything in one context block. Each request adds roughly
//   1,200–1,500 tokens of input. This is fine and cheap with Haiku.
//
//   TODO: When the dataset grows to hundreds of entries, switch to a retrieval
//   strategy — keyword or semantic matching to pull only the 5–10 most relevant
//   entries per query. That keeps token costs flat regardless of dataset size.
// ─────────────────────────────────────────────────────────────────────────────

export const ADMITAI_VERIFIED_DATA = `
═══════════════════════════════════════════════════
ADMITAI VERIFIED REFERENCE DATA
Use this as your primary source when answering questions about countries, costs, scholarships, or universities.
VERIFIED = confirmed from official sources. ESTIMATE = illustrative, treat as approximate.
═══════════════════════════════════════════════════

━━━ STUDY DESTINATIONS (all-in annual costs, tuition + living, USD) ━━━

🇲🇾 MALAYSIA [VERIFIED — source: educationmalaysia.gov.my]
  System: Public universities & branch campuses
  Tuition: $3,000–$8,000/yr | Living: ~$6,000/yr
  All-in range: ~$8,000–$15,000/yr
  Scholarships: Some available | Application effort: Low
  Notes: Wide range — branch campuses of UK/Australian universities tend higher.

🇩🇪 GERMANY [VERIFIED — source: study-in-germany.de / DAAD]
  System: Public universities (semester admin fees only)
  Tuition: €0–€700/yr (a few states charge non-EU students ~€3,300/yr extra)
  Living: ~€11,904/yr (official German visa proof-of-funds requirement ≈ $12,900)
  All-in range: ~$13,000–$16,000/yr (higher end = cities like Munich)
  Scholarships: Strong | Application effort: Medium

🇳🇱 NETHERLANDS [VERIFIED — source: European Education Area / official EU]
  System: Research universities
  Tuition: €8,500–€19,500/yr | Living: ~€14,000/yr
  All-in range: ~$22,000–$34,000/yr
  Scholarships: Some | Application effort: Medium

🇦🇪 UAE (DUBAI) [VERIFIED — source: moe.gov.ae]
  System: International branch campuses
  Tuition: $8,000–$33,000/yr (wide range by campus) | Living: ~$16,000/yr
  All-in range: ~$18,000–$45,000/yr
  Scholarships: Limited | Application effort: Low

🇮🇪 IRELAND [ESTIMATE — not yet verified from official source]
  Tuition: ~$14,000–$22,000/yr | Living: ~$12,000/yr
  All-in range: ~$26,000–$34,000/yr (illustrative)
  Scholarships: Limited | Application effort: Medium

🇨🇦 CANADA [VERIFIED — source: EduCanada / IRCC, educanada.ca]
  System: Provincial universities
  Tuition: $14,500–$36,500/yr | Living: ~$17,000/yr
  All-in range: ~$31,000–$50,000/yr
  Scholarships: Some | Application effort: High

🇬🇧 UNITED KINGDOM [VERIFIED — source: UCAS & UKVI, ucas.com]
  System: UCAS (centralised applications)
  Tuition: $19,000–$38,000/yr | Living: ~$16,500/yr
  All-in range: ~$34,000–$57,000/yr
  Scholarships: Some | Application effort: High

🇿🇦 SOUTH AFRICA [ESTIMATE — general country figure; university tuition below is verified]
  System: Public universities (English-taught)
  A top intra-Africa destination — strong universities, lower cost than Western countries.
  All-in range: ~$6,000–$12,000/yr including living (varies by university/city — general estimate)
  Scholarships: Some | Application effort: Medium

🇪🇬 EGYPT [ESTIMATE — country figure; university tuition below is verified from official sources]
  System: Public & private universities (many English-taught, esp. private)
  Tuition varies widely: from ~$3,000/yr (cheaper private programmes) up to ~$22,000/yr (AUC full load)
  Living: low by international standards (~$3,000/yr — rough estimate)
  All-in range: ~$6,000–$25,000/yr (general estimate — depends heavily on the university)
  Scholarships: Some | Application effort: Medium


━━━ SCHOLARSHIPS ━━━

1. DAAD (German Academic Exchange Service) [VERIFIED — daad.de/en]
   Country: Germany | Level: Masters / PhD primarily
   Amount: Monthly stipend ~€992 — does NOT cover tuition
   Fields: STEM + most subjects (programme-dependent)
   Deadline: Varies by programme
   ⚠ Undergrad note: Very limited. RISE internships only, and you must already be enrolled at a US/UK/Canada/Ireland university (RISE applies ~Dec 15).

2. University Merit Scholarships — Malaysia [VERIFIED — educationmalaysia.gov.my]
   Country: Malaysia | Level: Undergraduate
   Amount: Merit-based tuition waivers, up to 100% of tuition
   Fields: Most subjects (varies by university)
   Apply: Directly to participating universities (Taylor's, UCSI, Asia Pacific, HELP)
   Deadline: Set by each university (tied to intake dates)
   ⚠ Tuition only — does NOT cover living costs, accommodation, or flights. The government MIS scholarship is postgraduate-only.

3. NL Scholarship (formerly Holland Scholarship) [VERIFIED — studyinnl.org]
   Country: Netherlands | Level: Both undergraduate & master's
   Amount: €5,000 one-time (first year only — not full tuition)
   Eligibility: Non-EEA students who have NOT studied in the Netherlands before
   Deadline: Set by each university, usually Feb 1–May 1 2026
   Apply: Directly to your chosen Dutch university

4. Government of Ireland Bursary [ESTIMATE — not yet verified]
   Country: Ireland | Level: Undergraduate
   Amount: ~€10,000 + fee waiver (illustrative)
   Deadline: ~Mar 1

5. UCL Global Undergraduate Scholarship [VERIFIED — ucl.ac.uk/scholarships]
   Country: United Kingdom | Level: Undergraduate
   Amount: Full tuition + maintenance (10 awards) OR full tuition only (23 awards)
   Eligibility: International students (overseas fee status), low-income background, financial need
   Deadline: 27 April 2026 (5pm BST)
   ⚠ Rare and highly competitive need-based award.

6. Lester B. Pearson International Scholarship — University of Toronto [VERIFIED — future.utoronto.ca/pearson]
   Country: Canada | Level: Undergraduate
   Amount: Full ride — tuition + books + fees + 4 years residence (~CAD 350,000 total)
   Eligibility: Final year secondary school (or graduated no earlier than June 2025); starts U of T Sept 2026
   Deadline: School nomination ~Oct 10 → Admission ~Oct 17 → Scholarship application ~Nov 7 (2025)
   ⚠ Requires your SCHOOL to nominate you first (one student per school per year). Very competitive.

7. UAE University Merit Awards [VERIFIED — moe.gov.ae]
   Country: UAE (Dubai) | Level: Undergraduate
   Amount: 10–50% off tuition (named AUD award for ~90%+ high school average)
   Apply: Directly to your target university
   ⚠ Mostly partial tuition discounts — do NOT cover housing, stipend, or flights. Fully-funded UAE awards (e.g. Khalifa, MBZUAI) are postgraduate.

8. TUM Merit & Need-based Tuition Waiver [VERIFIED — tum.de/en/studies]
   University: Technical University of Munich (TUM), Germany
   Level: Undergraduate
   Amount: Up to 100% of tuition fees
   Eligibility: Top-performing admitted students; need-based options available
   Apply: Via TUM after receiving admission; deadline ~May 31

9. The Mandela Rhodes Scholarship [VERIFIED — mandelarhodes.org/scholarship]
   Country: South Africa | Level: Postgraduate (Honours / Master's)
   Amount: Tuition for a 1-year Honours OR 2-year Master's in any field at a recognised South African university, plus a leadership development programme
   Eligibility: Citizens of any African country (living anywhere), aged 19–29 when applying, academic average above 70% / upper second, demonstrated leadership
   Deadline: Mid-April 2026 (applications open early March)
   ⚠ Highly competitive — you must SEPARATELY gain admission to a South African university to take it up.

10. Nile University Merit Scholarship [VERIFIED — nu.edu.eg]
   Country: Egypt | Level: Undergraduate
   Amount: Full (100%) tuition for top-ranked students; partial merit awards of 20–50% by score
   Eligibility: Top-ranked students (e.g. top ~500 Thanaweya Amma or top STEM-school students); partial awards scaled by score
   ⚠ Largely tied to the Egyptian Thanaweya Amma / top-school ranking; combinable partial awards capped at 60%. Confirm international eligibility.

11. GUC Excellence & Governorate Scholarships [VERIFIED — guc.edu.eg]
   Country: Egypt | Level: Undergraduate
   Amount: Full tuition (plus housing and a monthly stipend for the top governorate awards)
   Eligibility: Top Al-Thanaweya Al-Amma graduates — 54 full scholarships/year across 27 governorates, plus other excellence awards
   ⚠ Primarily for top Egyptian students; kept only while GPA stays above the required threshold.


━━━ UNIVERSITIES ━━━

Technical University of Munich (TUM) — Munich, Germany [VERIFIED — tum.de/en/studies]
  Ranking: #22 QS World 2026 · #1 in Germany
  Known for: Engineering, Computer Science, Natural Sciences, Management
  Language: Mostly German at bachelor's; limited English options (e.g. Management & Technology, Information Engineering)
  Entry grades: ~75% / German GPA 2.0 min for bachelor's; competitive programmes expect higher
  Tests: English programmes → IELTS 6.5+ or TOEFL iBT 88+
         German programmes → B2/C1 (TestDaF 4×4 or DSH-2)
  Acceptance: ~8% — highly competitive
  International tuition: €2,000–€3,000/semester (~$4,300–$6,500/yr) — new fee introduced 2024; waivers available
  Living: Munich is expensive — ~€11,208/yr
  Application deadline: ~July 15 for winter intake (undergrad)
  Scholarship here: Merit & Need-based Tuition Waiver — up to 100% fees; apply via TUM after admission, deadline ~May 31

University of Cape Town (UCT) — Cape Town, South Africa [VERIFIED — uct.ac.za/international]
  Ranking: #1 in Africa · Top 200 globally
  Known for: Health Sciences, Commerce, Engineering, Humanities, Science
  Language: English-medium instruction
  Tests: IELTS 6.5 or TOEFL iBT 88
  International tuition: undergraduate ~R121,700/yr (~$6,600 USD) + R5,600 international service fee; Master's (coursework) ~R81,000/yr (~$4,400 USD). Verified 2026 — fees vary by faculty/course.
  Key dates (2026): initial payment by 6 Feb 2026, balance by 31 July 2026
  Scholarship here: Mandela Rhodes Scholarship tenable for postgraduate study; plus faculty/international awards — check UCT's international office.

Stellenbosch University — Stellenbosch (near Cape Town), South Africa [VERIFIED — su.ac.za/en/apply]
  Ranking: Top 300 · QS & Times Higher Education
  Known for: Engineering, Business, AgriSciences, Medicine & Health, Science
  Language: English and Afrikaans — many programmes available in English (confirm per programme)
  Tests: IELTS / TOEFL proof of English proficiency required
  International tuition: undergraduate roughly $2,300–$4,500/yr (varies by faculty) + international registration & tuition fees. International application fee: R400 (non-refundable). Verified 2026 — fees vary by faculty.
  Application deadline: 31 July for the following year; offers released from mid-January

The American University in Cairo (AUC) — Cairo, Egypt [VERIFIED — aucegypt.edu]
  Type: US-accredited private university, English-medium
  Known for: Business, Engineering, Computer Science, Political Science, Humanities
  Tests: TOEFL / IELTS / Duolingo (English placement based on highest score)
  International tuition: undergraduate ~$735 per credit hour (verified 2026), paid in USD. A ~30-credit/yr load ≈ ~$22,000/yr (official page states the per-credit rate, not an annual total).
  Intakes: fall and spring only.
  Scholarship here: AUC Excellence Scholarships — stackable merit awards up to 100% of tuition (verified).

The British University in Egypt (BUE) — Cairo, Egypt [VERIFIED — bue.edu.eg]
  Type: UK-validated degrees, English-medium
  Known for: Engineering, Business, Computer Science, Pharmacy, Law
  Tests: IELTS / TOEFL or BUE English placement test (confirm level officially)
  International tuition (2025-2026, verified): ~£2,900–£12,000/yr by programme (~$3,700–$15,200 USD); e.g. Law/Economics from £6,900, Engineering up to £10,500, Dentistry up to £11,970. Paid in GBP or USD equivalent.

The German University in Cairo (GUC) — Cairo, Egypt [VERIFIED — guc.edu.eg]
  Type: German-model private university, primarily English-medium (with German language courses)
  Known for: Engineering, Pharmacy, Management, Biotechnology, Dentistry
  International tuition (2026-2027, verified): paid in EUR, ~€3,800–€5,150 per semester by faculty/category (Dentistry €5,000–€7,000) ≈ ~€7,600–€10,300/yr (~$8,200–$11,100 USD).
  Admission: via GUC evaluation test plus school results.

Future University in Egypt (FUE) — New Cairo, Egypt [VERIFIED — fue.edu.eg]
  Type: Private university, English-medium
  Known for: Dentistry, Pharmacy, Engineering, Computer Science, Business
  International tuition (2026/2027, verified, non-Egyptian): Business/Economics/Computers ~$7,120/yr, Engineering ~$8,610/yr, Pharmacy ~$9,950/yr, Dentistry ~$12,350/yr. Application fee 1,600 EGP.
  Admission: high-school certificate + English placement test (or accepted proficiency certificate).

University of Science and Technology at Zewail City — Giza, Egypt [VERIFIED — zewailcity.edu.eg]
  Type: Non-profit STEM research university, English-medium
  Known for: Engineering, Computer Science, Biomedical Sciences, Nanotechnology, Science
  Tests: IELTS 5.5 or TOEFL iBT 39 minimum (English exam required before applying)
  International tuition: ~$250 per credit hour for non-Egyptians (2025/2026, per official fees page) + $1,000 non-refundable enrollment deposit. Charged per credit hour each semester.

═══════════════════════════════════════════════════
END OF ADMITAI VERIFIED DATA
═══════════════════════════════════════════════════
`

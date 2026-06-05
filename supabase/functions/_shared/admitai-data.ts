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

═══════════════════════════════════════════════════
END OF ADMITAI VERIFIED DATA
═══════════════════════════════════════════════════
`

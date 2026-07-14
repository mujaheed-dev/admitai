import { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import ScholarshipDetail from './ScholarshipDetail.jsx'
import FilterDropdown from './FilterDropdown.jsx'
import { getUniversityScholarshipsForPage } from './universitiesData.js'

// All figures and deadlines are illustrative until verified from official sources.
// deadlineMonth: 1-12 (Jan=1 … Dec=12), 99 = rolling/varies
// amountTier: 1=largest award, 5=smallest
const SCHOLARSHIPS = [
  {
    id: 'daad',
    name: 'DAAD (German Academic Exchange Service)',
    country: 'Germany',
    flag: '🇩🇪',
    fields: ['All fields'],
    amount: 'Monthly stipend ~€992 (students); does NOT cover tuition',
    eligibility: 'Mostly postgraduate & research scholarships',
    deadline: 'Varies by programme',
    deadlineMonth: 99,
    amountTier: 2,
    level: 'Masters / PhD',
    levelNote: 'Limited undergrad options — RISE summer research internships only, and you must already be enrolled at a US/UK/Canada/Ireland university (apply ~Dec 15)',
    sourceName: 'DAAD (official)',
    sourceUrl: 'https://www.daad.de/en/',
    verified: true,
  },
  {
    id: 'deutschlandstipendium',
    name: 'Deutschlandstipendium',
    country: 'Germany',
    flag: '🇩🇪',
    fields: ['All fields'],
    amount: '€300/month (€3,600/yr) for at least two semesters — verified 2026',
    eligibility: 'Merit-based and NATIONALITY-BLIND — any student enrolled (or about to enrol) at a participating German university, within the standard study period; selection weighs grades plus social engagement',
    deadline: 'Varies by university (each runs its own round, typically in summer)',
    deadlineMonth: 99,
    amountTier: 4,
    level: 'Both',
    levelNote: 'Open to bachelor\'s AND master\'s students — a top-up, not full funding; in tuition-free Germany it covers a real slice of living costs',
    sourceName: 'Deutschlandstipendium / BMBF (official)',
    sourceUrl: 'https://www.deutschlandstipendium.de/deutschlandstipendium/de/english/the-deutschlandstipendium/the-deutschlandstipendium',
    verified: true,
  },
  {
    id: 'malaysia-merit',
    name: 'University Merit Scholarships (Malaysia)',
    country: 'Malaysia',
    flag: '🇲🇾',
    fields: ['All fields'],
    amount: 'Merit-based tuition waivers, ranging up to 100% of tuition',
    eligibility: "International undergraduates with strong academic results, applying directly to universities like Taylor's, UCSI, Asia Pacific, HELP",
    deadline: 'Set by each university (often tied to intake dates)',
    deadlineMonth: 99,
    amountTier: 3,
    level: 'Undergraduate',
    levelNote: "Tuition only — does NOT cover living costs, accommodation, or flights. The famous government 'MIS' scholarship is postgraduate-only.",
    sourceName: 'Malaysian universities (apply directly) / EasyUni guide',
    sourceUrl: 'https://educationmalaysia.gov.my',
    verified: true,
  },
  {
    id: 'holland',
    name: 'NL Scholarship (formerly Holland Scholarship)',
    country: 'Netherlands',
    flag: '🇳🇱',
    fields: ['All fields'],
    amount: '€5,000 one-time, first year only (not full tuition)',
    eligibility: "Non-EEA international students doing a full-time bachelor's or master's at a participating Dutch university; must not have studied in NL before",
    deadline: 'Set by each university, usually 1 Feb – 1 May 2026',
    deadlineMonth: 2,
    amountTier: 4,
    level: 'Both',
    levelNote: 'Genuinely open to undergraduates — apply directly to your chosen university',
    sourceName: 'Study in NL / Dutch Ministry of Education (official)',
    sourceUrl: 'https://www.studyinnl.org/finances/nl-scholarship',
    verified: true,
  },
  {
    id: 'goi-ies',
    name: 'Government of Ireland International Education Scholarships (GOI-IES)',
    country: 'Ireland',
    flag: '🇮🇪',
    fields: ['All fields'],
    amount: '€10,000 stipend + FULL fee waiver for one year — verified 2026',
    eligibility: 'High-calibre students domiciled outside the EU/EEA/Switzerland/UK, holding a conditional or final offer from an eligible Irish institution at application time — 60 awards/yr',
    deadline: '12 March 2026, 5pm Irish time (annual cycle — confirm current dates)',
    deadlineMonth: 3,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'MASTER\'S & PhD ONLY (NFQ levels 9–10) — not undergraduate. Highly competitive: 60 awards nationally. Undergrads should look at university merit awards instead.',
    sourceName: 'Higher Education Authority (official)',
    sourceUrl: 'https://hea.ie/policy/internationalisation/goi-ies/',
    verified: true,
  },
  {
    id: 'ucl-global-undergrad',
    name: 'UCL Global Undergraduate Scholarship',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fields: ['All fields'],
    amount: 'Full tuition + maintenance (10 awards); full tuition only (23 awards)',
    eligibility: 'International students (overseas fee status) from low-income backgrounds, selected on financial need, who have applied for a full-time UCL undergraduate degree',
    deadline: '27 April 2026 (5pm BST)',
    deadlineMonth: 4,
    amountTier: 1,
    level: 'Undergraduate',
    levelNote: 'A genuine need-based full-ride for undergrads — rare and competitive',
    sourceName: 'UCL (official)',
    sourceUrl: 'https://www.ucl.ac.uk/scholarships/ucl-global-undergraduate-scholarship',
    verified: true,
  },
  {
    id: 'lester-pearson',
    name: 'Lester B. Pearson International Scholarship',
    country: 'Canada',
    flag: '🇨🇦',
    fields: ['All fields'],
    amount: 'Full ride — tuition, books, fees + 4 years residence (~CAD 350,000 total)',
    eligibility: 'International students needing a study permit, in final year of secondary school (or graduated no earlier than June 2025), starting at U of T in Sept 2026',
    deadline: 'School nomination ~Oct 10; admission ~Oct 17; scholarship ~Nov 7 (2025 for 2026 entry)',
    deadlineMonth: 10,
    amountTier: 1,
    level: 'Undergraduate',
    levelNote: 'Requires school nomination first (your school can nominate one student/year), then U of T admission, then the scholarship application',
    sourceName: 'University of Toronto (official)',
    sourceUrl: 'https://future.utoronto.ca/pearson-scholarships',
    verified: true,
  },
  {
    id: 'uae-merit',
    name: 'H.H. Sheikh Mohammed Bin Rashid Al Maktoum Scholarship (AUD) + UAE university merit awards',
    country: 'UAE (Dubai)',
    flag: '🇦🇪',
    fields: ['All fields'],
    amount: 'Named AUD award for top students; broader branch-campus merit discounts ~10–50% of tuition',
    eligibility: 'International undergraduates with strong grades (AUD award: ~90%+ high school average); apply directly to the university',
    deadline: 'Set by each university (e.g. AUS merit deadline ~Apr 17, 2026)',
    deadlineMonth: 4,
    amountTier: 5,
    level: 'Undergraduate',
    levelNote: 'Mostly PARTIAL tuition discounts — do not cover housing, stipend, or flights. Fully-funded UAE awards (e.g. Khalifa, MBZUAI) are postgraduate.',
    sourceName: 'University official scholarship pages (verify per institution)',
    sourceUrl: 'https://www.moe.gov.ae',
    verified: true,
  },
  {
    id: 'mandela-rhodes',
    name: 'The Mandela Rhodes Scholarship',
    country: 'South Africa',
    flag: '🇿🇦',
    fields: ['All fields'],
    amount: "Tuition for a 1-year Honours or 2-year Master's + leadership development programme",
    eligibility: 'Citizens of any African country (living anywhere), aged 19–29 when applying, with an academic average above 70% / upper second and demonstrated leadership',
    deadline: 'Mid-April 2026 (applications open early March)',
    deadlineMonth: 4,
    amountTier: 2,
    level: 'Masters / PhD',
    levelNote: "Postgraduate — for a 1-year Honours or 2-year Master's in any field at a recognised South African university. Highly competitive, and you must separately gain admission to a South African university to take it up.",
    sourceName: 'The Mandela Rhodes Foundation (official)',
    sourceUrl: 'https://www.mandelarhodes.org/scholarship/',
    verified: true,
  },
  {
    id: 'nu-merit',
    name: 'Nile University Merit Scholarship',
    country: 'Egypt',
    flag: '🇪🇬',
    fields: ['Engineering', 'Business', 'Computer Science'],
    amount: 'Full (100%) tuition for top-ranked students; partial merit awards of 20–50% by score',
    eligibility: 'Top-ranked students (e.g. top ~500 Thanaweya Amma or top STEM-school students) for full awards; partial merit awards scaled by Thanaweya Amma score',
    deadline: 'Varies — apply via Nile University admissions',
    deadlineMonth: 99,
    amountTier: 1,
    level: 'Undergraduate',
    levelNote: 'Awards are largely tied to the Egyptian Thanaweya Amma / top-school ranking; combinable partial awards are capped at 60% total. Confirm current terms and international eligibility on the official site.',
    sourceName: 'Nile University (official)',
    sourceUrl: 'https://nu.edu.eg/admission/fees-and-financials',
    verified: true,
  },
  {
    id: 'guc-governorate',
    name: 'GUC Excellence & Governorate Scholarships',
    country: 'Egypt',
    flag: '🇪🇬',
    fields: ['Engineering', 'Pharmacy', 'Business'],
    amount: 'Full tuition (plus housing and a monthly stipend for the top governorate awards)',
    eligibility: 'Top-ranked Al-Thanaweya Al-Amma graduates — the GUC awards 54 full scholarships/year across 27 governorates, plus other full/partial excellence awards',
    deadline: 'Varies — apply via GUC admissions',
    deadlineMonth: 99,
    amountTier: 1,
    level: 'Undergraduate',
    levelNote: 'Primarily for top Egyptian Thanaweya Amma students; kept only while GPA stays above the required threshold. Confirm current terms and any international eligibility on the official site.',
    sourceName: 'The German University in Cairo (official)',
    sourceUrl: 'https://www.guc.edu.eg/en/admission/undergraduate/scholarships.aspx',
    verified: true,
  },

  // ═══ POSTGRADUATE EXPANSION — verified 2026 cycle unless noted ═══════════

  {
    id: 'chevening',
    name: 'Chevening Scholarships',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fields: ['All fields'],
    amount: 'FULL — tuition + monthly stipend + flights + arrival/departure allowances + visa — verified 2026',
    eligibility: 'Citizens of Chevening-eligible countries with an undergraduate degree and ~2,800 hours (≈2 years) of work experience; must commit to returning home for 2+ years afterwards',
    deadline: '6 October 2026, 11:00 UTC for 2027/28 (annual cycle; unconditional UK offer needed by ~8 July)',
    deadlineMonth: 10,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: "One-year taught MASTER'S only. The UK government's flagship award — very competitive; the 2-year home-return rule is binding.",
    sourceName: 'Chevening / UK FCDO (official)',
    sourceUrl: 'https://www.chevening.org/scholarships/',
    verified: true,
  },
  {
    id: 'commonwealth-masters',
    name: "Commonwealth Master's Scholarships",
    country: 'United Kingdom',
    flag: '🇬🇧',
    fields: ['All fields'],
    amount: 'FULL — approved tuition + airfare to/from the UK + visa costs + living allowance — verified 2026',
    eligibility: 'Citizens (or refugees) of eligible lower/upper-middle-income Commonwealth countries, permanently resident there, with at least a 2:1 bachelor\'s (or 2:2 + relevant postgrad qualification)',
    deadline: 'Annual window typically opens Aug–Sep and closes mid-October — confirm current cycle',
    deadlineMonth: 10,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: "Master's scheme shown here; the Commission also runs separate PhD, Shared and Distance-Learning schemes. Development-focused — link your study plan to your home country's needs.",
    sourceName: 'Commonwealth Scholarship Commission (official)',
    sourceUrl: 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/',
    verified: true,
  },
  {
    id: 'great-scholarships',
    name: 'GREAT Scholarships',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fields: ['All fields'],
    amount: '£10,000 toward tuition — 140+ scholarships at 60+ UK universities — verified 2026',
    eligibility: 'Citizens of ~18 listed countries incl. Egypt, Ghana, India, Indonesia, Kenya, Malaysia, Nigeria, Pakistan, Thailand, Turkey, Vietnam (check current list)',
    deadline: 'Set by each participating UNIVERSITY — no central application; confirm per university',
    deadlineMonth: 99,
    amountTier: 3,
    level: 'Masters / PhD',
    levelNote: "One-year taught master's. Partial award — £10,000 covers only part of most fees; stack with other funding.",
    sourceName: 'British Council / Study UK (official)',
    sourceUrl: 'https://study-uk.britishcouncil.org/scholarships-funding/great-scholarships',
    verified: true,
  },
  {
    id: 'gates-cambridge',
    name: 'Gates Cambridge Scholarship',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fields: ['All fields'],
    amount: 'FULL — Composition Fee + £21,000/yr maintenance + flights + visa/IHS + academic & family allowances — verified 2026',
    eligibility: 'International (non-UK) postgraduate applicants to the University of Cambridge — selection weighs leadership and commitment to improving others\' lives',
    deadline: '~Oct (US citizens) / Dec–early Jan (all others), tied to your course deadline — annual cycle',
    deadlineMonth: 12,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'ELITE tier: ~80 awards/yr worldwide — acceptance comparable to Rhodes. Apply by ticking the Gates box inside the Cambridge graduate application; no separate form.',
    sourceName: 'Gates Cambridge Trust (official)',
    sourceUrl: 'https://www.gatescambridge.org/',
    verified: true,
  },
  {
    id: 'rhodes',
    name: 'Rhodes Scholarship (Oxford)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fields: ['All fields'],
    amount: 'FULL — all Oxford course fees + ~£20,400/yr stipend + flights + visa/IHS (verified 2025-26 rate)',
    eligibility: 'Ages 18–24 (to 25 for medicine/law/engineering internship completers) meeting your country constituency\'s citizenship/residency rules',
    deadline: 'Varies by country constituency — most fall July–October the year before entry',
    deadlineMonth: 99,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: "ELITE tier: the world's oldest international scholarship — character/leadership-driven selection with interviews. Normally 2 years' tenure (1–3 possible).",
    sourceName: 'Rhodes Trust (official)',
    sourceUrl: 'https://www.rhodeshouse.ox.ac.uk/scholarships/the-rhodes-scholarship/',
    verified: true,
  },
  {
    id: 'clarendon',
    name: 'Clarendon Fund Scholarships (Oxford)',
    country: 'United Kingdom',
    flag: '🇬🇧',
    fields: ['All fields'],
    amount: 'FULL — all course fees + living grant at least the UKRI doctoral rate (£18,622+ as of 2023-24) — verified',
    eligibility: 'NO nationality restrictions — all full/part-time Oxford master\'s and DPhil applicants; selected purely on academic merit and potential (~140 awards/yr)',
    deadline: 'Automatic with an Oxford application by the December/January funding deadline for your course',
    deadlineMonth: 1,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'NO separate application — apply to Oxford by the funding deadline and you are automatically considered. Postgraduate certificates/diplomas are not eligible.',
    sourceName: 'University of Oxford (official)',
    sourceUrl: 'https://www.ox.ac.uk/clarendon',
    verified: true,
  },
  {
    id: 'erasmus-mundus',
    name: 'Erasmus Mundus Joint Masters Scholarships',
    country: 'European Union',
    flag: '🇪🇺',
    fields: ['All fields'],
    amount: 'FULL — tuition + €1,400/month stipend for up to 24 months + travel, visa and insurance contributions — verified 2026',
    eligibility: 'ALL nationalities — but you must NOT have spent more than 12 months in EU/programme countries within the last 5 years (rule favours genuine internationals)',
    deadline: 'Set per joint programme (each consortium has its own, typically Nov–Feb); you may apply to up to 3 programmes per round',
    deadlineMonth: 1,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: "Integrated MASTER'S across 2–3 European countries — you graduate with a joint/multiple degree. Apply directly to each programme's consortium.",
    sourceName: 'European Commission / Erasmus+ (official)',
    sourceUrl: 'https://erasmus-plus.ec.europa.eu/opportunities/opportunities-for-individuals/students/erasmus-mundus-joint-masters',
    verified: true,
  },
  {
    id: 'eiffel',
    name: 'France Excellence Eiffel Scholarship',
    country: 'France',
    flag: '🇫🇷',
    fields: ['All fields'],
    amount: '€1,200/month (master\'s) or €2,100/month (PhD) + international transport + insurance + housing help — verified 2026 rates',
    eligibility: 'Foreign nationals aged ≤29 (master\'s) / ≤35 (PhD); Eiffel laureates are also typically exempted from France\'s differentiated tuition',
    deadline: 'Via your French institution in autumn — the SCHOOL nominates you (national deadline ~early January; internal deadlines earlier)',
    deadlineMonth: 1,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'You CANNOT apply directly — contact your target school\'s international office in September–October and ask about their internal Eiffel deadline.',
    sourceName: 'Campus France (official)',
    sourceUrl: 'https://www.campusfrance.org/en/the-france-excellence-eiffel-scholarship-program',
    verified: true,
  },
  {
    id: 'boutmy',
    name: 'Émile Boutmy Scholarship (Sciences Po)',
    country: 'France',
    flag: '🇫🇷',
    fields: ['All fields'],
    amount: "UG: full exemption or €9,500/yr × 3 years · Master's: €18,500/yr × 2 years — verified 2026",
    eligibility: 'First-time non-EU applicants to Sciences Po whose household pays taxes outside the EU (some dual degrees and 1-year master\'s excluded)',
    deadline: 'UG (foreign school systems) ~20 January; master\'s committees ~19 Oct / 30 Nov — annual cycle',
    deadlineMonth: 1,
    amountTier: 1,
    level: 'Both',
    levelNote: 'Tick the scholarship box in the "Financial information" section of the Sciences Po application — there is no separate form.',
    sourceName: 'Sciences Po (official)',
    sourceUrl: 'https://www.sciencespo.fr/students/en/fees-funding/bursaries-financial-aid/emile-boutmy-scholarship/',
    verified: true,
  },
  {
    id: 'si-global-professionals',
    name: 'SI Scholarship for Global Professionals (Sweden)',
    country: 'Sweden',
    flag: '🇸🇪',
    fields: ['All fields'],
    amount: 'FULL tuition (paid to the university) + SEK 12,000/month + SEK 15,000 travel grant + SI network — verified 2026',
    eligibility: 'Citizens of the eligible (mainly developing) country list with ~3,000+ hours of work experience and demonstrated leadership',
    deadline: 'TWO-STEP: apply to Swedish master\'s programmes by 15 JANUARY, then the SI portal opens for only ~2 weeks in February',
    deadlineMonth: 2,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'Master\'s only. The two-step timing catches people every year: no programme application by 15 Jan = no scholarship. Essays and work experience weigh as much as grades.',
    sourceName: 'Swedish Institute (official)',
    sourceUrl: 'https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/',
    verified: true,
  },
  {
    id: 'banach-nawa',
    name: 'Banach NAWA Scholarship (Poland)',
    country: 'Poland',
    flag: '🇵🇱',
    fields: ['All fields'],
    amount: 'FULL — tuition waiver + PLN 2,500/month + travel support + funded 1-year preparatory course — verified 2026',
    eligibility: 'Citizens of ~36 Polish Aid partner countries across Africa, Central Asia, Eastern Europe, the Western Balkans and Latin America (check the current call)',
    deadline: '8 May 2026, 3pm CEST for 2026/27 — or until country-group quotas fill; apply EARLY (annual cycle)',
    deadlineMonth: 5,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: "Second-cycle (master's) studies, Polish- or English-taught — ~300 awards/yr. Poland's low living costs make the stipend genuinely livable outside Warsaw.",
    sourceName: 'NAWA — Polish National Agency for Academic Exchange (official)',
    sourceUrl: 'https://nawa.gov.pl/en/students/foreign-students/the-banach-scholarship-programme',
    verified: true,
  },
  {
    id: 'maeci-italy',
    name: 'MAECI Italian Government Scholarships',
    country: 'Italy',
    flag: '🇮🇹',
    fields: ['All fields'],
    amount: '~€900/month allowance + enrollment/tuition fee exemption at most public universities + health insurance — verified',
    eligibility: 'Foreign citizens from eligible countries; age ≤28 for master\'s/AFAM, ≤30 for PhD at the deadline',
    deadline: 'Annual call, typically spring for October enrollment — check the "Study in Italy" portal for your country',
    deadlineMonth: 99,
    amountTier: 2,
    level: 'Masters / PhD',
    levelNote: 'Grants are often issued in 6–9-month instalments and renewed — read your award terms carefully.',
    sourceName: 'Italian Ministry of Foreign Affairs — MAECI (official)',
    sourceUrl: 'https://studyinitaly.esteri.it/en/call-for-procedure',
    verified: true,
  },
  {
    id: 'invest-your-talent',
    name: 'Invest Your Talent in Italy (IYT)',
    country: 'Italy',
    flag: '🇮🇹',
    fields: ['Engineering', 'Business', 'Design', 'Computer Science'],
    amount: 'Tuition waiver + €900/month stipend + a GUARANTEED 3–6 month internship at an Italian company — verified 2026',
    eligibility: 'Citizens of the listed target countries in Africa, Asia, Latin America and Eastern Europe (check the current list)',
    deadline: '11 May 2026, 6pm Italian time for 2026/27 (annual cycle)',
    deadlineMonth: 5,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: "English-taught MASTER'S at ~20+ partner universities incl. Politecnico di Milano/Torino, Bologna, Bocconi. The guaranteed internship converts the degree into Italian work experience.",
    sourceName: 'MAECI + Italian Trade Agency (official)',
    sourceUrl: 'https://investyourtalentapplication.esteri.it/SitoInvestYourTalentApplication/',
    verified: true,
  },
  {
    id: 'dsu-italy',
    name: 'DSU Regional Right-to-Study Grants (Italy)',
    country: 'Italy',
    flag: '🇮🇹',
    fields: ['All fields'],
    amount: 'FULL package for low-income students — tuition waiver + cash grant up to ~€6,000–8,000/yr + dormitory + canteen meals — verified',
    eligibility: 'Family ISEE Parificato below the regional threshold (typically ~€25,000–30,000) — internationals INCLUDED; documents processed by an Italian CAF',
    deadline: 'REGIONAL and separate from admission — typically July–September each year; every region has its own agency and dates',
    deadlineMonth: 9,
    amountTier: 1,
    level: 'Both',
    levelNote: 'The best-value funding in Western Europe for genuinely low-income students — but the ISEE paperwork is real, and missing the regional deadline means paying full costs for the year.',
    sourceName: 'Regional DSU agencies (ER-GO, EDISU Piemonte, DiSCo Lazio…)',
    sourceUrl: 'https://www.er-go.it/index.php?id=6772',
    verified: true,
  },
  {
    id: 'fulbright-foreign',
    name: 'Fulbright Foreign Student Program',
    country: 'United States',
    flag: '🇺🇸',
    fields: ['All fields'],
    amount: 'FULL — tuition + airfare + living stipend + health insurance for the programme duration — verified',
    eligibility: '~4,000 grants/yr across 160+ countries; bachelor\'s degree with a good record, residing in your country of nomination; English ~TOEFL iBT 79–80 / IELTS 6.5+',
    deadline: 'Set by the Fulbright Commission/US Embassy in YOUR country — commonly Feb–May, ~15 months before study',
    deadlineMonth: 99,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'GRADUATE-only — the flagship US award for inbound students. Selection prizes leadership and cultural exchange; the J-1 visa\'s two-year home-residency rule applies to many.',
    sourceName: 'Fulbright / US Department of State (official)',
    sourceUrl: 'https://foreign.fulbrightonline.org/',
    verified: true,
  },
  {
    id: 'knight-hennessy',
    name: 'Knight-Hennessy Scholars (Stanford)',
    country: 'United States',
    flag: '🇺🇸',
    fields: ['All fields'],
    amount: 'FULL funding for any Stanford graduate degree (MS, MBA, JD, MD, PhD…) — ~100 scholars/yr — verified',
    eligibility: 'Citizens and residents of ALL countries; first bachelor\'s earned within ~7 years of enrollment (+2 for military service); must be admitted to a full-time Stanford graduate programme',
    deadline: '6 October 2026, 1pm Pacific for the 2027 cohort (annual cycle); Stanford programme application by its own deadline',
    deadlineMonth: 10,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'ELITE tier — leadership and civic-commitment selection on top of Stanford admission. Covers programmes most scholarships exclude (MBA, MD, JD).',
    sourceName: 'Knight-Hennessy Scholars, Stanford (official)',
    sourceUrl: 'https://knight-hennessy.stanford.edu/',
    verified: true,
  },
  {
    id: 'australia-awards',
    name: 'Australia Awards Scholarships',
    country: 'Australia',
    flag: '🇦🇺',
    fields: ['All fields'],
    amount: 'FULL — tuition + return airfare + establishment allowance + fortnightly living contribution + health cover + fieldwork support — verified 2026',
    eligibility: 'Citizens of participating developing countries (mainly Indo-Pacific + Africa programmes), not Australian PRs; leadership and development commitment weigh heavily',
    deadline: '2027 round: 1 Feb – 30 Apr 2026, 14:00 AEST (annual cycle; country windows vary)',
    deadlineMonth: 4,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: "Mostly MASTER'S (some undergraduate places for Pacific countries). BINDING condition: leave Australia for 2+ years after completing — violating it creates a debt for the full scholarship cost.",
    sourceName: 'Australian Government DFAT (official)',
    sourceUrl: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships',
    verified: true,
  },
  {
    id: 'rtp-australia',
    name: 'Research Training Program (RTP) — Australia',
    country: 'Australia',
    flag: '🇦🇺',
    fields: ['All fields'],
    amount: 'Tuition fee OFFSET + living stipend (commonly ~AU$32,000–40,000/yr tax-free, set per university) + often relocation/thesis allowances',
    eligibility: 'Research master\'s and PhD applicants at Australian universities — competitive and supervisor-driven; international places are fewer than domestic',
    deadline: 'Through each university\'s graduate research application — main rounds close ~Aug–Oct for the following year',
    deadlineMonth: 10,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'RESEARCH degrees only. Secure a supervisor and a strong research proposal FIRST. Research graduates also get 3 years on the post-study 485 visa.',
    sourceName: 'Australian Government Dept. of Education / university pages',
    sourceUrl: 'https://www.education.gov.au/research-block-grants/research-training-program',
    verified: true,
  },
  {
    id: 'manaaki-nz',
    name: 'Manaaki New Zealand Scholarships',
    country: 'New Zealand',
    flag: '🇳🇿',
    fields: ['All fields'],
    amount: 'FULL — tuition + NZ$615/week living allowance + NZ$3,000 establishment + insurance + flights incl. a home visit — verified 2026',
    eligibility: 'Citizens of 80+ eligible developing countries (Pacific, Southeast/South Asia, Africa, Latin America, Caribbean); must have lived in your home country for the 2 years before applying',
    deadline: 'Varies by country — windows typically close around February–March (annual cycle)',
    deadlineMonth: 3,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'Mostly POSTGRADUATE (some undergraduate places for Pacific countries). Binding 2-year home-return commitment; development-focused selection.',
    sourceName: 'New Zealand MFAT (official)',
    sourceUrl: 'https://www.nzscholarships.govt.nz/',
    verified: true,
  },
  {
    id: 'mext-japan',
    name: 'Japanese Government MEXT Scholarship',
    country: 'Japan',
    flag: '🇯🇵',
    fields: ['All fields'],
    amount: 'FULL — tuition + entrance fees + ¥117,000/mo (undergrad) or ¥143,000–145,000/mo (research) + round-trip airfare — verified 2026',
    eligibility: 'Apply via the Japanese EMBASSY in your country (recruitment ~April–June: exams + interview) or via a Japanese university\'s nomination',
    deadline: 'Embassy cycles open ~April a year before entry — start early (annual cycle)',
    deadlineMonth: 5,
    amountTier: 1,
    level: 'Both',
    levelNote: 'Research (master\'s/PhD) track is the biggest; an undergraduate track exists (includes a prep year of Japanese). NO service obligation afterwards — rare among government scholarships. Research applicants: contact a supervising professor BEFORE applying.',
    sourceName: 'Study in Japan / MEXT (official)',
    sourceUrl: 'https://www.studyinjapan.go.jp/en/planning/scholarships/mext-scholarships/',
    verified: true,
  },
  {
    id: 'gks-korea',
    name: 'Global Korea Scholarship (GKS)',
    country: 'South Korea',
    flag: '🇰🇷',
    fields: ['All fields'],
    amount: 'FULL — tuition (to ₩5M/semester) + ₩900,000/mo (UG) / ₩1,380,000/mo (graduate, raised for 2026) + flights + settlement + funded Korean language year — verified',
    eligibility: 'Embassy track (up to 3 university choices) or university track (1); grades ~80%+ typical; Type B regional universities have meaningfully better odds than Type A/Seoul',
    deadline: 'Undergraduate ~Sep–Oct; graduate ~Feb–Mar (annual cycles via your Korean embassy)',
    deadlineMonth: 99,
    amountTier: 1,
    level: 'Both',
    levelNote: 'The Korean language year is mandatory for most (skipped only with TOPIK 5+) — plan a 3-year master\'s commitment (1+2). TOPIK 5/6 earns a ₩100,000/month bonus.',
    sourceName: 'Study in Korea / NIIED (official)',
    sourceUrl: 'https://www.studyinkorea.go.kr/en/cntnts/i-155/web.do',
    verified: true,
  },
  {
    id: 'csc-china',
    name: 'Chinese Government Scholarship (CSC)',
    country: 'China',
    flag: '🇨🇳',
    fields: ['All fields'],
    amount: 'FULL — tuition waiver + free dormitory (or housing allowance) + ¥2,500–3,500/month stipend by level + medical insurance — verified',
    eligibility: 'Type A: apply through the Chinese EMBASSY in your country (bilateral quota, often incl. airfare); Type B: directly through a CSC-authorised university — coverage can differ by route',
    deadline: 'Embassy (Type A) deadlines typically Dec–Mar for autumn entry; university (Type B) vary (annual cycle)',
    deadlineMonth: 3,
    amountTier: 1,
    level: 'Both',
    levelNote: 'Tens of thousands of awards/yr — the single biggest funded route to China. A Chinese-language preparatory year is added for Chinese-medium programmes.',
    sourceName: 'China Scholarship Council / Campus China (official)',
    sourceUrl: 'https://www.campuschina.org/',
    verified: true,
  },
  {
    id: 'schwarzman',
    name: 'Schwarzman Scholars (Tsinghua)',
    country: 'China',
    flag: '🇨🇳',
    fields: ['All fields'],
    amount: 'FULLY funded one-year Master of Global Affairs at Tsinghua — tuition, room & board, travel, insurance, stipend — verified',
    eligibility: 'Ages 18–28 (not yet 29 by Aug 1 of enrollment year) with a completed bachelor\'s; English-medium; leadership-driven selection with interviews',
    deadline: '9 September 2026 for the 2027-28 class, most passports (annual cycle)',
    deadlineMonth: 9,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'ELITE tier — acceptance comparable to Rhodes. One-year English-taught master\'s in Beijing with a global cohort.',
    sourceName: 'Schwarzman Scholars (official)',
    sourceUrl: 'https://www.schwarzmanscholars.org/',
    verified: true,
  },
  {
    id: 'yenching',
    name: 'Yenching Academy Scholarship (Peking University)',
    country: 'China',
    flag: '🇨🇳',
    fields: ['All fields'],
    amount: 'FULLY funded — tuition + accommodation + travel + living stipend for the China Studies master\'s — verified',
    eligibility: 'Outstanding bachelor\'s graduates worldwide (degree completed before enrollment) with strong interdisciplinary interest in China',
    deadline: 'Region-dependent, typically ~Nov–Jan for autumn entry (annual cycle)',
    deadlineMonth: 12,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'English-medium interdisciplinary master\'s at PKU. Very competitive; essays and interviews focus on why CHINA matters to your goals.',
    sourceName: 'Yenching Academy, Peking University (official)',
    sourceUrl: 'https://yenchingacademy.pku.edu.cn/',
    verified: true,
  },
  {
    id: 'turkiye-burslari',
    name: 'Türkiye Bursları (Türkiye Scholarships)',
    country: 'Turkey',
    flag: '🇹🇷',
    fields: ['All fields'],
    amount: 'FULL — tuition + monthly stipend (reported 2026: 4,500 TL BA / 6,500 TL MA / 9,000 TL PhD) + dormitory + flights + insurance + 1-year Turkish course',
    eligibility: 'Citizens of ALL countries; age under 21 (bachelor\'s), under 30 (master\'s), under 35 (PhD); 70%+ average for bachelor\'s (higher for grad/medicine) — verified criteria',
    deadline: 'Applications ~Jan 10 – Feb 20 (annual cycle — confirm on the portal)',
    deadlineMonth: 2,
    amountTier: 1,
    level: 'Both',
    levelNote: 'University PLACEMENT is included — you apply to programmes through the scholarship itself. Very competitive (100,000+ applications/yr); TL stipend amounts change with inflation.',
    sourceName: 'Türkiye Bursları (official)',
    sourceUrl: 'https://www.turkiyeburslari.gov.tr/',
    verified: true,
  },
  {
    id: 'daad-epos',
    name: 'DAAD EPOS — Development-Related Postgraduate Courses',
    country: 'Germany',
    flag: '🇩🇪',
    fields: ['All fields'],
    amount: '€992/month (graduates) or €1,400/month (doctoral, from Feb 2026) + travel + insurance; host programmes are largely tuition-free — verified',
    eligibility: 'Professionals from developing/newly industrialised countries: bachelor\'s in the upper third of your class + at least TWO YEARS of related work experience; degree normally ≤6 years old',
    deadline: 'Set by each participating course (typically Aug–Oct) — apply to the COURSE directly, not to DAAD',
    deadlineMonth: 9,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'THE DAAD scheme for developing-country professionals — development-oriented master\'s at selected German universities. The 2-years-work-experience rule is strict.',
    sourceName: 'DAAD (official)',
    sourceUrl: 'https://www.daad.de/en/studying-in-germany/scholarships/development-related-postgraduate-courses/',
    verified: true,
  },
  {
    id: 'iccr-india',
    name: 'ICCR Scholarships (India)',
    country: 'India',
    flag: '🇮🇳',
    fields: ['All fields'],
    amount: 'FULLY funded — tuition paid by ICCR + ₹18,000–22,000/month stipend by level + house-rent allowance + contingent grant + medical cover — verified',
    eligibility: 'Citizens of 100+ partner countries; ages 18–40 (UG/PG, ≤50 PhD); apply EXCLUSIVELY via the A2A portal — embassies/universities cannot take applications',
    deadline: 'Annual A2A portal windows (country quotas) — confirm on the portal',
    deadlineMonth: 99,
    amountTier: 1,
    level: 'Both',
    levelNote: 'Covers 100+ Indian universities. Travel/airfare coverage varies by scheme — confirm. Note: does NOT cover IIT admission (that runs via JEE Advanced) or MBBS (NEET required even for foreigners).',
    sourceName: 'Indian Council for Cultural Relations (official A2A portal)',
    sourceUrl: 'https://a2ascholarships.iccr.gov.in/',
    verified: true,
  },
  {
    id: 'kaust',
    name: 'KAUST Fellowship (Saudi Arabia)',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    fields: ['Engineering', 'Computer Science', 'Science'],
    amount: 'FULL — tuition (value ~$35,000/yr) + $20,000/yr stipend (MS) or $25,000–30,000/yr (PhD) + housing + insurance + relocation — verified',
    eligibility: 'Awarded to full-time admitted MS/PhD students at KAUST (externally sponsored students may be ineligible) — no separate application',
    deadline: 'Rolling/annual admission cycles — confirm on admissions.kaust.edu.sa',
    deadlineMonth: 99,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'KAUST is graduate-only and every admitted student is funded (~$70–80k/yr total value). STEM/research-focused, English-medium, highly competitive.',
    sourceName: 'KAUST (official admissions)',
    sourceUrl: 'https://admissions.kaust.edu.sa/fees-funding',
    verified: true,
  },
  {
    id: 'kfupm-grad',
    name: 'KFUPM Graduate Scholarships (Saudi Arabia)',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    fields: ['Engineering', 'Science', 'Computer Science', 'Business'],
    amount: 'Full funding — tuition-free study + monthly stipend + free furnished on-campus housing + air tickets + medical care + subsidized meals + textbooks',
    eligibility: 'Distinguished MS/PhD applicants in engineering, sciences and business — all PhD programmes; MS programmes without a corresponding doctoral programme',
    deadline: 'Confirm current cycles on kfupm.edu.sa (the site blocked verification attempts — confirm on official site)',
    deadlineMonth: 99,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'Figures per official pages but the site was unreachable for direct confirmation — confirm everything on kfupm.edu.sa before planning.',
    sourceName: 'KFUPM (official)',
    sourceUrl: 'https://www.kfupm.edu.sa/study/international-students/fees-and-scholarships',
    verified: false,
  },
  {
    id: 'ksu-dgs',
    name: 'KSU Distinguished Graduate Studentship (Saudi Arabia)',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    fields: ['All fields'],
    amount: 'Full tuition + SAR 54,000/yr (~$14,400) living allowance + on-campus housing + health coverage + up to 1 year post-graduation work authorization — verified',
    eligibility: 'Master\'s degree holders from accredited institutions; TOEFL iBT 61+ / IELTS 6+ (waived for degrees from US/CA/UK/IE/AU/NZ)',
    deadline: 'Periodic windows announced on the initiative site (the 2025 window closed May 15) — confirm current phase',
    deadlineMonth: 99,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'PhD ONLY (despite the level badge — there is no master\'s track in this initiative). KSU also offers general full scholarships via the Study in Saudi platform.',
    sourceName: 'King Saud University DGS initiative (official)',
    sourceUrl: 'https://dgsinitiative.ksu.edu.sa/',
    verified: true,
  },
  {
    id: 'hbku-qatar',
    name: 'HBKU Graduate Scholarships (Qatar)',
    country: 'Qatar',
    flag: '🇶🇦',
    fields: ['All fields'],
    amount: 'Tuition waivers — PhD 100%, master\'s STEM 75%, humanities/law 60% — plus monthly stipends QAR 4,000–11,000 — verified',
    eligibility: 'Admitted full-time master\'s/PhD students at Hamad Bin Khalifa University — automatic consideration during admissions, no separate application',
    deadline: 'With HBKU admission cycles — confirm on hbku.edu.qa',
    deadlineMonth: 99,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'Stipends require full-time study (usually with RA/TA service) and are fund-dependent; professionals working >40% time are ineligible for stipends.',
    sourceName: 'Hamad Bin Khalifa University (official)',
    sourceUrl: 'https://www.hbku.edu.qa/en/scholarship',
    verified: true,
  },
  {
    id: 'mbzuai',
    name: 'MBZUAI Graduate Scholarship (UAE)',
    country: 'UAE (Abu Dhabi)',
    flag: '🇦🇪',
    fields: ['Computer Science', 'AI & Computer Science'],
    amount: '100% tuition for ALL admitted MSc/PhD students + AED 15,500/mo (MSc) or 17,500/mo (PhD) stipend + visa + insurance — verified',
    eligibility: 'All admitted full-time MSc/PhD students at the AI-focused university (excludes the MAAI programme); strong quantitative background needed',
    deadline: 'Priority ~Nov 15, final ~Dec 15 for most programmes (annual cycle)',
    deadlineMonth: 12,
    amountTier: 1,
    level: 'Masters / PhD',
    levelNote: 'Every admitted student is funded — effectively a free AI graduate degree with a living stipend. Optional on-campus housing (AED 7,500/mo) is deducted from the stipend.',
    sourceName: 'MBZUAI (official)',
    sourceUrl: 'https://mbzuai.ac.ae/study/graduate-admission-process/',
    verified: true,
  },
  {
    id: 'msrt-iran',
    name: 'Iranian Government (MSRT) Scholarship',
    country: 'Iran',
    flag: '🇮🇷',
    fields: ['All fields'],
    amount: 'Type A: full tuition + accommodation + $72–153/month stipend by level/status; Type B: tuition + accommodation only — verified',
    eligibility: 'GPA 14–16/20 by level; age under 22 (BA), 26 (MA), 31 (PhD); apply via Iranian embassies, CISC@msrt.ir, government MOUs or universities',
    deadline: 'Aug 22 (first semester) / Nov 21 (second semester) — verified',
    deadlineMonth: 8,
    amountTier: 2,
    level: 'Both',
    levelNote: 'Stipends are small but Iranian living costs are among the lowest anywhere. Islamic/neighbouring countries are often prioritised. Check visa/banking logistics before committing.',
    sourceName: 'Iran Ministry of Science, Research & Technology (official)',
    sourceUrl: 'https://www.msrt.ir/en/page/18/apply-for-scholarships',
    verified: true,
  },
  {
    id: 'stipendium-hungaricum',
    name: 'Stipendium Hungaricum (Hungary)',
    country: 'Hungary',
    flag: '🇭🇺',
    fields: ['All fields'],
    amount: 'FULL — 100% tuition + HUF 43,700/mo stipend (BA/MA; PhD 140,000–180,000) + free dormitory or housing allowance + insurance — verified',
    eligibility: 'Citizens of 100+ partner countries (large quotas across Africa, the Middle East, Asia, Latin America) — one application covers up to two programme choices',
    deadline: '15 January, 2pm CET each year (annual cycle)',
    deadlineMonth: 1,
    amountTier: 1,
    level: 'Both',
    levelNote: 'One of the world\'s highest-volume full scholarships — genuinely winnable. The ~€110/month stipend won\'t cover living alone; budget a family top-up. Medicine seats are the most competitive.',
    sourceName: 'Tempus Public Foundation (official)',
    sourceUrl: 'https://stipendiumhungaricum.hu/',
    verified: true,
  },
  {
    id: 'estonia-national',
    name: 'Estonian National Scholarship',
    country: 'Estonia',
    flag: '🇪🇪',
    fields: ['All fields'],
    amount: '€350/month (bachelor\'s & master\'s) or €660/month (PhD) — a stipend, not a tuition waiver — verified',
    eligibility: 'Citizens of ~37 approved countries (Russia/Belarus excluded for 2026/27); requires an admission confirmation from an Estonian institution BEFORE the deadline',
    deadline: 'Sep 2 – Oct 1 window (annual cycle — confirm current dates on harno.ee)',
    deadlineMonth: 10,
    amountTier: 3,
    level: 'Both',
    levelNote: 'Bachelor\'s level is restricted to Estonian language/culture fields; master\'s/PhD are open. Highly competitive (~10% success) — combine with university fee reductions.',
    sourceName: 'Estonian Education and Youth Board — Harno (official)',
    sourceUrl: 'https://harno.ee/en/scholarships-and-grants/scholarships-studying-and-working-estonia/scholarships-international',
    verified: true,
  },
  {
    id: 'uct-postgrad',
    name: 'UCT International & Postgraduate Funding (South Africa)',
    country: 'South Africa',
    flag: '🇿🇦',
    fields: ['All fields'],
    amount: 'Supplementary competitive awards for internationals (do NOT cover full study costs) + donor-funded merit awards — amounts vary, confirm on official site',
    eligibility: 'International and refugee postgraduate students at UCT via the Postgraduate Funding Office; note the main merit/need pools are restricted to South Africans/permanent residents',
    deadline: 'Via the UCT Postgraduate Online Funding Application — confirm current dates',
    deadlineMonth: 99,
    amountTier: 3,
    level: 'Masters / PhD',
    levelNote: 'HONEST note: international awards here are SUPPLEMENTARY, not full rides — pair with the Mandela Rhodes Scholarship (postgrad, Africans) or external funding.',
    sourceName: 'University of Cape Town Postgraduate Funding Office (official)',
    sourceUrl: 'https://uct.ac.za/students/fees-funding-postgraduate-degree-funding/postgraduate-degree-funding-overview',
    verified: true,
  },
  {
    id: 'wits-pma',
    name: 'Wits Postgraduate Merit Award (South Africa)',
    country: 'South Africa',
    flag: '🇿🇦',
    fields: ['All fields'],
    amount: 'Tuition fees up to R71,900 for full-time Honours/Masters/PhD by research — verified; based purely on academic merit and fund availability',
    eligibility: 'Graduates pursuing full-time Honours, Masters or PhD (by research or coursework+research) at Wits',
    deadline: 'Via the Wits Postgraduate Funding Portal — confirm current dates',
    deadlineMonth: 99,
    amountTier: 3,
    level: 'Masters / PhD',
    levelNote: 'Covers tuition only (SADC citizens already pay local fees at Wits + R6,970 levy). Availability-of-funds caveat applies — apply early.',
    sourceName: 'University of the Witwatersrand (official funding portal)',
    sourceUrl: 'https://www.wits.ac.za/funding-portal/',
    verified: true,
  },
]

// Region → country names (matching Board.jsx COUNTRIES data)
const REGION_COUNTRIES = {
  'Asia':          ['Malaysia'],
  'Europe':        ['Germany', 'Netherlands'],
  'UK & Ireland':  ['United Kingdom', 'Ireland'],
  'North America': ['Canada'],
  'Middle East':   ['UAE (Dubai)'],
  'Africa':        ['South Africa', 'Egypt'],
}

function getBoardCountries(regions) {
  if (!regions || regions.includes('anywhere')) return null // null = match all
  const set = new Set()
  regions.forEach(r => (REGION_COUNTRIES[r] || []).forEach(c => set.add(c)))
  return [...set]
}

// Merge in verified university-specific scholarships
const ALL_SCHOLARSHIPS = [...SCHOLARSHIPS, ...getUniversityScholarshipsForPage()]

const COUNTRY_OPTIONS = ['All', ...ALL_SCHOLARSHIPS.reduce((acc, s) => {
  if (!acc.includes(s.country)) acc.push(s.country)
  return acc
}, [])]

// Derived from the actual data (base + university-embedded scholarships,
// whose fields use the same consolidated vocabulary as the Universities
// page). 'All fields' is pinned after 'All'; note the filter below also
// surfaces 'All fields' scholarships under ANY specific field choice.
const FIELD_OPTIONS = [
  'All',
  'All fields',
  ...[...new Set(ALL_SCHOLARSHIPS.flatMap(s => s.fields))]
    .filter(f => f !== 'All fields')
    .sort((a, b) => a.localeCompare(b)),
]
const LEVEL_OPTIONS = ['All', 'Undergraduate', 'Masters / PhD', 'Both']

const LEVEL_STYLE = {
  'Undergraduate': { bg: '#E4F5EC', color: '#2D7A52', border: '#4F8A6E30' },
  'Masters / PhD': { bg: '#FDF0E6', color: '#9A5010', border: '#E07A2F30' },
  'Both':          { bg: '#EEF2FB', color: '#3B5BA5', border: '#3B5BA530' },
}

// ─── page ─────────────────────────────────────────────────────────────────────

import ProfileMenu from './ProfileMenu.jsx'

export default function Scholarships({
  answers, planLevel, onGoToBoard, onStartOver, onBack,
  user, firstName, onOpenAuth, onSignOut, onGoToDashboard,
  onGoToPrivacy, onGoToTerms, onDeleted, onGoToPricing,
}) {
  const [countryFilter, setCountryFilter] = useState('All')
  const [fieldFilter,   setFieldFilter]   = useState('All')
  const [levelFilter,   setLevelFilter]   = useState('All')
  const [sortBy,        setSortBy]        = useState(null)  // null | 'deadline' | 'amount'
  const [selectedScholarship, setSelectedScholarship] = useState(null)
  const [savedBoard, setSavedBoard] = useState(null)  // { budget, field, regions } | null

  // Load saved board from Supabase
  useEffect(() => {
    if (!supabase || !user) return
    supabase
      .from('user_boards')
      .select('budget, field, regions')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setSavedBoard(data) })
      .catch(() => {})
  }, [user])

  const hasBoard    = answers && onGoToBoard
  const backLabel   = hasBoard ? '← Change answers' : '← Back'
  const onBackClick = hasBoard ? onStartOver : onBack
  const email       = user && (user.email.length > 22 ? user.email.slice(0, 22) + '…' : user.email)
  const displayName = firstName || (user?.email?.split('@')[0]) || ''

  // Board-match logic
  const boardCountries = savedBoard ? getBoardCountries(savedBoard.regions) : null

  function isFromBoard(s) {
    if (!savedBoard || !boardCountries) return false
    return boardCountries.includes(s.country)
  }

  // Paid-tier gating first (planLevel comes from the subscription in App.jsx;
  // null = combined plan or free account — free browsing is never restricted).
  // 'Both' scholarships genuinely cover both levels, so they always pass.
  const planVisible = planLevel
    ? ALL_SCHOLARSHIPS.filter(s => s.level === planLevel || s.level === 'Both')
    : ALL_SCHOLARSHIPS

  // Filter + sort
  let filtered = planVisible.filter(s => {
    const countryOk = countryFilter === 'All' || s.country === countryFilter
    const fieldOk   = fieldFilter === 'All' || s.fields.includes(fieldFilter) || s.fields.includes('All fields')
    const levelOk   = levelFilter === 'All' || s.level === levelFilter
    return countryOk && fieldOk && levelOk
  })

  if (sortBy === 'deadline') {
    filtered = [...filtered].sort((a, b) => a.deadlineMonth - b.deadlineMonth)
  } else if (sortBy === 'amount') {
    filtered = [...filtered].sort((a, b) => a.amountTier - b.amountTier)
  }

  // Split into board-matched and others
  const boardMatches = savedBoard && boardCountries ? filtered.filter(s => isFromBoard(s)) : []
  const others       = savedBoard && boardCountries ? filtered.filter(s => !isFromBoard(s)) : filtered

  const tabStyle = (isActive) => ({
    background: isActive ? '#16302B' : 'none',
    color: isActive ? '#F7F4EE' : '#16302B99',
    border: 'none', borderRadius: 100, padding: '6px 13px',
    fontSize: '0.85rem', fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: isActive ? 600 : 500, cursor: isActive ? 'default' : 'pointer', whiteSpace: 'nowrap',
  })

  return (
    <div className="min-h-screen" style={{ background: '#F7F4EE' }}>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b" style={{ background: '#F7F4EEf5', borderColor: '#16302B20', backdropFilter: 'blur(8px)' }}>
        {/* Mobile: two rows */}
        <div className="sm:hidden max-w-3xl mx-auto px-6 pt-3.5 pb-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            <Logo onClick={onGoToDashboard} />
            <GhostBtn onClick={selectedScholarship ? () => setSelectedScholarship(null) : onBackClick}>
              {selectedScholarship ? '← Scholarships' : backLabel}
            </GhostBtn>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {hasBoard && <NavTabs active="scholarships" onGoToBoard={onGoToBoard} />}
            </div>
            <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} onGoToPricing={onGoToPricing} />
          </div>
        </div>
        {/* Desktop: single row */}
        <div className="hidden sm:flex max-w-3xl mx-auto px-6 py-3 items-center justify-between gap-3">
          <Logo onClick={onGoToDashboard} />
          {hasBoard && <NavTabs active="scholarships" onGoToBoard={onGoToBoard} />}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <span className="hidden md:inline" style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
              {email}
            </span>
            <ProfileMenu user={user} firstName={firstName} onSignOut={onSignOut} onGoToPrivacy={onGoToPrivacy} onGoToTerms={onGoToTerms} onDeleted={onDeleted} onGoToPricing={onGoToPricing} />
            <GhostBtn onClick={selectedScholarship ? () => setSelectedScholarship(null) : onBackClick}>
              {selectedScholarship ? '← Scholarships' : backLabel}
            </GhostBtn>
          </div>
        </div>
      </header>

      {/* ── Detail view OR list view ── */}
      {selectedScholarship ? (
        <ScholarshipDetail scholarship={selectedScholarship} onBack={() => setSelectedScholarship(null)} />
      ) : (
        <>
          {/* ── Personal header ── */}
          <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#4F8A6E', margin: '0 0 10px' }}>
              Scholarships
            </p>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 600, lineHeight: 1.2, margin: '0 0 10px' }}>
              {displayName ? `Let's find money to pay for it, ${displayName}.` : "Let's find the funding you qualify for."}
            </h1>
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B88', fontSize: '0.975rem', lineHeight: 1.6, margin: 0 }}>
              Most students never apply for funding they'd qualify for — because no one told them it exists. Let&apos;s change that.
            </p>
          </div>

          {/* ── Sort + filters ── */}
          <div className="max-w-3xl mx-auto px-6 pb-2">
            {/* Sort row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55', whiteSpace: 'nowrap' }}>
                Sort
              </span>
              {[
                { key: 'deadline', label: 'Soonest deadline' },
                { key: 'amount',   label: 'Largest award' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(v => v === opt.key ? null : opt.key)}
                  style={{
                    background: sortBy === opt.key ? '#16302B' : '#fff',
                    color: sortBy === opt.key ? '#F7F4EE' : '#16302B',
                    border: `1.5px solid ${sortBy === opt.key ? '#16302B' : '#16302B18'}`,
                    borderRadius: 100, padding: '6px 14px',
                    fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem',
                    fontWeight: sortBy === opt.key ? 600 : 400,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Filter dropdowns */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              <FilterDropdown label="Country" options={COUNTRY_OPTIONS} active={countryFilter} onChange={setCountryFilter} />
              <FilterDropdown label="Field"   options={FIELD_OPTIONS}   active={fieldFilter}   onChange={setFieldFilter} />
              <FilterDropdown label="Level"   options={LEVEL_OPTIONS}   active={levelFilter}   onChange={setLevelFilter} />
            </div>
            {/* Live count */}
            <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B99', fontSize: '0.875rem', margin: '14px 0 20px' }}>
              <strong style={{ color: '#16302B', fontWeight: 600 }}>{filtered.length}</strong>{' '}
              scholarship{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* ── Cards ── */}
          <div className="max-w-3xl mx-auto px-6 pb-20">
            {!user && <SavePrompt onOpenAuth={onOpenAuth} />}

            {filtered.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '48px 32px', textAlign: 'center', border: '1px solid #16302B10' }}>
                <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B66', fontSize: '0.95rem', margin: 0 }}>
                  No scholarships match these filters. Try a different combination.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Board-matched section */}
                {boardMatches.length > 0 && (
                  <>
                    <div style={{
                      background: '#EAF3EE', borderRadius: 14,
                      border: '1px solid #4F8A6E20',
                      padding: '12px 16px', marginBottom: 4,
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ fontSize: '1rem' }}>🎯</span>
                      <div>
                        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: '#2D7A52', margin: 0, letterSpacing: '0.02em' }}>
                          Based on your board
                        </p>
                        <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem', color: '#4F8A6E', margin: 0 }}>
                          Scholarships in your chosen {boardMatches.length === 1 ? 'country' : 'countries'}
                        </p>
                      </div>
                    </div>
                    {boardMatches.map(s => (
                      <ScholarshipCard key={s.id} scholarship={s} onSelect={setSelectedScholarship} highlighted />
                    ))}
                    {others.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 4px' }}>
                        <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#16302B44', whiteSpace: 'nowrap' }}>
                          Other scholarships
                        </span>
                        <div style={{ flex: 1, height: 1, background: '#16302B0c' }} />
                      </div>
                    )}
                  </>
                )}

                {/* Regular / remaining scholarships */}
                {(boardCountries ? others : filtered).map(s => (
                  <ScholarshipCard key={s.id} scholarship={s} onSelect={setSelectedScholarship} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── nav helpers ──────────────────────────────────────────────────────────────

function Logo({ onClick }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: onClick ? 'pointer' : 'default', fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.1rem', fontWeight: 600 }}>
      AdmitAI
    </button>
  )
}

function NavTabs({ active, onGoToBoard }) {
  const t = (isActive) => ({
    background: isActive ? '#16302B' : 'none', color: isActive ? '#F7F4EE' : '#16302B99',
    border: 'none', borderRadius: 100, padding: '6px 13px',
    fontSize: '0.85rem', fontFamily: 'Hanken Grotesk, sans-serif',
    fontWeight: isActive ? 600 : 500, cursor: isActive ? 'default' : 'pointer',
  })
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      <button style={t(active === 'board')} onClick={active === 'board' ? undefined : onGoToBoard}>My Board</button>
      <button style={t(active === 'scholarships')}>Scholarships</button>
    </div>
  )
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: '1.5px solid #16302B30', borderRadius: 100, padding: '6px 16px', cursor: 'pointer', fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#16302B')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#16302B30')}
    >
      {children}
    </button>
  )
}

// ─── premium scholarship card ─────────────────────────────────────────────────

function ScholarshipCard({ scholarship: s, onSelect, highlighted = false }) {
  const [hovered, setHovered] = useState(false)
  const isFlexible = /rolling|varies/i.test(s.deadline)
  const levelStyle = LEVEL_STYLE[s.level] ?? LEVEL_STYLE['Both']

  return (
    <div
      onClick={() => onSelect(s)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="px-5 py-5 sm:px-7 sm:py-6"
      style={{
        background: '#fff',
        borderRadius: 20,
        border: `1px solid ${hovered ? '#16302B1e' : highlighted ? '#4F8A6E22' : '#16302B0f'}`,
        boxShadow: hovered
          ? '0 10px 36px rgba(22,48,43,0.10)'
          : '0 2px 8px rgba(22,48,43,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: 'pointer',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Name + level + amount row */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 min-w-0" style={{ marginBottom: 10 }}>
        <div className="min-w-0" style={{ flex: 1 }}>
          <h2 className="line-clamp-2" style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1.08rem', fontWeight: 600, margin: '0 0 7px', lineHeight: 1.25 }}>
            {s.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>{s.flag}</span>
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', color: '#16302B77', fontSize: '0.82rem' }}>
                {s.country}{s.universityName ? ` · ${s.universityName}` : ''}
              </span>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              background: levelStyle.bg, color: levelStyle.color,
              border: `1px solid ${levelStyle.border}`,
              borderRadius: 100, padding: '2px 9px',
              fontSize: '0.72rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600,
            }}>
              {s.level}
            </span>
          </div>
        </div>
        <div className="sm:text-right" style={{ flexShrink: 0 }}>
          <span style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#16302B', fontSize: '1rem', fontWeight: 600, lineHeight: 1.3 }}>
            {s.amount}
          </span>
        </div>
      </div>

      {/* Field tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
        {s.fields.map(f => (
          <span key={f} style={{
            background: '#4F8A6E12', color: '#2D7A52', border: '1px solid #4F8A6E24',
            borderRadius: 100, padding: '2px 9px',
            fontSize: '0.73rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 500,
          }}>
            {f}
          </span>
        ))}
      </div>

      {/* Deadline + source line + view details */}
      <div style={{ height: 1, background: '#16302B08', margin: '0 0 12px' }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#16302B55' }}>
              Deadline
            </span>
            <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: isFlexible ? '#8B6914' : '#16302B' }}>
              {s.deadline}
            </span>
          </div>
          {s.verified && s.sourceName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#4F8A6E', fontSize: '0.75rem' }}>✓</span>
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#4F8A6E' }}>Verified</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#E07A2F', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.75rem', color: '#16302B55', fontStyle: 'italic' }}>Estimate</span>
            </div>
          )}
        </div>
        <span style={{
          fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.78rem',
          color: hovered ? '#E07A2F' : '#16302B44', whiteSpace: 'nowrap', flexShrink: 0,
          transition: 'color 0.2s',
        }}>
          View details →
        </span>
      </div>
    </div>
  )
}

// ─── save prompt ──────────────────────────────────────────────────────────────

function SavePrompt({ onOpenAuth }) {
  return (
    <div style={{ background: '#FDF0E6', border: '1px solid #E07A2F22', borderRadius: 14, padding: '13px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
      <p style={{ fontFamily: 'Hanken Grotesk, sans-serif', fontSize: '0.875rem', color: '#16302B', margin: 0, lineHeight: 1.4 }}>
        Sign up to track scholarships and get deadline reminders.
      </p>
      <button onClick={() => onOpenAuth('signup')} style={{ background: '#E07A2F', color: '#fff', border: 'none', borderRadius: 100, padding: '7px 16px', fontSize: '0.82rem', fontFamily: 'Hanken Grotesk, sans-serif', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
        Sign up free →
      </button>
    </div>
  )
}

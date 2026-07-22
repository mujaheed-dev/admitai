// ─────────────────────────────────────────────────────────────────────────────
// AdmitAI verified reference data — injected into the AI's system prompt.
//
// NOTE ON SCALE:
//   The dataset covers ~32 countries, ~71 scholarships, ~353 detailed
//   universities (~56,000–73,000 tokens if injected whole).
//
//   RETRIEVAL: use buildAdmitaiContext(query) (bottom of this file) instead of
//   injecting ADMITAI_VERIFIED_DATA directly. It selects only the country
//   blocks, scholarships and university entries relevant to the query
//   (plus a coverage index of everything else), keeping requests small.
//   (The frontend also lists ~40 extra Malaysian universities as light entries —
//   those are deliberately NOT included here to keep token costs down.)
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

🇩🇪 GERMANY [VERIFIED — source: study-in-germany.de / DAAD; system facts verified 2026]
  System: Public universities — TUITION-FREE for most students including internationals; you pay only a semester fee (~€100–€400, usually incl. transit pass). Exceptions: Baden-Württemberg charges non-EU students €1,500/semester (verified, still in force 2026; ~5% exemptions possible) and Bavaria allows fees at some universities (e.g. TUM).
  Living: ~€11,904/yr — exactly the 2026 BLOCKED ACCOUNT (Sperrkonto) requirement for the visa; you deposit it and withdraw €992/month (verified)
  All-in range: ~$13,000–$16,000/yr (higher end = cities like Munich)
  Scholarships: Strong | Application effort: Medium
  Language reality: most BACHELOR'S are German-taught (TestDaF/DSH needed); English-taught MASTER'S are abundant. Students from 12-year school systems often need a Studienkolleg foundation year first — check anabin/uni-assist for your certificate.
  Applications: many universities use uni-assist; classic deadlines ~15 July (winter semester) and ~15 January (summer) — confirm per university
  Post-study (verified): an 18-MONTH residence permit to seek work after graduating — any job allowed while searching; apply IMMEDIATELY at graduation (the clock starts then); ~€100; non-renewable, so use it well.

🇮🇹 ITALY [LARGELY VERIFIED — MUR circulars, university fee pages, regional DSU agencies]
  System: Public universities with INCOME-BASED fees + a few privates (Bocconi); non-EU applicants MUST pre-enrol via the Universitaly portal (mandatory, verified)
  Tuition (verified): public universities charge €0–€4,000/yr based on family income via the ISEE Parificato (calculated by an Italian CAF from your home-country documents) — below roughly €13,000–€26,000 ISEE many universities charge zero or the minimum ~€156. Even MEDICINE follows this scale.
  Living: ~€700–€1,200/month by city (Milan highest, the south cheapest)
  Visa money (verified with a caveat): the official MUR reference is €534.41/month ≈ €6,947/yr for 2026/27–2027/28 — but several consulates have begun demanding ~€10,179; check YOUR consulate's current figure.
  ★ DSU REGIONAL GRANTS (verified): each region's right-to-study agency (ER-GO, EDISU, DiSCo LazioDiSCo etc) gives low-income students — internationals INCLUDED — a full package: tuition waiver + cash grant up to ~€6,000–8,000/yr + dormitory place + canteen meals. Qualify via ISEE Parificato under the regional threshold (typically ~€25,000–30,000). Deadlines are regional (~Jul–Sep) and SEPARATE from admission — do not miss them.
  ★ MEDICINE IN ENGLISH (verified): ~16 public universities teach Medicine/Dentistry/Vet in English via the IMAT exam (register ~July, sit ~September; 1,000+ non-EU seats) — with income-based fees this is the cheapest credible English-taught medicine anywhere. Most IMAT universities don't even require IELTS.
  Scholarships: Strong (DSU + MAECI + Invest Your Talent + big university schemes) | Application effort: Medium-High (Universitaly + ISEE paperwork)
  Language: English-taught programmes are common at master's level and growing at bachelor's; most bachelor's remain Italian-taught — confirm per programme.

🇫🇷 FRANCE [LARGELY VERIFIED — campusfrance.org, service-public.gouv.fr, university pages]
  System: Public universities + grandes écoles (elite selective schools); students from ~70 countries MUST apply via the Campus France "Études en France" procedure (verified — most of Africa and Asia included)
  Tuition (verified, 2026-27): non-EU "differentiated" fees at public universities — €2,895/yr bachelor's (licence), €3,941/yr master's; PhD is EXEMPT from differentiated fees (~€400/yr). Grandes écoles set their own fees (Sciences Po up to ~€14,900 UG; HEC/private business schools €20,000–50,000).
  ⚠ POLICY CHANGE (verified, May 2026 decree): fee WAIVERS are being squeezed — until now many universities waived nearly all non-EU students down to EU rates (~€175/€250), but from 2026-27 "differentiated fees are the rule, exemption the exception": waivers capped at 30% of a university's international students (25% in 2027-28, 20% long-term). Old advice that "everyone gets the waiver" is now WRONG — budget the full differentiated fee unless you hold a French government scholarship (BGF holders stay exempt).
  Living: ~€615/month is the visa requirement (≈€7,380/yr, unchanged for 2026 — one of Western Europe's lowest bars); realistic Paris costs are double that, provincial cities much closer to it. CROUS subsidised housing/meals + CAF housing allowance (open to internationals!) soften costs.
  Post-study (verified): the RECE permit ("job search/business creation", ex-APS) — 12 months after a master's-level degree, work allowed; NOT renewable for most nationalities (Indian citizens: 12+12 months under the bilateral agreement).
  Scholarships: Strong at postgrad (Eiffel #64, Boutmy #65) | Application effort: Medium-High (Campus France procedure + interviews)
  Language: most bachelor's are French-taught (B2 needed); English-taught master's are plentiful, especially at grandes écoles and in engineering/business.

🇭🇺 HUNGARY [LARGELY VERIFIED — stipendiumhungaricum.hu, university fee pages]
  System: EU/Schengen member; 900+ English-taught programmes at 30+ universities; famous for EU-recognised English-taught MEDICINE
  ★ STIPENDIUM HUNGARICUM (verified): the headline — thousands of FULL scholarships/yr for citizens of 100+ partner countries: 100% tuition + monthly stipend HUF 43,700 (~€110; PhD HUF 140,000–180,000) + free dormitory OR HUF 40,000/month housing allowance + health insurance. Deadline 15 JANUARY, 2pm CET (see #66).
  Self-funded tuition: non-medical English programmes roughly €1,500–€8,000/yr; MEDICINE ~$16,000–$18,200/yr at the big four (Semmelweis, Debrecen, Szeged, Pécs) — EU-recognised degrees at half UK/US prices
  Living: LOW — ~€400–€700/month (Budapest at the top; Debrecen/Szeged/Pécs cheaper)
  Scholarships: Exceptional relative to country size | Application effort: Low-Medium (one SH portal application covers up to 2 programmes)
  ⚠ The SH stipend (~€110/month) does NOT cover living costs by itself — treat it as tuition-free study with pocket money, and budget family support of ~€200–400/month, especially in Budapest.

🇯🇵 JAPAN [LARGELY VERIFIED — studyinjapan.go.jp, u-tokyo.ac.jp, immigration sources]
  System: National universities (uniform low tuition) + prestigious privates (Waseda/Keio) + the unique half-international APU
  Tuition (verified): national universities charge a standardised ¥535,800/yr (~$3,600) regardless of nationality + one-time ¥282,000 admission fee. Exception: the University of Tokyo raised tuition to ¥642,960 (first hike in 20 years). Privates run ¥1.3M–3.5M/yr.
  Living: ~¥100,000–150,000/month (~$8,000–12,000/yr) — Tokyo at the top
  ★ MEXT (verified): the Japanese government's full ride — tuition + entrance fees + monthly stipend (¥117,000 undergrad / ¥143,000–145,000 research) + round-trip airfare, with NO service obligation (see #67)
  Post-study (verified): "Designated Activities" job-hunting status — 6 months + one 6-month renewal = 12 months; the newer J-FIND visa gives graduates of top-globally-ranked universities up to 2 YEARS to job-hunt or start a business (needs ~¥200,000 savings)
  Scholarships: Strong (MEXT + JASSO + university reductions — Waseda up to 100%, APU 30–65% common) | Application effort: Medium-High
  Language: most undergraduate study is JAPANESE-taught (EJU entrance exam + JLPT) — but full English degrees exist: UTokyo PEAK, Nagoya G30, Waseda/Keio/Sophia programmes, and APU (half the student body is international, fully English). MEXT undergrad includes a preparatory Japanese year.

🇰🇷 SOUTH KOREA [LARGELY VERIFIED — studyinkorea.go.kr, university pages, immigration sources]
  System: SKY elite (Seoul National, Korea, Yonsei) + science institutes (KAIST, POSTECH, UNIST) + big privates; surging global popularity
  Tuition (verified ranges): national universities ₩2M–5M per SEMESTER (~$3,000–7,400/yr); privates ₩4M–8M/semester (~$6,000–12,000/yr; Yonsei internationals ₩4.3M–8.7M/semester) — medicine/engineering at the top
  Living: ~₩800,000–1,500,000/month in Seoul (~$7,000–13,000/yr); regional cities notably cheaper
  ★ GKS (verified): the Korean government full ride — tuition (to ₩5M/semester) + monthly stipend ₩900,000 (UG) / ₩1,380,000 (graduate, raised for 2026) + airfare + settlement allowance + a FUNDED 1-year Korean language year + insurance (see #68)
  ★ KAIST (verified): every admitted international undergraduate gets full tuition (8 semesters) + ₩350,000/month automatically — see the KAIST entry
  Post-study (verified): D-10 job-seeker visa — fresh Korean-university graduates are EXEMPT from its points system; extendable up to 2 years total from a D-2 student visa; part-time work allowed with TOPIK 4+
  Scholarships: Very strong | Application effort: Medium (embassy or university track paperwork)
  Language: Korean-taught dominates undergrad (TOPIK 3–4 entry, 4+ to graduate at many); genuine English tracks exist at KAIST/POSTECH/UNIST (fully English) and Yonsei UIC, Korea U, SKKU. GKS includes the Korean year — treat learning Korean as part of the deal.

🇵🇱 POLAND [LARGELY VERIFIED — study.gov.pl, nawa.gov.pl, gov.pl migration pages]
  System: EU/Schengen member — the budget workhorse of European study; large English-taught catalogue
  Tuition (verified ranges): English-taught programmes typically €2,000–€6,000/yr; English-taught MEDICINE €10,000–€16,000/yr (e.g. Wrocław Medical ~€13,400, Łódź ~€15,470) — total 6-year MD ~€66,000–96,000, well under Western costs
  Living: LOW — ~€400–€700/month (Warsaw/Kraków at the top)
  Scholarships: Banach NAWA is the flagship for developing countries (see #69); universities add merit awards
  Post-study (verified): a one-time 9-MONTH graduate residence permit for job-seeking (apply immediately after graduating, before your student stay expires) — and graduates of FULL-TIME Polish studies can work WITHOUT a work permit
  Application effort: Low-Medium — universities admit directly, document-based; October intake with some February starts
  Language: Polish-taught study exists but internationals overwhelmingly use the English-taught catalogue; no Polish needed for those (the Banach scholarship adds a funded preparatory year).

🇨🇾 CYPRUS [MIXED — heavily agent-marketed to international students; read the warnings]
  System: TWO separate worlds. (1) The REPUBLIC of Cyprus (south) — EU member: public universities (University of Cyprus, CUT) + private universities (Nicosia, UCLan Cyprus, European University Cyprus). (2) NORTHERN Cyprus (TRNC) — not internationally recognised as a state; universities accredited via Turkey's YÖK.
  Tuition: Republic privates ~€6,000–€10,000/yr sticker with 30–50% scholarships routinely offered (UCLan Cyprus verified examples: €9,950 → €5,970–6,965 after standard discounts); Nicosia's English medicine runs far higher (~€18,000+/yr — confirm). North Cyprus is very cheap: CIU ~€3,099/yr for most bachelor's and €7,400 medicine AFTER the automatic 50% scholarship every admitted international gets (verified pattern — the "50% scholarship" agents advertise is standard pricing, not an achievement).
  Living: ~€400–€800/month; North cheaper than South
  ⚠ LANGUAGE TRAP (Republic): PUBLIC universities teach most BACHELOR'S in GREEK — the cheap public option is largely closed to non-Greek speakers; English-taught study is mainly at private universities and postgrad level.
  ⚠ RECOGNITION WARNING (North): because the TRNC is unrecognised, degree recognition VARIES BY COUNTRY — degrees are Turkish-accredited (fine for Turkey and many states; EMU/NEU hold real international programme accreditations like ABET) but some countries and professional bodies do not accept them. VERIFY with your home country's credential authority BEFORE enrolling — agents will not volunteer this.
  Scholarships: "Automatic" discounts are the norm (treat advertised scholarships as list-price marketing) | Application effort: Low
  Post-study: Republic = EU rules; North Cyprus offers no meaningful post-study migration path — plan it as degree-only.

🇬🇪 GEORGIA [MIXED — an agent-driven MBBS market; figures below are agent/consultancy-quoted, treat as approximate]
  System: Post-Soviet Caucasus country (NOT the US state) — 25+ medical programmes marketed worldwide, plus general universities
  The pitch (and it's partly true): English-taught 6-year medicine ~$5,000–$8,000/yr (TSMU ~$8,000/yr, total ~$48,000), no entrance exam, no IELTS, low living costs (~$300–500/month), WHO/WFME-listed schools
  ⚠ THE HONEST VERSION: quality varies ENORMOUSLY across Georgia's medical schools — a handful (TSMU, David Tvildiani) have real reputations; many others are diploma businesses feeding agent commissions. Before paying anyone: (1) verify the school is recognised by YOUR country's medical council, (2) check your country's licensing-exam pass rates for that school's graduates, (3) never pay "agents" for admission that is free and test-free anyway.
  Scholarships: Essentially none for internationals — this is a self-funded market | Application effort: Low
  Post-study: no meaningful migration path — plan Georgia as degree-only and licensing-exam prep back home.

🇦🇲 ARMENIA [MIXED — same agent-driven MBBS pattern as its Caucasus neighbour; figures agent-quoted]
  System: Small Caucasus country; Yerevan State Medical University (YSMU) is the credible flagship marketed abroad
  Cost: English MBBS ~$5,000–$6,500/yr at YSMU + hostels ~$600/yr — among the cheapest credible MD routes anywhere; living ~$300–500/month
  ⚠ Same rules as Georgia: verify YOUR medical council's recognition and graduate licensing pass rates first; Indian students still need NEET qualification for home recognition. No IELTS needed is marketing, not a quality signal.
  Scholarships: None meaningful for internationals | Application effort: Low | Post-study: degree-only.

🇸🇬 SINGAPORE [LARGELY VERIFIED — moe.gov.sg, university fee pages]
  System: Small, elite — NUS and NTU are Asia's top-2 in most rankings; SMU, SUTD, SIT round out the publics. English-medium throughout.
  Tuition (verified): WITHOUT the grant S$30,000–S$60,000+/yr (medicine S$150,000+). WITH the MOE Tuition Grant (see #70): S$17,000–S$30,000/yr — e.g. NUS Engineering S$38,000 → S$17,550; NTU Business S$36,000 → S$17,100.
  Living: HIGH — ~S$1,500–2,500/month (~$14,000–22,000/yr); hall places soften it
  ★ MOE TUITION GRANT (verified): the defining deal — the government pays 40–60% of your fees, you sign a contract to work at a Singapore entity for 3 YEARS after graduating. It is a BOND, not a scholarship — breaking it means repaying with interest. For most students it's a good trade: guaranteed right to work in one of the world's strongest job markets.
  Scholarships: Beyond the grant, university/ASEAN scholarships exist for top admits (some cover everything + stipend) | Application effort: High — NUS/NTU admission is extremely competitive
  Post-study: the bond IS the post-study plan; non-grant graduates compete for Employment Passes.

🇸🇪 SWEDEN [LARGELY VERIFIED — si.se, universityadmissions.se]
  System: Applications for ALL universities go through one portal (universityadmissions.se); master's-heavy English catalogue
  Tuition (verified ranges): non-EU SEK 80,000–120,000/yr humanities/social sciences; 120,000–180,000 engineering/IT/science; 120,000–200,000 business; 200,000–300,000 medicine/design (≈€7,000–26,000/yr). EU/EEA free.
  Living: ~SEK 10,000–14,000/month (~€10,000–14,500/yr) — the visa requires showing ~SEK 10,584/month (confirm current figure on migrationsverket.se)
  ★ SI SCHOLARSHIP FOR GLOBAL PROFESSIONALS (see #71): full tuition + SEK 12,000/month + travel grant — Sweden's flagship for developing-country professionals
  Post-study: a job-seeking residence permit (~12 months) exists after graduation — confirm current rules on migrationsverket.se
  Deadlines (verified): programme applications 16 Oct – 15 JANUARY for autumn; the SI scholarship portal opens for only ~2 WEEKS in February — you must already have applied to programmes by 15 Jan
  Language: master's in English everywhere; bachelor's mostly Swedish-taught | Application effort: Low-Medium (one portal)

🇫🇮 FINLAND [LARGELY VERIFIED — studyinfinland.fi, studyinfo.fi, university pages]
  System: Research universities + universities of applied sciences (UAS); ONE national application platform (studyinfo.fi)
  Tuition (verified): non-EU €8,000–€20,000/yr for English-taught degrees — BUT 50–100% tuition WAIVERS are routine for strong applicants and most universities consider you AUTOMATICALLY when you apply via Studyinfo (no separate scholarship application at most)
  Living: ~€800–€1,100/month; the residence permit requires showing ~€800/month (~€9,600/yr — confirm current figure on migri.fi)
  Post-study (verified): a 2-YEAR residence permit to look for work or start a business after graduating — among Europe's most generous, usable flexibly within 5 years of graduation
  Scholarships: The automatic waiver system IS the scholarship — apply early (January joint application) with strong grades; waivers usually cover tuition only, not living
  Language: English-taught programmes are plentiful at both university types; Finnish/Swedish needed for many jobs later — start learning early | Application effort: Low (one portal, January window for autumn)

🇳🇱 NETHERLANDS [VERIFIED — source: European Education Area / official EU; system facts below verified 2026]
  System: 13 research universities + universities of applied sciences (HBO); applications via Studielink
  Tuition: €8,500–€19,500/yr (top programmes now exceed this — TU Delft MSc €25,633 for 2026-27, verified) | Living: ~€14,000/yr
  All-in range: ~$22,000–$34,000/yr
  Scholarships: Some | Application effort: Medium
  Deadlines (verified): NUMERUS FIXUS (capped) programmes close 15 January — a HARD deadline, max 2 fixus programmes per year; regular programmes typically 1 April–1 May for non-EU (apply by Feb–Mar for visa/housing lead time). Studielink opens 1 October.
  Post-study (verified, IND): the "zoekjaar" orientation-year permit gives 12 months to live and work with NO work restrictions; apply within 3 years of graduating; €254 fee; reduced highly-skilled-migrant salary threshold (€3,122/month in 2026) afterwards.
  ⚠ HEADWINDS (verified): the government is cutting English-taught BACHELOR'S programmes (Internationalisation in Balance policy — from 2026 many must switch mostly to Dutch) and universities are deliberately shrinking international bachelor intakes. Master's-level English study is far less affected. Student HOUSING is in severe shortage — secure housing before accepting an offer. University budget cuts are also killing scholarships (Utrecht's Excellence Scholarship is discontinued from 2026-27).

🇦🇪 UAE (DUBAI) [VERIFIED — source: moe.gov.ae]
  System: International branch campuses
  Tuition: $8,000–$33,000/yr (wide range by campus) | Living: ~$16,000/yr
  All-in range: ~$18,000–$45,000/yr
  Scholarships: Limited | Application effort: Low
  Notes: Country figures are broad averages. Standouts sit outside them: NYU Abu Dhabi's sticker tuition is ~$68,600 but its need-based aid is exceptional; Khalifa University offers up to 100% tuition waivers; MBZUAI (grad AI) fully funds every admitted MSc/PhD student. See the university entries.

🇮🇪 IRELAND [VERIFIED — irishimmigration.ie, hea.ie, university fee schedules]
  System: 7 traditional universities + technological universities; undergrad applications via the CAO (~1 Feb deadline, late applications possible); postgrad direct
  Tuition (verified ranges): non-EU undergraduate ~€12,000–€30,000/yr (TU Dublin at the value end ~€11,650–€12,500; Trinity €21,570–€29,570 for 2026/27); medicine/dentistry €35,000–€60,000
  Living: ~€12,000/yr — the amount the student visa requires you to show ON TOP of first-year tuition (verified; at least ~€6,000 of tuition must be paid before the visa)
  All-in range: ~$26,000–$45,000/yr
  Scholarships: Some (GOI-IES is the flagship — see #4) | Application effort: Medium
  Post-study (verified): Stamp 1G stay-back — 12 months after an honours bachelor's (Level 8), up to 24 months after a master's/PhD (Level 9/10); full-time work with NO employment permit needed; apply within 6 months of results. Dublin hosts EU headquarters of Google, Meta, Pfizer etc — a genuine graduate job market.

🇨🇦 CANADA [VERIFIED — source: EduCanada / IRCC, educanada.ca]
  System: Provincial universities
  Tuition: $14,500–$36,500/yr | Living: ~$17,000/yr
  All-in range: ~$31,000–$50,000/yr
  Scholarships: Some | Application effort: High
  Notes: Country figures are broad averages — top research universities (Toronto, UBC, McGill) charge more, up to ~$47,000 USD/yr tuition alone, while affordable options exist (Memorial ~$16,400/yr tuition). See the university entries below.

🇬🇧 UNITED KINGDOM [VERIFIED — source: UCAS & UKVI, ucas.com / gov.uk]
  System: UCAS (centralised applications)
  Tuition: $19,000–$38,000/yr | Living: ~$16,500/yr
  All-in range: ~$34,000–$57,000/yr (elite universities exceed this — Oxford up to £62,820, Cambridge up to £70,554 tuition alone)
  Scholarships: Strong at postgraduate level (Chevening, Commonwealth, GREAT, Gates Cambridge, Rhodes — see #40–44); limited at undergraduate | Application effort: High
  UCAS deadlines (2027 entry, verified): 15 Oct 2026 6pm for Oxford, Cambridge, medicine, dentistry & veterinary; 13 Jan 2027 6pm UK time equal-consideration deadline for everything else. International students follow the SAME deadlines; many universities accept later international applications but apply early for visa lead time.
  Visa money rules (verified, gov.uk-derived): show maintenance funds of £1,529/month (London) or £1,171/month (elsewhere) × 9 months ON TOP of first-year tuition, held 28 consecutive days; Immigration Health Surcharge £776/yr.
  ⚠ GRADUATE ROUTE CHANGE (verified): post-study work visas applied for from 1 Jan 2027 give 18 MONTHS (was 2 years); PhD graduates keep 3 years. Applications submitted by 31 Dec 2026 still get 2 years. Factor this into UK-vs-Canada comparisons.

🇿🇦 SOUTH AFRICA [MIXED — SADC fee rule & flagship fees verified; country living figure is a general estimate]
  System: Public universities (English-taught)
  A top intra-Africa destination — strong universities, lower cost than Western countries.
  All-in range: ~$6,000–$12,000/yr including living (varies by university/city — general estimate)
  Scholarships: Some | Application effort: Medium
  ★ SADC RULE (verified): citizens of SADC countries (Angola, Botswana, Comoros, DRC, Eswatini, Lesotho, Madagascar, Malawi, Mauritius, Mozambique, Namibia, Seychelles, Tanzania, Zambia, Zimbabwe) pay LOCAL tuition at South African public universities under the SADC Protocol — only an international levy is added (e.g. Wits R6,970, Pretoria R4,725). Non-SADC internationals typically pay ~DOUBLE local tuition at Wits/Pretoria. This is the single biggest cost lever for African users — see scholarship #60.

🇪🇬 EGYPT [ESTIMATE — country figure; university tuition below is verified from official sources]
  System: Public & private universities (many English-taught, esp. private)
  Tuition varies widely: from ~$3,000/yr (cheaper private programmes) up to ~$22,000/yr (AUC full load)
  Living: low by international standards (~$3,000/yr — rough estimate)
  All-in range: ~$6,000–$25,000/yr (general estimate — depends heavily on the university)
  Scholarships: Some | Application effort: Medium

🇶🇦 QATAR [MIXED — university tuition verified from official sources; country living figure is an ESTIMATE]
  System: National university (Qatar University) + Education City US branch campuses (Qatar Foundation) + newer private universities
  Two price worlds: Qatar University ~QAR 33,000–42,000/yr tuition (~$9,000–$11,500 USD) vs US branch campuses ~$70,000–$75,000/yr (they charge the SAME tuition as their US home campuses) — but Qatar Foundation need-based grants/interest-free loans are generous and QU offers full scholarships
  Living: Doha roughly $8,000–$13,000/yr (rough estimate — university housing is often included in scholarships)
  Scholarships: Strong | Application effort: Medium
  ⚠ Texas A&M's Qatar campus is CLOSING by 2028 — no new admissions since Fall 2024 (verified, qatar.tamu.edu). Do not recommend it.

🇸🇦 SAUDI ARABIA [MIXED — KAUST verified directly; several official Saudi sites were unreachable, figures flagged accordingly]
  System: Large public universities (scholarship-driven for internationals) + private tuition-based universities + KAUST (graduate-only, fully funded)
  The SCHOLARSHIP route is the main path for internationals: government/university full scholarships (tuition + monthly stipend + housing + flights + healthcare) via the official Study in Saudi platform covering ~27 public universities
  Private tuition (where confirmed): roughly SAR 58,000–103,500/yr incl. VAT (~$15,500–$27,600 USD) at PMU / Alfaisal / Prince Sultan University
  Living: rough estimate ~$8,000–$15,000/yr — scholarship students are typically housed and stipended, so out-of-pocket can be near zero
  Scholarships: Very strong (full packages common) | Application effort: Medium
  Notes: Some institutions are single-gender — Effat University is women-only; the Islamic University of Madinah is men-only. KAUST funds every admitted graduate student. Non-Saudi VAT (5–15%) applies at private universities.

🇹🇷 TURKEY (TÜRKİYE) [MIXED — flagship scholarship & top universities researched; many public-university fees are set annually in TRY and NOT individually verified]
  System: Public universities (very low international fees at most — often a few hundred USD/yr; top publics like Boğaziçi charge ~$8,000–10,000/yr) + foundation/private universities (~$22,000–36,500/yr at the top ones, but with big merit waivers)
  The flagship route: Türkiye Bursları government scholarship — tuition + stipend + dormitory + flights + health insurance + a 1-year Turkish course, open to all nationalities (see scholarship #30)
  Living: rough estimate ~$4,000–$8,000/yr — Istanbul highest; TRY inflation makes all lira figures change every year, always confirm current numbers
  Scholarships: Very strong (government + generous private-university waivers) | Application effort: Medium
  Notes: Public universities admit internationals via quota systems (YÖS exam / SAT / national diplomas — varies by university). Many programmes are Turkish-medium — top universities (Boğaziçi, METU, Bilkent, Koç, Sabancı) teach in English; always confirm the language of instruction per programme.

🇮🇷 IRAN [MIXED — Sharif fees & MSRT scholarship verified directly; several official .ac.ir sites were unreachable, figures flagged accordingly]
  System: Large public universities + specialised medical universities (separate system under the Health Ministry) + Al-Mustafa (religious, fully funded)
  Cost: Among the CHEAPEST study destinations anywhere — e.g. University of Tehran ~$1,700–$4,300/yr by field, Sharif ~€2,700–€3,000/yr, English-taught MD at TUMS $5,000–$7,500/yr. Living is very low: ~$150–$250/month per official TUMS guidance (~$2,000–$3,000/yr).
  Scholarships: Strong — the MSRT government scholarship covers tuition + accommodation (+ small stipend for Type A); Al-Mustafa is fully funded (see #34/#36)
  Application effort: Medium | Language: MOST programmes are Persian-medium — a Persian preparatory year is common; medical universities (TUMS etc.) and some engineering graduate programmes are marketed in English. Always confirm language per programme.
  ⚠ Practical notes: international banking with Iran is heavily restricted by sanctions — paying fees and receiving money from home requires planning (many students carry funds or use exchange offices); check visa logistics and your home country's travel guidance before committing. Fees are often quoted in USD/EUR but paid via Iranian channels.

🇪🇪 ESTONIA [LARGELY VERIFIED — sources: studyinestonia.ee (official portal), harno.ee, university sites]
  System: Small EU/Schengen country, digital-first — ~6 public universities + a few private; English-taught programmes widespread
  Tuition (verified, studyinestonia.ee): €1,500–€15,000/yr for bachelor's/master's (most programmes ~€3,000–€8,000; medicine/law/business highest). ALL doctoral (PhD) studies are TUITION-FREE. EU/EEA citizens are often exempt (e.g. TalTech, except its business school).
  Living: ~€500–€800/month (~€6,000–€9,600/yr — rough estimate; Tallinn highest)
  Work: international students may work alongside full-time studies WITHOUT an extra permit (verified, studyinestonia.ee)
  Scholarships: Some | Application effort: Medium (DreamApply portal used by most universities)
  ⚠ Policy change: the University of Tartu STOPS offering tuition waivers to new non-EU/EEA students from 2026/27 — replaced by automatic 25/50/100% fee reductions in selected programmes (verified, ut.ee). Do not promise Tartu waivers.

🇮🇳 INDIA [MIXED — official channels (ICCR, Study in India, DASA) verified; individual university fees mostly per-programme]
  System: Enormous — Institutes of National Importance (IITs/NITs/IISc), central & state universities, and large private universities that actively recruit internationals. English is the medium of instruction at essentially all of them.
  Cost: Among the world's cheapest quality destinations — public universities can cost a few hundred USD/yr; NITs via DASA ~$4,000/semester (SAARC citizens pay HALF); private universities ~$1,000–$6,000/yr tuition. Living: very low, ~$2,000–$4,000/yr (hostels ~₹6,000/month + mess ~₹5,000/month at NITs, verified).
  Official channels (verified): Study in India portal (studyinindia.gov.in) — hundreds of institutions, tuition waivers of 25/50/100% by academic merit; ICCR full scholarships (see #47); DASA scheme for NITs/IIITs (dasanit.org); IITs admit foreign nationals directly via JEE Advanced (10% supernumerary seats, registration $100 SAARC / $200 others).
  Scholarships: Strong (ICCR + SII waivers) | Application effort: Medium
  ⚠ MEDICINE WARNING (verified): MBBS admission in India requires qualifying NEET — this applies to FOREIGN nationals too, not just Indians. Do not let users assume they can enter MBBS without NEET. Also verify home-country recognition of any Indian medical degree before enrolling.

🇳🇿 NEW ZEALAND [LARGELY VERIFIED — immigration.govt.nz, nzscholarships.govt.nz, university sites]
  System: Exactly 8 universities (all public, all well-ranked) + polytechnics; apply DIRECTLY to universities — no central system. Main intakes February and July.
  Tuition (2026 anchors, verified-derived): international undergraduate ~NZ$26,000–$58,000/yr by university and subject (Otago from ~NZ$26,000; Auckland NZ$40,225–$58,120+). Living: budget NZ$20,000+/yr.
  ★ PhD SUPERPOWER (verified): international PhD students pay DOMESTIC fees — only ~NZ$7,000–$9,000/yr (+ ~NZ$1,100–1,300 services fee) — a national policy since 2007. Condition: reside in NZ during the doctorate (≤12 months abroad allowed).
  Visa money rules (verified, immigration.govt.nz): show NZ$20,000/yr living funds (NZ$1,667/month for shorter study) PLUS tuition PLUS a return ticket or ~NZ$1,500–2,500 extra; INZ scrutinises the source of funds strictly.
  Post-study work (verified): up to 3 YEARS for master's/PhD graduates (≥30 weeks study); bachelor's-level visas match study length; from 16 Nov 2026 Level-7 graduate diplomas also qualify (with a prior bachelor's).
  Scholarships: Strong for developing countries (Manaaki, see #49) | Application effort: Medium

🇨🇳 CHINA [MIXED — CSC scholarship & MBBS rules verified; individual university fees mostly per-programme]
  System: Massive — C9 League elite universities (Tsinghua, Peking, Fudan, SJTU, Zhejiang...) + hundreds more; internationals apply directly to universities or through the CSC scholarship channels
  Tuition: LOW — typical English-taught programmes ¥20,000–¥40,000/yr (~$2,800–$5,600); even Tsinghua charges only ¥26,000–¥30,000/yr for undergrad (~$3,600–$4,200, verified). Living: cheap outside central Beijing/Shanghai (~$2,500–$5,000/yr).
  Language: Chinese-medium programmes need HSK 4–5; English-taught options are broad in engineering, business and medicine — always confirm the language per programme
  Scholarships: VERY strong — the Chinese Government Scholarship (CSC) fully funds tens of thousands of students (see #50); provincial/city and university scholarships stack on top
  Medicine (verified): only 45 MOE-approved universities may teach MBBS in ENGLISH (~2,780 seats/yr); bilingual MBBS teaching is prohibited — if a university NOT on the MOE list offers "English MBBS", walk away. HSK-4 is required before graduation; the degree takes 5–6 years incl. internship.
  ⚠ POST-STUDY reality: China is excellent for cheap, funded degrees but HARD for staying to work — standard work permits generally require 2 years' post-graduation experience (some pilot zones/graduate channels relax this). Frame China as education + experience, not automatic immigration.

🇺🇸 UNITED STATES [LARGELY VERIFIED — aid policies, visa rules and Fulbright from official sources]
  System: 4,000+ institutions; undergrad applications mostly via the Common App (early decision ~Nov 1, regular decision ~Jan 1–15, many publics rolling — confirm per college); graduate applications direct to departments
  Sticker cost: HIGH — private universities $60,000–$90,000+/yr all-in; public flagships ~$45,000–$70,000 all-in for non-residents. BUT the aid story changes everything (below).
  ★ AID REALITY (verified 2026): exactly 10 universities are NEED-BLIND + meet FULL NEED for internationals — Harvard, Yale, Princeton, MIT, Amherst, Dartmouth, Bowdoin, Washington & Lee, plus Brown and Notre Dame from the Class of 2029. Harvard is now FREE below $100k family income and tuition-free below $200k — internationals get the SAME deal. Dozens more colleges meet full need but are need-aware; big publics offer large automatic MERIT awards instead.
  Visa (verified): F-1 — SEVIS I-901 fee $510 + visa fee $185; show funds covering year 1; visa interviews scrutinise finances and home ties heavily.
  Post-study work (verified): OPT gives 12 months' work authorization; STEM degrees add a 24-month extension → up to 3 YEARS total. The classic US pathway: degree → OPT → H-1B sponsorship (lottery).
  Scholarships: Institutional aid IS the scholarship system — there is no big government scholarship for inbound undergrads; Fulbright (see #53) covers graduate study only.
  ⚠ Tests: SAT/ACT policies vary — several elites reinstated testing requirements; TOEFL/IELTS/Duolingo needed everywhere. Confirm per college, per year.

🇦🇺 AUSTRALIA [LARGELY VERIFIED — immi.homeaffairs.gov.au, dfat.gov.au, education.gov.au]
  System: 40+ universities led by the Group of Eight (Melbourne, Sydney, ANU, UNSW, Queensland, Monash, UWA, Adelaide); apply directly or via agents; main intakes February and July
  Tuition: International undergrad typically AU$35,000–$60,000/yr (Go8 flagships at the top; per-course — confirm each). Living: officially benchmarked at AU$29,710/yr for the visa.
  Visa money rules (verified, 2026): show AU$29,710/yr living costs + first-year tuition + AU$2,500 travel, funds held/verifiable (partner +AU$8,574/yr, child +AU$3,670/yr)
  Post-study work (verified): Temporary Graduate visa (485) — 2 years for bachelor's/master's (3 for research master's & PhD; Indian citizens get +1 year via ECTA; Hong Kong/BNO 5 years; +1–2 extra for regional-area study). Age cap 35 (50 for research/PhD). Fee AU$5,750 from Jul 2026.
  Enrollment caps (verified): the 2026 National Planning Level allows 295,000 new international students (up 25,000 from 2025) with Ministerial Direction 111-style processing priorities — government-scholarship recipients and Pacific/Timor-Leste nationals get priority processing. Caps make EARLY applications matter.
  Scholarships: Strong for developing countries (Australia Awards, see #56); research degrees widely funded via RTP (see #57) | Application effort: Medium
  ⚠ From 2 Feb 2026 you cannot apply for a student visa onshore while holding a 485 — plan any second course before graduating.

🇷🇺 RUSSIA [MIXED — tuition/scholarship structure verified; the banking/sanctions reality is the decisive caveat; individual university fees are agent-quoted]
  System: Large public universities + specialised medical universities (English MBBS is a big draw); one of the world's cheapest destinations, with a large African/Asian international cohort (RUDN especially)
  Cost (agent-quoted ranges): English-taught MBBS ~$3,000–$8,000/yr; general/STEM tuition often ~$2,000–$6,000/yr. Living is very low: ~$150–$250/month.
  Scholarships (verified structure): the Russian Government Scholarship via ROSSOTRUDNICHESTVO gives ~15,000 quota places/yr to 180+ countries — tuition-free + a monthly stipend + hostel; the OPEN DOORS Olympiad funds international master's/PhD applicants with full tuition waivers at participating universities. Apply via the Rossotrudnichestvo office/portal serving your country.
  Language: MOST degree programmes are RUSSIAN-medium — a funded 1-year Russian preparatory year is standard. English-taught MD and some English master's exist (many MBBS programmes don't require IELTS) — confirm per programme.
  ⚠⚠ BANKING & SANCTIONS (the deciding factor, verified): major Russian banks are cut off from SWIFT, and Western bank cards / payment apps (Visa, Mastercard, Apple/Google Pay) DO NOT work inside Russia. Paying tuition and receiving money from home is genuinely difficult — often cash-based or routed via third countries; scholarship/allowance transfers can also be disrupted. Get the university's CURRENT payment guidance and budget for this reality before committing. Post-study work options are limited.
  ⚠ MBBS golden rules (as with Georgia/Kyrgyzstan): verify YOUR home medical council recognises the specific university AND check its graduates' licensing-exam pass rates (e.g. FMGE/NExT for India) BEFORE enrolling; apply directly — no agent is required.


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

4. Government of Ireland International Education Scholarships (GOI-IES) [VERIFIED — hea.ie]
   Country: Ireland | Level: MASTER'S & PhD ONLY (NFQ levels 9–10) — NOT undergraduate (our earlier estimate wrongly said undergrad; corrected)
   Amount: €10,000 stipend for one year PLUS a full fee waiver from the host institution — 60 awards/yr
   Eligibility (verified): domiciled outside the EU/EEA/Switzerland/UK; must hold a conditional or final offer from an eligible Irish institution when applying
   Deadline: 12 March 2026, 5pm Irish time, for 2026/27 — annual cycle, confirm on hea.ie
   ⚠ Highly competitive (60 awards nationally). Undergraduates should look at university merit awards instead (e.g. Trinity Global Excellence, UCD Global Scholarships — confirm on university sites).

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

12. UNM High Achiever's Scholarship — University of Nottingham Malaysia [VERIFIED — nottingham.edu.my]
   Country: Malaysia | Level: Undergraduate
   Amount: 15%, 20% or 25% off FIRST-YEAR tuition, based on entry results
   Eligibility: All offer holders, including international students, who meet the academic criteria
   Apply: Automatic — no separate application; awarded with your offer via the NottinghamHub portal
   ⚠ First year only. Non-academic subjects (e.g. Religion, PE, General Studies) don't count toward assessment. Non-Malaysian ASEAN nationals may instead receive a 15%/yr ASEAN bursary; a 25% Dean's Excellence award exists for top continuing students.

13. Monash University Malaysia Merit Scholarships [VERIFIED — monash.edu.my]
   Country: Malaysia | Level: Undergraduate
   Amount: Tuition fee waivers of RM6,000–RM15,000/yr (~$1,400–$3,400 USD/yr); Pharmacy awards are 25% or 50% of tuition for the full 4 years
   Eligibility: New students with excellent results — several awards open to international students, others require Malaysian qualifications (SPM/STPM/UEC); check each award
   Apply: Automatic consideration/nomination for most awards — no separate application
   ⚠ Partial waivers only — living costs not covered. Medicine (MD) is excluded from most awards; Pharmacy has its own 25–50% scheme.

14. UBC International Scholars Program & Major Entrance Scholarships [VERIFIED — you.ubc.ca/financial-planning/scholarships-awards-international-students]
   Country: Canada | Level: Undergraduate
   International Scholars Program: need-AND-merit awards for high achievers with significant financial need and strong extracurriculars. Apply to UBC by ~Nov 15 and submit the Scholars application by ~Dec 1 (dates verified for Sept 2027 entry).
   International Major Entrance Scholarship (IMES): $10,000–$25,000 CAD/yr (2026/27 values, verified), renewable up to 3 additional years — automatic consideration, no separate application.
   Outstanding International Student Award: $10,000–$25,000 CAD one-time (2025/26 values).
   ⚠ IMES/OISA are automatic for students applying by the admission deadline; decisions mid-February–late April. Students nominated for International Scholars are excluded from IMES/OISA.

15. Waterloo International Student Entrance Scholarship [VERIFIED — uwaterloo.ca/future-students/financing/international-scholarships]
   Country: Canada | Level: Undergraduate
   Amount: $10,000 CAD, first year only ($5,000 toward each of the first two terms)
   Eligibility: ALL international fee-paying students entering a full-time first-year degree in Sept 2026 — automatic, no application, no minimum average (verified)
   ⚠ Excludes Medical Sciences/MD, Optometry, Pharmacy, Social Work, and transfer students; must stay full-time. Bigger competitive awards exist: Faculty of Science International Scholarships $25,000–$80,000 (15 awards, application ~Feb 13) and Faculty of Mathematics Global Scholarships $12,000–$40,000.

16. University of Calgary International Entrance Scholarship [VERIFIED — ucalgary.ca/registrar/awards]
   Country: Canada | Level: Undergraduate
   Amount: $20,000 CAD, renewable in years 2–4 (needs GPA 2.60+ over 24 units/yr and continued international-fee status)
   Eligibility: International students entering first year of any undergraduate degree; selected on academic merit; English proficiency required
   Apply: Via the My UCalgary portal "High School Prestige Awards" application (deadline ~Dec 1 for fall entry)
   ⚠ Only TWO awards per year — extremely competitive. Treat as a bonus, not a plan.

17. McCall MacBain Scholarships — McGill University [VERIFIED — mccallmacbainscholars.org]
   Country: Canada | Level: Master's / professional degrees at McGill
   Amount: Full graduate scholarship (tuition & fees plus a living stipend) — up to 30 full scholarships + ~100 smaller entrance awards per year
   Eligibility: Open to all nationalities. For the 2027 cohort: finishing your first bachelor's by Aug 2027, OR earned it Jan 2021 or later, OR earned it earlier and were ≤30 years old on Jan 1, 2026
   Deadline (2027 entry, verified): 19 Aug 2026, 4pm ET for international applicants; 23 Sept 2026 for Canada/US
   ⚠ Character- and leadership-based selection with interviews; you must separately gain admission to a McGill master's programme.

18. Qatar University International Students Scholarship [VERIFIED — qu.edu.qa scholarship types page]
   Country: Qatar | Level: Undergraduate
   Amount: FULL package — tuition + textbook exemption + student housing (two per room) with campus transport + annual round-trip airfare + QAR 500/month stipend + residence permit under QU sponsorship
   Eligibility: High school average 95%+ and final acceptance to QU; direct-entry students only (transfers, visiting, non-degree and second-bachelor applicants excluded)
   Apply: Through the "Scholarship Application" section of QU's online admission application during announced periods

19. Qatar University Talent Scholarship [VERIFIED — qu.edu.qa scholarship types page]
   Country: Qatar | Level: Undergraduate
   Amount: Tuition + textbook exemption + QAR 1,000/month; international recipients also get housing, transport, airfare and residence permit — plus GUARANTEED admission to the desired programme if minimum requirements are met
   Eligibility: 80%+ high school average PLUS documented excellence in scientific research, technology/innovation, literature, media or athletics; two recommendation letters + achievement portfolio
   Apply: Online admission portal with supporting documents/videos during application periods

20. HBKU Graduate Scholarships — Hamad Bin Khalifa University [VERIFIED — hbku.edu.qa/en/scholarship]
   Country: Qatar | Level: Master's / PhD
   Amount: Tuition waivers — PhD 100%; Master's STEM 75%; Master's SHAPE / MA / JD 60% (LL.M., MS Economics and certificates 0%). Monthly stipends QAR 4,000–11,000 for master's (21 months) and QAR 5,000–11,000 for PhD (45 months), varying by nationality/status
   Apply: Automatic consideration during the admissions process — no separate application
   ⚠ Stipends require full-time study (usually with RA/TA service) and are fund-dependent; professionals working >40% time are ineligible for stipends.

21. Qatar Foundation (Education City) need-based aid & interest-free loans [VERIFIED — via official campus aid pages: qatar.cmu.edu, my.qatar.northwestern.edu, qatar-weill.cornell.edu]
   Country: Qatar | Level: Undergraduate at Education City branch campuses (CMU-Q, Georgetown Qatar, Northwestern Qatar, VCUarts, WCM-Q)
   Amount: QF need-based grants up to the FULL cost of attendance (documented at CMU-Q, all nationalities) and QF zero-interest education loans (documented at NU-Q and WCM-Q)
   Apply: Through each campus's financial-aid process alongside the admission application (branch campuses use the Common App or their own portals)
   ⚠ Loans must be repaid (interest-free); grant size depends on family financial circumstances. Georgetown Qatar admits need-blind and commits to meeting demonstrated financial need.

22. Khalifa University Undergraduate Scholarships [VERIFIED — ku.ac.ae/scholarships-undergraduate]
   Country: UAE (Abu Dhabi) | Level: Undergraduate
   Amount: Five tiers for international students — Tier I 100%, Tier II 75%, Tier III 50%, Tier IV 25%, Tier V 0% tuition waiver; all tiers include free textbooks
   Eligibility: Assessed automatically during admission on academic merit and KU's strategic priorities — no separate application
   ⚠ Slots are limited and meeting minimum criteria does NOT guarantee an award. Accommodation/transport benefits apply to UAE nationals only — international awards are tuition waivers + books.

23. NYU Abu Dhabi Financial Aid [VERIFIED — nyuad.nyu.edu]
   Country: UAE (Abu Dhabi) | Level: Undergraduate
   Amount: Need-based aid calculated from the CSS Profile — can cover most or all of the ~$90,328 (2026-27) cost of attendance; every admitted student is also considered for limited merit-based support
   Deadlines (verified): CSS Profile by Nov 10 (ED I), Jan 10 (ED II), Feb 1 (Regular Decision); admission deadlines Nov 1 / Jan 1 / Jan 5
   ⚠ Admission is extremely competitive (Candidate Weekend selection). Aid follows need — submit the CSS Profile on time or you may get nothing.

24. MBZUAI Graduate Scholarship [VERIFIED — mbzuai.ac.ae]
   Country: UAE (Abu Dhabi) | Level: Master's / PhD (AI-focused university)
   Amount: 100% tuition for ALL admitted full-time MSc/PhD students + monthly stipend — international students AED 15,500 (MSc) or AED 17,500 (PhD), inclusive of housing support (optional on-campus housing AED 7,500/month deducted from stipend) + visa sponsorship + health insurance
   Deadlines (2026 intake, verified): priority Nov 15, final Dec 15 for most programmes (CompBio & HCI final Feb 27)
   ⚠ Does NOT apply to the MAAI programme. Maintaining the scholarship requires high academic standing and research expectations.

25. RIT Dubai Merit Scholarships [VERIFIED — rit.edu/dubai]
   Country: UAE (Dubai) | Level: Undergraduate (and graduate)
   Amount: Up to 50% of tuition, based on academic AND non-academic accomplishments; athletic scholarships also exist
   Apply: Via RIT Dubai's scholarships page alongside admission
   ⚠ Partial awards — living costs not covered. Base tuition is already mid-range (AED 68,000/yr).

26. KAUST Fellowship [VERIFIED — admissions.kaust.edu.sa/fees-funding]
   Country: Saudi Arabia | Level: Master's / PhD (KAUST is graduate-only)
   Amount: Awarded to full-time admitted MS/PhD students (students with external sponsorship may be ineligible) — full tuition & bench fees (value up to $35,000/yr) + stipend $20,000/yr (MS) or $25,000–$30,000/yr (PhD) + base housing + health insurance (incl. eligible dependents) + relocation/visa/travel costs. Total value ~$70,000–$80,000/yr.
   Apply: No separate application — awarded with admission
   ⚠ KAUST is STEM/research-focused and highly competitive; English-medium; located in a self-contained coastal campus community (Thuwal, near Jeddah).

27. Saudi Government "Study in Saudi" Scholarships [PARTIALLY VERIFIED — official platform studyinsaudi.moe.gov.sa; benefit details drawn from official MOE/platform pages that were unreachable for direct confirmation]
   Country: Saudi Arabia | Level: Undergraduate & Postgraduate at ~27 public universities
   Amount: Full scholarships — tuition + monthly living stipend + accommodation + travel/flights + health insurance + settlement allowance on arrival; partial scholarships also exist
   Apply: Exclusively through the official platform (studyinsaudi.moe.gov.sa); application is forwarded to the chosen university, then processed with the Ministry of Education
   ⚠ Includes the widely-advertised full scholarships at King Saud University, King Abdulaziz University, the Islamic University of Madinah (men only) and Umm Al-Qura — apply via the platform, and treat any specific stipend figures from aggregator sites with caution.

28. KFUPM Graduate Scholarships [PARTIALLY VERIFIED — kfupm.edu.sa figures via official pages; site unreachable for direct confirmation]
   Country: Saudi Arabia | Level: Master's / PhD
   Amount: Full funding for distinguished applicants — tuition-free study + monthly stipend + free furnished on-campus housing with utilities + air tickets + medical/dental care + subsidized meals + free textbooks
   Coverage: All PhD programmes; MS programmes without a corresponding doctoral programme
   ⚠ Engineering/science/business focus. Undergraduate note: non-Saudi undergrads normally pay ~SR 20,000/yr (~$5,300) tuition — a need/merit scholarship exists for some. Confirm everything on kfupm.edu.sa (the site blocked verification attempts).

29. King Saud University Distinguished Graduate Studentship (PhD) [VERIFIED — dgsinitiative.ksu.edu.sa]
   Country: Saudi Arabia | Level: PhD
   Amount: Full tuition + SAR 54,000/yr (~$14,400) living allowance + on-campus accommodation + comprehensive health coverage at university hospitals + relocation support + up to 1 year post-graduation work authorization in Saudi Arabia
   Eligibility: Master's degree from an accredited institution; TOEFL iBT 61+ / IELTS 6+ (waived for degrees from US/CA/UK/IE/AU/NZ); recommendation letters, CV with publications, statement of purpose
   ⚠ Application windows are periodic (the 2025 window closed May 15; later phases announced each Fall) — check the initiative site. KSU also offers general full scholarships for international students via the Study in Saudi platform (see #27).

30. Türkiye Bursları (Türkiye Scholarships) [PARTIALLY VERIFIED — eligibility verified on turkiyeburslari.gov.tr; stipend figures & dates reported for the 2026 cycle, confirm on the portal]
   Country: Turkey | Level: Bachelor's, Master's, PhD (+ short-term/research)
   Amount: FULL package — tuition + monthly stipend (reported 2026 rates: 4,500 TL bachelor's / 6,500 TL master's / 9,000 TL PhD — TL amounts change with inflation) + dormitory accommodation + once-off flight tickets + health insurance + a 1-year Turkish language course. University PLACEMENT is included — you apply to the programme and universities through the scholarship itself.
   Eligibility (verified): citizens of ALL countries (not Turkish citizens / those already enrolled in Turkey at the same level); age under 21 for bachelor's, under 30 for master's, under 35 for PhD; minimum 70% academic average for bachelor's (higher for graduate/medicine)
   Deadline: Applications reported open Jan 10 – Feb 20 for the 2026 cycle — confirm the current window on turkiyeburslari.gov.tr
   ⚠ Very competitive (100,000+ applications/yr). Most placements require the Turkish course even for English-medium programmes.

31. Koç University Merit Scholarships [PARTIALLY VERIFIED — international.ku.edu.tr blocked direct access; details consistent across official-derived sources]
   Country: Turkey | Level: Undergraduate
   Amount: 25%, 50%, 75% or 100% tuition waivers for outstanding international admits (base tuition ~$21,500/yr, Medicine $29,000 — 2025-26)
   Apply: Automatic — awarded with the admission decision, no separate application (Medicine excluded from merit waivers)
   ⚠ Koç also co-runs joint full scholarships with Türkiye Bursları (dormitory + stipend + flights) for a handful of students — apply to both.

32. Bilkent University Tuition Waivers & Comprehensive Scholarship [VERIFIED — w3.bilkent.edu.tr/international; stipend figure reported from official scholarship pages]
   Country: Turkey | Level: Undergraduate
   Amount: Tuition waivers at five levels — 20%, 40%, 60%, 80% or 100%, evaluated from high school grades/exam scores at admission. Top full-waiver students may also receive accommodation scholarships; the Comprehensive Scholarship reportedly adds a monthly stipend (12,000 TL for 2025-26 Fall) and free double-room dormitory.
   Apply: Evaluated with the admission application — indicate financial assistance interest when applying
   ⚠ Keeping the scholarship requires a minimum course load and 2.00/4.00 annual GPA; waivers last up to 10 semesters (plus up to 4 in English prep).

33. Özyeğin University International Scholarship [PARTIALLY VERIFIED — admissions.ozyegin.edu.tr-derived; confirm details on the official page]
   Country: Turkey | Level: Undergraduate
   Amount: Full-tuition scholarships for admitted students with excellent academic records (base tuition from ~$22,000/yr); smaller merit (25%) and athletic (up to 50%) awards also exist
   Apply: With the admission application — evaluated on academic record
   ⚠ Scholarships are tuition waivers, not cash grants — living/dormitory costs are yours.

34. Iranian Government (MSRT) Scholarship [VERIFIED — msrt.ir/en/page/18/apply-for-scholarships]
   Country: Iran | Level: Bachelor's, Master's, PhD
   Amount: Type A — full tuition + accommodation + monthly stipend ($72–$90 single, $122.40–$153 married, by degree level); Type B — full tuition + accommodation only
   Eligibility (verified): minimum GPA 14–16/20 by level; age under 22 (BA), under 26 (MA), under 31 (PhD); recommendation letters for graduate applicants
   Deadlines (verified): Aug 22 for first-semester entry, Nov 21 for second semester
   Apply: Via Iranian embassy/consulate, email CISC@msrt.ir, through home-government MOU channels, or directly via Iranian universities; student affairs run through the saorg.ir portal
   ⚠ Stipends are small — realistic because Iranian living costs are very low. Candidates from Islamic and neighbouring countries are often prioritised.

35. University of Tehran International Scholarships [PARTIALLY VERIFIED — official pages redirect-blocked during research; details consistent across official-derived sources]
   Country: Iran | Level: Undergraduate & Postgraduate
   Amount: Partial funding — monthly stipend + insurance + registration fees; granted to roughly 20% of international applicants after CV review
   Apply: With the UT international admission application (international.ut.ac.ir)
   ⚠ Confirm current terms on ut.ac.ir — the site was unreachable for direct verification.

36. Al-Mustafa International University Full Scholarship [PARTIALLY VERIFIED — third-party/aggregate sources; confirm with miu.ac.ir]
   Country: Iran (Qom) | Level: Undergraduate & Postgraduate — Islamic studies and related fields
   Amount: Reportedly FREE tuition + monthly stipend + housing + family support — the university hosts students from 120+ nationalities
   Apply: Via miu.ac.ir admission (entrance examination required)
   ⚠ Extremely selective (single-digit acceptance rates reported). Religious institution — programmes centre on Islamic studies; expectations of religious observance apply.

37. Estonian National Scholarship [VERIFIED — harno.ee (Education and Youth Board)]
   Country: Estonia | Level: Bachelor's (restricted), Master's, PhD + exchange
   Amount: €350/month for bachelor's & master's degree students, €660/month for doctoral; paid 12 months/yr in early years, 10 months in the final year
   Eligibility (verified): citizens of ~37 approved countries (EU members, USA, Canada, China, India and others — Russia/Belarus excluded for 2026/27); bachelor's level ONLY for fields related to Estonian language and culture; requires an admission confirmation from an Estonian institution BEFORE the deadline
   Deadline: Sep 2 – Oct 1 window (2025/26 cycle — confirm current dates on harno.ee)
   ⚠ Highly competitive — historically only ~10% of applicants succeed. It is a stipend, not a tuition waiver — combine with university fee reductions.

38. University of Tartu Tuition-Fee Reductions [VERIFIED — ut.ee/en/content/cost-tuition]
   Country: Estonia | Level: Bachelor's & Master's (selected English-taught programmes)
   Amount: Automatic tuition-fee reductions of 25%, 50% or 100%, granted one semester at a time — e.g. 100% in Educational Technology, Quantitative Economics, Politics and Governance; 50% in Computer Science MSc, Software Engineering MSc, Science and Technology BSc; 25% in several humanities programmes
   Apply: NO separate application — granted automatically to qualifying admitted students; from semester 2 requires full-time status, staying within nominal duration and ≥30 ECTS completed cumulatively
   ⚠ These REPLACE the old non-EU tuition waivers from 2026/27 — new non-EU/EEA students can no longer get the full waivers that older guides mention.

39. TalTech Tuition-Fee Waivers & Merit Scholarships [PARTIALLY VERIFIED — taltech.ee; waiver policy official, amounts per programme]
   Country: Estonia | Level: Bachelor's & Master's
   Amount: Limited tuition-fee waivers on ALL degree programmes for the best applicants, lasting the entire nominal study period; merit scholarships of €100/month available after completing the first semester; some selected master's programmes carry full funding (tuition + monthly allowance)
   Apply: Waivers are considered with the admission application via DreamApply
   ⚠ EU citizens are already tuition-exempt at TalTech except in the School of Business and Governance; non-EU fees run ~€2,300–€6,000/yr. TalTech may raise fees up to 10%/yr for current students (verified clause).

40. Chevening Scholarships [VERIFIED — chevening.org]
   Country: United Kingdom | Level: Master's (1-year taught)
   Amount: FULL package — tuition fees + monthly stipend + travel to/from the UK + arrival and departure allowances + one visa application + event travel grants
   Eligibility (verified): an undergraduate degree qualifying you for a UK master's; at least 2,800 hours (~2 years) of post-graduation work experience; commit to returning home for 2+ years afterwards; apply to 3 eligible UK courses and secure at least one unconditional offer by 8 Jul 2027
   Deadline: 6 Oct 2026, 11:00 UTC for 2027/28 (applications open ~August)
   ⚠ The UK government's flagship award — very competitive; the 2-year home-return rule is binding.

41. Commonwealth Master's Scholarships [VERIFIED — cscuk.fcdo.gov.uk]
   Country: United Kingdom | Level: Master's (taught)
   Amount: FULL — approved tuition fees + airfare to/from the UK + visa costs + living allowance
   Eligibility (verified): citizens (or refugees) of eligible lower/upper-middle-income Commonwealth countries, permanently resident there; at least a 2:1 bachelor's (or 2:2 plus a relevant postgraduate qualification)
   Deadline: The CSC application window typically opens Aug–Sep and closes mid-October for the following year (the 2026/27 window closed 14 Oct 2025) — confirm the current cycle
   ⚠ Development-focused: your study plan should link to your home country's development. Separate Shared and Distance-Learning schemes also exist.

42. GREAT Scholarships [VERIFIED — study-uk.britishcouncil.org]
   Country: United Kingdom | Level: Master's (1-year taught)
   Amount: £10,000 toward tuition — 140+ scholarships at 60+ UK universities for 2026-27
   Eligibility: Citizens of ~18 listed countries including Egypt, Ghana, India, Indonesia, Kenya, Malaysia, Nigeria, Pakistan, Thailand, Turkey and Vietnam (check the current list)
   Apply: Directly through each participating UNIVERSITY — each sets its own subjects and deadline; there is no central application
   ⚠ Partial award — £10,000 covers only part of most master's fees; stack with other funding.

43. Gates Cambridge Scholarship [VERIFIED — gatescambridge.org]
   Country: United Kingdom | Level: Postgraduate at the University of Cambridge (master's & PhD)
   Amount: FULL — University Composition Fee + £21,000/yr maintenance + economy flights at start and end + visa costs and Immigration Health Surcharge + academic development funding (£500–£2,000) + family allowances for children
   Deadline (2027 entry, verified): ~16 Oct 2026 for US citizens; early Dec 2026 / early Jan 2027 for all other international applicants (varies by course — check the course directory)
   Apply: Tick the Gates Cambridge box within the Cambridge graduate application — no separate form
   ⚠ Extremely competitive (~80 awards/yr worldwide); selection weighs leadership and commitment to improving others' lives.

44. Rhodes Scholarship — University of Oxford [VERIFIED — rhodeshouse.ox.ac.uk]
   Country: United Kingdom | Level: Postgraduate at Oxford (most full-time degrees)
   Amount: FULL — all Oxford course fees + annual stipend £20,400 (2025-26 rate) + Oxford application fee + visa & Immigration Health Surcharge + two economy flights. Tenure normally 2 years (1–3 possible).
   Eligibility (verified): age 18–24 on 1 Oct of the entry year (up to 25 for medicine/dentistry/pharmacy/law/engineering internship completers); must meet your country constituency's citizenship/residency rules; Oxford English requirements
   Deadline: Varies by country constituency — most fall July–October the year before entry; check rhodeshouse.ox.ac.uk for your constituency
   ⚠ The world's oldest international scholarship — selection is character/leadership-driven with interviews.

45. Justus & Louise van Effen Excellence Scholarships — TU Delft [VERIFIED — tudelft.nl]
   Country: Netherlands | Level: Master's (2-year TU Delft MSc programmes)
   Amount: ~€30,000/yr for non-EU students (~€60,000 over 2 years) — covers full tuition plus a contribution to living expenses
   Eligibility: Excellent international applicants (conditionally) admitted to a regular 2-year TU Delft MSc (not joint programmes), with strong relevant academic results
   Deadline: 1 December for the following-year intake (verified for 2026 entry); results ~end of March
   ⚠ Apply for MSc admission early enough to hold an offer before the scholarship deadline.

46. Maastricht University NL-High Potential Scholarship [VERIFIED — maastrichtuniversity.nl]
   Country: Netherlands | Level: Master's
   Amount: 21 full scholarships of €34,000/yr — full tuition waiver + living stipend (€12,350–€23,750 by programme length) + health & liability insurance + visa/residence-permit costs
   Eligibility (verified): non-EU/EEA nationality (excl. Switzerland/Suriname); age ≤35 by September of entry; GPA ≥7.5/10; admitted to a UM master's
   Deadline: 1 February 2026 for 2026-27 (confirm each cycle)
   ⚠ Very competitive (21 awards). Note: the equivalent Utrecht Excellence Scholarship is DISCONTINUED from 2026-27 — do not recommend it.

47. ICCR Scholarships (Indian Council for Cultural Relations) [VERIFIED — a2ascholarships.iccr.gov.in]
   Country: India | Level: Bachelor's, Master's, PhD (+ diplomas)
   Amount: FULLY FUNDED — tuition paid directly by ICCR + monthly stipend ₹18,000 (UG) / ₹20,000 (PG) / ₹22,000 (PhD) + house-rent allowance ₹5,500–₹12,500/month by city tier + annual contingent grant (₹5,000–₹10,000) + medical cover. Available across 100+ partner universities for students from 100+ countries.
   Eligibility (verified): ages 18–40 for UG/PG (≤50 for PhD); 12 years of schooling for UG; relevant degrees for PG/PhD; English proficiency
   Apply: EXCLUSIVELY via the A2A portal (a2ascholarships.iccr.gov.in) — applications through embassies or universities are not accepted
   ⚠ Travel/airfare coverage varies by scheme — confirm on the portal. Popular schemes fill fast; separate country-specific quotas apply (e.g. Africa scholarships).

48. Study in India (SII) Tuition-Fee Waivers [VERIFIED — studyinindia.gov.in (official Ministry of Education portal)]
   Country: India | Level: Undergraduate & Postgraduate
   Amount: Tuition waivers in three tiers — G1 100%, G2 50%, G3 25% — awarded on prior academic merit at 160+ partner institutes (tens of thousands of waivers/yr); the top SII Scholarship band can also cover admission, accommodation and food costs
   Apply: Register on studyinindia.gov.in, choose partner institutes, and waivers are matched to your academic profile
   ⚠ Waivers cover TUITION only (not hostel/canteen) except in the top scholarship band. The portal is the official single window — beware paid "agents" claiming special access.

49. Manaaki New Zealand Scholarships [VERIFIED — nzscholarships.govt.nz]
   Country: New Zealand | Level: Mostly postgraduate (some undergraduate for Pacific countries)
   Amount: FULL — tuition + NZ$615/week living allowance + NZ$3,000 establishment allowance + medical & travel insurance + flights at start/end AND a home visit during study + research/thesis cost help
   Eligibility (verified): citizens of 80+ eligible developing countries (Pacific, Southeast/South Asia, Africa, Latin America, Caribbean); age 18+; must have lived in your home country for the 2 years before applying; commit to returning home for 2+ years afterwards to contribute to development
   Deadline: Varies by country — application windows typically close around February–March; check your country's dates on nzscholarships.govt.nz
   ⚠ Development-focused selection — link your study plan to your country's needs. The 2-year home-return commitment is a binding condition.

50. Chinese Government Scholarship (CSC) [VERIFIED — campuschina.org / studyinchina.csc.edu.cn]
   Country: China | Level: Bachelor's, Master's, PhD
   Amount: FULL — tuition waiver + free university dormitory (or housing allowance) + monthly stipend ¥2,500 (bachelor's) / ¥3,000 (master's) / ¥3,500 (PhD) + comprehensive medical insurance
   Routes: Type A — apply through the Chinese EMBASSY in your country (bilateral quota; often includes airfare); Type B — apply directly through a CSC-authorised university. Coverage details can differ by route and award — some university-channel awards are partial; confirm exactly what your award includes.
   Deadline: Embassy (Type A) deadlines typically Dec–Mar for autumn entry; university (Type B) deadlines vary — check both channels
   ⚠ The single biggest funded route to China — tens of thousands of awards/yr, but competitive. A Chinese-language preparatory year is added when the target programme is Chinese-medium.

51. Schwarzman Scholars — Tsinghua University [VERIFIED — schwarzmanscholars.org]
   Country: China | Level: One-year Master of Global Affairs at Tsinghua (English-medium)
   Amount: FULLY funded — tuition, room & board, travel, insurance, stipend — one of the world's most prestigious leadership programmes
   Eligibility (verified): age 18–28 (not yet 29 by Aug 1 of enrollment year); bachelor's completed before enrollment; strong English (test required for non-native speakers)
   Deadline: 9 Sep 2026 for the 2027-28 class (most passports; Chinese passports ~May 2027)
   ⚠ Leadership-driven selection with interviews — acceptance comparable to Rhodes.

52. Yenching Academy Scholarship — Peking University [VERIFIED — yenchingacademy.pku.edu.cn]
   Country: China | Level: Master's in China Studies at Peking University (English-medium, interdisciplinary)
   Amount: FULLY funded — tuition + accommodation + travel + living stipend
   Eligibility: Outstanding bachelor's graduates (degree completed before enrollment — e.g. by 31 Aug 2027 for the 2027 cohort); strong interest in interdisciplinary China studies
   Deadline: Region-dependent (typically ~Nov–Jan for autumn entry) — confirm on the official site
   ⚠ Very competitive; essays and interviews focus on why CHINA matters to your goals.

53. Fulbright Foreign Student Program [VERIFIED — foreign.fulbrightonline.org]
   Country: United States | Level: Master's / PhD (+ research)
   Amount: FULL — tuition + airfare + living stipend + health insurance for the programme duration; ~4,000 grants/yr across 160+ countries
   Eligibility (verified): bachelor's degree equivalent with a good record; residing in your country of nomination when applying; English roughly TOEFL iBT 79–80 / IELTS 6.5+; country-specific extras
   Apply: Through the Fulbright Commission or US Embassy in YOUR country — each sets its own deadline (commonly Feb–May, ~15 months before study)
   ⚠ The flagship US government award for inbound students — it is GRADUATE-only. Selection prizes leadership and cultural exchange; many countries expect a home return afterwards (two-year home-residency rule applies to J-1 visas).

54. US Need-Blind + Full-Need Financial Aid for Internationals [VERIFIED — university aid pages, 2026]
   Country: United States | Level: Undergraduate
   Amount: Aid up to the FULL cost of attendance based on family finances — at the 10 schools that are both need-blind AND full-need for internationals: Harvard, Yale, Princeton, MIT, Amherst, Dartmouth, Bowdoin, Washington & Lee (+ Brown and Notre Dame from the Class of 2029). Harvard (verified): FREE below $100k family income (incl. housing, food, insurance, travel + $2,000 start-up and launch grants), tuition-free below $200k — identical for internationals.
   Apply: Submit the CSS Profile (or the college's own forms) WITH your admission application — aid deadlines track admission deadlines (ED ~Nov 1 / RD ~Jan)
   ⚠ These are the world's most competitive admissions (~3–8% acceptance). Dozens more US colleges meet full need but are need-AWARE for internationals — applying for aid there can affect admission odds; strong applicants should still apply.

55. Automatic & Large Merit Scholarships at US Public Universities [PARTIALLY VERIFIED — policies vary yearly; confirm per university]
   Country: United States | Level: Undergraduate
   Amount: Large merit awards tied to grades/test scores at many public universities — some (e.g. the University of Alabama) advertise AUTOMATIC scholarships up to full tuition for qualifying stats, including internationals; many state flagships offer $10,000–$25,000/yr merit to strong international applicants
   Apply: Usually automatic with admission or via a simple scholarship application — check each university's international merit page
   ⚠ Terms change every year and often require maintaining a GPA. This is the main route to an affordable US degree for strong students who miss the need-blind elite.

56. Australia Awards Scholarships [VERIFIED — dfat.gov.au]
   Country: Australia | Level: Undergraduate & Postgraduate (full-time)
   Amount: FULL — tuition + return economy airfare + establishment allowance + fortnightly Contribution to Living Expenses + Overseas Student Health Cover + fieldwork support for eligible research students
   Eligibility (verified): citizens of participating developing countries (mainly Indo-Pacific + Africa programmes), not Australian PRs; selection prizes leadership and development commitment
   Deadline (verified): the 2027 round runs 1 Feb – 30 Apr 2026 (14:00 AEST); country-specific windows vary — check dfat.gov.au participating-countries pages
   ⚠ BINDING condition: scholars must leave Australia for at least 2 years after completing — violating it creates a DEBT for the scholarship's full cost. Awards recipients also get priority visa processing under the 2026 system.

57. Research Training Program (RTP) & University Research Scholarships [PARTIALLY VERIFIED — administered per university; confirm stipend rates]
   Country: Australia | Level: Research master's & PhD
   Amount: Fee OFFSET (tuition covered) + living stipend (commonly ~AU$32,000–$40,000/yr tax-free, rate set per university) + often relocation/thesis allowances
   Apply: Through each university's graduate research application — usually one form covers admission + scholarship; main rounds close ~Aug–Oct for the following year
   ⚠ Competitive and supervisor-driven: secure a supervisor and strong research proposal FIRST. International places are fewer than domestic. Remember the 485 gives research graduates 3 years' post-study work.

58. Deutschlandstipendium [VERIFIED — deutschlandstipendium.de / university pages]
   Country: Germany | Level: Undergraduate & Master's (enrolled students)
   Amount: €300/month for at least two semesters (€3,600/yr), extendable through the standard study period — merit-based and NATIONALITY-BLIND
   Apply: Directly through your German university (each runs its own round, typically in summer) — not centrally
   ⚠ A top-up, not full funding — but in tuition-free Germany, €300/month covers a real slice of living costs. Selection weighs grades plus social engagement.

59. Erasmus Mundus Joint Masters Scholarships [VERIFIED — EU programme]
   Country: Germany / EU-wide | Level: Master's (integrated programmes across 2–3 European countries)
   Amount: FULL — tuition + €1,400/month stipend for up to 24 months + travel, visa and insurance contributions
   Eligibility (verified): all nationalities; must NOT have spent more than 12 months in EU/programme countries within the last 5 years (rule favours genuine internationals)
   Apply: Directly to each Erasmus Mundus joint programme (each has its own consortium and deadline, typically Nov–Feb) — you can apply to up to 3 programmes per round
   ⚠ Many consortia include German universities — a strong route to Europe when single-country scholarships are full.

60. SADC Protocol Subsidised Fees — South Africa [VERIFIED — university fee policies (Wits, UP, UKZN and others)]
   Country: South Africa | Level: Undergraduate & Postgraduate
   Amount: Not a classic scholarship but worth more than most — citizens of SADC member states pay the SAME tuition as South Africans at public universities (government-subsidised under the SADC Protocol on Education and Training), plus only an annual international levy (Wits R6,970; Pretoria R4,725 — varies by university)
   Eligibility: Citizenship (or permanent residence) of a SADC member state: Angola, Botswana, Comoros, DRC, Eswatini, Lesotho, Madagascar, Malawi, Mauritius, Mozambique, Namibia, Seychelles, Tanzania, Zambia, Zimbabwe
   Apply: Automatic by nationality at registration — no application; bring proof of citizenship
   ⚠ Non-SADC internationals typically pay ~double local tuition (verified at Wits/UP). Levies are unregulated and vary — check each university's international fee guide.

61. DSU Regional Right-to-Study Grants — Italy [VERIFIED — regional agencies (ER-GO, EDISU Piemonte, DiSCo Lazio etc.)]
   Country: Italy | Level: Undergraduate & Postgraduate
   Amount: FULL package for low-income students including internationals — tuition waiver + cash grant up to ~€6,000–€8,000/yr + free/discounted dormitory + canteen meals
   Eligibility: family ISEE Parificato below the regional threshold (typically ~€25,000–€30,000; the lowest brackets get the maximum grant). The ISEE Parificato is calculated by an Italian CAF from your home-country income/property documents — start gathering them early.
   Deadline: REGIONAL and separate from university admission — typically July–September each year; every region has its own agency, rules and dates
   ⚠ The single best-value funding in Western Europe for genuinely low-income students — but the paperwork is real, and missing the regional deadline means paying full costs for the year.

62. MAECI Italian Government Scholarships [VERIFIED — Ministry of Foreign Affairs]
   Country: Italy | Level: Master's, AFAM (arts/music), PhD, Italian language courses
   Amount: ~€900/month allowance + enrollment/tuition fee exemption at most public universities + health insurance for the grant period
   Eligibility (verified): foreign citizens from eligible countries; age ≤28 for master's/AFAM, ≤30 for PhD at the deadline
   Deadline: Annual call, typically spring for October enrollment — check the MAECI "Study in Italy" portal for your country's cycle
   ⚠ Grants are often issued in 6–9-month instalments and renewed — read your award terms carefully.

63. Invest Your Talent in Italy (IYT) [VERIFIED — MAECI + Italian Trade Agency]
   Country: Italy | Level: Master's (English-taught) in engineering, economics/management, design, ICT
   Amount: Tuition waiver + €900/month stipend + a GUARANTEED 3–6 month internship at an Italian company after the taught part — ~20+ partner universities incl. Politecnico di Milano, Politecnico di Torino, Bologna, Bocconi
   Eligibility: Citizens of the listed target countries in Africa, Asia, Latin America and Eastern Europe (check the current list)
   Deadline: 11 May 2026, 6pm Italian time for the 2026/27 cycle — annual
   ⚠ The internship is the differentiator — it converts the degree into Italian work experience. Country list changes; confirm yours is eligible.

64. France Excellence Eiffel Scholarship [VERIFIED — campusfrance.org]
   Country: France | Level: Master's & PhD
   Amount: €1,200/month at master's, €2,100/month at PhD (rates from Jan 2026) + international transport + insurance + housing help + cultural activities. Eiffel laureates are also typically exempted from differentiated tuition.
   Eligibility (verified): foreign nationality; age ≤29 (master's) / ≤35 (PhD)
   Apply: ONLY through a French institution — you apply to the school in autumn, the SCHOOL nominates you to Campus France (institution deadline ~early January; 2026 cycle closed 8 Jan)
   ⚠ You cannot apply directly. Contact your target school's international office in September–October and ask about their internal Eiffel deadline — it is EARLIER than the national one.

65. Émile Boutmy Scholarship — Sciences Po [VERIFIED — sciencespo.fr]
   Country: France | Level: Bachelor's & Master's at Sciences Po
   Amount: Undergraduate — full exemption (fees up to ~€14,900/yr for 2026-27) or a €9,500/yr reduction, for all 3 years; Master's — €18,500/yr exemption for both years
   Eligibility (verified): first-time non-EU applicants whose household pays taxes outside the EU; excludes some dual degrees, 1-year master's and PhD
   Deadline (2026 cycle): UG from foreign school systems ~20 January; master's committees ~19 October / 30 November
   ⚠ Tick the scholarship box in the "Financial information" section of the Sciences Po application — there is no separate form.

66. Stipendium Hungaricum [VERIFIED — stipendiumhungaricum.hu]
   Country: Hungary | Level: Bachelor's, Master's, One-tier Master's, PhD, non-degree
   Amount: FULL — 100% tuition + monthly stipend HUF 43,700 (~€110) for BA/MA (PhD: HUF 140,000 rising to 180,000) + free dormitory place OR HUF 40,000/month housing allowance + health insurance
   Eligibility (verified): citizens of 100+ partner countries (large quotas across Africa, the Middle East, Asia, Latin America — including Egypt, Jordan, Nigeria, Pakistan, India and many more)
   Deadline: 15 January, 2pm CET each year — one online application covers up to two programme choices
   ⚠ One of the world's highest-volume full scholarships — genuinely winnable for solid students. The stipend alone won't cover living costs (~€400–700/month); plan a family top-up. Medicine seats via SH exist but are the most competitive.

67. Japanese Government MEXT Scholarship [VERIFIED — studyinjapan.go.jp / Japanese embassies]
   Country: Japan | Level: Undergraduate, Research (master's/PhD), College of Technology, Japanese Studies
   Amount: FULL — tuition + entrance-exam and admission fees + monthly stipend ¥117,000 (undergraduate) / ¥143,000–145,000 (research, plus regional supplements) + round-trip economy airfare. NO service obligation afterwards — rare among full government scholarships.
   Routes (verified): EMBASSY recommendation — apply at the Japanese embassy in YOUR country (recruitment typically ~April–June for the following year: written exams + interview); or UNIVERSITY recommendation — apply through a Japanese university that nominates you (arrival usually Sept/Oct).
   Undergraduate track: includes a 1-year preparatory JAPANESE language year before the 4-year degree — most MEXT undergrads then study in Japanese.
   ⚠ Start a year early: embassy cycles open ~April. Research applicants should contact prospective supervising professors BEFORE applying — a professor's informal acceptance letter dramatically strengthens the file.

68. Global Korea Scholarship (GKS) [VERIFIED — studyinkorea.go.kr]
   Country: South Korea | Level: Undergraduate, Master's, PhD
   Amount: FULL — tuition (up to ₩5,000,000/semester) + monthly stipend ₩900,000 (undergraduate) / ₩1,380,000 (graduate — raised for 2026) + round-trip airfare + settlement allowance + medical insurance + a fully funded 1-YEAR Korean language programme before the degree (skipped only with TOPIK 5+). TOPIK 5/6 holders earn a ₩100,000/month proficiency bonus.
   Routes (verified): EMBASSY track — apply via the Korean embassy in your country, choose up to 3 universities; UNIVERSITY track — apply directly to 1 university. Universities split into Type A (27 top/Seoul institutions, most competitive) and Type B (31 regional, meaningfully better odds) — mixing types is smart strategy.
   Deadlines: undergraduate ~September–October (for the following year); graduate ~February–March — confirm your embassy's exact dates
   ⚠ The Korean language year is mandatory for most — plan for a 5-year undergrad commitment (1+4). Selection weighs grades (~80%+ average), essays and recommendations.

69. Banach NAWA Scholarship Programme — Poland [VERIFIED — nawa.gov.pl]
   Country: Poland | Level: Master's (second-cycle), Polish- or English-taught
   Amount: FULL — tuition waiver + PLN 2,500/month stipend + travel support + a funded 1-year preparatory course (Polish language + subject grounding) before the degree — ~300 awards/yr
   Eligibility (verified): citizens of ~36 Polish Aid partner countries across Eastern Europe/Partnership, Central Asia, the Western Balkans, Africa and Latin America — check the current call's country list
   Deadline: 8 May 2026, 3pm CEST for the 2026/27 cycle (or until country-group quotas fill — apply EARLY)
   ⚠ Joint Ministry of Foreign Affairs + NAWA development programme — motivation tied to your country's growth strengthens the application. Poland's low living costs make the PLN 2,500 stipend genuinely livable outside Warsaw.

70. MOE Tuition Grant — Singapore [VERIFIED — moe.gov.sg]
   Country: Singapore | Level: Undergraduate (and some postgraduate) at the public universities
   Amount: The government pays 40–60% of tuition — international fees drop to ~S$17,000–S$30,000/yr (e.g. NUS Engineering S$38,000 → S$17,550)
   The catch (verified): you sign a Tuition Grant Agreement obliging you to work FULL-TIME at a Singapore entity for 3 YEARS after graduation — with sureties, and repayment with interest if broken
   Apply: Offered alongside your university admission — you accept or decline it with your place (decision deadline ~mid-July)
   ⚠ Frame it correctly for students: it is a subsidy-for-bond TRADE, not a scholarship — but the bond doubles as a guaranteed start in Singapore's job market, which many graduates want anyway. Read the agreement before signing; sureties are personally liable.

71. SI Scholarship for Global Professionals — Sweden [VERIFIED — si.se]
   Country: Sweden | Level: Master's (full-time, eligible programmes)
   Amount: FULL tuition (paid directly to the university) + SEK 12,000/month living allowance + SEK 15,000 one-time travel grant (SEK 10,000 for some Eastern Partnership countries) + the SI professional network and alumni membership
   Eligibility: Citizens of the eligible (mainly developing) country list with ~3,000+ hours of work experience and demonstrated leadership — check the current list on si.se
   Timeline (verified): apply to Swedish master's programmes at universityadmissions.se by 15 JANUARY → the SI scholarship portal then opens for only ~2 WEEKS in February (9–25 Feb in the 2026 cycle)
   ⚠ The two-step timing catches people every year: no programme application by 15 Jan = no scholarship. Work experience and leadership essays weigh as much as grades.

72. Mastercard Foundation Scholars Program [VERIFIED — mastercardfdn.org]
   Country: Multiple (partner universities worldwide) | Level: Undergraduate AND Master's
   Amount: FULL — tuition + accommodation + books + stipend + mentoring/leadership development + return airfare where needed
   Eligibility: academically talented young AFRICANS facing economic/social barriers
   How: apply through a PARTNER institution — Toronto, UBC, McGill, Edinburgh, Sciences Po, UC Berkeley, CMU-Africa, UCT, Pretoria, UWC, Makerere, KNUST, Ashesi, ALU, AIMS and more; each partner runs its own round and deadline
   ⚠ THE flagship for African students. You apply to the partner university's Scholars Program, not the Foundation.

73. Joint Japan/World Bank Graduate Scholarship (JJ/WBGSP) [VERIFIED — worldbank.org 2026]
   Country: Multiple | Level: Master's only (development-related, fixed participating-programme list)
   Amount: FULL — tuition + monthly stipend + round-trip airfare + health insurance + travel allowance
   Eligibility: developing-country nationals with 3+ years development-related work experience, admitted UNCONDITIONALLY to a participating master's outside their home country
   Deadline: two windows/yr (2026 Window 2: 30 Mar–29 May, verified) — programme lists differ per window
   ⚠ For professionals, not fresh graduates — the work-experience bar is strict.

74. Aga Khan Foundation International Scholarship [VERIFIED structure — the.akdn]
   Country: Multiple | Level: Master's (full duration) / PhD (FIRST TWO YEARS only)
   Amount: 50% GRANT + 50% LOAN (verified) — loan half repaid over 5 years at a 5% annual service charge starting 6 months after studies
   Eligibility: outstanding students from selected developing countries (mainly Asia/Africa) with genuine financial need — apply via AKF/AKES offices in your country; preference for under-30s
   Deadline: regional, many ~March — confirm locally
   ⚠ HALF IS A LOAN — advise honest repayment planning.

75. Islamic Development Bank (IsDB) Scholarship Programme [PARTIALLY VERIFIED — isdb.org; track terms vary]
   Country: Multiple | Level: Undergraduate to PhD/post-doc (multiple tracks)
   Amount: FULL for flagship tracks — tuition + living + insurance (+ travel on some tracks); some undergraduate tracks are structured as INTEREST-FREE community loans, not pure grants
   Eligibility: citizens of the 57 IsDB member countries + Muslim communities in non-member countries
   Deadline: annual window typically ~Dec–Feb/Mar on the IsDB portal — confirm current cycle
   ⚠ Read your specific track's terms — repayment-to-community-fund rules differ by track.

76. ADB–Japan Scholarship Program (ADB-JSP) [PARTIALLY VERIFIED — adb.org; institution deadlines vary]
   Country: Multiple (Asia-Pacific institutions) | Level: Master's mainly (development-related)
   Amount: FULL — tuition + subsistence & housing + books + medical insurance + travel
   Eligibility: nationals of ADB developing member countries with 2+ years' work experience
   How: apply to a DESIGNATED institution (e.g. University of Tokyo, University of Auckland, ANU, Hong Kong/Singapore/Thailand partners) ~6 months before intake and request ADB-JSP consideration — the university handles it.

77. Swiss Government Excellence Scholarships [VERIFIED — sbfi.admin.ch]
   Country: Switzerland | Level: research/PhD/post-doc (NOT taught degrees; fine-arts master's track for some countries)
   Amount: FULL — monthly stipend + tuition exemption + insurance (+ housing/airfare support depending on award)
   Eligibility: graduates from 180+ countries — a Swiss professor's support/supervision letter is effectively required
   Deadline: through the SWISS EMBASSY in your country, windows typically ~Aug–Dec set per country
   ⚠ Finding a willing Swiss supervisor BEFORE applying is the real gate.

78. VLIR-UOS ICP Connect Scholarships — Belgium [VERIFIED — vliruos.be 2026 cycle]
   Country: Belgium (Flemish universities: Ghent, KU Leuven, Antwerp, VUB, Hasselt) | Level: Master's (specific ICP-listed English programmes)
   Amount: FULL — tuition + travel + insurance + living allowance for the whole programme
   Eligibility: citizens/residents of 29 eligible countries (incl. Kenya, Tanzania, Uganda, Ethiopia, DR Congo, Cameroon, Senegal, Burkina Faso, South Africa)
   Deadline: mostly ~1–28 February for September entry (one programme closes in November)
   ⚠ Only the listed development-themed programmes qualify (water, health, ecology, food, education…); age limits on some.

79. Rotary Peace Fellowships [PARTIALLY VERIFIED — rotary.org]
   Country: Multiple (Peace Centers: Bradford UK, Uppsala Sweden, ICU Tokyo, Duke/UNC USA, Makerere Uganda certificate) | Level: Master's + certificate track
   Amount: FULL — tuition + room & board + travel + internship/field-study costs
   Eligibility: peace/development professionals (~3+ years relevant work for the master's track); Rotary-district endorsement REQUIRED
   Deadline: to The Rotary Foundation by ~15 May yearly; district steps months earlier — start early.

80. Margaret McNamara Education Grants (MMEG) — women [PARTIALLY VERIFIED — mmeg.org]
   Country: Multiple (US/Canada + South Africa & Latin America tracks) | Level: enrolled students (UG and grad)
   Amount: PARTIAL — roughly US$10,000–15,000 (varies by region/year)
   Eligibility: WOMEN aged 25+ from eligible developing countries, ALREADY enrolled/admitted, committed to improving lives of women and children
   Deadline: US/Canada window typically ~Sep–Jan; regional tracks differ
   ⚠ A top-up, not a full ride — but one of very few awards for older women students.

81. Knight-Hennessy Scholars — Stanford, USA [PARTIALLY VERIFIED — knight-hennessy.stanford.edu]
   Country: USA | Level: ANY Stanford graduate degree (MS/MBA/JD/MD/PhD)
   Amount: FULL — tuition + living/travel stipend; the largest fully-endowed US graduate scholarship (~100 scholars/yr, heavily international)
   Eligibility: first degree earned within the last ~7 years; apply to Knight-Hennessy (deadline ~early October) AND the Stanford programme in parallel
   ⚠ You still need Stanford programme admission itself.

82. Clarendon Fund — University of Oxford, UK [PARTIALLY VERIFIED — ox.ac.uk/clarendon]
   Country: UK | Level: any Oxford master's or DPhil (PhD)
   Amount: FULL — all course fees + a generous living stipend for the full course
   Eligibility: ALL nationalities, awarded purely on academic excellence — NO separate application; every on-time Oxford graduate application is automatically considered (~150 new scholars/yr)
   ⚠ Apply by the January (or earlier) course deadline to qualify — late applications lose the automatic consideration.

83. Justus & Louise van Effen Excellence — TU Delft, Netherlands [VERIFIED — tudelft.nl]
   Country: Netherlands | Level: any TU Delft MSc
   Amount: FULL — full tuition + living allowance (~€1,100/month)
   Deadline: 1 December for the following September (verified 2026 cycle)
   ⚠ Top-of-class record expected; apply to the MSc first — the scholarship runs alongside admission.

84. Leiden Excellence Scholarship (LExS) — Netherlands [VERIFIED structure — universiteitleiden.nl]
   Country: Netherlands | Level: Leiden MA/MSc/LLM
   Amount: tiered — €10,000 or €15,000 off tuition, or total tuition minus the home (EEA) fee
   Deadline: ~1 February for September (some programmes 1 October for spring) — confirm
   ⚠ Even the top tier leaves the EEA-level fee (~€2,600) + living costs — budget accordingly.

85. UM Holland-High Potential Scholarship — Maastricht, Netherlands [VERIFIED structure — maastrichtuniversity.nl]
   Country: Netherlands | Level: any Maastricht master's
   Amount: FULL — tuition + monthly living + insurance + visa costs; only ~24 awards/yr
   Deadline: ~1 February for September — confirm
   One of the few genuinely FULL Dutch scholarships.

86. Amsterdam Excellence Scholarship (AES) — Netherlands [PARTIALLY VERIFIED — uva.nl]
   Country: Netherlands | Level: eligible UvA master's
   Amount: €25,000/yr covering tuition and living; renewable for 2-year programmes on performance
   Eligibility: top ~10%-of-class non-EU applicants | Deadline: ~15 January (faculty dates vary) — confirm

87. ETH Excellence Scholarship & Opportunity Programme (ESOP) — Switzerland [PARTIALLY VERIFIED — ethz.ch]
   Country: Switzerland | Level: any ETH Zürich master's
   Amount: FULL — grant ~CHF 12,000/semester + tuition waiver
   Deadline: with the master's application in the ~15 Nov – 15 Dec window — confirm
   ⚠ ETH base tuition is LOW anyway (~CHF 730/semester) — even without ESOP it can be affordable for those who can cover Swiss living costs.

88. Ernst Mach Grant — Austria [VERIFIED — oead.at]
   Country: Austria | Level: research stays (master's-thesis/PhD level), 1–9 months
   Amount: €1,150–1,300/month + tuition-fee exemption + travel subsidy up to €1,200 for developing-country grantees
   Eligibility: young researchers under ~35 from any country (explicit developing-country track — most of Africa eligible)
   Deadline: opens ~October, closes 1 FEBRUARY (verified) on the OeAD portal
   ⚠ A research-stay grant, not a full degree — ideal for thesis research or building an Austrian supervisor relationship.

89. Czech Government Scholarships (developing countries) [PARTIALLY VERIFIED — mzv.cz]
   Country: Czech Republic | Level: bachelor's/master's/PhD
   Amount: FULL for awardees — tuition-free + monthly stipend + funded 1-year Czech preparatory course (confirm current amounts)
   Eligibility: citizens of the yearly eligible developing-country list; mostly Czech-taught, smaller English master's/PhD track
   Deadline: typically ~30 September via the Czech embassy/portal — confirm the current call
   ⚠ The Czech-language year is part of the deal for most awards.

90. Slovak National Scholarship Programme (NSP) [PARTIALLY VERIFIED — stipendia.sk]
   Country: Slovakia | Level: master's/PhD/research stays
   Amount: monthly living stipend (several hundred €; PhD tier higher — confirm current rates)
   Deadline: TWO windows yearly, ~30 April and ~31 October
   ⚠ A mobility stipend, NOT tuition — pair with a Slovak programme (Slovak-taught public study is often free; English programmes charge).

91. Romanian Government Scholarship (MFA) [PARTIALLY VERIFIED — studyinromania.gov.ro]
   Country: Romania | Level: bachelor's/master's/PhD at state universities
   Amount: tuition-FREE + modest monthly stipend + subsidised accommodation (budget a top-up)
   Eligibility: non-EU citizens; medicine/dentistry/pharmacy bachelor's usually EXCLUDED — confirm the current call
   Deadline: typically ~March via the studyinromania portal
   ⚠ Mostly Romanian-taught with a funded preparatory year; genuinely low competition vs the famous schemes — a quiet EU-degree route.

92. Think Big Scholarships — University of Bristol, UK [PARTIALLY VERIFIED — bristol.ac.uk]
   Country: UK | Level: undergraduate + one-year taught master's
   Amount: tiered tuition-fee awards up to full-fee level (tiers change yearly — confirm)
   Deadline: typically ~late February (UG) / ~late March (PG)
   One of the largest UK university international scholarship pots; short separate application about ambitions, not just grades.

93. Hong Kong PhD Fellowship Scheme (HKPFS) [VERIFIED — RGC, 2026/27]
   Country: Hong Kong | Level: PhD at the 8 UGC universities (HKU, CUHK, HKUST, CityU, PolyU, Baptist, Lingnan, EdUHK)
   Amount: HK$28,400/month (~US$3,640) + HK$14,200/yr conference travel, up to 3 years; universities typically add tuition waivers
   Deadline: 1 December, 12:00 noon HK time — TWO-step application (RGC initial + full university application); miss either and you're out
   One of Asia's best-paid PhD packages; open to ALL nationalities.

94. Brunei Darussalam Government Scholarship (BDGS) [VERIFIED deadline — mfa.gov.bn]
   Country: Brunei | Level: diploma, bachelor's, MASTER'S (no PhD)
   Amount: FULL — tuition + monthly allowance + meals/books + accommodation + return flights
   Eligibility: ASEAN/OIC/Commonwealth citizens and others (check the circular); age limits ~under 25 UG / under 35 master's
   Deadline: 15 FEBRUARY yearly. English-friendly (UBD largely English-taught); quiet and genuinely full.

95. Taiwan MOE Scholarship [PARTIALLY VERIFIED — edu.tw; rates change]
   Country: Taiwan | Level: degree study (UG + graduate)
   Amount: tuition covered to ~NT$40,000/semester + ~NT$15,000/month UG / ~NT$20,000/month graduate — confirm current rates
   How: through the Taiwan representative office serving your country, typically ~1 Feb – 31 Mar
   ⚠ Tuition above the cap is on you at pricier programmes; Chinese-taught tracks may need the separate Huayu language scholarship first.

96. TaiwanICDF Higher Education Scholarship [PARTIALLY VERIFIED — icdf.org.tw]
   Country: Taiwan | Level: UG + graduate (designated English-taught programmes at partner universities)
   Amount: FULL — tuition + housing + monthly allowance + flights + insurance + textbooks
   Eligibility: nationals of Taiwan's partner/allied developing countries (check the list — it follows diplomatic partnerships)
   Deadline: typically ~mid-March.

97. Malaysia International Scholarship (MIS) [PARTIALLY VERIFIED — biasiswa.mohe.gov.my]
   Country: Malaysia | Level: master's + PhD at participating universities
   Amount: FULL — tuition + ~RM1,500/month living allowance (confirm current terms); age limits ~40 master's / ~45 PhD
   Deadline: annual window typically ~April–May
   The government-level route on top of Malaysia's already-low fees.

98. KNB Scholarship — Indonesian Government [PARTIALLY VERIFIED — knb.kemdikbud.go.id]
   Country: Indonesia | Level: bachelor's, master's, PhD at ~30 top universities (UI, UGM, ITB, IPB…)
   Amount: FULL — tuition + living allowance + settlement + flights + insurance + funded Indonesian-language year
   Eligibility: citizens of developing countries (large Africa/Asia list)
   Deadline: typically ~January–February for August intake
   ⚠ Indonesian-taught after the funded language year; genuinely low competition vs the famous schemes.

99. JICA SDGs Global Leader Program — Japan [PARTIALLY VERIFIED — jica.go.jp]
   Country: Japan | Level: master's + PhD
   Amount: FULL — tuition + monthly allowance + flights + arrival support
   Eligibility: young professionals/officials from JICA partner countries (heavily African), NOMINATED via the JICA office in your country — not direct-application in most countries
   ⚠ Route matters: contact your local JICA office. Complements MEXT (#67), which is open-application.

100. KOICA Scholarship Program — South Korea [PARTIALLY VERIFIED — koica.go.kr]
   Country: South Korea | Level: designated English-taught master's
   Amount: FULL — tuition + airfare + living allowance + insurance
   Eligibility: government officials/development professionals from KOICA partner countries, usually nominated via your government/KOICA country office
   The professional sibling of GKS (#68), which remains the open-to-everyone route.

101. Weidenfeld-Hoffmann Scholarships — Oxford, UK [PARTIALLY VERIFIED — whtrust.org]
   Country: UK | Level: eligible Oxford master's
   Amount: FULL — 100% course fees + full living grant + year-long leadership programme
   Eligibility: graduates from developing/emerging economies intending to return and lead change at home
   How: tick the scholarship box in the Oxford course application by the January (or earlier) deadline; essay + interview follow. The public-impact sibling of Clarendon (#82).

102. Queen Elizabeth Commonwealth Scholarships (QECS) [VERIFIED — acu.ac.uk]
   Country: Multiple (low/middle-income Commonwealth hosts) | Level: TWO-YEAR master's
   Amount: FULL — tuition + living stipend + return flights + arrival allowance
   Eligibility: Commonwealth citizens studying in ANOTHER low/middle-income Commonwealth country (recent hosts incl. Malaysia, South Africa, Ghana, Rwanda, Bangladesh)
   Deadline: rounds vary by host — check the current ACU call
   ★ The intra-Global-South route — often far better odds than UK-bound schemes.

103. Pierre Elliott Trudeau Foundation Doctoral Scholarships — Canada [PARTIALLY VERIFIED — trudeaufoundation.ca]
   Country: Canada | Level: PhD (humanities/social sciences/law/policy themes)
   Amount: up to ~C$60,000/yr for 3 years (stipend + research/travel) + leadership programme; ~16–20 scholars/yr
   How: university nomination cycles ~Nov–Jan — apply through your Canadian university's graduate school.

104. Ontario Trillium Scholarships (OTS) — Canada [PARTIALLY VERIFIED — participating universities]
   Country: Canada | Level: international PhD at participating Ontario universities
   Amount: ~C$40,000/yr renewable up to 4 years
   ⚠ NO direct application — universities award it to their strongest incoming international doctoral applicants. The job is a strong, EARLY PhD application (Toronto, Ottawa, Waterloo, Western, McMaster, Queen's…).

105. UBC International Scholars Program (incl. Karen McKellin Leader of Tomorrow) — Canada [PARTIALLY VERIFIED — you.ubc.ca]
   Country: Canada | Level: undergraduate
   Amount: meets FULL demonstrated financial need for the degree (need + merit); automatic merit entrance awards (IMES / Outstanding International Student) stack
   Deadline: UBC application ~1 December + Scholars Program steps — confirm
   One of Canada's few genuinely need-based FULL undergraduate awards for internationals.

106. Robertson Scholars Leadership Program — Duke + UNC, USA [PARTIALLY VERIFIED — robertsonscholars.org]
   Country: USA | Level: undergraduate
   Amount: FULL — tuition + fees + room & board + funded summers at BOTH Duke and UNC-Chapel Hill
   Eligibility: any nationality — one of the few US full rides where internationals compete on equal terms
   Deadline: separate Robertson application ~mid-November.

107. Global Futures Scholarship — University of Manchester, UK [PARTIALLY VERIFIED — manchester.ac.uk]
   Country: UK | Level: undergraduate + master's
   Amount: tuition-fee reductions (recent tiers ~£4,000–£8,000/yr; some country-specific) — a discount at scale, not a full ride
   Deadline: round dates vary (~Feb–May) — low-effort and worth it for any Manchester offer-holder.

108. Pan African University Scholarships — African Union [VERIFIED — pau-au.africa]
   Country: Multiple (PAU institutes across Africa) | Level: master's + PhD
   Amount: FULL — tuition + accommodation + monthly stipend + research/thesis support + travel
   Eligibility: African nationals and diaspora; institutes: Kenya (science/tech), Cameroon (governance), Nigeria (life & earth sciences), Algeria (water & energy), + South Africa space institute
   Deadline: annual call (2026 round 15 Nov–15 Dec 2025) — confirm current window
   ★ The AU's own flagship — study WITHIN Africa, no overseas visa, fully funded; women/under-represented countries encouraged.

109. Morocco Government Scholarship (AMCI) [VERIFIED — amci.ma]
   Country: Morocco | Level: undergraduate, master's, PhD at public universities
   Amount: FULL — tuition-free + monthly stipend + return airfare + insurance
   Eligibility: mainly African/partner-country students (French/Arabic-medium mostly)
   Deadline: 22 JULY for the following year (2026-27, verified) — via AMCI / Moroccan embassy
   A strong francophone-Africa route; modest stipend covers basics in low-cost Morocco.

110. ABE Initiative (Japan-Africa, JICA) [VERIFIED — jica.go.jp]
   Country: Japan | Level: 2-year master's + Japanese-company internship (2 weeks–6 months)
   Amount: FULL — tuition + exam/entrance/course fees + living + medical + flights
   Eligibility: young African professionals (with work experience), nominated/screened via the JICA office in your country
   Unique for its Japanese-industry internship & network angle. Complements MEXT (#67, open-application) and E-JUST TICAD (Egypt).

111. AIMS Scholarships (African Institute for Mathematical Sciences) [PARTIALLY VERIFIED — nexteinstein.org]
   Country: Multiple (South Africa, Rwanda, Ghana, Cameroon, Senegal) | Level: structured master's
   Amount: FULL — tuition + accommodation + meals + travel
   Eligibility: African graduates with strong maths/science background
   A pan-African maths/AI pipeline, intra-Africa & fully funded, springboard to PhDs worldwide; women strongly encouraged.

112. Hamad Bin Khalifa University (HBKU) Graduate Funding — Qatar [PARTIALLY VERIFIED — hbku.edu.qa]
   Country: Qatar | Level: master's + PhD
   Amount: FULL for funded admits — tuition waiver + monthly stipend + benefits (Qatar Foundation research university, Education City, Doha)
   Deadline: main round ~January for autumn — confirm. English-medium, generously resourced Gulf research route.

113. OPEC Fund for International Development Scholarship [PARTIALLY VERIFIED — opecfund.org]
   Country: Multiple (study anywhere) | Level: development-related master's
   Amount: FULL — up to a set max (recent ~US$50,000 total): tuition + monthly living + travel + insurance
   Eligibility: developing-country nationals (excluding OPEC Fund members) admitted to a master's ANYWHERE in the world
   ⚠ Study-anywhere flexibility is rare, but the annual award count is tiny — very competitive.

114. DAAD In-Country/In-Region Scholarships (Sub-Saharan Africa) [PARTIALLY VERIFIED — daad.de]
   Country: Multiple (African host universities) | Level: master's + PhD
   Amount: FULL for the region — tuition + monthly stipend + study/research allowances
   Eligibility: Sub-Saharan African graduates studying WITHIN Africa (own or neighbouring country), often via the host university's programme
   The intra-Africa DAAD variant (distinct from DAAD-study-in-Germany, #1) — no European visa, lower cost, German funding.

115. Education Above All — Al Fakhoora Dynamic Futures (Qatar) [PARTIALLY VERIFIED — educationaboveall.org]
   Country: Multiple (partner universities) | Level: higher education (UG + grad)
   Amount: FULL — tuition + living + support services
   Eligibility: youth affected by conflict, occupation or displacement (notably Palestinian and other crisis-affected students), via partner universities/NGOs
   ★ One of very few scholarships explicitly for refugee/crisis-affected students — access is through partner organisations.

116. Wells Mountain Initiative (WMI) Empowerment Scholarship [PARTIALLY VERIFIED — wellsmountaininitiative.org]
   Country: Multiple (study in your OWN developing country) | Level: first bachelor's/diploma
   Amount: PARTIAL — up to US$3,000/yr (tuition/books/fees), renewable
   Eligibility: financially-needy students from developing countries studying at home (or another developing country), with a give-back record
   Small but decisive where $3,000 covers a whole year of low-cost home study.

117. Abdulla Al Ghurair Foundation STEM Scholars [PARTIALLY VERIFIED — alghurairfoundation.org]
   Country: Multiple (Arab-region + select global partners) | Level: undergraduate + master's
   Amount: FULL or major — tuition + living support for STEM study
   Eligibility: high-achieving Emirati and Arab youth in STEM (need considered)
   A major Gulf philanthropy focused on Arab youth in STEM — pairs with the UAE/MENA universities in this dataset.

118. Saudi Government Scholarship (Study in Saudi Arabia) [PARTIALLY VERIFIED — studyinsaudi.moe.gov.sa]
   Country: Saudi Arabia | Level: UG + graduate at public universities
   Amount: FULL for awardees — tuition-free + monthly stipend + accommodation + annual airfare + medical + settlement allowances
   Eligibility: international students admitted via the unified "Study in Saudi" platform (Islamic studies, engineering, sciences, medicine…)
   Among the most generous government packages anywhere (housing + flights). Many programmes Arabic-medium with a funded Arabic year; English STEM/health tracks exist.

119. Cornelius Vanderbilt Scholarship (Vanderbilt University) [VERIFIED — Vanderbilt University (official)]
   Country: United States | Level: Undergraduate
   Amount: Full tuition + a one-time summer stipend; extra need-based aid added where demonstrated need exceeds tuition — verified 2026
   Eligibility: International first-year applicants are eligible for all Vanderbilt merit scholarships; applying to the Cornelius Vanderbilt Scholarship is strongly encouraged and preference goes to those who apply
   Deadline: Tied to admission — Regular Decision ~Jan 1 (apply by the scholarship deadline; confirm the current cycle)
   One of the most generous US merit awards — full tuition regardless of nationality.

120. Emory University Scholar Programs (Woodruff / Dean's) [VERIFIED — Emory University (official)]
   Country: United States | Level: Undergraduate
   Amount: Robert W. Woodruff Scholarship covers full tuition, room, board and fees; Dean's Scholarships cover full tuition — verified 2026
   Eligibility: International first-year applicants are eligible; opt in to merit-scholarship consideration on the application (some awards need no separate materials)
   Deadline: November 15 (Early Decision I or Regular Decision) — confirm the current cycle
   Merit-based and open to internationals — the Woodruff is a full ride, not just tuition.

121. Karsh International Scholars Program (Duke University) [VERIFIED — Duke University — Office of University Scholars & Fellows (official)]
   Country: United States | Level: Undergraduate
   Amount: Full ride — tuition, mandatory fees, room and board for four years, plus funding across three summers for research/internships — verified 2026
   Eligibility: International applicants with demonstrated financial need; no separate application — apply to Duke and request financial aid
   Deadline: Tied to admission (apply early / Regular Decision) — confirm the current cycle
   Full ride specifically for international undergraduates with financial need — extremely competitive.

122. USC Trustee & Mork Family Scholarships (University of Southern California) [VERIFIED — USC Undergraduate Admission (official)]
   Country: United States | Level: Undergraduate
   Amount: Trustee: full tuition (~100 awards/yr). Mork Family: full tuition + $5,000/yr living stipend (~10 awards/yr) — verified 2026
   Eligibility: International first-year applicants are considered; submit a complete application by the December 1 scholarship-consideration deadline
   Deadline: December 1
   Automatic consideration by the Dec 1 deadline — no separate scholarship form for the Trustee.

123. Trustee Scholarship (Boston University) [VERIFIED — Boston University (official)]
   Country: United States | Level: Undergraduate
   Amount: Full undergraduate tuition + mandatory fees, renewable for four years (housing/dining/insurance not covered) — verified 2026
   Eligibility: Open to international undergraduate applicants; BU awards ~20 Trustee Scholarships to international students each year — highly competitive
   Deadline: December 1 (Common App + Trustee Scholarship essay)
   Full tuition + fees — but budget ~$30k/yr for living costs, which it does not cover.

124. Danforth Scholars Program (Washington University in St. Louis) [VERIFIED — WashU Office of Scholar Programs (official)]
   Country: United States | Level: Undergraduate
   Amount: Full-tuition scholarship with a $2,500 stipend, or a partial-tuition award; renewable each year — verified 2026
   Eligibility: International students are welcome; complete the WashU admission application plus a separate Danforth Scholars application (short leadership essay)
   Deadline: Separate Danforth application — align with the Regular Decision cycle (~Jan); confirm the current dates
   Requires a separate scholarship application on top of admission — leadership-focused selection.

125. Richmond Scholars Program (University of Richmond) [VERIFIED — University of Richmond (official)]
   Country: United States | Level: Undergraduate
   Amount: Equal to full tuition, housing and food, plus program benefits; ~25 incoming students; renewable up to eight semesters — verified 2026
   Eligibility: International students and non-US citizens receive full consideration for merit scholarships; all first-year applicants are auto-considered if complete by the deadline
   Deadline: December 1 (Richmond Scholars deadline)
   The university's top award — effectively a full ride (tuition + room + board).

126. Global Scholars Program (Clark University) [VERIFIED — Clark University (official)]
   Country: United States | Level: Undergraduate
   Amount: $15,000–$25,000/yr for four years, plus up to $5,000 additional need-based aid, plus a guaranteed $2,500 paid-internship/research award — verified 2026
   Eligibility: First-year international applicants (not transfers) who have attended school overseas for at least four years; international citizens studying in the US may also apply
   Deadline: Tied to admission deadlines — confirm the current cycle
   A large partial award (not a full ride) but widely accessible for international first-years.

127. No-Tuition Promise (Berea College) [VERIFIED — Berea College (official)]
   Country: United States | Level: Undergraduate
   Amount: No student pays tuition; first-year international students receive aid covering 100% of tuition, room, board and fees. After year one, save ~$1,000/yr toward costs — verified 2026
   Eligibility: Admitted international students (Berea admits ~30 new international students/year); a ~$2,200 enrollment deposit applies, with aid available for those who cannot pay it
   Deadline: International applicants apply early — confirm the current deadline (spots are limited)
   The only US college that fully funds 100% of enrolled international students; all students work an on-campus job.

128. Freeman Asian Scholars Program (Wesleyan University) [VERIFIED — Wesleyan University (official)]
   Country: United States | Level: Undergraduate
   Amount: Full cost of attendance — tuition, fees, room, board, supplies and travel home (over $90,000/yr); ~11 scholars/year — verified 2026
   Eligibility: Citizens/permanent residents of China, Hong Kong, Indonesia, Japan, Malaysia, the Philippines, Singapore, South Korea, Taiwan, Thailand or Vietnam (not dual US citizens/residents), applying as aid-seeking candidates
   Deadline: Tied to admission — apply by the Regular Decision deadline (~Jan 1); confirm the current cycle
   Region-specific full ride for East/Southeast Asian students — one of the most generous awards anywhere.

129. Harvard College Need-Based Financial Aid [VERIFIED — Harvard College (official)]
   Country: United States | Level: Undergraduate
   Amount: Meets 100% of demonstrated need with grants, no loans; families earning under ~$100,000 typically pay nothing for tuition, room and board — verified 2026
   Eligibility: Need-blind for all applicants including international students — your ability to pay does not affect the admission decision, and full need is met if admitted
   Deadline: Tied to admission (financial-aid materials due with the application) — confirm the current cycle
   Not a named scholarship but a need-blind, full-need, no-loan system — for lower-income families it is effectively a full ride.

130. Yale University Need-Based Financial Aid [VERIFIED — Yale University (official)]
   Country: United States | Level: Undergraduate
   Amount: Meets 100% of demonstrated need with grants (no loans, no student-contribution requirement to borrow); many low-income families pay $0 — verified 2026
   Eligibility: Need-blind for all applicants including international students; admitted students receive aid covering full demonstrated need
   Deadline: Tied to admission — submit aid documents with the application; confirm the current cycle
   Need-blind for internationals with 100% of need met by grants — no loans.

131. Princeton University Need-Based Financial Aid [VERIFIED — Princeton University (official)]
   Country: United States | Level: Undergraduate
   Amount: All-grant aid (the first US university to replace loans with grants); meets full demonstrated need — most families under ~$100,000 pay nothing — verified 2026
   Eligibility: Need-blind for all applicants including international students; full demonstrated need guaranteed if admitted
   Deadline: Tied to admission — submit the Princeton Financial Aid Application with your admission application; confirm the current cycle
   Pioneered no-loan aid; among the most generous need-based programs for internationals.

132. MIT Need-Based Financial Aid [VERIFIED — MIT Student Financial Services (official)]
   Country: United States | Level: Undergraduate
   Amount: Meets 100% of demonstrated need with need-based aid (no merit or athletic scholarships); low- and middle-income families often pay nothing toward tuition — verified 2026
   Eligibility: Need-blind for all applicants including international students — one of the few STEM-focused universities to be need-blind regardless of nationality
   Deadline: Tied to admission — submit aid materials with the application; confirm the current cycle
   Need-blind for internationals and 100% need met — the standout option for STEM.

133. Amherst College Need-Based Financial Aid [VERIFIED — Amherst College (official)]
   Country: United States | Level: Undergraduate
   Amount: Meets 100% of demonstrated need through scholarships and work-study, no loans; aid is guaranteed for all four years — verified 2026
   Eligibility: Need-blind for international students — one of a small number of US colleges that admit internationals without regard to ability to pay and meet full need
   Deadline: Tied to admission — submit aid documents with the application; confirm the current cycle
   Leading liberal-arts college, long need-blind for internationals with no-loan aid.

134. Dartmouth College Need-Based Financial Aid [VERIFIED — Dartmouth Financial Aid (official)]
   Country: United States | Level: Undergraduate
   Amount: Meets 100% of demonstrated need; free tuition for families earning under ~$125,000 and no-loan packages for many — verified 2026
   Eligibility: Need-blind for all applicants including international students (universal need-blind policy since 2022); full need met if admitted
   Deadline: Tied to admission — submit aid materials with the application; confirm the current cycle
   One of only a handful of universities with universal need-blind admission including internationals.

135. Williams College Need-Based Financial Aid (All-Grant) [VERIFIED — Williams College (official)]
   Country: United States | Level: Undergraduate
   Amount: Meets 100% of demonstrated need with grants — no loans, no work-study; international aid averages more than $90,000/yr and includes books, supplies and a yearly flight home — verified 2026
   Eligibility: Open to international applicants (need-aware for internationals — indicate intent to apply for aid on the application); ~70% of international students receive aid
   Deadline: Tied to admission — submit aid documents with the application; confirm the current cycle
   Not need-blind for internationals, but admitted students get one of the most generous all-grant packages in the US.

136. The Colby Commitment (Colby College) [VERIFIED — Colby College (official)]
   Country: United States | Level: Undergraduate
   Amount: Meets 100% of demonstrated need with no loans; families earning under ~$75,000 pay $0, and those under ~$200,000 contribute no more than ~$20,000 — verified 2026
   Eligibility: Open to admitted international students (CSS Profile + International Student Certification of Finances required)
   Deadline: Tied to admission — submit aid documents with the application; confirm the current cycle
   No-loan, full-need aid extended to international students under the Colby Commitment.

137. Full International Scholarship (University of Westminster) [VERIFIED — University of Westminster (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: Full ride — full tuition-fee waiver, accommodation, living expenses and flights to/from London — verified 2026
   Eligibility: International students from developing countries holding an offer for a full-time undergraduate degree; selection weighs academic excellence, development potential and financial need
   Deadline: Apply after receiving an offer — applications for 2026-27 open in January 2026 (confirm the closing date)
   A rare full-ride UK undergraduate scholarship — one of very few covering living costs and flights, not just tuition.

138. Denys Holland Scholarship (UCL) [VERIFIED — UCL (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: £9,000/year for three years; scholars may use it for fees, with any remainder paid as a maintenance stipend — verified 2026
   Eligibility: International (and UK) students holding an offer for full-time undergraduate study at UCL in any department, in financial hardship; applicants aged 25 or under are preferred
   Deadline: Late July (e.g. ~21 July) — confirm the current cycle
   Partial award aimed at students who could not otherwise afford UCL — flexible between fees and living costs.

139. International Undergraduate Scholarships (University of Sheffield) [VERIFIED — University of Sheffield (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: Automatic £2,500/yr fee discount (up to £10,000 over the degree, needs a 60%+ average); a competitive Merit award of £10,000 toward tuition; NCUK Merit up to £17,500 — verified 2026
   Eligibility: Overseas fee-paying students holding an offer for an eligible undergraduate programme; the automatic award needs no separate form
   Deadline: Varies by scheme — confirm the current cycle
   The £2,500/yr discount is automatic on admission — worth confirming eligibility even before applying for the competitive Merit award.

140. Undergraduate Global Excellence Scholarship (University of Warwick) [VERIFIED — University of Warwick (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: Tiered tuition awards — for 2026: 6 full-fee, 148 half-fee, 103 quarter-fee and 6 £2,000 awards (~£1.5m total) — verified 2026
   Eligibility: Self-funded overseas fee-paying students who applied for a full-time undergraduate course before the UCAS deadline (~14 Jan 2026)
   Deadline: Scholarship application by late February (~27 Feb 2026); must hold an offer by mid-May
   Full-fee awards are few but half- and quarter-fee awards are plentiful — strong odds of a meaningful discount.

141. International Undergraduate Scholarships (University of Nottingham) [VERIFIED — University of Nottingham (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: Automatic awards of up to £5,000 off tuition on admission, plus a competitive International Undergraduate Excellence award (~£2,000 off first-year tuition) — verified 2026
   Eligibility: International students holding an offer for an eligible full-time undergraduate programme (some programmes such as Medicine, Pharmacy, Veterinary and Foundation Year are excluded); only the highest-value award applies if multiple are offered
   Deadline: Excellence award outcomes by end of April — confirm the current cycle
   The automatic discount needs no application — check eligibility as soon as you hold an offer.

142. Chancellor's International Scholarships (University of Sussex) [VERIFIED — University of Sussex (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: First-year tuition-fee waiver (recent cycles ran a partial waiver of around £5,000 / up to ~50% — confirm the current amount) — verified 2026
   Eligibility: International (overseas fee-paying) students holding an offer for an eligible full-time undergraduate programme; awarded as a fee reduction with no cash alternative
   Deadline: Varies — confirm the current cycle
   First-year only — factor in the full fee for later years when budgeting.

143. Kent International Scholarship for Undergraduates (University of Kent) [VERIFIED — University of Kent (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: £5,000 fee waiver split across two years (£3,000 in year one, £2,000 on progressing to stage two) — verified 2026
   Eligibility: Self-funded overseas fee payers paying fees directly to the University of Kent, holding an offer for an eligible undergraduate programme
   Deadline: Varies — confirm the current cycle
   A modest but reliable tuition discount for self-funded international undergraduates.

144. Undergraduate International Excellence Scholarships (Cardiff University) [VERIFIED — Cardiff University (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: Nine £10,000 Excellence scholarships (first year), plus a Vice-Chancellor's award of £3,500 (or £5,000 for certain countries) — verified 2026
   Eligibility: New international students starting an eligible undergraduate programme in autumn 2026 who can demonstrate academic potential
   Deadline: Excellence award application by early April (~3 Apr 2026)
   The £10,000 Excellence awards are competitive; the Vice-Chancellor's award is broader and easier to qualify for.

145. International Excellence Scholarships (University of Leeds) [VERIFIED — University of Leeds (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: Up to 500 awards worth £3,000, £6,000 or £16,000, applied as a discount on the first year's tuition — verified 2026
   Eligibility: International students holding an offer for an eligible undergraduate course starting September 2026; competitive, based on academic achievement
   Deadline: Varies — confirm the current cycle
   A large scheme (up to 500 awards) — good odds, though most awards are the smaller tiers.

146. International Undergraduate Scholarships (University of Birmingham) [VERIFIED — University of Birmingham (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: £5,000 tuition scholarships for eligible international undergraduates (several country-specific schemes, e.g. Nigeria, Ghana, Kenya, South Africa, Canada) — verified 2026
   Eligibility: International students holding an offer for an eligible undergraduate programme starting September 2026; specific awards depend on country of domicile
   Deadline: Varies by scheme — confirm the current cycle
   Awards are largely country-specific — check the scholarships page for the scheme matching your nationality.

147. International Excellence Award — Undergraduate (University of Surrey) [VERIFIED — University of Surrey (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: £5,000 tuition-fee waiver — verified 2026
   Eligibility: Self-funded international fee-paying students, regardless of nationality or domicile; application-based, assessed on grades, predicted grades and personal statement
   Deadline: Main round ~20 July (for UCAS applicants by 30 June); a Clearing round reopens in August — confirm the current cycle
   Open to any nationality — a straightforward £5,000 fee waiver for self-funded international students.

148. Global Talent Scholarship — Undergraduate (Queen Mary University of London) [VERIFIED — Queen Mary University of London (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: Up to £12,000, renewable each year (needs a 65%+ average) — verified 2026
   Eligibility: International students holding an offer for an eligible undergraduate programme joining September 2026
   Deadline: Varies — confirm the current cycle
   Renewable across years (unlike many UK awards that only cover year one) — strong value if you maintain the grade threshold.

149. Undergraduate Excellence Scholarship (University of Glasgow) [VERIFIED — University of Glasgow (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: £10,000/yr (Medical, Veterinary & Life Sciences and Science & Engineering) or £7,000/yr (Arts and Social Sciences), as a tuition discount, renewable each year — verified 2026
   Eligibility: International students holding an offer; no separate application — offer-holders are automatically assessed on academic merit
   Deadline: Automatic on admission — confirm the current cycle
   Automatic and renewable annually — one of the more generous automatic UK undergraduate awards.

150. Exeter Excellence Scholarships — Undergraduate (University of Exeter) [VERIFIED — University of Exeter (official)]
   Country: United Kingdom | Level: Undergraduate
   Amount: £3,000 or £5,000 per year, as a reduction of international tuition fees, continuing at the same value for each year of the degree — verified 2026
   Eligibility: International students (including EU nationals paying international fees) holding an offer to begin undergraduate study in September 2026; typically expects ~AAB at A-level or equivalent
   Deadline: Runs in rounds — confirm the current cycle
   Repeats at the same value every year of the degree, not just year one.

151. International Student Entrance Scholarship (University of Waterloo) [VERIFIED — University of Waterloo (official)]
   Country: Canada | Level: Undergraduate
   Amount: $10,000 (paid $5,000 + $5,000 across the first two terms); Engineering adds a further $10,000 for a $20,000 total — verified 2026
   Eligibility: International fee-paying students admitted to a full-time first-year degree starting September 2026; no minimum average and no application required
   Deadline: Automatic on admission — first installment in late July
   Fully automatic — every admitted international first-year gets it, so it is effectively a guaranteed discount.

152. Global Leader of Tomorrow Award (York University) [VERIFIED — York University (official)]
   Country: Canada | Level: Undergraduate
   Amount: $20,000/year, renewable for up to four years ($80,000 total); ~2 awards per year — verified 2026
   Eligibility: International students with outstanding academic achievement (A average) plus leadership/community/other accomplishments; preference to those showing financial need; must have finished high school within the past two years
   Deadline: Late January (~26 Jan 2026)
   Very few awards but a genuine full-scale scholarship ($80k over the degree).

153. Entrance Scholarships (McGill University) [VERIFIED — McGill University (official)]
   Country: Canada | Level: Undergraduate
   Amount: One-year awards of CAD $3,000 (non-renewable) and Major Entrance Scholarships of $3,000–$12,000 renewable for 3–4 years — verified 2026
   Eligibility: Newly admitted international undergraduates; automatically considered for one-year awards on academic merit, with a separate application required for Major Entrance Scholarships
   Deadline: Major scholarship application shortly after applying for admission — confirm the current cycle
   The one-year award is automatic; the larger renewable Major awards need a separate application.

154. International Entrance Scholarship (University of Calgary) [VERIFIED — University of Calgary (official)]
   Country: Canada | Level: Undergraduate
   Amount: $20,000/year, renewable in years two–four ($80,000 total) — verified 2026
   Eligibility: International undergraduates entering first year in any degree who meet the English Language Proficiency requirement; renewal needs a GPA of 2.60+ over 24 units
   Deadline: Automatic for eligible admitted students — confirm the current cycle
   A large renewable award reaching $80k over four years — among Canada's more generous automatic international entrance scholarships.

155. International Entrance Scholarships & Awards (Dalhousie University) [VERIFIED — Dalhousie University (official)]
   Country: Canada | Level: Undergraduate
   Amount: International entrance scholarship of $10,000; broader entrance awards range $1,000–$80,000; the Sankofa Scholarship is $48,000 ($12,000/yr for Black/African-descent students from the Caribbean) — verified 2026
   Eligibility: International students entering an undergraduate degree; specific awards vary by program and background
   Deadline: February 15 for general entrance awards
   A range of awards — check the Sankofa and program-specific scholarships alongside the general $10,000 entrance award.

156. President's Scholarship for World Leaders (University of Winnipeg) [VERIFIED — University of Winnipeg (official)]
   Country: Canada | Level: Undergraduate
   Amount: $3,500 for international undergraduates (a $5,000 version exists for graduate students) — verified 2026
   Eligibility: International students entering the University for the first time with a minimum 80% admission average, involved in leadership activities
   Deadline: Varies — confirm the current cycle
   A modest entry award, but Winnipeg's lower tuition and living costs stretch it further than in bigger cities.

157. International President's Entrance Scholarships (Western University) [VERIFIED — Western University (official)]
   Country: Canada | Level: Undergraduate
   Amount: Three awards of $100,000 each — part of Western's National Scholarship Program — verified 2026
   Eligibility: Top-performing international students applying for undergraduate study at the main campus; nomination/application via the National Scholarship Program
   Deadline: Tied to the National Scholarship Program cycle (early — typically autumn/winter) — confirm the current dates
   Only three awards but each is a full $100,000 — one of Canada's most prestigious international entrance scholarships.

158. Gold Standard Scholarship (University of Alberta) [VERIFIED — University of Alberta (official)]
   Country: Canada | Level: Undergraduate
   Amount: Up to CAD $6,000 for the top ~5% of students in each faculty by admission average — verified 2026
   Eligibility: International undergraduates; admission-based with no individual application — submit one scholarship application after applying and the university matches you to eligible awards
   Deadline: January 10 (single scholarship application)
   One scholarship application covers all U of A entrance awards — worth completing even if you only expect the Gold Standard.

159. International Entrance & Excellence Scholarships (Concordia University) [VERIFIED — Concordia University (official)]
   Country: Canada | Level: Undergraduate
   Amount: International Excellence Scholarships of $13,000–$19,000/yr (by academic record); merit-based International Entrance Scholarships of ~$5,000/yr; plus a Tuition Award of Excellence — verified 2026
   Eligibility: Top international candidates in the entrance pool applying for an undergraduate program at Concordia (Montreal)
   Deadline: Varies — confirm the current cycle
   The Excellence tier is renewable and sizeable; Montreal's lower living costs add to the value.

160. Undergraduate Scholars Entrance Scholarship — USES (Simon Fraser University) [VERIFIED — Simon Fraser University (official)]
   Country: Canada | Level: Undergraduate
   Amount: Covers tuition and mandatory supplementary fees (valued around $140,000 for international students), plus an optional Scholars Living Allowance of $8,000/term — verified 2026
   Eligibility: Current high school students admitted for the fall term to any undergraduate degree, with a minimum ~90% average (or 31 IB points), showing academic and extracurricular excellence
   Deadline: January 31 (Fall 2026 intake)
   Effectively a full-tuition ride, with a living allowance on top for the strongest applicants.

161. International Undergraduate Entrance Awards (McMaster University) [VERIFIED — McMaster University (official)]
   Country: Canada | Level: Undergraduate
   Amount: Faculty-specific awards ranging roughly $7,500–$210,000 across the degree (e.g. DeGroote Global Dean's Excellence: $25,000 first year + $20,000/yr renewable) — verified 2026
   Eligibility: International fee-paying undergraduates admitted to eligible faculties (Business, Engineering, Humanities, Science and others); competitive, faculty-based selection
   Deadline: February 19 (2026 cycle)
   Awards differ sharply by faculty — check the specific scheme for your intended program.

162. International Admission Scholarships (University of Ottawa) [VERIFIED — University of Ottawa (official)]
   Country: Canada | Level: Undergraduate
   Amount: International English Admission Scholarship of $7,500/term ($60,000 over four years, renewable, automatic); plus a one-time International English Academic Excellence award of $10,000 for top averages — verified 2026
   Eligibility: International students with a valid study permit, newly admitted to an approved English-language undergraduate program (Arts, Engineering, Health Sciences, Science, Social Sciences or Telfer) with a minimum 80% admission average
   Deadline: Automatic on admission — confirm the current cycle
   The $60,000 admission scholarship is automatic and renewable — one of Canada's most accessible large international awards.

163. Melbourne International Undergraduate Scholarship (University of Melbourne) [VERIFIED — University of Melbourne (official)]
   Country: Australia | Level: Undergraduate
   Amount: 25% tuition-fee sponsorship for the duration of the course (2026 intakes; drops to 20% from 2027) — verified 2026
   Eligibility: International students commencing an undergraduate degree at the University of Melbourne; competitive, based on academic merit
   Deadline: Varies — confirm the current cycle
   A partial fee sponsorship at Australia's top-ranked university — competitive but applies for the whole degree.

164. Sydney International Student Award (University of Sydney) [VERIFIED — University of Sydney (official)]
   Country: Australia | Level: Undergraduate
   Amount: 20% of tuition fees for the duration of the course — verified 2026
   Eligibility: International students from selected nationalities holding an offer for a new undergraduate coursework degree at the time of application
   Deadline: Varies — confirm the current cycle
   A duration-long 20% fee reduction — nationality-restricted, so check the eligible-countries list.

165. International Scientia Coursework Scholarship (UNSW Sydney) [VERIFIED — UNSW Sydney (official)]
   Country: Australia | Level: Undergraduate
   Amount: Either full tuition-fee support for the minimum program duration, or $20,000/year toward tuition — verified 2026
   Eligibility: Students from eligible countries commencing in 2026/2027 with high academic achievement, demonstrated leadership and extracurricular involvement
   Deadline: Varies by intake term — confirm the current cycle
   The full-tuition tier is a genuine full ride on fees — one of the strongest undergraduate awards in Australia.

166. Monash International Merit Scholarship (Monash University) [VERIFIED — Monash University (official)]
   Country: Australia | Level: Undergraduate
   Amount: $15,000/year (from 2026 intakes) paid until the minimum credit points for the degree are completed — verified 2026
   Eligibility: International students who have received a Monash undergraduate offer are automatically considered — no application; must maintain a distinction (70%+) average
   Deadline: Automatic on offer — confirm the current cycle
   Automatic consideration and a raised 2026 value ($15k/yr) — plus a place in the Monash Minds leadership program.

167. ANU Chancellor's International Scholarship (Australian National University) [VERIFIED — Australian National University (official)]
   Country: Australia | Level: Undergraduate
   Amount: 25% or 50% tuition-fee reduction for the duration of the degree, plus guaranteed first-year accommodation if taken up — verified 2026
   Eligibility: Overseas students applying for undergraduate admission are automatically considered — no separate application; award level depends on eligibility
   Deadline: Automatic on admission — confirm the current cycle
   Automatic, and the guaranteed first-year accommodation is a rare, valuable extra at Australia's national university.

168. UQ International Scholarships (University of Queensland) [VERIFIED — University of Queensland (official)]
   Country: Australia | Level: Undergraduate
   Amount: International Excellence Scholarship: 25% tuition reduction; International High Achievers: 15% reduction; Vice-Chancellor's: ~AUD $12,000/yr — verified 2026
   Eligibility: International students commencing an undergraduate program at UQ; awards vary in competitiveness and some are faculty-specific
   Deadline: Varies by scheme — confirm the current cycle
   A ladder of awards from ~15% up to 25% of tuition — check which you qualify for once you hold an offer.

169. Global Academic Excellence Scholarship (University of Adelaide) [VERIFIED — University of Adelaide (official)]
   Country: Australia | Level: Undergraduate
   Amount: 50% tuition-fee reduction for the duration of the undergraduate program — verified 2026
   Eligibility: Commencing international undergraduates with demonstrated academic excellence (indicative ATAR ~99.9 or equivalent); awarded automatically to those who qualify — no application
   Deadline: Automatic for eligible students — confirm the current cycle
   A large 50% fee cut, but the academic bar is very high — aimed at top ATAR-equivalent applicants.

170. Vice-Chancellor's International Scholarship (Macquarie University) [VERIFIED — Macquarie University (official)]
   Country: Australia | Level: Undergraduate
   Amount: Up to AUD $10,000 applied toward tuition fees — verified 2026
   Eligibility: Full-time international students commencing an undergraduate degree with a minimum ATAR equivalent of ~85; competitive, merit-based
   Deadline: Varies — confirm the current cycle
   A moderate one-off tuition contribution at a Sydney university — a more attainable ATAR bar than the top-tier awards.

171. International Undergraduate Scholarships (University of Technology Sydney) [VERIFIED — University of Technology Sydney (official)]
   Country: Australia | Level: Undergraduate
   Amount: A suite of awards for the standard course duration: Academic Merit 15%, Vice-Chancellor's full tuition, and region-specific awards of 20–40% — verified 2026
   Eligibility: International students commencing an undergraduate degree at UTS; several schemes are region-specific (South Asia, Southeast Asia, Europe)
   Deadline: Varies by scheme — confirm the current cycle
   Range spans a 15% discount up to a full-tuition Vice-Chancellor's award — check the region-specific schemes for your country.

172. Deakin Vice-Chancellor's International Scholarship (Deakin University) [VERIFIED — Deakin University (official)]
   Country: Australia | Level: Undergraduate
   Amount: 100% or 50% tuition-fee waiver for the full duration of the coursework program — verified 2026
   Eligibility: International students commencing an eligible undergraduate degree; award level (100% or 50%) depends on academic profile and selection; participation in the VC's Professional Excellence Program is required
   Deadline: Varies — confirm the current cycle
   The 100% tier is a full tuition ride for the whole degree — one of the most generous Australian undergraduate awards.

173. International Bachelor Scholarships (Erasmus University Rotterdam — ESE) [VERIFIED — Erasmus University Rotterdam — Erasmus School of Economics (official)]
   Country: Netherlands | Level: Undergraduate
   Amount: NL Scholarship of €5,000, €10,000 or €15,000 (half as a tuition-fee reduction, half paid over 10 monthly instalments); plus a separate Erasmus School of Economics fund giving partial tuition-fee waivers — verified 2026
   Eligibility: Outstanding non-EEA students starting a bachelor's degree at Erasmus School of Economics; the NL Scholarship is a once-in-a-lifetime, first-year award
   Deadline: Varies — confirm the current cycle (EUR runs a limited scholarship programme)
   One of the few genuine bachelor-level scholarships in the Netherlands — mostly partial, so plan for additional funding.

174. Orange Tulip Scholarship (Netherlands) [VERIFIED — Study in NL / Nuffic (official)]
   Country: Netherlands | Level: Both
   Amount: Country-specific partial-to-full tuition awards, commonly €5,000–€15,000 (some cover 25–100% of tuition) — verified 2026
   Eligibility: International students from participating countries applying to bachelor's (and master's) programmes at participating Dutch institutions; packages and eligibility are set per country
   Deadline: Differs sharply by institution and country package — check the specific award
   The centralised programme changed in 2024 — awards are now offered directly by participating Dutch universities / Neso offices, so verify the current package for your country before relying on it.

175. Global Excellence Undergraduate Scholarships (Trinity College Dublin) [VERIFIED — Trinity College Dublin (official)]
   Country: Ireland | Level: Undergraduate
   Amount: €2,000–€5,000 (by region), applied as a reduction to year-one tuition fees — verified 2026
   Eligibility: Non-EU fee-status students holding an offer for year one of a full-time undergraduate degree; students from China are not eligible, and Medicine, Dentistry, Acting, Engineering, Natural Sciences and Computer Science/Statistics are excluded
   Deadline: By region — e.g. Africa 1 May, Americas 1 Apr, SE Asia/Oceania 15 Jul, elsewhere 15 Jun (confirm the current cycle)
   First-year tuition reduction only, and several high-demand courses are excluded — check your programme is eligible.

176. Global Excellence Scholarships — Undergraduate (University College Dublin) [VERIFIED — University College Dublin (official)]
   Country: Ireland | Level: Undergraduate
   Amount: A limited number of 100% and 50% tuition-fee scholarships — verified 2026
   Eligibility: Outstanding international (non-EU fee) students applying to an undergraduate programme starting in September; excludes online, part-time, clinical, January-start and foundation pathway programmes
   Deadline: By region — ~28 Feb (Middle East, Africa, Pakistan) and ~31 Mar (all other regions); confirm the current cycle
   The 100% tier is a genuine full-tuition award — few in number but among the strongest undergraduate options in Ireland.

177. International Undergraduate Scholarships (University of Galway) [VERIFIED — University of Galway (official)]
   Country: Ireland | Level: Undergraduate
   Amount: Merit scholarships of €2,000–€5,000/yr (often automatic, indicated in the offer) and Excellence Scholarships up to €10,000 — verified 2026
   Eligibility: Non-EU international undergraduates, with many awards focused on the College of Science and Engineering; merit awards are granted automatically on academic results
   Deadline: Varies — confirm the current cycle
   Many merit awards are automatic and appear in your offer letter — check the offer before applying separately.

178. International Undergraduate Scholarships (University College Cork) [VERIFIED — University College Cork (official)]
   Country: Ireland | Level: Undergraduate
   Amount: College of Business & Law: €5,000/yr; College of Arts, Celtic Studies & Social Sciences: €2,000 — awarded automatically — verified 2026
   Eligibility: International undergraduates with an accepted offer in the UCC Application Portal; awarded automatically on previous academic results, no separate application
   Deadline: Automatic on an accepted offer — confirm the current cycle
   Automatic and college-specific — the Business & Law award is the more valuable at €5,000/yr.


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

━━ Egyptian PUBLIC universities (international admission runs through the Ministry's OFFICIAL portal study-in-egypt.gov.eg / Wafedeen system) ━━
⚠ GOLDEN RULE: apply via the .gov.eg portal directly. Several private agent sites use near-identical names ("study in egypt" .online/.com etc.) and charge "service fees" for what the official portal does. Per-faculty international fees are set centrally and quoted in USD (commonly cited ~$3,000–$8,000/yr, medicine highest) — NOT individually verified; confirm on the portal. EGYAID government scholarships (tuition + registration, all degree levels) run through the same portal.

Cairo University — Giza (Greater Cairo), Egypt [NOT individually verified — public-system fees via official portal]
  Type: Egypt's flagship public university — one of Africa's oldest and largest (est. 1908)
  Known for: Medicine, Engineering, Law, Economics, Political Science
  Language: Mostly Arabic-medium; several English-medium tracks (medicine, engineering, economics) — confirm per programme
  Fees/deadlines: see the public-system rule above — confirm on study-in-egypt.gov.eg

Ain Shams University — Cairo, Egypt [NOT individually verified — public-system fees via official portal]
  Type: Egypt's second-largest public university — engineering and medicine heavyweight
  Known for: Medicine, Engineering, Computer Science, Business
  Language: Mostly Arabic-medium; English-medium credit-hour tracks in engineering/CS and medicine — confirm per programme
  Fees/deadlines: see the public-system rule above

Alexandria University — Alexandria, Egypt [NOT individually verified — public-system fees via official portal]
  Type: The Mediterranean coast's flagship — Egypt's big second city, cheaper than Cairo
  Known for: Medicine, Engineering, Pharmacy, Humanities
  Language: Mostly Arabic-medium; some English-medium tracks — confirm per programme
  Fees/deadlines: see the public-system rule above

Mansoura University — Mansoura (Nile Delta), Egypt [NOT individually verified — public-system fees via official portal]
  Type: Delta public university with an internationally known medical centre (Urology & Nephrology Center)
  Known for: Medicine, Pharmacy, Engineering, Science
  Language: Mostly Arabic-medium; Mansoura-Manchester English-medium medicine track exists — confirm per programme
  Fees/deadlines: see the public-system rule above

Helwan University — Helwan (Greater Cairo), Egypt [NOT individually verified — public-system fees via official portal]
  Type: Cairo public university known for arts, music and applied engineering
  Known for: Fine Arts, Music, Engineering, Education
  Language: Mostly Arabic-medium — confirm per programme; arts may require portfolios/auditions
  Fees/deadlines: see the public-system rule above

Al-Azhar University — Cairo, Egypt [WELL-DOCUMENTED scholarships — azhar.eg foreign-student portal]
  Type: The Islamic world's most famous seat of learning — teaching since 970 AD
  Known for: Islamic Studies, Law (Sharia), Medicine, Humanities
  Language: Arabic-medium — the international scholarship includes a FREE preparatory Arabic year
  ★ AL-AZHAR SCHOLARSHIPS: full packages for international Muslim students — tuition + free on-campus housing + monthly stipend + free Arabic year + medical care at Al-Azhar hospitals. Allocation typically per country (via embassies/religious-affairs ministries) — confirm the route for your country on azhar.eg. Self-funded fees NOT individually verified.
  Deadline: nomination windows vary by country — confirm on azhar.eg

Egypt-Japan University of Science and Technology (E-JUST) — Borg El Arab (Alexandria), Egypt [VERIFIED scholarship — ejust.edu.eg]
  Type: Japanese-style research university built with JICA — small classes, lab-centred, English-medium
  Known for: Engineering, Computer Science, Robotics, Business
  ★ E-JUST TICAD AFRICAN SCHOLARSHIPS (verified): FULLY FUNDED master's for citizens of African countries (except Egypt) — tuition + living stipend + travel + accommodation + medical insurance, in Engineering, CS/IT, Applied Sciences, International Business, Humanities. Application ~mid-February for Fall (2026-cycle dates verified — confirm current). One of the best fully-funded routes in Africa.
  Self-funded fees: NOT individually verified — confirm on ejust.edu.eg

Arab Academy for Science, Technology & Maritime Transport (AASTMT) — Alexandria (+ Cairo), Egypt [VERIFIED fee categories — aast.edu]
  Type: Arab League-affiliated regional university — THE maritime academy of the Arab world; English-medium
  Known for: Engineering, Marine Science (Maritime Transport), Business, Computer Science
  International tuition (per official aast.edu fee pages — confirm current year): Engineering ~$4,655–$6,545/yr; Maritime Transport ~$4,975–$6,400/yr by category. ⚠ Maritime cadets pay obligatory accommodation/meals/uniform for the first four semesters.
  Scholarships: partial merit (e.g. 10% for 95%+ averages) — confirm on aast.edu

Nile University — Giza (Sheikh Zayed), Egypt [FEES NOT VERIFIED — nu.edu.eg]
  Type: Non-profit private research university — strong in tech, engineering and entrepreneurship; English-medium
  Known for: Engineering, Computer Science, Business, Data Science
  Tuition: NOT VERIFIED — official fee schedule (nu.edu.eg/admission/fees-and-financials) was not machine-readable at research time. Do NOT quote third-party figures; confirm on the official page.
  Scholarships: first-year merit scholarships + category discounts — confirm on nu.edu.eg

Universiti Malaya (UM) — Kuala Lumpur, Malaysia [PARTIALLY VERIFIED — ranking verified via um.edu.my; tuition NOT verified]
  Ranking: #58 QS World 2026 · #1 in Malaysia (verified)
  Known for: Medicine, Engineering, Law, Economics, Computer Science
  Language: Mix of English- and Malay-medium — most international-facing programmes taught in English (confirm per programme)
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition: NOT VERIFIED — the official fee schedules (study.um.edu.my) were unreachable at the time of research. Do NOT quote figures; tell users to confirm on the official site.
  Intakes: ~March and September/October; international applications close several months earlier (not verified — confirm on apply.um.edu.my)

University of Nottingham Malaysia — Semenyih (Greater Kuala Lumpur), Malaysia [VERIFIED — nottingham.edu.my]
  Type: Malaysian campus of the University of Nottingham (UK, #97 QS World 2026) — same degree as the UK campus
  Known for: Engineering, Computer Science, Business, Pharmacy, Psychology
  Language: English-medium instruction
  Tests: IELTS Academic or equivalent — minimum varies by course; test results must be less than 2 years old
  International tuition (2026, verified): RM52,000–72,000/yr (~$11,800–$16,400 USD) by course — e.g. Education RM52,000, Business RM57,000, Engineering RM67,000, Pharmacy RM72,000. A 6% service tax applies to international students; the fee is locked at your year of entry.
  Intakes: September (main — international application deadline 31 July 2026, verified); some programmes also offer April
  Scholarship here: High Achiever's Scholarship — 15–25% off first-year tuition, automatic (see scholarship #12)

Monash University Malaysia — Subang Jaya (Greater Kuala Lumpur), Malaysia [VERIFIED — monash.edu.my]
  Type: Malaysian campus of Monash University (Australia, #36 QS World 2026) — same degree as the Australian campus
  Known for: Business, Engineering, Computer Science/IT, Medicine, Pharmacy, Psychology
  Language: English-medium instruction
  Tests: IELTS Academic or equivalent — minimum varies by course; confirm per course
  International tuition (2026, verified): RM49,920–71,040/yr (~$11,300–$16,100 USD) for most degrees — e.g. Arts/Psychology RM49,920, Business RM51,840, Computer Science RM54,720, Engineering RM64,800, Pharmacy RM71,040. Medicine (MD) RM138,720/yr (~$31,500). +6% service tax for international students; application fee RM100.
  Intakes: February, July, October — international application deadlines fall ~2 months before intake (e.g. late December for February); allow extra lead time for the student visa
  Scholarship here: Merit tuition waivers RM6,000–15,000/yr, automatic consideration (see scholarship #13)

Universiti Kebangsaan Malaysia (UKM) — Bangi (Greater Kuala Lumpur), Malaysia [PARTIALLY VERIFIED — ranking verified; tuition NOT verified]
  Ranking: #126 QS World 2026 (2nd in Malaysia)
  Known for: Science, Engineering, Medicine, Social Sciences, Law
  Language: Malay and English — many programmes use English; confirm per programme
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition: NOT VERIFIED — fee tables are split across faculty documents on ukm.my; do NOT quote figures, refer users to the official site
  Intakes: Main intake ~October — confirm on ukm.my

Universiti Putra Malaysia (UPM) — Serdang (Greater Kuala Lumpur), Malaysia [VERIFIED — bursar.upm.edu.my fee document, April 2026]
  Ranking: #134 QS World 2026
  Known for: Agriculture & Forestry (historic strength), Veterinary Medicine, Business, Engineering, Computer Science
  Language: Malay and English — many programmes use English; confirm per programme
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (verified April 2026): most bachelor's RM7,600–14,000/semester → ~RM15,200–28,000/yr (~$3,500–$6,400 USD/yr); e.g. Computer Science RM12,000/sem, Business Admin RM11,000/sem, Economics RM10,000/sem. Clinical programmes run up to RM34,500/semester.
  Intakes: September and February (per official admission documents) — confirm dates on official site

Universiti Sains Malaysia (USM) — Penang, Malaysia [VERIFIED — admission.usm.my official per-semester fee table]
  Ranking: #146 QS World 2026
  Known for: Pharmacy & Pharmacology (QS top-50 subject), Science, Engineering, Arts, Medicine
  Language: English widely used in science/professional programmes; confirm per programme
  Tests: IELTS / TOEFL / MUET required; minimum varies by programme — confirm on official site
  International tuition (2025/2026, verified — official table quotes USD): most bachelor's $1,562–$3,125/semester → ~$3,125–$6,250/yr; Engineering ~$4,500–$5,625/yr, Computer Science ~$3,750/yr. Medicine (MD) $13,750/sem and Dentistry $11,250/sem.
  Intakes: Main intake ~September/October — confirm application windows on admission.usm.my

Universiti Teknologi Malaysia (UTM) — Johor Bahru (main campus) + Kuala Lumpur, Malaysia [VERIFIED — admission.utm.my]
  Ranking: #153 QS World 2026
  Known for: Engineering, Architecture / Built Environment (QS top-50 subject), Computer Science, Technology
  Language: English widely used in engineering/tech programmes; confirm per programme
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (verified — quoted as WHOLE-PROGRAMME totals): Education RM55,000, Science/Management RM63,000, Computing/IT RM71,000, Engineering RM75,000–76,000 for the full 4-year degree (official USD equivalents $13,200–$18,200 TOTAL — roughly $3,300–$4,600/yr). Registration & service fees are additional.
  Intakes: ~September and February/March — confirm on admission.utm.my

Universiti Teknologi PETRONAS (UTP) — Seri Iskandar (Perak), Malaysia [VERIFIED — utp.edu.my, fees effective May 2026]
  Ranking: #251 QS World 2026 · #9 worldwide in Petroleum Engineering (QS 2026 subject) · backed by PETRONAS
  Known for: Petroleum / Chemical / Electrical / Mechanical Engineering, Computer Science, Business
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (2026, verified — WHOLE-PROGRAMME totals): Business RM110,000 (3y4m), Computer Science/IT RM123,700, Civil/Computer Engineering RM165,000, integrated Engineering (Chem/Elec/Mech/Petroleum) RM240,000 (4 yrs) → roughly RM33,000–60,000/yr (~$7,500–$13,600 USD/yr). +6% SST.
  Intakes: multiple per year — confirm on official site

UCSI University — Kuala Lumpur (Cheras), Malaysia [VERIFIED — ucsiuniversity.edu.my official international fee schedule]
  Ranking: #265 QS World 2026 · one of Malaysia's top private universities
  Known for: Music & Hospitality (QS top-50 subjects), Business, Engineering, Medicine & Health Sciences
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (verified, official international fee PDF): most non-medical bachelor's ~RM22,000–34,000/yr (~$5,000–$7,700 USD/yr); typical 3–4 year degree totals ~RM80,000–100,000. First payment on enrolment ~RM27,500–32,500 (includes deposits/facilities).
  Intakes: multiple per year — confirm on official site

Asia Pacific University (APU) — Kuala Lumpur (Bukit Jalil), Malaysia [VERIFIED — official 2026 International Fee Guide]
  Type: Private tech-focused university, popular with international students (120+ nationalities)
  Known for: Computing, Cyber Security, Data Science & AI, Games/Design, Business, Engineering
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (2026, verified): degrees priced per level (year) — most programmes RM34,900 (yr 1) rising to RM37,500 (yr 3); Engineering RM32,600–36,200/yr (~$8,600–$9,950 USD/yr). EXCLUDES 6% SST. Pre-arrival fees ~RM3,600 + ~RM2,000 post-arrival (visa/insurance).
  Intakes: multiple per year — confirm on official site

University of Toronto — Toronto (3 campuses: St. George, Scarborough, Mississauga), Canada [VERIFIED — utoronto.ca; tuition figures from the official UTSC admissions fees page]
  Ranking: #1 in Canada in all five broad subject fields, top 17 globally in each (QS 2026 by subject, verified via utoronto.ca news); consistently among the world's top ~30 overall
  Known for: Computer Science, Medicine/Life Sciences, Engineering, Business (Rotman), Arts & Humanities
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (Fall 2026 estimate, verified — UTSC page; final fees approved April 2026): first year ~CAD $63,570 (~$46,400 USD) for Arts, Science, Computer Science, Management and most programmes; year 2+ rises (e.g. Management CAD $74,430). Plus ~CAD $2,271/yr incidental fees.
  Deadline: Apply via OUAC — deadlines vary by programme and are NOT verified; confirm on future.utoronto.ca
  Scholarship here: Lester B. Pearson International Scholarship — full ride, requires school nomination (see scholarship #6)

University of British Columbia (UBC) — Vancouver (+ Okanagan campus, Kelowna), Canada [VERIFIED — vancouver.calendar.ubc.ca + you.ubc.ca]
  Ranking: One of Canada's top 3, consistently in the QS global top ~50
  Known for: Computer Science, Engineering, Commerce (Sauder), Sciences, Forestry/Environment
  Language: English-medium instruction
  Tests: IELTS 6.5 / TOEFL — confirm exact minimum per programme on official site
  International tuition (2026 entry cohort, verified per-credit from the Academic Calendar): Arts $1,717.68/credit, Science $1,769.40, Applied Science (Engineering) $1,789.18, Commerce $2,222.61 → a standard 30-credit year ≈ CAD $51,500–$66,700 (~$37,600–$48,700 USD)
  Deadlines (verified for Sept 2027 entry): application opens early Oct, closes Jan 15; documents Jan 31–Mar 15 depending on applicant type
  Scholarship here: International Scholars Program (need+merit) and IMES $10,000–$25,000/yr automatic (see scholarship #14). New UBC Okanagan students from Sept 2026 get an $8,000 first-year Global Elevation Award (verified, you.ubc.ca blog).
  Note: Vancouver is one of Canada's most expensive cities — budget well above the national living estimate.

McGill University — Montreal, Canada [PARTIALLY VERIFIED — ranking verified (McGill Reporter); tuition NOT verified]
  Ranking: #27 QS World 2026 · #1 in Canada (verified)
  Known for: Medicine, Law, Engineering, Management (Desautels), Arts & Science
  Language: English-medium instruction (in francophone Montreal — no French required for study)
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition: NOT VERIFIED — McGill publishes rates only through its fee calculator and per-faculty PDFs (mcgill.ca/student-accounts). Do NOT quote figures; tell users to check the calculator. Verified detail: international bachelor's students get a GUARANTEED flat tuition rate for their entire degree once they enrol.
  Deadline: NOT verified — confirm on mcgill.ca
  Scholarship here: McCall MacBain Scholarships for master's study (see scholarship #17); undergraduate entrance scholarships also exist — confirm on official site

University of Waterloo — Waterloo (Ontario), Canada [VERIFIED — uwaterloo.ca/future-students/financing/tuition]
  Type: Canada's co-op powerhouse — most programmes alternate paid work terms with study; renowned for Computer Science, Engineering and Mathematics
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (Sept 2026 entry, verified — first-year figures INCLUDE incidental fees, two terms): Environment ~CAD $51,000; Science/Health ~$54,000; Arts ~$58,000; Mathematics ~$62,000; Computer Science ~$73,000; Engineering, Software Engineering & Architecture ~$75,000 (~$37,200–$54,800 USD). Books ~$1,500; co-op fee $836/work term. Accounting/finance tuition rises significantly in upper years.
  Deadline: Apply via OUAC — programme deadlines NOT verified; confirm on official site
  Scholarship here: automatic $10,000 first-year entrance scholarship for ALL eligible international students (see scholarship #15)

McMaster University — Hamilton (Ontario), Canada [VERIFIED — registrar.mcmaster.ca]
  Ranking: QS top-100 worldwide for Life Sciences & Medicine (#56, QS 2026 by subject)
  Known for: Health Sciences, Medicine, Engineering, Business (DeGroote), Science
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (2025-26, verified, per-unit × 30 units/yr): Humanities/Social Sciences ~CAD $45,200; Science/Arts & Science ~$47,500–$48,400; Business ~$48,100–$50,000; Engineering ~$54,100–$56,200 (~$33,000–$41,100 USD). 2026-27 rates not yet published at research time.
  Deadline: Apply via OUAC — programme deadlines NOT verified; confirm on official site

Queen's University — Kingston (Ontario), Canada [VERIFIED — queensu.ca/registrar]
  Ranking: #191 QS World 2026 · 9th in Canada (verified via Queen's Gazette)
  Known for: Commerce (Smith), Engineering, Arts & Science, Nursing; strong residential campus culture
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (2026-27, verified): Arts/Science/Kinesiology/Music CAD $44,809.80; Nursing $53,471.70; Computing $54,808.20; Engineering $59,283.74; Commerce $60,839.46 in years 1–2 (~$32,700–$44,400 USD). Ancillary fees and UHIP health insurance are extra.
  Deadline: Apply via OUAC — programme deadlines NOT verified; confirm on official site

University of Alberta — Edmonton, Canada [PARTIALLY VERIFIED — tuition NOT verified]
  Ranking: U15 research university, regularly among Canada's top 5 (2026 rank not verified)
  Known for: Engineering, Computer Science, Medicine, Energy/Earth Sciences, Business
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition: NOT VERIFIED — official fee pages were unreachable during research. Verified detail: international students get a program-based GUARANTEED tuition amount locked for the duration of their program (ualberta.ca tuition model page). Do NOT quote figures; confirm on ualberta.ca.
  Deadline: NOT verified — confirm on ualberta.ca

University of Calgary — Calgary, Canada [VERIFIED — calendar.ucalgary.ca (fees effective Spring 2026)]
  Type: U15 research university; strong industry links (energy sector HQ city)
  Known for: Engineering (Schulich), Business (Haskayne), Sciences, Nursing, Kinesiology
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (effective Spring 2026, verified, per 3-unit course — 10 courses ≈ full year): most faculties $3,078.21/course → ~CAD $30,782/yr (~$22,500 USD); Haskayne Business $3,610.44 → ~$36,104/yr (~$26,400); Schulich Engineering $4,148.73 → ~$41,487/yr (~$30,300). Medicine (MD) $37,893.93/term.
  Deadline: NOT verified — confirm on ucalgary.ca
  Scholarship here: International Entrance Scholarship $20,000 renewable — only 2/yr (see scholarship #16)

Dalhousie University — Halifax (Nova Scotia), Canada [VERIFIED — dal.ca International Tuition Guarantee]
  Type: Atlantic Canada's leading research university (U15)
  Known for: Engineering, Computer Science, Management, Ocean/Marine Sciences, Health
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (2026-27 cohort, verified — GUARANTEED for standard program length + 1 year): Agriculture CAD $30,906; Arts & Social Sciences / Science $37,992; Computer Science $41,688; Management $42,042; Engineering $48,594 (~$22,600–$35,500 USD). Incidental and co-op fees extra; mandatory health insurance included in student fees.
  Deadline: NOT verified — confirm on dal.ca

Simon Fraser University (SFU) — Burnaby/Vancouver (British Columbia), Canada [VERIFIED — sfu.ca Fall 2026 calendar]
  Type: Major BC public university; strong co-op options across programmes
  Known for: Computing Science, Business (Beedie), Engineering, Communication, Interactive Arts
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (Fall 2026 calendar, verified, per unit — 2024/25+ entry cohort): base $1,262.88/unit → ~CAD $37,886/yr at 30 units (~$27,700 USD). Upper-division premiums: Computing Science $1,327.97, Engineering $1,348.19, Beedie Business $1,492.13/unit (→ up to ~CAD $44,764/yr ≈ $32,700 USD). Increases capped at ~6%/yr for continuing students.
  Deadline: NOT verified — confirm on sfu.ca
  Note: Cheaper than UBC for a Vancouver-area education, but Vancouver living costs still apply.

Memorial University of Newfoundland — St. John's (Newfoundland), Canada [VERIFIED — mun.ca/undergrad/money-matters]
  Type: Newfoundland's public university — among the CHEAPEST anglophone universities in Canada; popular budget pick for international students
  Known for: Engineering, Marine/Ocean Sciences, Computer Science, Business, Nursing
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies by programme — confirm on official site
  International tuition (2025-26, verified): CAD $22,500 for two semesters / 10 courses (~$16,400 USD/yr). Mandatory fees ~CAD $923/yr (services, union, recreation, health insurance). Residence CAD $4,987–$5,993/semester. ⚠ 2026-27 fees pending review at research time — confirm before quoting.
  Deadline: NOT verified — confirm on mun.ca

University of Ottawa — Ottawa (Ontario), Canada [VERIFIED exemption — uottawa.ca]
  Type: The world's largest bilingual (English/French) university — in Canada's capital
  Known for: Law, Medicine, Political Science, Engineering
  Language: Bilingual — study in English, French, or both
  Tuition: varies by faculty (verified 2024-25 example: Arts ~CAD $21,668/term ≈ ~$43,000 CAD/yr) — confirm current rates on uottawa.ca
  ★ DIFFERENTIAL TUITION FEE EXEMPTION (verified, AUTOMATIC): internationals enrolled in a French-taught or French-immersion programme (≥6 units/term in French) get a large automatic scholarship — verified example cut Arts from $21,667.54 to $9,167.54 per TERM (near-domestic fees). A game-changer for French-speaking students, especially West/North Africa.
  Deadline: September main intake — apply months ahead for study-permit lead time

Carleton University — Ottawa (Ontario), Canada [VERIFIED — carleton.ca Fall 2026]
  Type: Ottawa's other big university — famous journalism school, strong aerospace/CS
  Known for: Journalism, Aerospace Engineering, Computer Science, International Relations
  International tuition (Fall 2026, verified): CAD $39,000–$55,000/yr by programme, LOCKED for 3 years (2026-27 → 2028-29) + ~CAD $2,500 mandatory fees (UHIP, U-Pass transit, athletics). The fee lock makes budgeting predictable.
  Deadline: September main intake — confirm on carleton.ca

Western University — London (Ontario), Canada [VERIFIED range — registrar.uwo.ca 2025-26]
  Type: Classic Canadian campus university — home of the Ivey Business School
  Known for: Business, Medicine, Health Sciences, Engineering
  International tuition (2025-26, verified official fee schedule): ~CAD $43,000–$58,000/yr by programme; professional programmes (Ivey HBA) substantially more. Verified policy: increases capped at 4%/yr after first year.
  Deadline: September via OUAC — confirm on uwo.ca

York University — Toronto (Ontario), Canada [VERIFIED rate — futurestudents.yorku.ca 2026-27]
  Type: Toronto's big second university — Schulich business, Osgoode law, famous film school
  Known for: Business, Law, Film, Liberal Arts (Glendon campus is bilingual)
  International tuition (2026-27, verified): CAD $1,203.68/credit + $43.29 supplementary → standard 30-credit year ≈ CAD $37,400. Professional programmes cost more.
  Deadline: September via OUAC — confirm on yorku.ca

Concordia University — Montreal (Quebec), Canada [VERIFIED — concordia.ca 2025-26]
  Type: Practical, career-focused Montreal university — strong film, engineering, co-op culture
  Known for: Film, Engineering, Business, Fine Arts
  International tuition (2025-26, verified): CAD $32,050–$43,860/yr by programme; some internationals qualify for up to $4,000 off published rates. Montreal is one of North America's cheapest major student cities.
  Deadline: Fall (Sept) and Winter (Jan) intakes for many programmes — confirm on concordia.ca

Université de Montréal (UdeM) — Montreal (Quebec), Canada [VERIFIED — umontreal.ca 2025-26]
  Type: The francophone world's leading research university outside France — home of the Mila AI institute (Yoshua Bengio)
  Known for: Medicine, Law, AI & Computer Science, Computer Science
  Language: FRENCH-medium instruction (most programmes) — French proficiency tests required (TEF/TCF/DELF-DALF)
  International tuition (2025-26, verified): ~CAD $29,877/yr undergraduate + mandatory health insurance ~CAD $300/trimester.
  ★ UdeM Exemption Scholarship (verified): every admitted international student is AUTOMATICALLY assessed — can cut tuition substantially. France/Belgium citizens pay Quebec rates by treaty. THE francophone AI destination.
  Deadline: Fall main intake — confirm windows on admission.umontreal.ca

University of Manitoba — Winnipeg (Manitoba), Canada [VERIFIED — umanitoba.ca 2025-26]
  Type: Western Canada's oldest university — one of the more affordable research options
  Known for: Agriculture, Engineering, Medicine, Business
  International tuition (2025-26 estimated averages, verified): Arts ~CAD $19,914, Business ~$23,857, Engineering ~$27,059 + mandatory MISHP health plan. Winnipeg is one of Canada's cheapest major cities.
  Deadline: Fall and Winter intakes — confirm on umanitoba.ca

University of Saskatchewan — Saskatoon, Canada [VERIFIED — usask.ca 2025-26 factsheet]
  Type: Research university famous for agriculture, water science and vaccines (VIDO)
  Known for: Agriculture, Engineering, Medicine, Veterinary Medicine
  International tuition (2025-26, verified): CAD $37,878–$60,823/yr by programme + ~$1,308 fees. ⚠ No longer a budget option — steer cost-focused students to Manitoba/Memorial instead.
  Deadline: Fall main intake — confirm on usask.ca

University of Regina — Regina (Saskatchewan), Canada [VERIFIED — uregina.ca 2026-27]
  Type: Mid-size prairie university known for co-op programmes and journalism
  Known for: Engineering, Business, Education, Journalism
  International tuition (2026-27, verified): ≈ CAD $32,500/yr average incl. fees (varies by faculty). ⚠ RISING: the 2026-27 budget raises the international multiplier from 3.0× to 3.5× domestic — older guides understate costs.
  Deadline: Fall, Winter and Spring intakes for many programmes — confirm on uregina.ca

Qatar University (QU) — Doha, Qatar [VERIFIED — qu.edu.qa]
  Type: Qatar's national university — the country's largest by far
  Known for: Engineering, Business, Law, Pharmacy, Medicine, Islamic Studies
  Language: Mixed — many programmes are English-medium (especially Engineering, Business and Health); others are Arabic-medium. Confirm per programme.
  Tests: English-taught programmes require IELTS / TOEFL — minimum varies; confirm on official site
  International tuition (verified — students admitted Fall 2023+, per credit hour): Arts/Education/Law/Sharia QAR 1,100; Business/Sciences/Health Sciences/Nursing QAR 1,200; Engineering/Pharmacy QAR 1,400 → ~QAR 33,000–42,000/yr at 30 credit hours (~$9,050–$11,550 USD). Medicine and Dental Medicine charge ANNUAL fees instead — confirm on official site. Fees are charged by the college of the COURSE, not the student's major.
  Deadline: Fall and Spring intakes — application windows NOT verified; confirm on qu.edu.qa
  Scholarship here: International Students Scholarship (full package, 95%+ average) and Talent Scholarship (80%+ with documented talent) — see scholarships #18/#19

Carnegie Mellon University in Qatar (CMU-Q) — Doha (Education City), Qatar [VERIFIED — tuition via cmu.edu/sfs; same-as-Pittsburgh policy per CMU-Q admissions]
  Type: Branch campus of Carnegie Mellon University (US) — same degree as the US campus
  Known for: Computer Science, Information Systems, Business Administration, Biological Sciences
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies — confirm on official site
  Tuition: Same as CMU Pittsburgh — $69,702 for 2026-27 (verified, cmu.edu fee schedule). QF need-based grants up to the FULL cost of attendance available to students of all nationalities (see scholarship #21).
  Deadline: Applications via CMU-Q — deadlines NOT verified; confirm on qatar.cmu.edu
  ⚠ Sticker price is US-level; realistic affordability depends on QF aid.

Georgetown University in Qatar (GU-Q) — Doha (Education City), Qatar [VERIFIED — tuition via studentaccounts.georgetown.edu; GU-Q charges the same as Washington DC]
  Type: Branch campus of Georgetown University (US) — Bachelor of Science in Foreign Service
  Known for: International Politics, International Economics, Culture & Politics, International History
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies — confirm on official site
  Tuition: Same as Georgetown DC — $74,520 for 2026-27 (verified) plus ~$2,172 in activity/insurance/textbook fees
  Financial aid: NEED-BLIND admission; GU-Q commits to meeting demonstrated financial need via grants, scholarships and sponsorships — most students receive some aid (see scholarship #21)
  Deadline: NOT verified — confirm on qatar.georgetown.edu

Northwestern University in Qatar (NU-Q) — Doha (Education City), Qatar [VERIFIED — my.qatar.northwestern.edu]
  Type: Branch campus of Northwestern University (US) — same degree
  Known for: Journalism, Communication, Media Industries & Technology
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies — confirm on official site
  Tuition (2026-27, verified): $71,802/yr; total with fees $73,990 (off-campus) or $80,090 (on-campus). Textbook fee $1,000; health fee ~$894.
  Financial aid: Limited highly competitive merit scholarships (automatic consideration) + QF interest-free education loans; on-campus jobs pay QAR 45–60/hr up to 20 hrs/week
  Deadline: Applies via the Common App — deadlines NOT verified; confirm on qatar.northwestern.edu

Weill Cornell Medicine – Qatar (WCM-Q) — Doha (Education City), Qatar [VERIFIED — qatar-weill.cornell.edu]
  Type: Branch of Weill Cornell Medical College (US) — integrated pre-medical + medical programme leading to the Cornell MD
  Known for: Medicine (MD) — the only US MD available in the Gulf region
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies — confirm on official site
  Tuition: $71,505 for the 2025-26 medical curriculum year (verified — same tuition as Weill Cornell New York). Tuition is billed by Qatar Foundation, not the college.
  Financial aid: Non-Qatari students may receive QF need-based ZERO-INTEREST loans; Qatari citizens are funded via the Ministry of Education
  Deadline: NOT verified — confirm on qatar-weill.cornell.edu

Hamad Bin Khalifa University (HBKU) — Doha (Education City), Qatar [VERIFIED — hbku.edu.qa]
  Type: Qatar Foundation's own research university — primarily GRADUATE programmes (master's/PhD) across STEM, social sciences, Islamic studies and law
  Known for: Computing/AI, Sustainability & Energy, Biomedical Sciences, Islamic Finance, Law, Public Policy
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies — confirm on official site
  Tuition (verified from the official scholarship policy): QAR 4,000/credit for STEM programmes, QAR 2,500/credit for SHAPE (humanities/social science) and law — but most admitted students receive substantial waivers (60–100%) plus stipends (see scholarship #20). Self-sponsored need-based rate QAR 2,000/credit.
  Deadline: NOT verified — confirm on hbku.edu.qa

Virginia Commonwealth University School of the Arts in Qatar (VCUarts Qatar) — Doha (Education City), Qatar [PARTIALLY VERIFIED — tuition NOT verified]
  Type: Branch campus of VCU (US) — the Gulf's leading art & design school
  Known for: Graphic Design, Interior Design, Fashion Design, Painting & Printmaking, Art History
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies — confirm on official site
  Tuition: NOT VERIFIED — the official tuition page was unreachable during research; it stated 2026-27 rates would post ~mid-May 2026. Do NOT quote figures; confirm on qatar.vcu.edu. QF need-based aid applies (see scholarship #21).
  Deadline: NOT verified — confirm on qatar.vcu.edu

University of Doha for Science and Technology (UDST) — Doha, Qatar [PARTIALLY VERIFIED — tuition NOT verified]
  Type: Qatar's national applied/polytechnic university — hands-on bachelor's, diplomas and certificates
  Known for: Engineering Technology, Computing/IT, Business Management, Health Sciences
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies — confirm on official site
  Tuition: NOT VERIFIED — udst.edu.qa was unreachable during research (third-party guides suggest roughly QAR 40,000–70,000/yr but do NOT quote this as fact). Application fee ~QAR 300 per third-party sources — also unconfirmed. Confirm on udst.edu.qa.
  Deadline: NOT verified — confirm on udst.edu.qa

Doha Institute for Graduate Studies (DI) — Doha, Qatar [PARTIALLY VERIFIED — programme facts official; scholarship availability UNCLEAR]
  Type: Independent GRADUATE-only institute — master's/PhD in social sciences, humanities, public administration and development economics; strong Arabic-language focus with some English-taught programmes
  Known for: Social Sciences, Humanities, Public Policy, Development Economics, Media Studies, Psychology & Social Work
  Language: Primarily Arabic-medium with English components — confirm per programme
  Tuition: NOT VERIFIED — confirm on dohainstitute.edu.qa
  ⚠ IMPORTANT: Aggregator sites heavily advertise a "fully funded Tamim bin Hamad Scholarship" (tuition + housing + stipend + flights) with a ~Jan 15 deadline, but DI's official scholarships page listed NO scholarships when checked in July 2026 (only 2027-28 admission deadlines). Tell users to verify current scholarship availability directly with DI's admissions office before planning around it.

Lusail University — Lusail (Doha area), Qatar [PARTIALLY VERIFIED — tuition NOT verified]
  Type: Private Qatari university (growing, established 2020s) — law, business, media and technology programmes
  Known for: Law, Business Administration, Media, Computer Science
  Language: Arabic and English — confirm per programme
  Tuition: NOT VERIFIED — the official fee page returned an error during research (third-party sources suggest ~QAR 1,500/credit hour for Law/Business, roughly QAR 60,000–75,000/yr, but do NOT quote this as fact). Confirm on lu.edu.qa.
  Deadline: NOT verified — confirm on lu.edu.qa

New York University Abu Dhabi (NYUAD) — Abu Dhabi (Saadiyat Island), UAE [VERIFIED — nyuad.nyu.edu]
  Type: Full degree-granting NYU campus — same NYU degree; one of the world's most selective liberal-arts/research campuses
  Known for: Liberal Arts & Sciences, Engineering, Computer Science, Economics, Film & New Media
  Language: English-medium instruction
  Tests: Test-flexible policies change — confirm current requirements on official site
  Cost (2026-27, verified): tuition $68,576; total cost of attendance ~$90,328 (NYU housing and meal plan are REQUIRED). But financial aid is need-based and exceptional — many students pay far less (see scholarship #23).
  Deadlines (verified): Early Decision I Nov 1, Early Decision II Jan 1, Regular Decision Jan 5 (Common App); CSS Profile Nov 10 / Jan 10 / Feb 1
  ⚠ Extremely competitive — finalists attend a Candidate Weekend in Abu Dhabi before final decisions.

Khalifa University — Abu Dhabi, UAE [VERIFIED — ku.ac.ae]
  Type: UAE's flagship STEM/research university
  Known for: Engineering, Computer Science, Aerospace, Petroleum Engineering, Medicine & Health Sciences
  Language: English-medium instruction
  Tests: IELTS / TOEFL / EmSAT required; minimum varies — confirm on official site
  Tuition (verified): AED 2,500 per credit hour → ~AED 75,000/yr at 30 credit hours (~$20,400 USD) — but tiered scholarships waive 25–100% of tuition for strong international admits (see scholarship #22)
  Deadline: NOT verified — confirm on ku.ac.ae
  Scholarship here: automatic tiered tuition waivers up to 100% + free textbooks (see scholarship #22)

United Arab Emirates University (UAEU) — Al Ain (Abu Dhabi emirate), UAE [PARTIALLY VERIFIED — rates published on official pages but the site was unreachable for direct confirmation]
  Type: The UAE's national/federal university — oldest in the country
  Known for: Engineering, IT, Business, Law, Medicine, Education
  Language: English-medium for most programmes; some Arabic — confirm per programme
  Tests: IELTS / TOEFL / EmSAT required; minimum varies — confirm on official site
  Tuition (per official UAEU student-account pages, stated valid through 2025-26 — uaeu.ac.ae was unreachable during research, treat with care): AED 1,900/credit hour (Humanities/Education/Law), AED 2,300 (Business), AED 2,500 (Engineering/IT/Health) → ~AED 57,000–75,000/yr (~$15,500–$20,400 USD). On-campus housing available for international students.
  Deadline: NOT verified — confirm on uaeu.ac.ae

American University of Sharjah (AUS) — Sharjah, UAE [VERIFIED — aus.edu]
  Type: American-curriculum private university — one of the Gulf's best-known
  Known for: Engineering, Architecture, Business, Design, International Studies
  Language: English-medium instruction
  Tuition (2026-27, verified): AED 110,876/yr for all majors (AED 55,438/semester for 12–16 credits) ≈ ~$30,200 USD; technology fees may apply
  Deadline: NOT verified — confirm on aus.edu
  Scholarship here: merit scholarships and financial grants exist — confirm current options on aus.edu

University of Sharjah (UOS) — Sharjah, UAE [PARTIALLY VERIFIED — tuition NOT verified]
  Type: Large comprehensive university (separate from AUS) — broad programme range including Medicine and Dentistry
  Known for: Medicine, Dentistry, Engineering, Business, Communication, Law
  Language: English and Arabic — confirm per programme
  Tuition: NOT VERIFIED — the official fee PDF was unreachable during research (third-party summaries suggest roughly AED 31,000–66,000/yr for most undergraduate programmes, but do NOT quote this as fact). Confirm on sharjah.ac.ae.
  Deadline: NOT verified — confirm on sharjah.ac.ae

American University in Dubai (AUD) — Dubai, UAE [VERIFIED — aud.edu]
  Type: American-curriculum private university in Dubai Media City
  Known for: Business, Architecture, Engineering, Communication, Design
  Language: English-medium instruction
  Tuition (verified, current rates): AED 53,025 tuition + AED 1,000 services/technology fee per semester → AED 108,050/yr including 5% VAT (~$29,400 USD). Application fee AED 420. Books not included.
  Deadline: NOT verified — confirm on aud.edu

Heriot-Watt University Dubai — Dubai, UAE [PARTIALLY VERIFIED — fee structure official; amounts per programme NOT verified]
  Type: Dubai campus of Heriot-Watt University (UK) — same UK degree
  Known for: Engineering, Business, Computer Science, Architecture/Built Environment
  Language: English-medium instruction
  Tuition: Listed per programme in the official online prospectus — NOT verified here; aggregators suggest ~AED 68,700–82,200 first year but do NOT quote as fact. Verified details: AED 300 application fee; 10% of first-year fee + AED 1,000 refundable deposit due at offer acceptance; a hardship scholarship exists.
  Deadline: NOT verified — confirm on hw.ac.uk/dubai

University of Wollongong in Dubai (UOWD) — Dubai, UAE [PARTIALLY VERIFIED — tuition NOT verified]
  Type: Dubai campus of the University of Wollongong (Australia) — the UAE's oldest international university
  Known for: Business, Engineering, Computer Science, Media & Communication
  Language: English-medium instruction
  Tuition: NOT VERIFIED — the official fee page blocked access during research (third-party listings suggest ~AED 57,600–67,200 first year, but do NOT quote this as fact). Fees are paid per trimester by subjects enrolled. Confirm on uowdubai.ac.ae.
  Scholarship here: UOWD advertises academic merit scholarships (reportedly 15–50%) and sports bursaries — NOT verified; confirm on the official site
  Deadline: NOT verified — confirm on uowdubai.ac.ae

University of Birmingham Dubai — Dubai, UAE [PARTIALLY VERIFIED — fee policies official; amounts per programme NOT verified]
  Type: Dubai campus of the University of Birmingham (UK, Russell Group) — same UK degree
  Known for: Business, Computer Science, Engineering, Education, Psychology
  Language: English-medium instruction
  Tuition: Listed per programme on official course pages — NOT verified here; 2026 listings suggest roughly AED 109,000–135,000/yr but do NOT quote as fact. Verified policies: AED 5,000 tuition deposit at offer acceptance; undergraduate fees are LOCKED for the course duration; termly instalment plans available.
  Deadline: NOT verified — confirm on birmingham.ac.uk/dubai

Rochester Institute of Technology Dubai (RIT Dubai) — Dubai (Silicon Oasis), UAE [VERIFIED — rit.edu/dubai]
  Type: Dubai campus of RIT (US) — same US degree; strong co-op/industry orientation
  Known for: Cybersecurity, Computing, Engineering, Finance, Marketing, Psychology, New Media Design
  Language: English-medium instruction
  Tuition (verified, students admitted Fall 2023+): AED 68,000/yr flat across all bachelor's programmes (official USD figure: $18,516). Extras: AED 2,500 enrolment deposit, ~AED 500/semester books, AED 860 lab fee per applicable course.
  Deadline: NOT verified — confirm on rit.edu/dubai
  Scholarship here: merit scholarships up to 50% (see scholarship #25)

Mohamed bin Zayed University of Artificial Intelligence (MBZUAI) — Abu Dhabi (Masdar City), UAE [VERIFIED — mbzuai.ac.ae]
  Type: GRADUATE-only AI research university — one of the world's first dedicated AI universities
  Known for: Machine Learning, Computer Vision, NLP, Robotics, Computational Biology
  Language: English-medium instruction
  Tests: IELTS / TOEFL + GRE (optional/varies) — confirm on official site
  Cost: Effectively FREE for admitted students — every full-time MSc/PhD student receives 100% tuition + stipend (see scholarship #24)
  Deadlines (2026 intake, verified): priority Nov 15, final Dec 15 for most programmes; decisions Mar 15
  ⚠ Highly competitive; scholarships exclude the MAAI programme.

Ajman University — Ajman, UAE [PARTIALLY VERIFIED — tuition NOT verified]
  Type: Private university in the northern emirates — among the UAE's more affordable options, large international student body
  Known for: Dentistry, Pharmacy, Engineering, Business, Mass Communication
  Language: English and Arabic — confirm per programme
  Tuition: NOT VERIFIED — the official fee brochure PDF could not be parsed during research (a third-party example cites ~AED 1,300/credit hour for Engineering, but do NOT quote this as fact). Confirm on ajman.ac.ae.
  Deadline: NOT verified — confirm on ajman.ac.ae

Zayed University — Dubai & Abu Dhabi, UAE [NOT VERIFIED fees — confirm on zu.ac.ae]
  Type: Federal university with campuses in both Dubai and Abu Dhabi
  Known for: Business, Communication, IT, Education
  Fees/deadline: NOT verified — per-credit international fees; confirm on zu.ac.ae.

Middlesex University Dubai — Dubai (Knowledge Park), UAE [NOT VERIFIED fees — confirm on mdx.ac.ae]
  Type: One of Dubai's largest UK branch campuses — a UK degree at Dubai-branch pricing
  Known for: Business, Computer Science, Media, Psychology
  Fees/deadline: NOT verified — branch fees typically well below UK-in-UK costs; merit/early-payment discounts common. Confirm on mdx.ac.ae.

Manipal Academy of Higher Education, Dubai — Dubai (Academic City), UAE [NOT VERIFIED fees — confirm on manipaldubai.com]
  Type: Dubai campus of India's best-known private university brand (MAHE — also in the India list)
  Known for: Engineering, Business, Media, Health Sciences
  Fees/deadline: NOT verified — typically between Indian and Western pricing; confirm on manipaldubai.com.

King Abdullah University of Science and Technology (KAUST) — Thuwal (near Jeddah), Saudi Arabia [VERIFIED — admissions.kaust.edu.sa]
  Type: GRADUATE-only elite STEM research university — every admitted student is funded
  Known for: AI/Computer Science, Bioscience, Chemical & Materials Science, Earth Science, Electrical Engineering, Marine Science
  Language: English-medium instruction (fully international campus)
  Tests: IELTS / TOEFL required; GRE optional/varies — confirm on official site
  Cost: Effectively FREE — the KAUST Fellowship covers tuition, stipend ($20,000–$30,000/yr), housing, health insurance and relocation for full-time admitted MS/PhD students (see scholarship #26)
  Deadline: Rolling/annual cycles — confirm on admissions.kaust.edu.sa
  ⚠ Self-contained international campus community on the Red Sea; highly competitive research admission.

King Fahd University of Petroleum and Minerals (KFUPM) — Dhahran, Saudi Arabia [PARTIALLY VERIFIED — figures via official pages; site unreachable for direct confirmation]
  Type: Saudi Arabia's top-ranked technical university — strong energy/engineering reputation
  Known for: Petroleum Engineering, Engineering, Computer Science, Applied Sciences, Business
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies — confirm on official site
  Tuition: Non-Saudi undergraduates ~SR 20,000/yr (~$5,300 USD) per official pages (NOT directly confirmed — kfupm.edu.sa blocked access); need/merit-based undergraduate scholarships exist. Graduates: full scholarships (see scholarship #28).
  Deadline: NOT verified — confirm on kfupm.edu.sa
  Note: Historically male-only; began admitting women in recent years — confirm current policy per programme.

King Saud University (KSU) — Riyadh, Saudi Arabia [PARTIALLY VERIFIED — PhD initiative verified; general scholarship details via platform]
  Type: Saudi Arabia's oldest and largest university
  Known for: Medicine, Engineering, Sciences, Business, Arabic Language Institute
  Language: Arabic and English (STEM/medicine largely English) — confirm per programme
  Tests: Varies by programme — confirm on official site
  Cost for internationals: Mainly via FULL scholarships — the verified Distinguished Graduate Studentship for PhD (see scholarship #29) and general full scholarships (tuition + stipend + housing + flights) via the Study in Saudi platform (see #27). Self-funded tuition rates NOT verified.
  Deadline: Periodic scholarship windows — confirm on ksu.edu.sa / studyinsaudi.moe.gov.sa

King Abdulaziz University (KAU) — Jeddah, Saudi Arabia [PARTIALLY VERIFIED — scholarship existence official; benefit details not directly confirmed]
  Type: One of Saudi Arabia's largest and highest-ranked universities
  Known for: Engineering, Medicine, Sciences, Business, Marine Sciences
  Language: Arabic and English — confirm per programme
  Tuition: For internationals the route is external scholarships — official pages describe full scholarships (monthly bursary + accommodation + healthcare + two-way airfare + arrival allowance) for bachelor's and postgraduate applicants residing outside Saudi Arabia. Benefit specifics NOT directly confirmed (the official page would not render); apply via kau.edu.sa or the Study in Saudi platform.
  Deadline: NOT verified — confirm on kau.edu.sa

Islamic University of Madinah — Madinah, Saudi Arabia [PARTIALLY VERIFIED — programme facts widely documented; benefits from aggregators, treat with caution]
  Type: Public university focused on Islamic studies and Arabic, plus science/engineering colleges — MEN ONLY
  Known for: Islamic Studies, Arabic Language, Sharia, plus Engineering and Computer Science colleges
  Language: Arabic-medium (extensive free Arabic-language preparation); some science programmes use English — confirm per programme
  Cost for internationals: Via full scholarships — aggregators consistently report monthly allowance + furnished housing + healthcare + flight on admission and annual return tickets + excellence bonuses, with undergrad applications (ages ~17–25) via the Study in Saudi platform. NOT directly verified — confirm via studyinsaudi.moe.gov.sa.
  Deadline: Reported ~mid-June for undergraduate (2026 cycle) — NOT verified; master's reportedly year-round
  ⚠ Male applicants only.

Umm Al-Qura University — Makkah, Saudi Arabia [PARTIALLY VERIFIED — scholarship office official; benefit details NOT verified]
  Type: Public university in Islam's holiest city — Islamic studies, Arabic, plus medicine/engineering
  Known for: Islamic Law (Sharia), Arabic for Non-Native Speakers, Medicine, Engineering
  Language: Arabic-medium primarily — confirm per programme
  Cost for internationals: Via internal (residents) and external (overseas) scholarships — full awards reportedly cover tuition + monthly stipend + housing + annual airfare + health insurance; partial awards exist. Benefit specifics NOT directly verified; apply via uqu.edu.sa or the Study in Saudi platform.
  Deadline: NOT verified — confirm on uqu.edu.sa
  ⚠ Non-Muslims cannot reside/study in Makkah's holy district — this university is realistic only for Muslim applicants.

Alfaisal University — Riyadh, Saudi Arabia [PARTIALLY VERIFIED — tuition via official pages; site unreachable for direct confirmation]
  Type: Private non-profit research university (founded by the King Faisal Foundation)
  Known for: Medicine, Engineering, Business, Pharmacy
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies — confirm on official site
  Tuition: SR 94,000/yr + 5% VAT for all undergraduate degrees (~SR 98,700 ≈ $26,300 USD) per official admissions pages — NOT directly confirmed (page failed to load); merit scholarships are open to international applicants. Confirm on admissions.alfaisal.edu.
  Deadline: NOT verified — confirm on alfaisal.edu

Prince Sultan University (PSU) — Riyadh, Saudi Arabia [PARTIALLY VERIFIED — fees via official pages; site unreachable for direct confirmation]
  Type: Saudi Arabia's first private university
  Known for: Business, Computer Science, Engineering, Law, Architecture
  Language: English-medium instruction
  Tests: IELTS / TOEFL required; minimum varies — confirm on official site
  Tuition: SAR 3,000/credit hour for students enrolling 2025+ (per official pages — NOT directly confirmed); minimum billing 12 credit hours/semester; +15% VAT for non-Saudis → a 30-credit year ≈ SAR 103,500 incl. VAT (~$27,600 USD). Confirm on psu.edu.sa.
  Deadline: NOT verified — confirm on psu.edu.sa

Prince Mohammad Bin Fahd University (PMU) — Al Khobar, Saudi Arabia [PARTIALLY VERIFIED — tuition NOT verified]
  Type: Private university in the Eastern Province
  Known for: Engineering, Business, IT, Law, Architecture
  Language: English-medium instruction
  Tuition: NOT VERIFIED — the official fee pages refused connections during research (third-party sources suggest ~SAR 58,000/yr, roughly $15,500 USD, but do NOT quote this as fact). Confirm on pmu.edu.sa.
  Deadline: NOT verified — confirm on pmu.edu.sa

Effat University — Jeddah, Saudi Arabia [PARTIALLY VERIFIED — tuition NOT verified]
  Type: Private non-profit WOMEN's university — one of the Kingdom's most international campuses (~44% international students per third-party sources)
  Known for: Engineering, Architecture, Business, Computer Science, Cinematic Arts
  Language: English-medium instruction
  Tuition: NOT VERIFIED — third-party sources suggest roughly SR 70,000/yr but do NOT quote this as fact; scholarships and financial aid are advertised for international students. Confirm on effatuniversity.edu.sa.
  Deadline: NOT verified — confirm on effatuniversity.edu.sa
  ⚠ Women only.

Princess Nourah bint Abdulrahman University (PNU) — Riyadh, Saudi Arabia [NOT VERIFIED — women only]
  Type: The world's LARGEST women's university — purpose-built Riyadh mega-campus
  Known for: Medicine, Business, Education, Computer Science
  Notes: Saudi government universities offer scholarship seats (tuition + stipend + housing model) to international students — confirm routes on pnu.edu.sa. ⚠ Women only.

Taibah University — Madinah, Saudi Arabia [NOT VERIFIED fees — scholarship-seat route]
  Type: Public university in Madinah — international scholarship seats in the Islamic University tradition
  Known for: Islamic Studies, Medicine, Engineering, Science
  Notes: international scholarship seats (tuition + stipend + housing model, often allocated per country) are the main route — confirm current windows on taibahu.edu.sa. Mostly Arabic-medium; Arabic preparatory programmes exist.

Boğaziçi University — Istanbul, Turkey [PARTIALLY VERIFIED — fees via official student pages; confirm current year]
  Type: Turkey's most prestigious public university — English-medium, Bosphorus campus
  Known for: Engineering, Economics & Administrative Sciences, Computer Science, Social Sciences
  Language: English-medium instruction
  International tuition (per official student portal pages — confirm current year): $4,000/semester for Education/Science/Humanities/Law faculties, $5,000/semester for Engineering and Economics & Administrative Sciences → ~$8,000–$10,000/yr, paid in USD
  Admission: International quota — SAT / national diplomas / YÖS-type criteria; extremely competitive. Deadline NOT verified — confirm on bogazici.edu.tr
  Scholarship here: Türkiye Bursları placements possible (see #30)

Middle East Technical University (METU/ODTÜ) — Ankara, Turkey [PARTIALLY VERIFIED — fee schedule exists officially but was not machine-readable]
  Type: Top public technical university — fully English-medium
  Known for: Engineering, Computer Science, Architecture, Natural Sciences, Economics
  Language: English-medium instruction
  International tuition: Set annually in TL per the official fee PDF (iso.metu.edu.tr) — NOT extracted during research; public fees are low by international standards, with a small USD minimum applied per the Official Gazette. Do NOT quote figures; confirm on iso.metu.edu.tr.
  Admission: METU international admissions use SAT/national qualifications; very competitive. Deadline NOT verified.
  Scholarship here: Türkiye Bursları placements possible (see #30)

Istanbul Technical University (ITU) — Istanbul, Turkey [PARTIALLY VERIFIED — tuition NOT verified]
  Type: One of the world's oldest technical universities (1773) — public
  Known for: Engineering (all branches), Architecture, Maritime, Computer Science
  Language: Many programmes 30–100% English — confirm per programme
  International tuition: NOT VERIFIED — official fee pages exist (sis.itu.edu.tr) but per-programme amounts were not extracted; public fees are modest. Confirm on itu.edu.tr.
  Deadline: NOT verified — confirm on itu.edu.tr

Koç University — Istanbul, Turkey [PARTIALLY VERIFIED — site blocked direct access; figures consistent across official-derived sources]
  Type: Turkey's top private/foundation university
  Known for: Engineering, Medicine, Business, Law, Social Sciences
  Language: English-medium instruction
  International tuition (2025-26, per official-derived sources): ~$21,500/yr for most programmes; Medicine $29,000/yr. Dormitories $1,600–$4,800/yr. Confirm on international.ku.edu.tr.
  Deadline: Rolling/multiple rounds — NOT verified; confirm on official site
  Scholarship here: automatic merit waivers 25–100% (see scholarship #31)

Sabancı University — Istanbul, Turkey [PARTIALLY VERIFIED — fee per official announcement, page requires login; confirm]
  Type: Top private/foundation university — interdisciplinary "no departments at entry" model
  Known for: Engineering & Natural Sciences, Computer Science, Business, Social Sciences
  Language: English-medium instruction
  International tuition: $36,500/yr for 2025-26 per the university's announcements (detail page sits behind the student portal — confirm on sabanciuniv.edu). Merit waivers of 25–75% (occasionally 100%) reported.
  Deadline: NOT verified — confirm on sabanciuniv.edu

Bilkent University — Ankara, Turkey [PARTIALLY VERIFIED — scholarships verified; tuition NOT verified]
  Type: Turkey's first private non-profit university — strong international reputation
  Known for: Engineering, Computer Science, Economics, International Relations, Music
  Language: English-medium instruction
  International tuition: NOT VERIFIED — confirm on bilkent.edu.tr. What IS verified: tuition-waiver scholarships at 20/40/60/80/100% assessed at admission, plus accommodation scholarships for top full-waiver students (see scholarship #32).
  Deadline: NOT verified — confirm on bilkent.edu.tr

Özyeğin University — Istanbul, Turkey [PARTIALLY VERIFIED — via official admissions pages]
  Type: Private/foundation university — entrepreneurship-focused
  Known for: Engineering, Business, Aviation, Hotel Management, Architecture
  Language: English-medium instruction
  International tuition: From ~$22,000/yr (varies by programme, charged in USD) per official admissions pages — confirm on admissions.ozyegin.edu.tr
  Scholarship here: full-tuition international scholarships for excellent records + 25% merit and athletic awards (see scholarship #33)
  Deadline: NOT verified — confirm on official site

Istanbul University — Istanbul, Turkey [NOT VERIFIED — public fees set annually in TL; confirm on istanbul.edu.tr]
  Type: Turkey's oldest university (1453) — huge public university
  Known for: Medicine, Law, Literature, History, Business
  Language: Mostly Turkish-medium; some English programmes — confirm per programme
  Tuition/deadline: NOT verified — public international fees are set annually in TL and are typically low; confirm on istanbul.edu.tr

Hacettepe University — Ankara, Turkey [NOT VERIFIED — confirm on hacettepe.edu.tr]
  Type: Leading public university, especially in health sciences
  Known for: Medicine, Dentistry, Pharmacy, Health Sciences, Engineering
  Language: Mix of Turkish- and English-medium (Medicine has an English track) — confirm per programme
  Tuition/deadline: NOT verified — public fees set annually in TL; confirm on hacettepe.edu.tr

Ankara University — Ankara, Turkey [NOT VERIFIED — confirm on ankara.edu.tr]
  Type: The republic's first university — major public institution
  Known for: Law, Political Science, Medicine, Agriculture, Languages (TÖMER)
  Language: Mostly Turkish-medium — confirm per programme
  Tuition/deadline: NOT verified — public fees set annually in TL; confirm on ankara.edu.tr

Ege University — Izmir, Turkey [NOT VERIFIED — confirm on ege.edu.tr]
  Type: Major public university on the Aegean coast
  Known for: Medicine, Agriculture, Engineering, Fisheries, Pharmacy
  Language: Mostly Turkish-medium — confirm per programme
  Tuition/deadline: NOT verified — public fees set annually in TL; confirm on ege.edu.tr

Dokuz Eylül University — Izmir, Turkey [NOT VERIFIED — confirm on deu.edu.tr]
  Type: Large public university in Izmir
  Known for: Medicine, Law, Business (some English-medium), Maritime, Engineering
  Language: Mixed Turkish/English — confirm per programme
  Tuition/deadline: NOT verified — public fees set annually in TL; confirm on deu.edu.tr

Marmara University — Istanbul, Turkey [NOT VERIFIED — confirm on marmara.edu.tr]
  Type: Major public university (Asian side of Istanbul)
  Known for: Business (English/French/German tracks), Law, Medicine, Communication, Theology
  Language: Multi-language tracks (Turkish/English/French/German/Arabic) — confirm per programme
  Tuition/deadline: NOT verified — public fees set annually in TL; confirm on marmara.edu.tr

Yıldız Technical University — Istanbul, Turkey [NOT VERIFIED — confirm on yildiz.edu.tr]
  Type: Historic public technical university
  Known for: Engineering, Architecture, Naval Architecture, Computer Science
  Language: Mostly Turkish-medium with some English programmes — confirm per programme
  Tuition/deadline: NOT verified — public fees set annually in TL; confirm on yildiz.edu.tr

Gazi University — Ankara, Turkey [NOT VERIFIED — confirm on gazi.edu.tr]
  Type: Large public university
  Known for: Engineering, Education, Medicine, Dentistry
  Language: Mostly Turkish-medium — confirm per programme
  Tuition/deadline: NOT verified — public fees set annually in TL; confirm on gazi.edu.tr

Akdeniz University — Antalya, Turkey [NOT VERIFIED — confirm on akdeniz.edu.tr]
  Type: Public university on the Mediterranean coast — popular with international students
  Known for: Tourism, Medicine, Agriculture, Engineering
  Language: Mostly Turkish-medium; tourism/health have some English — confirm per programme
  Tuition/deadline: NOT verified — public fees set annually in TL; confirm on akdeniz.edu.tr

Anadolu University — Eskişehir, Turkey [NOT VERIFIED — confirm on anadolu.edu.tr]
  Type: Public university famous for one of the world's largest open/distance education systems, plus a conventional campus
  Known for: Open Education, Business, Communication, Fine Arts, Aviation
  Language: Mostly Turkish-medium — confirm per programme
  Tuition/deadline: NOT verified — fees set annually in TL; confirm on anadolu.edu.tr

Bursa Uludağ University — Bursa, Turkey [NOT VERIFIED — confirm on uludag.edu.tr]
  Type: Major public university in Turkey's fourth city
  Known for: Medicine, Engineering, Agriculture, Automotive-linked programmes
  Language: Mostly Turkish-medium — confirm per programme
  Tuition/deadline: NOT verified — public fees set annually in TL; confirm on uludag.edu.tr

Erciyes University — Kayseri, Turkey [NOT VERIFIED — confirm on erciyes.edu.tr]
  Type: Large public university in central Anatolia — known as a budget-friendly option
  Known for: Medicine, Engineering, Aviation, Pharmacy
  Language: Mostly Turkish-medium; Medicine has an English track — confirm per programme
  Tuition/deadline: NOT verified — public fees set annually in TL; confirm on erciyes.edu.tr

Bahçeşehir University (BAU) — Istanbul, Turkey [NOT VERIFIED — confirm on bau.edu.tr]
  Type: Private/foundation university with a global campus network — large international student body
  Known for: Business, Engineering, Communication, Law, Architecture
  Language: Largely English-medium — confirm per programme
  Tuition/deadline: NOT verified — third-party listings vary widely; confirm international fees on bau.edu.tr

University of Tehran (UT) — Tehran, Iran [PARTIALLY VERIFIED — official fee pages redirect-blocked; figures consistent across official-derived sources]
  Type: Iran's oldest and most prestigious comprehensive university ("the mother university")
  Known for: Engineering, Law & Political Science, Humanities, Natural Sciences, Persian Literature
  Language: Mostly Persian-medium (Persian prep courses offered); some graduate programmes have English options — confirm per programme
  International tuition (per official-derived sources — confirm on ut.ac.ir): by field, ~$850–$2,150 per semester → roughly $1,700–$4,300/yr (Persian Literature cheapest; Engineering/Sciences/Arts highest). Excludes housing and living costs.
  Deadline: NOT verified — confirm on international.ut.ac.ir
  Scholarship here: UT grants partial scholarships (stipend + insurance + registration fees) to ~20% of international applicants (see scholarship #35); MSRT placements also possible (see #34)

Sharif University of Technology — Tehran, Iran [VERIFIED — en.sharif.ir/admission]
  Type: Iran's premier engineering/technology university — famously strong alumni in global tech and academia
  Known for: Electrical & Computer Engineering, Mechanical Engineering, Physics, Mathematics, Aerospace
  Language: Persian-medium at bachelor's (prep courses available); some English-taught graduate options — confirm per programme
  International tuition (verified): undergraduate €1,000 fixed/semester + €20 per unit; graduate (MSc/PhD) €1,100 fixed/semester + €40 per unit → roughly €2,700–€3,000/yr. Excludes housing, insurance and living costs.
  Financial note (verified): self-supported applicants must show a bank balance covering ≥1 year of living costs (estimated minimum $14,000 by the university — a conservative figure; actual living costs in Iran run far lower).
  Deadline: NOT verified — confirm on en.sharif.ir
  Scholarship here: MSRT government scholarship placements possible (see #34)

Tehran University of Medical Sciences (TUMS) — Tehran, Iran [PARTIALLY VERIFIED — official fee page redirect-looped; figures consistent across official-derived sources]
  Type: Iran's top medical university — largest international programme, English-taught
  Known for: Medicine (MD), Dentistry, Pharmacy, Public Health, Nursing
  Language: English-taught programmes for internationals
  International tuition (Sept 2026 intake, per official-derived sources): MD $5,000–$7,500/yr depending on GPA/scores — locked for your cohort once admitted; undergraduate fee REDUCTIONS by prior GPA. No application fee; applications open year-round.
  Tests: IELTS 5.5 (or equivalent) required by registration time — low bar compared with Western medical schools
  Living (official TUMS guidance): ~$150–$200/month for a moderate student life
  Deadline: Applications open year-round for set intakes — confirm on en.tums.ac.ir
  ⚠ Verify degree recognition in the country where you plan to practise BEFORE enrolling in any foreign MD.

Al-Mustafa International University (MIU) — Qom, Iran [PARTIALLY VERIFIED — third-party sources; confirm with miu.ac.ir]
  Type: International religious university — Islamic studies and related humanities; students from 120+ countries
  Known for: Islamic Studies, Theology, Quranic Sciences, Persian/Arabic Language, Islamic Law
  Language: Persian and Arabic (language preparation provided)
  Cost: Reportedly FREE — tuition, stipend, housing and family support covered for admitted students (see scholarship #36). NOT directly verified.
  Admission: Entrance examination; extremely selective (single-digit acceptance rates reported)
  ⚠ Religious institution — realistic only for students seeking Islamic education; expectations of religious observance apply.

Amirkabir University of Technology (Tehran Polytechnic) — Tehran, Iran [NOT VERIFIED — confirm on aut.ac.ir]
  Type: Major public technical university — second most prestigious for engineering after Sharif
  Known for: Engineering (all branches), Computer Science, Biomedical Engineering, Textile Engineering
  Language: Mostly Persian-medium; some English graduate options — confirm per programme
  Tuition/deadline: NOT verified — international fees are modest (public system); confirm on aut.ac.ir

Iran University of Science and Technology (IUST) — Tehran, Iran [NOT VERIFIED — confirm on iust.ac.ir]
  Type: Major public technical university
  Known for: Engineering, Materials Science, Automotive Engineering, Architecture
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on iust.ac.ir

Tarbiat Modares University — Tehran, Iran [NOT VERIFIED — confirm on modares.ac.ir]
  Type: GRADUATE-only public university — master's and PhD across all fields
  Known for: Engineering, Medical Sciences, Humanities, Natural Resources (graduate research)
  Language: Mostly Persian-medium; some English-taught graduate tracks — confirm per programme
  Tuition/deadline: NOT verified — confirm on modares.ac.ir

Shahid Beheshti University — Tehran, Iran [NOT VERIFIED — confirm on sbu.ac.ir]
  Type: Major comprehensive public university (formerly National University of Iran)
  Known for: Law, Economics, Architecture, Computer Science, Literature
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on en.sbu.ac.ir

Shahid Beheshti University of Medical Sciences (SBMU) — Tehran, Iran [NOT VERIFIED — confirm on sbmu.ac.ir]
  Type: One of Iran's top medical universities — separate from Shahid Beheshti University
  Known for: Medicine, Dentistry, Pharmacy, Nursing
  Language: English-taught international programmes advertised — confirm per programme
  Tuition/deadline: NOT verified — confirm on en.sbmu.ac.ir

K.N. Toosi University of Technology — Tehran, Iran [NOT VERIFIED — confirm on kntu.ac.ir]
  Type: Public technical university
  Known for: Electrical Engineering, Geomatics, Mechanical Engineering, Computer Science
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on en.kntu.ac.ir

Allameh Tabataba'i University (ATU) — Tehran, Iran [NOT VERIFIED — confirm on atu.ac.ir]
  Type: Iran's largest specialised humanities/social sciences public university
  Known for: Economics, Management, Law, Psychology, Persian Literature, Languages
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on atu.ac.ir

Kharazmi University — Tehran/Karaj, Iran [NOT VERIFIED — confirm on khu.ac.ir]
  Type: Iran's oldest higher-education institution (1919) — public
  Known for: Education, Sciences, Engineering, Psychology
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on khu.ac.ir

Alzahra University — Tehran, Iran [NOT VERIFIED — confirm on alzahra.ac.ir]
  Type: Public WOMEN's university
  Known for: Sciences, Engineering, Arts, Social Sciences, Education
  Language: Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on alzahra.ac.ir
  ⚠ Women only.

Shiraz University — Shiraz, Iran [NOT VERIFIED — confirm on shirazu.ac.ir]
  Type: Major public university in Iran's cultural south
  Known for: Engineering, Agriculture, Veterinary Medicine, Literature
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on shirazu.ac.ir

Ferdowsi University of Mashhad — Mashhad, Iran [NOT VERIFIED — confirm on um.ac.ir]
  Type: Major public university in Iran's second city — sizeable international intake (many from Afghanistan/Iraq)
  Known for: Engineering, Agriculture, Persian Literature, Theology
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on en.um.ac.ir

Isfahan University of Technology (IUT) — Isfahan, Iran [NOT VERIFIED — confirm on iut.ac.ir]
  Type: Top-tier public technical university
  Known for: Engineering, Materials, Agriculture Technology, Natural Resources
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on english.iut.ac.ir

University of Isfahan — Isfahan, Iran [NOT VERIFIED — confirm on ui.ac.ir]
  Type: Major comprehensive public university (distinct from IUT)
  Known for: Humanities, Sciences, Engineering, Foreign Languages
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on ui.ac.ir

University of Tabriz — Tabriz, Iran [NOT VERIFIED — confirm on tabrizu.ac.ir]
  Type: Major public university in Iran's northwest
  Known for: Engineering, Physics, Agriculture, Persian & Azerbaijani studies
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on tabrizu.ac.ir

Iran University of Medical Sciences (IUMS) — Tehran, Iran [NOT VERIFIED — confirm on iums.ac.ir]
  Type: Major public medical university in Tehran
  Known for: Medicine, Public Health, Rehabilitation Sciences, Nursing
  Language: English-taught international programmes advertised — confirm per programme
  Tuition/deadline: NOT verified — confirm on en.iums.ac.ir

University of Guilan — Rasht, Iran [NOT VERIFIED — confirm on guilan.ac.ir]
  Type: Public university on the Caspian coast — budget-friendly region
  Known for: Agriculture, Engineering, Natural Sciences, Fisheries
  Language: Mostly Persian-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on guilan.ac.ir

University of Tartu — Tartu, Estonia [VERIFIED policies — ut.ee; exact per-programme fees live in linked fee documents]
  Type: Estonia's flagship university (founded 1632) — the leading university in the Baltics
  Known for: Computer Science, Medicine, Genetics/Life Sciences, Semiotics, Educational Technology
  Language: Wide range of English-taught bachelor's and master's programmes; Estonian-medium programmes are free-of-charge tracks for Estonian speakers
  Tests: IELTS / TOEFL required for English programmes; minimum varies — confirm on ut.ee
  International tuition: Per-programme fees are published in the official 2026/27 fee documents on ut.ee (typical Estonian range €3,000–€8,000/yr; medicine higher) — confirm your programme's figure. ⚠ From 2026/27 there are NO tuition waivers for new non-EU/EEA students — instead automatic 25/50/100% fee reductions exist in selected programmes (see scholarship #38). PhD is tuition-free.
  Deadline: Applications via DreamApply, generally winter–spring for autumn intake — confirm on ut.ee
  Scholarship here: automatic fee reductions (#38) + Estonian National Scholarship stipend (#37)

Tallinn University of Technology (TalTech) — Tallinn, Estonia [PARTIALLY VERIFIED — policies official; per-programme amounts on programme pages]
  Type: Estonia's technical university — strong IT/engineering, home of much of "e-Estonia" talent
  Known for: IT & Computer Science, Cyber Security, Engineering, Business (School of Business and Governance), Maritime
  Language: Many English-taught programmes at all levels
  Tests: IELTS / TOEFL required; minimum varies — confirm on taltech.ee
  International tuition: EU/EEA citizens are tuition-EXEMPT except in the School of Business and Governance (verified); non-EU fees ~€2,300–€6,000/yr per official-derived sources, set per programme — confirm on the programme page. Fees may rise up to 10%/yr for current students (verified clause).
  Deadline: Via DreamApply — confirm on taltech.ee
  Scholarship here: tuition-fee waivers for top applicants + €100/month merit awards (see scholarship #39)

Tallinn University (TLU) — Tallinn, Estonia [VERIFIED — tlu.ee 2026/27 fee table]
  Type: Estonia's humanities/social sciences-focused public university
  Known for: Educational Innovation, Digital Learning Games, Human-Computer Interaction, Communication, Law, Audiovisual Media
  Language: English-taught programmes at bachelor's and master's level
  Tests: IELTS / TOEFL required; minimum varies — confirm on tlu.ee
  International tuition (2026/27, verified): bachelor's €4,200–€5,400/yr (e.g. Liberal Arts in Humanities €4,200, Audiovisual Media €4,800, Law €5,400); master's €3,800–€6,000/yr (some programmes charge EU citizens the lower end and non-EU the higher). PhD is tuition-free. Three payment plans (annual, per-semester, or 8 instalments).
  Deadline: Via DreamApply — confirm on tlu.ee
  Scholarship here: Estonian National Scholarship stipend possible (see #37)

Estonian University of Life Sciences (EMÜ) — Tartu, Estonia [PARTIALLY VERIFIED — policies official; fee ranges conflicting, confirm]
  Type: Estonia's agriculture/environment-focused public university
  Known for: Agriculture, Forestry, Environmental Sciences, Veterinary Medicine, Engineering (biosystems)
  Language: A handful of English-taught programmes
  International tuition: NOT cleanly verified — third-party ranges conflict (roughly €2,500–€10,000/yr depending on source and programme); confirm on emu.ee. Verified details: €100 application fee (waived for Estonian/Ukrainian citizens and prior Estonia graduates); fees due in two instalments (Oct 15 / Mar 1); TARGETED tuition-free study places exist with all applicants automatically considered.
  Deadline: Via DreamApply — confirm on emu.ee

Estonian Business School (EBS) — Tallinn (+ Helsinki branch), Estonia [PARTIALLY VERIFIED — tuition NOT verified]
  Type: Private business university — oldest private business school in the Baltics
  Known for: International Business Administration, Entrepreneurship, Management
  Language: English-taught programmes at all levels
  International tuition: NOT verified — third-party sources suggest ~€6,900–€7,500/yr for bachelor's, but figures conflict; confirm on ebs.ee. Tuition deductions of up to 60% for top students are advertised.
  Deadline: NOT verified — confirm on ebs.ee

Estonian Academy of Arts (EKA) — Tallinn, Estonia [NOT VERIFIED — confirm on artun.ee]
  Type: Estonia's public art & design university
  Known for: Design, Architecture, Fine Arts, Animation, Art History
  Language: Several English-taught master's programmes; some bachelor's
  Tuition/deadline: NOT verified — confirm on artun.ee

Estonian Academy of Music and Theatre (EAMT) — Tallinn, Estonia [NOT VERIFIED — confirm on eamt.ee]
  Type: Estonia's public music & performing arts academy
  Known for: Classical Music Performance, Composition, Theatre Arts, Cultural Management
  Language: Some English-taught programmes (esp. master's)
  Tuition/deadline: NOT verified — confirm on eamt.ee

━━ UK universities (all applications via UCAS; deadlines & visa rules in the UK country block above) ━━

University of Oxford — Oxford, UK [VERIFIED — ox.ac.uk course fees 2026]
  Type: The English-speaking world's oldest university; collegiate system with tutorials
  Known for: everything — PPE, Law, Medicine, Sciences, Humanities, Computer Science
  International tuition (2026 entry, verified): £37,380–£62,820/yr by course; Medicine £49,400 (pre-clinical) rising to £65,250 (clinical years)
  Deadline: UCAS 15 Oct 2026 (6pm) for 2027 entry — most courses also require admissions tests and interviews
  Scholarship here: Rhodes Scholarship for postgraduates (see #44); undergraduate aid for internationals is very limited (e.g. Reach Oxford for low-income countries — check ox.ac.uk)

University of Cambridge — Cambridge, UK [VERIFIED — undergraduate.study.cam.ac.uk 2026-27]
  Type: Collegiate research university; supervisions system
  Known for: Mathematics, Natural Sciences, Engineering, Computer Science, Medicine, Law
  International tuition (2026-27, verified): £29,052–£70,554/yr by subject PLUS an annual college fee of ~£11,500–£14,950 (some colleges discount — e.g. Trinity's headline £19,557 nets to £13,689 after its 30% bursary)
  Deadline: UCAS 15 Oct 2026 (6pm) for 2027 entry — plus admissions assessments and interviews
  Scholarship here: Gates Cambridge for postgraduates (see #43); undergraduate international aid is very limited

Imperial College London — London, UK [PARTIALLY VERIFIED — fees set per course on official pages]
  Type: STEM + medicine + business only — consistently top-5 worldwide in rankings
  Known for: Engineering, Computing/AI, Medicine, Natural Sciences, Business School
  International tuition: Set per course on official pages — roughly £31,750–£55,800/yr per official-derived listings (confirm your course on imperial.ac.uk)
  Deadline: UCAS 13 Jan 2027 equal-consideration (medicine 15 Oct 2026)
  Note: London costs — budget the higher £1,529/month maintenance rate

London School of Economics (LSE) — London, UK [PARTIALLY VERIFIED — tiered fees; 2026/27 table on lse.ac.uk]
  Type: The world's leading dedicated social-science university
  Known for: Economics, Finance, Politics, International Relations, Law, Data Science
  International tuition: Tiered by programme — ~£27,500–£34,000/yr at 2025/26 rates (2026/27 table published on the LSE Table of Fees page — confirm your programme)
  Deadline: UCAS 13 Jan 2027 equal-consideration
  Note: London costs; LSE is grade-heavy in admissions — strong maths for economics programmes

University College London (UCL) — London, UK [PARTIALLY VERIFIED — fees set per programme; scholarship verified]
  Type: London's largest research university — huge international community
  Known for: Architecture, Medicine, Computer Science, Education, Law, Engineering
  International tuition: Set per programme — NOT verified here; confirm on ucl.ac.uk
  Deadline: UCAS 13 Jan 2027 equal-consideration (medicine 15 Oct 2026)
  Scholarship here: UCL Global Undergraduate Scholarship — full tuition ± maintenance for low-income international students (see scholarship #5)

University of Edinburgh — Edinburgh (Scotland), UK [PARTIALLY VERIFIED — registryservices.ed.ac.uk]
  Type: Scotland's flagship; 4-year Scottish undergraduate degrees
  Known for: Informatics/AI, Medicine, Law, Literature, Veterinary Medicine
  International tuition: From ~£26,500/yr (2025/26 baseline; 2026-27 tables on registryservices.ed.ac.uk). Verified policy: international fees are FIXED at your entry-year rate for the whole degree.
  Deadline: UCAS 13 Jan 2027 equal-consideration (medicine/vet 15 Oct 2026)
  Note: Scottish degrees run 4 years, not 3 — budget accordingly.

King's College London (KCL) — London, UK [NOT VERIFIED fees — confirm on kcl.ac.uk]
  Type: Large central-London Russell Group university
  Known for: Medicine, Law, War Studies, Nursing, Psychology, Humanities
  International tuition: Set per course — NOT verified; confirm on kcl.ac.uk
  Deadline: UCAS 13 Jan 2027 equal-consideration (medicine 15 Oct 2026)

University of Manchester — Manchester, UK [PARTIALLY VERIFIED — official-derived range]
  Type: One of the UK's largest single-campus universities — huge international cohort
  Known for: Engineering, Computer Science, Business (AMBS), Materials, Life Sciences
  International tuition: ~£26,000–£39,900/yr by course per official-derived listings (humanities lower, lab/clinical higher) — confirm on manchester.ac.uk
  Deadline: UCAS 13 Jan 2027 equal-consideration (medicine 15 Oct 2026)

University of Warwick — Coventry, UK [NOT VERIFIED fees — confirm on warwick.ac.uk]
  Type: Russell Group; strong in quantitative subjects — WBS well known
  Known for: Business, Economics, Mathematics, Computer Science, Engineering
  International tuition: Set per course — NOT verified; typical Russell Group range applies. Deadline: UCAS 13 Jan 2027.

University of Bristol — Bristol, UK [NOT VERIFIED fees — confirm on bristol.ac.uk]
  Type: Russell Group; popular with employers
  Known for: Engineering, Computer Science, Law, Medicine, Social Sciences
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027 (medicine 15 Oct 2026).
  Scholarship here: Think Big Scholarships for international students — check bristol.ac.uk

University of Leeds — Leeds, UK [NOT VERIFIED fees — confirm on leeds.ac.uk]
  Type: Large Russell Group campus university; big international community
  Known for: Business, Engineering, Media/Communications, Medicine, Environment
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027 (medicine 15 Oct 2026).

University of Glasgow — Glasgow (Scotland), UK [NOT VERIFIED fees — confirm on gla.ac.uk]
  Type: Historic Scottish Russell Group university (founded 1451); 4-year degrees
  Known for: Medicine, Law, Engineering, Veterinary Medicine, Life Sciences
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027 (medicine/vet 15 Oct 2026).

University of Nottingham — Nottingham, UK [NOT VERIFIED fees — confirm on nottingham.ac.uk]
  Type: Russell Group with campuses in Malaysia and China (fee-paying students can transfer between)
  Known for: Pharmacy, Engineering, Business, Medicine, Law
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027 (medicine 15 Oct 2026).
  Scholarship here: Developing Solutions Scholarships (Africa/India/selected countries, master's) — check nottingham.ac.uk. Related: University of Nottingham MALAYSIA is in this dataset with verified lower fees — a budget route to the same brand.

Queen Mary University of London (QMUL) — London, UK [NOT VERIFIED fees — confirm on qmul.ac.uk]
  Type: Russell Group in East London — one of the most diverse student bodies in the UK
  Known for: Medicine/Dentistry (Barts), Law, Economics, Computer Science
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027 (medicine 15 Oct 2026).

University of Southampton — Southampton, UK [NOT VERIFIED fees — confirm on southampton.ac.uk]
  Type: Russell Group; strong engineering/CS heritage
  Known for: Electronics & Computer Science, Engineering, Oceanography, Medicine
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027. (Its Malaysia campus is in this dataset as a light entry.)

University of Sheffield — Sheffield, UK [NOT VERIFIED fees — confirm on sheffield.ac.uk]
  Type: Russell Group; consistently rated highly for student experience
  Known for: Engineering, Materials, Journalism, Architecture, Medicine
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027 (medicine 15 Oct 2026).
  Scholarship here: International Merit Scholarships (percentage waivers) — check sheffield.ac.uk

Durham University — Durham, UK [NOT VERIFIED fees — confirm on durham.ac.uk]
  Type: Collegiate university (like Oxbridge structure) in England's northeast
  Known for: Law, Business, Physics, Theology, English
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027.

University of Birmingham — Birmingham, UK [NOT VERIFIED fees — confirm on birmingham.ac.uk]
  Type: Large Russell Group civic university (Dubai campus is in this dataset)
  Known for: Business, Engineering, Medicine, Sport Science, Law
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027 (medicine 15 Oct 2026).

Cardiff University — Cardiff (Wales), UK [NOT VERIFIED fees — confirm on cardiff.ac.uk]
  Type: Wales's Russell Group flagship — living costs below most English cities
  Known for: Journalism, Medicine, Engineering, Psychology, Architecture
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027 (medicine 15 Oct 2026).

Queen's University Belfast — Belfast (Northern Ireland), UK [NOT VERIFIED fees — confirm on qub.ac.uk]
  Type: Russell Group; Northern Ireland's flagship — among the LOWEST living costs of any UK Russell Group city
  Known for: Medicine, Pharmacy, Engineering, Law, Cyber Security
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027 (medicine 15 Oct 2026).

University of Aberdeen — Aberdeen (Scotland), UK [NOT VERIFIED fees — confirm on abdn.ac.uk]
  Type: Ancient Scottish university (founded 1495); 4-year degrees
  Known for: Petroleum/Energy Engineering, Medicine, Law, Divinity
  International tuition: Set per course — NOT verified. Deadline: UCAS 13 Jan 2027 (medicine 15 Oct 2026).

Swansea University — Swansea (Wales), UK [NOT VERIFIED fees — confirm on swansea.ac.uk]
  Type: Welsh coastal campus university — good value, strong engineering links
  Known for: Engineering, Computer Science, Health Sciences, Sports Science
  International tuition: Set per course — NOT verified; Welsh universities generally undercut English peers. Deadline: UCAS 13 Jan 2027.

Coventry University — Coventry (+ London campus), UK [NOT VERIFIED fees — confirm on coventry.ac.uk]
  Type: Modern university consistently among the UK's largest recruiters of international students — value tier
  Known for: Automotive & Aerospace Engineering, Business, Health, Design
  International tuition: NOT verified — third-party guides place it among the more affordable English options; confirm on coventry.ac.uk. Deadline: UCAS 13 Jan 2027 (later intakes often available).

Teesside University — Middlesbrough, UK [PARTIALLY VERIFIED — value tier; aggregator figures conflict]
  Type: Modern university in England's northeast — among the CHEAPEST English universities for internationals, very low living costs
  Known for: Computing/Games Design, Engineering, Health, Business
  International tuition: Aggregator figures range ~£10,000–£17,000/yr (conflicting — do NOT quote as fact); confirm on tees.ac.uk. Deadline: UCAS 13 Jan 2027 (January intakes common).

Ulster University — Belfast/Derry (Northern Ireland), UK [NOT VERIFIED fees — confirm on ulster.ac.uk]
  Type: Modern university — Northern Ireland's value option with very low living costs
  Known for: Business, Computing, Health Sciences, Art & Design
  International tuition: NOT verified — among the more affordable UK options per third-party guides; confirm on ulster.ac.uk. Deadline: UCAS 13 Jan 2027.

De Montfort University (DMU) — Leicester, UK [NOT VERIFIED fees — confirm on dmu.ac.uk]
  Type: Modern university with a large international cohort — value tier
  Known for: Pharmacy, Business, Fashion/Design, Computing, Law
  International tuition: NOT verified — affordable tier per third-party guides; confirm on dmu.ac.uk. Deadline: UCAS 13 Jan 2027 (January intakes common).

University of Hertfordshire — Hatfield (near London), UK [NOT VERIFIED fees — confirm on herts.ac.uk]
  Type: Modern university just north of London — value tier with London proximity at non-London costs (and the LOWER visa maintenance rate)
  Known for: Computer Science, Aerospace Engineering, Pharmacology, Business
  International tuition: NOT verified — affordable tier per third-party guides; confirm on herts.ac.uk. Deadline: UCAS 13 Jan 2027 (January intakes common).

University of Greenwich — London, UK [NOT VERIFIED fees — confirm on gre.ac.uk]
  Type: Modern London university — among the cheaper LONDON options (but London maintenance rate applies)
  Known for: Business, Computing, Engineering, Maritime Studies
  International tuition: NOT verified — confirm on gre.ac.uk. Deadline: UCAS 13 Jan 2027 (January intakes common).

University of Sunderland — Sunderland (+ London campus), UK [NOT VERIFIED fees — confirm on sunderland.ac.uk]
  Type: Modern northeast university — value tier, very low living costs
  Known for: Nursing/Health, Business, Engineering, Media
  International tuition: NOT verified — affordable tier per third-party guides; confirm on sunderland.ac.uk. Deadline: UCAS 13 Jan 2027 (January intakes common).

Wrexham University — Wrexham (Wales), UK [PARTIALLY VERIFIED — aggregator figures]
  Type: Small modern Welsh university — repeatedly listed as one of the CHEAPEST UK universities for internationals
  Known for: Computing, Engineering, Health, Business
  International tuition: ~£11,750/yr undergraduate per third-party 2026 guides (NOT verified — confirm on wrexham.ac.uk). Deadline: UCAS 13 Jan 2027.

━━ Dutch universities (apply via Studielink; numerus fixus deadline 15 Jan, regular ~1 Apr–1 May non-EU; see NL country block for zoekjaar & policy warnings) ━━

Delft University of Technology (TU Delft) — Delft, Netherlands [VERIFIED — tudelft.nl 2026-27 institutional fees]
  Type: The Netherlands' leading engineering/technology university — global top-3 in several engineering subjects
  Known for: Aerospace, Civil & Mechanical Engineering, Computer Science, Architecture, Industrial Design
  Language: English-taught MSc programmes broadly; several English BSc options (English bachelor availability is under national policy pressure — confirm)
  International tuition (2026-27, verified): non-EU BSc €19,906/yr; non-EU MSc €25,633/yr — rising year on year
  Deadline: Numerus fixus BSc programmes 15 Jan (hard); MSc rounds vary — confirm on tudelft.nl
  Scholarship here: Justus & Louise van Effen — ~€30,000/yr full package for excellent non-EU MSc admits (see scholarship #45)

University of Amsterdam (UvA) — Amsterdam, Netherlands [PARTIALLY VERIFIED — fees set per programme]
  Type: The Netherlands' largest comprehensive research university
  Known for: Economics & Business, Psychology, Media Studies, Law (PPLE college), Social Sciences
  Language: Many English-taught programmes (bachelor availability shrinking under national policy — confirm per programme)
  International tuition: Set per programme — typically ~€9,000–€20,000/yr for non-EU bachelor's (verified example: PPLE €19,100 for 2026-27); confirm your programme on uva.nl
  Deadline: Numerus fixus 15 Jan; regular non-EU typically 1 Apr–1 May — confirm per programme
  ⚠ Amsterdam has the country's worst student-housing shortage — arrange housing before arrival.

Utrecht University — Utrecht, Netherlands [PARTIALLY VERIFIED — fees per programme; scholarship discontinuation verified]
  Type: One of Europe's top research universities
  Known for: Life Sciences, Veterinary Medicine, Geosciences, Law, Sustainability
  Language: Many English-taught master's; some English bachelor's
  International tuition: ~€12,000–€20,000/yr non-EU by programme (official-derived range) — confirm on uu.nl
  Deadline: Numerus fixus 15 Jan; regular non-EU ~1 Apr — confirm per programme
  ⚠ VERIFIED: the Utrecht Excellence Scholarship is DISCONTINUED for programmes starting 2026-27 (budget cuts) — do not mention it as available. Check uu.nl for any remaining aid.

Maastricht University — Maastricht, Netherlands [PARTIALLY VERIFIED — scholarship verified; fees per programme]
  Type: The Netherlands' most international university (~half the students are non-Dutch); Problem-Based Learning model
  Known for: Medicine, European Studies, Business & Economics, Psychology, Law
  Language: Most programmes taught in English — the most international-friendly Dutch option
  International tuition: Set per programme — confirm on maastrichtuniversity.nl
  Deadline: Numerus fixus 15 Jan; others vary — confirm
  Scholarship here: NL-High Potential — 21 full packages of €34,000/yr for non-EU master's students (see scholarship #46)

Leiden University — Leiden/The Hague, Netherlands [NOT VERIFIED fees — confirm on universiteitleiden.nl]
  Type: The Netherlands' oldest university (1575)
  Known for: Law, International Relations, Humanities, Archaeology, Medicine (LUMC)
  Language: Many English-taught programmes
  Tuition/deadline: NOT verified — non-EU institutional fees set per programme; numerus fixus 15 Jan applies. Check the Leiden Excellence Scholarship (LExS) for master's — current status on the official site.

University of Groningen — Groningen, Netherlands [NOT VERIFIED fees — confirm on rug.nl]
  Type: Large classical research university in the student-friendly north — cheaper living than the Randstad
  Known for: Economics & Business, Astronomy/Physics, Psychology, Medicine, AI
  Language: Many English-taught programmes
  Tuition/deadline: NOT verified — confirm on rug.nl; numerus fixus 15 Jan applies. Eric Bleumink Fund offers occasional full scholarships for developing-country students — check status.

Erasmus University Rotterdam (EUR) — Rotterdam, Netherlands [NOT VERIFIED fees — confirm on eur.nl]
  Type: Business/economics/health-focused research university — RSM is a top European business school
  Known for: Business (RSM), Economics, Medicine (Erasmus MC), Public Health, Law
  Language: Many English-taught programmes
  Tuition/deadline: NOT verified — 2026-27 fee tables exist on eur.nl; numerus fixus 15 Jan applies for capped programmes.

Eindhoven University of Technology (TU/e) — Eindhoven, Netherlands [NOT VERIFIED fees — confirm on tue.nl]
  Type: Tech university at the heart of the Brainport high-tech region (ASML, Philips) — excellent job pipeline
  Known for: Electrical Engineering, Computer Science, Industrial Design, Applied Physics
  Language: Almost fully English-taught
  Tuition/deadline: NOT verified — confirm on tue.nl. ASML/industry ties make the zoekjaar year especially valuable here.

Wageningen University & Research (WUR) — Wageningen, Netherlands [NOT VERIFIED fees — confirm on wur.nl]
  Type: The world's leading agriculture/food/environment university
  Known for: Food Technology, Agriculture, Environmental Sciences, Nutrition, Forestry
  Language: English-taught master's; hybrid bachelor's
  Tuition/deadline: NOT verified — confirm on wur.nl. Anne van den Ban Fund supports developing-country students — check status.

Vrije Universiteit Amsterdam (VU) — Amsterdam, Netherlands [NOT VERIFIED fees — confirm on vu.nl]
  Type: Amsterdam's second research university — strong sciences and social sciences
  Known for: Business Analytics, Computer Science, Psychology, Theology, Movement Sciences
  Language: Many English-taught programmes
  Tuition/deadline: NOT verified — confirm on vu.nl; VU Fellowship Programme (VUFP) offers partial master's scholarships — check status. Amsterdam housing warning applies.

University of Twente — Enschede, Netherlands [NOT VERIFIED fees — confirm on utwente.nl]
  Type: Entrepreneurial campus tech university in the east — cheaper living, tight-knit campus
  Known for: Nanotechnology, Computer Science, Mechanical Engineering, Technical Medicine
  Language: Almost fully English-taught
  Tuition/deadline: NOT verified — confirm on utwente.nl; University of Twente Scholarships (UTS) €3,000–€22,000 for master's — check status.

Radboud University — Nijmegen, Netherlands [NOT VERIFIED fees — confirm on ru.nl]
  Type: Comprehensive research university in the Netherlands' oldest city
  Known for: Neuroscience (Donders Institute), Medicine, Linguistics, Law
  Language: Many English-taught programmes
  Tuition/deadline: NOT verified — confirm on ru.nl; Radboud Scholarship Programme reduces non-EU master's fees — check status.

Tilburg University — Tilburg, Netherlands [NOT VERIFIED fees — confirm on tilburguniversity.edu]
  Type: Specialised in economics, business, law and social sciences — strong rankings per field
  Known for: Economics, Data Science, Law, Psychology, Theology
  Language: Many English-taught programmes
  Tuition/deadline: NOT verified — confirm on tilburguniversity.edu.

The Hague University of Applied Sciences (THUAS) — The Hague, Netherlands [NOT VERIFIED fees — confirm on thehagueuniversity.com]
  Type: Representative of the Dutch HBO (applied sciences) sector — practice-oriented bachelor's, typically cheaper than research universities
  Known for: International Business, European Studies, Industrial Design Engineering, Law
  Language: Many English-taught programmes (HBO English offerings also face national policy pressure)
  Tuition/deadline: NOT verified — confirm on thehagueuniversity.com. HBO degrees are career-focused; check recognition needs if you plan later master's study.

━━ Indian universities (official channels: Study in India portal, ICCR scholarships, DASA for NITs; see India country block — NEET is required for MBBS even for foreigners) ━━

Indian Institute of Technology Bombay (IIT Bombay) — Mumbai, India [PARTIALLY VERIFIED — admission route verified; fees vary by IIT]
  Type: India's most sought-after engineering institute
  Known for: Computer Science, Electrical & Mechanical Engineering, Aerospace, Design
  Language: English-medium instruction
  Admission (verified): foreign nationals register DIRECTLY for JEE Advanced (no JEE Main needed) — registration $100 SAARC / $200 others; up to 10% supernumerary seats per course; 75%+ in Class XII equivalent required
  Tuition: Varies by IIT and nationality — NOT verified for IITB specifically (example elsewhere: IIT Bhilai charges $25/credit SAARC, $50/credit others). Confirm on iitb.ac.in.
  ⚠ JEE Advanced is one of the world's hardest entrance exams — realistic only for exceptionally strong STEM students.

Indian Institute of Technology Delhi (IIT Delhi) — New Delhi, India [PARTIALLY VERIFIED — same admission route as IIT Bombay]
  Type: Top-tier engineering institute in the capital
  Known for: Computer Science, Electrical Engineering, Textile Technology, Management
  Language: English-medium instruction
  Admission/tuition: Same JEE Advanced route for foreign nationals (verified); fees vary — confirm on iitd.ac.in
  ⚠ Same JEE Advanced difficulty warning applies.

National Institute of Technology Tiruchirappalli (NIT Trichy) — Tiruchirappalli, India [VERIFIED admission scheme — dasanit.org]
  Type: India's top-ranked NIT — representative of the 30+ NIT system open to internationals via DASA
  Known for: Engineering (all branches), Computer Science, Architecture
  Language: English-medium instruction
  Tuition via DASA (verified for 2026): ~USD 4,000/semester for non-SAARC; SAARC citizens get a 50% waiver; hostels ~₹6,000/month + mess ~₹5,000/month. CIWG (Gulf-based Indian workers' children) pay Indian-level fees.
  Apply: Via dasanit.org — one application covers NITs, IIITs and other centrally funded institutes; recent cycles use JEE Main-based merit ranking — confirm current criteria on the portal

University of Delhi (DU) — New Delhi, India [PARTIALLY VERIFIED — process official via Foreign Students' Registry]
  Type: India's most famous central university — dozens of colleges under one umbrella
  Known for: Economics, Commerce, Law, English, Political Science
  Language: English-medium instruction
  Tuition: Remarkably low — public fees apply to foreigners too (some programmes cost well under $500/yr; professional programmes more). All foreign admissions run through the Foreign Students' Registry (fsr.du.ac.in) — confirm current fees there.
  Deadline: Annual FSR application window (roughly Feb–May for the autumn term) — confirm on fsr.du.ac.in
  Note: Nepal/Bangladesh/Bhutan/Tibet applicants need a No Objection Certificate from their diplomatic mission.

Sharda University — Greater Noida (Delhi NCR), India [PARTIALLY VERIFIED — official global fee pages]
  Type: Private university with one of India's largest international cohorts (95+ nationalities)
  Known for: Engineering, Business, Medical & Allied Sciences, Law
  Language: English-medium instruction
  International tuition (per official global fee pages): from ~$5,000/yr + a Global Course Fee of $500 (year 1) / $250 (later years) — waived for Nepal/Bhutan/Bangladesh and GCC NRIs. Confirm per programme on sharda.ac.in.
  Scholarship here: Ambassador's Scholarship up to 100% of tuition for international applicants — confirm current terms
  Deadline: Rolling international admissions — confirm on sharda.ac.in

Lovely Professional University (LPU) — Phagwara (Punjab), India [PARTIALLY VERIFIED — tuition low but figures vary]
  Type: One of India's largest private universities — aggressive international recruitment, huge campus
  Known for: Engineering, Business, Agriculture, Hospitality, Computer Applications
  Language: English-medium instruction
  International tuition: LOW — third-party sources suggest from ~$1,000–$3,000/yr depending on programme (NOT verified; confirm on lpu.in/international). Scholarships up to 60% via the LPU International Scholarship Test (LPUIST). Flexible USD/INR payment options.
  Deadline: Rolling — confirm on lpu.in/international

Indian Institute of Science (IISc) — Bengaluru, India [NOT VERIFIED fees — confirm on iisc.ac.in]
  Type: India's top-ranked research institution — mainly postgraduate/research
  Known for: Science, Engineering research, AI/ML, Materials
  Language: English-medium instruction
  Tuition/deadline: NOT verified — confirm international admission channels on iisc.ac.in

Jawaharlal Nehru University (JNU) — New Delhi, India [NOT VERIFIED fees — confirm on jnu.ac.in]
  Type: Premier central university for social sciences and international studies
  Known for: International Relations, Social Sciences, Languages, Life Sciences
  Language: English-medium instruction
  Tuition/deadline: NOT verified — public fees are very low; confirm on jnu.ac.in

Banaras Hindu University (BHU) — Varanasi, India [NOT VERIFIED fees — confirm on bhu.ac.in]
  Type: One of Asia's largest residential universities — central university
  Known for: Arts, Sanskrit & Indology, Science, Medicine, Agriculture
  Language: English and Hindi — confirm per programme
  Tuition/deadline: NOT verified — international cell handles foreign admissions; ICCR placements common; confirm on bhu.ac.in

Aligarh Muslim University (AMU) — Aligarh, India [NOT VERIFIED fees — confirm on amu.ac.in]
  Type: Historic central university with a dedicated international students' office
  Known for: Law, Medicine, Engineering, Islamic Studies, Humanities
  Language: English-medium (some programmes Urdu/Hindi) — confirm per programme
  Tuition/deadline: NOT verified — confirm on amu.ac.in

Jamia Millia Islamia — New Delhi, India [NOT VERIFIED fees — confirm on jmi.ac.in]
  Type: Central university in Delhi with a sizeable international intake
  Known for: Mass Communication, Engineering, Law, Fine Arts, Social Sciences
  Language: English-medium — confirm per programme
  Tuition/deadline: NOT verified — confirm on jmi.ac.in

Manipal Academy of Higher Education (MAHE) — Manipal (Karnataka), India [NOT VERIFIED fees — confirm on manipal.edu]
  Type: India's best-known private university brand abroad (its Dubai campus is in this dataset)
  Known for: Medicine (KMC), Engineering (MIT Manipal), Pharmacy, Media, Health Sciences
  Language: English-medium instruction
  Tuition/deadline: NOT verified — international/NRI fee categories differ sharply from Indian fees (medicine especially); confirm on manipal.edu. ⚠ MBBS requires NEET even for foreign nationals.

Vellore Institute of Technology (VIT) — Vellore (Tamil Nadu), India [NOT VERIFIED fees — confirm on vit.ac.in]
  Type: Large private technical university, well known abroad
  Known for: Engineering, Computer Science, Biotechnology
  Language: English-medium instruction
  Tuition/deadline: NOT verified — direct international admission channel; confirm on vit.ac.in

SRM Institute of Science and Technology — Chennai (Tamil Nadu), India [NOT VERIFIED fees — confirm on srmist.edu.in]
  Type: Large private university with active international recruitment
  Known for: Engineering, Medicine & Health Sciences, Management
  Language: English-medium instruction
  Tuition/deadline: NOT verified — confirm on srmist.edu.in

Amity University — Noida (Delhi NCR) + multiple campuses, India [NOT VERIFIED fees — confirm on amity.edu]
  Type: Large private university network with international campuses
  Known for: Business, Engineering, Law, Communication, Biotechnology
  Language: English-medium instruction
  Tuition/deadline: NOT verified — confirm on amity.edu

Symbiosis International University (SIU) — Pune, India [NOT VERIFIED fees — confirm on siu.edu.in]
  Type: Private university famous for management, with a dedicated international admissions arm (SCIE)
  Known for: Management, Law, Computer Studies, Design
  Language: English-medium instruction
  Tuition/deadline: NOT verified — international applicants apply via scie.ac.in; confirm fees there

Chandigarh University — Mohali (Punjab), India [NOT VERIFIED fees — confirm on cuchd.in]
  Type: Fast-growing private university with heavy international marketing
  Known for: Engineering, Business, Hospitality, Media
  Language: English-medium instruction
  Tuition/deadline: NOT verified — confirm on cuchd.in

IIT Madras — Chennai (Tamil Nadu), India [VERIFIED Zanzibar campus — zanzibar.iitm.ac.in]
  Type: India's top-ranked institute (NIRF #1) — with a campus in Zanzibar, TANZANIA
  Known for: Computer Science, Data Science, Mechanical Engineering, Aerospace Engineering
  Chennai route: foreign nationals need 75%+ Class XII equivalent AND JEE Advanced (register directly, skip JEE Main). International fees NOT verified — confirm on iitm.ac.in. ICCR/Study-in-India generally do NOT cover IIT admission.
  ★ IITM ZANZIBAR (verified): 4-year BS (Chemical Process Engineering) ~$12,000 TOTAL tuition (~$3,000/yr) + ~$5,000/yr living; MTech in Data Science & AI and Ocean Structures. Own SAT-style screening test + interview — NO JEE. Merit scholarships up to 80% waiver + Airtel Africa Fellowship (full support; 14 African countries incl. Nigeria, Kenya, Uganda, Tanzania, Zambia, Malawi, Rwanda, DRC). An IIT degree at African-market pricing.

Osmania University — Hyderabad, India [NOT VERIFIED fees — public, low]
  Type: Historic public university — for decades one of India's biggest magnets for international students (dedicated foreign-students office)
  Known for: Engineering, Business, Pharmacy, Humanities
  Fees/deadline: NOT verified — public-university fees are low; ICCR host; confirm on osmania.ac.in

Savitribai Phule Pune University (SPPU) — Pune, India [NOT VERIFIED fees — public, low]
  Type: "Oxford of the East" — large public university with a dedicated international student centre
  Known for: Science, Management, Law, Humanities
  Fees/deadline: NOT verified — ICCR host; confirm on unipune.ac.in

University of Hyderabad (UoH) — Hyderabad, India [NOT VERIFIED fees — public, low]
  Type: Central university and Institution of Eminence — strong sciences, popular ICCR host
  Known for: Science, Economics, Humanities, Biology
  Fees/deadline: NOT verified — confirm on uohyd.ac.in

University of Mysore — Mysuru (Karnataka), India [NOT VERIFIED fees — public, low]
  Type: Historic university (1916) in a calm, cheap city — a classic ICCR-scholarship destination
  Known for: Humanities, Science, Business, Psychology
  Fees/deadline: NOT verified — confirm on uni-mysore.ac.in

Christ University — Bengaluru, India [NOT VERIFIED fees — confirm on christuniversity.in]
  Type: Private deemed university popular with international students — business/law/psychology strength in India's tech capital
  Known for: Business, Law, Psychology, Media
  Fees/deadline: NOT verified — confirm on christuniversity.in

KIIT (Kalinga Institute of Industrial Technology) — Bhubaneswar (Odisha), India [PARTIALLY VERIFIED — listings-quoted fees]
  Type: Large private university hosting a sizeable international cohort
  Known for: Engineering, Computer Science, Business, Law
  Fees (listings-quoted, NOT official): intl B.Tech ~$4,000–6,000/yr; up to 100 international full/partial fee waivers reported — confirm both on kiit.ac.in

Parul University — Vadodara (Gujarat), India [PARTIALLY VERIFIED — listings-quoted fees]
  Type: Private university with 2,000+ international students from 56+ nationalities — a big Africa-market player
  Known for: Engineering, Business, Pharmacy, Design
  Fees (listings-quoted, NOT official): most courses ~$3,000–6,000/yr — official intl fee page exists (paruluniversity.ac.in/international-students-fees-structure). ⚠ MBBS is FAR higher (~₹18 lakh/yr quoted) and requires NEET even for foreigners.

━━ New Zealand's 8 universities (apply directly; Feb & July intakes; international PhD students pay DOMESTIC fees ~NZ$7,000–9,000/yr — see NZ country block) ━━

University of Auckland — Auckland, New Zealand [PARTIALLY VERIFIED — official-derived 2026 fees]
  Type: New Zealand's largest and highest-ranked university
  Known for: Engineering, Computer Science, Medicine, Business, Law
  Language: English-medium instruction
  International tuition (2026): ~NZ$40,225–$58,120+/yr by faculty + Student Services Fee NZ$9.44/point (~NZ$1,133 full-time) — confirm per programme on auckland.ac.nz. PhD: domestic rate (~NZ$8,000–9,000/yr).
  Deadline: Apply directly — Semester 1 (Feb) applications generally close ~Dec, Semester 2 (Jul) ~May; confirm on auckland.ac.nz
  Scholarship here: University of Auckland International Student Excellence Scholarships and Manaaki placements — check auckland.ac.nz

University of Otago — Dunedin, New Zealand [PARTIALLY VERIFIED — official-derived 2026 fees]
  Type: New Zealand's oldest university — famous residential student culture and health sciences
  Known for: Medicine, Dentistry, Health Sciences, Sciences, Law
  Language: English-medium instruction
  International tuition (2026): ~NZ$26,000–$45,000/yr by faculty (cheapest anchor among NZ's big universities) — health professional programmes cost more; confirm per paper on otago.ac.nz. PhD: domestic rate.
  Deadline: Apply directly — confirm on otago.ac.nz
  Scholarship here: Otago International Excellence Scholarships — check otago.ac.nz

Victoria University of Wellington — Wellington, New Zealand [NOT VERIFIED fees — confirm on wgtn.ac.nz]
  Type: The capital's university — strong in law, government and humanities
  Known for: Law, Public Policy, International Relations, Design, Sciences
  Language: English-medium instruction
  Tuition/deadline: NOT verified — confirm on wgtn.ac.nz. PhD: domestic rate (national policy). Wellington Doctoral Scholarships exist — check status.

University of Canterbury — Christchurch, New Zealand [NOT VERIFIED fees — confirm on canterbury.ac.nz]
  Type: NZ's second-oldest university — engineering powerhouse
  Known for: Engineering (all branches), Forestry, Antarctic Studies, Business
  Language: English-medium instruction
  Tuition/deadline: NOT verified — confirm on canterbury.ac.nz. PhD: domestic rate. UC International First Year scholarships exist — check status.

Massey University — Palmerston North / Auckland / Wellington (+ strong distance learning), New Zealand [NOT VERIFIED fees — confirm on massey.ac.nz]
  Type: Multi-campus university — the specialist in agriculture, veterinary and aviation
  Known for: Veterinary Science (top-30 world), Agriculture, Aviation, Food Technology, Design
  Language: English-medium instruction
  Tuition/deadline: NOT verified — confirm on massey.ac.nz. PhD: domestic rate.

University of Waikato — Hamilton (+ Tauranga), New Zealand [NOT VERIFIED fees — confirm on waikato.ac.nz]
  Type: Younger research university — strong management school and Māori studies
  Known for: Management, Computer Science, Law, Education, Māori & Indigenous Studies
  Language: English-medium instruction
  Tuition/deadline: NOT verified — confirm on waikato.ac.nz. PhD: domestic rate.

Lincoln University — Lincoln (near Christchurch), New Zealand [NOT VERIFIED fees — confirm on lincoln.ac.nz]
  Type: NZ's specialist land-based university — smallest of the eight
  Known for: Agriculture, Agribusiness, Viticulture & Oenology, Landscape Architecture, Environment
  Language: English-medium instruction
  Tuition/deadline: NOT verified — confirm on lincoln.ac.nz. PhD: domestic rate.

Auckland University of Technology (AUT) — Auckland, New Zealand [NOT VERIFIED fees — confirm on aut.ac.nz]
  Type: NZ's newest university — applied, industry-connected, large international cohort
  Known for: Business, Communication Studies, Health Sciences, Hospitality & Tourism, Sport Science
  Language: English-medium instruction
  Tuition/deadline: NOT verified — confirm on aut.ac.nz. PhD: domestic rate.

━━ Chinese universities (apply directly or via CSC scholarship channels; MBBS in English ONLY at the 45 MOE-approved universities — see China country block) ━━

Tsinghua University — Beijing, China [PARTIALLY VERIFIED — fees via official-derived sources]
  Type: China's #1 university — global top-20; engineering and CS powerhouse
  Known for: Engineering, Computer Science, Architecture, Economics & Management, Public Policy
  Language: Chinese-medium for most undergrad (HSK 5+); English-taught graduate programmes incl. the Schwarzman MGA
  International tuition: ¥26,000/yr (economics/management/law-type) to ¥30,000/yr (science/engineering) for undergrad (~$3,600–$4,200); professional programmes more. Application fee ¥800. Confirm on join-tsinghua.edu.cn.
  Deadline: Undergrad international applications ~Oct–Jan for autumn entry — confirm on official site
  Scholarship here: Schwarzman Scholars (see #51); Tsinghua also offers its own international scholarships and CSC places
  ⚠ Admission is extremely competitive — top grades plus interviews.

Peking University (PKU) — Beijing, China [PARTIALLY VERIFIED — scholarship verified; fees per programme]
  Type: China's most storied comprehensive university — Tsinghua's great rival
  Known for: Humanities, Law, Economics, Sciences, Medicine (PKU Health Science Center)
  Language: Chinese-medium for most undergrad (HSK 5+); English-taught graduate options incl. Yenching Academy
  International tuition: ~¥26,000–¥30,000/yr for most undergrad programmes (official-derived; confirm on international.pku.edu.cn)
  Deadline: ~Oct–Jan for autumn entry — confirm on official site
  Scholarship here: Yenching Academy full scholarship for the China Studies master's (see #52); CSC places

Fudan University — Shanghai, China [NOT VERIFIED fees — confirm on iso.fudan.edu.cn]
  Type: Elite C9 comprehensive university in Shanghai
  Known for: Medicine (English MBBS — MOE-approved, IELTS/TOEFL required), Economics, Journalism, International Relations
  Language: Chinese-medium undergrad mostly; English-taught MBBS and some master's
  Tuition/deadline: NOT verified — confirm on iso.fudan.edu.cn. CSC and Shanghai Government Scholarship places available.

Shanghai Jiao Tong University (SJTU) — Shanghai, China [NOT VERIFIED fees — confirm on isc.sjtu.edu.cn]
  Type: Elite C9 university — engineering and medicine heavyweight
  Known for: Engineering, Computer Science, Medicine, Business (Antai/SAIF)
  Language: Chinese-medium undergrad mostly; English-taught engineering/business master's
  Tuition/deadline: NOT verified — confirm on isc.sjtu.edu.cn. CSC and Shanghai Government Scholarship places available.

Zhejiang University — Hangzhou, China [NOT VERIFIED fees — confirm on iczu.zju.edu.cn]
  Type: Elite C9 mega-university — often ranked China's #3
  Known for: Engineering, Computer Science/AI, Agriculture, Medicine (English MBBS — MOE-approved, IELTS/TOEFL required)
  Language: Mix — notable English-taught undergrad and graduate options
  Tuition/deadline: NOT verified — confirm on iczu.zju.edu.cn. CSC places available.

University of Science and Technology of China (USTC) — Hefei, China [NOT VERIFIED fees — confirm on ic.ustc.edu.cn]
  Type: Elite C9 — China's MIT-style pure-science powerhouse (Chinese Academy of Sciences)
  Known for: Physics, Chemistry, Quantum Science, Computer Science, Mathematics
  Language: Mostly Chinese-medium; some English graduate tracks
  Tuition/deadline: NOT verified — confirm on ic.ustc.edu.cn. CSC/CAS scholarships common for research students.

Nanjing University — Nanjing, China [NOT VERIFIED fees — confirm on isao.nju.edu.cn]
  Type: Elite C9 comprehensive university
  Known for: Astronomy, Geosciences, Chinese Literature, Business, International Relations (Hopkins-Nanjing Center)
  Language: Chinese-medium mostly; some English programmes
  Tuition/deadline: NOT verified — confirm on isao.nju.edu.cn. CSC and Jasmine Jiangsu Government Scholarship places.

Wuhan University — Wuhan, China [NOT VERIFIED fees — confirm on admission.whu.edu.cn]
  Type: Major comprehensive university — one of China's most beautiful campuses; large international cohort
  Known for: Remote Sensing/Surveying (world #1 field), Law, Medicine (English MBBS — MOE-approved), Engineering
  Language: Chinese and English-taught options
  Tuition/deadline: NOT verified — confirm on admission.whu.edu.cn. CSC and Chinese local scholarships available.

Harbin Institute of Technology (HIT) — Harbin, China [NOT VERIFIED fees — confirm on studyathit.hit.edu.cn]
  Type: Engineering giant of China's northeast — aerospace/defence heritage
  Known for: Aerospace, Robotics, Mechanical & Civil Engineering, Materials
  Language: Chinese-medium mostly; some English engineering programmes
  Tuition/deadline: NOT verified — confirm on studyathit.hit.edu.cn. Note: HIT is under US export-control sanctions — students planning later US study/work in sensitive fields should be aware.

Xi'an Jiaotong University (XJTU) — Xi'an, China [NOT VERIFIED fees — confirm on sie.xjtu.edu.cn]
  Type: Elite C9 university in China's ancient capital — cheaper living than coastal cities
  Known for: Engineering, Energy & Power, Management, Medicine (English MBBS — MOE-approved)
  Language: Chinese and English-taught options
  Tuition/deadline: NOT verified — confirm on sie.xjtu.edu.cn. CSC places available.

Sun Yat-sen University (SYSU) — Guangzhou, China [NOT VERIFIED fees — confirm on iso.sysu.edu.cn]
  Type: South China's flagship — strong medicine and business, Greater Bay Area location
  Known for: Medicine, Business, Public Health, Marine Sciences
  Language: Chinese-medium mostly; some English programmes
  Tuition/deadline: NOT verified — confirm on iso.sysu.edu.cn. CSC and Guangdong Government Scholarship places.

Tongji University — Shanghai, China [NOT VERIFIED fees — confirm on study.tongji.edu.cn]
  Type: Shanghai university famous for architecture/civil engineering; German ties
  Known for: Architecture, Civil Engineering, Urban Planning, Automotive, Medicine (English MBBS — MOE-approved, IELTS/TOEFL required)
  Language: Chinese, English and some German-taught options
  Tuition/deadline: NOT verified — confirm on study.tongji.edu.cn.

Beijing Normal University (BNU) — Beijing, China [NOT VERIFIED fees — confirm on iso.bnu.edu.cn]
  Type: China's top normal (education-focused) university — strong humanities and psychology
  Known for: Education, Psychology, Chinese Language & Literature, Geography
  Language: Chinese-medium mostly — a strong choice for Chinese-language learners
  Tuition/deadline: NOT verified — confirm on iso.bnu.edu.cn.

Beijing Language and Culture University (BLCU) — Beijing, China [NOT VERIFIED fees — confirm on admission.blcu.edu.cn]
  Type: THE specialist university for teaching Chinese to foreigners ("the little United Nations") — most international campus in China
  Known for: Chinese Language, Chinese Culture, Translation, Teaching Chinese as a Foreign Language
  Language: Built for non-native speakers — programmes from zero Chinese upward
  Tuition/deadline: NOT verified — confirm on admission.blcu.edu.cn. The classic first stop for the CSC preparatory Chinese year and Confucius/CIS-type language scholarships.

Xiamen University — Xiamen, China [NOT VERIFIED fees — confirm on admissions.xmu.edu.cn]
  Type: Coastal comprehensive university — China's most beautiful seaside campus; has a MALAYSIA campus (in this dataset) offering the same brand cheaper entry
  Known for: Economics & Finance, Chemistry, Oceanography, Law
  Language: Chinese-medium mostly; some English programmes
  Tuition/deadline: NOT verified — confirm on admissions.xmu.edu.cn.

Huazhong University of Science and Technology (HUST) — Wuhan, China [NOT VERIFIED fees — CSC host]
  Type: Top-10 engineering powerhouse with the famed Tongji Medical College
  Known for: Engineering, Medicine, Computer Science, Electrical Engineering
  Notes: MOE-approved English MBBS; one of the biggest CSC hosts in central China. Fees NOT verified — typical English-taught ¥20,000–40,000/yr; confirm on iso.hust.edu.cn.

Jiangsu University — Zhenjiang (Jiangsu), China [NOT VERIFIED fees — CSC workhorse]
  Type: One of China's largest international student cohorts — a classic CSC workhorse
  Known for: Engineering, Medicine, Business, Agriculture
  Notes: MOE-approved English MBBS; heavy CSC/university-scholarship presence — a realistic funded route. Confirm fees on oec.ujs.edu.cn.

Zhengzhou University — Zhengzhou (Henan), China [NOT VERIFIED fees]
  Type: Mega-university (70,000+ students) in low-cost Henan
  Known for: Medicine, Engineering, Materials Science, Business
  Notes: MOE-approved English MBBS; among the cheapest big-city options in China. Confirm on english.zzu.edu.cn.

Tianjin University — Tianjin, China [NOT VERIFIED fees]
  Type: China's oldest modern university (1895) — engineering heritage
  Known for: Engineering, Architecture, Management, Chemistry
  Notes: Tianjin Government Scholarship stacks with CSC. Confirm fees on sie.tju.edu.cn.

Nankai University — Tianjin, China [NOT VERIFIED fees]
  Type: Elite comprehensive famous for economics and finance — Zhou Enlai's alma mater
  Known for: Economics, Finance, Chemistry, Mathematics
  Notes: Tianjin Government Scholarship stacks with CSC. Confirm fees on iao.nankai.edu.cn.

Sichuan University — Chengdu, China [NOT VERIFIED fees]
  Type: Mega-university in laid-back, cheap Chengdu — West China medical fame
  Known for: Medicine, Dentistry, Engineering, Chinese Language
  Notes: MOE-approved English MBBS; West China Stomatology is China's top-ranked dentistry. Confirm on en.scu.edu.cn.

Shandong University — Jinan & Qingdao, China [NOT VERIFIED fees]
  Type: Historic comprehensive spread across two Shandong cities
  Known for: Medicine, Engineering, Mathematics, Humanities
  Notes: MOE-approved English MBBS; Shandong Government Scholarship stacks with CSC. Confirm on istudy.sdu.edu.cn.

Central South University — Changsha (Hunan), China [NOT VERIFIED fees]
  Type: Engineering and medicine giant — Xiangya Medical College heritage
  Known for: Medicine, Mining Engineering, Materials Science, Engineering
  Notes: MOE-approved English MBBS; Xiangya is one of China's historic medical names. Confirm on en.csu.edu.cn.

Southeast University — Nanjing, China [NOT VERIFIED fees]
  Type: Engineering elite of Nanjing — architecture and electronics heritage
  Known for: Engineering, Architecture, Electrical Engineering, Computer Science
  Notes: Jasmine Jiangsu Government Scholarship stacks with CSC. Confirm on international.seu.edu.cn.

Chongqing University — Chongqing, China [NOT VERIFIED fees]
  Type: Southwest engineering flagship in the Yangtze mega-city
  Known for: Engineering, Architecture, Business, Materials Science
  Notes: Chongqing municipal scholarship stacks with CSC. Confirm on international.cqu.edu.cn.

Soochow University — Suzhou (Jiangsu), China [NOT VERIFIED fees]
  Type: Comprehensive university in canal-city Suzhou — strong scholarship presence
  Known for: Medicine, Engineering, Business, Design
  Notes: Jasmine Jiangsu Government Scholarship stacks with CSC. Confirm on global.suda.edu.cn.

Dalian Medical University — Dalian (Liaoning), China [NOT VERIFIED fees — MOE-approved MBBS]
  Type: Dedicated MBBS-for-internationals specialist on the northeast coast
  Known for: Medicine, Dentistry, Nursing
  ⚠ MBBS GOLDEN RULE: enrol ONLY at the 45 MOE-approved English-MBBS universities (this is one) — unapproved schools risk your home-country licensing. Confirm fees on english.dmu.edu.cn.

China Medical University — Shenyang (Liaoning), China [NOT VERIFIED fees — MOE-approved MBBS]
  Type: One of China's longest-running English-MBBS providers (teaching internationals since 1978)
  Known for: Medicine, Pharmacy, Nursing
  Notes: MOE-approved English MBBS; same golden rule — approved list only. Confirm on enweb.cmu.edu.cn.

Xi'an Jiaotong-Liverpool University (XJTLU) — Suzhou (Jiangsu), China [VERIFIED — xjtlu.edu.cn]
  Type: Sino-British joint venture — graduate with BOTH an XJTLU and a University of Liverpool (UK) degree; fully English-medium, no Chinese required
  Known for: Business, Computer Science, Engineering, Design
  International tuition (VERIFIED): RMB 93,000/yr (~$13,000 USD) + RMB 2,000/yr non-tuition charge — a UK dual degree at roughly a third of UK-in-UK cost, with China living costs.
  Scholarships (verified): entry scholarships up to 50% of tuition + 10% Early Bird discount for complete applications by ~15 April; sibling discounts.

University of Nottingham Ningbo China (UNNC) — Ningbo (Zhejiang), China [VERIFIED range — nottingham.edu.cn]
  Type: The first Sino-foreign university (2004) — a full University of Nottingham (UK) degree earned in China; fully English-medium
  Known for: Business, Engineering, Finance, International Relations
  International tuition (official guide): ~RMB 80,000–110,000/yr by year of study (≈ $11,000–15,500 USD); all-in ~RMB 150,000–190,000/yr incl. housing. Confirm current figures.
  Scholarships: Nottingham Global up to 100% of first-year tuition (RMB 110,000, per official guide).

━━ US universities (Common App; ED ~Nov 1 / RD ~Jan; F-1 visa + OPT up to 3 years — see USA country block and scholarships #53–55) ━━

Harvard University — Cambridge, Massachusetts, USA [VERIFIED aid — college.harvard.edu]
  Type: The world's most famous university
  Known for: everything — Economics, Government, Computer Science, Law/Medicine/Business at graduate level
  Aid (verified): NEED-BLIND for internationals; FREE below $100k family income (all billed costs + $2,000 start-up and launch grants); tuition-free below $200k; full-need aid above that by circumstances
  Sticker cost: ~$85,000+/yr all-in before aid — but most aided families pay a fraction
  Deadline: Restrictive Early Action ~Nov 1; Regular Decision ~Jan 1 (Common App)
  ⚠ ~3–4% acceptance. Apply because the aid makes it free if you get in — but hold realistic backups.

Massachusetts Institute of Technology (MIT) — Cambridge, Massachusetts, USA [VERIFIED aid policy]
  Type: The world's premier STEM university
  Known for: Engineering, Computer Science, Physics, Economics, AI
  Aid (verified): NEED-BLIND for internationals; meets 100% of demonstrated need for all four years
  Sticker cost: ~$85,000/yr all-in before aid
  Deadline: Early Action ~Nov 1; Regular ~Jan (applies via its own portal, not Common App); SAT/ACT REQUIRED (reinstated)
  ⚠ ~4% acceptance; international admit rate lower still.

Stanford University — Stanford, California, USA [PARTIALLY VERIFIED — full-need but need-AWARE for internationals]
  Type: The Silicon Valley university
  Known for: Computer Science, Engineering, Business, Entrepreneurship
  Aid: Meets full need for admitted internationals but admission is need-AWARE for them (applying for aid is considered) — still generous for those admitted
  Sticker cost: ~$87,000/yr all-in before aid
  Deadline: REA ~Nov 1; Regular ~Jan 5 (Common App)
  ⚠ ~4% acceptance.

Amherst College — Amherst, Massachusetts, USA [VERIFIED aid — need-blind for internationals]
  Type: A top liberal-arts COLLEGE — small classes, undergraduate-only focus; representative of the elite LAC route many internationals overlook
  Known for: Liberal Arts, Economics, Mathematics, open curriculum
  Aid (verified): NEED-BLIND for all applicants including internationals; meets 100% of need — no loans
  Deadline: ED ~Nov 1; RD ~Jan 3 (Common App)
  ⚠ Elite LACs (Amherst, Bowdoin, Williams, Swarthmore...) are superb aid options — smaller names abroad, huge aid generosity.

New York University (NYU) — New York City, USA [PARTIALLY VERIFIED — largest international enrollment in the US]
  Type: Huge private university in Manhattan (+ Abu Dhabi and Shanghai degree campuses)
  Known for: Business (Stern), Film (Tisch), Computer Science, Economics, Global campuses
  Aid: Limited for internationals at the New York campus — most pay near sticker (~$90,000/yr all-in). NYU ABU DHABI (in this dataset) is the aid-rich alternative — need-based aid can cover nearly everything there.
  Deadline: ED I ~Nov 1, ED II ~Jan 1, RD ~Jan 5 (Common App)
  ⚠ Hosts more international students than any other US university — but budget realistically for NYC.

Arizona State University (ASU) — Tempe, Arizona, USA [PARTIALLY VERIFIED — accessible-tier representative]
  Type: One of the largest and most innovation-ranked US public universities — accessible admission, huge international cohort
  Known for: Engineering, Business (W. P. Carey), Journalism, Sustainability
  Cost: Non-resident tuition ~$33,000–$35,000/yr + living (~$50,000 all-in); merit scholarships (e.g. New American University awards) cut this substantially for good students
  Deadline: Rolling admission for most programmes — apply anytime; priority dates apply for scholarships
  ⚠ The accessible end of US study: high acceptance, transparent merit aid, genuine quality — a strong backup to elite applications.

Princeton University — Princeton, New Jersey, USA [VERIFIED aid — need-blind, 100% grant-based aid]
  Known for: Economics, Public Policy, Mathematics, Engineering
  Aid: Need-blind for internationals; meets 100% of need with GRANTS (no loans). Deadline: REA ~Nov 1 / RD ~Jan 1. ⚠ ~4% acceptance.

Yale University — New Haven, Connecticut, USA [VERIFIED aid — need-blind for internationals]
  Known for: Law-track programmes, Political Science, History, Drama, Economics
  Aid: Need-blind + full-need for internationals, no loans required. Deadline: REA ~Nov 1 / RD ~Jan 2. ⚠ ~4% acceptance.

Columbia University — New York City, USA [NOT individually verified — need-aware for internationals]
  Known for: Journalism, Economics, Engineering, Political Science
  Aid: Generous full-need aid but need-AWARE for internationals — confirm current policy. Deadline: ED ~Nov 1 / RD ~Jan 1.

University of Pennsylvania (UPenn) — Philadelphia, USA [NOT individually verified — need-aware for internationals]
  Known for: Business (Wharton), Nursing, Engineering, Economics
  Aid: Meets full need of admitted students; need-aware for internationals — confirm. Deadline: ED ~Nov 1 / RD ~Jan 5.

Cornell University — Ithaca, New York, USA [NOT individually verified — need-aware for internationals]
  Known for: Engineering, Hotel Administration, Agriculture, Computer Science
  Aid: Meets full need of admitted internationals; need-aware — confirm. Deadline: ED ~Nov 1 / RD ~Jan 2.

Duke University — Durham, North Carolina, USA [NOT individually verified — need-aware for internationals]
  Known for: Biomedical Engineering, Public Policy, Economics, Basketball-famous campus culture
  Aid: Meets full need of admitted internationals; need-aware — confirm. Deadline: ED ~Nov 1 / RD ~Jan 2.

University of California, Berkeley — Berkeley, California, USA [NOT individually verified fees — UC system]
  Known for: Computer Science, Engineering, Economics, Data Science
  Cost: Non-resident ~$50,000 tuition+fees (+ Bay Area living) — UCs give internationals essentially NO need-based aid; budget full cost. Deadline: UC application (separate from Common App) — Nov 30 for all UCs.

University of California, Los Angeles (UCLA) — Los Angeles, USA [NOT individually verified fees — UC system]
  Known for: Film, Engineering, Economics, Psychology — the most applied-to university in the US
  Cost: Same UC pattern as Berkeley: ~$50,000 non-resident tuition+fees, no international need aid. Deadline: UC application, Nov 30.

University of Michigan — Ann Arbor, Michigan, USA [NOT individually verified fees]
  Known for: Engineering, Business (Ross), Medicine-track, Public Policy
  Cost: Non-resident ~$60,000+ tuition+fees; limited international aid. Deadline: EA ~Nov 1 / RD ~Feb 1 (Common App).

Georgia Institute of Technology (Georgia Tech) — Atlanta, Georgia, USA [NOT individually verified fees]
  Known for: Engineering (top-5 in most branches), Computer Science, Analytics
  Cost: Among the best VALUE elite engineering options — non-resident tuition ~$33,000–$35,000/yr; famous low-cost online MS in CS (~$7,000 total) as a graduate alternative. Deadline: EA ~Oct–Nov / RD ~Jan (Common App).

Purdue University — West Lafayette, Indiana, USA [NOT individually verified fees]
  Known for: Engineering, Computer Science, Aviation, Agriculture
  Cost: Value pick — tuition frozen for over a decade; non-resident ~$29,000/yr tuition + low Indiana living costs; huge international community. Deadline: EA ~Nov 1 / RD ~Jan 15 (Common App).

University of Illinois Urbana-Champaign (UIUC) — Urbana-Champaign, Illinois, USA [NOT individually verified fees]
  Known for: Computer Science, Engineering, Accounting, Physics
  Cost: Non-resident ~$40,000–$45,000 tuition by major (engineering/CS higher); limited international aid. Deadline: EA ~Nov 1 / RD ~Jan.

University of Texas at Austin — Austin, Texas, USA [NOT individually verified fees]
  Known for: Computer Science, Engineering, Business (McCombs), Radio-Television-Film
  Cost: Non-resident ~$40,000–$48,000 tuition; little international aid, but Austin tech job market is a draw. Deadline: ~Dec 1 (ApplyTexas/Common App).

University of Alabama — Tuscaloosa, Alabama, USA [PARTIALLY VERIFIED — merit policy advertised; confirm current terms]
  Known for: Business, Engineering, Communication — and famously TRANSPARENT automatic merit aid
  Cost: Non-resident tuition ~$33,000/yr BEFORE merit — the university has long advertised AUTOMATIC scholarships (up to full tuition) for qualifying grades/test scores, open to internationals; low Alabama living costs
  Deadline: Rolling with scholarship priority dates — confirm current merit tables on ua.edu
  ⚠ The archetype of the merit-aid route (see scholarship #55): strong stats can make the US cheaper than sticker-price Europe.

Dartmouth College — Hanover, New Hampshire, USA [VERIFIED aid policy — financialaid.dartmouth.edu]
  Type: Ivy League — universal NEED-BLIND including internationals (2022 policy, verified) + meets 100% of demonstrated need
  Known for: Liberal Arts, Economics, Government, Engineering
  Cost: sticker ~$85k+/yr all-in, but aid removes the barrier for admitted low-income internationals. Apply with the full aid application.

Brown University — Providence, Rhode Island, USA [VERIFIED aid policy — admission.brown.edu]
  Type: Ivy League — the NEWEST need-blind school for internationals (first-years from the Class of 2029 / fall 2025 entry, verified); meets 100% of need for all admitted
  Known for: Liberal Arts, Computer Science, Economics, Public Health

Berea College — Berea, Kentucky, USA [VERIFIED — berea.edu; ★ the budget gem]
  Type: The NO-TUITION college — the ONLY US school funding 100% of enrolled internationals (verified)
  Known for: Liberal Arts, Business, Computer Science, Nursing
  Package (verified): No-Tuition Promise for every admitted student; aid + scholarships cover tuition, housing, food, fees; paid campus job (~$2,000 first year for personal costs). Limited international seats — intensely competitive; apply very early.

Brigham Young University (BYU) — Provo, Utah, USA [VERIFIED tuition — enrollment.byu.edu 2025-26]
  Type: The cheapest reputable private in America — church-subsidised tuition
  Known for: Business, Accounting & Finance, Engineering, Languages
  Tuition (verified 2025-26): $3,444/semester (~$6,888/yr) for Latter-day Saint members; non-members pay DOUBLE (~$13,776/yr) — still a fraction of US norms. ⚠ Religious environment and Honor Code apply to all students.

Minerva University — San Francisco (+ 6 global rotation cities), USA [PARTIALLY VERIFIED — costs not confirmed]
  Type: Radically different — four years living across 7 world cities; majority-international student body; fully accredited
  Known for: Computer Science, Business, Social Sciences, Data Science
  Cost: markedly below US norms (~$25k/yr all-in commonly cited — NOT verified; confirm on minerva.edu) + need-based aid. Extremely selective but stats-light admissions.

Caltech — Pasadena, California, USA [WELL-DOCUMENTED aid — admissions.caltech.edu]
  Type: The tiny science powerhouse — meets 100% of demonstrated need of every admit incl. internationals (admission need-aware for internationals)
  Known for: Physics, Engineering, Computer Science, Mathematics
  Cost: sticker ~$86k/yr; tiny class, brutal odds.

Johns Hopkins University — Baltimore, Maryland, USA [WELL-DOCUMENTED aid — confirm on jhu.edu]
  Type: America's medicine and public-health name; meets full need of admitted internationals (need-aware admission)
  Known for: Medicine, Public Health, Biomedical Engineering, International Relations

University of Chicago — Chicago, Illinois, USA [NOT individually verified aid pool]
  Type: Elite research brand — economics royalty
  Known for: Economics, Mathematics, Political Science, Physics
  ⚠ International aid exists but the pool is limited and need-aware — you MUST apply for aid AT admission (cannot request later). Sticker ~$90k/yr all-in.

Rice University — Houston, Texas, USA [WELL-DOCUMENTED aid — confirm on rice.edu]
  Type: Small elite in the energy/medical capital — generous aid culture; admitted internationals get full-need packages (need-aware admission)
  Known for: Engineering, Computer Science, Business, Architecture
  Notes: Houston costs are low for a major US city.

Vanderbilt University — Nashville, Tennessee, USA [WELL-DOCUMENTED merit — confirm on vanderbilt.edu]
  Type: Elite southern private — famous FULL-RIDE merit scholarships open to internationals
  Known for: Economics, Engineering, Education, Medicine
  ★ Ingram / Cornelius Vanderbilt / Chancellor's merit scholarships cover full tuition-plus and are OPEN to internationals (separate application ~Dec 1); regular international aid is need-aware.

Carnegie Mellon University (CMU) — Pittsburgh, Pennsylvania, USA [WELL-DOCUMENTED — no intl aid]
  Type: The computer-science name on every list
  Known for: Computer Science, AI & Computer Science, Robotics, Design
  ⚠ HONEST NOTE: CMU offers essentially NO financial aid to international undergraduates — budget the full ~$84k+/yr, or target its Qatar campus (in this dataset) or funded graduate programmes.

University of Washington (UW) — Seattle, Washington, USA [NOT individually verified fees]
  Type: CS/tech public powerhouse in Amazon-and-Microsoft country
  Known for: Computer Science, Engineering, Medicine, Oceanography
  Cost: non-resident tuition ~$43k/yr; ⚠ essentially no aid for international undergrads; direct CS admission hyper-competitive. Superb tech job market for OPT.

UC San Diego (UCSD) — San Diego, California, USA [NOT individually verified fees]
  Type: UC-system heavyweight — biology and CS strength on the Pacific
  Known for: Biology, Computer Science, Engineering, Oceanography
  Cost: non-resident all-in commonly ~$70k/yr; ⚠ the UC system gives internationals NO need-based aid and minimal merit — budget fully. UC application closes Nov 30.

━━ Australian universities (Feb & July intakes; visa needs AU$29,710/yr + tuition + travel; 485 post-study visa 2–3 years — see Australia country block) ━━

University of Melbourne — Melbourne, Australia [PARTIALLY VERIFIED — fees per course]
  Type: Australia's #1-ranked university — Melbourne Model (broad undergrad + graduate professional degrees)
  Known for: Medicine, Law (JD), Engineering, Computer Science, Arts
  International tuition: Set per course, top of the Australian range (~AU$45,000–$60,000+/yr for most undergrad) — confirm on study.unimelb.edu.au
  Deadline: Semester 1 (Feb) applications generally ~Oct–Dec; Semester 2 (Jul) ~Apr–May — confirm
  Scholarship here: Melbourne International Undergraduate Scholarship (fee remissions up to 100% for a small number) — confirm current terms; RTP for research degrees

University of Sydney — Sydney, Australia [PARTIALLY VERIFIED — fees per course]
  Type: Australia's oldest university — Go8, huge international cohort
  Known for: Medicine, Law, Business, Engineering, Architecture
  International tuition: Set per course (~AU$45,000–$60,000+/yr undergrad) — confirm on sydney.edu.au
  Deadline: Feb & Jul intakes — confirm per course
  Scholarship here: Sydney International Student Awards (partial) — confirm; RTP for research degrees

Monash University — Melbourne, Australia [PARTIALLY VERIFIED — Malaysia campus verified in this dataset]
  Type: Australia's largest Go8 university
  Known for: Pharmacy (world top-3), Medicine, Engineering, Business, IT
  International tuition: Set per course (~AU$40,000–$55,000/yr undergrad) — confirm on monash.edu
  Deadline: Feb & Jul intakes — confirm
  ★ Budget route: Monash MALAYSIA (verified in this dataset at ~$11,300–$16,100 USD/yr) awards the SAME degree for a fraction of the Australian price — compare seriously.

Australian National University (ANU) — Canberra, Australia [NOT VERIFIED fees — confirm on anu.edu.au]
  Type: Australia's national research university — top-ranked for politics/policy
  Known for: Politics & International Relations, Physics, Computer Science, Law
  Tuition/deadline: NOT verified — confirm on anu.edu.au. Canberra is a designated regional area → potentially +1 year on the 485 post-study visa.

University of New South Wales (UNSW) — Sydney, Australia [NOT VERIFIED fees — confirm on unsw.edu.au]
  Type: Go8 — engineering and business heavyweight with three intakes/yr (trimesters)
  Known for: Engineering, Computer Science, Business (AGSM), Solar/Photovoltaics
  Tuition/deadline: NOT verified — confirm on unsw.edu.au. Trimester system means three entry points a year.

University of Queensland (UQ) — Brisbane, Australia [NOT VERIFIED fees — confirm on uq.edu.au]
  Type: Go8 — strong sciences, Brisbane's lower living costs than Sydney/Melbourne
  Known for: Biotechnology, Mining Engineering, Psychology, Agriculture, Sports Science
  Tuition/deadline: NOT verified — confirm on uq.edu.au.

University of Western Australia (UWA) — Perth, Australia [NOT VERIFIED fees — confirm on uwa.edu.au]
  Type: Go8 in Perth — resources/engineering links; Perth counts as REGIONAL for the 485 (+1 year)
  Known for: Mining & Petroleum Engineering, Marine Science, Medicine, Agriculture
  Tuition/deadline: NOT verified — confirm on uwa.edu.au.

University of Adelaide — Adelaide, Australia [NOT VERIFIED fees — confirm on adelaide.edu.au]
  Type: Go8 in South Australia — Adelaide is a designated regional area (+1 year on the 485) with lower living costs
  Known for: Wine/Agriculture, Engineering, Medicine, Defence-linked tech
  Tuition/deadline: NOT verified — confirm on adelaide.edu.au. (Merging with UniSA to form Adelaide University — watch for the new name.)

University of Technology Sydney (UTS) — Sydney, Australia [NOT VERIFIED fees — confirm on uts.edu.au]
  Type: Australia's top young university — industry-focused
  Known for: IT, Engineering, Design, Business, Nursing
  Tuition/deadline: NOT verified — confirm on uts.edu.au.

RMIT University — Melbourne, Australia [NOT VERIFIED fees — confirm on rmit.edu.au]
  Type: Practice-oriented tech/design university (also campuses in Vietnam)
  Known for: Design, IT, Engineering, Fashion, Media
  Tuition/deadline: NOT verified — confirm on rmit.edu.au.

Deakin University — Melbourne/Geelong, Australia [NOT VERIFIED fees — confirm on deakin.edu.au]
  Type: Large accessible university — strong online/flexible study; Geelong campuses count as regional (+1 year 485)
  Known for: Sport Science (world top-ranked), Nursing, Teaching, Business
  Tuition/deadline: NOT verified — confirm on deakin.edu.au.

Macquarie University — Sydney, Australia [NOT VERIFIED fees — confirm on mq.edu.au]
  Type: Sydney university adjacent to a major business/tech park
  Known for: Finance & Actuarial Studies, Linguistics, Psychology, Media
  Tuition/deadline: NOT verified — confirm on mq.edu.au.

University of Wollongong (UOW) — Wollongong, Australia [NOT VERIFIED fees — confirm on uow.edu.au]
  Type: Coastal university south of Sydney — regional area (+1 year 485); parent of UOW DUBAI (in this dataset)
  Known for: Engineering, Computer Science, Business, Nursing
  Tuition/deadline: NOT verified — confirm on uow.edu.au. Its Dubai campus offers a cheaper same-brand route.

Curtin University — Perth, Australia [NOT VERIFIED fees — confirm on curtin.edu.au]
  Type: Perth's largest university — mining/resources heritage; parent of Curtin MALAYSIA (in this dataset); Perth is regional for the 485 (+1 year)
  Known for: Mining Engineering, Geoscience, Health Sciences, Business
  Tuition/deadline: NOT verified — confirm on curtin.edu.au. Curtin Malaysia offers the same degree far cheaper.

Queensland University of Technology (QUT) — Brisbane, Australia [NOT VERIFIED fees — confirm on qut.edu.au]
  Type: "A university for the real world" — applied, industry-connected
  Known for: Media & Communication, IT, Nursing, Business, Creative Industries
  Tuition/deadline: NOT verified — confirm on qut.edu.au.

Griffith University — Brisbane / Gold Coast, Australia [NOT VERIFIED fees — confirm on griffith.edu.au]
  Type: Accessible Queensland university — health/nursing strength
  Known for: Nursing, Health Sciences, Business, Criminology
  Notes: The Gold Coast campus counts as a designated regional area — extra post-study 485 time; confirm current settings on immi.homeaffairs.gov.au.

La Trobe University — Melbourne (+ regional Victoria campuses), Australia [NOT VERIFIED fees — confirm on latrobe.edu.au]
  Type: Melbourne university whose regional campuses (Bendigo etc.) carry the regional visa bonus
  Known for: Health Sciences, Business, Science, Education
  Notes: Study at a regional campus for the 485 bonus + cheaper living.

University of Newcastle — Newcastle (NSW), Australia [NOT VERIFIED fees — confirm on newcastle.edu.au]
  Type: Research-strong regional NSW university — cheaper than Sydney
  Known for: Engineering, Medicine, Nursing, Education
  Notes: Designated regional area (+1 year post-study 485).

Flinders University — Adelaide, Australia [NOT VERIFIED fees — confirm on flinders.edu.au]
  Type: Adelaide health/medicine specialist — lower entry bar than its Go8 neighbour
  Known for: Medicine, Nursing, Psychology, Public Health
  Notes: Adelaide is a designated regional area (+1 year post-study 485) with lower living costs.

University of Tasmania (UTAS) — Hobart / Launceston, Australia [NOT VERIFIED fees — confirm on utas.edu.au]
  Type: The budget-and-visa play — cheap living, regional 485 bonus, famously generous automatic international scholarships
  Known for: Marine Science, Nursing, Engineering, Agriculture
  Notes: Tasmania's regional classification gives extra post-study time; UTAS routinely offers automatic percentage scholarships to internationals — confirm current offers on utas.edu.au.

━━ German universities (public = tuition-free + semester fee, EXCEPT Baden-Württemberg €1,500/sem non-EU; blocked account €11,904; 18-month job-seeker permit — see Germany country block; TUM listed separately above) ━━

Ludwig Maximilian University of Munich (LMU) — Munich, Germany [PARTIALLY VERIFIED — tuition-free status; confirm per programme]
  Type: Germany's highest-ranked comprehensive university — TUM's neighbour and rival
  Known for: Medicine, Physics, Law, Psychology, Humanities
  Language: Mostly German-taught bachelor's; many English master's
  Tuition: FREE (Bavaria allows fees but LMU has NOT introduced general non-EU tuition — confirm current status) + semester fee ~€150. Munich living is Germany's priciest (~€1,200–1,500/month realistic).
  Deadline: ~15 July (winter) / ~15 January (summer) — confirm per programme
  Scholarship here: Deutschlandstipendium (see #58); DAAD for graduate study (#1)

Heidelberg University — Heidelberg, Germany [PARTIALLY VERIFIED — BW fee applies]
  Type: Germany's oldest university (1386) — research powerhouse
  Known for: Medicine, Life Sciences, Physics, Philosophy, Law
  Language: Mostly German-taught bachelor's; strong English master's/PhD
  Tuition: €1,500/semester for non-EU students (Baden-Württemberg state fee, verified) + semester fee ~€160 — still far below UK/US totals
  Deadline: ~15 July / ~15 January — confirm per programme

RWTH Aachen University — Aachen, Germany [PARTIALLY VERIFIED — tuition-free]
  Type: Germany's largest technical university — the engineering employer favourite
  Known for: Mechanical Engineering, Electrical Engineering, Computer Science, Materials
  Language: German-taught bachelor's mostly; many English master's
  Tuition: FREE + semester fee ~€300 (incl. transit). Aachen is a cheap student city near the Dutch/Belgian border.
  Deadline: ~15 July / ~15 January — confirm; many programmes via uni-assist

Free University of Berlin (FU Berlin) — Berlin, Germany [NOT individually verified — tuition-free]
  Known for: Political Science, Humanities, Biology, Veterinary Medicine
  Language: German bachelor's mostly; several English master's. Tuition: FREE + semester fee ~€300 (incl. Berlin transit). Deadline ~15 Jul / 15 Jan.

Humboldt University of Berlin (HU Berlin) — Berlin, Germany [NOT individually verified — tuition-free]
  Known for: Humanities, Law, Social Sciences, Life Sciences (Charité medicine shared with FU)
  Language: German bachelor's mostly. Tuition: FREE + semester fee ~€300. Deadline ~15 Jul / 15 Jan.

Technical University of Berlin (TU Berlin) — Berlin, Germany [NOT individually verified — tuition-free]
  Known for: Engineering, Computer Science, Urban Planning
  Language: German bachelor's mostly; many English master's. Tuition: FREE + semester fee ~€300. Deadline ~15 Jul / 15 Jan.

Karlsruhe Institute of Technology (KIT) — Karlsruhe, Germany [PARTIALLY VERIFIED — BW fee applies]
  Known for: Computer Science, Mechanical Engineering, Physics — "Germany's MIT" reputation
  Language: German bachelor's mostly; English master's. Tuition: €1,500/semester non-EU (BW fee, verified) + ~€160 semester fee. Deadline ~15 Jul / 15 Jan.

University of Stuttgart — Stuttgart, Germany [PARTIALLY VERIFIED — BW fee applies]
  Known for: Automotive & Aerospace Engineering, Civil Engineering (Mercedes/Porsche/Bosch country)
  Language: German bachelor's mostly; English master's. Tuition: €1,500/semester non-EU (BW) + semester fee. Deadline ~15 Jul / 15 Jan.

University of Freiburg — Freiburg, Germany [PARTIALLY VERIFIED — BW fee applies]
  Known for: Medicine, Biology, Forestry/Environment, Philosophy
  Language: German bachelor's mostly. Tuition: €1,500/semester non-EU (BW) + ~€160. Deadline ~15 Jul / 15 Jan.

Technical University of Darmstadt — Darmstadt, Germany [NOT individually verified — tuition-free]
  Known for: Computer Science, Electrical Engineering, Mechanical Engineering, Cybersecurity
  Language: German bachelor's mostly; English master's. Tuition: FREE + semester fee ~€300. Deadline ~15 Jul / 15 Jan.

University of Bonn — Bonn, Germany [NOT individually verified — tuition-free]
  Known for: Mathematics (Hausdorff Center), Economics, Astronomy, Agriculture
  Language: German bachelor's mostly. Tuition: FREE + semester fee ~€330. Deadline ~15 Jul / 15 Jan.

University of Göttingen — Göttingen, Germany [NOT individually verified — tuition-free]
  Known for: Physics, Mathematics, Agricultural Sciences, Law — historic Nobel factory
  Language: German bachelor's mostly; English master's. Tuition: FREE + semester fee ~€400. Deadline ~15 Jul / 15 Jan.

University of Hamburg — Hamburg, Germany [NOT individually verified — tuition-free]
  Known for: Climate Science, Law, Business, Physics
  Language: German bachelor's mostly. Tuition: FREE + semester fee ~€350. Deadline ~15 Jul / 15 Jan.

University of Cologne — Cologne, Germany [NOT individually verified — tuition-free]
  Known for: Business & Economics (WiSo), Law, Media Studies, Medicine
  Language: German bachelor's mostly. Tuition: FREE + semester fee ~€330. Deadline ~15 Jul / 15 Jan.

TU Dresden — Dresden, Germany [VERIFIED tuition-free — tu-dresden.de 2026]
  Type: Saxony's technical flagship — engineering excellence in one of Germany's cheapest big student cities
  Known for: Engineering, Computer Science, Materials Science
  Language: German bachelor's mostly; English master's. Tuition: FREE for internationals (Saxony charges no non-EU tuition) + ~€300 semester fee incl. transit. Deadline ~15 Jul / 15 Jan.

University of Münster — Münster, Germany [NOT individually verified — tuition-free]
  Known for: Law, Business, Medicine, Psychology — large classic university, Germany's bicycle capital
  Language: German bachelor's mostly. Tuition: FREE + semester fee ~€300. Deadline ~15 Jul / 15 Jan.

Goethe University Frankfurt — Frankfurt, Germany [NOT individually verified — tuition-free]
  Known for: Finance, Economics, Law, Medicine — Germany's finance capital on your doorstep
  Language: German bachelor's mostly; English master's (esp. finance/econ). Tuition: FREE + semester fee ~€370. Deadline ~15 Jul / 15 Jan.

University of Tübingen — Tübingen, Germany [PARTIALLY VERIFIED — BW fee applies]
  Known for: AI & Computer Science (Cyber Valley — Europe's biggest AI research cluster), Medicine, Neuroscience, Theology
  Language: German bachelor's mostly; English master's (ML/AI programmes are famous). Tuition: €1,500/semester non-EU (Baden-Württemberg fee, verified) + semester fee. Deadline ~15 Jul / 15 Jan.

University of Mannheim — Mannheim, Germany [PARTIALLY VERIFIED — BW fee applies, uni-mannheim.de]
  Known for: Business, Economics, Social Sciences, Data Science — Germany's top address for business, campus in a baroque palace
  Language: Many programmes have strong English components; business master's largely English. Tuition: €1,500/semester non-EU (BW fee, verified 2026) + semester fee. Deadline: Mannheim's calendar differs from the German classic (fall semester starts ~September) — confirm on uni-mannheim.de.

FAU Erlangen-Nürnberg — Erlangen/Nuremberg, Germany [VERIFIED fee change — fau.eu 2026]
  Type: Bavaria's big engineering & medicine university — Siemens country
  Known for: Engineering, Medicine, AI & Computer Science, Economics
  Language: German bachelor's mostly; English master's.
  ⚠ FEES COMING (verified 2026): FREE for anyone who enrols BEFORE summer semester 2027 (already-enrolled stay free). NEW non-EU students from summer 2027 pay €1,000–€3,000/semester (bachelor's) or €2,000–€6,000/semester (master's) — e.g. Psychology MSc €4,000, Molecular Medicine MSc €6,000. Plus €100 non-EU application processing fee from winter 2026/27 (max 3 applications/round). Semester contribution ~€82–127. Exemptions: EU/EEA, German Abitur holders, 5+ years' legal residence/work in Germany, doctoral & exchange students.
  Deadline: ~15 Jul / 15 Jan — confirm per programme.

Leibniz University Hannover — Hanover, Germany [NOT individually verified — tuition-free]
  Known for: Mechanical Engineering, Electrical Engineering, Civil Engineering — Lower Saxony's technical flagship
  Language: German bachelor's mostly. Tuition: FREE + semester fee ~€400. Deadline ~15 Jul / 15 Jan.

Ruhr University Bochum — Bochum, Germany [NOT individually verified — tuition-free]
  Known for: Cybersecurity (one of Europe's top IT-security faculties), Engineering, Medicine, Psychology
  Language: German bachelor's mostly; English master's incl. IT security. Tuition: FREE + semester fee ~€350. Deadline ~15 Jul / 15 Jan.

University of Duisburg-Essen — Duisburg/Essen, Germany [NOT individually verified — tuition-free]
  Known for: Engineering, Business, Medicine, Education — young mega-university with one of Germany's most international student bodies
  Language: German bachelor's mostly; ISE (International Studies in Engineering) programmes in English. Tuition: FREE + semester fee ~€350. Deadline ~15 Jul / 15 Jan.

Friedrich Schiller University Jena — Jena, Germany [NOT individually verified — tuition-free]
  Known for: Physics, Chemistry, Biology, Humanities — the optics & photonics capital (Zeiss was born here); cheap, walkable student city
  Language: German bachelor's mostly; English master's (photonics is famous). Tuition: FREE + semester fee ~€280. Deadline ~15 Jul / 15 Jan.

━━ South African universities (SADC citizens pay LOCAL fees + levy — see country block & scholarship #60; UCT and Stellenbosch listed separately above) ━━

University of the Witwatersrand (Wits) — Johannesburg, South Africa [VERIFIED fee policy — wits.ac.za 2026]
  Type: Johannesburg's flagship research university — mining/finance heritage, Nelson Mandela's alma mater
  Known for: Mining Engineering, Medicine, Law, Business, Palaeosciences
  Language: English-medium instruction
  International fees (2026, verified policy): SADC citizens pay LOCAL tuition + R6,970 International Registration Fee; non-SADC undergraduates pay DOUBLE local tuition. 75% of tuition due at registration, balance by 30 June.
  Deadline: Applications generally ~30 June (health sciences earlier) to ~30 September for the following year — confirm on wits.ac.za
  Scholarship here: Mandela Rhodes tenable for postgraduate study (see #9); Wits merit awards — check official site

University of Pretoria (UP) — Pretoria, South Africa [VERIFIED fee policy — up.ac.za 2026]
  Type: One of South Africa's largest research universities
  Known for: Engineering, Veterinary Science (Africa's only full faculty), Law, Business (GIBS)
  Language: English-medium instruction
  International fees (2026, verified policy): SADC citizens pay local tuition + R4,725 international levy; non-SADC pay double tuition + levy. Non-SADC postgrads pay 50% before registration.
  Deadline: Programme-dependent (~May–Sep for the following year) — confirm on up.ac.za

University of Johannesburg (UJ) — Johannesburg, South Africa [NOT VERIFIED fees — confirm on uj.ac.za]
  Type: Large, accessible comprehensive university
  Known for: Engineering, Business, Education, Art & Design
  Language: English-medium instruction
  Fees/deadline: NOT verified — SADC rule applies as at other publics; confirm on uj.ac.za

University of KwaZulu-Natal (UKZN) — Durban, South Africa [NOT VERIFIED fees — confirm on ukzn.ac.za]
  Type: Major coastal research university
  Known for: Medicine (Nelson R. Mandela School), Agriculture, Engineering, Social Sciences
  Language: English-medium instruction
  Fees/deadline: NOT verified — publishes an international fee guide yearly; SADC rule applies; confirm on ukzn.ac.za

Rhodes University — Makhanda (Grahamstown), South Africa [NOT VERIFIED fees — confirm on ru.ac.za]
  Type: Small, residential, high-touch university — outstanding pass rates
  Known for: Journalism & Media Studies, Pharmacy, Law, Ichthyology
  Language: English-medium instruction
  Fees/deadline: NOT verified — SADC rule applies; confirm on ru.ac.za

University of the Western Cape (UWC) — Cape Town (Bellville), South Africa [NOT VERIFIED fees — confirm on uwc.ac.za]
  Type: Historically significant university — affordable Cape Town option
  Known for: Dentistry, Public Health, Law, Astrophysics (SKA involvement)
  Language: English-medium instruction
  Fees/deadline: NOT verified — SADC rule applies; confirm on uwc.ac.za

Nelson Mandela University — Gqeberha (Port Elizabeth), South Africa [NOT VERIFIED fees — confirm on mandela.ac.za]
  Type: Coastal comprehensive university — ocean sciences niche
  Known for: Ocean Sciences, Business, Engineering, Health Sciences
  Language: English-medium instruction
  Fees/deadline: NOT verified — SADC rule applies; confirm on mandela.ac.za

University of South Africa (UNISA) — Pretoria (DISTANCE learning), South Africa [NOT VERIFIED fees — confirm on unisa.ac.za]
  Type: Africa's mega distance-education university (300,000+ students) — study from YOUR OWN COUNTRY
  Known for: Law, Business, Education, Theology — almost everything by correspondence/online
  Language: English-medium instruction
  Fees/deadline: NOT verified — famously low per-module fees; no visa needed since you study from home; two registration periods yearly. Confirm on unisa.ac.za.
  ⚠ Check professional-body recognition of distance degrees in your home country before enrolling.

North-West University (NWU) — Potchefstroom (+ Mahikeng & Vanderbijlpark), South Africa [NOT VERIFIED fees — SADC rule applies]
  Type: Big three-campus university — among South Africa's most affordable comprehensives
  Known for: Engineering, Business, Education, Theology
  Fees/deadline: NOT verified — SADC citizens pay local fees + levy (verified protocol); confirm on nwu.ac.za

University of the Free State (UFS) — Bloemfontein, South Africa [NOT VERIFIED fees — SADC rule applies]
  Type: Affordable central-SA research university
  Known for: Agriculture, Law, Medicine, Humanities
  Fees/deadline: NOT verified — SADC rule applies; confirm on ufs.ac.za

Tshwane University of Technology (TUT) — Pretoria, South Africa [NOT VERIFIED fees — SADC rule applies]
  Type: South Africa's largest university of technology — practical, career-focused, very affordable
  Known for: Engineering, IT, Hospitality, Design
  Fees/deadline: NOT verified — universities of technology are typically the cheapest tier; SADC rule applies; confirm on tut.ac.za

Cape Peninsula University of Technology (CPUT) — Cape Town, South Africa [NOT VERIFIED fees — SADC rule applies]
  Type: The Western Cape's big university of technology — applied degrees at low cost
  Known for: Engineering, IT, Health Sciences, Design
  Fees/deadline: NOT verified — SADC rule applies; confirm on cput.ac.za

University of Fort Hare — Alice (Eastern Cape), South Africa [NOT VERIFIED fees — SADC rule applies]
  Type: The legendary pan-African alma mater — Mandela, Tambo, Mugabe, Nyerere and Kaunda studied here
  Known for: Law, Humanities, Agriculture, Education
  Fees/deadline: NOT verified — SADC rule applies; confirm on ufh.ac.za

━━ Irish universities (undergrad via the CAO ~1 Feb; Stamp 1G stay-back 12–24 months; visa needs €12,000/yr + tuition — see Ireland country block) ━━

Trinity College Dublin (TCD) — Dublin, Ireland [VERIFIED — tcd.ie 2026/27 fee range]
  Type: Ireland's most famous and highest-ranked university (founded 1592)
  Known for: Law, English Literature, Computer Science, Medicine, Business
  Language: English-medium instruction
  Non-EU tuition (2026/27, verified): €21,570–€29,570/yr by course (medicine higher)
  Deadline: CAO by ~1 February (some courses accept later non-EU direct applications — confirm on tcd.ie)
  Scholarship here: Trinity Global Excellence Scholarships (partial merit — confirm terms); GOI-IES for master's/PhD (see #4)

University College Dublin (UCD) — Dublin, Ireland [PARTIALLY VERIFIED — fees per programme on official pages]
  Type: Ireland's largest university — global outlook, huge international cohort
  Known for: Business (Smurfit/Quinn), Engineering, Agriculture & Food Science, Medicine, Computer Science
  Language: English-medium instruction
  Non-EU tuition: Set per programme (~€20,000–€29,000/yr for most non-medical UG) — confirm on ucd.ie/students/fees
  Deadline: CAO ~1 Feb; postgrad rolling — confirm
  Scholarship here: UCD Global Scholarships (partial merit); GOI-IES for postgrad (see #4)

University College Cork (UCC) — Cork, Ireland [NOT VERIFIED fees — confirm on ucc.ie]
  Type: Research university in Ireland's second city — cheaper living than Dublin
  Known for: Food Science, Pharmacy, Law, Medicine, Microbiology
  Language: English-medium instruction
  Fees/deadline: NOT verified — confirm on ucc.ie; CAO for undergrad

University of Galway — Galway, Ireland [NOT VERIFIED fees — confirm on universityofgalway.ie]
  Type: West-coast university in Ireland's most student-centric small city; medtech industry hub
  Known for: Biomedical Engineering, Medicine, Law (human rights), Marine Science
  Language: English-medium instruction
  Fees/deadline: NOT verified — confirm on universityofgalway.ie; CAO for undergrad

University of Limerick (UL) — Limerick, Ireland [NOT VERIFIED fees — confirm on ul.ie]
  Type: Modern campus university famous for co-op — most programmes include an 8-month paid work placement
  Known for: Engineering, Sports Science, Music (Irish World Academy), Business
  Language: English-medium instruction
  Fees/deadline: NOT verified — confirm on ul.ie; CAO for undergrad

Dublin City University (DCU) — Dublin, Ireland [NOT VERIFIED fees — confirm on dcu.ie]
  Type: Young, enterprise-focused Dublin university with strong INTRA work placements
  Known for: Communications/Journalism, Business, Computing, Education
  Language: English-medium instruction
  Fees/deadline: NOT verified — confirm on dcu.ie; CAO for undergrad

Maynooth University — Maynooth (near Dublin), Ireland [NOT VERIFIED fees — confirm on maynoothuniversity.ie]
  Type: Ireland's fastest-growing university — a university town 25 minutes from Dublin with lower living costs
  Known for: Computer Science, Education, Humanities, Geography
  Language: English-medium instruction
  Fees/deadline: NOT verified — confirm on maynoothuniversity.ie; CAO for undergrad

RCSI University of Medicine and Health Sciences — Dublin, Ireland [NOT VERIFIED fees — confirm on rcsi.com]
  Type: Health-sciences specialist (est. 1784) — one of Europe's most international medical schools
  Known for: Medicine, Pharmacy, Physiotherapy, Nursing
  Fees/deadline: NOT verified — medicine fees are substantial; confirm on rcsi.com. GOI-IES tenable at Irish institutions (see scholarship list).

Munster Technological University (MTU) — Cork & Kerry, Ireland [NOT VERIFIED fees — confirm on mtu.ie]
  Type: Applied technological university — practical degrees at fees below the traditional universities
  Known for: Engineering, IT, Business, Music
  Fees/deadline: NOT verified — technological universities are Ireland's value tier; confirm on mtu.ie.

South East Technological University (SETU) — Waterford & Carlow, Ireland [NOT VERIFIED fees — confirm on setu.ie]
  Type: The southeast's technological university — among Ireland's most affordable routes
  Known for: IT, Business, Engineering, Health Sciences
  Fees/deadline: NOT verified — confirm on setu.ie.

Technological University Dublin (TU Dublin) — Dublin, Ireland [PARTIALLY VERIFIED — value-tier fees per official-derived listings]
  Type: Ireland's first technological university — practice-oriented, the VALUE option in Dublin
  Known for: Engineering, Computing, Hospitality & Culinary Arts, Media, Architecture
  Language: English-medium instruction
  Non-EU tuition: ~€11,650–€12,500/yr UG per official-derived listings (the cheapest Dublin university tier — confirm on tudublin.ie)
  Deadline: CAO ~1 Feb — confirm
  ⚠ Same Stamp 1G stay-back and Dublin job market as the pricier universities — strong value pick.

━━ Italian universities (non-EU applicants pre-enrol via Universitaly; income-based fees €0–4,000 at publics; DSU regional grants — see Italy country block & scholarships #61–63) ━━

Politecnico di Milano (PoliMi) — Milan, Italy [VERIFIED — polimi.it fees & merit call]
  Type: Italy's top technical university — global top-20 in design, top-50 in engineering
  Known for: Design, Architecture, Mechanical/Aerospace Engineering, Computer Science
  Language: Most MSc programmes English-taught; bachelor's mixed Italian/English
  Non-EU tuition (verified): standard ~€3,886/yr for MSc — already low; income-based reductions below that
  Scholarship here (verified): Merit-Based International Scholarships for English MSc applicants in the EARLY BIRD window (1 Oct–1 Dec) — Platinum €10,000/yr + full waiver, Gold €8,000 + waiver, Silver waiver only (~€170 admin fee remains). Awarded automatically by ranking; ~3.3+/4.0 GPA realistic for Gold/Platinum.
  Deadline: Early Bird 1 Oct–1 Dec for the following autumn; later windows exist without scholarship priority
  ⚠ Milan is Italy's most expensive city (~€1,000–1,400/month) — DSU (#61) helps low-income admits.

University of Bologna (Unibo) — Bologna, Italy [VERIFIED — unibo.it grants & fee pages]
  Type: The oldest university in the world (1088) — large, comprehensive, very international
  Known for: Law, Humanities, Economics, Engineering, Agriculture
  Language: Many English-taught bachelor's and master's
  Non-EU tuition: Income-based via ISEE Parificato (€0–~€4,000/yr); even full-waiver students pay ~€157 fixed charges (verified)
  Scholarship here (verified): Unibo Actions — Action 1: tuition waivers; Action 2: €11,000 gross study grant for master's; plus International Talents @Unibo (€6,500 + full exemption, 2 years, GRE/SAT-based). Apply via Studenti Online, deadlines in the first half of the year.
  Deadline: Programme-dependent; scholarship calls close ~spring — confirm on unibo.it

Bocconi University — Milan, Italy [VERIFIED — unibocconi.it funding pages]
  Type: Italy's elite PRIVATE business university — Europe's top tier for economics/finance
  Known for: Economics, Finance, Management, Data Science, Law (WBB)
  Language: Full English-taught tracks at all levels
  Tuition: Income-based ~€3,500–€14,000+/yr (ISEE-assessed; flat higher rate possible for internationals) — far above public universities but with real aid
  Scholarship here (verified): ISU Bocconi need-based package — full/partial waiver + cash up to €8,000/yr + dorm discounts + one free meal/day (apply via the single "Bocconi4Access to Education" application); merit scholarships are automatic for strong admits
  Deadline: Rounds through autumn–spring — confirm on unibocconi.it

Sapienza University of Rome — Rome, Italy [NOT individually verified — income-based public fees]
  Type: Europe's largest university by enrollment — comprehensive, historic
  Known for: Classics & Archaeology (world #1 field), Medicine (English IMAT track), Engineering, Physics
  Language: Italian mostly; English options incl. IMAT Medicine. Fees: income-based €0–~€3,000 — confirm on uniroma1.it. DSU agency: DiSCo Lazio.

University of Padua — Padua, Italy [NOT individually verified — income-based public fees]
  Type: Historic research university (1222) — Galileo taught here
  Known for: Medicine (English IMAT track), Psychology, Astronomy, Data Science
  Language: Growing English-taught catalogue. Fees: income-based — confirm on unipd.it; Padua also runs its own international excellence scholarships. MAECI partner (see #62).

University of Milan (Statale) — Milan, Italy [NOT individually verified — income-based public fees]
  Type: Milan's big public comprehensive university (distinct from PoliMi/Bocconi)
  Known for: Medicine (English IMAT track), Law, Political Science, Biotechnology
  Language: Italian mostly; English IMAT medicine + some master's. Fees: income-based — confirm on unimi.it.

University of Turin — Turin, Italy [NOT individually verified — income-based public fees]
  Type: Large historic public university in an affordable student city
  Known for: Medicine (English IMAT track), Law, Economics, Veterinary
  Language: Italian mostly; English IMAT medicine + master's options. Fees: income-based — confirm on unito.it. DSU agency: EDISU Piemonte (generous packages).

Politecnico di Torino (PoliTo) — Turin, Italy [NOT individually verified — income-based public fees]
  Type: Turin's technical university — engineering-focused, very international, cheaper city than Milan
  Known for: Automotive & Aerospace Engineering, Architecture, Computer Engineering
  Language: Many English-taught programmes at BOTH bachelor's and master's (rare in Italy). Fees: income-based, low thousands — confirm on polito.it. IYT partner (#63).

University of Pisa — Pisa, Italy [NOT individually verified — income-based public fees]
  Type: Historic public university in a compact, cheap student city (Scuola Normale next door)
  Known for: Physics, Computer Science (Italy's first CS degree), Mathematics, Engineering
  Language: Italian mostly; English master's options. Fees: income-based — confirm on unipi.it.

University of Naples Federico II — Naples, Italy [NOT individually verified — income-based public fees]
  Type: One of the world's oldest state universities (1224) — the south's flagship; Apple Developer Academy host
  Known for: Engineering, Medicine (English IMAT track), Agriculture, Computer Science
  Language: Italian mostly; English IMAT medicine. Fees: income-based; Naples living is Italy's cheapest big-city option (~€700–900/month).

University of Pavia — Pavia, Italy [NOT individually verified — income-based public fees]
  Type: Historic collegiate-style university town near Milan — an IMAT medicine favourite
  Known for: Medicine (one of the oldest English IMAT programmes), Pharmacy, Engineering, Physics
  Language: English IMAT medicine + master's options. Fees: income-based — confirm on unipv.it (apply.unipv.eu handles internationals well).

University of Trento — Trento, Italy [NOT individually verified — income-based public fees]
  Type: Small, consistently top-ranked Italian public university in the Alps — strong scholarship culture for internationals
  Known for: Computer Science, Physics, Cognitive Science, Sociology
  Language: Good English-taught selection. Fees: income-based; Trento's opera universitaria DSU packages are among Italy's most reliable — confirm on unitn.it.

University of Florence (UniFi) — Florence, Italy [NOT individually verified — income-based public fees]
  Type: Big historic public in the Renaissance capital — arts, architecture and design heritage
  Known for: Architecture, Humanities, Design, Agriculture
  Fees: income-based via ISEE (€0–~€4,000/yr); Tuscany's DSU agency serves internationals — confirm on unifi.it.

University of Rome Tor Vergata — Rome, Italy [NOT individually verified — income-based public fees]
  Type: Rome's #2 public — internationally famous for ENGLISH-taught Medicine (IMAT) and the Global Governance bachelor
  Known for: Medicine (English, IMAT), Economics, Engineering, Business
  Fees: income-based via ISEE; DiSCo Lazio DSU grants apply — confirm on en.uniroma2.it.

University of Milano-Bicocca — Milan, Italy [NOT individually verified — income-based public fees]
  Type: Young Milan public — ENGLISH-taught Medicine (IMAT) and strong sciences at income-based fees
  Known for: Medicine (English, IMAT), Psychology, Science, Economics
  Fees: income-based via ISEE — a route into Milan far cheaper than the private options; confirm on en.unimib.it.

University of Siena — Siena, Italy [NOT individually verified — income-based public fees]
  Type: Historic small-city university (1240) — very cheap living, English-taught medicine and economics
  Known for: Medicine (English, IMAT), Economics, Law, Biotechnology
  Fees: income-based via ISEE; Siena living costs are among the lowest of Italy's famous university towns — confirm on en.unisi.it.

━━ French universities & grandes écoles (apply via Campus France for ~70 countries; differentiated fees €2,895/€3,941 with waivers now CAPPED — see France country block & scholarships #64–65) ━━

Sciences Po — Paris (+ 6 regional campuses), France [VERIFIED — sciencespo.fr fees & Boutmy]
  Type: France's elite social-science grande école — the political science school of presidents
  Known for: Political Science, International Relations, Economics, Law, Journalism
  Language: Full English-taught tracks at bachelor's and master's
  Tuition (2026-27, verified): undergraduate up to ~€14,900/yr, master's ~€20,000+/yr — income-adjusted for EU students, flat for non-EU, BUT the Boutmy scholarship (see #65) gives full or large exemptions to non-EU admits
  Deadline: UG (foreign school systems) ~January; master's rounds Oct–Dec — confirm on sciencespo.fr
  Scholarship here: Émile Boutmy — full exemption or €9,500/yr (UG), €18,500/yr (master's) — see #65

Université PSL (Paris Sciences et Lettres) — Paris, France [NOT individually verified — public fees]
  Type: France's top-ranked university collective (ENS, Dauphine, Mines Paris...) — global top-30
  Known for: Sciences, Mathematics, Economics (Dauphine), Humanities, Arts
  Language: French mostly at bachelor's; English master's options. Fees: differentiated €2,895/€3,941 unless waived/scholarship — confirm on psl.eu.

Sorbonne Université — Paris, France [NOT individually verified — public fees]
  Type: The historic Paris flagship (sciences + humanities + medicine)
  Known for: Humanities, Physics, Mathematics, Medicine
  Language: French mostly; some English master's. Fees: differentiated rates apply — confirm on sorbonne-universite.fr.

Université Paris-Saclay — Saclay (Paris region), France [NOT individually verified — public fees]
  Type: Science powerhouse south of Paris — world #1 in mathematics rankings
  Known for: Mathematics, Physics, Engineering, Life Sciences
  Language: French bachelor's mostly; many English master's. Fees: differentiated rates; Paris-Saclay runs its own IDEX international master's scholarships (~€10,000/yr) — confirm on universite-paris-saclay.fr. Eiffel partner.

Université Paris Cité — Paris, France [NOT individually verified — public fees]
  Type: Large central-Paris university (ex Paris Descartes + Diderot)
  Known for: Medicine, Sciences, Social Sciences, Linguistics
  Language: French mostly. Fees: differentiated rates — confirm on u-paris.fr.

École Polytechnique (l'X) — Palaiseau (Paris region), France [NOT individually verified]
  Type: France's most prestigious engineering grande école — military-founded, extremely selective
  Known for: Mathematics, Physics, Engineering, Economics
  Language: The Bachelor of Science and most graduate programmes are English-taught
  Fees: Grande école pricing (Bachelor ~€15,000+/yr; MSc&T ~€20,000+/yr — confirm on polytechnique.edu); merit scholarships exist for internationals.

HEC Paris — Jouy-en-Josas (Paris region), France [NOT individually verified]
  Type: Europe's #1-ranked business school (grande école, private pricing)
  Known for: MBA, Master in Management, Finance, Entrepreneurship
  Language: English-taught graduate programmes
  Fees: High — MiM ~€50,000 total, MBA ~€100,000 (confirm on hec.edu) — but HEC Foundation scholarships (up to 100%) and Eiffel apply; strong salary outcomes offset cost.

Université Grenoble Alpes — Grenoble, France [NOT individually verified — public fees]
  Type: Alpine science/tech university city — strong labs (CNRS, CEA), affordable student living
  Known for: Computer Science, Physics, Nanoscience, Earth Sciences
  Language: French mostly; English master's options. Fees: differentiated rates — confirm on univ-grenoble-alpes.fr.

Université de Strasbourg — Strasbourg, France [NOT individually verified — public fees]
  Type: Historic Rhine-border university — chemistry Nobel tradition, EU institutions city
  Known for: Chemistry, Law, European Studies, Life Sciences
  Language: French mostly; some English master's. Fees: differentiated rates — confirm on unistra.fr.

Aix-Marseille Université — Marseille/Aix-en-Provence, France [NOT individually verified — public fees]
  Type: France's largest university — Mediterranean, cheaper living than Paris
  Known for: Medicine, Law, Physics, Oceanography
  Language: French mostly. Fees: differentiated rates — confirm on univ-amu.fr.

Université Claude Bernard Lyon 1 — Lyon, France [NOT individually verified — public fees]
  Type: Lyon's science/health university — France's second student city, much cheaper than Paris
  Known for: Medicine, Pharmacy, Sciences, Sport Science
  Language: French mostly. Fees: differentiated rates — confirm on univ-lyon1.fr.

INSA Lyon — Lyon, France [NOT individually verified — public fees]
  Type: France's largest PUBLIC engineering grande école — elite training at public-university prices
  Known for: Mechanical/Civil/Electrical Engineering, Computer Science, Materials
  Language: Mostly French (international sections ease the first years); some English master's
  Fees: Public-scale (~€600–4,000/yr by status — confirm on insa-lyon.fr) — the value route to a French engineering diploma. Eiffel partner.

Université de Montpellier — Montpellier, France [NOT individually verified — differentiated public fees]
  Type: Home of the world's OLDEST medical faculty (1220) — big science/health public in a sunny student city
  Known for: Medicine, Pharmacy, Biology, Ecology
  Fees: differentiated non-EU rates (€2,895 bachelor / €3,941 master, waiver caps apply); Montpellier is one of France's classic student cities — confirm on umontpellier.fr.

Université Toulouse III – Paul Sabatier — Toulouse, France [NOT individually verified — differentiated public fees]
  Type: Science/health public in Europe's aerospace capital (Airbus country)
  Known for: Aerospace Engineering, Science, Medicine, Computer Science
  Fees: differentiated non-EU rates; Toulouse offers aerospace-industry proximity at provincial living costs — confirm on univ-tlse3.fr.

Université de Lille — Lille, France [NOT individually verified — differentiated public fees]
  Type: One of France's largest publics — cheap northern student city an hour from Paris and Brussels
  Known for: Medicine, Law, Science, Humanities
  Fees: differentiated non-EU rates; Lille living costs are well below Paris — confirm on univ-lille.fr.

Université de Bordeaux — Bordeaux, France [NOT individually verified — differentiated public fees]
  Type: Major southwestern public — strong sciences and law in a famously livable city
  Known for: Science, Law, Medicine, Economics
  Fees: differentiated non-EU rates — confirm on u-bordeaux.fr.

━━ Hungarian universities (Stipendium Hungaricum full scholarships across all of them — deadline 15 Jan; see Hungary country block & scholarship #66) ━━

Semmelweis University — Budapest, Hungary [PARTIALLY VERIFIED — medicine fees via official-derived sources]
  Type: Hungary's dedicated medical university (1769) — Europe's top-tier for medicine, huge international cohort
  Known for: Medicine, Dentistry, Pharmacy, Health Sciences
  Language: Full English (and German) tracks
  Tuition: Medicine ~$18,200/yr (~$109,000 for 6 years) — half of UK/US medical costs for an EU-recognised MD. Entrance exam required.
  Deadline: Direct applications ~spring for autumn; SH route closes 15 Jan
  Scholarship here: Stipendium Hungaricum places (very competitive for medicine) — see #66

University of Debrecen — Debrecen, Hungary [PARTIALLY VERIFIED — medicine ~$16,500/yr]
  Type: Hungary's biggest university cohort of international students — full English ecosystem
  Known for: Medicine (fully English), Engineering, Agriculture, Business
  Language: Everything from foundation year up available in English
  Tuition: Medicine ~$16,500/yr; non-medical programmes far less (~€2,000–6,000/yr) — confirm on edu.unideb.hu
  Deadline: Rolling direct admissions; SH route 15 Jan
  Note: Debrecen living costs are well below Budapest.

University of Szeged — Szeged, Hungary [PARTIALLY VERIFIED — medicine ~$16,300–16,500/yr]
  Type: Consistently Hungary's top-ranked university — Katalin Karikó's (Nobel 2023, mRNA) alma mater
  Known for: Medicine, Pharmacy, Biology, Computer Science
  Language: English medicine + many English programmes (some German tracks)
  Tuition: Medicine ~$16,300–16,500/yr (application €35, medical entrance ~€250–300); others much less — confirm on u-szeged.hu
  Deadline: Direct ~spring; SH 15 Jan

University of Pécs — Pécs, Hungary [PARTIALLY VERIFIED — medicine ~$16,750/yr]
  Type: Hungary's OLDEST university (1367) in a charming, cheap student city
  Known for: Medicine, Dentistry, Business, Psychology
  Language: English medical + general programmes
  Tuition: Medicine ~$16,750/yr; others less — confirm on pte.hu
  Deadline: Direct ~spring; SH 15 Jan

Eötvös Loránd University (ELTE) — Budapest, Hungary [NOT VERIFIED fees — confirm on elte.hu]
  Type: Hungary's leading comprehensive/research university
  Known for: Computer Science, Psychology, Law, Physics, Teacher Training
  Language: Growing English-taught catalogue
  Fees/deadline: NOT verified — non-medical English programmes typically €2,000–€6,000/yr; SH covers ELTE fully. Confirm on elte.hu.

Budapest University of Technology and Economics (BME) — Budapest, Hungary [NOT VERIFIED fees — confirm on bme.hu]
  Type: Hungary's historic technical university (1782) — the engineering flagship
  Known for: Engineering (all branches), Computer Science, Architecture, Transport
  Language: English engineering programmes at all levels
  Fees/deadline: NOT verified — typically €3,000–€8,000/yr; SH covers BME fully. Confirm on bme.hu.

Corvinus University of Budapest — Budapest, Hungary [NOT VERIFIED fees — confirm on uni-corvinus.hu]
  Type: Hungary's business & social-science flagship on the Danube
  Known for: Business, Economics, International Relations, Data Science
  Language: Wide English-taught selection
  Fees/deadline: NOT verified — typically €3,000–€7,000/yr; Corvinus left the SH programme in favour of its OWN scholarship scheme in recent years — check which applies before planning. Confirm on uni-corvinus.hu.

Hungarian University of Agriculture and Life Sciences (MATE) — Gödöllő (near Budapest), Hungary [NOT VERIFIED fees — major SH host]
  Type: One of Europe's biggest agricultural universities — a major Stipendium Hungaricum host
  Known for: Agriculture, Food Science, Environmental Science, Business
  ★ FAO-Hungary joint scholarships fund agriculture students from developing countries here (alongside SH) — confirm current calls on uni-mate.hu.

Óbuda University — Budapest, Hungary [NOT VERIFIED fees — SH partner]
  Type: Budapest's applied engineering/IT university — accessible SH partner in the capital
  Known for: Engineering, IT, Computer Science, Cybersecurity
  Fees/deadline: NOT verified — confirm on uni-obuda.hu; SH deadline 15 January.

Széchenyi István University — Győr, Hungary [NOT VERIFIED fees — SH partner]
  Type: Engineering university in Audi's Hungarian manufacturing hub — industry-linked
  Known for: Automotive Engineering, Engineering, Business, IT
  Fees/deadline: NOT verified — confirm on sze.hu; SH deadline 15 January.

━━ Japanese universities (national tuition ¥535,800/yr standardised; MEXT full scholarships — see Japan country block & scholarship #67) ━━

University of Tokyo (UTokyo) — Tokyo, Japan [VERIFIED tuition — u-tokyo.ac.jp]
  Type: Japan's #1 university
  Known for: everything — Engineering, Science, Law, Medicine, Economics
  Language: Mostly Japanese-taught; PEAK (English-taught liberal arts/environmental science undergrad) and GSC transfer programme (GSC students get ¥150,000/month + housing support, verified)
  Tuition (verified): ¥642,960/yr (raised from the national standard ¥535,800 — Japan's first hike in 20 years) + ¥282,000 admission fee
  Deadline: PEAK applications ~Dec–Jan for autumn entry; Japanese-track via EJU — confirm on u-tokyo.ac.jp
  Scholarship here: MEXT (university + embassy routes), PEAK-specific aid

Kyoto University — Kyoto, Japan [NOT individually verified — national tuition scale]
  Type: Japan's #2 — famous for Nobel-heavy fundamental research and academic freedom
  Known for: Physics, Chemistry, Biology, Engineering, Philosophy
  Language: Mostly Japanese; iUP programme offers English-entry undergrad with Japanese transition (stipends available). Tuition: national scale ¥535,800 — confirm on kyoto-u.ac.jp.

Osaka University — Osaka, Japan [NOT individually verified — national tuition scale]
  Type: Top-3 national university — big engineering/medicine
  Known for: Engineering, Immunology, Medicine, Economics
  Language: Mostly Japanese; some English graduate programmes. Tuition: national scale — confirm on osaka-u.ac.jp.

Tohoku University — Sendai, Japan [NOT individually verified — national tuition scale]
  Type: Historic imperial university — Japan's #1 in some domestic rankings; research powerhouse
  Known for: Materials Science, Engineering, Physics, Spintronics
  Language: English undergrad tracks (ex-G30) in engineering/science. Tuition: national scale — confirm on tohoku.ac.jp.

Institute of Science Tokyo — Tokyo, Japan [NOT individually verified — national tuition scale]
  Type: NEW name (2024): the merger of Tokyo Institute of Technology (Tokyo Tech) and Tokyo Medical and Dental University — older guides list them separately
  Known for: Engineering, Computer Science, Materials, Medicine & Dentistry
  Language: English graduate programmes common. Tuition: national scale — confirm on isct.ac.jp.

Nagoya University — Nagoya, Japan [NOT individually verified — national tuition scale]
  Type: Imperial-lineage national university in Japan's automotive heartland — the strongest ex-G30 ENGLISH undergraduate lineup
  Known for: Automotive Engineering, Physics (multiple Nobels), Chemistry, Economics
  Language: G30 English undergrad in engineering/science/social science. Tuition: national scale — confirm on nagoya-u.ac.jp.

Kyushu University — Fukuoka, Japan [NOT individually verified — national tuition scale]
  Type: Southern flagship in one of Japan's most livable, affordable big cities
  Known for: Engineering, Energy/Hydrogen research, Medicine, Design
  Language: Some English undergrad/graduate tracks. Tuition: national scale — confirm on kyushu-u.ac.jp.

Hokkaido University — Sapporo, Japan [NOT individually verified — national tuition scale]
  Type: Northern flagship — huge campus, agriculture/environment heritage
  Known for: Agriculture, Veterinary Medicine, Environmental Science, Fisheries
  Language: Modern Japanese Studies + some English tracks. Tuition: national scale — confirm on hokudai.ac.jp.

Waseda University — Tokyo, Japan [NOT individually verified — private fees]
  Type: Japan's most famous private university — enormous alumni network, most international-friendly of the big privates
  Known for: Political Science & Economics, International Liberal Studies (SILS, English), Business, Literature
  Language: Several full English-taught undergrad schools (SILS, PSE-EDESSA...)
  Fees: Private (~¥1.2M–1.8M/yr) BUT tuition reductions up to 100% exist for international students (per official-derived sources) — confirm on waseda.jp.

Keio University — Tokyo, Japan [NOT individually verified — private fees]
  Type: Waseda's great private rival — business elite pipeline (1858)
  Known for: Economics, Business, Medicine, Law, PEARL/GIGA English programmes
  Language: PEARL (economics) and GIGA (informatics) English undergrad tracks
  Fees: Private (~¥1.3M–1.9M/yr); institutional scholarships exist — confirm on keio.ac.jp.

Sophia University — Tokyo, Japan [NOT individually verified — private fees]
  Type: The Jesuit international pioneer — its English-taught Faculty of Liberal Arts (FLA) has run for decades
  Known for: Liberal Arts, International Relations, Languages, Business
  Language: FLA fully English; many other programmes Japanese-taught
  Fees: Private scale — confirm on sophia.ac.jp.

International Christian University (ICU) — Tokyo, Japan [NOT individually verified — private fees]
  Type: Fully bilingual (English/Japanese) liberal-arts college — small classes, generous need-based aid for internationals
  Known for: Liberal Arts, Languages, Political Science, Science
  Fees: Private scale with meaningful financial aid — confirm on icu.ac.jp.

University of Tsukuba — Tsukuba (Science City), Japan [NOT individually verified — national fee scale]
  Type: National university with one of Japan's widest ENGLISH degree lineups — MEXT-heavy and very international
  Known for: Science, Computer Science, Medicine, Education
  Fees: National standard ¥535,800/yr (~$3,600) + ¥282,000 admission fee (verified nationally). Confirm English-programme specifics on tsukuba.ac.jp.

Hiroshima University — Hiroshima, Japan [NOT individually verified — national fee scale]
  Type: Major national with strong education heritage and English-taught tracks
  Known for: Education, Engineering, Medicine, Humanities
  Fees: National standard ¥535,800/yr + admission fee. Confirm on hiroshima-u.ac.jp.

Kobe University — Kobe, Japan [NOT individually verified — national fee scale]
  Type: Port-city national famous for business, economics and maritime studies
  Known for: Business, Economics, Law, Engineering
  Fees: National standard ¥535,800/yr + admission fee. Confirm on kobe-u.ac.jp.

Ritsumeikan Asia Pacific University (APU) — Beppu, Japan [PARTIALLY VERIFIED — tuition reductions common]
  Type: Japan's international outlier — HALF the student body is international (90+ countries), fully bilingual campus, no Japanese needed to start
  Known for: International Management, Asia Pacific Studies, Sustainability & Tourism
  Language: Fully English-taught tracks (Japanese learned alongside)
  Fees: ~¥1.3M–1.5M/yr BUT 30–65% tuition reduction scholarships are COMMON — every applicant is considered with the admission application (per official-derived sources; confirm on apu.ac.jp). Beppu living is far cheaper than Tokyo.
  ⚠ The easiest genuine entry point into Japanese higher education for non-Japanese speakers.

━━ South Korean universities (GKS full scholarships across Type A/B lists — see Korea country block & scholarship #68; D-10 job-seeker visa after graduation) ━━

KAIST (Korea Advanced Institute of Science and Technology) — Daejeon, South Korea [VERIFIED — admission.kaist.ac.kr]
  Type: Korea's MIT — fully English-taught STEM institute
  Known for: Computer Science, Electrical Engineering, Robotics, Physics, Entrepreneurship
  Language: FULLY English-taught — no Korean required to graduate
  Cost (verified): effectively FREE for admitted international undergraduates — the KAIST Scholarship (full tuition for 8 semesters + ₩350,000/month + insurance) is granted automatically when you select it in the admission application; keep GPA 2.7/4.3 to renew
  Deadline: Early ~September, regular ~January for autumn entry — confirm on admission.kaist.ac.kr
  ⚠ One of the best value propositions in global STEM education — competitive but genuinely accessible to strong students worldwide (no IELTS alternative routes exist too).

Seoul National University (SNU) — Seoul, South Korea [NOT individually verified — national fee scale]
  Type: Korea's #1 — the S of "SKY"
  Known for: everything — Engineering, Business, Medicine, Law, Humanities
  Language: Mostly Korean-taught (TOPIK needed); some English graduate programmes. Fees: national scale ₩2M–5M/semester — confirm on snu.ac.kr. GKS Type A partner.

POSTECH — Pohang, South Korea [NOT individually verified]
  Type: Elite private STEM institute (steel-industry endowed) — tiny classes, research-intensive
  Known for: Physics, Materials, Chemical Engineering, Computer Science
  Language: Largely English-taught in STEM; graduate admissions usually funded. Fees/funding: most graduate students receive assistantships — confirm on postech.ac.kr.

Yonsei University — Seoul, South Korea [PARTIALLY VERIFIED — fee range official-derived]
  Type: Top private, the Y of SKY — home of Underwood International College (UIC)
  Known for: UIC (English-taught liberal arts), Business, Medicine, Korean Language Institute
  Language: UIC is fully English; most else Korean-taught
  Fees: ₩4.3M–8.7M/semester for internationals (2025, official-derived) — UIC at the top end; merit aid exists. Confirm on yonsei.ac.kr.

Korea University — Seoul, South Korea [NOT individually verified]
  Type: Top private, the K of SKY — famous alumni network and school spirit
  Known for: Business, Law, Political Science, Media
  Language: Many English-taught courses; Korean recommended. Fees: private scale ₩4M–8M/semester — confirm on korea.ac.kr. GKS Type A partner.

Sungkyunkwan University (SKKU) — Seoul/Suwon, South Korea [NOT individually verified]
  Type: 600-year-old university reborn with SAMSUNG backing — strong corporate pipelines
  Known for: Semiconductor Engineering (Samsung track), Business, Medicine, Software
  Language: Notable English-taught options. Fees: private scale — confirm on skku.edu. Samsung-linked scholarships exist.

Hanyang University — Seoul, South Korea [NOT individually verified]
  Type: "The MIT of Korea" nickname domestically — engineering employment powerhouse
  Known for: Engineering, Architecture, Business, Theatre & Film
  Language: Some English tracks. Fees: private scale — confirm on hanyang.ac.kr.

Kyung Hee University — Seoul, South Korea [NOT individually verified]
  Type: Large private with a strong international orientation — beautiful campus
  Known for: Hospitality & Tourism, Korean Medicine, International Studies, Media
  Language: Global Collaborative programmes in English. Fees: private scale — confirm on khu.ac.kr.

Ewha Womans University — Seoul, South Korea [NOT individually verified]
  Type: The world's largest WOMEN's university — prestigious, strong international programmes
  Known for: International Studies, Business, Medicine, Education
  Language: English-taught international programmes. Fees: private scale — confirm on ewha.ac.kr.
  ⚠ Women only.

UNIST (Ulsan National Institute of Science and Technology) — Ulsan, South Korea [NOT individually verified]
  Type: Young national STEM institute — fully English like KAIST, easier admission
  Known for: Materials, Battery/Energy Science, AI, Biomedical Engineering
  Language: FULLY English-taught
  Fees/funding: National-institute scale with generous scholarships for internationals — confirm on unist.ac.kr. A smart KAIST alternative.

Pusan National University (PNU) — Busan, South Korea [NOT individually verified — national fee scale]
  Type: Korea's #2 national university — coastal big-city life at national-scale fees (₩2M–5M/semester)
  Known for: Engineering, Business, Marine Science, Medicine
  Notes: GKS partner; Busan living is notably cheaper than Seoul. Confirm on pusan.ac.kr.

Kyungpook National University (KNU) — Daegu, South Korea [NOT individually verified — national fee scale]
  Type: Major regional national — cheap fees, strong IT/electronics ties (Samsung country)
  Known for: Engineering, IT, Agriculture, Medicine
  Notes: GKS partner; Daegu is one of Korea's cheapest big cities. Confirm on en.knu.ac.kr.

Chonnam National University (CNU) — Gwangju, South Korea [NOT individually verified — national fee scale]
  Type: Big southwestern national university
  Known for: Agriculture, Engineering, Medicine, Humanities
  Notes: The regional GKS Type B route often means BETTER scholarship odds than Seoul universities — a smart play for GKS hunters. Confirm on global.jnu.ac.kr.

Sogang University — Seoul, South Korea [NOT individually verified — private fee scale]
  Type: Elite Seoul private just behind SKY — strong business/economics with real English offerings
  Known for: Business, Economics, Media, Computer Science
  Notes: Private fee scale (₩4M–8M/semester); GKS partner. Confirm on sogang.ac.kr.

Hankuk University of Foreign Studies (HUFS) — Seoul, South Korea [NOT individually verified — private fee scale]
  Type: Korea's foreign-studies specialist (45+ languages taught) — famously international-friendly
  Known for: Languages, International Relations, Translation, Business
  Notes: A classic GKS host with deep experience of international students. Confirm on hufs.ac.kr.

━━ Polish universities (English programmes €2,000–6,000/yr; medicine €10,000–16,000/yr; Banach NAWA full scholarships — see Poland country block & scholarship #69) ━━

University of Warsaw (UW) — Warsaw, Poland [NOT individually verified — see country fee ranges]
  Type: Poland's largest and top-ranked university
  Known for: Computer Science (ICPC pedigree), Economics, Law, Physics, Psychology
  Language: Solid English-taught catalogue. Fees: ~€2,000–6,000/yr English programmes — confirm on en.uw.edu.pl.

Jagiellonian University — Kraków, Poland [PARTIALLY VERIFIED — medicine fees official-derived]
  Type: Poland's oldest university (1364) — Copernicus's alma mater, in the beautiful student capital Kraków
  Known for: Medicine (English MD), Law, History, Biotechnology
  Language: English MD + growing general English catalogue
  Fees: English medicine ~€13,000–15,000/yr (official-derived); other English programmes ~€2,000–6,000 — confirm on en.uj.edu.pl.

Warsaw University of Technology (WUT) — Warsaw, Poland [NOT individually verified]
  Type: Poland's leading technical university
  Known for: Engineering (all branches), Computer Science, Robotics, Aerospace
  Language: Many English engineering programmes (~€3,000–5,000/yr typical) — confirm on pw.edu.pl.

AGH University of Krakow — Kraków, Poland [NOT individually verified]
  Type: Mining-heritage technical powerhouse — strong industry links
  Known for: Mining & Geoengineering, Computer Science, Materials, Energy
  Language: English engineering options — confirm on agh.edu.pl.

Adam Mickiewicz University — Poznań, Poland [NOT individually verified]
  Type: Big classical university in a lively, affordable student city
  Known for: Linguistics, Chemistry, Law, Social Sciences
  Language: Some English programmes — confirm on international.amu.edu.pl.

University of Wrocław — Wrocław, Poland [NOT individually verified]
  Type: Historic university in Poland's fastest-growing tech-hub city
  Known for: Law, International Relations, Biotechnology, Computer Science
  Language: English options — confirm on international.uni.wroc.pl.

University of Łódź — Łódź, Poland [NOT individually verified]
  Type: One of Poland's most international-friendly universities — very low living costs
  Known for: Business, Economics, International Relations, Computer Science
  Language: Large English catalogue — confirm on iso.uni.lodz.pl.

Gdańsk University of Technology — Gdańsk, Poland [NOT individually verified]
  Type: Baltic-coast technical university in the attractive Tricity area
  Known for: Engineering, Computer Science, Ocean/Naval Engineering
  Language: English engineering programmes — confirm on pg.edu.pl.

Medical University of Warsaw — Warsaw, Poland [PARTIALLY VERIFIED — country medicine range applies]
  Type: Poland's leading medical university — long-running English MD Division
  Known for: Medicine (English MD), Dentistry, Pharmacy
  Fees: English MD within the €12,000–16,000/yr national range — confirm on wum.edu.pl. ⚠ Verify home-country recognition before enrolling in any foreign MD.

Wroclaw Medical University — Wrocław, Poland [PARTIALLY VERIFIED — ~€13,400/yr official-derived]
  Type: Established English-division medical school popular with international students
  Known for: Medicine (English MD), Dentistry
  Fees: General medicine ~PLN 28,850/semester ≈ €13,400/yr (official-derived) — confirm on umw.edu.pl.

Medical University of Lodz — Łódź, Poland [PARTIALLY VERIFIED — ~€15,470/yr official-derived]
  Type: Poland's largest English-division medical school
  Known for: Medicine (English MD), Dentistry, Pharmacy
  Fees: MD ~€15,470/yr (official-derived — see Poland country block) — confirm on en.umed.pl.

Wrocław University of Science and Technology (WUST) — Wrocław, Poland [NOT VERIFIED fees]
  Type: Big south-western tech university — engineering/IT in one of Poland's liveliest student cities
  Known for: Engineering, Computer Science, Architecture, Electrical Engineering
  Fees/deadline: NOT verified — English programmes typically €2,000–6,000/yr; confirm on pwr.edu.pl.

SGH Warsaw School of Economics — Warsaw, Poland [NOT VERIFIED fees]
  Type: Poland's top economics & business school — CEMS member
  Known for: Economics, Business, Finance, Data Science
  Fees/deadline: NOT verified — confirm on sgh.waw.pl.

━━ Cypriot universities (TWO systems — EU Republic vs unrecognised North; see the Cyprus country block warnings before recommending anything) ━━

University of Cyprus (UCY) — Nicosia (Republic), Cyprus [NOT individually verified]
  Type: The Republic's public flagship — EU degrees
  Known for: Economics, Computer Science, Engineering, Education
  Language: ⚠ Most BACHELOR'S are GREEK-taught; English mainly at master's/PhD — confirm per programme on ucy.ac.cy
  Fees: Public rates are modest (postgrad ~€5,000–10,000 total programme typical) — confirm on ucy.ac.cy.

Cyprus University of Technology (CUT) — Limassol (Republic), Cyprus [NOT individually verified]
  Type: The Republic's public technical university
  Known for: Engineering, Health Sciences, Multimedia & Communications
  Language: ⚠ Greek-taught bachelor's mostly; some English postgrad — confirm on cut.ac.cy.

University of Nicosia (UNIC) — Nicosia (Republic), Cyprus [NOT individually verified]
  Type: The Republic's largest private university — EU-recognised degrees, big international cohort
  Known for: Medicine (English, ~€18,000+/yr — confirm), Business, Law, Digital Currency/Blockchain
  Language: English-taught across the board
  Fees: ~€8,000–10,000/yr sticker for most bachelor's with routine partial scholarships; medicine far higher — confirm on unic.ac.cy.

UCLan Cyprus — Larnaca (Republic), Cyprus [PARTIALLY VERIFIED — discount examples official]
  Type: Cyprus campus of the University of Central Lancashire (UK) — DOUBLE UK+Cyprus accredited degree, EU-based
  Known for: Law (UK LLB), Computing, Business, Mathematics
  Language: English-taught
  Fees (verified examples): €9,950/yr sticker with standard 30–40% programme scholarships → ~€5,970–€6,965/yr — a UK degree inside the EU at budget prices. Confirm on uclancyprus.ac.cy.

Eastern Mediterranean University (EMU) — Famagusta (NORTH Cyprus), Cyprus [PARTIALLY VERIFIED — recognition warning applies]
  Type: North Cyprus's oldest and best-known university — large international cohort
  Known for: Engineering (ABET-accredited programmes), Tourism, Architecture, Business
  Language: English-taught
  Fees: Very cheap after the standard automatic scholarships (~$3,000–5,000/yr typical) — confirm on emu.edu.tr
  ⚠ TRNC recognition warning (see country block): Turkish-accredited; VERIFY your home country accepts it before enrolling.

Near East University (NEU) — Nicosia (NORTH Cyprus), Cyprus [PARTIALLY VERIFIED — recognition warning applies]
  Type: Huge private university in the North — medicine/dentistry marketed heavily abroad
  Known for: Medicine, Dentistry, Pharmacy, Engineering
  Language: English-taught programmes
  Fees: Cheap after automatic discounts — confirm on neu.edu.tr
  ⚠ Same TRNC recognition warning — ESPECIALLY for medicine/dentistry: confirm your home medical council recognises North Cyprus degrees before paying anything.

Cyprus International University (CIU) — Nicosia (NORTH Cyprus), Cyprus [PARTIALLY VERIFIED — fee pattern official-derived]
  Type: Private university in the North — the classic agent-marketed option
  Known for: Engineering, Business, Health Sciences, Pharmacy
  Language: English-taught
  Fees (official-derived): EVERY admitted international automatically gets "50% scholarship" — the real prices are ~€3,099/yr most bachelor's, €7,400 medicine, €6,800 dentistry. Treat the "scholarship" as list pricing.
  ⚠ Same TRNC recognition warning applies.

━━ Georgian & Armenian universities (agent-driven MBBS markets — see both country blocks' warnings; figures agent-quoted, not verified) ━━

Tbilisi State Medical University (TSMU) — Tbilisi, Georgia [PARTIALLY VERIFIED — the credible flagship]
  Type: Georgia's main state medical university — the serious option in a crowded market
  Known for: Medicine (English MD), Dentistry, Pharmacy
  Language: English MD programme (also Georgian/Russian tracks)
  Fees (agent-quoted): ~$8,000/yr English MD, ~$48,000 total for 6 years — confirm directly with tsmu.edu
  ⚠ Verify your home medical council recognises TSMU AND check its graduates' licensing pass rates; apply DIRECTLY — admission has no entrance exam, so paid "agents" add nothing.

Ivane Javakhishvili Tbilisi State University (TSU) — Tbilisi, Georgia [NOT VERIFIED fees]
  Type: Georgia's oldest and largest general university (1918)
  Known for: Law, Economics, Social Sciences, some English medicine
  Fees/deadline: NOT verified — English programmes typically $3,000–5,000/yr per agent listings; confirm on tsu.ge.

Ilia State University — Tbilisi, Georgia [NOT VERIFIED fees]
  Type: Reform-minded public university — sciences and liberal arts
  Known for: Natural Sciences, Business, Liberal Arts
  Fees/deadline: NOT verified — confirm on iliauni.edu.ge.

David Tvildiani Medical University (DTMU) — Tbilisi, Georgia [NOT VERIFIED fees]
  Type: Private medical school with the strongest USMLE-prep reputation in Georgia
  Known for: Medicine (AIETI English MD, USMLE-oriented)
  Fees/deadline: NOT verified — ~$8,000/yr per agent listings; confirm on dtmu.edu.ge
  ⚠ Same recognition/pass-rate checks apply — DTMU's US-exam orientation is its differentiator.

Georgian Technical University (GTU) — Tbilisi, Georgia [NOT VERIFIED fees]
  Type: Georgia's main technical university
  Known for: Engineering, IT, Architecture
  Fees/deadline: NOT verified — cheap ($2,500–4,500/yr per listings); confirm on gtu.ge.

Batumi Shota Rustaveli State University (BSU) — Batumi, Georgia [NOT VERIFIED fees — agent-quoted]
  Type: Batumi's public university on the Black Sea — Georgia's second city, cheaper than Tbilisi
  Known for: Medicine (English MD), Business, Humanities, Science
  Fees (agent-quoted): English MD ~$4,000–5,000/yr — confirm on bsu.edu.ge
  ⚠ Same golden rules as the whole Georgian MD market (recognition, pass rates, no agents).

University of Georgia (UG) — Tbilisi, Georgia [NOT VERIFIED fees — agent-quoted]
  Type: Georgia's largest private university — broad programmes beyond medicine
  Known for: Medicine (English MD), Business, Law, IT
  Fees (agent-quoted): English MD widely quoted ~$6,500/yr — the official fee page is ug.edu.ge/en/tuition-and-fees; confirm there.

New Vision University — Tbilisi, Georgia [VERIFIED MD fee — newvision.ge]
  Type: Private Tbilisi university with a widely marketed English MD — one of the few with a clear official price
  Known for: Medicine (English MD, 6 years), Dentistry, Law, Business
  Tuition (VERIFIED on the official programme page): English MD $7,000/yr.
  ⚠ Same golden rules as the whole Georgian MD market (recognition, pass rates, no agents).

Kutaisi International University (KIU) — Kutaisi, Georgia [VERIFIED — kiu.edu.ge]
  Type: New (2020) internationally-oriented STEM university developed in partnership with TU Munich — a different profile from the MD-agent market
  Known for: Computer Science, Mathematics, Management (English BScs); medicine added — confirm per programme
  Tuition (VERIFIED): €4,000/yr equivalent in GEL for the main English BScs (some programmes €5,500). KIU offers real 20–50% tuition-waiver scholarships for internationals (verified) — unlike the region's "discount marketing". Kutaisi living is among Europe's cheapest.
  Deadline: confirm windows on kiu.edu.ge

Caucasus University — Tbilisi, Georgia [NOT VERIFIED fees]
  Type: Private Tbilisi university built around the well-known Caucasus School of Business (est. 1998)
  Known for: Business, Law, Media, Economics
  Fees/deadline: NOT verified — confirm on cu.edu.ge.

Yerevan State Medical University (YSMU) — Yerevan, Armenia [PARTIALLY VERIFIED — agent-quoted fees consistent]
  Type: Armenia's flagship medical university — the credible marketed option
  Known for: Medicine (English MD, 6 years incl. internship), Dentistry, Pharmacy
  Fees (agent-quoted): ~$5,000–6,500/yr + ~$600/yr hostel — among the cheapest credible MD routes; confirm on ysmu.am
  ⚠ Verify home medical-council recognition first; Indian applicants need NEET for home licensing.

Yerevan State University (YSU) — Yerevan, Armenia [NOT VERIFIED fees]
  Type: Armenia's main comprehensive university (1919)
  Known for: Sciences, Oriental Studies, Economics, IT
  Fees/deadline: NOT verified — cheap; confirm on ysu.am.

American University of Armenia (AUA) — Yerevan, Armenia [VERIFIED — admissions.aua.am 2025-26]
  Type: US-accredited (WSCUC) English-medium university — the quality pick in Armenia
  Known for: Business, Economics, Computer Science, Engineering
  International tuition (2025-26, VERIFIED): 4,600,000 AMD/yr Business/Economics, 4,100,000 AMD/yr other programmes (≈ roughly $10,500–$12,000 USD — confirm current AMD rate). Paid in AMD; health insurance ~10–12,000 AMD/month for non-citizens.
  Scholarships: merit awards for internationals up to 50% of tuition (verified) + instalment/deferred plans and work-study.
  Deadline: confirm rounds on admissions.aua.am

French University in Armenia (UFAR) — Yerevan, Armenia [NOT VERIFIED fees]
  Type: FRENCH-language university delivering DUAL Armenian-French degrees with Université Jean Moulin Lyon 3 — a French state-recognised diploma at Yerevan costs; natural fit for francophone students
  Known for: Law, Business, Finance, Computer Science
  Fees/deadline: NOT verified — confirm on ufar.am.

National Polytechnic University of Armenia (NPUA) — Yerevan, Armenia [NOT VERIFIED fees]
  Type: Armenia's main engineering school (former Yerevan Polytechnic)
  Known for: Engineering, IT, Electrical Engineering
  Fees/deadline: NOT verified — listings suggest low fees ($1,500–3,500/yr — hearsay); confirm on polytechnic.am.

Russian-Armenian University (RAU) — Yerevan, Armenia [NOT VERIFIED fees]
  Type: Joint Russian-Armenian state university — degrees recognised in both countries; some English tracks incl. medicine
  Known for: Engineering, Medicine, Law, Economics
  Fees/deadline: NOT verified — confirm on rau.am. Russian-government quota places exist for some nationalities. For medicine, apply the regional MD golden rules (council recognition, pass rates, no agents).

━━ Singaporean universities (MOE Tuition Grant cuts fees 40–60% for a 3-year work bond — see Singapore country block & scholarship #70) ━━

National University of Singapore (NUS) — Singapore [VERIFIED fee example]
  Type: Asia's #1 university in most rankings
  Known for: Computer Science, Engineering, Business, Medicine, Law
  Language: English-medium instruction
  Tuition (verified example): Engineering S$38,000/yr without grant → S$17,550 with the MOE Tuition Grant (+3-year bond). Medicine/dentistry far higher and grant rules differ.
  Deadline: International applications ~Oct–Feb for August entry — confirm on nus.edu.sg
  ⚠ Extremely competitive — top grades plus strong profiles.

Nanyang Technological University (NTU) — Singapore [VERIFIED fee example]
  Type: Asia's top-2 with NUS — young, research-intense, famous campus
  Known for: Engineering, Computer Science/AI, Business, Materials Science
  Language: English-medium instruction
  Tuition (verified example): Business S$36,000/yr → S$17,100 with the grant (+bond)
  Deadline: ~Oct–Feb for August entry — confirm on ntu.edu.sg
  ⚠ Similarly competitive to NUS.

Singapore Management University (SMU) — Singapore [NOT individually verified]
  Type: City-campus specialist in business/social sciences — US-style seminar teaching
  Known for: Business, Economics, Law, Information Systems
  Fees: Higher sticker than NUS/NTU; grant applies — confirm on smu.edu.sg.

Singapore University of Technology and Design (SUTD) — Singapore [NOT individually verified]
  Type: Small design-and-tech university built with MIT collaboration
  Known for: Engineering Product Development, Architecture, Computer Science & Design
  Fees: Grant applies — confirm on sutd.edu.sg.

Singapore Institute of Technology (SIT) — Singapore [NOT individually verified]
  Type: Applied pathway university — industry-embedded degrees
  Known for: Applied Engineering, InfoComm, Health Sciences, Hospitality
  Fees: Grant applies; note SIT admits fewer internationals — confirm on singaporetech.edu.sg.

━━ Swedish universities (one portal: universityadmissions.se, deadline 15 Jan; SI scholarship #71; fees SEK 80,000–300,000/yr) ━━

KTH Royal Institute of Technology — Stockholm, Sweden [NOT individually verified — country fee ranges apply]
  Type: Sweden's top technical university
  Known for: Engineering, Computer Science, Architecture, Energy
  Fees: ~SEK 155,000–195,000/yr typical for engineering — confirm on kth.se; KTH also runs its own tuition scholarships.

Lund University — Lund, Sweden [NOT individually verified]
  Type: Sweden's most international-friendly comprehensive university — classic student town
  Known for: Engineering (LTH), International Relations, Law, Life Sciences
  Fees: ~SEK 110,000–200,000/yr by field — confirm on lunduniversity.lu.se; Lund Global Scholarship exists.

Uppsala University — Uppsala, Sweden [NOT individually verified]
  Type: The Nordics' oldest university (1477)
  Known for: Sciences, Pharmacy, Law, Peace & Conflict Studies
  Fees: ~SEK 100,000–200,000/yr — confirm on uu.se; Uppsala IPK scholarships exist.

Stockholm University — Stockholm, Sweden [NOT individually verified]
  Type: Big capital-city university — sciences and social sciences
  Known for: Social Sciences, Law, Environmental Science, Data Science
  Fees: ~SEK 90,000–160,000/yr — confirm on su.se.

Chalmers University of Technology — Gothenburg, Sweden [NOT individually verified]
  Type: Elite private-foundation technical university
  Known for: Automotive Engineering, Architecture, Computer Science, Shipping
  Fees: ~SEK 160,000/yr typical — confirm on chalmers.se; Avancez/IPOET scholarships give 75% reductions to top applicants.

University of Gothenburg — Gothenburg, Sweden [NOT individually verified]
  Type: Large comprehensive university sharing the city with Chalmers
  Known for: Business (Handels), Social Sciences, Arts, Medicine (Sahlgrenska)
  Fees: ~SEK 100,000–190,000/yr — confirm on gu.se.

Linköping University — Linköping, Sweden [NOT individually verified]
  Type: Innovation-oriented younger university — strong engineering/IT
  Known for: Computer Science, Engineering, Cognitive Science
  Fees: ~SEK 120,000–170,000/yr — confirm on liu.se; LiU International Scholarships reduce fees.

Umeå University — Umeå, Sweden [NOT individually verified]
  Type: Northern Sweden's hub — cheaper living, strong design school
  Known for: Design (world-renowned Institute of Design), Life Sciences (CRISPR heritage), Computing
  Fees: ~SEK 95,000–160,000/yr — confirm on umu.se.

Malmö University — Malmö, Sweden [NOT individually verified]
  Type: Young urban university minutes from Copenhagen — one of Sweden's most international student bodies
  Known for: Media, IT, Social Sciences, Design
  Fees: country ranges apply — confirm on mau.se.

Örebro University — Örebro, Sweden [NOT individually verified]
  Type: Mid-size university with medicine — cheaper living than the big-city options
  Known for: Medicine, Psychology, Business, Media
  Fees: country ranges apply — confirm on oru.se.

Jönköping University — Jönköping, Sweden [NOT individually verified]
  Type: Foundation university built around the international JIBS business school — unusually international for its size
  Known for: Business (JIBS), Engineering, Education, Nursing
  Fees: country ranges apply — confirm on ju.se.

━━ Finnish universities (one portal: studyinfo.fi, January window; automatic 50–100% waivers; 2-year post-study permit — see Finland country block) ━━

University of Helsinki — Helsinki, Finland [NOT individually verified — country ranges apply]
  Type: Finland's flagship — Nordic top-tier research
  Known for: Computer Science, Life Sciences, Education, Law
  Fees: ~€13,000–€18,000/yr with automatic scholarship consideration (waivers to 100% for top applicants) — confirm on helsinki.fi.

Aalto University — Espoo (Helsinki region), Finland [NOT individually verified]
  Type: Merger of tech/business/design schools — Finland's innovation engine (Slush startup culture)
  Known for: Computer Science, Design, Engineering, Business
  Fees: ~€12,000–€15,000/yr; Aalto scholarships waive 50–100% automatically for strong admits — confirm on aalto.fi.

University of Turku — Turku, Finland [NOT individually verified]
  Type: Historic university in Finland's old capital
  Known for: Astronomy, Biosciences, Education, Law
  Fees: ~€8,000–€14,000/yr with automatic waiver consideration — confirm on utu.fi.

Tampere University — Tampere, Finland [NOT individually verified]
  Type: Finland's second research hub — technology + social sciences merger
  Known for: Signal Processing, Gaming/Interactive Tech, Health Sciences, Social Sciences
  Fees: ~€10,000–€14,000/yr with automatic scholarships — confirm on tuni.fi.

University of Oulu — Oulu, Finland [NOT individually verified]
  Type: Northern tech university — wireless/6G research capital
  Known for: Wireless Communications (6G flagship), Computer Science, Mining, Medicine
  Fees: ~€10,000–€13,000/yr with generous waivers — confirm on oulu.fi.

University of Jyväskylä — Jyväskylä, Finland [NOT individually verified]
  Type: Education and sport-science specialist in the lake district
  Known for: Education (Finland's famous teacher training), Sport Sciences, Psychology, IT
  Fees: ~€8,000–€12,000/yr — confirm on jyu.fi.

LUT University — Lappeenranta/Lahti, Finland [NOT individually verified]
  Type: Energy/sustainability-focused technical university — very international-friendly
  Known for: Energy Systems, Sustainability Science, Mechanical Engineering, Business
  Fees: ~€10,000–€13,500/yr with a well-known 50–100% early-bird scholarship ladder — confirm on lut.fi.

University of Eastern Finland (UEF) — Joensuu & Kuopio, Finland [NOT individually verified]
  Type: Two-city university — strong health sciences and forestry in low-cost eastern Finland
  Known for: Medicine, Forestry & Environment, Education, Pharmacy
  Fees: country ranges apply — confirm on uef.fi.

Åbo Akademi University — Turku, Finland [NOT individually verified]
  Type: Finland's Swedish-language university — small, international, with English master's
  Known for: Chemical Engineering, IT, Social Sciences, Theology
  Fees: country ranges apply — confirm on abo.fi.

University of Vaasa — Vaasa, Finland [NOT individually verified]
  Type: Business/energy specialist on the west coast — in the Nordic energy-technology cluster
  Known for: Business, Finance, Energy Systems, IT
  Fees: country ranges apply — confirm on uwasa.fi.

━━ Russian universities (⚠⚠ SANCTIONS/BANKING: Russian banks are off SWIFT and Western cards/apps don't work inside Russia — paying fees & receiving money from home is genuinely hard; Rossotrudnichestvo quota + Open Doors scholarships; MBBS golden rules apply — see Russia country block) ━━

Lomonosov Moscow State University (MSU) — Moscow, Russia [NOT individually verified — fees agent-quoted]
  Type: Russia's #1 — the historic flagship, strong across sciences and humanities
  Known for: Physics, Mathematics, Chemistry, Economics
  Notes: Rossotrudnichestvo quota + Open Doors apply; confirm fees on msu.ru.

Saint Petersburg State University (SPbU) — Saint Petersburg, Russia [NOT individually verified — fees agent-quoted]
  Type: Russia's second historic flagship — alma mater of many national leaders
  Known for: Law, Economics, Physics, International Relations
  Notes: confirm fees on spbu.ru.

HSE University (Higher School of Economics) — Moscow, Russia [NOT individually verified — fees agent-quoted]
  Type: Leading social-science/economics university — the most Western-facing, many English-taught programmes
  Known for: Economics, Business, Computer Science, Political Science
  Notes: strongest English-taught catalogue in Russia; confirm fees on hse.ru.

RUDN University (Peoples' Friendship University) — Moscow, Russia [NOT individually verified — fees agent-quoted]
  Type: Built for international students — one of the largest African/Asian cohorts in Russia; strong medicine
  Known for: Medicine, Engineering, Law, Agriculture
  Notes: a natural first look for African/Asian applicants; English MBBS available. MBBS golden rules apply.

MGIMO University — Moscow, Russia [NOT individually verified — fees agent-quoted]
  Type: Russia's elite diplomacy/international-relations school (Foreign Ministry)
  Known for: International Relations, Law, Economics, Political Science

Bauman Moscow State Technical University — Moscow, Russia [NOT individually verified — fees agent-quoted]
  Type: Russia's premier engineering university (est. 1830)
  Known for: Mechanical Engineering, Aerospace Engineering, Robotics, Computer Science

Moscow Institute of Physics and Technology (MIPT) — Dolgoprudny (Moscow region), Russia [NOT individually verified]
  Type: "Russia's MIT" — elite physics and applied maths ("Phystech")
  Known for: Physics, Mathematics, Computer Science, AI

National Research Nuclear University MEPhI — Moscow, Russia [NOT individually verified]
  Type: Top nuclear-physics and engineering university
  Known for: Physics, Engineering, Cybersecurity, Computer Science

ITMO University — Saint Petersburg, Russia [NOT individually verified]
  Type: IT/photonics powerhouse — repeat world programming (ICPC) champions
  Known for: Computer Science, Physics, AI, Robotics

Novosibirsk State University (NSU) — Novosibirsk, Russia [NOT individually verified]
  Type: Siberia's research flagship, tied to the Akademgorodok science city
  Known for: Physics, Mathematics, Natural Sciences, Computer Science

Tomsk Polytechnic University — Tomsk, Russia [NOT individually verified]
  Type: Historic Siberian engineering university with a big international intake
  Known for: Engineering, Petroleum Engineering, Materials Science, IT

Sechenov University (First Moscow State Medical) — Moscow, Russia [NOT individually verified — MBBS golden rules apply]
  Type: Russia's top medical university — flagship English-taught MBBS
  Known for: Medicine, Dentistry, Pharmacy
  ⚠ Verify your home medical council recognises Sechenov AND check graduates' licensing pass rates (FMGE/NExT for India); apply directly.

Pirogov Russian National Research Medical University — Moscow, Russia [NOT individually verified — MBBS golden rules apply]
  Type: Major Moscow medical university with an English-medium MD
  Known for: Medicine, Pharmacy
  ⚠ Same recognition/pass-rate checks apply.

Kazan Federal University (KFU) — Kazan, Russia [NOT individually verified — MBBS golden rules apply]
  Type: Historic comprehensive (est. 1804) — big English MBBS plus broad programmes
  Known for: Medicine, Engineering, IT, Geosciences
  ⚠ Recognition/pass-rate checks apply for medicine.

Ural Federal University (UrFU) — Yekaterinburg, Russia [NOT individually verified]
  Type: Large federal university — engineering, IT and English MBBS at low cost
  Known for: Engineering, IT, Medicine, Materials Science

═══════════════════════════════════════════════════
END OF ADMITAI VERIFIED DATA
═══════════════════════════════════════════════════
`

// ─────────────────────────────────────────────────────────────────────────────
// Retrieval layer
//
// buildAdmitaiContext(query) returns a trimmed extract of the verified data:
//   • the destination blocks, scholarships and university entries whose
//     country (or name) is mentioned in the query,
//   • a compact coverage index of everything else (so the model knows what
//     data exists and never wrongly claims "we have no data on X"),
//   • or, when the query names nothing we cover, all destination blocks as a
//     general overview (still far smaller than the full dataset).
// Pure string processing — no dependencies, safe in the Deno edge runtime.
// ─────────────────────────────────────────────────────────────────────────────

const COUNTRY_ALIASES: Record<string, string[]> = {
  'Malaysia': ['malaysia', 'malaysian', 'kuala lumpur', 'penang'],
  'Germany': ['germany', 'german', 'deutschland', 'munich', 'berlin', 'aachen', 'heidelberg'],
  'Netherlands': ['netherlands', 'dutch', 'holland', 'amsterdam', 'delft', 'maastricht', 'studielink'],
  'UAE': ['uae', 'emirates', 'emirati', 'dubai', 'abu dhabi', 'sharjah', 'ajman'],
  'Ireland': ['ireland', 'irish', 'dublin'],
  'Canada': ['canada', 'canadian', 'toronto', 'vancouver', 'montreal', 'ontario', 'quebec'],
  'UK': ['uk', 'united kingdom', 'britain', 'british', 'england', 'scotland', 'scottish', 'wales', 'welsh', 'london', 'oxford', 'cambridge', 'ucas'],
  'South Africa': ['south africa', 'south african', 'sadc', 'johannesburg', 'cape town', 'pretoria'],
  'Egypt': ['egypt', 'egyptian', 'cairo'],
  'Qatar': ['qatar', 'qatari', 'doha', 'education city'],
  'Saudi Arabia': ['saudi', 'ksa', 'riyadh', 'jeddah', 'makkah', 'mecca', 'madinah', 'medina'],
  'Turkey': ['turkey', 'turkish', 'turkiye', 'istanbul', 'ankara', 'izmir', 'bogazici'],
  'Iran': ['iran', 'iranian', 'persian', 'tehran', 'persia'],
  'Estonia': ['estonia', 'estonian', 'tallinn', 'tartu'],
  'India': ['india', 'indian', 'delhi', 'mumbai', 'bangalore', 'bengaluru', 'chennai'],
  'New Zealand': ['new zealand', 'nz', 'kiwi', 'auckland', 'wellington', 'otago', 'christchurch'],
  'China': ['china', 'chinese', 'beijing', 'shanghai', 'tsinghua', 'peking', 'hsk'],
  'USA': ['usa', 'u.s.', 'united states', 'america', 'american', 'ivy league', 'harvard', 'stanford'],
  'Australia': ['australia', 'australian', 'aussie', 'sydney', 'melbourne', 'brisbane', 'perth', 'canberra'],
  'Italy': ['italy', 'italian', 'rome', 'milan', 'bologna', 'turin', 'naples', 'imat', 'bocconi', 'polimi'],
  'France': ['france', 'french', 'paris', 'lyon', 'grenoble', 'sorbonne', 'campus france', 'eiffel', 'sciences po'],
  'Hungary': ['hungary', 'hungarian', 'budapest', 'stipendium', 'semmelweis', 'debrecen', 'szeged'],
  'Japan': ['japan', 'japanese', 'tokyo', 'kyoto', 'osaka', 'mext', 'waseda', 'keio', 'nagoya'],
  'South Korea': ['korea', 'korean', 'seoul', 'kaist', 'yonsei', 'topik', 'gks', 'postech'],
  'Poland': ['poland', 'polish', 'warsaw', 'krakow', 'wroclaw', 'gdansk', 'nawa', 'banach', 'jagiellonian'],
  'Cyprus': ['cyprus', 'cypriot', 'nicosia', 'famagusta', 'trnc', 'limassol', 'larnaca'],
  'Georgia': ['georgia', 'georgian', 'tbilisi', 'tsmu'],
  'Armenia': ['armenia', 'armenian', 'yerevan', 'ysmu'],
  'Singapore': ['singapore', 'singaporean', 'nus', 'ntu', 'tuition grant'],
  'Sweden': ['sweden', 'swedish', 'stockholm', 'lund', 'uppsala', 'gothenburg', 'kth', 'chalmers'],
  'Finland': ['finland', 'finnish', 'helsinki', 'aalto', 'tampere', 'oulu', 'turku'],
  'Russia': ['russia', 'russian', 'moscow', 'saint petersburg', 'st petersburg', 'rossotrudnichestvo', 'rudn', 'sechenov', 'lomonosov', 'bauman', 'itmo', 'mephi', 'mipt'],
}

// Words too generic to identify a university by name.
const GENERIC_NAME_WORDS: Record<string, true> = {
  university: true, universiti: true, universitat: true, college: true,
  institute: true, institution: true, school: true, academy: true,
  international: true, national: true, technical: true, technology: true,
  technological: true, science: true, sciences: true, medical: true,
  medicine: true, state: true, city: true, campus: true, higher: true,
  education: true, united: true, free: true,
}

interface Chunk {
  text: string
  country: string | null
  nameTokens: string[]   // distinctive name tokens (universities only)
}

interface ParsedData {
  destinations: Chunk[]
  scholarships: Chunk[]
  universities: Chunk[]
  scholarshipIndex: string[]  // first lines, for the coverage index
}

function hasWord(haystackLower: string, needleLower: string): boolean {
  // Word-boundary substring test — prevents e.g. the alias "imat" matching
  // inside "approximate" (a real bug this replaced-indexOf version caused).
  const escaped = needleLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp('(^|[^a-z])' + escaped + '($|[^a-z])').test(haystackLower)
}

function canonicalCountry(raw: string): string | null {
  const s = raw.toLowerCase()
  if (s.indexOf('united kingdom') >= 0) return 'UK'
  if (s.indexOf('united states') >= 0) return 'USA'
  for (const canon of Object.keys(COUNTRY_ALIASES)) {
    if (hasWord(s, canon.toLowerCase())) return canon
    for (const a of COUNTRY_ALIASES[canon]) {
      if (a.length >= 4 && hasWord(s, a)) return canon
    }
  }
  return null
}

function parseData(): ParsedData {
  const destStart = ADMITAI_VERIFIED_DATA.indexOf('━━━ STUDY DESTINATIONS')
  const scholStart = ADMITAI_VERIFIED_DATA.indexOf('━━━ SCHOLARSHIPS ━━━')
  const uniStart = ADMITAI_VERIFIED_DATA.indexOf('━━━ UNIVERSITIES ━━━')
  const endStart = ADMITAI_VERIFIED_DATA.lastIndexOf('═══')

  const splitBlocks = (from: number, to: number): string[] =>
    ADMITAI_VERIFIED_DATA
      .slice(from, to)
      .split(/\n\s*\n/)
      .map(function (b) { return b.trim() })
      // drop section headers, "━━ ..." sub-headers and "═══" separators
      .filter(function (b) { return b.length > 40 && b.charAt(0) !== '━' && b.charAt(0) !== '═' })

  const destinations: Chunk[] = splitBlocks(destStart, scholStart).map(function (text) {
    return { text: text, country: canonicalCountry(text.split('\n')[0]), nameTokens: [] }
  })

  const scholarships: Chunk[] = splitBlocks(scholStart, uniStart).map(function (text) {
    const m = text.match(/Country:\s*([^|\n]+)/)
    const country = canonicalCountry(m ? m[1] : text.split('\n').slice(0, 3).join(' '))
    return { text: text, country: country, nameTokens: [] }
  })

  const universities: Chunk[] = splitBlocks(uniStart, endStart).map(function (text) {
    const firstLine = text.split('\n')[0]
    const bracket = firstLine.indexOf('[')
    const head = bracket > 0 ? firstLine.slice(0, bracket) : firstLine
    const country =
      canonicalCountry(head.slice(head.lastIndexOf(',') + 1)) || canonicalCountry(head)
    const namePart = head.split('—')[0]
    const nameTokens = namePart
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/gi, ' ')
      .split(/\s+/)
      .filter(function (t) { return t.length >= 4 && !GENERIC_NAME_WORDS[t] })
    return { text: text, country: country, nameTokens: nameTokens }
  })

  const scholarshipIndex = scholarships.map(function (s) {
    return s.text.split('\n')[0].trim()
  })

  return {
    destinations: destinations,
    scholarships: scholarships,
    universities: universities,
    scholarshipIndex: scholarshipIndex,
  }
}

let _parsed: ParsedData | null = null
function getParsed(): ParsedData {
  if (!_parsed) _parsed = parseData()
  return _parsed
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function detectCountries(query: string): { [c: string]: true } {
  const q = ' ' + query.toLowerCase() + ' '
  const found: { [c: string]: true } = {}
  for (const canon of Object.keys(COUNTRY_ALIASES)) {
    for (const a of COUNTRY_ALIASES[canon]) {
      if (new RegExp('(^|[^a-z])' + escapeRe(a) + '($|[^a-z])', 'i').test(q)) {
        found[canon] = true
        break
      }
    }
  }
  return found
}

function detectUniversities(query: string, universities: Chunk[]): Chunk[] {
  const q = query.toLowerCase()
  return universities.filter(function (u) {
    return u.nameTokens.some(function (t) {
      return new RegExp('(^|[^a-z])' + escapeRe(t) + '($|[^a-z])', 'i').test(q)
    })
  })
}

function coverageIndex(parsed: ParsedData, included: { [c: string]: true }): string {
  const others = Object.keys(COUNTRY_ALIASES).filter(function (c) { return !included[c] })
  const lines: string[] = []
  lines.push('━━━ COVERAGE INDEX (data AdmitAI holds beyond this extract) ━━━')
  if (others.length > 0) {
    lines.push(
      'Verified data also exists for: ' + others.join(', ') +
      '. If the student asks about one of these, you DO have AdmitAI data on it — the detailed entries will be supplied once the country is named in the conversation.',
    )
  }
  lines.push('All scholarships in the dataset (details supplied when relevant):')
  for (const title of parsed.scholarshipIndex) lines.push('  • ' + title)
  return lines.join('\n')
}

/**
 * Which covered countries does this query mention? Used by the coverage
 * logger — an empty result means the dataset had nothing specific to offer.
 */
export function detectCoverageCountries(query: string): string[] {
  return Object.keys(detectCountries(query))
}

/**
 * Build a query-relevant extract of the AdmitAI verified data.
 *
 * @param query        Free text to match against (user message(s), or
 *                     "country field level" for the roadmap function).
 * @param budgetChars  Soft cap on output size (default 60,000 chars ~ 15k tokens).
 */
export function buildAdmitaiContext(query: string, budgetChars = 60000): string {
  const parsed = getParsed()
  const countries = detectCountries(query)
  const namedUnis = detectUniversities(query, parsed.universities)
  for (const u of namedUnis) if (u.country) countries[u.country] = true

  const header =
    '═══════════════════════════════════════════════════\n' +
    'ADMITAI VERIFIED REFERENCE DATA (extract relevant to this conversation)\n' +
    'Use this as your primary source when answering questions about countries, costs, scholarships, or universities.\n' +
    'VERIFIED = confirmed from official sources. ESTIMATE / NOT VERIFIED = treat as approximate and say so.\n' +
    'DEADLINES: dates cite the cycle in which they were verified (e.g. "15 January 2026"). Scholarship and\n' +
    'admission cycles recur ANNUALLY — if a cited date has passed, do not say the opportunity is closed;\n' +
    'say it runs every year around that date and direct the student to confirm the current cycle.\n' +
    '═══════════════════════════════════════════════════'

  const footer =
    '═══════════════════════════════════════════════════\n' +
    'END OF ADMITAI VERIFIED DATA EXTRACT\n' +
    '═══════════════════════════════════════════════════'

  const parts: string[] = [header]
  let used = header.length + footer.length + 2500 // reserve room for the index

  const push = function (label: string | null, chunks: Chunk[]): void {
    const usable = chunks.filter(function (c) { return used + c.text.length + 2 <= budgetChars })
    if (usable.length === 0) return
    if (label) parts.push(label)
    for (const c of usable) {
      parts.push(c.text)
      used += c.text.length + 2
    }
  }

  const hasCountries = Object.keys(countries).length > 0

  if (!hasCountries) {
    // Generic query: give the full destinations overview only.
    push('━━━ STUDY DESTINATIONS (all-in annual costs, tuition + living, USD) ━━━', parsed.destinations)
  } else {
    const inCountry = function (c: Chunk): boolean {
      return c.country !== null && countries[c.country] === true
    }
    push('━━━ STUDY DESTINATIONS (all-in annual costs, tuition + living, USD) ━━━', parsed.destinations.filter(inCountry))
    push('━━━ SCHOLARSHIPS ━━━', parsed.scholarships.filter(inCountry))
    // Named universities first (guaranteed in), then the rest of the country lists.
    push('━━━ UNIVERSITIES ━━━', namedUnis.filter(inCountry).concat(
      parsed.universities.filter(function (u) { return inCountry(u) && namedUnis.indexOf(u) < 0 }),
    ))
  }

  parts.push(coverageIndex(parsed, countries))
  parts.push(footer)
  return parts.join('\n\n')
}

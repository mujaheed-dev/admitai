// All figures are verified from official sources unless verified: false.
// Costs and requirements change yearly — always link users to sourceUrl before they apply.

export const UNIVERSITIES = [
  {
    id: 'tum',
    name: 'Technical University of Munich (TUM)',
    country: 'Germany',
    city: 'Munich',
    flag: '🇩🇪',
    ranking: '#22 QS World 2026 · #1 in Germany',
    knownFor: ['Engineering', 'Computer Science', 'Natural Sciences', 'Management'],
    language: "Mostly German at bachelor's level; limited English-taught options (e.g. Management & Technology, Information Engineering)",
    entryGrades: "~75% / German GPA 2.0 minimum for bachelor's; competitive programmes expect higher",
    tests: 'English programmes: IELTS 6.5+ or TOEFL iBT 88+. German programmes: German B2/C1 (TestDaF 4×4 or DSH-2)',
    acceptance: 'Highly competitive — ~8% acceptance',
    tuitionIntl: "€2,000–€3,000/semester for non-EU bachelor's (~$4,300–$6,500/yr) — new since 2024; waivers available",
    living: 'Munich is pricey — budget ~€11,208/yr',
    deadline: '~July 15 for winter intake (undergrad)',
    scholarshipsHere: 'Merit & need-based tuition waivers can cover the new fees',
    scholarships: [
      {
        name: 'TUM Merit & Need-based Tuition Waiver',
        percentage: 'Up to 100% of tuition fees',
        whoQualifies: 'Top-performing admitted students; need-based options available',
        howToApply: 'Apply via TUM after admission; deadline ~May 31',
        deadlineMonth: 5,
        amountTier: 1,
        level: 'Undergraduate',
        verified: true,
      },
    ],
    sourceName: 'TUM (official)',
    sourceUrl: 'https://www.tum.de/en/studies',
    verified: true,
  },
]

export function getUniversitiesByCountry(countryName) {
  return UNIVERSITIES.filter(u => u.country === countryName)
}

export const UNIVERSITY_COUNTRIES = [...new Set(UNIVERSITIES.map(u => u.country))]

export const UNIVERSITY_FIELDS = [
  ...new Set(UNIVERSITIES.flatMap(u => u.knownFor)),
].sort()

/**
 * Returns university scholarships in a shape compatible with the Scholarships page.
 * Only includes entries where verified: true.
 */
export function getUniversityScholarshipsForPage() {
  return UNIVERSITIES.flatMap(u =>
    (u.scholarships || [])
      .filter(s => s.verified)
      .map((s, i) => ({
        id: `uni-${u.id}-s${i}`,
        name: s.name,
        country: u.country,
        flag: u.flag,
        fields: u.knownFor,
        amount: s.percentage,
        eligibility: s.whoQualifies,
        deadline: s.howToApply,
        deadlineMonth: s.deadlineMonth ?? 99,
        amountTier: s.amountTier ?? 2,
        level: s.level ?? 'Undergraduate',
        levelNote: '',
        sourceName: u.sourceName,
        sourceUrl: u.sourceUrl,
        verified: true,
        // attribution shown on the card
        universityName: u.name,
        universityCity: u.city,
      }))
  )
}

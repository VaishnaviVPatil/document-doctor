import type { DocumentCategory } from "./countries";
import { US_STATES } from "./states-us";
import type { VisaClass } from "@/lib/buildGenericVisaChecklist";

export type DocumentTypeEntry = {
  id: string;
  title: string;
  description: string;
  /** ID of the checklist in CHECKLISTS, if built statically. */
  checklistId?: string;
  /** If true, UI can link to an existing deep route (e.g. the France visa intake). */
  legacyRoute?: string;
  /** Optional grouping label, e.g. "New" / "Renewal" for state-level license entries. */
  group?: string;
  /** Visa class — drives which item set the generic builder emits. */
  visaClass?: VisaClass;
};

// Infer visa class from an entry id / title when not explicitly tagged.
// Matches are case-insensitive and first-wins.
function inferVisaClass(id: string, title: string): VisaClass {
  const s = `${id} ${title}`.toLowerCase();
  if (/\btransit\b|\bc-?\d|\bg\b/.test(s)) return "transit";
  if (/\bwork|\bemployment|h-?1b|\bl-?1\b|\bo-?1\b|skilled|\btss\b|blue card|critical skills|kennismigrant|job seeker|essential skills|highly skilled|digital nomad|\bd8\b|dafts/.test(s))
    return "work";
  if (/\bstudent|\bstudy|\beducation|\bed\b|\bd-?2\b|\bd-?4\b|\bx-?1\b|\bx-?2\b|academic|\blanguage|\bdh\b/.test(s))
    return "student";
  if (/\bfamily|reunion|reunification|\bsuper|\bpartner|\bspouse|marriage|\bk-?1\b|\bf-?6\b|dependant|dependent|fiance|\bd7\b|non-lucrative|golden|retirement|second home|passive|elective|\bs-?1\b/.test(s))
    return "family";
  if (/business|\bb-?1\b|\bm\b|\bf\b.*exchange|commercial|trade|conference|meeting/.test(s))
    return "business";
  if (/tourist|tourism|visit|visitor|holiday|working holiday|umrah|hajj|\beta\b|\bvoa\b|e-visa|evisa|e-tourist|\bb-?2\b|short-stay|\bl\b|tarjeta|schengen|\btvoa\b|vivis/.test(s))
    return "tourist";
  return "other";
}

// Driver's licenses: one "new" + one "renewal" entry per US state.
// Built dynamically so adding a state in states-us.ts auto-generates the entries.
const US_LICENSE_ENTRIES: DocumentTypeEntry[] = US_STATES.flatMap((s) => [
  {
    id: `${s.code}-new`,
    title: `${s.name} — First-time license`,
    description: `${s.agency} · Form ${s.formName} · ~$${s.fee}`,
    checklistId: `license-us-${s.code}-new`,
    group: "First-time",
  },
  {
    id: `${s.code}-renewal`,
    title: `${s.name} — License renewal`,
    description: `${s.agency} · Form ${s.formName} · ~$${s.fee}`,
    checklistId: `license-us-${s.code}-renewal`,
    group: "Renewal",
  },
]);

// Common visa types most countries support. Used as a base for countries where
// a more specific list is not defined.
const COMMON_VISA_TYPES = (country: string): DocumentTypeEntry[] => [
  {
    id: "tourist",
    title: "Tourist visa",
    description: `Short-stay tourism in ${country}.`,
  },
  {
    id: "business",
    title: "Business visa",
    description: "Meetings, conferences, short-term commercial activity.",
  },
  {
    id: "student",
    title: "Student visa",
    description: "Enrolment at an accredited educational institution.",
  },
  {
    id: "work",
    title: "Work / employment visa",
    description: "Paid employment with a local employer.",
  },
  {
    id: "transit",
    title: "Transit visa",
    description: "Short stopover en route to another country.",
  },
  {
    id: "family",
    title: "Family / visitor visa",
    description: "Visiting or joining family members.",
  },
];

export const DOCUMENT_TYPES: Record<DocumentCategory, Record<string, DocumentTypeEntry[]>> = {
  visa: {
    // ===== North America =====
    us: [
      {
        id: "b1-business",
        title: "B-1 — Business visitor",
        description: "Meetings, negotiations, conferences in the US.",
        checklistId: "visa-us-b1",
        group: "Non-immigrant",
      },
      {
        id: "b2-tourist",
        title: "B-2 — Tourist / visitor",
        description: "Tourism, medical treatment, social visits.",
        checklistId: "visa-us-b2",
        group: "Non-immigrant",
      },
      {
        id: "f1-student",
        title: "F-1 — Academic student",
        description: "Full-time study at a SEVP-certified school.",
        checklistId: "visa-us-f1",
        group: "Study / exchange",
      },
      {
        id: "j1-exchange",
        title: "J-1 — Exchange visitor",
        description: "Research scholars, interns, au pairs, camp counselors.",
        checklistId: "visa-us-j1",
        group: "Study / exchange",
      },
      {
        id: "h1b-work",
        title: "H-1B — Specialty occupation",
        description: "Petition-based work visa for specialty roles.",
        checklistId: "visa-us-h1b",
        group: "Work",
      },
      { id: "l1-transfer", title: "L-1 — Intra-company transfer", description: "Transfer from an overseas office.", group: "Work" },
      { id: "o1-extraordinary", title: "O-1 — Extraordinary ability", description: "Individuals with extraordinary ability.", group: "Work" },
      { id: "k1-fiance", title: "K-1 — Fiancé(e) of US citizen", description: "Enter the US to marry a US citizen.", group: "Family" },
      { id: "c-transit", title: "C — Transit", description: "Short stopover through the US." },
    ],
    ca: [
      { id: "visitor", title: "Visitor visa (TRV)", description: "Tourism, family visits, short stays." },
      { id: "study-permit", title: "Study permit", description: "Attend a Canadian DLI." },
      { id: "work-permit", title: "Work permit", description: "Employer-specific or open work permit." },
      { id: "super-visa", title: "Super visa", description: "Parents/grandparents of citizens/PR." },
      { id: "transit", title: "Transit visa", description: "≤48 hours transit." },
    ],
    mx: [
      { id: "tourist", title: "Tourist visa (FMM)", description: "Short-stay tourism." },
      { id: "temporary-resident", title: "Temporary resident", description: "Stays over 180 days." },
      { id: "student", title: "Student visa", description: "Enrolment in a Mexican institution." },
      { id: "work", title: "Work visa", description: "With Mexican employer offer." },
    ],

    // ===== Schengen =====
    fr: [
      {
        id: "schengen-short",
        title: "Short-stay (Schengen)",
        description: "≤ 90 days — tourism, business, family visit.",
        checklistId: "france-paris-tourist",
        legacyRoute: "/visa/france-paris/intake?visaType=schengen-short",
      },
      {
        id: "student",
        title: "Long-stay student (VLS-TS étudiant)",
        description: "Enrolment at a French university > 90 days.",
        checklistId: "visa-fr-student",
      },
      {
        id: "work",
        title: "Long-stay salaried (VLS-TS salarié)",
        description: "Employment > 90 days with French work contract.",
        checklistId: "visa-fr-work",
      },
      {
        id: "family-visit",
        title: "Family / visitor long-stay",
        description: "Join French family or retire in France.",
        checklistId: "visa-fr-family",
      },
    ],
    de: [
      { id: "schengen-short", title: "Short-stay (Schengen)", description: "≤ 90 days — tourism, business." },
      { id: "student", title: "National student visa", description: "Full-time study at a German university." },
      { id: "work", title: "Work / EU Blue Card", description: "Employment with German contract." },
      { id: "family-reunion", title: "Family reunion visa", description: "Join a spouse or child living in Germany." },
      { id: "job-seeker", title: "Job seeker visa", description: "6-month search for qualified employment." },
    ],
    it: [
      { id: "schengen-short", title: "Short-stay (Schengen)", description: "≤ 90 days tourism / business." },
      { id: "student", title: "Study visa (Type D)", description: "Full academic year or more." },
      { id: "work", title: "Work visa (Type D)", description: "With Nulla Osta authorization." },
      { id: "elective-residence", title: "Elective residence", description: "Self-funded long-stay (retirees)." },
    ],
    es: [
      { id: "schengen-short", title: "Short-stay (Schengen)", description: "≤ 90 days tourism / business." },
      { id: "student", title: "Student visa", description: "Enrolment > 90 days in Spain." },
      { id: "work", title: "Work visa", description: "Salaried employment with Spanish contract." },
      { id: "non-lucrative", title: "Non-lucrative visa", description: "Self-funded residency." },
      { id: "digital-nomad", title: "Digital nomad visa", description: "Remote work for non-Spanish employer." },
      { id: "golden", title: "Golden investor visa", description: "Qualifying real-estate / investment." },
    ],
    nl: [
      { id: "schengen-short", title: "Short-stay (Schengen)", description: "≤ 90 days tourism / business." },
      { id: "student", title: "Student (MVV)", description: "Enrolment at a Dutch university." },
      { id: "highly-skilled", title: "Highly skilled migrant (Kennismigrant)", description: "Salary-threshold employment visa." },
      { id: "dafts", title: "DAFT (US self-employed)", description: "Dutch-American Friendship Treaty." },
    ],
    be: COMMON_VISA_TYPES("Belgium"),
    at: COMMON_VISA_TYPES("Austria"),
    cz: COMMON_VISA_TYPES("Czechia"),
    dk: COMMON_VISA_TYPES("Denmark"),
    ee: COMMON_VISA_TYPES("Estonia"),
    fi: COMMON_VISA_TYPES("Finland"),
    gr: COMMON_VISA_TYPES("Greece"),
    hu: COMMON_VISA_TYPES("Hungary"),
    is: COMMON_VISA_TYPES("Iceland"),
    lv: COMMON_VISA_TYPES("Latvia"),
    lt: COMMON_VISA_TYPES("Lithuania"),
    lu: COMMON_VISA_TYPES("Luxembourg"),
    mt: COMMON_VISA_TYPES("Malta"),
    no: COMMON_VISA_TYPES("Norway"),
    pl: COMMON_VISA_TYPES("Poland"),
    pt: [
      { id: "schengen-short", title: "Short-stay (Schengen)", description: "≤ 90 days tourism / business." },
      { id: "student", title: "Student visa", description: "Enrolment at a Portuguese institution." },
      { id: "work", title: "Work visa", description: "With Portuguese employer offer." },
      { id: "d7", title: "D7 passive income visa", description: "Retirees / passive income residents." },
      { id: "digital-nomad", title: "D8 digital nomad visa", description: "Remote workers with foreign employer." },
      { id: "golden", title: "Golden visa", description: "Investment-based residency." },
    ],
    sk: COMMON_VISA_TYPES("Slovakia"),
    si: COMMON_VISA_TYPES("Slovenia"),
    se: COMMON_VISA_TYPES("Sweden"),
    ch: COMMON_VISA_TYPES("Switzerland"),

    // ===== Rest of Europe =====
    gb: [
      { id: "visitor-standard", title: "Standard Visitor visa", description: "Tourism, business, or visiting family (≤6 months)." },
      { id: "student", title: "Student visa (Tier 4)", description: "Full-time study at a UK licensed sponsor." },
      { id: "skilled-worker", title: "Skilled Worker visa", description: "Job with a licensed UK sponsor." },
      { id: "family", title: "Family visa", description: "Join a spouse, partner or child in the UK." },
      { id: "transit", title: "Transit visa", description: "Passing through the UK." },
    ],
    ie: COMMON_VISA_TYPES("Ireland"),
    ru: [
      { id: "tourist", title: "Tourist visa", description: "Short stay with voucher/invitation." },
      { id: "business", title: "Business visa", description: "Meetings or conferences." },
      { id: "student", title: "Student visa", description: "Enrolment at a Russian university." },
      { id: "work", title: "Work visa", description: "Russian employer invitation." },
      { id: "private", title: "Private / family visa", description: "Personal invitation from a resident." },
    ],
    tr: [
      { id: "e-visa", title: "e-Visa (tourist/business)", description: "Online short-stay e-visa." },
      { id: "student", title: "Student residence permit", description: "Enrolment at a Turkish university." },
      { id: "work", title: "Work residence permit", description: "With Turkish employer sponsorship." },
    ],
    ua: COMMON_VISA_TYPES("Ukraine"),

    // ===== Asia =====
    cn: [
      { id: "l-tourist", title: "L — Tourist visa", description: "Short-stay tourism." },
      { id: "m-business", title: "M — Business visa", description: "Commercial and trade." },
      { id: "f-exchange", title: "F — Non-commercial exchange", description: "Research, academic exchange." },
      { id: "x1-student", title: "X1 — Long-term student", description: "Study > 180 days." },
      { id: "x2-student", title: "X2 — Short-term student", description: "Study ≤ 180 days." },
      { id: "z-work", title: "Z — Work visa", description: "Employment in China." },
      { id: "s1-family", title: "S1 — Long-term family", description: "Family reunion > 180 days." },
      { id: "g-transit", title: "G — Transit", description: "Transit through mainland China." },
    ],
    hk: [
      { id: "visitor", title: "Visitor visa", description: "Tourism or short business." },
      { id: "student", title: "Student visa", description: "Enrolment at a HK institution." },
      { id: "employment", title: "Employment visa (GEP)", description: "Professional employment." },
    ],
    jp: [
      { id: "short-stay", title: "Short-term stay", description: "Tourism, business, family (≤ 90 days)." },
      { id: "student", title: "Student visa", description: "Full-time enrolment in Japan." },
      { id: "work", title: "Work visa (various)", description: "Engineer, specialist in humanities, instructor, etc." },
      { id: "working-holiday", title: "Working holiday", description: "Youth travel+work agreement countries." },
      { id: "spouse", title: "Spouse of Japanese national", description: "Family reunion." },
    ],
    kr: [
      { id: "c3-short", title: "C-3 — Short-term visit", description: "Tourism or business ≤ 90 days." },
      { id: "d2-student", title: "D-2 — Student", description: "Degree study in Korea." },
      { id: "d4-language", title: "D-4 — Language training", description: "Korean language course." },
      { id: "e7-professional", title: "E-7 — Specially designated activities", description: "Sponsored professional work." },
      { id: "f6-marriage", title: "F-6 — Marriage migrant", description: "Spouse of Korean national." },
    ],
    tw: COMMON_VISA_TYPES("Taiwan"),
    in: [
      {
        id: "e-tourist",
        title: "e-Tourist visa",
        description: "Short-stay tourism via indianvisaonline.gov.in.",
        checklistId: "visa-in-e-tourist",
        group: "e-Visa",
      },
      {
        id: "e-business",
        title: "e-Business visa",
        description: "Commercial meetings, trade.",
        checklistId: "visa-in-e-business",
        group: "e-Visa",
      },
      {
        id: "e-medical",
        title: "e-Medical visa",
        description: "Medical treatment at recognised Indian hospital.",
        checklistId: "visa-in-e-medical",
        group: "e-Visa",
      },
      { id: "e-conference", title: "e-Conference visa", description: "Conferences approved by ministries.", group: "e-Visa" },
      {
        id: "tourist-regular",
        title: "Regular tourist visa",
        description: "Sticker tourist visa at Indian consulate.",
        checklistId: "visa-in-tourist",
        group: "Regular",
      },
      {
        id: "student",
        title: "Student visa",
        description: "Enrolment at a recognised Indian institution.",
        checklistId: "visa-in-student",
        group: "Regular",
      },
      { id: "employment", title: "Employment visa", description: "Skilled employment in India.", group: "Regular" },
      { id: "research", title: "Research visa", description: "Academic research at Indian institution.", group: "Regular" },
      { id: "journalist", title: "Journalist visa", description: "Accredited foreign journalists.", group: "Regular" },
    ],
    pk: COMMON_VISA_TYPES("Pakistan"),
    bd: COMMON_VISA_TYPES("Bangladesh"),
    lk: [
      { id: "eta-tourist", title: "ETA — Tourist", description: "Electronic travel authorisation for tourism." },
      { id: "eta-business", title: "ETA — Business", description: "Short-stay business ETA." },
      { id: "student", title: "Student visa", description: "Enrolment in Sri Lankan institution." },
    ],
    np: [
      { id: "tourist-voa", title: "Tourist (visa on arrival)", description: "Available at TIA Kathmandu." },
      { id: "student", title: "Student visa", description: "Enrolment at a Nepali institution." },
      { id: "trekking", title: "Trekking permit", description: "Required for many regions." },
    ],
    th: [
      { id: "tr-tourist", title: "TR — Tourist visa", description: "Single-entry tourism." },
      { id: "ed-education", title: "ED — Education visa", description: "Enrolment at a Thai school/university." },
      { id: "b-business", title: "B — Business/work", description: "Business or employment with Thai company." },
      { id: "ltr", title: "Long-Term Resident (LTR)", description: "10-year visa for qualified residents." },
      { id: "dtv", title: "Destination Thailand Visa (DTV)", description: "Digital nomad / soft-power visa." },
    ],
    vn: [
      { id: "e-visa", title: "e-Visa", description: "Single or multiple-entry online tourist/business." },
      { id: "dn-business", title: "DN — Business", description: "Working with Vietnamese enterprises." },
      { id: "dh-student", title: "DH — Student / Intern", description: "Enrolment at Vietnamese institution." },
      { id: "lv-work", title: "LV — Work permit holder", description: "Employment with work permit." },
    ],
    id: [
      { id: "voa", title: "Visa on arrival", description: "Tourism 30 days, extendable once." },
      { id: "b211a", title: "B211A — Tourist / social", description: "Up to 60 days, extendable." },
      { id: "kitas-work", title: "KITAS — Work/stay permit", description: "Employer-sponsored limited stay." },
      { id: "second-home", title: "Second Home visa", description: "5 or 10-year long-stay." },
    ],
    my: COMMON_VISA_TYPES("Malaysia"),
    sg: [
      { id: "evisa-short", title: "e-Visa — Short-term visit", description: "Visit pass for tourism or business." },
      { id: "student", title: "Student Pass", description: "Enrolment at a Singapore institution." },
      { id: "employment", title: "Employment Pass", description: "Professional work pass." },
      { id: "s-pass", title: "S Pass", description: "Mid-level skilled workers." },
      { id: "dependant", title: "Dependant's Pass", description: "Family of EP/S-Pass holders." },
    ],
    ph: COMMON_VISA_TYPES("Philippines"),
    kh: [
      { id: "e-visa-tourist", title: "e-Visa — Tourist", description: "Online tourist e-visa." },
      { id: "business", title: "Business visa (E-class)", description: "Commercial activity." },
    ],

    // ===== Middle East =====
    ae: [
      { id: "tourist-30", title: "Tourist visa (30 days)", description: "Short-stay tourism." },
      { id: "tourist-60", title: "Tourist visa (60 days)", description: "Extended single-entry." },
      { id: "multi-entry-5", title: "Multi-entry tourist (5 years)", description: "Multi-entry for frequent visitors." },
      { id: "golden", title: "Golden residence visa", description: "10-year residency." },
      { id: "employment", title: "Employment / work visa", description: "Company-sponsored work." },
      { id: "student", title: "Student visa", description: "UAE institution enrolment." },
    ],
    sa: [
      { id: "e-visa", title: "Tourist e-Visa", description: "Online tourist e-visa." },
      { id: "umrah", title: "Umrah visa", description: "Pilgrimage outside Hajj season." },
      { id: "hajj", title: "Hajj visa", description: "Annual Hajj pilgrimage." },
      { id: "business-visit", title: "Business visit visa", description: "Sponsored business trip." },
      { id: "work", title: "Work visa", description: "Saudi employer sponsorship." },
    ],
    qa: COMMON_VISA_TYPES("Qatar"),
    il: [
      { id: "b2-tourist", title: "B/2 — Tourist", description: "Short-stay tourism." },
      { id: "a2-student", title: "A/2 — Student", description: "Study in Israel." },
      { id: "b1-work", title: "B/1 — Work", description: "Specialist work with employer sponsorship." },
    ],
    jo: COMMON_VISA_TYPES("Jordan"),

    // ===== Oceania =====
    au: [
      { id: "subclass-600", title: "Subclass 600 — Visitor", description: "Tourism or business." },
      { id: "subclass-500-student", title: "Subclass 500 — Student", description: "Full-time CRICOS course." },
      { id: "subclass-482-work", title: "Subclass 482 — Skilled (TSS)", description: "Employer-sponsored work." },
      { id: "subclass-189-skilled", title: "Subclass 189 — Skilled independent", description: "Points-tested PR." },
      { id: "subclass-417-wh", title: "Subclass 417 — Working Holiday", description: "Youth work+travel." },
      { id: "subclass-820-partner", title: "Subclass 820 — Partner", description: "Spouse / partner of Australian." },
    ],
    nz: [
      { id: "visitor", title: "Visitor visa", description: "Tourism or short family visits." },
      { id: "student", title: "Student visa", description: "Study at an NZQA institution." },
      { id: "essential-skills", title: "Essential Skills (Accredited Employer)", description: "Employer-sponsored work." },
      { id: "working-holiday", title: "Working Holiday visa", description: "Youth work+travel (eligible countries)." },
    ],

    // ===== Africa =====
    eg: [
      { id: "e-visa-tourist", title: "e-Visa — Tourist", description: "Online tourist e-visa." },
      { id: "voa", title: "Visa on arrival", description: "At Egyptian ports of entry." },
    ],
    ma: COMMON_VISA_TYPES("Morocco"),
    ke: [
      { id: "eta", title: "Electronic Travel Authorisation (ETA)", description: "Kenya's entry authorisation." },
      { id: "student", title: "Student pass", description: "Enrolment at Kenyan institution." },
      { id: "work", title: "Work permit", description: "Employer-sponsored work." },
    ],
    tz: COMMON_VISA_TYPES("Tanzania"),
    za: [
      { id: "visitor", title: "Visitor's visa", description: "Tourism or short business." },
      { id: "study", title: "Study visa", description: "Enrolment at a SA institution." },
      { id: "critical-skills", title: "Critical Skills work visa", description: "Occupations on the critical skills list." },
      { id: "general-work", title: "General Work visa", description: "Employer-sponsored work." },
    ],

    // ===== South America =====
    br: [
      { id: "vivis-tourist", title: "VIVIS — Tourist / business", description: "Short-stay visitor visa." },
      { id: "vitem-iv-student", title: "VITEM IV — Student", description: "Enrolment at Brazilian institution." },
      { id: "vitem-v-work", title: "VITEM V — Work", description: "Employer-sponsored work." },
      { id: "vipar-temporary", title: "VIPAR — Temporary residence", description: "Family reunion or retirement." },
    ],
    ar: COMMON_VISA_TYPES("Argentina"),
    cl: COMMON_VISA_TYPES("Chile"),
    co: COMMON_VISA_TYPES("Colombia"),
    pe: COMMON_VISA_TYPES("Peru"),
    cu: [
      { id: "tourist-card", title: "Tourist card (Tarjeta del Turista)", description: "Required for most nationalities." },
      { id: "business", title: "Business visa", description: "Commercial activity in Cuba." },
    ],
  },

  passport: {
    us: [
      {
        id: "renewal",
        title: "Passport renewal (DS-82)",
        description: "Renew by mail if you qualify. Adults, US citizens.",
        checklistId: "passport-us-renewal",
      },
      {
        id: "new",
        title: "First-time passport (DS-11)",
        description: "Apply in person at an acceptance facility.",
      },
    ],
    in: [
      { id: "renewal", title: "Passport re-issue", description: "Renew an expired or soon-to-expire Indian passport." },
      { id: "new", title: "Fresh passport", description: "First-time Indian passport application." },
    ],
    gb: [{ id: "renewal", title: "Passport renewal", description: "Renew a UK passport online." }],
    ca: [{ id: "renewal", title: "Passport renewal", description: "Renew a Canadian passport by mail." }],
    au: [{ id: "renewal", title: "Passport renewal", description: "Renew an Australian passport." }],
  },
  license: {
    us: US_LICENSE_ENTRIES,
    in: [{ id: "new", title: "New learner's licence", description: "Apply via parivahan.gov.in." }],
    gb: [{ id: "provisional", title: "Provisional licence", description: "Apply on gov.uk." }],
    ca: [{ id: "new", title: "New driver's licence", description: "Apply at provincial licensing office." }],
    au: [{ id: "new", title: "New driver's licence", description: "Apply at your state road authority." }],
  },
  permit: {
    us: [
      {
        id: "business-general",
        title: "General business permit",
        description: "DBA, EIN, local license and zoning.",
        checklistId: "us-business-permit",
      },
    ],
  },
};

// Fill in defaults for every visa entry: if there's no explicit checklistId
// and no legacyRoute, point at the dynamic builder id; if there's no
// visaClass, infer from id/title. This runs once at module load so the
// registry stays concise but every visa is reachable.
(function fillVisaDefaults() {
  const visaMap = DOCUMENT_TYPES.visa;
  for (const [cc, entries] of Object.entries(visaMap)) {
    for (const e of entries) {
      if (!e.checklistId && !e.legacyRoute) {
        e.checklistId = `visa-${cc}-${e.id}`;
      }
      if (!e.visaClass) {
        e.visaClass = inferVisaClass(e.id, e.title);
      }
    }
  }
})();

export function getDocumentTypes(
  category: DocumentCategory,
  countryCode: string
): DocumentTypeEntry[] {
  return DOCUMENT_TYPES[category]?.[countryCode.toLowerCase()] ?? [];
}

export function getDocumentType(
  category: DocumentCategory,
  countryCode: string,
  docTypeId: string
): DocumentTypeEntry | undefined {
  return getDocumentTypes(category, countryCode).find((d) => d.id === docTypeId);
}

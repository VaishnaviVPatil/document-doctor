import type { FileValidationRules } from "./checklists";

export type VisaCountryMeta = {
  countryName: string;
  /** Country's MFA / embassy / visa portal URL. Used as official source link. */
  embassyUrl: string;
  /** Typed photo rules. Default is ICAO Schengen biometric (35×45 mm). */
  photo: FileValidationRules;
  /** Short label for the photo spec, displayed to users. */
  photoSpec: string;
  /** Approximate base visa fee in USD; shown as guidance in the fee item. */
  baseFeeUsd?: number;
};

// ---- Canonical photo specs ---------------------------------------------------

// ICAO biometric 35 × 45 mm — the default for most of the world (all of
// Schengen, UK, Canada, Australia, Korea, Turkey, Russia, Latin America, etc.).
const PHOTO_SCHENGEN: FileValidationRules = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png"],
  image: {
    minWidth: 413,
    minHeight: 531,
    aspectRatio: 35 / 45,
    description: "35 × 45 mm biometric (ICAO), min 413×531 px, white background",
  },
};

// US — 2 × 2 inches square, 600–1200 px, JPEG ≤ 240 KB (DS-160 upload limit).
const PHOTO_US: FileValidationRules = {
  maxBytes: 240 * 1024,
  mimeTypes: ["image/jpeg"],
  image: {
    minWidth: 600,
    minHeight: 600,
    maxWidth: 1200,
    maxHeight: 1200,
    aspectRatio: 1,
    description: "2 × 2 in square (600–1200 px), JPEG ≤ 240 KB",
  },
};

// Japan — 45 × 45 mm square photo.
const PHOTO_JAPAN: FileValidationRules = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png"],
  image: {
    minWidth: 531,
    minHeight: 531,
    aspectRatio: 1,
    description: "45 × 45 mm square, min 531×531 px, white background",
  },
};

// China — 33 × 48 mm (2×2 in photo not accepted at consulates).
const PHOTO_CHINA: FileValidationRules = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png"],
  image: {
    minWidth: 390,
    minHeight: 567,
    aspectRatio: 33 / 48,
    description: "33 × 48 mm, min 390×567 px, white background",
  },
};

// India e-visa — square JPEG, ≥350×350 px, 10 KB – 1 MB.
const PHOTO_INDIA_EVISA: FileValidationRules = {
  minBytes: 10 * 1024,
  maxBytes: 1 * 1024 * 1024,
  mimeTypes: ["image/jpeg"],
  image: {
    minWidth: 350,
    minHeight: 350,
    aspectRatio: 1,
    description: "Square JPEG, min 350×350 px, 10 KB – 1 MB, white background",
  },
};

// Canada — 35 × 45 mm but uses slightly different constraints; default
// Schengen spec is close enough for client-side validation.
const PHOTO_CANADA = PHOTO_SCHENGEN;

// Australia — 35 × 45 mm biometric.
const PHOTO_AU = PHOTO_SCHENGEN;

// UK — 35 × 45 mm biometric for biometric-collection centres.
const PHOTO_UK = PHOTO_SCHENGEN;

// ---- Per-country metadata ---------------------------------------------------

export const VISA_COUNTRY_META: Record<string, VisaCountryMeta> = {
  // North America
  us: { countryName: "United States",     embassyUrl: "https://travel.state.gov",                       photo: PHOTO_US,        photoSpec: "2×2 in square, 600–1200 px JPEG ≤ 240 KB", baseFeeUsd: 185 },
  ca: { countryName: "Canada",            embassyUrl: "https://www.canada.ca/en/immigration-refugees-citizenship.html", photo: PHOTO_CANADA, photoSpec: "35 × 45 mm (Canadian standard)", baseFeeUsd: 75 },
  mx: { countryName: "Mexico",            embassyUrl: "https://www.gob.mx/sre",                         photo: PHOTO_SCHENGEN,  photoSpec: "35 × 45 mm biometric", baseFeeUsd: 44 },

  // Schengen — all share the same photo spec
  at: { countryName: "Austria",           embassyUrl: "https://www.bmeia.gv.at",                        photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  be: { countryName: "Belgium",           embassyUrl: "https://diplomatie.belgium.be",                  photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  cz: { countryName: "Czechia",           embassyUrl: "https://www.mzv.cz",                             photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  dk: { countryName: "Denmark",           embassyUrl: "https://nyidanmark.dk",                          photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  ee: { countryName: "Estonia",           embassyUrl: "https://vm.ee",                                  photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  fi: { countryName: "Finland",           embassyUrl: "https://migri.fi",                               photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  fr: { countryName: "France",            embassyUrl: "https://france-visas.gouv.fr",                   photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  de: { countryName: "Germany",           embassyUrl: "https://www.auswaertiges-amt.de",                photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  gr: { countryName: "Greece",            embassyUrl: "https://www.mfa.gr",                             photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  hu: { countryName: "Hungary",           embassyUrl: "https://konzuliszolgalat.kormany.hu",            photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  is: { countryName: "Iceland",           embassyUrl: "https://island.is",                              photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  it: { countryName: "Italy",             embassyUrl: "https://vistoperitalia.esteri.it",               photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  lv: { countryName: "Latvia",            embassyUrl: "https://www.pmlp.gov.lv",                        photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  lt: { countryName: "Lithuania",         embassyUrl: "https://www.migracija.lt",                       photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  lu: { countryName: "Luxembourg",        embassyUrl: "https://maee.gouvernement.lu",                   photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  mt: { countryName: "Malta",             embassyUrl: "https://identita.gov.mt",                        photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  nl: { countryName: "Netherlands",       embassyUrl: "https://ind.nl",                                 photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  no: { countryName: "Norway",            embassyUrl: "https://www.udi.no",                             photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  pl: { countryName: "Poland",            embassyUrl: "https://www.gov.pl/web/dyplomacja",              photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  pt: { countryName: "Portugal",          embassyUrl: "https://vistos.mne.gov.pt",                      photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  sk: { countryName: "Slovakia",          embassyUrl: "https://www.mzv.sk",                             photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  si: { countryName: "Slovenia",          embassyUrl: "https://www.gov.si",                             photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  es: { countryName: "Spain",             embassyUrl: "https://www.exteriores.gob.es",                  photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  se: { countryName: "Sweden",            embassyUrl: "https://www.migrationsverket.se",                photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },
  ch: { countryName: "Switzerland",       embassyUrl: "https://www.sem.admin.ch",                       photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm Schengen biometric", baseFeeUsd: 90 },

  // Rest of Europe
  gb: { countryName: "United Kingdom",    embassyUrl: "https://www.gov.uk/browse/visas-immigration",    photo: PHOTO_UK,        photoSpec: "35 × 45 mm biometric (UK)", baseFeeUsd: 130 },
  ie: { countryName: "Ireland",           embassyUrl: "https://www.irishimmigration.ie",                photo: PHOTO_SCHENGEN,  photoSpec: "35 × 45 mm biometric", baseFeeUsd: 80 },
  ru: { countryName: "Russia",            embassyUrl: "https://electronic-visa.kdmid.ru",               photo: PHOTO_SCHENGEN,  photoSpec: "35 × 45 mm biometric", baseFeeUsd: 80 },
  tr: { countryName: "Turkey",            embassyUrl: "https://www.evisa.gov.tr",                       photo: PHOTO_SCHENGEN,  photoSpec: "50 × 60 mm (consular) or e-visa (no photo)", baseFeeUsd: 60 },
  ua: { countryName: "Ukraine",           embassyUrl: "https://evisa.mfa.gov.ua",                        photo: PHOTO_SCHENGEN,  photoSpec: "35 × 45 mm biometric", baseFeeUsd: 85 },

  // Asia
  cn: { countryName: "China",             embassyUrl: "https://bio.visaforchina.org",                    photo: PHOTO_CHINA, photoSpec: "33 × 48 mm", baseFeeUsd: 140 },
  hk: { countryName: "Hong Kong",         embassyUrl: "https://www.immd.gov.hk",                         photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm", baseFeeUsd: 25 },
  jp: { countryName: "Japan",             embassyUrl: "https://www.mofa.go.jp",                          photo: PHOTO_JAPAN,    photoSpec: "45 × 45 mm square", baseFeeUsd: 30 },
  kr: { countryName: "South Korea",       embassyUrl: "https://www.visa.go.kr",                          photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 60 },
  tw: { countryName: "Taiwan",            embassyUrl: "https://www.boca.gov.tw",                         photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 50 },
  in: { countryName: "India",             embassyUrl: "https://indianvisaonline.gov.in",                 photo: PHOTO_INDIA_EVISA, photoSpec: "Square JPEG, ≥350×350, 10 KB – 1 MB", baseFeeUsd: 40 },
  pk: { countryName: "Pakistan",          embassyUrl: "https://visa.nadra.gov.pk",                       photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 60 },
  bd: { countryName: "Bangladesh",        embassyUrl: "https://www.visa.gov.bd",                         photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 50 },
  lk: { countryName: "Sri Lanka",         embassyUrl: "https://www.eta.gov.lk",                          photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 35 },
  np: { countryName: "Nepal",             embassyUrl: "https://www.nepalimmigration.gov.np",             photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 30 },
  th: { countryName: "Thailand",          embassyUrl: "https://www.thaievisa.go.th",                     photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 40 },
  vn: { countryName: "Vietnam",           embassyUrl: "https://evisa.xuatnhapcanh.gov.vn",               photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 25 },
  id: { countryName: "Indonesia",         embassyUrl: "https://evisa.imigrasi.go.id",                    photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 35 },
  my: { countryName: "Malaysia",          embassyUrl: "https://www.imi.gov.my",                          photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 25 },
  sg: { countryName: "Singapore",         embassyUrl: "https://www.ica.gov.sg",                          photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 30 },
  ph: { countryName: "Philippines",       embassyUrl: "https://evisa.dfa.gov.ph",                        photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 40 },
  kh: { countryName: "Cambodia",          embassyUrl: "https://www.evisa.gov.kh",                        photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 36 },

  // Middle East
  ae: { countryName: "United Arab Emirates", embassyUrl: "https://smartservices.icp.gov.ae",             photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 100 },
  sa: { countryName: "Saudi Arabia",      embassyUrl: "https://visa.mofa.gov.sa",                        photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 120 },
  qa: { countryName: "Qatar",             embassyUrl: "https://www.moi.gov.qa",                          photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 55 },
  il: { countryName: "Israel",            embassyUrl: "https://www.gov.il/en/departments/ministry_of_interior", photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 44 },
  jo: { countryName: "Jordan",            embassyUrl: "https://www.moi.gov.jo",                          photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 56 },

  // Oceania
  au: { countryName: "Australia",         embassyUrl: "https://immi.homeaffairs.gov.au",                 photo: PHOTO_AU,       photoSpec: "35 × 45 mm biometric", baseFeeUsd: 120 },
  nz: { countryName: "New Zealand",       embassyUrl: "https://www.immigration.govt.nz",                 photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 140 },

  // Africa
  eg: { countryName: "Egypt",             embassyUrl: "https://visa2egypt.gov.eg",                       photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 25 },
  ma: { countryName: "Morocco",           embassyUrl: "https://www.consulat.ma",                         photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 30 },
  ke: { countryName: "Kenya",             embassyUrl: "https://www.etakenya.go.ke",                      photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 30 },
  tz: { countryName: "Tanzania",          embassyUrl: "https://visa.immigration.go.tz",                  photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 50 },
  za: { countryName: "South Africa",      embassyUrl: "https://www.dha.gov.za",                          photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 45 },

  // South / Central America
  br: { countryName: "Brazil",            embassyUrl: "https://www.gov.br/mre",                          photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 85 },
  ar: { countryName: "Argentina",         embassyUrl: "https://www.migraciones.gov.ar",                  photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 55 },
  cl: { countryName: "Chile",             embassyUrl: "https://tramites.minrel.gov.cl",                  photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 65 },
  co: { countryName: "Colombia",          embassyUrl: "https://tramitesmre.cancilleria.gov.co",          photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 82 },
  pe: { countryName: "Peru",              embassyUrl: "https://www.gob.pe/migraciones",                  photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 30 },
  cu: { countryName: "Cuba",              embassyUrl: "https://minrex.gob.cu",                           photo: PHOTO_SCHENGEN, photoSpec: "35 × 45 mm biometric", baseFeeUsd: 50 },
};

const DEFAULT_META: VisaCountryMeta = {
  countryName: "Unknown",
  embassyUrl: "",
  photo: PHOTO_SCHENGEN,
  photoSpec: "35 × 45 mm biometric (ICAO default)",
  baseFeeUsd: 80,
};

export function getVisaCountryMeta(code: string): VisaCountryMeta {
  return VISA_COUNTRY_META[code.toLowerCase()] ?? DEFAULT_META;
}

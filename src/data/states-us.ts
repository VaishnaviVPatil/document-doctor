export type UsState = {
  code: string;
  name: string;
  /** Name of the licensing agency, e.g. "California DMV", "New York DMV", "Texas DPS". */
  agency: string;
  /** Base URL of the agency's website. */
  url: string;
  /** Name of the driver's license application form, e.g. "DL 44", "MV-44", "DL-14A". */
  formName: string;
  /** First-time DL fee in USD (approximate; users should verify on the agency site). */
  fee: number;
  /** Typical processing time in days from application to card arrival. */
  estimatedDays: number;
};

// Fee and processing-day values are approximate and meant as a starting point.
// Each item in the generated checklist links to the state's agency page so users
// can confirm the up-to-date figure.
export const US_STATES: UsState[] = [
  { code: "al", name: "Alabama",       agency: "Alabama Law Enforcement Agency", url: "https://www.alea.gov/dps/driver-license", formName: "DL-1/DL-1A", fee: 36, estimatedDays: 30 },
  { code: "ak", name: "Alaska",        agency: "Alaska DMV",        url: "https://doa.alaska.gov/dmv", formName: "Form 478", fee: 20, estimatedDays: 21 },
  { code: "az", name: "Arizona",       agency: "Arizona MVD",       url: "https://azdot.gov/mvd", formName: "Form 40-5122", fee: 25, estimatedDays: 15 },
  { code: "ar", name: "Arkansas",      agency: "Arkansas DFA",      url: "https://www.dfa.arkansas.gov/driver-services/", formName: "DL Application", fee: 40, estimatedDays: 20 },
  { code: "ca", name: "California",    agency: "California DMV",    url: "https://www.dmv.ca.gov", formName: "DL 44", fee: 45, estimatedDays: 30 },
  { code: "co", name: "Colorado",      agency: "Colorado DMV",      url: "https://dmv.colorado.gov", formName: "DR 2300", fee: 30, estimatedDays: 20 },
  { code: "ct", name: "Connecticut",   agency: "Connecticut DMV",   url: "https://portal.ct.gov/DMV", formName: "R-229", fee: 84, estimatedDays: 20 },
  { code: "de", name: "Delaware",      agency: "Delaware DMV",      url: "https://www.dmv.de.gov", formName: "DL Application", fee: 40, estimatedDays: 14 },
  { code: "dc", name: "District of Columbia", agency: "DC DMV",     url: "https://dmv.dc.gov", formName: "DL Application", fee: 47, estimatedDays: 14 },
  { code: "fl", name: "Florida",       agency: "Florida DHSMV",     url: "https://www.flhsmv.gov", formName: "HSMV 71142", fee: 48, estimatedDays: 14 },
  { code: "ga", name: "Georgia",       agency: "Georgia DDS",       url: "https://dds.georgia.gov", formName: "DL Application", fee: 32, estimatedDays: 21 },
  { code: "hi", name: "Hawaii",        agency: "Hawaii DMV",        url: "https://hidmv.ehawaii.gov", formName: "DL Application", fee: 40, estimatedDays: 21 },
  { code: "id", name: "Idaho",         agency: "Idaho DMV",         url: "https://itd.idaho.gov/dmv/", formName: "ITD 3140", fee: 30, estimatedDays: 21 },
  { code: "il", name: "Illinois",      agency: "Illinois SOS",      url: "https://www.ilsos.gov", formName: "DL Application", fee: 30, estimatedDays: 15 },
  { code: "in", name: "Indiana",       agency: "Indiana BMV",       url: "https://www.in.gov/bmv/", formName: "BMV 44116", fee: 17, estimatedDays: 14 },
  { code: "ia", name: "Iowa",          agency: "Iowa DOT",          url: "https://iowadot.gov/mvd", formName: "Form 430021", fee: 32, estimatedDays: 14 },
  { code: "ks", name: "Kansas",        agency: "Kansas DOR",        url: "https://www.ksrevenue.gov/dovindex.html", formName: "DL Application", fee: 23, estimatedDays: 14 },
  { code: "ky", name: "Kentucky",      agency: "Kentucky Driver Licensing", url: "https://drive.ky.gov", formName: "TC 94-10", fee: 43, estimatedDays: 21 },
  { code: "la", name: "Louisiana",     agency: "Louisiana OMV",     url: "https://www.expresslane.org", formName: "DPSMV 2194", fee: 32, estimatedDays: 21 },
  { code: "me", name: "Maine",         agency: "Maine BMV",         url: "https://www.maine.gov/sos/bmv/", formName: "MV 10", fee: 30, estimatedDays: 14 },
  { code: "md", name: "Maryland",      agency: "Maryland MVA",      url: "https://mva.maryland.gov", formName: "DL Application", fee: 72, estimatedDays: 20 },
  { code: "ma", name: "Massachusetts", agency: "Massachusetts RMV", url: "https://www.mass.gov/rmv", formName: "LIC100", fee: 50, estimatedDays: 14 },
  { code: "mi", name: "Michigan",      agency: "Michigan SOS",      url: "https://www.michigan.gov/sos", formName: "DL Application", fee: 25, estimatedDays: 14 },
  { code: "mn", name: "Minnesota",     agency: "Minnesota DVS",     url: "https://dps.mn.gov/divisions/dvs/", formName: "PS2002", fee: 32, estimatedDays: 21 },
  { code: "ms", name: "Mississippi",   agency: "Mississippi DPS",   url: "https://www.dps.ms.gov", formName: "DL Application", fee: 25, estimatedDays: 21 },
  { code: "mo", name: "Missouri",      agency: "Missouri DOR",      url: "https://dor.mo.gov/driver-license/", formName: "Form 4601", fee: 25, estimatedDays: 15 },
  { code: "mt", name: "Montana",       agency: "Montana MVD",       url: "https://dojmt.gov/driving/", formName: "DL Application", fee: 35, estimatedDays: 21 },
  { code: "ne", name: "Nebraska",      agency: "Nebraska DMV",      url: "https://dmv.nebraska.gov", formName: "DL Application", fee: 27, estimatedDays: 14 },
  { code: "nv", name: "Nevada",        agency: "Nevada DMV",        url: "https://dmvnv.com", formName: "DMV 002", fee: 42, estimatedDays: 14 },
  { code: "nh", name: "New Hampshire", agency: "New Hampshire DMV", url: "https://www.nh.gov/safety/divisions/dmv/", formName: "DSMV 450", fee: 50, estimatedDays: 21 },
  { code: "nj", name: "New Jersey",    agency: "New Jersey MVC",    url: "https://www.state.nj.us/mvc/", formName: "BA-208", fee: 24, estimatedDays: 20 },
  { code: "nm", name: "New Mexico",    agency: "New Mexico MVD",    url: "https://www.mvd.newmexico.gov", formName: "MVD-10110", fee: 34, estimatedDays: 21 },
  { code: "ny", name: "New York",      agency: "New York DMV",      url: "https://dmv.ny.gov", formName: "MV-44", fee: 80, estimatedDays: 14 },
  { code: "nc", name: "North Carolina",agency: "North Carolina DMV",url: "https://www.ncdot.gov/dmv/", formName: "DL-1", fee: 42, estimatedDays: 20 },
  { code: "nd", name: "North Dakota",  agency: "North Dakota DOT",  url: "https://www.dot.nd.gov/divisions/driverslicense/", formName: "SFN 2706", fee: 15, estimatedDays: 21 },
  { code: "oh", name: "Ohio",          agency: "Ohio BMV",          url: "https://bmv.ohio.gov", formName: "BMV 2420", fee: 26, estimatedDays: 10 },
  { code: "ok", name: "Oklahoma",      agency: "Oklahoma DPS",      url: "https://oklahoma.gov/service-ok/dl.html", formName: "DL Application", fee: 38, estimatedDays: 14 },
  { code: "or", name: "Oregon",        agency: "Oregon DMV",        url: "https://www.oregon.gov/odot/dmv/", formName: "Form 735-173", fee: 60, estimatedDays: 14 },
  { code: "pa", name: "Pennsylvania",  agency: "PennDOT",           url: "https://www.dmv.pa.gov", formName: "DL-180", fee: 45, estimatedDays: 15 },
  { code: "ri", name: "Rhode Island",  agency: "Rhode Island DMV",  url: "https://dmv.ri.gov", formName: "LI-1", fee: 39, estimatedDays: 14 },
  { code: "sc", name: "South Carolina",agency: "South Carolina DMV",url: "https://scdmvonline.com", formName: "DL-1A", fee: 25, estimatedDays: 21 },
  { code: "sd", name: "South Dakota",  agency: "South Dakota DPS",  url: "https://dps.sd.gov/driver-licensing", formName: "DL Application", fee: 28, estimatedDays: 14 },
  { code: "tn", name: "Tennessee",     agency: "Tennessee DOS",     url: "https://www.tn.gov/safety/driver-services.html", formName: "DL Application", fee: 28, estimatedDays: 20 },
  { code: "tx", name: "Texas",         agency: "Texas DPS",         url: "https://www.dps.texas.gov/section/driver-license", formName: "DL-14A", fee: 33, estimatedDays: 21 },
  { code: "ut", name: "Utah",          agency: "Utah DLD",          url: "https://dld.utah.gov", formName: "DL Application", fee: 52, estimatedDays: 21 },
  { code: "vt", name: "Vermont",       agency: "Vermont DMV",       url: "https://dmv.vermont.gov", formName: "VL-021", fee: 32, estimatedDays: 14 },
  { code: "va", name: "Virginia",      agency: "Virginia DMV",      url: "https://www.dmv.virginia.gov", formName: "DL 1P", fee: 32, estimatedDays: 15 },
  { code: "wa", name: "Washington",    agency: "Washington DOL",    url: "https://www.dol.wa.gov", formName: "DL Application", fee: 89, estimatedDays: 14 },
  { code: "wv", name: "West Virginia", agency: "West Virginia DMV", url: "https://transportation.wv.gov/DMV/", formName: "DMV-DS-52A", fee: 33, estimatedDays: 21 },
  { code: "wi", name: "Wisconsin",     agency: "Wisconsin DOT",     url: "https://wisconsindot.gov/Pages/dmv", formName: "MV3001", fee: 34, estimatedDays: 14 },
  { code: "wy", name: "Wyoming",       agency: "Wyoming DOT",       url: "https://www.dot.state.wy.us/driverservices", formName: "DL Application", fee: 40, estimatedDays: 21 },
];

export function getUsState(code: string): UsState | undefined {
  return US_STATES.find((s) => s.code === code.toLowerCase());
}

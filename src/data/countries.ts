export type DocumentCategory = "visa" | "permit" | "license" | "passport";

export type Country = {
  code: string;
  name: string;
  flag: string;
  supportedCategories: DocumentCategory[];
};

// Visa destinations: broad list of countries that issue visas to foreign
// travelers. Passport/license/permit support is opt-in per country.
// Code is ISO-3166-1 alpha-2, lower-cased.
export const COUNTRIES: Country[] = [
  // North America
  { code: "us", name: "United States",   flag: "🇺🇸", supportedCategories: ["visa", "permit", "license", "passport"] },
  { code: "ca", name: "Canada",          flag: "🇨🇦", supportedCategories: ["visa", "license", "passport"] },
  { code: "mx", name: "Mexico",          flag: "🇲🇽", supportedCategories: ["visa"] },

  // Schengen Area (alphabetical)
  { code: "at", name: "Austria",         flag: "🇦🇹", supportedCategories: ["visa"] },
  { code: "be", name: "Belgium",         flag: "🇧🇪", supportedCategories: ["visa"] },
  { code: "cz", name: "Czechia",         flag: "🇨🇿", supportedCategories: ["visa"] },
  { code: "dk", name: "Denmark",         flag: "🇩🇰", supportedCategories: ["visa"] },
  { code: "ee", name: "Estonia",         flag: "🇪🇪", supportedCategories: ["visa"] },
  { code: "fi", name: "Finland",         flag: "🇫🇮", supportedCategories: ["visa"] },
  { code: "fr", name: "France",          flag: "🇫🇷", supportedCategories: ["visa"] },
  { code: "de", name: "Germany",         flag: "🇩🇪", supportedCategories: ["visa"] },
  { code: "gr", name: "Greece",          flag: "🇬🇷", supportedCategories: ["visa"] },
  { code: "hu", name: "Hungary",         flag: "🇭🇺", supportedCategories: ["visa"] },
  { code: "is", name: "Iceland",         flag: "🇮🇸", supportedCategories: ["visa"] },
  { code: "it", name: "Italy",           flag: "🇮🇹", supportedCategories: ["visa"] },
  { code: "lv", name: "Latvia",          flag: "🇱🇻", supportedCategories: ["visa"] },
  { code: "lt", name: "Lithuania",       flag: "🇱🇹", supportedCategories: ["visa"] },
  { code: "lu", name: "Luxembourg",      flag: "🇱🇺", supportedCategories: ["visa"] },
  { code: "mt", name: "Malta",           flag: "🇲🇹", supportedCategories: ["visa"] },
  { code: "nl", name: "Netherlands",     flag: "🇳🇱", supportedCategories: ["visa"] },
  { code: "no", name: "Norway",          flag: "🇳🇴", supportedCategories: ["visa"] },
  { code: "pl", name: "Poland",          flag: "🇵🇱", supportedCategories: ["visa"] },
  { code: "pt", name: "Portugal",        flag: "🇵🇹", supportedCategories: ["visa"] },
  { code: "sk", name: "Slovakia",        flag: "🇸🇰", supportedCategories: ["visa"] },
  { code: "si", name: "Slovenia",        flag: "🇸🇮", supportedCategories: ["visa"] },
  { code: "es", name: "Spain",           flag: "🇪🇸", supportedCategories: ["visa"] },
  { code: "se", name: "Sweden",          flag: "🇸🇪", supportedCategories: ["visa"] },
  { code: "ch", name: "Switzerland",     flag: "🇨🇭", supportedCategories: ["visa"] },

  // Rest of Europe
  { code: "gb", name: "United Kingdom",  flag: "🇬🇧", supportedCategories: ["visa", "license", "passport"] },
  { code: "ie", name: "Ireland",         flag: "🇮🇪", supportedCategories: ["visa"] },
  { code: "ru", name: "Russia",          flag: "🇷🇺", supportedCategories: ["visa"] },
  { code: "tr", name: "Turkey",          flag: "🇹🇷", supportedCategories: ["visa"] },
  { code: "ua", name: "Ukraine",         flag: "🇺🇦", supportedCategories: ["visa"] },

  // Asia
  { code: "cn", name: "China",           flag: "🇨🇳", supportedCategories: ["visa"] },
  { code: "hk", name: "Hong Kong",       flag: "🇭🇰", supportedCategories: ["visa"] },
  { code: "jp", name: "Japan",           flag: "🇯🇵", supportedCategories: ["visa"] },
  { code: "kr", name: "South Korea",     flag: "🇰🇷", supportedCategories: ["visa"] },
  { code: "tw", name: "Taiwan",          flag: "🇹🇼", supportedCategories: ["visa"] },
  { code: "in", name: "India",           flag: "🇮🇳", supportedCategories: ["visa", "license", "passport"] },
  { code: "pk", name: "Pakistan",        flag: "🇵🇰", supportedCategories: ["visa"] },
  { code: "bd", name: "Bangladesh",      flag: "🇧🇩", supportedCategories: ["visa"] },
  { code: "lk", name: "Sri Lanka",       flag: "🇱🇰", supportedCategories: ["visa"] },
  { code: "np", name: "Nepal",           flag: "🇳🇵", supportedCategories: ["visa"] },
  { code: "th", name: "Thailand",        flag: "🇹🇭", supportedCategories: ["visa"] },
  { code: "vn", name: "Vietnam",         flag: "🇻🇳", supportedCategories: ["visa"] },
  { code: "id", name: "Indonesia",       flag: "🇮🇩", supportedCategories: ["visa"] },
  { code: "my", name: "Malaysia",        flag: "🇲🇾", supportedCategories: ["visa"] },
  { code: "sg", name: "Singapore",       flag: "🇸🇬", supportedCategories: ["visa"] },
  { code: "ph", name: "Philippines",     flag: "🇵🇭", supportedCategories: ["visa"] },
  { code: "kh", name: "Cambodia",        flag: "🇰🇭", supportedCategories: ["visa"] },

  // Middle East
  { code: "ae", name: "United Arab Emirates", flag: "🇦🇪", supportedCategories: ["visa"] },
  { code: "sa", name: "Saudi Arabia",    flag: "🇸🇦", supportedCategories: ["visa"] },
  { code: "qa", name: "Qatar",           flag: "🇶🇦", supportedCategories: ["visa"] },
  { code: "il", name: "Israel",          flag: "🇮🇱", supportedCategories: ["visa"] },
  { code: "jo", name: "Jordan",          flag: "🇯🇴", supportedCategories: ["visa"] },

  // Oceania
  { code: "au", name: "Australia",       flag: "🇦🇺", supportedCategories: ["visa", "license", "passport"] },
  { code: "nz", name: "New Zealand",     flag: "🇳🇿", supportedCategories: ["visa"] },

  // Africa
  { code: "eg", name: "Egypt",           flag: "🇪🇬", supportedCategories: ["visa"] },
  { code: "ma", name: "Morocco",         flag: "🇲🇦", supportedCategories: ["visa"] },
  { code: "ke", name: "Kenya",           flag: "🇰🇪", supportedCategories: ["visa"] },
  { code: "tz", name: "Tanzania",        flag: "🇹🇿", supportedCategories: ["visa"] },
  { code: "za", name: "South Africa",    flag: "🇿🇦", supportedCategories: ["visa"] },

  // Central & South America
  { code: "br", name: "Brazil",          flag: "🇧🇷", supportedCategories: ["visa"] },
  { code: "ar", name: "Argentina",       flag: "🇦🇷", supportedCategories: ["visa"] },
  { code: "cl", name: "Chile",           flag: "🇨🇱", supportedCategories: ["visa"] },
  { code: "co", name: "Colombia",        flag: "🇨🇴", supportedCategories: ["visa"] },
  { code: "pe", name: "Peru",            flag: "🇵🇪", supportedCategories: ["visa"] },
  { code: "cu", name: "Cuba",            flag: "🇨🇺", supportedCategories: ["visa"] },
];

export function getCountriesForCategory(category: DocumentCategory): Country[] {
  return COUNTRIES.filter((c) => c.supportedCategories.includes(category));
}

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code.toLowerCase());
}

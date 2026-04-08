export type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  reminderDays?: number; // days before expiry to remind
  howToGet?: string;
};

export type DocumentChecklist = {
  id: string;
  title: string;
  category: "visa" | "permit" | "license" | "passport";
  country?: string;
  estimatedDays: number;
  items: ChecklistItem[];
};

export const CHECKLISTS: DocumentChecklist[] = [
  {
    id: "france-visa-tourist",
    title: "France Tourist Visa (Schengen)",
    category: "visa",
    country: "France",
    estimatedDays: 15,
    items: [
      { id: "passport", label: "Valid Passport", required: true,
        description: "Must be valid for 3+ months beyond your stay",
        reminderDays: 90, howToGet: "Apply at your local passport office" },
      { id: "photos", label: "Passport Photos (2x)", required: true,
        description: "35x45mm, white background, taken within last 6 months" },
      { id: "application-form", label: "Schengen Visa Application Form", required: true,
        description: "Completed and signed", howToGet: "https://france-visas.gouv.fr" },
      { id: "travel-insurance", label: "Travel Insurance", required: true,
        description: "Minimum €30,000 coverage, valid for all Schengen countries" },
      { id: "flight-itinerary", label: "Round-trip Flight Itinerary", required: true },
      { id: "hotel-booking", label: "Hotel / Accommodation Proof", required: true },
      { id: "bank-statements", label: "Bank Statements (last 3 months)", required: true,
        description: "Show sufficient funds: ~€65/day in France" },
      { id: "employment-letter", label: "Employment Letter / Leave Approval", required: true },
      { id: "cover-letter", label: "Cover Letter", required: false,
        description: "Explaining purpose of visit" },
    ]
  },
  {
    id: "us-business-permit",
    title: "US City Business Permit (General)",
    category: "permit",
    estimatedDays: 30,
    items: [
      { id: "business-name", label: "BusinName Registration (DBA)", required: true },
      { id: "ein", label: "EIN from IRS", required: true,
        howToGet: "Apply free at irs.gov/businesses/small" },
      { id: "local-license", label: "Local Business License", required: true,
        howToGet: "Apply at your city hall or city website" },
      { id: "zoning-permit", label: "Zoning Compliance Permit", required: true },
      { id: "sellers-permit", label: "Seller's Permit (if selling goods)", required: false },
      { id: "health-permit", label: "Health Department Permit (food biz)", required: false },
      { id: "signage-permit", label: "Signage Permit", required: false },
    ]
  }
];

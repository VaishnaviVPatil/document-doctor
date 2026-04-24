import { PASSPORT_US_RENEWAL } from "./checklists/passport-us-renewal";
import { getUsState } from "./states-us";
import { buildUsLicenseChecklist } from "@/lib/buildUsLicenseChecklist";
import {
  buildGenericVisaChecklist,
  type VisaClass,
} from "@/lib/buildGenericVisaChecklist";

import { VISA_FR_STUDENT } from "./checklists/visa/fr-student";
import { VISA_FR_WORK } from "./checklists/visa/fr-work";
import { VISA_FR_FAMILY } from "./checklists/visa/fr-family";

import { VISA_US_B1 } from "./checklists/visa/us-b1";
import { VISA_US_B2 } from "./checklists/visa/us-b2";
import { VISA_US_F1 } from "./checklists/visa/us-f1";
import { VISA_US_J1 } from "./checklists/visa/us-j1";
import { VISA_US_H1B } from "./checklists/visa/us-h1b";

import { VISA_IN_E_TOURIST } from "./checklists/visa/in-e-tourist";
import { VISA_IN_E_BUSINESS } from "./checklists/visa/in-e-business";
import { VISA_IN_E_MEDICAL } from "./checklists/visa/in-e-medical";
import { VISA_IN_TOURIST } from "./checklists/visa/in-tourist";
import { VISA_IN_STUDENT } from "./checklists/visa/in-student";

export type FileValidationRules = {
  /** Min file size in bytes. Some portals (e.g. India e-visa) require ≥10 KB. */
  minBytes?: number;
  /** Max file size in bytes. Rejected client-side before upload. */
  maxBytes?: number;
  /** Allowed MIME types (supports exact or wildcard like "image/*"). */
  mimeTypes?: readonly string[];
  /** Image-only rules; ignored for non-image files. */
  image?: {
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    /** width / height. Tolerance ±2%. */
    aspectRatio?: number;
    /** Human-readable description for error messages, e.g. "2x2 in (600x600 px)". */
    description?: string;
  };
};

export type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  uploadable?: boolean;
  acceptedMimeTypes?: string[];
  validationHints?: string[];
  officialSourceUrl?: string;
  reminderDays?: number;
  howToGet?: string;
  /** Days before travelDate this item should be ready. */
  dueOffsetDays?: number;
  /** Client-side validation rules applied before the file is sent to Claude. */
  validation?: FileValidationRules;
};

export type ChecklistSection = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

export type DocumentChecklist = {
  id: string;
  title: string;
  category: "visa" | "permit" | "license" | "passport";
  country?: string;
  estimatedDays: number;
  /** Newer rich format. */
  sections?: ChecklistSection[];
  /** Legacy flat list (still used for older entries). */
  items?: ChecklistItem[];
};

const FRANCE_VISAS_URL = "https://france-visas.gouv.fr";
const VFS_URL = "https://visa.vfsglobal.com/usa/en/fra";

export const CHECKLISTS: DocumentChecklist[] = [
  PASSPORT_US_RENEWAL,
  VISA_FR_STUDENT,
  VISA_FR_WORK,
  VISA_FR_FAMILY,
  VISA_US_B1,
  VISA_US_B2,
  VISA_US_F1,
  VISA_US_J1,
  VISA_US_H1B,
  VISA_IN_E_TOURIST,
  VISA_IN_E_BUSINESS,
  VISA_IN_E_MEDICAL,
  VISA_IN_TOURIST,
  VISA_IN_STUDENT,
  {
    id: "france-paris-tourist",
    title: "France Tourist Visa (Schengen) — Paris",
    category: "visa",
    country: "France",
    estimatedDays: 15,
    sections: [
      {
        id: "application-basics",
        title: "Application Basics",
        items: [
          {
            id: "schengen-form",
            label: "Completed Schengen visa application form",
            description: "Filled and signed via france-visas.gouv.fr",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            officialSourceUrl: FRANCE_VISAS_URL,
            validationHints: [
              "Form is the official France-Visas Schengen short-stay form",
              "All required fields completed",
              "Signed and dated",
            ],
            howToGet: FRANCE_VISAS_URL,
            dueOffsetDays: 30,
          },
          {
            id: "vfs-appointment",
            label: "VFS Global / consulate appointment confirmation",
            description: "Booking confirmation email or PDF",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            officialSourceUrl: VFS_URL,
            validationHints: [
              "Appointment is at a VFS France center or French consulate",
              "Date is before the planned travel date",
            ],
            dueOffsetDays: 21,
          },
          {
            id: "visa-fee",
            label: "Visa fee payment proof (~€80)",
            description: "Receipt of paid visa fee",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: [
              "Receipt shows Schengen visa fee paid",
              "Amount is approximately €80",
            ],
            dueOffsetDays: 21,
          },
        ],
      },
      {
        id: "passport-photos",
        title: "Passport & Photos",
        items: [
          {
            id: "passport",
            label: "Valid Passport",
            description:
              "Issued within last 10 years, valid 3+ months after planned return",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            officialSourceUrl: FRANCE_VISAS_URL,
            validationHints: [
              "Passport bio page is clearly visible",
              "Issue date is within the last 10 years",
              "Expiry date is at least 3 months after the planned return date",
              "Has at least 2 blank visa pages",
            ],
            reminderDays: 90,
            dueOffsetDays: 45,
          },
          {
            id: "passport-bio-copy",
            label: "Passport bio page copy",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: ["Clear photocopy of passport biographic page"],
            dueOffsetDays: 30,
          },
          {
            id: "previous-visas",
            label: "Copies of previous visas (if any)",
            required: false,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            dueOffsetDays: 30,
          },
          {
            id: "photos",
            label: "2 recent passport photos (Schengen format)",
            description: "35x45mm, white background, taken within last 6 months",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["image/jpeg", "image/png"],
            validationHints: [
              "Photo is 35x45mm Schengen biometric format",
              "Plain white background",
              "Taken within the last 6 months",
              "Face is centered, neutral expression",
            ],
            validation: {
              maxBytes: 5 * 1024 * 1024,
              mimeTypes: ["image/jpeg", "image/png"],
              image: {
                minWidth: 413,
                minHeight: 531,
                aspectRatio: 35 / 45,
                description: "35 × 45 mm biometric photo (Schengen format)",
              },
            },
            dueOffsetDays: 30,
          },
        ],
      },
      {
        id: "us-status",
        title: "U.S. Immigration Status",
        items: [
          {
            id: "f1-visa",
            label: "Valid F-1 visa stamp",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: [
              "F-1 visa stamp is visible",
              "Not expired as of travel return date",
            ],
            dueOffsetDays: 30,
          },
          {
            id: "i20",
            label: "I-20 with travel signature",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: [
              "I-20 includes a travel signature dated within the last 12 months (6 for OPT)",
              "Student name and SEVIS ID are present",
            ],
            dueOffsetDays: 30,
          },
          {
            id: "ead",
            label: "EAD card (STEM OPT)",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: [
              "EAD card valid through travel return date",
              "Category code matches OPT/STEM OPT",
            ],
            dueOffsetDays: 30,
          },
          {
            id: "i94",
            label: "Latest I-94 record",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: ["Most recent I-94 from cbp.gov/i94"],
            dueOffsetDays: 14,
          },
        ],
      },
      {
        id: "travel-itinerary",
        title: "Travel Itinerary",
        items: [
          {
            id: "flight-itinerary",
            label: "Round-trip flight reservation",
            description: "Reservation only — does not need to be paid",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: [
              "Round-trip itinerary",
              "Arrival and departure dates match the stated travel window",
              "Destination includes Paris (CDG / ORY / BVA)",
            ],
            dueOffsetDays: 21,
          },
          {
            id: "travel-plan",
            label: "Detailed travel plan",
            description: "Day-by-day plan including places in Paris",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            dueOffsetDays: 21,
          },
        ],
      },
      {
        id: "accommodation",
        title: "Accommodation Proof",
        items: [
          {
            id: "hotel-or-invite",
            label: "Hotel bookings OR invitation letter",
            description: "Covers the entire travel window",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: [
              "Booking or invitation covers all nights of the trip",
              "Address is in France",
            ],
            dueOffsetDays: 21,
          },
        ],
      },
      {
        id: "financial-proof",
        title: "Financial Proof",
        items: [
          {
            id: "bank-statements",
            label: "Last 3–6 months bank statements",
            description: "Suggested balance: $3,000–$6,000 minimum",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: [
              "Statements cover at least the last 3 months",
              "Account holder name matches the applicant",
              "Closing balance is sufficient for the trip",
            ],
            dueOffsetDays: 14,
          },
          {
            id: "pay-stubs",
            label: "Recent pay stubs",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: ["At least the last 3 pay stubs"],
            dueOffsetDays: 14,
          },
        ],
      },
      {
        id: "employment",
        title: "Employment Proof (STEM OPT)",
        items: [
          {
            id: "employment-letter",
            label: "Employment / offer letter",
            description: "Confirms job continues after travel",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: [
              "On company letterhead",
              "States position, salary, and start date",
              "Confirms employment continues after the planned return",
            ],
            dueOffsetDays: 14,
          },
        ],
      },
      {
        id: "insurance",
        title: "Travel Insurance (Mandatory)",
        items: [
          {
            id: "travel-insurance",
            label: "Schengen travel insurance",
            description:
              "€30,000 minimum coverage, all Schengen countries, medical + repatriation",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: [
              "Coverage amount is at least €30,000",
              "Valid throughout the entire Schengen area",
              "Includes medical emergencies and repatriation of remains",
              "Policy dates cover the full travel window",
            ],
            dueOffsetDays: 14,
          },
        ],
      },
      {
        id: "cover-letter",
        title: "Cover Letter",
        items: [
          {
            id: "cover-letter",
            label: "Cover letter",
            description:
              "Explains purpose of visit, dates, who is funding, intent to return to U.S.",
            required: true,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            validationHints: [
              "States purpose of visit (tourism)",
              "States travel dates",
              "States who is funding the trip",
              "States intent to return to the U.S.",
            ],
            dueOffsetDays: 14,
          },
        ],
      },
      {
        id: "supporting",
        title: "Additional Supporting Docs",
        items: [
          {
            id: "resume",
            label: "Resume",
            required: false,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
            dueOffsetDays: 14,
          },
          {
            id: "linkedin",
            label: "LinkedIn profile printout",
            required: false,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            dueOffsetDays: 14,
          },
          {
            id: "us-ties",
            label: "Proof of ties to U.S.",
            description: "Lease, utility bills, etc.",
            required: false,
            uploadable: true,
            acceptedMimeTypes: ["application/pdf", "image/*"],
            validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
            dueOffsetDays: 14,
          },
        ],
      },
    ],
  },
  {
    id: "us-business-permit",
    title: "US City Business Permit (General)",
    category: "permit",
    estimatedDays: 30,
    items: [
      { id: "business-name", label: "Business Name Registration (DBA)", required: true },
      { id: "ein", label: "EIN from IRS", required: true,
        howToGet: "Apply free at irs.gov/businesses/small" },
      { id: "local-license", label: "Local Business License", required: true,
        howToGet: "Apply at your city hall or city website" },
      { id: "zoning-permit", label: "Zoning Compliance Permit", required: true },
      { id: "sellers-permit", label: "Seller's Permit (if selling goods)", required: false },
      { id: "health-permit", label: "Health Department Permit (food biz)", required: false },
      { id: "signage-permit", label: "Signage Permit", required: false },
    ],
  },
];

export function getChecklist(id: string): DocumentChecklist | undefined {
  return CHECKLISTS.find((c) => c.id === id);
}

export function getAllItems(checklist: DocumentChecklist): ChecklistItem[] {
  if (checklist.sections) return checklist.sections.flatMap((s) => s.items);
  return checklist.items ?? [];
}

/**
 * Resolves a checklist by id, supporting both statically-registered entries
 * (CHECKLISTS) and dynamically-built ones (e.g. per-US-state driver's licenses).
 */
export function resolveChecklist(id: string): DocumentChecklist | undefined {
  const hit = getChecklist(id);
  if (hit) return hit;

  // Dynamically build US license checklists: "license-us-<state>-<variant>"
  const m = /^license-us-([a-z]{2})-(new|renewal)$/.exec(id);
  if (m) {
    const state = getUsState(m[1]);
    if (!state) return undefined;
    return buildUsLicenseChecklist(state, m[2] as "new" | "renewal");
  }

  // Dynamically build generic visa checklists: "visa-<cc>-<typeId>".
  // The registry entry provides the human title and visa class; if no entry
  // exists we fall back to a generic "other" visa with a neutral title.
  const v = /^visa-([a-z]{2})-(.+)$/.exec(id);
  if (v) {
    const countryCode = v[1];
    const typeId = v[2];
    // Lazy-load to avoid a module cycle with documentTypes.ts.
    const mod = require("./documentTypes") as typeof import("./documentTypes");
    const entry = mod.getDocumentType("visa", countryCode, typeId);
    const visaClass: VisaClass = entry?.visaClass ?? "other";
    const title = entry?.title ?? typeId;
    return buildGenericVisaChecklist(countryCode, typeId, { title, visaClass });
  }

  return undefined;
}

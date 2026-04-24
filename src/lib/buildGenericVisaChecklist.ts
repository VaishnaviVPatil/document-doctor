import type { ChecklistItem, DocumentChecklist, FileValidationRules } from "@/data/checklists";
import { getVisaCountryMeta, type VisaCountryMeta } from "@/data/visa-country-meta";

export type VisaClass =
  | "tourist"
  | "business"
  | "student"
  | "work"
  | "transit"
  | "family"
  | "other";

const DOC_10MB: FileValidationRules = {
  maxBytes: 10 * 1024 * 1024,
  mimeTypes: ["application/pdf", "image/*"],
};

const DOC_PDF_10MB: FileValidationRules = {
  maxBytes: 10 * 1024 * 1024,
  mimeTypes: ["application/pdf"],
};

const DOC_5MB: FileValidationRules = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ["application/pdf", "image/*"],
};

function core(meta: VisaCountryMeta): ChecklistItem[] {
  return [
    {
      id: "application-form",
      label: "Completed visa application form",
      description: `Official application form for ${meta.countryName}.`,
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: meta.embassyUrl,
      validationHints: [
        "Form is the current official version",
        "All required fields completed",
        "Signed and dated",
      ],
      validation: DOC_PDF_10MB,
    },
    {
      id: "passport",
      label: "Passport valid 6+ months beyond intended stay",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: [
        "Valid at least 6 months from planned arrival date",
        "At least two blank visa pages",
      ],
      validation: DOC_10MB,
    },
    {
      id: "photo",
      label: `Biometric visa photo (${meta.photoSpec})`,
      description: "Recent colour photo on plain white background.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: [...(meta.photo.mimeTypes ?? ["image/jpeg", "image/png"])],
      officialSourceUrl: meta.embassyUrl,
      validationHints: [
        `Photo follows ${meta.countryName}'s biometric spec: ${meta.photoSpec}`,
        "Taken within the last 6 months",
        "Plain white/off-white background",
        "Neutral expression, eyes open, no glasses",
      ],
      validation: meta.photo,
    },
    {
      id: "fee",
      label: meta.baseFeeUsd
        ? `Visa fee (~$${meta.baseFeeUsd} USD)`
        : "Visa fee payment",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      officialSourceUrl: meta.embassyUrl,
      validationHints: ["Receipt matches the applicant's name", "Shows the visa fee paid"],
      validation: DOC_10MB,
    },
    {
      id: "appointment",
      label: "Consulate / visa centre appointment confirmation",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      officialSourceUrl: meta.embassyUrl,
      validation: DOC_10MB,
    },
  ];
}

function itemsForClass(visaClass: VisaClass, meta: VisaCountryMeta): ChecklistItem[] {
  switch (visaClass) {
    case "tourist":
      return [
        {
          id: "travel-itinerary",
          label: "Travel itinerary (flights in and out)",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validationHints: ["Round-trip itinerary", "Dates match the planned stay"],
          validation: DOC_10MB,
        },
        {
          id: "accommodation",
          label: `Accommodation booking or invitation in ${meta.countryName}`,
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validationHints: ["Covers the full stay", `Address is in ${meta.countryName}`],
          validation: DOC_10MB,
        },
        {
          id: "financial-proof",
          label: "Bank statements (last 3 months)",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validationHints: [
            "Covers at least the last 3 months",
            "Account holder matches applicant",
            "Balance sufficient to cover the trip",
          ],
          validation: DOC_10MB,
        },
        {
          id: "insurance",
          label: "Travel / medical insurance",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validationHints: [
            "Valid for the full stay",
            "Includes medical emergencies and repatriation",
          ],
          validation: DOC_10MB,
        },
      ];

    case "business":
      return [
        {
          id: "invitation-letter",
          label: `Invitation letter from host company in ${meta.countryName}`,
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validationHints: [
            "On host company letterhead",
            "States purpose, dates, and who covers expenses",
            "Signed by authorised company representative",
          ],
          validation: DOC_10MB,
        },
        {
          id: "employer-letter",
          label: "Letter from your employer",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validationHints: ["On letterhead", "Confirms position and approved business trip"],
          validation: DOC_10MB,
        },
        {
          id: "business-card",
          label: "Business card or proof of business role",
          required: false,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_5MB,
        },
        {
          id: "financial-proof",
          label: "Financial proof (company or personal)",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
        {
          id: "return-ticket",
          label: "Return / onward flight booking",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
      ];

    case "student":
      return [
        {
          id: "admission-letter",
          label: `Letter of admission from ${meta.countryName} institution`,
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf"],
          validationHints: [
            "From a recognised/accredited institution",
            "Program duration and start date stated",
          ],
          validation: DOC_PDF_10MB,
        },
        {
          id: "tuition-proof",
          label: "Proof of tuition payment or scholarship",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
        {
          id: "academic-records",
          label: "Academic transcripts and diplomas",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
        {
          id: "financial-proof",
          label: "Financial proof (first year's living costs)",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
        {
          id: "accommodation",
          label: "Accommodation in host country",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
        {
          id: "insurance",
          label: "Health / student insurance",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
      ];

    case "work":
      return [
        {
          id: "employment-contract",
          label: `Signed employment contract with ${meta.countryName} employer`,
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validationHints: ["Position, salary and start date stated", "Signed by both parties"],
          validation: DOC_10MB,
        },
        {
          id: "work-permit",
          label: "Work permit / authorization (if required)",
          description: "Many countries require pre-approval before issuing the visa.",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf"],
          validation: DOC_PDF_10MB,
        },
        {
          id: "qualifications",
          label: "Diplomas and qualification certificates",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
        {
          id: "cv",
          label: "Curriculum vitae",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf"],
          validation: { maxBytes: 5 * 1024 * 1024, mimeTypes: ["application/pdf"] },
        },
        {
          id: "employer-letter",
          label: "Sponsor / employer support letter",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
      ];

    case "transit":
      return [
        {
          id: "onward-ticket",
          label: "Confirmed ticket to the final destination",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
        {
          id: "destination-visa",
          label: "Visa for the final destination country (if required)",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
      ];

    case "family":
      return [
        {
          id: "relationship-proof",
          label: "Proof of family relationship",
          description: "Marriage certificate, birth certificate, or equivalent civil document.",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validationHints: [
            "Certified copy or apostilled original",
            "Translated if not in an accepted language",
          ],
          validation: DOC_10MB,
        },
        {
          id: "host-id",
          label: `Host's ID / residency in ${meta.countryName}`,
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
        {
          id: "host-financial",
          label: "Host's financial support / affidavit",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
        {
          id: "accommodation",
          label: "Accommodation details at host's address",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
      ];

    case "other":
    default:
      return [
        {
          id: "supporting-docs",
          label: "Supporting documents for the visa category",
          description:
            "Upload any category-specific documents requested by the embassy (invitation letters, programme details, contracts, etc.).",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
        {
          id: "financial-proof",
          label: "Financial proof",
          required: true,
          uploadable: true,
          acceptedMimeTypes: ["application/pdf", "image/*"],
          validation: DOC_10MB,
        },
      ];
  }
}

const DAYS_BY_CLASS: Record<VisaClass, number> = {
  tourist: 15,
  business: 15,
  student: 30,
  work: 45,
  transit: 10,
  family: 30,
  other: 21,
};

export function buildGenericVisaChecklist(
  countryCode: string,
  typeId: string,
  opts: { title: string; visaClass: VisaClass }
): DocumentChecklist {
  const meta = getVisaCountryMeta(countryCode);
  return {
    id: `visa-${countryCode.toLowerCase()}-${typeId}`,
    title: `${meta.countryName} — ${opts.title}`,
    category: "visa",
    country: meta.countryName,
    estimatedDays: DAYS_BY_CLASS[opts.visaClass],
    items: [...core(meta), ...itemsForClass(opts.visaClass, meta)],
  };
}

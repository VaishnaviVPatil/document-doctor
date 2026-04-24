import type { DocumentChecklist } from "../../checklists";

const STATE_TRAVEL = "https://travel.state.gov";
const CEAC = "https://ceac.state.gov/genniv/";
const PHOTO_URL = "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/photos.html";

// US visa photo: 2×2 in, 600×600 to 1200×1200 px, square, jpeg, white bg.
const US_VISA_PHOTO = {
  maxBytes: 240 * 1024, // DS-160 upload limit: 240 KB.
  mimeTypes: ["image/jpeg"],
  image: {
    minWidth: 600,
    minHeight: 600,
    maxWidth: 1200,
    maxHeight: 1200,
    aspectRatio: 1,
    description: "2×2 in (600×600 to 1200×1200 px, square), JPEG ≤ 240 KB",
  },
} as const;

export const VISA_US_B1: DocumentChecklist = {
  id: "visa-us-b1",
  title: "US B-1 Business Visitor Visa",
  category: "visa",
  country: "United States",
  estimatedDays: 21,
  items: [
    {
      id: "ds-160",
      label: "DS-160 confirmation page",
      description: "Online non-immigrant visa application (barcoded confirmation).",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: CEAC,
      validationHints: [
        "DS-160 confirmation page with barcode (AA00XXXXXX)",
        "Applicant name, photo and confirmation number visible",
      ],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "photo",
      label: "Digital visa photo (2×2 in square)",
      description: "Uploaded during DS-160 and brought as a printed copy.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["image/jpeg"],
      officialSourceUrl: PHOTO_URL,
      validationHints: [
        "Exactly square, 2×2 inches",
        "Plain white or off-white background",
        "Taken within 6 months",
        "File size under 240 KB per DS-160 requirement",
      ],
      validation: US_VISA_PHOTO,
    },
    {
      id: "passport",
      label: "Passport valid 6+ months beyond stay",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Valid 6+ months beyond intended US stay", "One blank page"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "mrv-fee",
      label: "MRV visa application fee receipt ($185)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Receipt shows $185 MRV fee paid", "Applicant name matches DS-160"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "appointment",
      label: "Visa interview appointment confirmation",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      officialSourceUrl: "https://www.ustraveldocs.com",
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "invitation",
      label: "Invitation letter from US company",
      description: "Purpose of trip, dates, and who will cover expenses.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: [
        "On company letterhead",
        "States dates and business purpose (meetings/conferences)",
        "Signed by an authorized US contact",
      ],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "employer-letter",
      label: "Letter from your employer",
      description: "Confirms employment and supports the business trip.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["On letterhead, states position, salary, trip dates, and return date"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "financial-proof",
      label: "Financial proof (bank statements / pay stubs)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Last 3 months of statements", "Sufficient balance for the trip"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "ties-home",
      label: "Proof of ties to home country",
      description: "Property deeds, family documents, return-flight ticket, etc.",
      required: false,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      officialSourceUrl: STATE_TRAVEL,
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
  ],
};

import type { DocumentChecklist } from "../../checklists";

const E_VISA_PORTAL = "https://indianvisaonline.gov.in/evisa/tvoa.html";

// India e-Visa photo: JPEG, square, 350×350 px minimum, 10 KB – 1 MB, white bg.
const IN_EVISA_PHOTO = {
  minBytes: 10 * 1024,
  maxBytes: 1 * 1024 * 1024,
  mimeTypes: ["image/jpeg"],
  image: {
    minWidth: 350,
    minHeight: 350,
    aspectRatio: 1,
    description: "Square, min 350×350 px, JPEG 10 KB – 1 MB, white background",
  },
} as const;

// Passport bio-page scan for e-visa: PDF, 10 KB – 300 KB.
const IN_EVISA_PASSPORT_SCAN = {
  minBytes: 10 * 1024,
  maxBytes: 300 * 1024,
  mimeTypes: ["application/pdf"],
} as const;

export const VISA_IN_E_TOURIST: DocumentChecklist = {
  id: "visa-in-e-tourist",
  title: "India e-Tourist Visa",
  category: "visa",
  country: "India",
  estimatedDays: 4,
  items: [
    {
      id: "application",
      label: "Complete e-Visa application on indianvisaonline.gov.in",
      description: "Online form with personal, passport, and travel details.",
      required: true,
      uploadable: false,
      officialSourceUrl: E_VISA_PORTAL,
    },
    {
      id: "passport-scan",
      label: "Passport bio-page scan (PDF, 10 KB – 300 KB)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      validationHints: [
        "Clear scan of the passport biographic page",
        "Valid for at least 6 months from planned arrival",
        "Two blank pages available",
      ],
      validation: IN_EVISA_PASSPORT_SCAN,
    },
    {
      id: "photo",
      label: "Digital photo (JPEG, square, 350×350 px min, 10 KB – 1 MB)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["image/jpeg"],
      officialSourceUrl: E_VISA_PORTAL,
      validationHints: [
        "Plain white background",
        "Full face centered, neutral expression",
        "Taken within the last 6 months",
      ],
      validation: IN_EVISA_PHOTO,
    },
    {
      id: "fee",
      label: "e-Visa fee payment (varies by nationality, ~$25 to $100)",
      description: "Paid online during the application.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "return-ticket",
      label: "Proof of return or onward travel",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Shows exit from India within the e-visa validity"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "accommodation",
      label: "Proof of accommodation in India",
      description: "Hotel booking, invitation letter, or host address.",
      required: false,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "financial-proof",
      label: "Financial means (bank statements)",
      required: false,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
  ],
};

import type { DocumentChecklist } from "../../checklists";

const E_VISA_PORTAL = "https://indianvisaonline.gov.in/evisa/tvoa.html";

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

const IN_EVISA_PASSPORT_SCAN = {
  minBytes: 10 * 1024,
  maxBytes: 300 * 1024,
  mimeTypes: ["application/pdf"],
} as const;

export const VISA_IN_E_BUSINESS: DocumentChecklist = {
  id: "visa-in-e-business",
  title: "India e-Business Visa",
  category: "visa",
  country: "India",
  estimatedDays: 4,
  items: [
    {
      id: "application",
      label: "Complete e-Business Visa application",
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
      validation: IN_EVISA_PASSPORT_SCAN,
    },
    {
      id: "photo",
      label: "Digital photo (JPEG, square, 350×350 px min, 10 KB – 1 MB)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["image/jpeg"],
      validation: IN_EVISA_PHOTO,
    },
    {
      id: "business-card",
      label: "Business card of applicant",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 5 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "invitation-letter",
      label: "Invitation letter from Indian host company",
      description: "On letterhead, stating purpose and duration of visit.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: [
        "On Indian company letterhead",
        "States purpose (meetings, trade, conferences)",
        "Duration within e-Business visa limits",
      ],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "return-ticket",
      label: "Proof of return or onward travel",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "financial-proof",
      label: "Financial proof (bank statements)",
      required: false,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    { id: "fee", label: "e-Business visa fee (~$80 to $100)", required: true, uploadable: false, officialSourceUrl: E_VISA_PORTAL },
  ],
};

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

export const VISA_IN_E_MEDICAL: DocumentChecklist = {
  id: "visa-in-e-medical",
  title: "India e-Medical Visa",
  category: "visa",
  country: "India",
  estimatedDays: 4,
  items: [
    {
      id: "application",
      label: "Complete e-Medical Visa application",
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
      id: "hospital-letter",
      label: "Letter from recognised Indian hospital",
      description: "On letterhead, confirming treatment and duration.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: [
        "From a hospital recognised by the Indian government",
        "States medical condition, proposed treatment, and duration",
        "Signed by a medical officer",
      ],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "home-medical-report",
      label: "Medical reports from home country",
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
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "financial-proof",
      label: "Financial proof (bank statements)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    { id: "fee", label: "e-Medical visa fee (~$80)", required: true, uploadable: false, officialSourceUrl: E_VISA_PORTAL },
  ],
};

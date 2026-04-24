import type { DocumentChecklist } from "../../checklists";

const CEAC = "https://ceac.state.gov/genniv/";
const SEVIS = "https://www.fmjfee.com";
const J1_PROGRAM = "https://j1visa.state.gov";

const US_VISA_PHOTO = {
  maxBytes: 240 * 1024,
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

export const VISA_US_J1: DocumentChecklist = {
  id: "visa-us-j1",
  title: "US J-1 Exchange Visitor Visa",
  category: "visa",
  country: "United States",
  estimatedDays: 30,
  items: [
    {
      id: "ds-2019",
      label: "Form DS-2019 from sponsor program",
      description: "Certificate of eligibility for exchange visitor status.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: J1_PROGRAM,
      validationHints: [
        "Signed by the Responsible Officer (RO) and the exchange visitor",
        "SEVIS ID visible (starts with 'N')",
        "Program category matches applicant (e.g. Research Scholar, Intern)",
      ],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "sevis-fee",
      label: "I-901 SEVIS fee receipt ($220)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      officialSourceUrl: SEVIS,
      validationHints: ["Receipt matches DS-2019 SEVIS ID"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "ds-160",
      label: "DS-160 confirmation page",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: CEAC,
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "photo",
      label: "Digital visa photo (2×2 in square)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["image/jpeg"],
      validation: US_VISA_PHOTO,
    },
    {
      id: "passport",
      label: "Passport valid 6+ months beyond stay",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "mrv-fee",
      label: "MRV visa fee receipt ($185)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "appointment",
      label: "Visa interview appointment confirmation",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "invitation",
      label: "Invitation / offer letter from US host institution",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "financial-proof",
      label: "Financial proof and stipend/scholarship details",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "cv",
      label: "CV / resume and academic credentials",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      validation: { maxBytes: 5 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "insurance",
      label: "Health insurance meeting J-1 minimums",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: [
        "Medical benefits ≥ $100,000 per accident",
        "Deductible ≤ $500 per accident/illness",
        "Repatriation of remains ≥ $25,000",
      ],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
  ],
};

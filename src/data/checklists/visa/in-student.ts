import type { DocumentChecklist } from "../../checklists";

const MEA_VISA = "https://www.mea.gov.in";
const INDIAN_VISA_CENTER = "https://www.indianvisaonline.gov.in";

const IN_REGULAR_PHOTO = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png"],
  image: {
    minWidth: 600,
    minHeight: 600,
    aspectRatio: 1,
    description: "2×2 inch square (600×600 px min), white background",
  },
} as const;

export const VISA_IN_STUDENT: DocumentChecklist = {
  id: "visa-in-student",
  title: "India Student Visa",
  category: "visa",
  country: "India",
  estimatedDays: 21,
  items: [
    {
      id: "online-application",
      label: "Completed online visa application (printed)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: INDIAN_VISA_CENTER,
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "admission-letter",
      label: "Letter of admission from recognised Indian institution",
      description: "University, college, or approved educational institution.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      validationHints: [
        "From a UGC/AICTE-recognised or equivalent institution",
        "Program duration specified",
      ],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "financial-proof",
      label: "Proof of financial support",
      description: "Bank statements or scholarship award covering tuition and living costs.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Covers first year of study", "Applicant or sponsor name visible"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "passport",
      label: "Passport valid 6+ months",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "photos",
      label: "Two 2×2 inch color photos",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["image/jpeg", "image/png"],
      validation: IN_REGULAR_PHOTO,
    },
    {
      id: "academic-records",
      label: "Academic transcripts and diplomas",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "accommodation",
      label: "Proof of accommodation in India",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    { id: "fee", label: "Visa fee", required: true, uploadable: false, officialSourceUrl: MEA_VISA },
  ],
};

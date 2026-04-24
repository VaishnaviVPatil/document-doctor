import type { DocumentChecklist } from "../../checklists";

const CAMPUS_FR = "https://www.campusfrance.org";
const FRANCE_VISAS = "https://france-visas.gouv.fr";

// Schengen biometric photo: 35×45 mm. At 300 dpi that's ~413×531 px.
// France-Visas accepts 35×45 mm with aspect ratio ~0.778.
const SCHENGEN_PHOTO = {
  maxBytes: 5 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png"],
  image: {
    minWidth: 413,
    minHeight: 531,
    aspectRatio: 35 / 45,
    description: "35 × 45 mm biometric photo (Schengen format)",
  },
} as const;

export const VISA_FR_STUDENT: DocumentChecklist = {
  id: "visa-fr-student",
  title: "France Long-Stay Student Visa (VLS-TS étudiant)",
  category: "visa",
  country: "France",
  estimatedDays: 30,
  items: [
    {
      id: "long-stay-form",
      label: "Completed long-stay visa application (CERFA 14571*05)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: FRANCE_VISAS,
      validationHints: ["Form is the long-stay (type D) application", "Signed and dated"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "campus-france",
      label: "Campus France acceptance / 'Études en France' certificate",
      description: "Required for most countries via the Études en France portal.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: CAMPUS_FR,
      validationHints: ["Candidate's Campus France file ID visible", "Interview completed"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "admission-letter",
      label: "Letter of admission from a French institution",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Admission for the current academic year", "Program duration > 90 days"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "passport",
      label: "Passport valid for at least 3 months beyond stay",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Valid 3+ months after planned return", "Two blank pages"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "photos",
      label: "Two recent biometric photos (Schengen 35×45 mm)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["image/jpeg", "image/png"],
      officialSourceUrl: FRANCE_VISAS,
      validationHints: ["Plain white background", "Taken within 6 months"],
      validation: SCHENGEN_PHOTO,
    },
    {
      id: "financial-proof",
      label: "Proof of financial means (~€615/month)",
      description: "Bank statements, scholarship award, or sponsor's attestation.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Demonstrates at least €615/month for the duration", "Last 3 months of statements"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "accommodation",
      label: "Proof of accommodation in France",
      description: "CROUS/university housing, lease, or host attestation.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Covers the first 3 months in France"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "travel-insurance",
      label: "Travel / medical insurance (first 3 months)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Coverage ≥ €30,000", "Valid throughout Schengen"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    { id: "fee", label: "Visa fee (€50 for student, reduced)", required: true, uploadable: false, officialSourceUrl: FRANCE_VISAS },
  ],
};

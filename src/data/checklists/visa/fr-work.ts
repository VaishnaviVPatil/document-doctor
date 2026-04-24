import type { DocumentChecklist } from "../../checklists";

const FRANCE_VISAS = "https://france-visas.gouv.fr";
const MINISTRY_WORK = "https://www.service-public.fr/particuliers/vosdroits/F2728";

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

export const VISA_FR_WORK: DocumentChecklist = {
  id: "visa-fr-work",
  title: "France Long-Stay Work Visa (VLS-TS salarié)",
  category: "visa",
  country: "France",
  estimatedDays: 45,
  items: [
    {
      id: "long-stay-form",
      label: "Completed long-stay visa application (CERFA 14571*05)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: FRANCE_VISAS,
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "work-authorization",
      label: "Work authorization from DIRECCTE / prefecture",
      description: "Issued to the French employer before the visa application.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: MINISTRY_WORK,
      validationHints: [
        "Work authorization is approved (not 'en cours')",
        "Employer and job title match the employment contract",
      ],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "employment-contract",
      label: "Signed employment contract (CDI / CDD)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: [
        "Position, salary, and start date stated",
        "Duration > 90 days",
        "Signed by both parties",
      ],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "passport",
      label: "Passport valid for the duration of the contract",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Valid at least 3 months after planned return", "Two blank pages"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "photos",
      label: "Two recent biometric photos (Schengen 35×45 mm)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["image/jpeg", "image/png"],
      officialSourceUrl: FRANCE_VISAS,
      validation: SCHENGEN_PHOTO,
    },
    {
      id: "qualifications",
      label: "Diplomas / qualifications supporting the job",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
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
      id: "accommodation",
      label: "Proof of accommodation in France",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    { id: "fee", label: "Visa fee (€99)", required: true, uploadable: false, officialSourceUrl: FRANCE_VISAS },
  ],
};

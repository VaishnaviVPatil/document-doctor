import type { DocumentChecklist } from "../../checklists";

const FRANCE_VISAS = "https://france-visas.gouv.fr";

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

export const VISA_FR_FAMILY: DocumentChecklist = {
  id: "visa-fr-family",
  title: "France Long-Stay Family / Visitor Visa",
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
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "passport",
      label: "Passport valid 3+ months beyond stay",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "photos",
      label: "Two recent biometric photos (Schengen 35×45 mm)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["image/jpeg", "image/png"],
      validation: SCHENGEN_PHOTO,
    },
    {
      id: "relationship-proof",
      label: "Proof of relationship to family member in France",
      description: "Marriage certificate, birth certificate, livret de famille.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Certified translation if not in French or English"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "host-documents",
      label: "French relative's ID + proof of residence",
      description: "Copy of their residence card or French ID, plus utility bill.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "financial-sponsorship",
      label: "Attestation d'accueil OR proof of own means",
      description: "Either a certified attestation from the host or bank statements proving ~€615/month.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "insurance",
      label: "Health insurance",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Coverage ≥ €30,000", "Covers full stay"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    { id: "fee", label: "Visa fee (€99)", required: true, uploadable: false, officialSourceUrl: FRANCE_VISAS },
  ],
};

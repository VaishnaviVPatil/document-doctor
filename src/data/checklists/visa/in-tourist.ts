import type { DocumentChecklist } from "../../checklists";

const MEA_VISA = "https://www.mea.gov.in";
const INDIAN_VISA_CENTER = "https://www.indianvisaonline.gov.in";

// Regular Indian visa photo: 2×2 in (51×51 mm) square.
// At 300 dpi that's 600×600 px. Same as US format.
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

export const VISA_IN_TOURIST: DocumentChecklist = {
  id: "visa-in-tourist",
  title: "India Regular Tourist Visa",
  category: "visa",
  country: "India",
  estimatedDays: 10,
  items: [
    {
      id: "online-application",
      label: "Completed online visa application (printed)",
      description: "Fill at indianvisaonline.gov.in, then print and sign.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: INDIAN_VISA_CENTER,
      validationHints: [
        "Printed from the Indian visa online portal",
        "Signed in both designated places",
      ],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf"] },
    },
    {
      id: "passport",
      label: "Passport valid 6+ months",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: ["Valid at least 6 months from date of arrival", "Two blank pages"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "photos",
      label: "Two 2×2 inch color photos",
      description: "White background, matte finish.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["image/jpeg", "image/png"],
      officialSourceUrl: MEA_VISA,
      validationHints: [
        "Exactly square, 2×2 inches",
        "Plain white background",
        "Matte finish recommended",
      ],
      validation: IN_REGULAR_PHOTO,
    },
    {
      id: "address-proof",
      label: "Proof of current address",
      description: "Utility bill, driver's license, lease agreement.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "travel-itinerary",
      label: "Travel itinerary (flights & accommodation)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    {
      id: "financial-proof",
      label: "Bank statements (last 3 months)",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validation: { maxBytes: 10 * 1024 * 1024, mimeTypes: ["application/pdf", "image/*"] },
    },
    { id: "fee", label: "Visa fee (varies by nationality, ~$40 to $150)", required: true, uploadable: false, officialSourceUrl: MEA_VISA },
  ],
};

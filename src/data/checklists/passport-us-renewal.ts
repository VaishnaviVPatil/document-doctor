import type { DocumentChecklist } from "../checklists";

const STATE_URL = "https://travel.state.gov/content/travel/en/passports/have-passport/renew.html";
const PHOTO_URL = "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html";

// US passport photo: 2×2 inches. At 300 dpi that's 600×600 px; State accepts
// 600×600 up to 1200×1200. Aspect ratio is 1:1. Max file size is 10 MB.
// Source: travel.state.gov photo guidelines.
export const PASSPORT_US_RENEWAL: DocumentChecklist = {
  id: "passport-us-renewal",
  title: "US Passport Renewal (Form DS-82)",
  category: "passport",
  country: "United States",
  estimatedDays: 42,
  items: [
    {
      id: "ds-82",
      label: "Completed Form DS-82",
      description: "Application for a US Passport by Mail.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf"],
      officialSourceUrl: STATE_URL,
      validationHints: [
        "Form is the official DS-82 (not DS-11)",
        "All sections filled including SSN and emergency contact",
        "Signed and dated",
      ],
      howToGet: "Download the fillable PDF from travel.state.gov.",
      validation: {
        maxBytes: 10 * 1024 * 1024,
        mimeTypes: ["application/pdf"],
      },
    },
    {
      id: "old-passport",
      label: "Most recent US passport",
      description: "Mailed in with the application — will be returned separately.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      officialSourceUrl: STATE_URL,
      validationHints: [
        "Issued when you were 16 or older",
        "Issued within the last 15 years",
        "Issued in your current name (or with a legal name-change doc)",
      ],
      validation: {
        maxBytes: 10 * 1024 * 1024,
        mimeTypes: ["application/pdf", "image/*"],
      },
    },
    {
      id: "passport-photo",
      label: "Passport photo (2×2 inches)",
      description: "Color photo on plain white background, taken in the last 6 months.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["image/jpeg", "image/png"],
      officialSourceUrl: PHOTO_URL,
      validationHints: [
        "Exactly 2 × 2 inches (square)",
        "Plain white or off-white background",
        "Taken within the last 6 months",
        "Face fills 50–69% of the frame, neutral expression, eyes open",
        "No glasses, no hats, no uniforms",
      ],
      howToGet: "Use a professional passport photo service (CVS, Walgreens, USPS) or an approved online tool.",
      validation: {
        maxBytes: 10 * 1024 * 1024,
        mimeTypes: ["image/jpeg", "image/png"],
        image: {
          minWidth: 600,
          minHeight: 600,
          maxWidth: 1200,
          maxHeight: 1200,
          aspectRatio: 1,
          description: "2×2 inches, 600×600 to 1200×1200 pixels (square)",
        },
      },
    },
    {
      id: "name-change-doc",
      label: "Name change documentation (if applicable)",
      description: "Marriage certificate, court order, or divorce decree.",
      required: false,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      validationHints: [
        "Certified copy of the name-change document",
        "Name on the document matches the name on DS-82",
      ],
      validation: {
        maxBytes: 10 * 1024 * 1024,
        mimeTypes: ["application/pdf", "image/*"],
      },
    },
    {
      id: "fee-payment",
      label: "Passport fee ($130 for a book)",
      description: "Check or money order payable to U.S. Department of State.",
      required: true,
      uploadable: true,
      acceptedMimeTypes: ["application/pdf", "image/*"],
      officialSourceUrl: "https://travel.state.gov/content/travel/en/passports/how-apply/fees.html",
      validationHints: [
        "Check or money order (no cash, no cards by mail)",
        "Payable to 'U.S. Department of State'",
        "Full name and date of birth printed on the front",
      ],
      validation: {
        maxBytes: 10 * 1024 * 1024,
        mimeTypes: ["application/pdf", "image/*"],
      },
    },
  ],
};

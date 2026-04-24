import type { DocumentChecklist } from "@/data/checklists";
import type { UsState } from "@/data/states-us";

const REAL_ID_URL =
  "https://www.dhs.gov/real-id";

/**
 * Build a first-time US driver's license checklist for a given state.
 * Most items are federal (REAL ID) so the structure is identical across states;
 * only the form name, agency, URL and fee vary.
 */
export function buildUsLicenseChecklist(
  state: UsState,
  variant: "new" | "renewal"
): DocumentChecklist {
  const isNew = variant === "new";
  const id = `license-us-${state.code}-${variant}`;
  const title = `${state.name} Driver's License — ${isNew ? "First-Time" : "Renewal"}`;

  return {
    id,
    title,
    category: "license",
    country: "United States",
    estimatedDays: state.estimatedDays,
    items: [
      {
        id: "application-form",
        label: `Completed Form ${state.formName}`,
        description: `${state.agency} driver's license application.`,
        required: true,
        uploadable: true,
        acceptedMimeTypes: ["application/pdf"],
        officialSourceUrl: state.url,
        validationHints: [
          `Form is the official ${state.formName}`,
          "All personal information completed",
          "Signed and dated",
        ],
        howToGet: `Download or start the application at ${state.url}.`,
        validation: {
          maxBytes: 10 * 1024 * 1024,
          mimeTypes: ["application/pdf"],
        },
      },
      {
        id: "identity-proof",
        label: "Proof of identity (REAL ID–compliant)",
        description:
          "US passport, certified US birth certificate, permanent resident card, or other REAL ID–approved document.",
        required: true,
        uploadable: true,
        acceptedMimeTypes: ["application/pdf", "image/*"],
        officialSourceUrl: REAL_ID_URL,
        validationHints: [
          "Original or certified copy (no plain photocopies)",
          "Name matches the application form",
          "Document is on the DHS REAL ID acceptable list",
        ],
        validation: {
          maxBytes: 10 * 1024 * 1024,
          mimeTypes: ["application/pdf", "image/*"],
        },
      },
      {
        id: "ssn",
        label: "Proof of Social Security Number",
        description: "SSN card, W-2, 1099, or pay stub showing full SSN.",
        required: true,
        uploadable: true,
        acceptedMimeTypes: ["application/pdf", "image/*"],
        validationHints: [
          "Full 9-digit SSN is visible",
          "Name matches the identity document",
        ],
        validation: {
          maxBytes: 10 * 1024 * 1024,
          mimeTypes: ["application/pdf", "image/*"],
        },
      },
      {
        id: "residency-1",
        label: `Proof of ${state.name} residency (1 of 2)`,
        description: "Utility bill, rental agreement, or mortgage statement with an in-state address.",
        required: true,
        uploadable: true,
        acceptedMimeTypes: ["application/pdf", "image/*"],
        officialSourceUrl: state.url,
        validationHints: [
          "Dated within the last 90 days (utility bills) or current (lease)",
          `Shows the applicant's name and a ${state.name} address`,
        ],
        validation: {
          maxBytes: 10 * 1024 * 1024,
          mimeTypes: ["application/pdf", "image/*"],
        },
      },
      {
        id: "residency-2",
        label: `Proof of ${state.name} residency (2 of 2)`,
        description: "A second residency document from a different source.",
        required: true,
        uploadable: true,
        acceptedMimeTypes: ["application/pdf", "image/*"],
        officialSourceUrl: state.url,
        validationHints: [
          "Issued by a different entity than the first proof",
          "Shows the same in-state address",
        ],
        validation: {
          maxBytes: 10 * 1024 * 1024,
          mimeTypes: ["application/pdf", "image/*"],
        },
      },
      {
        id: "current-license",
        label: isNew
          ? "Current out-of-state or foreign license (if any)"
          : "Current license being renewed",
        description: isNew
          ? "Required if transferring from another state or country."
          : "Your existing license, even if expired, helps verify your record.",
        required: !isNew,
        uploadable: true,
        acceptedMimeTypes: ["application/pdf", "image/*"],
        validation: {
          maxBytes: 10 * 1024 * 1024,
          mimeTypes: ["application/pdf", "image/*"],
        },
      },
      {
        id: "license-photo",
        label: "Recent passport-style photo",
        description:
          "Used at some offices for translated foreign license packets. Standard 2×2 inch, plain background.",
        required: false,
        uploadable: true,
        acceptedMimeTypes: ["image/jpeg", "image/png"],
        validationHints: [
          "2 × 2 inches, plain background",
          "Face clearly visible, neutral expression",
        ],
        validation: {
          maxBytes: 5 * 1024 * 1024,
          mimeTypes: ["image/jpeg", "image/png"],
          image: {
            minWidth: 600,
            minHeight: 600,
            aspectRatio: 1,
            description: "2×2 inches (600×600 px minimum, square)",
          },
        },
      },
      {
        id: "fee",
        label: `Application fee (~$${state.fee} at ${state.agency})`,
        description: "Pay at the licensing office by card, cash, or check.",
        required: true,
        uploadable: false,
        officialSourceUrl: state.url,
      },
      ...(isNew
        ? [
            {
              id: "written-test",
              label: "Pass the written knowledge test",
              description: "Road signs, traffic laws, and safe driving.",
              required: true,
              uploadable: false,
              howToGet: `Study the driver handbook on ${state.url}.`,
            },
            {
              id: "vision-test",
              label: "Pass the vision test",
              description: "Taken at the licensing office at time of application.",
              required: true,
              uploadable: false,
            },
            {
              id: "driving-test",
              label: "Pass the behind-the-wheel driving test",
              description: "Bring a registered, insured vehicle.",
              required: true,
              uploadable: false,
            },
          ]
        : []),
    ],
  };
}

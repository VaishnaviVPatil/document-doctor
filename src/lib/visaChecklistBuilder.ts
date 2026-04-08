import type { Intake } from "@/lib/visaChecks";

export type BuiltItem = {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  uploadable?: boolean;
  acceptedMimeTypes?: string[];
  validationHints?: string[];
  officialSourceUrl?: string;
  /** Days before travelStartDate this item should be ready. */
  dueOffsetDays?: number;
};

export type BuiltSection = {
  id: string;
  title: string;
  items: BuiltItem[];
};

export type BuiltChecklist = {
  title: string;
  sections: BuiltSection[];
};

const FRANCE_VISAS = "https://france-visas.gouv.fr";
const VFS = "https://visa.vfsglobal.com/usa/en/fra";

const PDF_OR_IMG = ["application/pdf", "image/*"];

function visaTitle(intake: Intake): string {
  const map: Record<Intake["visaType"], string> = {
    "schengen-short": "France Schengen Short-stay Visa",
    "long-stay": "France Long-stay Visa",
    student: "France Student Visa",
    work: "France Work Visa",
    tourist: "France Tourist Visa",
    business: "France Business Visa",
    "family-visit": "France Family-Visit Visa",
  };
  return map[intake.visaType];
}

export function buildChecklist(intake: Intake): BuiltChecklist {
  const sections: BuiltSection[] = [];

  // ── Always required ───────────────────────────────────────────────
  sections.push({
    id: "always",
    title: "Always Required",
    items: [
      {
        id: "passport",
        label: "Valid passport",
        description: "Issued in last 10 years, valid 3+ months past return",
        required: true,
        uploadable: true,
        acceptedMimeTypes: PDF_OR_IMG,
        officialSourceUrl: FRANCE_VISAS,
        validationHints: [
          "Bio page is clearly visible",
          "Issued within the last 10 years",
          "Valid at least 3 months after the planned return",
          "At least 2 blank visa pages",
        ],
        dueOffsetDays: 45,
      },
      {
        id: "application-form",
        label: "Visa application form",
        description: "Completed and signed",
        required: true,
        uploadable: true,
        acceptedMimeTypes: PDF_OR_IMG,
        officialSourceUrl: FRANCE_VISAS,
        validationHints: ["Official France-Visas form", "All fields filled", "Signed"],
        dueOffsetDays: 30,
      },
      {
        id: "photos",
        label: "Passport-size photos",
        description: "35x45mm, white background, < 6 months old",
        required: true,
        uploadable: true,
        acceptedMimeTypes: ["image/*"],
        validationHints: [
          "35x45mm Schengen biometric format",
          "White background",
          "Recent (last 6 months)",
        ],
        dueOffsetDays: 30,
      },
      {
        id: "travel-itinerary",
        label: "Travel itinerary",
        description: "Day-by-day plan for the trip",
        required: true,
        uploadable: true,
        acceptedMimeTypes: PDF_OR_IMG,
        dueOffsetDays: 21,
      },
      buildAccommodationItem(intake),
      buildInsuranceItem(intake),
      {
        id: "proof-of-funds",
        label: "Proof of funds",
        description: "Recent bank statements showing sufficient balance",
        required: true,
        uploadable: true,
        acceptedMimeTypes: PDF_OR_IMG,
        validationHints: [
          "Statements cover at least the last 3 months",
          "Account holder matches applicant",
        ],
        dueOffsetDays: 14,
      },
      buildFlightItem(intake),
    ],
  });

  // ── Employment ────────────────────────────────────────────────────
  if (intake.employmentStatus === "employed") {
    sections.push({
      id: "employed",
      title: "Employment",
      items: [
        {
          id: "employment-letter",
          label: "Employment letter",
          description: "On letterhead, confirms position and continued employment",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          validationHints: [
            "Company letterhead",
            "States position, salary, and start date",
            "Confirms employment continues after planned return",
          ],
          dueOffsetDays: 14,
        },
        {
          id: "pay-stubs",
          label: "Pay slips (last 3 months)",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 14,
        },
      ],
    });
  } else if (intake.employmentStatus === "self-employed") {
    sections.push({
      id: "self-employed",
      title: "Self-Employment",
      items: [
        {
          id: "business-registration",
          label: "Business registration / incorporation",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 14,
        },
        {
          id: "tax-returns",
          label: "Recent tax returns",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 14,
        },
      ],
    });
  }

  // ── Student ───────────────────────────────────────────────────────
  if (intake.employmentStatus === "student" || intake.visaType === "student") {
    sections.push({
      id: "student",
      title: "Student",
      items: [
        {
          id: "enrollment-letter",
          label: "Enrollment letter",
          description: "From your current university",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 21,
        },
        {
          id: "noc-university",
          label: "NOC from university",
          description: "No-objection certificate for the trip",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 21,
        },
        ...(intake.studentDetails === "admitted"
          ? [
              {
                id: "admission-letter",
                label: "Admission letter (host institution)",
                required: true,
                uploadable: true,
                acceptedMimeTypes: PDF_OR_IMG,
                dueOffsetDays: 30,
              } as BuiltItem,
            ]
          : []),
      ],
    });
  }

  // ── Sponsor ───────────────────────────────────────────────────────
  if (intake.sponsorExists || intake.financialSupport === "sponsored") {
    sections.push({
      id: "sponsor",
      title: "Sponsor",
      items: [
        {
          id: "sponsorship-letter",
          label: "Sponsorship letter",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          validationHints: [
            "States sponsor name and relationship",
            "States what expenses are covered",
            "Signed and dated",
          ],
          dueOffsetDays: 14,
        },
        {
          id: "sponsor-id",
          label: "Sponsor ID + financial proof",
          description: "Sponsor's passport/ID and bank statements",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 14,
        },
      ],
    });
  }

  // ── Family / friend visit ─────────────────────────────────────────
  if (
    intake.purposeOfTravel === "family" ||
    intake.invitationLetter === "have" ||
    intake.accommodation === "friend-family" ||
    intake.visaType === "family-visit"
  ) {
    sections.push({
      id: "family-visit",
      title: "Family / Friend Visit",
      items: [
        {
          id: "invitation-letter",
          label: "Invitation letter from host",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          validationHints: [
            "Host name, address in France, and signature",
            "Dates of stay",
          ],
          dueOffsetDays: 21,
        },
        {
          id: "host-residence-proof",
          label: "Host residence proof",
          description: "Utility bill, lease, or attestation d'accueil",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 21,
        },
      ],
    });
  }

  // ── Business ──────────────────────────────────────────────────────
  if (
    intake.visaType === "business" ||
    intake.purposeOfTravel === "business-meeting" ||
    intake.purposeOfTravel === "conference"
  ) {
    sections.push({
      id: "business",
      title: "Business",
      items: [
        {
          id: "company-invitation",
          label: "Company invitation letter",
          description: "From the host company in France",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 21,
        },
        {
          id: "business-registration-docs",
          label: "Business registration documents",
          description: "Of your own employer / company",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 21,
        },
      ],
    });
  }

  // ── Work visa ─────────────────────────────────────────────────────
  if (intake.visaType === "work" || intake.purposeOfTravel === "employment") {
    sections.push({
      id: "work",
      title: "Work Visa",
      items: [
        {
          id: "job-offer-letter",
          label: "Job offer letter",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 30,
        },
        {
          id: "work-contract",
          label: "Work contract",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 30,
        },
        {
          id: "employer-authorization",
          label: "Employer authorization (DREETS / OFII)",
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          dueOffsetDays: 30,
        },
      ],
    });
  }

  // ── Residence permit (when residence ≠ nationality) ──────────────
  if (intake.residenceDiffersFromNationality) {
    sections.push({
      id: "residence",
      title: "Residence Status",
      items: [
        {
          id: "residence-permit",
          label: `Residence permit for ${intake.currentResidenceCountry || "current country"}`,
          required: true,
          uploadable: true,
          acceptedMimeTypes: PDF_OR_IMG,
          validationHints: ["Permit valid through travel return date"],
          dueOffsetDays: 30,
        },
      ],
    });
  }

  return { title: visaTitle(intake), sections };
}

function buildAccommodationItem(intake: Intake): BuiltItem {
  const labels: Record<Intake["accommodation"], string> = {
    hotel: "Hotel booking confirmation",
    airbnb: "Airbnb booking confirmation",
    "friend-family": "Proof of stay with friend/family",
    "company-housing": "Company-arranged housing confirmation",
  };
  return {
    id: "accommodation",
    label: labels[intake.accommodation],
    description: "Covers the entire travel window",
    required: true,
    uploadable: true,
    acceptedMimeTypes: PDF_OR_IMG,
    validationHints: ["Covers all nights of the trip", "Address is in France"],
    dueOffsetDays: 21,
  };
}

function buildInsuranceItem(intake: Intake): BuiltItem {
  return {
    id: "travel-insurance",
    label: "Travel insurance",
    description:
      intake.insuranceStatus === "purchased"
        ? "Schengen-wide, ≥ €30,000, medical + repatriation"
        : "Need to purchase: Schengen-wide, ≥ €30,000, medical + repatriation",
    required: true,
    uploadable: true,
    acceptedMimeTypes: PDF_OR_IMG,
    validationHints: [
      "Coverage at least €30,000",
      "Valid throughout Schengen area",
      "Includes medical emergencies and repatriation",
    ],
    dueOffsetDays: 14,
  };
}

function buildFlightItem(intake: Intake): BuiltItem {
  return {
    id: "flight",
    label:
      intake.flightStatus === "booked"
        ? "Round-trip flight ticket"
        : "Round-trip flight reservation",
    description: "A reservation is fine — no need to pay until visa is approved",
    required: true,
    uploadable: true,
    acceptedMimeTypes: PDF_OR_IMG,
    validationHints: [
      "Round-trip itinerary",
      "Dates match the planned travel window",
      "Destination is in France",
    ],
    dueOffsetDays: 21,
  };
}

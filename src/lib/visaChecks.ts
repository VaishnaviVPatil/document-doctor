export type VisaType =
  | "schengen-short"
  | "long-stay"
  | "student"
  | "work"
  | "tourist"
  | "business"
  | "family-visit";

export type Purpose =
  | "tourism"
  | "family"
  | "business-meeting"
  | "conference"
  | "study"
  | "employment"
  | "transit";

export type TravelDuration = "<7" | "7-30" | "30-90" | ">90";
export type Entries = "single" | "multiple";
export type Accommodation = "hotel" | "airbnb" | "friend-family" | "company-housing";
export type FinancialSupport = "self" | "sponsored" | "employer";
export type EmploymentStatus = "employed" | "self-employed" | "student" | "unemployed";
export type SchengenHistory = "first-time" | "visited";
export type InsuranceStatus = "purchased" | "need-to-purchase";
export type FlightStatus = "booked" | "not-booked" | "planning";
export type InvitationLetter = "have" | "no" | "n/a";
export type StudentDetails = "admitted" | "applying" | "exchange" | "n/a";
export type JobOffer = "have" | "applying" | "intra-company" | "n/a";
export type SponsorType = "spouse-family" | "company" | "n/a";

export type Intake = {
  // contact (kept so reminders + emails still work)
  fullName: string;
  email: string;

  // base
  visaType: VisaType;
  nationality: string;
  currentResidenceCountry: string;
  residenceDiffersFromNationality: boolean;

  // purpose
  purposeOfTravel: Purpose;

  // travel
  travelDuration: TravelDuration;
  numberOfEntries: Entries;
  /** Optional approximate start date — used for reminders + timing check. */
  travelStartDate?: string;

  // logistics
  accommodation: Accommodation;
  financialSupport: FinancialSupport;
  employmentStatus: EmploymentStatus;

  // sponsor
  sponsorExists: boolean;
  sponsorType?: SponsorType;
  sponsorCountry?: string;

  // history & misc
  schengenHistory: SchengenHistory;
  insuranceStatus: InsuranceStatus;
  flightStatus: FlightStatus;
  invitationLetter: InvitationLetter;

  // conditional
  studentDetails?: StudentDetails;
  jobOffer?: JobOffer;

  // reminders
  reminderFrequency: "daily" | "every3days" | "weekly";
};

export type CheckResult = {
  status: "pass" | "warn" | "fail" | "unknown";
  message: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

export function checkApplicationWindow(intake: Intake): CheckResult {
  if (!intake.travelStartDate) {
    return { status: "unknown", message: "No travel date provided." };
  }
  const start = new Date(intake.travelStartDate);
  const today = new Date();
  const daysUntil = daysBetween(today, start);
  if (daysUntil < 0) {
    return { status: "fail", message: "Travel date is in the past." };
  }
  if (daysUntil < 21) {
    return {
      status: "warn",
      message: `Only ${daysUntil} days until travel — Schengen visas typically need 3–6 weeks.`,
    };
  }
  if (daysUntil > 180) {
    return {
      status: "warn",
      message: "France-Visas applications usually open at most 6 months before travel.",
    };
  }
  return { status: "pass", message: `Good — ${daysUntil} days until travel.` };
}

export function checkInsurance(intake: Intake): CheckResult {
  if (intake.insuranceStatus === "purchased") {
    return {
      status: "pass",
      message: "You already have insurance — make sure it covers €30k Schengen-wide.",
    };
  }
  return {
    status: "warn",
    message: "You still need to buy Schengen travel insurance (≥ €30,000).",
  };
}

export function checkFlights(intake: Intake): CheckResult {
  if (intake.flightStatus === "booked") {
    return { status: "pass", message: "Flights booked — keep the itinerary handy." };
  }
  if (intake.flightStatus === "planning") {
    return {
      status: "warn",
      message: "Get a reservation (no need to pay) before submitting your application.",
    };
  }
  return {
    status: "warn",
    message: "You'll need a round-trip flight reservation for the application.",
  };
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Intake } from "@/lib/visaChecks";

const STORAGE_KEY = "dd:visa:france-paris:intake";

const COUNTRIES = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "Brazil", "China", "Egypt", "Germany", "Japan", "Mexico", "Nigeria",
  "Pakistan", "Philippines", "South Africa", "Vietnam",
];

export default function IntakePage() {
  return (
    <Suspense fallback={<main className="p-10 text-sm text-muted-foreground">Loading…</main>}>
      <IntakeForm />
    </Suspense>
  );
}

const VISA_TYPE_LABELS: Record<string, string> = {
  "schengen-short": "Short-stay (Schengen)",
  "long-stay": "Long-stay",
  student: "Student",
  work: "Work",
  tourist: "Tourist",
  business: "Business",
  "family-visit": "Family visit",
};

function IntakeForm() {
  const router = useRouter();
  const params = useSearchParams();
  const presetVisaType = (params.get("visaType") as Intake["visaType"]) || "schengen-short";

  const [form, setForm] = useState<Intake>({
    fullName: "",
    email: "",
    visaType: presetVisaType,
    nationality: "India",
    currentResidenceCountry: "India",
    residenceDiffersFromNationality: false,
    purposeOfTravel: "tourism",
    travelDuration: "7-30",
    numberOfEntries: "single",
    travelStartDate: "",
    accommodation: "hotel",
    financialSupport: "self",
    employmentStatus: "employed",
    sponsorExists: false,
    sponsorType: "n/a",
    sponsorCountry: "",
    schengenHistory: "first-time",
    insuranceStatus: "need-to-purchase",
    flightStatus: "not-booked",
    invitationLetter: "n/a",
    studentDetails: "n/a",
    jobOffer: "n/a",
    reminderFrequency: "weekly",
  });

  const set = <K extends keyof Intake>(key: K, value: Intake[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const showStudent = useMemo(
    () => form.visaType === "student" || form.employmentStatus === "student",
    [form.visaType, form.employmentStatus]
  );
  const showWork = useMemo(
    () => form.visaType === "work" || form.purposeOfTravel === "employment",
    [form.visaType, form.purposeOfTravel]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {}
    router.push("/visa/france-paris");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/checklist/visa"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Tell us about your trip</CardTitle>
            <CardDescription>
              Answer a few questions and we&apos;ll generate a tailored France visa
              checklist with automated document checks and reminders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-8">
              <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm">
                <span className="text-muted-foreground">You picked: </span>
                <span className="font-medium">France · {VISA_TYPE_LABELS[form.visaType]}</span>
                <Link href="/checklist/visa" className="ml-2 text-xs text-primary underline">
                  change
                </Link>
              </div>

              <Section title="🌍 Nationality & Residence">
                <Field label="Nationality">
                  <Select
                    value={form.nationality}
                    onChange={(v) => set("nationality", v)}
                    options={COUNTRIES.map((c) => [c, c])}
                  />
                </Field>
                <Field label="Current residence">
                  <Select
                    value={form.residenceDiffersFromNationality ? "different" : "same"}
                    onChange={(v) => {
                      const diff = v === "different";
                      set("residenceDiffersFromNationality", diff);
                      if (!diff) set("currentResidenceCountry", form.nationality);
                    }}
                    options={[
                      ["same", "Same as nationality"],
                      ["different", "Different (requires residence permit)"],
                    ]}
                  />
                </Field>
                {form.residenceDiffersFromNationality && (
                  <Field label="Residence country" full>
                    <Select
                      value={form.currentResidenceCountry}
                      onChange={(v) => set("currentResidenceCountry", v)}
                      options={COUNTRIES.map((c) => [c, c])}
                    />
                  </Field>
                )}
              </Section>

              <Section title="📍 Travel Purpose">
                <Field label="Purpose of travel" full>
                  <Select
                    value={form.purposeOfTravel}
                    onChange={(v) => set("purposeOfTravel", v as Intake["purposeOfTravel"])}
                    options={[
                      ["tourism", "Tourism"],
                      ["family", "Visiting family/friends"],
                      ["business-meeting", "Business meetings"],
                      ["conference", "Conference / event"],
                      ["study", "Study"],
                      ["employment", "Employment"],
                      ["transit", "Transit"],
                    ]}
                  />
                </Field>
              </Section>

              <Section title="📅 Travel Details">
                <Field label="Travel duration">
                  <Select
                    value={form.travelDuration}
                    onChange={(v) => set("travelDuration", v as Intake["travelDuration"])}
                    options={[
                      ["<7", "< 7 days"],
                      ["7-30", "7–30 days"],
                      ["30-90", "30–90 days"],
                      [">90", "> 90 days"],
                    ]}
                  />
                </Field>
                <Field label="Number of entries">
                  <Select
                    value={form.numberOfEntries}
                    onChange={(v) => set("numberOfEntries", v as Intake["numberOfEntries"])}
                    options={[
                      ["single", "Single entry"],
                      ["multiple", "Multiple entry"],
                    ]}
                  />
                </Field>
                <Field label="Approximate travel start date" full>
                  <input
                    type="date"
                    value={form.travelStartDate ?? ""}
                    onChange={(e) => set("travelStartDate", e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </Section>

              <Section title="🏨 Accommodation">
                <Field label="Accommodation type" full>
                  <Select
                    value={form.accommodation}
                    onChange={(v) => set("accommodation", v as Intake["accommodation"])}
                    options={[
                      ["hotel", "Hotel booking"],
                      ["airbnb", "Airbnb"],
                      ["friend-family", "Staying with friend/family"],
                      ["company-housing", "Company-arranged housing"],
                    ]}
                  />
                </Field>
              </Section>

              <Section title="💰 Financial & Employment">
                <Field label="Financial support">
                  <Select
                    value={form.financialSupport}
                    onChange={(v) =>
                      set("financialSupport", v as Intake["financialSupport"])
                    }
                    options={[
                      ["self", "Self-funded"],
                      ["sponsored", "Sponsored"],
                      ["employer", "Employer-funded"],
                    ]}
                  />
                </Field>
                <Field label="Employment status">
                  <Select
                    value={form.employmentStatus}
                    onChange={(v) =>
                      set("employmentStatus", v as Intake["employmentStatus"])
                    }
                    options={[
                      ["employed", "Employed"],
                      ["self-employed", "Self-employed"],
                      ["student", "Student"],
                      ["unemployed", "Unemployed"],
                    ]}
                  />
                </Field>
              </Section>

              <Section title="📄 Sponsor">
                <Field label="Do you have a sponsor?">
                  <Select
                    value={form.sponsorExists ? "yes" : "no"}
                    onChange={(v) => set("sponsorExists", v === "yes")}
                    options={[
                      ["no", "No"],
                      ["yes", "Yes"],
                    ]}
                  />
                </Field>
                {form.sponsorExists && (
                  <>
                    <Field label="Sponsor type">
                      <Select
                        value={form.sponsorType ?? "spouse-family"}
                        onChange={(v) => set("sponsorType", v as Intake["sponsorType"])}
                        options={[
                          ["spouse-family", "Spouse / family"],
                          ["company", "Company"],
                        ]}
                      />
                    </Field>
                    <Field label="Sponsor country" full>
                      <Select
                        value={form.sponsorCountry || "France"}
                        onChange={(v) => set("sponsorCountry", v)}
                        options={[
                          ["France", "France"],
                          ["Other", "Other"],
                        ]}
                      />
                    </Field>
                  </>
                )}
              </Section>

              <Section title="🛂 History & Logistics">
                <Field label="Schengen history">
                  <Select
                    value={form.schengenHistory}
                    onChange={(v) => set("schengenHistory", v as Intake["schengenHistory"])}
                    options={[
                      ["first-time", "First time"],
                      ["visited", "Visited before"],
                    ]}
                  />
                </Field>
                <Field label="Insurance">
                  <Select
                    value={form.insuranceStatus}
                    onChange={(v) =>
                      set("insuranceStatus", v as Intake["insuranceStatus"])
                    }
                    options={[
                      ["need-to-purchase", "Need to purchase"],
                      ["purchased", "Already purchased"],
                    ]}
                  />
                </Field>
                <Field label="Flight booking">
                  <Select
                    value={form.flightStatus}
                    onChange={(v) => set("flightStatus", v as Intake["flightStatus"])}
                    options={[
                      ["not-booked", "Not booked"],
                      ["planning", "Planning to book"],
                      ["booked", "Booked"],
                    ]}
                  />
                </Field>
                <Field label="Invitation letter">
                  <Select
                    value={form.invitationLetter}
                    onChange={(v) =>
                      set("invitationLetter", v as Intake["invitationLetter"])
                    }
                    options={[
                      ["n/a", "Not applicable"],
                      ["have", "Yes (have it)"],
                      ["no", "No"],
                    ]}
                  />
                </Field>
              </Section>

              {showStudent && (
                <Section title="🎓 Student details">
                  <Field label="Student status" full>
                    <Select
                      value={form.studentDetails ?? "n/a"}
                      onChange={(v) =>
                        set("studentDetails", v as Intake["studentDetails"])
                      }
                      options={[
                        ["admitted", "Admission letter available"],
                        ["applying", "Applying for admission"],
                        ["exchange", "Exchange program"],
                      ]}
                    />
                  </Field>
                </Section>
              )}

              {showWork && (
                <Section title="💼 Work visa details">
                  <Field label="Job offer status" full>
                    <Select
                      value={form.jobOffer ?? "n/a"}
                      onChange={(v) => set("jobOffer", v as Intake["jobOffer"])}
                      options={[
                        ["have", "Offer letter available"],
                        ["applying", "Applying for jobs"],
                        ["intra-company", "Intra-company transfer"],
                      ]}
                    />
                  </Field>
                </Section>
              )}

              <Section title="📬 Contact & reminders">
                <Field label="Full name" required>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Reminder frequency" full>
                  <Select
                    value={form.reminderFrequency}
                    onChange={(v) =>
                      set("reminderFrequency", v as Intake["reminderFrequency"])
                    }
                    options={[
                      ["daily", "Daily"],
                      ["every3days", "Every 3 days"],
                      ["weekly", "Weekly"],
                    ]}
                  />
                </Field>
              </Section>

              <div className="flex justify-end pt-2">
                <Button type="submit" size="lg">
                  Generate my checklist
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    >
      {options.map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </select>
  );
}

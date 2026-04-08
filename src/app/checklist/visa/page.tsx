"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plane } from "lucide-react";

const COUNTRIES = [
  { code: "FR", label: "France", supported: true },
  { code: "DE", label: "Germany", supported: false },
  { code: "IT", label: "Italy", supported: false },
  { code: "ES", label: "Spain", supported: false },
];

const VISA_TYPES: { id: string; title: string; description: string }[] = [
  { id: "schengen-short", title: "Short-stay (Schengen)", description: "≤ 90 days, tourism / business / family" },
  { id: "long-stay", title: "Long-stay", description: "> 90 days, study / work / family reunification" },
  { id: "student", title: "Student", description: "University admission or exchange" },
  { id: "work", title: "Work", description: "Job offer or intra-company transfer" },
  { id: "tourist", title: "Tourist", description: "Pure tourism, no other purpose" },
  { id: "business", title: "Business", description: "Meetings, conferences, events" },
  { id: "family-visit", title: "Family visit", description: "Visiting family or friends" },
];

export default function VisaPickerPage() {
  const router = useRouter();
  const [country, setCountry] = useState("FR");

  const onPick = (visaType: string) => {
    if (country !== "FR") return;
    router.push(`/visa/france-paris/intake?visaType=${visaType}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">Choose your visa</h1>
        <p className="mt-2 text-muted-foreground">
          Pick a destination country and the type of visa you need. We&apos;ll
          generate a tailored checklist next.
        </p>

        {/* Step 1: Country */}
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold">1. Destination country</h2>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                disabled={!c.supported}
                onClick={() => setCountry(c.code)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  country === c.code
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:border-primary"
                } ${!c.supported ? "cursor-not-allowed opacity-40" : ""}`}
              >
                {c.label}
                {!c.supported && " (soon)"}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Visa type */}
        <div className="mt-10">
          <h2 className="mb-3 text-sm font-semibold">2. Visa type</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VISA_TYPES.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => onPick(v.id)}
                className="text-left"
              >
                <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Plane className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{v.title}</CardTitle>
                    <CardDescription>{v.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="text-sm font-medium text-primary">
                      Continue →
                    </span>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

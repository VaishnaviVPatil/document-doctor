"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, CheckCircle2, AlertTriangle, XCircle, Bell } from "lucide-react";
import {
  type Intake,
  type CheckResult,
  checkApplicationWindow,
  checkInsurance,
  checkFlights,
} from "@/lib/visaChecks";
import { buildChecklist, type BuiltItem } from "@/lib/visaChecklistBuilder";
import UploadAndValidate, { type ValidationResult } from "@/components/UploadAndValidate";
import DocumentChatbot from "@/components/DocumentChatbot";

const INTAKE_KEY = "dd:visa:france-paris:intake";
const CHECK_KEY = "dd:visa:france-paris:checked";
const VALID_KEY = "dd:visa:france-paris:validations";
const SUB_KEY = "dd:visa:france-paris:reminderSubId";

const DAY_MS = 24 * 60 * 60 * 1000;

export default function ParisVisaView() {
  const router = useRouter();
  const [intake, setIntake] = useState<Intake | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [validations, setValidations] = useState<Record<string, ValidationResult>>({});
  const [hydrated, setHydrated] = useState(false);
  const [reminderId, setReminderId] = useState<string | null>(null);
  const [reminderBusy, setReminderBusy] = useState(false);

  useEffect(() => {
    try {
      const i = localStorage.getItem(INTAKE_KEY);
      if (i) setIntake(JSON.parse(i));
      const c = localStorage.getItem(CHECK_KEY);
      if (c) setChecked(JSON.parse(c));
      const v = localStorage.getItem(VALID_KEY);
      if (v) setValidations(JSON.parse(v));
      const s = localStorage.getItem(SUB_KEY);
      if (s) setReminderId(s);
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!intake) router.replace("/visa/france-paris/intake");
  }, [hydrated, intake, router]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CHECK_KEY, JSON.stringify(checked));
  }, [checked, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(VALID_KEY, JSON.stringify(validations));
  }, [validations, hydrated]);

  const built = useMemo(() => (intake ? buildChecklist(intake) : null), [intake]);
  const allItems = useMemo<BuiltItem[]>(
    () => built?.sections.flatMap((s) => s.items) ?? [],
    [built]
  );

  const completedSet = useMemo(() => {
    const s = new Set<string>();
    for (const id of Object.keys(checked)) if (checked[id]) s.add(id);
    for (const [id, r] of Object.entries(validations)) {
      if (r.status === "pass") s.add(id);
    }
    return s;
  }, [checked, validations]);

  const total = allItems.length;
  const completed = completedSet.size;
  const percent = total ? (completed / total) * 100 : 0;

  const ruleChecks = useMemo<{ label: string; result: CheckResult }[]>(() => {
    if (!intake) return [];
    return [
      { label: "Application timing", result: checkApplicationWindow(intake) },
      { label: "Insurance", result: checkInsurance(intake) },
      { label: "Flights", result: checkFlights(intake) },
    ];
  }, [intake]);

  const dueByItem = useMemo(() => {
    const m = new Map<string, Date>();
    if (!intake?.travelStartDate) return m;
    const start = new Date(intake.travelStartDate);
    for (const item of allItems) {
      if (typeof item.dueOffsetDays === "number") {
        m.set(item.id, new Date(start.getTime() - item.dueOffsetDays * DAY_MS));
      }
    }
    return m;
  }, [intake, allItems]);

  const upcoming = useMemo(() => {
    if (!intake?.travelStartDate) return [];
    const today = new Date();
    return allItems
      .filter((i) => !completedSet.has(i.id) && dueByItem.has(i.id))
      .map((i) => {
        const dueDate = dueByItem.get(i.id)!;
        return {
          itemId: i.id,
          label: i.label,
          dueDate,
          daysUntilDue: Math.round((dueDate.getTime() - today.getTime()) / DAY_MS),
        };
      })
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 6);
  }, [intake, allItems, completedSet, dueByItem]);

  if (!hydrated || !intake || !built) {
    return <main className="p-10 text-sm text-muted-foreground">Loading…</main>;
  }

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));

  const setValidation = (id: string, r: ValidationResult) =>
    setValidations((p) => ({ ...p, [id]: r }));

  const subscribeReminders = async () => {
    setReminderBusy(true);
    try {
      const pendingItems = allItems
        .filter((i) => !completedSet.has(i.id))
        .map((i) => ({
          id: i.id,
          label: i.label,
          dueDate: dueByItem.get(i.id)?.toISOString(),
        }));
      const res = await fetch("/api/reminders/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: intake.email,
          visaId: "france-paris",
          travelDate: intake.travelStartDate || new Date().toISOString(),
          frequency: intake.reminderFrequency,
          pendingItems,
        }),
      });
      const json = await res.json();
      if (json.id) {
        setReminderId(json.id);
        localStorage.setItem(SUB_KEY, json.id);
      }
    } finally {
      setReminderBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/checklist/visa"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">Visa</Badge>
          <Badge variant="outline">France</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{built.title}</h1>
        <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          For {intake.fullName || "you"} · {intake.purposeOfTravel}
        </p>

        {/* Progress */}
        <div className="mt-6 rounded-lg border bg-card p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Your progress</span>
            <span className="text-muted-foreground">
              {completed} / {total} complete
            </span>
          </div>
          <Progress value={percent} />
        </div>

        {/* Rule checks */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Automated checks</CardTitle>
            <CardDescription>
              Computed from your intake. Document-level validation runs on upload.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {ruleChecks.map(({ label, result }) => (
              <div key={label} className="flex items-start gap-2 text-sm">
                <StatusIcon status={result.status} />
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-muted-foreground">{result.message}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Next steps */}
        {upcoming.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Next steps</CardTitle>
              <CardDescription>
                Suggested order based on your travel date (
                {new Date(intake.travelStartDate!).toDateString()}).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                {upcoming.map((s) => (
                  <li key={s.itemId} className="flex items-center justify-between">
                    <span>{s.label}</span>
                    <span
                      className={`text-xs ${
                        s.daysUntilDue < 0
                          ? "text-destructive"
                          : s.daysUntilDue < 7
                          ? "text-yellow-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {s.daysUntilDue < 0
                        ? `${Math.abs(s.daysUntilDue)}d overdue`
                        : `due in ${s.daysUntilDue}d`}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Reminders */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Email reminders
            </CardTitle>
            <CardDescription>
              {reminderId
                ? `Subscribed to ${intake.reminderFrequency} reminders at ${intake.email}.`
                : `We'll email ${intake.email} on a ${intake.reminderFrequency} schedule with what's still pending.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={subscribeReminders} disabled={reminderBusy || !!reminderId}>
              {reminderId ? "Subscribed" : reminderBusy ? "Setting up…" : "Set up reminders"}
            </Button>
          </CardContent>
        </Card>

        {/* Verification list */}
        {Object.keys(validations).length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Document verification</CardTitle>
              <CardDescription>
                Results from Claude&apos;s checks on each uploaded file.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {allItems
                  .filter((i) => validations[i.id])
                  .map((i) => {
                    const r = validations[i.id];
                    return (
                      <li key={i.id} className="flex items-start gap-2">
                        <StatusIcon status={r.status} />
                        <div className="flex-1">
                          <div className="font-medium">{i.label}</div>
                          {r.fileName && (
                            <div className="text-xs text-muted-foreground">{r.fileName}</div>
                          )}
                          {r.reasons.length > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {r.reasons[0]}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Sections */}
        <div className="mt-8 space-y-6">
          {built.sections.map((section) => (
            <section key={section.id}>
              <h2 className="mb-3 text-lg font-semibold">{section.title}</h2>
              <ul className="space-y-3">
                {section.items.map((item) => {
                  const isChecked = completedSet.has(item.id);
                  const due = dueByItem.get(item.id);
                  return (
                    <li key={item.id}>
                      <Card
                        className={`transition-all ${
                          isChecked ? "border-primary/50 bg-primary/5" : ""
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggle(item.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <CardTitle
                                  className={`text-base ${
                                    isChecked ? "line-through text-muted-foreground" : ""
                                  }`}
                                >
                                  {item.label}
                                </CardTitle>
                                {item.required ? (
                                  <Badge variant="destructive">Required</Badge>
                                ) : (
                                  <Badge variant="secondary">Optional</Badge>
                                )}
                                {due && (
                                  <Badge variant="outline">
                                    Due {due.toLocaleDateString()}
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <CardDescription className="mt-1">
                                  {item.description}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        {item.uploadable && (
                          <CardContent>
                            <UploadAndValidate
                              itemLabel={item.label}
                              itemDescription={item.description}
                              validationHints={item.validationHints}
                              officialSourceUrl={item.officialSourceUrl}
                              visaTitle={built.title}
                              accept={item.acceptedMimeTypes?.join(",")}
                              initial={validations[item.id]}
                              onResult={(r) => setValidation(item.id, r)}
                            />
                          </CardContent>
                        )}
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <DocumentChatbot documentType={built.title} />
    </main>
  );
}

function StatusIcon({ status }: { status: CheckResult["status"] }) {
  if (status === "pass") return <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />;
  if (status === "warn") return <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600" />;
  if (status === "fail") return <XCircle className="mt-0.5 h-4 w-4 text-destructive" />;
  return <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />;
}

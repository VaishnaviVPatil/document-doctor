"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Info, ArrowLeft, Clock, ExternalLink } from "lucide-react";
import type { DocumentChecklist, ChecklistItem } from "@/data/checklists";
import { getAllItems } from "@/data/checklists";
import DocumentChatbot from "@/components/DocumentChatbot";
import UploadAndValidate, { type ValidationResult } from "@/components/UploadAndValidate";

type Props = { checklist: DocumentChecklist; backHref?: string };

export default function ChecklistView({ checklist, backHref = "/" }: Props) {
  const storageKey = `dd:checklist:${checklist.id}`;
  const validationsKey = `${storageKey}:validations`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [validations, setValidations] = useState<Record<string, ValidationResult>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
      const v = localStorage.getItem(validationsKey);
      if (v) setValidations(JSON.parse(v));
    } catch {}
    setHydrated(true);
  }, [storageKey, validationsKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
      localStorage.setItem(validationsKey, JSON.stringify(validations));
    } catch {}
  }, [checked, validations, storageKey, validationsKey, hydrated]);

  const allItems = useMemo(() => getAllItems(checklist), [checklist]);

  const { completed, total, percent } = useMemo(() => {
    const total = allItems.length;
    const completed = allItems.filter((i) => checked[i.id]).length;
    return { completed, total, percent: total ? (completed / total) * 100 : 0 };
  }, [checked, allItems]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const reset = () => {
    setChecked({});
    setValidations({});
  };

  const onValidation = (itemId: string) => (r: ValidationResult) => {
    setValidations((prev) => ({ ...prev, [itemId]: r }));
    if (r.status === "pass") {
      setChecked((prev) => ({ ...prev, [itemId]: true }));
    }
  };

  const renderItem = (item: ChecklistItem) => {
    const isChecked = !!checked[item.id];
    const initial = validations[item.id];
    return (
      <li key={item.id}>
        <Card
          className={`transition-all hover:border-primary ${
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
                </div>
                {item.description && (
                  <CardDescription className="mt-1">{item.description}</CardDescription>
                )}
                {item.validation?.image?.description && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Required: {item.validation.image.description}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {item.uploadable && (
              <UploadAndValidate
                itemLabel={item.label}
                itemDescription={item.description}
                validationHints={item.validationHints}
                officialSourceUrl={item.officialSourceUrl}
                visaTitle={checklist.title}
                accept={item.acceptedMimeTypes?.join(",")}
                validation={item.validation}
                initial={initial}
                onResult={onValidation(item.id)}
              />
            )}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {item.howToGet && (
                <div className="inline-flex items-center gap-1" title={item.howToGet}>
                  <Info className="h-3.5 w-3.5" />
                  <span>How to get this</span>
                </div>
              )}
              {item.officialSourceUrl && (
                <a
                  href={item.officialSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 underline hover:text-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Official source
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      </li>
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {checklist.category}
          </Badge>
          {checklist.country && <Badge variant="outline">{checklist.country}</Badge>}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{checklist.title}</h1>
        <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Estimated processing: ~{checklist.estimatedDays} days
        </p>

        <div className="mt-8 rounded-lg border bg-card p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Your progress</span>
            <span className="text-muted-foreground">
              {completed} / {total} complete
            </span>
          </div>
          <Progress value={percent} />
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={reset} disabled={completed === 0}>
              Reset
            </Button>
          </div>
        </div>

        {checklist.sections ? (
          <div className="mt-6 space-y-8">
            {checklist.sections.map((section) => (
              <section key={section.id}>
                <h2 className="mb-3 text-lg font-semibold">{section.title}</h2>
                <ul className="space-y-3">{section.items.map(renderItem)}</ul>
              </section>
            ))}
          </div>
        ) : (
          <ul className="mt-6 space-y-3">{(checklist.items ?? []).map(renderItem)}</ul>
        )}
      </div>
      <DocumentChatbot documentType={checklist.title} />
    </main>
  );
}

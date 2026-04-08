"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Info, ArrowLeft, Clock } from "lucide-react";
import type { DocumentChecklist } from "@/data/checklists";
import DocumentChatbot from "@/components/DocumentChatbot";

type Props = { checklist: DocumentChecklist };

export default function ChecklistView({ checklist }: Props) {
  const storageKey = `dd:checklist:${checklist.id}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, [storageKey]);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {}
  }, [checked, storageKey, hydrated]);

  const { completed, total, percent } = useMemo(() => {
    const total = checklist.items.length;
    const completed = checklist.items.filter((i) => checked[i.id]).length;
    return { completed, total, percent: total ? (completed / total) * 100 : 0 };
  }, [checked, checklist.items]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const reset = () => setChecked({});

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/"
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

        {/* Progress */}
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

        {/* Items */}
        <ul className="mt-6 space-y-3">
          {checklist.items.map((item) => {
            const isChecked = !!checked[item.id];
            return (
              <li key={item.id}>
                <Card
                  onClick={() => toggle(item.id)}
                  className={`cursor-pointer transition-all hover:border-primary ${
                    isChecked ? "border-primary/50 bg-primary/5" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggle(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
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
                          <CardDescription className="mt-1">
                            {item.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {item.howToGet && (
                    <CardContent>
                      <div
                        className="group relative inline-flex items-center gap-1 text-xs text-muted-foreground"
                        title={item.howToGet}
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span className="underline decoration-dotted">How to get this</span>
                        <span className="pointer-events-none absolute left-0 top-full z-10 mt-1 hidden w-64 rounded-md border bg-popover p-2 text-xs text-popover-foreground shadow-md group-hover:block">
                          {item.howToGet}
                        </span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
      <DocumentChatbot documentType={checklist.title} />
    </main>
  );
}

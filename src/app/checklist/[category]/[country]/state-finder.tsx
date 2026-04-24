"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { DocumentTypeEntry } from "@/data/documentTypes";

type Props = {
  entries: DocumentTypeEntry[];
  cat: string;
  country: string;
};

export default function StateFinderClient({ entries, cat, country }: Props) {
  const [query, setQuery] = useState("");
  const [variant, setVariant] = useState<"all" | "new" | "renewal">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (variant !== "all" && !e.id.endsWith(`-${variant}`)) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    });
  }, [entries, query, variant]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by state (e.g. Texas, California, NY)"
            className="w-full rounded-md border bg-background px-9 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-1 rounded-md border bg-background p-1 text-sm">
          {(["all", "new", "renewal"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`rounded px-3 py-1 capitalize transition ${
                variant === v
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {v === "all" ? "All" : v === "new" ? "First-time" : "Renewal"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <Link
            key={e.id}
            href={`/checklist/${cat}/${country}/${e.id}`}
            className="group"
          >
            <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">{e.title}</CardTitle>
                <CardDescription>{e.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary">Continue →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">
          No matches. Try another search.
        </p>
      )}
    </div>
  );
}

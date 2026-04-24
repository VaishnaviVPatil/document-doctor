import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getCountry, type DocumentCategory } from "@/data/countries";
import { getDocumentTypes } from "@/data/documentTypes";
import StateFinderClient from "./state-finder";

const VALID: DocumentCategory[] = ["visa", "permit", "license", "passport"];

export default async function DocTypePickerPage({
  params,
}: {
  params: Promise<{ category: string; country: string }>;
}) {
  const { category, country } = await params;
  if (!VALID.includes(category as DocumentCategory)) notFound();
  const countryInfo = getCountry(country);
  if (!countryInfo) notFound();

  const cat = category as DocumentCategory;
  const entries = getDocumentTypes(cat, country);

  const groups: Record<string, typeof entries> = {};
  for (const e of entries) {
    const key = e.group ?? "";
    (groups[key] ||= []).push(e);
  }
  const groupKeys = Object.keys(groups);

  const isStateLevel = cat === "license" && country.toLowerCase() === "us";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href={`/checklist/${cat}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-3xl">{countryInfo.flag}</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{countryInfo.name}</h1>
            <p className="text-sm text-muted-foreground capitalize">{cat}</p>
          </div>
        </div>

        {entries.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">
            No document types defined for this combination yet.
          </p>
        ) : isStateLevel ? (
          <StateFinderClient entries={entries} cat={cat} country={country} />
        ) : (
          <div className="mt-8 space-y-8">
            {groupKeys.map((g) => (
              <section key={g || "default"}>
                {g && <h2 className="mb-3 text-sm font-semibold">{g}</h2>}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {groups[g].map((e) => {
                    const href =
                      e.legacyRoute ?? `/checklist/${cat}/${country}/${e.id}`;
                    const disabled = !e.checklistId && !e.legacyRoute;
                    return (
                      <Link
                        key={e.id}
                        href={disabled ? "#" : href}
                        aria-disabled={disabled}
                        className={disabled ? "pointer-events-none opacity-50" : "group"}
                      >
                        <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-base">{e.title}</CardTitle>
                            <CardDescription>{e.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <span className="text-sm font-medium text-primary">
                              {disabled ? "Coming soon" : "Continue →"}
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

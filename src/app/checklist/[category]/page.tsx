import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getCountriesForCategory, type DocumentCategory } from "@/data/countries";

const VALID: DocumentCategory[] = ["visa", "permit", "license", "passport"];

const CATEGORY_LABEL: Record<DocumentCategory, string> = {
  visa: "Visa",
  permit: "Business Permit",
  license: "Driver's License",
  passport: "Passport",
};

export default async function CountryPickerPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!VALID.includes(category as DocumentCategory)) notFound();

  const cat = category as DocumentCategory;
  const countries = getCountriesForCategory(cat);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <h1 className="text-3xl font-bold tracking-tight">{CATEGORY_LABEL[cat]}</h1>
        <p className="mt-2 text-muted-foreground">
          Choose the country you&apos;re applying in or to.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => (
            <Link key={c.code} href={`/checklist/${cat}/${c.code}`} className="group">
              <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 text-3xl">{c.flag}</div>
                  <CardTitle>{c.name}</CardTitle>
                  <CardDescription>
                    View available {CATEGORY_LABEL[cat].toLowerCase()} options.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-sm font-medium text-primary">Continue →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {countries.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">
            No countries supported for this category yet. Check back soon.
          </p>
        )}
      </div>
    </main>
  );
}

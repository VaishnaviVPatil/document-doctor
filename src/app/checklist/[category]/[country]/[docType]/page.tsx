import { notFound, redirect } from "next/navigation";
import { resolveChecklist, type DocumentChecklist } from "@/data/checklists";
import { getDocumentType } from "@/data/documentTypes";
import { getCountry, type DocumentCategory } from "@/data/countries";
import ChecklistView from "@/components/ChecklistView";

const VALID: DocumentCategory[] = ["visa", "permit", "license", "passport"];

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ category: string; country: string; docType: string }>;
}) {
  const { category, country, docType } = await params;
  if (!VALID.includes(category as DocumentCategory)) notFound();
  if (!getCountry(country)) notFound();

  const cat = category as DocumentCategory;
  const entry = getDocumentType(cat, country, docType);
  if (!entry) notFound();

  // If this doc type has a legacy deep route (e.g. France intake), go there.
  if (entry.legacyRoute) redirect(entry.legacyRoute);

  if (!entry.checklistId) {
    // No checklist built yet — show a "coming soon" state inline.
    return <ComingSoon title={entry.title} />;
  }

  const checklist: DocumentChecklist | undefined = resolveChecklist(entry.checklistId);
  if (!checklist) notFound();

  return <ChecklistView checklist={checklist} backHref={`/checklist/${cat}/${country}`} />;
}

function ComingSoon({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-4 text-muted-foreground">
          We&apos;re still building the official checklist for this document.
          Check back soon.
        </p>
      </div>
    </main>
  );
}

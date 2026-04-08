import { notFound } from "next/navigation";
import { CHECKLISTS } from "@/data/checklists";
import ChecklistView from "./checklist-view";

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  // Only the legacy flat-items checklists are rendered here.
  // Rich (sectioned) checklists like the Paris visa have their own routes.
  const flat = CHECKLISTS.filter((c) => c.items && !c.sections);

  const byId = flat.find((c) => c.id === type);
  const matches = byId ? [byId] : flat.filter((c) => c.category === type);

  if (matches.length === 0) notFound();

  return <ChecklistView checklist={matches[0]} />;
}

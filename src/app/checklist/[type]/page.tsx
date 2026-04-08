import { notFound } from "next/navigation";
import { CHECKLISTS } from "@/data/checklists";
import ChecklistView from "./checklist-view";

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;

  // `type` may be either a checklist id (e.g. "france-visa-tourist")
  // or a category (e.g. "visa"). Resolve both.
  const byId = CHECKLISTS.find((c) => c.id === type);
  const matches = byId ? [byId] : CHECKLISTS.filter((c) => c.category === type);

  if (matches.length === 0) notFound();

  // For now, render the first matching checklist.
  const checklist = matches[0];

  return <ChecklistView checklist={checklist} />;
}

export default async function ChecklistPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  return <div>Checklist: {type}</div>;
}

import { addSub } from "@/lib/reminderStore";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, visaId, travelDate, frequency, pendingItems } = body ?? {};

  if (!email || !visaId || !travelDate || !frequency) {
    return Response.json({ error: "missing fields" }, { status: 400 });
  }
  if (!["daily", "every3days", "weekly"].includes(frequency)) {
    return Response.json({ error: "bad frequency" }, { status: 400 });
  }

  const sub = await addSub({
    email,
    visaId,
    travelDate,
    frequency,
    pendingItems: Array.isArray(pendingItems) ? pendingItems : [],
  });

  return Response.json({ id: sub.id });
}

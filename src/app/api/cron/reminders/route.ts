import { Resend } from "resend";
import { listSubs, updateSub, type ReminderSub } from "@/lib/reminderStore";

const FREQ_DAYS: Record<ReminderSub["frequency"], number> = {
  daily: 1,
  every3days: 3,
  weekly: 7,
};
const DAY_MS = 24 * 60 * 60 * 1000;

function isDue(sub: ReminderSub, now: Date): boolean {
  if (!sub.lastSentAt) return true;
  const last = new Date(sub.lastSentAt).getTime();
  const need = FREQ_DAYS[sub.frequency] * DAY_MS;
  return now.getTime() - last >= need;
}

function buildBody(sub: ReminderSub, now: Date): { subject: string; html: string } {
  const travel = new Date(sub.travelDate);
  const daysUntil = Math.round((travel.getTime() - now.getTime()) / DAY_MS);

  const itemRows = sub.pendingItems
    .map((i) => {
      const due = i.dueDate
        ? `<span style="color:#888"> (due ${new Date(i.dueDate).toDateString()})</span>`
        : "";
      return `<li>${escapeHtml(i.label)}${due}</li>`;
    })
    .join("");

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2>Document Doctor — visa reminder</h2>
      <p>Your trip is in <b>${daysUntil} days</b> (${travel.toDateString()}).</p>
      <p>You still have <b>${sub.pendingItems.length}</b> document(s) pending:</p>
      <ul>${itemRows || "<li>None — you're all set!</li>"}</ul>
      <p style="color:#888;font-size:12px">You're receiving this because you set ${sub.frequency} reminders for your France Schengen visa application.</p>
    </div>`;

  return {
    subject: `Visa checklist — ${sub.pendingItems.length} item(s) pending, ${daysUntil} days to go`,
    html,
  };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  if (!process.env.CRON_SECRET || auth !== expected) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.REMINDER_FROM;
  if (!apiKey || !from) {
    return Response.json(
      { error: "RESEND_API_KEY or REMINDER_FROM not configured" },
      { status: 500 }
    );
  }
  const resend = new Resend(apiKey);

  const subs = await listSubs();
  const now = new Date();
  const sent: string[] = [];
  const skipped: string[] = [];

  for (const sub of subs) {
    if (!isDue(sub, now)) {
      skipped.push(sub.id);
      continue;
    }
    const { subject, html } = buildBody(sub, now);
    try {
      await resend.emails.send({ from, to: sub.email, subject, html });
      await updateSub(sub.id, { lastSentAt: now.toISOString() });
      sent.push(sub.id);
    } catch (err) {
      console.error("reminder send failed", sub.id, err);
    }
  }

  return Response.json({ sent, skipped });
}

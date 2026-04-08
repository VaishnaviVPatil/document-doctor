import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type PendingItem = {
  id: string;
  label: string;
  dueDate?: string; // ISO
};

export type ReminderSub = {
  id: string;
  email: string;
  visaId: string;
  travelDate: string; // ISO
  frequency: "daily" | "every3days" | "weekly";
  createdAt: string;
  lastSentAt?: string;
  pendingItems: PendingItem[];
};

const FILE = path.join(process.cwd(), "data", "reminders.json");

async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]", "utf8");
  }
}

export async function listSubs(): Promise<ReminderSub[]> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  try {
    return JSON.parse(raw) as ReminderSub[];
  } catch {
    return [];
  }
}

export async function addSub(
  sub: Omit<ReminderSub, "id" | "createdAt">
): Promise<ReminderSub> {
  const all = await listSubs();
  const newSub: ReminderSub = {
    ...sub,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  all.push(newSub);
  await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf8");
  return newSub;
}

export async function updateSub(
  id: string,
  patch: Partial<ReminderSub>
): Promise<void> {
  const all = await listSubs();
  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...patch };
  await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf8");
}

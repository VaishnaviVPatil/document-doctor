#!/usr/bin/env -S npx tsx
/** Dumps the live photo-item validation rules from every registered checklist. */
import { CHECKLISTS, getAllItems } from "../src/data/checklists";

const fmtBytes = (b?: number) =>
  b === undefined ? "—" : b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;

const rows: string[][] = [
  ["Checklist", "Item", "MIME", "Bytes", "Min px", "Max px", "Aspect"],
];

for (const c of CHECKLISTS) {
  for (const item of getAllItems(c)) {
    const v = item.validation;
    if (!v?.image) continue; // only rows with image rules
    const img = v.image;
    rows.push([
      c.id,
      item.id,
      v.mimeTypes ? [...v.mimeTypes].join("+") : "any",
      `${fmtBytes(v.minBytes)}–${fmtBytes(v.maxBytes)}`,
      `${img.minWidth ?? "—"}×${img.minHeight ?? "—"}`,
      `${img.maxWidth ?? "—"}×${img.maxHeight ?? "—"}`,
      img.aspectRatio ? img.aspectRatio.toFixed(3) : "—",
    ]);
  }
}

const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => r[i].length)));
for (const r of rows) {
  console.log(r.map((cell, i) => cell.padEnd(widths[i])).join("  "));
}

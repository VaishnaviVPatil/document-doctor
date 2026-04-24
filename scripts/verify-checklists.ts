#!/usr/bin/env -S npx tsx
/**
 * Structural verification of every registered checklist:
 *   1. IDs are unique.
 *   2. Every uploadable item has a `validation` block.
 *   3. acceptedMimeTypes and validation.mimeTypes agree.
 *   4. Byte bounds are sensible (min ≤ max).
 *   5. Image rules (width/height/aspect) are internally consistent.
 *   6. Known gov specs are met (spot-checks on Schengen / US / India photos).
 *
 * Run with:  npx tsx scripts/verify-checklists.ts
 */

import { CHECKLISTS, resolveChecklist, getAllItems } from "../src/data/checklists";
import { US_STATES } from "../src/data/states-us";
import { DOCUMENT_TYPES } from "../src/data/documentTypes";
import { COUNTRIES } from "../src/data/countries";
import type { ChecklistItem } from "../src/data/checklists";

type Fail = { checklist: string; item: string; problem: string };
const fails: Fail[] = [];

function fail(checklist: string, item: string, problem: string) {
  fails.push({ checklist, item, problem });
}

function checkItem(checklistId: string, item: ChecklistItem) {
  if (!item.uploadable) return;

  const v = item.validation;
  if (!v) {
    fail(checklistId, item.id, "uploadable but has no validation block");
    return;
  }

  if (v.minBytes && v.maxBytes && v.minBytes > v.maxBytes) {
    fail(checklistId, item.id, `minBytes ${v.minBytes} > maxBytes ${v.maxBytes}`);
  }

  if (item.acceptedMimeTypes && v.mimeTypes) {
    const a = [...item.acceptedMimeTypes].sort();
    const b = [...v.mimeTypes].sort();
    if (a.length !== b.length || a.some((x, i) => x !== b[i])) {
      fail(
        checklistId,
        item.id,
        `acceptedMimeTypes [${a.join(",")}] disagree with validation.mimeTypes [${b.join(",")}]`
      );
    }
  }

  if (v.image) {
    const img = v.image;
    if (img.minWidth && img.maxWidth && img.minWidth > img.maxWidth)
      fail(checklistId, item.id, `image.minWidth > maxWidth`);
    if (img.minHeight && img.maxHeight && img.minHeight > img.maxHeight)
      fail(checklistId, item.id, `image.minHeight > maxHeight`);
    if (img.aspectRatio && img.minWidth && img.minHeight) {
      const actual = img.minWidth / img.minHeight;
      const delta = Math.abs(actual - img.aspectRatio) / img.aspectRatio;
      if (delta > 0.02)
        fail(
          checklistId,
          item.id,
          `min dims ${img.minWidth}×${img.minHeight} give aspect ${actual.toFixed(3)}, expected ${img.aspectRatio.toFixed(3)} (Δ ${(delta * 100).toFixed(1)}%)`
        );
    }
  }
}

// ---- 1. Unique IDs across static + dynamic US license checklists
const seen = new Map<string, string>();
const all: { id: string; label: string }[] = [];

for (const c of CHECKLISTS) {
  if (seen.has(c.id)) fail(c.id, "-", `duplicate checklist id (also: ${seen.get(c.id)})`);
  seen.set(c.id, c.title);
  all.push({ id: c.id, label: c.title });
}

// Dynamically-built US license checklists
for (const s of US_STATES) {
  for (const variant of ["new", "renewal"] as const) {
    const id = `license-us-${s.code}-${variant}`;
    const c = resolveChecklist(id);
    if (!c) {
      fail(id, "-", "resolveChecklist returned undefined for registered dynamic id");
      continue;
    }
    if (seen.has(c.id)) fail(c.id, "-", `duplicate dynamic id`);
    seen.set(c.id, c.title);
    all.push({ id: c.id, label: c.title });
  }
}

// Every visa registry entry must resolve to a checklist (static or dynamic)
// AND that checklist must have a photo item with image validation.
let visaEntriesChecked = 0;
let visaPhotoMissing = 0;
for (const [cc, entries] of Object.entries(DOCUMENT_TYPES.visa)) {
  for (const e of entries) {
    visaEntriesChecked++;
    if (e.legacyRoute) continue; // legacy routes don't use our checklist system
    if (!e.checklistId) {
      fail(`visa/${cc}/${e.id}`, "-", "no checklistId and no legacyRoute");
      continue;
    }
    const c = resolveChecklist(e.checklistId);
    if (!c) {
      fail(e.checklistId, "-", `registered but resolveChecklist returned undefined`);
      continue;
    }
    const items = getAllItems(c);
    const photo = items.find(
      (i) => /^photo/.test(i.id) || /photo/i.test(i.label)
    );
    if (!photo) {
      fail(c.id, "-", "no photo item found");
      visaPhotoMissing++;
      continue;
    }
    if (!photo.validation?.image) {
      fail(c.id, photo.id, "photo item has no image validation rules");
      visaPhotoMissing++;
    }
    all.push({ id: c.id, label: c.title });
  }
}

// ---- 2. Walk items in every checklist
for (const { id } of all) {
  const c = resolveChecklist(id)!;
  for (const item of getAllItems(c)) checkItem(c.id, item);
}

// ---- 3. Gov-spec spot checks
type SpotCheck = {
  checklistId: string;
  itemId: string;
  expect: {
    aspectRatio?: number;
    minWidth?: number;
    minHeight?: number;
    maxBytes?: number;
    minBytes?: number;
    mimeTypes?: string[];
  };
  source: string;
};

const spotChecks: SpotCheck[] = [
  // France / Schengen: 35×45 mm biometric, ≥413×531 px @ 300dpi
  {
    checklistId: "france-paris-tourist",
    itemId: "photos",
    expect: { aspectRatio: 35 / 45, minWidth: 413, minHeight: 531 },
    source: "france-visas.gouv.fr — Schengen biometric photo spec",
  },
  {
    checklistId: "visa-fr-student",
    itemId: "photos",
    expect: { aspectRatio: 35 / 45, minWidth: 413, minHeight: 531 },
    source: "france-visas.gouv.fr",
  },
  {
    checklistId: "visa-fr-work",
    itemId: "photos",
    expect: { aspectRatio: 35 / 45, minWidth: 413, minHeight: 531 },
    source: "france-visas.gouv.fr",
  },
  {
    checklistId: "visa-fr-family",
    itemId: "photos",
    expect: { aspectRatio: 35 / 45, minWidth: 413, minHeight: 531 },
    source: "france-visas.gouv.fr",
  },
  // USA: 2×2 in, 600×600 to 1200×1200 px, JPEG ≤ 240 KB (DS-160 upload limit)
  ...["visa-us-b1", "visa-us-b2", "visa-us-f1", "visa-us-j1", "visa-us-h1b"].map(
    (id) => ({
      checklistId: id,
      itemId: "photo",
      expect: {
        aspectRatio: 1,
        minWidth: 600,
        minHeight: 600,
        maxBytes: 240 * 1024,
        mimeTypes: ["image/jpeg"],
      },
      source: "travel.state.gov photo guidelines; DS-160 upload limit 240 KB",
    })
  ),
  // USA passport renewal: 2×2 in, square, ≤ 10 MB
  {
    checklistId: "passport-us-renewal",
    itemId: "passport-photo",
    expect: {
      aspectRatio: 1,
      minWidth: 600,
      minHeight: 600,
      mimeTypes: ["image/jpeg", "image/png"],
    },
    source: "travel.state.gov/passport/photos",
  },
  // India e-visa: JPEG square ≥350×350 px, 10 KB – 1 MB
  ...["visa-in-e-tourist", "visa-in-e-business", "visa-in-e-medical"].map((id) => ({
    checklistId: id,
    itemId: "photo",
    expect: {
      aspectRatio: 1,
      minWidth: 350,
      minHeight: 350,
      minBytes: 10 * 1024,
      maxBytes: 1024 * 1024,
      mimeTypes: ["image/jpeg"],
    },
    source: "indianvisaonline.gov.in photo spec",
  })),
  // India e-visa passport scan: PDF 10 KB – 300 KB
  ...["visa-in-e-tourist", "visa-in-e-business", "visa-in-e-medical"].map((id) => ({
    checklistId: id,
    itemId: "passport-scan",
    expect: {
      minBytes: 10 * 1024,
      maxBytes: 300 * 1024,
      mimeTypes: ["application/pdf"],
    },
    source: "indianvisaonline.gov.in passport scan spec",
  })),
  // India regular tourist / student: 2×2 in, white bg, ≥600×600
  {
    checklistId: "visa-in-tourist",
    itemId: "photos",
    expect: { aspectRatio: 1, minWidth: 600, minHeight: 600 },
    source: "MEA regular visa photo spec",
  },
  {
    checklistId: "visa-in-student",
    itemId: "photos",
    expect: { aspectRatio: 1, minWidth: 600, minHeight: 600 },
    source: "MEA regular visa photo spec",
  },
];

for (const sc of spotChecks) {
  const c = resolveChecklist(sc.checklistId);
  if (!c) {
    fail(sc.checklistId, sc.itemId, `checklist not found`);
    continue;
  }
  const item = getAllItems(c).find((i) => i.id === sc.itemId);
  if (!item) {
    fail(sc.checklistId, sc.itemId, `item not found`);
    continue;
  }
  const v = item.validation;
  if (!v) {
    fail(sc.checklistId, sc.itemId, `no validation block`);
    continue;
  }
  const e = sc.expect;
  if (e.aspectRatio !== undefined && Math.abs((v.image?.aspectRatio ?? 0) - e.aspectRatio) > 0.001)
    fail(c.id, item.id, `aspect expected ${e.aspectRatio.toFixed(3)}, got ${v.image?.aspectRatio}`);
  if (e.minWidth !== undefined && (v.image?.minWidth ?? 0) < e.minWidth)
    fail(c.id, item.id, `minWidth expected ≥${e.minWidth}, got ${v.image?.minWidth}`);
  if (e.minHeight !== undefined && (v.image?.minHeight ?? 0) < e.minHeight)
    fail(c.id, item.id, `minHeight expected ≥${e.minHeight}, got ${v.image?.minHeight}`);
  if (e.maxBytes !== undefined && (v.maxBytes ?? Infinity) > e.maxBytes)
    fail(c.id, item.id, `maxBytes expected ≤${e.maxBytes}, got ${v.maxBytes}`);
  if (e.minBytes !== undefined && (v.minBytes ?? 0) < e.minBytes)
    fail(c.id, item.id, `minBytes expected ≥${e.minBytes}, got ${v.minBytes}`);
  if (e.mimeTypes) {
    const want = e.mimeTypes.slice().sort().join(",");
    const got = (v.mimeTypes ? [...v.mimeTypes] : []).sort().join(",");
    if (want !== got) fail(c.id, item.id, `mimeTypes expected [${want}], got [${got}]`);
  }
}

// ---- Report
console.log(`\nVerified ${all.length} checklists`);
console.log(`  static: ${CHECKLISTS.length}`);
console.log(`  dynamic US DLs: ${US_STATES.length * 2}`);
console.log(`  visa registry entries: ${visaEntriesChecked}`);
console.log(`  visa countries covered: ${Object.keys(DOCUMENT_TYPES.visa).length} of ${COUNTRIES.filter((c) => c.supportedCategories.includes("visa")).length}`);
console.log(`  spot-checks: ${spotChecks.length}`);
if (fails.length === 0) {
  console.log(`\n  ALL CHECKS PASS.\n`);
  process.exit(0);
} else {
  console.log(`\n  ${fails.length} failures:\n`);
  for (const f of fails) console.log(`  - [${f.checklist}] ${f.item}: ${f.problem}`);
  process.exit(1);
}

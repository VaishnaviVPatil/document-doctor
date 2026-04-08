import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  const itemLabel = String(form.get("itemLabel") ?? "");
  const itemDescription = String(form.get("itemDescription") ?? "");
  const officialSourceUrl = String(form.get("officialSourceUrl") ?? "https://france-visas.gouv.fr");
  const visaTitle = String(form.get("visaTitle") ?? "France Schengen visa");
  let hints: string[] = [];
  try {
    const raw = form.get("validationHints");
    if (typeof raw === "string" && raw) hints = JSON.parse(raw);
  } catch {}

  if (!(file instanceof File)) {
    return Response.json({ error: "file required" }, { status: 400 });
  }
  if (!itemLabel) {
    return Response.json({ error: "itemLabel required" }, { status: 400 });
  }

  // Read file in-memory only — no disk persistence.
  const buf = Buffer.from(await file.arrayBuffer());
  const base64 = buf.toString("base64");
  const mediaType = file.type || "application/octet-stream";

  const hintsBlock = hints.length
    ? hints.map((h) => `- ${h}`).join("\n")
    : "- Confirm the document looks like the type expected by its label.";

  const systemPrompt = `You are validating a single document a user is uploading for a ${visaTitle} application.

Document being checked: "${itemLabel}"
Description: ${itemDescription || "(none)"}

Validation rules to verify:
${hintsBlock}

Use the web_search tool to confirm the current official France-Visas / VFS Global requirements at ${officialSourceUrl} before deciding.

Return your final answer as STRICT JSON only, with this exact shape and no markdown fences:
{"status":"pass"|"warn"|"fail","reasons":string[],"citations":string[]}`;

  type ContentBlock =
    | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
    | { type: "document"; source: { type: "base64"; media_type: string; data: string } }
    | { type: "text"; text: string };

  const isImage = mediaType.startsWith("image/");
  const isPdf = mediaType === "application/pdf";

  const userContent: ContentBlock[] = [];
  if (isImage) {
    userContent.push({
      type: "image",
      source: { type: "base64", media_type: mediaType, data: base64 },
    });
  } else if (isPdf) {
    userContent.push({
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: base64 },
    });
  } else {
    return Response.json(
      { error: `unsupported file type: ${mediaType}` },
      { status: 415 }
    );
  }
  userContent.push({
    type: "text",
    text: "Validate this file against the rules above. Respond with JSON only.",
  });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: [{ role: "user", content: userContent as any }],
    });

    const text =
      response.content
        .filter((b) => b.type === "text")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((b: any) => b.text as string)
        .join("\n") || "";

    const match = text.match(/\{[\s\S]*\}/);
    let parsed: { status: string; reasons: string[]; citations: string[] } | null = null;
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {}
    }

    if (!parsed) {
      return Response.json({
        status: "warn",
        reasons: ["Could not parse model response.", text.slice(0, 500)],
        citations: [],
      });
    }
    return Response.json(parsed);
  } catch (err) {
    return Response.json(
      {
        status: "warn",
        reasons: [
          "Validator error: " + (err instanceof Error ? err.message : String(err)),
        ],
        citations: [],
      },
      { status: 200 }
    );
  }
}

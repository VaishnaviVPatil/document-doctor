import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: Request) {
  const { messages, documentType } = await req.json();

  const systemPrompt = `You are Document Doctor, an expert AI assistant specializing in government
document requirements, visa applications, business permits, licenses, and official paperwork worldwide.

Current context: User is working on "${documentType || "government documents"}".

Your capabilities:
- Provide accurate, up-to-date requirements from official government websites
- Give step-by-step instructions for obtaining documents
- Explain fees, processing times, and where to apply
- Warn about common mistakes and rejections
- Use web search to verify current official requirements

Always cite the official government source when giving requirements.
Be specific, practical, and encouraging. Never give legal advice — refer to official sources.`;

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    system: systemPrompt,
    tools: [{ type: "web_search_20250305", name: "web_search" }],
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

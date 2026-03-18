import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

function getClient(apiKey?: string, baseURL?: string): Anthropic {
  if (apiKey && baseURL) return new Anthropic({ apiKey, baseURL });
  if (apiKey) return new Anthropic({ apiKey });
  return new Anthropic();
}

interface RouteRequest {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  model: string;
  apiKey?: string;
  anthropicApiUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { messages, model, apiKey, anthropicApiUrl } = data as RouteRequest;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "messages required" },
        { status: 400 }
      );
    }

    const client = getClient(apiKey, anthropicApiUrl);

    const message = await client.messages.create({
      model,
      max_tokens: 4096,
      system: `You are a design strategy consultant helping designers plan and ideate before building. Your output is always structured Markdown. You help with:
- Design direction and concept exploration
- Layout and hierarchy decisions
- Color, typography, and visual style recommendations
- User flow and interaction planning
- Content structure and copywriting

Be concise and practical. Use headers, bullet points, and short paragraphs. Avoid lengthy prose.`,
      messages,
    });

    const response =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ response });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Ideate generation failed";
    console.error("Ideate error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

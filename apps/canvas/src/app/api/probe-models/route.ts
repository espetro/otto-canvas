import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

interface RouteRequest {
  apiKey?: string;
  anthropicApiUrl?: string;
  modelList: string[];
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { apiKey, anthropicApiUrl, modelList } = data as RouteRequest;

    if (!apiKey) {
      return NextResponse.json({ error: "apiKey required" }, { status: 400 });
    }

    const config: { apiKey?: string; baseURL?: string } = {};
    if (apiKey) config.apiKey = apiKey;
    if (anthropicApiUrl) config.baseURL = anthropicApiUrl;
    const client = new Anthropic(config);

    // Probe sequentially to avoid rate limits
    const available: Record<string, boolean> = {};

    for (const model of modelList) {
      try {
        await client.messages.create({
          model,
          max_tokens: 1,
          messages: [{ role: "user", content: "hi" }],
        });
        available[model] = true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`Probe ${model}:`, msg);

        // Only mark unavailable for definitive "not found" errors
        if (
          msg.includes("not_found") ||
          msg.includes("404") ||
          msg.includes("Could not resolve") ||
          msg.includes("does not exist")
        ) {
          available[model] = false;
        } else {
          // Rate limit, overloaded, timeout, or any other error — assume available
          available[model] = true;
        }
      }
    }

    return NextResponse.json({ available });
  } catch (err) {
    console.error("Probe error:", err);
    return NextResponse.json({ error: "Probe failed" }, { status: 500 });
  }
}

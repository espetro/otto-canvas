import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { parseHtmlWithSize } from "@otto/core/parsers";
import { stripBase64Images } from "@otto/core/processors";

export const maxDuration = 300;

const DEFAULT_MODEL = "claude-opus-4-6";

function getClient(apiKey?: string, baseURL?: string): Anthropic {
  if (apiKey && baseURL) return new Anthropic({ apiKey, baseURL });
  if (apiKey) return new Anthropic({ apiKey });
  return new Anthropic();
}

export async function POST(req: NextRequest) {
  try {
    const { html, prompt, width, height, model, apiKey, anthropicApiUrl } = await req.json();
    const useModel = model || DEFAULT_MODEL;
    const client = getClient(apiKey, anthropicApiUrl);

    const { stripped, restore } = stripBase64Images(html);

    const message = await client.messages.create({
      model: useModel,
      max_tokens: 16384,
      messages: [{
        role: "user",
        content: `You are a design quality reviewer. Review this HTML/CSS design and fix any issues.

Original request: "${prompt}"
Target size: ${width || "auto"}x${height || "auto"}

Current HTML:
${stripped}

Note: [IMAGE_PLACEHOLDER_N] references are real images — keep all <img> tags and their src attributes exactly as-is.

REVIEW CHECKLIST:
1. Typography — proper hierarchy, readable sizes, good line-height
2. Spacing — consistent padding/margins, nothing cramped
3. Colors — harmonious palette, sufficient contrast
4. Layout — proper alignment, no overflow issues
5. Images — properly sized, good aspect ratios, rounded corners match design
6. Overall polish — does it look professional and intentional?

If the design is good, return it unchanged.
If there are issues, fix them and return the corrected version.

RULES:
- Return ONLY the HTML — no explanation, no markdown, no code fences
- Start with <!--size:WIDTHxHEIGHT--> on the first line
- Keep the same structure and images (don't remove <img> tags)
- No animations, transitions, or hover effects
- Self-contained, no external dependencies`,
      }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = parseHtmlWithSize(raw);
    return NextResponse.json({ html: restore(parsed.html), width: parsed.width || width, height: parsed.height || height });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Review failed";
    console.error("Review error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

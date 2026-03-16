import Anthropic from "@anthropic-ai/sdk";
import { ModelInfo } from "@anthropic-ai/sdk/resources";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

interface RouteRequest {
  apiKey?: string;
  anthropicApiUrl?: string;
}

interface SimpleModelInfo {
  id: string;
  displayName: string;
  description: string;
}

// Map of known model IDs to their display names and descriptions
// This helps us provide better labels for models even if the API doesn't
const MODEL_METADATA: Record<string, { displayName: string; description: string }> = {
  "claude-opus-4-6": { displayName: "Opus 4.6", description: "Best quality, slowest" },
  "claude-opus-4-5": { displayName: "Opus 4.5", description: "Creative + powerful" },
  "claude-opus-4-5-20250918": { displayName: "Opus 4.5", description: "Creative + powerful" },
  "claude-sonnet-4-5": { displayName: "Sonnet 4.5", description: "Fast + great" },
  "claude-opus-4": { displayName: "Opus 4", description: "High quality, slower" },
  "claude-opus-4-20250514": { displayName: "Opus 4", description: "High quality, slower" },
  "claude-sonnet-4": { displayName: "Sonnet 4", description: "Fast, reliable" },
  "claude-sonnet-4-20250514": { displayName: "Sonnet 4", description: "Fast, reliable" },
  "claude-3-7-sonnet-20250219": { displayName: "Sonnet 3.7", description: "Fast, reliable" },
  "claude-3-5-sonnet-20241022": { displayName: "Sonnet 3.5", description: "Fast, reliable" },
  "claude-3-5-haiku-20241022": { displayName: "Haiku 3.5", description: "Fastest, lightweight" },
  "claude-3-haiku-20240307": { displayName: "Haiku 3", description: "Fastest, lightweight" },
  "claude-3-opus-20240229": { displayName: "Opus 3", description: "High quality" },
  "claude-3-5-sonnet-20240620": { displayName: "Sonnet 3.5", description: "Fast, reliable" },
};

const sortClaudeModels = (a: SimpleModelInfo, b: SimpleModelInfo) => {
  // Sort: Opus first, then Sonnet, then Haiku
  const getPriority = (id: string) => {
    if (id.includes("opus")) return 0;
    if (id.includes("sonnet")) return 1;
    if (id.includes("haiku")) return 2;
    return 3;
  };
  const priorityDiff = getPriority(a.id) - getPriority(b.id);
  if (priorityDiff !== 0) return priorityDiff;
  // Within same family, sort by version (newer first)
  return b.id.localeCompare(a.id);
};

function getClient(apiKey?: string, baseURL?: string): Anthropic {
  if (apiKey && baseURL) return new Anthropic({ apiKey, baseURL });
  if (apiKey) return new Anthropic({ apiKey });
  return new Anthropic();
}

function getModelMetadata(_: ModelInfo): Omit<SimpleModelInfo, "id"> {
  if (_.id.includes("claude-")) {
    // Check for exact match first
    if (MODEL_METADATA[_.id]) {
      return MODEL_METADATA[_.id];
    }

    // Check for partial matches (e.g., "claude-opus-4-6-20251231" should match "claude-opus-4-6")
    for (const [key, metadata] of Object.entries(MODEL_METADATA)) {
      if (_.id.startsWith(key) || key.startsWith(_.id.split("-").slice(0, -1).join("-"))) {
        return metadata;
      }
    }
  }

  return {
    displayName: _.display_name,
    description: `No information available`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { apiKey, anthropicApiUrl } = (await req.json()) as RouteRequest;

    const client = getClient(apiKey, anthropicApiUrl);

    // Fetch models from Anthropic API
    const modelsResponse = await client.models.list();

    // Transform to our format with metadata
    const models: SimpleModelInfo[] = modelsResponse.data.map((model) => {
      const metadata = getModelMetadata(model);
      return { ...metadata, id: model.id };
    });

    if (models.some((_) => _.id.includes("claude-"))) {
      models.sort(sortClaudeModels);
    }

    return NextResponse.json({ models });
  } catch (err) {
    console.error("Models fetch error:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch models";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  // Return empty for GET requests - we use POST to pass credentials
  return NextResponse.json({ error: "Use POST with apiKey" }, { status: 405 });
}

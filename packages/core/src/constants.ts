import type { PipelineStage } from "@otto/types/pipeline";

// Default fallback chain — if requested model fails, try next one down
// This will be overridden by modelList from request if provided
export const DEFAULT_FALLBACK_CHAIN = [
  "claude-opus-4-6",
  "claude-sonnet-4-5",
  "claude-opus-4",
  "claude-sonnet-4",
];

export const DEFAULT_MODEL = "claude-opus-4-6";

export const VARIATION_STYLES = [
  "Refined and premium — think Stripe or Linear. Subtle gradients, generous whitespace, sophisticated color palette, polished micro-details",
  "Bold and expressive — vibrant colors, large confident typography, strong visual hierarchy, creative use of shapes and color blocks",
  "Warm and approachable — friendly rounded shapes, warm color palette, inviting feel, natural and human-centered",
  "Dark and dramatic — dark backgrounds, glowing accents, cinematic feel, high contrast, moody atmosphere",
];

// Per-route defaults (intentionally separate - different models for different use cases)
export const DEFAULT_MODEL_GENERATE = "claude-opus-4-6";
export const DEFAULT_MODEL_LAYOUT = "claude-sonnet-4-20250514";
export const DEFAULT_MODEL_REVIEW = "claude-opus-4-6";
export const DEFAULT_MODEL_CRITIQUE = "claude-opus-4-6";
export const DEFAULT_MODEL_EXPORT = "claude-sonnet-4-20250514";

export const STAGE_CONFIG: Record<
  PipelineStage,
  { label: string; progress: number; icon: string }
> = {
  queued: { label: "Queued", progress: 0, icon: "⏳" },
  layout: { label: "Generating layout…", progress: 0.2, icon: "🏗️" },
  images: { label: "Adding images…", progress: 0.45, icon: "🎨" },
  compositing: { label: "Compositing…", progress: 0.65, icon: "🔧" },
  review: { label: "Reviewing design…", progress: 0.8, icon: "👁️" },
  refining: { label: "Preparing next variation…", progress: 0.9, icon: "✨" },
  done: { label: "Complete", progress: 1, icon: "✅" },
  error: { label: "Error", progress: 0, icon: "❌" },
};

// Map of known model IDs to their display names and descriptions
// This helps us provide better labels for models even if the API doesn't
export const MODEL_METADATA: Record<string, { displayName: string; description: string }> = {
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

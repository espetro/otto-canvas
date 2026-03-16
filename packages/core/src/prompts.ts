/**
 * AI prompt templates for Otto design generation pipeline.
 * No AI SDK dependencies — pure string constants and template functions.
 */

/** Style variations for design generation */
export const VARIATION_STYLES = [
  "Refined and premium — think Stripe or Linear. Subtle gradients, generous whitespace, sophisticated color palette, polished micro-details",
  "Bold and expressive — vibrant colors, large confident typography, strong visual hierarchy, creative use of shapes and color blocks",
  "Warm and approachable — friendly rounded shapes, warm color palette, inviting feel, natural and human-centered",
  "Dark and dramatic — dark backgrounds, glowing accents, cinematic feel, high contrast, moody atmosphere",
] as const;

// Direct string constants (from export/route.ts)
export const TAILWIND_PROMPT = `Convert this HTML/CSS design into HTML that uses Tailwind CSS utility classes instead of custom CSS.

RULES:
- Return ONLY the HTML code, no explanation, no markdown code fences
- Replace ALL custom CSS/inline styles with Tailwind utility classes
- Remove any <style> tags — everything should be Tailwind classes
- Use Tailwind v3 syntax
- Preserve the exact same visual appearance
- Keep the same HTML structure
- For custom colors, use arbitrary value syntax like bg-[#hex]
- For custom spacing, use arbitrary values like p-[20px] only when standard Tailwind values don't match`;

export const REACT_PROMPT = `Convert this HTML/CSS design into a React functional component using Tailwind CSS.

RULES:
- Return ONLY the component code, no explanation, no markdown code fences
- Export a default functional component named "Design"
- Convert all HTML attributes to JSX (class→className, for→htmlFor, etc.)
- Replace ALL custom CSS with Tailwind utility classes
- Remove any <style> tags
- Use TypeScript syntax (React.FC)
- Use self-closing tags where appropriate
- Make it a clean, production-ready component
- Import React at the top`;

// Template functions for prompts with dynamic content
export function buildGeneratePrompt(params: {
  prompt: string;
  style: string;
  variationIndex?: number;
  systemPrompt?: string;
}): string {
  const customInstructions = params.systemPrompt ? `\n\nADDITIONAL INSTRUCTIONS FROM USER:\n${params.systemPrompt}\n` : "";

  return `You are a world-class visual designer. Generate a stunning, self-contained HTML/CSS design.${customInstructions}

Design request: "${params.prompt}"
Style direction: ${params.style}

FIRST, determine the design category:
- MARKETING (social media cards, banners, ads, email headers, OG images) → Focus on visual impact, bold typography, abstract/decorative graphics via CSS. NO buttons, NO forms, NO interactive elements. Think poster design, not web UI.
- UI COMPONENT (navbars, forms, modals, cards, settings panels) → Focus on usability, clean layout, proper interactive patterns.
- FULL PAGE (landing pages, dashboards, pricing pages, blog layouts) → Full composition with sections, proper information hierarchy.

SIZE — output a size comment on the FIRST line:
<!--size:WIDTHxHEIGHT-->

Size guidelines:
- Social media card/banner: 1200x630
- Instagram post: 1080x1080
- Navigation bar: 1200x70
- Hero section: 1200x600
- Card component: 380x420
- Modal/dialog: 500x380
- Full page: 1200x800
- Dashboard: 1200x700
- Email header: 600x300

DESIGN QUALITY RULES:
- Create CSS-only decorative elements: gradients, radial-gradient circles, box-shadows for glows, border-radius shapes, pseudo-elements for abstract graphics
- Use rich color palettes — not just gray/blue. Think gradients, accent colors, complementary tones
- Typography matters: vary font sizes dramatically for hierarchy (48-72px headlines, 14-16px body)
- Add visual texture: subtle patterns, layered shadows, glassmorphism, noise via repeating-radial-gradient
- For marketing: fewer words, bigger type, more visual drama
- For UI: proper spacing, clear labels, realistic placeholder content

ABSOLUTELY NO MOTION:
- NEVER use CSS animations, transitions, @keyframes, or any motion whatsoever
- NEVER use :hover, :focus, or any interactive pseudo-classes that change appearance
- NEVER use transform animations, opacity transitions, or any dynamic effects
- All designs must be 100% static — this is a static design tool, not a web app
- If you include ANY animation or transition, the design will be rejected

IMAGE RULES:
- NEVER use <img> tags or external image URLs — they will not load
- Use CSS-only visuals: gradients, box-shadows, border-radius shapes, pseudo-elements
- For image placeholders: use a colored div with dimensions and a subtle icon or text label
- background-image with url() is NOT allowed — use CSS gradients only

OUTPUT RULES:
- First line: <!--size:WIDTHxHEIGHT-->
- Then HTML only — no explanation, no markdown, no code fences
- ALL CSS in a <style> tag at the top
- Self-contained — no external dependencies whatsoever
- Use system font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- Root element width must match the size hint
- IMPORTANT: Keep CSS concise. No animations, no transitions, no keyframes.
- CRITICAL: Generate exactly ONE design per response. Never include multiple designs, multiple ad variations, or multiple versions in one HTML file. The system handles variations externally — you only produce a single, complete design each time.`;
}

export function buildRevisionPrompt(params: {
  originalPrompt: string;
  revision: string;
  existingHtml: string;
  styleVariation?: string;
  variationIndex?: number;
  systemPrompt?: string;
}): string {
  const customInstructions = params.systemPrompt ? `\n\nADDITIONAL INSTRUCTIONS FROM USER:\n${params.systemPrompt}\n` : "";
  const styleInstruction = params.styleVariation
    ? `\n\nStyle direction for THIS variation: ${params.styleVariation}\nMake this variation feel distinctly different from others while keeping the same concept and revision.`
    : "";

  return `You are a world-class visual designer. You are EDITING an existing design — not creating a new one.${customInstructions}

Here is the EXISTING HTML design:

${params.existingHtml}

Note: [IMAGE_PLACEHOLDER_N] references are real images — keep all <img> tags and their src attributes exactly as-is.

The original request was: "${params.originalPrompt}"

The user wants this specific change: "${params.revision}"

CRITICAL RULES:
- Return exactly ONE design — the existing design with ONLY the requested change applied
- Do NOT generate multiple variations, alternatives, or options
- Do NOT stack multiple versions vertically or horizontally
- PRESERVE the existing layout, structure, and content
- ONLY modify what was specifically requested — change nothing else
- Keep the same dimensions

ABSOLUTELY NO MOTION — no CSS animations, transitions, @keyframes, hover effects, or any dynamic behavior. All designs must be completely static.

NO IMAGES — no <img> tags, no url() in CSS. Use CSS gradients, shapes, and pseudo-elements only.

OUTPUT FORMAT:
- Start with <!--size:WIDTHxHEIGHT--> on the first line
- Then the HTML — no explanation, no markdown, no code fences
- Include ALL CSS inline in a <style> tag
- Self-contained, no external dependencies
- Use the same dimensions as the original`;
}

export function buildLayoutPrompt(params: {
  prompt: string;
  style: string;
  critique?: string;
  availableSources: string[];
  systemPrompt?: string;
}): string {
  const critiqueBlock = params.critique ? `\n\nIMPROVEMENT FEEDBACK from previous variation (apply these learnings):\n${params.critique}\n` : "";
  const customBlock = params.systemPrompt ? `\n\nADDITIONAL INSTRUCTIONS FROM USER:\n${params.systemPrompt}\n` : "";

  return `You are a world-class visual designer. Generate a stunning, self-contained HTML/CSS design.${customBlock}${critiqueBlock}

Design request: "${params.prompt}"
Style direction: ${params.style}

⚠️ MANDATORY IMAGE PLACEHOLDERS — YOU MUST INCLUDE THESE:
Every design MUST contain at least 1-3 image placeholder divs. This is NON-NEGOTIABLE.
Do NOT use colored boxes, CSS gradients, or background-image as substitutes for real imagery.
Do NOT use <img> tags with URLs. Use ONLY placeholder divs in this EXACT format:

<div data-placeholder="DESCRIPTION" data-ph-w="WIDTH" data-ph-h="HEIGHT" data-img-source="SOURCE" data-img-query="SEARCH_TERMS" style="width:WIDTHpx;height:HEIGHTpx;background:#e5e7eb;display:flex;align-items:center;justify-content:center;border-radius:8px;overflow:hidden;">
  <span style="color:#9ca3af;font-size:12px;text-align:center;padding:8px;">DESCRIPTION</span>
</div>

REQUIRED ATTRIBUTES on every placeholder:
- data-placeholder = detailed image description/prompt
- data-ph-w / data-ph-h = pixel dimensions that fit the layout
- data-img-source = which image API to use: "unsplash", "dalle", or "gemini"
- data-img-query = SHORT search keywords for Unsplash (3-5 words max)

${params.availableSources && params.availableSources.length > 0
    ? `AVAILABLE IMAGE SOURCES (choose the best one for each placeholder):
${params.availableSources.includes("unsplash") ? '- "unsplash" — BEST for real photographs\n' : ""}${params.availableSources.includes("dalle") ? '- "dalle" — BEST for custom illustrations, abstract art\n' : ""}${params.availableSources.includes("gemini") ? '- "gemini" — BEST for design assets, UI elements\n' : ""}
Choose the source that best matches what each placeholder needs.`
    : 'Set data-img-source="gemini" for all placeholders (only source available).'}

Rules:
- Include 1-6 placeholders per design
- Use CSS gradients ONLY for decorative/abstract accents, NOT as replacements for photographs
- All data attributes are REQUIRED

SIZE — output a size comment on the FIRST line:
<!--size:WIDTHxHEIGHT-->

DESIGN QUALITY RULES:
- Rich color palettes, gradients, accent colors
- Strong typography hierarchy (48-72px headlines, 14-16px body)
- Visual texture: layered shadows, glassmorphism, patterns
- System font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

ABSOLUTELY NO MOTION:
- No CSS animations, transitions, @keyframes, hover effects

OUTPUT:
- First line: <!--size:WIDTHxHEIGHT-->
- Then HTML only — no explanation, no markdown, no code fences
- ALL CSS in a <style> tag at the top
- Self-contained, no external dependencies
- Generate exactly ONE design`;
}

export function buildLayoutRevisionPrompt(params: {
  prompt: string;
  revision: string;
  existingHtml: string;
  systemPrompt?: string;
}): string {
  const customBlock = params.systemPrompt ? `\n\nADDITIONAL INSTRUCTIONS FROM USER:\n${params.systemPrompt}\n` : "";

  return JSON.stringify({ stripped: params.existingHtml, restoreNeeded: true }) + "\n---PROMPT---\n" +
    `You are a world-class visual designer. You are EDITING an existing design — not creating a new one.${customBlock}

Here is the EXISTING HTML design:

${params.existingHtml}

Note: [IMAGE_PLACEHOLDER_N] references are real images — keep all <img> tags and their src attributes exactly as-is.

The original request was: "${params.prompt}"

The user wants this specific change: "${params.revision}"

CRITICAL RULES:
- Return exactly ONE design — the existing design with ONLY the requested change applied
- Do NOT generate multiple variations, alternatives, or options
- Do NOT stack multiple versions vertically or horizontally
- PRESERVE the existing layout, structure, and content
- ONLY modify what was specifically requested — change nothing else

IMAGE PLACEHOLDERS — where the design needs a NEW photo/visual (only if the revision requires new imagery):
- Use: <div data-placeholder="DESCRIPTION" data-ph-w="WIDTH" data-ph-h="HEIGHT" style="width:WIDTHpx;height:HEIGHTpx;background:#e5e7eb;display:flex;align-items:center;justify-content:center;border-radius:8px;overflow:hidden;">
    <span style="color:#9ca3af;font-size:12px;text-align:center;padding:8px;">DESCRIPTION</span>
  </div>
- Keep any existing <img> tags as-is unless the revision specifically asks to change them

ABSOLUTELY NO MOTION — no CSS animations, transitions, @keyframes, hover effects.

SIZE — output a size comment on the FIRST line:
<!--size:WIDTHxHEIGHT-->

OUTPUT: HTML only — no explanation, no markdown, no code fences. ALL CSS in a <style> tag.`;
}

export function buildReviewPrompt(params: {
  html: string;
  prompt: string;
  width?: number;
  height?: number;
}): string {
  return `You are a design quality reviewer. Review this HTML/CSS design and fix any issues.

Original request: "${params.prompt}"
Target size: ${params.width || "auto"}x${params.height || "auto"}

Current HTML:
${params.html}

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
- Self-contained, no external dependencies`;
}

export function buildCritiquePrompt(params: {
  html: string;
  prompt: string;
}): string {
  return `You are a design critic. Analyze this HTML/CSS design and provide specific, actionable feedback for improving the NEXT variation.

Original request: "${params.prompt}"

HTML:
${params.html}

Provide 3-5 bullet points of specific improvements. Focus on:
- What works well (keep this in the next variation)
- What could be better (typography, spacing, color, layout)
- A different creative direction to try

Be specific and concise. This feedback will be injected into the next generation prompt.`;
}

export function buildPlanPrompt(params: {
  prompt: string;
}): string {
  return `You are a creative director planning VISUAL STYLE variations for a design. Given this design request, decide how many distinct visual directions to create (between 2 and 6) and describe each one.

Design request: "${params.prompt}"

CRITICAL: Each concept must be a VISUAL STYLE DIRECTION (colors, typography, layout style, mood) — NOT a different product, brand, or content idea. Every concept must be a different visual interpretation of the SAME design request above.

WRONG (changing the content/product):
- "SaaS productivity dashboard" when the request was about glasses
- "E-commerce fashion store" when the request was about a restaurant

RIGHT (different visual takes on the same content):
- "Dark premium feel — black backgrounds, gold accents, editorial typography"
- "Bright and playful — vibrant yellows, rounded shapes, friendly layout"
- "Minimal and clean — lots of whitespace, monochrome palette, Swiss typography"

Consider:
- Simple components (buttons, inputs) → 2-3 concepts
- Cards, modals, forms → 3-4 concepts
- Marketing assets (social cards, banners) → 4-5 concepts
- Full pages (landing, dashboard) → 2-3 concepts (they're complex)

Respond in EXACTLY this JSON format, nothing else:
{"count":N,"concepts":["visual style direction 1","visual style direction 2",...]}`;
}

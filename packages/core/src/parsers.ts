export function parseHtmlWithSize(raw: string): {
  html: string;
  width?: number;
  height?: number;
  comment?: string;
} {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:html)?\n?/, "").replace(/\n?```$/, "");
  }
  const fenceMatch = cleaned.match(/```(?:html)?\n?([\s\S]*?)\n?```/);
  if (fenceMatch) cleaned = fenceMatch[1];
  cleaned = cleaned.trim();

  const sizeMatch = cleaned.match(/<!--size:(\d+)x(\d+)-->/);
  let width: number | undefined;
  let height: number | undefined;
  if (sizeMatch) {
    width = parseInt(sizeMatch[1], 10);
    height = parseInt(sizeMatch[2], 10);
    cleaned = cleaned.replace(/<!--size:\d+x\d+-->\n?/, "").trim();
  }

  let comment: string | undefined;
  const commentMatch = cleaned.match(/<!--otto:(.*?)-->/);
  if (commentMatch) {
    comment = commentMatch[1].trim();
    cleaned = cleaned.replace(/<!--otto:.*?-->\n?/, "").trim();
  }

  const htmlStart = cleaned.match(
    /^[\s\S]*?(<(?:!DOCTYPE|html|head|style|div|section|main|body|meta|link)[>\s])/i,
  );
  if (htmlStart && htmlStart.index !== undefined && htmlStart.index > 0) {
    cleaned = cleaned.substring(htmlStart.index);
  }
  const lastTagMatch = cleaned.match(/([\s\S]*<\/(?:html|div|section|main|body)>)/i);
  if (lastTagMatch) cleaned = lastTagMatch[1];

  return { html: cleaned.trim(), width, height, comment };
}

export function parsePlanResponse(text: string): { count: number; concepts: string[] } {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const plan = JSON.parse(jsonMatch[0]);
      const count = Math.min(Math.max(Number(plan.count) || 4, 2), 6);
      const concepts = (plan.concepts || []).slice(0, count);
      return { count, concepts };
    }
  } catch {}

  return { count: 4, concepts: [] };
}

export function sortClaudeModels(a: { id: string }, b: { id: string }): number {
  const getPriority = (id: string) => {
    if (id.includes("opus")) return 0;
    if (id.includes("sonnet")) return 1;
    if (id.includes("haiku")) return 2;
    return 3;
  };
  const priorityDiff = getPriority(a.id) - getPriority(b.id);
  if (priorityDiff !== 0) return priorityDiff;
  return b.id.localeCompare(a.id);
}

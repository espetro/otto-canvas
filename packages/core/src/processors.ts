/**
 * HTML processors for Otto design generation pipeline.
 * No AI SDK dependencies — pure string/regex operations.
 */

type ImageSource = "unsplash" | "dalle" | "gemini";

interface Placeholder {
  id: string;
  description: string;
  width: number;
  height: number;
  source: ImageSource;
  query?: string;
}

/** Strip base64 data URIs from HTML, returning stripped HTML and restore function */
export function stripBase64Images(html: string): { stripped: string; restore: (output: string) => string } {
  const images: string[] = [];
  const stripped = html.replace(/src="(data:image\/[^"]+)"/g, (_match, dataUri) => {
    const idx = images.length;
    images.push(dataUri);
    return `src="[IMAGE_PLACEHOLDER_${idx}]"`;
  });
  const restore = (output: string): string => {
    let result = output;
    for (let i = 0; i < images.length; i++) {
      result = result.replace(`[IMAGE_PLACEHOLDER_${i}]`, images[i]);
    }
    return result;
  };
  return { stripped, restore };
}

/** Parse image placeholder divs from HTML */
export function parseImagePlaceholders(html: string, availableSources: string[]): Placeholder[] {
  const placeholders: Placeholder[] = [];
  const regex = /data-placeholder="([^"]+)"\s+data-ph-w="(\d+)"\s+data-ph-h="(\d+)"(?:\s+data-img-source="([^"]*)")?(?:\s+data-img-query="([^"]*)")?/g;
  let match;
  let idx = 0;
  const defaultSource: ImageSource = availableSources.includes("unsplash") ? "unsplash" : availableSources.includes("dalle") ? "dalle" : "gemini";
  while ((match = regex.exec(html)) !== null) {
    let source = (match[4] || defaultSource) as ImageSource;
    if (!availableSources.includes(source)) source = defaultSource;
    placeholders.push({
      id: `ph-${idx++}`,
      description: match[1],
      width: parseInt(match[2], 10),
      height: parseInt(match[3], 10),
      source,
      query: match[5] || undefined,
    });
  }
  return placeholders;
}

/** Replace placeholder divs with actual <img> tags */
export function replacePlaceholdersWithImages(html: string, placeholders: Placeholder[], imageMap: Map<number, string>): string {
  let result = html;
  const replaceRegex = /<div\s+data-placeholder="[^"]*"\s+data-ph-w="\d+"\s+data-ph-h="\d+"[^>]*>[\s\S]*?<\/div>/g;
  let replaceIdx = 0;
  result = result.replace(replaceRegex, (matchStr: string) => {
    const dataUrl = imageMap.get(replaceIdx);
    const ph = placeholders[replaceIdx];
    replaceIdx++;
    if (dataUrl && ph) {
      return `<img src="${dataUrl}" alt="${ph.description}" style="width:${ph.width}px;height:${ph.height}px;object-fit:cover;border-radius:8px;display:block;" />`;
    }
    return matchStr;
  });
  return result;
}

/** Convert HTML design to SVG wrapper for export */
export function htmlToSvg(html: string): string {
  const widthMatch = html.match(/width\s*:\s*(\d+)px/);
  const heightMatch = html.match(/height\s*:\s*(\d+)px/);
  const width = widthMatch ? parseInt(widthMatch[1]) : 800;
  const height = heightMatch ? parseInt(heightMatch[1]) : 600;

  const escaped = html.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "&amp;");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml">
${escaped}
    </div>
  </foreignObject>
</svg>`;
}

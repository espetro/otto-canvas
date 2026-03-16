import { describe, it, expect } from "vitest";
import { parseHtmlWithSize } from "./parsers.js";

describe("parseHtmlWithSize", () => {
  it("extracts size from <!--size:WxH--> comment", () => {
    const raw = `<!--size:800x600-->
<div>Hello</div>`;
    const result = parseHtmlWithSize(raw);
    expect(result.width).toBe(800);
    expect(result.height).toBe(600);
    expect(result.html).not.toContain("<!--size:");
  });

  it("extracts otto designer comment", () => {
    const raw = `<!--size:800x600-->
<div>Hello</div>
<!--otto:Great design!-->`;
    const result = parseHtmlWithSize(raw);
    expect(result.comment).toBe("Great design!");
    expect(result.html).not.toContain("<!--otto:");
  });

  it("strips markdown fences", () => {
    const raw = `\`\`\`html
<!--size:800x600-->
<div>Hello</div>
\`\`\``;
    const result = parseHtmlWithSize(raw);
    expect(result.width).toBe(800);
    expect(result.html).not.toContain("```");
  });

  it("handles missing size comment", () => {
    const raw = `<div>No size comment</div>`;
    const result = parseHtmlWithSize(raw);
    expect(result.width).toBeUndefined();
    expect(result.height).toBeUndefined();
    expect(result.html).toBeTruthy();
  });
});

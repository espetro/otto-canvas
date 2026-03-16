import { describe, it, expect } from "vitest";
import { stripBase64Images, htmlToSvg } from "./processors.js";

describe("stripBase64Images", () => {
  it("replaces base64 data URIs with placeholders", () => {
    const html = `<img src="data:image/png;base64,ABC123" alt="test" />`;
    const { stripped } = stripBase64Images(html);
    expect(stripped).toContain("[IMAGE_PLACEHOLDER_0]");
    expect(stripped).not.toContain("data:image");
  });

  it("restore function recovers original data URIs", () => {
    const html = `<img src="data:image/jpeg;base64,XYZDEF" />`;
    const { stripped, restore } = stripBase64Images(html);
    const restored = restore(stripped);
    expect(restored).toBe(html);
  });

  it("handles HTML with no base64 images", () => {
    const html = `<div>No images here</div>`;
    const { stripped, restore } = stripBase64Images(html);
    expect(stripped).toBe(html);
    expect(restore(stripped)).toBe(html);
  });

  it("handles multiple base64 images", () => {
    const html = `<img src="data:image/png;base64,A" /><img src="data:image/png;base64,B" />`;
    const { stripped, restore } = stripBase64Images(html);
    expect(stripped).toContain("[IMAGE_PLACEHOLDER_0]");
    expect(stripped).toContain("[IMAGE_PLACEHOLDER_1]");
    const restored = restore(stripped);
    expect(restored).toBe(html);
  });
});

describe("htmlToSvg", () => {
  it("wraps HTML in SVG foreignObject", () => {
    const html = `<div style="width:800px;height:600px">Content</div>`;
    const svg = htmlToSvg(html);
    expect(svg).toContain("<svg");
    expect(svg).toContain("foreignObject");
    expect(svg).toContain("Content");
  });

  it("extracts width and height from CSS", () => {
    const html = `<div style="width:1200px;height:630px">Ad</div>`;
    const svg = htmlToSvg(html);
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
  });
});

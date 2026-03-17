import { describe, it, expect, beforeEach } from "bun:test";
import { canvasServiceImpl } from "../../src/lib/rpc/handlers";

describe("RPC Handlers", () => {
  describe("generate", () => {
    it("should create a design with prompt", async () => {
      const response = await canvasServiceImpl.generate({
        prompt: "A pricing card",
        iterations: 1,
        style: "default",
      });

      expect(response.designId).toBeDefined();
      expect(typeof response.designId).toBe("string");
      expect(response.status).toBe("completed");
      expect(response.designs).toBeDefined();
      expect(response.designs).toHaveLength(1);
      expect(response.designs[0].prompt).toBe("A pricing card");
      expect(response.designs[0].htmlContent).toContain("Design for: A pricing card");
      expect(response.designs[0].createdAt).toBeDefined();
      expect(typeof response.designs[0].createdAt).toBe("number");
    });

    it("should generate unique design IDs", async () => {
      const response1 = await canvasServiceImpl.generate({
        prompt: "First design",
        iterations: 1,
        style: "default",
      });

      const response2 = await canvasServiceImpl.generate({
        prompt: "Second design",
        iterations: 1,
        style: "default",
      });

      expect(response1.designId).not.toBe(response2.designId);
    });

    it("should include correct prompt in design", async () => {
      const testPrompt = "Test prompt value";
      const response = await canvasServiceImpl.generate({
        prompt: testPrompt,
        iterations: 1,
        style: "default",
      });

      expect(response.designs[0].prompt).toBe(testPrompt);
    });
  });

  describe("refine", () => {
    it("should refine an existing design", async () => {
      const genResponse = await canvasServiceImpl.generate({
        prompt: "Test design",
        iterations: 1,
        style: "default",
      });

      const originalContent = genResponse.designs[0].htmlContent;

      const refineResponse = await canvasServiceImpl.refine({
        designId: genResponse.designId,
        feedback: "Make it better",
      });

      expect(refineResponse.designId).toBe(genResponse.designId);
      expect(refineResponse.status).toBe("completed");
      expect(refineResponse.status).toBe("completed");
    });

    it("should throw error for non-existent design", async () => {
      await expect(
        canvasServiceImpl.refine({
          designId: "non-existent-design-id",
          feedback: "Test feedback",
        }),
      ).rejects.toThrow("Design not found: non-existent-design-id");
    });

    it("should handle designId with underscores", async () => {
      const genResponse = await canvasServiceImpl.generate({
        prompt: "Design with underscore ID",
        iterations: 1,
        style: "default",
      });

      expect(genResponse.designId).toMatch(/^design_\d+$/);

      const refineResponse = await canvasServiceImpl.refine({
        designId: genResponse.designId,
        feedback: "Test",
      });

      expect(refineResponse.designId).toBe(genResponse.designId);
    });
  });

  describe("list", () => {
    it("should return empty array when no designs exist", async () => {
      const response = await canvasServiceImpl.list({});
      expect(response.designs).toBeDefined();
      expect(Array.isArray(response.designs)).toBe(true);
    });

    it("should return all designs", async () => {
      await canvasServiceImpl.generate({
        prompt: "First",
        iterations: 1,
        style: "default",
      });

      await canvasServiceImpl.generate({
        prompt: "Second",
        iterations: 1,
        style: "default",
      });

      const response = await canvasServiceImpl.list({});
      expect(response.designs).toBeDefined();
      expect(Array.isArray(response.designs)).toBe(true);
      expect(response.designs.length).toBeGreaterThanOrEqual(2);
    });

    it("should return designs with correct structure", async () => {
      await canvasServiceImpl.generate({
        prompt: "Structure test",
        iterations: 1,
        style: "default",
      });

      const response = await canvasServiceImpl.list({});
      const design = response.designs[response.designs.length - 1];

      expect(design).toBeDefined();
      expect(typeof design.id).toBe("string");
      expect(typeof design.prompt).toBe("string");
      expect(typeof design.htmlContent).toBe("string");
      expect(typeof design.createdAt).toBe("number");
    });
  });

  describe("select", () => {
    it("should return success for existing design", async () => {
      const genResponse = await canvasServiceImpl.generate({
        prompt: "Test",
        iterations: 1,
        style: "default",
      });

      const response = await canvasServiceImpl.select({
        designId: genResponse.designId,
      });

      expect(response.success).toBe(true);
    });

    it("should return false for non-existent design", async () => {
      const response = await canvasServiceImpl.select({
        designId: "non-existent",
      });

      expect(response.success).toBe(false);
    });

    it("should return success for design generated in previous tests", async () => {
      const listResponse = await canvasServiceImpl.list({});

      if (listResponse.designs.length > 0) {
        const response = await canvasServiceImpl.select({
          designId: listResponse.designs[0].id,
        });

        expect(response.success).toBe(true);
      }
    });
  });

  describe("Integration flows", () => {
    it("should support full lifecycle: generate -> list -> select -> refine", async () => {
      const genResponse = await canvasServiceImpl.generate({
        prompt: "Lifecycle test",
        iterations: 1,
        style: "default",
      });

      expect(genResponse.designId).toBeDefined();
      expect(genResponse.designs).toHaveLength(1);

      const listResponse = await canvasServiceImpl.list({});
      const designInList = listResponse.designs.find((d) => d.id === genResponse.designId);
      expect(designInList).toBeDefined();

      const selectResponse = await canvasServiceImpl.select({
        designId: genResponse.designId,
      });
      expect(selectResponse.success).toBe(true);

      const refineResponse = await canvasServiceImpl.refine({
        designId: genResponse.designId,
        feedback: "Improve it",
      });
      expect(refineResponse.status).toBe("completed");
    });
  });
});

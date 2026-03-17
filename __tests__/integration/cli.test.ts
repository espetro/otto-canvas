import { describe, it, expect, beforeAll, afterAll } from "bun:test";

describe("CLI Integration", () => {
  const RPC_URL = "http://localhost:3000/rpc";
  let serverAvailable = false;

  beforeAll(async () => {
    try {
      const response = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
        },
        body: JSON.stringify({ list: {} }),
      });
      serverAvailable = response.ok || response.status === 400;
    } catch {
      serverAvailable = false;
    }

    if (!serverAvailable) {
      console.warn(
        "\n⚠️  Integration tests skipped: RPC server not running at http://localhost:3000/rpc",
      );
      console.warn("   Start the dev server with: pnpm dev\n");
    }
  });

  describe("generate command", () => {
    it.skipIf(!serverAvailable)("should generate a design via RPC", async () => {
      const response = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
        },
        body: JSON.stringify({
          generate: {
            prompt: "A pricing card",
            iterations: 1,
            style: "default",
          },
        }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result.designId).toBeDefined();
      expect(result.status).toBe("completed");
    });
  });

  describe("list command", () => {
    it.skipIf(!serverAvailable)("should list all designs", async () => {
      const response = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
        },
        body: JSON.stringify({ list: {} }),
      });

      expect(response.ok).toBe(true);
      const result = await response.json();
      expect(result.designs).toBeDefined();
      expect(Array.isArray(result.designs)).toBe(true);
    });
  });

  describe("E2E workflow", () => {
    it.skipIf(!serverAvailable)("should complete full design workflow", async () => {
      // Step 1: Generate
      const genResponse = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
        },
        body: JSON.stringify({
          generate: {
            prompt: "Integration test design",
            iterations: 1,
            style: "default",
          },
        }),
      });

      expect(genResponse.ok).toBe(true);
      const genResult = await genResponse.json();
      const designId = genResult.designId;

      // Step 2: Select
      const selectResponse = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
        },
        body: JSON.stringify({
          select: { designId },
        }),
      });

      expect(selectResponse.ok).toBe(true);
      const selectResult = await selectResponse.json();
      expect(selectResult.success).toBe(true);

      // Step 3: Refine
      const refineResponse = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
        },
        body: JSON.stringify({
          refine: {
            designId,
            feedback: "Make it better",
          },
        }),
      });

      expect(refineResponse.ok).toBe(true);
      const refineResult = await refineResponse.json();
      expect(refineResult.status).toBe("completed");
    });
  });
});

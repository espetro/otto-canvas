import { describe, it, expect, vi } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

vi.mock("@shared/lib/rpc/state", () => ({
  rpcState: {
    executeCommand: vi.fn(),
  },
}));

import { rpcState } from "@shared/lib/rpc/state";

describe("RPC Endpoint", () => {
  it("handles list command", async () => {
    vi.mocked(rpcState.executeCommand).mockResolvedValue({
      type: "list",
      payload: { designs: [] },
    });

    const request = new NextRequest("http://localhost/rpc", {
      method: "POST",
      body: JSON.stringify({ list: {} }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("designs");
  });

  it("handles generate command", async () => {
    vi.mocked(rpcState.executeCommand).mockResolvedValue({
      type: "generate",
      payload: { designId: "test-123", status: "completed", designs: [] },
    });

    const request = new NextRequest("http://localhost/rpc", {
      method: "POST",
      body: JSON.stringify({
        generate: { prompt: "test", iterations: 1, style: "default" },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("designId");
    expect(body).toHaveProperty("status");
  });

  it("handles refine command", async () => {
    vi.mocked(rpcState.executeCommand).mockResolvedValue({
      type: "refine",
      payload: { designId: "test-123", status: "completed" },
    });

    const request = new NextRequest("http://localhost/rpc", {
      method: "POST",
      body: JSON.stringify({
        refine: { designId: "test-123", feedback: "make it better" },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("designId");
  });

  it("handles select command", async () => {
    vi.mocked(rpcState.executeCommand).mockResolvedValue({
      type: "select",
      payload: { success: true },
    });

    const request = new NextRequest("http://localhost/rpc", {
      method: "POST",
      body: JSON.stringify({ select: { designId: "test-123" } }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("success");
  });

  it("returns 400 for unknown commands", async () => {
    const request = new NextRequest("http://localhost/rpc", {
      method: "POST",
      body: JSON.stringify({ unknown: {} }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  it("returns 500 for command errors", async () => {
    vi.mocked(rpcState.executeCommand).mockResolvedValue({
      type: "error",
      payload: { message: "Test error" },
    });

    const request = new NextRequest("http://localhost/rpc", {
      method: "POST",
      body: JSON.stringify({ list: {} }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  it("returns 500 for exceptions", async () => {
    vi.mocked(rpcState.executeCommand).mockRejectedValue(new Error("Test exception"));

    const request = new NextRequest("http://localhost/rpc", {
      method: "POST",
      body: JSON.stringify({ list: {} }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });
});

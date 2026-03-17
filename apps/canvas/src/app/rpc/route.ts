import { NextRequest, NextResponse } from "next/server";
import { rpcState } from "@shared/lib/rpc/state";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.generate) {
      const result = await rpcState.executeCommand({
        type: "generate",
        payload: body.generate,
      });
      if (result.type === "error") {
        return NextResponse.json({ error: result.payload.message }, { status: 500 });
      }
      return NextResponse.json(result.payload);
    }

    if (body.refine) {
      const result = await rpcState.executeCommand({
        type: "refine",
        payload: body.refine,
      });
      if (result.type === "error") {
        return NextResponse.json({ error: result.payload.message }, { status: 500 });
      }
      return NextResponse.json(result.payload);
    }

    if (body.list !== undefined) {
      const result = await rpcState.executeCommand({
        type: "list",
        payload: body.list || {},
      });
      if (result.type === "error") {
        return NextResponse.json({ error: result.payload.message }, { status: 500 });
      }
      return NextResponse.json(result.payload);
    }

    if (body.select) {
      const result = await rpcState.executeCommand({
        type: "select",
        payload: body.select,
      });
      if (result.type === "error") {
        return NextResponse.json({ error: result.payload.message }, { status: 500 });
      }
      return NextResponse.json(result.payload);
    }

    return NextResponse.json({ error: "Unknown command" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

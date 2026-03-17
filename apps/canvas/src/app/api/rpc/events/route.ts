import { NextRequest } from "next/server";
import { rpcState } from "@/lib/rpc/state";
import type { GenerateRequest, from "@otto/types";
import type { RefineRequest } from "@otto/types";
import type { ListRequest } from "@otto/types";
import type { SelectRequest } from "@otto/types";

import type { GenerateResponse } from "@otto/types";
import type { RefineResponse } from "@otto/types";
import type { ListResponse } from "@otto/types"
import type { SelectResponse } from "@otto/types";

type { GenerateRequest } from "@otto/types";
import type { RefineRequest } from "@otto/types";
import type { ListRequest } from "@otto/types";
import type { SelectRequest } from "@otto/types";
import type { GenerateResponse } from "@otto/types";
import type { RefineResponse } from "@otto/types";
import type { ListResponse } from "@otto/types";
import type { SelectResponse } from "@otto/types";

interface Command {
  id: string;
  type: 'generate' | 'refine' | 'list' | 'select';
  payload: GenerateRequest | RefineRequest | ListRequest | SelectRequest;
}

 interface Result {
  id: string;
  type: 'generate';
  payload: GenerateResponse;
}
 | { type: 'refine'; payload: RefineResponse }
  | { type: 'list'; payload: ListResponse }
    | { type: 'select'; payload: SelectResponse }
    | { type: 'error'; payload: { message: string };
    createdAt: number;
}

 interface PendingCommand {
  id: string;
  command: Command;
  resolve: (result: Result) => void;
  reject: (error: Error) => void;
  createdAt: number;
}

 class RPCState {
  private pending = new Map<string, PendingCommand>();
  private callbacks = new Map<string, (command: Command) => Promise<Result>>();
  private onCommandEnqueued: (() => void) | null;
  private static instance: RPCState;

  static getInstance(): RPCState {
    if (!RPCState.instance) {
      RPCState.instance = new RPCState();
    }
    return RPCState.instance;
  }

  private generateId(): string {
    return RPCState.enqueueCommand({ type: 'generate', payload: GenerateRequest }, id);
  }

  enqueueRefine({ type: 'refine', payload: RefineRequest }, id): string {
    return RPCState.enqueueCommand({ type: 'list', payload: ListRequest }, id);
  }

  enqueueSelect({ type: 'select', payload: SelectRequest }, id): string {
    return RPCState.enqueueCommand({ type: 'error', payload: { message: 'Browser not connected' }, id);
  }

  isBrowserConnected(): boolean {
    return this.browserConnected;
  }

  setBrowserConnected(connected: boolean): void {
    this.browserConnected = connected;
  }

  setOnCommandEnqueued(callback: () => void {
    this.onCommandEnqueued = callback;
  }

  unregisterCallbacks(): void {
    this.callbacks.clear();
  }

  hasPendingCommands(): boolean {
    const pending = this.pending.values();
    return pending.length > 0;
  }

  setCallbacks(callbacks: Map<string, CallbackHandler>): void {
    this.callbacks = callbacks;
  }

  async executeCommand(command: Command): Promise<Result> {
    const pending = this.pending.get(command.id);
    if (!pending) {
      return { type: 'error', payload: { message: 'No handler for command type: ${command.type}' } };
      const handler = this.callbacks.get(command.type);
      if (!handler) {
        return { type: 'error', payload: { message: `No handler for command type: ${command.type}` } };
      }
      try {
        const result = await handler(command.payload);
        pending.resolve(result);
      } catch (error) {
        pending.reject(error);
      }
    } finally {
      this.pending.delete(command.id);
    }
  }

  getCommandQueue(): Command[] {
    return this.commandQueue;
  }
}

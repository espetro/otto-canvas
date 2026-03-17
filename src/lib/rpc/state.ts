// Type definitions for RPC commands and responses
type GenerateRequest = { prompt: string };
type GenerateResponse = { designId: string; status: string; designs: Design[] };
type RefineRequest = { designId: string; feedback: string };
type RefineResponse = { designId: string; status: string };
type ListRequest = Record<string, never>;
type ListResponse = { designs: Design[] };
type SelectRequest = { designId: string };
type SelectResponse = { success: boolean };

interface Design {
  id: string;
  prompt: string;
  htmlContent: string;
  createdAt: number;
}

type RPCCommand =
  | { type: "generate"; payload: GenerateRequest }
  | { type: "refine"; payload: RefineRequest }
  | { type: "list"; payload: ListRequest }
  | { type: "select"; payload: SelectRequest };

type RPCResult =
  | { type: "generate"; payload: GenerateResponse }
  | { type: "refine"; payload: RefineResponse }
  | { type: "list"; payload: ListResponse }
  | { type: "select"; payload: SelectResponse }
  | { type: "error"; payload: { message: string } };

interface PendingCommand {
  id: string;
  command: RPCCommand;
  resolve: (result: RPCResult) => void;
  reject: (error: Error) => void;
  createdAt: number;
}

interface BrowserCallbacks {
  onGenerate?: (req: GenerateRequest) => Promise<GenerateResponse>;
  onRefine?: (req: RefineRequest) => Promise<RefineResponse>;
  onList?: (req: ListRequest) => Promise<ListResponse>;
  onSelect?: (req: SelectRequest) => Promise<SelectResponse>;
}

class RPCState {
  private pendingCommands = new Map<string, PendingCommand>();
  private commandQueue: RPCCommand[] = [];
  private resultQueue = new Map<string, RPCResult>();
  private browserConnected = false;
  private callbacks: BrowserCallbacks = {};
  private onCommandEnqueued?: () => void;
  private designs = new Map<string, Design>();
  private designCounter = 0;
  private static instance: RPCState;

  static getInstance(): RPCState {
    if (!RPCState.instance) {
      RPCState.instance = new RPCState();
    }
    return RPCState.instance;
  }

  setBrowserConnected(connected: boolean): void {
    this.browserConnected = connected;
  }

  isBrowserConnected(): boolean {
    return this.browserConnected;
  }

  setCallbacks(callbacks: BrowserCallbacks): void {
    this.callbacks = callbacks;
  }

  setOnCommandEnqueued(callback: () => void): void {
    this.onCommandEnqueued = callback;
  }

  async enqueueCommand(command: RPCCommand): Promise<RPCResult> {
    const id = `${command.type}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return new Promise((resolve, reject) => {
      const pending: PendingCommand = {
        id,
        command,
        resolve,
        reject,
        createdAt: Date.now(),
      };

      this.pendingCommands.set(id, pending);
      this.commandQueue.push(command);

      if (this.onCommandEnqueued) {
        this.onCommandEnqueued();
      }

      setTimeout(() => {
        if (this.pendingCommands.has(id)) {
          this.pendingCommands.delete(id);
          reject(new Error("Command timeout - browser did not respond in time"));
        }
      }, 30000);
    });
  }

  dequeueCommand(): RPCCommand | undefined {
    return this.commandQueue.shift();
  }

  hasPendingCommands(): boolean {
    return this.commandQueue.length > 0;
  }

  async executeCommand(command: RPCCommand): Promise<RPCResult> {
    try {
      switch (command.type) {
        case "generate": {
          if (this.callbacks.onGenerate) {
            const payload = await this.callbacks.onGenerate(command.payload);
            return { type: "generate", payload };
          }
          const designId = `design_${++this.designCounter}`;
          const design: Design = {
            id: designId,
            prompt: command.payload.prompt,
            htmlContent: `<div>Generated design for: ${command.payload.prompt}</div>`,
            createdAt: Date.now(),
          };
          this.designs.set(designId, design);
          return {
            type: "generate",
            payload: { designId, status: "completed", designs: [design] },
          };
        }
        case "refine": {
          if (this.callbacks.onRefine) {
            const payload = await this.callbacks.onRefine(command.payload);
            return { type: "refine", payload };
          }
          const design = this.designs.get(command.payload.designId);
          if (!design) {
            return {
              type: "error",
              payload: { message: `Design not found: ${command.payload.designId}` },
            };
          }
          design.htmlContent += `<!-- Refined with: ${command.payload.feedback} -->`;
          return {
            type: "refine",
            payload: { designId: command.payload.designId, status: "completed" },
          };
        }
        case "list": {
          if (this.callbacks.onList) {
            const payload = await this.callbacks.onList(command.payload);
            return { type: "list", payload };
          }
          return {
            type: "list",
            payload: { designs: Array.from(this.designs.values()) },
          };
        }
        case "select": {
          if (this.callbacks.onSelect) {
            const payload = await this.callbacks.onSelect(command.payload);
            return { type: "select", payload };
          }
          const design = this.designs.get(command.payload.designId);
          return {
            type: "select",
            payload: { success: !!design },
          };
        }
      }
    } catch (error) {
      return {
        type: "error",
        payload: { message: error instanceof Error ? error.message : "Unknown error" },
      };
    }
  }

  completeCommand(commandId: string, result: RPCResult): void {
    const pending = this.pendingCommands.get(commandId);
    if (pending) {
      pending.resolve(result);
      this.pendingCommands.delete(commandId);
    }
  }

  getDesigns(): Map<string, Design> {
    return this.designs;
  }
}

export const rpcState = RPCState.getInstance();
export type { RPCCommand, RPCResult, BrowserCallbacks, Design };

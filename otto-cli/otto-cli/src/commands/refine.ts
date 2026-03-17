import { Command, Args, Flags } from "@oclif/core";

const RPC_URL = "http://localhost:3000/rpc";

export default class Refine extends Command {
  static args = {
    designId: Args.string({
      description: "Design ID to refine",
      required: true,
    }),
    feedback: Args.string({
      description: "Feedback for refinement",
      required: true,
    }),
  };

  static flags = {
    verbose: Flags.boolean({
      char: "v",
      description: "Show verbose error output",
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Refine);

    try {
      this.log("Refining design...");

      const response = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
        },
        body: JSON.stringify({
          refine: {
            designId: args.designId,
            feedback: args.feedback,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RPC error ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.designId) {
        this.log(`✓ Design refined: ${result.designId}`);
        this.log(`✓ Status: ${result.status}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      if (flags.verbose) {
        this.error(`Failed to refine design: ${error instanceof Error ? error.stack || error : error}`);
      } else {
        this.error(`Failed to refine design: ${error instanceof Error ? error.message : error}`);
      }
    }
  }
}

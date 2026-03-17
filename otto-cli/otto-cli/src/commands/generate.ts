import { Args, Command, Flags } from "@oclif/core";
import { render } from "ink";
import React from "react";
import { Progress } from "../components/Progress.js";
import type { GenerateRequest, GenerateResponse } from "../gen/proto/canvas.js";

const RPC_URL = "http://localhost:3000/rpc";

interface GenerateResult {
  designId: string;
  status: string;
  designs: Array<{
    id: string;
    prompt: string;
    htmlContent: string;
    createdAt: number;
  }>;
}

export default class Generate extends Command {
  static args = {
    prompt: Args.string({
      description: "Design prompt",
      required: true,
    }),
  };

  static description = "Generate a design using AI";

  static examples = [
    '$ otto-cli generate "A pricing card with 3 tiers"',
    '$ otto-cli generate "A login form" --iterations 3 --style minimal',
  ];

  static flags = {
    iterations: Flags.integer({
      char: "i",
      description: "Number of iterations",
      default: 1,
    }),
    style: Flags.string({
      char: "s",
      description: "Design style",
      default: "default",
    }),
    verbose: Flags.boolean({
      char: "v",
      description: "Show verbose error output",
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Generate);

    this.log(`Prompt: ${args.prompt}`);
    this.log(`Iterations: ${flags.iterations}`);
    this.log(`Style: ${flags.style}`);
    this.log("");

    const { unmount } = render(React.createElement(Progress, { message: "Generating design..." }));

    try {
      const response = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
        },
        body: JSON.stringify({
          prompt: args.prompt,
          iterations: flags.iterations,
          style: flags.style,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RPC error ${response.status}: ${errorText}`);
      }

      const result: GenerateResult = await response.json();

      unmount();

      this.log(`✓ Design created: ${result.designId}`);
      this.log(`✓ Status: ${result.status}`);
      if (result.designs.length > 0) {
        this.log(`✓ Generated ${result.designs.length} design(s)`);
      }
    } catch (error) {
      unmount();
      if (flags.verbose) {
        this.error(`Failed to generate design: ${error instanceof Error ? error.stack || error : error}`);
      } else {
        this.error(`Failed to generate design: ${error instanceof Error ? error.message : error}`);
      }
    }
  }
}

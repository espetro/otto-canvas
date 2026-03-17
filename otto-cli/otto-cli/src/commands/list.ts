import { Command, Flags } from "@oclif/core";
import type { ListRequest, ListResponse } from "../gen/proto/canvas.js";
import TableConstructor from "cli-table3";

export default class List extends Command {
  static description = "List all designs";

  static examples = ["$ otto-cli list", "$ otto-cli list --all"];

  static flags = {
    all: Flags.boolean({
      char: "a",
      description: "Show all designs",
      default: false,
    }),
    verbose: Flags.boolean({
      char: "v",
      description: "Show verbose error output",
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(List);

    const RPC_URL = "http://localhost:3000/rpc";

    try {
      this.log("Fetching designs...");

      const response = await fetch(RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Connect-Protocol-Version": "1",
        },
        body: JSON.stringify({
          list: {},
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RPC error ${response.status}: ${errorText}`);
      }

      const result = (await response.json()) as unknown;

      if (!result) {
        this.log("No designs found.");
        return;
      }

      const response_typed = result as ListResponse;
      const designs = response_typed.designs || [];

      if (designs.length === 0) {
        this.log("No designs found.");
        return;
      }

      this.log(`\nFound ${designs.length} design(s):\n`);

      const table = new TableConstructor({
        head: ["ID", "Prompt", "Created"],
        colWidths: [20, 40, 25],
        style: {
          head: ["cyan", "bold"],
          border: ["grey"],
        },
      });

      for (const design of designs) {
        const truncatedPrompt =
          design.prompt.length > 35 ? design.prompt.substring(0, 35) + "..." : design.prompt;

        table.push([
          design.id,
          truncatedPrompt,
          new Date(Number(design.createdAt)).toLocaleString(),
        ]);
      }

      this.log(table.toString());
    } catch (error: any) {
      if (flags.verbose) {
        if (error.code === "ECONNREFUSED" || error.name === "TypeError") {
          this.error(
            `✗ Failed to connect to canvas server: ${error instanceof Error ? error.stack || error : error}`,
          );
        } else {
          this.error(`Failed to list designs: ${error instanceof Error ? error.stack || error : error}`);
        }
      } else {
        if (error.code === "ECONNREFUSED" || error.name === "TypeError") {
          this.error(
            "✗ Failed to connect to canvas server. Make sure it is running on http://localhost:3000",
          );
        } else {
          this.error(`Failed to list designs: ${error.message || error}`);
        }
      }
    }
  }
}

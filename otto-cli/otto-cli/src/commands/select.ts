import { Command, Args } from '@oclif/core';

export default class Select extends Command {
  static args = {
    designId: Args.string({
      description: 'Design ID to select',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Select);

    const RPC_URL = 'http://localhost:3000/rpc';

    try {
      this.log(`Selecting design ${args.designId}...`);

      const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Connect-Protocol-Version': '1',
        },
        body: JSON.stringify({
          select: {
            designId: args.designId,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RPC error ${response.status}: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        this.log(`✓ Design ${args.designId} selected successfully.`);
      } else {
        this.error(`✗ Failed to select design ${args.designId}.`);
      }
    } catch (error) {
      this.error(`✗ Failed to select design: ${error}`);
    }
  }
}

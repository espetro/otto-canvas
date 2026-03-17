import { Command, Args } from '@oclif/core';

const RPC_URL = 'http://localhost:3000/rpc';

export default class Refine extends Command {
  static args = {
    designId: Args.string({
      description: 'Design ID to refine',
      required: true,
    }),
    feedback: Args.string({
      description: 'Feedback for refinement',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Refine);

    try {
      this.log('Refining design...');

      const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Connect-Protocol-Version': '1',
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
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      this.error(`Failed to refine design: ${error}`);
    }
  }
}

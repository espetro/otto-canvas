import { z } from "zod";

export const configSchema = z.object({
  geminiKey: z.string().optional(),
  anthropicKey: z.string().optional(),
  defaultModel: z.string().default("claude-sonnet-4"),
  canvasUrl: z.string().default("http://localhost:3000"),
});

export type Config = z.infer<typeof configSchema>;

export const defaultConfig: Config = {
  defaultModel: "claude-sonnet-4",
  canvasUrl: "http://localhost:3000",
};

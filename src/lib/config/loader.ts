import { promises as fs } from "fs";
import path from "path";
import { homedir } from "os";
import { configSchema, defaultConfig, type Config } from "./schema";

const CONFIG_DIR = path.join(homedir(), ".otto");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

export async function loadConfig(): Promise<Config> {
  try {
    await fs.access(CONFIG_DIR);
    const fileContent = await fs.readFile(CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(fileContent);
    const validated = configSchema.parse(parsed);
    return validated;
  } catch (error) {
    // If file doesn't exist or is invalid, return default config
    return defaultConfig;
  }
}

import { describe, it, expect } from 'bun:test';
import { loadConfig } from '../../src/lib/config/loader';
import { configSchema, defaultConfig } from '../../src/lib/config/schema';

describe('Config', () => {
  describe('schema', () => {
    it('should validate valid config', () => {
      const config = {
        geminiKey: 'test-key',
        anthropicKey: 'test-key',
        defaultModel: 'claude-sonnet-4',
        canvasUrl: 'http://localhost:3000',
      };

      const result = configSchema.safeParse(config);
      expect(result.success).toBe(true);
    });

    it('should apply defaults for optional fields', () => {
      const config = {};
      const result = configSchema.parse(config);

      expect(result.defaultModel).toBe('claude-sonnet-4');
      expect(result.canvasUrl).toBe('http://localhost:3000');
      expect(result.geminiKey).toBeUndefined();
      expect(result.anthropicKey).toBeUndefined();
    });

    it('should allow partial config with defaults', () => {
      const config = {
        defaultModel: 'claude-opus-4',
      };
      const result = configSchema.parse(config);

      expect(result.defaultModel).toBe('claude-opus-4');
      expect(result.canvasUrl).toBe('http://localhost:3000');
    });

    it('should validate canvasUrl as string', () => {
      const config = {
        canvasUrl: 'https://example.com',
      };
      const result = configSchema.parse(config);

      expect(result.canvasUrl).toBe('https://example.com');
    });

    it('should accept empty string for API keys', () => {
      const config = {
        geminiKey: '',
        anthropicKey: '',
      };
      const result = configSchema.safeParse(config);

      expect(result.success).toBe(true);
    });

    it('should reject invalid types', () => {
      const invalidConfigs = [
        { defaultModel: 123 },
        { canvasUrl: null },
        { geminiKey: {} },
      ];

      for (const config of invalidConfigs) {
        const result = configSchema.safeParse(config);
        expect(result.success).toBe(false);
      }
    });
  });

  describe('defaultConfig', () => {
    it('should have expected defaults', () => {
      expect(defaultConfig.defaultModel).toBe('claude-sonnet-4');
      expect(defaultConfig.canvasUrl).toBe('http://localhost:3000');
    });

    it('should match schema defaults', () => {
      const parsed = configSchema.parse({});
      expect(parsed.defaultModel).toBe(defaultConfig.defaultModel);
      expect(parsed.canvasUrl).toBe(defaultConfig.canvasUrl);
    });
  });

  describe('loader', () => {
    it('should load config successfully', async () => {
      const config = await loadConfig();

      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });

    it('should return default config when file missing', async () => {
      const config = await loadConfig();

      expect(config.defaultModel).toBe(defaultConfig.defaultModel);
      expect(config.canvasUrl).toBe(defaultConfig.canvasUrl);
    });

    it('should return object with config structure', async () => {
      const config = await loadConfig();

      expect(config).toHaveProperty('defaultModel');
      expect(config).toHaveProperty('canvasUrl');
    });
  });
});

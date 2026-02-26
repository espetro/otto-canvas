# Learnings

## Session ses_365df72d8ffeWWiojKXoqhehWu - 2026-02-26

### Codebase Patterns
- Settings hook: `src/hooks/use-settings.ts` - uses `localStorage` key `"otto-settings"`
- Settings interface has fields: apiKey, geminiKey, unsplashKey, openaiKey, model, systemPrompt, systemPromptPreset, conceptCount, quickMode, showZoomControls
- All API routes use `getClient(apiKey?)` helper pattern - instantiates `new Anthropic({ apiKey })` or `new Anthropic()` (env fallback)
- Anthropic SDK v0.74.0 supports `baseURL` constructor option
- 6 API routes need updating: generate, plan, critique, review, layout, probe-models
- Settings modal uses glassmorphism styling, password inputs for keys, save/clear pattern
- `setSettings` uses spread merge - partial updates work automatically

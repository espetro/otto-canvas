# Decisions

## Session ses_365df72d8ffeWWiojKXoqhehWu - 2026-02-26

- anthropicApiUrl defaults to empty string (not the actual URL) - empty = use SDK default
- Placeholder text shows "https://api.anthropic.com" to communicate the default
- No URL validation - let SDK handle invalid URLs
- Input type: text (not password) since URLs are not secrets
- Place field below Anthropic API Key in settings modal

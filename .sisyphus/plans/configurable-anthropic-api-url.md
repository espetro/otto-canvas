# Work Plan: Configurable Anthropic API URL

## TL;DR

> **Quick Summary**: Add an "Anthropic API URL" input field to the settings dialog that allows users to configure a custom API endpoint. If left empty, the app uses Anthropic's default URL (`https://api.anthropic.com`).
>
> **Deliverables**:
> - New `anthropicApiUrl` field in Settings interface
> - New input field in SettingsModal UI
> - Updated API routes to use configurable base URL
> - Default URL placeholder shown in the input field
>
> **Estimated Effort**: Quick (2-3 hours)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 2 → Task 3

---

## Context

### Current State
The app uses the official `@anthropic-ai/sdk` package (v0.74.0) for all Anthropic API calls. The SDK is instantiated in 6 API route files:

1. `src/app/api/generate/route.ts` - Design generation
2. `src/app/api/plan/route.ts` - Planning/concepts
3. `src/app/api/pipeline/critique/route.ts` - Critique loop
4. `src/app/api/pipeline/review/route.ts` - Visual QA
5. `src/app/api/pipeline/layout/route.ts` - Layout generation
6. `src/app/api/probe-models/route.ts` - Model availability probe

All routes use a `getClient(apiKey)` helper that instantiates the Anthropic SDK:
```typescript
function getClient(apiKey?: string): Anthropic {
  if (apiKey) return new Anthropic({ apiKey });
  return new Anthropic();
}
```

The SDK currently uses the default Anthropic API URL (`https://api.anthropic.com`) which is hardcoded in the SDK.

### Settings System
Settings are managed via `useSettings` hook (`src/hooks/use-settings.ts`):
- Stored in `localStorage` under key `"otto-settings"`
- Interface includes: `apiKey`, `geminiKey`, `unsplashKey`, `openaiKey`, `model`, etc.
- Settings modal (`src/components/settings-modal.tsx`) displays input fields for each key

### User Request
Add an "Anthropic API URL" input field in the settings dialog:
- Show default URL (`https://api.anthropic.com`) as placeholder when empty
- Allow users to override with custom URL (e.g., for proxy, enterprise endpoints, etc.)
- Pass the custom URL to all Anthropic SDK instances

---

## Work Objectives

### Core Objective
Enable users to configure a custom Anthropic API base URL through the settings UI, with proper fallback to the default Anthropic endpoint.

### Concrete Deliverables
1. `anthropicApiUrl` field added to Settings interface and localStorage persistence
2. Input field in SettingsModal for Anthropic API URL with placeholder showing default
3. All 6 API routes updated to accept and use custom base URL
4. SDK instantiation updated to pass `baseURL` option when custom URL is provided

### Definition of Done
- [ ] User can enter custom API URL in Settings
- [ ] Placeholder shows `https://api.anthropic.com` when field is empty
- [ ] When custom URL is set, API calls go to that URL
- [ ] When custom URL is empty, API calls go to Anthropic's default
- [ ] Setting persists across page reloads
- [ ] Existing functionality unchanged when no custom URL is set

### Must Have
- Settings interface extension
- UI input field with proper styling (matches existing key inputs)
- API route parameter handling
- SDK baseURL configuration

### Must NOT Have (Guardrails)
- No URL validation (let SDK handle invalid URLs)
- No protocol enforcement (http/https - let user decide)
- No trailing slash normalization (SDK handles this)
- Don't break existing API key functionality

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (no test framework detected)
- **Automated tests**: None
- **Agent-Executed QA**: YES - Manual verification via UI and API calls

### QA Policy
Every task includes agent-executed QA scenarios:
- **Frontend/UI**: Playwright - Navigate to settings, interact with new field
- **API**: curl - Test API routes with custom URL parameter

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation - Data Layer):
├── Task 1: Add anthropicApiUrl to Settings interface and persistence
└── Can start immediately

Wave 2 (UI Layer - depends on Wave 1):
├── Task 2: Add Anthropic API URL input field to SettingsModal
└── Depends: Task 1

Wave 3 (API Layer - depends on Wave 1):
├── Task 3: Update all API routes to use configurable base URL
└── Depends: Task 1
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | — | 2, 3 |
| 2 | 1 | — |
| 3 | 1 | — |

### Agent Dispatch Summary

- **Task 1**: `quick` - Simple interface/type changes
- **Task 2**: `visual-engineering` - UI component work
- **Task 3**: `quick` - API route updates

---

## TODOs

- [ ] 1. Add `anthropicApiUrl` to Settings interface and persistence

  **What to do**:
  - Add `anthropicApiUrl: string` to the `Settings` interface in `src/hooks/use-settings.ts`
  - Add default value (empty string `""`) in the initial state
  - Update the `localStorage` load logic to read `anthropicApiUrl`
  - Update the `setSettings` callback to persist `anthropicApiUrl`

  **Must NOT do**:
  - Don't add validation - empty string is valid (means "use default")
  - Don't change existing field order unnecessarily

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `typescript-react-guidelines`
  - Reason: Simple TypeScript interface and state management changes

  **Parallelization**:
  - **Can Run In Parallel**: NO (blocks other tasks)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 2, Task 3
  - **Blocked By**: None

  **References**:
  - `src/hooks/use-settings.ts:5-16` - Settings interface definition
  - `src/hooks/use-settings.ts:30-41` - Initial state
  - `src/hooks/use-settings.ts:45-65` - localStorage load effect
  - `src/hooks/use-settings.ts:67-75` - setSettings callback

  **WHY Each Reference Matters**:
  - Settings interface: Add new field here
  - Initial state: Set default empty string
  - Load effect: Parse anthropicApiUrl from localStorage
  - setSettings: Already handles partial updates via spread

  **Acceptance Criteria**:
  - [ ] `anthropicApiUrl` field exists in Settings interface
  - [ ] Default value is empty string
  - [ ] localStorage load includes anthropicApiUrl
  - [ ] Setting persists when changed

  **QA Scenarios**:

  ```
  Scenario: Settings interface includes new field
    Tool: Bash (grep)
    Preconditions: None
    Steps:
      1. grep -n "anthropicApiUrl" src/hooks/use-settings.ts
    Expected Result: Found in interface definition, initial state, and load logic
    Evidence: Terminal output showing matches

  Scenario: localStorage persistence works
    Tool: Playwright
    Preconditions: App running on localhost:3000
    Steps:
      1. Navigate to http://localhost:3000
      2. Open browser DevTools → Application → Local Storage
      3. Check otto-settings key exists
      4. Verify JSON includes anthropicApiUrl field (may be empty string)
    Expected Result: localStorage contains anthropicApiUrl field
    Evidence: Screenshot of DevTools showing localStorage contents
  ```

  **Commit**: YES
  - Message: `feat(settings): add anthropicApiUrl field to Settings interface`
  - Files: `src/hooks/use-settings.ts`

---

- [ ] 2. Add Anthropic API URL input field to SettingsModal

  **What to do**:
  - Add state variable for `anthropicApiUrl` in SettingsModal component (similar to existing key states)
  - Add input field in the API Key section of the modal
  - Place it below the Anthropic API Key input
  - Use placeholder text: `https://api.anthropic.com`
  - Style it the same as other key inputs (password type, same CSS classes)
  - Handle save/clear functionality similar to API key
  - Include the field in the "Done" button auto-save logic

  **Must NOT do**:
  - Don't use a different input style than existing key fields
  - Don't make it required
  - Don't add URL validation

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `baseline-ui`
  - Reason: UI component work, needs to match existing design system

  **Parallelization**:
  - **Can Run In Parallel**: YES (after Task 1)
  - **Parallel Group**: Wave 2
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `src/components/settings-modal.tsx:271` - API Key state variables
  - `src/components/settings-modal.tsx:320-360` - Anthropic API Key input section
  - `src/components/settings-modal.tsx:599-607` - Done button auto-save logic
  - `src/components/settings-modal.tsx:333-339` - Input styling classes

  **WHY Each Reference Matters**:
  - State variables: Add `anthropicApiUrl` state following same pattern
  - API Key section: Add new input field here, after existing API key input
  - Done button: Include anthropicApiUrl in the auto-save updates
  - Input styling: Copy exact class names for consistency

  **Acceptance Criteria**:
  - [ ] Input field visible in Settings modal
  - [ ] Placeholder shows `https://api.anthropic.com`
  - [ ] Field uses same styling as API key input
  - [ ] Save button appears when value changes
  - [ ] Value persists when clicking "Done"
  - [ ] Clear/remove functionality works

  **QA Scenarios**:

  ```
  Scenario: Input field displays with correct placeholder
    Tool: Playwright
    Preconditions: App running, settings modal accessible
    Steps:
      1. Open http://localhost:3000
      2. Click settings (gear) icon
      3. Take screenshot of settings modal
      4. Verify "Anthropic API URL" label exists
      5. Verify input placeholder is "https://api.anthropic.com"
    Expected Result: Input field visible with correct placeholder text
    Evidence: .sisyphus/evidence/task-2-input-field.png

  Scenario: URL persists after save
    Tool: Playwright
    Preconditions: App running, settings modal open
    Steps:
      1. Enter "https://custom.api.com" in the API URL field
      2. Click Save button
      3. Close modal (click Done)
      4. Reopen settings modal
      5. Verify URL is still in the field
    Expected Result: Custom URL persists across modal open/close
    Evidence: .sisyphus/evidence/task-2-persist.png

  Scenario: Empty value uses default
    Tool: Playwright + Bash (localStorage check)
    Preconditions: App running
    Steps:
      1. Clear the API URL field
      2. Click Save
      3. Check localStorage for otto-settings
      4. Verify anthropicApiUrl is empty string
    Expected Result: Empty string stored, placeholder visible
    Evidence: DevTools screenshot + localStorage JSON
  ```

  **Commit**: YES
  - Message: `feat(settings): add Anthropic API URL input field`
  - Files: `src/components/settings-modal.tsx`

---

- [ ] 3. Update all API routes to use configurable base URL

  **What to do**:
  Update all 6 API route files to:
  1. Accept `anthropicApiUrl` from request body
  2. Pass it to the `getClient()` function
  3. Update `getClient()` to accept and use `baseURL` option

  Files to update:
  - `src/app/api/generate/route.ts`
  - `src/app/api/plan/route.ts`
  - `src/app/api/pipeline/critique/route.ts`
  - `src/app/api/pipeline/review/route.ts`
  - `src/app/api/pipeline/layout/route.ts`
  - `src/app/api/probe-models/route.ts`

  Changes per file:
  - Update destructuring to extract `anthropicApiUrl` from request body
  - Update `getClient()` call to pass `anthropicApiUrl`
  - Update `getClient()` function signature and implementation

  **Must NOT do**:
  - Don't change error handling logic
  - Don't modify the prompt templates or generation logic
  - Don't change model selection logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `typescript-react-guidelines`
  - Reason: Simple parameter passing changes across multiple files

  **Parallelization**:
  - **Can Run In Parallel**: YES (after Task 1)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:
  - `src/app/api/generate/route.ts:16-19` - getClient function pattern
  - `src/app/api/generate/route.ts:64` - Request body destructuring
  - `src/app/api/generate/route.ts:70` - getClient usage
  - Anthropic SDK docs: baseURL option in constructor

  **WHY Each Reference Matters**:
  - getClient pattern: Need to update this function in all files to accept baseURL
  - Request destructuring: Add anthropicApiUrl to extracted fields
  - getClient usage: Pass the URL to the client constructor
  - SDK docs: baseURL is a valid constructor option

  **Acceptance Criteria**:
  - [ ] All 6 API routes accept anthropicApiUrl from request
  - [ ] All 6 routes pass URL to getClient
  - [ ] getClient uses baseURL option when URL is provided
  - [ ] When URL is empty/undefined, SDK uses default

  **QA Scenarios**:

  ```
  Scenario: API route accepts anthropicApiUrl parameter
    Tool: Bash (curl)
    Preconditions: App running on localhost:3000
    Steps:
      1. Test plan endpoint with custom URL:
         curl -X POST http://localhost:3000/api/plan \
           -H "Content-Type: application/json" \
           -d '{"prompt":"test","apiKey":"test","anthropicApiUrl":"https://httpbin.org/post"}' \
           -v 2>&1 | head -50
      2. Check that request doesn't crash (will fail auth, but shouldn't 500)
    Expected Result: Route accepts parameter without crashing
    Evidence: Terminal output showing request/response

  Scenario: Generate route handles custom URL
    Tool: Bash (grep)
    Preconditions: None
    Steps:
      1. grep -n "anthropicApiUrl" src/app/api/generate/route.ts
      2. grep -n "baseURL" src/app/api/generate/route.ts
      3. Verify both appear in the file
    Expected Result: Both anthropicApiUrl extraction and baseURL usage present
    Evidence: grep output showing matches

  Scenario: All routes updated
    Tool: Bash
    Preconditions: None
    Steps:
      1. for file in src/app/api/*/route.ts src/app/api/pipeline/*/route.ts; do
           echo "=== $file ==="
           grep -c "anthropicApiUrl" "$file" || echo "0"
         done
    Expected Result: All 6 files show count >= 1
    Evidence: Terminal output with counts
  ```

  **Commit**: YES
  - Message: `feat(api): support configurable Anthropic API base URL`
  - Files: All 6 API route files

---

## Final Verification Wave

- [ ] F1. **Integration Test** - `unspecified-high`
  
  Perform end-to-end verification:
  1. Set custom API URL in settings
  2. Trigger a design generation
  3. Verify the request goes to the custom URL (check network tab or server logs)
  4. Clear the URL and verify it falls back to default behavior
  
  Output: `Custom URL [WORKS/FAILS] | Fallback [WORKS/FAILS] | VERDICT`

- [ ] F2. **Code Review** - `unspecified-high`
  
  Review all changes:
  1. Check TypeScript compiles without errors
  2. Verify no `any` types introduced
  3. Confirm consistent code style
  4. Check no console.log left in production code
  
  Output: `Build [PASS/FAIL] | Types [PASS/FAIL] | Style [PASS/FAIL] | VERDICT`

---

## Commit Strategy

- **Task 1**: `feat(settings): add anthropicApiUrl field to Settings interface`
- **Task 2**: `feat(settings): add Anthropic API URL input field`
- **Task 3**: `feat(api): support configurable Anthropic API base URL`

---

## Success Criteria

### Verification Commands
```bash
# TypeScript check
npm run build  # Should complete without errors

# Verify all routes updated
grep -l "anthropicApiUrl" src/app/api/*/route.ts src/app/api/pipeline/*/route.ts | wc -l
# Expected: 6

# Verify settings interface
grep "anthropicApiUrl" src/hooks/use-settings.ts
# Expected: Multiple matches in interface, state, load, etc.
```

### Final Checklist
- [ ] All "Must Have" items implemented
- [ ] All "Must NOT Have" guardrails respected
- [ ] Settings persist correctly
- [ ] UI matches existing design patterns
- [ ] All API routes updated consistently
- [ ] Default behavior unchanged when URL is empty

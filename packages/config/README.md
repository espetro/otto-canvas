# @otto/config

Shared TypeScript configuration for the Otto monorepo.

## Usage

In `packages/*/tsconfig.json`:

```json
{
  "extends": "@otto/config/tsconfig/library.json"
}
```

In `apps/canvas/tsconfig.json`:

```json
{
  "extends": "@otto/config/tsconfig/nextjs.json"
}
```

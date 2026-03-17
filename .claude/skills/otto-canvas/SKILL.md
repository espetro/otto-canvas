---
name: otto-canvas
description: Control Otto Canvas via CLI for AI-powered design generation
version: 0.1.0
triggers:
  - otto
  - canvas
  - design
  - generate
---

# Otto Canvas Skill

This skill enables Claude Code to control Otto Canvas for AI-powered design generation.

## Prerequisites

- Otto Canvas running locally (http://localhost:3000)
- otto-cli installed: `cd otto-cli/otto-cli && npm install -g .`

## CLI Commands

### Generate a Design

Generate a new design with a prompt:

```bash
otto generate "A pricing card with 3 tiers"
```

Options:
- `-i, --iterations`: Number of iterations (default: 1)
- `-s, --style`: Design style (default: default)

### List All Designs

Show all generated designs:

```bash
otto list
```

### Select a Design

Highlight a specific design in the canvas:

```bash
otto select <design-id>
```

### Refine a Design

Refine an existing design with feedback:

```bash
otto refine <design-id> "Make the colors more vibrant"
```

## Example Workflow

1. Generate a design:
   ```bash
   otto generate "A dark mode login form"
   ```

2. List to see the design ID:
   ```bash
   otto list
   ```

3. Refine it:
   ```bash
   otto refine design_1 "Add social login buttons"
   ```

## Troubleshooting

- **"Connection refused"**: Make sure Otto Canvas is running on http://localhost:3000
- **"Command not found"**: Install otto-cli globally: `cd otto-cli/otto-cli && npm install -g .`
- **No designs appearing**: Check the canvas UI is loaded in your browser

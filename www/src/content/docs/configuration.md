---
title: Configuration
description: Configure PatternBook for your project.
---

PatternBook works out of the box with zero configuration — just point it at your project directory and run `npx patternbook serve .`.

## CLI Options

All commands accept these common flags:

| Flag                      | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `-o, --output <file>`     | Output file path for the manifest or graph       |
| `-v, --verbose`           | Enable verbose logging                           |
| `-p, --port <port>`       | Port for the dashboard server (default: `3000`)  |
| `-f, --framework <name>`  | Target framework: `react`, `vue`, `svelte`, `auto` |

## Serve options

```bash
npx patternbook serve [directory] [options]

Options:
  -p, --port <port>   Port to host dashboard on (default: 3000)
  -h, --host <host>   Host address (default: localhost)
```

## Generate options

```bash
npx patternbook generate [directory] [options]

Options:
  -o, --output <file>   Output manifest file (default: library-manifest.json)
  --include-docs        Include JSDoc documentation (default: true)
  --include-props       Include prop definitions (default: true)
  --include-hooks       Include hook usage (default: true)
  --include-graph       Include dependency graph (default: true)
```

## Scan options

```bash
npx patternbook scan [directory] [options]

Options:
  -f, --framework <name>   Target framework (default: auto)
  -p, --pattern <glob>     File pattern to match
  -e, --exclude <glob>     Pattern to exclude
  --include-node-modules   Include node_modules in scan
  -o, --output <file>      Output file (default: scan-results.json)
```

## Categories

You can group components into categories by adding a `@category` JSDoc tag:

```tsx
/**
 * A customizable button component.
 * @category Forms
 */
export function Button({ children }: ButtonProps) {
  // ...
}
```

## Examples

Add live preview examples with a `@example` JSDoc tag:

```tsx
/**
 * @example
 * <Button variant="primary">Click me</Button>
 */
export function Button({ variant, children }: ButtonProps) {
  // ...
}
```

- [Installation →](/getting-started)
- [Contributing →](/contributing)
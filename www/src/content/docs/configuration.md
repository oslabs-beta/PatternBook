---
title: Configuration
description: Configure PatternBook for your project.
---

PatternBook is designed to work with zero config, but you can customise its behaviour through `patternbook.config.json`.

## Config file

```json
{
  "componentsDir": "src/components",
  "outputDir": ".patternbook",
  "include": ["**/*.tsx", "**/*.ts"],
  "exclude": ["**/*.test.tsx", "**/*.stories.tsx"],
  "projectName": "My Design System"
}
```

## Options

| Option          | Type       | Default            | Description                             |
| --------------- | ---------- | ------------------ | --------------------------------------- |
| `componentsDir` | `string`   | `"src/components"` | Directory to scan for components        |
| `outputDir`     | `string`   | `".patternbook"`   | Where to write the manifest and viewer  |
| `include`       | `string[]` | `["**/*.tsx"]`     | Glob patterns to include                |
| `exclude`       | `string[]` | `[]`               | Glob patterns to exclude                |
| `projectName`   | `string`   | Directory name     | Name shown in the viewer header         |
| `port`          | `number`   | `3030`             | Port for `patternbook serve`            |
| `watch`         | `boolean`  | `true`             | Re-analyse on file changes when serving |

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

Add examples with a `@example` JSDoc tag (coming soon):

```tsx
/**
 * @example
 * <Button variant="primary">Click me</Button>
 */
```

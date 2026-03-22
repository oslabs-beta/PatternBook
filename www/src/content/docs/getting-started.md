---
title: Installation
description: Get PatternBook running in your project.
---

## Requirements

- Node.js 18+
- A React + TypeScript project

## Install

```bash
# npm install patternbook --save-dev
npx install patternbook-cli
```

## Quick start

### 1. Initialise

Run the init command at your project root. This creates a `patternbook.config.json` file:

```bash
npx patternbook init
```

### 2. Point it at your components

Edit `patternbook.config.json` to point at your components directory:

```json
{
  "componentsDir": "src/components",
  "outputDir": ".patternbook"
}
```

### 3. Build the manifest

```bash
npx patternbook build
```

This analyses your components and writes the manifest to `.patternbook/manifest.json`.

### 4. Start the viewer

```bash
npx patternbook serve
```

Open [http://localhost:3030](http://localhost:3030) to view your design system.

## What gets analysed

PatternBook reads:

- Exported function and class components
- TypeScript prop interfaces and type aliases
- JSDoc comments on props and the component itself
- Example code blocks in JSDoc `@example` tags (coming soon)

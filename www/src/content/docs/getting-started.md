---
title: Installation Guide
description: Get PatternBook running in your project.
---

## Requirements

- Node.js 20+
- A React + TypeScript project

## Install

```bash
npm install patternbook-cli
```

## Quick start

#### 1. Run the dashboard

PatternBook will automatically generate a manifest from your components and launch the viewer in one command:

```bash
npx patternbook serve .
```

Open [http://localhost:3000](http://localhost:3000) to view your design system.

#### 2. Generate a manifest manually (optional)

If you want to generate the manifest separately without starting the server:

```bash
npx patternbook generate .
```

This analyses your components and writes the manifest to `library-manifest.json`.

#### 3. Scan components only

To inspect what components PatternBook detects without generating a full manifest:

```bash
npx patternbook scan .
```

***

## What gets analysed

PatternBook reads:

- Exported function and class components
- TypeScript prop interfaces and type aliases
- JSDoc comments on props and the component itself
- `@example` JSDoc tags for live preview code snippets
- Hook usage within components

## Available commands

| Command                           | Description                                               |
| --------------------------------- | --------------------------------------------------------- |
| `npx patternbook serve [dir]`     | Auto-generate manifest and launch the visual dashboard    |
| `npx patternbook generate [dir]`  | Generate a `library-manifest.json` from your components   |
| `npx patternbook scan [dir]`      | Scan and list all detected components                     |
| `npx patternbook analyze [dir]`   | Build a dependency graph and run impact analysis          |
| `npx patternbook watch [dir]`     | Watch for file changes and re-scan automatically          |

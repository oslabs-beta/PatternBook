---
title: Overview
description: What PatternBook is and how it works.
---

PatternBook is a zero-config documentation engine that automatically generates a living design system from your React and TypeScript components.

***

## How PatternBook Works

- **Static analysis** — PatternBook uses `ts-morph` to parse your component files and extract prop types, JSDoc descriptions, and examples.

- **Manifest generation** — The analysis is compiled into a structured JSON manifest.
 
- **Live viewer** — The PatternBook viewer reads the manifest and renders an interactive docs dashboard with live previews, editable examples, and prop tables.

***

### Key concepts

| Concept                | Description                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| **Manifest**           | A JSON file describing all your components, their props, and examples             |
| **Viewer**             | The PatternBook web app that reads the manifest and displays your design system   |
| **Component Registry** | Maps component names in examples to the real imported components for live preview |
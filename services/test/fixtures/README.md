# Test Components

This folder contains sample React components for testing the PatternBook parser.

## Purpose

Use these components to test the ts-morph static analysis engine. The parser should:

1. Scan these `.tsx` files
2. Extract component metadata (props, types, JSDoc comments)
3. Generate a `manifest.json` that matches the schema in `/src/types/manifest.ts`

## Components

- **Button.tsx** - Button with variants and sizes
- **Input.tsx** - Input field with validation
- **Card.tsx** - Container component
- **Modal.tsx** - Modal dialog
- **Dropdown.tsx** - Select dropdown

## For Backend Team

To test the parser, run it against this folder:

```bash
npx patternbook generate --input ./test-components --output ./public/generated-manifest.json
```

The generated manifest should match the structure in `/public/mock-data/manifest.json`.

<!-- DEPENDENCY_GRAPH-START -->
#### Dependency Graph

```mermaid
graph TD;
    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef database fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,stroke-dasharray: 5 5;
    classDef api fill:#fff3e0,stroke:#ff6f00,stroke-width:2px,stroke-dasharray: 5 5;
    classDef hook fill:#f3e5f5,stroke:#7b1fa2,stroke-width:1px;
    classDef leaf fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px;
    subgraph System ["System Components"]
    direction TB
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Button_tsx["Button\n(Imp:0, API:0, Fn:0)"]:::component
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Card_tsx["Card\n(Imp:0, API:0, Fn:0)"]:::component
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Dropdown_tsx["Dropdown\n(Imp:0, API:0, Fn:0)"]:::component
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Input_tsx["Input\n(Imp:0, API:0, Fn:0)"]:::component
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Modal_tsx["Modal\n(Imp:0, API:0, Fn:0)"]:::component
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_UserProfile_tsx["UserProfile\n(Imp:0, API:0, Fn:4)"]:::component
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Card_tsx --> _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Button_tsx
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Card_tsx --> _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Input_tsx
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Card_tsx --> _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Modal_tsx
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Card_tsx --> _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Dropdown_tsx
    _Users_guesoul_codesmith_PatternBook_services_test_fixtures_UserProfile_tsx --> _Users_guesoul_codesmith_PatternBook_services_test_fixtures_Button_tsx
    end
```
<!-- DEPENDENCY_GRAPH-END -->

<!-- CALL_GRAPH-START -->
#### Call Graph

```mermaid
flowchart TB
    classDef function fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,rx:10,ry:10;
```
<!-- CALL_GRAPH-END -->

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
    classDef highImports fill:#ffcdd2,stroke:#c62828,stroke-width:3px;
    classDef highApi fill:#ffe0b2,stroke:#e65100,stroke-width:2px;
    classDef highLogic fill:#e1bee7,stroke:#4a148c,stroke-width:2px;
    classDef database fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,stroke-dasharray: 5 5;
    classDef api fill:#fff3e0,stroke:#ff6f00,stroke-width:2px,stroke-dasharray: 5 5;
    classDef hook fill:#f3e5f5,stroke:#7b1fa2,stroke-width:1px;
    classDef store fill:#e0f2f1,stroke:#2e7d32,stroke-width:2px;
    classDef leaf fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px;
    subgraph Legend
        direction LR
        L_Focus["Focus"]:::component ~~~ L_Imp["High Imports"]:::highImports ~~~ L_API["High API"]:::highApi ~~~ L_Logic["High Logic"]:::highLogic ~~~ L_DB[("Database")]:::database ~~~ L_Minor["Minor"]:::leaf
    end
    subgraph System ["System Components"]
    direction TB
    subgraph UI_Layer ["UI Components"]
        direction TB
    Button["Button\n(Imp:1, API:0, Fn:0)"]:::leaf
    Card["Card\n(Imp:5, API:0, Fn:0)"]:::component
    Dropdown["Dropdown\n(Imp:1, API:0, Fn:0)"]:::leaf
    Input["Input\n(Imp:1, API:0, Fn:0)"]:::leaf
    Modal["Modal\n(Imp:1, API:0, Fn:0)"]:::leaf
    UserProfile["UserProfile\n(Imp:4, API:2, Fn:0)"]:::component
    end
    subgraph Data_Layer ["Data & API"]
        direction TB
    API_GET__api_users___userId_[("GET /api/users/${userId}\n(Imp:0, API:0, Fn:0)")]:::api
    API_POST__api_users[("POST /api/users\n(Imp:0, API:0, Fn:0)")]:::api
    end
    Card --> Button
    Card --> Input
    Card --> Modal
    Card --> Dropdown
    UserProfile -.-> API_GET__api_users___userId_
    UserProfile -.-> API_POST__api_users
    UserProfile --> Button
    UserProfile --> useAuth
    UserProfile --> store
    end
    Legend ~~~ System
```
<!-- DEPENDENCY_GRAPH-END -->

<!-- CALL_GRAPH-START -->
#### Call Graph

```mermaid
graph TD;
  A[Call Graph] --> B[Integrated Metadata]
```
<!-- CALL_GRAPH-END -->

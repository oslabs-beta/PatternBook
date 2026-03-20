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
<<<<<<< HEAD

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
    App["App\n(Imp:7, API:3, Fn:6)"]:::highImports
    Card["Card\n(Imp:4, API:0, Fn:1)"]:::component
    Button["Button\n(Imp:0, API:0, Fn:1)"]:::leaf
    Input["Input\n(Imp:0, API:0, Fn:1)"]:::leaf
    Modal["Modal\n(Imp:0, API:0, Fn:2)"]:::leaf
    Dropdown["Dropdown\n(Imp:0, API:0, Fn:3)"]:::leaf
    UserProfile["UserProfile\n(Imp:0, API:0, Fn:0)"]:::leaf
    store["store\n(Imp:0, API:0, Fn:0)"]:::leaf
    end
    subgraph Data_Layer ["Data & API"]
        direction TB
    API_GET__api_config[("GET /api/config\n(Imp:0, API:0, Fn:0)")]:::api
    API_GET__api_user_123[("GET /api/user/123\n(Imp:0, API:0, Fn:0)")]:::api
    API_POST__api_submit[("POST /api/submit\n(Imp:0, API:0, Fn:0)")]:::api
    end
    App --> Card
    App --> Button
    App --> Input
    App --> Modal
    App --> Dropdown
    App --> UserProfile
    App --> store
    App -.-> API_GET__api_config
    App -.-> API_GET__api_user_123
    App -.-> API_POST__api_submit
    Card --> Button
    Card --> Input
    Card --> Modal
    Card --> Dropdown
    end
    UI_Layer ~~~ Data_Layer
    Legend ~~~ System
```

<!-- DEPENDENCY_GRAPH-END -->

<!-- CALL_GRAPH-START -->

#### Call Graph

```mermaid
flowchart TB;
    classDef function fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,rx:10,ry:10;
    classDef file fill:#eceff1,stroke:#455a64,stroke-width:1px,stroke-dasharray: 5 5;
    classDef store fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,rx:5,ry:5;
    subgraph Call_Graph ["Call Graph"]
    direction TB
    subgraph App
        direction TB
        App_App(["App"]):::function
        STORE_useAppStore[("useAppStore")]:::store
        App_App -.-> STORE_useAppStore
        App_App_calls_toggleTheme["toggleTheme"]:::file
        App_App --> App_App_calls_toggleTheme
    end
    subgraph Dropdown
        direction TB
        Dropdown_Dropdown(["Dropdown"]):::function
        Dropdown_Dropdown_calls_onChange["onChange"]:::file
        Dropdown_Dropdown --> Dropdown_Dropdown_calls_onChange
    end
    App_App ~~~ Dropdown_Dropdown
    end
```

<!-- CALL_GRAPH-END -->
=======
>>>>>>> origin/main

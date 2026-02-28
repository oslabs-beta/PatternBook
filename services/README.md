
### Back-end file structure

```bash
services/
├── cli/
│   ├── index.ts                    # Main CLI entry point
│   ├── commands/
│   │   ├── scan.ts                # Scan command
│   │   ├── watch.ts               # Watch mode command  
│   │   ├── analyze.ts             # Dependency analysis command
│   │   └── generate.ts            # Generate manifest command
│   └── config.ts                  # CLI config loader
│
├── core/
│   ├── scanner.ts                 # ✅ File discovery (needs bug fixes)
│   ├── patterns.ts                # ✅ Framework patterns
│   ├── parser.ts                  # NEW: Unified parser interface
│   ├── parsers/
│   │   ├── react-parser.ts       # Refactored from jumbo-parser
│   │   ├── vue-parser.ts         # Future
│   │   └── svelte-parser.ts      # Future
│   ├── dependency-graph.ts        # Refactored from dependency-mapper
│   ├── watcher_temp.ts                 # Refactored from watch-parser
│   └── cache.ts                   # NEW: Parse result caching
│
├── services/
│   ├── manifest-generator.ts      # Generate output manifest
│   ├── impact-analyzer.ts         # "What breaks if I change X?"
│   └── relationship-mapper.ts     # Component-to-hook relationships
│
├── utils/
│   ├── ignore.ts                  # ⚠️ Needs bug fix
│   ├── output.ts                  # JSON formatting
│   ├── logger.ts                  # Structured logging
│   └── file-hash.ts               # For caching
│
├── types/
│   ├── index.ts                   # ✅ Core types
│   ├── parser.ts                  # Parser-specific types
│   ├── graph.ts                   # Dependency graph types
│   └── manifest.ts                # Output manifest schema
│
├── test/
│   ├── unit/
│   │   ├── scanner.test.ts
│   │   ├── parser.test.ts
│   │   ├── dependency-mapper.test.ts  # ✅ Already exists
│   │   └── graph-builder.test.ts
│   ├── integration/
│   │   ├── full-scan.test.ts
│   │   └── watch-mode.test.ts
│   └── fixtures/                   # ✅ Already have good test components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── ...
│
└── output/
    ├── library-metadata.json       # Generated manifest
    └── dependency-graph.json       # Generated graph
```


### CLI core:
```bash
{
  "dependencies": {
    "commander": "^11.1.0",
    "enquirer": "^2.4.1",
    "chalk": "^5.3.0",
    "ora": "^8.0.1"
  }
}
```

### File scanning
```bash
{
  "dependencies": {
    "fast-glob": "^3.3.2",      // Faster than globby, better for large projects
    "ignore": "^5.3.0",         // Respect .gitignore
    "chokidar": "^3.5.3"        // File watching (for future dev mode)
  }
}
```
### Mermaid Visuals

<!-- DEPENDENCY_GRAPH-START -->
#### Dependency Graph (Imports & API Calls)

```mermaid
graph TD;
    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef hotspot fill:#ffcdd2,stroke:#c62828,stroke-width:3px;
    classDef orphan fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px,stroke-dasharray: 5 5;
    classDef api fill:#fff3e0,stroke:#ff6f00,stroke-width:2px,stroke-dasharray: 5 5;
    classDef hook fill:#f3e5f5,stroke:#7b1fa2,stroke-width:1px;
    Button["Button"]:::component
    Card["Card"]:::orphan
    Dropdown["Dropdown"]:::orphan
    Input["Input"]:::orphan
    Modal["Modal"]:::orphan
    UserProfile["UserProfile"]:::orphan
    API_GET__api_users___userId_[("GET /api/users/${userId}")]:::api
    API_POST__api_users[("POST /api/users")]:::api
    UserProfile --> Button
    UserProfile -.-> API_GET__api_users___userId_
    UserProfile -.-> API_POST__api_users

    subgraph Legend
        L1["Component"]:::component
        L2["Hotspot (>3 deps)"]:::hotspot
        L3["Orphan (0 deps)"]:::orphan
        L4[("API Call")]:::api
        L1 -->|Import| L2
        L1 -.->|Fetch| L4
    end
```
<!-- DEPENDENCY_GRAPH-END -->

<!-- CALL_GRAPH-START -->
#### Call Graph (Function Interactions)

```mermaid
flowchart TB;
    classDef function fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,rx:10,ry:10;
    classDef file fill:#eceff1,stroke:#455a64,stroke-width:1px,stroke-dasharray: 5 5;
    classDef store fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,rx:5,ry:5;
    subgraph Call_Graph ["Call Graph"]
    direction TB
    subgraph Dropdown
        direction TB
        Dropdown_Dropdown(["Dropdown"]):::function
        Dropdown_Dropdown_calls_onChange["onChange"]:::file
        Dropdown_Dropdown --> Dropdown_Dropdown_calls_onChange
    end
    subgraph UserProfile
        direction TB
        UserProfile_UserProfile(["UserProfile"]):::function
        UserProfile_UserProfile_calls_setUser["setUser"]:::file
        UserProfile_UserProfile --> UserProfile_UserProfile_calls_setUser
        UserProfile_UserProfile_calls_formatUserName["formatUserName"]:::file
        UserProfile_UserProfile --> UserProfile_UserProfile_calls_formatUserName
    end
    Dropdown_Dropdown ~~~ UserProfile_formatUserName
    end
```
<!-- CALL_GRAPH-END -->


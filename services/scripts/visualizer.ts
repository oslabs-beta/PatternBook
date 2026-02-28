import { ParsedFile } from '../core/parser.ts';
import * as path from 'path';

// --- Core-Compatible Interfaces ---
export interface GraphNode {
  id: string;
  label: string;
  type: 'component' | 'api' | 'hook' | 'store' | 'database';
  metrics: {
    imports: number;
    apiCalls: number;
    functionCalls: number;
  };
}

export interface GraphEdge {
  from: string;
  to: string;
  type: 'imports' | 'calls' | 'uses';
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// --- Constants ---
const IGNORED_CALLS = new Set([
  // Array methods
  'map',
  'filter',
  'reduce',
  'forEach',
  'find',
  'some',
  'every',
  'includes',
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'slice',
  'join',
  // Promise methods
  'then',
  'catch',
  'finally',
  // JSON methods
  'json',
  'stringify',
  'parse',
  // String methods
  'toUpperCase',
  'toLowerCase',
  'trim',
  'split',
  'replace',
  'replaceAll',
  // Event methods
  'stopPropagation',
  'preventDefault',
  // Console
  'log',
  'error',
  'warn',
  'info',
  'debug',
]);

const DB_KEYWORDS = [
  'prisma',
  'mongoose',
  'typeorm',
  'firebase',
  'supabase',
  'knex',
  'sequelize',
];

// --- Main Visualizer Function (Dependency Graph) ---
export function generateMermaid(
  data: GraphData,
  options: { minImports?: number; focusTarget?: string } = {},
): string {
  let mermaidCode = 'graph TD;\n';

  // Define styles
  mermaidCode +=
    '    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;\n';
  mermaidCode +=
    '    classDef highImports fill:#ffcdd2,stroke:#c62828,stroke-width:3px;\n'; // Red for many imports
  mermaidCode +=
    '    classDef highApi fill:#ffe0b2,stroke:#e65100,stroke-width:2px;\n'; // Orange for API heavy
  mermaidCode +=
    '    classDef highLogic fill:#e1bee7,stroke:#4a148c,stroke-width:2px;\n'; // Purple for logic heavy
  mermaidCode +=
    '    classDef database fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,stroke-dasharray: 5 5;\n'; // Yellow for DB
  mermaidCode +=
    '    classDef api fill:#fff3e0,stroke:#ff6f00,stroke-width:2px,stroke-dasharray: 5 5;\n';
  mermaidCode +=
    '    classDef hook fill:#f3e5f5,stroke:#7b1fa2,stroke-width:1px;\n';
  mermaidCode +=
    '    classDef store fill:#e0f2f1,stroke:#2e7d32,stroke-width:2px;\n'; // Green for stores
  mermaidCode +=
    '    classDef leaf fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px;\n'; // Gray for small dependencies

  const minImports = options.minImports !== undefined ? options.minImports : 3;
  const focusTarget = options.focusTarget;

  const focusNodeIds = new Set<string>();
  const visibleNodeIds = new Set<string>();

  // 1. Identify Focus Nodes (App + High Imports + Optional Target)
  data.nodes.forEach(node => {
    const isApp = node.label === 'App' || node.id.endsWith('App');
    const isTarget =
      focusTarget &&
      (node.label === focusTarget || node.id.endsWith(focusTarget));

    // Focus on Components with high imports, App, or the specific target
    if (
      node.type === 'component' &&
      (isApp || isTarget || node.metrics.imports >= minImports)
    ) {
      focusNodeIds.add(node.id);
      visibleNodeIds.add(node.id);
    }
  });

  // 2. Identify Related Nodes (Recursive traversal from Focus Nodes)
  const queue = Array.from(focusNodeIds);
  const visited = new Set<string>(focusNodeIds);

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    data.edges.forEach(edge => {
      if (edge.from === currentId) {
        if (!visited.has(edge.to)) {
          visited.add(edge.to);
          visibleNodeIds.add(edge.to);
          queue.push(edge.to);
        }
      }
    });
  }

  // --- LEGEND (Top, Horizontal, Compact) ---
  mermaidCode += '    subgraph Legend\n';
  mermaidCode += '        direction LR\n';
  mermaidCode +=
    '        L_Focus["Focus"]:::component ~~~ L_Imp["High Imports"]:::highImports ~~~ L_API["High API"]:::highApi ~~~ L_Logic["High Logic"]:::highLogic ~~~ L_DB[("Database")]:::database ~~~ L_Minor["Minor"]:::leaf\n';
  mermaidCode += '    end\n';

  // --- SYSTEM (Main Graph with Layers) ---
  mermaidCode += '    subgraph System ["System Components"]\n';
  mermaidCode += '    direction TB\n';

  // Group nodes by layer
  const layerUI: GraphNode[] = [];
  const layerLogic: GraphNode[] = [];
  const layerData: GraphNode[] = [];

  data.nodes.forEach(node => {
    if (!visibleNodeIds.has(node.id)) return;

    if (node.type === 'component') {
      layerUI.push(node);
    } else if (node.type === 'hook' || node.type === 'store') {
      layerLogic.push(node);
    } else {
      // api, database
      layerData.push(node);
    }
  });

  // Helper to render a node
  const renderNode = (node: GraphNode) => {
    // Escape quotes in label
    const safeLabel = node.label.replace(/"/g, "'");
    let className = 'component';
    const isFocus = focusNodeIds.has(node.id);

    // Determine style based on type and metrics
    if (node.type === 'database') {
      className = 'database';
    } else if (node.type === 'api') {
      className = 'api';
    } else if (node.type === 'hook') {
      className = 'hook';
    } else if (node.type === 'store') {
      className = 'store';
    } else {
      // Component Logic
      if (!isFocus) {
        className = 'leaf';
      } else if (node.metrics.imports > 5) {
        className = 'highImports';
      } else if (node.metrics.apiCalls > 2) {
        className = 'highApi';
      } else if (node.metrics.functionCalls > 10) {
        className = 'highLogic';
      }
    }

    const nodeId = sanitizeId(node.id);
    const labelWithMetrics = `${safeLabel}\\n(Imp:${node.metrics.imports}, API:${node.metrics.apiCalls}, Fn:${node.metrics.functionCalls})`;

    if (node.type === 'api' || node.type === 'database') {
      return `    ${nodeId}[("${labelWithMetrics}")]:::${className}\n`;
    } else if (node.type === 'hook' || node.type === 'store') {
      return `    ${nodeId}(["${labelWithMetrics}"]):::${className}\n`;
    } else {
      return `    ${nodeId}["${labelWithMetrics}"]:::${className}\n`;
    }
  };

  // Render Layers
  if (layerUI.length > 0) {
    mermaidCode += '    subgraph UI_Layer ["UI Components"]\n';
    mermaidCode += '        direction TB\n';
    layerUI.forEach(node => (mermaidCode += renderNode(node)));
    mermaidCode += '    end\n';
  }

  if (layerLogic.length > 0) {
    mermaidCode += '    subgraph Logic_Layer ["Logic & State"]\n';
    mermaidCode += '        direction TB\n';
    layerLogic.forEach(node => (mermaidCode += renderNode(node)));
    mermaidCode += '    end\n';
  }

  if (layerData.length > 0) {
    mermaidCode += '    subgraph Data_Layer ["Data & API"]\n';
    mermaidCode += '        direction TB\n';
    layerData.forEach(node => (mermaidCode += renderNode(node)));
    mermaidCode += '    end\n';
  }

  // Render Edges
  data.edges.forEach(edge => {
    if (visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to)) {
      const fromId = sanitizeId(edge.from);
      const toId = sanitizeId(edge.to);

      if (edge.type === 'calls') {
        mermaidCode += `    ${fromId} -.-> ${toId}\n`;
      } else {
        mermaidCode += `    ${fromId} --> ${toId}\n`;
      }
    }
  });

  mermaidCode += '    end\n'; // End System subgraph

  // Force Layer Ordering (Invisible links)
  if (layerUI.length > 0 && layerLogic.length > 0)
    mermaidCode += '    UI_Layer ~~~ Logic_Layer\n';
  if (layerLogic.length > 0 && layerData.length > 0)
    mermaidCode += '    Logic_Layer ~~~ Data_Layer\n';
  else if (layerUI.length > 0 && layerData.length > 0)
    mermaidCode += '    UI_Layer ~~~ Data_Layer\n';

  // Legend position
  mermaidCode += '    Legend ~~~ System\n';

  return mermaidCode;
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9]/g, '_');
}

// --- Call Graph Visualizer ---
export function generateCallGraph(files: ParsedFile[]): string {
  let mermaidCode = 'flowchart TB;\n';
  mermaidCode +=
    '    classDef function fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,rx:10,ry:10;\n';
  mermaidCode +=
    '    classDef file fill:#eceff1,stroke:#455a64,stroke-width:1px,stroke-dasharray: 5 5;\n';
  mermaidCode +=
    '    classDef store fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,rx:5,ry:5;\n'; // Yellow for stores

  // Wrap everything in a master subgraph to force direction
  mermaidCode += '    subgraph Call_Graph ["Call Graph"]\n';
  mermaidCode += '    direction TB\n';

  const subgraphNodes: string[] = [];

  files.forEach(file => {
    const fileName = path.basename(file.filePath).replace(/\.tsx?$/, '');
    let fileMermaid = '';
    let hasValidCalls = false;
    let firstNodeId = '';

    // Group functions by file
    fileMermaid += `    subgraph ${fileName}\n`;
    fileMermaid += `        direction TB\n`;

    file.functions.forEach(func => {
      const funcId = `${fileName}_${func.name}`;
      if (!firstNodeId) firstNodeId = funcId;

      let funcMermaid = `        ${funcId}(["${func.name}"]):::function\n`;
      let hasCalls = false;

      // Add calls
      func.calls.forEach(call => {
        // Filter out noise
        if (
          !call.name.startsWith('use') &&
          call.name !== 'fetch' &&
          !IGNORED_CALLS.has(call.name)
        ) {
          const callId = `${fileName}_${func.name}_calls_${call.name}`;
          funcMermaid += `        ${callId}["${call.name}"]:::file\n`;
          funcMermaid += `        ${funcId} --> ${callId}\n`;
          hasCalls = true;
        }

        // Identify Store Variables (heuristic: starts with 'use' and ends with 'Store')
        if (call.name.startsWith('use') && call.name.endsWith('Store')) {
          const storeId = `STORE_${call.name}`;
          funcMermaid += `        ${storeId}[("${call.name}")]:::store\n`;
          funcMermaid += `        ${funcId} -.-> ${storeId}\n`;
          hasCalls = true;
        }
      });

      if (hasCalls) {
        fileMermaid += funcMermaid;
        hasValidCalls = true;
      }
    });
    fileMermaid += `    end\n`;

    // Only add the subgraph if it has valid calls
    if (hasValidCalls) {
      mermaidCode += fileMermaid;
      if (firstNodeId) {
        subgraphNodes.push(firstNodeId);
      }
    }
  });

  // Force vertical stacking by linking the first node of each subgraph
  for (let i = 0; i < subgraphNodes.length - 1; i++) {
    mermaidCode += `    ${subgraphNodes[i]} ~~~ ${subgraphNodes[i + 1]}\n`;
  }

  mermaidCode += '    end\n'; // Close master subgraph

  return mermaidCode;
}

// --- Taxonomy Graph Visualizer ---
export function generateTaxonomyGraph(
  files: ParsedFile[],
  tagsMap: Map<string, string[]>,
): string {
  let mermaidCode = 'graph TD;\n';
  mermaidCode +=
    '    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;\n';

  // Wrap in master subgraph
  mermaidCode += '    subgraph Taxonomy ["Component Taxonomy"]\n';
  mermaidCode += '    direction TB\n';

  // Group by Tag
  const tagGroups = new Map<string, string[]>();

  // Default group for untagged
  tagGroups.set('Uncategorized', []);

  files.forEach(file => {
    const fileName = path.basename(file.filePath).replace(/\.tsx?$/, '');
    const tags = tagsMap.get(file.filePath) || [];

    if (tags.length === 0) {
      tagGroups.get('Uncategorized')?.push(fileName);
    } else {
      tags.forEach(tag => {
        if (!tagGroups.has(tag)) {
          tagGroups.set(tag, []);
        }
        tagGroups.get(tag)?.push(fileName);
      });
    }
  });

  const subgraphIds: string[] = [];

  // Generate Subgraphs
  tagGroups.forEach((components, tag) => {
    if (components.length === 0) return;

    let firstNodeId = '';

    mermaidCode += `    subgraph ${tag.toUpperCase()}\n`;
    mermaidCode += `        direction TB\n`;
    components.forEach(comp => {
      const nodeId = `${tag}_${comp}`;
      if (!firstNodeId) firstNodeId = nodeId;
      mermaidCode += `        ${nodeId}["${comp}"]:::component\n`;
    });
    mermaidCode += `    end\n`;

    if (firstNodeId) {
      subgraphIds.push(firstNodeId);
    }
  });

  // Force vertical stacking
  for (let i = 0; i < subgraphIds.length - 1; i++) {
    mermaidCode += `    ${subgraphIds[i]} ~~~ ${subgraphIds[i + 1]}\n`;
  }

  mermaidCode += '    end\n'; // Close master subgraph

  return mermaidCode;
}

// --- Adapter for Current Parser ---
export function convertParsedFilesToGraph(files: ParsedFile[]): GraphData {
  const nodes: Map<string, GraphNode> = new Map();
  const edges: GraphEdge[] = [];

  // Helper to get or create node
  const getOrCreateNode = (
    id: string,
    type: GraphNode['type'] = 'component',
    label?: string,
  ) => {
    if (!nodes.has(id)) {
      nodes.set(id, {
        id,
        label: label || id,
        type,
        metrics: { imports: 0, apiCalls: 0, functionCalls: 0 },
      });
    }
    return nodes.get(id)!;
  };

  files.forEach(file => {
    const fileId = path.basename(file.filePath).replace(/\.tsx?$/, '');

    // Determine type based on naming convention
    let type: GraphNode['type'] = 'component';
    if (fileId.startsWith('use')) {
      type = 'hook';
    } else if (fileId.endsWith('Store') || fileId.endsWith('Context')) {
      type = 'store';
    }

    const node = getOrCreateNode(fileId, type);
    // Force update type if we are processing the definition
    node.type = type;

    // Metrics: Imports
    node.metrics.imports = file.imports.length;

    // Metrics: API Calls
    node.metrics.apiCalls = file.apiCalls.length;

    // Metrics: Function Calls (sum of all calls in all functions)
    node.metrics.functionCalls = file.functions.reduce(
      (acc, func) => acc + func.calls.length,
      0,
    );

    // Check for Database/Store imports (Override type if DB)
    file.imports.forEach(imp => {
      if (DB_KEYWORDS.some(kw => imp.toLowerCase().includes(kw))) {
        node.type = 'database';
      }
    });

    // Process Imports (Edges)
    file.imports.forEach(imp => {
      const depId = path.basename(imp).replace(/\.tsx?$/, '');
      getOrCreateNode(depId, 'component'); // Create placeholder for dependency
      edges.push({ from: fileId, to: depId, type: 'imports' });
    });

    // Process API Calls (Nodes & Edges)
    file.apiCalls.forEach(api => {
      const apiId = `API_${api.method}_${api.url.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const apiLabel = `${api.method} ${api.url}`;

      getOrCreateNode(apiId, 'api', apiLabel);
      edges.push({ from: fileId, to: apiId, type: 'calls' });
    });
  });

  return {
    nodes: Array.from(nodes.values()),
    edges,
  };
}

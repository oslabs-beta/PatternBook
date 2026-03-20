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
  'map', 'filter', 'reduce', 'forEach', 'find', 'some', 'every', 'includes', 
  'push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'join',
  'then', 'catch', 'finally', 'json', 'stringify', 'parse',
  'toUpperCase', 'toLowerCase', 'trim', 'split', 'replace', 'replaceAll',
  'stopPropagation', 'preventDefault', 'log', 'error', 'warn', 'info', 'debug'
]);

const DB_KEYWORDS = ['prisma', 'mongoose', 'typeorm', 'firebase', 'supabase', 'knex', 'sequelize'];

// --- Utility: Sanitize IDs for Mermaid ---
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9]/g, '_');
}

// --- Main Visualizer Function (Dependency Graph) ---
export function generateMermaid(
  data: GraphData,
  options: { minImports?: number; focusTarget?: string } = {},
): string {
  let mermaidCode = 'graph TD;\n';

  mermaidCode += '    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;\n';
  mermaidCode += '    classDef highImports fill:#ffcdd2,stroke:#c62828,stroke-width:3px;\n';
  mermaidCode += '    classDef highApi fill:#ffe0b2,stroke:#e65100,stroke-width:2px;\n';
  mermaidCode += '    classDef highLogic fill:#e1bee7,stroke:#4a148c,stroke-width:2px;\n';
  mermaidCode += '    classDef database fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,stroke-dasharray: 5 5;\n';
  mermaidCode += '    classDef api fill:#fff3e0,stroke:#ff6f00,stroke-width:2px,stroke-dasharray: 5 5;\n';
  mermaidCode += '    classDef hook fill:#f3e5f5,stroke:#7b1fa2,stroke-width:1px;\n';
  mermaidCode += '    classDef store fill:#e0f2f1,stroke:#2e7d32,stroke-width:2px;\n';
  mermaidCode += '    classDef leaf fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px;\n';

  const minImports = options.minImports !== undefined ? options.minImports : 3;
  const focusTarget = options.focusTarget;
  const focusNodeIds = new Set<string>();
  const visibleNodeIds = new Set<string>();

  data.nodes.forEach(node => {
    const isApp = node.label === 'App' || node.id.endsWith('App');
    const isTarget = focusTarget && (node.label === focusTarget || node.id.endsWith(focusTarget));
    if (node.type === 'component' && (isApp || isTarget || node.metrics.imports >= minImports)) {
      focusNodeIds.add(node.id);
      visibleNodeIds.add(node.id);
    }
  });

  const queue = Array.from(focusNodeIds);
  const visited = new Set<string>(focusNodeIds);
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    data.edges.forEach(edge => {
      if (edge.from === currentId && !visited.has(edge.to)) {
        visited.add(edge.to);
        visibleNodeIds.add(edge.to);
        queue.push(edge.to);
      }
    });
  }

  mermaidCode += '    subgraph Legend\n        direction LR\n        L_Focus["Focus"]:::component ~~~ L_Imp["High Imports"]:::highImports ~~~ L_API["High API"]:::highApi ~~~ L_Logic["High Logic"]:::highLogic ~~~ L_DB[("Database")]:::database ~~~ L_Minor["Minor"]:::leaf\n    end\n';
  mermaidCode += '    subgraph System ["System Components"]\n    direction TB\n';

  const layerUI: GraphNode[] = [];
  const layerLogic: GraphNode[] = [];
  const layerData: GraphNode[] = [];

  data.nodes.forEach(node => {
    if (!visibleNodeIds.has(node.id)) return;
    if (node.type === 'component') layerUI.push(node);
    else if (node.type === 'hook' || node.type === 'store') layerLogic.push(node);
    else layerData.push(node);
  });

  const renderNode = (node: GraphNode) => {
    const safeLabel = node.label.replace(/"/g, "'");
    let className = 'component';
    const isFocus = focusNodeIds.has(node.id);
    if (node.type === 'database') className = 'database';
    else if (node.type === 'api') className = 'api';
    else if (node.type === 'hook') className = 'hook';
    else if (node.type === 'store') className = 'store';
    else if (!isFocus) className = 'leaf';
    else if (node.metrics.imports > 5) className = 'highImports';
    else if (node.metrics.apiCalls > 2) className = 'highApi';
    else if (node.metrics.functionCalls > 10) className = 'highLogic';

    const nodeId = sanitizeId(node.id);
    const labelWithMetrics = `${safeLabel}\\n(Imp:${node.metrics.imports}, API:${node.metrics.apiCalls}, Fn:${node.metrics.functionCalls})`;

    if (node.type === 'api' || node.type === 'database') return `    ${nodeId}[("${labelWithMetrics}")]:::${className}\n`;
    if (node.type === 'hook' || node.type === 'store') return `    ${nodeId}(["${labelWithMetrics}"]):::${className}\n`;
    return `    ${nodeId}["${labelWithMetrics}"]:::${className}\n`;
  };

  if (layerUI.length > 0) {
    mermaidCode += '    subgraph UI_Layer ["UI Components"]\n        direction TB\n';
    layerUI.forEach(node => (mermaidCode += renderNode(node)));
    mermaidCode += '    end\n';
  }
  if (layerLogic.length > 0) {
    mermaidCode += '    subgraph Logic_Layer ["Logic & State"]\n        direction TB\n';
    layerLogic.forEach(node => (mermaidCode += renderNode(node)));
    mermaidCode += '    end\n';
  }
  if (layerData.length > 0) {
    mermaidCode += '    subgraph Data_Layer ["Data & API"]\n        direction TB\n';
    layerData.forEach(node => (mermaidCode += renderNode(node)));
    mermaidCode += '    end\n';
  }

  data.edges.forEach(edge => {
    if (visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to)) {
      const fromId = sanitizeId(edge.from);
      const toId = sanitizeId(edge.to);
      mermaidCode += `    ${fromId} ${edge.type === 'calls' ? '-.->' : '-->'} ${toId}\n`;
    }
  });

  mermaidCode += '    end\n';
  if (layerUI.length > 0 && layerLogic.length > 0) mermaidCode += '    UI_Layer ~~~ Logic_Layer\n';
  if (layerLogic.length > 0 && layerData.length > 0) mermaidCode += '    Logic_Layer ~~~ Data_Layer\n';
  mermaidCode += '    Legend ~~~ System\n';

  return mermaidCode;
}

// --- Call Graph Visualizer ---
export function generateCallGraph(components: any[]): string {
  let mermaid = 'flowchart TB\n';
  mermaid += '    classDef function fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,rx:10,ry:10;\n';
  
  components.forEach(comp => {
    if (comp.functionDefs && comp.functionDefs.length > 0) {
      mermaid += `  subgraph ${comp.name}\n`;
      comp.functionDefs.forEach((func: any) => {
        const funcId = `${comp.name}_${func.name}`;
        mermaid += `    ${funcId}(["${func.name}"]):::function\n`;
        func.calls.forEach((call: any) => {
          if (!IGNORED_CALLS.has(call.name)) {
            const callId = `${funcId}_${call.name}`;
            mermaid += `    ${callId}["${call.name}"]\n`;
            mermaid += `    ${funcId} --> ${callId}\n`;
          }
        });
      });
      mermaid += `  end\n`;
    }
  });
  return mermaid;
}

// --- Adapter for Current Parser ---
export function convertParsedFilesToGraph(components: any[]): GraphData {
  const nodes: Map<string, GraphNode> = new Map();
  const edges: GraphEdge[] = [];

  const getOrCreateNode = (id: string, type: any = 'component', label?: string) => {
    const sanitizedId = id.replace(/[^a-zA-Z0-9]/g, '_');
    if (!nodes.has(sanitizedId)) {
      nodes.set(sanitizedId, {
        id: sanitizedId,
        label: label || id,
        type,
        metrics: { imports: 0, apiCalls: 0, functionCalls: 0 },
      });
    }
    return nodes.get(sanitizedId)!;
  };

  components.forEach(comp => {
    const fileId = comp.name || 'Unknown';
    const node = getOrCreateNode(fileId, comp.type === 'hook' ? 'hook' : 'component');

    node.metrics.imports = comp.imports?.length || 0;
    node.metrics.apiCalls = comp.apiCalls?.length || 0;
    node.metrics.functionCalls = comp.functionDefs?.reduce((acc: number, f: any) => acc + f.calls.length, 0) || 0;

    comp.apiCalls?.forEach((api: any) => {
      const apiId = `API_${api.method}_${api.url.replace(/[^a-zA-Z0-9]/g, '_')}`;
      getOrCreateNode(apiId, 'api', `${api.method} ${api.url}`);
      edges.push({ from: node.id, to: apiId, type: 'calls' });
    });

    comp.imports?.filter((i: any) => i.isInternal).forEach((imp: any) => {
      const depName = imp.source.split('/').pop()?.replace(/\.tsx?$/, '') || 'Unknown';
      edges.push({ from: node.id, to: depName, type: 'imports' });
    });
  });

  return { nodes: Array.from(nodes.values()), edges };
}
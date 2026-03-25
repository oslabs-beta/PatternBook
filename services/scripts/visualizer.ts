import type { ComponentMetadata } from '../types/parser.js';
import type { GraphNode, GraphEdge } from '../types/graph.js';

// --- Constants ---
const IGNORED_CALLS = new Set([
  'map', 'filter', 'reduce', 'forEach', 'find', 'some', 'every', 'includes', 
  'push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'join',
  'then', 'catch', 'finally', 'json', 'stringify', 'parse',
  'log', 'error', 'warn'
]);

// --- Utility: Sanitize IDs for Mermaid ---
function sanitizeId(id: string): string {
  return (id || 'unknown').replace(/[^a-zA-Z0-9]/g, '_');
}

// --- Main Visualizer Function (Dependency Graph) ---
export function generateMermaid(data: any): string {
  let mermaidCode = 'graph TD;\n';

  // Styling
  mermaidCode += '    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;\n';
  mermaidCode += '    classDef database fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,stroke-dasharray: 5 5;\n';
  mermaidCode += '    classDef api fill:#fff3e0,stroke:#ff6f00,stroke-width:2px,stroke-dasharray: 5 5;\n';
  mermaidCode += '    classDef hook fill:#f3e5f5,stroke:#7b1fa2,stroke-width:1px;\n';
  mermaidCode += '    classDef leaf fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px;\n';

  mermaidCode += '    subgraph System ["System Components"]\n    direction TB\n';

  // We use "any" here for the loop to safely check properties from different builder versions
  data.nodes.forEach((node: any) => {
    // Defensive property checking
    const name = node.name || node.label || node.id || 'Unknown';
    const safeLabel = name.replace(/"/g, "'");
    
    // Support both 'metrics' object and direct properties (like props/hooks count)
    const impCount = node.metrics?.imports ?? 0;
    const apiCount = node.metrics?.apiCalls ?? 0;
    const fnCount = node.metrics?.functionCalls ?? (node.hooks?.length || 0);

    const nodeId = sanitizeId(node.id);
    const labelWithMetrics = `${safeLabel}\\n(Imp:${impCount}, API:${apiCount}, Fn:${fnCount})`;

    if (node.type === 'api' || node.type === 'database') {
      mermaidCode += `    ${nodeId}[("${labelWithMetrics}")]:::api\n`;
    } else if (node.type === 'hook') {
      mermaidCode += `    ${nodeId}(["${labelWithMetrics}"]):::hook\n`;
    } else {
      mermaidCode += `    ${nodeId}["${labelWithMetrics}"]:::component\n`;
    }
  });

  data.edges.forEach((edge: any) => {
    const fromId = sanitizeId(edge.from);
    const toId = sanitizeId(edge.to);
    const arrow = edge.type === 'calls' || edge.type === 'uses-hook' ? '-.->' : '-->';
    mermaidCode += `    ${fromId} ${arrow} ${toId}\n`;
  });

  mermaidCode += '    end\n';
  return mermaidCode;
}

// --- Call Graph Visualizer ---
export function generateCallGraph(components: ComponentMetadata[]): string {
  let mermaid = 'flowchart TB\n';
  mermaid += '    classDef function fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,rx:10,ry:10;\n';
  
  components.forEach(comp => {
    if (comp.functionDefs && comp.functionDefs.length > 0) {
      mermaid += `  subgraph ${comp.name}\n`;
      comp.functionDefs.forEach((func: any) => {
        const funcId = `${comp.name}_${func.name}`;
        mermaid += `    ${funcId}(["${func.name}"]):::function\n`;
        func.calls?.forEach((call: any) => {
          if (!IGNORED_CALLS.has(call.name)) {
            const callId = sanitizeId(`${funcId}_${call.name}`);
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

// --- Old Adapter (Keeping for compatibility) ---
export function convertParsedFilesToGraph(components: any[]): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  // (Logic omitted for brevity as test-run.ts now uses DependencyGraphBuilder)
  return { nodes, edges };
}
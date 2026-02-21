import { ParsedFile } from '../core/parser.ts';
import * as path from 'path';

// --- Core-Compatible Interfaces ---
export interface GraphNode {
    id: string;
    label: string;
    type: 'component' | 'api' | 'hook' | 'store';
    incomingEdges?: number; // For hotspot detection
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

// --- Main Visualizer Function ---
export function generateMermaid(data: GraphData): string {
    let mermaidCode = 'graph TD;\n';
    
    // Define styles
    mermaidCode += '    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;\n';
    mermaidCode += '    classDef hotspot fill:#ffcdd2,stroke:#c62828,stroke-width:3px;\n'; // Red for high impact
    mermaidCode += '    classDef orphan fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px,stroke-dasharray: 5 5;\n'; // Gray for unused
    mermaidCode += '    classDef api fill:#fff3e0,stroke:#ff6f00,stroke-width:2px,stroke-dasharray: 5 5;\n';
    mermaidCode += '    classDef hook fill:#f3e5f5,stroke:#7b1fa2,stroke-width:1px;\n';

    // Add Nodes
    data.nodes.forEach(node => {
        // Escape quotes in label
        const safeLabel = node.label.replace(/"/g, "'");
        let className = 'component';

        // Determine style based on type and metrics
        if (node.type === 'api') {
            className = 'api';
        } else if (node.type === 'hook') {
            className = 'hook';
        } else {
            // Component Logic
            if ((node.incomingEdges || 0) > 3) {
                className = 'hotspot';
            } else if ((node.incomingEdges || 0) === 0) {
                className = 'orphan';
            }
        }

        // Render Node
        if (node.type === 'api') {
            mermaidCode += `    ${node.id}[("${safeLabel}")]:::${className}\n`;
        } else if (node.type === 'hook') {
            mermaidCode += `    ${node.id}(["${safeLabel}"]):::${className}\n`;
        } else {
            mermaidCode += `    ${node.id}["${safeLabel}"]:::${className}\n`;
        }
    });

    // Add Edges
    data.edges.forEach(edge => {
        if (edge.type === 'calls') {
            mermaidCode += `    ${edge.from} -.-> ${edge.to}\n`;
        } else {
            mermaidCode += `    ${edge.from} --> ${edge.to}\n`;
        }
    });

    // Add Legend
    mermaidCode += '\n    subgraph Legend\n';
    mermaidCode += '        L1["Component"]:::component\n';
    mermaidCode += '        L2["Hotspot (>3 deps)"]:::hotspot\n';
    mermaidCode += '        L3["Orphan (0 deps)"]:::orphan\n';
    mermaidCode += '        L4[("API Call")]:::api\n';
    mermaidCode += '        L1 -->|Import| L2\n';
    mermaidCode += '        L1 -.->|Fetch| L4\n';
    mermaidCode += '    end\n';

    return mermaidCode;
}

// --- Adapter for Current Parser ---
export function convertParsedFilesToGraph(files: ParsedFile[]): GraphData {
    const nodes: Map<string, GraphNode> = new Map();
    const edges: GraphEdge[] = [];
    const incomingCount: Map<string, number> = new Map();

    // Helper to get or create node
    const getOrCreateNode = (id: string, type: GraphNode['type'] = 'component', label?: string) => {
        if (!nodes.has(id)) {
            nodes.set(id, { id, label: label || id, type, incomingEdges: 0 });
        }
        return nodes.get(id)!;
    };

    files.forEach(file => {
        const fileId = path.basename(file.filePath).replace(/\.tsx?$/, '');
        getOrCreateNode(fileId, 'component');

        // Process Imports
        file.imports.forEach(imp => {
            const depId = path.basename(imp).replace(/\.tsx?$/, '');
            getOrCreateNode(depId, 'component');

            edges.push({ from: fileId, to: depId, type: 'imports' });
            
            // Increment incoming count for dependency
            incomingCount.set(depId, (incomingCount.get(depId) || 0) + 1);
        });

        // Process API Calls
        file.apiCalls.forEach(api => {
            const apiId = `API_${api.method}_${api.url.replace(/[^a-zA-Z0-9]/g, '_')}`;
            const apiLabel = `${api.method} ${api.url}`;
            
            getOrCreateNode(apiId, 'api', apiLabel);
            edges.push({ from: fileId, to: apiId, type: 'calls' });
            
            // API nodes usually have 1 incoming per call, but we track it anyway
            incomingCount.set(apiId, (incomingCount.get(apiId) || 0) + 1);
        });
    });

    // Apply counts to nodes
    nodes.forEach(node => {
        node.incomingEdges = incomingCount.get(node.id) || 0;
    });

    return {
        nodes: Array.from(nodes.values()),
        edges
    };
}

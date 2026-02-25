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

// --- Constants ---
const IGNORED_CALLS = new Set([
    // Array methods
    'map', 'filter', 'reduce', 'forEach', 'find', 'some', 'every', 'includes', 'push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'join',
    // Promise methods
    'then', 'catch', 'finally',
    // JSON methods
    'json', 'stringify', 'parse',
    // String methods
    'toUpperCase', 'toLowerCase', 'trim', 'split', 'replace', 'replaceAll',
    // Event methods
    'stopPropagation', 'preventDefault',
    // Console
    'log', 'error', 'warn', 'info', 'debug'
]);

// --- Main Visualizer Function (Dependency Graph) ---
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

// --- Call Graph Visualizer ---
export function generateCallGraph(files: ParsedFile[]): string {
    let mermaidCode = 'flowchart TB;\n';
    mermaidCode += '    classDef function fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,rx:10,ry:10;\n';
    mermaidCode += '    classDef file fill:#eceff1,stroke:#455a64,stroke-width:1px,stroke-dasharray: 5 5;\n';
    mermaidCode += '    classDef store fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,rx:5,ry:5;\n'; // Yellow for stores

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
        mermaidCode += `    ${subgraphNodes[i]} ~~~ ${subgraphNodes[i+1]}\n`;
    }

    mermaidCode += '    end\n'; // Close master subgraph

    return mermaidCode;
}

// --- Taxonomy Graph Visualizer ---
export function generateTaxonomyGraph(files: ParsedFile[], tagsMap: Map<string, string[]>): string {
    let mermaidCode = 'graph TD;\n'; 
    mermaidCode += '    classDef component fill:#e1f5fe,stroke:#01579b,stroke-width:2px;\n';

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

        // Create a unique ID for the subgraph to link them
        // Note: Mermaid doesn't support linking subgraphs directly easily, 
        // so we link the first node of each group invisibly.
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
        mermaidCode += `    ${subgraphIds[i]} ~~~ ${subgraphIds[i+1]}\n`;
    }

    mermaidCode += '    end\n'; // Close master subgraph

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

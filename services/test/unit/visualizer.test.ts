import { describe, it, expect } from 'vitest';
import { convertParsedFilesToGraph, generateMermaid, GraphData } from '../../scripts/visualizer';
import { ParsedFile } from '../../core/parser';

describe('Visualizer Logic', () => {
    
    const mockParsedFiles: ParsedFile[] = [
        {
            filePath: '/src/Parent.tsx',
            imports: ['./Child', './Shared'],
            apiCalls: []
        },
        {
            filePath: '/src/Child.tsx',
            imports: ['./Shared'],
            apiCalls: [{ url: '/api/data', method: 'GET' }]
        },
        {
            filePath: '/src/Shared.tsx',
            imports: [],
            apiCalls: []
        },
        {
            filePath: '/src/Orphan.tsx',
            imports: [],
            apiCalls: []
        }
    ];

    describe('convertParsedFilesToGraph', () => {
        it('should create nodes for all files and dependencies', () => {
            const graph = convertParsedFilesToGraph(mockParsedFiles);
            
            const nodeIds = graph.nodes.map(n => n.id);
            expect(nodeIds).toContain('Parent');
            expect(nodeIds).toContain('Child');
            expect(nodeIds).toContain('Shared');
            expect(nodeIds).toContain('Orphan');
        });

        it('should create edges for imports', () => {
            const graph = convertParsedFilesToGraph(mockParsedFiles);
            
            const importEdges = graph.edges.filter(e => e.type === 'imports');
            expect(importEdges).toHaveLength(3); // Parent->Child, Parent->Shared, Child->Shared
        });

        it('should create nodes and edges for API calls', () => {
            const graph = convertParsedFilesToGraph(mockParsedFiles);
            
            const apiNode = graph.nodes.find(n => n.type === 'api');
            expect(apiNode).toBeDefined();
            expect(apiNode?.label).toBe('GET /api/data');

            const apiEdge = graph.edges.find(e => e.type === 'calls');
            expect(apiEdge).toBeDefined();
            expect(apiEdge?.from).toBe('Child');
        });

        it('should correctly count incoming edges (Hotspot detection)', () => {
            const graph = convertParsedFilesToGraph(mockParsedFiles);
            
            const sharedNode = graph.nodes.find(n => n.id === 'Shared');
            expect(sharedNode?.incomingEdges).toBe(2); // Imported by Parent and Child

            const orphanNode = graph.nodes.find(n => n.id === 'Orphan');
            expect(orphanNode?.incomingEdges).toBe(0);
        });
    });

    describe('generateMermaid', () => {
        it('should generate valid Mermaid syntax', () => {
            const graphData: GraphData = {
                nodes: [
                    { id: 'A', label: 'A', type: 'component', incomingEdges: 5 }, // Hotspot
                    { id: 'B', label: 'B', type: 'component', incomingEdges: 0 }  // Orphan
                ],
                edges: [
                    { from: 'A', to: 'B', type: 'imports' }
                ]
            };

            const mermaid = generateMermaid(graphData);

            expect(mermaid).toContain('graph TD;');
            expect(mermaid).toContain('A["A"]:::hotspot'); // Check hotspot class
            expect(mermaid).toContain('B["B"]:::orphan');  // Check orphan class
            expect(mermaid).toContain('A --> B');
            expect(mermaid).toContain('subgraph Legend');
        });
    });
});

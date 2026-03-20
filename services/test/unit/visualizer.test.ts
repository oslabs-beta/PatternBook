import { describe, it, expect } from 'vitest';
<<<<<<< HEAD
import {
  convertParsedFilesToGraph,
  generateMermaid,
  GraphData,
} from '../../scripts/visualizer';
import { ParsedFile } from '../../core/parser';

describe('Visualizer Logic', () => {
  // Use simple filenames to avoid OS-specific path separator issues in tests
  const mockParsedFiles: ParsedFile[] = [
    {
      filePath: 'App.tsx',
      imports: ['./Child', './Shared', './Utils', './useAuth', './appStore'],
      apiCalls: [],
      functions: [{ name: 'App', calls: [] }],
      props: [],
      documentation: '',
    },
    {
      filePath: 'Child.tsx',
      imports: ['./Shared'],
      apiCalls: [{ url: '/api/data', method: 'GET' }],
      functions: [{ name: 'Child', calls: [{ name: 'fetch', args: [] }] }],
      props: [],
      documentation: '',
    },
    {
      filePath: 'Shared.tsx',
      imports: [],
      apiCalls: [],
      functions: [{ name: 'Shared', calls: [] }],
      props: [],
      documentation: '',
    },
    {
      filePath: 'useAuth.ts',
      imports: [],
      apiCalls: [],
      functions: [{ name: 'useAuth', calls: [] }],
      props: [],
      documentation: '',
    },
    {
      filePath: 'appStore.ts',
      imports: ['zustand'],
      apiCalls: [],
      functions: [],
      props: [],
      documentation: '',
    },
  ];

  describe('convertParsedFilesToGraph', () => {
    it('should create nodes with correct metrics', () => {
      const graph = convertParsedFilesToGraph(mockParsedFiles);

      const appNode = graph.nodes.find(n => n.id === 'App');
      expect(appNode).toBeDefined();
      expect(appNode?.metrics.imports).toBe(5);

      const childNode = graph.nodes.find(n => n.id === 'Child');
      expect(childNode?.metrics.apiCalls).toBe(1);
      expect(childNode?.metrics.functionCalls).toBe(1);
    });

    it('should identify node types correctly', () => {
      const graph = convertParsedFilesToGraph(mockParsedFiles);

      const hookNode = graph.nodes.find(n => n.id === 'useAuth');
      expect(hookNode?.type).toBe('hook');

      const storeNode = graph.nodes.find(n => n.id === 'appStore');
      expect(storeNode?.type).toBe('store');
    });
  });

  describe('generateMermaid', () => {
    const graphData: GraphData = convertParsedFilesToGraph(mockParsedFiles);

    it('should always show App component', () => {
      const mermaid = generateMermaid(graphData, { minImports: 5 });
      expect(mermaid).toContain('App');
    });

    it('should show dependencies of focus nodes (Recursive Traversal)', () => {
      // App (Focus) -> Child -> Shared
      // Shared has 0 imports, but should be visible because it's reachable from App
      const mermaid = generateMermaid(graphData, { minImports: 5 });
      expect(mermaid).toContain('Child');
      expect(mermaid).toContain('Shared');
    });

    it('should generate layers', () => {
      const mermaid = generateMermaid(graphData);
      expect(mermaid).toContain('subgraph UI_Layer');
      expect(mermaid).toContain('subgraph Logic_Layer');
      expect(mermaid).toContain('subgraph Data_Layer');
    });

    it('should generate horizontal legend', () => {
      const mermaid = generateMermaid(graphData);
      expect(mermaid).toContain('direction LR');
      expect(mermaid).toContain('subgraph Legend');
    });
  });
=======
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
>>>>>>> origin/main
});

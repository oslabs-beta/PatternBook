import { describe, it, expect } from 'vitest';
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
});

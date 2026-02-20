
// types for dependency graph and relationship mapping

export interface DependencyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: GraphMetadata;
}

export interface GraphNode {
  id: string; // File path
  name: string; // Component/hook name
  type: 'component' | 'hook' | 'utility';
  filePath: string;
  props?: number; // Number of props
  hooks?: string[]; // Hook names used
}

export interface GraphEdge {
  from: string; // Source file path
  to: string; // Target file path
  type: 'imports' | 'uses-hook' | 'renders';
  weight?: number; // For importance/frequency
}

export interface GraphMetadata {
  totalNodes: number;
  totalEdges: number;
  componentsCount: number;
  hooksCount: number;
  maxDepth: number;
  circularDependencies: string[][];
}

export interface ImpactAnalysis {
  targetFile: string;
  directDependents: string[]; // Files that import this
  indirectDependents: string[]; // Files that import the direct dependents
  affectedComponents: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ComponentRelationship {
  component: string;
  usesHooks: string[];
  importsComponents: string[];
  rendersComponents: string[];
  importedBy: string[];
}
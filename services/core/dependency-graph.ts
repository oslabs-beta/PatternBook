import type { ComponentMetadata } from '../types/parser.js';
import type { DependencyGraph, GraphNode, GraphEdge, GraphMetadata, ImpactAnalysis } from '../types/graph.js';

/**
 * Builds and analyzes dependency graphs from parsed component metadata
 * Refactored from scripts/dependency-mapper.ts
 */
export class DependencyGraphBuilder {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];

  /**
   * Build graph from component metadata
   */
  buildGraph(components: ComponentMetadata[]): DependencyGraph {
    this.nodes.clear();
    this.edges = [];

    // Create nodes
    components.forEach(comp => {
      this.addNode(comp);
    });

    // Create edges from imports
    components.forEach(comp => {
      this.addEdges(comp, components);
    });

    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
      metadata: this.calculateMetadata()
    };
  }

  private addNode(component: ComponentMetadata): void {
    const node: GraphNode = {
      id: component.path,
      name: component.name,
      type: component.type,
      filePath: component.path,
      props: component.props?.length,
      hooks: component.hooks?.map(h => h.name),
    };

    this.nodes.set(component.path, node);
  }

  private addEdges(component: ComponentMetadata, allComponents: ComponentMetadata[]): void {
    const internalImports = component.imports.filter(imp => imp.isInternal);

    internalImports.forEach(imp => {
      // Find the target component by matching import source
      const targetComponent = this.findComponentByImport(imp.source, component.path, allComponents);
      
      if (targetComponent) {
        this.edges.push({
          from: component.path,
          to: targetComponent.path,
          type: 'imports',
        });
      }
    });

    // Add hook usage edges
    if (component.hooks) {
      component.hooks.forEach(hook => {
        // Find if this hook is defined in our codebase
        const hookComponent = allComponents.find(c => c.name === hook.name && c.type === 'hook');
        
        if (hookComponent) {
          this.edges.push({
            from: component.path,
            to: hookComponent.path,
            type: 'uses-hook',
          });
        }
      });
    }
  }

  private findComponentByImport(
    importPath: string,
    fromPath: string,
    allComponents: ComponentMetadata[]
  ): ComponentMetadata | undefined {
    // Simplified: match by component name in the import path
    // TODO: Implement proper path resolution
    
    const importName = importPath.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '');
    
    return allComponents.find(c => 
      c.name === importName || 
      c.path.includes(importPath)
    );
  }

  private calculateMetadata(): GraphMetadata {
    const components = Array.from(this.nodes.values()).filter(n => n.type === 'component');
    const hooks = Array.from(this.nodes.values()).filter(n => n.type === 'hook');

    return {
      totalNodes: this.nodes.size,
      totalEdges: this.edges.length,
      componentsCount: components.length,
      hooksCount: hooks.length,
      maxDepth: this.calculateMaxDepth(),
      circularDependencies: this.findCircularDependencies(),
    };
  }

  private calculateMaxDepth(): number {
    // TODO: Implement proper depth calculation using DFS
    return 0;
  }

  private findCircularDependencies(): string[][] {
    // TODO: Implement cycle detection
    return [];
  }

  /**
   * Analyze impact of changing a component
   * Answers: "What breaks if I modify this file?"
   */
  analyzeImpact(targetPath: string): ImpactAnalysis {
    const directDependents = this.findDirectDependents(targetPath);
    const indirectDependents = this.findIndirectDependents(targetPath, directDependents);
    
    const allAffected = [...directDependents, ...indirectDependents];
    const affectedComponents = allAffected
      .map(path => this.nodes.get(path))
      .filter(node => node?.type === 'component')
      .map(node => node!.name);

    return {
      targetFile: targetPath,
      directDependents,
      indirectDependents,
      affectedComponents,
      riskLevel: this.calculateRiskLevel(allAffected.length),
    };
  }

  /**
   * Find all files that directly import the target
   */
  private findDirectDependents(targetPath: string): string[] {
    return this.edges
      .filter(edge => edge.to === targetPath)
      .map(edge => edge.from);
  }

  /**
   * Find all files that depend on the direct dependents (recursive)
   */
  private findIndirectDependents(targetPath: string, directDependents: string[]): string[] {
    const indirect = new Set<string>();
    const visited = new Set([targetPath, ...directDependents]);

    const traverse = (paths: string[]) => {
      paths.forEach(path => {
        const dependents = this.findDirectDependents(path);
        dependents.forEach(dep => {
          if (!visited.has(dep)) {
            visited.add(dep);
            indirect.add(dep);
            traverse([dep]);
          }
        });
      });
    };

    traverse(directDependents);
    return Array.from(indirect);
  }

  private calculateRiskLevel(affectedCount: number): 'low' | 'medium' | 'high' {
    if (affectedCount === 0) return 'low';
    if (affectedCount <= 3) return 'medium';
    return 'high';
  }

  /**
   * Get all dependencies of a component (what it imports)
   */
  getDependencies(componentPath: string): string[] {
    return this.edges
      .filter(edge => edge.from === componentPath)
      .map(edge => edge.to);
  }

  /**
   * Get all dependents of a component (what imports it)
   */
  getDependents(componentPath: string): string[] {
    return this.edges
      .filter(edge => edge.to === componentPath)
      .map(edge => edge.from);
  }

  /**
   * Export graph in various formats
   */
  toJSON(): string {
    return JSON.stringify({
      nodes: Array.from(this.nodes.values()),
      edges: this.edges,
      metadata: this.calculateMetadata(),
    }, null, 2);
  }
}
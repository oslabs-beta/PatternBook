import { writeFileSync } from 'node:fs';
import { ComponentMetadata } from '../types/parser.js';
import { DependencyGraphBuilder } from './dependency-graph.js';

export class ManifestGenerator {
  private builder = new DependencyGraphBuilder();

  /**
   * Transforms raw metadata into the final JSON manifest
   */
  generate(components: ComponentMetadata[], outputPath: string): void {
    const manifest = {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      components: components.map(comp => ({
        name: comp.name,
        path: comp.path,
        type: comp.type,
        description: comp.description || '',
        props: comp.props || [],
        hooks: comp.hooks || []
      })),
      // Use your existing builder to include the graph in the JSON
      graph: this.builder.buildGraph(components)
    };

    writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  }
}
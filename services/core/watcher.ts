import chokidar, { FSWatcher } from 'chokidar';
import { parserFactory } from './parsers/index.js';
import type { ComponentMetadata, ParseOptions } from '../types/parser.js';
import { DependencyGraphBuilder } from './dependency-graph.js';

export interface WatchOptions {
  directory: string;
  patterns?: string[];
  ignored?: string[];
  onParse?: (metadata: ComponentMetadata) => void;
  onError?: (error: Error, filePath: string) => void;
  onReady?: () => void;
  verbose?: boolean;
}

/**
 * File watcher that re-parses components on change
 * Refactored from watch-parser.ts with better structure
 */
export class ComponentWatcher {
  private watcher: FSWatcher | null = null;
  private components: Map<string, ComponentMetadata> = new Map();
  private graphBuilder: DependencyGraphBuilder;
  private parseOptions: ParseOptions;

  constructor(private options: WatchOptions) {
    this.graphBuilder = new DependencyGraphBuilder();
    this.parseOptions = {
      extractDocs: true,
      extractHooks: true,
      extractProps: true,
      verbose: options.verbose,
    };
  }

  /**
   * Start watching for file changes
   */
  async start(): Promise<void> {
  // Watch the directory directly, not with patterns + cwd
  this.watcher = chokidar.watch(this.options.directory, {
    ignored: [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/build/**',
      '**/*.test.*',
      '**/*.spec.*',
      ...(this.options.ignored || []),
    ],
    persistent: true,
    ignoreInitial: false,
    depth: 10,  // Reasonable depth limit
  });

  this.watcher
    .on('ready', () => {
      this.log('✅ Watcher ready. Monitoring for changes...');
      this.options.onReady?.();
    })
    .on('add', (path) => this.handleFileChange('add', path))
    .on('change', (path) => this.handleFileChange('change', path))
    .on('unlink', (path) => this.handleFileDelete(path));
  };

  /**
   * Stop watching
   */
  async stop(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
      this.log('Watcher stopped');
    }
  }

  private async handleFileChange(event: 'add' | 'change', filePath: string): Promise<void> {
    // Skip non-component files
    if (!this.isComponentFile(filePath)) return;

    this.log(`[${event}] ${filePath}`);

    try {
      const result = await parserFactory.parseFile(filePath, this.parseOptions);

      if (result.success && result.metadata) {
        this.components.set(filePath, result.metadata);
        this.options.onParse?.(result.metadata);
        
        // Rebuild graph
        this.rebuildGraph();
        
        // Analyze impact if this was a change (not initial add)
        if (event === 'change') {
          this.analyzeImpact(filePath);
        }
      } else {
        this.logError(`Failed to parse ${filePath}: ${result.error}`);
        this.options.onError?.(new Error(result.error || 'Unknown error'), filePath);
      }
    } catch (error) {
      this.logError(`Error parsing ${filePath}:`, error);
      this.options.onError?.(error as Error, filePath);
    }
  }

  private handleFileDelete(filePath: string): void {
    if (this.components.has(filePath)) {
      this.log(`[delete] ${filePath}`);
      this.components.delete(filePath);
      this.rebuildGraph();
    }
  }

  private rebuildGraph(): void {
    const allComponents = Array.from(this.components.values());
    const graph = this.graphBuilder.buildGraph(allComponents);
    
    if (this.options.verbose) {
      this.log(`📊 Graph rebuilt: ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
    }
  }

  private analyzeImpact(filePath: string): void {
    const impact = this.graphBuilder.analyzeImpact(filePath);
    
    if (impact.directDependents.length > 0) {
      this.log(`\n⚠️  Change Impact for ${filePath}:`);
      this.log(`   Risk Level: ${impact.riskLevel.toUpperCase()}`);
      this.log(`   Direct dependents: ${impact.directDependents.length}`);
      this.log(`   Indirect dependents: ${impact.indirectDependents.length}`);
      
      if (this.options.verbose && impact.affectedComponents.length > 0) {
        this.log(`   Affected components: ${impact.affectedComponents.join(', ')}`);
      }
    }
  }

  private isComponentFile(filePath: string): boolean {
  // Match the patterns we care about
  const patterns = this.options.patterns || ['**/*.{tsx,jsx,vue,svelte}'];
  
  // Simple extension check
  return /\.(tsx|jsx|vue|svelte)$/.test(filePath);
  };

  private log(message: string): void {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
  }

  private logError(message: string, error?: unknown): void {
    console.error(`❌ ${message}`, error);
  }

  /**
   * Get current state
   */
  getComponents(): ComponentMetadata[] {
    return Array.from(this.components.values());
  }

  getGraph() {
    return this.graphBuilder.buildGraph(this.getComponents());
  }
}

/**
 * Convenience function to start watching
 */
export async function watch(options: WatchOptions): Promise<ComponentWatcher> {
  const watcher = new ComponentWatcher(options);
  await watcher.start();
  return watcher;
}
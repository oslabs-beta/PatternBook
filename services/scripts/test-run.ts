import { ComponentWatcher } from '../core/watcher.ts';
import { CodeParser } from '../core/parser.ts';
import {
  generateMermaid,
  generateCallGraph,
} from './visualizer.ts';
import { Exporter } from '../core/exporter.ts';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DependencyGraphBuilder } from '../core/dependency-graph.js';
import { ComponentMetadata } from '../types/parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI Args
const args = process.argv.slice(2);
const scanPath = args[0]
  ? path.resolve(process.cwd(), args[0])
  : path.resolve(__dirname, '../test/fixtures');
// Default README path is the scan path itself (Exporter will look for README.md inside)
let readmePath = args[1] ? path.resolve(process.cwd(), args[1]) : scanPath;

// Check for --watch flag
const isWatchMode = args.includes('--watch');

console.log(`Starting Dependency Scan on: ${scanPath}`);
console.log(`Target README Path: ${readmePath}`);
console.log(`Mode: ${isWatchMode ? 'Watch' : 'Scan Once'}`);

// Initialize CodeParser for Call Graph (since Watcher doesn't provide it)
const codeParser = new CodeParser();

// Initialize Watcher
const watcher = new ComponentWatcher({
  directory: scanPath,
  verbose: true,
  onReady: async () => {
    console.log('Watcher ready. Generating initial graphs...');
    await updateVisuals();
    if (!isWatchMode) {
      console.log('Scan complete. Exiting.');
      await watcher.stop();
      process.exit(0);
    }
  },
  onParse: async metadata => {
    console.log(`File changed: ${metadata.relativePath}. Updating graphs...`);
    await updateVisuals();
  },
  onError: err => console.error('Watcher error:', err),
});

const graphBuilder = new DependencyGraphBuilder();
async function updateVisuals() {
  try {
    // 1. Get components from watcher
    const components: ComponentMetadata[] = watcher.getComponents();

    // 2. Generate Dependency Graph
    const dependencyGraph = graphBuilder.buildGraph(components);
    const mermaidGraph = generateMermaid(dependencyGraph);

    // 3. Generate Call Graph (Placeholder until we sync the logic)
    const callGraph = generateCallGraph(components);

    // 4. Update README
    Exporter.updateReadme(readmePath, [
      {
        name: 'DEPENDENCY_GRAPH',
        title: 'Dependency Graph',
        content: mermaidGraph,
      },
      { 
        name: 'CALL_GRAPH', 
        title: 'Call Graph', 
        content: callGraph 
      },
    ]);
   

    // 5. Save .mmd files for the Mermaid CLI
    const depGraphPath = path.resolve(process.cwd(), 'dependency-graph.mmd');
    const callGraphPath = path.resolve(process.cwd(), 'call-graph.mmd');

    fs.writeFileSync(depGraphPath, mermaidGraph);
    fs.writeFileSync(callGraphPath, callGraph); // This was likely the line causing the error
    
    console.log(`✅ Saved graphs to ${depGraphPath} and ${callGraphPath}`);
  } catch (error) {
    console.error('Error updating visuals:', error);
  }
}

// Start watching
watcher.start().catch(err => console.error('Failed to start watcher:', err));

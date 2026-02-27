import { ComponentWatcher } from '../core/watcher.ts';
import { CodeParser } from '../core/parser.ts';
import { generateMermaid, generateCallGraph, convertParsedFilesToGraph } from './visualizer.ts';
import { Exporter } from '../core/exporter.ts';
import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI Args
const args = process.argv.slice(2);
const scanPath = args[0] ? path.resolve(process.cwd(), args[0]) : path.resolve(__dirname, '../test/fixtures');
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
    onParse: async (metadata) => {
        console.log(`File changed: ${metadata.relativePath}. Updating graphs...`);
        await updateVisuals();
    },
    onError: (err) => console.error('Watcher error:', err)
});

async function updateVisuals() {
    try {
        // 1. Get files from Watcher
        const components = watcher.getComponents();
        
        // 2. Parse with CodeParser (which extracts API calls and function calls)
        // Note: This is redundant parsing but necessary until Watcher uses CodeParser or equivalent
        const parsedFiles = components.map(c => codeParser.parseFile(c.path));
        
        // 3. Generate GraphData using visualizer's converter
        const graphData = convertParsedFilesToGraph(parsedFiles);

        // 4. Generate Mermaid for Dependency Graph
        const mermaidGraph = generateMermaid(graphData);
        
        // 5. Generate Call Graph
        const callGraph = generateCallGraph(parsedFiles);

        // 6. Update README using Exporter
        // Exporter handles finding README.md inside the directory if needed
        Exporter.updateReadme(readmePath, [
            { name: 'DEPENDENCY_GRAPH', title: 'Dependency Graph', content: mermaidGraph },
            { name: 'CALL_GRAPH', title: 'Call Graph', content: callGraph }
        ]);
        
        // Fallback: Save to file if README update fails or for debugging
        if (!fs.existsSync(path.join(readmePath, 'README.md')) && !fs.existsSync(readmePath)) {
             const debugPath = path.resolve(__dirname, '../dependency-graph.mmd');
             fs.writeFileSync(debugPath, mermaidGraph);
             console.log(`Saved graph to ${debugPath} (README not found)`);
        }

    } catch (error) {
        console.error('Error updating visuals:', error);
    }
}

// Start watching
watcher.start().catch(err => console.error('Failed to start watcher:', err));
import { CodeParser, ParsedFile } from '../core/parser.ts';
import { TagProcessor } from '../core/tag-processor.ts';
import { generateMermaid, convertParsedFilesToGraph, generateCallGraph } from './visualizer.ts';
import { Exporter } from '../core/exporter.ts';
import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFolder = path.resolve(__dirname, '../test/fixtures');

console.log('Starting Dependency Scan ---');

// 1. Find files
const files = fg.sync(`${testFolder}/**/*.tsx`.replace(/\\/g, '/'));

// 2. Parse files
const parser = new CodeParser();
const parsedFiles: ParsedFile[] = files.map(file => parser.parseFile(file));

// DEBUG: Print parsed functions
parsedFiles.forEach(f => {
    console.log(`\nFile: ${path.basename(f.filePath)}`);
    console.log(`Functions: ${f.functions.map(fn => `${fn.name} calls [${fn.calls.map(c => c.name).join(', ')}]`).join('\n')}`);
});

// 3. Process Tags (Optional for now, but kept for future use)
const tagProcessor = new TagProcessor();
const tagsMap = new Map<string, string[]>();

parsedFiles.forEach(file => {
    // Convert ParsedFile to ComponentMetadata (partial) for TagProcessor
    const metadata = {
        name: path.basename(file.filePath).replace(/\.tsx?$/, ''),
        path: file.filePath,
        relativePath: path.relative(process.cwd(), file.filePath),
        props: file.props.map(p => ({
            name: p.name,
            type: p.type,
            isOptional: !p.required
        })),
        documentation: file.documentation,
        type: file.functions.some(f => f.name.startsWith('use')) ? 'hook' : 'component',
        exports: { named: [] }, // Placeholder
        imports: [] // Placeholder
    };
    
    const tags = tagProcessor.process(metadata as any);
    tagsMap.set(file.filePath, tags);
});

// 4. Generate Dependency Graph
const graphData = convertParsedFilesToGraph(parsedFiles);
const mermaidGraph = generateMermaid(graphData);
const outputPath = path.resolve(__dirname, '../dependency-graph.mmd');
fs.writeFileSync(outputPath, mermaidGraph);
console.log(`\n--- 📊 Dependency Graph Generated ---`);
console.log(`Saved to: ${outputPath}`);

// 5. Generate Call Graph
const callGraph = generateCallGraph(parsedFiles);
const callGraphPath = path.resolve(__dirname, '../call-graph.mmd');
fs.writeFileSync(callGraphPath, callGraph);
console.log(`\n--- 📞 Call Graph Generated ---`);
console.log(`Saved to: ${callGraphPath}`);

// 6. Update README.md using Exporter
const readmeDir = path.resolve(__dirname, '../');
Exporter.updateReadme(readmeDir, [
    { name: 'DEPENDENCY_GRAPH', title: 'Dependency Graph (Imports & API Calls)', content: mermaidGraph },
    { name: 'CALL_GRAPH', title: 'Call Graph (Function Interactions)', content: callGraph }
]);
console.log(`\n--- 📝 README.md Updated ---`);

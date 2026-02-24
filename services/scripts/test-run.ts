import { CodeParser, ParsedFile } from '../core/parser.ts';
import { generateMermaid, convertParsedFilesToGraph } from './visualizer.ts';
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

// 3. Convert to Graph Data
const graphData = convertParsedFilesToGraph(parsedFiles);

// 4. Generate Mermaid Diagram
const mermaidGraph = generateMermaid(graphData);
const outputPath = path.resolve(__dirname, '../dependency-graph.mmd');

fs.writeFileSync(outputPath, mermaidGraph);
console.log(`\n--- 📊 Mermaid Diagram Generated ---`);
console.log(`Saved to: ${outputPath}`);
console.log(mermaidGraph);

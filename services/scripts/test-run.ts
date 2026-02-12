import { buildProjectGraph, type ComponentGraph, getAffectedParents } from './dependency-mapper.ts';
import * as path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFolder: string = path.resolve(__dirname, '../../test-components');

console.log('Starting Dependency Scan ---');

//Generate the Graph
const graph: ComponentGraph = buildProjectGraph(testFolder);


// 3. Print the results in a pretty format
console.log('Project Dependency Graph:');
console.dir(graph, { depth: null });

const target: string = 'Button';
const affected = getAffectedParents(target, graph);

console.log(`\n--- ⚠️ Change Intelligence Report ---`);
console.log(`If you modify "${target}", these components might be affected:`);
console.log(affected.length > 0 ? affected : 'None (this is a root component)');
#!/usr/bin/env node

import { Command } from 'commander';
<<<<<<< HEAD
import { scanCommand } from './commands/scan.js';
import { watchCommand } from './commands/watch.js';
import { analyzeCommand } from './commands/analyze.js';
import { generateCommand } from './commands/generate.js';
=======
import { scanCommand } from './commands/scan.ts';
import { watchCommand } from './commands/watch.ts';
import { analyzeCommand } from './commands/analyze.ts';
import { generateCommand } from './commands/generate.ts';
>>>>>>> origin/main

const program = new Command();

program
  .name('patternbook')
  .description('Lightweight component scanner and dependency analyzer')
  .version('0.2.0');

// Scan command - Find all components
program
  .command('scan')
  .description('Scan project for components and hooks')
  .argument('[directory]', 'Directory to scan', '.')
<<<<<<< HEAD
  .option(
    '-f, --framework <framework>',
    'Target framework (react|vue|svelte|auto)',
    'auto',
  )
=======
  .option('-f, --framework <framework>', 'Target framework (react|vue|svelte|auto)', 'auto')
>>>>>>> origin/main
  .option('-p, --pattern <pattern>', 'File pattern to match')
  .option('-e, --exclude <pattern>', 'Pattern to exclude')
  .option('--include-node-modules', 'Include node_modules in scan', false)
  .option('--no-respect-gitignore', 'Ignore .gitignore files')
  .option('-v, --verbose', 'Verbose output', false)
  .option('-o, --output <file>', 'Output file for results', 'scan-results.json')
  .action(scanCommand);

// Watch command - Watch for changes and re-scan
program
  .command('watch')
  .description('Watch for file changes and re-scan')
  .argument('[directory]', 'Directory to watch', '.')
<<<<<<< HEAD
  .option(
    '-f, --framework <framework>',
    'Target framework (react|vue|svelte|auto)',
    'auto',
  )
  .option('-v, --verbose', 'Verbose output', false)
  .option(
    '-o, --output <file>',
    'Output file for results',
    'library-metadata.json',
  )
=======
  .option('-f, --framework <framework>', 'Target framework (react|vue|svelte|auto)', 'auto')
  .option('-v, --verbose', 'Verbose output', false)
  .option('-o, --output <file>', 'Output file for results', 'library-metadata.json')
>>>>>>> origin/main
  .action(watchCommand);

// Analyze command - Dependency analysis and impact reports
program
  .command('analyze')
  .description('Analyze component dependencies and relationships')
  .argument('[directory]', 'Directory to analyze', '.')
  .option('-t, --target <file>', 'Target file to analyze impact for')
  .option('-v, --verbose', 'Verbose output', false)
<<<<<<< HEAD
  .option(
    '-o, --output <file>',
    'Output file for graph',
    'dependency-graph.json',
  )
=======
  .option('-o, --output <file>', 'Output file for graph', 'dependency-graph.json')
>>>>>>> origin/main
  .option('--format <format>', 'Output format (json|mermaid)', 'json')
  .action(analyzeCommand);

// Generate command - Generate component library manifest
program
  .command('generate')
  .description('Generate complete component library manifest')
  .argument('[directory]', 'Directory to scan', '.')
<<<<<<< HEAD
  .option(
    '-o, --output <file>',
    'Output manifest file',
    'library-manifest.json',
  )
=======
  .option('-o, --output <file>', 'Output manifest file', 'library-manifest.json')
>>>>>>> origin/main
  .option('--include-docs', 'Include JSDoc documentation', true)
  .option('--include-props', 'Include prop definitions', true)
  .option('--include-hooks', 'Include hook usage', true)
  .option('--include-graph', 'Include dependency graph', true)
  .option('-v, --verbose', 'Verbose output', false)
  .action(generateCommand);

<<<<<<< HEAD
program.parse();
=======
program.parse();
>>>>>>> origin/main

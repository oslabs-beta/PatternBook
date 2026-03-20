import ora from 'ora';
import chalk from 'chalk';
import { writeFileSync } from 'fs';
<<<<<<< HEAD
import { ComponentScanner } from '../../core/scanner.js';
import { parserFactory } from '../../core/parsers/index.js';
import { DependencyGraphBuilder } from '../../core/dependency-graph.js';
import type { DependencyGraph } from '../../types/graph.js';
=======
import { ComponentScanner } from '../../core/scanner.ts';
import { parserFactory } from '../../core/parsers/index.ts';
import { DependencyGraphBuilder } from '../../core/dependency-graph.ts';
import type { DependencyGraph } from '../../types/graph.ts';
>>>>>>> origin/main

interface AnalyzeOptions {
  target?: string;
  verbose?: boolean;
  output?: string;
  format?: 'json' | 'mermaid';
}

<<<<<<< HEAD
export async function analyzeCommand(
  directory: string,
  options: AnalyzeOptions,
): Promise<void> {
=======
export async function analyzeCommand(directory: string, options: AnalyzeOptions): Promise<void> {
>>>>>>> origin/main
  const spinner = ora('Scanning and analyzing project...').start();

  try {
    // Step 1: Scan for files
    const scanner = new ComponentScanner({
      directory,
      framework: 'react',
      respectGitignore: true,
      includeNodeModules: false,
      verbose: options.verbose || false,
    });

    const scanResult = await scanner.scan();
    spinner.text = `Found ${scanResult.files.length} files. Parsing...`;

    // Step 2: Parse all files
    const parseResults = await parserFactory.parseFiles(
      scanResult.files.map(f => f.path),
<<<<<<< HEAD
      { extractDocs: true, extractHooks: true, extractProps: true },
=======
      { extractDocs: true, extractHooks: true, extractProps: true }
>>>>>>> origin/main
    );

    const components = parseResults
      .filter(r => r.success && r.metadata)
      .map(r => r.metadata!);

    spinner.text = `Parsed ${components.length} components. Building dependency graph...`;

    // Step 3: Build dependency graph
    const graphBuilder = new DependencyGraphBuilder();
    const graph = graphBuilder.buildGraph(components);

    spinner.succeed(
      chalk.green(
<<<<<<< HEAD
        `✓ Analyzed ${graph.nodes.length} components with ${graph.edges.length} dependencies`,
      ),
=======
        `✓ Analyzed ${graph.nodes.length} components with ${graph.edges.length} dependencies`
      )
>>>>>>> origin/main
    );

    // Display statistics
    console.log(chalk.cyan('\n📊 Project Statistics:'));
    console.log(`   Components: ${graph.metadata.componentsCount}`);
    console.log(`   Hooks: ${graph.metadata.hooksCount}`);
    console.log(`   Dependencies: ${graph.metadata.totalEdges}`);

    // Step 4: Impact analysis (if target specified)
    if (options.target) {
      console.log(chalk.yellow(`\n⚠️  Impact Analysis for: ${options.target}`));
<<<<<<< HEAD

      const targetNode = graph.nodes.find(
        n => n.filePath.includes(options.target!) || n.name === options.target,
=======
      
      const targetNode = graph.nodes.find(n => 
        n.filePath.includes(options.target!) || n.name === options.target
>>>>>>> origin/main
      );

      if (targetNode) {
        const impact = graphBuilder.analyzeImpact(targetNode.filePath);
<<<<<<< HEAD

        console.log(
          `   Risk Level: ${chalk.bold(impact.riskLevel.toUpperCase())}`,
        );
        console.log(`   Direct Dependents: ${impact.directDependents.length}`);
        console.log(
          `   Indirect Dependents: ${impact.indirectDependents.length}`,
        );

=======
        
        console.log(`   Risk Level: ${chalk.bold(impact.riskLevel.toUpperCase())}`);
        console.log(`   Direct Dependents: ${impact.directDependents.length}`);
        console.log(`   Indirect Dependents: ${impact.indirectDependents.length}`);
        
>>>>>>> origin/main
        if (impact.affectedComponents.length > 0) {
          console.log(`\n   Affected Components:`);
          impact.affectedComponents.forEach(comp => {
            console.log(`   - ${comp}`);
          });
        } else {
<<<<<<< HEAD
          console.log(
            `   ✓ No components depend on this file (safe to modify)`,
          );
=======
          console.log(`   ✓ No components depend on this file (safe to modify)`);
>>>>>>> origin/main
        }
      } else {
        console.log(chalk.red(`   ✗ Target not found in project`));
      }
    }

    // Step 5: Save output
    const outputPath = options.output || 'dependency-graph.json';
<<<<<<< HEAD

    if (options.format === 'mermaid') {
      const mermaid = generateMermaidDiagram(graph);
      writeFileSync(outputPath.replace('.json', '.mmd'), mermaid);
      console.log(
        chalk.green(
          `\n💾 Mermaid diagram saved to: ${outputPath.replace('.json', '.mmd')}`,
        ),
      );
=======
    
    if (options.format === 'mermaid') {
      const mermaid = generateMermaidDiagram(graph);
      writeFileSync(outputPath.replace('.json', '.mmd'), mermaid);
      console.log(chalk.green(`\n💾 Mermaid diagram saved to: ${outputPath.replace('.json', '.mmd')}`));
>>>>>>> origin/main
    } else {
      writeFileSync(outputPath, graphBuilder.toJSON());
      console.log(chalk.green(`\n💾 Dependency graph saved to: ${outputPath}`));
    }

    // Step 6: Warnings
    if (graph.metadata.circularDependencies.length > 0) {
<<<<<<< HEAD
      console.log(
        chalk.red(
          `\n⚠️  Warning: ${graph.metadata.circularDependencies.length} circular dependencies detected!`,
        ),
      );
    }
  } catch (error) {
    spinner.fail(chalk.red('Analysis failed'));
    console.error(
      chalk.red(error instanceof Error ? error.message : 'Unknown error'),
    );
=======
      console.log(chalk.red(`\n⚠️  Warning: ${graph.metadata.circularDependencies.length} circular dependencies detected!`));
    }

  } catch (error) {
    spinner.fail(chalk.red('Analysis failed'));
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
>>>>>>> origin/main
    process.exit(1);
  }
}

function generateMermaidDiagram(graph: DependencyGraph): string {
  let mermaid = 'graph TD\n';
<<<<<<< HEAD

  // Add nodes
  graph.nodes.forEach(node => {
=======
  
  // Add nodes
  graph.nodes.forEach((node) => {
>>>>>>> origin/main
    const shape = node.type === 'hook' ? '([' : '[';
    const shapeEnd = node.type === 'hook' ? '])' : ']';
    mermaid += `  ${sanitizeId(node.id)}${shape}${node.name}${shapeEnd}\n`;
  });
<<<<<<< HEAD

  // Add edges
  graph.edges.forEach(edge => {
    const arrow = edge.type === 'uses-hook' ? '-.uses.->' : '-->';
    mermaid += `  ${sanitizeId(edge.from)} ${arrow} ${sanitizeId(edge.to)}\n`;
  });

=======
  
  // Add edges
  graph.edges.forEach((edge) => {
    const arrow = edge.type === 'uses-hook' ? '-.uses.->' : '-->';
    mermaid += `  ${sanitizeId(edge.from)} ${arrow} ${sanitizeId(edge.to)}\n`;
  });
  
>>>>>>> origin/main
  return mermaid;
}

function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9]/g, '_');
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main

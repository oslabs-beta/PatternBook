import ora from 'ora';
import chalk from 'chalk';
import { writeFileSync } from 'fs';
<<<<<<< HEAD
import { ComponentScanner } from '../../core/scanner.js';
import { parserFactory } from '../../core/parsers/index.js';
import { DependencyGraphBuilder } from '../../core/dependency-graph.js';
=======
import { ComponentScanner } from '../../core/scanner.ts';
import { parserFactory } from '../../core/parsers/index.ts';
import { DependencyGraphBuilder } from '../../core/dependency-graph.ts';
>>>>>>> origin/main

interface GenerateCommandOptions {
  output?: string;
  includeDocs?: boolean;
  includeProps?: boolean;
  includeHooks?: boolean;
  includeGraph?: boolean;
  verbose?: boolean;
}

export async function generateCommand(
  directory: string,
<<<<<<< HEAD
  options: GenerateCommandOptions,
=======
  options: GenerateCommandOptions
>>>>>>> origin/main
): Promise<void> {
  const spinner = ora('Generating component library manifest...').start();

  try {
    // Scan and parse
<<<<<<< HEAD
    const scanner = new ComponentScanner({
      directory,
=======
    const scanner = new ComponentScanner({ 
      directory, 
>>>>>>> origin/main
      framework: 'react',
      verbose: options.verbose || false,
    });
    const scanResult = await scanner.scan();
<<<<<<< HEAD

=======
    
>>>>>>> origin/main
    spinner.text = 'Parsing components...';
    const parseResults = await parserFactory.parseFiles(
      scanResult.files.map(f => f.path),
      {
        extractDocs: options.includeDocs !== false,
        extractHooks: options.includeHooks !== false,
        extractProps: options.includeProps !== false,
<<<<<<< HEAD
      },
=======
      }
>>>>>>> origin/main
    );

    const components = parseResults
      .filter(r => r.success)
      .map(r => r.metadata!);

    // Build manifest
    const manifest: any = {
      version: '1.0.0',
      generated: new Date().toISOString(),
      components: components.map(c => ({
        name: c.name,
        path: c.relativePath,
        type: c.type,
        tags: c.tags || [],
        ...(options.includeProps !== false && { props: c.props }),
        ...(options.includeHooks !== false && { hooks: c.hooks }),
<<<<<<< HEAD
        ...(options.includeDocs !== false && {
          documentation: c.documentation,
        }),
=======
        ...(options.includeDocs !== false && { documentation: c.documentation }),
>>>>>>> origin/main
      })),
    };

    // Add dependency graph if requested
    if (options.includeGraph !== false) {
      spinner.text = 'Building dependency graph...';
      const builder = new DependencyGraphBuilder();
      manifest.graph = builder.buildGraph(components);
    }

    // Save
    const outputPath = options.output || 'library-manifest.json';
    writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

    spinner.succeed(chalk.green(`✓ Generated manifest: ${outputPath}`));
    console.log(chalk.cyan(`\n📊 Summary:`));
<<<<<<< HEAD
    console.log(
      `   Components: ${components.filter(c => c.type === 'component').length}`,
    );
    console.log(
      `   Hooks: ${components.filter(c => c.type === 'hook').length}`,
    );
  } catch (error) {
    spinner.fail(chalk.red('Generation failed'));
    console.error(
      chalk.red(error instanceof Error ? error.message : 'Unknown error'),
    );
    process.exit(1);
  }
}
=======
    console.log(`   Components: ${components.filter(c => c.type === 'component').length}`);
    console.log(`   Hooks: ${components.filter(c => c.type === 'hook').length}`);

  } catch (error) {
    spinner.fail(chalk.red('Generation failed'));
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}
>>>>>>> origin/main

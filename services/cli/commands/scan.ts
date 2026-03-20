import ora from 'ora';
import chalk from 'chalk';
import { writeFileSync } from 'fs';
<<<<<<< HEAD
import { ComponentScanner } from '../../core/scanner.js';
import { parserFactory } from '../../core/parsers/index.js';
=======
import { ComponentScanner } from '../../core/scanner.ts';
import { parserFactory } from '../../core/parsers/index.ts';
>>>>>>> origin/main

interface ScanCommandOptions {
  framework?: 'react' | 'vue' | 'svelte' | 'auto';
  pattern?: string;
  exclude?: string;
  includeNodeModules?: boolean;
  respectGitignore?: boolean;
  verbose?: boolean;
  output?: string;
}

export async function scanCommand(
  directory: string,
<<<<<<< HEAD
  options: ScanCommandOptions,
=======
  options: ScanCommandOptions
>>>>>>> origin/main
): Promise<void> {
  const spinner = ora('Scanning for components...').start();

  try {
    // Step 1: Scan files
    const scanner = new ComponentScanner({
      directory,
      framework: options.framework || 'auto',
      pattern: options.pattern ? [options.pattern] : undefined,
      exclude: options.exclude ? [options.exclude] : undefined,
      includeNodeModules: options.includeNodeModules || false,
      respectGitignore: options.respectGitignore !== false,
      verbose: options.verbose || false,
    });

    const scanResult = await scanner.scan();
    spinner.text = `Found ${scanResult.files.length} files. Parsing...`;

    // Step 2: Parse components
    const parseResults = await parserFactory.parseFiles(
      scanResult.files.map(f => f.path),
      {
        extractDocs: true,
        extractHooks: true,
        extractProps: true,
<<<<<<< HEAD
      },
    );

    const components = parseResults.filter(r => r.success).map(r => r.metadata);

    spinner.succeed(chalk.green(`✓ Scanned ${components.length} components`));
=======
      }
    );

    const components = parseResults
      .filter(r => r.success)
      .map(r => r.metadata);

    spinner.succeed(
      chalk.green(`✓ Scanned ${components.length} components`)
    );
>>>>>>> origin/main

    // Step 3: Save results
    const outputPath = options.output || 'scan-results.json';
    const output = {
      components: components.map(c => ({
        name: c!.name,
        path: c!.relativePath,
        type: c!.type,
        props: c!.props?.length || 0,
        hooks: c!.hooks?.map(h => h.name) || [],
      })),
      stats: {
        total: components.length,
        components: components.filter(c => c!.type === 'component').length,
        hooks: components.filter(c => c!.type === 'hook').length,
      },
    };

    writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(chalk.green(`💾 Results saved to ${outputPath}`));
<<<<<<< HEAD
  } catch (error) {
    spinner.fail(chalk.red('Scan failed'));
    console.error(
      chalk.red(error instanceof Error ? error.message : 'Unknown error'),
    );
    process.exit(1);
  }
}
=======

  } catch (error) {
    spinner.fail(chalk.red('Scan failed'));
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}
>>>>>>> origin/main

import ora from 'ora';
import chalk from 'chalk';

import { ComponentScanner } from '../../core/scanner.js';
import { parserFactory } from '../../core/parsers/index.js';
import { ManifestGenerator } from '../../services/manifest-generator.js';

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
  options: GenerateCommandOptions,
): Promise<void> {
  const spinner = ora('Generating component library manifest...').start();

  try {
    // Scan and parse
    const scanner = new ComponentScanner({
      directory,
      framework: 'react',
      verbose: options.verbose || false,
    });
    const scanResult = await scanner.scan();

    spinner.text = 'Parsing components...';
    const parseResults = await parserFactory.parseFiles(
      scanResult.files.map(f => f.path),
      {
        extractDocs: options.includeDocs !== false,
        extractHooks: options.includeHooks !== false,
        extractProps: options.includeProps !== false,
      },
    );

    const components = parseResults
      .filter(r => r.success)
      .map(r => r.metadata!);

    // Build manifest
    spinner.text = 'Generating manifest and graph...';

    const generator = new ManifestGenerator();
    const outputPath = options.output || 'library-manifest.json';

    // This one line replaces about 25 lines of the old code
    generator.generate(components, outputPath, options);

    spinner.succeed(chalk.green(`✓ Generated manifest: ${outputPath}`));

    // Summary logging
    console.log(chalk.cyan(`\n📊 Summary:`));
    console.log(`   Components: ${components.filter(c => c.type === 'component').length}`);
    console.log(`   Hooks: ${components.filter(c => c.type === 'hook').length}`);

  } catch (error) {
    spinner.fail(chalk.red('Generation failed'));
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}
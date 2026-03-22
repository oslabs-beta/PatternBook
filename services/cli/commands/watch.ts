import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { watch } from '../../core/watcher.ts';
import type { ComponentMetadata } from '../../types/parser.ts';

interface WatchCommandOptions {
  framework?: 'react' | 'vue' | 'svelte' | 'auto';
  verbose?: boolean;
  output?: string;
}

export async function watchCommand(
  directory: string,
  options: WatchCommandOptions,
): Promise<void> {
  console.log(chalk.blue.bold('🚀 Starting PatternBook Watcher...\n'));
  console.log(chalk.gray(`Directory: ${directory}`));
  console.log(chalk.gray(`Framework: ${options.framework || 'auto'}`));
  console.log(
    chalk.gray(`Output: ${options.output || 'library-metadata.json'}\n`),
  );

  const allMetadata: ComponentMetadata[] = [];

  try {
    const watcher = await watch({
      directory,
      patterns: getPatternsByFramework(options.framework || 'auto'),
      verbose: options.verbose || false,

      onParse: metadata => {
        // Update or add metadata
        const existingIndex = allMetadata.findIndex(
          m => m.path === metadata.path,
        );

        if (existingIndex >= 0) {
          allMetadata[existingIndex] = metadata;
        } else {
          allMetadata.push(metadata);
        }

        // Save to file
        saveMetadata(allMetadata, options.output || 'library-metadata.json');

        // Log summary
        console.log(
          chalk.green(
            `✓ ${metadata.name} parsed (${allMetadata.length} total components)`,
          ),
        );
      },

      onError: (error, filePath) => {
        console.error(chalk.red(`✗ Error parsing ${filePath}:`), error.message);
      },

      onReady: () => {
        console.log(
          chalk.green('✅ Watcher ready. Monitoring for changes...\n'),
        );
      },
    });

    // Keep process running
    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\n\n⏹  Stopping watcher...'));
      await watcher.stop();
      console.log(chalk.green('✓ Watcher stopped'));
      process.exit(0);
    });
  } catch (error) {
    console.error(chalk.red('Failed to start watcher:'), error);
    process.exit(1);
  }
}

function getPatternsByFramework(framework: string): string[] {
  switch (framework) {
    case 'react':
      return ['**/*.{tsx,jsx}'];
    case 'vue':
      return ['**/*.vue'];
    case 'svelte':
      return ['**/*.svelte'];
    default:
      return ['**/*.{tsx,jsx,vue,svelte}'];
  }
}

function saveMetadata(metadata: ComponentMetadata[], outputPath: string): void {
  const output = metadata.map(m => ({
    name: m.name,
    path: m.relativePath,
    type: m.type,
    props: m.props || [],
    hooks: m.hooks?.map(h => h.name) || [],
    imports: m.imports.filter(i => i.isInternal).map(i => i.source),
  }));

  writeFileSync(outputPath, JSON.stringify(output, null, 2));
}

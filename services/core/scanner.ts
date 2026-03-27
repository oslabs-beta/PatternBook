import fg from 'fast-glob';
import { statSync } from 'fs';
import { resolve, basename, dirname, extname } from 'path';
import { getFrameworkPatterns } from './patterns.js';
import type { ScanOptions, ScanResult, ComponentFile } from '../types/index.js';
import { Project } from 'ts-morph';
import { isActuallyReactComponent } from '../utils/ast-helpers.js';
import { shouldIgnore } from '../utils/ignore.js';

export class ComponentScanner {
  private options: Required<ScanOptions>;

  constructor(options: ScanOptions) {
    this.options = this.normalizeOptions(options);
  }

  private normalizeOptions(options: ScanOptions): Required<ScanOptions> {
    const frameworkPatterns = getFrameworkPatterns(options.framework || 'auto');

    return {
      directory: resolve(options.directory || process.cwd()),
      pattern: options.pattern || [...frameworkPatterns.include],
      exclude: options.exclude || frameworkPatterns.exclude,
      includeNodeModules: options.includeNodeModules ?? false,
      respectGitignore: options.respectGitignore ?? true,
      framework: options.framework || 'auto',
      verbose: options.verbose ?? false,
    };
  }

  async scan(): Promise<ScanResult> {
    const startTime = Date.now();

    // Build exclude patterns
    const excludePatterns = [...this.options.exclude];
    if (!this.options.includeNodeModules) {
      excludePatterns.push('**/node_modules/**');
    }

    if (this.options.verbose) {
      console.log('Scanning with patterns:', this.options.pattern);
      console.log('Excluding:', excludePatterns);
    }

    // Scan for files using fast-glob
    const foundFiles = await fg(this.options.pattern, {
      cwd: this.options.directory,
      ignore: excludePatterns,
      absolute: false,
      onlyFiles: true,
      followSymbolicLinks: false,
    });

    // Filter using gitignore if enabled
    const filteredFiles = this.options.respectGitignore
      ? foundFiles.filter(file => !shouldIgnore(resolve(this.options.directory, file), this.options.directory))
      : foundFiles;

    // AST verification: only keep files that actually export a React component
    const project = new Project();
    const verifiedComponentFiles: string[] = [];
    let astIgnoredCount = 0;

    if (this.options.verbose) {
      console.log('Verifying components with AST analysis...');
    }

    for (const file of filteredFiles) {
      const absolutePath = resolve(this.options.directory, file);
      try {
        const sourceFile = project.addSourceFileAtPath(absolutePath);
        if (isActuallyReactComponent(sourceFile)) {
          verifiedComponentFiles.push(file);
        } else {
          astIgnoredCount++;
        }
        project.removeSourceFile(sourceFile);
      } catch (err) {
        if (this.options.verbose) console.warn(`Skipping unparsable file: ${file}`);
        astIgnoredCount++;
      }
    }

    if (this.options.verbose) {
      console.log(`AST verification: ${verifiedComponentFiles.length} components found, ${astIgnoredCount} files skipped.`);
    }

    // Convert verified files to ComponentFile objects
    const componentFiles: ComponentFile[] = verifiedComponentFiles.map((file: string) => {
      const absolutePath = resolve(this.options.directory, file);
      const stats = statSync(absolutePath);

      return {
        path: absolutePath,
        relativePath: file,
        name: basename(file),
        extension: extname(file),
        directory: dirname(file),
        size: stats.size,
      };
    });

    const scanDuration = Date.now() - startTime;

    return {
      files: componentFiles,
      stats: {
        totalFiles: componentFiles.length,
        totalDirectories: new Set(componentFiles.map(f => f.directory)).size,
        scanDuration,
        filesScanned: foundFiles.length,
        filesIgnored: foundFiles.length - verifiedComponentFiles.length,
      },
      config: this.options,
    };
  }
}

// Convenience function for quick scanning
export async function scanForComponents(
  options: ScanOptions,
): Promise<ScanResult> {
  const scanner = new ComponentScanner(options);
  return scanner.scan();
}
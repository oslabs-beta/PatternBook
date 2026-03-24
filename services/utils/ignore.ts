import ignore from 'ignore';
import * as fs from 'node:fs';
import * as path from 'node:path';

const ig = ignore();

// Default patterns to always ignore
ig.add([
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  '.DS_Store',
  '*.log',
  'coverage/**'
]);

/**
 * Utility to check if a file path should be ignored by the scanner
 */
export const shouldIgnore = (filePath: string, rootDir: string= process.cwd()): boolean => {
  // 1. Calculate the relative path from the root (ignore needs relative paths)
  const relativePath = path.relative(rootDir || process.cwd(), filePath);
  
  // 2. Check for a local .gitignore if it exists in the project root
  const gitignorePath = path.join(rootDir || process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    try {
      const content = fs.readFileSync(gitignorePath, 'utf8');
      ig.add(content);
    } catch (err) {
      // If we can't read it, we just move on with the default ignores
    }
  }

  // 3. Return the verdict
  return ig.ignores(relativePath);
};
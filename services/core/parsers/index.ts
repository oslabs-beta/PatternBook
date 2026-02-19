import type { Parser, ParseResult, ParseOptions } from '../../types/parser.js';
import { ReactParser } from './react-parser.js';

/**
 * Parser factory that routes to the appropriate parser based on file extension
 */
export class ParserFactory {
  private parsers: Map<string, Parser> = new Map();

  constructor() {
    // Register React parser
    const reactParser = new ReactParser();
    this.parsers.set('react', reactParser);
    
    // Future: Register Vue and Svelte parsers
    // this.parsers.set('vue', new VueParser());
    // this.parsers.set('svelte', new SvelteParser());
  }

  /**
   * Get the appropriate parser for a file
   */
  getParser(filePath: string): Parser | null {
    // Check React parser
    if (/\.(tsx|jsx)$/.test(filePath)) {
      return this.parsers.get('react') || null;
    }

    // Check Vue parser
    if (/\.vue$/.test(filePath)) {
      return this.parsers.get('vue') || null;
    }

    // Check Svelte parser
    if (/\.svelte$/.test(filePath)) {
      return this.parsers.get('svelte') || null;
    }

    return null;
  }

  /**
   * Parse a single file using the appropriate parser
   */
  async parseFile(filePath: string, options?: ParseOptions): Promise<ParseResult> {
    const parser = this.getParser(filePath);
    
    if (!parser) {
      return {
        success: false,
        error: `No parser available for file: ${filePath}`
      };
    }

    return parser.parse(filePath, options);
  }

  /**
   * Parse multiple files
   */
  async parseFiles(filePaths: string[], options?: ParseOptions): Promise<ParseResult[]> {
    return Promise.all(
      filePaths.map(path => this.parseFile(path, options))
    );
  }

  /**
   * Register a custom parser
   */
  registerParser(name: string, parser: Parser): void {
    this.parsers.set(name, parser);
  }
}

// Export singleton instance
export const parserFactory = new ParserFactory();
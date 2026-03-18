import type { Parser, ParseResult, ParseOptions } from '../../types/parser.ts';
import { ReactParser } from './react-parser.ts';
import { TagProcessor } from '../tag-processor.ts';
// COMMENT fixed file extensions from .js to .ts
/**
 * Parser factory that routes to the appropriate parser based on file extension
 */
export class ParserFactory {
  private parsers: Map<string, Parser> = new Map();
  private tagProcessor = new TagProcessor() //intilize tagger 

  constructor() {
    // Register React parser
    //const reactParser = new ReactParser();
    this.parsers.set('react', new ReactParser());
    
    // Future: Register Vue and Svelte parsers
    // this.parsers.set('vue', new VueParser());
    // this.parsers.set('svelte', new SvelteParser());
  }

  /**
   * Get the appropriate parser for a file
   */
  getParser(filePath: string): Parser | null {
    // Check React parser
    if (/\.(tsx|jsx|ts|js)$/.test(filePath)) {
      return this.parsers.get('react') || null;
    }
        
    //COMMENT I'm commenting this out because it isn't used yet
    // // Check Vue parser
    // if (/\.vue$/.test(filePath)) {
    //   return this.parsers.get('vue') || null;
    // }

    // // Check Svelte parser
    // if (/\.svelte$/.test(filePath)) {
    //   return this.parsers.get('svelte') || null;
    // }

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
      const result = await parser.parse(filePath,options);
      //retreive raw data from parser 
      if (result.success && result.metadata){
        result.metadata.tags = this.tagProcessor.process(result.metadata);
      }
      return result ;
    }

   // return parser.parse(filePath, options);
  

  /**
   * Parse multiple files
   */
  async parseFiles(filePaths: string[], options?: ParseOptions): Promise<ParseResult[]> {
    return Promise.all(
      filePaths.map(path => this.parseFile(path, options))
    );
  }
}
  /**
   * Register a custom parser
   */
  //registerParser(name: string, parser: Parser): void {
  //  this.parsers.set(name, parser);
 // }
//}

// Export singleton instance
export const parserFactory = new ParserFactory();
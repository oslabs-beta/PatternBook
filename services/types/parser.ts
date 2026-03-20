<<<<<<< HEAD
=======

>>>>>>> origin/main
// parser-specific types for component metadata extraction

export interface ComponentMetadata {
  name: string;
  path: string;
  relativePath: string;
<<<<<<< HEAD
  type: 'component' | 'hook' | 'utility' | 'other ';
=======
  type: 'component' | 'hook' | 'utility'| 'other ';
>>>>>>> origin/main
  tags?: string[];
  exports: ExportInfo;
  imports: ImportInfo[];
  props?: PropMetadata[];
<<<<<<< HEAD
  hooks?: { name: string; source?: string }[];
=======
  hooks?:{name: string; source?: string}[];
>>>>>>> origin/main
  documentation?: string;
}

export interface ExportInfo {
  default?: string;
  named: string[];
}

export interface ImportInfo {
  source: string;
  specifiers: string[];
  isInternal: boolean; // true if starts with '.' or '@/'
}

export interface PropMetadata {
  name: string;
  type: string;
  isOptional: boolean;
  description?: string; // From JSDoc
  defaultValue?: string;
}

export interface HookUsage {
  name: string;
  source?: string; // Where it's imported from
}

export interface ParseOptions {
  extractDocs?: boolean;
  extractHooks?: boolean;
  extractProps?: boolean;
  verbose?: boolean;
}

export interface ParseResult {
  success: boolean;
  metadata?: ComponentMetadata;
  error?: string;
}

<<<<<<< HEAD
=======

>>>>>>> origin/main
// base interface for all parsers (React, Vue, Svelte)
export interface Parser {
  parse(filePath: string, options?: ParseOptions): Promise<ParseResult>;
  canParse(filePath: string): boolean;
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main

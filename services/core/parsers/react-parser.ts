import { Project, SourceFile, FunctionDeclaration, SyntaxKind, VariableDeclaration } from 'ts-morph';
import type {
  Parser,
  ParseResult,
  ComponentMetadata,
  ParseOptions,
  PropMetadata,
  ImportInfo,
} from '../../types/parser.js';

export class ReactParser implements Parser {
  private project: Project;

  constructor() {
    this.project = new Project({
      compilerOptions: {
        jsx: 1, 
        target: 99, 
      },
    });
  }

  private extractApiCalls(sourceFile: SourceFile): { url: string; method: string }[] {
    const apiCalls: { url: string; method: string }[] = [];
    const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

    calls.forEach(call => {
      if (call.getExpression().getText() === 'fetch') {
        const args = call.getArguments();
        const url = args[0]?.getText().replace(/^['"`]|['"`]$/g, '') || 'unknown';
        let method = 'GET'; 
        if (args[1]?.isKind(SyntaxKind.ObjectLiteralExpression)) {
          const methodProp = args[1].getProperty('method');
          if (methodProp?.isKind(SyntaxKind.PropertyAssignment)) {
            method = methodProp.getInitializer()?.getText().replace(/^['"`]|['"`]$/g, '') || 'GET';
          }
        }
        apiCalls.push({ url, method });
      }
    });
    return apiCalls;
  }

  canParse(filePath: string): boolean {
    return /\.(tsx|jsx|ts|js)$/.test(filePath);
  }

  async parse(filePath: string, options: ParseOptions = {}): Promise<ParseResult> {
    try {
      const sourceFile = this.project.addSourceFileAtPath(filePath);
      const exportedNode = this.findExportedFunction(sourceFile);

      if (!exportedNode) {
        if (options.verbose) console.log(`⚠️ No exported function in ${filePath}`);
        return { success: false, error: 'No exported function found' };
      }

      // Helper to get name from either FunctionDec or VariableDec
      const name = (exportedNode as any).getName() || 'Anonymous';

      const metadata: ComponentMetadata = {
        name: name,
        path: sourceFile.getFilePath(),
        relativePath: filePath,
        type: name.startsWith('use') ? 'hook' : 'component',
        exports: { named: [name] },
        apiCalls: this.extractApiCalls(sourceFile),
        functionDefs: this.extractFunctionDefs(exportedNode),
        imports: this.extractImports(sourceFile),
      };

      if (options.extractProps !== false) {
        metadata.props = this.extractProps(exportedNode);
      }

      if (options.extractHooks !== false) {
        metadata.hooks = this.extractHookUsage(exportedNode);
      }

      if (options.extractDocs) {
        metadata.documentation = this.extractDocumentation(exportedNode);
        metadata.examples = this.extractExamples(exportedNode);
      }

      return { success: true, metadata };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private findExportedFunction(sourceFile: SourceFile): FunctionDeclaration | VariableDeclaration | undefined {
    // 1. Standard function declaration
    const exportedFunc = sourceFile.getFunctions().find(f => f.isExported());
    if (exportedFunc) return exportedFunc;

    // 2. Arrow functions / Variable exports
    const varDecl = sourceFile.getVariableDeclarations().find(v => {
      const init = v.getInitializer();
      return v.isExported() && (
        init?.getKind() === SyntaxKind.ArrowFunction || 
        init?.getKind() === SyntaxKind.FunctionExpression
      );
    });

    return varDecl;
  }

  private extractProps(node: any): PropMetadata[] {
    const props: PropMetadata[] = [];
    // Handle both FunctionDeclaration and VariableDeclaration
    const fn = node.getKind() === SyntaxKind.VariableDeclaration ? node.getInitializer() : node;
    
    if (!fn || !fn.getParameters) return props;

    const firstParam = fn.getParameters()[0];
    if (!firstParam) return props;

    const type = firstParam.getType();
    const properties = type.getProperties();

    properties.forEach(prop => {
      const jsDocs = prop.getJsDocTags();
      const descriptionTag = jsDocs.find(tag => !tag.getName());
      const description = descriptionTag ? descriptionTag.getText().map(p => p.text).join('') : undefined;

      props.push({
        name: prop.getName(),
        type: prop.getTypeAtLocation(firstParam).getText(),
        isOptional: prop.isOptional(),
        description: description,
      });
    });

    return props;
  }

  private extractImports(sourceFile: SourceFile): ImportInfo[] {
    return sourceFile.getImportDeclarations().map(imp => {
      const source = imp.getModuleSpecifierValue();
      const specifiers = imp.getNamedImports().map(ni => ni.getName());
      const defaultImport = imp.getDefaultImport();
      if (defaultImport) specifiers.unshift(defaultImport.getText());

      return {
        source,
        specifiers,
        isInternal: source.startsWith('.') || source.startsWith('@/'),
      };
    });
  }

  private extractHookUsage(node: any): { name: string; source?: string }[] {
    const hooks: { name: string; source?: string }[] = [];
    const fn = node.getKind() === SyntaxKind.VariableDeclaration ? node.getInitializer() : node;
    const body = fn?.getBody();

    if (!body) return hooks;

    body.getDescendantsOfKind(SyntaxKind.Identifier).forEach(identifier => {
      const name = identifier.getText();
      if (name.startsWith('use') && /[A-Z]/.test(name[3] || '')) {
        hooks.push({ name });
      }
    });

    return Array.from(new Map(hooks.map(h => [h.name, h])).values());
  }

  private extractDocumentation(node: any): string | undefined {
    const jsDocs = node.getJsDocs?.() || [];
    if (jsDocs.length === 0) return undefined;
    return jsDocs[0].getDescription().trim();
  }

  // --- NEW: Internal Function Call Extraction ---
  private extractFunctionDefs(node: any): any[] {
    const functionDefs: any[] = [];
    const fn = node.getKind() === SyntaxKind.VariableDeclaration ? node.getInitializer() : node;
    const body = fn?.getBody();

    if (!body) return functionDefs;

    // Find internal function declarations (e.g., const handleUpdate = ...)
    body.getDescendantsOfKind(SyntaxKind.FunctionDeclaration).forEach((f: any) => {
      const name = f.getName();
      if (name) {
        const calls = f.getDescendantsOfKind(SyntaxKind.CallExpression)
          .map((c: any) => ({ name: c.getExpression().getText() }));
        functionDefs.push({ name, calls });
      }
    });

    return functionDefs;
  }

  private extractExamples(node: any): string[] | undefined {
    const jsDocs = node.getJsDocs?.();
    if (!jsDocs || jsDocs.length === 0) return undefined;

    const examples: string[] = [];
    jsDocs.forEach((doc: any) => {
      doc.getTags().forEach((tag: any) => {
        if (tag.getTagName() === 'example') {
          const exampleText = tag.getText().replace(/^@example\s*/g, '').trim();
          if (exampleText) examples.push(exampleText);
        }
      });
    });

    return examples.length > 0 ? examples : undefined;
  }

  async parseMany(filePaths: string[], options?: ParseOptions): Promise<ParseResult[]> {
    return Promise.all(filePaths.map(path => this.parse(path, options)));
  }

  clearCache(): void {
    this.project = new Project({
      compilerOptions: { jsx: 1, target: 99 },
    });
  }

} 

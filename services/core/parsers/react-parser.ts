import { Project, SourceFile, FunctionDeclaration } from 'ts-morph';
import { resolve } from 'path';
import type { Parser, ParseResult, ComponentMetadata, ParseOptions, PropMetadata, ImportInfo } from '../../types/parser.js';

// react-specific parser using ts-morph
// refactored from jumbo-parser.ts with better structure

export class ReactParser implements Parser {
    private project: Project;
    
    constructor() {
        this.project = new Project({
            compilerOptions: {
                jsx: 1, // JSX preserve mode //COMMENT why is this .jsx and not .tsx?? does it matter? Just asking idk
                target: 99 // ESNext
            },
        });
    };

    canParse(filePath: string): boolean {
        return /\.(tsx|jsx|ts|js)$/.test(filePath);
    };

    async parse(filePath: string, options: ParseOptions = {}): Promise<ParseResult> {
        try {
            const sourceFile = this.project.addSourceFileAtPath(filePath);
            // find the main exported component/hook
            const exportedFunction = this.findExportedFunction(sourceFile);
    
            if (!exportedFunction) {
                if (options.verbose)console.log(`⚠️ No exported function in ${filePath}`);
                return {
                    success: false,
                    error: 'No exported function found'
                };
            };
    
            const metadata: ComponentMetadata = {
                name: exportedFunction.getName() || 'Anonymous',
                path: sourceFile.getFilePath(),
                relativePath: filePath,
                type: exportedFunction.getName()?.startsWith('use') ? 'hook': 'component',
                exports: { named: [exportedFunction.getName()!]},
                imports: this.extractImports(sourceFile),
            };

            // extract props if requested
            if (options.extractProps !== false) {
                metadata.props = this.extractProps(exportedFunction);
            };
            
            // extract hooks if requested
            if (options.extractHooks !== false) {
                metadata.hooks = this.extractHookUsage(exportedFunction);
            };
    
            // extract documentation if requested
            if (options.extractDocs) {
                metadata.documentation = this.extractDocumentation(exportedFunction);
            };
    
            return {
                success: true,
                metadata
            };
        } catch (error) {
            return {
                success: false,
                error: String(error)
            };
        };
    };

    private findExportedFunction(sourceFile: SourceFile): FunctionDeclaration | undefined {
        // try to find exported function decleration first
        const functions = sourceFile.getFunctions();
        const exportedFunc = functions.find(f => f.isExported());

        if (exportedFunc) return exportedFunc;

        // todo: handle arrow function exports, class components, etc.
        return undefined;
    };

    private extractProps(fn: FunctionDeclaration): PropMetadata[] {
        const props: PropMetadata[] = [];
        const firstParam = fn.getParameters()[0];

        if (!firstParam) return props;

        const type = firstParam.getType();
        const properties = type.getProperties();

        properties.forEach(prop => {
            // get JSDoc for this prop
            const jsDocs = prop.getJsDocTags();
            const description = jsDocs.find(tag => !tag.getName())?.getText();

            props.push({
                name: prop.getName(),
                type: prop.getTypeAtLocation(firstParam).getText(),
                isOptional: prop.isOptional(),
                description: description || undefined,  // COMMENT I'm pretty sure this is a typo or a type issue
            });
        });

        return props;
    };

    private extractImports(sourceFile: SourceFile): ImportInfo[] {
        const imports = sourceFile.getImportDeclarations();

        return imports.map(imp => {
            const source = imp.getModuleSpecifierValue();
            const specifiers = imp.getNamedImports().map(ni => ni.getName());
            
            // add default import if exists
            const defaultImport = imp.getDefaultImport();
            if (defaultImport) {
                specifiers.unshift(defaultImport.getText());
            };

            return {
                source,
                specifiers,
                isInternal: source.startsWith('.') || source.startsWith('@/'),
            };
        });
    };

//COMMENT- fixed formatting
    private extractExports(sourceFile: SourceFile): { default?: string; named: string[] } {
        const exportedDeclarations = sourceFile.getExportedDeclarations();
        const named: string[] = [];
        let defaultExport: string | undefined;

        exportedDeclarations.forEach((declarations, name) => {
        if (name === 'default') {
            // Handle default export
            const decl = declarations[0];
            if (decl) {
            defaultExport = decl.getSymbol()?.getName() || 'default';
            }
        } else {
            named.push(name);
        }
        });

        return { default: defaultExport, named };
    }

    private extractHookUsage(fn: FunctionDeclaration): { name: string; source?: string }[] {
        const hooks: { name: string; source?: string }[] = [];
        const body = fn.getBody();
        
        if (!body) return hooks;

        // Find all identifiers that look like hooks (start with 'use')
        body.getDescendantsOfKind(268).forEach(identifier => { // 268 = Identifier
        const name = identifier.getText();
        if (name.startsWith('use') && name[3] === name[3].toUpperCase()) {
            // This looks like a hook call
            hooks.push({ name });
        }
        });

        // Remove duplicates
        return Array.from(new Map(hooks.map(h => [h.name, h])).values());
    }

    private extractDocumentation(fn: FunctionDeclaration): string | undefined {
        const jsDocs = fn.getJsDocs();
        if (jsDocs.length === 0) return undefined;

        return jsDocs[0].getDescription().trim();
    }

    /**
     * Batch parse multiple files
     */
    async parseMany(filePaths: string[], options?: ParseOptions): Promise<ParseResult[]> {
        return Promise.all(filePaths.map(path => this.parse(path, options)));
    }

    /**
     * Clear the project cache
     */
    clearCache(): void {
        this.project = new Project({
            compilerOptions: {
                jsx: 1, //COMMENT again why .jsx?
                target: 99,
            },
        });
    }
}


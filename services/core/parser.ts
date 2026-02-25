import { Project, SourceFile, SyntaxKind, CallExpression, FunctionDeclaration, ArrowFunction, VariableDeclaration, JSDoc } from 'ts-morph';


export interface ApiCall {
    url: string;
    method: string;
}

export interface FunctionCall {
    name: string;
    args: string[];
}

export interface FunctionDef {
    name: string;
    calls: FunctionCall[];
}

export interface ComponentProp {
    name: string;
    type: string;
    required: boolean;
}

export interface ParsedFile {
    filePath: string;
    imports: string[];
    apiCalls: ApiCall[];
    functions: FunctionDef[];
    props: ComponentProp[];
    documentation: string;
}

export class CodeParser {
    private project: Project;

    constructor() {
        this.project = new Project({
            skipAddingFilesFromTsConfig: true,
        });
    }

    parseFile(filePath: string): ParsedFile {
        // Check if file is already in project to avoid "Duplicate identifier" errors
        let sourceFile = this.project.getSourceFile(filePath);
        if (sourceFile) {
            sourceFile.refreshFromFileSystemSync(); // Reload content
        } else {
            sourceFile = this.project.addSourceFileAtPath(filePath);
        }

        return {
            filePath: filePath,
            imports: this.getImports(sourceFile),
            apiCalls: this.getApiCalls(sourceFile),
            functions: this.getFunctions(sourceFile),
            props: this.getProps(sourceFile),
            documentation: this.getDocumentation(sourceFile)
        };
    }

    private getImports(file: SourceFile): string[] {
        return file.getImportDeclarations()
            .map(dec => dec.getModuleSpecifierValue())
            .filter(path => path.startsWith('.') || path.startsWith('@/'));
    }

    private getApiCalls(file: SourceFile): ApiCall[] {
        const apiCalls: ApiCall[] = [];
        
        // Find all 'fetch' calls
        const calls = file.getDescendantsOfKind(SyntaxKind.CallExpression);
        
        calls.forEach(call => {
            const expression = call.getExpression();
            if (expression.getText() === 'fetch') {
                apiCalls.push(this.analyzeFetch(call));
            }
        });

        return apiCalls;
    }

    private getFunctions(file: SourceFile): FunctionDef[] {
        const functions: FunctionDef[] = [];

        // 1. Standard function declarations: function foo() {}
        file.getFunctions().forEach(func => {
            const name = func.getName();
            if (name) {
                functions.push({
                    name,
                    calls: this.findCallsInBlock(func)
                });
            }
        });

        // 2. Arrow functions / Variable declarations: const foo = () => {}
        file.getVariableDeclarations().forEach(variable => {
            const name = variable.getName();
            const initializer = variable.getInitializer();
            
            if (initializer && (initializer.isKind(SyntaxKind.ArrowFunction) || initializer.isKind(SyntaxKind.FunctionExpression))) {
                functions.push({
                    name,
                    calls: this.findCallsInBlock(initializer as any) // Cast because both have getDescendantsOfKind
                });
            }
        });

        return functions;
    }

    private findCallsInBlock(node: { getDescendantsOfKind: (kind: SyntaxKind) => any[] }): FunctionCall[] {
        const calls: FunctionCall[] = [];
        const callExpressions = node.getDescendantsOfKind(SyntaxKind.CallExpression) as CallExpression[];

        callExpressions.forEach(call => {
            const expression = call.getExpression();
            const name = expression.getText();
            
            // Filter out common noise (console.log, etc) if desired
            if (!name.startsWith('console.')) {
                calls.push({
                    name: name.split('.').pop() || name, // Simplify 'obj.method' to 'method'
                    args: call.getArguments().map(arg => arg.getText())
                });
            }
        });

        return calls;
    }

    private analyzeFetch(call: CallExpression): ApiCall {
        const args = call.getArguments();
        let url = 'unknown';
        let method = 'GET'; // Default for fetch

        // 1. Get URL (first argument)
        if (args.length > 0) {
            // Remove quotes if it's a string literal
            url = args[0].getText().replace(/^['"`]|['"`]$/g, '');
        }

        // 2. Get Method (second argument options object)
        if (args.length > 1) {
            const optionsArg = args[1];
            if (optionsArg.getKind() === SyntaxKind.ObjectLiteralExpression) {
                const methodProp = optionsArg.asKind(SyntaxKind.ObjectLiteralExpression)
                    ?.getProperty('method');
                
                if (methodProp && methodProp.isKind(SyntaxKind.PropertyAssignment)) {
                    method = methodProp.getInitializer()?.getText().replace(/^['"`]|['"`]$/g, '') || 'GET';
                }
            }
        }

        return { url, method };
    }

    private getProps(file: SourceFile): ComponentProp[] {
        const props: ComponentProp[] = [];
        
        // Find the main exported component (heuristic: exported function)
        const component = file.getFunctions().find(f => f.isExported()) || 
                          file.getVariableDeclarations().find(v => v.isExported() && 
                          (v.getInitializer()?.isKind(SyntaxKind.ArrowFunction) || v.getInitializer()?.isKind(SyntaxKind.FunctionExpression)));

        if (!component) return props;

        let params: any[] = [];
        if (component.getKind() === SyntaxKind.FunctionDeclaration) {
            params = (component as FunctionDeclaration).getParameters();
        } else if (component.getKind() === SyntaxKind.VariableDeclaration) {
            const initializer = (component as VariableDeclaration).getInitializer();
            if (initializer && (initializer.isKind(SyntaxKind.ArrowFunction) || initializer.isKind(SyntaxKind.FunctionExpression))) {
                params = (initializer as ArrowFunction).getParameters();
            }
        }

        if (params.length > 0) {
            const firstParam = params[0];
            const type = firstParam.getType();
            
            type.getProperties().forEach((prop: { getDeclarations: () => any[]; getName: () => any; isOptional: () => any; }) => {
                const declaration = prop.getDeclarations()[0];
                props.push({
                    name: prop.getName(),
                    type: declaration ? declaration.getType().getText() : 'any',
                    required: !prop.isOptional()
                });
            });
        }

        return props;
    }

    private getDocumentation(file: SourceFile): string {
        // Find the main exported component
        const component = file.getFunctions().find(f => f.isExported()) || 
                          file.getVariableDeclarations().find(v => v.isExported());

        if (component) {
            // Get JSDoc comments
            const jsDocs = (component as any).getJsDocs?.() as JSDoc[];
            if (jsDocs && jsDocs.length > 0) {
                return jsDocs.map(doc => doc.getDescription() + '\n' + doc.getTags().map(t => `@${t.getTagName()} ${t.getComment() || ''}`).join('\n')).join('\n');
            }
        }
        return '';
    }
}

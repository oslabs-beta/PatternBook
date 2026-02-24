import { Project, SourceFile, SyntaxKind, CallExpression } from 'ts-morph';
import * as path from 'path';

export interface ApiCall {
    url: string;
    method: string;
}

export interface ParsedFile {
    filePath: string;
    imports: string[];
    apiCalls: ApiCall[];
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
            apiCalls: this.getApiCalls(sourceFile)
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
}

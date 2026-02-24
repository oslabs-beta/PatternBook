import ignore from 'ignore';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export class IgnoreHandler {
    private ig: ReturnType<typeof ignore>;

    constructor(baseDir: string, respectGitignore: boolean = true) {
        this.ig = ignore();
        
        if (respectGitignore) {
            this.loadGitignore(baseDir);
        };
    };

    private loadGitignore(baseDir: string): void {
        const gitignorePath = join(baseDir, '.gitignore');

        if (existsSync(gitignorePath)) {
            try {
                const gitignoreContent = readFileSync(gitignorePath, 'utf8');
                this.ig.add(gitignoreContent);
            } catch (error) {
                // silently fail if .gitignore can't be read
                console.warn(`Warning: Could not read .gitignore file`);
            };
        };
    };

    // add custom patterns to ignore
    addPatterns(patterns: string[]): void {
        this.ig.add(patterns);
    };

    // check if a path should be ignored
    shouldIgnore(path: string): boolean {
        return this.ig.ignores(path);
    };

    // filter an array of paths
    filter(paths: string[]): string[] {
        return paths.filter(path => !this.shouldIgnore(path))
    };
};

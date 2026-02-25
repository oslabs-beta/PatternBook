import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Exporter } from '../../core/exporter';
import * as fs from 'node:fs';
import * as path from 'node:path';

const TEST_DIR = path.join(__dirname, 'temp_exporter_test');
const README_PATH = path.join(TEST_DIR, 'README.md');

describe('Exporter', () => {
    beforeEach(() => {
        if (!fs.existsSync(TEST_DIR)) {
            fs.mkdirSync(TEST_DIR);
        }
        fs.writeFileSync(README_PATH, '# Test Project\n\nSome content here.');
    });

    afterEach(() => {
        if (fs.existsSync(TEST_DIR)) {
            fs.rmSync(TEST_DIR, { recursive: true, force: true });
        }
    });

    it('should append new graphs to README if markers do not exist', () => {
        const graphs = [
            { name: 'TEST_GRAPH', title: 'Test Graph', content: 'graph TD; A-->B;' }
        ];

        Exporter.updateReadme(TEST_DIR, graphs);

        const content = fs.readFileSync(README_PATH, 'utf8');
        expect(content).toContain('<!-- TEST_GRAPH-START -->');
        expect(content).toContain('#### Test Graph');
        expect(content).toContain('```mermaid\ngraph TD; A-->B;\n```');
        expect(content).toContain('<!-- TEST_GRAPH-END -->');
    });

    it('should update existing graphs in README', () => {
        // Setup initial state with old content
        const initialContent = `
# Test Project
<!-- TEST_GRAPH-START -->
#### Test Graph
\`\`\`mermaid
graph TD; OLD-->CONTENT;
\`\`\`
<!-- TEST_GRAPH-END -->
`;
        fs.writeFileSync(README_PATH, initialContent);

        const graphs = [
            { name: 'TEST_GRAPH', title: 'Test Graph', content: 'graph TD; NEW-->CONTENT;' }
        ];

        Exporter.updateReadme(TEST_DIR, graphs);

        const content = fs.readFileSync(README_PATH, 'utf8');
        expect(content).toContain('graph TD; NEW-->CONTENT;');
        expect(content).not.toContain('OLD-->CONTENT');
    });

    it('should handle multiple graphs', () => {
        const graphs = [
            { name: 'GRAPH_1', title: 'Graph 1', content: 'A-->B' },
            { name: 'GRAPH_2', title: 'Graph 2', content: 'C-->D' }
        ];

        Exporter.updateReadme(TEST_DIR, graphs);

        const content = fs.readFileSync(README_PATH, 'utf8');
        expect(content).toContain('#### Graph 1');
        expect(content).toContain('A-->B');
        expect(content).toContain('#### Graph 2');
        expect(content).toContain('C-->D');
    });
});

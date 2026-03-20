import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { readFileSync, existsSync, watchFile } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// middlewareeslint
app.use(cors());
app.use(express.json());

// in-memery cache for manifest data
let manifestCache: any = null;
let dependencyGraphCache: any = null;

// load manifest from file system
function loadManifest(filePath: string): any | null {
    try {
        if (!existsSync(filePath)) {
            console.warn(chalk.yellow(`Manifest file not found: ${filePath}`));
            return null;
        };
        const content = readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(chalk.red(`Error loading manifest: ${error}`));
        return null;
    };
};

function watchManifestFile(
    filePath: string,
    cacheSetter: (data: any) => void): void {

        if (!existsSync(filePath)) return;

        watchFile(filePath, { interval: 1000 }, () => {
            console.log(chalk.blue(`Detected changes in ${filePath}`));
            const data = loadManifest(filePath);
            if (data) {
                cacheSetter(data);
                console.log(chalk.green('Cache updated'));
            };
        });
};

// initialize caches and watchers
const MANIFEST_PATH = resolve(__dirname, '..', 'library-manifest.json');
const DEPENDENCY_GRAPH_PATH = resolve(__dirname, '..', 'dependency-graph.json');

manifestCache = loadManifest(MANIFEST_PATH);
dependencyGraphCache = loadManifest(DEPENDENCY_GRAPH_PATH);

watchManifestFile(MANIFEST_PATH, data => {
    manifestCache = data;
});

watchManifestFile(DEPENDENCY_GRAPH_PATH, data => {
    dependencyGraphCache = data;
});

// ===================================
// api routes
// ===================================

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

/**
 * GET /api/manifest
 * Get the complete component library manifest
 */
app.get('/api/manifest', (req: Request, res: Response) => {
    if (!manifestCache) {
        return res.status(404).json({
            error: 'Manifest not found',
            message: 'Run `patternbook generate` to create a manifest first!'
        });
    };

    res.json(manifestCache);
});

/**
 * GET /api/components
 * Get all components (simplified list)
 */

app.get('/api/components', (req: Request, res: Response) => {
    if (!manifestCache || !manifestCache.components) {
        return res.status(404).json({
            error: 'No components found',
        });
    };

    const components = manifestCache.components.map((c: any) => ({
        name: c.name,
        path: c.path,
        type: c.type,
        tags: c.tags || []
    }));

    res.json({ components, total: components.length });
});

/**
 * GET /api/components/:name
 * Get a specific component by name
 */

app.get('/api/components/:name', (req: Request, res: Response) => {
    if (!manifestCache || !manifestCache.components) {
        return res.status(404).json({
            error: 'No components found',
        });
    };

    const { name } = req.params;
    const component = manifestCache.components.find(
        (c: any) => c.name.toLowerCase() === name.toLowerCase()
    );

    if (!component) {
        return res.status(404).json({
            error: 'Component not found',
            message: `Component "${name}" does not exist`
        });
    };

    res.json(component);
});

/**
 * GET /api/components/tag/:tag
 * Get all components with a specific tag
 */
app.get('/api/components/tag/:tag', (req: Request, res: Response) => {
    if (!manifestCache || !manifestCache.components) {
        return res.status(404).json({
            error: 'No components found'
        });
    };

    const { tag } = req.params;
    const components = manifestCache.components.filter((c: any) => c.tags?.includes(tag));

    res.json({ tag, components, total: components.length });
});

/**
 * GET /api/graph
 * Get the dependency graph
 */
app.get('/api/graph', (req: Request, res: Response) => {
    if (!dependencyGraphCache) {
        return res.status(404).json({
            error: 'Dependency graph not found',
            message: 'Run `patternbook analyze` to create dependency graph'
        });
    };

    res.json(dependencyGraphCache);
});

/**
 * GET /api/graph/impact/:componentName
 * Get impact analysis for a specific component
 */

app.get('/api/graph/impact/:componentName', (req: Request, res: Response) => {
    if (!dependencyGraphCache) {
        return res.status(404).json({
            error: 'Dependency graph not found'
        });
    };

    const { componentName } = req.params;

    // find the component node
    const node = dependencyGraphCache.nodes?.find(
        (n: any) => n.name.toLowerCase() === componentName.toLowerCase()
    );

    if (!node) {
        return res.status(404).json({
            error: 'Component not found in graph'
        });
    };

    // find direct dependents--what imports this component--
    const directDependents = dependencyGraphCache.edges?.filter((e: any) => e.to === node.filePath).map((e: any) => {
        const depNode = dependencyGraphCache.nodes.find(
            (n: any) => n.filePath === e.from
        );
        return depNode?.name;
    })
    .filter(Boolean);

    res.json({
        component: componentName,
        node,
        directDependents: directDependents || [],
        dependentCount: directDependents?.length || 0
    });
});

/**
 * GET /api/search
 * Search components by query
 */
app.get('/api/search', (req: Request, res: Response) => {
    if (!manifestCache || !manifestCache.components) {
        return res.status(404).json({
            error: 'No components found'
        });
    };

    const { q } = req.query;

    if (!q || typeof q !== 'string') {
        return res.status(400).json({
            error: 'Query parameter "q" is required'
        });
    };

    const query = q.toLowerCase();
    const results = manifestCache.components.filter((c: any) => {
        const matchName = c.name.toLowerCase().includes(query);
        const matchTags = c.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        const matchType = c.type.toLowerCase().includes(query);

        return matchName || matchTags || matchType;
    });

    res.json({
        query: q,
        results,
        total: results.length
    });
});

/**
 * GET /api/stats
 * Get statistics about the component library
 */
app.get('/api/stats', (req: Request, res: Response) => {
    if (!manifestCache) {
        return res.status(404).json({
            error: 'Manifest not found'
        });
    };

    const components = manifestCache.components || [];
    const graph = dependencyGraphCache;

    const stats = {
        totalComponents: components.length,
        componentsByType: {
            component: components.filter((c: any) => c.type === 'component').length,
            hook: components.filter((c: any) => c.type === 'hook').length,
            utility: components.filter((c: any) => c.type === 'utility').length
        },
        allTags: [
            ...new Set(components.flatMap((c: any) => c.tags || []))
        ].sort(),
        graph: graph
        ? {
            nodes: graph.metadata?.totalNodes || 0,
            edges: graph.metadata?.totalEdges || 0,
            components: graph.metadata?.componentsCount || 0,
            hooks: graph.metadata?.hooksCount || 0
        }
        : null,
        lastGenerated: manifestCache.generated || null
    };

    res.json(stats);
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`,
        availableRoutes: [
            'GET /api/health',
            'GET /api/components',
            'GET /api/components/:name',
            'GET /api/components/tag/:tag',
            'GET /api/graph',
            'GET /api/graph/impact/:componentName',
            'GET /api/search?q=<query>',
            'GET /api/stats'
        ]
    });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(chalk.red('Server error:'), err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// =============================================================================
// START SERVER
// =============================================================================

app.listen(PORT, () => {
    console.log(chalk.green(`\nPatternBook API Server running!`));
    console.log(chalk.cyan('http://localhost:${PORT}'));
    console.log(chalk.gray(`\nAvailable endpoints`));
    console.log(chalk.gray(`   GET  /api/health`));
    console.log(chalk.gray(`   GET  /api/manifest`));
    console.log(chalk.gray(`   GET  /api/components`));
    console.log(chalk.gray(`   GET  /api/components/:name`));
    console.log(chalk.gray(`   GET  /api/components/tag/:tag`));
    console.log(chalk.gray(`   GET  /api/graph`));
    console.log(chalk.gray(`   GET  /api/graph/impact/:componentName`));
    console.log(chalk.gray(`   GET  /api/search?q=<query>`));
    console.log(chalk.gray(`   GET  /api/stats`));

    if (manifestCache) {
        console.log(
            chalk.green(`\n✓ Manifest Loaded: ${manifestCache.components?.length || 0 } components`)
        );
    } else {
        console.log(
            chalk.yellow(
                '\n No manifest found. Run `PatternBook generate` first'
            )
        );
    };

    if (dependencyGraphCache) {
        console.log(
            chalk.green(
                `✓ Dependency graph loaded: ${dependencyGraphCache.metadata?.totalNodes || 0} nodes`
            )
        );
    };

    console.log(chalk.gray(`\n Watching for file chages...\n`));
});

export default app;
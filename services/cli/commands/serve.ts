import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { readFileSync, existsSync, watchFile } from 'fs';
import { resolve, dirname, join } from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function serveCommand(
  directory: string,
  options: { port: string; host: string }
): Promise<void> {
  const targetDir = resolve(process.cwd(), directory);
  const app = express();
  const PORT = parseInt(options.port || '3000', 10);
  const HOST = options.host || 'localhost';

  app.use(cors());
  app.use(express.json());

  // Serve the compiled client dashboard
  const publicPath = resolve(__dirname, '../../../public');
  if (existsSync(publicPath)) {
    app.use(express.static(publicPath));
  } else {
    console.warn(chalk.yellow(`⚠️  Dashboard frontend not found inside ${publicPath}. Did you build the client?`));
  }

  let manifestCache: any = null;
  let dependencyGraphCache: any = null;

  function loadManifest(filePath: string): any | null {
    try {
      if (!existsSync(filePath)) return null;
      return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch {
      return null;
    }
  }

  const MANIFEST_PATH = resolve(targetDir, 'library-manifest.json');
  const DEPENDENCY_GRAPH_PATH = resolve(targetDir, 'dependency-graph.json');

  manifestCache = loadManifest(MANIFEST_PATH);
  dependencyGraphCache = loadManifest(DEPENDENCY_GRAPH_PATH);

  if (!manifestCache) {
    console.warn(chalk.yellow(`⚠️  No manifest found at ${MANIFEST_PATH}. Run 'patternbook generate' first.`));
  }

  watchFile(MANIFEST_PATH, { interval: 1000 }, () => {
    manifestCache = loadManifest(MANIFEST_PATH);
    console.log(chalk.blue(`🔄 Reloaded manifest.json`));
  });

  watchFile(DEPENDENCY_GRAPH_PATH, { interval: 1000 }, () => {
    dependencyGraphCache = loadManifest(DEPENDENCY_GRAPH_PATH);
  });

  // API Routes
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/api/manifest', (req, res) => {
    if (!manifestCache) return res.status(404).json({ error: 'Manifest not found' });
    res.json(manifestCache);
  });

  app.get('/api/search', (req, res) => {
    if (!manifestCache || !manifestCache.components) return res.status(404).json({ error: 'No components' });
    const query = String(req.query.q || '').toLowerCase();
    const results = manifestCache.components.filter((c: any) => 
      c.name.toLowerCase().includes(query) || 
      c.tags?.some((t: string) => t.toLowerCase().includes(query)) ||
      c.type.toLowerCase().includes(query)
    );
    res.json({ query: req.query.q, results, total: results.length });
  });

  app.get('/api/graph', (req, res) => {
    if (!dependencyGraphCache) return res.status(404).json({ error: 'Graph not found' });
    res.json(dependencyGraphCache);
  });
  
  app.get('/api/stats', (req, res) => {
    if (!manifestCache) return res.status(404).json({ error: 'Manifest not found' });
    res.json({ totalComponents: manifestCache.components?.length || 0 });
  });

  // Send all other requests to the dashboard index.html
  app.use((req, res) => {
    if (existsSync(join(publicPath, 'index.html'))) {
      res.sendFile(join(publicPath, 'index.html'));
    } else {
      res.status(404).send('Dashboard not bundled. Run npm run build in client/.');
    }
  });

  app.listen(PORT, HOST, () => {
    console.log(chalk.green(`\n🚀 PatternBook Dashboard running!`));
    console.log(chalk.cyan(`   http://${HOST}:${PORT}`));
    console.log(chalk.gray(`   Serving project: ${targetDir}\n`));
  });
}

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { readFileSync, existsSync, watchFile, mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import react from '@vitejs/plugin-react';

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

  // --- Vite Preview Integration ---
  const pbDir = join(targetDir, 'patternbook-preview');
  if (!existsSync(pbDir)) {
    mkdirSync(pbDir);
  }

  const generatePreviewApp = () => {
    if (!manifestCache) return;
    const components = manifestCache.components || [];
    let registryCode = `import React, { lazy } from 'react';\n\n`;
    registryCode += `export const COMPONENT_REGISTRY: Record<string, any> = {\n`;
    for (const comp of components) {
      if (comp.type === 'component') {
        // Use standard ES import matching
        registryCode += `  "${comp.name}": lazy(() => import('${comp.path}')),\n`;
      }
    }
    registryCode += `};\n`;
    writeFileSync(join(pbDir, 'virtualRegistry.tsx'), registryCode);

    const previewEntryCode = `
import React, { Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { COMPONENT_REGISTRY } from './virtualRegistry';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { themes } from "prism-react-renderer";

function PreviewApp() {
  const [code, setCode] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const componentName = urlParams.get('component');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_CODE') setCode(event.data.code);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!componentName || !COMPONENT_REGISTRY[componentName]) {
    return <div style={{padding: 20, fontFamily: 'sans-serif'}}>Component not found or not in registry</div>;
  }

  const Component = COMPONENT_REGISTRY[componentName];
  const scope = { React, [componentName]: Component };

  return (
    <Suspense fallback={<div style={{padding: 20}}>Loading compiler...</div>}>
      <LiveProvider code={code} scope={scope} theme={themes.nightOwl}>
        <LivePreview />
        <LiveError />
      </LiveProvider>
    </Suspense>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<PreviewApp />);
`;
    writeFileSync(join(pbDir, 'preview-entry.tsx'), previewEntryCode);

    const previewHtmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PatternBook Preview</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/patternbook-preview/preview-entry.tsx"></script>
</body>
</html>
`;
    writeFileSync(join(pbDir, 'preview.html'), previewHtmlCode);
  };

  generatePreviewApp();

  watchFile(MANIFEST_PATH, { interval: 1000 }, () => {
    manifestCache = loadManifest(MANIFEST_PATH);
    generatePreviewApp(); // regenerate virtual registry when manifest updates
    console.log(chalk.blue(`🔄 Reloaded manifest.json and virtual registry`));
  });

  watchFile(DEPENDENCY_GRAPH_PATH, { interval: 1000 }, () => {
    dependencyGraphCache = loadManifest(DEPENDENCY_GRAPH_PATH);
  });

  // CLI's node_modules directory to resolve react-live
  const cliNodeModules = resolve(__dirname, '../../../node_modules');

  const vite = await createViteServer({
    root: targetDir,
    server: { 
      middlewareMode: true,
      hmr: { port: 0 } 
    },
    appType: 'custom',
    plugins: [react()],
    resolve: {
      alias: {
        'react-live': resolve(cliNodeModules, 'react-live'),
        'prism-react-renderer': resolve(cliNodeModules, 'prism-react-renderer'),
      }
    }
  });

  app.use(vite.middlewares);
  // --------------------------------

  // API Routes
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  const addNoCacheHeaders = (res: Response) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  };

  app.get('/api/manifest', (req, res) => {
    addNoCacheHeaders(res);
    if (!manifestCache) return res.status(404).json({ error: 'Manifest not found' });
    res.json(manifestCache);
  });

  app.get('/api/search', (req, res) => {
    addNoCacheHeaders(res);
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
    addNoCacheHeaders(res);
    if (!dependencyGraphCache) return res.status(404).json({ error: 'Graph not found' });
    res.json(dependencyGraphCache);
  });
  
  app.get('/api/stats', (req, res) => {
    addNoCacheHeaders(res);
    if (!manifestCache) return res.status(404).json({ error: 'Manifest not found' });
    res.json({ totalComponents: manifestCache.components?.length || 0 });
  });

  // Send all other requests to the dashboard index.html
  app.use((req, res, next) => {
    // Exclude vite internal paths or preview.html
    if (req.path.startsWith('/patternbook-preview/') || req.path.startsWith('/@vite/')) {
      return next();
    }
    
    if (existsSync(join(publicPath, 'index.html'))) {
      res.sendFile(join(publicPath, 'index.html'));
    } else {
      res.status(404).send('Dashboard not bundled. Run npm run build in client/.');
    }
  });

  app.listen(PORT, HOST, () => {
    console.log(chalk.green(`\n🚀 PatternBook Dashboard & Dynamic Bundler running!`));
    console.log(chalk.cyan(`   http://${HOST}:${PORT}`));
    console.log(chalk.gray(`   Serving project: ${targetDir}\n`));
  });
}

import pkg from 'ts-morph';
const { Project } = pkg;
import * as fs from 'fs';
import chokidar from 'chokidar';

function runScanner() {
  const project = new Project();
  // We only want to look at the src folder
  project.addSourceFilesAtPaths("./src/**/*.tsx");

  const allMetadata = project.getSourceFiles().map(sourceFile => {
    const firstFunction = sourceFile.getFunctions().find(f => f.isExported());
    if (!firstFunction) return null;

    return {
      name: firstFunction.getName(),
      path: sourceFile.getFilePath().split('PatternBook/')[1],
      props: firstFunction.getParameters()[0]?.getType().getProperties().map(p => ({
        name: p.getName(),
        type: p.getTypeAtLocation(firstFunction.getParameters()[0]).getText(),
        isOptional: p.isOptional()
      })) || []
    };
  }).filter(Boolean);

  fs.writeFileSync("library-metadata.json", JSON.stringify(allMetadata, null, 2));
  
  // Clean, condensed log:
  console.log(`[${new Date().toLocaleTimeString()}] 🤖 Scanned ${allMetadata.length} components.`);
}

console.log("🚀 Starting Absolute Watcher...");
console.log("Current Directory:", process.cwd());

const watcher = chokidar.watch('.', { 
  ignored: /node_modules|\.git/,
  persistent: true,
  ignoreInitial: false,
  depth: 9
});

watcher.on('ready', () => {
  console.log("✅ Watcher is ready. I am literally watching EVERYTHING in this folder.");
});

watcher.on('all', (event, path) => {
  //ignore metedata file so we dont loop
    if (path === 'library-metaData.json') return;

    //only run scanner on tsx files in src folder 
    if (path.startsWith('src/') && path.endsWith('.tsx')){
        console.log(`[${event}] ${path}`);
    
    runScanner();
  }
});
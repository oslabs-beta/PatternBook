import chokidar from 'chokidar';
import { exec } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to watch (your test components)
const watchPath = path.resolve(__dirname, '../test/fixtures/**/*.tsx');

console.log(`\n👀 Watching for changes in: ${watchPath}`);
console.log('   The dependency graph will automatically update when you save a file.\n');

const watcher_temp = chokidar.watch(watchPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

let isRunning = false;

watcher_temp.on('change', (filePath) => {
    if (isRunning) return; // Prevent multiple runs at once
    isRunning = true;

    console.log(`\n🔄 File changed: ${path.basename(filePath)}`);
    console.log('   Regenerating dependency graph...');

    exec('npm run generate-graph', { cwd: path.resolve(__dirname, '..') }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${error.message}`);
            isRunning = false;
            return;
        }
        if (stderr) {
            // mmdc sometimes outputs to stderr even on success, so we just log it
            // console.error(`stderr: ${stderr}`);
        }
        
        console.log('✅ Graph updated successfully!');
        console.log('   (dependency-graph.mmd and dependency-graph.png refreshed)');
        isRunning = false;
    });
});

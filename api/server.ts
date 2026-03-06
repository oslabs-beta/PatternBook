import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { readFileSync, existsSync, watchFile } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json());

// in-memery cache for manifest data
let manifesCache: any = null;
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
const MANIFEST_PATH = resolve(process.cwd(), 'library-manifest.json');
const DEPENDENCY_GRAPH_PATH = resolve(process.cwd(), 'dependency-graph.json');

manifesCache = loadManifest(MANIFEST_PATH);
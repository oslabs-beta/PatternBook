export interface ScanOptions {
  directory: string;
  pattern?: string[];
  exclude?: string[];
  includeNodeModules?: boolean;
  respectGitignore?: boolean;
  framework?: 'react' | 'vue' | 'svelte' | 'auto';
  verbose?: boolean;
}

export interface ScanResult {
  files: ComponentFile[];
  stats: ScanStats;
  config: ScanOptions;
}

export interface ComponentFile {
  path: string;
  relativePath: string;
  name: string;
  extension: string;
  directory: string;
  size: number;
}

export interface ScanStats {
  totalFiles: number;
  totalDirectories: number;
  scanDuration: number;
  filesScanned: number;
  filesIgnored: number;
}

export interface UserConfig {
  patterns?: {
    include?: string[];
    exclude?: string[];
  };
  ignore?: {
    useGitignore?: boolean;
    includeNodeModules?: boolean;
  };
  framework?: 'react' | 'vue' | 'svelte' | 'auto';
}
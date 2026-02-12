/**
 * TypeScript types for PatternBook component manifest
 * This is the contract between frontend and backend teams
 */

export interface ComponentManifest {
  version: string;
  generatedAt: string;
  projectName: string;
  components: Component[];
  categories: Category[];
  stats: Stats;
}

export interface Component {
  id: string;
  name: string;
  category: string;
  filePath: string;
  description?: string;
  type: "function" | "class";
  props: Prop[];
  examples: Example[];
  sourceCode: string;
  tags?: string[];
  exports: string[];
}

export interface Prop {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface Example {
  title: string;
  code: string;
}

export interface Category {
  name: string;
  displayName: string;
  description?: string;
  componentCount: number;
}

export interface Stats {
  totalComponents: number;
  totalCategories: number;
  lastUpdated: string;
}

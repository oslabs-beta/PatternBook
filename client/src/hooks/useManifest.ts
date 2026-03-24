import { useState, useEffect } from "react";
import type { ComponentManifest } from "../types/manifest";
import { useRegistryStore } from "../stores/registryStore";

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001/api' : '/api');

/**
 * Hook to load and manage the component manifest
 * 
 * DEVELOPMENT MODE:
 * - Fetches from backend API server (http://localhost:3001/api/manifest)
 * - Server watches for file changes and updates automatically
 * 
 * PRODUCTION MODE:
 * - Can fetch from deployed API or use static manifest
 */
export function useManifest() {
  const setManifest = useRegistryStore((state) => state.setManifest);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadManifest() {
      try {
        setLoading(true);
        
        // Fetch from API server
        const response = await fetch(`${API_BASE_URL}/manifest`);

        if (!response.ok) {
          throw new Error(`Failed to load manifest: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Transform API data to match frontend manifest type
        const manifest: ComponentManifest = transformApiDataToManifest(data);
        
        setManifest(manifest);
      } catch (err) {
        console.error('Error loading manifest:', err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        
        // Fallback to mock data in development if API fails
        if (import.meta.env.DEV) {
          console.warn('⚠️ Falling back to mock data');
          try {
            const fallbackResponse = await fetch("/mock-data/manifest.json");
            if (fallbackResponse.ok) {
              const fallbackData = await fallbackResponse.json() as ComponentManifest;
              setManifest(fallbackData);
              setError(null);
            }
          } catch (fallbackErr) {
            console.error('Fallback also failed:', fallbackErr);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    loadManifest();
  }, [setManifest]);

  return { loading, error };
}

/**
 * Transform backend API data format to frontend manifest format
 * This handles any differences between backend and frontend data structures
 */
function transformApiDataToManifest(apiData: any): ComponentManifest {
  // If backend already returns correct format, return as-is
  if (apiData.projectName && apiData.categories) {
    return apiData;
  }

  // Otherwise, transform the data
  const components = apiData.components || [];
  
  // Extract unique tags for categories
  const allTags = [...new Set(components.flatMap((c: any) => c.tags || []))];
  const categories = allTags.map((tag: any) => ({
    name: tag,
    displayName: typeof tag === 'string' ? tag.charAt(0).toUpperCase() + tag.slice(1) : String(tag),
    description: `Components tagged with ${tag}`,
    componentCount: components.filter((c: any) => c.tags?.includes(tag)).length,
  }));

  // Map components to frontend format
  const transformedComponents = components.map((c: any, index: number) => ({
    id: `component-${index}`,
    name: c.name,
    category: c.tags?.[0] || 'uncategorized',
    filePath: c.path,
    description: c.documentation || '',
    type: c.type === 'hook' ? 'function' : 'function', // Backend uses 'component' | 'hook', frontend uses 'function' | 'class'
    props: (c.props || []).map((p: any) => ({
      name: p.name,
      type: p.type,
      required: !p.isOptional,
      defaultValue: p.defaultValue,
      description: p.description,
    })),
    examples: [],  // TODO: Add examples generation in backend
    sourceCode: '', // TODO: Add source code in backend
    tags: c.tags || [],
    exports: [c.name],
  }));

  return {
    version: apiData.version || '1.0.0',
    generatedAt: apiData.generated || new Date().toISOString(),
    projectName: 'Component Library',
    components: transformedComponents,
    categories,
    stats: {
      totalComponents: transformedComponents.length,
      totalCategories: categories.length,
      lastUpdated: apiData.generated || new Date().toISOString(),
    },
  };
}

/**
 * Hook to search components via API
 */
export function useComponentSearch(query: string) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    async function search() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Search error"));
      } finally {
        setLoading(false);
      }
    }

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, loading, error };
}

/**
 * Hook to get dependency graph data
 */
export function useDependencyGraph() {
  const [graph, setGraph] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadGraph() {
      try {
        const response = await fetch(`${API_BASE_URL}/graph`);
        
        if (response.ok) {
          const data = await response.json();
          setGraph(data);
        }
      } catch (err) {
        console.warn('Dependency graph not available:', err);
        setError(err instanceof Error ? err : new Error("Graph error"));
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, []);

  return { graph, loading, error };
}
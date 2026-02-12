import { useState, useEffect } from "react";
import type { ComponentManifest } from "../types/manifest";
import { useRegistryStore } from "../stores/registryStore";

/**
 * Hook to load and manage the component manifest
 * In development, loads from mock data
 * In production, loads from generated manifest
 */
export function useManifest() {
  const setManifest = useRegistryStore((state) => state.setManifest);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadManifest() {
      try {
        setLoading(true);
        // Load from mock data for now
        const response = await fetch("/mock-data/manifest.json");

        if (!response.ok) {
          throw new Error("Failed to load manifest");
        }

        const data = await response.json() as ComponentManifest;
        setManifest(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    }

    loadManifest();
  }, [setManifest]);

  return { loading, error };
}

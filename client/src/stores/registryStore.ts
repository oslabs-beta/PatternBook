import { create } from "zustand";
import type { Component, ComponentManifest } from "../types/manifest";

interface RegistryState {
  // State
  manifest: ComponentManifest | null;
  components: Component[];
  selectedComponent: Component | null;
  filteredComponents: Component[];
  activeTagFilter: string | null;
  searchQuery: string;

  // Actions
  setManifest: (manifest: ComponentManifest) => void;
  setSelectedComponent: (componentId: string | null) => void;
  filterByTag: (tag: string | null) => void;
  setSearchQuery: (query: string) => void;
  updateRegistry: (manifest: ComponentManifest) => void;
}

export const useRegistryStore = create<RegistryState>((set, get) => ({
  // Initial State
  manifest: null,
  components: [],
  selectedComponent: null,
  filteredComponents: [],
  activeTagFilter: null,
  searchQuery: "",

  // Actions
  setManifest: (manifest) => {
    set({
      manifest,
      components: manifest.components,
      filteredComponents: manifest.components,
    });
  },

  updateRegistry: (manifest) => {
    // Alias for setManifest, but could handle merging logic if needed later
    get().setManifest(manifest);
  },

  setSelectedComponent: (componentId) => {
    const { components } = get();
    if (!componentId) {
      set({ selectedComponent: null });
      return;
    }
    const component = components.find((c) => c.id === componentId) || null;
    set({ selectedComponent: component });
  },

  filterByTag: (tag) => {
    const { components, searchQuery } = get();
    const normalizedQuery = searchQuery.toLowerCase();

    let filtered = components;

    // Apply Tag Filter
    if (tag) {
      filtered = filtered.filter((c) => c.tags?.includes(tag));
    }

    // Re-apply Search Query if exists
    if (normalizedQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(normalizedQuery) ||
          c.description?.toLowerCase().includes(normalizedQuery),
      );
    }

    set({
      activeTagFilter: tag,
      filteredComponents: filtered,
    });
  },

  setSearchQuery: (query) => {
    const { components, activeTagFilter } = get();
    const normalizedQuery = query.toLowerCase();

    let filtered = components;

    // Apply Search
    if (normalizedQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(normalizedQuery) ||
          c.description?.toLowerCase().includes(normalizedQuery),
      );
    }

    // Re-apply Tag Filter if exists
    if (activeTagFilter) {
      filtered = filtered.filter((c) => c.tags?.includes(activeTagFilter));
    }

    set({
      searchQuery: query,
      filteredComponents: filtered,
    });
  },
}));

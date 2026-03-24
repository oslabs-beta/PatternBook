import { useState } from "react";
import { Search, X, ChevronDown, ChevronRight } from "lucide-react";
import "../main.css";
import { useRegistryStore } from "../stores/registryStore";

function SideBar() {
  const components = useRegistryStore((state) => state.filteredComponents);
  const categories = useRegistryStore(
    (state) => state.manifest?.categories ?? [],
  );
  const selectedComponent = useRegistryStore(
    (state) => state.selectedComponent,
  );
  const setSelectedComponent = useRegistryStore(
    (state) => state.setSelectedComponent,
  );
  const setSearchQuery = useRegistryStore((state) => state.setSearchQuery);
  const searchQuery = useRegistryStore((state) => state.searchQuery);

  // Track which category groups are collapsed
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  // Group filteredComponents by category
  const byCategory = categories.map((cat) => ({
    ...cat,
    items: components.filter((c) => c.category === cat.name),
  }));

  // Components with no matching category
  const uncategorized = components.filter(
    (c) => !categories.some((cat) => cat.name === c.category),
  );

  return (
    <aside className="flex flex-col w-64 min-w-64 h-screen bg-white border-r border-gray-200 overflow-hidden">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-center w-8 h-8">
          <img src="/patternbook.svg" alt="PatternBook Logo" className="w-full h-full object-contain" />
        </div>
        <span className="text-sm font-semibold text-gray-900 tracking-tight">
          PatternBook
        </span>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-gray-100">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-8 pr-7 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md placeholder:text-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Component list */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {byCategory.map((cat) => {
          if (cat.items.length === 0) return null;
          const isCollapsed = collapsedCategories.has(cat.name);

          return (
            <div key={cat.name} className="mb-1">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.name)}
                className="flex items-center justify-between w-full px-3 py-1.5 text-left group"
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">
                  {cat.displayName}
                </span>
                {isCollapsed ? (
                  <ChevronRight
                    size={12}
                    className="text-gray-400 group-hover:text-gray-600"
                  />
                ) : (
                  <ChevronDown
                    size={12}
                    className="text-gray-400 group-hover:text-gray-600"
                  />
                )}
              </button>

              {/* Component items */}
              {!isCollapsed && (
                <ul className="mt-0.5 space-y-0.5">
                  {cat.items.map((comp) => {
                    const isSelected = selectedComponent?.id === comp.id;
                    return (
                      <li key={comp.id}>
                        <button
                          onClick={() => setSelectedComponent(comp.id)}
                          className={[
                            "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                            isSelected
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                          ].join(" ")}
                        >
                          {comp.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {/* Uncategorized */}
        {uncategorized.length > 0 && (
          <div className="mb-1">
            <div className="px-3 py-1.5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Other
              </span>
            </div>
            <ul className="mt-0.5 space-y-0.5">
              {uncategorized.map((comp) => {
                const isSelected = selectedComponent?.id === comp.id;
                return (
                  <li key={comp.id}>
                    <button
                      onClick={() => setSelectedComponent(comp.id)}
                      className={[
                        "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors",
                        isSelected
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      ].join(" ")}
                    >
                      {comp.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Empty search state */}
        {components.length === 0 && searchQuery && (
          <div className="px-3 py-6 text-center">
            <p className="text-sm text-gray-400">No components match</p>
            <p className="text-xs text-gray-300 mt-1">"{searchQuery}"</p>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          {components.length} component{components.length !== 1 ? "s" : ""}
        </p>
      </div>
    </aside>
  );
}

export default SideBar;

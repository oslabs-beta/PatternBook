import "./main.css";
import Dashboard from "./dashboard-etc/Dashboard.tsx";
import { useRegistryStore } from "./stores/registryStore";

function App() {
  // Load manifest into store on mount
  const setManifest = useRegistryStore((state) => state.setManifest);
  const components = useRegistryStore((state) => state.components);
  const setSelectedComponent = useRegistryStore(
    (state) => state.setSelectedComponent,
  );

  return (
    <>
      <div className="p-4 bg-gray-100 border-b border-gray-300">
        <h1 className="text-2xl font-bold mb-2">Pattern Book</h1>
        {/* TEMPORARY: Component selector for testing - will be replaced by left sidebar */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm text-gray-600 self-center">
            Test selector (temporary):
          </span>
          {components.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setSelectedComponent(comp.id)}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
            >
              {comp.name}
            </button>
          ))}
        </div>
      </div>
      <Dashboard />
    </>
  );
}

export default App;

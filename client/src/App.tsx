import { useEffect } from "react";
import { useRegistryStore } from "./stores/registryStore";
import "./main.css";
import Dashboard from "./dashboard-etc/Dashboard.tsx";

function App() {
  // Load manifest into store on mount
  const setManifest = useRegistryStore((state) => state.setManifest);

  useEffect(() => {
    fetch("/mock-data/manifest.json")
      .then((res) => res.json())
      .then((data) => setManifest(data))
      .catch(console.error);
  }, [setManifest]);

  return (
    <>
    <div className="flex-wrap justify-center bg-black min-w-200">
      <h1 className="flex justify-center text-white">Pattern Book</h1>
      <Dashboard />
    </div>

    </>
  );
}

export default App;

import "./main.css";
import Dashboard from "./dashboard-etc/Dashboard.tsx";
import { useManifest } from "./hooks/useManifest.ts";

function App() {
  const { loading, error } = useManifest();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-sm">
        Loading components...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-sm">
        Failed to load manifest: {error.message}
      </div>
    );
  }

  return <Dashboard />;
}

export default App;

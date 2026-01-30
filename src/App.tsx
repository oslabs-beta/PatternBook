import { useEffect } from "react";
import { useRegistryStore } from "./stores/registryStore";

function App() {
  const setManifest = useRegistryStore((state) => state.setManifest);
  const components = useRegistryStore((state) => state.components);
  const loading = useRegistryStore((state) => state.manifest === null);

  useEffect(() => {
    fetch("/mock-data/manifest.json")
      .then((res) => res.json())
      .then((data) => setManifest(data))
      .catch(console.error);
  }, [setManifest]);

  if (loading) {
    return <div>Loading manifest...</div>;
  }

  return (
    <div>
      <h1>PatternBook Store Demo</h1>
      <p>Components loaded: {components.length}</p>
      <ul>
        {components.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

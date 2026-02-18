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
                <h1 className="text-3xl">Pattern Book</h1>
      <Dashboard />
    </>
  );
}

export default App;

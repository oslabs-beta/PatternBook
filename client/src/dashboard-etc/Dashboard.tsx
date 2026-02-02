import "../main.css";

import SearchBar from "./SearchBar";
import SideBar from "./SideBar";

import { useState } from "react";
import { useManifest } from "../hooks/useManifest.ts";
import { useRegistryStore } from "../stores/registryStore.ts";

function Dashboard() {

const {loading, error} = useManifest();
const manifest = useRegistryStore((state) => state.manifest);
const [showManifest, setShowManifest ] = useState(false)

  return (
    <>
      <div className="flex-column justify-center max-w-400">

        <SideBar />
        <div className="flex justify-center bg-black text-white border-pink-400">
          <button 
          onClick={() => {
            console.log('Button clicked!');
            setShowManifest(!showManifest);
          }} 
          className="flex justify-center bg-gray-600 w-40"
        >
          {showManifest ? 'Hide' : 'Show'} Manifest
        </button>
        
        <div>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error ? error.message : 'None'}</p>
          <p>Manifest exists: {manifest ? 'Yes' : 'No'}</p>
          <p>Show: {showManifest ? 'Yes' : 'No'}</p>
        </div>
        
        {showManifest && (
          <div className="flex max-w-400 p-4 bg-gray-100 text-black rounded">
            {loading && <p>Loading manifest...</p>}
            {error && <p className="text-red-500">Error: {error.message}</p>}
            {manifest ? (
              // <pre className="flex justify-center max-w-200 max-h-400 bg-black text-white p-4 rounded">
               <>
               {JSON.stringify(manifest, null, 2)}
              
               </> 
            ) : (
              <p>No manifest data available</p>
            )}
          </div>

          )}
          </div>
          </div>
    
        <SearchBar/>

    </>
  );
}

export default Dashboard;

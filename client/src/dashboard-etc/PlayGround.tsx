import "../main.css";

import { useState } from "react";
import { useManifest } from "../hooks/useManifest.ts";
import { useRegistryStore } from "../stores/registryStore.ts";

function PlayGround() {

const {loading, error} = useManifest();
const manifest = useRegistryStore((state) => state.manifest);
const [showManifest, setShowManifest ] = useState(false)
  return (
    <>
      <div className="flex-wrap row justify-center text-blue-500 width-400px">
        <p className="">view documentaion</p>
        <br></br>
    <hr className="color-purple" />
 <div className="flex justify-center bg-black text-white border-pink-400">
          <button 
          onClick={() => {
            console.log('Button clicked!');
            setShowManifest(!showManifest);
          }} 
          className="flex justify-center bg-gray-600 rounded p-1 m-4"
        >
          {showManifest ? 'Hide' : 'Show'} Manifest
        </button>
        </div>
        <div>
        <div>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error ? error.message : 'None'}</p>
          <p>Manifest exists: {manifest ? 'Yes' : 'No'}</p>
          <p>Show: {showManifest ? 'Yes' : 'No'}</p>
            <hr className="color-purple" />
        </div>
        
            <div>
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
          </div>
    </>
  );

}

export default PlayGround;
// might delete this
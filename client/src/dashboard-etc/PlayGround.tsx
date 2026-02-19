// I'm labelling this as Playground.  Probably will be static for the MVP but just figured this was clear
import "../main.css";
import { useManifest } from "../hooks/useManifest";
import { useRegistryStore } from "../stores/registryStore";
import { useState } from "react";

const PlayGround = () => {
  const {loading, error} = useManifest();
  const manifest = useRegistryStore((state) => state.manifest);
  const [showManifest, setShowManifest ] = useState(false)

  return (
    <>
      <div className="flex-wrap row m-3 p-2 align-items-center border rounded bg-blue-100 border-blue-500 text-xs text-blue-500 w-[80%]">
        <p>view documentaion</p>
        <hr/>
        <div className="flex-column justify-center text-red border-pink-400">
          <button 
            onClick={() => {
            console.log('Button clicked!');
            setShowManifest(!showManifest);
             }} 
            className="flex justify-center border border-blue-800 bg-purple-100 rounded p-1 m-4"
          >
          {showManifest ? 'Hide' : 'Show'} Manifest
          </button>
          <hr />
          <h6 className="text-sm">
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error ? error.message : 'None'}</p>
          <p>Manifest exists: {manifest ? 'Yes' : 'No'}</p>
          <p>Show: {showManifest ? 'Yes' : 'No'}</p>
          </h6>
        <hr/>

        </div>
        
            <div>
              {showManifest && (
                <div className="flex max-w-400 p-4 bg-purple-100 text-black rounded">
                  {loading && <p>Loading manifest...</p>}
                  {error && <p className="text-red-500">Error: {error.message}</p>}
                  { manifest ? (
                    <pre>
                    {JSON.stringify(manifest, null, 2)}
                    </pre>
                  ) : null
                  }
                  </div>
                )
              }
           </div>
      </div>
    </>
  )

}
            
          
export default PlayGround;

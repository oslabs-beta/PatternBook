import React, {Suspense, useState, useMemo} from 'react';
import libraryData from '../library-metadata.json';

// vite waiter will prepare all possible component files
const componentModules = import.meta.glob('/src/**/*.tsx');

export default function Gallery(){
  const [selectedComponent, setSelectedComponent] = useState<any>(null);

  // Dynamic Loader 
  const PreviewComponent = useMemo(() => {
    if (!selectedComponent) return null;

    // match the path from json to vite glob map 
    const importFn = componentModules[`/${selectedComponent.path}`];

    if (!importFn){
      return () => <div>Component file not found at {selectedComponent.path}</div>;
    }
    // actual dynamic imoprt 
    return React.lazy(importFn as any);
  }, [selectedComponent]);

  return (
    <div style={{ display: 'flex' , height: '100vh' , fontFamily: 'sans-serif'}}>
      {/* SIDEBAR: List of Componets found by your Robot */}
      <div style={{ width: '250px' , borderRight: '1px solid #ddd' , padding: '20px' }}>
        <h2>PatternBook</h2>
        <ul style={{ listStyle: 'none' , padding: 0 }}>
          {libraryData.map((comp) => (
            <li key={comp.name} style={{ marginBottom: '10px' }}>
              <button 
              onClick={() => setSelectedComponent(comp)}
              style={{ width: '100%' , textAlign: 'left' , cursor: 'pointer' ,padding: '8px' }}
              >
                {comp.name}
                </button>
                </li>
              ))}
              </ul>
              </div>
              
              {/* MAIN STAGE: Where the selected component is rendered */}
              <div style={{ flex: 1, padding: '40px' , backgroundColor: '#f9f9f9' }}>
                {selectedComponent ? (
                  <div>
                    <h1>{selectedComponent.name}</h1>
                    <div style={{ border: '1px solid #ccc' , padding: '20px' , background: '#fff' , borderRadius: '8px' }}>
                      <Suspense fallback={<div>Loading component...</div>}>
                      {PreviewComponent && <PreviewComponent label='Preview' count={1} />}
                      </Suspense>
                      </div>

                      <h3> Props (Extracted by Robot)</h3>
                      <pre style={{ background: '#eee' , padding: '10px'}}>
                      {JSON.stringify(selectedComponent.props, null , 2)}
                      </pre>
                      </div>
                    ) : (
                      <p>Select a component from the sidebar to preview it.</p>
                    )}
                  
                    </div>
                    </div>
                  );
                }


import React, { Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { COMPONENT_REGISTRY } from './virtualRegistry';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { themes } from 'prism-react-renderer';


const urlParams = new URLSearchParams(window.location.search);
const componentName = urlParams.get('component');
const initialCode = urlParams.get('code') || ('<' + componentName + ' />');

function PreviewApp() {
  const [code, setCode] = useState(initialCode);
  const Component = COMPONENT_REGISTRY[componentName];

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'UPDATE_CODE') setCode(event.data.code);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!componentName || !Component) {
    return <div style={{padding:16,fontFamily:'sans-serif',color:'#c00'}}>{'Component not found: ' + componentName}</div>;
  }

  const scope = { React, [componentName]: Component };

  return (
    <Suspense fallback={<div style={{padding:16}}>Loading...</div>}>
      <LiveProvider code={code} scope={scope} theme={themes.nightOwl}>
        <LivePreview />
        <LiveError style={{color:'red',fontSize:12,padding:8}} />
      </LiveProvider>
    </Suspense>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<PreviewApp />);

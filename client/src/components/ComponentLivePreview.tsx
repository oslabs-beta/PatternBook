import { LiveProvider, LiveEditor, LiveError, LiveContext } from "react-live";
import { themes } from "prism-react-renderer";
import { useContext, useEffect, useRef } from "react";

interface ComponentLivePreviewProps {
  /** The raw JSX string from the manifest example */
  code: string;
  /** Scope object: component(s) + React, from getScopeForComponent() */
  scope: Record<string, unknown>;
  /** The name of the component to load in the iframe preview */
  componentName: string;
}

function IframePreview({ componentName }: { componentName: string }) {
  const context = useContext(LiveContext);
  const code = context?.code || "";
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send live-edit updates to the iframe whenever code changes after initial load
  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (hasLoadedRef.current && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_CODE', code }, '*');
    }
  }, [code]);

  return (
    <div className="live-preview-frame">
      <p className="live-preview-label">Preview</p>
      <iframe
        ref={iframeRef}
        src={`/patternbook-preview/preview.html?component=${encodeURIComponent(componentName)}&code=${encodeURIComponent(code)}`}
        style={{ width: '100%', height: '300px', border: '1px solid #eee', borderRadius: '8px' }}
        title="Component Preview"
        onLoad={() => { hasLoadedRef.current = true; }}
      />
    </div>
  );
}

/**
 * Renders a syntax-highlighted, *editable* code editor (via react-live's
 * LiveEditor) alongside a live preview iframe of the rendered component.
 */
export function ComponentLivePreview({
  code,
  scope,
  componentName,
}: ComponentLivePreviewProps) {
  return (
    <LiveProvider
      code={code}
      scope={scope}
      theme={themes.nightOwl}
      noInline={false}
    >
      {/* Syntax-highlighted editable code editor */}
      <div className="live-editor-wrapper">
        <p className="live-editor-label">Code — edit me!</p>
        <LiveEditor className="live-editor" />
      </div>

      {/* Live rendered preview via iframe */}
      <IframePreview componentName={componentName} />

      {/* Compilation / runtime errors */}
      <LiveError className="live-preview-error" />
    </LiveProvider>
  );
}

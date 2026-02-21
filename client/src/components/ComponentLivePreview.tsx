import { LiveProvider, LivePreview, LiveError } from "react-live";

interface ComponentLivePreviewProps {
  /** The raw JSX string from the manifest example, e.g. `<Button>Click</Button>` */
  code: string;
  /** Scope object: component(s) + React, from getScopeForComponent() */
  scope: Record<string, unknown>;
}

/**
 * Renders a live, interactive preview of a component example using react-live.
 *
 * react-live compiles the JSX string in-browser (no server needed) and renders
 * the result inside a React tree. Any syntax errors are shown below the preview
 * frame instead of crashing the whole page.
 */
export function ComponentLivePreview({
  code,
  scope,
}: ComponentLivePreviewProps) {
  return (
    <LiveProvider
      code={code}
      scope={scope}
      // `noInline` stays false (default) so single-expression JSX just works.
      // If examples ever need multi-line render() calls, set noInline={true}
      // and add `render(<Component />)` at the end of the code string.
      noInline={false}
    >
      {/* Rendered component output */}
      <div className="live-preview-frame">
        <LivePreview />
      </div>

      {/* Compilation / runtime errors */}
      <LiveError className="live-preview-error" />
    </LiveProvider>
  );
}

<<<<<<< HEAD
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import { themes } from "prism-react-renderer";

interface ComponentLivePreviewProps {
  /** The raw JSX string from the manifest example */
=======
import { LiveProvider, LivePreview, LiveError } from "react-live";

interface ComponentLivePreviewProps {
  /** The raw JSX string from the manifest example, e.g. `<Button>Click</Button>` */
>>>>>>> origin/main
  code: string;
  /** Scope object: component(s) + React, from getScopeForComponent() */
  scope: Record<string, unknown>;
}

/**
<<<<<<< HEAD
 * Renders a syntax-highlighted, *editable* code editor (via react-live's
 * LiveEditor) alongside a live preview of the rendered component.
 *
 * Both LiveEditor and LivePreview must share the same LiveProvider context,
 * so they are co-located here. Edits to the code update the preview in real time.
=======
 * Renders a live, interactive preview of a component example using react-live.
 *
 * react-live compiles the JSX string in-browser (no server needed) and renders
 * the result inside a React tree. Any syntax errors are shown below the preview
 * frame instead of crashing the whole page.
>>>>>>> origin/main
 */
export function ComponentLivePreview({
  code,
  scope,
}: ComponentLivePreviewProps) {
  return (
    <LiveProvider
      code={code}
      scope={scope}
<<<<<<< HEAD
      theme={themes.nightOwl}
      noInline={false}
    >
      {/* Syntax-highlighted editable code editor */}
      <div className="live-editor-wrapper">
        <p className="live-editor-label">Code — edit me!</p>
        <LiveEditor className="live-editor" />
      </div>

      {/* Live rendered preview */}
      <div className="live-preview-frame">
        <p className="live-preview-label">Preview</p>
=======
      // `noInline` stays false (default) so single-expression JSX just works.
      // If examples ever need multi-line render() calls, set noInline={true}
      // and add `render(<Component />)` at the end of the code string.
      noInline={false}
    >
      {/* Rendered component output */}
      <div className="live-preview-frame">
>>>>>>> origin/main
        <LivePreview />
      </div>

      {/* Compilation / runtime errors */}
      <LiveError className="live-preview-error" />
    </LiveProvider>
  );
}

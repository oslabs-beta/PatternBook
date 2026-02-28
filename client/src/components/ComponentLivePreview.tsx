import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import { themes } from "prism-react-renderer";

interface ComponentLivePreviewProps {
  /** The raw JSX string from the manifest example */
  code: string;
  /** Scope object: component(s) + React, from getScopeForComponent() */
  scope: Record<string, unknown>;
}

/**
 * Renders a syntax-highlighted, *editable* code editor (via react-live's
 * LiveEditor) alongside a live preview of the rendered component.
 *
 * Both LiveEditor and LivePreview must share the same LiveProvider context,
 * so they are co-located here. Edits to the code update the preview in real time.
 */
export function ComponentLivePreview({
  code,
  scope,
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

      {/* Live rendered preview */}
      <div className="live-preview-frame">
        <p className="live-preview-label">Preview</p>
        <LivePreview />
      </div>

      {/* Compilation / runtime errors */}
      <LiveError className="live-preview-error" />
    </LiveProvider>
  );
}

import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";

interface SourceCodeViewerProps {
  sourceCode: string;
  componentName: string;
}

export function SourceCodeViewer({
  sourceCode,
  componentName,
}: SourceCodeViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sourceCode) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold text-gray-900">Source Code</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={16} />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Expand
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="relative group">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto max-h-96 overflow-y-auto">
            <code className="text-sm font-mono whitespace-pre">
              {sourceCode}
            </code>
          </pre>

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition opacity-0 group-hover:opacity-100"
            title="Copy source code"
          >
            {copied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
          </button>
        </div>
      )}

      {!isExpanded && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            Click "Expand" to view the full source code for{" "}
            <code className="font-mono text-gray-800">{componentName}</code>
          </p>
        </div>
      )}
    </div>
  );
}

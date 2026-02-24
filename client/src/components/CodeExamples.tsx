import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { Example } from "../types/manifest";
import { ComponentLivePreview } from "./ComponentLivePreview";
import { getScopeForComponent } from "./componentRegistry";

interface CodeExamplesProps {
  examples: Example[];
  /** The component name from the manifest — used to resolve the live preview scope */
  componentName?: string;
}

export function CodeExamples({ examples, componentName }: CodeExamplesProps) {
  const scope = getScopeForComponent(componentName ?? "");
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!examples || examples.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic">
        No examples available for this component.
      </div>
    );
  }

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Examples</h2>

      {/* Tabs */}
      {examples.length > 1 && (
        <div className="flex gap-2 mb-4 border-b border-gray-200">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 font-medium text-sm transition ${
                activeTab === index
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>
      )}

      {/* Active Example */}
      {examples.map((example, index) => (
        <div key={index} className={activeTab === index ? "block" : "hidden"}>
          {/* Example Title (if only one example) */}
          {examples.length === 1 && (
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {example.title}
            </h3>
          )}

          {/* Code Block */}
          <div className="relative group">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono">{example.code}</code>
            </pre>

            {/* Copy Button */}
            <button
              onClick={() => copyToClipboard(example.code, index)}
              className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition opacity-0 group-hover:opacity-100"
              title="Copy code"
            >
              {copiedIndex === index ? (
                <Check size={16} className="text-green-400" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          {/* Live Preview */}
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Preview
            </p>
            <ComponentLivePreview code={example.code} scope={scope} />
          </div>
        </div>
      ))}
    </div>
  );
}

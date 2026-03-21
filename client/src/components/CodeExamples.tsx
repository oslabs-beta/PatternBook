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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Examples</h2>
        {/* Copy button for the active example's original code */}
        <button
          onClick={() => copyToClipboard(examples[activeTab].code, activeTab)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          title="Copy code"
        >
          {copiedIndex === activeTab ? (
            <>
              <Check size={13} className="text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Tabs — only shown when there are multiple examples */}
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

      {/* Active Example — LiveEditor + LivePreview via ComponentLivePreview */}
      {examples.map((example, index) => (
        <div key={index} className={activeTab === index ? "block" : "hidden"}>
          {/* Title when there's only one example */}
          {examples.length === 1 && (
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
              {example.title}
            </h3>
          )}

          {/*
            ComponentLivePreview now renders both the highlighted/editable
            LiveEditor and the LivePreview inside a shared LiveProvider.
          */}
          <ComponentLivePreview code={example.code} scope={scope} />
        </div>
      ))}
    </div>
  );
}

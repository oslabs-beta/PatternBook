import { Copy, FileCode, Package } from "lucide-react";
import type { Component } from "../types/manifest";

interface ComponentHeaderProps {
  component: Component;
}

export function ComponentHeader({ component }: ComponentHeaderProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="border-b border-red-200 pb-6 mb-6">
      {/* Component Name and Type Badge */}
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-3xl font-bold text-gray-900">{component.name}</h1>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${
            component.type === "function"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          {component.type}
        </span>
      </div>

      {/* Description */}
      {component.description && (
        <p className="text-gray-600 text-lg mb-4">{component.description}</p>
      )}

      {/* Metadata Row */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        {/* File Path */}
        <div className="flex items-center gap-2">
          <FileCode size={16} />
          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
            {component.filePath}
          </code>
          <button
            onClick={() => copyToClipboard(component.filePath)}
            className="text-gray-400 hover:text-gray-600 transition"
            title="Copy file path"
          >
            <Copy size={14} />
          </button>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2">
          <Package size={16} />
          <span className="capitalize">{component.category}</span>
        </div>
      </div>

      {/* Tags */}
      {component.tags && component.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {component.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Exports */}
      {component.exports && component.exports.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          <span className="font-medium">Exports:</span>{" "}
          <code className="text-gray-700">{component.exports.join(", ")}</code>
        </div>
      )}
    </div>
  );
}

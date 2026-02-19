import { useRegistryStore } from "../stores/registryStore";
import { ComponentHeader } from "../components/ComponentHeader";
import { PropsTable } from "../components/PropsTable";
import { CodeExamples } from "../components/CodeExamples";
import { SourceCodeViewer } from "../components/SourceCodeViewer";
import { FileQuestion } from "lucide-react";
import "../main.css";

function PlayGround() {
  const selectedComponent = useRegistryStore(
    (state) => state.selectedComponent,
  );

  // Empty state when no component is selected
  if (!selectedComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
        <FileQuestion size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No Component Selected
        </h2>
        <p className="text-gray-500 max-w-md">
          Select a component from the sidebar to view its documentation, props,
          examples, and source code.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Component Header */}
      <ComponentHeader component={selectedComponent} />

      {/* Props Table */}
      <PropsTable props={selectedComponent.props} />

      {/* Code Examples */}
      <CodeExamples examples={selectedComponent.examples} />

      {/* Source Code Viewer */}
      <SourceCodeViewer
        sourceCode={selectedComponent.sourceCode}
        componentName={selectedComponent.name}
      />
    </div>
  );
}

export default PlayGround;

import type { Prop } from "../types/manifest";

interface PropsTableProps {
  props: Prop[];
}

export function PropsTable({ props }: PropsTableProps) {
  if (!props || props.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic">
        No props documented for this component.
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Props</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Name
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Type
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Required
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Default
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop, index) => (
              <tr
                key={prop.name}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {/* Name */}
                <td className="py-3 px-4">
                  <code className="text-sm font-mono text-blue-600">
                    {prop.name}
                  </code>
                </td>

                {/* Type */}
                <td className="py-3 px-4">
                  <code className="text-sm font-mono text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    {prop.type}
                  </code>
                </td>

                {/* Required */}
                <td className="py-3 px-4">
                  {prop.required ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                      Required
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Optional</span>
                  )}
                </td>

                {/* Default */}
                <td className="py-3 px-4">
                  {prop.defaultValue ? (
                    <code className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {prop.defaultValue}
                    </code>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </td>

                {/* Description */}
                <td className="py-3 px-4 text-sm text-gray-600">
                  {prop.description || (
                    <span className="text-gray-400 italic">No description</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

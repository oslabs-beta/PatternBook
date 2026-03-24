import { Project } from "ts-morph";

/**
 * The structure of our extracted data
 */
interface ComponentMetadata {
  name: string;
  description: string;
  props: Array<{
    name: string;
    type: string;
    isOptional: boolean;
  }>;
}

export function parseComponent(filePath: string): ComponentMetadata | null {
  // 1. Initialize the project
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  // 2. Find the First Exported Function (Assuming Functional Component)
  const functionDeclaration = sourceFile.getFunctions().find(f => f.isExported());
  
  if (!functionDeclaration) return null;

  const name = functionDeclaration.getName() || "UnknownComponent";
  
  // 3. Extract JSDoc (The comments above the function)
  const jsDocs = functionDeclaration.getJsDocs();
  const description = jsDocs.map(doc => doc.getDescription()).join("\n");

  // 4. Extract Props from the first parameter
  const props: ComponentMetadata['props'] = [];
  const firstParam = functionDeclaration.getParameters()[0];

  if (firstParam) {
    const typeNode = firstParam.getType();
    const properties = typeNode.getProperties();

    properties.forEach(prop => {
      props.push({
        name: prop.getName(),
        type: prop.getTypeAtLocation(firstParam).getText(),
        isOptional: prop.isOptional(),
      });
    });
  }

  return {
    name,
    description,
    props,
  };
}
// src/utils/ast-helpers.ts
import { SourceFile, Node, SyntaxKind } from "ts-morph";

/**
 * Evaluates a ts-morph SourceFile to determine if it contains a React component.
 * It checks if any exported functions or variable declarations return JSX.
 */
export function isActuallyReactComponent(sourceFile: SourceFile): boolean {
  const exportedDeclarations = sourceFile.getExportedDeclarations();

  for (const [name, declarations] of exportedDeclarations) {
    for (const declaration of declarations) {
      
      // 1. Check standard functions: `export function MyComponent() {}`
      if (Node.isFunctionDeclaration(declaration)) {
        if (containsJsx(declaration)) return true;
      }
      
      // 2. Check arrow functions: `export const MyComponent = () => {}`
      if (Node.isVariableDeclaration(declaration)) {
        const initializer = declaration.getInitializer();
        if (initializer && Node.isArrowFunction(initializer)) {
          if (containsJsx(initializer)) return true;
        }
      }
    }
  }

  // If we checked all exports and found no JSX, it's likely a utility/config file
  return false;
}

/**
 * Helper to deeply search a node for JSX syntax
 */
function containsJsx(node: Node): boolean {
  // We look for standard JSX elements, self-closing tags, or fragments
  const hasJsxElement = node.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0;
  const hasJsxSelfClosing = node.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0;
  const hasJsxFragment = node.getDescendantsOfKind(SyntaxKind.JsxFragment).length > 0;

  return hasJsxElement || hasJsxSelfClosing || hasJsxFragment;
}
/**
 * Component Registry (Dashboard Shell)
 *
 * This scope object is passed to react-live's LiveProvider primarily so the
 * text editor has access to 'React'. 
 * 
 * NOTE: As of PatternBook v0.3.0, the actual live rendering of user components
 * happens in an isolated iframe powered by Vite, meaning this top-level dashboard
 * shell no longer needs (or has) access to the end-users proprietary components.
 */

import React from "react";

export function getScopeForComponent(
  componentName: string,
): Record<string, unknown> {
  return {
    React,
    [componentName]: () => null // Stub out the component so react-live doesn't crash the UI editor
  };
}

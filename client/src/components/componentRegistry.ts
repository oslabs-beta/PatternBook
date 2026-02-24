/**
 * Component Registry
 *
 * Maps component names (as they appear in manifest `name` fields) to their
 * actual imported React components. This is the "scope" object passed to
 * react-live's LiveProvider so that example code strings like
 * `<Button variant="primary">Click me</Button>` can resolve `Button` at
 * runtime.
 *
 * When you add a new component to test-components/, import it here and add
 * it to the COMPONENT_REGISTRY object.
 */

import React from "react";
import type { ComponentType } from "react";
import { Button } from "../../../services/test/fixtures/Button";
import { Card } from "../../../services/test/fixtures/Card";
import { Dropdown } from "../../../services/test/fixtures/Dropdown";
import { Input } from "../../../services/test/fixtures/Input";
import { Modal } from "../../../services/test/fixtures/Modal";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPONENT_REGISTRY: Record<string, ComponentType<any>> = {
  Button,
  Card,
  Dropdown,
  Input,
  Modal,
};

/**
 * Given a component name from the manifest, return a scope object containing
 * that component (plus React itself, which react-live always needs).
 * Falls back to an empty scope if the component isn't registered.
 */
export function getScopeForComponent(
  componentName: string,
): Record<string, unknown> {
  const component = COMPONENT_REGISTRY[componentName];
  return {
    React,
    ...(component ? { [componentName]: component } : {}),
  };
}

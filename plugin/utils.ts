/// <reference types="@figma/plugin-typings" />

import type { Command, FillConfig } from "../types/types.js";
import type { StrokeConfig } from "../types/geometry.js";
import { nodeRegistry, styleRegistry } from "./registry.js";

// Helper function for default values
export function defaultVal<T>(val: T | undefined | null, defaultValue: T): T {
  return (val !== undefined && val !== null) ? val : defaultValue;
}

// Helper to get data from command - properties come from cmd.data
export function getData(cmd: Command): Record<string, unknown> {
  return cmd.data || {};
}

// Color parsing utility
export function parseColor(color: string | RGB): RGB {
  if (typeof color === 'string') {
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return { r, g, b };
    }
  }
  return color as RGB;
}

// Create solid paint from color
export function solidPaint(color: string, opacity?: number): SolidPaint[] {
  return [{
    type: 'SOLID',
    color: parseColor(color),
    opacity: defaultVal(opacity, 1)
  }];
}

// Find a paint style by name
export function findPaintStyle(styleName: string): PaintStyle | null {
  if (styleRegistry.has(styleName)) {
    return styleRegistry.get(styleName)!;
  }
  const styles = figma.getLocalPaintStyles();
  for (const style of styles) {
    if (style.name === styleName) {
      styleRegistry.set(styleName, style);
      return style;
    }
  }
  return null;
}

// Apply fill to a node - either by style name or color
export function applyFill(node: GeometryMixin & MinimalFillsMixin, fillConfig: FillConfig): void {
  if (fillConfig.style) {
    const style = findPaintStyle(fillConfig.style);
    if (style) {
      (node as SceneNode & { fillStyleId: string }).fillStyleId = style.id;
      return;
    }
  }
  if (fillConfig.color) {
    node.fills = solidPaint(fillConfig.color, fillConfig.opacity);
  }
}

// Apply fills array to a node
export function applyFills(node: GeometryMixin & MinimalFillsMixin, fills: FillConfig[]): void {
  if (!fills || fills.length === 0) return;

  if (fills[0].style) {
    const style = findPaintStyle(fills[0].style);
    if (style) {
      (node as SceneNode & { fillStyleId: string }).fillStyleId = style.id;
      return;
    }
  }

  node.fills = fills.map(f => ({
    type: 'SOLID' as const,
    color: parseColor(f.color),
    opacity: defaultVal(f.opacity, 1)
  }));
}

// Apply stroke to a node
export function applyStroke(node: GeometryMixin & MinimalStrokesMixin, strokeConfig: string | StrokeConfig): void {
  if (!strokeConfig) return;

  let config: StrokeConfig;
  if (typeof strokeConfig === 'string') {
    config = { color: strokeConfig, weight: 1 };
  } else {
    config = strokeConfig;
  }

  if (config.color) {
    node.strokes = solidPaint(config.color, config.opacity);
  }

  if (config.weight !== undefined) {
    node.strokeWeight = config.weight;
  }

  if (config.align) {
    node.strokeAlign = config.align;
  }

  if (config.dashPattern) {
    node.dashPattern = config.dashPattern;
  }
}

// Color to hex string
export function colorToHex(color: RGB): string {
  if (!color) return '';
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}

// Get parent node from command data
export function getParentNode(data: Record<string, unknown>, _parentNode?: SceneNode): (BaseNode & ChildrenMixin) | null {
  if (_parentNode && 'appendChild' in _parentNode) {
    return _parentNode as BaseNode & ChildrenMixin;
  }
  const parentId = data.parent as string | undefined;
  if (parentId) {
    const parent = nodeRegistry.get(parentId);
    if (parent && 'appendChild' in parent) {
      return parent as BaseNode & ChildrenMixin;
    }
  }
  return null;
}

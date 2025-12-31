/// <reference types="@figma/plugin-typings" />

/**
 * Plugin utilities for Figma MCP Bridge.
 * Provides color parsing, paint/effect conversion, and node resolution.
 */

import type { Command } from "../types/commands.js";
import type { FillableNodeData, StrokableNodeData, EffectableNodeData, BaseNodeData } from "../types/data.js";
import type {
  ColorInput,
  RGB,
  RGBA,
  PaintInput,
  SolidPaintInput,
  GradientPaintInput,
  ImagePaintInput,
  GradientStop,
  BlendMode,
} from "../types/paints.js";
import type { StrokeAlign, StrokeCap, StrokeJoin } from "../types/geometry.js";
import type { EffectInput, DropShadowEffectInput, InnerShadowEffectInput } from "../types/effects.js";
import { nodeRegistry, styleRegistry } from "./registry.js";

// ============ Default Value Helper ============

export function defaultVal<T>(val: T | undefined | null, defaultValue: T): T {
  return (val !== undefined && val !== null) ? val : defaultValue;
}

// ============ Color Parsing ============
// Uses Figma's built-in utilities: figma.util.rgb(), figma.util.rgba(), figma.util.solidPaint()

export function parseHexColor(hex: string): RGB {
  // Use Figma's built-in hex parser
  return figma.util.rgb(hex);
}

export function parseColorInput(input: ColorInput): RGB {
  return figma.util.rgba(input);
}

export function getColorOpacity(input: ColorInput): number | undefined {
  if (typeof input === 'string') {
    const clean = input.startsWith('#') ? input.slice(1) : input;
    if (clean.length === 8) {
      // 8-char hex includes alpha - use rgba to parse
      const rgba = figma.util.rgba(input);
      return rgba.a;
    }
    return undefined;
  }
  if ('a' in input) {
    return (input as RGBA).a;
  }
  return undefined;
}

export function colorToHex(color: RGB): string {
  if (!color) return '';
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}

// ============ Paint Conversion ============

export function convertPaintInput(paint: PaintInput): Paint {
  if (!paint.type || paint.type === 'SOLID') {
    const solid = paint as SolidPaintInput;
    // Use Figma's built-in solidPaint utility with overrides
    return figma.util.solidPaint(solid.color, {
      visible: solid.visible ?? true,
      opacity: solid.opacity ?? 1,
      blendMode: (solid.blendMode as BlendMode) ?? 'NORMAL'
    });
  }

  if (paint.type.startsWith('GRADIENT_')) {
    const gradient = paint as GradientPaintInput;
    return {
      type: gradient.type,
      gradientStops: gradient.gradientStops.map((stop: GradientStop) => ({
        position: stop.position,
        color: figma.util.rgba(stop.color)
      })),
      gradientTransform: gradient.gradientTransform || [[1, 0, 0], [0, 1, 0]],
      visible: gradient.visible ?? true,
      opacity: gradient.opacity ?? 1,
      blendMode: (gradient.blendMode as BlendMode) ?? 'NORMAL'
    };
  }

  if (paint.type === 'IMAGE') {
    const image = paint as ImagePaintInput;
    return {
      type: 'IMAGE',
      imageHash: image.imageHash || '',
      scaleMode: image.scaleMode || 'FILL',
      visible: image.visible ?? true,
      opacity: image.opacity ?? 1,
      blendMode: (image.blendMode as BlendMode) ?? 'NORMAL',
      imageTransform: image.imageTransform ?? [[1, 0, 0], [0, 1, 0]],
      scalingFactor: image.scalingFactor ?? 1,
      rotation: image.rotation ?? 0
    };
  }

  if (paint.type === 'VIDEO') {
    return {
      type: 'VIDEO',
      videoHash: (paint as { videoHash: string }).videoHash || '',
      scaleMode: (paint as { scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE' }).scaleMode || 'FILL',
      visible: paint.visible ?? true
    };
  }

  return figma.util.solidPaint('#808080');
}

export function convertPaintInputs(paints: PaintInput[]): Paint[] {
  return paints.map(convertPaintInput);
}

// ============ Effect Conversion ============

export function convertEffectInput(effect: EffectInput): Effect {
  if (effect.type === 'DROP_SHADOW') {
    const shadow = effect as DropShadowEffectInput;
    return {
      type: 'DROP_SHADOW',
      color: figma.util.rgba(shadow.color),
      offset: shadow.offset,
      radius: shadow.radius,
      spread: shadow.spread ?? 0,
      visible: shadow.visible ?? true,
      blendMode: (shadow.blendMode ?? 'NORMAL') as BlendMode,
      showShadowBehindNode: shadow.showShadowBehindNode ?? true
    };
  }

  if (effect.type === 'INNER_SHADOW') {
    const shadow = effect as InnerShadowEffectInput;
    return {
      type: 'INNER_SHADOW',
      color: figma.util.rgba(shadow.color),
      offset: shadow.offset,
      radius: shadow.radius,
      spread: shadow.spread ?? 0,
      visible: shadow.visible ?? true,
      blendMode: (shadow.blendMode ?? 'NORMAL') as BlendMode
    };
  }

  if (effect.type === 'LAYER_BLUR') {
    return {
      type: 'LAYER_BLUR',
      blurType: 'NORMAL',
      radius: effect.radius,
      visible: effect.visible ?? true
    } as Effect;
  }

  if (effect.type === 'BACKGROUND_BLUR') {
    return {
      type: 'BACKGROUND_BLUR',
      blurType: 'NORMAL',
      radius: effect.radius,
      visible: effect.visible ?? true
    } as Effect;
  }

  return { type: 'LAYER_BLUR', blurType: 'NORMAL', radius: 0, visible: true } as Effect;
}

export function convertEffectInputs(effects: EffectInput[]): Effect[] {
  return effects.map(convertEffectInput);
}

// ============ Style Lookup ============

export function findPaintStyle(styleNameOrId: string): PaintStyle | null {
  if (styleRegistry.has(styleNameOrId)) {
    return styleRegistry.get(styleNameOrId) as PaintStyle;
  }

  const byId = figma.getStyleById(styleNameOrId);
  if (byId && byId.type === 'PAINT') {
    return byId as PaintStyle;
  }

  const styles = figma.getLocalPaintStyles();
  for (const style of styles) {
    if (style.name === styleNameOrId) {
      styleRegistry.set(styleNameOrId, style);
      return style;
    }
  }
  return null;
}

export function findEffectStyle(styleNameOrId: string): EffectStyle | null {
  const byId = figma.getStyleById(styleNameOrId);
  if (byId && byId.type === 'EFFECT') {
    return byId as EffectStyle;
  }

  const styles = figma.getLocalEffectStyles();
  for (const style of styles) {
    if (style.name === styleNameOrId) {
      return style;
    }
  }
  return null;
}

export function findTextStyle(styleNameOrId: string): TextStyle | null {
  const byId = figma.getStyleById(styleNameOrId);
  if (byId && byId.type === 'TEXT') {
    return byId as TextStyle;
  }

  const styles = figma.getLocalTextStyles();
  for (const style of styles) {
    if (style.name === styleNameOrId) {
      return style;
    }
  }
  return null;
}

// ============ Apply Fills/Strokes/Effects ============

export async function applyFills(
  node: GeometryMixin & MinimalFillsMixin,
  data: FillableNodeData
): Promise<void> {
  if (data.fillStyleId) {
    const style = findPaintStyle(data.fillStyleId);
    if (style) {
      await (node as SceneNode & { setFillStyleIdAsync(id: string): Promise<void> }).setFillStyleIdAsync(style.id);
      return;
    }
  }

  if (data.fills !== undefined) {
    // Explicitly handle empty array to clear fills (transparent)
    node.fills = data.fills.length > 0 ? convertPaintInputs(data.fills) : [];
    return;
  }

  const color = data.fill || data.fillColor;
  if (color) {
    node.fills = [figma.util.solidPaint(color)];
  }
}

export async function applyStrokes(
  node: GeometryMixin & MinimalStrokesMixin,
  data: StrokableNodeData
): Promise<void> {
  if (data.strokeStyleId) {
    const style = findPaintStyle(data.strokeStyleId);
    if (style) {
      await (node as SceneNode & { setStrokeStyleIdAsync(id: string): Promise<void> }).setStrokeStyleIdAsync(style.id);
    }
  } else if (data.strokes && data.strokes.length > 0) {
    node.strokes = convertPaintInputs(data.strokes);
  } else if (data.stroke || data.strokeColor) {
    const color = data.stroke || data.strokeColor;
    if (color) {
      if (typeof color === 'string' || 'r' in color) {
        node.strokes = [figma.util.solidPaint(color as ColorInput)];
      } else if ('color' in color) {
        const strokeObj = color as { color: string; weight?: number; opacity?: number };
        node.strokes = [figma.util.solidPaint(strokeObj.color, { opacity: strokeObj.opacity ?? 1 })];
        if (strokeObj.weight !== undefined) {
          node.strokeWeight = strokeObj.weight;
        }
      }
    }
  }

  if (data.strokeWeight !== undefined) node.strokeWeight = data.strokeWeight;
  if (data.strokeAlign) node.strokeAlign = data.strokeAlign as StrokeAlign;
  if (data.dashPattern) node.dashPattern = data.dashPattern;

  if ('strokeTopWeight' in node) {
    const rectNode = node as RectangleNode | FrameNode;
    if (data.strokeTopWeight !== undefined) rectNode.strokeTopWeight = data.strokeTopWeight;
    if (data.strokeRightWeight !== undefined) rectNode.strokeRightWeight = data.strokeRightWeight;
    if (data.strokeBottomWeight !== undefined) rectNode.strokeBottomWeight = data.strokeBottomWeight;
    if (data.strokeLeftWeight !== undefined) rectNode.strokeLeftWeight = data.strokeLeftWeight;
  }

  if ('strokeCap' in node && data.strokeCap) {
    (node as VectorNode | LineNode).strokeCap = data.strokeCap as StrokeCap;
  }
  if ('strokeJoin' in node && data.strokeJoin) {
    (node as VectorNode).strokeJoin = data.strokeJoin as StrokeJoin;
  }
  if ('strokeMiterLimit' in node && data.strokeMiterLimit !== undefined) {
    (node as VectorNode).strokeMiterLimit = data.strokeMiterLimit;
  }
}

export async function applyEffects(
  node: BlendMixin,
  data: EffectableNodeData
): Promise<void> {
  if (data.effectStyleId) {
    const style = findEffectStyle(data.effectStyleId);
    if (style) {
      await (node as SceneNode & { setEffectStyleIdAsync(id: string): Promise<void> }).setEffectStyleIdAsync(style.id);
      return;
    }
  }

  if (data.effects && data.effects.length > 0) {
    node.effects = convertEffectInputs(data.effects);
  }
}

// ============ Node Resolution ============

export function resolveNode(nodeIdOrName: string): SceneNode | null {
  if (!nodeIdOrName) return null;

  const fromRegistry = nodeRegistry.get(nodeIdOrName);
  if (fromRegistry) return fromRegistry as SceneNode;

  const fromFigma = figma.getNodeById(nodeIdOrName);
  if (fromFigma && fromFigma.type !== 'DOCUMENT' && fromFigma.type !== 'PAGE') {
    return fromFigma as SceneNode;
  }

  const byName = figma.currentPage.findOne(n => n.name === nodeIdOrName);
  if (byName) return byName as SceneNode;

  return null;
}

export function resolveNodes(ids: string[]): SceneNode[] {
  const nodes: SceneNode[] = [];
  for (const id of ids) {
    const node = resolveNode(id);
    if (node) nodes.push(node);
  }
  return nodes;
}

// ============ Parent Node Helper ============

export function getParent(data: BaseNodeData): (BaseNode & ChildrenMixin) | null {
  if (data.parent) {
    const parent = nodeRegistry.get(data.parent);
    if (parent && 'appendChild' in parent) {
      return parent as BaseNode & ChildrenMixin;
    }
    const resolved = resolveNode(data.parent);
    if (resolved && 'appendChild' in resolved) {
      return resolved as BaseNode & ChildrenMixin;
    }
  }

  return null;
}

// ============ Registry Helper ============

export function registerNode(cmd: Command, node: BaseNode): void {
  if (cmd.id) {
    nodeRegistry.set(cmd.id, node);
  }
}

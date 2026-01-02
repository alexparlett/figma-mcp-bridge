/// <reference types="@figma/plugin-typings" />

/**
 * Node modifier handlers for Figma MCP Bridge.
 */

import type { Command } from "../../types/commands.js";
import type { CommandResult } from "../../types/messages.js";
import type {
  SetFillsData,
  SetStrokesData,
  SetEffectsData,
  SetLayoutData,
  SetLayoutGridsData,
  SetConstraintsData,
  SetBlendModeData,
  SetGradientFillData,
  SetMaskData,
  SetTransformData,
  CloneNodeData,
  ComponentFromNodeData,
  MoveNodeData,
  UpdateNodeData,
  NodeRefData,
} from "../../types/data.js";
import { nodeRegistry } from "../registry.js";
import {
  resolveNode,
  convertPaintInputs,
  convertEffectInputs,
  parseColorInput,
  getColorOpacity,
} from "../utils.js";

// ============ SET FILLS ============

export async function setFills(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetFillsData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node || !('fills' in node)) {
    throw new Error('Node not found or does not support fills: ' + nodeId);
  }

  // Style ID and fills are mutually exclusive - style takes precedence
  if (d.fillStyleId) {
    (node as GeometryMixin & { fillStyleId: string }).fillStyleId = d.fillStyleId;
  } else if (d.fills !== undefined) {
    (node as GeometryMixin).fills = convertPaintInputs(d.fills);
  }
  return node;
}

// ============ SET STROKES ============

export async function setStrokes(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetStrokesData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node || !('strokes' in node)) {
    throw new Error('Node not found or does not support strokes: ' + nodeId);
  }

  const strokeNode = node as MinimalStrokesMixin & { strokeStyleId?: string };

  // Style ID and strokes are mutually exclusive - style takes precedence
  if (d.strokeStyleId) {
    strokeNode.strokeStyleId = d.strokeStyleId;
  } else if (d.strokes !== undefined) {
    strokeNode.strokes = convertPaintInputs(d.strokes);
  }

  if (d.strokeWeight !== undefined) strokeNode.strokeWeight = d.strokeWeight;
  if (d.strokeAlign) strokeNode.strokeAlign = d.strokeAlign;
  if (d.dashPattern) strokeNode.dashPattern = d.dashPattern;

  return node;
}

// ============ SET EFFECTS ============

export async function setEffects(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetEffectsData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node || !('effects' in node)) {
    throw new Error('Node not found or does not support effects: ' + nodeId);
  }

  // Style ID and effects are mutually exclusive - style takes precedence
  if (d.effectStyleId) {
    (node as BlendMixin & { effectStyleId: string }).effectStyleId = d.effectStyleId;
  } else if (d.effects !== undefined) {
    (node as BlendMixin).effects = convertEffectInputs(d.effects);
  }
  return node;
}

// ============ SET LAYOUT ============

export async function setLayout(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetLayoutData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node || !('layoutMode' in node)) {
    throw new Error('Node not found or does not support layout: ' + nodeId);
  }

  const frame = node as FrameNode;

  if (d.direction) frame.layoutMode = d.direction;
  if (d.gap !== undefined) frame.itemSpacing = d.gap;

  if (d.padding !== undefined) {
    frame.paddingTop = d.padding;
    frame.paddingRight = d.padding;
    frame.paddingBottom = d.padding;
    frame.paddingLeft = d.padding;
  }

  if (d.paddingTop !== undefined) frame.paddingTop = d.paddingTop;
  if (d.paddingRight !== undefined) frame.paddingRight = d.paddingRight;
  if (d.paddingBottom !== undefined) frame.paddingBottom = d.paddingBottom;
  if (d.paddingLeft !== undefined) frame.paddingLeft = d.paddingLeft;

  if (d.primaryAlign) frame.primaryAxisAlignItems = d.primaryAlign;
  if (d.counterAlign) frame.counterAxisAlignItems = d.counterAlign;
  if (d.wrap) frame.layoutWrap = d.wrap;
  if (d.counterAxisSpacing !== undefined) frame.counterAxisSpacing = d.counterAxisSpacing;
  if (d.primaryAxisSizing) frame.primaryAxisSizingMode = d.primaryAxisSizing;
  if (d.counterAxisSizing) frame.counterAxisSizingMode = d.counterAxisSizing;

  return node;
}

// ============ SET LAYOUT GRIDS ============

export async function setLayoutGrids(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetLayoutGridsData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node || !('layoutGrids' in node)) {
    throw new Error('Node not found or does not support layout grids: ' + nodeId);
  }

  const frame = node as FrameNode;

  if (d.layoutGrids && d.layoutGrids.length > 0) {
    frame.layoutGrids = d.layoutGrids.map(grid => {
      const color = grid.color ? {
        ...parseColorInput(grid.color),
        a: grid.opacity ?? 0.1
      } : { r: 1, g: 0, b: 0, a: 0.1 };

      if (grid.pattern === 'GRID') {
        return {
          pattern: 'GRID' as const,
          sectionSize: grid.sectionSize,
          visible: grid.visible ?? true,
          color
        };
      } else {
        // ROWS or COLUMNS
        return {
          pattern: grid.pattern as 'ROWS' | 'COLUMNS',
          sectionSize: grid.sectionSize,
          visible: grid.visible ?? true,
          color,
          alignment: grid.alignment ?? 'MIN',
          gutterSize: grid.gutterSize ?? 0,
          count: grid.count ?? Infinity,
          offset: grid.offset ?? 0
        };
      }
    });
  }

  return node;
}

// ============ SET CONSTRAINTS ============

export async function setConstraints(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetConstraintsData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node || !('constraints' in node)) {
    throw new Error('Node not found or does not support constraints: ' + nodeId);
  }

  (node as ConstraintMixin).constraints = {
    horizontal: d.horizontal,
    vertical: d.vertical
  };

  return node;
}

// ============ SET BLEND MODE ============

export async function setBlendMode(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetBlendModeData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node || !('blendMode' in node)) {
    throw new Error('Node not found or does not support blend mode: ' + nodeId);
  }

  (node as BlendMixin).blendMode = d.blendMode;
  return node;
}

// ============ SET GRADIENT FILL ============

export async function setGradientFill(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetGradientFillData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node || !('fills' in node)) {
    throw new Error('Node not found or does not support fills: ' + nodeId);
  }

  const gradientPaint: GradientPaint = {
    type: d.type,
    gradientStops: d.gradientStops.map(stop => ({
      position: stop.position,
      color: {
        ...parseColorInput(stop.color),
        a: getColorOpacity(stop.color) ?? 1
      }
    })),
    gradientTransform: d.gradientTransform || [[1, 0, 0], [0, 1, 0]]
  };

  (node as GeometryMixin).fills = [gradientPaint];
  return node;
}

// ============ SET MASK ============

export async function setMask(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetMaskData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node || !('isMask' in node)) {
    throw new Error('Node not found or does not support masking: ' + nodeId);
  }

  const maskableNode = node as SceneNode & { isMask: boolean; maskType?: 'ALPHA' | 'VECTOR' | 'LUMINANCE' };
  maskableNode.isMask = d.isMask;

  if (d.maskType && 'maskType' in maskableNode) {
    maskableNode.maskType = d.maskType;
  }

  return node;
}

// ============ SET TRANSFORM ============

export async function setTransform(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as SetTransformData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node) {
    throw new Error('Node not found: ' + nodeId);
  }

  const sceneNode = node as SceneNode;

  if (d.rotation !== undefined && 'rotation' in sceneNode) {
    sceneNode.rotation = d.rotation;
  }

  if (d.transform && 'relativeTransform' in sceneNode) {
    (sceneNode as LayoutMixin).relativeTransform = d.transform;
  }

  return node;
}

// ============ MOVE NODE ============

export async function moveNode(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as MoveNodeData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node) {
    throw new Error('Node not found: ' + nodeId);
  }

  const sceneNode = node as SceneNode;
  if (d.x !== undefined) sceneNode.x = d.x;
  if (d.y !== undefined) sceneNode.y = d.y;

  return node;
}

// ============ UPDATE NODE ============

export async function updateNode(cmd: Command): Promise<BaseNode> {
  const d = (cmd.data || {}) as UpdateNodeData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node) {
    throw new Error('Node not found: ' + nodeId);
  }

  const sceneNode = node as SceneNode;

  // Position
  if (d.x !== undefined && 'x' in sceneNode) sceneNode.x = d.x;
  if (d.y !== undefined && 'y' in sceneNode) sceneNode.y = d.y;

  // Size
  if ((d.width !== undefined || d.height !== undefined) && 'resize' in sceneNode) {
    const w = d.width ?? sceneNode.width;
    const h = d.height ?? sceneNode.height;
    (sceneNode as LayoutMixin).resize(w, h);
  }

  // Name
  if (d.newName) sceneNode.name = d.newName;

  // Visibility and opacity
  if (d.visible !== undefined) sceneNode.visible = d.visible;
  if (d.locked !== undefined) sceneNode.locked = d.locked;
  if (d.opacity !== undefined && 'opacity' in sceneNode) {
    (sceneNode as BlendMixin).opacity = d.opacity;
  }
  if (d.rotation !== undefined && 'rotation' in sceneNode) {
    sceneNode.rotation = d.rotation;
  }
  if (d.blendMode && 'blendMode' in sceneNode) {
    (sceneNode as BlendMixin).blendMode = d.blendMode;
  }

  // Fills - style ID and fills are mutually exclusive, style takes precedence
  if ('fills' in sceneNode) {
    if (d.fillStyleId) {
      (sceneNode as GeometryMixin & { fillStyleId: string }).fillStyleId = d.fillStyleId;
    } else if (d.fills !== undefined) {
      (sceneNode as GeometryMixin).fills = convertPaintInputs(d.fills);
    }
  }

  // Strokes - style ID and strokes are mutually exclusive, style takes precedence
  if ('strokes' in sceneNode) {
    if (d.strokeStyleId) {
      (sceneNode as MinimalStrokesMixin & { strokeStyleId: string }).strokeStyleId = d.strokeStyleId;
    } else if (d.strokes !== undefined) {
      (sceneNode as MinimalStrokesMixin).strokes = convertPaintInputs(d.strokes);
    }
  }
  if (d.strokeWeight !== undefined && 'strokeWeight' in sceneNode) {
    (sceneNode as MinimalStrokesMixin).strokeWeight = d.strokeWeight;
  }
  if (d.strokeAlign && 'strokeAlign' in sceneNode) {
    (sceneNode as MinimalStrokesMixin).strokeAlign = d.strokeAlign;
  }
  if (d.dashPattern && 'dashPattern' in sceneNode) {
    (sceneNode as MinimalStrokesMixin).dashPattern = d.dashPattern;
  }

  // Effects - style ID and effects are mutually exclusive, style takes precedence
  if ('effects' in sceneNode) {
    if (d.effectStyleId) {
      (sceneNode as BlendMixin & { effectStyleId: string }).effectStyleId = d.effectStyleId;
    } else if (d.effects !== undefined) {
      (sceneNode as BlendMixin).effects = convertEffectInputs(d.effects);
    }
  }

  // Corner radius
  if (d.cornerRadius !== undefined && 'cornerRadius' in sceneNode) {
    (sceneNode as CornerMixin).cornerRadius = d.cornerRadius;
  }
  if (d.topLeftRadius !== undefined && 'topLeftRadius' in sceneNode) {
    (sceneNode as RectangleNode).topLeftRadius = d.topLeftRadius;
  }
  if (d.topRightRadius !== undefined && 'topRightRadius' in sceneNode) {
    (sceneNode as RectangleNode).topRightRadius = d.topRightRadius;
  }
  if (d.bottomLeftRadius !== undefined && 'bottomLeftRadius' in sceneNode) {
    (sceneNode as RectangleNode).bottomLeftRadius = d.bottomLeftRadius;
  }
  if (d.bottomRightRadius !== undefined && 'bottomRightRadius' in sceneNode) {
    (sceneNode as RectangleNode).bottomRightRadius = d.bottomRightRadius;
  }

  // Constraints
  if (d.constraints && 'constraints' in sceneNode) {
    (sceneNode as ConstraintMixin).constraints = d.constraints;
  }

  return node;
}

// ============ DELETE NODE ============

export async function deleteNode(cmd: Command): Promise<CommandResult> {
  const d = (cmd.data || {}) as NodeRefData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node) {
    throw new Error('Node not found: ' + nodeId);
  }

  // Remove from registry if tracked by cmd.id
  if (cmd.id) {
    nodeRegistry.delete(cmd.id);
  }

  node.remove();
  return { success: true, data: { deleted: true } };
}

// ============ CLONE NODE ============

export async function cloneNode(cmd: Command): Promise<SceneNode> {
  const d = (cmd.data || {}) as CloneNodeData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node) {
    throw new Error('Node not found: ' + nodeId);
  }

  const cloned = node.clone();

  if (d.x !== undefined) cloned.x = d.x;
  if (d.y !== undefined) cloned.y = d.y;

  if (d.parent) {
    const parent = resolveNode(d.parent);
    if (parent && 'appendChild' in parent) {
      (parent as BaseNode & ChildrenMixin).appendChild(cloned);
    }
  }

  if (d.id || cmd.id) {
    nodeRegistry.set(d.id || cmd.id!, cloned);
  }

  return cloned;
}

// ============ COMPONENT FROM NODE ============

export async function componentFromNode(cmd: Command): Promise<ComponentNode> {
  const d = (cmd.data || {}) as ComponentFromNodeData;
  const nodeId = d.nodeId || d.name;

  const node = resolveNode(nodeId!);
  if (!node) {
    throw new Error('Node not found: ' + nodeId);
  }

  const component = figma.createComponentFromNode(node);

  if (d.id || cmd.id) {
    nodeRegistry.set(d.id || cmd.id!, component);
  }

  return component;
}

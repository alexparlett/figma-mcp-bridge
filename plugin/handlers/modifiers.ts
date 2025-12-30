/// <reference types="@figma/plugin-typings" />

import type { Command, CommandResult, SetFillsData, SetStrokesData, SetEffectsData, SetLayoutData, MoveNodeData, UpdateNodeData, NodeRefData } from "../../types/types.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal, applyFills, parseColor } from "../utils.js";

// ============ SET FILLS ============
export function setFills(cmd: Command): BaseNode {
  const d = (cmd.data || {}) as SetFillsData;
  const nodeId = d.nodeId;
  const node = nodeRegistry.get(nodeId!) as SceneNode & GeometryMixin;

  if (!node || !('fills' in node)) {
    throw new Error('Node not found or does not support fills: ' + nodeId);
  }

  applyFills(node, d.fills);
  return node;
}

// ============ SET STROKES ============
export function setStrokes(cmd: Command): BaseNode {
  const d = (cmd.data || {}) as SetStrokesData;
  const nodeId = d.nodeId;
  const node = nodeRegistry.get(nodeId!) as SceneNode & MinimalStrokesMixin;

  if (!node || !('strokes' in node)) {
    throw new Error('Node not found or does not support strokes: ' + nodeId);
  }

  node.strokes = (d.strokes || []).map(s => ({
    type: 'SOLID' as const,
    color: parseColor(s.color),
    opacity: defaultVal(s.opacity, 1)
  }));

  if (d.strokeWeight !== undefined) {
    node.strokeWeight = d.strokeWeight;
  }

  if (d.strokeAlign) {
    node.strokeAlign = d.strokeAlign;
  }

  if (d.dashPattern) {
    node.dashPattern = d.dashPattern;
  }

  return node;
}

// ============ SET EFFECTS ============
export function setEffects(cmd: Command): BaseNode {
  const d = (cmd.data || {}) as SetEffectsData;
  const nodeId = d.nodeId;
  const node = nodeRegistry.get(nodeId!) as SceneNode & BlendMixin;

  if (!node || !('effects' in node)) {
    throw new Error('Node not found or does not support effects: ' + nodeId);
  }

  node.effects = (d.effects || []) as Effect[];
  return node;
}

// ============ SET LAYOUT ============
export function setLayout(cmd: Command): BaseNode {
  const d = (cmd.data || {}) as SetLayoutData;
  const nodeId = d.nodeId;
  const node = nodeRegistry.get(nodeId!) as FrameNode;

  if (!node || !('layoutMode' in node)) {
    throw new Error('Node not found or does not support layout: ' + nodeId);
  }

  if (d.direction) node.layoutMode = d.direction;
  if (d.gap !== undefined) node.itemSpacing = d.gap;
  if (d.padding !== undefined) {
    node.paddingTop = d.padding;
    node.paddingRight = d.padding;
    node.paddingBottom = d.padding;
    node.paddingLeft = d.padding;
  }
  if (d.paddingTop !== undefined) node.paddingTop = d.paddingTop;
  if (d.paddingRight !== undefined) node.paddingRight = d.paddingRight;
  if (d.paddingBottom !== undefined) node.paddingBottom = d.paddingBottom;
  if (d.paddingLeft !== undefined) node.paddingLeft = d.paddingLeft;

  return node;
}

// ============ MOVE NODE ============
export function moveNode(cmd: Command): BaseNode {
  const d = (cmd.data || {}) as MoveNodeData;
  let node: BaseNode | null = null;

  if (cmd.id) {
    node = nodeRegistry.get(cmd.id) || null;
  }

  if (!node && d.nodeId) {
    node = figma.getNodeById(d.nodeId);
  }

  if (!node && d.name) {
    node = figma.currentPage.findOne(n => n.name === d.name);
  }

  if (!node) {
    throw new Error('Node not found: ' + (cmd.id || d.nodeId || d.name));
  }

  if (d.x !== undefined && 'x' in node) (node as SceneNode).x = d.x;
  if (d.y !== undefined && 'y' in node) (node as SceneNode).y = d.y;

  return node;
}

// ============ UPDATE NODE ============
export function updateNode(cmd: Command): BaseNode {
  const d = (cmd.data || {}) as UpdateNodeData;
  let node: BaseNode | null = null;

  if (cmd.id) {
    node = nodeRegistry.get(cmd.id) || null;
  }

  if (!node && d.nodeId) {
    node = figma.getNodeById(d.nodeId);
  }

  if (!node && d.name) {
    node = figma.currentPage.findOne(n => n.name === d.name);
  }

  if (!node) {
    throw new Error('Node not found: ' + (cmd.id || d.nodeId || d.name));
  }

  const sceneNode = node as SceneNode;

  if (d.x !== undefined && 'x' in sceneNode) sceneNode.x = d.x;
  if (d.y !== undefined && 'y' in sceneNode) sceneNode.y = d.y;

  if ((d.width !== undefined || d.height !== undefined) && 'resize' in sceneNode) {
    const w = d.width !== undefined ? d.width : sceneNode.width;
    const h = d.height !== undefined ? d.height : sceneNode.height;
    (sceneNode as LayoutMixin).resize(w, h);
  }

  if (d.newName) {
    sceneNode.name = d.newName;
  }

  if (d.fills && 'fills' in sceneNode) {
    (sceneNode as GeometryMixin).fills = d.fills.map(f => ({
      type: 'SOLID' as const,
      color: parseColor(f.color),
      opacity: defaultVal(f.opacity, 1)
    }));
  }

  if (d.cornerRadius !== undefined && 'cornerRadius' in sceneNode) {
    (sceneNode as RectangleNode).cornerRadius = d.cornerRadius;
  }

  if (d.visible !== undefined) {
    sceneNode.visible = d.visible;
  }

  if (d.opacity !== undefined && 'opacity' in sceneNode) {
    (sceneNode as BlendMixin).opacity = d.opacity;
  }

  if (d.strokes && 'strokes' in sceneNode) {
    (sceneNode as MinimalStrokesMixin).strokes = d.strokes.map(s => ({
      type: 'SOLID' as const,
      color: parseColor(s.color),
      opacity: defaultVal(s.opacity, 1)
    }));
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

  return node;
}

// ============ DELETE NODE ============
export function deleteNode(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as NodeRefData;
  let node: BaseNode | null = null;

  if (cmd.id) {
    node = nodeRegistry.get(cmd.id) || null;
    nodeRegistry.delete(cmd.id);
  }

  if (!node && d.nodeId) {
    node = figma.getNodeById(d.nodeId);
  }

  if (!node && d.name) {
    node = figma.currentPage.findOne(n => n.name === d.name);
  }

  if (!node) {
    throw new Error('Node not found: ' + (cmd.id || d.nodeId || d.name));
  }

  node.remove();
  return { success: true, data: { deleted: true } };
}

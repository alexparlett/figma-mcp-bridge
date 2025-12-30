/// <reference types="@figma/plugin-typings" />

/**
 * Boolean operation handlers for Figma MCP Bridge.
 */

import type { Command } from "../../types/commands.js";
import type { BooleanOperationData, NodeRefData } from "../../types/data.js";
import { nodeRegistry } from "../registry.js";
import { resolveNode, resolveNodes, registerNode } from "../utils.js";

// ============ BOOLEAN UNION ============

export async function booleanUnion(cmd: Command): Promise<BooleanOperationNode> {
  const d = (cmd.data || {}) as BooleanOperationData;

  if (!d.nodeIds || d.nodeIds.length < 2) {
    throw new Error('Boolean union requires at least 2 node IDs');
  }

  const nodes = resolveNodes(d.nodeIds);
  if (nodes.length < 2) {
    throw new Error('Boolean union requires at least 2 valid nodes');
  }

  const booleanNode = figma.union(nodes, figma.currentPage);

  if (d.id || cmd.id) {
    nodeRegistry.set(d.id || cmd.id!, booleanNode);
  }

  return booleanNode;
}

// ============ BOOLEAN SUBTRACT ============

export async function booleanSubtract(cmd: Command): Promise<BooleanOperationNode> {
  const d = (cmd.data || {}) as BooleanOperationData;

  if (!d.nodeIds || d.nodeIds.length < 2) {
    throw new Error('Boolean subtract requires at least 2 node IDs');
  }

  const nodes = resolveNodes(d.nodeIds);
  if (nodes.length < 2) {
    throw new Error('Boolean subtract requires at least 2 valid nodes');
  }

  const booleanNode = figma.subtract(nodes, figma.currentPage);

  if (d.id || cmd.id) {
    nodeRegistry.set(d.id || cmd.id!, booleanNode);
  }

  return booleanNode;
}

// ============ BOOLEAN INTERSECT ============

export async function booleanIntersect(cmd: Command): Promise<BooleanOperationNode> {
  const d = (cmd.data || {}) as BooleanOperationData;

  if (!d.nodeIds || d.nodeIds.length < 2) {
    throw new Error('Boolean intersect requires at least 2 node IDs');
  }

  const nodes = resolveNodes(d.nodeIds);
  if (nodes.length < 2) {
    throw new Error('Boolean intersect requires at least 2 valid nodes');
  }

  const booleanNode = figma.intersect(nodes, figma.currentPage);

  if (d.id || cmd.id) {
    nodeRegistry.set(d.id || cmd.id!, booleanNode);
  }

  return booleanNode;
}

// ============ BOOLEAN EXCLUDE ============

export async function booleanExclude(cmd: Command): Promise<BooleanOperationNode> {
  const d = (cmd.data || {}) as BooleanOperationData;

  if (!d.nodeIds || d.nodeIds.length < 2) {
    throw new Error('Boolean exclude requires at least 2 node IDs');
  }

  const nodes = resolveNodes(d.nodeIds);
  if (nodes.length < 2) {
    throw new Error('Boolean exclude requires at least 2 valid nodes');
  }

  const booleanNode = figma.exclude(nodes, figma.currentPage);

  if (d.id || cmd.id) {
    nodeRegistry.set(d.id || cmd.id!, booleanNode);
  }

  return booleanNode;
}

// ============ FLATTEN NODE ============

export async function flattenNode(cmd: Command): Promise<VectorNode> {
  const d = (cmd.data || {}) as NodeRefData;
  const nodeId = d.nodeId || d.name;

  if (!nodeId) {
    throw new Error('Node ID is required for flatten');
  }

  const node = resolveNode(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  const flattenedNode = figma.flatten([node], figma.currentPage);

  registerNode(cmd, flattenedNode);
  return flattenedNode;
}

// ============ GROUP NODES ============

export async function groupNodes(cmd: Command): Promise<GroupNode> {
  const d = (cmd.data || {}) as BooleanOperationData;

  if (!d.nodeIds || d.nodeIds.length === 0) {
    throw new Error('Group requires at least 1 node ID');
  }

  const nodes = resolveNodes(d.nodeIds);
  if (nodes.length === 0) {
    throw new Error('Group requires at least 1 valid node');
  }

  const groupNode = figma.group(nodes, figma.currentPage);

  if (d.id || cmd.id) {
    nodeRegistry.set(d.id || cmd.id!, groupNode);
  }

  return groupNode;
}

// ============ UNGROUP NODE ============

export async function ungroupNode(cmd: Command): Promise<SceneNode[]> {
  const d = (cmd.data || {}) as NodeRefData;
  const nodeId = d.nodeId || d.name;

  if (!nodeId) {
    throw new Error('Node ID is required for ungroup');
  }

  const node = resolveNode(nodeId);
  if (!node) {
    throw new Error(`Node not found: ${nodeId}`);
  }

  if (node.type !== 'GROUP') {
    throw new Error('Can only ungroup a GroupNode');
  }

  const groupNode = node as GroupNode;
  const parent = groupNode.parent;

  if (!parent || !('appendChild' in parent)) {
    throw new Error('Group has no valid parent');
  }

  // Get all children before ungrouping
  const children = [...groupNode.children];

  // Move children to parent
  for (const child of children) {
    parent.appendChild(child);
  }

  // Remove the empty group
  groupNode.remove();

  return children;
}

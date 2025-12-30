/// <reference types="@figma/plugin-typings" />

import type { Command, QueryData, FindNodesData, NodeRefData } from "../../types/commands.js";
import type { CommandResult } from "../../types/messages.js";
import type { SceneNode as SerializedSceneNode } from "../../types/nodes.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal, colorToHex } from "../utils.js";

// ============ HELPER: Serialize node to SceneNode ============
export function serializeNode(node: BaseNode, depth: number, maxDepth: number): SerializedSceneNode | null {
  if (!node) return null;

  const sceneNode = node as SceneNode;

  // Base properties all nodes have
  const base = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  // Helper to serialize children if within depth limit
  const serializeChildren = (): SerializedSceneNode[] | undefined => {
    if (!('children' in sceneNode) || depth >= maxDepth) return undefined;
    const children = (sceneNode as ChildrenMixin).children
      .map(child => serializeNode(child, depth + 1, maxDepth))
      .filter((c): c is SerializedSceneNode => c !== null);
    return children.length > 0 ? children : undefined;
  };

  // Copy all serializable properties from the Figma node
  // We spread the node and filter out non-serializable values
  const serializeProps = (figmaNode: SceneNode): Record<string, unknown> => {
    const props: Record<string, unknown> = {};

    for (const key of Object.keys(figmaNode)) {
      // Skip internal/non-serializable properties
      if (key === 'parent' || key === 'children' || key === 'removed' || key.startsWith('__')) {
        continue;
      }

      try {
        const value = (figmaNode as unknown as Record<string, unknown>)[key];

        // Skip functions and symbols
        if (typeof value === 'function' || typeof value === 'symbol') {
          continue;
        }

        // Skip undefined values
        if (value === undefined) {
          continue;
        }

        // Handle mixed values - just skip them or use a sensible default
        if (value === figma.mixed) {
          continue;
        }

        // Store the value
        props[key] = value;
      } catch {
        // Some properties may throw when accessed - skip them
        continue;
      }
    }

    return props;
  };

  const props = serializeProps(sceneNode);
  const children = serializeChildren();

  return {
    ...base,
    ...props,
    ...(children ? { children } : {}),
  } as SerializedSceneNode;
}

// ============ GET NODE BY NAME ============
export function getNodeByName(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as NodeRefData;
  const name = d.name;
  const node = figma.currentPage.findOne(n => n.name === name);

  if (!node) {
    throw new Error('Node not found with name: ' + name);
  }

  if (cmd.id) {
    nodeRegistry.set(cmd.id, node);
  } else if (name) {
    nodeRegistry.set(name, node);
  }

  const queryData = d as QueryData & NodeRefData;
  const maxDepth = defaultVal(queryData.depth, 3);
  return { success: true, node: serializeNode(node, 0, maxDepth) ?? undefined };
}

// ============ GET SELECTION ============
export function getSelection(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as QueryData;
  const selection = figma.currentPage.selection;
  const maxDepth = defaultVal(d.depth, 3);

  if (selection.length === 0) {
    return { success: true, nodes: [] };
  }

  const nodes = selection
    .map(node => {
      if (d.register) {
        nodeRegistry.set(node.name, node);
      }
      return serializeNode(node, 0, maxDepth);
    })
    .filter((n): n is SerializedSceneNode => n !== null);

  return { success: true, nodes };
}

// ============ GET PAGE NODES ============
export function getPageNodes(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as QueryData;
  const maxDepth = defaultVal(d.depth, 1);
  const filter = d.filter;

  const nodes = figma.currentPage.children
    .filter(node => !filter || node.type === filter)
    .map(node => serializeNode(node, 0, maxDepth))
    .filter((n): n is SerializedSceneNode => n !== null);

  return {
    success: true,
    nodes,
    data: { page: figma.currentPage.name }
  };
}

// ============ GET NODE BY ID ============
export function getNodeById(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as NodeRefData & QueryData;
  const nodeId = d.nodeId;
  const node = figma.getNodeById(nodeId!);

  if (!node) {
    throw new Error('Node not found with ID: ' + nodeId);
  }

  const maxDepth = defaultVal(d.depth, 3);

  if (cmd.id) {
    nodeRegistry.set(cmd.id, node);
  }

  return { success: true, node: serializeNode(node, 0, maxDepth) ?? undefined };
}

// ============ FIND NODES ============
export function findNodes(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as FindNodesData;
  const results: SerializedSceneNode[] = [];
  const maxResults = defaultVal(d.maxResults, 50);
  const maxDepth = defaultVal(d.depth, 1);
  const searchName = d.name;
  const filter = d.filter;
  const register = d.register;

  function searchNode(node: BaseNode) {
    if (results.length >= maxResults) return;

    let matches = true;

    if (searchName) {
      matches = node.name.toLowerCase().indexOf(searchName.toLowerCase()) !== -1;
    }

    if (filter && matches) {
      matches = node.type === filter;
    }

    if (matches) {
      const serialized = serializeNode(node, 0, maxDepth);
      if (serialized) {
        results.push(serialized);
      }

      if (register) {
        nodeRegistry.set(node.name + '_' + results.length, node);
      }
    }

    if ('children' in node) {
      (node as ChildrenMixin).children.forEach(searchNode);
    }
  }

  figma.currentPage.children.forEach(searchNode);

  return {
    success: true,
    nodes: results,
    data: { truncated: results.length >= maxResults }
  };
}

// ============ GET STYLES ============
export function getStyles(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as QueryData;
  const filter = d.filter;
  const result: Record<string, unknown> = {};

  if (!filter || filter === 'PAINT' || filter === 'ALL') {
    const paintStyles = figma.getLocalPaintStyles();
    result.colors = paintStyles.map(style => {
      const paint = style.paints[0];
      return {
        id: style.id,
        name: style.name,
        color: paint && paint.type === 'SOLID' ? colorToHex(paint.color) : null
      };
    });
  }

  if (!filter || filter === 'TEXT' || filter === 'ALL') {
    const textStyles = figma.getLocalTextStyles();
    result.textStyles = textStyles.map(style => ({
      id: style.id,
      name: style.name,
      fontFamily: style.fontName ? style.fontName.family : null,
      fontStyle: style.fontName ? style.fontName.style : null,
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing
    }));
  }

  if (!filter || filter === 'EFFECT' || filter === 'ALL') {
    const effectStyles = figma.getLocalEffectStyles();
    result.effects = effectStyles.map(style => ({
      id: style.id,
      name: style.name,
      effects: style.effects
    }));
  }

  return { success: true, data: result };
}

// ============ GET COMPONENTS ============
export function getComponents(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as QueryData;
  const components: SerializedSceneNode[] = [];
  const maxDepth = defaultVal(d.depth, 2);

  function findComponentsInNode(node: BaseNode) {
    if (node.type === 'COMPONENT') {
      const serialized = serializeNode(node, 0, maxDepth);
      if (serialized) {
        components.push(serialized);
      }
      nodeRegistry.set(node.name, node);
    }
    if ('children' in node) {
      (node as ChildrenMixin).children.forEach(findComponentsInNode);
    }
  }

  figma.currentPage.children.forEach(findComponentsInNode);

  return { success: true, nodes: components };
}

// ============ GET VARIABLES ============
export function getVariables(): CommandResult {
  const collections = figma.variables.getLocalVariableCollections();

  return {
    success: true,
    data: {
      collections: collections.map(collection => {
        const variables = collection.variableIds.map(varId => {
          const variable = figma.variables.getVariableById(varId);
          if (!variable) return null;

          const values: Record<string, unknown> = {};
          collection.modes.forEach(mode => {
            const value = variable.valuesByMode[mode.modeId];
            if (variable.resolvedType === 'COLOR' && value && typeof value === 'object' && 'r' in value) {
              values[mode.name] = colorToHex(value as RGB);
            } else {
              values[mode.name] = value;
            }
          });

          return {
            id: variable.id,
            name: variable.name,
            type: variable.resolvedType,
            values
          };
        }).filter(v => v !== null);

        return {
          id: collection.id,
          name: collection.name,
          modes: collection.modes.map(m => m.name),
          variables
        };
      })
    }
  };
}

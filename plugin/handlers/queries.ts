/// <reference types="@figma/plugin-typings" />

import type { Command, CommandResult, SerializedNode, QueryData, FindNodesData, NodeRefData } from "../../types/types.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal, colorToHex } from "../utils.js";

// ============ HELPER: Serialize node ============
export function serializeNode(node: BaseNode, depth: number, maxDepth: number): SerializedNode | null {
  if (!node) return null;

  const result: SerializedNode = {
    id: node.id,
    name: node.name,
    type: node.type
  };

  const sceneNode = node as SceneNode;

  if ('x' in sceneNode) result.x = sceneNode.x;
  if ('y' in sceneNode) result.y = sceneNode.y;
  if ('width' in sceneNode) result.width = sceneNode.width;
  if ('height' in sceneNode) result.height = sceneNode.height;

  if ('fills' in sceneNode) {
    const fills = (sceneNode as GeometryMixin).fills;
    if (fills && Array.isArray(fills) && fills.length > 0) {
      result.fills = fills.map(f => {
        if (f.type === 'SOLID') {
          return { type: 'SOLID', color: colorToHex(f.color), opacity: f.opacity };
        }
        return { type: f.type };
      });
    }
  }

  if ('strokes' in sceneNode) {
    const strokes = (sceneNode as MinimalStrokesMixin).strokes;
    if (strokes && strokes.length > 0) {
      result.strokes = strokes.map(s => {
        if (s.type === 'SOLID') {
          return { type: 'SOLID', color: colorToHex(s.color), opacity: s.opacity };
        }
        return { type: s.type };
      });
      result.strokeWeight = (sceneNode as MinimalStrokesMixin).strokeWeight as number;
      result.strokeAlign = (sceneNode as MinimalStrokesMixin).strokeAlign;
      const dashPattern = (sceneNode as MinimalStrokesMixin).dashPattern;
      if (dashPattern && dashPattern.length > 0) {
        result.dashPattern = dashPattern;
      }
    }
  }

  if ('cornerRadius' in sceneNode) {
    result.cornerRadius = (sceneNode as RectangleNode).cornerRadius as number;
  }

  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    result.characters = textNode.characters;
    result.fontSize = textNode.fontSize as number;
    if (textNode.fontName && textNode.fontName !== figma.mixed) {
      result.fontFamily = (textNode.fontName as FontName).family;
      result.fontStyle = (textNode.fontName as FontName).style;
    }
  }

  if ('layoutMode' in sceneNode) {
    const frameNode = sceneNode as FrameNode;
    if (frameNode.layoutMode !== 'NONE') {
      result.layoutMode = frameNode.layoutMode;
      result.itemSpacing = frameNode.itemSpacing;
      result.padding = {
        top: frameNode.paddingTop,
        right: frameNode.paddingRight,
        bottom: frameNode.paddingBottom,
        left: frameNode.paddingLeft
      };
      result.primaryAxisAlign = frameNode.primaryAxisAlignItems;
      result.counterAxisAlign = frameNode.counterAxisAlignItems;
    }
  }

  if (node.type === 'COMPONENT') {
    result.isComponent = true;
  }
  if (node.type === 'INSTANCE') {
    result.isInstance = true;
    const instanceNode = node as InstanceNode;
    if (instanceNode.mainComponent) {
      result.mainComponentId = instanceNode.mainComponent.id;
      result.mainComponentName = instanceNode.mainComponent.name;
    }
  }

  if ('children' in node && depth < maxDepth) {
    const childrenNode = node as ChildrenMixin;
    result.children = childrenNode.children
      .map(child => serializeNode(child, depth + 1, maxDepth))
      .filter((c): c is SerializedNode => c !== null);
  }

  return result;
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
  return { success: true, data: serializeNode(node, 0, maxDepth) as Record<string, unknown> };
}

// ============ GET SELECTION ============
export function getSelection(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as QueryData;
  const selection = figma.currentPage.selection;
  const maxDepth = defaultVal(d.depth, 3);

  if (selection.length === 0) {
    return { success: true, data: { selection: [], count: 0 } };
  }

  const nodes = selection.map(node => {
    if (d.register) {
      nodeRegistry.set(node.name, node);
    }
    return serializeNode(node, 0, maxDepth);
  });

  return { success: true, data: { selection: nodes, count: nodes.length } };
}

// ============ GET PAGE NODES ============
export function getPageNodes(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as QueryData;
  const maxDepth = defaultVal(d.depth, 1);
  const filter = d.filter;

  const nodes = figma.currentPage.children
    .filter(node => !filter || node.type === filter)
    .map(node => serializeNode(node, 0, maxDepth))
    .filter((n): n is SerializedNode => n !== null);

  return {
    success: true,
    data: {
      page: figma.currentPage.name,
      nodes,
      count: nodes.length
    }
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

  return { success: true, data: serializeNode(node, 0, maxDepth) as Record<string, unknown> };
}

// ============ FIND NODES ============
export function findNodes(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as FindNodesData;
  const results: SerializedNode[] = [];
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
    data: {
      results,
      count: results.length,
      truncated: results.length >= maxResults
    }
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
  const components: SerializedNode[] = [];
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

  return { success: true, data: { components, count: components.length } };
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

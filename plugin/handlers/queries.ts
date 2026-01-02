/// <reference types="@figma/plugin-typings" />

import type { Command, QueryData, FindNodesData, NodeRefData } from "../../types/commands.js";
import type { CommandResult } from "../../types/messages.js";
import type { SceneNode as SerializedSceneNode } from "../../types/nodes.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal, colorToHex } from "../utils.js";
import { SERIALIZABLE_PROPS } from "../../types/serializable-props.js";

// ============ SERIALIZATION OPTIONS ============

/** Properties returned in compact mode */
const COMPACT_PROPS = ['x', 'y', 'width', 'height', 'visible', 'locked'] as const;

/** Verbose properties excluded by default (large/rarely needed) */
const VERBOSE_PROPS = new Set([
  'absoluteTransform', 'relativeTransform', 'absoluteBoundingBox', 'absoluteRenderBounds',
  'reactions', 'exportSettings', 'vectorNetwork', 'vectorPaths',
  'componentPropertyDefinitions', 'componentProperties', 'overrides',
  'layoutGrids', 'guides', 'effects', 'fills', 'strokes',
]);

export interface SerializeOptions {
  /** Max depth to traverse children (default: 0) */
  maxDepth?: number;
  /** Compact mode - only essential properties */
  compact?: boolean;
  /** Specific fields to include (overrides other filters) */
  fields?: string[];
  /** Exclude verbose properties (default: true) */
  excludeVerbose?: boolean;
}

/** Extract serialization options from QueryData */
function getSerializeOptions(d: QueryData): SerializeOptions {
  return {
    maxDepth: defaultVal(d.depth, 0),
    compact: d.compact ?? true, // Default to compact mode
    fields: d.fields,
    excludeVerbose: d.excludeVerbose ?? true,
  };
}

// ============ HELPER: Serialize node to SceneNode ============
export function serializeNode(
  node: BaseNode,
  depth: number,
  opts: SerializeOptions
): SerializedSceneNode | null {
  if (!node) return null;

  const sceneNode = node as SceneNode;
  const maxDepth = opts.maxDepth ?? 0;

  // Base properties all nodes have
  const base: Record<string, unknown> = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  // Get child IDs (always) and full children (if depth allows and not compact)
  const getChildren = (): { childIds?: string[]; children?: SerializedSceneNode[] } => {
    if (!('children' in sceneNode)) return {};

    const childNodes = (sceneNode as ChildrenMixin).children;
    if (childNodes.length === 0) return {};

    // Always include child IDs for reference
    const childIds = childNodes.map(c => c.id);

    // Only serialize full children if within depth limit AND not compact mode
    if (depth < maxDepth && !opts.compact) {
      const children = childNodes
        .map(child => serializeNode(child, depth + 1, opts))
        .filter((c): c is SerializedSceneNode => c !== null);
      return { childIds, children: children.length > 0 ? children : undefined };
    }

    return { childIds };
  };

  // Determine which properties to serialize
  const getPropsToSerialize = (): readonly string[] => {
    // Explicit fields filter takes precedence
    if (opts.fields && opts.fields.length > 0) {
      return opts.fields;
    }
    // Compact mode: only essential properties
    if (opts.compact) {
      return COMPACT_PROPS;
    }
    // Normal mode: all props, optionally excluding verbose ones
    if (opts.excludeVerbose) {
      return SERIALIZABLE_PROPS.filter(p => !VERBOSE_PROPS.has(p));
    }
    return SERIALIZABLE_PROPS;
  };

  // Copy serializable properties from the Figma node
  const serializeProps = (figmaNode: SceneNode): Record<string, unknown> => {
    const props: Record<string, unknown> = {};
    const propsToSerialize = getPropsToSerialize();

    for (const key of propsToSerialize) {
      try {
        const value = (figmaNode as unknown as Record<string, unknown>)[key];

        if (value === undefined || value === null) continue;
        if (typeof value === 'function' || typeof value === 'symbol') continue;
        if (value === figma.mixed) continue;

        props[key] = value;
      } catch {
        // Property doesn't exist on this node type - skip
        continue;
      }
    }

    return props;
  };

  const props = serializeProps(sceneNode);
  const { childIds, children } = getChildren();

  return {
    ...base,
    ...props,
    ...(childIds ? { childIds } : {}),
    ...(children ? { children } : {}),
  } as SerializedSceneNode;
}

// ============ GET NODE BY NAME ============
export function getNodeByName(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as NodeRefData;
  const name = d.name;
  const allPages = d.allPages ?? false;

  let node: SceneNode | null = null;
  let foundOnPage: string | undefined;

  if (allPages) {
    // Search across all pages
    for (const page of figma.root.children) {
      node = page.findOne(n => n.name === name);
      if (node) {
        foundOnPage = page.name;
        break;
      }
    }
  } else {
    // Search current page only
    node = figma.currentPage.findOne(n => n.name === name);
  }

  if (!node) {
    throw new Error('Node not found with name: ' + name);
  }

  if (cmd.id) {
    nodeRegistry.set(cmd.id, node);
  } else if (name) {
    nodeRegistry.set(name, node);
  }

  const opts = getSerializeOptions(d);
  const result: CommandResult = { success: true, node: serializeNode(node, 0, opts) ?? undefined };
  if (foundOnPage) {
    result.data = { page: foundOnPage };
  }
  return result;
}

// ============ GET SELECTION ============
export function getSelection(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as QueryData;
  const selection = figma.currentPage.selection;
  const opts = getSerializeOptions(d);

  if (selection.length === 0) {
    return { success: true, nodes: [] };
  }

  const nodes = selection
    .map(node => {
      if (d.register) {
        nodeRegistry.set(node.name, node);
      }
      return serializeNode(node, 0, opts);
    })
    .filter((n): n is SerializedSceneNode => n !== null);

  return { success: true, nodes };
}

// ============ GET PAGE NODES ============
export function getPageNodes(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as QueryData;
  const opts = getSerializeOptions(d);
  const filter = d.filter;

  const nodes = figma.currentPage.children
    .filter(node => !filter || node.type === filter)
    .map(node => serializeNode(node, 0, opts))
    .filter((n): n is SerializedSceneNode => n !== null);

  return {
    success: true,
    nodes,
    data: { page: figma.currentPage.name }
  };
}

// ============ GET NODE BY ID ============
export function getNodeById(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as NodeRefData;
  const nodeId = d.nodeId;
  const node = figma.getNodeById(nodeId!);

  if (!node) {
    throw new Error('Node not found with ID: ' + nodeId);
  }

  const opts = getSerializeOptions(d);

  if (cmd.id) {
    nodeRegistry.set(cmd.id, node);
  }

  return { success: true, node: serializeNode(node, 0, opts) ?? undefined };
}

// ============ FIND NODES ============
export function findNodes(cmd: Command): CommandResult {
  const d = (cmd.data || {}) as FindNodesData;
  const results: Array<SerializedSceneNode & { page?: string }> = [];
  const maxResults = defaultVal(d.maxResults, 50);
  const opts = getSerializeOptions(d);
  const searchName = d.name;
  const filter = d.filter;
  const register = d.register;
  const allPages = d.allPages ?? false;

  function searchNode(node: BaseNode, pageName?: string) {
    if (results.length >= maxResults) return;

    let matches = true;

    if (searchName) {
      matches = node.name.toLowerCase().indexOf(searchName.toLowerCase()) !== -1;
    }

    if (filter && matches) {
      matches = node.type === filter;
    }

    if (matches) {
      const serialized = serializeNode(node, 0, opts);
      if (serialized) {
        if (pageName) {
          (serialized as SerializedSceneNode & { page?: string }).page = pageName;
        }
        results.push(serialized as SerializedSceneNode & { page?: string });
      }

      if (register) {
        nodeRegistry.set(node.name + '_' + results.length, node);
      }
    }

    if ('children' in node) {
      (node as ChildrenMixin).children.forEach(child => searchNode(child, pageName));
    }
  }

  if (allPages) {
    // Search across all pages
    for (const page of figma.root.children) {
      if (results.length >= maxResults) break;
      page.children.forEach(child => searchNode(child, page.name));
    }
  } else {
    // Search current page only
    figma.currentPage.children.forEach(child => searchNode(child));
  }

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
  const components: Array<SerializedSceneNode & { page?: string }> = [];
  const opts = getSerializeOptions(d);
  const allPages = d.allPages ?? false;

  function findComponentsInNode(node: BaseNode, pageName?: string) {
    if (node.type === 'COMPONENT') {
      const serialized = serializeNode(node, 0, opts);
      if (serialized) {
        if (pageName) {
          (serialized as SerializedSceneNode & { page?: string }).page = pageName;
        }
        components.push(serialized as SerializedSceneNode & { page?: string });
      }
      nodeRegistry.set(node.name, node);
    }
    if ('children' in node) {
      (node as ChildrenMixin).children.forEach(child => findComponentsInNode(child, pageName));
    }
  }

  if (allPages) {
    // Search across all pages
    for (const page of figma.root.children) {
      page.children.forEach(child => findComponentsInNode(child, page.name));
    }
  } else {
    // Search current page only
    figma.currentPage.children.forEach(child => findComponentsInNode(child));
  }

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

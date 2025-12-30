/// <reference types="@figma/plugin-typings" />

/**
 * Component creation handlers for Figma MCP Bridge.
 */

import type { Command } from "../../types/commands.js";
import type { CommandResult } from "../../types/messages.js";
import type { ComponentData, InstanceData, ImportComponentData } from "../../types/data.js";
import { nodeRegistry } from "../registry.js";
import {
  defaultVal,
  applyFills,
  applyStrokes,
  applyEffects,
  getParent,
  registerNode,
  parseColorInput,
} from "../utils.js";

// ============ CREATE COMPONENT ============

export async function createComponent(cmd: Command, parentNode?: SceneNode): Promise<ComponentNode> {
  const d = (cmd.data || {}) as ComponentData;
  const component = figma.createComponent();

  component.name = defaultVal(d.name, 'Component');
  component.x = defaultVal(d.x, 0);
  component.y = defaultVal(d.y, 0);
  component.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  // Corner radius
  if (d.cornerRadius !== undefined) component.cornerRadius = d.cornerRadius;
  if (d.topLeftRadius !== undefined) component.topLeftRadius = d.topLeftRadius;
  if (d.topRightRadius !== undefined) component.topRightRadius = d.topRightRadius;
  if (d.bottomLeftRadius !== undefined) component.bottomLeftRadius = d.bottomLeftRadius;
  if (d.bottomRightRadius !== undefined) component.bottomRightRadius = d.bottomRightRadius;
  if (d.cornerSmoothing !== undefined) component.cornerSmoothing = d.cornerSmoothing;

  // Auto-layout
  const hasLayout = d.layoutMode || d.direction || d.gap !== undefined || d.padding !== undefined || d.layout;

  if (hasLayout) {
    const layoutConfig = d.layout || {};
    component.layoutMode = d.layoutMode || d.direction || layoutConfig.direction || 'VERTICAL';
    component.primaryAxisSizingMode = d.primaryAxisSizingMode || layoutConfig.primarySizing || 'AUTO';
    component.counterAxisSizingMode = d.counterAxisSizingMode || layoutConfig.counterSizing || 'AUTO';
    component.itemSpacing = d.itemSpacing ?? d.gap ?? layoutConfig.gap ?? 0;

    const basePadding = d.padding ?? layoutConfig.padding ?? 0;
    component.paddingTop = d.paddingTop ?? layoutConfig.paddingTop ?? basePadding;
    component.paddingRight = d.paddingRight ?? layoutConfig.paddingRight ?? basePadding;
    component.paddingBottom = d.paddingBottom ?? layoutConfig.paddingBottom ?? basePadding;
    component.paddingLeft = d.paddingLeft ?? layoutConfig.paddingLeft ?? basePadding;

    if (d.primaryAxisAlignItems || d.align || layoutConfig.primaryAlign) {
      component.primaryAxisAlignItems = d.primaryAxisAlignItems || d.align || layoutConfig.primaryAlign || 'MIN';
    }
    if (d.counterAxisAlignItems || d.counterAlign || layoutConfig.counterAlign) {
      component.counterAxisAlignItems = d.counterAxisAlignItems || d.counterAlign || layoutConfig.counterAlign || 'MIN';
    }
  }

  // Clipping
  if (d.clipsContent !== undefined) component.clipsContent = d.clipsContent;

  // Fills, strokes, effects
  await applyFills(component, d);
  await applyStrokes(component, d);
  await applyEffects(component, d);

  // Blend mode and opacity
  if (d.blendMode) component.blendMode = d.blendMode;
  if (d.opacity !== undefined) component.opacity = d.opacity;
  if (d.visible !== undefined) component.visible = d.visible;
  if (d.locked !== undefined) component.locked = d.locked;
  if (d.rotation !== undefined) component.rotation = d.rotation;

  // Description and documentation
  if (d.description) component.description = d.description;
  if (d.documentationLinks) component.documentationLinks = d.documentationLinks;

  // Parent
  const parent = getParent(d, parentNode);
  if (parent) parent.appendChild(component);

  registerNode(cmd, component);
  return component;
}

// ============ CREATE INSTANCE ============

export async function createInstance(cmd: Command, parentNode?: SceneNode): Promise<InstanceNode> {
  const d = (cmd.data || {}) as InstanceData;

  // Find the component
  const component = nodeRegistry.get(d.componentId) as ComponentNode;
  if (!component || component.type !== 'COMPONENT') {
    throw new Error('Component not found: ' + d.componentId);
  }

  const instance = component.createInstance();
  instance.name = defaultVal(d.name, instance.name);
  instance.x = defaultVal(d.x, 0);
  instance.y = defaultVal(d.y, 0);

  // Resize if specified
  if (d.width !== undefined && d.height !== undefined) {
    instance.resize(d.width, d.height);
  }

  // Apply overrides
  if (d.overrides) {
    for (const [childName, overrideProps] of Object.entries(d.overrides)) {
      const childNode = instance.findOne(n => n.name === childName);
      if (!childNode) continue;

      // Text override
      if ((overrideProps.text || overrideProps.characters) && childNode.type === 'TEXT') {
        const textNode = childNode as TextNode;
        const fontName = textNode.fontName;
        if (fontName && fontName !== figma.mixed) {
          try {
            await figma.loadFontAsync(fontName as FontName);
          } catch {
            await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
            textNode.fontName = { family: 'Inter', style: 'Regular' };
          }
          textNode.characters = overrideProps.text || overrideProps.characters || '';
        }
      }

      // Fill override
      if ((overrideProps.fill || overrideProps.fills) && 'fills' in childNode) {
        if (overrideProps.fills) {
          (childNode as GeometryMixin).fills = overrideProps.fills.map(f => {
            if (!f.type || f.type === 'SOLID') {
              return {
                type: 'SOLID' as const,
                color: parseColorInput((f as { color: string }).color),
                opacity: (f as { opacity?: number }).opacity ?? 1,
                blendMode: 'NORMAL' as const
              };
            }
            return f as Paint;
          });
        } else if (overrideProps.fill) {
          (childNode as GeometryMixin).fills = [{
            type: 'SOLID',
            color: parseColorInput(overrideProps.fill),
            opacity: 1,
            blendMode: 'NORMAL'
          }];
        }
      }

      // Visibility override
      if (overrideProps.visible !== undefined) {
        childNode.visible = overrideProps.visible;
      }

      // Opacity override
      if (overrideProps.opacity !== undefined && 'opacity' in childNode) {
        (childNode as BlendMixin).opacity = overrideProps.opacity;
      }
    }
  }

  // Blend mode and opacity
  if (d.blendMode) instance.blendMode = d.blendMode;
  if (d.opacity !== undefined) instance.opacity = d.opacity;
  if (d.visible !== undefined) instance.visible = d.visible;
  if (d.locked !== undefined) instance.locked = d.locked;
  if (d.rotation !== undefined) instance.rotation = d.rotation;

  // Parent
  const parent = getParent(d, parentNode);
  if (parent) parent.appendChild(instance);

  registerNode(cmd, instance);
  return instance;
}

// ============ IMPORT COMPONENT ============

export async function importComponent(cmd: Command): Promise<CommandResult> {
  const d = (cmd.data || {}) as ImportComponentData;

  if (!d.key) {
    throw new Error('Component key is required');
  }

  const component = await figma.importComponentByKeyAsync(d.key);

  if (!component) {
    throw new Error('Component not found with key: ' + d.key);
  }

  // Register with the provided id or use the component key
  const registryId = cmd.id || d.key;
  nodeRegistry.set(registryId, component);

  return {
    success: true,
    nodeId: component.id,
    data: {
      name: component.name,
      key: component.key,
      registryId: registryId
    }
  };
}

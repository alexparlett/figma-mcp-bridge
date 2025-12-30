/// <reference types="@figma/plugin-typings" />

import type { Command, ComponentData, InstanceData } from "../../types/types.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal, applyFills, applyStroke, solidPaint, getParentNode } from "../utils.js";

// ============ COMPONENT ============
export function createComponent(cmd: Command, _parentNode?: SceneNode): ComponentNode {
  const d = (cmd.data || {}) as ComponentData;
  const component = figma.createComponent();

  component.name = defaultVal(d.name, 'Component');
  component.x = defaultVal(d.x, 0);
  component.y = defaultVal(d.y, 0);
  component.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  // Shorthand: fill -> fills
  if (d.fill && !d.fills) {
    applyFills(component, [{ color: d.fill }]);
  } else if (d.fills) {
    applyFills(component, d.fills);
  }

  if (d.cornerRadius !== undefined) {
    component.cornerRadius = d.cornerRadius;
  }

  // Stroke support
  if (d.stroke) {
    applyStroke(component, d.stroke);
  }

  // Auto-layout
  const hasLayout = d.layout || d.direction || d.gap !== undefined || d.padding !== undefined;
  const hasChildren = cmd.children && cmd.children.length > 0;

  if (hasLayout || hasChildren) {
    const layoutConfig = d.layout || {};
    const layoutDirection = d.direction || layoutConfig.direction || 'VERTICAL';
    const gap = d.gap !== undefined ? d.gap : layoutConfig.gap;
    const padding = d.padding !== undefined ? d.padding : layoutConfig.padding;

    component.layoutMode = layoutDirection;
    component.primaryAxisSizingMode = defaultVal(layoutConfig.primarySizing, 'AUTO');
    component.counterAxisSizingMode = defaultVal(layoutConfig.counterSizing, 'AUTO');
    component.itemSpacing = defaultVal(gap, 0);

    const basePadding = defaultVal(padding, 0);
    component.paddingTop = defaultVal(d.paddingTop, defaultVal(layoutConfig.paddingTop, basePadding));
    component.paddingRight = defaultVal(d.paddingRight, defaultVal(layoutConfig.paddingRight, basePadding));
    component.paddingBottom = defaultVal(d.paddingBottom, defaultVal(layoutConfig.paddingBottom, basePadding));
    component.paddingLeft = defaultVal(d.paddingLeft, defaultVal(layoutConfig.paddingLeft, basePadding));

    const align = d.align || layoutConfig.primaryAlign;
    const counterAlign = d.counterAlign || layoutConfig.counterAlign;
    if (align) {
      component.primaryAxisAlignItems = align;
    }
    if (counterAlign) {
      component.counterAxisAlignItems = counterAlign;
    }
  }

  const parent = getParentNode(d as Record<string, unknown>, _parentNode);
  if (parent) {
    parent.appendChild(component);
  }

  if (cmd.id) nodeRegistry.set(cmd.id, component);
  return component;
}

// ============ INSTANCE ============
export function createInstance(cmd: Command, _parentNode?: SceneNode): Promise<InstanceNode> {
  const d = (cmd.data || {}) as InstanceData;

  return new Promise((resolve, reject) => {
    const componentId = d.componentId;
    const component = nodeRegistry.get(componentId) as ComponentNode;
    if (!component || component.type !== 'COMPONENT') {
      reject(new Error('Component not found: ' + componentId));
      return;
    }

    const instance = component.createInstance();
    instance.name = defaultVal(d.name, instance.name);
    instance.x = defaultVal(d.x, 0);
    instance.y = defaultVal(d.y, 0);

    const parent = getParentNode(d as Record<string, unknown>, _parentNode);
    if (parent) {
      parent.appendChild(instance);
    }

    if (cmd.id) nodeRegistry.set(cmd.id, instance);

    // Apply overrides
    if (d.overrides) {
      const overrideKeys = Object.keys(d.overrides);
      const textOverrides: { node: TextNode; text: string }[] = [];

      for (const childName of overrideKeys) {
        const overrideProps = d.overrides[childName];
        const childNode = instance.findOne(n => n.name === childName);

        if (childNode) {
          if (overrideProps.text !== undefined && childNode.type === 'TEXT') {
            textOverrides.push({ node: childNode as TextNode, text: overrideProps.text });
          }
          if (overrideProps.fill && 'fills' in childNode) {
            (childNode as GeometryMixin).fills = solidPaint(overrideProps.fill);
          }
          if (overrideProps.visible !== undefined) {
            childNode.visible = overrideProps.visible;
          }
        }
      }

      if (textOverrides.length > 0) {
        let processed = 0;
        textOverrides.forEach(override => {
          const fontName = override.node.fontName;
          if (fontName && fontName !== figma.mixed) {
            figma.loadFontAsync(fontName as FontName).then(() => {
              override.node.characters = override.text;
              processed++;
              if (processed === textOverrides.length) {
                resolve(instance);
              }
            }).catch(() => {
              figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
                override.node.fontName = { family: 'Inter', style: 'Regular' };
                override.node.characters = override.text;
                processed++;
                if (processed === textOverrides.length) {
                  resolve(instance);
                }
              }).catch(() => {
                processed++;
                if (processed === textOverrides.length) {
                  resolve(instance);
                }
              });
            });
          } else {
            processed++;
            if (processed === textOverrides.length) {
              resolve(instance);
            }
          }
        });
      } else {
        resolve(instance);
      }
    } else {
      resolve(instance);
    }
  });
}

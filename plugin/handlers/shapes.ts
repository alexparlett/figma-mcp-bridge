/// <reference types="@figma/plugin-typings" />

import type { Command, FrameData, RectangleData, EllipseData, LineData, GroupData } from "../../types/types.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal, applyFills, applyStroke, solidPaint, getParentNode } from "../utils.js";

// ============ FRAME ============
export function createFrame(cmd: Command, _parentNode?: SceneNode): FrameNode {
  const d = (cmd.data || {}) as FrameData;
  const frame = figma.createFrame();

  frame.name = defaultVal(d.name, 'Frame');
  frame.x = defaultVal(d.x, 0);
  frame.y = defaultVal(d.y, 0);
  frame.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  // Shorthand: fill -> fills
  if (d.fill && !d.fills) {
    applyFills(frame, [{ color: d.fill }]);
  } else if (d.fills) {
    applyFills(frame, d.fills);
  }

  if (d.cornerRadius !== undefined) {
    frame.cornerRadius = d.cornerRadius;
  }

  // Stroke support
  if (d.stroke) {
    applyStroke(frame, d.stroke);
  }

  // Auto-layout
  const hasLayout = d.layout || d.direction || d.gap !== undefined || d.padding !== undefined;
  const hasChildren = cmd.children && cmd.children.length > 0;

  if (hasLayout || hasChildren) {
    const layoutConfig = d.layout || {};
    const layoutDirection = d.direction || layoutConfig.direction || 'VERTICAL';
    const gap = d.gap !== undefined ? d.gap : layoutConfig.gap;
    const padding = d.padding !== undefined ? d.padding : layoutConfig.padding;

    frame.layoutMode = layoutDirection;
    frame.primaryAxisSizingMode = defaultVal(layoutConfig.primarySizing, 'AUTO');
    frame.counterAxisSizingMode = defaultVal(layoutConfig.counterSizing, 'AUTO');
    frame.itemSpacing = defaultVal(gap, 0);

    const basePadding = defaultVal(padding, 0);
    frame.paddingTop = defaultVal(d.paddingTop, defaultVal(layoutConfig.paddingTop, basePadding));
    frame.paddingRight = defaultVal(d.paddingRight, defaultVal(layoutConfig.paddingRight, basePadding));
    frame.paddingBottom = defaultVal(d.paddingBottom, defaultVal(layoutConfig.paddingBottom, basePadding));
    frame.paddingLeft = defaultVal(d.paddingLeft, defaultVal(layoutConfig.paddingLeft, basePadding));

    const align = d.align || layoutConfig.primaryAlign;
    const counterAlign = d.counterAlign || layoutConfig.counterAlign;
    if (align) {
      frame.primaryAxisAlignItems = align;
    }
    if (counterAlign) {
      frame.counterAxisAlignItems = counterAlign;
    }
  }

  if (d.clipsContent !== undefined) {
    frame.clipsContent = d.clipsContent;
  }

  // Parent
  const parent = getParentNode(d as Record<string, unknown>, _parentNode);
  if (parent) {
    parent.appendChild(frame);
  }

  if (cmd.id) nodeRegistry.set(cmd.id, frame);
  return frame;
}

// ============ RECTANGLE ============
export function createRectangle(cmd: Command, _parentNode?: SceneNode): RectangleNode {
  const d = (cmd.data || {}) as RectangleData;
  const rect = figma.createRectangle();

  rect.name = defaultVal(d.name, 'Rectangle');
  rect.x = defaultVal(d.x, 0);
  rect.y = defaultVal(d.y, 0);
  rect.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  if (d.fills) {
    applyFills(rect, d.fills);
  } else if (d.fillColor || d.fill) {
    rect.fills = solidPaint((d.fillColor || d.fill)!);
  }

  if (d.cornerRadius !== undefined) {
    rect.cornerRadius = d.cornerRadius;
  }

  if (d.stroke) {
    applyStroke(rect, d.stroke);
  } else if (d.strokeColor) {
    applyStroke(rect, { color: d.strokeColor, weight: d.strokeWeight || 1 });
  }

  const parent = getParentNode(d as Record<string, unknown>, _parentNode);
  if (parent) {
    parent.appendChild(rect);
  }

  if (cmd.id) nodeRegistry.set(cmd.id, rect);
  return rect;
}

// ============ ELLIPSE ============
export function createEllipse(cmd: Command, _parentNode?: SceneNode): EllipseNode {
  const d = (cmd.data || {}) as EllipseData;
  const ellipse = figma.createEllipse();

  ellipse.name = defaultVal(d.name, 'Ellipse');
  ellipse.x = defaultVal(d.x, 0);
  ellipse.y = defaultVal(d.y, 0);
  ellipse.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  if (d.fills) {
    applyFills(ellipse, d.fills);
  } else if (d.fillColor || d.fill) {
    ellipse.fills = solidPaint((d.fillColor || d.fill)!);
  }

  if (d.stroke) {
    applyStroke(ellipse, d.stroke);
  } else if (d.strokeColor) {
    applyStroke(ellipse, { color: d.strokeColor, weight: d.strokeWeight || 1 });
  }

  const parent = getParentNode(d as Record<string, unknown>, _parentNode);
  if (parent) {
    parent.appendChild(ellipse);
  }

  if (cmd.id) nodeRegistry.set(cmd.id, ellipse);
  return ellipse;
}

// ============ LINE ============
export function createLine(cmd: Command, _parentNode?: SceneNode): LineNode {
  const d = (cmd.data || {}) as LineData;
  const line = figma.createLine();

  line.name = defaultVal(d.name, 'Line');
  line.x = defaultVal(d.x, 0);
  line.y = defaultVal(d.y, 0);

  const length = defaultVal(d.length, 100);
  line.resize(length, 0);

  if (d.rotation) {
    line.rotation = d.rotation;
  }

  if (d.color) {
    line.strokes = solidPaint(d.color);
  }
  line.strokeWeight = defaultVal(d.weight, 1);

  if (d.dashPattern) {
    line.dashPattern = d.dashPattern;
  }

  const parent = getParentNode(d as Record<string, unknown>, _parentNode);
  if (parent) {
    parent.appendChild(line);
  }

  if (cmd.id) nodeRegistry.set(cmd.id, line);
  return line;
}

// ============ GROUP ============
export function createGroup(cmd: Command): FrameNode {
  const d = (cmd.data || {}) as GroupData;
  const frame = figma.createFrame();

  frame.name = defaultVal(d.name, 'Group');
  frame.x = defaultVal(d.x, 0);
  frame.y = defaultVal(d.y, 0);

  if (cmd.id) nodeRegistry.set(cmd.id, frame);
  return frame;
}

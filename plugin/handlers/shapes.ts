/// <reference types="@figma/plugin-typings" />

/**
 * Shape creation handlers for Figma MCP Bridge.
 */

import type { Command } from "../../types/commands.js";
import type {
  FrameData,
  RectangleData,
  EllipseData,
  PolygonData,
  StarData,
  LineData,
  VectorData,
  SectionData,
  SliceData,
  SvgImportData,
  GroupData,
} from "../../types/data.js";
import {
  defaultVal,
  applyFills,
  applyStrokes,
  applyEffects,
  getParent,
  registerNode,
  parseColorInput,
} from "../utils.js";

// ============ FRAME ============

export async function createFrame(cmd: Command): Promise<FrameNode> {
  const d = (cmd.data || {}) as FrameData;
  const frame = figma.createFrame();

  frame.name = defaultVal(d.name, 'Frame');
  frame.x = defaultVal(d.x, 0);
  frame.y = defaultVal(d.y, 0);
  frame.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  // Corner radius
  if (d.cornerRadius !== undefined) frame.cornerRadius = d.cornerRadius;
  if (d.topLeftRadius !== undefined) frame.topLeftRadius = d.topLeftRadius;
  if (d.topRightRadius !== undefined) frame.topRightRadius = d.topRightRadius;
  if (d.bottomLeftRadius !== undefined) frame.bottomLeftRadius = d.bottomLeftRadius;
  if (d.bottomRightRadius !== undefined) frame.bottomRightRadius = d.bottomRightRadius;
  if (d.cornerSmoothing !== undefined) frame.cornerSmoothing = d.cornerSmoothing;

  // Auto-layout
  const hasLayout = d.layoutMode || d.direction || d.gap !== undefined || d.padding !== undefined || d.layout;

  if (hasLayout) {
    const layoutConfig = d.layout || {};
    frame.layoutMode = d.layoutMode || d.direction || layoutConfig.direction || 'VERTICAL';
    frame.primaryAxisSizingMode = d.primaryAxisSizingMode || layoutConfig.primarySizing || 'AUTO';
    frame.counterAxisSizingMode = d.counterAxisSizingMode || layoutConfig.counterSizing || 'AUTO';
    frame.itemSpacing = d.itemSpacing ?? d.gap ?? layoutConfig.gap ?? 0;

    const basePadding = d.padding ?? layoutConfig.padding ?? 0;
    frame.paddingTop = d.paddingTop ?? layoutConfig.paddingTop ?? basePadding;
    frame.paddingRight = d.paddingRight ?? layoutConfig.paddingRight ?? basePadding;
    frame.paddingBottom = d.paddingBottom ?? layoutConfig.paddingBottom ?? basePadding;
    frame.paddingLeft = d.paddingLeft ?? layoutConfig.paddingLeft ?? basePadding;

    if (d.primaryAxisAlignItems || d.align || layoutConfig.primaryAlign) {
      frame.primaryAxisAlignItems = d.primaryAxisAlignItems || d.align || layoutConfig.primaryAlign || 'MIN';
    }
    if (d.counterAxisAlignItems || d.counterAlign || layoutConfig.counterAlign) {
      frame.counterAxisAlignItems = d.counterAxisAlignItems || d.counterAlign || layoutConfig.counterAlign || 'MIN';
    }
    if (d.layoutWrap || d.wrap) {
      frame.layoutWrap = d.layoutWrap || d.wrap || 'NO_WRAP';
    }
    if (d.counterAxisSpacing !== undefined) {
      frame.counterAxisSpacing = d.counterAxisSpacing;
    }
    if (d.itemReverseZIndex !== undefined) {
      frame.itemReverseZIndex = d.itemReverseZIndex;
    }
    if (d.strokesIncludedInLayout !== undefined) {
      frame.strokesIncludedInLayout = d.strokesIncludedInLayout;
    }
  }

  // Clipping
  if (d.clipsContent !== undefined) frame.clipsContent = d.clipsContent;

  // Fills, strokes, effects
  await applyFills(frame, d);
  await applyStrokes(frame, d);
  await applyEffects(frame, d);

  // Blend mode and opacity
  if (d.blendMode) frame.blendMode = d.blendMode;
  if (d.opacity !== undefined) frame.opacity = d.opacity;
  if (d.visible !== undefined) frame.visible = d.visible;
  if (d.locked !== undefined) frame.locked = d.locked;
  if (d.rotation !== undefined) frame.rotation = d.rotation;

  // Constraints
  if (d.constraints) {
    frame.constraints = d.constraints;
  }

  // Parent
  const parent = getParent(d);
  if (parent) parent.appendChild(frame);

  registerNode(cmd, frame);
  return frame;
}

// ============ RECTANGLE ============

export async function createRectangle(cmd: Command): Promise<RectangleNode> {
  const d = (cmd.data || {}) as RectangleData;
  const rect = figma.createRectangle();

  rect.name = defaultVal(d.name, 'Rectangle');
  rect.x = defaultVal(d.x, 0);
  rect.y = defaultVal(d.y, 0);
  rect.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  // Corner radius
  if (d.cornerRadius !== undefined) rect.cornerRadius = d.cornerRadius;
  if (d.topLeftRadius !== undefined) rect.topLeftRadius = d.topLeftRadius;
  if (d.topRightRadius !== undefined) rect.topRightRadius = d.topRightRadius;
  if (d.bottomLeftRadius !== undefined) rect.bottomLeftRadius = d.bottomLeftRadius;
  if (d.bottomRightRadius !== undefined) rect.bottomRightRadius = d.bottomRightRadius;
  if (d.cornerSmoothing !== undefined) rect.cornerSmoothing = d.cornerSmoothing;

  // Fills, strokes, effects
  await applyFills(rect, d);
  await applyStrokes(rect, d);
  await applyEffects(rect, d);

  // Blend mode and opacity
  if (d.blendMode) rect.blendMode = d.blendMode;
  if (d.opacity !== undefined) rect.opacity = d.opacity;
  if (d.visible !== undefined) rect.visible = d.visible;
  if (d.locked !== undefined) rect.locked = d.locked;
  if (d.rotation !== undefined) rect.rotation = d.rotation;

  // Constraints
  if (d.constraints) {
    rect.constraints = d.constraints;
  }

  // Parent
  const parent = getParent(d);
  if (parent) parent.appendChild(rect);

  registerNode(cmd, rect);
  return rect;
}

// ============ ELLIPSE ============

export async function createEllipse(cmd: Command): Promise<EllipseNode> {
  const d = (cmd.data || {}) as EllipseData;
  const ellipse = figma.createEllipse();

  ellipse.name = defaultVal(d.name, 'Ellipse');
  ellipse.x = defaultVal(d.x, 0);
  ellipse.y = defaultVal(d.y, 0);
  ellipse.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  // Arc data
  if (d.arcData) {
    ellipse.arcData = d.arcData;
  }

  // Corner radius
  if (d.cornerRadius !== undefined) ellipse.cornerRadius = d.cornerRadius;
  if (d.cornerSmoothing !== undefined) ellipse.cornerSmoothing = d.cornerSmoothing;

  // Fills, strokes, effects
  await applyFills(ellipse, d);
  await applyStrokes(ellipse, d);
  await applyEffects(ellipse, d);

  // Blend mode and opacity
  if (d.blendMode) ellipse.blendMode = d.blendMode;
  if (d.opacity !== undefined) ellipse.opacity = d.opacity;
  if (d.visible !== undefined) ellipse.visible = d.visible;
  if (d.locked !== undefined) ellipse.locked = d.locked;
  if (d.rotation !== undefined) ellipse.rotation = d.rotation;

  // Constraints
  if (d.constraints) {
    ellipse.constraints = d.constraints;
  }

  // Parent
  const parent = getParent(d);
  if (parent) parent.appendChild(ellipse);

  registerNode(cmd, ellipse);
  return ellipse;
}

// ============ POLYGON ============

export async function createPolygon(cmd: Command): Promise<PolygonNode> {
  const d = (cmd.data || {}) as PolygonData;
  const polygon = figma.createPolygon();

  polygon.name = defaultVal(d.name, 'Polygon');
  polygon.x = defaultVal(d.x, 0);
  polygon.y = defaultVal(d.y, 0);
  polygon.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  // Point count
  polygon.pointCount = defaultVal(d.pointCount, 6);

  // Corner radius
  if (d.cornerRadius !== undefined) polygon.cornerRadius = d.cornerRadius;
  if (d.cornerSmoothing !== undefined) polygon.cornerSmoothing = d.cornerSmoothing;

  // Fills, strokes, effects
  await applyFills(polygon, d);
  await applyStrokes(polygon, d);
  await applyEffects(polygon, d);

  // Blend mode and opacity
  if (d.blendMode) polygon.blendMode = d.blendMode;
  if (d.opacity !== undefined) polygon.opacity = d.opacity;
  if (d.visible !== undefined) polygon.visible = d.visible;
  if (d.locked !== undefined) polygon.locked = d.locked;
  if (d.rotation !== undefined) polygon.rotation = d.rotation;

  // Constraints
  if (d.constraints) {
    polygon.constraints = d.constraints;
  }

  // Parent
  const parent = getParent(d);
  if (parent) parent.appendChild(polygon);

  registerNode(cmd, polygon);
  return polygon;
}

// ============ STAR ============

export async function createStar(cmd: Command): Promise<StarNode> {
  const d = (cmd.data || {}) as StarData;
  const star = figma.createStar();

  star.name = defaultVal(d.name, 'Star');
  star.x = defaultVal(d.x, 0);
  star.y = defaultVal(d.y, 0);
  star.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  // Point count and inner radius
  star.pointCount = defaultVal(d.pointCount, 5);
  star.innerRadius = defaultVal(d.innerRadius, 0.38);

  // Corner radius
  if (d.cornerRadius !== undefined) star.cornerRadius = d.cornerRadius;
  if (d.cornerSmoothing !== undefined) star.cornerSmoothing = d.cornerSmoothing;

  // Fills, strokes, effects
  await applyFills(star, d);
  await applyStrokes(star, d);
  await applyEffects(star, d);

  // Blend mode and opacity
  if (d.blendMode) star.blendMode = d.blendMode;
  if (d.opacity !== undefined) star.opacity = d.opacity;
  if (d.visible !== undefined) star.visible = d.visible;
  if (d.locked !== undefined) star.locked = d.locked;
  if (d.rotation !== undefined) star.rotation = d.rotation;

  // Constraints
  if (d.constraints) {
    star.constraints = d.constraints;
  }

  // Parent
  const parent = getParent(d);
  if (parent) parent.appendChild(star);

  registerNode(cmd, star);
  return star;
}

// ============ LINE ============

export async function createLine(cmd: Command): Promise<LineNode> {
  const d = (cmd.data || {}) as LineData;
  const line = figma.createLine();

  line.name = defaultVal(d.name, 'Line');
  line.x = defaultVal(d.x, 0);
  line.y = defaultVal(d.y, 0);
  line.resize(defaultVal(d.length ?? d.width, 100), 0);

  // Rotation
  if (d.rotation !== undefined) line.rotation = d.rotation;

  // Stroke (lines use stroke instead of fill)
  if (d.color) {
    line.strokes = [{
      type: 'SOLID',
      color: parseColorInput(d.color),
      opacity: 1,
      blendMode: 'NORMAL'
    }];
  } else {
    await applyStrokes(line, d);
  }

  // Stroke weight
  line.strokeWeight = d.weight ?? d.strokeWeight ?? 1;

  // Dash pattern
  if (d.dashPattern) line.dashPattern = d.dashPattern;

  // Blend mode and opacity
  if (d.blendMode) line.blendMode = d.blendMode;
  if (d.opacity !== undefined) line.opacity = d.opacity;
  if (d.visible !== undefined) line.visible = d.visible;
  if (d.locked !== undefined) line.locked = d.locked;

  // Constraints
  if (d.constraints) {
    line.constraints = d.constraints;
  }

  // Parent
  const parent = getParent(d);
  if (parent) parent.appendChild(line);

  registerNode(cmd, line);
  return line;
}

// ============ VECTOR ============

export async function createVector(cmd: Command): Promise<VectorNode> {
  const d = (cmd.data || {}) as VectorData;
  const vector = figma.createVector();

  vector.name = defaultVal(d.name, 'Vector');
  vector.x = defaultVal(d.x, 0);
  vector.y = defaultVal(d.y, 0);

  if (d.width !== undefined && d.height !== undefined) {
    vector.resize(d.width, d.height);
  }

  // Vector paths
  if (d.vectorPaths && d.vectorPaths.length > 0) {
    vector.vectorPaths = d.vectorPaths.map(path => ({
      windingRule: path.windingRule as 'NONZERO' | 'EVENODD',
      data: path.data
    }));
  }

  // Vector network
  if (d.vectorNetwork) {
    vector.vectorNetwork = {
      vertices: d.vectorNetwork.vertices.map(v => ({
        x: v.x,
        y: v.y,
        strokeCap: v.strokeCap as StrokeCap | undefined,
        cornerRadius: v.cornerRadius
      })),
      segments: d.vectorNetwork.segments.map(s => ({
        start: s.start,
        end: s.end,
        tangentStart: s.tangentStart,
        tangentEnd: s.tangentEnd
      })),
      regions: []
    };
  }

  // Corner radius
  if (d.cornerRadius !== undefined) vector.cornerRadius = d.cornerRadius;
  if (d.cornerSmoothing !== undefined) vector.cornerSmoothing = d.cornerSmoothing;

  // Fills, strokes, effects
  await applyFills(vector, d);
  await applyStrokes(vector, d);
  await applyEffects(vector, d);

  // Blend mode and opacity
  if (d.blendMode) vector.blendMode = d.blendMode;
  if (d.opacity !== undefined) vector.opacity = d.opacity;
  if (d.visible !== undefined) vector.visible = d.visible;
  if (d.locked !== undefined) vector.locked = d.locked;
  if (d.rotation !== undefined) vector.rotation = d.rotation;

  // Constraints
  if (d.constraints) {
    vector.constraints = d.constraints;
  }

  // Parent
  const parent = getParent(d);
  if (parent) parent.appendChild(vector);

  registerNode(cmd, vector);
  return vector;
}

// ============ SECTION ============

export async function createSection(cmd: Command): Promise<SectionNode> {
  const d = (cmd.data || {}) as SectionData;
  const section = figma.createSection();

  section.name = defaultVal(d.name, 'Section');
  section.x = defaultVal(d.x, 0);
  section.y = defaultVal(d.y, 0);

  if (d.width !== undefined && d.height !== undefined) {
    section.resizeWithoutConstraints(d.width, d.height);
  }

  // Section fills
  if (d.fillStyleId) {
    const style = figma.getStyleById(d.fillStyleId);
    if (style && style.type === 'PAINT') {
      (section as unknown as { fillStyleId: string }).fillStyleId = style.id;
    }
  } else if (d.fills && d.fills.length > 0) {
    const firstFill = d.fills[0];
    if (!firstFill.type || firstFill.type === 'SOLID') {
      section.fills = [{
        type: 'SOLID',
        color: parseColorInput((firstFill as { color: string }).color)
      }];
    }
  } else if (d.fill) {
    section.fills = [{
      type: 'SOLID',
      color: parseColorInput(d.fill)
    }];
  }

  // Dev status (only set if not NONE)
  if (d.devStatus && d.devStatus.type !== 'NONE') {
    section.devStatus = d.devStatus as DevStatus;
  }

  // Section contents hidden
  if (d.sectionContentsHidden !== undefined) {
    section.sectionContentsHidden = d.sectionContentsHidden;
  }

  if (d.visible !== undefined) section.visible = d.visible;
  if (d.locked !== undefined) section.locked = d.locked;

  registerNode(cmd, section);
  return section;
}

// ============ SLICE ============

export async function createSlice(cmd: Command): Promise<SliceNode> {
  const d = (cmd.data || {}) as SliceData;
  const slice = figma.createSlice();

  slice.name = defaultVal(d.name, 'Slice');
  slice.x = defaultVal(d.x, 0);
  slice.y = defaultVal(d.y, 0);
  slice.resize(defaultVal(d.width, 100), defaultVal(d.height, 100));

  // Export settings
  if (d.exportSettings && d.exportSettings.length > 0) {
    slice.exportSettings = d.exportSettings.map(setting => ({
      format: setting.format,
      suffix: setting.suffix || '',
      contentsOnly: setting.contentsOnly ?? true,
      constraint: setting.constraint
    }));
  }

  if (d.visible !== undefined) slice.visible = d.visible;
  if (d.locked !== undefined) slice.locked = d.locked;

  // Parent
  const parent = getParent(d);
  if (parent) parent.appendChild(slice);

  registerNode(cmd, slice);
  return slice;
}

// ============ SVG IMPORT ============

export async function createFromSvg(cmd: Command): Promise<FrameNode> {
  const d = (cmd.data || {}) as SvgImportData;

  if (!d.svg) {
    throw new Error('SVG content is required');
  }

  const svgNode = figma.createNodeFromSvg(d.svg);

  svgNode.name = defaultVal(d.name, 'SVG');
  svgNode.x = defaultVal(d.x, 0);
  svgNode.y = defaultVal(d.y, 0);

  if (d.visible !== undefined) svgNode.visible = d.visible;
  if (d.locked !== undefined) svgNode.locked = d.locked;

  // Parent
  const parent = getParent(d);
  if (parent) parent.appendChild(svgNode);

  registerNode(cmd, svgNode);
  return svgNode;
}

// ============ GROUP ============

export async function createGroup(cmd: Command): Promise<FrameNode> {
  const d = (cmd.data || {}) as GroupData;

  // Create a frame as container (groups need existing nodes to wrap)
  const frame = figma.createFrame();
  frame.name = defaultVal(d.name, 'Group');
  frame.x = defaultVal(d.x, 0);
  frame.y = defaultVal(d.y, 0);
  frame.fills = [];

  if (d.visible !== undefined) frame.visible = d.visible;
  if (d.locked !== undefined) frame.locked = d.locked;

  registerNode(cmd, frame);
  return frame;
}

/**
 * Data types for Figma MCP Bridge commands.
 * These types define the input schemas for MCP tools.
 */

import type { PaintInput, ColorInput, BlendMode } from './paints.js';
import type { EffectInput } from './effects.js';
import type { LayoutConfig, LayoutGridConfig } from './layout.js';
import type { HorizontalConstraint, VerticalConstraint, Transform, VectorPath, StrokeAlign, StrokeCap, StrokeJoin } from './geometry.js';
import type { ExportSetting } from './nodes.js';
import type { TextRangeStyle } from './text.js';
import type { SerializableProp } from './serializable-props.js';

// ============ Base Data Types ============

/** Common properties for node creation */
export interface BaseNodeData {
  name?: string;
  x?: number;
  y?: number;
  parent?: string;
  visible?: boolean;
  locked?: boolean;
  opacity?: number;
  rotation?: number;
}

/** Common properties for sized nodes */
export interface SizedNodeData extends BaseNodeData {
  width?: number;
  height?: number;
}

/** Common properties for nodes with fills */
export interface FillableNodeData extends SizedNodeData {
  // Shorthand (backwards compatible)
  fill?: ColorInput;
  fillColor?: ColorInput;

  // Full paint array
  fills?: PaintInput[];

  // Style reference
  fillStyleId?: string;
}

/** Common properties for nodes with strokes */
export interface StrokableNodeData extends FillableNodeData {
  // Shorthand
  stroke?: ColorInput | { color: string; weight?: number; opacity?: number };
  strokeColor?: ColorInput;

  // Full stroke array
  strokes?: PaintInput[];

  // Style reference
  strokeStyleId?: string;

  // Stroke properties
  strokeWeight?: number;
  strokeAlign?: StrokeAlign;
  strokeCap?: StrokeCap;
  strokeJoin?: StrokeJoin;
  strokeMiterLimit?: number;
  dashPattern?: number[];

  // Individual stroke weights
  strokeTopWeight?: number;
  strokeRightWeight?: number;
  strokeBottomWeight?: number;
  strokeLeftWeight?: number;
}

/** Common properties for nodes with effects */
export interface EffectableNodeData {
  effects?: EffectInput[];
  effectStyleId?: string;
}

/** Common properties for nodes with blend modes (BlendMixin) */
export interface BlendableNodeData {
  blendMode?: BlendMode;
  isMask?: boolean;
  maskType?: 'ALPHA' | 'VECTOR' | 'LUMINANCE';
}

// ============ Page Data ============

/** Create a new page in the Figma file. Pages are top-level containers in Figma documents. */
export interface PageData {
  name?: string;
}

/** Create a visual divider in the Figma page list to organize pages into sections. */
export interface PageDividerData {
  name?: string;
}

// ============ Shape Data ============

/** Create a frame container in Figma. Frames are the primary building block for layouts - use them to group elements, create screens, cards, or any container. Enable auto-layout to automatically arrange children horizontally or vertically with consistent spacing. */
export interface FrameData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // CornerMixin + RectangleCornerMixin
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
  cornerSmoothing?: number;

  // AutoLayoutMixin - full properties
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID';
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  primaryAxisSizingMode?: 'FIXED' | 'AUTO';
  counterAxisSizingMode?: 'FIXED' | 'AUTO';
  primaryAxisAlignItems?: 'MIN' | 'MAX' | 'CENTER' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'MAX' | 'CENTER' | 'BASELINE';
  counterAxisAlignContent?: 'AUTO' | 'SPACE_BETWEEN';
  itemSpacing?: number;
  counterAxisSpacing?: number | null;
  layoutWrap?: 'NO_WRAP' | 'WRAP';
  strokesIncludedInLayout?: boolean;
  itemReverseZIndex?: boolean;

  // Shorthand aliases (for backwards compatibility)
  direction?: 'HORIZONTAL' | 'VERTICAL';
  gap?: number;
  padding?: number;
  align?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAlign?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
  wrap?: 'NO_WRAP' | 'WRAP';

  // Full layout config
  layout?: LayoutConfig;

  // Layout grids (BaseFrameMixin)
  layoutGrids?: LayoutGridConfig[];
  gridStyleId?: string;

  // Constraints (ConstraintMixin)
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };

  // BaseFrameMixin
  clipsContent?: boolean;
  guides?: Array<{ axis: 'X' | 'Y'; offset: number }>;
}

/** Create a rectangle shape. Use for backgrounds, buttons, cards, dividers, or any rectangular element. Unlike frames, rectangles cannot contain children. Use cornerRadius for rounded rectangles. */
export interface RectangleData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // RectangleNode extends DefaultShapeMixin + ConstraintMixin + CornerMixin + RectangleCornerMixin + IndividualStrokesMixin
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
  cornerSmoothing?: number;
  // ConstraintMixin
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };
}

/** Create an ellipse or circle shape. Set width equal to height for a perfect circle. Use arcData for arcs and pie chart segments. */
export interface EllipseData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // EllipseNode extends DefaultShapeMixin + ConstraintMixin + CornerMixin
  arcData?: {
    startingAngle: number;
    endingAngle: number;
    innerRadius: number;
  };
  // CornerMixin
  cornerRadius?: number;
  cornerSmoothing?: number;
  // ConstraintMixin
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };
}

/** Create a regular polygon with a specified number of sides. Use pointCount=3 for triangle, 4 for square/diamond, 5 for pentagon, 6 for hexagon, etc. The polygon fits within the width/height bounds. */
export interface PolygonData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // PolygonNode extends DefaultShapeMixin + ConstraintMixin + CornerMixin
  pointCount: number;
  // CornerMixin
  cornerRadius?: number;
  cornerSmoothing?: number;
  // ConstraintMixin
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };
}

/** Create a star shape with configurable points and sharpness. Control the star's pointiness with innerRadius - lower values create sharper points, higher values create more rounded stars. */
export interface StarData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // StarNode extends DefaultShapeMixin + ConstraintMixin + CornerMixin
  pointCount: number;
  innerRadius: number; // 0-1 ratio
  // CornerMixin
  cornerRadius?: number;
  cornerSmoothing?: number;
  // ConstraintMixin
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };
}

/** Create a line element. Lines are 1-dimensional strokes useful for dividers, separators, or decorative elements. Use dashPattern for dashed/dotted lines. Rotation of 0 = horizontal, 90 = vertical. */
export interface LineData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // LineNode extends DefaultShapeMixin + ConstraintMixin
  length?: number;
  // Legacy shorthand
  color?: ColorInput;
  weight?: number;
  // ConstraintMixin
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };
}

/** Create a custom vector shape using SVG path commands. Use this for icons, custom shapes, or any path-based artwork. Path data uses standard SVG syntax (M=move, L=line, C=curve, Z=close). */
export interface VectorData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // VectorNode extends DefaultShapeMixin + ConstraintMixin + CornerMixin + VectorLikeMixin
  vectorPaths?: VectorPath[];
  vectorNetwork?: {
    vertices: Array<{
      x: number;
      y: number;
      strokeCap?: StrokeCap;
      strokeJoin?: StrokeJoin;
      cornerRadius?: number;
      handleMirroring?: 'NONE' | 'ANGLE' | 'ANGLE_AND_LENGTH';
    }>;
    segments: Array<{
      start: number;
      end: number;
      tangentStart?: { x: number; y: number };
      tangentEnd?: { x: number; y: number };
    }>;
    regions?: Array<{
      windingRule: 'NONZERO' | 'EVENODD';
      loops: number[][];
      fills?: PaintInput[];
      fillStyleId?: string;
    }>;
  };
  // CornerMixin
  cornerRadius?: number;
  cornerSmoothing?: number;
  // VectorLikeMixin
  handleMirroring?: 'NONE' | 'ANGLE' | 'ANGLE_AND_LENGTH';
  // ConstraintMixin
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };
}

/** Create a section to organize content on the canvas. Sections are high-level containers that visually group related frames and elements. Unlike frames, sections don't clip content and are primarily for organization. */
export interface SectionData extends BaseNodeData {
  // SectionNode extends ChildrenMixin + MinimalFillsMixin + OpaqueNodeMixin + DevStatusMixin
  width?: number;
  height?: number;
  fill?: ColorInput;
  fills?: PaintInput[];
  fillStyleId?: string;
  sectionContentsHidden?: boolean;
  // DevStatusMixin
  devStatus?: { type: 'NONE' | 'READY_FOR_DEV' | 'COMPLETED'; description?: string };
}

/** Create a slice to define an export region. Slices are invisible guides that mark areas for batch export - useful for exporting specific regions that may span multiple elements. */
export interface SliceData extends SizedNodeData {
  exportSettings?: ExportSetting[];
}

/** Import a complete SVG file as a Figma frame. The SVG is parsed and converted to native Figma vector nodes. Use this for icons, illustrations, or any SVG artwork. */
export interface SvgImportData extends BaseNodeData {
  svg: string;
}

// ============ Text Data ============

/** Create a text element. The font must be available in Figma - Inter is always safe. Text auto-sizes by default; set width to create a fixed-width text box that wraps. */
export interface TextData extends FillableNodeData, EffectableNodeData, BlendableNodeData {
  // Basic text content
  text?: string;
  characters?: string;

  // Font properties (BaseNonResizableTextMixin)
  fontFamily?: string;
  fontStyle?: string;
  fontSize?: number;
  fontWeight?: number;

  // Spacing properties (NonResizableTextMixin)
  lineHeight?: number | { value: number; unit: 'PIXELS' | 'PERCENT' | 'AUTO' };
  letterSpacing?: number | { value: number; unit: 'PIXELS' | 'PERCENT' };
  paragraphSpacing?: number;
  paragraphIndent?: number;
  listSpacing?: number;

  // Text styling
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE' | 'SMALL_CAPS' | 'SMALL_CAPS_FORCED';
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
  textDecorationStyle?: 'SOLID' | 'DOUBLE' | 'DOTTED' | 'DASHED' | 'WAVY';
  textDecorationOffset?: number | 'AUTO';
  textDecorationThickness?: number | 'AUTO';
  textDecorationColor?: { r: number; g: number; b: number; a?: number } | 'CURRENT_COLOR';
  textDecorationSkipInk?: boolean;

  // Text layout (TextNode specific)
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  textAutoResize?: 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'TRUNCATE';
  textTruncation?: 'DISABLED' | 'ENDING';
  maxLines?: number | null;
  autoRename?: boolean;

  // Additional text properties
  hangingPunctuation?: boolean;
  hangingList?: boolean;
  leadingTrim?: 'NONE' | 'CAP_HEIGHT';

  // Hyperlink
  hyperlink?: { type: 'URL' | 'NODE'; value: string } | null;

  // Style reference
  textStyleId?: string;

  // ConstraintMixin (TextNode extends ConstraintMixin)
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };

  // Legacy alias
  autoResize?: 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'NONE' | 'TRUNCATE';
}

export interface TextRangeStyleData extends NodeRefData {
  ranges: TextRangeStyle[];
}

// ============ Component Data ============

/** Create a reusable component (master). Components are like templates - create instances to reuse them throughout your design. Changes to a component automatically update all instances. Use '/' in names for organization. */
export interface ComponentData extends FrameData {
  // ComponentNode extends DefaultFrameMixin + PublishableMixin + VariantMixin + ComponentPropertiesMixin
  description?: string;
  documentationLinks?: Array<{ uri: string }>;
  // ComponentPropertiesMixin properties
  componentPropertyDefinitions?: Record<string, {
    type: 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP' | 'VARIANT';
    defaultValue: string | boolean;
    variantOptions?: string[];
    preferredValues?: Array<{ type: 'COMPONENT' | 'COMPONENT_SET'; key: string }>;
  }>;
}

/** Create an instance of an existing component. Instances inherit all properties from their master component. You can override specific properties on instances without affecting the master. */
export interface InstanceData extends FrameData {
  // InstanceNode extends DefaultFrameMixin + VariantMixin
  componentId: string;

  // Override system
  overrides?: Record<string, {
    text?: string;
    characters?: string;
    fill?: ColorInput;
    fills?: PaintInput[];
    visible?: boolean;
    opacity?: number;
    overrides?: Record<string, unknown>;
  }>;

  // Component properties (readable from componentProperties)
  componentProperties?: Record<string, {
    type: 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP' | 'VARIANT';
    value: string | boolean;
    preferredValues?: Array<{ type: 'COMPONENT' | 'COMPONENT_SET'; key: string }>;
  }>;

  // Instance-specific properties
  swapComponent?: string;
  scaleFactor?: number;
  isExposedInstance?: boolean;
  exposedInstances?: string[]; // IDs of exposed nested instances

  // Main component reference (for query results)
  mainComponentId?: string;
  mainComponentName?: string;
}

/** Group multiple nodes into a single group container. Groups are simpler than frames - they don't have auto-layout or clipping. Use for organizing related elements. */
export interface GroupData extends BaseNodeData, EffectableNodeData, BlendableNodeData {
  // GroupNode extends BlendMixin + ChildrenMixin + LayoutMixin + ExportMixin
  nodeIds?: string[];
}

export interface ComponentSetData extends FrameData {
  // ComponentSetNode extends DefaultFrameMixin + PublishableMixin + ComponentPropertiesMixin
  description?: string;
  documentationLinks?: Array<{ uri: string }>;
  // ComponentPropertiesMixin - variant options for the set
  componentPropertyDefinitions?: Record<string, {
    type: 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP' | 'VARIANT';
    defaultValue: string | boolean;
    variantOptions?: string[];
    preferredValues?: Array<{ type: 'COMPONENT' | 'COMPONENT_SET'; key: string }>;
  }>;
  // Default variant
  defaultVariantId?: string;
}

// ============ FigJam Node Data ============

/** Connector endpoint - can be positioned freely or attached to a node */
export type ConnectorEndpointInput =
  | { position: { x: number; y: number } }
  | { endpointNodeId: string; magnet: 'NONE' | 'AUTO' | 'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT' | 'CENTER' }
  | { position: { x: number; y: number }; endpointNodeId: string };

/** Connector stroke cap types */
export type ConnectorStrokeCapInput =
  | 'NONE'
  | 'ARROW_LINES'
  | 'ARROW_EQUILATERAL'
  | 'TRIANGLE_FILLED'
  | 'DIAMOND_FILLED'
  | 'CIRCLE_FILLED';

export interface ConnectorData extends BaseNodeData, BlendableNodeData {
  // ConnectorNode extends OpaqueNodeMixin + MinimalBlendMixin + MinimalStrokesMixin
  connectorStart?: ConnectorEndpointInput;
  connectorEnd?: ConnectorEndpointInput;
  connectorLineType?: 'ELBOWED' | 'STRAIGHT' | 'CURVED';
  connectorStartStrokeCap?: ConnectorStrokeCapInput;
  connectorEndStrokeCap?: ConnectorStrokeCapInput;
  cornerRadius?: number;
  strokes?: PaintInput[];
  strokeWeight?: number;
  strokeStyleId?: string;
  text?: string;
  // TextSublayerNode text properties available via text sublayer
  textBackground?: { fills?: PaintInput[] };
}

export interface StickyData extends BaseNodeData, BlendableNodeData {
  // StickyNode extends OpaqueNodeMixin + MinimalFillsMixin + MinimalBlendMixin
  text?: string;
  authorVisible?: boolean;
  authorName?: string;
  isWideWidth?: boolean;
  fills?: PaintInput[];
}

export interface ShapeWithTextData extends BaseNodeData, BlendableNodeData {
  // ShapeWithTextNode extends OpaqueNodeMixin + MinimalFillsMixin + MinimalBlendMixin + MinimalStrokesMixin
  shapeType?: 'SQUARE' | 'ELLIPSE' | 'ROUNDED_RECTANGLE' | 'DIAMOND' | 'TRIANGLE_UP' | 'TRIANGLE_DOWN' | 'PARALLELOGRAM_RIGHT' | 'PARALLELOGRAM_LEFT' | 'ENG_DATABASE' | 'ENG_QUEUE' | 'ENG_FILE' | 'ENG_FOLDER' | 'TRAPEZOID' | 'PREDEFINED_PROCESS' | 'SHIELD' | 'DOCUMENT_SINGLE' | 'DOCUMENT_MULTIPLE' | 'MANUAL_INPUT' | 'HEXAGON' | 'CHEVRON' | 'PENTAGON' | 'OCTAGON' | 'STAR' | 'PLUS' | 'ARROW_LEFT' | 'ARROW_RIGHT' | 'SUMMING_JUNCTION' | 'OR' | 'SPEECH_BUBBLE' | 'INTERNAL_STORAGE';
  text?: string;
  cornerRadius?: number;
  fills?: PaintInput[];
  strokes?: PaintInput[];
  strokeWeight?: number;
}

export interface CodeBlockData extends BaseNodeData, BlendableNodeData {
  // CodeBlockNode extends OpaqueNodeMixin + MinimalBlendMixin
  code?: string;
  codeLanguage?: 'TYPESCRIPT' | 'CPP' | 'RUBY' | 'CSS' | 'JAVASCRIPT' | 'HTML' | 'JSON' | 'GRAPHQL' | 'PYTHON' | 'GO' | 'SQL' | 'SWIFT' | 'KOTLIN' | 'RUST' | 'BASH' | 'PLAINTEXT' | 'DART';
}

export interface TableData extends BaseNodeData, BlendableNodeData {
  // TableNode extends OpaqueNodeMixin + MinimalFillsMixin + MinimalBlendMixin
  numRows?: number;
  numColumns?: number;
  fills?: PaintInput[];
}

export interface TableCellData extends BaseNodeData {
  // TableCellNode extends MinimalFillsMixin
  text?: string;
  fills?: PaintInput[];
  rowIndex?: number;
  columnIndex?: number;
}

export interface StampData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // StampNode extends DefaultShapeMixin + ConstraintMixin + StickableMixin
  // ConstraintMixin
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };
}

export interface HighlightData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // HighlightNode extends DefaultShapeMixin + ConstraintMixin + CornerMixin + VectorLikeMixin + StickableMixin
  // CornerMixin
  cornerRadius?: number;
  cornerSmoothing?: number;
  // VectorLikeMixin
  handleMirroring?: 'NONE' | 'ANGLE' | 'ANGLE_AND_LENGTH';
  // ConstraintMixin
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };
}

export interface WashiTapeData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // Washi tape extends DefaultShapeMixin
}

// ============ Media/Embed Data ============

export interface EmbedData extends BaseNodeData {
  // EmbedNode extends OpaqueNodeMixin
  embedData?: {
    srcUrl: string;
    title?: string;
    description?: string;
    provider?: string;
  };
}

export interface LinkUnfurlData extends BaseNodeData {
  // LinkUnfurlNode extends OpaqueNodeMixin
  linkUnfurlData?: {
    url: string;
    title?: string;
    description?: string;
    provider?: string;
  };
}

export interface MediaData extends BaseNodeData {
  // MediaNode extends OpaqueNodeMixin
  mediaData?: { hash: string };
}

// ============ Slide Data (for Figma Slides) ============

export interface SlideData extends FrameData {
  // Slide extends BaseFrameMixin
  isSkippedSlide?: boolean;
}

export interface SlideRowData extends BaseNodeData {
  // SlideRow extends OpaqueNodeMixin + ChildrenMixin
}

export interface SlideGridData extends BaseNodeData {
  // SlideGrid extends OpaqueNodeMixin + ChildrenMixin
}

export interface InteractiveSlideElementData extends BaseNodeData {
  interactiveSlideElementType?: 'POLL' | 'EMBED' | 'FACEPILE' | 'ALIGNMENT' | 'YOUTUBE';
}

// ============ Widget/Plugin Data ============

export interface WidgetData extends BaseNodeData {
  // WidgetNode extends OpaqueNodeMixin + StickableMixin
  widgetId?: string;
  widgetSyncedState?: Record<string, unknown>;
}

// ============ Other Node Data ============

export interface TextPathData extends StrokableNodeData, EffectableNodeData, BlendableNodeData {
  // TextPathNode extends DefaultShapeMixin + ConstraintMixin + NonResizableTextPathMixin
  // NonResizableTextPathMixin extends BaseNonResizableTextMixin
  characters?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: number;
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE' | 'SMALL_CAPS' | 'SMALL_CAPS_FORCED';
  letterSpacing?: number | { value: number; unit: 'PIXELS' | 'PERCENT' };
  hyperlink?: { type: 'URL' | 'NODE'; value: string } | null;
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  // ConstraintMixin
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };
}

export interface TransformGroupData extends BaseNodeData, EffectableNodeData, BlendableNodeData {
  // TransformGroup extends BlendMixin + ChildrenMixin + ExportMixin + LayoutMixin
}

// ============ Style Data ============

/** Create a reusable style for consistent design. Text styles define font properties, color styles define paint properties, and effect styles define shadow/blur properties. */
export interface StyleData {
  name: string;
  styleType: 'TEXT' | 'PAINT' | 'EFFECT';
  description?: string;
  // Text style properties
  fontFamily?: string;
  fontStyle?: string;
  fontSize?: number;
  lineHeight?: number | { value: number; unit: 'PIXELS' | 'PERCENT' | 'AUTO' };
  letterSpacing?: number | { value: number; unit: 'PIXELS' | 'PERCENT' };
  paragraphSpacing?: number;
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
  textDecoration?: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
  // Paint style properties
  color?: ColorInput;
  paints?: PaintInput[];
  // Effect style properties
  effects?: EffectInput[];
}

/** Create a variable collection to organize design tokens. Collections group related variables and support modes (e.g., 'Light'/'Dark' themes). */
export interface VariableCollectionData {
  name: string;
  modes?: string[];
}

/** Create a design token variable in an existing collection. Variables store reusable values (colors, numbers, strings) that can be bound to node properties. */
export interface VariableData {
  name: string;
  collectionId: string;
  resolvedType?: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  values?: Record<string, unknown>;
}

// ============ Query/Reference Data ============

/** Reference to a node by ID or name, with query options for serialization. */
export interface NodeRefData extends QueryData {
  nodeId?: string;
  name?: string;
}

/**
 * Query options for retrieving nodes.
 *
 * By default, queries return COMPACT data to minimize response size:
 * - compact=true (default): Only id, name, type, x, y, width, height, visible, locked, childIds
 * - depth=0 (default): Children returned as childIds array only, not fully serialized
 * - excludeVerbose=true (default): Large properties like transforms, fills, effects excluded
 *
 * Use compact=false or fields=[...] to get more properties.
 *
 * Available fields (partial list - use compact=false for all):
 * - Layout: x, y, width, height, rotation, constraints, layoutMode, layoutAlign, layoutGrow
 * - Visual: fills, strokes, effects, opacity, blendMode, cornerRadius
 * - Text: characters, fontSize, fontFamily, fontWeight, textAlignHorizontal
 * - Auto-layout: paddingTop/Right/Bottom/Left, itemSpacing, primaryAxisAlignItems
 * - Components: componentPropertyDefinitions, mainComponentId, componentProperties
 */
export interface QueryData {
  /** Max depth to traverse children. 0 = childIds only (default), 1+ = serialize children (requires compact=false) */
  depth?: number;
  /** Filter by node type (e.g., "FRAME", "TEXT") */
  filter?: string;
  /** Register nodes in registry for later reference */
  register?: boolean;
  /** Compact mode - only essential properties (id, name, type, x, y, width, height, visible, locked). Default: true */
  compact?: boolean;
  /** Specific fields to include (overrides compact/excludeVerbose). E.g., ["fills", "strokes", "effects"] */
  fields?: SerializableProp[];
  /** Exclude large properties like absoluteTransform, reactions, vectorNetwork. Default: true */
  excludeVerbose?: boolean;
  /** Search across all pages instead of just the current page. Default: false */
  allPages?: boolean;
}

/** Search for nodes matching criteria. Supports partial name matching (case-insensitive) and type filtering. Returns multiple matches. */
export interface FindNodesData extends QueryData {
  name?: string;
  type?: string;
  maxResults?: number;
}

/** Import a component from a library by its key. */
export interface ImportComponentData {
  key: string;
  id?: string; // Registry ID
}

/** Export a node to an image format or JSON. PNG/JPG/SVG return base64-encoded data. JSON returns the node's serialized properties. */
export interface ExportNodeData extends NodeRefData {
  format?: 'PNG' | 'JPG' | 'SVG' | 'PDF' | 'JSON';
  scale?: number;
  contentsOnly?: boolean;
}

// ============ Modifier Data ============

/** Set the fills of an existing node. */
export interface SetFillsData extends NodeRefData {
  fills: PaintInput[];
  fillStyleId?: string;
}

/** Set the strokes of an existing node. */
export interface SetStrokesData extends NodeRefData {
  strokes: PaintInput[];
  strokeStyleId?: string;
  strokeWeight?: number;
  strokeAlign?: StrokeAlign;
  strokeCap?: StrokeCap;
  strokeJoin?: StrokeJoin;
  dashPattern?: number[];
}

/** Apply visual effects like shadows and blurs to a node. Multiple effects can be stacked. */
export interface SetEffectsData extends NodeRefData {
  effects: EffectInput[];
  effectStyleId?: string;
}

/** Configure auto-layout on a frame. */
export interface SetLayoutData extends NodeRefData {
  direction?: 'HORIZONTAL' | 'VERTICAL';
  gap?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  primaryAlign?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAlign?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
  wrap?: 'NO_WRAP' | 'WRAP';
  counterAxisSpacing?: number;
  primaryAxisSizing?: 'FIXED' | 'AUTO';
  counterAxisSizing?: 'FIXED' | 'AUTO';
}

/** Add layout grids to a frame for visual alignment guides. Grids help with consistent spacing and alignment. */
export interface SetLayoutGridsData extends NodeRefData {
  layoutGrids: LayoutGridConfig[];
}

/** Set how a node behaves when its parent frame is resized. Constraints control pinning and scaling behavior. */
export interface SetConstraintsData extends NodeRefData {
  horizontal: HorizontalConstraint;
  vertical: VerticalConstraint;
}

/** Set how a node blends with elements behind it. Common modes: NORMAL (default), MULTIPLY (darken), SCREEN (lighten), OVERLAY (contrast). */
export interface SetBlendModeData extends NodeRefData {
  blendMode: BlendMode;
}

/** Apply a gradient fill to a node. LINEAR for directional gradients, RADIAL for circular/oval gradients, ANGULAR for sweep gradients, DIAMOND for four-way gradients. */
export interface SetGradientFillData extends NodeRefData {
  type: 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND';
  gradientStops: Array<{ position: number; color: ColorInput }>;
  gradientTransform?: Transform;
}

/** Set whether a node acts as a mask for its siblings. */
export interface SetMaskData extends NodeRefData {
  isMask: boolean;
  maskType?: 'ALPHA' | 'VECTOR' | 'LUMINANCE';
}

/** Set the rotation or transform matrix of a node. */
export interface SetTransformData extends NodeRefData {
  rotation?: number;
  transform?: Transform;
}

/** Set an image fill on a node. Provide base64 image data, an existing image hash, or a URL. */
export interface SetImageFillData extends NodeRefData {
  imageData?: string; // base64
  imageHash?: string; // existing image hash
  imageUrl?: string;
  scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE';
  imageTransform?: [[number, number, number], [number, number, number]];
  scalingFactor?: number;
  rotation?: number;
  visible?: boolean;
  opacity?: number;
  append?: boolean; // append to existing fills instead of replacing
}

/** Create an image in the Figma file from base64 data. */
export interface CreateImageData {
  imageData: string; // base64
  id?: string;
}

/** Get image data by hash or from a node's fill. */
export interface GetImageData {
  imageHash?: string;
  nodeId?: string;
}

/** Move a node to a new position on the canvas. Position is ignored for nodes inside auto-layout parents. */
export interface MoveNodeData extends NodeRefData {
  x?: number;
  y?: number;
}

/** Update properties of an existing node. Modify any visual property - size, position, colors, strokes, visibility, etc. Only specify properties you want to change. */
export interface UpdateNodeData extends NodeRefData {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  newName?: string;
  visible?: boolean;
  locked?: boolean;
  opacity?: number;
  rotation?: number;
  blendMode?: BlendMode;

  // Fills
  fills?: PaintInput[];
  fillStyleId?: string;

  // Strokes
  strokes?: PaintInput[];
  strokeStyleId?: string;
  strokeWeight?: number;
  strokeAlign?: StrokeAlign;
  strokeCap?: StrokeCap;
  strokeJoin?: StrokeJoin;
  dashPattern?: number[];
  strokeTopWeight?: number;
  strokeRightWeight?: number;
  strokeBottomWeight?: number;
  strokeLeftWeight?: number;

  // Effects
  effects?: EffectInput[];
  effectStyleId?: string;

  // Corner radius
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
  cornerSmoothing?: number;

  // Constraints
  constraints?: { horizontal: HorizontalConstraint; vertical: VerticalConstraint };
}

/** Clone an existing node. */
export interface CloneNodeData extends NodeRefData {
  id?: string; // Registry ID for the clone
  x?: number;
  y?: number;
  parent?: string;
}

/** Convert an existing node into a component. */
export interface ComponentFromNodeData extends NodeRefData {
  id?: string; // Registry ID for the new component
}

/** Perform a boolean operation on multiple nodes. */
export interface BooleanOperationData {
  nodeIds: string[];
  id?: string; // Registry ID for the result
}

// ============ Viewport Data ============

/** Programmatically select nodes in Figma. Updates what the user sees selected in the canvas and layers panel. */
export interface SetSelectionData {
  nodeIds: string[];
}

/** Set the viewport to a specific position and zoom level. Use to navigate the user to a specific canvas area. */
export interface ViewportData {
  x?: number;
  y?: number;
  zoom?: number;
}

// Node creation types for all Figma node types

export type NodeType =
  | 'FRAME' | 'GROUP' | 'SECTION'
  | 'RECTANGLE' | 'ELLIPSE' | 'POLYGON' | 'STAR' | 'LINE' | 'VECTOR'
  | 'TEXT'
  | 'COMPONENT' | 'COMPONENT_SET' | 'INSTANCE'
  | 'BOOLEAN_OPERATION'
  | 'SLICE'
  | 'CONNECTOR' | 'STICKY' | 'SHAPE_WITH_TEXT' | 'CODE_BLOCK' | 'TABLE';

export type BooleanOperationType = 'UNION' | 'SUBTRACT' | 'INTERSECT' | 'EXCLUDE';

// Base node config shared by all nodes
export interface BaseNodeConfig {
  id?: string;
  name?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  visible?: boolean;
  locked?: boolean;
  opacity?: number;
  blendMode?: string;
  rotation?: number;
}

// Frame/Group specific
export interface FrameConfig extends BaseNodeConfig {
  fill?: string;
  fills?: unknown[];
  stroke?: string | unknown;
  strokeWeight?: number;
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
  cornerSmoothing?: number;
  clipsContent?: boolean;

  // Layout
  direction?: 'HORIZONTAL' | 'VERTICAL';
  gap?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  primaryAlign?: string;
  counterAlign?: string;
  layoutWrap?: 'NO_WRAP' | 'WRAP';

  // Constraints
  constraints?: { horizontal: string; vertical: string };

  // Layout grids
  layoutGrids?: unknown[];

  // Effects
  effects?: unknown[];

  children?: unknown[];
  parent?: string;
}

// Section (like frame but for organization)
export interface SectionConfig extends BaseNodeConfig {
  fill?: string;
  children?: unknown[];
}

// Polygon specific
export interface PolygonConfig extends BaseNodeConfig {
  pointCount: number;
  fill?: string;
  fills?: unknown[];
  stroke?: string | unknown;
  strokeWeight?: number;
  cornerRadius?: number;
  parent?: string;
}

// Star specific
export interface StarConfig extends BaseNodeConfig {
  pointCount: number;
  innerRadius: number; // 0-1, ratio of inner to outer radius
  fill?: string;
  fills?: unknown[];
  stroke?: string | unknown;
  strokeWeight?: number;
  cornerRadius?: number;
  parent?: string;
}

// Vector specific
export interface VectorConfig extends BaseNodeConfig {
  vectorPaths?: { windingRule: string; data: string }[];
  vectorNetwork?: unknown;
  fill?: string;
  fills?: unknown[];
  stroke?: string | unknown;
  strokeWeight?: number;
  strokeCap?: string;
  strokeJoin?: string;
  parent?: string;
}

// Slice specific
export interface SliceConfig extends BaseNodeConfig {
  // Slices are just bounds for export
  exportSettings?: ExportSetting[];
}

export interface ExportSetting {
  format: 'PNG' | 'JPG' | 'SVG' | 'PDF';
  suffix?: string;
  contentsOnly?: boolean;
  constraint?: { type: 'SCALE' | 'WIDTH' | 'HEIGHT'; value: number };
}

// Boolean operation
export interface BooleanOperationConfig extends BaseNodeConfig {
  operation: BooleanOperationType;
  children: string[]; // Node IDs or registry IDs to combine
  fill?: string;
  fills?: unknown[];
  stroke?: string | unknown;
  strokeWeight?: number;
}

// Connector (for FigJam)
export interface ConnectorConfig extends BaseNodeConfig {
  startNode?: string;
  endNode?: string;
  startPosition?: { x: number; y: number };
  endPosition?: { x: number; y: number };
  stroke?: string;
  strokeWeight?: number;
  connectorLineType?: 'ELBOWED' | 'STRAIGHT';
  connectorStart?: 'NONE' | 'ARROW_LINES' | 'ARROW_EQUILATERAL' | 'TRIANGLE_FILLED' | 'DIAMOND_FILLED' | 'CIRCLE_FILLED';
  connectorEnd?: 'NONE' | 'ARROW_LINES' | 'ARROW_EQUILATERAL' | 'TRIANGLE_FILLED' | 'DIAMOND_FILLED' | 'CIRCLE_FILLED';
  text?: string;
}

// Sticky note (for FigJam)
export interface StickyConfig extends BaseNodeConfig {
  text?: string;
  fill?: string;
  authorVisible?: boolean;
}

// Shape with text (for FigJam)
export interface ShapeWithTextConfig extends BaseNodeConfig {
  shapeType: 'SQUARE' | 'ELLIPSE' | 'ROUNDED_RECTANGLE' | 'DIAMOND' | 'TRIANGLE_UP' | 'TRIANGLE_DOWN' | 'PARALLELOGRAM_RIGHT' | 'PARALLELOGRAM_LEFT' | 'ENG_DATABASE' | 'ENG_QUEUE' | 'ENG_FILE' | 'ENG_FOLDER';
  text?: string;
  fill?: string;
  stroke?: string;
}

// Code block (for FigJam)
export interface CodeBlockConfig extends BaseNodeConfig {
  code: string;
  language?: string;
}

// Table
export interface TableConfig extends BaseNodeConfig {
  numRows: number;
  numColumns: number;
  cellData?: { row: number; column: number; text?: string; fill?: string }[];
}

// SVG import
export interface SvgImportConfig extends BaseNodeConfig {
  svg: string; // SVG string content
}

// Image
export interface ImageConfig extends BaseNodeConfig {
  imageData?: Uint8Array;
  imageUrl?: string; // For async loading
}

// ============ SceneNode Types (Query Results) ============
// These types represent nodes returned from queries, matching Figma's SceneNode structure.

import type {
  FrameData,
  RectangleData,
  EllipseData,
  PolygonData,
  StarData,
  LineData,
  VectorData,
  TextData,
  ComponentData,
  ComponentSetData,
  InstanceData,
  GroupData,
  SectionData,
  SliceData,
  ConnectorData,
  StickyData,
  ShapeWithTextData,
  CodeBlockData,
  TableData,
  StampData,
  HighlightData,
  WashiTapeData,
  EmbedData,
  LinkUnfurlData,
  MediaData,
  SlideData,
  SlideRowData,
  SlideGridData,
  InteractiveSlideElementData,
  WidgetData,
  TextPathData,
  TransformGroupData,
} from './data.js';

/** Base properties for all queried nodes */
export interface BaseSceneNode {
  id: string;
  name: string;
}

// ============ Container Nodes (can have children) ============

export interface FrameSceneNode extends BaseSceneNode, Omit<FrameData, 'name'> {
  type: 'FRAME';
  children?: SceneNode[];
}

export interface ComponentSceneNode extends BaseSceneNode, Omit<ComponentData, 'name'> {
  type: 'COMPONENT';
  children?: SceneNode[];
}

export interface ComponentSetSceneNode extends BaseSceneNode, Omit<ComponentSetData, 'name'> {
  type: 'COMPONENT_SET';
  children?: SceneNode[];
}

export interface GroupSceneNode extends BaseSceneNode, Omit<GroupData, 'name'> {
  type: 'GROUP';
  children?: SceneNode[];
}

export interface SectionSceneNode extends BaseSceneNode, Omit<SectionData, 'name'> {
  type: 'SECTION';
  children?: SceneNode[];
}

export interface BooleanOperationSceneNode extends BaseSceneNode {
  type: 'BOOLEAN_OPERATION';
  booleanOperation: BooleanOperationType;
  children?: SceneNode[];
}

export interface TransformGroupSceneNode extends BaseSceneNode, Omit<TransformGroupData, 'name'> {
  type: 'TRANSFORM_GROUP';
  children?: SceneNode[];
}

// ============ Slide Container Nodes ============

export interface SlideSceneNode extends BaseSceneNode, Omit<SlideData, 'name'> {
  type: 'SLIDE';
  children?: SceneNode[];
}

export interface SlideRowSceneNode extends BaseSceneNode, Omit<SlideRowData, 'name'> {
  type: 'SLIDE_ROW';
  children?: SceneNode[];
}

export interface SlideGridSceneNode extends BaseSceneNode, Omit<SlideGridData, 'name'> {
  type: 'SLIDE_GRID';
  children?: SceneNode[];
}

// ============ Shape Nodes (no children) ============

export interface RectangleSceneNode extends BaseSceneNode, Omit<RectangleData, 'name'> {
  type: 'RECTANGLE';
}

export interface EllipseSceneNode extends BaseSceneNode, Omit<EllipseData, 'name'> {
  type: 'ELLIPSE';
}

export interface PolygonSceneNode extends BaseSceneNode, Omit<PolygonData, 'name'> {
  type: 'POLYGON';
}

export interface StarSceneNode extends BaseSceneNode, Omit<StarData, 'name'> {
  type: 'STAR';
}

export interface LineSceneNode extends BaseSceneNode, Omit<LineData, 'name'> {
  type: 'LINE';
}

export interface VectorSceneNode extends BaseSceneNode, Omit<VectorData, 'name'> {
  type: 'VECTOR';
}

export interface TextSceneNode extends BaseSceneNode, Omit<TextData, 'name'> {
  type: 'TEXT';
}

export interface TextPathSceneNode extends BaseSceneNode, Omit<TextPathData, 'name'> {
  type: 'TEXT_PATH';
}

export interface SliceSceneNode extends BaseSceneNode, Omit<SliceData, 'name'> {
  type: 'SLICE';
}

export interface InstanceSceneNode extends BaseSceneNode, Omit<InstanceData, 'name'> {
  type: 'INSTANCE';
  mainComponentId?: string;
  mainComponentName?: string;
}

// ============ FigJam Nodes ============

export interface ConnectorSceneNode extends BaseSceneNode, Omit<ConnectorData, 'name'> {
  type: 'CONNECTOR';
}

export interface StickySceneNode extends BaseSceneNode, Omit<StickyData, 'name'> {
  type: 'STICKY';
}

export interface ShapeWithTextSceneNode extends BaseSceneNode, Omit<ShapeWithTextData, 'name'> {
  type: 'SHAPE_WITH_TEXT';
}

export interface CodeBlockSceneNode extends BaseSceneNode, Omit<CodeBlockData, 'name'> {
  type: 'CODE_BLOCK';
}

export interface TableSceneNode extends BaseSceneNode, Omit<TableData, 'name'> {
  type: 'TABLE';
  children?: SceneNode[]; // Table cells
}

export interface StampSceneNode extends BaseSceneNode, Omit<StampData, 'name'> {
  type: 'STAMP';
}

export interface HighlightSceneNode extends BaseSceneNode, Omit<HighlightData, 'name'> {
  type: 'HIGHLIGHT';
}

export interface WashiTapeSceneNode extends BaseSceneNode, Omit<WashiTapeData, 'name'> {
  type: 'WASHI_TAPE';
}

// ============ Media/Embed Nodes ============

export interface EmbedSceneNode extends BaseSceneNode, Omit<EmbedData, 'name'> {
  type: 'EMBED';
}

export interface LinkUnfurlSceneNode extends BaseSceneNode, Omit<LinkUnfurlData, 'name'> {
  type: 'LINK_UNFURL';
}

export interface MediaSceneNode extends BaseSceneNode, Omit<MediaData, 'name'> {
  type: 'MEDIA';
}

// ============ Interactive/Widget Nodes ============

export interface InteractiveSlideElementSceneNode extends BaseSceneNode, Omit<InteractiveSlideElementData, 'name'> {
  type: 'INTERACTIVE_SLIDE_ELEMENT';
}

export interface WidgetSceneNode extends BaseSceneNode, Omit<WidgetData, 'name'> {
  type: 'WIDGET';
}

// ============ SceneNode Union ============

/** Discriminated union of all node types returned from queries */
export type SceneNode =
  // Container nodes
  | FrameSceneNode
  | ComponentSceneNode
  | ComponentSetSceneNode
  | GroupSceneNode
  | SectionSceneNode
  | BooleanOperationSceneNode
  | TransformGroupSceneNode
  // Slide nodes
  | SlideSceneNode
  | SlideRowSceneNode
  | SlideGridSceneNode
  // Shape nodes
  | RectangleSceneNode
  | EllipseSceneNode
  | PolygonSceneNode
  | StarSceneNode
  | LineSceneNode
  | VectorSceneNode
  // Text nodes
  | TextSceneNode
  | TextPathSceneNode
  // Other leaf nodes
  | SliceSceneNode
  | InstanceSceneNode
  // FigJam nodes
  | ConnectorSceneNode
  | StickySceneNode
  | ShapeWithTextSceneNode
  | CodeBlockSceneNode
  | TableSceneNode
  | StampSceneNode
  | HighlightSceneNode
  | WashiTapeSceneNode
  // Media/Embed nodes
  | EmbedSceneNode
  | LinkUnfurlSceneNode
  | MediaSceneNode
  // Interactive/Widget nodes
  | InteractiveSlideElementSceneNode
  | WidgetSceneNode;

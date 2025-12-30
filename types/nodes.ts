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

// Shared types between MCP server and Figma plugin
// Commands use discriminated union - type field determines payload type

// ============ Fill Config ============
export interface FillConfig {
  color: string;
  opacity?: number;
  style?: string;
}

// ============ Base Data Types ============
// Common properties for node creation
export interface BaseNodeData {
  name?: string;
  x?: number;
  y?: number;
  parent?: string;
}

// Common properties for sized nodes
export interface SizedNodeData extends BaseNodeData {
  width?: number;
  height?: number;
}

// Common properties for nodes with fills
export interface FillableNodeData extends SizedNodeData {
  fill?: string;
  fills?: FillConfig[];
  fillColor?: string;
}

// Common properties for nodes with strokes
export interface StrokableNodeData extends FillableNodeData {
  stroke?: string | { color: string; weight?: number; opacity?: number };
  strokeColor?: string;
  strokeWeight?: number;
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  dashPattern?: number[];
}

// ============ Command Payload Types ============
export interface PageData {
  name?: string;
}

export interface FrameData extends StrokableNodeData {
  cornerRadius?: number;
  direction?: 'HORIZONTAL' | 'VERTICAL';
  gap?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  align?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAlign?: 'MIN' | 'CENTER' | 'MAX';
  clipsContent?: boolean;
  layout?: {
    direction?: 'HORIZONTAL' | 'VERTICAL';
    gap?: number;
    padding?: number;
    paddingTop?: number;
    paddingRight?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    primaryAlign?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
    counterAlign?: 'MIN' | 'CENTER' | 'MAX';
    primarySizing?: 'FIXED' | 'AUTO';
    counterSizing?: 'FIXED' | 'AUTO';
  };
}

export interface RectangleData extends StrokableNodeData {
  cornerRadius?: number;
}

export interface EllipseData extends StrokableNodeData {}

export interface LineData extends BaseNodeData {
  length?: number;
  rotation?: number;
  color?: string;
  weight?: number;
  dashPattern?: number[];
}

export interface TextData extends FillableNodeData {
  text?: string;
  fontFamily?: string;
  fontStyle?: string;
  fontSize?: number;
  lineHeight?: number | { value: number; unit: 'PIXELS' | 'PERCENT' | 'AUTO' };
  letterSpacing?: number;
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  autoResize?: 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'NONE';
}

export interface ComponentData extends FrameData {}

export interface InstanceData extends BaseNodeData {
  componentId: string;
  overrides?: Record<string, {
    text?: string;
    fill?: string;
    visible?: boolean;
    opacity?: number;
  }>;
}

export interface GroupData extends BaseNodeData {}

export interface StyleData {
  name: string;
  styleType: 'TEXT' | 'PAINT' | 'EFFECT';
  fontFamily?: string;
  fontStyle?: string;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
  color?: string;
  effects?: unknown[];
}

export interface VariableCollectionData {
  name: string;
  modes?: string[];
}

export interface VariableData {
  name: string;
  collectionId: string;
  resolvedType?: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  values?: Record<string, unknown>;
}

export interface NodeRefData {
  nodeId?: string;
  name?: string;
}

export interface SetFillsData extends NodeRefData {
  fills: FillConfig[];
}

export interface SetStrokesData extends NodeRefData {
  strokes: Array<{ color: string; opacity?: number }>;
  strokeWeight?: number;
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  dashPattern?: number[];
}

export interface SetEffectsData extends NodeRefData {
  effects: unknown[];
}

export interface SetLayoutData extends NodeRefData {
  direction?: 'HORIZONTAL' | 'VERTICAL';
  gap?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
}

export interface MoveNodeData extends NodeRefData {
  x?: number;
  y?: number;
}

export interface UpdateNodeData extends NodeRefData {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  newName?: string;
  fills?: FillConfig[];
  strokes?: Array<{ color: string; opacity?: number }>;
  strokeWeight?: number;
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  dashPattern?: number[];
  cornerRadius?: number;
  visible?: boolean;
  opacity?: number;
}

export interface QueryData {
  depth?: number;
  filter?: string;
  register?: boolean;
}

export interface FindNodesData extends QueryData {
  name?: string;
  maxResults?: number;
}

export interface ExportNodeData extends NodeRefData {
  format?: 'PNG' | 'JPG' | 'SVG' | 'PDF' | 'JSON';
  scale?: number;
}

// ============ Base Command (shared fields) ============
interface BaseCommand {
  id?: string;
  children?: Command[];
}

// ============ Discriminated Union of Commands ============
export type Command =
  // Node creation
  | (BaseCommand & { type: 'CREATE_PAGE'; data?: PageData })
  | (BaseCommand & { type: 'CREATE_FRAME'; data?: FrameData })
  | (BaseCommand & { type: 'CREATE_RECTANGLE'; data?: RectangleData })
  | (BaseCommand & { type: 'CREATE_ELLIPSE'; data?: EllipseData })
  | (BaseCommand & { type: 'CREATE_LINE'; data?: LineData })
  | (BaseCommand & { type: 'CREATE_TEXT'; data?: TextData })
  | (BaseCommand & { type: 'CREATE_COMPONENT'; data?: ComponentData })
  | (BaseCommand & { type: 'CREATE_INSTANCE'; data?: InstanceData })
  | (BaseCommand & { type: 'CREATE_GROUP'; data?: GroupData })
  // Styles and variables
  | (BaseCommand & { type: 'CREATE_STYLE'; data?: StyleData })
  | (BaseCommand & { type: 'CREATE_VARIABLE_COLLECTION'; data?: VariableCollectionData })
  | (BaseCommand & { type: 'CREATE_VARIABLE'; data?: VariableData })
  // Modification
  | (BaseCommand & { type: 'SET_FILLS'; data?: SetFillsData })
  | (BaseCommand & { type: 'SET_STROKES'; data?: SetStrokesData })
  | (BaseCommand & { type: 'SET_EFFECTS'; data?: SetEffectsData })
  | (BaseCommand & { type: 'SET_LAYOUT'; data?: SetLayoutData })
  | (BaseCommand & { type: 'MOVE_NODE'; data?: MoveNodeData })
  | (BaseCommand & { type: 'UPDATE_NODE'; data?: UpdateNodeData })
  | (BaseCommand & { type: 'DELETE_NODE'; data?: NodeRefData })
  // Queries
  | (BaseCommand & { type: 'GET_NODE_BY_NAME'; data?: NodeRefData })
  | (BaseCommand & { type: 'GET_SELECTION'; data?: QueryData })
  | (BaseCommand & { type: 'GET_PAGE_NODES'; data?: QueryData })
  | (BaseCommand & { type: 'GET_NODE_BY_ID'; data?: NodeRefData & QueryData })
  | (BaseCommand & { type: 'FIND_NODES'; data?: FindNodesData })
  | (BaseCommand & { type: 'GET_STYLES'; data?: QueryData })
  | (BaseCommand & { type: 'GET_COMPONENTS'; data?: QueryData })
  | (BaseCommand & { type: 'GET_VARIABLES'; data?: undefined })
  // Export
  | (BaseCommand & { type: 'EXPORT_NODE'; data?: ExportNodeData });

// ============ Helper to extract payload type by command type ============
export type CommandPayload<T extends Command['type']> = Extract<Command, { type: T }>['data'];

// ============ Type alias for all valid command types ============
export type CommandType = Command['type'];

// ============ Result Interface ============
export interface CommandResult {
  success: boolean;
  _cmdId?: string;
  id?: string;
  nodeId?: string;
  error?: string;
  data?: Record<string, unknown>;
}

// ============ Serialized Node (for queries) ============
export interface SerializedNode {
  id: string;
  name: string;
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fills?: Array<{ type: string; color?: string; opacity?: number }>;
  strokes?: Array<{ type: string; color?: string; opacity?: number }>;
  strokeWeight?: number;
  strokeAlign?: string;
  dashPattern?: number[];
  cornerRadius?: number;
  characters?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  layoutMode?: string;
  itemSpacing?: number;
  padding?: { top: number; right: number; bottom: number; left: number };
  primaryAxisAlign?: string;
  counterAxisAlign?: string;
  isComponent?: boolean;
  isInstance?: boolean;
  mainComponentId?: string;
  mainComponentName?: string;
  children?: SerializedNode[];
}

// ============ Tagged Command (with internal tracking ID) ============
export type TaggedCommand = Command & { _cmdId: string };

// ============ WebSocket Message Types ============
export type WebSocketMessageType = 'commands' | 'results';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  commands?: TaggedCommand[];
  results?: CommandResult[];
}

// ============ UI Message Types (Plugin <-> UI) ============
export type UIMessageType = 'execute-commands' | 'success' | 'error' | 'resize' | 'cancel';

export interface UIMessage {
  type: UIMessageType;
  commands?: Command[];
  results?: CommandResult[];
  message?: string;
  height?: number;
}

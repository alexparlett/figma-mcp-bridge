// Shared types between MCP server and Figma plugin

// ============ Alignment and Direction Types ============
export type LayoutDirection = 'HORIZONTAL' | 'VERTICAL';
export type PrimaryAxisAlignment = 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
export type CounterAxisAlignment = 'MIN' | 'CENTER' | 'MAX';
export type SizingMode = 'AUTO' | 'FIXED';
export type StrokeAlignment = 'INSIDE' | 'OUTSIDE' | 'CENTER';
export type TextAlignHorizontal = 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
export type TextAlignVertical = 'TOP' | 'CENTER' | 'BOTTOM';
export type TextCase = 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE';
export type TextAutoResize = 'HEIGHT' | 'WIDTH_AND_HEIGHT' | 'NONE';
export type ExportFormat = 'PNG' | 'SVG' | 'JPG' | 'PDF' | 'JSON';
export type VariableType = 'COLOR' | 'FLOAT' | 'STRING';
export type StyleType = 'TEXT' | 'PAINT' | 'EFFECT';

// ============ Command Types ============
export type CommandType =
  | 'CREATE_PAGE'
  | 'CREATE_FRAME'
  | 'CREATE_RECTANGLE'
  | 'CREATE_ELLIPSE'
  | 'CREATE_TEXT'
  | 'CREATE_COMPONENT'
  | 'CREATE_INSTANCE'
  | 'CREATE_GROUP'
  | 'CREATE_LINE'
  | 'CREATE_STYLE'
  | 'CREATE_VARIABLE_COLLECTION'
  | 'CREATE_VARIABLE'
  | 'SET_FILLS'
  | 'SET_STROKES'
  | 'SET_EFFECTS'
  | 'SET_LAYOUT'
  | 'MOVE_NODE'
  | 'UPDATE_NODE'
  | 'DELETE_NODE'
  | 'GET_NODE_BY_NAME'
  | 'GET_SELECTION'
  | 'GET_PAGE_NODES'
  | 'GET_NODE_BY_ID'
  | 'FIND_NODES'
  | 'GET_STYLES'
  | 'GET_COMPONENTS'
  | 'GET_VARIABLES'
  | 'EXPORT_NODE';

// ============ Configuration Interfaces ============
export interface LayoutConfig {
  direction?: LayoutDirection;
  gap?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  primaryAlign?: PrimaryAxisAlignment;
  counterAlign?: CounterAxisAlignment;
  primarySizing?: SizingMode;
  counterSizing?: SizingMode;
}

export interface FillConfig {
  color: string;
  opacity?: number;
  style?: string;
}

export interface StrokeConfig {
  color: string;
  weight?: number;
  opacity?: number;
  align?: StrokeAlignment;
  dashPattern?: number[];
}

export interface OverrideConfig {
  text?: string;
  fill?: string;
  visible?: boolean;
}

export interface LineHeightConfig {
  value: number;
  unit: string;
}

// ============ Command Interface ============
// This interface contains all possible fields used by any command
// The plugin uses this flexible interface since it handles all commands dynamically
export interface Command {
  type: CommandType | string;
  id?: string;
  _cmdId?: string;
  // In the plugin context, this is a SceneNode. Using object type for cross-context compatibility.
  _parentNode?: object | null;

  // Common properties
  name?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;

  // Fill/stroke properties
  fill?: string;
  fills?: FillConfig[];
  fillColor?: string;
  stroke?: string | StrokeConfig;
  strokeColor?: string;
  strokeWeight?: number;
  strokeAlign?: StrokeAlignment;
  dashPattern?: number[];
  cornerRadius?: number;

  // Hierarchy
  parent?: string;
  children?: Command[];

  // Layout properties
  layout?: LayoutConfig;
  direction?: LayoutDirection;
  gap?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  align?: PrimaryAxisAlignment;
  counterAlign?: CounterAxisAlignment;
  clipsContent?: boolean;

  // Text properties
  text?: string;
  fontFamily?: string;
  fontStyle?: string;
  fontSize?: number;
  lineHeight?: number | LineHeightConfig;
  letterSpacing?: number;
  textCase?: TextCase;
  textAlignHorizontal?: TextAlignHorizontal;
  textAlignVertical?: TextAlignVertical;
  autoResize?: TextAutoResize;

  // Component/Instance properties
  componentId?: string;
  overrides?: Record<string, OverrideConfig>;

  // Line properties
  length?: number;
  rotation?: number;
  color?: string;
  weight?: number;

  // Variable properties
  modes?: string[];
  collectionId?: string;
  resolvedType?: VariableType;
  values?: Record<string, unknown>;

  // Style properties
  styleType?: StyleType;
  // Effects array - uses object type for cross-context compatibility
  // In Figma context, these are Effect objects
  effects?: object[];

  // Node operation properties
  nodeId?: string;
  newName?: string;
  visible?: boolean;
  opacity?: number;
  strokes?: FillConfig[];

  // Query properties
  depth?: number;
  register?: boolean;
  filter?: string;
  type_filter?: string;
  maxResults?: number;
  format?: ExportFormat;
  scale?: number;

  // Allow additional properties for flexibility
  [key: string]: unknown;
}

// ============ Result Interfaces ============
export interface CommandResult {
  success: boolean;
  id?: string;
  _cmdId?: string;
  nodeId?: string;
  error?: string;
  [key: string]: unknown;
}

// ============ WebSocket Message Types ============
export type WebSocketMessageType = 'commands' | 'results';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  commands?: Command[];
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

// ============ Serialized Node (for GET operations) ============
export interface SerializedFill {
  type: string;
  color?: string;
  opacity?: number;
}

export interface SerializedStroke {
  type: string;
  color?: string;
  opacity?: number;
}

export interface SerializedPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SerializedNode {
  id: string;
  name: string;
  type: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fills?: SerializedFill[];
  strokes?: SerializedStroke[];
  strokeWeight?: number;
  strokeAlign?: string;
  dashPattern?: number[] | readonly number[];
  cornerRadius?: number;
  characters?: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  layoutMode?: string;
  itemSpacing?: number;
  padding?: SerializedPadding;
  primaryAxisAlign?: string;
  counterAxisAlign?: string;
  isComponent?: boolean;
  isInstance?: boolean;
  mainComponentId?: string;
  mainComponentName?: string;
  children?: SerializedNode[];
}

// ============ Component Definition (for figma_define_components) ============
export interface ComponentDef {
  id: string;
  name?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWeight?: number;
  strokeAlign?: StrokeAlignment;
  dashPattern?: number[];
  cornerRadius?: number;
  direction?: LayoutDirection;
  gap?: number;
  padding?: number;
  children?: Command[];
  [key: string]: unknown;
}

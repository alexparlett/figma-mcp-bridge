/**
 * Command Registry - The single source of truth for all command types.
 *
 * This file defines the mapping between command types and their data types.
 * Both the Command discriminated union and MCP tool definitions are derived from this.
 */

import type {
  PageData,
  PageDividerData,
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
  TextData,
  ComponentData,
  InstanceData,
  GroupData,
  BooleanOperationData,
  NodeRefData,
  StyleData,
  VariableCollectionData,
  VariableData,
  SetFillsData,
  SetStrokesData,
  SetEffectsData,
  SetLayoutData,
  SetLayoutGridsData,
  SetConstraintsData,
  SetBlendModeData,
  SetGradientFillData,
  SetMaskData,
  SetTransformData,
  SetImageFillData,
  CreateImageData,
  GetImageData,
  TextRangeStyleData,
  MoveNodeData,
  UpdateNodeData,
  CloneNodeData,
  ComponentFromNodeData,
  SetSelectionData,
  ViewportData,
  QueryData,
  FindNodesData,
  ImportComponentData,
  ExportNodeData,
} from './data.js';

// Re-export all data types for convenience
export type {
  PageData,
  PageDividerData,
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
  TextData,
  ComponentData,
  InstanceData,
  GroupData,
  BooleanOperationData,
  NodeRefData,
  StyleData,
  VariableCollectionData,
  VariableData,
  SetFillsData,
  SetStrokesData,
  SetEffectsData,
  SetLayoutData,
  SetLayoutGridsData,
  SetConstraintsData,
  SetBlendModeData,
  SetGradientFillData,
  SetMaskData,
  SetTransformData,
  SetImageFillData,
  CreateImageData,
  GetImageData,
  TextRangeStyleData,
  MoveNodeData,
  UpdateNodeData,
  CloneNodeData,
  ComponentFromNodeData,
  SetSelectionData,
  ViewportData,
  QueryData,
  FindNodesData,
  ImportComponentData,
  ExportNodeData,
} from './data.js';

// ============ Command Type to Data Type Mapping ============

/**
 * Maps each command type string to its corresponding data type.
 * This is the canonical definition - everything else is derived from this.
 */
export interface CommandDataMap {
  // Node creation
  CREATE_PAGE: PageData;
  CREATE_PAGE_DIVIDER: PageDividerData;
  CREATE_FRAME: FrameData;
  CREATE_RECTANGLE: RectangleData;
  CREATE_ELLIPSE: EllipseData;
  CREATE_POLYGON: PolygonData;
  CREATE_STAR: StarData;
  CREATE_LINE: LineData;
  CREATE_VECTOR: VectorData;
  CREATE_SECTION: SectionData;
  CREATE_SLICE: SliceData;
  CREATE_FROM_SVG: SvgImportData;
  CREATE_TEXT: TextData;
  CREATE_COMPONENT: ComponentData;
  CREATE_INSTANCE: InstanceData;
  CREATE_GROUP: GroupData;

  // Boolean operations
  BOOLEAN_UNION: BooleanOperationData;
  BOOLEAN_SUBTRACT: BooleanOperationData;
  BOOLEAN_INTERSECT: BooleanOperationData;
  BOOLEAN_EXCLUDE: BooleanOperationData;
  FLATTEN_NODE: NodeRefData;

  // Grouping
  GROUP_NODES: BooleanOperationData;
  UNGROUP_NODE: NodeRefData;

  // Styles and variables
  CREATE_TEXT_STYLE: StyleData;
  CREATE_COLOR_STYLE: StyleData;
  CREATE_EFFECT_STYLE: StyleData;
  CREATE_VARIABLE_COLLECTION: VariableCollectionData;
  CREATE_VARIABLE: VariableData;

  // Modification
  SET_FILLS: SetFillsData;
  SET_STROKES: SetStrokesData;
  SET_EFFECTS: SetEffectsData;
  SET_LAYOUT: SetLayoutData;
  SET_LAYOUT_GRIDS: SetLayoutGridsData;
  SET_CONSTRAINTS: SetConstraintsData;
  SET_BLEND_MODE: SetBlendModeData;
  SET_GRADIENT_FILL: SetGradientFillData;
  SET_MASK: SetMaskData;
  SET_TRANSFORM: SetTransformData;
  SET_IMAGE_FILL: SetImageFillData;
  CREATE_IMAGE: CreateImageData;
  GET_IMAGE_DATA: GetImageData;
  SET_TEXT_RANGE_STYLE: TextRangeStyleData;
  MOVE_NODE: MoveNodeData;
  UPDATE_NODE: UpdateNodeData;
  DELETE_NODE: NodeRefData;
  CLONE_NODE: CloneNodeData;
  COMPONENT_FROM_NODE: ComponentFromNodeData;

  // Viewport and selection
  SET_SELECTION: SetSelectionData;
  ZOOM_TO_FIT: NodeRefData;
  GET_VIEWPORT: undefined;
  SET_VIEWPORT: ViewportData;

  // Queries
  GET_NODE_BY_NAME: NodeRefData;
  GET_SELECTION: QueryData;
  GET_PAGE_NODES: QueryData;
  GET_NODE_BY_ID: NodeRefData & QueryData;
  FIND_NODES: FindNodesData;
  GET_STYLES: QueryData;
  GET_COMPONENTS: QueryData;
  GET_VARIABLES: undefined;
  LIST_FONTS: undefined;

  // Import
  IMPORT_COMPONENT: ImportComponentData;

  // Export
  EXPORT_NODE: ExportNodeData;

  //
  STATUS: undefined;
}

// ============ Derived Types ============

/**
 * All valid command type strings
 */
export type CommandType = keyof CommandDataMap;

/**
 * Get the data type for a given command type
 */
export type CommandPayload<T extends CommandType> = CommandDataMap[T];

/**
 * Base command fields shared by all commands
 */
export interface BaseCommand {
  id?: string;
  _cmdId?: string;
  children?: Command[];
}

/**
 * Generate a command variant for a specific type
 */
type CommandVariant<T extends CommandType> = BaseCommand & {
  type: T;
  data?: CommandDataMap[T];
};

/**
 * The Command discriminated union - generated from CommandDataMap
 */
export type Command = {
  [K in CommandType]: CommandVariant<K>;
}[CommandType];

// ============ Command Categories ============

/**
 * Commands that return data (queries/exports)
 */
export const FETCH_COMMAND_TYPES: readonly CommandType[] = [
  'GET_SELECTION',
  'GET_PAGE_NODES',
  'GET_NODE_BY_ID',
  'FIND_NODES',
  'GET_STYLES',
  'GET_COMPONENTS',
  'GET_VARIABLES',
  'EXPORT_NODE',
  'GET_VIEWPORT',
  'GET_NODE_BY_NAME',
  'LIST_FONTS',
  'GET_IMAGE_DATA',
] as const;

export const fetchCommandTypes = new Set<CommandType>(FETCH_COMMAND_TYPES);

/**
 * Check if a command type is a fetch command
 */
export function isFetchCommand(type: CommandType): boolean {
  return fetchCommandTypes.has(type);
}

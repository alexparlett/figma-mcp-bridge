/// <reference types="@figma/plugin-typings" />

// Claude Design Bridge - Figma Plugin
// This plugin allows Claude to create designs in Figma via JSON commands

import type {
  CommandResult,
  UIMessage,
} from "../types/messages.js";

import type {
  Command,
  CommandType
} from "../types/commands.js"

// Registry is used by handlers - imported here for type awareness
import { initializeRegistries } from "./registry.js";

// Import all handlers
import {
  // Page
  createPage,
  createPageDivider,
  // Shapes
  createFrame,
  createRectangle,
  createEllipse,
  createLine,
  createGroup,
  createPolygon,
  createStar,
  createVector,
  createSection,
  createSlice,
  createFromSvg,
  // Text
  createText,
  setTextRangeStyle,
  listFonts,
  // Components
  createComponent,
  createInstance,
  importComponent,
  // Modifiers
  setFills,
  setStrokes,
  setEffects,
  setLayout,
  setLayoutGrids,
  setConstraints,
  setBlendMode,
  setGradientFill,
  setMask,
  setTransform,
  cloneNode,
  componentFromNode,
  moveNode,
  updateNode,
  deleteNode,
  // Boolean operations
  booleanUnion,
  booleanSubtract,
  booleanIntersect,
  booleanExclude,
  flattenNode,
  groupNodes,
  ungroupNode,
  // Viewport
  setSelection as setSelectionViewport,
  zoomToFit,
  getViewport,
  setViewport,
  // Images
  setImageFill,
  createImage,
  getImageData,
  // Queries
  getNodeByName,
  getSelection,
  getPageNodes,
  getNodeById,
  findNodes,
  getStyles,
  getComponents,
  getVariables,
  serializeNode,
  // Styles
  createTextStyle,
  createColorStyle,
  createEffectStyle,
  createVariableCollection,
  createVariable,
  // Export
  exportNode
} from "./handlers/index.js";

// Start collapsed (compact bar)
figma.showUI(__html__, { width: 240, height: 28 });

// Initialize registries with existing document content
initializeRegistries();

// Process commands from UI
figma.ui.onmessage = async (msg: UIMessage) => {
  if (msg.type === 'execute-commands') {
    executeCommands(msg.commands || []).then((results) => {
      figma.ui.postMessage({ type: 'success', results });
    }).catch((error: Error) => {
      figma.ui.postMessage({ type: 'error', message: error.message });
    });
  }

  if (msg.type === 'resize') {
    figma.ui.resize(240, msg.height || 28);
  }

  if (msg.type === 'save-url') {
    await figma.clientStorage.setAsync('bridgeUrl', msg.url);
  }

  if (msg.type === 'load-url') {
    const url = await figma.clientStorage.getAsync('bridgeUrl');
    figma.ui.postMessage({ type: 'url-loaded', url: url || 'ws://localhost:3456' });
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

function executeCommands(commands: Command[]): Promise<CommandResult[]> {
  return new Promise((resolve) => {
    const results: CommandResult[] = [];
    let index = 0;

    function processNext() {
      if (index >= commands.length) {
        resolve(results);
        return;
      }

      const cmd = commands[index];
      executeCommand(cmd).then((result) => {
        // Check if result is already a CommandResult (from GET operations)
        if (result && typeof result === 'object' && 'success' in result) {
          // Merge with command identifiers
          results.push({ ...result as CommandResult, id: cmd.id, _cmdId: cmd._cmdId });
        } else if (result && 'id' in result) {
          // Result is a node - serialize it
          const node = result as BaseNode;
          const serialized = serializeNode(node, 0, { compact: true, excludeVerbose: true });
          results.push({
            success: true,
            id: cmd.id,
            _cmdId: cmd._cmdId,
            nodeId: node.id,
            node: serialized ?? undefined
          });
        } else {
          // Null or other result
          results.push({ success: true, id: cmd.id, _cmdId: cmd._cmdId });
        }
        index++;
        processNext();
      }).catch((error: Error) => {
        results.push({ success: false, id: cmd.id, _cmdId: cmd._cmdId, error: error.message });
        index++;
        processNext();
      });
    }

    processNext();
  });
}

function executeCommand(cmd: Command): Promise<BaseNode | CommandResult | BaseStyle | VariableCollection | Variable | SceneNode[] | null> {
  const nodeCreators: Record<CommandType, () => Promise<BaseNode | CommandResult | BaseStyle | VariableCollection | Variable | SceneNode[] | null>> = {
    // Page creation
    'CREATE_PAGE': () => Promise.resolve(createPage(cmd)),
    'CREATE_PAGE_DIVIDER': () => Promise.resolve(createPageDivider(cmd)),

    // Shape creation
    'CREATE_FRAME': () => Promise.resolve(createFrame(cmd)),
    'CREATE_RECTANGLE': () => Promise.resolve(createRectangle(cmd)),
    'CREATE_ELLIPSE': () => Promise.resolve(createEllipse(cmd)),
    'CREATE_LINE': () => Promise.resolve(createLine(cmd)),
    'CREATE_POLYGON': () => createPolygon(cmd),
    'CREATE_STAR': () => createStar(cmd),
    'CREATE_VECTOR': () => createVector(cmd),
    'CREATE_SECTION': () => createSection(cmd),
    'CREATE_SLICE': () => Promise.resolve(createSlice(cmd)),
    'CREATE_FROM_SVG': () => Promise.resolve(createFromSvg(cmd)),

    // Text creation
    'CREATE_TEXT': () => createText(cmd),
    'SET_TEXT_RANGE_STYLE': () => setTextRangeStyle(cmd),
    'LIST_FONTS': () => listFonts(),

    // Component creation
    'CREATE_COMPONENT': () => Promise.resolve(createComponent(cmd)),
    'CREATE_INSTANCE': () => createInstance(cmd),

    // Modifier operations
    'SET_FILLS': () => Promise.resolve(setFills(cmd)),
    'SET_STROKES': () => Promise.resolve(setStrokes(cmd)),
    'SET_EFFECTS': () => Promise.resolve(setEffects(cmd)),
    'SET_LAYOUT': () => Promise.resolve(setLayout(cmd)),
    'SET_LAYOUT_GRIDS': () => Promise.resolve(setLayoutGrids(cmd)),
    'SET_CONSTRAINTS': () => Promise.resolve(setConstraints(cmd)),
    'SET_BLEND_MODE': () => Promise.resolve(setBlendMode(cmd)),
    'SET_GRADIENT_FILL': () => Promise.resolve(setGradientFill(cmd)),
    'SET_MASK': () => Promise.resolve(setMask(cmd)),
    'SET_TRANSFORM': () => Promise.resolve(setTransform(cmd)),
    'CLONE_NODE': () => Promise.resolve(cloneNode(cmd)),
    'COMPONENT_FROM_NODE': () => Promise.resolve(componentFromNode(cmd)),
    'MOVE_NODE': () => Promise.resolve(moveNode(cmd)),
    'UPDATE_NODE': () => Promise.resolve(updateNode(cmd)),
    'DELETE_NODE': () => Promise.resolve(deleteNode(cmd)),

    // Boolean operations
    'BOOLEAN_UNION': () => Promise.resolve(booleanUnion(cmd)),
    'BOOLEAN_SUBTRACT': () => Promise.resolve(booleanSubtract(cmd)),
    'BOOLEAN_INTERSECT': () => Promise.resolve(booleanIntersect(cmd)),
    'BOOLEAN_EXCLUDE': () => Promise.resolve(booleanExclude(cmd)),
    'FLATTEN_NODE': () => Promise.resolve(flattenNode(cmd)),
    'GROUP_NODES': () => Promise.resolve(groupNodes(cmd)),
    'UNGROUP_NODE': () => Promise.resolve(ungroupNode(cmd)),

    // Viewport operations
    'SET_SELECTION': () => Promise.resolve(setSelectionViewport(cmd)),
    'ZOOM_TO_FIT': () => Promise.resolve(zoomToFit(cmd)),
    'GET_VIEWPORT': () => Promise.resolve(getViewport()),
    'SET_VIEWPORT': () => Promise.resolve(setViewport(cmd)),

    // Query operations
    'GET_NODE_BY_NAME': () => Promise.resolve(getNodeByName(cmd)),
    'GET_SELECTION': () => Promise.resolve(getSelection(cmd)),
    'GET_PAGE_NODES': () => Promise.resolve(getPageNodes(cmd)),
    'GET_NODE_BY_ID': () => Promise.resolve(getNodeById(cmd)),
    'FIND_NODES': () => Promise.resolve(findNodes(cmd)),
    'GET_STYLES': () => Promise.resolve(getStyles(cmd)),
    'GET_COMPONENTS': () => Promise.resolve(getComponents(cmd)),
    'GET_VARIABLES': () => Promise.resolve(getVariables()),

    // Style creation
    'CREATE_TEXT_STYLE': () => createTextStyle(cmd),
    'CREATE_COLOR_STYLE': () => createColorStyle(cmd),
    'CREATE_EFFECT_STYLE': () => createEffectStyle(cmd),
    'CREATE_VARIABLE_COLLECTION': () => createVariableCollection(cmd),
    'CREATE_VARIABLE': () => createVariable(cmd),

    // Images
    'SET_IMAGE_FILL': () => setImageFill(cmd),
    'CREATE_IMAGE': () => createImage(cmd),
    'GET_IMAGE_DATA': () => getImageData(cmd),

    // Export
    'EXPORT_NODE': () => exportNode(cmd),

    'IMPORT_COMPONENT': () => importComponent(cmd),
    STATUS: () => Promise.resolve(null)
  };

  const creator = nodeCreators[cmd.type];
  if (!creator) {
    return Promise.reject(new Error('Unknown command type: ' + cmd.type));
  }

  return creator();
}

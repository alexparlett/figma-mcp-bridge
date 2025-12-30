/// <reference types="@figma/plugin-typings" />

// Claude Design Bridge - Figma Plugin
// This plugin allows Claude to create designs in Figma via JSON commands

import type {
  Command,
  CommandResult,
  UIMessage,
} from "../types/types.js";

// Registry is used by handlers - imported here for type awareness
import "./registry.js";

// Import all handlers
import {
  createPage,
  createFrame,
  createRectangle,
  createEllipse,
  createLine,
  createGroup,
  createText,
  createComponent,
  createInstance,
  setFills,
  setStrokes,
  setEffects,
  setLayout,
  moveNode,
  updateNode,
  deleteNode,
  getNodeByName,
  getSelection,
  getPageNodes,
  getNodeById,
  findNodes,
  getStyles,
  getComponents,
  getVariables,
  createStyle,
  createVariableCollection,
  createVariable,
  exportNode
} from "./handlers/index.js";

// Start collapsed (compact bar)
figma.showUI(__html__, { width: 240, height: 28 });

// Process commands from UI
figma.ui.onmessage = (msg: UIMessage) => {
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
      executeCommand(cmd, undefined).then((result) => {
        // Check if result is already a CommandResult (from GET operations)
        if (result && typeof result === 'object' && 'success' in result) {
          // Merge with command identifiers
          results.push({ ...result as CommandResult, id: cmd.id, _cmdId: cmd._cmdId });
        } else {
          // Result is a node - extract the nodeId
          const nodeId = (result && 'id' in result) ? (result as BaseNode).id : null;
          results.push({ success: true, id: cmd.id, _cmdId: cmd._cmdId, nodeId: nodeId || undefined });
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

// Process nested children recursively
function processChildren(parentNode: SceneNode & ChildrenMixin, children: Command[]): Promise<void> {
  if (!children || !Array.isArray(children) || children.length === 0) {
    return Promise.resolve();
  }

  let index = 0;

  function processNextChild(): Promise<void> {
    if (index >= children.length) {
      return Promise.resolve();
    }

    const childCmd = children[index];

    return executeCommand(childCmd, parentNode).then(() => {
      index++;
      return processNextChild();
    });
  }

  return processNextChild();
}

function executeCommand(cmd: Command, parentNode?: SceneNode): Promise<BaseNode | CommandResult | BaseStyle | VariableCollection | Variable | null> {
  const nodeCreators: Record<string, () => Promise<BaseNode | CommandResult | BaseStyle | VariableCollection | Variable | null>> = {
    'CREATE_PAGE': () => Promise.resolve(createPage(cmd)),
    'CREATE_FRAME': () => Promise.resolve(createFrame(cmd, parentNode)),
    'CREATE_RECTANGLE': () => Promise.resolve(createRectangle(cmd, parentNode)),
    'CREATE_ELLIPSE': () => Promise.resolve(createEllipse(cmd, parentNode)),
    'CREATE_TEXT': () => createText(cmd, parentNode),
    'CREATE_COMPONENT': () => Promise.resolve(createComponent(cmd, parentNode)),
    'CREATE_INSTANCE': () => createInstance(cmd, parentNode),
    'CREATE_GROUP': () => Promise.resolve(createGroup(cmd)),
    'CREATE_LINE': () => Promise.resolve(createLine(cmd, parentNode)),
    'SET_FILLS': () => Promise.resolve(setFills(cmd)),
    'SET_STROKES': () => Promise.resolve(setStrokes(cmd)),
    'SET_EFFECTS': () => Promise.resolve(setEffects(cmd)),
    'SET_LAYOUT': () => Promise.resolve(setLayout(cmd)),
    'CREATE_STYLE': () => createStyle(cmd),
    'CREATE_VARIABLE_COLLECTION': () => Promise.resolve(createVariableCollection(cmd)),
    'CREATE_VARIABLE': () => Promise.resolve(createVariable(cmd)),
    'MOVE_NODE': () => Promise.resolve(moveNode(cmd)),
    'UPDATE_NODE': () => Promise.resolve(updateNode(cmd)),
    'DELETE_NODE': () => Promise.resolve(deleteNode(cmd)),
    'GET_NODE_BY_NAME': () => Promise.resolve(getNodeByName(cmd)),
    'GET_SELECTION': () => Promise.resolve(getSelection(cmd)),
    'GET_PAGE_NODES': () => Promise.resolve(getPageNodes(cmd)),
    'GET_NODE_BY_ID': () => Promise.resolve(getNodeById(cmd)),
    'FIND_NODES': () => Promise.resolve(findNodes(cmd)),
    'GET_STYLES': () => Promise.resolve(getStyles(cmd)),
    'GET_COMPONENTS': () => Promise.resolve(getComponents(cmd)),
    'GET_VARIABLES': () => Promise.resolve(getVariables()),
    'EXPORT_NODE': () => exportNode(cmd)
  };

  const creator = nodeCreators[cmd.type];
  if (!creator) {
    return Promise.reject(new Error('Unknown command type: ' + cmd.type));
  }

  // Create the node, then process any nested children
  return creator().then((createdNode) => {
    if (cmd.children && Array.isArray(cmd.children) && cmd.children.length > 0 && createdNode && 'children' in createdNode) {
      return processChildren(createdNode as SceneNode & ChildrenMixin, cmd.children).then(() => createdNode);
    }
    return createdNode;
  });
}

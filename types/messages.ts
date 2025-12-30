/**
 * Wire protocol types for WebSocket and UI communication.
 */

import type { Command } from './commands.js';
import type { SceneNode } from './nodes.js';

// ============ Tagged Command ============

/** Command with internal tracking ID */
export type TaggedCommand = Command & { _cmdId: string };

// ============ Command Result ============

/** Result from executing a command */
export interface CommandResult {
  success: boolean;
  _cmdId?: string;
  id?: string;
  nodeId?: string;
  error?: string;
  /** Single node result (for GET_NODE_BY_ID, GET_NODE_BY_NAME) */
  node?: SceneNode;
  /** Multiple node results (for GET_PAGE_NODES, FIND_NODES, GET_SELECTION, GET_COMPONENTS) */
  nodes?: SceneNode[];
  /** Generic data for non-node results (styles, variables, viewport, export) */
  data?: Record<string, unknown>;
}

// ============ WebSocket Messages ============

export type WebSocketMessageType = 'commands' | 'results';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  commands?: TaggedCommand[];
  results?: CommandResult[];
}

// ============ UI Messages (Plugin <-> UI) ============

export type UIMessageType = 'execute-commands' | 'success' | 'error' | 'resize' | 'cancel';

export interface UIMessage {
  type: UIMessageType;
  commands?: Command[];
  results?: CommandResult[];
  message?: string;
  height?: number;
}

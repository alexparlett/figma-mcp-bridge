/**
 * Shared types for server-side tool handlers.
 */

import type { Command, CommandType } from "../../../types/commands.js";
import type { CommandResult } from "../../../types/messages.js";
import type { CommandQueue } from "../../queue.js";

/** Result returned from a tool handler to the MCP server */
export interface ToolCallResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

/** Context passed to tool handlers */
export interface HandlerContext {
  queue: CommandQueue;
  getConnectionStatus: () => boolean;
}

/** A handler function that converts tool args to a command (or commands) */
export type CommandHandler = (
  args: Record<string, unknown>
) => Command | Command[];

/** Format a successful creation result */
export function formatCreationResult(
  result: CommandResult,
  commandType: CommandType,
  name?: string
): ToolCallResult {
  const { success, _cmdId, ...responseData } = result;
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          success: true,
          command: commandType,
          name: name || null,
          ...responseData,
        }),
      },
    ],
  };
}

/** Format a query/fetch result as JSON */
export function formatQueryResult(result: CommandResult): ToolCallResult {
  const { success, _cmdId, ...responseData } = result;
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(responseData, null, 2),
      },
    ],
  };
}

/** Format an error result */
export function formatError(error: Error | string): ToolCallResult {
  const message = typeof error === "string" ? error : error.message;
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify({
          success: false,
          error: message,
        }),
      },
    ],
    isError: true,
  };
}

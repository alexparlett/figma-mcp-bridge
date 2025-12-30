/**
 * Shared utilities for tool handlers.
 */

import type { Command, CommandType } from "../../../types/commands.js";

/** Create a command from tool args with proper typing */
export function createCommand<T>(
  type: CommandType,
  args: Record<string, unknown>
): Command {
  const { id, ...data } = args;
  return {
    type,
    id: id as string | undefined,
    data: data as T,
  } as Command;
}

/** Handler function type */
export type ToolHandler = (args: Record<string, unknown>) => Command;

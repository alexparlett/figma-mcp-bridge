import type { Command } from "../../../types/commands.js";

export const toolName = "figma_get_variables";

export function handler(args: Record<string, unknown>): Command {
  return {
    type: "GET_VARIABLES",
    id: args.id as string | undefined,
  } as Command;
}

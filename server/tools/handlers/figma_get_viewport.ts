import type { Command } from "../../../types/commands.js";

export const toolName = "figma_get_viewport";

export function handler(args: Record<string, unknown>): Command {
  return {
    type: "GET_VIEWPORT",
    id: args.id as string | undefined,
  } as Command;
}

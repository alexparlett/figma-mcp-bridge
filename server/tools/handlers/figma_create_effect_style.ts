import type { Command } from "../../../types/commands.js";
import type { StyleData } from "../../../types/data.js";

export const toolName = "figma_create_effect_style";

export function handler(args: Record<string, unknown>): Command {
  const { id, ...data } = args;
  return {
    type: "CREATE_EFFECT_STYLE",
    id: id as string | undefined,
    data: {
      ...data,
      styleType: "EFFECT",
    } as StyleData,
  } as Command;
}

import { createCommand } from "./utils.js";

export const toolName = "figma_list_fonts";

export function handler(args: Record<string, unknown>) {
  return createCommand<undefined>("LIST_FONTS", args);
}

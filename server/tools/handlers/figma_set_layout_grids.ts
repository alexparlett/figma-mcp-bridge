import type { SetLayoutGridsData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_layout_grids";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetLayoutGridsData>("SET_LAYOUT_GRIDS", args);
}

import type { SetSelectionData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_selection";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetSelectionData>("SET_SELECTION", args);
}

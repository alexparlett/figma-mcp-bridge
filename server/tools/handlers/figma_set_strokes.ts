import type { SetStrokesData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_strokes";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetStrokesData>("SET_STROKES", args);
}

import type { SetMaskData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_mask";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetMaskData>("SET_MASK", args);
}

import type { SetGradientFillData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_gradient_fill";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetGradientFillData>("SET_GRADIENT_FILL", args);
}

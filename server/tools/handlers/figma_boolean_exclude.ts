import type { BooleanOperationData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_boolean_exclude";

export function handler(args: Record<string, unknown>) {
  return createCommand<BooleanOperationData>("BOOLEAN_EXCLUDE", args);
}

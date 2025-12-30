import type { BooleanOperationData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_boolean_intersect";

export function handler(args: Record<string, unknown>) {
  return createCommand<BooleanOperationData>("BOOLEAN_INTERSECT", args);
}

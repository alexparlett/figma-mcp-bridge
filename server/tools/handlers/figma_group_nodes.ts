import type { BooleanOperationData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_group_nodes";

export function handler(args: Record<string, unknown>) {
  return createCommand<BooleanOperationData>("GROUP_NODES", args);
}

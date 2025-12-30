import type { CloneNodeData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_clone_node";

export function handler(args: Record<string, unknown>) {
  return createCommand<CloneNodeData>("CLONE_NODE", args);
}

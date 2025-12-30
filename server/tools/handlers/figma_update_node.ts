import type { UpdateNodeData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_update_node";

export function handler(args: Record<string, unknown>) {
  return createCommand<UpdateNodeData>("UPDATE_NODE", args);
}

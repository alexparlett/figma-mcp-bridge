import type { NodeRefData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_delete_node";

export function handler(args: Record<string, unknown>) {
  return createCommand<NodeRefData>("DELETE_NODE", args);
}

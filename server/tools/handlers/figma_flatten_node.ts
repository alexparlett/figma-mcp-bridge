import type { NodeRefData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_flatten_node";

export function handler(args: Record<string, unknown>) {
  return createCommand<NodeRefData>("FLATTEN_NODE", args);
}

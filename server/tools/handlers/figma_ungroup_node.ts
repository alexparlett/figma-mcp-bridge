import type { NodeRefData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_ungroup_node";

export function handler(args: Record<string, unknown>) {
  return createCommand<NodeRefData>("UNGROUP_NODE", args);
}

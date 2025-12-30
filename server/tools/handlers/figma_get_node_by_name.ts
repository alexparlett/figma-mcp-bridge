import type { NodeRefData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_get_node_by_name";

export function handler(args: Record<string, unknown>) {
  return createCommand<NodeRefData>("GET_NODE_BY_NAME", args);
}

import type { FindNodesData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_find_nodes";

export function handler(args: Record<string, unknown>) {
  return createCommand<FindNodesData>("FIND_NODES", args);
}

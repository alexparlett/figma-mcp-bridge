import type { MoveNodeData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_move_node";

export function handler(args: Record<string, unknown>) {
  return createCommand<MoveNodeData>("MOVE_NODE", args);
}

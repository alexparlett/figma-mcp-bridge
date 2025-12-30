import type { ComponentFromNodeData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_component_from_node";

export function handler(args: Record<string, unknown>) {
  return createCommand<ComponentFromNodeData>("COMPONENT_FROM_NODE", args);
}

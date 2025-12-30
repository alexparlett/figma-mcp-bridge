import type { ExportNodeData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_export_node";

export function handler(args: Record<string, unknown>) {
  return createCommand<ExportNodeData>("EXPORT_NODE", args);
}

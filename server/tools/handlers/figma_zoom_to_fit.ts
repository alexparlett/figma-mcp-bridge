import type { NodeRefData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_zoom_to_fit";

export function handler(args: Record<string, unknown>) {
  return createCommand<NodeRefData>("ZOOM_TO_FIT", args);
}

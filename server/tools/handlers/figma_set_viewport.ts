import type { ViewportData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_viewport";

export function handler(args: Record<string, unknown>) {
  return createCommand<ViewportData>("SET_VIEWPORT", args);
}

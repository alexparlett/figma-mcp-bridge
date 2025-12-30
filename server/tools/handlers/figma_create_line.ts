import type { LineData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_line";

export function handler(args: Record<string, unknown>) {
  return createCommand<LineData>("CREATE_LINE", args);
}

import type { RectangleData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_rectangle";

export function handler(args: Record<string, unknown>) {
  return createCommand<RectangleData>("CREATE_RECTANGLE", args);
}

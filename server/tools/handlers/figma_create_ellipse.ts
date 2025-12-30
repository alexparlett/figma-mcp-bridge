import type { EllipseData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_ellipse";

export function handler(args: Record<string, unknown>) {
  return createCommand<EllipseData>("CREATE_ELLIPSE", args);
}

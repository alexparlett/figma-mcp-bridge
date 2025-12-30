import type { PolygonData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_polygon";

export function handler(args: Record<string, unknown>) {
  return createCommand<PolygonData>("CREATE_POLYGON", args);
}

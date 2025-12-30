import type { SvgImportData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_from_svg";

export function handler(args: Record<string, unknown>) {
  return createCommand<SvgImportData>("CREATE_FROM_SVG", args);
}

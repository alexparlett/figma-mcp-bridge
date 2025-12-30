import type { ImportComponentData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_import_component";

export function handler(args: Record<string, unknown>) {
  return createCommand<ImportComponentData>("IMPORT_COMPONENT", args);
}

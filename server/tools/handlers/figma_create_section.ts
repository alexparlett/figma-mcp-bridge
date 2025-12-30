import type { SectionData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_section";

export function handler(args: Record<string, unknown>) {
  return createCommand<SectionData>("CREATE_SECTION", args);
}

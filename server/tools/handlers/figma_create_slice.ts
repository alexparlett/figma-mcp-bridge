import type { SliceData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_slice";

export function handler(args: Record<string, unknown>) {
  return createCommand<SliceData>("CREATE_SLICE", args);
}

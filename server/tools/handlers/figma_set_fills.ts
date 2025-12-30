import type { SetFillsData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_fills";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetFillsData>("SET_FILLS", args);
}

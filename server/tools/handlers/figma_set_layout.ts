import type { SetLayoutData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_layout";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetLayoutData>("SET_LAYOUT", args);
}

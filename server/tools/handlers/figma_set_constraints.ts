import type { SetConstraintsData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_constraints";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetConstraintsData>("SET_CONSTRAINTS", args);
}

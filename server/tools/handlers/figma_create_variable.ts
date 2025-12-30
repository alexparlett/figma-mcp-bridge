import type { VariableData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_variable";

export function handler(args: Record<string, unknown>) {
  return createCommand<VariableData>("CREATE_VARIABLE", args);
}

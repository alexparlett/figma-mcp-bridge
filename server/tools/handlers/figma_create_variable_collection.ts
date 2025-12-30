import type { VariableCollectionData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_variable_collection";

export function handler(args: Record<string, unknown>) {
  return createCommand<VariableCollectionData>("CREATE_VARIABLE_COLLECTION", args);
}

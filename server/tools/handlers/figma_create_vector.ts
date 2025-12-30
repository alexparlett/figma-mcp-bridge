import type { VectorData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_vector";

export function handler(args: Record<string, unknown>) {
  return createCommand<VectorData>("CREATE_VECTOR", args);
}

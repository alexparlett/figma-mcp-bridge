import type { QueryData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_get_components";

export function handler(args: Record<string, unknown>) {
  return createCommand<QueryData>("GET_COMPONENTS", args);
}

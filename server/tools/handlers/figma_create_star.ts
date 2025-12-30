import type { StarData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_star";

export function handler(args: Record<string, unknown>) {
  return createCommand<StarData>("CREATE_STAR", args);
}

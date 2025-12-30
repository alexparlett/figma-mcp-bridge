import type { SetTransformData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_transform";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetTransformData>("SET_TRANSFORM", args);
}

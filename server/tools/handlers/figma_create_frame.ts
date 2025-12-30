import type { FrameData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_frame";

export function handler(args: Record<string, unknown>) {
  return createCommand<FrameData>("CREATE_FRAME", args);
}

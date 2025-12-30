import type { SetBlendModeData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_blend_mode";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetBlendModeData>("SET_BLEND_MODE", args);
}

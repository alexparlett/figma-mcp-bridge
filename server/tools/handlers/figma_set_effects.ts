import type { SetEffectsData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_effects";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetEffectsData>("SET_EFFECTS", args);
}

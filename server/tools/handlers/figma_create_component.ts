import type { ComponentData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_component";

export function handler(args: Record<string, unknown>) {
  return createCommand<ComponentData>("CREATE_COMPONENT", args);
}

import type { InstanceData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_instance";

export function handler(args: Record<string, unknown>) {
  return createCommand<InstanceData>("CREATE_INSTANCE", args);
}

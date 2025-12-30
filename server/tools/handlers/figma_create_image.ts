import type { CreateImageData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_image";

export function handler(args: Record<string, unknown>) {
  return createCommand<CreateImageData>("CREATE_IMAGE", args);
}

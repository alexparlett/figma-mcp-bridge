import type { SetImageFillData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_image_fill";

export function handler(args: Record<string, unknown>) {
  return createCommand<SetImageFillData>("SET_IMAGE_FILL", args);
}

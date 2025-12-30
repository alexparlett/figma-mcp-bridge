import type { TextData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_text";

export function handler(args: Record<string, unknown>) {
  return createCommand<TextData>("CREATE_TEXT", args);
}

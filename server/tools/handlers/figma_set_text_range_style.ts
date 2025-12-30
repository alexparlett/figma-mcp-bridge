import type { TextRangeStyleData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_set_text_range_style";

export function handler(args: Record<string, unknown>) {
  return createCommand<TextRangeStyleData>("SET_TEXT_RANGE_STYLE", args);
}

import type { PageDividerData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_page_divider";

export function handler(args: Record<string, unknown>) {
  return createCommand<PageDividerData>("CREATE_PAGE_DIVIDER", args);
}

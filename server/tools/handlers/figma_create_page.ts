import type { PageData } from "../../../types/data.js";
import { createCommand } from "./utils.js";

export const toolName = "figma_create_page";

export function handler(args: Record<string, unknown>) {
  return createCommand<PageData>("CREATE_PAGE", args);
}

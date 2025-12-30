/// <reference types="@figma/plugin-typings" />

import type { Command, PageData } from "../../types/types.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal } from "../utils.js";

// ============ PAGE ============
export function createPage(cmd: Command): PageNode {
  const d = (cmd.data || {}) as PageData;
  const page = figma.createPage();

  page.name = defaultVal(d.name, 'New Page');

  if (cmd.id) nodeRegistry.set(cmd.id, page);
  return page;
}

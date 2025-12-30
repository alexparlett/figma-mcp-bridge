/// <reference types="@figma/plugin-typings" />

/**
 * Page handlers for Figma MCP Bridge.
 */

import type { Command } from "../../types/commands.js";
import type { PageData, PageDividerData } from "../../types/data.js";
import { defaultVal, registerNode } from "../utils.js";

// ============ CREATE PAGE ============

export async function createPage(cmd: Command): Promise<PageNode> {
  const d = (cmd.data || {}) as PageData;
  const page = figma.createPage();

  page.name = defaultVal(d.name, 'New Page');

  registerNode(cmd, page);
  return page;
}

// ============ CREATE PAGE DIVIDER ============

export async function createPageDivider(cmd: Command): Promise<PageNode> {
  const d = (cmd.data || {}) as PageDividerData;
  const divider = figma.createPageDivider();

  divider.name = defaultVal(d.name, '───────────');

  registerNode(cmd, divider);
  return divider;
}

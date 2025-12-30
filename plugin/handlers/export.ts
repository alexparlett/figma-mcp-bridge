/// <reference types="@figma/plugin-typings" />

/**
 * Export handlers for Figma MCP Bridge.
 */

import type { Command } from "../../types/commands.js";
import type { CommandResult } from "../../types/messages.js";
import type { ExportNodeData } from "../../types/data.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal, resolveNode } from "../utils.js";
import { serializeNode } from "./queries.js";

// ============ EXPORT NODE ============

export async function exportNode(cmd: Command): Promise<CommandResult> {
  const d = (cmd.data || {}) as ExportNodeData;

  let node: BaseNode | null = null;

  if (d.nodeId) {
    node = resolveNode(d.nodeId);
  } else if (d.name) {
    node = figma.currentPage.findOne(n => n.name === d.name);
  } else if (cmd.id) {
    node = nodeRegistry.get(cmd.id) || null;
  }

  if (!node) {
    throw new Error('Node not found');
  }

  const format = defaultVal(d.format, 'PNG');
  const scale = defaultVal(d.scale, 1);

  if (format === 'JSON') {
    return {
      success: true,
      data: {
        format: 'JSON',
        content: serializeNode(node, 0, { maxDepth: 10, compact: false, excludeVerbose: false })
      }
    };
  }

  const exportNode = node as ExportMixin;
  const settings: ExportSettings = {
    format: format as 'PNG' | 'JPG' | 'SVG' | 'PDF',
    constraint: { type: 'SCALE', value: scale }
  };

  const bytes = await exportNode.exportAsync(settings);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  const sceneNode = node as SceneNode;
  return {
    success: true,
    data: {
      format,
      content: base64,
      width: sceneNode.width * scale,
      height: sceneNode.height * scale
    }
  };
}

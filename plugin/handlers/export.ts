/// <reference types="@figma/plugin-typings" />

import type { Command, CommandResult, ExportNodeData } from "../../types/types.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal } from "../utils.js";
import { serializeNode } from "./queries.js";

// ============ EXPORT NODE ============
export function exportNode(cmd: Command): Promise<CommandResult> {
  const d = (cmd.data || {}) as ExportNodeData;

  return new Promise((resolve, reject) => {
    let node: BaseNode | null = null;

    if (d.nodeId) {
      node = figma.getNodeById(d.nodeId);
    } else if (d.name) {
      node = figma.currentPage.findOne(n => n.name === d.name);
    } else if (cmd.id) {
      node = nodeRegistry.get(cmd.id) || null;
    }

    if (!node) {
      reject(new Error('Node not found'));
      return;
    }

    const format = defaultVal(d.format, 'PNG');
    const scale = defaultVal(d.scale, 1);

    if (format === 'JSON') {
      resolve({
        success: true,
        data: {
          format: 'JSON',
          content: serializeNode(node, 0, 10)
        }
      });
      return;
    }

    const exportNode = node as ExportMixin;
    const settings: ExportSettings = {
      format: format as 'PNG' | 'JPG' | 'SVG' | 'PDF',
      constraint: { type: 'SCALE', value: scale }
    };

    exportNode.exportAsync(settings).then(bytes => {
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      const sceneNode = node as SceneNode;
      resolve({
        success: true,
        data: {
          format,
          content: base64,
          width: sceneNode.width * scale,
          height: sceneNode.height * scale
        }
      });
    }).catch(reject);
  });
}

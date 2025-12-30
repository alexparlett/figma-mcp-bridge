/// <reference types="@figma/plugin-typings" />

import type { Command, TextData } from "../../types/types.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal, applyFills, solidPaint, getParentNode } from "../utils.js";

// ============ TEXT ============
export function createText(cmd: Command, _parentNode?: SceneNode): Promise<TextNode> {
  const d = (cmd.data || {}) as TextData;

  return new Promise((resolve, reject) => {
    const text = figma.createText();
    text.name = defaultVal(d.name, 'Text');
    text.x = defaultVal(d.x, 0);
    text.y = defaultVal(d.y, 0);

    const fontFamily = defaultVal(d.fontFamily, 'Inter');
    const fontStyle = defaultVal(d.fontStyle, 'Regular');

    figma.loadFontAsync({ family: fontFamily, style: fontStyle }).then(() => {
      text.fontName = { family: fontFamily, style: fontStyle };
      text.characters = defaultVal(d.text, '');

      if (d.fontSize) text.fontSize = d.fontSize;
      if (d.lineHeight) {
        if (typeof d.lineHeight === 'number') {
          text.lineHeight = { value: d.lineHeight, unit: 'PIXELS' };
        } else {
          text.lineHeight = d.lineHeight as LineHeight;
        }
      }
      if (d.letterSpacing) {
        text.letterSpacing = { value: d.letterSpacing, unit: 'PIXELS' };
      }
      if (d.textCase) text.textCase = d.textCase;
      if (d.textAlignHorizontal) text.textAlignHorizontal = d.textAlignHorizontal;
      if (d.textAlignVertical) text.textAlignVertical = d.textAlignVertical;

      if (d.fills) {
        applyFills(text, d.fills);
      } else if (d.fill) {
        text.fills = solidPaint(d.fill);
      }

      if (d.width) {
        text.resize(d.width, text.height);
        text.textAutoResize = defaultVal(d.autoResize, 'HEIGHT');
      }

      const parent = getParentNode(d as Record<string, unknown>, _parentNode);
      if (parent) {
        parent.appendChild(text);
      }

      if (cmd.id) nodeRegistry.set(cmd.id, text);
      resolve(text);
    }).catch(() => {
      // Fallback to Inter if font not available
      figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
        text.fontName = { family: 'Inter', style: 'Regular' };
        text.characters = defaultVal(d.text, '');

        if (d.fontSize) text.fontSize = d.fontSize;
        if (d.fills) {
          applyFills(text, d.fills);
        } else if (d.fill) {
          text.fills = solidPaint(d.fill);
        }

        const parent = getParentNode(d as Record<string, unknown>, _parentNode);
        if (parent) {
          parent.appendChild(text);
        }

        if (cmd.id) nodeRegistry.set(cmd.id, text);
        resolve(text);
      }).catch(reject);
    });
  });
}

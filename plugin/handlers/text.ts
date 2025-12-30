/// <reference types="@figma/plugin-typings" />

/**
 * Text creation handlers for Figma MCP Bridge.
 */

import type { Command } from "../../types/commands.js";
import type { CommandResult } from "../../types/messages.js";
import type { TextData, TextRangeStyleData } from "../../types/data.js";
import {
  defaultVal,
  applyFills,
  applyEffects,
  getParent,
  registerNode,
  findTextStyle,
  parseColorInput,
  resolveNode,
} from "../utils.js";

// ============ CREATE TEXT ============

export async function createText(cmd: Command, parentNode?: SceneNode): Promise<TextNode> {
  const d = (cmd.data || {}) as TextData;
  const text = figma.createText();

  // Load font first
  const fontFamily = d.fontFamily || 'Inter';
  const fontStyle = d.fontStyle || 'Regular';

  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
  } catch {
    // Fallback to Inter if font not available
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  }

  text.name = defaultVal(d.name, 'Text');
  text.x = defaultVal(d.x, 0);
  text.y = defaultVal(d.y, 0);

  // Set characters
  text.characters = d.characters || d.text || 'Text';

  // Font properties
  text.fontName = { family: fontFamily, style: fontStyle };
  if (d.fontSize !== undefined) text.fontSize = d.fontSize;

  // Line height
  if (d.lineHeight !== undefined) {
    if (typeof d.lineHeight === 'number') {
      text.lineHeight = { value: d.lineHeight, unit: 'PIXELS' };
    } else {
      text.lineHeight = d.lineHeight;
    }
  }

  // Letter spacing
  if (d.letterSpacing !== undefined) {
    if (typeof d.letterSpacing === 'number') {
      text.letterSpacing = { value: d.letterSpacing, unit: 'PIXELS' };
    } else {
      text.letterSpacing = d.letterSpacing;
    }
  }

  // Paragraph spacing
  if (d.paragraphSpacing !== undefined) text.paragraphSpacing = d.paragraphSpacing;
  if (d.paragraphIndent !== undefined) text.paragraphIndent = d.paragraphIndent;

  // Text styling
  if (d.textCase) text.textCase = d.textCase;
  if (d.textDecoration) text.textDecoration = d.textDecoration;

  // Text alignment
  if (d.textAlignHorizontal) text.textAlignHorizontal = d.textAlignHorizontal;
  if (d.textAlignVertical) text.textAlignVertical = d.textAlignVertical;

  // Auto resize
  const autoResize = d.textAutoResize || d.autoResize;
  if (autoResize) text.textAutoResize = autoResize;

  // Text truncation
  if (d.textTruncation) text.textTruncation = d.textTruncation;
  if (d.maxLines !== undefined) text.maxLines = d.maxLines;

  // Width (for fixed-width text)
  if (d.width !== undefined) {
    text.resize(d.width, text.height);
    if (!autoResize) {
      text.textAutoResize = 'HEIGHT';
    }
  }

  // Height
  if (d.height !== undefined && d.width !== undefined) {
    text.resize(d.width, d.height);
  }

  // Text style reference
  if (d.textStyleId) {
    const style = findTextStyle(d.textStyleId);
    if (style) {
      await text.setTextStyleIdAsync(style.id);
    }
  }

  // Fills
  await applyFills(text, d);

  // Effects
  await applyEffects(text, d);

  // Blend mode and opacity
  if (d.blendMode) text.blendMode = d.blendMode;
  if (d.opacity !== undefined) text.opacity = d.opacity;
  if (d.visible !== undefined) text.visible = d.visible;
  if (d.locked !== undefined) text.locked = d.locked;
  if (d.rotation !== undefined) text.rotation = d.rotation;

  // Constraints
  if (d.constraints) {
    text.constraints = d.constraints;
  }

  // Hyperlink
  if (d.hyperlink) {
    text.hyperlink = d.hyperlink;
  }

  // Parent
  const parent = getParent(d, parentNode);
  if (parent) parent.appendChild(text);

  registerNode(cmd, text);
  return text;
}

// ============ SET TEXT RANGE STYLE ============

export async function setTextRangeStyle(cmd: Command): Promise<CommandResult> {
  const d = (cmd.data || {}) as TextRangeStyleData;
  const nodeId = d.nodeId || d.name;

  if (!nodeId) {
    throw new Error('nodeId or name is required');
  }

  const node = resolveNode(nodeId);
  if (!node || node.type !== 'TEXT') {
    throw new Error('Text node not found: ' + nodeId);
  }

  const textNode = node as TextNode;

  for (const range of d.ranges) {
    const start = range.start ?? 0;
    const end = range.end ?? textNode.characters.length;

    // Validate range
    if (start < 0 || end > textNode.characters.length || start >= end) {
      throw new Error(`Invalid range: ${start}-${end} for text of length ${textNode.characters.length}`);
    }

    // Load font for this range if specified
    if (range.fontFamily || range.fontStyle) {
      const fontFamily = range.fontFamily || 'Inter';
      const fontStyle = range.fontStyle || 'Regular';
      try {
        await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
        textNode.setRangeFontName(start, end, { family: fontFamily, style: fontStyle });
      } catch {
        console.warn(`Could not load font ${fontFamily} ${fontStyle}, skipping font change`);
      }
    }

    // Font size
    if (range.fontSize !== undefined) {
      textNode.setRangeFontSize(start, end, range.fontSize);
    }

    // Fill color
    if (range.fill) {
      textNode.setRangeFills(start, end, [{
        type: 'SOLID',
        color: parseColorInput(range.fill),
        opacity: 1,
        blendMode: 'NORMAL'
      }]);
    }

    // Letter spacing
    if (range.letterSpacing !== undefined) {
      if (typeof range.letterSpacing === 'number') {
        textNode.setRangeLetterSpacing(start, end, { value: range.letterSpacing, unit: 'PIXELS' });
      } else {
        textNode.setRangeLetterSpacing(start, end, { value: range.letterSpacing.value, unit: range.letterSpacing.unit });
      }
    }

    // Line height
    if (range.lineHeight !== undefined) {
      if (typeof range.lineHeight === 'number') {
        textNode.setRangeLineHeight(start, end, { value: range.lineHeight, unit: 'PIXELS' });
      } else if (range.lineHeight.unit === 'AUTO') {
        textNode.setRangeLineHeight(start, end, { unit: 'AUTO' });
      } else {
        textNode.setRangeLineHeight(start, end, { value: range.lineHeight.value!, unit: range.lineHeight.unit });
      }
    }

    // Text decoration
    if (range.textDecoration) {
      textNode.setRangeTextDecoration(start, end, range.textDecoration);
    }

    // Text case
    if (range.textCase) {
      textNode.setRangeTextCase(start, end, range.textCase);
    }

    // Hyperlink
    if (range.hyperlink) {
      textNode.setRangeHyperlink(start, end, range.hyperlink);
    }
  }

  return { success: true, nodeId: textNode.id };
}

// ============ LIST FONTS ============

export async function listFonts(): Promise<CommandResult> {
  const fonts = await figma.listAvailableFontsAsync();

  // Group by family
  const families: Record<string, string[]> = {};
  for (const font of fonts) {
    if (!families[font.fontName.family]) {
      families[font.fontName.family] = [];
    }
    families[font.fontName.family].push(font.fontName.style);
  }

  return {
    success: true,
    data: {
      fonts: Object.entries(families).map(([family, styles]) => ({
        family,
        styles
      }))
    }
  };
}

/// <reference types="@figma/plugin-typings" />

/**
 * Style and variable handlers for Figma MCP Bridge.
 */

import type { Command } from "../../types/commands.js";
import type { StyleData, VariableCollectionData, VariableData } from "../../types/data.js";
import { styleRegistry } from "../registry.js";
import { defaultVal, parseColorInput, parseHexColor, convertEffectInputs } from "../utils.js";

// ============ CREATE TEXT STYLE ============

export async function createTextStyle(cmd: Command): Promise<TextStyle> {
  const d = (cmd.data || {}) as StyleData;

  const style = figma.createTextStyle();
  style.name = d.name;

  const fontFamily = defaultVal(d.fontFamily, 'Inter');
  const fontStyle = defaultVal(d.fontStyle, 'Regular');

  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
  } catch {
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  }

  style.fontName = { family: fontFamily, style: fontStyle };
  style.fontSize = defaultVal(d.fontSize, 16);

  if (d.lineHeight !== undefined) {
    if (typeof d.lineHeight === 'number') {
      style.lineHeight = { value: d.lineHeight, unit: 'PIXELS' };
    } else {
      style.lineHeight = d.lineHeight;
    }
  }

  if (d.letterSpacing !== undefined) {
    if (typeof d.letterSpacing === 'number') {
      style.letterSpacing = { value: d.letterSpacing, unit: 'PIXELS' };
    } else {
      style.letterSpacing = d.letterSpacing;
    }
  }

  if (d.paragraphSpacing !== undefined) style.paragraphSpacing = d.paragraphSpacing;
  if (d.textCase) style.textCase = d.textCase;
  if (d.textDecoration) style.textDecoration = d.textDecoration;

  if (cmd.id) styleRegistry.set(cmd.id, style);
  return style;
}

// ============ CREATE COLOR STYLE ============

export async function createColorStyle(cmd: Command): Promise<PaintStyle> {
  const d = (cmd.data || {}) as StyleData;

  const style = figma.createPaintStyle();
  style.name = d.name;

  if (d.color) {
    style.paints = [{
      type: 'SOLID',
      color: parseColorInput(d.color),
      opacity: 1,
      blendMode: 'NORMAL'
    }];
  }

  if (cmd.id) styleRegistry.set(cmd.id, style);
  return style;
}

// ============ CREATE EFFECT STYLE ============

export async function createEffectStyle(cmd: Command): Promise<EffectStyle> {
  const d = (cmd.data || {}) as StyleData;

  const style = figma.createEffectStyle();
  style.name = d.name;

  if (d.effects && d.effects.length > 0) {
    style.effects = convertEffectInputs(d.effects);
  }

  if (cmd.id) styleRegistry.set(cmd.id, style);
  return style;
}

// ============ CREATE VARIABLE COLLECTION ============

export async function createVariableCollection(cmd: Command): Promise<VariableCollection> {
  const d = (cmd.data || {}) as VariableCollectionData;
  const collection = figma.variables.createVariableCollection(d.name);

  if (d.modes && d.modes.length > 0) {
    collection.renameMode(collection.modes[0].modeId, d.modes[0]);

    for (let i = 1; i < d.modes.length; i++) {
      collection.addMode(d.modes[i]);
    }
  }

  if (cmd.id) styleRegistry.set(cmd.id, collection);
  return collection;
}

// ============ CREATE VARIABLE ============

export async function createVariable(cmd: Command): Promise<Variable> {
  const d = (cmd.data || {}) as VariableData;
  const collectionId = d.collectionId;
  const collection = styleRegistry.get(collectionId) as unknown as VariableCollection;

  if (!collection) {
    throw new Error('Collection not found: ' + collectionId);
  }

  const resolvedType = defaultVal(d.resolvedType, 'COLOR') as VariableResolvedDataType;
  const variable = figma.variables.createVariable(d.name, collection, resolvedType);

  if (d.values) {
    for (const [modeName, value] of Object.entries(d.values)) {
      const mode = collection.modes.find(m => m.name === modeName);

      if (mode) {
        if (resolvedType === 'COLOR' && typeof value === 'string') {
          variable.setValueForMode(mode.modeId, parseHexColor(value));
        } else {
          variable.setValueForMode(mode.modeId, value as VariableValue);
        }
      }
    }
  }

  if (cmd.id) styleRegistry.set(cmd.id, variable);
  return variable;
}

/// <reference types="@figma/plugin-typings" />

import type { Command, StyleData, VariableCollectionData, VariableData } from "../../types/types.js";
import { nodeRegistry } from "../registry.js";
import { defaultVal, solidPaint, parseColor } from "../utils.js";

// ============ CREATE STYLE ============
export function createStyle(cmd: Command): Promise<BaseStyle> {
  const d = (cmd.data || {}) as StyleData;

  return new Promise((resolve, reject) => {
    const styleType = d.styleType;

    if (styleType === 'TEXT') {
      const style = figma.createTextStyle();
      style.name = d.name;

      const fontFamily = defaultVal(d.fontFamily, 'Inter');
      const fontStyle = defaultVal(d.fontStyle, 'Regular');

      figma.loadFontAsync({ family: fontFamily, style: fontStyle }).then(() => {
        style.fontName = { family: fontFamily, style: fontStyle };
        style.fontSize = defaultVal(d.fontSize, 16);
        if (d.lineHeight && typeof d.lineHeight === 'number') {
          style.lineHeight = { value: d.lineHeight, unit: 'PIXELS' };
        }
        if (d.letterSpacing) {
          style.letterSpacing = { value: d.letterSpacing, unit: 'PIXELS' };
        }
        if (d.textCase) {
          style.textCase = d.textCase;
        }

        if (cmd.id) nodeRegistry.set(cmd.id, style as unknown as BaseNode);
        resolve(style);
      }).catch(reject);
      return;
    }

    if (styleType === 'PAINT') {
      const paintStyle = figma.createPaintStyle();
      paintStyle.name = d.name;
      paintStyle.paints = solidPaint(d.color!);

      if (cmd.id) nodeRegistry.set(cmd.id, paintStyle as unknown as BaseNode);
      resolve(paintStyle);
      return;
    }

    if (styleType === 'EFFECT') {
      const effectStyle = figma.createEffectStyle();
      effectStyle.name = d.name;
      effectStyle.effects = defaultVal(d.effects, []) as Effect[];

      if (cmd.id) nodeRegistry.set(cmd.id, effectStyle as unknown as BaseNode);
      resolve(effectStyle);
      return;
    }

    reject(new Error('Unknown style type: ' + styleType));
  });
}

// ============ CREATE VARIABLE COLLECTION ============
export function createVariableCollection(cmd: Command): VariableCollection {
  const d = (cmd.data || {}) as VariableCollectionData;
  const collection = figma.variables.createVariableCollection(d.name);

  if (d.modes && d.modes.length > 0) {
    collection.renameMode(collection.modes[0].modeId, d.modes[0]);

    for (let i = 1; i < d.modes.length; i++) {
      collection.addMode(d.modes[i]);
    }
  }

  if (cmd.id) nodeRegistry.set(cmd.id, collection as unknown as BaseNode);
  return collection;
}

// ============ CREATE VARIABLE ============
export function createVariable(cmd: Command): Variable {
  const d = (cmd.data || {}) as VariableData;
  const collectionId = d.collectionId;
  const collection = nodeRegistry.get(collectionId) as unknown as VariableCollection;

  if (!collection) {
    throw new Error('Collection not found: ' + collectionId);
  }

  const resolvedType = defaultVal(d.resolvedType, 'COLOR') as VariableResolvedDataType;
  const variable = figma.variables.createVariable(d.name, collection, resolvedType);

  if (d.values) {
    const modeNames = Object.keys(d.values);
    for (const modeName of modeNames) {
      const value = d.values[modeName];
      const mode = collection.modes.find(m => m.name === modeName);

      if (mode) {
        if (resolvedType === 'COLOR') {
          variable.setValueForMode(mode.modeId, parseColor(value as string));
        } else {
          variable.setValueForMode(mode.modeId, value as VariableValue);
        }
      }
    }
  }

  if (cmd.id) nodeRegistry.set(cmd.id, variable as unknown as BaseNode);
  return variable;
}

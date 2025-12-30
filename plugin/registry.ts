/// <reference types="@figma/plugin-typings" />

// Node and style registries for referencing created elements

export const nodeRegistry = new Map<string, BaseNode>();
export const styleRegistry = new Map<string, PaintStyle>();

/// <reference types="@figma/plugin-typings" />

// Node and style registries for referencing created elements

export const nodeRegistry = new Map<string, BaseNode>();

// Style registry can hold any style type, variable collection, or variable
export const styleRegistry = new Map<string, BaseStyle | VariableCollection | Variable>();

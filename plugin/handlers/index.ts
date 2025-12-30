/// <reference types="@figma/plugin-typings" />

// Re-export all handlers
export { createPage } from './page.js';
export { createFrame, createRectangle, createEllipse, createLine, createGroup } from './shapes.js';
export { createText } from './text.js';
export { createComponent, createInstance } from './components.js';
export { setFills, setStrokes, setEffects, setLayout, moveNode, updateNode, deleteNode } from './modifiers.js';
export { getNodeByName, getSelection, getPageNodes, getNodeById, findNodes, getStyles, getComponents, getVariables } from './queries.js';
export { createStyle, createVariableCollection, createVariable } from './styles.js';
export { exportNode } from './export.js';

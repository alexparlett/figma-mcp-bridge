/// <reference types="@figma/plugin-typings" />

// Re-export all handlers
export { createPage, createPageDivider } from './page.js';
export {
  createFrame,
  createRectangle,
  createEllipse,
  createLine,
  createGroup,
  createPolygon,
  createStar,
  createVector,
  createSection,
  createSlice,
  createFromSvg
} from './shapes.js';
export { createText, setTextRangeStyle, listFonts } from './text.js';
export { createComponent, createInstance, importComponent } from './components.js';
export {
  setFills,
  setStrokes,
  setEffects,
  setLayout,
  setLayoutGrids,
  setConstraints,
  setBlendMode,
  setGradientFill,
  setMask,
  setTransform,
  cloneNode,
  componentFromNode,
  moveNode,
  updateNode,
  deleteNode
} from './modifiers.js';
export { getNodeByName, getSelection, getPageNodes, getNodeById, findNodes, getStyles, getComponents, getVariables } from './queries.js';
export { createTextStyle, createColorStyle, createEffectStyle, createVariableCollection, createVariable } from './styles.js';
export { exportNode } from './export.js';
export {
  booleanUnion,
  booleanSubtract,
  booleanIntersect,
  booleanExclude,
  flattenNode,
  groupNodes,
  ungroupNode
} from './boolean.js';
export {
  setSelection,
  zoomToFit,
  getViewport,
  setViewport
} from './viewport.js';
export {
  setImageFill,
  createImage,
  getImageData
} from './images.js';

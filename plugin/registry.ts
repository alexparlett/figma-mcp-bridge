/// <reference types="@figma/plugin-typings" />

// Node and style registries for referencing created elements

export const nodeRegistry = new Map<string, BaseNode>();

// Style registry can hold any style type, variable collection, or variable
export const styleRegistry = new Map<string, BaseStyle | VariableCollection | Variable>();

// Populate node registry recursively
function registerNodesRecursively(node: BaseNode): void {
  nodeRegistry.set(node.id, node);
  if ('children' in node) {
    for (const child of (node as ChildrenMixin).children) {
      registerNodesRecursively(child);
    }
  }
}

// Initialize registries with existing document content
export async function initializeRegistries(): Promise<void> {
  // Clear existing registries
  nodeRegistry.clear();
  styleRegistry.clear();

  // Register all nodes from current page
  for (const node of figma.currentPage.children) {
    registerNodesRecursively(node);
  }

  // Register all local styles (using async APIs)
  const [paintStyles, textStyles, effectStyles, gridStyles] = await Promise.all([
    figma.getLocalPaintStylesAsync(),
    figma.getLocalTextStylesAsync(),
    figma.getLocalEffectStylesAsync(),
    figma.getLocalGridStylesAsync(),
  ]);

  for (const style of paintStyles) {
    styleRegistry.set(style.id, style);
  }
  for (const style of textStyles) {
    styleRegistry.set(style.id, style);
  }
  for (const style of effectStyles) {
    styleRegistry.set(style.id, style);
  }
  for (const style of gridStyles) {
    styleRegistry.set(style.id, style);
  }

  // Register all local components
  const components = figma.root.findAllWithCriteria({ types: ['COMPONENT'] });
  for (const component of components) {
    nodeRegistry.set(component.id, component);
  }

  // Register variable collections and variables
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  for (const collection of collections) {
    styleRegistry.set(collection.id, collection);
    for (const variableId of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(variableId);
      if (variable) {
        styleRegistry.set(variable.id, variable);
      }
    }
  }

  console.log(`Registry initialized: ${nodeRegistry.size} nodes, ${styleRegistry.size} styles/variables`);
}

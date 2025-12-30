/// <reference types="@figma/plugin-typings" />

// Claude Design Bridge - Figma Plugin
// This plugin allows Claude to create designs in Figma via JSON commands

import type {
  Command,
  CommandResult,
  UIMessage,
  FillConfig,
  StrokeConfig,
  SerializedNode,
} from "../types/types.js";

// Start collapsed (compact bar)
figma.showUI(__html__, { width: 240, height: 28 });

// Store created nodes for reference
const nodeRegistry = new Map<string, BaseNode>();

// Store created styles for reference
const styleRegistry = new Map<string, PaintStyle>();

// Helper function for default values
function defaultVal<T>(val: T | undefined | null, defaultValue: T): T {
  return (val !== undefined && val !== null) ? val : defaultValue;
}

// Color parsing utility
function parseColor(color: string | RGB): RGB {
  if (typeof color === 'string') {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return { r, g, b };
    }
  }
  return color as RGB;
}

// Create solid paint from color
function solidPaint(color: string, opacity?: number): SolidPaint[] {
  return [{
    type: 'SOLID',
    color: parseColor(color),
    opacity: defaultVal(opacity, 1)
  }];
}

// Find a paint style by name
function findPaintStyle(styleName: string): PaintStyle | null {
  // Check registry first
  if (styleRegistry.has(styleName)) {
    return styleRegistry.get(styleName)!;
  }
  // Search local styles
  const styles = figma.getLocalPaintStyles();
  for (const style of styles) {
    if (style.name === styleName) {
      styleRegistry.set(styleName, style);
      return style;
    }
  }
  return null;
}

// Apply fill to a node - either by style name or color
function applyFill(node: GeometryMixin & MinimalFillsMixin, fillConfig: FillConfig): void {
  if (fillConfig.style) {
    const style = findPaintStyle(fillConfig.style);
    if (style) {
      (node as SceneNode & { fillStyleId: string }).fillStyleId = style.id;
      return;
    }
  }
  if (fillConfig.color) {
    node.fills = solidPaint(fillConfig.color, fillConfig.opacity);
  }
}

// Apply fills array to a node
function applyFills(node: GeometryMixin & MinimalFillsMixin, fills: FillConfig[]): void {
  if (!fills || fills.length === 0) return;

  // If first fill has a style, apply it
  if (fills[0].style) {
    const style = findPaintStyle(fills[0].style);
    if (style) {
      (node as SceneNode & { fillStyleId: string }).fillStyleId = style.id;
      return;
    }
  }

  // Otherwise apply as solid colors
  node.fills = fills.map(f => ({
    type: 'SOLID' as const,
    color: parseColor(f.color),
    opacity: defaultVal(f.opacity, 1)
  }));
}

// Apply stroke to a node
function applyStroke(node: GeometryMixin & MinimalStrokesMixin, strokeConfig: string | StrokeConfig): void {
  if (!strokeConfig) return;

  // Handle string shorthand
  let config: StrokeConfig;
  if (typeof strokeConfig === 'string') {
    config = { color: strokeConfig, weight: 1 };
  } else {
    config = strokeConfig;
  }

  if (config.color) {
    node.strokes = solidPaint(config.color, config.opacity);
  }

  if (config.weight !== undefined) {
    node.strokeWeight = config.weight;
  }

  if (config.align) {
    node.strokeAlign = config.align;
  }

  if (config.dashPattern) {
    node.dashPattern = config.dashPattern;
  }
}

// Process commands from UI
figma.ui.onmessage = (msg: UIMessage) => {
  if (msg.type === 'execute-commands') {
    executeCommands(msg.commands || []).then((results) => {
      figma.ui.postMessage({ type: 'success', results });
    }).catch((error: Error) => {
      figma.ui.postMessage({ type: 'error', message: error.message });
    });
  }

  if (msg.type === 'resize') {
    figma.ui.resize(240, msg.height || 28);
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

function executeCommands(commands: Command[]): Promise<CommandResult[]> {
  return new Promise((resolve) => {
    const results: CommandResult[] = [];
    let index = 0;

    function processNext() {
      if (index >= commands.length) {
        resolve(results);
        return;
      }

      const cmd = commands[index];
      executeCommand(cmd, undefined).then((result) => {
        // Check if result is already a CommandResult (from GET operations)
        if (result && typeof result === 'object' && 'success' in result) {
          // Merge with command identifiers
          results.push({ ...result as CommandResult, id: cmd.id, _cmdId: cmd._cmdId });
        } else {
          // Result is a node - extract the nodeId
          const nodeId = (result && 'id' in result) ? (result as BaseNode).id : null;
          results.push({ success: true, id: cmd.id, _cmdId: cmd._cmdId, nodeId: nodeId || undefined });
        }
        index++;
        processNext();
      }).catch((error: Error) => {
        results.push({ success: false, id: cmd.id, _cmdId: cmd._cmdId, error: error.message });
        index++;
        processNext();
      });
    }

    processNext();
  });
}

// Process nested children recursively
function processChildren(parentNode: SceneNode & ChildrenMixin, children: Command[]): Promise<void> {
  if (!children || !Array.isArray(children) || children.length === 0) {
    return Promise.resolve();
  }

  let index = 0;

  function processNextChild(): Promise<void> {
    if (index >= children.length) {
      return Promise.resolve();
    }

    const childCmd = children[index];
    childCmd._parentNode = parentNode;

    return executeCommand(childCmd, parentNode).then(() => {
      index++;
      return processNextChild();
    });
  }

  return processNextChild();
}

function executeCommand(cmd: Command, parentNode?: SceneNode): Promise<BaseNode | CommandResult | BaseStyle | VariableCollection | Variable | null> {
  // Store parent node reference if passed
  if (parentNode) {
    cmd._parentNode = parentNode;
  }

  const nodeCreators: Record<string, () => Promise<BaseNode | CommandResult | BaseStyle | VariableCollection | Variable | null>> = {
    'CREATE_PAGE': () => Promise.resolve(createPage(cmd)),
    'CREATE_FRAME': () => Promise.resolve(createFrame(cmd)),
    'CREATE_RECTANGLE': () => Promise.resolve(createRectangle(cmd)),
    'CREATE_ELLIPSE': () => Promise.resolve(createEllipse(cmd)),
    'CREATE_TEXT': () => createText(cmd),
    'CREATE_COMPONENT': () => Promise.resolve(createComponent(cmd)),
    'CREATE_INSTANCE': () => createInstance(cmd),
    'CREATE_GROUP': () => Promise.resolve(createGroup(cmd)),
    'CREATE_LINE': () => Promise.resolve(createLine(cmd)),
    'SET_FILLS': () => Promise.resolve(setFills(cmd)),
    'SET_STROKES': () => Promise.resolve(setStrokes(cmd)),
    'SET_EFFECTS': () => Promise.resolve(setEffects(cmd)),
    'SET_LAYOUT': () => Promise.resolve(setLayout(cmd)),
    'CREATE_STYLE': () => createStyle(cmd),
    'CREATE_VARIABLE_COLLECTION': () => Promise.resolve(createVariableCollection(cmd)),
    'CREATE_VARIABLE': () => Promise.resolve(createVariable(cmd)),
    'MOVE_NODE': () => Promise.resolve(moveNode(cmd)),
    'UPDATE_NODE': () => Promise.resolve(updateNode(cmd)),
    'DELETE_NODE': () => Promise.resolve(deleteNode(cmd)),
    'GET_NODE_BY_NAME': () => Promise.resolve(getNodeByName(cmd)),
    'GET_SELECTION': () => Promise.resolve(getSelection(cmd)),
    'GET_PAGE_NODES': () => Promise.resolve(getPageNodes(cmd)),
    'GET_NODE_BY_ID': () => Promise.resolve(getNodeById(cmd)),
    'FIND_NODES': () => Promise.resolve(findNodes(cmd)),
    'GET_STYLES': () => Promise.resolve(getStyles(cmd)),
    'GET_COMPONENTS': () => Promise.resolve(getComponents(cmd)),
    'GET_VARIABLES': () => Promise.resolve(getVariables(cmd)),
    'EXPORT_NODE': () => exportNode(cmd)
  };

  const creator = nodeCreators[cmd.type];
  if (!creator) {
    return Promise.reject(new Error('Unknown command type: ' + cmd.type));
  }

  // Create the node, then process any nested children
  return creator().then((createdNode) => {
    if (cmd.children && Array.isArray(cmd.children) && cmd.children.length > 0 && createdNode && 'children' in createdNode) {
      return processChildren(createdNode as SceneNode & ChildrenMixin, cmd.children).then(() => createdNode);
    }
    return createdNode;
  });
}

// ============ PAGE ============
function createPage(cmd: Command): PageNode {
  const page = figma.createPage();
  page.name = defaultVal(cmd.name, 'New Page');
  if (cmd.id) nodeRegistry.set(cmd.id, page);
  return page;
}

// ============ FRAME ============
function createFrame(cmd: Command): FrameNode {
  const frame = figma.createFrame();
  frame.name = defaultVal(cmd.name, 'Frame');
  frame.x = defaultVal(cmd.x, 0);
  frame.y = defaultVal(cmd.y, 0);
  frame.resize(defaultVal(cmd.width, 100), defaultVal(cmd.height, 100));

  // Shorthand: fill -> fills
  if (cmd.fill && !cmd.fills) {
    cmd.fills = [{ color: cmd.fill }];
  }

  if (cmd.fills) {
    applyFills(frame, cmd.fills);
  }

  if (cmd.cornerRadius !== undefined) {
    frame.cornerRadius = cmd.cornerRadius;
  }

  // Shorthand: stroke string -> stroke object
  if (typeof cmd.stroke === 'string') {
    cmd.stroke = { color: cmd.stroke, weight: 1 };
  }

  if (cmd.stroke) {
    applyStroke(frame, cmd.stroke);
  }

  // Auto-layout - explicit or implicit when children exist
  const hasLayout = cmd.layout || cmd.direction || cmd.gap !== undefined || cmd.padding !== undefined;
  const hasChildren = cmd.children && cmd.children.length > 0;

  if (hasLayout || hasChildren) {
    const layoutConfig = cmd.layout || {};
    const direction = cmd.direction || layoutConfig.direction || 'VERTICAL';
    const gap = cmd.gap !== undefined ? cmd.gap : layoutConfig.gap;
    const padding = cmd.padding !== undefined ? cmd.padding : layoutConfig.padding;

    frame.layoutMode = direction;
    frame.primaryAxisSizingMode = defaultVal(layoutConfig.primarySizing, 'AUTO');
    frame.counterAxisSizingMode = defaultVal(layoutConfig.counterSizing, 'AUTO');
    frame.itemSpacing = defaultVal(gap, 0);

    const basePadding = defaultVal(padding, 0);
    frame.paddingTop = defaultVal(cmd.paddingTop, defaultVal(layoutConfig.paddingTop, basePadding));
    frame.paddingRight = defaultVal(cmd.paddingRight, defaultVal(layoutConfig.paddingRight, basePadding));
    frame.paddingBottom = defaultVal(cmd.paddingBottom, defaultVal(layoutConfig.paddingBottom, basePadding));
    frame.paddingLeft = defaultVal(cmd.paddingLeft, defaultVal(layoutConfig.paddingLeft, basePadding));

    if (cmd.align || layoutConfig.primaryAlign) {
      frame.primaryAxisAlignItems = (cmd.align || layoutConfig.primaryAlign) as 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
    }
    if (cmd.counterAlign || layoutConfig.counterAlign) {
      frame.counterAxisAlignItems = (cmd.counterAlign || layoutConfig.counterAlign) as 'MIN' | 'CENTER' | 'MAX';
    }
  }

  if (cmd.clipsContent !== undefined) {
    frame.clipsContent = cmd.clipsContent;
  }

  // Parent - check _parentNode first (from nested children), then registry
  const parent = cmd._parentNode || (cmd.parent ? nodeRegistry.get(cmd.parent) : null);
  if (parent && 'appendChild' in parent) {
    (parent as ChildrenMixin).appendChild(frame);
  }

  if (cmd.id) nodeRegistry.set(cmd.id, frame);
  return frame;
}

// ============ RECTANGLE ============
function createRectangle(cmd: Command): RectangleNode {
  const rect = figma.createRectangle();
  rect.name = defaultVal(cmd.name, 'Rectangle');
  rect.x = defaultVal(cmd.x, 0);
  rect.y = defaultVal(cmd.y, 0);
  rect.resize(defaultVal(cmd.width, 100), defaultVal(cmd.height, 100));

  // Check fills array first (supports style references)
  if (cmd.fills) {
    applyFills(rect, cmd.fills);
  } else if (cmd.fillColor || cmd.fill) {
    rect.fills = solidPaint(cmd.fillColor || cmd.fill!);
  }

  if (cmd.cornerRadius !== undefined) {
    rect.cornerRadius = cmd.cornerRadius;
  }

  // Apply stroke
  if (cmd.stroke) {
    applyStroke(rect, cmd.stroke);
  } else if (cmd.strokeColor) {
    applyStroke(rect, { color: cmd.strokeColor, weight: cmd.strokeWeight || 1 });
  }

  // Parent
  const parent = cmd._parentNode || (cmd.parent ? nodeRegistry.get(cmd.parent) : null);
  if (parent && 'appendChild' in parent) {
    (parent as ChildrenMixin).appendChild(rect);
  }

  if (cmd.id) nodeRegistry.set(cmd.id, rect);
  return rect;
}

// ============ ELLIPSE ============
function createEllipse(cmd: Command): EllipseNode {
  const ellipse = figma.createEllipse();
  ellipse.name = defaultVal(cmd.name, 'Ellipse');
  ellipse.x = defaultVal(cmd.x, 0);
  ellipse.y = defaultVal(cmd.y, 0);
  ellipse.resize(defaultVal(cmd.width, 100), defaultVal(cmd.height, 100));

  // Check fills array first (supports style references)
  if (cmd.fills) {
    applyFills(ellipse, cmd.fills);
  } else if (cmd.fillColor || cmd.fill) {
    ellipse.fills = solidPaint(cmd.fillColor || cmd.fill!);
  }

  // Apply stroke
  if (cmd.stroke) {
    applyStroke(ellipse, cmd.stroke);
  } else if (cmd.strokeColor) {
    applyStroke(ellipse, { color: cmd.strokeColor, weight: cmd.strokeWeight || 1 });
  }

  // Parent
  const parent = cmd._parentNode || (cmd.parent ? nodeRegistry.get(cmd.parent) : null);
  if (parent && 'appendChild' in parent) {
    (parent as ChildrenMixin).appendChild(ellipse);
  }

  if (cmd.id) nodeRegistry.set(cmd.id, ellipse);
  return ellipse;
}

// ============ TEXT ============
function createText(cmd: Command): Promise<TextNode> {
  return new Promise((resolve, reject) => {
    const text = figma.createText();
    text.name = defaultVal(cmd.name, 'Text');
    text.x = defaultVal(cmd.x, 0);
    text.y = defaultVal(cmd.y, 0);

    const fontFamily = defaultVal(cmd.fontFamily, 'Inter');
    const fontStyle = defaultVal(cmd.fontStyle, 'Regular');

    figma.loadFontAsync({ family: fontFamily, style: fontStyle }).then(() => {
      text.fontName = { family: fontFamily, style: fontStyle };
      text.characters = defaultVal(cmd.text, '');

      if (cmd.fontSize) text.fontSize = cmd.fontSize;
      if (cmd.lineHeight) {
        if (typeof cmd.lineHeight === 'number') {
          text.lineHeight = { value: cmd.lineHeight, unit: 'PIXELS' };
        } else {
          text.lineHeight = cmd.lineHeight as LineHeight;
        }
      }
      if (cmd.letterSpacing) {
        text.letterSpacing = { value: cmd.letterSpacing, unit: 'PIXELS' };
      }
      if (cmd.textCase) text.textCase = cmd.textCase;
      if (cmd.textAlignHorizontal) text.textAlignHorizontal = cmd.textAlignHorizontal;
      if (cmd.textAlignVertical) text.textAlignVertical = cmd.textAlignVertical;

      // Check fills array first (supports style references)
      if (cmd.fills) {
        applyFills(text, cmd.fills);
      } else if (cmd.fill) {
        text.fills = solidPaint(cmd.fill);
      }

      if (cmd.width) {
        text.resize(cmd.width, text.height);
        text.textAutoResize = defaultVal(cmd.autoResize, 'HEIGHT');
      }

      // Parent
      const parent = cmd._parentNode || (cmd.parent ? nodeRegistry.get(cmd.parent) : null);
      if (parent && 'appendChild' in parent) {
        (parent as ChildrenMixin).appendChild(text);
      }

      if (cmd.id) nodeRegistry.set(cmd.id, text);
      resolve(text);
    }).catch(() => {
      // Fallback to Inter if font not available
      figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
        text.fontName = { family: 'Inter', style: 'Regular' };
        text.characters = defaultVal(cmd.text, '');

        if (cmd.fontSize) text.fontSize = cmd.fontSize;
        // Check fills array first (supports style references)
        if (cmd.fills) {
          applyFills(text, cmd.fills);
        } else if (cmd.fill) {
          text.fills = solidPaint(cmd.fill);
        }

        const parent = cmd._parentNode || (cmd.parent ? nodeRegistry.get(cmd.parent) : null);
        if (parent && 'appendChild' in parent) {
          (parent as ChildrenMixin).appendChild(text);
        }

        if (cmd.id) nodeRegistry.set(cmd.id, text);
        resolve(text);
      }).catch(reject);
    });
  });
}

// ============ COMPONENT ============
function createComponent(cmd: Command): ComponentNode {
  const component = figma.createComponent();
  component.name = defaultVal(cmd.name, 'Component');
  component.x = defaultVal(cmd.x, 0);
  component.y = defaultVal(cmd.y, 0);
  component.resize(defaultVal(cmd.width, 100), defaultVal(cmd.height, 100));

  // Shorthand: fill -> fills
  if (cmd.fill && !cmd.fills) {
    cmd.fills = [{ color: cmd.fill }];
  }

  if (cmd.fills) {
    applyFills(component, cmd.fills);
  }

  if (cmd.cornerRadius !== undefined) {
    component.cornerRadius = cmd.cornerRadius;
  }

  // Stroke support
  if (typeof cmd.stroke === 'string') {
    cmd.stroke = { color: cmd.stroke, weight: 1 };
  }

  if (cmd.stroke) {
    applyStroke(component, cmd.stroke);
  }

  // Auto-layout
  const hasLayout = cmd.layout || cmd.direction || cmd.gap !== undefined || cmd.padding !== undefined;
  const hasChildren = cmd.children && cmd.children.length > 0;

  if (hasLayout || hasChildren) {
    const layoutConfig = cmd.layout || {};
    const direction = cmd.direction || layoutConfig.direction || 'VERTICAL';
    const gap = cmd.gap !== undefined ? cmd.gap : layoutConfig.gap;
    const padding = cmd.padding !== undefined ? cmd.padding : layoutConfig.padding;

    component.layoutMode = direction;
    component.primaryAxisSizingMode = defaultVal(layoutConfig.primarySizing, 'AUTO');
    component.counterAxisSizingMode = defaultVal(layoutConfig.counterSizing, 'AUTO');
    component.itemSpacing = defaultVal(gap, 0);

    const basePadding = defaultVal(padding, 0);
    component.paddingTop = defaultVal(cmd.paddingTop, defaultVal(layoutConfig.paddingTop, basePadding));
    component.paddingRight = defaultVal(cmd.paddingRight, defaultVal(layoutConfig.paddingRight, basePadding));
    component.paddingBottom = defaultVal(cmd.paddingBottom, defaultVal(layoutConfig.paddingBottom, basePadding));
    component.paddingLeft = defaultVal(cmd.paddingLeft, defaultVal(layoutConfig.paddingLeft, basePadding));

    if (cmd.align || layoutConfig.primaryAlign) {
      component.primaryAxisAlignItems = (cmd.align || layoutConfig.primaryAlign) as 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
    }
    if (cmd.counterAlign || layoutConfig.counterAlign) {
      component.counterAxisAlignItems = (cmd.counterAlign || layoutConfig.counterAlign) as 'MIN' | 'CENTER' | 'MAX';
    }
  }

  // Parent
  const parent = cmd._parentNode || (cmd.parent ? nodeRegistry.get(cmd.parent) : null);
  if (parent && 'appendChild' in parent) {
    (parent as ChildrenMixin).appendChild(component);
  }

  if (cmd.id) nodeRegistry.set(cmd.id, component);
  return component;
}

// ============ INSTANCE ============
function createInstance(cmd: Command): Promise<InstanceNode> {
  return new Promise((resolve, reject) => {
    const component = nodeRegistry.get(cmd.componentId!) as ComponentNode;
    if (!component || component.type !== 'COMPONENT') {
      reject(new Error('Component not found: ' + cmd.componentId));
      return;
    }

    const instance = component.createInstance();
    instance.name = defaultVal(cmd.name, instance.name);
    instance.x = defaultVal(cmd.x, 0);
    instance.y = defaultVal(cmd.y, 0);

    // Parent
    const parent = cmd._parentNode || (cmd.parent ? nodeRegistry.get(cmd.parent) : null);
    if (parent && 'appendChild' in parent) {
      (parent as ChildrenMixin).appendChild(instance);
    }

    if (cmd.id) nodeRegistry.set(cmd.id, instance);

    // Apply overrides
    if (cmd.overrides) {
      const overrideKeys = Object.keys(cmd.overrides);
      const textOverrides: { node: TextNode; text: string }[] = [];

      for (const childName of overrideKeys) {
        const overrideProps = cmd.overrides[childName];
        const childNode = instance.findOne(n => n.name === childName);

        if (childNode) {
          // Text override
          if (overrideProps.text !== undefined && childNode.type === 'TEXT') {
            textOverrides.push({ node: childNode as TextNode, text: overrideProps.text });
          }
          // Fill override
          if (overrideProps.fill && 'fills' in childNode) {
            (childNode as GeometryMixin).fills = solidPaint(overrideProps.fill);
          }
          // Visibility override
          if (overrideProps.visible !== undefined) {
            childNode.visible = overrideProps.visible;
          }
        }
      }

      // Process text overrides with font loading
      if (textOverrides.length > 0) {
        let processed = 0;
        textOverrides.forEach(override => {
          const fontName = override.node.fontName;
          if (fontName && fontName !== figma.mixed) {
            figma.loadFontAsync(fontName as FontName).then(() => {
              override.node.characters = override.text;
              processed++;
              if (processed === textOverrides.length) {
                resolve(instance);
              }
            }).catch(() => {
              figma.loadFontAsync({ family: 'Inter', style: 'Regular' }).then(() => {
                override.node.fontName = { family: 'Inter', style: 'Regular' };
                override.node.characters = override.text;
                processed++;
                if (processed === textOverrides.length) {
                  resolve(instance);
                }
              }).catch(() => {
                processed++;
                if (processed === textOverrides.length) {
                  resolve(instance);
                }
              });
            });
          } else {
            processed++;
            if (processed === textOverrides.length) {
              resolve(instance);
            }
          }
        });
      } else {
        resolve(instance);
      }
    } else {
      resolve(instance);
    }
  });
}

// ============ GROUP ============
function createGroup(cmd: Command): FrameNode {
  const frame = figma.createFrame();
  frame.name = defaultVal(cmd.name, 'Group');
  frame.x = defaultVal(cmd.x, 0);
  frame.y = defaultVal(cmd.y, 0);

  if (cmd.id) nodeRegistry.set(cmd.id, frame);
  return frame;
}

// ============ LINE ============
function createLine(cmd: Command): LineNode {
  const line = figma.createLine();
  line.name = defaultVal(cmd.name, 'Line');
  line.x = defaultVal(cmd.x, 0);
  line.y = defaultVal(cmd.y, 0);

  const length = defaultVal(cmd.length, 100);
  line.resize(length, 0);

  if (cmd.rotation) {
    line.rotation = cmd.rotation;
  }

  if (cmd.color) {
    line.strokes = solidPaint(cmd.color);
  }
  line.strokeWeight = defaultVal(cmd.weight, 1);

  if (cmd.dashPattern) {
    line.dashPattern = cmd.dashPattern;
  }

  // Parent
  const parent = cmd._parentNode || (cmd.parent ? nodeRegistry.get(cmd.parent) : null);
  if (parent && 'appendChild' in parent) {
    (parent as ChildrenMixin).appendChild(line);
  }

  if (cmd.id) nodeRegistry.set(cmd.id, line);
  return line;
}

// ============ SET FILLS ============
function setFills(cmd: Command): BaseNode {
  const node = nodeRegistry.get(cmd.nodeId!) as SceneNode & GeometryMixin;
  if (!node || !('fills' in node)) {
    throw new Error('Node not found or does not support fills: ' + cmd.nodeId);
  }

  applyFills(node, cmd.fills!);
  return node;
}

// ============ SET STROKES ============
function setStrokes(cmd: Command): BaseNode {
  const node = nodeRegistry.get(cmd.nodeId!) as SceneNode & MinimalStrokesMixin;
  if (!node || !('strokes' in node)) {
    throw new Error('Node not found or does not support strokes: ' + cmd.nodeId);
  }

  node.strokes = (cmd.strokes || []).map(s => ({
    type: 'SOLID' as const,
    color: parseColor(s.color),
    opacity: defaultVal(s.opacity, 1)
  }));

  if (cmd.strokeWeight !== undefined) {
    node.strokeWeight = cmd.strokeWeight;
  }

  if (cmd.strokeAlign) {
    node.strokeAlign = cmd.strokeAlign;
  }

  if (cmd.dashPattern) {
    node.dashPattern = cmd.dashPattern;
  }

  return node;
}

// ============ SET EFFECTS ============
function setEffects(cmd: Command): BaseNode {
  const node = nodeRegistry.get(cmd.nodeId!) as SceneNode & BlendMixin;
  if (!node || !('effects' in node)) {
    throw new Error('Node not found or does not support effects: ' + cmd.nodeId);
  }

  node.effects = (cmd.effects || []).map((e) => {
    const effect = e as Effect;
    if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
      return effect;
    }
    if (effect.type === 'LAYER_BLUR' || effect.type === 'BACKGROUND_BLUR') {
      return effect;
    }
    return effect;
  });

  return node;
}

// ============ LAYOUT ============
function setLayout(cmd: Command): BaseNode {
  const node = nodeRegistry.get(cmd.nodeId!) as FrameNode;
  if (!node || !('layoutMode' in node)) {
    throw new Error('Node not found or does not support layout: ' + cmd.nodeId);
  }

  if (cmd.direction) node.layoutMode = cmd.direction;
  if (cmd.gap !== undefined) node.itemSpacing = cmd.gap;
  if (cmd.padding !== undefined) {
    node.paddingTop = cmd.padding;
    node.paddingRight = cmd.padding;
    node.paddingBottom = cmd.padding;
    node.paddingLeft = cmd.padding;
  }
  if (cmd.paddingTop !== undefined) node.paddingTop = cmd.paddingTop;
  if (cmd.paddingRight !== undefined) node.paddingRight = cmd.paddingRight;
  if (cmd.paddingBottom !== undefined) node.paddingBottom = cmd.paddingBottom;
  if (cmd.paddingLeft !== undefined) node.paddingLeft = cmd.paddingLeft;

  return node;
}

// ============ STYLES ============
function createStyle(cmd: Command): Promise<BaseStyle> {
  return new Promise((resolve, reject) => {
    if (cmd.styleType === 'TEXT') {
      const style = figma.createTextStyle();
      style.name = cmd.name!;

      const fontFamily = defaultVal(cmd.fontFamily, 'Inter');
      const fontStyle = defaultVal(cmd.fontStyle, 'Regular');

      figma.loadFontAsync({ family: fontFamily, style: fontStyle }).then(() => {
        style.fontName = { family: fontFamily, style: fontStyle };
        style.fontSize = defaultVal(cmd.fontSize, 16);
        if (cmd.lineHeight && typeof cmd.lineHeight === 'number') {
          style.lineHeight = { value: cmd.lineHeight, unit: 'PIXELS' };
        }
        if (cmd.letterSpacing) {
          style.letterSpacing = { value: cmd.letterSpacing, unit: 'PIXELS' };
        }
        if (cmd.textCase) {
          style.textCase = cmd.textCase;
        }

        if (cmd.id) nodeRegistry.set(cmd.id, style as unknown as BaseNode);
        resolve(style);
      }).catch(reject);
      return;
    }

    if (cmd.styleType === 'PAINT') {
      const paintStyle = figma.createPaintStyle();
      paintStyle.name = cmd.name!;
      paintStyle.paints = solidPaint(cmd.color!);

      if (cmd.id) nodeRegistry.set(cmd.id, paintStyle as unknown as BaseNode);
      resolve(paintStyle);
      return;
    }

    if (cmd.styleType === 'EFFECT') {
      const effectStyle = figma.createEffectStyle();
      effectStyle.name = cmd.name!;
      effectStyle.effects = defaultVal(cmd.effects, []) as Effect[];

      if (cmd.id) nodeRegistry.set(cmd.id, effectStyle as unknown as BaseNode);
      resolve(effectStyle);
      return;
    }

    reject(new Error('Unknown style type: ' + cmd.styleType));
  });
}

// ============ VARIABLES ============
function createVariableCollection(cmd: Command): VariableCollection {
  const collection = figma.variables.createVariableCollection(cmd.name!);

  if (cmd.modes && cmd.modes.length > 0) {
    collection.renameMode(collection.modes[0].modeId, cmd.modes[0]);

    for (let i = 1; i < cmd.modes.length; i++) {
      collection.addMode(cmd.modes[i]);
    }
  }

  if (cmd.id) nodeRegistry.set(cmd.id, collection as unknown as BaseNode);
  return collection;
}

function createVariable(cmd: Command): Variable {
  const collection = nodeRegistry.get(cmd.collectionId!) as unknown as VariableCollection;
  if (!collection) {
    throw new Error('Collection not found: ' + cmd.collectionId);
  }

  const variable = figma.variables.createVariable(cmd.name!, collection, defaultVal(cmd.resolvedType, 'COLOR') as VariableResolvedDataType);

  if (cmd.values) {
    const modeNames = Object.keys(cmd.values);
    for (const modeName of modeNames) {
      const value = cmd.values[modeName];
      const mode = collection.modes.find(m => m.name === modeName);

      if (mode) {
        if (cmd.resolvedType === 'COLOR') {
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

// ============ MOVE NODE ============
function moveNode(cmd: Command): BaseNode {
  let node: BaseNode | null = null;

  if (cmd.id) {
    node = nodeRegistry.get(cmd.id) || null;
  }

  if (!node && cmd.nodeId) {
    node = figma.getNodeById(cmd.nodeId);
  }

  if (!node && cmd.name) {
    node = figma.currentPage.findOne(n => n.name === cmd.name);
  }

  if (!node) {
    throw new Error('Node not found: ' + (cmd.id || cmd.nodeId || cmd.name));
  }

  if (cmd.x !== undefined && 'x' in node) (node as SceneNode).x = cmd.x;
  if (cmd.y !== undefined && 'y' in node) (node as SceneNode).y = cmd.y;

  return node;
}

// ============ UPDATE NODE ============
function updateNode(cmd: Command): BaseNode {
  let node: BaseNode | null = null;

  if (cmd.id) {
    node = nodeRegistry.get(cmd.id) || null;
  }

  if (!node && cmd.nodeId) {
    node = figma.getNodeById(cmd.nodeId);
  }

  if (!node && cmd.name) {
    node = figma.currentPage.findOne(n => n.name === cmd.name);
  }

  if (!node) {
    throw new Error('Node not found: ' + (cmd.id || cmd.nodeId || cmd.name));
  }

  const sceneNode = node as SceneNode;

  if (cmd.x !== undefined && 'x' in sceneNode) sceneNode.x = cmd.x;
  if (cmd.y !== undefined && 'y' in sceneNode) sceneNode.y = cmd.y;

  if ((cmd.width !== undefined || cmd.height !== undefined) && 'resize' in sceneNode) {
    const w = cmd.width !== undefined ? cmd.width : sceneNode.width;
    const h = cmd.height !== undefined ? cmd.height : sceneNode.height;
    (sceneNode as LayoutMixin).resize(w, h);
  }

  if (cmd.newName) {
    sceneNode.name = cmd.newName;
  }

  if (cmd.fills && 'fills' in sceneNode) {
    (sceneNode as GeometryMixin).fills = cmd.fills.map(f => ({
      type: 'SOLID' as const,
      color: parseColor(f.color),
      opacity: defaultVal(f.opacity, 1)
    }));
  }

  if (cmd.cornerRadius !== undefined && 'cornerRadius' in sceneNode) {
    (sceneNode as RectangleNode).cornerRadius = cmd.cornerRadius;
  }

  if (cmd.visible !== undefined) {
    sceneNode.visible = cmd.visible;
  }

  if (cmd.opacity !== undefined && 'opacity' in sceneNode) {
    (sceneNode as BlendMixin).opacity = cmd.opacity;
  }

  if (cmd.strokes && 'strokes' in sceneNode) {
    (sceneNode as MinimalStrokesMixin).strokes = cmd.strokes.map(s => ({
      type: 'SOLID' as const,
      color: parseColor(s.color),
      opacity: defaultVal(s.opacity, 1)
    }));
  }

  if (cmd.strokeWeight !== undefined && 'strokeWeight' in sceneNode) {
    (sceneNode as MinimalStrokesMixin).strokeWeight = cmd.strokeWeight;
  }

  if (cmd.strokeAlign && 'strokeAlign' in sceneNode) {
    (sceneNode as MinimalStrokesMixin).strokeAlign = cmd.strokeAlign;
  }

  if (cmd.dashPattern && 'dashPattern' in sceneNode) {
    (sceneNode as MinimalStrokesMixin).dashPattern = cmd.dashPattern;
  }

  return node;
}

// ============ DELETE NODE ============
function deleteNode(cmd: Command): CommandResult {
  let node: BaseNode | null = null;

  if (cmd.id) {
    node = nodeRegistry.get(cmd.id) || null;
    nodeRegistry.delete(cmd.id);
  }

  if (!node && cmd.nodeId) {
    node = figma.getNodeById(cmd.nodeId);
  }

  if (!node && cmd.name) {
    node = figma.currentPage.findOne(n => n.name === cmd.name);
  }

  if (!node) {
    throw new Error('Node not found: ' + (cmd.id || cmd.nodeId || cmd.name));
  }

  node.remove();
  return { success: true, deleted: true };
}

// ============ GET NODE BY NAME ============
function getNodeByName(cmd: Command): BaseNode {
  const node = figma.currentPage.findOne(n => n.name === cmd.name);

  if (!node) {
    throw new Error('Node not found with name: ' + cmd.name);
  }

  if (cmd.id) {
    nodeRegistry.set(cmd.id, node);
  } else if (cmd.name) {
    nodeRegistry.set(cmd.name, node);
  }

  return node;
}

// ============ HELPER: Color to Hex ============
function colorToHex(color: RGB): string {
  if (!color) return '';
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}

// ============ HELPER: Serialize node ============
function serializeNode(node: BaseNode, depth: number, maxDepth: number): SerializedNode | null {
  if (!node) return null;

  const result: SerializedNode = {
    id: node.id,
    name: node.name,
    type: node.type
  };

  const sceneNode = node as SceneNode;

  if ('x' in sceneNode) result.x = sceneNode.x;
  if ('y' in sceneNode) result.y = sceneNode.y;
  if ('width' in sceneNode) result.width = sceneNode.width;
  if ('height' in sceneNode) result.height = sceneNode.height;

  if ('fills' in sceneNode) {
    const fills = (sceneNode as GeometryMixin).fills;
    if (fills && Array.isArray(fills) && fills.length > 0) {
      result.fills = fills.map(f => {
        if (f.type === 'SOLID') {
          return { type: 'SOLID', color: colorToHex(f.color), opacity: f.opacity };
        }
        return { type: f.type };
      });
    }
  }

  if ('strokes' in sceneNode) {
    const strokes = (sceneNode as MinimalStrokesMixin).strokes;
    if (strokes && strokes.length > 0) {
      result.strokes = strokes.map(s => {
        if (s.type === 'SOLID') {
          return { type: 'SOLID', color: colorToHex(s.color), opacity: s.opacity };
        }
        return { type: s.type };
      });
      result.strokeWeight = (sceneNode as MinimalStrokesMixin).strokeWeight as number;
      result.strokeAlign = (sceneNode as MinimalStrokesMixin).strokeAlign;
      const dashPattern = (sceneNode as MinimalStrokesMixin).dashPattern;
      if (dashPattern && dashPattern.length > 0) {
        result.dashPattern = dashPattern;
      }
    }
  }

  if ('cornerRadius' in sceneNode) {
    result.cornerRadius = (sceneNode as RectangleNode).cornerRadius as number;
  }

  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    result.characters = textNode.characters;
    result.fontSize = textNode.fontSize as number;
    if (textNode.fontName && textNode.fontName !== figma.mixed) {
      result.fontFamily = (textNode.fontName as FontName).family;
      result.fontStyle = (textNode.fontName as FontName).style;
    }
  }

  if ('layoutMode' in sceneNode) {
    const frameNode = sceneNode as FrameNode;
    if (frameNode.layoutMode !== 'NONE') {
      result.layoutMode = frameNode.layoutMode;
      result.itemSpacing = frameNode.itemSpacing;
      result.padding = {
        top: frameNode.paddingTop,
        right: frameNode.paddingRight,
        bottom: frameNode.paddingBottom,
        left: frameNode.paddingLeft
      };
      result.primaryAxisAlign = frameNode.primaryAxisAlignItems;
      result.counterAxisAlign = frameNode.counterAxisAlignItems;
    }
  }

  if (node.type === 'COMPONENT') {
    result.isComponent = true;
  }
  if (node.type === 'INSTANCE') {
    result.isInstance = true;
    const instanceNode = node as InstanceNode;
    if (instanceNode.mainComponent) {
      result.mainComponentId = instanceNode.mainComponent.id;
      result.mainComponentName = instanceNode.mainComponent.name;
    }
  }

  if ('children' in node && depth < maxDepth) {
    const childrenNode = node as ChildrenMixin;
    result.children = childrenNode.children
      .map(child => serializeNode(child, depth + 1, maxDepth))
      .filter((c): c is SerializedNode => c !== null);
  }

  return result;
}

// GET_SELECTION
function getSelection(cmd: Command): CommandResult {
  const selection = figma.currentPage.selection;
  const maxDepth = defaultVal(cmd.depth, 3);

  if (selection.length === 0) {
    return { success: true, selection: [], count: 0 };
  }

  const nodes = selection.map(node => {
    if (cmd.register) {
      nodeRegistry.set(node.name, node);
    }
    return serializeNode(node, 0, maxDepth);
  });

  return { success: true, selection: nodes, count: nodes.length };
}

// GET_PAGE_NODES
function getPageNodes(cmd: Command): CommandResult {
  const maxDepth = defaultVal(cmd.depth, 1);
  const filter = cmd.filter;

  const nodes = figma.currentPage.children
    .filter(node => !filter || node.type === filter)
    .map(node => serializeNode(node, 0, maxDepth))
    .filter((n): n is SerializedNode => n !== null);

  return {
    success: true,
    page: figma.currentPage.name,
    nodes,
    count: nodes.length
  };
}

// GET_NODE_BY_ID
function getNodeById(cmd: Command): CommandResult {
  const node = figma.getNodeById(cmd.nodeId!);

  if (!node) {
    throw new Error('Node not found with ID: ' + cmd.nodeId);
  }

  const maxDepth = defaultVal(cmd.depth, 3);

  if (cmd.id) {
    nodeRegistry.set(cmd.id, node);
  }

  return { success: true, ...serializeNode(node, 0, maxDepth) };
}

// FIND_NODES
function findNodes(cmd: Command): CommandResult {
  const results: SerializedNode[] = [];
  const maxResults = defaultVal(cmd.maxResults, 50);
  const maxDepth = defaultVal(cmd.depth, 1);

  function searchNode(node: BaseNode) {
    if (results.length >= maxResults) return;

    let matches = true;

    if (cmd.name) {
      const searchName = cmd.name.toLowerCase();
      matches = node.name.toLowerCase().indexOf(searchName) !== -1;
    }

    if (cmd.filter && matches) {
      matches = node.type === cmd.filter;
    }

    if (matches) {
      const serialized = serializeNode(node, 0, maxDepth);
      if (serialized) {
        results.push(serialized);
      }

      if (cmd.register) {
        nodeRegistry.set(node.name + '_' + results.length, node);
      }
    }

    if ('children' in node) {
      (node as ChildrenMixin).children.forEach(searchNode);
    }
  }

  figma.currentPage.children.forEach(searchNode);

  return {
    success: true,
    results,
    count: results.length,
    truncated: results.length >= maxResults
  };
}

// GET_STYLES
function getStyles(cmd: Command): CommandResult {
  const result: CommandResult = { success: true };

  if (!cmd.filter || cmd.filter === 'PAINT' || cmd.filter === 'ALL') {
    const paintStyles = figma.getLocalPaintStyles();
    result.colors = paintStyles.map(style => {
      const paint = style.paints[0];
      return {
        id: style.id,
        name: style.name,
        color: paint && paint.type === 'SOLID' ? colorToHex(paint.color) : null
      };
    });
  }

  if (!cmd.filter || cmd.filter === 'TEXT' || cmd.filter === 'ALL') {
    const textStyles = figma.getLocalTextStyles();
    result.textStyles = textStyles.map(style => ({
      id: style.id,
      name: style.name,
      fontFamily: style.fontName ? style.fontName.family : null,
      fontStyle: style.fontName ? style.fontName.style : null,
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing
    }));
  }

  if (!cmd.filter || cmd.filter === 'EFFECT' || cmd.filter === 'ALL') {
    const effectStyles = figma.getLocalEffectStyles();
    result.effects = effectStyles.map(style => ({
      id: style.id,
      name: style.name,
      effects: style.effects
    }));
  }

  return result;
}

// GET_COMPONENTS
function getComponents(cmd: Command): CommandResult {
  const components: SerializedNode[] = [];
  const maxDepth = defaultVal(cmd.depth, 2);

  function findComponentsInNode(node: BaseNode) {
    if (node.type === 'COMPONENT') {
      const serialized = serializeNode(node, 0, maxDepth);
      if (serialized) {
        components.push(serialized);
      }
      nodeRegistry.set(node.name, node);
    }
    if ('children' in node) {
      (node as ChildrenMixin).children.forEach(findComponentsInNode);
    }
  }

  figma.currentPage.children.forEach(findComponentsInNode);

  return { success: true, components, count: components.length };
}

// GET_VARIABLES
function getVariables(_cmd: Command): CommandResult {
  const collections = figma.variables.getLocalVariableCollections();

  return {
    success: true,
    collections: collections.map(collection => {
      const variables = collection.variableIds.map(varId => {
        const variable = figma.variables.getVariableById(varId);
        if (!variable) return null;

        const values: Record<string, unknown> = {};
        collection.modes.forEach(mode => {
          const value = variable.valuesByMode[mode.modeId];
          if (variable.resolvedType === 'COLOR' && value && typeof value === 'object' && 'r' in value) {
            values[mode.name] = colorToHex(value as RGB);
          } else {
            values[mode.name] = value;
          }
        });

        return {
          id: variable.id,
          name: variable.name,
          type: variable.resolvedType,
          values
        };
      }).filter(v => v !== null);

      return {
        id: collection.id,
        name: collection.name,
        modes: collection.modes.map(m => m.name),
        variables
      };
    })
  };
}

// EXPORT_NODE
function exportNode(cmd: Command): Promise<CommandResult> {
  return new Promise((resolve, reject) => {
    let node: BaseNode | null = null;

    if (cmd.nodeId) {
      node = figma.getNodeById(cmd.nodeId);
    } else if (cmd.name) {
      node = figma.currentPage.findOne(n => n.name === cmd.name);
    } else if (cmd.id) {
      node = nodeRegistry.get(cmd.id) || null;
    }

    if (!node) {
      reject(new Error('Node not found'));
      return;
    }

    const format = defaultVal(cmd.format, 'PNG');
    const scale = defaultVal(cmd.scale, 1);

    if (format === 'JSON') {
      resolve({
        success: true,
        format: 'JSON',
        data: serializeNode(node, 0, 10)
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
        format,
        data: base64,
        width: sceneNode.width * scale,
        height: sceneNode.height * scale
      });
    }).catch(reject);
  });
}

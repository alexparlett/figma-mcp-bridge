/**
 * Generate SERIALIZABLE_PROPS array from TypeScript interface definitions.
 *
 * This script parses types/data.ts and extracts all property keys from
 * node data interfaces, producing a deduplicated list of properties that
 * the plugin can use to serialize Figma nodes.
 *
 * Run: npx tsx scripts/generate-serializable-props.ts
 */

import { Project, SyntaxKind } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const TYPES_DIR = path.join(ROOT_DIR, 'types');
const OUTPUT_FILE = path.join(TYPES_DIR, 'serializable-props.ts');

// Interfaces that represent actual Figma node data (not query/modifier types)
const NODE_DATA_INTERFACES = [
  // Base types
  'BaseNodeData',
  'SizedNodeData',
  'FillableNodeData',
  'StrokableNodeData',
  'EffectableNodeData',
  'BlendableNodeData',

  // Shape nodes
  'FrameData',
  'RectangleData',
  'EllipseData',
  'PolygonData',
  'StarData',
  'LineData',
  'VectorData',
  'SectionData',
  'SliceData',

  // Text
  'TextData',

  // Components
  'ComponentData',
  'InstanceData',
  'GroupData',
  'ComponentSetData',

  // FigJam
  'ConnectorData',
  'StickyData',
  'ShapeWithTextData',
  'CodeBlockData',
  'TableData',
  'StampData',
  'HighlightData',
  'WashiTapeData',

  // Media
  'EmbedData',
  'LinkUnfurlData',
  'MediaData',

  // Slides
  'SlideData',
  'SlideRowData',
  'SlideGridData',
  'InteractiveSlideElementData',

  // Other
  'WidgetData',
  'TextPathData',
  'TransformGroupData',
];

// Additional Figma-only properties not in our types (read-only from Figma API)
const FIGMA_READONLY_PROPS = [
  // Computed geometry
  'absoluteTransform',
  'relativeTransform',
  'absoluteBoundingBox',
  'absoluteRenderBounds',

  // Layout child properties
  'layoutAlign',
  'layoutGrow',
  'layoutPositioning',

  // Size constraints
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',

  // Instance
  'mainComponent',

  // Reactions
  'reactions',

  // Boolean operation
  'booleanOperation',
];

// Properties to exclude (internal, non-serializable, or handled specially)
const EXCLUDED_PROPS = new Set([
  'parent', // Node reference, not serializable
  'id', // Added separately in base
  'nodeIds', // Array of references
  'ranges', // Text ranges handled separately
]);

function extractPropertiesFromInterface(
  project: Project,
  interfaceName: string,
  visited: Set<string> = new Set()
): Set<string> {
  if (visited.has(interfaceName)) {
    return new Set();
  }
  visited.add(interfaceName);

  const properties = new Set<string>();

  // Search all source files for the interface
  for (const sourceFile of project.getSourceFiles()) {
    const interfaceDecl = sourceFile.getInterface(interfaceName);
    if (!interfaceDecl) continue;

    // Get own properties
    for (const prop of interfaceDecl.getProperties()) {
      const propName = prop.getName();
      if (!EXCLUDED_PROPS.has(propName)) {
        properties.add(propName);
      }
    }

    // Get extended interfaces
    for (const ext of interfaceDecl.getExtends()) {
      const extName = ext.getExpression().getText();
      const extProps = extractPropertiesFromInterface(project, extName, visited);
      extProps.forEach(p => properties.add(p));
    }
  }

  return properties;
}

function main() {
  console.log('Generating serializable props from TypeScript interfaces...');

  // Create ts-morph project
  const project = new Project({
    tsConfigFilePath: path.join(ROOT_DIR, 'tsconfig.base.json'),
  });

  // Add all type files
  project.addSourceFilesAtPaths(path.join(TYPES_DIR, '*.ts'));

  // Collect all properties
  const allProps = new Set<string>();

  for (const interfaceName of NODE_DATA_INTERFACES) {
    const props = extractPropertiesFromInterface(project, interfaceName);
    props.forEach(p => allProps.add(p));
  }

  // Add Figma read-only properties
  FIGMA_READONLY_PROPS.forEach(p => allProps.add(p));

  // Sort alphabetically for consistency
  const sortedProps = Array.from(allProps).sort();

  // Group by category for readability
  const categories: Record<string, string[]> = {
    'BaseNodeMixin': ['name', 'visible', 'locked'],
    'LayoutMixin (geometry)': [
      'x', 'y', 'width', 'height', 'rotation',
      'absoluteTransform', 'relativeTransform',
      'absoluteBoundingBox', 'absoluteRenderBounds',
      'layoutAlign', 'layoutGrow', 'layoutPositioning',
    ],
    'ConstraintMixin': ['constraints'],
    'BlendMixin': ['opacity', 'blendMode', 'isMask', 'maskType'],
    'FillsMixin': ['fills', 'fillStyleId', 'fill', 'fillColor'],
    'StrokesMixin': [
      'strokes', 'strokeStyleId', 'stroke', 'strokeColor',
      'strokeWeight', 'strokeAlign', 'strokeCap', 'strokeJoin',
      'strokeMiterLimit', 'dashPattern',
      'strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight',
    ],
    'CornerMixin': [
      'cornerRadius', 'cornerSmoothing',
      'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius',
    ],
    'EffectMixin': ['effects', 'effectStyleId'],
    'AutoLayoutMixin': [
      'layoutMode', 'primaryAxisSizingMode', 'counterAxisSizingMode',
      'primaryAxisAlignItems', 'counterAxisAlignItems', 'counterAxisAlignContent',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'padding', 'itemSpacing', 'counterAxisSpacing', 'gap',
      'layoutWrap', 'wrap', 'itemReverseZIndex', 'strokesIncludedInLayout',
      'direction', 'align', 'counterAlign', 'layout',
    ],
    'SizeMixin': ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'],
    'BaseFrameMixin': ['clipsContent', 'guides', 'layoutGrids', 'gridStyleId'],
    'TextMixin': [
      'characters', 'text', 'fontSize', 'fontName', 'fontFamily', 'fontStyle', 'fontWeight',
      'textAlignHorizontal', 'textAlignVertical', 'textAutoResize', 'autoResize',
      'paragraphIndent', 'paragraphSpacing', 'lineHeight', 'letterSpacing',
      'textCase', 'textDecoration', 'textDecorationStyle', 'textDecorationOffset',
      'textDecorationThickness', 'textDecorationColor', 'textDecorationSkipInk',
      'textTruncation', 'maxLines', 'hyperlink', 'textStyleId',
      'openTypeFeatures', 'hangingPunctuation', 'hangingList', 'leadingTrim', 'listSpacing',
      'autoRename',
    ],
    'ComponentMixin': [
      'componentPropertyDefinitions', 'variantProperties',
      'description', 'documentationLinks',
    ],
    'InstanceMixin': [
      'mainComponent', 'mainComponentId', 'mainComponentName',
      'componentId', 'componentProperties',
      'exposedInstances', 'isExposedInstance', 'overrides', 'scaleFactor',
      'swapComponent',
    ],
    'VectorMixin': ['vectorNetwork', 'vectorPaths', 'handleMirroring'],
    'PolygonMixin': ['pointCount'],
    'StarMixin': ['innerRadius'],
    'EllipseMixin': ['arcData'],
    'LineMixin': ['length', 'color', 'weight'],
    'SectionMixin': ['sectionContentsHidden', 'devStatus'],
    'ExportMixin': ['exportSettings'],
    'ReactionMixin': ['reactions'],
    'BooleanOperationMixin': ['booleanOperation'],
    'ConnectorMixin': [
      'connectorStart', 'connectorEnd', 'connectorLineType',
      'connectorStartStrokeCap', 'connectorEndStrokeCap', 'textBackground',
    ],
    'StickyMixin': ['authorVisible', 'authorName', 'isWideWidth'],
    'ShapeWithTextMixin': ['shapeType'],
    'CodeBlockMixin': ['code', 'codeLanguage'],
    'TableMixin': ['numRows', 'numColumns'],
    'SlideMixin': ['isSkippedSlide'],
    'InteractiveSlideElementMixin': ['interactiveSlideElementType'],
    'WidgetMixin': ['widgetId', 'widgetSyncedState'],
    'EmbedMixin': ['embedData'],
    'LinkUnfurlMixin': ['linkUnfurlData'],
    'MediaMixin': ['mediaData'],
  };

  // Build categorized output
  const categorizedProps: string[] = [];
  const usedProps = new Set<string>();

  for (const [category, props] of Object.entries(categories)) {
    const categoryProps = props.filter(p => allProps.has(p) && !usedProps.has(p));
    if (categoryProps.length > 0) {
      categoryProps.forEach(p => usedProps.add(p));
      categorizedProps.push(`  // ${category}`);
      categorizedProps.push(`  ${categoryProps.map(p => `'${p}'`).join(', ')},`);
      categorizedProps.push('');
    }
  }

  // Add any remaining uncategorized props
  const remaining = sortedProps.filter(p => !usedProps.has(p));
  if (remaining.length > 0) {
    categorizedProps.push('  // Other');
    categorizedProps.push(`  ${remaining.map(p => `'${p}'`).join(', ')},`);
  }

  // Generate output file
  const output = `/**
 * AUTO-GENERATED - DO NOT EDIT
 * Generated from types/data.ts by scripts/generate-serializable-props.ts
 * Run \`npm run generate:props\` to regenerate
 */

/**
 * All Figma node properties that should be serialized when querying nodes.
 * These are getters on the Figma API prototype, not enumerable via Object.keys().
 * Organized by Figma mixin for maintainability.
 */
export const SERIALIZABLE_PROPS = [
${categorizedProps.join('\n')}
] as const;

export type SerializableProp = typeof SERIALIZABLE_PROPS[number];
`;

  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`Generated ${OUTPUT_FILE} with ${allProps.size} properties`);
}

main();

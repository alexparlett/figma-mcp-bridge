/**
 * AUTO-GENERATED - DO NOT EDIT
 * Generated from types/data.ts by scripts/generate-serializable-props.ts
 * Run `npm run generate:props` to regenerate
 */

/**
 * All Figma node properties that should be serialized when querying nodes.
 * These are getters on the Figma API prototype, not enumerable via Object.keys().
 * Organized by Figma mixin for maintainability.
 */
export const SERIALIZABLE_PROPS = [
  // BaseNodeMixin
  'name', 'visible', 'locked',

  // LayoutMixin (geometry)
  'x', 'y', 'width', 'height', 'rotation', 'absoluteTransform', 'relativeTransform', 'absoluteBoundingBox', 'absoluteRenderBounds', 'layoutAlign', 'layoutGrow', 'layoutPositioning',

  // ConstraintMixin
  'constraints',

  // BlendMixin
  'opacity', 'blendMode', 'isMask', 'maskType',

  // FillsMixin
  'fills', 'fillStyleId', 'fill', 'fillColor',

  // StrokesMixin
  'strokes', 'strokeStyleId', 'stroke', 'strokeColor', 'strokeWeight', 'strokeAlign', 'strokeCap', 'strokeJoin', 'strokeMiterLimit', 'dashPattern', 'strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight',

  // CornerMixin
  'cornerRadius', 'cornerSmoothing', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius',

  // EffectMixin
  'effects', 'effectStyleId',

  // AutoLayoutMixin
  'layoutMode', 'primaryAxisSizingMode', 'counterAxisSizingMode', 'primaryAxisAlignItems', 'counterAxisAlignItems', 'counterAxisAlignContent', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'padding', 'itemSpacing', 'counterAxisSpacing', 'gap', 'layoutWrap', 'wrap', 'itemReverseZIndex', 'strokesIncludedInLayout', 'direction', 'align', 'counterAlign', 'layout',

  // SizeMixin
  'minWidth', 'maxWidth', 'minHeight', 'maxHeight',

  // BaseFrameMixin
  'clipsContent', 'guides', 'layoutGrids', 'gridStyleId',

  // TextMixin
  'characters', 'text', 'fontSize', 'fontFamily', 'fontStyle', 'fontWeight', 'textAlignHorizontal', 'textAlignVertical', 'textAutoResize', 'autoResize', 'paragraphIndent', 'paragraphSpacing', 'lineHeight', 'letterSpacing', 'textCase', 'textDecoration', 'textDecorationStyle', 'textDecorationOffset', 'textDecorationThickness', 'textDecorationColor', 'textDecorationSkipInk', 'textTruncation', 'maxLines', 'hyperlink', 'textStyleId', 'hangingPunctuation', 'hangingList', 'leadingTrim', 'listSpacing', 'autoRename',

  // ComponentMixin
  'componentPropertyDefinitions', 'description', 'documentationLinks',

  // InstanceMixin
  'mainComponent', 'mainComponentId', 'mainComponentName', 'componentId', 'componentProperties', 'exposedInstances', 'isExposedInstance', 'overrides', 'scaleFactor', 'swapComponent',

  // VectorMixin
  'vectorNetwork', 'vectorPaths', 'handleMirroring',

  // PolygonMixin
  'pointCount',

  // StarMixin
  'innerRadius',

  // EllipseMixin
  'arcData',

  // LineMixin
  'length', 'color', 'weight',

  // SectionMixin
  'sectionContentsHidden', 'devStatus',

  // ExportMixin
  'exportSettings',

  // ReactionMixin
  'reactions',

  // BooleanOperationMixin
  'booleanOperation',

  // ConnectorMixin
  'connectorStart', 'connectorEnd', 'connectorLineType', 'connectorStartStrokeCap', 'connectorEndStrokeCap', 'textBackground',

  // StickyMixin
  'authorVisible', 'authorName', 'isWideWidth',

  // ShapeWithTextMixin
  'shapeType',

  // CodeBlockMixin
  'code', 'codeLanguage',

  // TableMixin
  'numRows', 'numColumns',

  // SlideMixin
  'isSkippedSlide',

  // InteractiveSlideElementMixin
  'interactiveSlideElementType',

  // WidgetMixin
  'widgetId', 'widgetSyncedState',

  // EmbedMixin
  'embedData',

  // LinkUnfurlMixin
  'linkUnfurlData',

  // MediaMixin
  'mediaData',

  // Other
  'defaultVariantId',
] as const;

export type SerializableProp = typeof SERIALIZABLE_PROPS[number];

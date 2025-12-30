/**
 * Auto-generated JSON schemas for MCP tools.
 * DO NOT EDIT - regenerate with: npx tsx scripts/generate-schemas.ts
 * 
 * MCP SDK v0.18.3+ supports full JSON schema with $ref and definitions.
 */

import type { CommandType } from '../../types/commands.js';

export interface ToolSchema {
  name: string;
  description: string;
  commandType: CommandType;
  inputSchema: Record<string, unknown>;
  isFetchCommand?: boolean;
}

export const generatedTools: ToolSchema[] = [
  // figma_status
  {
    name: "figma_status",
    description: "Check if the Figma plugin is connected and ready to receive commands. Call this first if you're unsure about connection state.",
    commandType: "CREATE_PAGE" as CommandType,
    inputSchema: {
        "type": "object",
        "properties": {}
    },
  },
  // figma_create_page
  {
    name: "figma_create_page",
    description: "Create a new page in the Figma file. Pages are top-level containers in Figma documents.",
    commandType: "CREATE_PAGE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Create a new page in the Figma file. Pages are top-level containers in Figma documents.",
        "definitions": {}
    },
  },
  // figma_create_page_divider
  {
    name: "figma_create_page_divider",
    description: "Create a visual divider in the Figma page list to organize pages into sections.",
    commandType: "CREATE_PAGE_DIVIDER" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Create a visual divider in the Figma page list to organize pages into sections.",
        "definitions": {}
    },
  },
  // figma_create_frame
  {
    name: "figma_create_frame",
    description: "Create a frame container in Figma. Frames are the primary building block for layouts - use them to group elements, create screens, cards, or any container. Enable auto-layout to automatically arrange children horizontally or vertically with consistent spacing.",
    commandType: "CREATE_FRAME" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fillColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "stroke": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ColorInput"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "color": {
                                "type": "string"
                            },
                            "weight": {
                                "type": "number"
                            },
                            "opacity": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "color"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "strokeColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "strokeMiterLimit": {
                "type": "number"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "strokeTopWeight": {
                "type": "number"
            },
            "strokeRightWeight": {
                "type": "number"
            },
            "strokeBottomWeight": {
                "type": "number"
            },
            "strokeLeftWeight": {
                "type": "number"
            },
            "cornerRadius": {
                "type": "number"
            },
            "topLeftRadius": {
                "type": "number"
            },
            "topRightRadius": {
                "type": "number"
            },
            "bottomLeftRadius": {
                "type": "number"
            },
            "bottomRightRadius": {
                "type": "number"
            },
            "cornerSmoothing": {
                "type": "number"
            },
            "layoutMode": {
                "type": "string",
                "enum": [
                    "NONE",
                    "HORIZONTAL",
                    "VERTICAL",
                    "GRID"
                ]
            },
            "paddingTop": {
                "type": "number"
            },
            "paddingRight": {
                "type": "number"
            },
            "paddingBottom": {
                "type": "number"
            },
            "paddingLeft": {
                "type": "number"
            },
            "primaryAxisSizingMode": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            },
            "counterAxisSizingMode": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            },
            "primaryAxisAlignItems": {
                "type": "string",
                "enum": [
                    "MIN",
                    "MAX",
                    "CENTER",
                    "SPACE_BETWEEN"
                ]
            },
            "counterAxisAlignItems": {
                "type": "string",
                "enum": [
                    "MIN",
                    "MAX",
                    "CENTER",
                    "BASELINE"
                ]
            },
            "counterAxisAlignContent": {
                "type": "string",
                "enum": [
                    "AUTO",
                    "SPACE_BETWEEN"
                ]
            },
            "itemSpacing": {
                "type": "number"
            },
            "counterAxisSpacing": {
                "type": [
                    "number",
                    "null"
                ]
            },
            "layoutWrap": {
                "type": "string",
                "enum": [
                    "NO_WRAP",
                    "WRAP"
                ]
            },
            "strokesIncludedInLayout": {
                "type": "boolean"
            },
            "itemReverseZIndex": {
                "type": "boolean"
            },
            "direction": {
                "type": "string",
                "enum": [
                    "HORIZONTAL",
                    "VERTICAL"
                ]
            },
            "gap": {
                "type": "number"
            },
            "padding": {
                "type": "number"
            },
            "align": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "SPACE_BETWEEN"
                ]
            },
            "counterAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "BASELINE"
                ]
            },
            "wrap": {
                "type": "string",
                "enum": [
                    "NO_WRAP",
                    "WRAP"
                ]
            },
            "layout": {
                "$ref": "#/definitions/LayoutConfig"
            },
            "layoutGrids": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/LayoutGridConfig"
                }
            },
            "gridStyleId": {
                "type": "string"
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            },
            "clipsContent": {
                "type": "boolean"
            },
            "guides": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "axis": {
                            "type": "string",
                            "enum": [
                                "X",
                                "Y"
                            ]
                        },
                        "offset": {
                            "type": "number"
                        }
                    },
                    "required": [
                        "axis",
                        "offset"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "additionalProperties": false,
        "description": "Create a frame container in Figma. Frames are the primary building block for layouts - use them to group elements, create screens, cards, or any container. Enable auto-layout to automatically arrange children horizontally or vertically with consistent spacing.",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            },
            "LayoutConfig": {
                "type": "object",
                "properties": {
                    "mode": {
                        "$ref": "#/definitions/LayoutMode"
                    },
                    "direction": {
                        "type": "string",
                        "enum": [
                            "HORIZONTAL",
                            "VERTICAL"
                        ]
                    },
                    "wrap": {
                        "$ref": "#/definitions/LayoutWrap"
                    },
                    "gap": {
                        "type": "number"
                    },
                    "itemSpacing": {
                        "type": "number"
                    },
                    "counterAxisSpacing": {
                        "type": "number"
                    },
                    "padding": {
                        "type": "number"
                    },
                    "paddingTop": {
                        "type": "number"
                    },
                    "paddingRight": {
                        "type": "number"
                    },
                    "paddingBottom": {
                        "type": "number"
                    },
                    "paddingLeft": {
                        "type": "number"
                    },
                    "primaryAlign": {
                        "$ref": "#/definitions/PrimaryAxisAlign"
                    },
                    "counterAlign": {
                        "$ref": "#/definitions/CounterAxisAlign"
                    },
                    "primaryAxisSizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "counterAxisSizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "primarySizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "counterSizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "layoutAlign": {
                        "$ref": "#/definitions/LayoutAlign"
                    },
                    "layoutGrow": {
                        "type": "number"
                    },
                    "layoutPositioning": {
                        "$ref": "#/definitions/LayoutPositioning"
                    },
                    "minWidth": {
                        "type": "number"
                    },
                    "maxWidth": {
                        "type": "number"
                    },
                    "minHeight": {
                        "type": "number"
                    },
                    "maxHeight": {
                        "type": "number"
                    },
                    "clipsContent": {
                        "type": "boolean"
                    },
                    "itemReverseZIndex": {
                        "type": "boolean"
                    },
                    "strokesIncludedInLayout": {
                        "type": "boolean"
                    }
                },
                "additionalProperties": false
            },
            "LayoutMode": {
                "type": "string",
                "enum": [
                    "NONE",
                    "HORIZONTAL",
                    "VERTICAL"
                ]
            },
            "LayoutWrap": {
                "type": "string",
                "enum": [
                    "NO_WRAP",
                    "WRAP"
                ]
            },
            "PrimaryAxisAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "SPACE_BETWEEN"
                ]
            },
            "CounterAxisAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "BASELINE"
                ]
            },
            "AxisSizingMode": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            },
            "LayoutAlign": {
                "type": "string",
                "enum": [
                    "INHERIT",
                    "STRETCH",
                    "MIN",
                    "CENTER",
                    "MAX"
                ]
            },
            "LayoutPositioning": {
                "type": "string",
                "enum": [
                    "AUTO",
                    "ABSOLUTE"
                ]
            },
            "LayoutGridConfig": {
                "type": "object",
                "properties": {
                    "pattern": {
                        "$ref": "#/definitions/LayoutGridPattern"
                    },
                    "sectionSize": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "color": {
                        "type": "string"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "alignment": {
                        "$ref": "#/definitions/LayoutGridAlignment"
                    },
                    "gutterSize": {
                        "type": "number"
                    },
                    "count": {
                        "type": "number"
                    },
                    "offset": {
                        "type": "number"
                    }
                },
                "required": [
                    "pattern",
                    "sectionSize"
                ],
                "additionalProperties": false
            },
            "LayoutGridPattern": {
                "type": "string",
                "enum": [
                    "COLUMNS",
                    "ROWS",
                    "GRID"
                ]
            },
            "LayoutGridAlignment": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH"
                ]
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        },
        "required": [
            "name",
            "width",
            "height"
        ]
    },
  },
  // figma_create_rectangle
  {
    name: "figma_create_rectangle",
    description: "Create a rectangle shape. Use for backgrounds, buttons, cards, dividers, or any rectangular element. Unlike frames, rectangles cannot contain children. Use cornerRadius for rounded rectangles.",
    commandType: "CREATE_RECTANGLE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fillColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "stroke": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ColorInput"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "color": {
                                "type": "string"
                            },
                            "weight": {
                                "type": "number"
                            },
                            "opacity": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "color"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "strokeColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "strokeMiterLimit": {
                "type": "number"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "strokeTopWeight": {
                "type": "number"
            },
            "strokeRightWeight": {
                "type": "number"
            },
            "strokeBottomWeight": {
                "type": "number"
            },
            "strokeLeftWeight": {
                "type": "number"
            },
            "cornerRadius": {
                "type": "number"
            },
            "topLeftRadius": {
                "type": "number"
            },
            "topRightRadius": {
                "type": "number"
            },
            "bottomLeftRadius": {
                "type": "number"
            },
            "bottomRightRadius": {
                "type": "number"
            },
            "cornerSmoothing": {
                "type": "number"
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            }
        },
        "additionalProperties": false,
        "description": "Create a rectangle shape. Use for backgrounds, buttons, cards, dividers, or any rectangular element. Unlike frames, rectangles cannot contain children. Use cornerRadius for rounded rectangles.",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        },
        "required": [
            "name",
            "width",
            "height"
        ]
    },
  },
  // figma_create_ellipse
  {
    name: "figma_create_ellipse",
    description: "Create an ellipse or circle shape. Set width equal to height for a perfect circle. Use arcData for arcs and pie chart segments.",
    commandType: "CREATE_ELLIPSE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fillColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "stroke": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ColorInput"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "color": {
                                "type": "string"
                            },
                            "weight": {
                                "type": "number"
                            },
                            "opacity": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "color"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "strokeColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "strokeMiterLimit": {
                "type": "number"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "strokeTopWeight": {
                "type": "number"
            },
            "strokeRightWeight": {
                "type": "number"
            },
            "strokeBottomWeight": {
                "type": "number"
            },
            "strokeLeftWeight": {
                "type": "number"
            },
            "arcData": {
                "type": "object",
                "properties": {
                    "startingAngle": {
                        "type": "number"
                    },
                    "endingAngle": {
                        "type": "number"
                    },
                    "innerRadius": {
                        "type": "number"
                    }
                },
                "required": [
                    "startingAngle",
                    "endingAngle",
                    "innerRadius"
                ],
                "additionalProperties": false
            },
            "cornerRadius": {
                "type": "number"
            },
            "cornerSmoothing": {
                "type": "number"
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            }
        },
        "additionalProperties": false,
        "description": "Create an ellipse or circle shape. Set width equal to height for a perfect circle. Use arcData for arcs and pie chart segments.",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        },
        "required": [
            "name",
            "width",
            "height"
        ]
    },
  },
  // figma_create_polygon
  {
    name: "figma_create_polygon",
    description: "Create a regular polygon with a specified number of sides. Use pointCount=3 for triangle, 4 for square/diamond, 5 for pentagon, 6 for hexagon, etc. The polygon fits within the width/height bounds.",
    commandType: "CREATE_POLYGON" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fillColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "stroke": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ColorInput"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "color": {
                                "type": "string"
                            },
                            "weight": {
                                "type": "number"
                            },
                            "opacity": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "color"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "strokeColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "strokeMiterLimit": {
                "type": "number"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "strokeTopWeight": {
                "type": "number"
            },
            "strokeRightWeight": {
                "type": "number"
            },
            "strokeBottomWeight": {
                "type": "number"
            },
            "strokeLeftWeight": {
                "type": "number"
            },
            "pointCount": {
                "type": "number"
            },
            "cornerRadius": {
                "type": "number"
            },
            "cornerSmoothing": {
                "type": "number"
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "pointCount"
        ],
        "additionalProperties": false,
        "description": "Create a regular polygon with a specified number of sides. Use pointCount=3 for triangle, 4 for square/diamond, 5 for pentagon, 6 for hexagon, etc. The polygon fits within the width/height bounds.",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        }
    },
  },
  // figma_create_star
  {
    name: "figma_create_star",
    description: "Create a star shape with configurable points and sharpness. Control the star's pointiness with innerRadius - lower values create sharper points, higher values create more rounded stars.",
    commandType: "CREATE_STAR" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fillColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "stroke": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ColorInput"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "color": {
                                "type": "string"
                            },
                            "weight": {
                                "type": "number"
                            },
                            "opacity": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "color"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "strokeColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "strokeMiterLimit": {
                "type": "number"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "strokeTopWeight": {
                "type": "number"
            },
            "strokeRightWeight": {
                "type": "number"
            },
            "strokeBottomWeight": {
                "type": "number"
            },
            "strokeLeftWeight": {
                "type": "number"
            },
            "pointCount": {
                "type": "number"
            },
            "innerRadius": {
                "type": "number"
            },
            "cornerRadius": {
                "type": "number"
            },
            "cornerSmoothing": {
                "type": "number"
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "pointCount"
        ],
        "additionalProperties": false,
        "description": "Create a star shape with configurable points and sharpness. Control the star's pointiness with innerRadius - lower values create sharper points, higher values create more rounded stars.",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        }
    },
  },
  // figma_create_line
  {
    name: "figma_create_line",
    description: "Create a line element. Lines are 1-dimensional strokes useful for dividers, separators, or decorative elements. Use dashPattern for dashed/dotted lines. Rotation of 0 = horizontal, 90 = vertical.",
    commandType: "CREATE_LINE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fillColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "stroke": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ColorInput"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "color": {
                                "type": "string"
                            },
                            "weight": {
                                "type": "number"
                            },
                            "opacity": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "color"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "strokeColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "strokeMiterLimit": {
                "type": "number"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "strokeTopWeight": {
                "type": "number"
            },
            "strokeRightWeight": {
                "type": "number"
            },
            "strokeBottomWeight": {
                "type": "number"
            },
            "strokeLeftWeight": {
                "type": "number"
            },
            "length": {
                "type": "number"
            },
            "color": {
                "$ref": "#/definitions/ColorInput"
            },
            "weight": {
                "type": "number"
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            }
        },
        "additionalProperties": false,
        "description": "Create a line element. Lines are 1-dimensional strokes useful for dividers, separators, or decorative elements. Use dashPattern for dashed/dotted lines. Rotation of 0 = horizontal, 90 = vertical.",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        },
        "required": [
            "length"
        ]
    },
  },
  // figma_create_vector
  {
    name: "figma_create_vector",
    description: "Create a custom vector shape using SVG path commands. Use this for icons, custom shapes, or any path-based artwork. Path data uses standard SVG syntax (M=move, L=line, C=curve, Z=close).",
    commandType: "CREATE_VECTOR" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fillColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "stroke": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ColorInput"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "color": {
                                "type": "string"
                            },
                            "weight": {
                                "type": "number"
                            },
                            "opacity": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "color"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "strokeColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "strokeMiterLimit": {
                "type": "number"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "strokeTopWeight": {
                "type": "number"
            },
            "strokeRightWeight": {
                "type": "number"
            },
            "strokeBottomWeight": {
                "type": "number"
            },
            "strokeLeftWeight": {
                "type": "number"
            },
            "vectorPaths": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/VectorPath"
                }
            },
            "vectorNetwork": {
                "type": "object",
                "properties": {
                    "vertices": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "x": {
                                    "type": "number"
                                },
                                "y": {
                                    "type": "number"
                                },
                                "strokeCap": {
                                    "$ref": "#/definitions/StrokeCap"
                                },
                                "strokeJoin": {
                                    "$ref": "#/definitions/StrokeJoin"
                                },
                                "cornerRadius": {
                                    "type": "number"
                                },
                                "handleMirroring": {
                                    "type": "string",
                                    "enum": [
                                        "NONE",
                                        "ANGLE",
                                        "ANGLE_AND_LENGTH"
                                    ]
                                }
                            },
                            "required": [
                                "x",
                                "y"
                            ],
                            "additionalProperties": false
                        }
                    },
                    "segments": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "start": {
                                    "type": "number"
                                },
                                "end": {
                                    "type": "number"
                                },
                                "tangentStart": {
                                    "type": "object",
                                    "properties": {
                                        "x": {
                                            "type": "number"
                                        },
                                        "y": {
                                            "type": "number"
                                        }
                                    },
                                    "required": [
                                        "x",
                                        "y"
                                    ],
                                    "additionalProperties": false
                                },
                                "tangentEnd": {
                                    "type": "object",
                                    "properties": {
                                        "x": {
                                            "type": "number"
                                        },
                                        "y": {
                                            "type": "number"
                                        }
                                    },
                                    "required": [
                                        "x",
                                        "y"
                                    ],
                                    "additionalProperties": false
                                }
                            },
                            "required": [
                                "start",
                                "end"
                            ],
                            "additionalProperties": false
                        }
                    },
                    "regions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "windingRule": {
                                    "type": "string",
                                    "enum": [
                                        "NONZERO",
                                        "EVENODD"
                                    ]
                                },
                                "loops": {
                                    "type": "array",
                                    "items": {
                                        "type": "array",
                                        "items": {
                                            "type": "number"
                                        }
                                    }
                                },
                                "fills": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/PaintInput"
                                    }
                                },
                                "fillStyleId": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "windingRule",
                                "loops"
                            ],
                            "additionalProperties": false
                        }
                    }
                },
                "required": [
                    "vertices",
                    "segments"
                ],
                "additionalProperties": false
            },
            "cornerRadius": {
                "type": "number"
            },
            "cornerSmoothing": {
                "type": "number"
            },
            "handleMirroring": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ANGLE",
                    "ANGLE_AND_LENGTH"
                ]
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            }
        },
        "additionalProperties": false,
        "description": "Create a custom vector shape using SVG path commands. Use this for icons, custom shapes, or any path-based artwork. Path data uses standard SVG syntax (M=move, L=line, C=curve, Z=close).",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            },
            "VectorPath": {
                "type": "object",
                "properties": {
                    "windingRule": {
                        "type": "string",
                        "enum": [
                            "NONZERO",
                            "EVENODD"
                        ]
                    },
                    "data": {
                        "type": "string"
                    }
                },
                "required": [
                    "windingRule",
                    "data"
                ],
                "additionalProperties": false
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        },
        "required": [
            "vectorPaths"
        ]
    },
  },
  // figma_create_from_svg
  {
    name: "figma_create_from_svg",
    description: "Import a complete SVG file as a Figma frame. The SVG is parsed and converted to native Figma vector nodes. Use this for icons, illustrations, or any SVG artwork.",
    commandType: "CREATE_FROM_SVG" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "svg": {
                "type": "string"
            }
        },
        "required": [
            "svg"
        ],
        "additionalProperties": false,
        "description": "Import a complete SVG file as a Figma frame. The SVG is parsed and converted to native Figma vector nodes. Use this for icons, illustrations, or any SVG artwork.",
        "definitions": {}
    },
  },
  // figma_create_section
  {
    name: "figma_create_section",
    description: "Create a section to organize content on the canvas. Sections are high-level containers that visually group related frames and elements. Unlike frames, sections don't clip content and are primarily for organization.",
    commandType: "CREATE_SECTION" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "sectionContentsHidden": {
                "type": "boolean"
            },
            "devStatus": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "NONE",
                            "READY_FOR_DEV",
                            "COMPLETED"
                        ]
                    },
                    "description": {
                        "type": "string"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            }
        },
        "additionalProperties": false,
        "description": "Create a section to organize content on the canvas. Sections are high-level containers that visually group related frames and elements. Unlike frames, sections don't clip content and are primarily for organization.",
        "definitions": {
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "name"
        ]
    },
  },
  // figma_create_slice
  {
    name: "figma_create_slice",
    description: "Create a slice to define an export region. Slices are invisible guides that mark areas for batch export - useful for exporting specific regions that may span multiple elements.",
    commandType: "CREATE_SLICE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "exportSettings": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/ExportSetting"
                }
            }
        },
        "additionalProperties": false,
        "description": "Create a slice to define an export region. Slices are invisible guides that mark areas for batch export - useful for exporting specific regions that may span multiple elements.",
        "definitions": {
            "ExportSetting": {
                "type": "object",
                "properties": {
                    "format": {
                        "type": "string",
                        "enum": [
                            "PNG",
                            "JPG",
                            "SVG",
                            "PDF"
                        ]
                    },
                    "suffix": {
                        "type": "string"
                    },
                    "contentsOnly": {
                        "type": "boolean"
                    },
                    "constraint": {
                        "type": "object",
                        "properties": {
                            "type": {
                                "type": "string",
                                "enum": [
                                    "SCALE",
                                    "WIDTH",
                                    "HEIGHT"
                                ]
                            },
                            "value": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "type",
                            "value"
                        ],
                        "additionalProperties": false
                    }
                },
                "required": [
                    "format"
                ],
                "additionalProperties": false
            }
        },
        "required": [
            "width",
            "height"
        ]
    },
  },
  // figma_create_text
  {
    name: "figma_create_text",
    description: "Create a text element. The font must be available in Figma - Inter is always safe. Text auto-sizes by default; set width to create a fixed-width text box that wraps.",
    commandType: "CREATE_TEXT" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fillColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "text": {
                "type": "string"
            },
            "characters": {
                "type": "string"
            },
            "fontFamily": {
                "type": "string"
            },
            "fontStyle": {
                "type": "string"
            },
            "fontSize": {
                "type": "number"
            },
            "fontWeight": {
                "type": "number"
            },
            "lineHeight": {
                "anyOf": [
                    {
                        "type": "number"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "value": {
                                "type": "number"
                            },
                            "unit": {
                                "type": "string",
                                "enum": [
                                    "PIXELS",
                                    "PERCENT",
                                    "AUTO"
                                ]
                            }
                        },
                        "required": [
                            "value",
                            "unit"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "letterSpacing": {
                "anyOf": [
                    {
                        "type": "number"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "value": {
                                "type": "number"
                            },
                            "unit": {
                                "type": "string",
                                "enum": [
                                    "PIXELS",
                                    "PERCENT"
                                ]
                            }
                        },
                        "required": [
                            "value",
                            "unit"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "paragraphSpacing": {
                "type": "number"
            },
            "paragraphIndent": {
                "type": "number"
            },
            "listSpacing": {
                "type": "number"
            },
            "textCase": {
                "type": "string",
                "enum": [
                    "ORIGINAL",
                    "UPPER",
                    "LOWER",
                    "TITLE",
                    "SMALL_CAPS",
                    "SMALL_CAPS_FORCED"
                ]
            },
            "textDecoration": {
                "type": "string",
                "enum": [
                    "NONE",
                    "UNDERLINE",
                    "STRIKETHROUGH"
                ]
            },
            "textDecorationStyle": {
                "type": "string",
                "enum": [
                    "SOLID",
                    "DOUBLE",
                    "DOTTED",
                    "DASHED",
                    "WAVY"
                ]
            },
            "textDecorationOffset": {
                "anyOf": [
                    {
                        "type": "number"
                    },
                    {
                        "type": "string",
                        "const": "AUTO"
                    }
                ]
            },
            "textDecorationThickness": {
                "anyOf": [
                    {
                        "type": "number"
                    },
                    {
                        "type": "string",
                        "const": "AUTO"
                    }
                ]
            },
            "textDecorationColor": {
                "anyOf": [
                    {
                        "type": "object",
                        "properties": {
                            "r": {
                                "type": "number"
                            },
                            "g": {
                                "type": "number"
                            },
                            "b": {
                                "type": "number"
                            },
                            "a": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "r",
                            "g",
                            "b"
                        ],
                        "additionalProperties": false
                    },
                    {
                        "type": "string",
                        "const": "CURRENT_COLOR"
                    }
                ]
            },
            "textDecorationSkipInk": {
                "type": "boolean"
            },
            "textAlignHorizontal": {
                "type": "string",
                "enum": [
                    "LEFT",
                    "CENTER",
                    "RIGHT",
                    "JUSTIFIED"
                ]
            },
            "textAlignVertical": {
                "type": "string",
                "enum": [
                    "TOP",
                    "CENTER",
                    "BOTTOM"
                ]
            },
            "textAutoResize": {
                "type": "string",
                "enum": [
                    "NONE",
                    "WIDTH_AND_HEIGHT",
                    "HEIGHT",
                    "TRUNCATE"
                ]
            },
            "textTruncation": {
                "type": "string",
                "enum": [
                    "DISABLED",
                    "ENDING"
                ]
            },
            "maxLines": {
                "type": [
                    "number",
                    "null"
                ]
            },
            "autoRename": {
                "type": "boolean"
            },
            "hangingPunctuation": {
                "type": "boolean"
            },
            "hangingList": {
                "type": "boolean"
            },
            "leadingTrim": {
                "type": "string",
                "enum": [
                    "NONE",
                    "CAP_HEIGHT"
                ]
            },
            "hyperlink": {
                "anyOf": [
                    {
                        "type": "object",
                        "properties": {
                            "type": {
                                "type": "string",
                                "enum": [
                                    "URL",
                                    "NODE"
                                ]
                            },
                            "value": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "type",
                            "value"
                        ],
                        "additionalProperties": false
                    },
                    {
                        "type": "null"
                    }
                ]
            },
            "textStyleId": {
                "type": "string"
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            },
            "autoResize": {
                "type": "string",
                "enum": [
                    "WIDTH_AND_HEIGHT",
                    "HEIGHT",
                    "NONE",
                    "TRUNCATE"
                ]
            }
        },
        "additionalProperties": false,
        "description": "Create a text element. The font must be available in Figma - Inter is always safe. Text auto-sizes by default; set width to create a fixed-width text box that wraps.",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        },
        "required": [
            "text"
        ]
    },
  },
  // figma_create_component
  {
    name: "figma_create_component",
    description: "Create a reusable component (master). Components are like templates - create instances to reuse them throughout your design. Changes to a component automatically update all instances. Use '/' in names for organization.",
    commandType: "CREATE_COMPONENT" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fillColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "stroke": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ColorInput"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "color": {
                                "type": "string"
                            },
                            "weight": {
                                "type": "number"
                            },
                            "opacity": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "color"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "strokeColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "strokeMiterLimit": {
                "type": "number"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "strokeTopWeight": {
                "type": "number"
            },
            "strokeRightWeight": {
                "type": "number"
            },
            "strokeBottomWeight": {
                "type": "number"
            },
            "strokeLeftWeight": {
                "type": "number"
            },
            "cornerRadius": {
                "type": "number"
            },
            "topLeftRadius": {
                "type": "number"
            },
            "topRightRadius": {
                "type": "number"
            },
            "bottomLeftRadius": {
                "type": "number"
            },
            "bottomRightRadius": {
                "type": "number"
            },
            "cornerSmoothing": {
                "type": "number"
            },
            "layoutMode": {
                "type": "string",
                "enum": [
                    "NONE",
                    "HORIZONTAL",
                    "VERTICAL",
                    "GRID"
                ]
            },
            "paddingTop": {
                "type": "number"
            },
            "paddingRight": {
                "type": "number"
            },
            "paddingBottom": {
                "type": "number"
            },
            "paddingLeft": {
                "type": "number"
            },
            "primaryAxisSizingMode": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            },
            "counterAxisSizingMode": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            },
            "primaryAxisAlignItems": {
                "type": "string",
                "enum": [
                    "MIN",
                    "MAX",
                    "CENTER",
                    "SPACE_BETWEEN"
                ]
            },
            "counterAxisAlignItems": {
                "type": "string",
                "enum": [
                    "MIN",
                    "MAX",
                    "CENTER",
                    "BASELINE"
                ]
            },
            "counterAxisAlignContent": {
                "type": "string",
                "enum": [
                    "AUTO",
                    "SPACE_BETWEEN"
                ]
            },
            "itemSpacing": {
                "type": "number"
            },
            "counterAxisSpacing": {
                "type": [
                    "number",
                    "null"
                ]
            },
            "layoutWrap": {
                "type": "string",
                "enum": [
                    "NO_WRAP",
                    "WRAP"
                ]
            },
            "strokesIncludedInLayout": {
                "type": "boolean"
            },
            "itemReverseZIndex": {
                "type": "boolean"
            },
            "direction": {
                "type": "string",
                "enum": [
                    "HORIZONTAL",
                    "VERTICAL"
                ]
            },
            "gap": {
                "type": "number"
            },
            "padding": {
                "type": "number"
            },
            "align": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "SPACE_BETWEEN"
                ]
            },
            "counterAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "BASELINE"
                ]
            },
            "wrap": {
                "type": "string",
                "enum": [
                    "NO_WRAP",
                    "WRAP"
                ]
            },
            "layout": {
                "$ref": "#/definitions/LayoutConfig"
            },
            "layoutGrids": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/LayoutGridConfig"
                }
            },
            "gridStyleId": {
                "type": "string"
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            },
            "clipsContent": {
                "type": "boolean"
            },
            "guides": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "axis": {
                            "type": "string",
                            "enum": [
                                "X",
                                "Y"
                            ]
                        },
                        "offset": {
                            "type": "number"
                        }
                    },
                    "required": [
                        "axis",
                        "offset"
                    ],
                    "additionalProperties": false
                }
            },
            "description": {
                "type": "string"
            },
            "documentationLinks": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "uri": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "uri"
                    ],
                    "additionalProperties": false
                }
            },
            "componentPropertyDefinitions": {
                "type": "object",
                "additionalProperties": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "BOOLEAN",
                                "TEXT",
                                "INSTANCE_SWAP",
                                "VARIANT"
                            ]
                        },
                        "defaultValue": {
                            "type": [
                                "string",
                                "boolean"
                            ]
                        },
                        "variantOptions": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "preferredValues": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "COMPONENT",
                                            "COMPONENT_SET"
                                        ]
                                    },
                                    "key": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "type",
                                    "key"
                                ],
                                "additionalProperties": false
                            }
                        }
                    },
                    "required": [
                        "type",
                        "defaultValue"
                    ],
                    "additionalProperties": false
                }
            }
        },
        "additionalProperties": false,
        "description": "Create a reusable component (master). Components are like templates - create instances to reuse them throughout your design. Changes to a component automatically update all instances. Use '/' in names for organization.",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            },
            "LayoutConfig": {
                "type": "object",
                "properties": {
                    "mode": {
                        "$ref": "#/definitions/LayoutMode"
                    },
                    "direction": {
                        "type": "string",
                        "enum": [
                            "HORIZONTAL",
                            "VERTICAL"
                        ]
                    },
                    "wrap": {
                        "$ref": "#/definitions/LayoutWrap"
                    },
                    "gap": {
                        "type": "number"
                    },
                    "itemSpacing": {
                        "type": "number"
                    },
                    "counterAxisSpacing": {
                        "type": "number"
                    },
                    "padding": {
                        "type": "number"
                    },
                    "paddingTop": {
                        "type": "number"
                    },
                    "paddingRight": {
                        "type": "number"
                    },
                    "paddingBottom": {
                        "type": "number"
                    },
                    "paddingLeft": {
                        "type": "number"
                    },
                    "primaryAlign": {
                        "$ref": "#/definitions/PrimaryAxisAlign"
                    },
                    "counterAlign": {
                        "$ref": "#/definitions/CounterAxisAlign"
                    },
                    "primaryAxisSizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "counterAxisSizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "primarySizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "counterSizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "layoutAlign": {
                        "$ref": "#/definitions/LayoutAlign"
                    },
                    "layoutGrow": {
                        "type": "number"
                    },
                    "layoutPositioning": {
                        "$ref": "#/definitions/LayoutPositioning"
                    },
                    "minWidth": {
                        "type": "number"
                    },
                    "maxWidth": {
                        "type": "number"
                    },
                    "minHeight": {
                        "type": "number"
                    },
                    "maxHeight": {
                        "type": "number"
                    },
                    "clipsContent": {
                        "type": "boolean"
                    },
                    "itemReverseZIndex": {
                        "type": "boolean"
                    },
                    "strokesIncludedInLayout": {
                        "type": "boolean"
                    }
                },
                "additionalProperties": false
            },
            "LayoutMode": {
                "type": "string",
                "enum": [
                    "NONE",
                    "HORIZONTAL",
                    "VERTICAL"
                ]
            },
            "LayoutWrap": {
                "type": "string",
                "enum": [
                    "NO_WRAP",
                    "WRAP"
                ]
            },
            "PrimaryAxisAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "SPACE_BETWEEN"
                ]
            },
            "CounterAxisAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "BASELINE"
                ]
            },
            "AxisSizingMode": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            },
            "LayoutAlign": {
                "type": "string",
                "enum": [
                    "INHERIT",
                    "STRETCH",
                    "MIN",
                    "CENTER",
                    "MAX"
                ]
            },
            "LayoutPositioning": {
                "type": "string",
                "enum": [
                    "AUTO",
                    "ABSOLUTE"
                ]
            },
            "LayoutGridConfig": {
                "type": "object",
                "properties": {
                    "pattern": {
                        "$ref": "#/definitions/LayoutGridPattern"
                    },
                    "sectionSize": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "color": {
                        "type": "string"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "alignment": {
                        "$ref": "#/definitions/LayoutGridAlignment"
                    },
                    "gutterSize": {
                        "type": "number"
                    },
                    "count": {
                        "type": "number"
                    },
                    "offset": {
                        "type": "number"
                    }
                },
                "required": [
                    "pattern",
                    "sectionSize"
                ],
                "additionalProperties": false
            },
            "LayoutGridPattern": {
                "type": "string",
                "enum": [
                    "COLUMNS",
                    "ROWS",
                    "GRID"
                ]
            },
            "LayoutGridAlignment": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH"
                ]
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        },
        "required": [
            "name",
            "width",
            "height"
        ]
    },
  },
  // figma_create_instance
  {
    name: "figma_create_instance",
    description: "Create an instance of an existing component. Instances inherit all properties from their master component. You can override specific properties on instances without affecting the master.",
    commandType: "CREATE_INSTANCE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "fill": {
                "$ref": "#/definitions/ColorInput"
            },
            "fillColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "stroke": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ColorInput"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "color": {
                                "type": "string"
                            },
                            "weight": {
                                "type": "number"
                            },
                            "opacity": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "color"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "strokeColor": {
                "$ref": "#/definitions/ColorInput"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "strokeMiterLimit": {
                "type": "number"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "strokeTopWeight": {
                "type": "number"
            },
            "strokeRightWeight": {
                "type": "number"
            },
            "strokeBottomWeight": {
                "type": "number"
            },
            "strokeLeftWeight": {
                "type": "number"
            },
            "cornerRadius": {
                "type": "number"
            },
            "topLeftRadius": {
                "type": "number"
            },
            "topRightRadius": {
                "type": "number"
            },
            "bottomLeftRadius": {
                "type": "number"
            },
            "bottomRightRadius": {
                "type": "number"
            },
            "cornerSmoothing": {
                "type": "number"
            },
            "layoutMode": {
                "type": "string",
                "enum": [
                    "NONE",
                    "HORIZONTAL",
                    "VERTICAL",
                    "GRID"
                ]
            },
            "paddingTop": {
                "type": "number"
            },
            "paddingRight": {
                "type": "number"
            },
            "paddingBottom": {
                "type": "number"
            },
            "paddingLeft": {
                "type": "number"
            },
            "primaryAxisSizingMode": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            },
            "counterAxisSizingMode": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            },
            "primaryAxisAlignItems": {
                "type": "string",
                "enum": [
                    "MIN",
                    "MAX",
                    "CENTER",
                    "SPACE_BETWEEN"
                ]
            },
            "counterAxisAlignItems": {
                "type": "string",
                "enum": [
                    "MIN",
                    "MAX",
                    "CENTER",
                    "BASELINE"
                ]
            },
            "counterAxisAlignContent": {
                "type": "string",
                "enum": [
                    "AUTO",
                    "SPACE_BETWEEN"
                ]
            },
            "itemSpacing": {
                "type": "number"
            },
            "counterAxisSpacing": {
                "type": [
                    "number",
                    "null"
                ]
            },
            "layoutWrap": {
                "type": "string",
                "enum": [
                    "NO_WRAP",
                    "WRAP"
                ]
            },
            "strokesIncludedInLayout": {
                "type": "boolean"
            },
            "itemReverseZIndex": {
                "type": "boolean"
            },
            "direction": {
                "type": "string",
                "enum": [
                    "HORIZONTAL",
                    "VERTICAL"
                ]
            },
            "gap": {
                "type": "number"
            },
            "padding": {
                "type": "number"
            },
            "align": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "SPACE_BETWEEN"
                ]
            },
            "counterAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "BASELINE"
                ]
            },
            "wrap": {
                "type": "string",
                "enum": [
                    "NO_WRAP",
                    "WRAP"
                ]
            },
            "layout": {
                "$ref": "#/definitions/LayoutConfig"
            },
            "layoutGrids": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/LayoutGridConfig"
                }
            },
            "gridStyleId": {
                "type": "string"
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            },
            "clipsContent": {
                "type": "boolean"
            },
            "guides": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "axis": {
                            "type": "string",
                            "enum": [
                                "X",
                                "Y"
                            ]
                        },
                        "offset": {
                            "type": "number"
                        }
                    },
                    "required": [
                        "axis",
                        "offset"
                    ],
                    "additionalProperties": false
                }
            },
            "componentId": {
                "type": "string"
            },
            "overrides": {
                "type": "object",
                "additionalProperties": {
                    "type": "object",
                    "properties": {
                        "text": {
                            "type": "string"
                        },
                        "characters": {
                            "type": "string"
                        },
                        "fill": {
                            "$ref": "#/definitions/ColorInput"
                        },
                        "fills": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/PaintInput"
                            }
                        },
                        "visible": {
                            "type": "boolean"
                        },
                        "opacity": {
                            "type": "number"
                        },
                        "overrides": {
                            "type": "object",
                            "additionalProperties": {}
                        }
                    },
                    "additionalProperties": false
                }
            },
            "componentProperties": {
                "type": "object",
                "additionalProperties": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "BOOLEAN",
                                "TEXT",
                                "INSTANCE_SWAP",
                                "VARIANT"
                            ]
                        },
                        "value": {
                            "type": [
                                "string",
                                "boolean"
                            ]
                        },
                        "preferredValues": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "enum": [
                                            "COMPONENT",
                                            "COMPONENT_SET"
                                        ]
                                    },
                                    "key": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "type",
                                    "key"
                                ],
                                "additionalProperties": false
                            }
                        }
                    },
                    "required": [
                        "type",
                        "value"
                    ],
                    "additionalProperties": false
                }
            },
            "swapComponent": {
                "type": "string"
            },
            "scaleFactor": {
                "type": "number"
            },
            "isExposedInstance": {
                "type": "boolean"
            },
            "exposedInstances": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "mainComponentId": {
                "type": "string"
            },
            "mainComponentName": {
                "type": "string"
            }
        },
        "required": [
            "componentId"
        ],
        "additionalProperties": false,
        "description": "Create an instance of an existing component. Instances inherit all properties from their master component. You can override specific properties on instances without affecting the master.",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            },
            "LayoutConfig": {
                "type": "object",
                "properties": {
                    "mode": {
                        "$ref": "#/definitions/LayoutMode"
                    },
                    "direction": {
                        "type": "string",
                        "enum": [
                            "HORIZONTAL",
                            "VERTICAL"
                        ]
                    },
                    "wrap": {
                        "$ref": "#/definitions/LayoutWrap"
                    },
                    "gap": {
                        "type": "number"
                    },
                    "itemSpacing": {
                        "type": "number"
                    },
                    "counterAxisSpacing": {
                        "type": "number"
                    },
                    "padding": {
                        "type": "number"
                    },
                    "paddingTop": {
                        "type": "number"
                    },
                    "paddingRight": {
                        "type": "number"
                    },
                    "paddingBottom": {
                        "type": "number"
                    },
                    "paddingLeft": {
                        "type": "number"
                    },
                    "primaryAlign": {
                        "$ref": "#/definitions/PrimaryAxisAlign"
                    },
                    "counterAlign": {
                        "$ref": "#/definitions/CounterAxisAlign"
                    },
                    "primaryAxisSizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "counterAxisSizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "primarySizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "counterSizing": {
                        "$ref": "#/definitions/AxisSizingMode"
                    },
                    "layoutAlign": {
                        "$ref": "#/definitions/LayoutAlign"
                    },
                    "layoutGrow": {
                        "type": "number"
                    },
                    "layoutPositioning": {
                        "$ref": "#/definitions/LayoutPositioning"
                    },
                    "minWidth": {
                        "type": "number"
                    },
                    "maxWidth": {
                        "type": "number"
                    },
                    "minHeight": {
                        "type": "number"
                    },
                    "maxHeight": {
                        "type": "number"
                    },
                    "clipsContent": {
                        "type": "boolean"
                    },
                    "itemReverseZIndex": {
                        "type": "boolean"
                    },
                    "strokesIncludedInLayout": {
                        "type": "boolean"
                    }
                },
                "additionalProperties": false
            },
            "LayoutMode": {
                "type": "string",
                "enum": [
                    "NONE",
                    "HORIZONTAL",
                    "VERTICAL"
                ]
            },
            "LayoutWrap": {
                "type": "string",
                "enum": [
                    "NO_WRAP",
                    "WRAP"
                ]
            },
            "PrimaryAxisAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "SPACE_BETWEEN"
                ]
            },
            "CounterAxisAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "BASELINE"
                ]
            },
            "AxisSizingMode": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            },
            "LayoutAlign": {
                "type": "string",
                "enum": [
                    "INHERIT",
                    "STRETCH",
                    "MIN",
                    "CENTER",
                    "MAX"
                ]
            },
            "LayoutPositioning": {
                "type": "string",
                "enum": [
                    "AUTO",
                    "ABSOLUTE"
                ]
            },
            "LayoutGridConfig": {
                "type": "object",
                "properties": {
                    "pattern": {
                        "$ref": "#/definitions/LayoutGridPattern"
                    },
                    "sectionSize": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "color": {
                        "type": "string"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "alignment": {
                        "$ref": "#/definitions/LayoutGridAlignment"
                    },
                    "gutterSize": {
                        "type": "number"
                    },
                    "count": {
                        "type": "number"
                    },
                    "offset": {
                        "type": "number"
                    }
                },
                "required": [
                    "pattern",
                    "sectionSize"
                ],
                "additionalProperties": false
            },
            "LayoutGridPattern": {
                "type": "string",
                "enum": [
                    "COLUMNS",
                    "ROWS",
                    "GRID"
                ]
            },
            "LayoutGridAlignment": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH"
                ]
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        }
    },
  },
  // figma_component_from_node
  {
    name: "figma_component_from_node",
    description: "Convert an existing node (frame, group, etc.) into a reusable component. The original node is replaced by the new component. Useful for turning a designed element into a reusable template.",
    commandType: "COMPONENT_FROM_NODE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "id": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Convert an existing node into a component.",
        "definitions": {}
    },
  },
  // figma_boolean_union
  {
    name: "figma_boolean_union",
    description: "Combine multiple shapes into a single merged shape (boolean union/add). All shapes are added together. Useful for creating complex shapes from simpler ones.",
    commandType: "BOOLEAN_UNION" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeIds": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "id": {
                "type": "string"
            }
        },
        "required": [
            "nodeIds"
        ],
        "additionalProperties": false,
        "description": "Perform a boolean operation on multiple nodes.",
        "definitions": {}
    },
  },
  // figma_boolean_subtract
  {
    name: "figma_boolean_subtract",
    description: "Cut shapes out of the first shape (boolean subtract). The first node in the array is the base shape; all subsequent shapes are subtracted from it.",
    commandType: "BOOLEAN_SUBTRACT" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeIds": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "id": {
                "type": "string"
            }
        },
        "required": [
            "nodeIds"
        ],
        "additionalProperties": false,
        "description": "Perform a boolean operation on multiple nodes.",
        "definitions": {}
    },
  },
  // figma_boolean_intersect
  {
    name: "figma_boolean_intersect",
    description: "Keep only the overlapping area of shapes (boolean intersect). The result is where all shapes overlap - everything else is removed.",
    commandType: "BOOLEAN_INTERSECT" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeIds": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "id": {
                "type": "string"
            }
        },
        "required": [
            "nodeIds"
        ],
        "additionalProperties": false,
        "description": "Perform a boolean operation on multiple nodes.",
        "definitions": {}
    },
  },
  // figma_boolean_exclude
  {
    name: "figma_boolean_exclude",
    description: "Remove overlapping areas and keep everything else (boolean exclude/XOR). Where shapes overlap is removed; non-overlapping areas from all shapes are kept.",
    commandType: "BOOLEAN_EXCLUDE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeIds": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "id": {
                "type": "string"
            }
        },
        "required": [
            "nodeIds"
        ],
        "additionalProperties": false,
        "description": "Perform a boolean operation on multiple nodes.",
        "definitions": {}
    },
  },
  // figma_flatten_node
  {
    name: "figma_flatten_node",
    description: "Flatten a node into a single vector path. Converts complex shapes, groups, or boolean operations into a simple vector.",
    commandType: "FLATTEN_NODE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Reference to a node by ID or name.",
        "definitions": {}
    },
  },
  // figma_group_nodes
  {
    name: "figma_group_nodes",
    description: "Group multiple nodes into a single group container. Groups are simpler than frames - they don't have auto-layout or clipping. Use for organizing related elements.",
    commandType: "GROUP_NODES" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeIds": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            },
            "id": {
                "type": "string"
            }
        },
        "required": [
            "nodeIds"
        ],
        "additionalProperties": false,
        "description": "Perform a boolean operation on multiple nodes.",
        "definitions": {}
    },
  },
  // figma_ungroup_node
  {
    name: "figma_ungroup_node",
    description: "Break apart a group, releasing its children to the parent level. The group container is removed but all children are preserved.",
    commandType: "UNGROUP_NODE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Reference to a node by ID or name.",
        "definitions": {}
    },
  },
  // figma_create_text_style
  {
    name: "figma_create_text_style",
    description: "Create a reusable text style for consistent typography. Text styles define font properties that can be applied to text elements.",
    commandType: "CREATE_TEXT_STYLE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "styleType": {
                "type": "string",
                "enum": [
                    "TEXT",
                    "PAINT",
                    "EFFECT"
                ]
            },
            "description": {
                "type": "string"
            },
            "fontFamily": {
                "type": "string"
            },
            "fontStyle": {
                "type": "string"
            },
            "fontSize": {
                "type": "number"
            },
            "lineHeight": {
                "anyOf": [
                    {
                        "type": "number"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "value": {
                                "type": "number"
                            },
                            "unit": {
                                "type": "string",
                                "enum": [
                                    "PIXELS",
                                    "PERCENT",
                                    "AUTO"
                                ]
                            }
                        },
                        "required": [
                            "value",
                            "unit"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "letterSpacing": {
                "anyOf": [
                    {
                        "type": "number"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "value": {
                                "type": "number"
                            },
                            "unit": {
                                "type": "string",
                                "enum": [
                                    "PIXELS",
                                    "PERCENT"
                                ]
                            }
                        },
                        "required": [
                            "value",
                            "unit"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "paragraphSpacing": {
                "type": "number"
            },
            "textCase": {
                "type": "string",
                "enum": [
                    "ORIGINAL",
                    "UPPER",
                    "LOWER",
                    "TITLE"
                ]
            },
            "textDecoration": {
                "type": "string",
                "enum": [
                    "NONE",
                    "UNDERLINE",
                    "STRIKETHROUGH"
                ]
            },
            "color": {
                "$ref": "#/definitions/ColorInput"
            },
            "paints": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            }
        },
        "required": [
            "name",
            "fontSize"
        ],
        "additionalProperties": false,
        "description": "Create a reusable style for consistent design. Text styles define font properties, color styles define paint properties, and effect styles define shadow/blur properties.",
        "definitions": {
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            }
        }
    },
  },
  // figma_create_color_style
  {
    name: "figma_create_color_style",
    description: "Create a reusable color/paint style. Color styles ensure consistent colors across your design. Apply styles using fillStyleId or strokeStyleId.",
    commandType: "CREATE_COLOR_STYLE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "styleType": {
                "type": "string",
                "enum": [
                    "TEXT",
                    "PAINT",
                    "EFFECT"
                ]
            },
            "description": {
                "type": "string"
            },
            "fontFamily": {
                "type": "string"
            },
            "fontStyle": {
                "type": "string"
            },
            "fontSize": {
                "type": "number"
            },
            "lineHeight": {
                "anyOf": [
                    {
                        "type": "number"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "value": {
                                "type": "number"
                            },
                            "unit": {
                                "type": "string",
                                "enum": [
                                    "PIXELS",
                                    "PERCENT",
                                    "AUTO"
                                ]
                            }
                        },
                        "required": [
                            "value",
                            "unit"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "letterSpacing": {
                "anyOf": [
                    {
                        "type": "number"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "value": {
                                "type": "number"
                            },
                            "unit": {
                                "type": "string",
                                "enum": [
                                    "PIXELS",
                                    "PERCENT"
                                ]
                            }
                        },
                        "required": [
                            "value",
                            "unit"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "paragraphSpacing": {
                "type": "number"
            },
            "textCase": {
                "type": "string",
                "enum": [
                    "ORIGINAL",
                    "UPPER",
                    "LOWER",
                    "TITLE"
                ]
            },
            "textDecoration": {
                "type": "string",
                "enum": [
                    "NONE",
                    "UNDERLINE",
                    "STRIKETHROUGH"
                ]
            },
            "color": {
                "$ref": "#/definitions/ColorInput"
            },
            "paints": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            }
        },
        "required": [
            "name",
            "color"
        ],
        "additionalProperties": false,
        "description": "Create a reusable style for consistent design. Text styles define font properties, color styles define paint properties, and effect styles define shadow/blur properties.",
        "definitions": {
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            }
        }
    },
  },
  // figma_create_effect_style
  {
    name: "figma_create_effect_style",
    description: "Create a reusable effect style for consistent shadows and blurs. Effect styles can be applied to elements using effectStyleId.",
    commandType: "CREATE_EFFECT_STYLE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "styleType": {
                "type": "string",
                "enum": [
                    "TEXT",
                    "PAINT",
                    "EFFECT"
                ]
            },
            "description": {
                "type": "string"
            },
            "fontFamily": {
                "type": "string"
            },
            "fontStyle": {
                "type": "string"
            },
            "fontSize": {
                "type": "number"
            },
            "lineHeight": {
                "anyOf": [
                    {
                        "type": "number"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "value": {
                                "type": "number"
                            },
                            "unit": {
                                "type": "string",
                                "enum": [
                                    "PIXELS",
                                    "PERCENT",
                                    "AUTO"
                                ]
                            }
                        },
                        "required": [
                            "value",
                            "unit"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "letterSpacing": {
                "anyOf": [
                    {
                        "type": "number"
                    },
                    {
                        "type": "object",
                        "properties": {
                            "value": {
                                "type": "number"
                            },
                            "unit": {
                                "type": "string",
                                "enum": [
                                    "PIXELS",
                                    "PERCENT"
                                ]
                            }
                        },
                        "required": [
                            "value",
                            "unit"
                        ],
                        "additionalProperties": false
                    }
                ]
            },
            "paragraphSpacing": {
                "type": "number"
            },
            "textCase": {
                "type": "string",
                "enum": [
                    "ORIGINAL",
                    "UPPER",
                    "LOWER",
                    "TITLE"
                ]
            },
            "textDecoration": {
                "type": "string",
                "enum": [
                    "NONE",
                    "UNDERLINE",
                    "STRIKETHROUGH"
                ]
            },
            "color": {
                "$ref": "#/definitions/ColorInput"
            },
            "paints": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            }
        },
        "required": [
            "name",
            "effects"
        ],
        "additionalProperties": false,
        "description": "Create a reusable style for consistent design. Text styles define font properties, color styles define paint properties, and effect styles define shadow/blur properties.",
        "definitions": {
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            }
        }
    },
  },
  // figma_create_variable_collection
  {
    name: "figma_create_variable_collection",
    description: "Create a variable collection to organize design tokens. Collections group related variables and support modes (e.g., 'Light'/'Dark' themes).",
    commandType: "CREATE_VARIABLE_COLLECTION" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "modes": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": [
            "name",
            "modes"
        ],
        "additionalProperties": false,
        "description": "Create a variable collection to organize design tokens. Collections group related variables and support modes (e.g., 'Light'/'Dark' themes).",
        "definitions": {}
    },
  },
  // figma_create_variable
  {
    name: "figma_create_variable",
    description: "Create a design token variable in an existing collection. Variables store reusable values (colors, numbers, strings) that can be bound to node properties.",
    commandType: "CREATE_VARIABLE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "collectionId": {
                "type": "string"
            },
            "resolvedType": {
                "type": "string",
                "enum": [
                    "COLOR",
                    "FLOAT",
                    "STRING",
                    "BOOLEAN"
                ]
            },
            "values": {
                "type": "object",
                "additionalProperties": {}
            }
        },
        "required": [
            "name",
            "collectionId",
            "resolvedType",
            "values"
        ],
        "additionalProperties": false,
        "description": "Create a design token variable in an existing collection. Variables store reusable values (colors, numbers, strings) that can be bound to node properties.",
        "definitions": {}
    },
  },
  // figma_move_node
  {
    name: "figma_move_node",
    description: "Move a node to a new position on the canvas. Position is ignored for nodes inside auto-layout parents.",
    commandType: "MOVE_NODE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            }
        },
        "additionalProperties": false,
        "description": "Move a node to a new position on the canvas. Position is ignored for nodes inside auto-layout parents.",
        "definitions": {}
    },
  },
  // figma_update_node
  {
    name: "figma_update_node",
    description: "Update properties of an existing node. Modify any visual property - size, position, colors, strokes, visibility, etc. Only specify properties you want to change.",
    commandType: "UPDATE_NODE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "width": {
                "type": "number"
            },
            "height": {
                "type": "number"
            },
            "newName": {
                "type": "string"
            },
            "visible": {
                "type": "boolean"
            },
            "locked": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            },
            "strokeTopWeight": {
                "type": "number"
            },
            "strokeRightWeight": {
                "type": "number"
            },
            "strokeBottomWeight": {
                "type": "number"
            },
            "strokeLeftWeight": {
                "type": "number"
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            },
            "cornerRadius": {
                "type": "number"
            },
            "topLeftRadius": {
                "type": "number"
            },
            "topRightRadius": {
                "type": "number"
            },
            "bottomLeftRadius": {
                "type": "number"
            },
            "bottomRightRadius": {
                "type": "number"
            },
            "cornerSmoothing": {
                "type": "number"
            },
            "constraints": {
                "type": "object",
                "properties": {
                    "horizontal": {
                        "$ref": "#/definitions/HorizontalConstraint"
                    },
                    "vertical": {
                        "$ref": "#/definitions/VerticalConstraint"
                    }
                },
                "required": [
                    "horizontal",
                    "vertical"
                ],
                "additionalProperties": false
            }
        },
        "additionalProperties": false,
        "description": "Update properties of an existing node. Modify any visual property - size, position, colors, strokes, visibility, etc. Only specify properties you want to change.",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            },
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        }
    },
  },
  // figma_delete_node
  {
    name: "figma_delete_node",
    description: "Permanently delete a node and all its children. This cannot be undone via the API.",
    commandType: "DELETE_NODE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Reference to a node by ID or name.",
        "definitions": {}
    },
  },
  // figma_set_constraints
  {
    name: "figma_set_constraints",
    description: "Set how a node behaves when its parent frame is resized. Constraints control pinning and scaling behavior.",
    commandType: "SET_CONSTRAINTS" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "horizontal": {
                "$ref": "#/definitions/HorizontalConstraint"
            },
            "vertical": {
                "$ref": "#/definitions/VerticalConstraint"
            }
        },
        "required": [
            "horizontal",
            "vertical"
        ],
        "additionalProperties": false,
        "description": "Set how a node behaves when its parent frame is resized. Constraints control pinning and scaling behavior.",
        "definitions": {
            "HorizontalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            },
            "VerticalConstraint": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH",
                    "SCALE"
                ]
            }
        }
    },
  },
  // figma_set_layout_grids
  {
    name: "figma_set_layout_grids",
    description: "Add layout grids to a frame for visual alignment guides. Grids help with consistent spacing and alignment.",
    commandType: "SET_LAYOUT_GRIDS" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "layoutGrids": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/LayoutGridConfig"
                }
            }
        },
        "required": [
            "layoutGrids"
        ],
        "additionalProperties": false,
        "description": "Add layout grids to a frame for visual alignment guides. Grids help with consistent spacing and alignment.",
        "definitions": {
            "LayoutGridConfig": {
                "type": "object",
                "properties": {
                    "pattern": {
                        "$ref": "#/definitions/LayoutGridPattern"
                    },
                    "sectionSize": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "color": {
                        "type": "string"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "alignment": {
                        "$ref": "#/definitions/LayoutGridAlignment"
                    },
                    "gutterSize": {
                        "type": "number"
                    },
                    "count": {
                        "type": "number"
                    },
                    "offset": {
                        "type": "number"
                    }
                },
                "required": [
                    "pattern",
                    "sectionSize"
                ],
                "additionalProperties": false
            },
            "LayoutGridPattern": {
                "type": "string",
                "enum": [
                    "COLUMNS",
                    "ROWS",
                    "GRID"
                ]
            },
            "LayoutGridAlignment": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "STRETCH"
                ]
            }
        }
    },
  },
  // figma_set_effects
  {
    name: "figma_set_effects",
    description: "Apply visual effects like shadows and blurs to a node. Multiple effects can be stacked.",
    commandType: "SET_EFFECTS" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "effects": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/EffectInput"
                }
            },
            "effectStyleId": {
                "type": "string"
            }
        },
        "required": [
            "effects"
        ],
        "additionalProperties": false,
        "description": "Apply visual effects like shadows and blurs to a node. Multiple effects can be stacked.",
        "definitions": {
            "EffectInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/DropShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/InnerShadowEffectInput"
                    },
                    {
                        "$ref": "#/definitions/LayerBlurEffectInput"
                    },
                    {
                        "$ref": "#/definitions/BackgroundBlurEffectInput"
                    }
                ]
            },
            "DropShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "DROP_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    },
                    "showShadowBehindNode": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "InnerShadowEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "INNER_SHADOW"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "offset": {
                        "type": "object",
                        "properties": {
                            "x": {
                                "type": "number"
                            },
                            "y": {
                                "type": "number"
                            }
                        },
                        "required": [
                            "x",
                            "y"
                        ],
                        "additionalProperties": false
                    },
                    "radius": {
                        "type": "number"
                    },
                    "spread": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "color",
                    "offset",
                    "radius"
                ],
                "additionalProperties": false
            },
            "LayerBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "LAYER_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            },
            "BackgroundBlurEffectInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "BACKGROUND_BLUR"
                    },
                    "radius": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "type",
                    "radius"
                ],
                "additionalProperties": false
            }
        }
    },
  },
  // figma_set_blend_mode
  {
    name: "figma_set_blend_mode",
    description: "Set how a node blends with elements behind it. Common modes: NORMAL (default), MULTIPLY (darken), SCREEN (lighten), OVERLAY (contrast).",
    commandType: "SET_BLEND_MODE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "blendMode": {
                "$ref": "#/definitions/BlendMode"
            }
        },
        "required": [
            "blendMode"
        ],
        "additionalProperties": false,
        "description": "Set how a node blends with elements behind it. Common modes: NORMAL (default), MULTIPLY (darken), SCREEN (lighten), OVERLAY (contrast).",
        "definitions": {
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            }
        }
    },
  },
  // figma_set_gradient_fill
  {
    name: "figma_set_gradient_fill",
    description: "Apply a gradient fill to a node. LINEAR for directional gradients, RADIAL for circular/oval gradients, ANGULAR for sweep gradients, DIAMOND for four-way gradients.",
    commandType: "SET_GRADIENT_FILL" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "type": {
                "type": "string",
                "enum": [
                    "GRADIENT_LINEAR",
                    "GRADIENT_RADIAL",
                    "GRADIENT_ANGULAR",
                    "GRADIENT_DIAMOND"
                ]
            },
            "gradientStops": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "position": {
                            "type": "number"
                        },
                        "color": {
                            "$ref": "#/definitions/ColorInput"
                        }
                    },
                    "required": [
                        "position",
                        "color"
                    ],
                    "additionalProperties": false
                }
            },
            "gradientTransform": {
                "$ref": "#/definitions/Transform"
            }
        },
        "required": [
            "type",
            "gradientStops"
        ],
        "additionalProperties": false,
        "description": "Apply a gradient fill to a node. LINEAR for directional gradients, RADIAL for circular/oval gradients, ANGULAR for sweep gradients, DIAMOND for four-way gradients.",
        "definitions": {
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            }
        }
    },
  },
  // figma_set_fills
  {
    name: "figma_set_fills",
    description: "Set the fill paints of an existing node. Replaces all existing fills with the provided array of paint objects.",
    commandType: "SET_FILLS" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "fills": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "fillStyleId": {
                "type": "string"
            }
        },
        "required": [
            "fills"
        ],
        "additionalProperties": false,
        "description": "Set the fills of an existing node.",
        "definitions": {
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            }
        }
    },
  },
  // figma_set_strokes
  {
    name: "figma_set_strokes",
    description: "Set the stroke paints and properties of an existing node. Configure stroke color, weight, alignment, and dash patterns.",
    commandType: "SET_STROKES" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "strokes": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/PaintInput"
                }
            },
            "strokeStyleId": {
                "type": "string"
            },
            "strokeWeight": {
                "type": "number"
            },
            "strokeAlign": {
                "$ref": "#/definitions/StrokeAlign"
            },
            "strokeCap": {
                "$ref": "#/definitions/StrokeCap"
            },
            "strokeJoin": {
                "$ref": "#/definitions/StrokeJoin"
            },
            "dashPattern": {
                "type": "array",
                "items": {
                    "type": "number"
                }
            }
        },
        "required": [
            "strokes"
        ],
        "additionalProperties": false,
        "description": "Set the strokes of an existing node.",
        "definitions": {
            "PaintInput": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/SolidPaintInput"
                    },
                    {
                        "$ref": "#/definitions/GradientPaintInput"
                    },
                    {
                        "$ref": "#/definitions/ImagePaintInput"
                    },
                    {
                        "$ref": "#/definitions/VideoPaintInput"
                    }
                ]
            },
            "SolidPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "SOLID"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "color"
                ],
                "additionalProperties": false
            },
            "ColorInput": {
                "anyOf": [
                    {
                        "type": "string"
                    },
                    {
                        "$ref": "#/definitions/RGB"
                    },
                    {
                        "$ref": "#/definitions/RGBA"
                    }
                ]
            },
            "RGB": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    }
                },
                "required": [
                    "r",
                    "g",
                    "b"
                ],
                "additionalProperties": false
            },
            "RGBA": {
                "type": "object",
                "properties": {
                    "r": {
                        "type": "number"
                    },
                    "g": {
                        "type": "number"
                    },
                    "b": {
                        "type": "number"
                    },
                    "a": {
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b",
                    "g",
                    "r"
                ],
                "additionalProperties": false
            },
            "BlendMode": {
                "type": "string",
                "enum": [
                    "PASS_THROUGH",
                    "NORMAL",
                    "DARKEN",
                    "MULTIPLY",
                    "LINEAR_BURN",
                    "COLOR_BURN",
                    "LIGHTEN",
                    "SCREEN",
                    "LINEAR_DODGE",
                    "COLOR_DODGE",
                    "OVERLAY",
                    "SOFT_LIGHT",
                    "HARD_LIGHT",
                    "DIFFERENCE",
                    "EXCLUSION",
                    "HUE",
                    "SATURATION",
                    "COLOR",
                    "LUMINOSITY"
                ]
            },
            "GradientPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "GRADIENT_LINEAR",
                            "GRADIENT_RADIAL",
                            "GRADIENT_ANGULAR",
                            "GRADIENT_DIAMOND"
                        ]
                    },
                    "gradientStops": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/GradientStop"
                        }
                    },
                    "gradientTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type",
                    "gradientStops"
                ],
                "additionalProperties": false
            },
            "GradientStop": {
                "type": "object",
                "properties": {
                    "position": {
                        "type": "number"
                    },
                    "color": {
                        "$ref": "#/definitions/ColorInput"
                    }
                },
                "required": [
                    "position",
                    "color"
                ],
                "additionalProperties": false
            },
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "ImagePaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "IMAGE"
                    },
                    "imageData": {
                        "type": "string"
                    },
                    "imageHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "imageTransform": {
                        "$ref": "#/definitions/Transform"
                    },
                    "scalingFactor": {
                        "type": "number"
                    },
                    "rotation": {
                        "type": "number"
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    },
                    "blendMode": {
                        "$ref": "#/definitions/BlendMode"
                    }
                },
                "required": [
                    "type"
                ],
                "additionalProperties": false
            },
            "VideoPaintInput": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "const": "VIDEO"
                    },
                    "videoHash": {
                        "type": "string"
                    },
                    "scaleMode": {
                        "type": "string",
                        "enum": [
                            "FILL",
                            "FIT",
                            "CROP",
                            "TILE"
                        ]
                    },
                    "visible": {
                        "type": "boolean"
                    },
                    "opacity": {
                        "type": "number"
                    }
                },
                "required": [
                    "type",
                    "videoHash"
                ],
                "additionalProperties": false
            },
            "StrokeAlign": {
                "type": "string",
                "enum": [
                    "INSIDE",
                    "OUTSIDE",
                    "CENTER"
                ]
            },
            "StrokeCap": {
                "type": "string",
                "enum": [
                    "NONE",
                    "ROUND",
                    "SQUARE",
                    "ARROW_LINES",
                    "ARROW_EQUILATERAL"
                ]
            },
            "StrokeJoin": {
                "type": "string",
                "enum": [
                    "MITER",
                    "BEVEL",
                    "ROUND"
                ]
            }
        }
    },
  },
  // figma_set_layout
  {
    name: "figma_set_layout",
    description: "Configure auto-layout on a frame. Set direction, spacing, padding, and alignment for automatic child arrangement.",
    commandType: "SET_LAYOUT" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "direction": {
                "type": "string",
                "enum": [
                    "HORIZONTAL",
                    "VERTICAL"
                ]
            },
            "gap": {
                "type": "number"
            },
            "padding": {
                "type": "number"
            },
            "paddingTop": {
                "type": "number"
            },
            "paddingRight": {
                "type": "number"
            },
            "paddingBottom": {
                "type": "number"
            },
            "paddingLeft": {
                "type": "number"
            },
            "primaryAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "SPACE_BETWEEN"
                ]
            },
            "counterAlign": {
                "type": "string",
                "enum": [
                    "MIN",
                    "CENTER",
                    "MAX",
                    "BASELINE"
                ]
            },
            "wrap": {
                "type": "string",
                "enum": [
                    "NO_WRAP",
                    "WRAP"
                ]
            },
            "counterAxisSpacing": {
                "type": "number"
            },
            "primaryAxisSizing": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            },
            "counterAxisSizing": {
                "type": "string",
                "enum": [
                    "FIXED",
                    "AUTO"
                ]
            }
        },
        "additionalProperties": false,
        "description": "Configure auto-layout on a frame.",
        "definitions": {}
    },
  },
  // figma_set_mask
  {
    name: "figma_set_mask",
    description: "Set whether a node acts as a mask for its siblings below it in the layer hierarchy. Masked siblings are clipped to the mask shape.",
    commandType: "SET_MASK" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "isMask": {
                "type": "boolean"
            },
            "maskType": {
                "type": "string",
                "enum": [
                    "ALPHA",
                    "VECTOR",
                    "LUMINANCE"
                ]
            }
        },
        "required": [
            "isMask"
        ],
        "additionalProperties": false,
        "description": "Set whether a node acts as a mask for its siblings.",
        "definitions": {}
    },
  },
  // figma_set_transform
  {
    name: "figma_set_transform",
    description: "Set the rotation angle or full transform matrix of a node. Use for precise positioning and rotation.",
    commandType: "SET_TRANSFORM" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "rotation": {
                "type": "number"
            },
            "transform": {
                "$ref": "#/definitions/Transform"
            }
        },
        "additionalProperties": false,
        "description": "Set the rotation or transform matrix of a node.",
        "definitions": {
            "Transform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            }
        }
    },
  },
  // figma_set_image_fill
  {
    name: "figma_set_image_fill",
    description: "Apply an image as a fill to a node. Provide base64 image data, an existing image hash, or a URL. Supports various scale modes.",
    commandType: "SET_IMAGE_FILL" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "imageData": {
                "type": "string"
            },
            "imageHash": {
                "type": "string"
            },
            "imageUrl": {
                "type": "string"
            },
            "scaleMode": {
                "type": "string",
                "enum": [
                    "FILL",
                    "FIT",
                    "CROP",
                    "TILE"
                ]
            },
            "imageTransform": {
                "type": "array",
                "items": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 3,
                    "maxItems": 3
                },
                "minItems": 2,
                "maxItems": 2
            },
            "scalingFactor": {
                "type": "number"
            },
            "rotation": {
                "type": "number"
            },
            "visible": {
                "type": "boolean"
            },
            "opacity": {
                "type": "number"
            },
            "append": {
                "type": "boolean"
            }
        },
        "additionalProperties": false,
        "description": "Set an image fill on a node. Provide base64 image data, an existing image hash, or a URL.",
        "definitions": {}
    },
  },
  // figma_create_image
  {
    name: "figma_create_image",
    description: "Upload an image to the Figma file from base64 data. Returns an image hash that can be used in image fills.",
    commandType: "CREATE_IMAGE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "imageData": {
                "type": "string"
            },
            "id": {
                "type": "string"
            }
        },
        "required": [
            "imageData"
        ],
        "additionalProperties": false,
        "description": "Create an image in the Figma file from base64 data.",
        "definitions": {}
    },
  },
  // figma_get_image_data
  {
    name: "figma_get_image_data",
    description: "Get the base64 image data for an image by its hash or from a node's image fill.",
    commandType: "GET_IMAGE_DATA" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "imageHash": {
                "type": "string"
            },
            "nodeId": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Get image data by hash or from a node's fill.",
        "definitions": {}
    },
    isFetchCommand: true,
  },
  // figma_set_text_range_style
  {
    name: "figma_set_text_range_style",
    description: "Apply different styles to specific character ranges within a text node. Useful for mixed formatting like bold words or colored text.",
    commandType: "SET_TEXT_RANGE_STYLE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "ranges": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/TextRangeStyle"
                }
            }
        },
        "required": [
            "ranges"
        ],
        "additionalProperties": false,
        "definitions": {
            "TextRangeStyle": {
                "type": "object",
                "properties": {
                    "start": {
                        "type": "number"
                    },
                    "end": {
                        "type": "number"
                    },
                    "fontFamily": {
                        "type": "string"
                    },
                    "fontStyle": {
                        "type": "string"
                    },
                    "fontSize": {
                        "type": "number"
                    },
                    "fill": {
                        "type": "string"
                    },
                    "textCase": {
                        "$ref": "#/definitions/TextCase"
                    },
                    "textDecoration": {
                        "$ref": "#/definitions/TextDecoration"
                    },
                    "letterSpacing": {
                        "anyOf": [
                            {
                                "type": "number"
                            },
                            {
                                "$ref": "#/definitions/LetterSpacing"
                            }
                        ]
                    },
                    "lineHeight": {
                        "anyOf": [
                            {
                                "type": "number"
                            },
                            {
                                "$ref": "#/definitions/LineHeight"
                            }
                        ]
                    },
                    "hyperlink": {
                        "$ref": "#/definitions/Hyperlink"
                    }
                },
                "required": [
                    "start",
                    "end"
                ],
                "additionalProperties": false
            },
            "TextCase": {
                "type": "string",
                "enum": [
                    "ORIGINAL",
                    "UPPER",
                    "LOWER",
                    "TITLE",
                    "SMALL_CAPS",
                    "SMALL_CAPS_FORCED"
                ]
            },
            "TextDecoration": {
                "type": "string",
                "enum": [
                    "NONE",
                    "UNDERLINE",
                    "STRIKETHROUGH"
                ]
            },
            "LetterSpacing": {
                "type": "object",
                "properties": {
                    "value": {
                        "type": "number"
                    },
                    "unit": {
                        "type": "string",
                        "enum": [
                            "PIXELS",
                            "PERCENT"
                        ]
                    }
                },
                "required": [
                    "value",
                    "unit"
                ],
                "additionalProperties": false
            },
            "LineHeight": {
                "type": "object",
                "properties": {
                    "value": {
                        "type": "number"
                    },
                    "unit": {
                        "type": "string",
                        "enum": [
                            "PIXELS",
                            "PERCENT",
                            "AUTO"
                        ]
                    }
                },
                "required": [
                    "unit"
                ],
                "additionalProperties": false
            },
            "Hyperlink": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": [
                            "URL",
                            "NODE"
                        ]
                    },
                    "value": {
                        "type": "string"
                    }
                },
                "required": [
                    "type",
                    "value"
                ],
                "additionalProperties": false
            }
        }
    },
  },
  // figma_clone_node
  {
    name: "figma_clone_node",
    description: "Create a duplicate of an existing node. The clone can be positioned and parented independently.",
    commandType: "CLONE_NODE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "id": {
                "type": "string"
            },
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "parent": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Clone an existing node.",
        "definitions": {}
    },
  },
  // figma_list_fonts
  {
    name: "figma_list_fonts",
    description: "List all available fonts in the Figma file. Returns font families and their available styles.",
    commandType: "LIST_FONTS" as CommandType,
    inputSchema: {
        "type": "object",
        "properties": {}
    },
    isFetchCommand: true,
  },
  // figma_set_selection
  {
    name: "figma_set_selection",
    description: "Programmatically select nodes in Figma. Updates what the user sees selected in the canvas and layers panel.",
    commandType: "SET_SELECTION" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeIds": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        "required": [
            "nodeIds"
        ],
        "additionalProperties": false,
        "description": "Programmatically select nodes in Figma. Updates what the user sees selected in the canvas and layers panel.",
        "definitions": {}
    },
  },
  // figma_zoom_to_fit
  {
    name: "figma_zoom_to_fit",
    description: "Pan and zoom the viewport to frame specific nodes. Useful after creating content to show it to the user.",
    commandType: "ZOOM_TO_FIT" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Reference to a node by ID or name.",
        "definitions": {}
    },
  },
  // figma_get_viewport
  {
    name: "figma_get_viewport",
    description: "Get the current viewport state - what area of the canvas the user is viewing. Returns center position and zoom level.",
    commandType: "GET_VIEWPORT" as CommandType,
    inputSchema: {
        "type": "object",
        "properties": {}
    },
    isFetchCommand: true,
  },
  // figma_set_viewport
  {
    name: "figma_set_viewport",
    description: "Set the viewport to a specific position and zoom level. Use to navigate the user to a specific canvas area.",
    commandType: "SET_VIEWPORT" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "x": {
                "type": "number"
            },
            "y": {
                "type": "number"
            },
            "zoom": {
                "type": "number"
            }
        },
        "additionalProperties": false,
        "description": "Set the viewport to a specific position and zoom level. Use to navigate the user to a specific canvas area.",
        "definitions": {}
    },
  },
  // figma_get_node_by_name
  {
    name: "figma_get_node_by_name",
    description: "Find a node by its name in the layers panel. Returns the first match. Optionally register it for later reference.",
    commandType: "GET_NODE_BY_NAME" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Reference to a node by ID or name.",
        "definitions": {},
        "required": [
            "name"
        ]
    },
    isFetchCommand: true,
  },
  // figma_get_selection
  {
    name: "figma_get_selection",
    description: "Get details about what the user has selected in Figma. Useful for understanding context or operating on user-selected elements.",
    commandType: "GET_SELECTION" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "depth": {
                "type": "number",
                "description": "Max depth to traverse children. 0 = childIds only (default), 1+ = serialize children (requires compact=false)"
            },
            "filter": {
                "type": "string",
                "description": "Filter by node type (e.g., \"FRAME\", \"TEXT\")"
            },
            "register": {
                "type": "boolean",
                "description": "Register nodes in registry for later reference"
            },
            "compact": {
                "type": "boolean",
                "description": "Compact mode - only essential properties (id, name, type, x, y, width, height, visible, locked). Default: true"
            },
            "fields": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/SerializableProp"
                },
                "description": "Specific fields to include (overrides compact/excludeVerbose). E.g., [\"fills\", \"strokes\", \"effects\"]"
            },
            "excludeVerbose": {
                "type": "boolean",
                "description": "Exclude large properties like absoluteTransform, reactions, vectorNetwork. Default: true"
            }
        },
        "additionalProperties": false,
        "description": "Query options for retrieving nodes.\n\nBy default, queries return COMPACT data to minimize response size:\n- compact=true (default): Only id, name, type, x, y, width, height, visible, locked, childIds\n- depth=0 (default): Children returned as childIds array only, not fully serialized\n- excludeVerbose=true (default): Large properties like transforms, fills, effects excluded\n\nUse compact=false or fields=[...] to get more properties.\n\nAvailable fields (partial list - use compact=false for all):\n- Layout: x, y, width, height, rotation, constraints, layoutMode, layoutAlign, layoutGrow\n- Visual: fills, strokes, effects, opacity, blendMode, cornerRadius\n- Text: characters, fontSize, fontFamily, fontWeight, textAlignHorizontal\n- Auto-layout: paddingTop/Right/Bottom/Left, itemSpacing, primaryAxisAlignItems\n- Components: componentPropertyDefinitions, mainComponentId, componentProperties",
        "definitions": {
            "SerializableProp": {
                "type": "string",
                "enum": [
                    "name",
                    "visible",
                    "locked",
                    "x",
                    "y",
                    "width",
                    "height",
                    "rotation",
                    "absoluteTransform",
                    "relativeTransform",
                    "absoluteBoundingBox",
                    "absoluteRenderBounds",
                    "layoutAlign",
                    "layoutGrow",
                    "layoutPositioning",
                    "constraints",
                    "opacity",
                    "blendMode",
                    "isMask",
                    "maskType",
                    "fills",
                    "fillStyleId",
                    "fill",
                    "fillColor",
                    "strokes",
                    "strokeStyleId",
                    "stroke",
                    "strokeColor",
                    "strokeWeight",
                    "strokeAlign",
                    "strokeCap",
                    "strokeJoin",
                    "strokeMiterLimit",
                    "dashPattern",
                    "strokeTopWeight",
                    "strokeRightWeight",
                    "strokeBottomWeight",
                    "strokeLeftWeight",
                    "cornerRadius",
                    "cornerSmoothing",
                    "topLeftRadius",
                    "topRightRadius",
                    "bottomLeftRadius",
                    "bottomRightRadius",
                    "effects",
                    "effectStyleId",
                    "layoutMode",
                    "primaryAxisSizingMode",
                    "counterAxisSizingMode",
                    "primaryAxisAlignItems",
                    "counterAxisAlignItems",
                    "counterAxisAlignContent",
                    "paddingTop",
                    "paddingRight",
                    "paddingBottom",
                    "paddingLeft",
                    "padding",
                    "itemSpacing",
                    "counterAxisSpacing",
                    "gap",
                    "layoutWrap",
                    "wrap",
                    "itemReverseZIndex",
                    "strokesIncludedInLayout",
                    "direction",
                    "align",
                    "counterAlign",
                    "layout",
                    "minWidth",
                    "maxWidth",
                    "minHeight",
                    "maxHeight",
                    "clipsContent",
                    "guides",
                    "layoutGrids",
                    "gridStyleId",
                    "characters",
                    "text",
                    "fontSize",
                    "fontFamily",
                    "fontStyle",
                    "fontWeight",
                    "textAlignHorizontal",
                    "textAlignVertical",
                    "textAutoResize",
                    "autoResize",
                    "paragraphIndent",
                    "paragraphSpacing",
                    "lineHeight",
                    "letterSpacing",
                    "textCase",
                    "textDecoration",
                    "textDecorationStyle",
                    "textDecorationOffset",
                    "textDecorationThickness",
                    "textDecorationColor",
                    "textDecorationSkipInk",
                    "textTruncation",
                    "maxLines",
                    "hyperlink",
                    "textStyleId",
                    "hangingPunctuation",
                    "hangingList",
                    "leadingTrim",
                    "listSpacing",
                    "autoRename",
                    "componentPropertyDefinitions",
                    "description",
                    "documentationLinks",
                    "mainComponent",
                    "mainComponentId",
                    "mainComponentName",
                    "componentId",
                    "componentProperties",
                    "exposedInstances",
                    "isExposedInstance",
                    "overrides",
                    "scaleFactor",
                    "swapComponent",
                    "vectorNetwork",
                    "vectorPaths",
                    "handleMirroring",
                    "pointCount",
                    "innerRadius",
                    "arcData",
                    "length",
                    "color",
                    "weight",
                    "sectionContentsHidden",
                    "devStatus",
                    "exportSettings",
                    "reactions",
                    "booleanOperation",
                    "connectorStart",
                    "connectorEnd",
                    "connectorLineType",
                    "connectorStartStrokeCap",
                    "connectorEndStrokeCap",
                    "textBackground",
                    "authorVisible",
                    "authorName",
                    "isWideWidth",
                    "shapeType",
                    "code",
                    "codeLanguage",
                    "numRows",
                    "numColumns",
                    "isSkippedSlide",
                    "interactiveSlideElementType",
                    "widgetId",
                    "widgetSyncedState",
                    "embedData",
                    "linkUnfurlData",
                    "mediaData",
                    "defaultVariantId"
                ]
            }
        }
    },
    isFetchCommand: true,
  },
  // figma_get_page_nodes
  {
    name: "figma_get_page_nodes",
    description: "Get an overview of all top-level nodes on the current Figma page. Use this to understand what's on the canvas.",
    commandType: "GET_PAGE_NODES" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "depth": {
                "type": "number",
                "description": "Max depth to traverse children. 0 = childIds only (default), 1+ = serialize children (requires compact=false)"
            },
            "filter": {
                "type": "string",
                "description": "Filter by node type (e.g., \"FRAME\", \"TEXT\")"
            },
            "register": {
                "type": "boolean",
                "description": "Register nodes in registry for later reference"
            },
            "compact": {
                "type": "boolean",
                "description": "Compact mode - only essential properties (id, name, type, x, y, width, height, visible, locked). Default: true"
            },
            "fields": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/SerializableProp"
                },
                "description": "Specific fields to include (overrides compact/excludeVerbose). E.g., [\"fills\", \"strokes\", \"effects\"]"
            },
            "excludeVerbose": {
                "type": "boolean",
                "description": "Exclude large properties like absoluteTransform, reactions, vectorNetwork. Default: true"
            }
        },
        "additionalProperties": false,
        "description": "Query options for retrieving nodes.\n\nBy default, queries return COMPACT data to minimize response size:\n- compact=true (default): Only id, name, type, x, y, width, height, visible, locked, childIds\n- depth=0 (default): Children returned as childIds array only, not fully serialized\n- excludeVerbose=true (default): Large properties like transforms, fills, effects excluded\n\nUse compact=false or fields=[...] to get more properties.\n\nAvailable fields (partial list - use compact=false for all):\n- Layout: x, y, width, height, rotation, constraints, layoutMode, layoutAlign, layoutGrow\n- Visual: fills, strokes, effects, opacity, blendMode, cornerRadius\n- Text: characters, fontSize, fontFamily, fontWeight, textAlignHorizontal\n- Auto-layout: paddingTop/Right/Bottom/Left, itemSpacing, primaryAxisAlignItems\n- Components: componentPropertyDefinitions, mainComponentId, componentProperties",
        "definitions": {
            "SerializableProp": {
                "type": "string",
                "enum": [
                    "name",
                    "visible",
                    "locked",
                    "x",
                    "y",
                    "width",
                    "height",
                    "rotation",
                    "absoluteTransform",
                    "relativeTransform",
                    "absoluteBoundingBox",
                    "absoluteRenderBounds",
                    "layoutAlign",
                    "layoutGrow",
                    "layoutPositioning",
                    "constraints",
                    "opacity",
                    "blendMode",
                    "isMask",
                    "maskType",
                    "fills",
                    "fillStyleId",
                    "fill",
                    "fillColor",
                    "strokes",
                    "strokeStyleId",
                    "stroke",
                    "strokeColor",
                    "strokeWeight",
                    "strokeAlign",
                    "strokeCap",
                    "strokeJoin",
                    "strokeMiterLimit",
                    "dashPattern",
                    "strokeTopWeight",
                    "strokeRightWeight",
                    "strokeBottomWeight",
                    "strokeLeftWeight",
                    "cornerRadius",
                    "cornerSmoothing",
                    "topLeftRadius",
                    "topRightRadius",
                    "bottomLeftRadius",
                    "bottomRightRadius",
                    "effects",
                    "effectStyleId",
                    "layoutMode",
                    "primaryAxisSizingMode",
                    "counterAxisSizingMode",
                    "primaryAxisAlignItems",
                    "counterAxisAlignItems",
                    "counterAxisAlignContent",
                    "paddingTop",
                    "paddingRight",
                    "paddingBottom",
                    "paddingLeft",
                    "padding",
                    "itemSpacing",
                    "counterAxisSpacing",
                    "gap",
                    "layoutWrap",
                    "wrap",
                    "itemReverseZIndex",
                    "strokesIncludedInLayout",
                    "direction",
                    "align",
                    "counterAlign",
                    "layout",
                    "minWidth",
                    "maxWidth",
                    "minHeight",
                    "maxHeight",
                    "clipsContent",
                    "guides",
                    "layoutGrids",
                    "gridStyleId",
                    "characters",
                    "text",
                    "fontSize",
                    "fontFamily",
                    "fontStyle",
                    "fontWeight",
                    "textAlignHorizontal",
                    "textAlignVertical",
                    "textAutoResize",
                    "autoResize",
                    "paragraphIndent",
                    "paragraphSpacing",
                    "lineHeight",
                    "letterSpacing",
                    "textCase",
                    "textDecoration",
                    "textDecorationStyle",
                    "textDecorationOffset",
                    "textDecorationThickness",
                    "textDecorationColor",
                    "textDecorationSkipInk",
                    "textTruncation",
                    "maxLines",
                    "hyperlink",
                    "textStyleId",
                    "hangingPunctuation",
                    "hangingList",
                    "leadingTrim",
                    "listSpacing",
                    "autoRename",
                    "componentPropertyDefinitions",
                    "description",
                    "documentationLinks",
                    "mainComponent",
                    "mainComponentId",
                    "mainComponentName",
                    "componentId",
                    "componentProperties",
                    "exposedInstances",
                    "isExposedInstance",
                    "overrides",
                    "scaleFactor",
                    "swapComponent",
                    "vectorNetwork",
                    "vectorPaths",
                    "handleMirroring",
                    "pointCount",
                    "innerRadius",
                    "arcData",
                    "length",
                    "color",
                    "weight",
                    "sectionContentsHidden",
                    "devStatus",
                    "exportSettings",
                    "reactions",
                    "booleanOperation",
                    "connectorStart",
                    "connectorEnd",
                    "connectorLineType",
                    "connectorStartStrokeCap",
                    "connectorEndStrokeCap",
                    "textBackground",
                    "authorVisible",
                    "authorName",
                    "isWideWidth",
                    "shapeType",
                    "code",
                    "codeLanguage",
                    "numRows",
                    "numColumns",
                    "isSkippedSlide",
                    "interactiveSlideElementType",
                    "widgetId",
                    "widgetSyncedState",
                    "embedData",
                    "linkUnfurlData",
                    "mediaData",
                    "defaultVariantId"
                ]
            }
        }
    },
    isFetchCommand: true,
  },
  // figma_get_node_by_id
  {
    name: "figma_get_node_by_id",
    description: "Fetch detailed information about a specific node using its Figma ID. Returns full properties including fills, strokes, effects, and children.",
    commandType: "GET_NODE_BY_ID" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "description": "Reference to a node by ID or name.",
        "definitions": {},
        "required": [
            "nodeId"
        ]
    },
    isFetchCommand: true,
  },
  // figma_find_nodes
  {
    name: "figma_find_nodes",
    description: "Search for nodes matching criteria. Supports partial name matching (case-insensitive) and type filtering. Returns multiple matches.",
    commandType: "FIND_NODES" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "depth": {
                "type": "number",
                "description": "Max depth to traverse children. 0 = childIds only (default), 1+ = serialize children (requires compact=false)"
            },
            "filter": {
                "type": "string",
                "description": "Filter by node type (e.g., \"FRAME\", \"TEXT\")"
            },
            "register": {
                "type": "boolean",
                "description": "Register nodes in registry for later reference"
            },
            "compact": {
                "type": "boolean",
                "description": "Compact mode - only essential properties (id, name, type, x, y, width, height, visible, locked). Default: true"
            },
            "fields": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/SerializableProp"
                },
                "description": "Specific fields to include (overrides compact/excludeVerbose). E.g., [\"fills\", \"strokes\", \"effects\"]"
            },
            "excludeVerbose": {
                "type": "boolean",
                "description": "Exclude large properties like absoluteTransform, reactions, vectorNetwork. Default: true"
            },
            "name": {
                "type": "string"
            },
            "type": {
                "type": "string"
            },
            "maxResults": {
                "type": "number"
            }
        },
        "additionalProperties": false,
        "description": "Search for nodes matching criteria. Supports partial name matching (case-insensitive) and type filtering. Returns multiple matches.",
        "definitions": {
            "SerializableProp": {
                "type": "string",
                "enum": [
                    "name",
                    "visible",
                    "locked",
                    "x",
                    "y",
                    "width",
                    "height",
                    "rotation",
                    "absoluteTransform",
                    "relativeTransform",
                    "absoluteBoundingBox",
                    "absoluteRenderBounds",
                    "layoutAlign",
                    "layoutGrow",
                    "layoutPositioning",
                    "constraints",
                    "opacity",
                    "blendMode",
                    "isMask",
                    "maskType",
                    "fills",
                    "fillStyleId",
                    "fill",
                    "fillColor",
                    "strokes",
                    "strokeStyleId",
                    "stroke",
                    "strokeColor",
                    "strokeWeight",
                    "strokeAlign",
                    "strokeCap",
                    "strokeJoin",
                    "strokeMiterLimit",
                    "dashPattern",
                    "strokeTopWeight",
                    "strokeRightWeight",
                    "strokeBottomWeight",
                    "strokeLeftWeight",
                    "cornerRadius",
                    "cornerSmoothing",
                    "topLeftRadius",
                    "topRightRadius",
                    "bottomLeftRadius",
                    "bottomRightRadius",
                    "effects",
                    "effectStyleId",
                    "layoutMode",
                    "primaryAxisSizingMode",
                    "counterAxisSizingMode",
                    "primaryAxisAlignItems",
                    "counterAxisAlignItems",
                    "counterAxisAlignContent",
                    "paddingTop",
                    "paddingRight",
                    "paddingBottom",
                    "paddingLeft",
                    "padding",
                    "itemSpacing",
                    "counterAxisSpacing",
                    "gap",
                    "layoutWrap",
                    "wrap",
                    "itemReverseZIndex",
                    "strokesIncludedInLayout",
                    "direction",
                    "align",
                    "counterAlign",
                    "layout",
                    "minWidth",
                    "maxWidth",
                    "minHeight",
                    "maxHeight",
                    "clipsContent",
                    "guides",
                    "layoutGrids",
                    "gridStyleId",
                    "characters",
                    "text",
                    "fontSize",
                    "fontFamily",
                    "fontStyle",
                    "fontWeight",
                    "textAlignHorizontal",
                    "textAlignVertical",
                    "textAutoResize",
                    "autoResize",
                    "paragraphIndent",
                    "paragraphSpacing",
                    "lineHeight",
                    "letterSpacing",
                    "textCase",
                    "textDecoration",
                    "textDecorationStyle",
                    "textDecorationOffset",
                    "textDecorationThickness",
                    "textDecorationColor",
                    "textDecorationSkipInk",
                    "textTruncation",
                    "maxLines",
                    "hyperlink",
                    "textStyleId",
                    "hangingPunctuation",
                    "hangingList",
                    "leadingTrim",
                    "listSpacing",
                    "autoRename",
                    "componentPropertyDefinitions",
                    "description",
                    "documentationLinks",
                    "mainComponent",
                    "mainComponentId",
                    "mainComponentName",
                    "componentId",
                    "componentProperties",
                    "exposedInstances",
                    "isExposedInstance",
                    "overrides",
                    "scaleFactor",
                    "swapComponent",
                    "vectorNetwork",
                    "vectorPaths",
                    "handleMirroring",
                    "pointCount",
                    "innerRadius",
                    "arcData",
                    "length",
                    "color",
                    "weight",
                    "sectionContentsHidden",
                    "devStatus",
                    "exportSettings",
                    "reactions",
                    "booleanOperation",
                    "connectorStart",
                    "connectorEnd",
                    "connectorLineType",
                    "connectorStartStrokeCap",
                    "connectorEndStrokeCap",
                    "textBackground",
                    "authorVisible",
                    "authorName",
                    "isWideWidth",
                    "shapeType",
                    "code",
                    "codeLanguage",
                    "numRows",
                    "numColumns",
                    "isSkippedSlide",
                    "interactiveSlideElementType",
                    "widgetId",
                    "widgetSyncedState",
                    "embedData",
                    "linkUnfurlData",
                    "mediaData",
                    "defaultVariantId"
                ]
            }
        }
    },
    isFetchCommand: true,
  },
  // figma_get_styles
  {
    name: "figma_get_styles",
    description: "List all local styles defined in the document. Styles are reusable design tokens for colors, typography, and effects.",
    commandType: "GET_STYLES" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "depth": {
                "type": "number",
                "description": "Max depth to traverse children. 0 = childIds only (default), 1+ = serialize children (requires compact=false)"
            },
            "filter": {
                "type": "string",
                "description": "Filter by node type (e.g., \"FRAME\", \"TEXT\")"
            },
            "register": {
                "type": "boolean",
                "description": "Register nodes in registry for later reference"
            },
            "compact": {
                "type": "boolean",
                "description": "Compact mode - only essential properties (id, name, type, x, y, width, height, visible, locked). Default: true"
            },
            "fields": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/SerializableProp"
                },
                "description": "Specific fields to include (overrides compact/excludeVerbose). E.g., [\"fills\", \"strokes\", \"effects\"]"
            },
            "excludeVerbose": {
                "type": "boolean",
                "description": "Exclude large properties like absoluteTransform, reactions, vectorNetwork. Default: true"
            }
        },
        "additionalProperties": false,
        "description": "Query options for retrieving nodes.\n\nBy default, queries return COMPACT data to minimize response size:\n- compact=true (default): Only id, name, type, x, y, width, height, visible, locked, childIds\n- depth=0 (default): Children returned as childIds array only, not fully serialized\n- excludeVerbose=true (default): Large properties like transforms, fills, effects excluded\n\nUse compact=false or fields=[...] to get more properties.\n\nAvailable fields (partial list - use compact=false for all):\n- Layout: x, y, width, height, rotation, constraints, layoutMode, layoutAlign, layoutGrow\n- Visual: fills, strokes, effects, opacity, blendMode, cornerRadius\n- Text: characters, fontSize, fontFamily, fontWeight, textAlignHorizontal\n- Auto-layout: paddingTop/Right/Bottom/Left, itemSpacing, primaryAxisAlignItems\n- Components: componentPropertyDefinitions, mainComponentId, componentProperties",
        "definitions": {
            "SerializableProp": {
                "type": "string",
                "enum": [
                    "name",
                    "visible",
                    "locked",
                    "x",
                    "y",
                    "width",
                    "height",
                    "rotation",
                    "absoluteTransform",
                    "relativeTransform",
                    "absoluteBoundingBox",
                    "absoluteRenderBounds",
                    "layoutAlign",
                    "layoutGrow",
                    "layoutPositioning",
                    "constraints",
                    "opacity",
                    "blendMode",
                    "isMask",
                    "maskType",
                    "fills",
                    "fillStyleId",
                    "fill",
                    "fillColor",
                    "strokes",
                    "strokeStyleId",
                    "stroke",
                    "strokeColor",
                    "strokeWeight",
                    "strokeAlign",
                    "strokeCap",
                    "strokeJoin",
                    "strokeMiterLimit",
                    "dashPattern",
                    "strokeTopWeight",
                    "strokeRightWeight",
                    "strokeBottomWeight",
                    "strokeLeftWeight",
                    "cornerRadius",
                    "cornerSmoothing",
                    "topLeftRadius",
                    "topRightRadius",
                    "bottomLeftRadius",
                    "bottomRightRadius",
                    "effects",
                    "effectStyleId",
                    "layoutMode",
                    "primaryAxisSizingMode",
                    "counterAxisSizingMode",
                    "primaryAxisAlignItems",
                    "counterAxisAlignItems",
                    "counterAxisAlignContent",
                    "paddingTop",
                    "paddingRight",
                    "paddingBottom",
                    "paddingLeft",
                    "padding",
                    "itemSpacing",
                    "counterAxisSpacing",
                    "gap",
                    "layoutWrap",
                    "wrap",
                    "itemReverseZIndex",
                    "strokesIncludedInLayout",
                    "direction",
                    "align",
                    "counterAlign",
                    "layout",
                    "minWidth",
                    "maxWidth",
                    "minHeight",
                    "maxHeight",
                    "clipsContent",
                    "guides",
                    "layoutGrids",
                    "gridStyleId",
                    "characters",
                    "text",
                    "fontSize",
                    "fontFamily",
                    "fontStyle",
                    "fontWeight",
                    "textAlignHorizontal",
                    "textAlignVertical",
                    "textAutoResize",
                    "autoResize",
                    "paragraphIndent",
                    "paragraphSpacing",
                    "lineHeight",
                    "letterSpacing",
                    "textCase",
                    "textDecoration",
                    "textDecorationStyle",
                    "textDecorationOffset",
                    "textDecorationThickness",
                    "textDecorationColor",
                    "textDecorationSkipInk",
                    "textTruncation",
                    "maxLines",
                    "hyperlink",
                    "textStyleId",
                    "hangingPunctuation",
                    "hangingList",
                    "leadingTrim",
                    "listSpacing",
                    "autoRename",
                    "componentPropertyDefinitions",
                    "description",
                    "documentationLinks",
                    "mainComponent",
                    "mainComponentId",
                    "mainComponentName",
                    "componentId",
                    "componentProperties",
                    "exposedInstances",
                    "isExposedInstance",
                    "overrides",
                    "scaleFactor",
                    "swapComponent",
                    "vectorNetwork",
                    "vectorPaths",
                    "handleMirroring",
                    "pointCount",
                    "innerRadius",
                    "arcData",
                    "length",
                    "color",
                    "weight",
                    "sectionContentsHidden",
                    "devStatus",
                    "exportSettings",
                    "reactions",
                    "booleanOperation",
                    "connectorStart",
                    "connectorEnd",
                    "connectorLineType",
                    "connectorStartStrokeCap",
                    "connectorEndStrokeCap",
                    "textBackground",
                    "authorVisible",
                    "authorName",
                    "isWideWidth",
                    "shapeType",
                    "code",
                    "codeLanguage",
                    "numRows",
                    "numColumns",
                    "isSkippedSlide",
                    "interactiveSlideElementType",
                    "widgetId",
                    "widgetSyncedState",
                    "embedData",
                    "linkUnfurlData",
                    "mediaData",
                    "defaultVariantId"
                ]
            }
        }
    },
    isFetchCommand: true,
  },
  // figma_get_components
  {
    name: "figma_get_components",
    description: "List all local components (masters) in the document. Use this to discover available reusable components before creating instances.",
    commandType: "GET_COMPONENTS" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "depth": {
                "type": "number",
                "description": "Max depth to traverse children. 0 = childIds only (default), 1+ = serialize children (requires compact=false)"
            },
            "filter": {
                "type": "string",
                "description": "Filter by node type (e.g., \"FRAME\", \"TEXT\")"
            },
            "register": {
                "type": "boolean",
                "description": "Register nodes in registry for later reference"
            },
            "compact": {
                "type": "boolean",
                "description": "Compact mode - only essential properties (id, name, type, x, y, width, height, visible, locked). Default: true"
            },
            "fields": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/SerializableProp"
                },
                "description": "Specific fields to include (overrides compact/excludeVerbose). E.g., [\"fills\", \"strokes\", \"effects\"]"
            },
            "excludeVerbose": {
                "type": "boolean",
                "description": "Exclude large properties like absoluteTransform, reactions, vectorNetwork. Default: true"
            }
        },
        "additionalProperties": false,
        "description": "Query options for retrieving nodes.\n\nBy default, queries return COMPACT data to minimize response size:\n- compact=true (default): Only id, name, type, x, y, width, height, visible, locked, childIds\n- depth=0 (default): Children returned as childIds array only, not fully serialized\n- excludeVerbose=true (default): Large properties like transforms, fills, effects excluded\n\nUse compact=false or fields=[...] to get more properties.\n\nAvailable fields (partial list - use compact=false for all):\n- Layout: x, y, width, height, rotation, constraints, layoutMode, layoutAlign, layoutGrow\n- Visual: fills, strokes, effects, opacity, blendMode, cornerRadius\n- Text: characters, fontSize, fontFamily, fontWeight, textAlignHorizontal\n- Auto-layout: paddingTop/Right/Bottom/Left, itemSpacing, primaryAxisAlignItems\n- Components: componentPropertyDefinitions, mainComponentId, componentProperties",
        "definitions": {
            "SerializableProp": {
                "type": "string",
                "enum": [
                    "name",
                    "visible",
                    "locked",
                    "x",
                    "y",
                    "width",
                    "height",
                    "rotation",
                    "absoluteTransform",
                    "relativeTransform",
                    "absoluteBoundingBox",
                    "absoluteRenderBounds",
                    "layoutAlign",
                    "layoutGrow",
                    "layoutPositioning",
                    "constraints",
                    "opacity",
                    "blendMode",
                    "isMask",
                    "maskType",
                    "fills",
                    "fillStyleId",
                    "fill",
                    "fillColor",
                    "strokes",
                    "strokeStyleId",
                    "stroke",
                    "strokeColor",
                    "strokeWeight",
                    "strokeAlign",
                    "strokeCap",
                    "strokeJoin",
                    "strokeMiterLimit",
                    "dashPattern",
                    "strokeTopWeight",
                    "strokeRightWeight",
                    "strokeBottomWeight",
                    "strokeLeftWeight",
                    "cornerRadius",
                    "cornerSmoothing",
                    "topLeftRadius",
                    "topRightRadius",
                    "bottomLeftRadius",
                    "bottomRightRadius",
                    "effects",
                    "effectStyleId",
                    "layoutMode",
                    "primaryAxisSizingMode",
                    "counterAxisSizingMode",
                    "primaryAxisAlignItems",
                    "counterAxisAlignItems",
                    "counterAxisAlignContent",
                    "paddingTop",
                    "paddingRight",
                    "paddingBottom",
                    "paddingLeft",
                    "padding",
                    "itemSpacing",
                    "counterAxisSpacing",
                    "gap",
                    "layoutWrap",
                    "wrap",
                    "itemReverseZIndex",
                    "strokesIncludedInLayout",
                    "direction",
                    "align",
                    "counterAlign",
                    "layout",
                    "minWidth",
                    "maxWidth",
                    "minHeight",
                    "maxHeight",
                    "clipsContent",
                    "guides",
                    "layoutGrids",
                    "gridStyleId",
                    "characters",
                    "text",
                    "fontSize",
                    "fontFamily",
                    "fontStyle",
                    "fontWeight",
                    "textAlignHorizontal",
                    "textAlignVertical",
                    "textAutoResize",
                    "autoResize",
                    "paragraphIndent",
                    "paragraphSpacing",
                    "lineHeight",
                    "letterSpacing",
                    "textCase",
                    "textDecoration",
                    "textDecorationStyle",
                    "textDecorationOffset",
                    "textDecorationThickness",
                    "textDecorationColor",
                    "textDecorationSkipInk",
                    "textTruncation",
                    "maxLines",
                    "hyperlink",
                    "textStyleId",
                    "hangingPunctuation",
                    "hangingList",
                    "leadingTrim",
                    "listSpacing",
                    "autoRename",
                    "componentPropertyDefinitions",
                    "description",
                    "documentationLinks",
                    "mainComponent",
                    "mainComponentId",
                    "mainComponentName",
                    "componentId",
                    "componentProperties",
                    "exposedInstances",
                    "isExposedInstance",
                    "overrides",
                    "scaleFactor",
                    "swapComponent",
                    "vectorNetwork",
                    "vectorPaths",
                    "handleMirroring",
                    "pointCount",
                    "innerRadius",
                    "arcData",
                    "length",
                    "color",
                    "weight",
                    "sectionContentsHidden",
                    "devStatus",
                    "exportSettings",
                    "reactions",
                    "booleanOperation",
                    "connectorStart",
                    "connectorEnd",
                    "connectorLineType",
                    "connectorStartStrokeCap",
                    "connectorEndStrokeCap",
                    "textBackground",
                    "authorVisible",
                    "authorName",
                    "isWideWidth",
                    "shapeType",
                    "code",
                    "codeLanguage",
                    "numRows",
                    "numColumns",
                    "isSkippedSlide",
                    "interactiveSlideElementType",
                    "widgetId",
                    "widgetSyncedState",
                    "embedData",
                    "linkUnfurlData",
                    "mediaData",
                    "defaultVariantId"
                ]
            }
        }
    },
    isFetchCommand: true,
  },
  // figma_get_variables
  {
    name: "figma_get_variables",
    description: "List all variable collections and their variables (design tokens). Variables store reusable values like colors, spacing, and strings.",
    commandType: "GET_VARIABLES" as CommandType,
    inputSchema: {
        "type": "object",
        "properties": {}
    },
    isFetchCommand: true,
  },
  // figma_import_component
  {
    name: "figma_import_component",
    description: "Import a component from a library by its key. The component is fetched from the Figma library and registered for use. Use the returned registryId to create instances of this component.",
    commandType: "IMPORT_COMPONENT" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "key": {
                "type": "string"
            },
            "id": {
                "type": "string"
            }
        },
        "required": [
            "key"
        ],
        "additionalProperties": false,
        "description": "Import a component from a library by its key.",
        "definitions": {}
    },
  },
  // figma_export_node
  {
    name: "figma_export_node",
    description: "Export a node to an image format or JSON. PNG/JPG/SVG return base64-encoded data. JSON returns the node's serialized properties.",
    commandType: "EXPORT_NODE" as CommandType,
    inputSchema: {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
            "nodeId": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "format": {
                "type": "string",
                "enum": [
                    "PNG",
                    "JPG",
                    "SVG",
                    "PDF",
                    "JSON"
                ]
            },
            "scale": {
                "type": "number"
            },
            "contentsOnly": {
                "type": "boolean"
            }
        },
        "additionalProperties": false,
        "description": "Export a node to an image format or JSON. PNG/JPG/SVG return base64-encoded data. JSON returns the node's serialized properties.",
        "definitions": {}
    },
    isFetchCommand: true,
  },
];

/** Map from tool name to schema for quick lookup */
export const toolSchemaByName = new Map(
  generatedTools.map((t) => [t.name, t])
);

/** Map from command type to tool for quick lookup */
export const toolByCommandType = new Map(
  generatedTools.map((t) => [t.commandType, t])
);

/** Set of command types that return data (fetch/query commands) */
export const fetchCommandTypes = new Set(
  generatedTools.filter((t) => t.isFetchCommand).map((t) => t.commandType)
);

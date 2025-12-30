// Paint types for fills and strokes - aligned with Figma Plugin API

import type { Transform, StrokeCap, StrokeJoin, StrokeAlign } from './geometry.js';

// ============ Color Types ============
export interface RGB {
  r: number;  // 0-1
  g: number;  // 0-1
  b: number;  // 0-1
}

export interface RGBA extends RGB {
  a: number;  // 0-1
}

// Flexible color input - accepts hex strings or RGB/RGBA objects
export type ColorInput = string | RGB | RGBA;

// ============ Blend Modes ============
export type BlendMode =
  | 'PASS_THROUGH' | 'NORMAL'
  | 'DARKEN' | 'MULTIPLY' | 'LINEAR_BURN' | 'COLOR_BURN'
  | 'LIGHTEN' | 'SCREEN' | 'LINEAR_DODGE' | 'COLOR_DODGE'
  | 'OVERLAY' | 'SOFT_LIGHT' | 'HARD_LIGHT'
  | 'DIFFERENCE' | 'EXCLUSION'
  | 'HUE' | 'SATURATION' | 'COLOR' | 'LUMINOSITY';

// ============ Gradient Stop ============
export interface GradientStop {
  position: number;  // 0-1
  color: ColorInput;
}

// ============ Paint Input Types (what Claude sends) ============

// Solid paint - type is optional (defaults to SOLID)
export interface SolidPaintInput {
  type?: 'SOLID';
  color: ColorInput;
  visible?: boolean;
  opacity?: number;
  blendMode?: BlendMode;
}

// Linear, radial, angular, or diamond gradient
export interface GradientPaintInput {
  type: 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND';
  gradientStops: GradientStop[];
  gradientTransform?: Transform;
  visible?: boolean;
  opacity?: number;
  blendMode?: BlendMode;
}

// Image fill
export interface ImagePaintInput {
  type: 'IMAGE';
  imageData?: string;      // base64 encoded image data
  imageHash?: string;      // existing image hash
  scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE';
  imageTransform?: Transform;
  scalingFactor?: number;
  rotation?: number;
  visible?: boolean;
  opacity?: number;
  blendMode?: BlendMode;
}

// Video fill
export interface VideoPaintInput {
  type: 'VIDEO';
  videoHash: string;
  scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE';
  visible?: boolean;
  opacity?: number;
}

// Union of all paint input types
export type PaintInput = SolidPaintInput | GradientPaintInput | ImagePaintInput | VideoPaintInput;

// Shorthand: a single color or a full paint config
export type FillInput = ColorInput | PaintInput;

// ============ Stroke Config ============
export interface StrokeConfig {
  color: ColorInput;
  weight?: number;
  opacity?: number;
  cap?: StrokeCap;
  join?: StrokeJoin;
  align?: StrokeAlign;
  dashPattern?: number[];
  miterLimit?: number;
}

// ============ Legacy Types (for backwards compatibility) ============

// Old ColorStop format (deprecated, use GradientStop)
export interface ColorStop {
  position: number;
  color: string;
  opacity?: number;
}

// Old paint types (deprecated)
export type PaintType = 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'VIDEO';

// Old gradient paint config (deprecated, use GradientPaintInput)
export interface GradientPaintConfig {
  type: 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND';
  stops: ColorStop[];
  opacity?: number;
  blendMode?: BlendMode;
  gradientTransform?: Transform;
}

// Old image paint config (deprecated, use ImagePaintInput)
export interface ImagePaintConfig {
  type: 'IMAGE';
  imageHash: string;
  scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE';
  opacity?: number;
  blendMode?: BlendMode;
}

// Old PaintConfig union (deprecated, use PaintInput)
export type PaintConfig = SolidPaintInput | GradientPaintConfig | ImagePaintConfig;

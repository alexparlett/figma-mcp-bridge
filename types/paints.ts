// Paint types for fills and strokes

export type PaintType = 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'VIDEO';

export interface ColorStop {
  position: number;
  color: string;
  opacity?: number;
}

export interface SolidPaintConfig {
  type?: 'SOLID';
  color: string;
  opacity?: number;
  blendMode?: BlendMode;
}

export interface GradientPaintConfig {
  type: 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND';
  stops: ColorStop[];
  opacity?: number;
  blendMode?: BlendMode;
  gradientTransform?: [[number, number, number], [number, number, number]];
}

export interface ImagePaintConfig {
  type: 'IMAGE';
  imageHash: string;
  scaleMode?: 'FILL' | 'FIT' | 'CROP' | 'TILE';
  opacity?: number;
  blendMode?: BlendMode;
}

export type PaintConfig = SolidPaintConfig | GradientPaintConfig | ImagePaintConfig;

export type BlendMode =
  | 'PASS_THROUGH' | 'NORMAL'
  | 'DARKEN' | 'MULTIPLY' | 'LINEAR_BURN' | 'COLOR_BURN'
  | 'LIGHTEN' | 'SCREEN' | 'LINEAR_DODGE' | 'COLOR_DODGE'
  | 'OVERLAY' | 'SOFT_LIGHT' | 'HARD_LIGHT'
  | 'DIFFERENCE' | 'EXCLUSION'
  | 'HUE' | 'SATURATION' | 'COLOR' | 'LUMINOSITY';

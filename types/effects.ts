// Effect types for shadows, blurs, etc. - aligned with Figma Plugin API

import type { ColorInput, BlendMode } from './paints.js';

// ============ Effect Types ============
export type EffectType = 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';

// ============ Shadow Effects ============
export interface DropShadowEffectInput {
  type: 'DROP_SHADOW';
  color: ColorInput;
  offset: { x: number; y: number };
  radius: number;
  spread?: number;
  visible?: boolean;
  blendMode?: BlendMode;
  showShadowBehindNode?: boolean;
}

export interface InnerShadowEffectInput {
  type: 'INNER_SHADOW';
  color: ColorInput;
  offset: { x: number; y: number };
  radius: number;
  spread?: number;
  visible?: boolean;
  blendMode?: BlendMode;
}

// ============ Blur Effects ============
export interface LayerBlurEffectInput {
  type: 'LAYER_BLUR';
  radius: number;
  visible?: boolean;
}

export interface BackgroundBlurEffectInput {
  type: 'BACKGROUND_BLUR';
  radius: number;
  visible?: boolean;
}

// ============ Union Type ============
export type EffectInput = DropShadowEffectInput | InnerShadowEffectInput | LayerBlurEffectInput | BackgroundBlurEffectInput;

// ============ Legacy Types (for backwards compatibility) ============

// Old effect types (deprecated, use new Input types)
export interface DropShadowEffect {
  type: 'DROP_SHADOW';
  color: string;
  opacity?: number;
  offset?: { x: number; y: number };
  radius?: number;
  spread?: number;
  visible?: boolean;
  blendMode?: string;
  showShadowBehindNode?: boolean;
}

export interface InnerShadowEffect {
  type: 'INNER_SHADOW';
  color: string;
  opacity?: number;
  offset?: { x: number; y: number };
  radius?: number;
  spread?: number;
  visible?: boolean;
  blendMode?: string;
}

export interface LayerBlurEffect {
  type: 'LAYER_BLUR';
  radius: number;
  visible?: boolean;
}

export interface BackgroundBlurEffect {
  type: 'BACKGROUND_BLUR';
  radius: number;
  visible?: boolean;
}

// Old EffectConfig union (deprecated, use EffectInput)
export type EffectConfig = DropShadowEffect | InnerShadowEffect | LayerBlurEffect | BackgroundBlurEffect;

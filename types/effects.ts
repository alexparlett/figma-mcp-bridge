// Effect types for shadows, blurs, etc.

export type EffectType = 'DROP_SHADOW' | 'INNER_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';

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

export type EffectConfig = DropShadowEffect | InnerShadowEffect | LayerBlurEffect | BackgroundBlurEffect;

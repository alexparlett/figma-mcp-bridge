// Geometry, constraints, and vector types

// ============ Stroke Geometry Types ============
export type StrokeCap = 'NONE' | 'ROUND' | 'SQUARE' | 'ARROW_LINES' | 'ARROW_EQUILATERAL';
export type StrokeJoin = 'MITER' | 'BEVEL' | 'ROUND';
export type StrokeAlign = 'INSIDE' | 'OUTSIDE' | 'CENTER';

// ============ Constraint Types ============
export type HorizontalConstraint = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';
export type VerticalConstraint = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH' | 'SCALE';

export interface Constraints {
  horizontal: HorizontalConstraint;
  vertical: VerticalConstraint;
}

export interface CornerRadiusConfig {
  all?: number;
  topLeft?: number;
  topRight?: number;
  bottomRight?: number;
  bottomLeft?: number;
  smoothing?: number;
}

export interface VectorPath {
  windingRule: 'NONZERO' | 'EVENODD';
  data: string;
}

export interface VectorVertex {
  x: number;
  y: number;
  strokeCap?: StrokeCap;
  strokeJoin?: StrokeJoin;
  cornerRadius?: number;
  handleMirroring?: 'NONE' | 'ANGLE' | 'ANGLE_AND_LENGTH';
}

export interface VectorSegment {
  start: number;
  end: number;
  tangentStart?: { x: number; y: number };
  tangentEnd?: { x: number; y: number };
}

export interface VectorNetwork {
  vertices: VectorVertex[];
  segments: VectorSegment[];
}

export interface ArcData {
  startingAngle: number;
  endingAngle: number;
  innerRadius: number;
}

// Transform matrix type
export type Transform = [[number, number, number], [number, number, number]];

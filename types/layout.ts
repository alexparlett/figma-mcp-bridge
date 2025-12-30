// Layout and auto-layout types

export type LayoutMode = 'NONE' | 'HORIZONTAL' | 'VERTICAL';
export type LayoutWrap = 'NO_WRAP' | 'WRAP';
export type LayoutAlign = 'INHERIT' | 'STRETCH' | 'MIN' | 'CENTER' | 'MAX';
export type LayoutPositioning = 'AUTO' | 'ABSOLUTE';

export type PrimaryAxisAlign = 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
export type CounterAxisAlign = 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
export type AxisSizingMode = 'FIXED' | 'AUTO';

export interface LayoutConfig {
  mode?: LayoutMode;
  direction?: 'HORIZONTAL' | 'VERTICAL';
  wrap?: LayoutWrap;

  gap?: number;
  itemSpacing?: number;
  counterAxisSpacing?: number;

  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;

  primaryAlign?: PrimaryAxisAlign;
  counterAlign?: CounterAxisAlign;

  primaryAxisSizing?: AxisSizingMode;
  counterAxisSizing?: AxisSizingMode;
  primarySizing?: AxisSizingMode;
  counterSizing?: AxisSizingMode;

  layoutAlign?: LayoutAlign;
  layoutGrow?: number;
  layoutPositioning?: LayoutPositioning;

  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;

  clipsContent?: boolean;
  itemReverseZIndex?: boolean;
  strokesIncludedInLayout?: boolean;
}

export type LayoutGridPattern = 'COLUMNS' | 'ROWS' | 'GRID';
export type LayoutGridAlignment = 'MIN' | 'CENTER' | 'MAX' | 'STRETCH';

export interface LayoutGridConfig {
  pattern: LayoutGridPattern;
  sectionSize: number;
  visible?: boolean;
  color?: string;
  opacity?: number;
  alignment?: LayoutGridAlignment;
  gutterSize?: number;
  count?: number;
  offset?: number;
}

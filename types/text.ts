// Text and typography types

export type TextAlignHorizontal = 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
export type TextAlignVertical = 'TOP' | 'CENTER' | 'BOTTOM';
export type TextAutoResize = 'NONE' | 'WIDTH_AND_HEIGHT' | 'HEIGHT' | 'TRUNCATE';
export type TextCase = 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE' | 'SMALL_CAPS' | 'SMALL_CAPS_FORCED';
export type TextDecoration = 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH';
export type LeadingTrim = 'NONE' | 'CAP_HEIGHT';

export interface FontName {
  family: string;
  style: string;
}

export interface LineHeight {
  value?: number;
  unit: 'PIXELS' | 'PERCENT' | 'AUTO';
}

export interface LetterSpacing {
  value: number;
  unit: 'PIXELS' | 'PERCENT';
}

export interface Hyperlink {
  type: 'URL' | 'NODE';
  value: string;
}

export interface TextConfig {
  text?: string;
  characters?: string;

  fontFamily?: string;
  fontStyle?: string;
  fontSize?: number;
  fontWeight?: number;

  lineHeight?: number | LineHeight;
  letterSpacing?: number | LetterSpacing;
  paragraphSpacing?: number;
  paragraphIndent?: number;

  textAlignHorizontal?: TextAlignHorizontal;
  textAlignVertical?: TextAlignVertical;

  autoResize?: TextAutoResize;
  maxLines?: number;

  textCase?: TextCase;
  textDecoration?: TextDecoration;
  leadingTrim?: LeadingTrim;

  hyperlink?: Hyperlink;

  fill?: string;
  fills?: unknown[];

  openTypeFeatures?: Record<string, boolean>;
}

export interface TextRangeStyle {
  start: number;
  end: number;
  fontFamily?: string;
  fontStyle?: string;
  fontSize?: number;
  fill?: string;
  textCase?: TextCase;
  textDecoration?: TextDecoration;
  letterSpacing?: number | LetterSpacing;
  lineHeight?: number | LineHeight;
  hyperlink?: Hyperlink;
}

export interface TextStyleConfig {
  name: string;
  fontFamily?: string;
  fontStyle?: string;
  fontSize: number;
  lineHeight?: number | LineHeight;
  letterSpacing?: number | LetterSpacing;
  paragraphSpacing?: number;
  textCase?: TextCase;
  textDecoration?: TextDecoration;
}

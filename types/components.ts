// Component, variant, and instance types

export type ComponentPropertyType = 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP' | 'VARIANT';

export interface ComponentPropertyDefinition {
  type: ComponentPropertyType;
  defaultValue: string | boolean;
  variantOptions?: string[];
  preferredValues?: { type: 'COMPONENT' | 'COMPONENT_SET'; key: string }[];
}

export interface VariantProperty {
  name: string;
  values: string[];
}

export interface ComponentConfig {
  id: string;
  name?: string;
  description?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;

  fill?: string;
  fills?: unknown[];
  stroke?: string | unknown;
  strokeWeight?: number;
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | 'CENTER';
  dashPattern?: number[];
  cornerRadius?: number | unknown;

  direction?: 'HORIZONTAL' | 'VERTICAL';
  gap?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;

  componentProperties?: Record<string, ComponentPropertyDefinition>;
  children?: unknown[];
  [key: string]: unknown;
}

export interface InstanceConfig {
  id?: string;
  name?: string;
  componentId: string;
  x?: number;
  y?: number;
  overrides?: Record<string, OverrideConfig>;
  componentProperties?: Record<string, string | boolean>;
  swapComponent?: string;
  scaleFactor?: number;
}

export interface OverrideConfig {
  text?: string;
  characters?: string;
  fill?: string;
  fills?: unknown[];
  visible?: boolean;
  opacity?: number;
  overrides?: Record<string, OverrideConfig>;
}

export interface ComponentSetConfig {
  name: string;
  description?: string;
  variants: VariantProperty[];
  defaultVariant?: Record<string, string>;
}

interface ComponentEditableFieldType {
  value?: any;
  editable?: boolean;
  label?: string;
}

export interface ComponentAttributesType {
  [key: string]: ComponentEditableFieldType | string | ComponentAttributesType;
}

export interface ComponentDataType {
  key?: string;
  label?: string;
  element?: keyof JSX.IntrinsicElements; // Restrict to valid HTML elements
  attributes?: ComponentAttributesType;
  children?: ComponentEditableFieldType | ComponentDataType | ComponentDataType[] | string; // Allow for nested JSONNodes or text
}

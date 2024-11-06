/**
 * @interface ComponentEditableFieldType
 * Represents a field within a component that may be editable and displayable as a form input.
 *
 * @property {any} [value] - The current value of the field.
 * @property {boolean} [editable] - Indicates if the field is editable by the user.
 * @property {string} [label] - Label for the field, used for display purposes in forms.
 */
interface ComponentEditableFieldType {
  value?: any;
  editable?: boolean;
  label?: string;
  options?: string[];
}

/**
 * @interface ComponentAttributesType
 * Represents a set of HTML attributes or editable fields for a component.
 * Attributes can be either a simple string (for non-editable fields) or a `ComponentEditableFieldType`
 * (for editable fields). Nested attributes can be represented by another `ComponentAttributesType` object.
 *
 * @property {ComponentEditableFieldType | string | ComponentAttributesType} [key: string] - Each attribute can be:
 * - A simple string (non-editable),
 * - An editable field (`ComponentEditableFieldType`),
 * - Or another `ComponentAttributesType` object (to allow nested attributes).
 */
export interface ComponentAttributesType {
  [key: string]: ComponentEditableFieldType | string | ComponentAttributesType;
}

/**
 * @interface ComponentDataType
 * Represents a component with potentially nested structure, attributes, and children,
 * designed for rendering and editing in a form-based UI.
 *
 * @property {string} [key] - Unique identifier for the component, used for tracking in the UI.
 * @property {string} [label] - Optional label to display for the component.
 * @property {keyof JSX.IntrinsicElements} [element] - Specifies the HTML tag for the component (e.g., `div`, `p`, `img`), constrained to valid HTML elements.
 * @property {ComponentAttributesType} [attributes] - Collection of attributes associated with the component,
 * allowing for HTML attributes or editable fields (e.g., `href`, `style`).
 * @property {ComponentEditableFieldType | ComponentDataType | ComponentDataType[] | string} [children] - Represents nested components or content.
 * - `ComponentEditableFieldType`: Allows text-based content with editable properties.
 * - `ComponentDataType`: Represents a nested component.
 * - `ComponentDataType[]`: Represents an array of nested components.
 * - `string`: Simple text content for non-editable fields.
 */
export interface ComponentDataType {
  key?: string;
  label?: string;
  element?: keyof JSX.IntrinsicElements; // Restrict to valid HTML elements
  attributes?: ComponentAttributesType;
  children?: ComponentEditableFieldType | ComponentDataType | ComponentDataType[] | string; // Allow for nested JSONNodes or text
}

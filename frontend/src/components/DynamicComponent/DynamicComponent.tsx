import React from "react";
import { useAppDispatch } from '@/redux/store';
import { setEditableComponentKeys } from "@/redux/slices/componentsSlice";
import { ComponentDataType } from "@/types/component";

/**
 * Set of HTML void elements that do not have closing tags.
 */
const voidElements = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "keygen", "link", "meta", "param", "source", "track", "wbr",
]);

/**
 * Parses attributes recursively, extracting values for editable fields.
 *
 * @param {Record<string, any>} attributes - The attributes object containing properties for an HTML element.
 * @returns {Record<string, any>} Parsed attributes with values for editable fields and nested attributes resolved.
 */
const parseAttributes = (attributes: Record<string, any>) => {
  const parsedAttributes: Record<string, any> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (typeof value === "object" && value !== null) {
      parsedAttributes[key] = "editable" in value && value.editable ? value.value : parseAttributes(value);
    } else if (typeof value === "string" || typeof value === "number") {
      parsedAttributes[key] = value;
    }
  }
  return parsedAttributes;
};

/**
 * React component for rendering a dynamic HTML structure based on JSON data.
 *
 * This component accepts JSON-based configuration data to dynamically create HTML elements,
 * applying attributes, handling events, and managing nested components recursively.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {ComponentDataType} props.data - The JSON data representing the component structure and attributes.
 * @param {string} props.editableGrandParentComponentKey - Unique identifier of the grandparent component in the editable hierarchy.
 * @returns {JSX.Element} A dynamically generated component based on the provided JSON configuration.
 */
const DynamicComponent: React.FC<{ data: ComponentDataType, editableGrandParentComponentKey: string }> = ({ data, editableGrandParentComponentKey }) => {
  const dispatch = useAppDispatch();
  const parsedAttributes = parseAttributes(data.attributes || {});
  
  /**
   * Determines the HTML element type to render. Defaults to 'div' if not specified or invalid.
   */
  const Element = data.element 
    ? data.element as keyof JSX.IntrinsicElements
    : "div";  // Default fallback if element type is invalid

  const isVoidElement = voidElements.has(Element);

  /**
   * Adds a hover effect to the component when the mouse enters its boundaries.
   *
   * @param {React.MouseEvent} e - The mouse event triggered when hovering over the component.
   */
  const componentOnMouseOver = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) e.currentTarget.classList.add("component-hovered");
  };

  /**
   * Removes the hover effect from the component when the mouse leaves its boundaries.
   *
   * @param {React.MouseEvent} e - The mouse event triggered when no longer hovering over the component.
   */
  const componentOnMouseOut = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) e.currentTarget.classList.remove("component-hovered");
  };

  /**
   * Handles component selection on click, setting it as the currently editable component.
   *
   * @param {React.MouseEvent} e - The click event triggered on the component.
   */
  const componentOnClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      e.preventDefault();
      document.querySelectorAll('.component-selected').forEach((el) => el.classList.remove('component-selected'));
      e.currentTarget.classList.add("component-selected");
      dispatch(setEditableComponentKeys({ editableGrandParentComponentKey, editableComponentKey: data?.key || '' }));
    }
  };

  /**
   * Renders the component based on whether it is a void element or a standard element.
   */
  return (
    <>
      {isVoidElement ? (
        <Element
          className="border-2 border-transparent"
          onMouseOver={componentOnMouseOver}
          onMouseOut={componentOnMouseOut}
          onClick={componentOnClick}
          draggable={false}
          {...parsedAttributes}
        />
      ) : (
        <Element
          className="border-[3px] border-transparent"
          {...parsedAttributes}
          onMouseOver={componentOnMouseOver}
          onMouseOut={componentOnMouseOut}
          onClick={componentOnClick}
        >
          {Array.isArray(data.children)
            ? data.children.map((child) => (
                <DynamicComponent
                  key={child.key || `${data.key}-${Math.random()}`} // Ensures unique key fallback
                  data={child}
                  editableGrandParentComponentKey={editableGrandParentComponentKey}
                />
              ))
            : typeof data.children === "string"
            ? data.children
            : (typeof data.children === 'object' && 'value' in data.children ? data.children.value : null)} {/* Handles direct string or editable object */}
        </Element>
      )}
    </>
  );
};

export default DynamicComponent;

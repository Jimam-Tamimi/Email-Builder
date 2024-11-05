import React from "react";
import { useAppDispatch } from '@/redux/store';
import { setEditableComponentKeys } from "@/redux/slices/componentsSlice";
import { ComponentDataType } from "@/types/component";

// List of void elements
const voidElements = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "keygen", "link", "meta", "param", "source", "track", "wbr",
]);

// Parse attributes and styles
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

// DynamicComponent
const DynamicComponent: React.FC<{ data: ComponentDataType, editableGrandParentComponentKey: string }> = ({ data, editableGrandParentComponentKey }) => {
  const dispatch = useAppDispatch();
  const parsedAttributes = parseAttributes(data.attributes || {});
  
  // Dynamic element with default fallback
  const Element = data.element 
    ? data.element as keyof JSX.IntrinsicElements
    : "div";  // Default fallback if element type is invalid

  const isVoidElement = voidElements.has(Element);

  // Event handlers
  const componentOnMouseOver = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) e.currentTarget.classList.add("component-hovered");
  };

  const componentOnMouseOut = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) e.currentTarget.classList.remove("component-hovered");
  };

  const componentOnClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      e.preventDefault();
      document.querySelectorAll('.component-selected').forEach((el) => el.classList.remove('component-selected'));
      e.currentTarget.classList.add("component-selected");
      dispatch(setEditableComponentKeys({ editableGrandParentComponentKey, editableComponentKey: data?.key || '' }));
    }
  };

  // Render the component
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
                  key={child.key || `${data.key}-${Math.random()}`} // Ensure unique key fallback
                  data={child}
                  editableGrandParentComponentKey={editableGrandParentComponentKey}
                />
              ))
            : typeof data.children === "string"
            ? data.children
            : (typeof data.children === 'object' && 'value' in data.children ? data.children.value : null)} {/* Handle direct string or editable object */}
        </Element>
      )}
    </>
  );
};

export default DynamicComponent;

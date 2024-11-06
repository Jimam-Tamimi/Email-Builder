
# Component Creation Guide

This guide provides instructions on how to create a new component in the structured format used by the `ComponentDataType` interface. This format allows for detailed customization of HTML elements, including attributes, styles, and nested content, enabling easy management of component structure and styling.

## Description

Components are created as JavaScript objects using the `ComponentDataType` interface. Each component object can have customizable properties such as unique keys, editable attributes, and nested children. This structure is useful for dynamically generating components with a variety of editable styles and content.

### Component Structure

Each component object has the following key properties:

- **`key`**: A unique identifier for the component.
- **`label`**: A descriptive name for the component.
- **`element`**: Specifies the HTML tag for the component, e.g., `div`, `img`, `section`.
- **`attributes`**: An object that contains any HTML attributes, such as `style`, `src`, or `href`. Each attribute can be set as editable to allow for runtime modification.
- **`children`**: Contains nested components or text content. This can include either strings, objects with editable properties, or other components.

### Example Component

Below is an example of a simple component defined using the `ComponentDataType` structure. This component is a `div` element with editable background color and padding attributes, and a nested text element.

```typescript
import { ComponentDataType } from "@/types/component";

const SimpleCardComponent: ComponentDataType = {
  key: "SIMPLE_CARD",
  label: "Simple Card",
  element: "div",
  attributes: {
    style: {
      backgroundColor: {
        value: "#f0f0f0",
        editable: true,
        label: "Background Color",
      },
      padding: {
        value: "20px",
        editable: true,
        label: "Padding",
      },
      borderRadius: {
        value: "8px",
        editable: true,
        label: "Border Radius",
      },
    },
  },
  children: [
    {
      key: "SIMPLE_CARD.TITLE",
      label: "Card Title",
      element: "h2",
      children: {
        value: "Editable Card Title",
        editable: true,
        label: "Title Text",
      },
      attributes: {
        style: {
          fontSize: {
            value: "18px",
            editable: true,
            label: "Font Size",
          },
          fontWeight: {
            value: "bold",
            editable: true,
            label: "Font Weight",
          },
        },
      },
    },
    {
      key: "SIMPLE_CARD.CONTENT",
      label: "Card Content",
      element: "p",
      children: {
        value: "This is the content inside the card. It is editable.",
        editable: true,
        label: "Content Text",
      },
      attributes: {
        style: {
          fontSize: {
            value: "14px",
            editable: true,
            label: "Font Size",
          },
          lineHeight: {
            value: "1.5",
            editable: true,
            label: "Line Height",
          },
        },
      },
    },
  ],
};

export default SimpleCardComponent;
```

In this example:

- The `SimpleCardComponent` is a `div` element with customizable background color, padding, and border radius.
- It contains a title (`h2` element) and content (`p` element), both of which have editable text and styles.

This structure can be adapted for more complex components by adding additional nested elements and editable attributes.

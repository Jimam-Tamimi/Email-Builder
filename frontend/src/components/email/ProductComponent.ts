import { ComponentDataType } from "@/types/component";


/**
 * @constant {ComponentDataType} ProductComponent
 * Represents a structured product component with customizable styles, text, and layout, designed to be rendered as HTML and to support inline editing.
 *
 * @property {string} key - Unique identifier for the component.
 * @property {string} label - Display label for the product component.
 * @property {string} element - Specifies the HTML element to render (in this case, "section" for the root).
 * @property {ComponentAttributesType} attributes - Collection of attributes for the root section element.
 * - `style`: Configures the main container's styling, including `margin`, `width`, `backgroundColor`, `padding`, and `borderRadius`.
 *
 * @property {ComponentDataType[]} children - Array containing nested components for the product layout, each representing distinct parts of the product display:
 *   - `PRODUCT.IMAGE`: Image component for the product.
 *     - `src`: Editable image source URL.
 *     - `alt`: Editable image alt text.
 *     - `style`: Customizable image styles, such as `width`, `borderRadius`, `objectFit`, and `height`. 
 *    
 *   - Section element:
 *     - Contains nested components for product details like title, description, price, and a call-to-action button.
 *     - `PRODUCT.CLASSIC_WATCHES_TEXT`: Represents the product title.
 *       - `children.value`: Editable title text.
 *       - `attributes.style`: Styles for title text, including `marginTop`, `fontSize`, `fontWeight`, `lineHeight`, and `color`.
 *
 *     - `PRODUCT.DESCRIPTION`: Represents the product description.
 *       - `children.value`: Editable description text.
 *       - `attributes.style`: Styles for description, including `marginTop`, `fontSize`, `lineHeight`, and `color`.
 *
 *     - `PRODUCT.PRICE`: Represents the product price.
 *       - `children.value`: Editable price text.
 *       - `attributes.style`: Styles for price text, such as `fontSize`, `fontWeight`, and `color`.
 *
 *     - `PRODUCT.BUY_BUTTON`: Represents the buy button.
 *       - `children.value`: Editable button text.
 *       - `attributes.href`: Editable URL for the button link.
 *       - `attributes.style`: Styles for the button, including `marginTop`, `borderRadius`, `backgroundColor`, `padding`, `color`, and `fontWeight`.
 *
 * @example
 * import ProductComponent from "@/types/component";
 * // Usage: Render ProductComponent in a dynamic UI or editor, allowing inline editing of styles and content.
 */


const ProductComponent: ComponentDataType = {
  key: "PRODUCT",
  label: "Product",
  element: "section",
  attributes: {
    style: {
      label: "Product Styles",
      margin: {
        value: "16px",
        editable: true,
        label: "Margin",
      },
      width: {
        value: "420px",
        editable: true,
        label: "Width",
      },
      backgroundColor: {
        value: "#e4e4e7",
        editable: true,
        label: "Background Color",
      },
      padding: {
        value: "0px 0px 10px 0px",
        editable: true,
        label: "Padding",
      },
      borderRadius: {
        value: "10px",
        editable: true,
        label: "Border Radius",
      }
    },
  },
  children: [
    {
      key: "PRODUCT.IMAGE",
      label: "Braun Collection Image",
      element: "img",
      attributes: {
        src: {
          value: "https://react.email/static/braun-collection.jpg",
          editable: true,
          label: "Image Source",
        },
        alt: {
          value: "Braun Collection",
          editable: true,
          label: "Image Alt Text",
        },
        style: {
          label: "Product Image Styles ",
          width: {
            value: "100%",
            editable: true,
            label: "Image Width",
          },
          borderRadius: {
            value: "12px",
            editable: true,
            label: "Image Border Radius",
          },
          objectFit: {
            value: "cover",
            editable: true,
            label: "Image Object Fit",
            options: ["cover", "contain", "fill", "none", "scale-down"],
          },
          height: {
            value: "320px",
            editable: true,
            label: "Image Height",
          },
        },
      },
    },
    {
      element: "section",
      attributes: {
        style: {
          marginTop: "32px",
          textAlign: "center",
        },
      },
      children: [
        {
          key: "PRODUCT.CLASSIC_WATCHES_TEXT",
          label: "Product Title",
          element: "p",
          children: {
            value: "Classic Watches",
            editable: true,
            label: "Classic Watches Title",
          },
          attributes: {
            style: {
              label: "Product Title Styles",
              marginTop: {
                value: "16px",
                editable: true,
                label: "Title Margin Top",
              },
              fontSize: {
                value: "18px",
                editable: true,
                label: "Title Font Size",
              },
              fontWeight: {
                value: "600",
                editable: true,
                label: "Title Font Weight",
              },
              lineHeight: {
                value: "28px",
                editable: true,
                label: "Title Line Height",
              },
              color: {
                value: "#4f46e4", // Indigo color code
                editable: true,
                label: "Title Color",
                type: "color",
              },
            },
          },
        },
        {
          key: "PRODUCT.DESCRIPTION",
          label: "Product Description",
          element: "p",
          children: {
            value:
              "Dieter Rams’ work has an outstanding quality which distinguishes it from the vast majority of industrial design of the entire 20th Century.",
            editable: true,
            label: "Product Description",
          },
          attributes: {
            style: {
              label: "Product Description Styles",
              marginTop: {
                value: "8px",
                editable: true,
                label: "Description Margin Top",
              },
              fontSize: {
                value: "16px",
                editable: true,
                label: "Description Font Size",
              },
              lineHeight: {
                value: "24px",
                editable: true,
                label: "Description Line Height",
              },
              color: {
                value: "#000000", // Gray color code
                editable: true,
                label: "Description Color",
                type: "color",
              },
            },
          },
        },
        {
          key: "PRODUCT.PRICE",
          label: "Product Price",
          element: "p",
          attributes: {
            style: {
              label: "Product Price Styles",
              fontSize: {
                value: "16px",
                editable: true,
                label: "Price Font Size",
              },
              fontWeight: {
                value: "600",
                editable: true,
                label: "Price Font Weight",
              },
              color: {
                value: "#000000", // Gray color code
                editable: true,
                label: "Price Color",
                type: "color",
              },
            },
          },
          children: {
            value: "$210.00",
            editable: true,
            label: "Product Price",
          },
        },
        {
          key: "PRODUCT.BUY_BUTTON",
          label: "Buy Button",
          element: "button",
          children: {
            value: "Buy now",
            editable: true,
            label: "Button Text",
          },
          attributes: {
            href: {
              value: "https://react.email",
              editable: true,
              label: "URL",
            },
            style: {
              label: "Button Styles",
              marginTop: {
                value: "16px",
                editable: true,
                label: "Button Margin Top",
              },
              borderRadius: {
                value: "8px",
                editable: true,
                label: "Button Border Radius",
              },
              backgroundColor: {
                value: "#4f46e4", // Indigo color code
                editable: true,
                label: "Button Background Color",
                type: "color",
              },
              padding: {
                value: "12px 24px",
                editable: true,
                label: "Button Padding",
              },
              color: {
                value: "#FFFFFF", // White color code
                editable: true,
                label: "Button Text Color",
                type: "color",
              },
              fontWeight: {
                value: "600",
                editable: true,
                label: "Button Font Weight",
              },
            },
          },
        },
      ],
    },
  ],
};

export default ProductComponent;

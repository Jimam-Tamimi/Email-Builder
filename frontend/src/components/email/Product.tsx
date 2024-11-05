//

import React from "react";
import DynamicComponent from "../DynamicComponent";
import { ComponentDataType } from "@/types/component";
export const ProductComponentData: ComponentDataType = {
  key: "PRODUCT.CLASSIC_WATCHES",
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
      key: "PRODUCT.TEXT_SECTION",
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
                value: "indigo",
                editable: true,
                label: "Title Color",
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
                value: "gray",
                editable: true,
                label: "Description Color",
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
                value: "gray",
                editable: true,
                label: "Price Color",
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
                value: "indigo",
                editable: true,
                label: "Button Background Color",
              },
              padding: {
                value: "12px 24px",
                editable: true,
                label: "Button Padding",
              },
              color: {
                value: "white",
                editable: true,
                label: "Button Text Color",
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
 

export default function Product() {
  return (
    <>
      {/* <DynamicComponent data={jsonData} /> */}
    </>
  );
}

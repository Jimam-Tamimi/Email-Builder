/**
 * @file Sidebar.tsx
 * @description Sidebar component providing a draggable interface for components.
 * Allows users to drag components from the sidebar into the canvas.
 * Displays a preview of the dragged component during the drag action.
 */

"use client";

import { LiaGripLinesSolid } from "react-icons/lia";
import ProductComponent from "../email/ProductComponent";
import { useState } from "react";
import DynamicComponent from "../DynamicComponent";
import { ComponentDataType } from "@/types/component";
import Auth from "@/app/[locale]/auth/components/Auth";

// List of available components for drag-and-drop
let components = [ProductComponent];

/**
 * Sidebar Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {any} props.pageContent - Content for displaying text elements such as the sidebar title.
 *
 * @returns {JSX.Element} The rendered Sidebar component.
 *
 * @description
 * The `Sidebar` component renders a list of components that users can drag onto a designated canvas area.
 * When a component is dragged, a live preview follows the cursor, enhancing the user experience.
 * This component is designed to work with a drag-and-drop interface, where components can be dropped
 * onto a canvas to be added dynamically.
 */
export default function Sidebar({ pageContent }: { pageContent: any }) {
  const [draggingComponent, setDraggingComponent] =
    useState<ComponentDataType>();
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [offsetPercent, setOffsetPercent] = useState({ x: 0, y: 0 });

  /**
   * Handle the drag start event, setting up drag data and preview positioning.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event.
   * @param {ComponentDataType} component - The component data being dragged.
   */
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    component: ComponentDataType
  ) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
    setDraggingComponent(component);

    // Calculate offset of the cursor within the component as a percentage
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const offsetYPercent = ((e.clientY - rect.top) / rect.height) * 100;
    setOffsetPercent({ x: offsetXPercent, y: offsetYPercent });

    // Hide default drag image
    e.dataTransfer.setDragImage(new Image(), 0, 0);

    // Update preview position as the item is dragged
    const updatePosition = (e: DragEvent) => {
      setPreviewPosition({
        x: e.clientX - (rect.width * offsetXPercent) / 100,
        y: e.clientY - (rect.height * offsetYPercent) / 100,
      });
    };
    document.addEventListener("dragover", updatePosition);

    // Clean up preview when drag ends
    e.target.addEventListener("dragend", () => {
      setDraggingComponent(undefined);
      document.removeEventListener("dragover", updatePosition);
    });
  };

  return (
    <div className="w-[16vw] max-h-screen h-screen  p-5  relative select-none dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010]">
    <div className="overflow-y-scroll scrollbar-hide h-[-webkit-fill-available] gap-4 flex flex-col pb-14">
      <h1 className="text-center text-3xl font-bold tracking-wide mb-2">
        {pageContent?.sidebar_title}
      </h1>
      
      {/* Render draggable components */}
      {components.map((component, i) => (
        <>
         
          <div
            key={i}
            draggable
            onDragStart={(e) => handleDragStart(e, component)}
            className="cursor-grab active:cursor-grabbing flex justify-start gap-5 py-2 px-4 
           rounded-lg dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010] 
           bg-[#a6c6fd47] dark:bg-[rgba(255,255,255,0.1)] items-center"
          >
            <LiaGripLinesSolid size={30} />
            <p>{component.label}</p>
          </div>
        </>
      ))}

      {/* Preview of the component during drag */}
      {draggingComponent && (
        <div
          style={{
            position: "fixed",
            top: previewPosition.y,
            left: previewPosition.x,
            pointerEvents: "none",
            zIndex: 1000,
            opacity: 0.8,
          }}
        >
          <DynamicComponent
            editableGrandParentComponentKey={""}
            data={draggingComponent}
          />
        </div>
      )}
    </div>
      <div className="w-full absolute flex-col dark:shadow-[0_0px_15px_#ffffff20]  flex bottom-0 dark:bg-black bg-white border-t-[1px] dark:border-gray-600 border-gray-300 py-4 px-4  left-0">
        
        <Auth pageContent={pageContent} />
      </div>
    </div>
  );
}

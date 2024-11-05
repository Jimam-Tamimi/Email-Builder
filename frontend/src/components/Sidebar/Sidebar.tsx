'use client'
import { LiaGripLinesSolid } from "react-icons/lia";
import ProductComponent from "../email/ProductComponent";
import { useState } from "react";
import DynamicComponent from "../DynamicComponent";
import { ComponentDataType } from "@/types/component";

let components = [ ProductComponent ];

export default function Sidebar({pageContent}:{pageContent:any}) {
  const [draggingComponent, setDraggingComponent] = useState<ComponentDataType >();
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [offsetPercent, setOffsetPercent] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, component: ComponentDataType) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
    setDraggingComponent(component);  

    // Calculate offset of cursor within the element as a percentage
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const offsetYPercent = ((e.clientY - rect.top) / rect.height) * 100;
    setOffsetPercent({ x: offsetXPercent, y: offsetYPercent });

    // Hide default drag image
    e.dataTransfer.setDragImage(new Image(), 0, 0);

    // Update preview position on drag
    const updatePosition = (e: DragEvent) => {
      setPreviewPosition({
        x: e.clientX - (rect.width * offsetXPercent) / 100,
        y: e.clientY - (rect.height * offsetYPercent) / 100,
      });
    };
    document.addEventListener("dragover", updatePosition);

    // Clean up when drag ends
    e.target.addEventListener("dragend", () => {
      setDraggingComponent(undefined);
      document.removeEventListener("dragover", updatePosition);
    });
  };

  return (
    <div className="w-[22%] max-h-screen h-screen overflow-y-scroll p-5 scrollbar-hide select-none gap-4 flex flex-col dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010]">
      <h1 className="text-center text-3xl font-bold tracking-wide mb-4">{pageContent?.sidebar_title}</h1>

      {components.map((component, i) => (
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
      ))}

      {/* Preview Component */}
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
          <DynamicComponent editableGrandParentComponentKey={""} data={draggingComponent} />
        </div>
      )}
    </div>
  );
}

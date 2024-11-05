"use client";

import { useState } from "react";
import { Reorder, AnimatePresence } from "framer-motion";
import DynamicComponent from "../DynamicComponent";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { addComponent,  setComponents } from "@/redux/slices/componentsSlice";
import ThemeToggler from "../ThemeToggler";
import SelectLanguage from "../SelectLanguage";

export default function Canvas({pageContent}:{pageContent:any}) {
  const dispatch = useAppDispatch();
  const components = useSelector((state: RootState) => state.components?.data);
  const [isDragging, setIsDragging] = useState(false); // Track if an item is being dragged

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.getData("component")) return;
    const component = JSON.parse(e.dataTransfer.getData("component"));
    dispatch(addComponent(component));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className={`w-full flex ${!components?.length && "justify-center"} relative py-5 items-center flex-col min-h-screen overflow-y-scroll`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ cursor: isDragging ? "grabbing" : "default" }} // Change cursor based on dragging state
    >

      <div className="flex justify-end absolute top-6 gap-7 right-6">
        <ThemeToggler />  
        <SelectLanguage />
      </div>

      {!components?.length && (
        <p
          style={{ textShadow: "0px 0px 20px white" }}
          className="capitalize tracking-wider"
        >{pageContent?.canvas_component_not_available}</p>
      )}

      <Reorder.Group
        axis="y"
        values={components || []}
        onReorder={(newOrder) => {
          dispatch(setComponents({
            data: newOrder,
          }));
        }}
        style={{backgroundColor: "#e5edf3"}}
        className="flex flex-col items-center"
      >
        <AnimatePresence initial={false}>
          {components?.map((component, index) => (
            <Reorder.Item
              key={component?.key}
              value={component}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onDragStart={() => setIsDragging(true)} // Set dragging state to true
              onDragEnd={() => setIsDragging(false)} // Reset dragging state
            >
              <DynamicComponent data={component} editableGrandParentComponentKey={component?.key || ''} />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>


      
    </div>
  );
}

/**
 * @file Canvas.tsx
 * @description Canvas component for rendering and reordering dynamically added components.
 * Allows users to drag-and-drop components onto the canvas and reorder them within a customizable layout.
 * Also integrates theme and language selection features.
 */

"use client";

import { useState } from "react";
import { Reorder, AnimatePresence } from "framer-motion";
import DynamicComponent from "../DynamicComponent";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { addComponent, setComponents } from "@/redux/slices/componentsSlice";
import ThemeToggler from "../ThemeToggler";
import SelectLanguage from "../SelectLanguage";

/**
 * Canvas Component
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {any} props.pageContent - Content used for displaying messages or instructions in the component.
 * 
 * @returns {JSX.Element} The rendered Canvas component.
 * 
 * @description
 * The `Canvas` component provides a flexible area where users can drag-and-drop components from the sidebar,
 * rearrange them in a specific order, and adjust the layout dynamically.
 * This component is built using `framer-motion` for animations, allowing smooth reordering and transitions.
 * It also incorporates Redux for state management and interacts with other UI components such as ThemeToggler
 * and SelectLanguage.
 * 
 * The component follows these primary behaviors:
 * - Receives a component when dropped onto the canvas, and adds it to the Redux state.
 * - Supports drag-and-drop functionality to change the order of added components.
 * - Displays a placeholder message if no components are present.
 */
export default function Canvas({ pageContent }: { pageContent: any }) {
  const dispatch = useAppDispatch();

  // Retrieve the list of components from Redux state
  const components = useSelector((state: RootState) => state.components?.data);

  // Local state to track whether an item is being dragged
  const [isDragging, setIsDragging] = useState(false);

  /**
   * Handle the drop event when a component is dragged from the sidebar to the canvas.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData("component");

    if (!componentData) return;

    // Parse the component data and dispatch an action to add it to the Redux store
    const component = JSON.parse(componentData);
    dispatch(addComponent(component));
  };

  /**
   * Prevent the default behavior when dragging an item over the canvas.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className={`w-[66vw] flex ${!components?.length && "justify-center"} relative py-5 items-center flex-col min-h-screen overflow-y-scroll`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ cursor: isDragging ? "grabbing" : "default" }}
    >
      {/* Theme and Language toggles at the top-right corner */}
      <div className="flex justify-end absolute top-6 gap-7 right-6">
        <ThemeToggler />
        <SelectLanguage />
      </div>

      {/* Placeholder message when no components are present */}
      <p
        style={{ textShadow: "0px 0px 20px white" }}
        className={`capitalize tracking-wider ease-in-out text-center ${
          components?.length ? "opacity-0 scale-75" : "opacity-100 scale-100 duration-300 delay-300"
        }`}
      >
        {pageContent?.canvas_component_not_available}
      </p>

      {/* Reorderable list of components */}
      <Reorder.Group
        axis="y"
        values={components || []}
        onReorder={(newOrder) => {
          dispatch(setComponents({
            data: newOrder,
          }));
        }}
        style={{ backgroundColor: "#e5edf3" }}
        className="flex flex-col items-center"
      >
        {/* Animate presence for smooth entry/exit animations */}
        <AnimatePresence initial={false}>
          {components?.map((component, index) => (
            <Reorder.Item
              key={component?.key}
              value={component}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            >
              {/* Render the dynamic component with edit capability */}
              <DynamicComponent data={component} editableGrandParentComponentKey={component?.key || ''} />
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
}

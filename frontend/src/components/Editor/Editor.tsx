/**
 * @file Editor.tsx
 * @description Editor component that provides an interface for editing component fields and history-based undo/redo functionality.
 * This component is part of a dynamic drag-and-drop editor with form-based field editing.
 */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { ComponentDataType } from "@/types/component";
import EditableFields from "./EditableFields";
import {
  setComponents,
  setComponentsHistoryStateCurrentIndex,
  updateComponentEditableFields,
} from "@/redux/slices/componentsSlice";
import { Button } from "@nextui-org/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useForm } from "react-hook-form";

/**
 * Editor Component
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {any} props.pageContent - Content data, providing text for UI elements like button labels.
 *
 * @returns {JSX.Element} The rendered Editor component.
 *
 * @description
 * The `Editor` component allows for the selection and editing of component fields within a drag-and-drop editor.
 * It includes an undo/redo feature that allows users to navigate through edit history, making it easy to revert or
 * reapply changes. The form-based editing is handled with `react-hook-form`.
 */
export default function Editor({ pageContent }: { pageContent: any }) {
  const [editableComponent, setEditableComponent] = useState<ComponentDataType>();
  
  const {
    register,
    handleSubmit,
  } = useForm();
  
  const dispatch = useAppDispatch();

  // Redux selectors for component and history states
  const components = useSelector((state: RootState) => state.components.data);
  const componentsHistoryState = useSelector(
    (state: RootState) => state.components.componentsHistoryState
  );
  const editableComponentKeysData = useSelector(
    (state: RootState) => state.components.editableComponentKeysData
  );

  /**
   * Finds a component by its key within a nested structure.
   * @param {any} data - The data structure where the component resides.
   * @param {string} targetKey - The key of the target component to find.
   * @returns {ComponentDataType | undefined} The found component or `undefined` if not found.
   */
  const findEditableComponent = useCallback(
    (data: any, targetKey: string): ComponentDataType | undefined => {
      if (Array.isArray(data)) {
        return data
          .map((item) => findEditableComponent(item, targetKey))
          .find((result) => result !== undefined);
      } else if (data?.key === targetKey) {
        return data;
      } else if (data.children) {
        const childrenArray = Array.isArray(data.children)
          ? data.children
          : [data.children];
        return childrenArray
          .map((child: any) => findEditableComponent(child, targetKey))
          .find((result: any) => result !== undefined);
      }
      return undefined;
    },
    []
  );

  // Effect for updating the editable component based on keys in `editableComponentKeysData`
  useEffect(() => {
    let editableComp =
      components.find(
        (component) =>
          component.key ===
          editableComponentKeysData?.editableGrandParentComponentKey
      ) || undefined;

    if (
      editableComp &&
      editableComponentKeysData?.editableGrandParentComponentKey !==
        editableComponentKeysData?.editableComponentKey
    ) {
      editableComp = findEditableComponent(
        editableComp,
        editableComponentKeysData?.editableComponentKey
      );
    }

    setEditableComponent(editableComp);
  }, [components, editableComponentKeysData, findEditableComponent]);

  /**
   * Submits edited data, dispatching an update action to the Redux store.
   * @param {any} data - The form data to submit.
   */
  const onSubmit = async (data: any) => {
    dispatch(
      updateComponentEditableFields({
        productKey: editableComponentKeysData?.editableGrandParentComponentKey,
        componentKey: editableComponentKeysData?.editableComponentKey,
        data,
      })
    );
  };

  /**
   * Sets up event listeners for keyboard-based undo/redo functionality.
   */
  useEffect(() => {
    const handleUndoRedo = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "z") {
        handleRedo();
      }
      if (event.ctrlKey && event.key === "z") {
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleUndoRedo);
    return () => {
      window.removeEventListener("keydown", handleUndoRedo);
    };
  }, [componentsHistoryState, dispatch]);

  /**
   * Handles the redo action, applying the next state in the history.
   */
  const handleRedo = () => {
    if (
      componentsHistoryState.componentsHistory.length > 0 &&
      componentsHistoryState.currentIndex <
        componentsHistoryState.componentsHistory.length - 1
    ) {
      const nextState =
        componentsHistoryState.componentsHistory[componentsHistoryState.currentIndex + 1];
      if (nextState) {
        dispatch(setComponents({ data: nextState, ignoreHistory: true }));
        dispatch(
          setComponentsHistoryStateCurrentIndex(
            componentsHistoryState.currentIndex + 1
          )
        );
      }
    }
  };

  /**
   * Handles the undo action, applying the previous state in the history.
   */
  const handleUndo = () => {
    if (componentsHistoryState.componentsHistory.length > 0) {
      const previousState =
        componentsHistoryState.componentsHistory[componentsHistoryState.currentIndex - 1];
      if (previousState) {
        dispatch(setComponents({ data: previousState, ignoreHistory: true }));
        dispatch(
          setComponentsHistoryStateCurrentIndex(
            componentsHistoryState.currentIndex - 1
          )
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[26%] max-h-screen h-screen overflow-y-scroll p-5 scrollbar-hide select-none scrollbar-thumb-gray-400 dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010] scrollbar-track-gray-200 flex flex-col gap-5"
    >
      <div className="flex justify-between items-center">
        <div
          onClick={handleUndo}
          id="undo"
          className="p-2 rounded-full bg-[#b3b3b344] dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010] hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <FaArrowLeft />
        </div>
        <h1 className="self-center text-3xl font-bold tracking-wide">
          {pageContent?.editor_title}
        </h1>
        <div
          onClick={handleRedo}
          id="redo"
          className="p-2 rounded-full bg-[#b3b3b344] dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010] hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <FaArrowRight />
        </div>
      </div>
      <div>
        {editableComponent && (
          <EditableFields
            editableComponent={editableComponent}
            data={editableComponent}
            register={register}
          />
        )}
      </div>
      {editableComponentKeysData?.editableComponentKey &&
      editableComponentKeysData?.editableGrandParentComponentKey ? (
        <Button type="submit" size="sm" color="primary" variant="shadow">
          {pageContent?.editor_apply_button_text}
        </Button>
      ) : (
        <p
          style={{ textShadow: "0px 0px 20px white" }}
          className="capitalize text-center tracking-wider"
        >
          {pageContent?.editable_component_not_select}
        </p>
      )}
    </form>
  );
}

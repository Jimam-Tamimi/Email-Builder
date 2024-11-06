"use client"

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { ComponentDataType } from "@/types/component";
import EditableFields from "./EditableFields";
import {
  updateComponentEditableFields,
} from "@/redux/slices/componentsSlice";
import { Button } from "@nextui-org/button";
import EditorHeader from "./EditorHeader";
import { useForm } from 'react-hook-form';

/**
 * The `Editor` component provides an interface for editing components in the application.
 * It allows users to view and modify fields of a selected component, as well as apply changes.
 * The component integrates with Redux for state management and supports history functionality.
 *
 * This component is structured to:
 * - Display a header (using `EditorHeader`).
 * - Allow users to edit fields of a component using `EditableFields`.
 * - Use a form submission mechanism to update the component's editable fields.
 *
 * @component
 * @example
 * const pageContent = {
 *   editor_title: "Editor",
 *   editor_apply_button_text: "Apply Changes",
 *   editable_component_not_select: "No component selected"
 * };
 * <Editor pageContent={pageContent} />
 * 
 * @param {Object} props - Component props
 * @param {Object} props.pageContent - Contains data related to the page, such as titles, button text, and messages.
 * @returns {JSX.Element} The rendered editor with form fields and buttons for component editing.
 */
export default function Editor({ pageContent }: { pageContent: any }) {
  const [editableComponent, setEditableComponent] = useState<ComponentDataType>();

  const { register, handleSubmit } = useForm();
  const dispatch = useAppDispatch();

  // Redux state selectors
  const components = useSelector((state: RootState) => state.components.data);
 
  const editableComponentKeysData = useSelector(
    (state: RootState) => state.components.editableComponentKeysData
  );

  /**
   * A recursive function that searches for the editable component in the nested structure of the components.
   * It looks through arrays and nested children to find a component with the matching key.
   *
   * @function
   * @param {any} data - The component data or array of components.
   * @param {string} targetKey - The key of the component to find.
   * @returns {ComponentDataType | undefined} The found editable component or undefined if not found.
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

  /**
   * An effect hook that runs when the component mounts or when the components or editable keys data changes.
   * It looks for the editable component based on the provided keys and sets the state for the editable component.
   *
   * @function
   * @param {void}
   * @returns {void}
   */
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
   * Handles the form submission. It dispatches an action to update the editable fields of the component
   * in the Redux store based on the provided data.
   * 
   * @function
   * @param {any} data - The form data representing the updated fields of the component.
   * @returns {void}
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[26%] max-h-screen h-screen overflow-y-scroll p-5 scrollbar-hide select-none scrollbar-thumb-gray-400 dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010] scrollbar-track-gray-200 flex flex-col gap-5"
    >
      {/* Editor Header: Displays the title and undo/redo buttons */}
      <EditorHeader pageContent={pageContent} />
      
      {/* Editable Fields: Renders fields that can be modified */}
      <div>
        {editableComponent && (
          <EditableFields
            editableComponent={editableComponent}
            data={editableComponent}
            register={register}
          />
        )}
      </div>

      {/* Submit Button: Appears if a component is selected, triggers the form submission */}
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

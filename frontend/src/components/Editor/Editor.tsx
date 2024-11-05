// Editor.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { ComponentDataType } from "@/types/component";
import EditableFields from "./EditableFields";
import {
  setComponents,
  setComponentsHistoryStateCurrentIndex,
  updateComponentEditableField,
  updateComponentEditableFields,
} from "@/redux/slices/componentsSlice";
import { Button } from "@nextui-org/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useForm } from 'react-hook-form';

export default function Editor({ pageContent }: { pageContent: any }) {
  const [editableComponent, setEditableComponent] =
    useState<ComponentDataType>();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    watch,
    formState,
    setValue,
  } = useForm();

  const components = useSelector((state: RootState) => state.components.data);
  const componentsHistoryState = useSelector(
    (state: RootState) => state.components.componentsHistoryState
  );
  const editableComponentKeysData = useSelector(
    (state: RootState) => state.components.editableComponentKeysData
  );

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

  const dispatch = useAppDispatch();

  const onSubmit = async (data: any) => {
    dispatch(
      updateComponentEditableFields({
        productKey: editableComponentKeysData?.editableGrandParentComponentKey,
        componentKey: editableComponentKeysData?.editableComponentKey,
        data,
      })
    );
    // Object.keys(data).forEach((key) => {
    //   const [originalKey] = key.split("__separator__");

    //   dispatch(
    //     updateComponentEditableField({
    //       productKey:
    //         editableComponentKeysData?.editableGrandParentComponentKey,
    //       componentKey: editableComponentKeysData?.editableComponentKey,
    //       updatedKey: originalKey,
    //       newValue: data[key],
    //     })
    //   );
    // });
  };

  useEffect(() => {
    const handleUndoRedo = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "z") {
        document.getElementById("redo")?.style.setProperty("transform", "scale(1.1)");
        setTimeout(() => {
          document.getElementById("redo")?.style.setProperty("transform", "scale(1)");
        }, 300);
        handleRedo();
      }
      if (event.ctrlKey && event.key === "z") {
        document.getElementById("undo")?.style.setProperty("transform", "scale(1.1)");
        setTimeout(() => {
          document.getElementById("undo")?.style.setProperty("transform", "scale(1)");
        }, 300);
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleUndoRedo);
    return () => {
      window.removeEventListener("keydown", handleUndoRedo);
    };
  }, [componentsHistoryState, dispatch]);

  const handleRedo = () => {
    // Redo
    if (
      componentsHistoryState.componentsHistory.length > 0 &&
      componentsHistoryState.currentIndex <
        componentsHistoryState.componentsHistory.length - 1
    ) {
      const nextState =
        componentsHistoryState.componentsHistory[
          componentsHistoryState.currentIndex + 1
        ];
      console.log({ nextState });
      if (nextState) {
        dispatch(
          setComponents({
            data: nextState,
            ignoreHistory: true,
          })
        );
        dispatch(
          setComponentsHistoryStateCurrentIndex(
            componentsHistoryState.currentIndex + 1
          )
        );
      }
    }
  };
  const handleUndo = () => {
    // Undo
    console.log("undo")
    if (componentsHistoryState.componentsHistory.length > 0) {
      const previousState =
        componentsHistoryState.componentsHistory[
          componentsHistoryState.currentIndex - 1
        ];
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
      className="w-[26%] max-h-screen h-screen overflow-y-scroll p-5 scrollbar-hide select-none scrollbar-thumb-gray-400 dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010] scrollbar-track-gray-200 flex flex-col gap-5 "
    >
      <div className="flex justify-between items-center">
        <div onClick={e => handleUndo()} id="undo" className="p-2 rounded-full bg-[#b3b3b344]  dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010]  hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer">
          <FaArrowLeft />
        </div>
        <h1   className="self-center text-3xl font-bold tracking-wide">
          {pageContent?.editor_title}
        </h1>
        <div  onClick={e => handleRedo()} id="redo"  className="p-2 rounded-full bg-[#b3b3b344]  dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010]  hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer">
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

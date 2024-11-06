"use client"

import React, { useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import NProgress from "nprogress";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setComponents,
  setComponentsHistoryStateCurrentIndex,
} from "@/redux/slices/componentsSlice";

/**
 * `EditorHeader` component is the header section of the editor interface,
 * providing navigation functionality such as undo and redo actions, along with
 * displaying the editor's title.
 * 
 * The component interacts with the Redux store to manage and navigate
 * through the history of component states in the editor.
 *
 * The undo and redo buttons allow the user to revert or move forward
 * through the changes made to the editor components. These actions are 
 * accompanied by a loading progress indicator (`NProgress`).
 * 
 * @component
 * @example
 * const pageContent = {
 *   editor_title: "Editor Title",
 *   editor_apply_button_text: "Apply Changes"
 * };
 * <EditorHeader pageContent={pageContent} />
 * 
 * @param {EditorHeaderProps} props - The props for the component.
 * @param {object} props.pageContent - Contains content for the page, including the editor title.
 * @returns {React.Element} A JSX element representing the header, including undo/redo buttons and the title.
 */
type EditorHeaderProps = {
  pageContent: any; // The content to be displayed on the editor, such as the title.
};

/**
 * The `EditorHeader` component displays the title of the editor and allows
 * the user to undo or redo changes made to the component's state.
 * It integrates with the Redux store to manage state history and interact with
 * previous or next editor states.
 * 
 * @function
 * @param {EditorHeaderProps} props - The props for the component.
 * @returns {JSX.Element} The JSX representation of the header, including buttons for undo/redo and the editor title.
 */
const EditorHeader: React.FC<EditorHeaderProps> = ({ pageContent }) => {
  const dispatch = useDispatch();
  
  // Accessing the components history state from Redux store.
  const componentsHistoryState = useSelector(
    (state: RootState) => state.components.componentsHistoryState
  );

  /**
   * Handles the undo operation by reverting to the previous state in the history.
   * If the current history index is greater than 0, it updates the editor state with the previous one.
   * This action also triggers the NProgress loader to indicate a loading state.
   * 
   * @function
   * @returns {void}
   */
  const handleUndo = () => {
    if (
      componentsHistoryState.componentsHistory.length > 0 &&
      componentsHistoryState.currentIndex > 0
    ) {
      const previousState =
        componentsHistoryState.componentsHistory[
          componentsHistoryState.currentIndex - 1
        ];
      if (previousState) {
        NProgress.start(); // Start the progress bar
        dispatch(setComponents({ data: previousState, ignoreHistory: true }));
        dispatch(
          setComponentsHistoryStateCurrentIndex(
            componentsHistoryState.currentIndex - 1
          )
        );
        NProgress.done(); // End the progress bar
      }
    }
  };

  /**
   * Handles the redo operation by moving forward to the next state in the history.
   * If the current history index is less than the length of the history, it updates
   * the editor state with the next state. This action triggers the NProgress loader.
   * 
   * @function
   * @returns {void}
   */
  const handleRedo = () => {
    if (
      componentsHistoryState.componentsHistory.length > 0 &&
      componentsHistoryState.currentIndex <
        componentsHistoryState.componentsHistory.length - 1
    ) {
      const nextState =
        componentsHistoryState.componentsHistory[
          componentsHistoryState.currentIndex + 1
        ];
      if (nextState) {
        NProgress.start(); // Start the progress bar
        dispatch(setComponents({ data: nextState, ignoreHistory: true }));
        dispatch(
          setComponentsHistoryStateCurrentIndex(
            componentsHistoryState.currentIndex + 1
          )
        );
        NProgress.done(); // End the progress bar
      }
    }
  };

  /**
   * Effect to listen for keyboard shortcuts (Ctrl + Z for undo, Ctrl + Shift + Z for redo).
   * The keyboard event listener is added on component mount and removed on component unmount.
   *
   * @function
   * @returns {void}
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

  return (
    <div className="flex justify-between items-center">
      {/* Undo Button */}
      <div
        onClick={handleUndo}
        id="undo"
        className="p-2 rounded-full bg-[#b3b3b344] dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010] hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
      >
        <FaArrowLeft />
      </div>

      {/* Editor Title */}
      <h1 className="self-center text-3xl font-bold tracking-wide">
        {pageContent?.editor_title}
      </h1>

      {/* Redo Button */}
      <div
        onClick={handleRedo}
        id="redo"
        className="p-2 rounded-full bg-[#b3b3b344] dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010] hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
      >
        <FaArrowRight />
      </div>
    </div>
  );
};

export default EditorHeader;

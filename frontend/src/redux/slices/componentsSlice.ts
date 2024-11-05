// src/redux/componentsSlice.ts
import { ComponentDataType } from "@/types/component";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

interface ComponentsState {
  data: ComponentDataType[];
  componentsHistoryState: {
    currentIndex: number;
    componentsHistory: ComponentDataType[][];
  };
  editableComponentKeysData: {
    editableGrandParentComponentKey: string;
    editableComponentKey: string;
  };
}

const initialState: ComponentsState = {
  data: [],
  editableComponentKeysData: {
    editableGrandParentComponentKey: "",
    editableComponentKey: "",
  },
  componentsHistoryState: {
    currentIndex: 0,
    componentsHistory: [[]],
  },
};

const getUpdatedState = (state: ComponentsState) => {
  const { currentIndex, componentsHistory } = state.componentsHistoryState;
  const newHistory = componentsHistory.slice(0, currentIndex + 1);
  newHistory.push(state.data);

  return {
    ...state.componentsHistoryState,
    currentIndex: currentIndex + 1,
    componentsHistory: newHistory,
  };
};

const componentsSlice = createSlice({
  name: "components",
  initialState,

  reducers: {
    setEditableComponentKeys: (
      state,
      action: PayloadAction<{
        editableGrandParentComponentKey: string;
        editableComponentKey: string;
      }>
    ) => {
      state.editableComponentKeysData.editableGrandParentComponentKey =
        action.payload.editableGrandParentComponentKey;
      state.editableComponentKeysData.editableComponentKey =
        action.payload.editableComponentKey;
    },
    setComponentsHistoryStateCurrentIndex: (
      state,
      action: PayloadAction<number>
    ) => {
      state.componentsHistoryState.currentIndex = action.payload;
    },
    addComponent: (state, action: PayloadAction<any>) => {
      action.payload.key = action.payload.key + "." + uuidv4().slice(0, 4);
      state.data.push(action.payload);
      state.componentsHistoryState = getUpdatedState(state);
    },
    updateComponentEditableField: (
      state,
      action: PayloadAction<{
        productKey: string;
        componentKey: string;
        updatedKey: string;
        newValue: string;
      }>
    ) => {
      const { productKey, componentKey, updatedKey, newValue } = action.payload;

      // Find the parent component
      let editedComponent = state.data.find(
        (component) => component.key === productKey
      );
      if (!editedComponent) return;

      // Recursive function to find the child component
      const findChildComponent = (children: any[], key: string): any => {
        for (const child of children) {
          if (child.key === key) return child;
          if (Array.isArray(child.children)) {
            const found = findChildComponent(child.children, key);
            if (found) return found;
          }
        }
        return null;
      };

      // Recursive function to update editable fields
      const updateEditableField = (obj: any, key: string, value: string) => {
        for (const k in obj) {
          if (obj[k] && typeof obj[k] === "object") {
            if (obj[k].editable && k === key) {
              obj[k].value = value;
              return true;
            }
            if (updateEditableField(obj[k], key, value)) {
              return true;
            }
          }
        }
        return false;
      };

      if (productKey !== componentKey) {
        // Find the child component
        if (Array.isArray(editedComponent.children)) {
          editedComponent = findChildComponent(
            editedComponent.children,
            componentKey
          );
        }
        if (!editedComponent) return;
      }

      // Update the specified field
      updateEditableField(editedComponent, updatedKey, newValue);
      state.componentsHistoryState = getUpdatedState(state);
    },
    updateComponentEditableFields: (
      state,
      action: PayloadAction<{
        productKey: string;
        componentKey: string;
        data: any;
      }>
    ) => {
      const { productKey, componentKey, data } = action.payload;

      // Find the parent component
      Object.keys(data).forEach((key) => {
        const [updatedKey] = key.split("__separator__");
        let newValue = data[key];

        let editedComponent = state.data.find(
          (component) => component.key === productKey
        );
        if (!editedComponent) return;

        // Recursive function to find the child component
        const findChildComponent = (children: any[], key: string): any => {
          for (const child of children) {
            if (child.key === key) return child;
            if (Array.isArray(child.children)) {
              const found = findChildComponent(child.children, key);
              if (found) return found;
            }
          }
          return null;
        };

        // Recursive function to update editable fields
        const updateEditableField = (obj: any, key: string, value: string) => {
          for (const k in obj) {
            if (obj[k] && typeof obj[k] === "object") {
              if (obj[k].editable && k === key) {
                obj[k].value = value;
                return true;
              }
              if (updateEditableField(obj[k], key, value)) {
                return true;
              }
            }
          }
          return false;
        };

        if (productKey !== componentKey) {
          // Find the child component
          if (Array.isArray(editedComponent.children)) {
            editedComponent = findChildComponent(
              editedComponent.children,
              componentKey
            );
          }
          if (!editedComponent) return;
        }

        // Update the specified field
        updateEditableField(editedComponent, updatedKey, newValue);
      });

      state.componentsHistoryState = getUpdatedState(state);
    },
    setComponents: (state, action: PayloadAction<{data:ComponentDataType[],  ignoreHistory?:boolean}>) => {
      state.data = action.payload.data;
      if(!action.payload.ignoreHistory){
        state.componentsHistoryState = getUpdatedState(state);
      }
    },
    updateComponent: (
      state,
      action: PayloadAction<{ key: string; newData: any }>
    ) => {
      const newData = action.payload;
      const index = state.data.findIndex(
        (component) => component.key === newData.key
      );
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...newData };
      }
    },
    removeComponent: (state, action: PayloadAction<number>) => {
      state.data.splice(action.payload, 1);
      state.componentsHistoryState = getUpdatedState(state);
    },
    clearComponents: (state) => {
      state.data = [];
      state.componentsHistoryState = getUpdatedState(state);
    },
  },
});

export const {
  setComponents,
  addComponent,
  removeComponent,
  clearComponents,
  setEditableComponentKeys,
  updateComponentEditableField,
  updateComponentEditableFields,
  setComponentsHistoryStateCurrentIndex,
} = componentsSlice.actions;
export default componentsSlice.reducer;

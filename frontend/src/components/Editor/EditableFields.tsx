"use client";

import React from "react";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { ComponentDataType } from "@/types/component";
import { v4 as uuidv4 } from "uuid";

/**
 * `EditableFields` is a recursive component that renders editable fields based on the structure of the provided `data` object.
 * It handles the display of fields with the `editable` property, including form inputs and select options.
 * It also supports nested data structures, recursively rendering child components if the `data` contains nested objects.
 *
 * @component
 *
 * @param {Object} props - The props passed to the component.
 * @param {ComponentDataType | ComponentDataType[]} props.data - The component data, which can be an object or an array of component data.
 *   - If the data is an array, it will render the fields for each component in the array.
 * @param {number} [props.depth=0] - The current depth in the recursive structure. This value is used to adjust the styling and indentation of nested components.
 * @param {Object} props.register - The function used for form registration (typically from `react-hook-form`). It binds the form fields to the component.
 * @param {ComponentDataType | undefined} props.editableComponent - The current editable component data. This is used for keeping track of which component is being edited.
 *
 * @returns {JSX.Element | null} The rendered form fields based on the provided `data`. It returns `null` if there is no `data`.
 *
 * @example
 * <EditableFields
 *   data={componentData}
 *   register={register}
 *   editableComponent={editableComponent}
 * />
 */

/**
 * The props interface for `EditableFields` component.
 *
 * @interface EditableFieldsProps
 *
 * @param {ComponentDataType | ComponentDataType[]} data - The component data, which can be a single object or an array of objects.
 *   - The `data` can represent one or more components that contain editable fields.
 * @param {number} [depth=0] - The depth level of the component in the recursive structure. Used to adjust styles for nested components.
 * @param {Object} register - The form registration function (from `react-hook-form`), used to bind input fields to the form state.
 * @param {ComponentDataType | undefined} editableComponent - The editable component data, which tracks the currently being edited component. Helps in identifying which component is being edited.
 */
interface EditableFieldsProps {
  data: ComponentDataType | ComponentDataType[]; // Component data which can be an object or an array
  depth?: number; // Depth of recursion for nested components, defaults to 0
  register: any; // Register function from react-hook-form
  editableComponent: ComponentDataType | undefined; // The currently editable component
}

const EditableFields: React.FC<EditableFieldsProps> = ({
  data,
  depth = 0,
  register,
  editableComponent,
}) => {
  // If no data is provided, return null
  if (!data) return null;

  return (
    <>
      {/* Render the label of the current component if it's not an array */}
      {!Array.isArray(data) && data?.label && (
        <h4
          style={{
            fontSize: 19 - 1 * depth, // Decrease font size as depth increases
            marginTop: 20,
            textShadow: "0px 0px 5px white", // Add text shadow for better readability
          }}
        >
          {data.label} {/* Display the label of the component */}
        </h4>
      )}

      {/* Iterate through each entry in the data object */}
      {Object.entries(data).map(([key, field], i) => {
        // If the field is editable, render an input or select
        if (field?.editable) {
          return (
            <div key={i} className="my-2 ">
              {/* Render an Input field for editable fields */}
              {
                
                field?.options ? (
                  <Select 
                  {...register(`${key}__separator__${uuidv4().slice(0, 4)}`)} // Register input field for react-hook-form
                  key={field.value} // Ensure uniqueness by using value as key

                  classNames={{
                    listboxWrapper: "dark:bg-[#18181b] shadow-sm bg-[#ffffff]  border-t-0",
                  }}
                  label={field.label} // Label for the input field
                  defaultSelectedKeys={[field.value]} variant={"underlined"} >
                    
                    {field?.options.map((option:any) => (
                      <SelectItem  key={option}>{option}</SelectItem>
                    ))}
                  </Select>
                ) : (
                  <Input
                  {...register(`${key}__separator__${uuidv4().slice(0, 4)}`)} // Register input field for react-hook-form
                  key={field.value} // Ensure uniqueness by using value as key
                  required // Make the field required
                  type={field.type ? field.type : "text"} // Set input type based on field type or default to "text"
                  variant="underlined" // Use underlined variant for the input
                  defaultValue={field.value} // Set the default value from the field data
                  label={field.label} // Label for the input field
                />
                )
                
                
              } 
            </div>
          );
        }

        // If the field is a nested object, recursively render the EditableFields component
        else if (typeof field === "object" && !Array.isArray(field)) {
          return (
            <div
              key={key}
              className={`${
                depth > 0 ? "border-l-[1px] ml-2 border-[#73a2ff33] pl-2" : "" // Indentation and border for nested elements
              }`}
            >
              <EditableFields
                editableComponent={editableComponent} // Pass the editable component to child components
                data={field} // Pass nested field data to the child EditableFields component
                depth={depth + 1} // Increment depth for nested components
                register={register} // Pass register function for form handling
              />
            </div>
          );
        }

        return null; // If no editable field and not a nested object, return null
      })}
    </>
  );
};

export default EditableFields;

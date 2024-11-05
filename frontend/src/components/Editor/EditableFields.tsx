"use client";

import React from "react";
import { Input } from "@nextui-org/input";
import { ComponentDataType } from "@/types/component";
import { v4 as uuidv4 } from "uuid";

interface EditableFieldsProps {
  data: ComponentDataType | ComponentDataType[];
  depth?: number;
  register: any; 
  editableComponent: ComponentDataType | undefined;
}

const EditableFields: React.FC<EditableFieldsProps> = ({
  data,
  depth = 0,
  register,
  editableComponent,
}) => {
  if (!data) return null;
  return (
    <>
      {!Array.isArray(data) && data?.label && (
        <h4
          style={{
            fontSize: 19 - 1 * depth,
            marginTop: 20,
            textShadow: "0px 0px 5px white",
          }}
        >
          {data.label}
        </h4>
      )}
      {Object.entries(data).map(([key, field], i) => {
        if (field?.editable) {
          return (
            <div 
            key={i}
            
            className="my-2">
              <Input  
              
              {...register(`${key}__separator__${uuidv4().slice(0, 4)}`)} // Add appropriate props as
              key={field.value}
              required
              type={field.type? field.type : "text"}
              variant="underlined"
              
                defaultValue={field.value}
                label={field.label}
              />
              {field?.options && (
                <select defaultValue={field.value} className="my-2">
                  {field.options.map((option: any) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        } 
         else if (typeof field === "object" && !Array.isArray(field)) {
          return (
            <div
              key={key}
              className={`${
                depth > 0 ? "border-l-[1px] ml-2 border-[#73a2ff33] pl-2" : ""
              }`}
            >
              <EditableFields
                editableComponent={editableComponent}
                data={field}
                depth={depth + 1}
                register={register}
              />
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default EditableFields;

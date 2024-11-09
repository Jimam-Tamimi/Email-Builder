import { ComponentDataType } from "./component";

export interface TemplateType {
    id?: number; // Read-only field, optional when creating a new template
    title: string;
    description: string;
    creator?: number; // Read-only field, optional when creating a new template
    data: ComponentDataType[]; // Assuming 'data' is a JSON object, can also define it more specifically if you know the structure
    created_at?: string; // Read-only field, ISO date string
    updated_at?: string; // Read-only field, ISO date string
  }
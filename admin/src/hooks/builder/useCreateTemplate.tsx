import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/redux/store";
import api from "@/api/api";
import NProgress from "nprogress";
import { clearComponents } from "@/redux/slices/componentsSlice";
import { TemplateType } from "@/types/builder";
export interface TemplateFormDataType {
  title: string;
  description: string;
  data: any; // Adjust the type based on the structure of your JSON data
}

/**
 * Custom hook for handling template creation using a mutation.
 *
 * This hook utilizes the `useMutation` hook to manage the template creation process,
 * including dispatching actions to update the application state and showing
 * notifications based on the mutation's lifecycle events.
 *
 * @returns {MutationResult} The result of the mutation, including methods to trigger the mutation and its current state.
 *
 * @example
 * const { mutate, isLoading, isError, data } = useCreateTemplate();
 *
 * // Trigger the template creation mutation
 * mutate(templateData);
 *
 * @remarks
 * This hook dispatches actions to update the loading state, handle success and error scenarios,
 * and reset the loading state once the mutation is settled.
 *
 * @see {@link useMutation} for more details on the mutation hook.
 */
export const useCreateTemplate = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTemplate,
    onSuccess: (newData) => {
      queryClient.setQueryData(["templatesInfinite"], (oldData: TemplateType[]) => {
        const updatedData = {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              results: [newData, ...oldData.pages[0].results]
            },
            ...oldData.pages.slice(1)
          ]
        };
        updatedData.pages[0].count += 1;
        console.log(oldData)
        
        return updatedData;
        // return { ...oldData, pages: {0: results: [newData, ...oldData.results]} };
      });
    },
    onError: async () => {
    },
  });
};

export default useCreateTemplate;







/**
 * Asynchronously creates a new template with the provided data.
 * 
 * This function starts a progress indicator, sends a POST request to the 
 * "/templates/" endpoint with the provided template data, and returns the 
 * response data. If an error occurs during the request, it logs the error 
 * and rethrows it. The progress indicator is stopped regardless of the 
 * request outcome.
 * 
 * @param {TemplateFormDataType} data - The template form data to be sent in the request.
 * @returns {Promise<any>} The response data from the template creation request.
 * @throws Will throw an error if the template creation request fails.
 */
export const createTemplate = async (data: TemplateFormDataType) => {
  NProgress.start();
  try {
    const response = await api.post("/builder/templates/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating template:", error);
    throw error;
  } finally {
    NProgress.done();
  }
};
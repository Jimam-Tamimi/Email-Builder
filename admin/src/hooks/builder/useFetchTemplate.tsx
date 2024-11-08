import api from '@/api/api';
import { TemplateType } from '@/types/builder';
import { useQuery } from '@tanstack/react-query';
import NProgress from 'nprogress';
 
/**
 * Custom hook for fetching a single template by its ID.
 *
 * This hook utilizes the `useQuery` hook to manage the template fetch process,
 * including caching and background updates.
 *
 * @param {string} id - The ID of the template to fetch.
 * @returns {QueryResult} The result of the query, including the template data and query state.
 *
 * @example
 * const { data, isLoading, isError } = useFetchTemplate(templateId);
 *
 * @see {@link useQuery} for more details on the query hook.
 */
export const useFetchTemplate = (id: string) => {
  return useQuery<TemplateType, Error>({
    queryKey: ["templatesInfinite", id],
    queryFn: () => fetchTemplate(id)
  });
};


 

/**
 * Fetches a single template by its ID.
 * 
 * This function starts a progress indicator, sends a GET request to the 
 * "/builder/templates/{id}/" endpoint, and returns the response data.
 * 
 * @param {string} id - The ID of the template to fetch.
 * @returns {Promise<TemplateFormDataType>} The response data from the template fetch request.
 * @throws Will throw an error if the template fetch request fails.
 */
export const fetchTemplate = async (id: string): Promise<TemplateType> => {
  NProgress.start();
  try {
    const response = await api.get(`/builder/templates/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw error;
  } finally {
    NProgress.done();
  }
};
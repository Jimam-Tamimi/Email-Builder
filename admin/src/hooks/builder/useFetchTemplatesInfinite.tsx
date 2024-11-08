import api from "@/api/api";
import { TemplateType } from "@/types/builder";
import { useInfiniteQuery } from "@tanstack/react-query";
import NProgress from 'nprogress';

// A generic paginated response type to support different data types
export type PaginatedResponse<T> = {
    count: number;           // Total count of items
    total_pages: number;     // Total number of pages
    next: string | null;     // URL of the next page, or null if there is none
    previous: string | null; // URL of the previous page, or null if there is none
    results: T[];            // Array of items for the current page
  };
  

/**
 * Fetches paginated templates.
 *
 * @param {number} page - The page number to fetch.
 * @param {number} pageSize - The number of templates per page.
 * @returns {Promise<PaginatedResponse<TemplateType>>} The paginated response from the API.
 */
export const fetchTemplates = async (
  page: number = 1,
  page_size: number = 2
): Promise<PaginatedResponse<TemplateType>> => {
  NProgress.start();
  try {
    const response = await api.get("/builder/templates/", {
      params: { page, page_size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  } finally {
    NProgress.done();
  }
};

/**
 * Custom hook for fetching templates with infinite scrolling.
 *
 * This hook uses `useInfiniteQuery` to fetch and load more templates.
 *
 * @returns {InfiniteQueryObserverResult} The result of the infinite query, including the pages of templates.
 */
export const useFetchTemplatesInfinite = (page_size: number = 10) => {
  return useInfiniteQuery<PaginatedResponse<TemplateType>, Error>({
    queryKey: ["templatesInfinite"],
    queryFn: ({ pageParam = 1 }) => fetchTemplates(pageParam as number, page_size),
    getNextPageParam: (lastPage) => {
      return  lastPage.next ||  null;
    },
    initialPageParam: 1,
  });
};

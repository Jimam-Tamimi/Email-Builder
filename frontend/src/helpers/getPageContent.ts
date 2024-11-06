'use server'

import axios from "axios";
import { getLocale } from "next-intl/server";
import { cache } from "react";

/**
 * `getPageContent` is an asynchronous function that retrieves content from a remote server for a specified page
 * and locale. It fetches the content as JSON from a URL that is constructed using the base URL from the environment 
 * variables, and the provided `locale` and `page` parameters.
 * 
 * This function utilizes the `next-intl` library to get the current locale if none is provided, and it caches the 
 * result to optimize repeated fetches for the same page and locale. This ensures that the content is only fetched
 * once per page and locale combination.
 * 
 * **Important Notes:**
 * - The content is expected to be in JSON format.
 * - The server-side function is marked with `"use server"`, indicating it is executed on the server in Next.js.
 * 
 * @param {string} page - The page name (e.g., `"home"`, `"about"`) for which the content needs to be fetched.
 * @param {string} [locale] - The locale identifier (e.g., `"en"`, `"fr"`, `"de"`) for the content to be fetched.
 *                     If not provided, the function will automatically resolve the locale using `next-intl`.
 * 
 * @returns {Promise<any>} A promise that resolves to the fetched content (as JSON) for the specified page and locale.
 *                         If the content is not found or an error occurs, an empty object is returned.
 * 
 * @example
 * const content = await getPageContent("home", "en");
 * console.log(content); // Output: { title: "Welcome", body: "Hello world!" }
 * 
 * @example
 * // If locale is not provided, it will fallback to the default locale using next-intl.
 * const content = await getPageContent("about");
 * console.log(content); // Output: { title: "About Us", body: "Our mission..." }
 */
const getPageContent = cache(async (page: string, locale?: string): Promise<any> => {
  // If no locale is provided, get the default locale from next-intl
  if (!locale) {
    locale = await getLocale();
  }

  try {
    // Construct the URL for fetching content based on page and locale
    const response = await axios.get(`${process?.env?.NEXT_PUBLIC_BASE_URL}/content/${locale}/${page}.json`);

    // Return the fetched content
    return response.data;
  } catch (error) {
    // If an error occurs during fetching, the error is silently ignored and an empty object is returned
    // In production, it might be useful to log this error or provide fallback content
    // throw error;
  } finally {
    // Optionally handle clean-up or final steps, but nothing is required here
  }

  // If no content is retrieved or there was an error, return an empty object
  return {};
});

export default getPageContent;

import { ThemeProvider } from "next-themes";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ReduxProvider from "@/hoc/ReduxProvider";
import QueryClientProvider from "@/hoc/QueryClientProvider";
import "nprogress/nprogress.css";
import getPageContent from "@/helpers/getPageContent";
import { MdOutlineClose } from "react-icons/md";
import { NextUIProvider } from "@/hoc/NextUiProvider";
import { routing } from "@/i18n/routing";
import AnonymousUserEmailBuilder from "./auth/components/AnonymousUserEmailBuilder";
import { WebSocketProvider } from "@/context/WebSocketContext";
import ProtectedComponent from "@/hoc/auth/ProtectedComponent";
import AnonymousComponent from "@/hoc/auth/AnonymousComponent";
import Builder from "@/components/Builder/Builder";

/**
 * `Layout` component for the application. This component is responsible for wrapping
 * the main content of the application with necessary providers and context.
 * It includes setup for i18n (internationalization), theme management, Redux, React Query,
 * Toast notifications, and other global settings like CSS styles.
 *
 * The component also supports metadata generation for SEO, using content fetched
 * based on the current locale.
 *
 * @module Layout
 * @example
 * // Example usage of the Layout component
 * <Layout>
 *   <YourComponent />
 * </Layout>
 *
 * @param {React.ReactNode} children - The child components passed into the layout.
 * The content of the page that will be rendered inside the layout.
 */

/**
 * This function is responsible for generating the metadata for the page.
 * It dynamically fetches the page content (like meta title and description) based on the locale.
 * This is useful for SEO purposes, ensuring each page has proper meta tags based on the locale.
 *
 * @param {object} params - The parameters passed to the metadata generation function.
 * @param {string} params.locale - The current locale of the page (e.g., 'en', 'de').
 * @returns {object} The metadata for the page, including title and description.
 *
 * @example
 * generateMetadata({ params: { locale: 'en' } })
 *   .then(metadata => console.log(metadata)); // { title: 'Page Title', description: 'Page Description' }
 */
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  let pageContent: any = await getPageContent("index", locale);

  return {
    title: pageContent?.meta_title || "",
    description: pageContent?.meta_description,
  };
}

/**
 * Main layout component that wraps the application with various providers and context.
 * It provides:
 * - Internationalization (i18n) using `next-intl`
 * - Theme management with `next-themes`
 * - Redux state management
 * - React Query client context
 * - Toast notifications with `react-toastify`
 * - Global styles and meta tags.
 *
 * The layout applies a dark/light theme, sets up routing and internationalization context,
 * and provides all necessary hooks and settings for the app to function correctly.
 *
 * @param {object} props - The props passed to the layout component.
 * @param {React.ReactNode} props.children - The content of the page wrapped inside the layout.
 * @returns {JSX.Element} The layout component, including all context providers and global settings.
 *
 * @example
 * <Layout>
 *   <YourPageContent />
 * </Layout>
 */
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body
        className={`antialiased text-black bg-white dark:text-white dark:bg-black`}
      >
        {/* Redux provider for global state management */}
        <ReduxProvider>
          {/* i18n provider for message translations */}
          <NextIntlClientProvider messages={messages}>
            {/* Theme provider for handling light/dark themes */}
            <ThemeProvider
              attribute="class" // Use class-based strategy for theme
              defaultTheme="dark" // Default to dark theme on first visit
              enableSystem={false} // Disable system theme preference
            >
              {/* Toast container for displaying notifications */}
              <ToastContainer
                toastClassName={
                  "dark:!shadow-[0_0px_15px_#ffffff20] !shadow-[0_0px_15px_#00000090] backdrop-blur-[15px] bg-[#d1e2ff47] dark:bg-[rgba(255,255,255,0.1)] dark:text-white text-black"
                }
                closeButton={<MdOutlineClose size={20} />}
                closeOnClick
                pauseOnHover
                draggable
              />
              {/* Next UI provider for styling and UI components */}
              <NextUIProvider>
                {/* Query client provider for React Query setup */}
                <QueryClientProvider>
                  {/* Render the children components */}

                  <WebSocketProvider>
                    <AnonymousComponent>
                      <Builder />
                    </AnonymousComponent>
                    <ProtectedComponent>{children}</ProtectedComponent>
                  </WebSocketProvider>
                </QueryClientProvider>
              </NextUIProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

/**
 * This function generates static params for each locale.
 * It is used to generate localized pages for each supported locale in the app.
 *
 * @returns {Array} An array of objects, each containing a locale.
 * Each object represents a localized version of the page.
 *
 * @example
 * generateStaticParams(); // [{ locale: 'en' }, { locale: 'de' }, { locale: 'bn' }, { locale: 'ru' }]
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

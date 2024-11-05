import { ThemeProvider } from "next-themes";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import "react-toastify/dist/ReactToastify.css";
import {  ToastContainer } from "react-toastify";
import ReduxProvider from "@/hoc/ReduxProvider";
import QueryClientProvider from "@/hoc/QueryClientProvider";
import "nprogress/nprogress.css";

export async function generateMetadata({params: {locale: locale}}: {params: {locale: string}}) {

    let pageContent = {
      meta_title: "",
      meta_description: "",
    }
  try {
    
    pageContent = await getPageContent("index", locale)
  } catch (error) {
    
  }

  return {
    title: pageContent?.meta_title || "",
    description: pageContent?.meta_description,
  };
}

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
        <ReduxProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class" // Use the class-based strategy for light/dark themes
              defaultTheme="dark" // Start with system preference theme on first visit
              enableSystem={false} // Enable system theme preference
            >
              <ToastContainer
                toastClassName={
                  "   dark:!shadow-[0_0px_15px_#ffffff20] !shadow-[0_0px_15px_#00000090] backdrop-blur-[15px] bg-[#d1e2ff47] dark:bg-[rgba(255,255,255,0.1)] dark:text-white text-black"
                }
                closeButton={<MdOutlineClose size={20} />}
                closeOnClick
                pauseOnHover
                draggable
              />
              <NextUIProvider>
                <QueryClientProvider>
                  {/* check if user is authenticated. if not then show welcome else render children */}
                  {/* <Welcome /> */}
                  
                  {children}
                </QueryClientProvider>
              </NextUIProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

import { routing } from "@/i18n/routing";
import { NextUIProvider } from "@/hoc/NextUiProvider";
import getPageContent from "@/helpers/getPageContent";
import { MdOutlineClose } from "react-icons/md";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

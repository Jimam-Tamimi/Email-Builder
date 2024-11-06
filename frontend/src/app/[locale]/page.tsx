import Canvas from "@/components/Canvas";
import Editor from "@/components/Editor";
import Sidebar from "@/components/Sidebar";
import getPageContent from "@/helpers/getPageContent";

/**
 * The main entry point for the Index page.
 *
 * This component is responsible for rendering the entire page layout which includes the `Sidebar`, `Canvas`, and `Editor` components.
 * It dynamically fetches the content for the page based on the locale, and then displays it in the appropriate layout.
 * Additionally, a loading screen is displayed for 1 second to simulate loading (this should be removed in production).
 * 
 * @component
 * 
 * @param {Object} props - The props passed to the component.
 * @param {Object} props.params - The dynamic route parameters.
 * @param {string} props.params.locale - The current locale for the page, used to fetch localized content.
 * 
 * @returns {JSX.Element} The rendered page with a `Sidebar`, `Canvas`, and `Editor`.
 */
export default async function IndexPage({params: {locale: locale}}: {params: {locale: string}}) {

  // Fetches the page content based on the provided locale
  let pageContent = await getPageContent("index", locale)
  
  // Simulates a loading delay of 1 second (for loading screen, remove in production)
  await new Promise((resolve) => setTimeout(resolve, 1000)); 

  return (
    <div className="flex justify-between fixed w-screen h-screen ">
        {/* Sidebar component displaying the page content */}
        <Sidebar pageContent={pageContent}/>
        
        {/* Canvas component displaying the main content area */}
        <Canvas pageContent={pageContent}/>
        
        {/* Editor component for editing content */}
        <Editor pageContent={pageContent}/>
    </div>
  )
}

/**
 * Forces dynamic rendering of this page, meaning that the page will not be statically generated.
 * This is particularly useful for pages that require server-side data fetching at runtime.
 * 
 * @constant {string} dynamic - The directive to force dynamic rendering of the page.
 */
export const dynamic = 'force-dynamic';

"use client"
import Canvas from "@/components/Builder/Canvas";
import Editor from "@/components/Builder/Editor";
import Sidebar from "@/components/Builder/Sidebar";
import { useWebSocket } from "@/context/WebSocketContext";
import getPageContent from "@/helpers/getPageContent";
import { useFetchTemplate } from "@/hooks/builder/useFetchTemplate";
import { setComponents } from "@/redux/slices/componentsSlice";
import { RootState, useAppDispatch } from "@/redux/store";
import { useLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

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
export default  function Builder({id}: {id?: string}) {

  // Fetches the page content based on the provided locale
  const locale =   useLocale();
  const [pageContent, setPageContent] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const content = await getPageContent('index', locale);
      setPageContent(content);
    }
    fetchData();
  
    return () => {
      
    }
  }, [])

  const  auth = useSelector((state: RootState) => state.auth.data);
  const dispatch = useAppDispatch()

  const fetchTemplate = useFetchTemplate(id || '');
  
  const { socket } = useWebSocket();
  
  const components = useSelector((state: RootState) => state.components?.data);

  
  
  
  useEffect(() => {
    if(auth?.access && fetchTemplate?.data){
      dispatch(setComponents({
        data: fetchTemplate.data.data
      }))
    } else {
      const templateData = localStorage.getItem("templateData");
      if(templateData) {
        dispatch(setComponents({
          data: JSON.parse(templateData)
        }))
      }
    }
  
    return () => {
      
    };
  }, [fetchTemplate.data, id, auth, dispatch ])

 


  
  
  
  // Simulates a loading delay of 1 second (for loading screen, remove in production)

  return (
    <div className="flex justify-between fixed w-screen h-screen ">
        {/* Sidebar component displaying the page content */}
        <Sidebar pageContent={pageContent}/>
        
        {/* Canvas component displaying the main content area */}
        <Canvas id={id} pageContent={pageContent}/>
        
        {/* Editor component for editing content */}
        <Editor id={id} pageContent={pageContent}/>
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

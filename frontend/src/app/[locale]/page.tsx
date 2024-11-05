import Canvas from "@/components/Canvas";
import Editor from "@/components/Editor";
import Sidebar from "@/components/Sidebar";
import getPageContent from "@/helpers/getPageContent";

export default async function IndexPage({params: {locale: locale}}: {params: {locale: string}}) {

  let pageContent = {}
  try {
    
    pageContent = await getPageContent("index", locale)
  } catch (error) {
    
  }
 
  return (
    <div className="flex justify-between  fixed w-screen h-screen ">
        <Sidebar pageContent={pageContent}/>
        <Canvas pageContent={pageContent}/>
        <Editor pageContent={pageContent}/>
    </div>
  )
}
export const dynamic = 'force-dynamic';

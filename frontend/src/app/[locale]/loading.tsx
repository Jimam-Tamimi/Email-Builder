import PreLoader from "@/components/PreLoader";

 

export default function loading() {

  return (
    <div className="flex backdrop-blur-sm   justify-center items-center min-h-screen w-screen *:text-4xl">
        <PreLoader   />
    </div>
  );
}

'use client'

import React, {  Key, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import {useLocale } from 'next-intl'; 
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
 

export interface LanguageType {
    id: Number,
    // image: string,
    language: string,
    locale: string,
}




export default function SelectLanguage() {
    const locale = useLocale();
    const router = useRouter();
    const params = useParams();

    const pathname = usePathname();
    const [open, setOpen] = useState<Boolean>(false)
     const [languages, setLanguages] = useState<LanguageType[]>([
        {id:1, language:"English", locale: "en"},
        {id:2, language:"Russian", locale: "ru"},
        {id:3, language:"Bangla", locale: "bn"},
        {id:4, language:"German", locale: "de"},
    ])

    return (
        <>
            <div className="relative flex flex-col items-end justify-start select-none z-40 font-semibold  left-2 md:left-0">
                <div onClick={() => { setOpen(prevState => !prevState); }} className="flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 hover:scale-105 hover:text-yellow ">

                    {
                        languages?.map((l, i) => (
                            l.locale == locale ? <p key={i}>{l.language}</p> : ''
                        ))
                    }

                    <div className="relative  ">
                        {/* <Image width={10} height={13} src="/icons/Down-Arrow.svg" alt="Down Arrow" /> */}
                        <FaAngleDown  className="transition-all hover:scale-105 hover:text-yellow" />
                    </div>
                </div>
                <div className={`flex flex-col justify-center top-7 items-center dark:shadow-[0_0px_5px_#ffffff20]    shadow-[0_0px_5px_#00000010]  backdrop-blur-[10px]   bg-[rgba(255,255,255,0.05)]  absolute w-max      rounded-md transition-all duration-300 origin-top-right ease-in-out ${open ? 'scale-1 opacity-100' : 'scale-0 opacity-0'}`}>
                    {
                        languages?.map((language: LanguageType, i: Key) => (
                            <div className=" " onClick={e => { 
                        
                            }}  key={i}>
                                <div key={i} onClick={e => {
                                    router.replace({ pathname: pathname }, { locale: language.locale });

                                }} className="text-sm tracking-wide space-x-1.5 cursor-pointer  flex justify-start items-start   p-2.5   transition-all duration-300" >
                                    {/* <Image width={15} height={20} alt={`${language?.language} Flag`} src={language?.image as string} /> */}
                                    <p className="">{language?.language.toUpperCase()}</p>
                                </div>
                                {
                                    (i) != languages?.length - 1 &&
                                    <hr className="w-full" />
                                }
                            </div>
                        ))
                    }


                </div>
            </div>
        </>
    );
}

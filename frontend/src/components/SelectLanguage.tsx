'use client'

import React, { Key, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { useLocale } from 'next-intl';
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";

/**
 * `SelectLanguage` is a component that provides a dropdown for selecting different languages.
 * It displays the current language in use and allows the user to select another language 
 * from a list of predefined languages.
 * The selected language is then used to change the locale of the page dynamically.
 * 
 * The component integrates with `next-intl` for locale management and uses `react-icons` for the dropdown arrow icon.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered dropdown for selecting languages.
 * 
 * @example
 * <SelectLanguage />
 */

// LanguageType interface defines the structure for each language in the list.
export interface LanguageType {
    id: Number;               // Unique identifier for the language
    language: string;         // Name of the language
    locale: string;           // Locale code associated with the language
}

export default function SelectLanguage() {
    const locale = useLocale();        // Get the current locale using `next-intl`
    const router = useRouter();        // Router instance to navigate between routes
    const pathname = usePathname();    // Current pathname, to maintain navigation after language change
    const [open, setOpen] = useState<Boolean>(false);  // State to toggle the dropdown open/close
    const [languages, setLanguages] = useState<LanguageType[]>([
        { id: 1, language: "English", locale: "en" },
        { id: 2, language: "Russian", locale: "ru" },
        { id: 3, language: "Bangla", locale: "bn" },
        { id: 4, language: "German", locale: "de" },
    ]);  // List of available languages

    return (
        <>
            <div className="relative flex flex-col items-end justify-start select-none z-40 font-semibold left-2 md:left-0">
                {/* Language selection display */}
                <div onClick={() => { setOpen(prevState => !prevState); }} className="flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 hover:scale-105 hover:text-yellow ">
                    {/* Display current selected language */}
                    {
                        languages?.map((l, i) => (
                            l.locale === locale ? <p key={i}>{l.language}</p> : ''
                        ))
                    }
                    <div className="relative">
                        {/* Dropdown arrow icon */}
                        <FaAngleDown className="transition-all hover:scale-105 hover:text-yellow" />
                    </div>
                </div>

                {/* Language options dropdown */}
                <div className={`flex flex-col justify-center top-7 items-center dark:shadow-[0_0px_5px_#ffffff20] shadow-[0_0px_5px_#00000010] backdrop-blur-[10px] bg-[rgba(255,255,255,0.05)] absolute w-max rounded-md transition-all duration-300 origin-top-right ease-in-out ${open ? 'scale-1 opacity-100' : 'scale-0 opacity-0'}`}>
                    {
                        languages?.map((language: LanguageType, i: Key) => (
                            <div className=" " onClick={e => { }} key={i}>
                                <div onClick={e => {
                                    // Change the route with the selected locale
                                    router.replace({ pathname: pathname }, { locale: language.locale });
                                }} className="text-sm tracking-wide space-x-1.5 cursor-pointer flex justify-start items-start p-2.5 transition-all duration-300">
                                    <p className="">{language?.language.toUpperCase()}</p>
                                </div>
                                {/* Divider between language options */}
                                {
                                    i !== languages?.length - 1 && <hr className="w-full" />
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
}

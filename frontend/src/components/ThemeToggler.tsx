"use client"

import React, { useEffect, useState } from 'react'
import { BsMoonStars } from 'react-icons/bs'
import { LuSunMoon } from 'react-icons/lu'
import { useTheme } from "next-themes";

export default function ThemeToggler() {
    const { systemTheme, theme, setTheme } = useTheme();
   
 

    return (

        <div className="relative *:absolute flex justify-end items-center *:text-xl *:md:text-2xl *:cursor-pointer *:transition-all *:duration-300">

            <LuSunMoon className={` dark:scale-0 dark:invisible scale-100 visible `} onClick={e => setTheme('dark')} />
            <BsMoonStars className={` dark:scale-95 dark:visible scale-0 invisible:`} onClick={e => setTheme("light")} />

        </div>
    )
}

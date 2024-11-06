"use client"

import React from 'react'
import { BsMoonStars } from 'react-icons/bs'
import { LuSunMoon } from 'react-icons/lu'
import { useTheme } from "next-themes";



/**
 * `ThemeToggler` is a component that allows users to toggle between light and dark themes.
 * It uses the `next-themes` library to manage the theme and provides a user interface
 * with icons to switch between light and dark modes.
 * 
 * The component renders a sun icon when the theme is in dark mode and a moon icon when
 * in light mode. When the user clicks on the respective icon, the theme is toggled.
 * 
 * The component utilizes the `LuSunMoon` and `BsMoonStars` icons from `react-icons` to
 * represent the theme states.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered theme toggler component with two icons representing light and dark modes.
 * 
 * @example
 * <ThemeToggler />
 */

export default function ThemeToggler() {
    const { setTheme } = useTheme(); // `setTheme` function from `next-themes` to change the theme
   

    return (

        <div className="relative *:absolute flex justify-end items-center *:text-xl *:md:text-2xl *:cursor-pointer *:transition-all *:duration-300">
            
            {/* Sun icon for dark mode */}
            <LuSunMoon className={` dark:scale-0 dark:invisible scale-100 visible `} onClick={e => setTheme('dark')} />

            {/* Moon icon for light mode */}
            <BsMoonStars className={` dark:scale-95 dark:visible scale-0 invisible:`} onClick={e => setTheme("light")} />

        </div>
    )
}

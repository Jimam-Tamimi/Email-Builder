"use client"
import { useTheme } from 'next-themes'
import React from 'react'
import { HashLoader } from 'react-spinners'

export default function PreLoader() {
  const {resolvedTheme} = useTheme()
  return (
    <>
    <HashLoader className='  animate-scale drop-shadow-[0px_0px_10px_black) filter-[drop-shadow(0px_0px_10px_black)] ' color={resolvedTheme == 'dark'? "white":  "black"}  size={200}  />

    
    </>
  )
}

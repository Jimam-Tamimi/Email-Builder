"use client";
import { useTheme } from "next-themes";
import React from "react";
import { HashLoader } from "react-spinners";

/**
 * `PreLoader` is a loading spinner component that utilizes the `HashLoader` from `react-spinners`.
 * It adjusts the color of the loader based on the current theme (dark or light) from `next-themes`.
 * The spinner is animated and styled with a drop shadow for better visibility.
 * 
 * This component is intended to be used as a pre-loader or loading indicator during data fetching or page transitions.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered `HashLoader` component, which is animated and styled dynamically based on the theme.
 * 
 * @example
 * <PreLoader />
 */

export default function PreLoader() {
  const { resolvedTheme } = useTheme(); // Fetches the current theme (dark or light) using the next-themes hook
  
  return (
    <>
      {/* Render HashLoader with theme-dependent color and animation */}
      <HashLoader
        className="animate-scale drop-shadow-[0px_0px_10px_black] filter-[drop-shadow(0px_0px_10px_black)]"
        color={resolvedTheme == "dark" ? "white" : "black"} // Color changes based on the theme
        size={200} // Loader size is fixed at 200px
      />
    </>
  );
}

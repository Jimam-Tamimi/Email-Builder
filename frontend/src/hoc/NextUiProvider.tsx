"use client";
import { NextUIProvider as Provider } from "@nextui-org/system";
import { useTheme } from "next-themes";

export function NextUIProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}

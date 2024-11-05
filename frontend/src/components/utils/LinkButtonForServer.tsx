"use client";

import React from "react";
import {
  Button as NextUiButton,
  ButtonProps as NextUiButtonProps,
} from "@nextui-org/button";
import { Link } from "@/i18n/routing";

const LinkForServer: React.FC<React.ComponentProps<typeof Link>> = (props) => {
  return <Link {...props}></Link>;
};

export default LinkForServer;

"use client";

import React from "react";
import {
  Button as NextUiButton,
  ButtonProps as NextUiButtonProps,
} from "@nextui-org/button";
import { Link } from "@/i18n/routing";

const LinkButtonForServer: React.FC<NextUiButtonProps> = ({
  ...props
}) => {
  return <NextUiButton  as={Link} {...props}  />
};

export default LinkButtonForServer;

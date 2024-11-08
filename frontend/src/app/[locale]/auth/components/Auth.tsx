"use client";
import React, { cache, useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { MdOutlineClose } from "react-icons/md";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import getPageContent from "@/helpers/getPageContent";
import { Button } from "@nextui-org/button";
import axios from "axios";
import { set } from "react-hook-form";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import AuthModalBody from "./AuthModalBody";
import AuthModalHeader from "./AuthModalHeader";

export type PagesNameType =
  | "SIGN_IN"
  | "SIGN_UP"
  | "FORGOT_PASSWORD"
  | "RESET_PASSWORD"
  | "VERIFY_EMAIL"
  | "VERIFY_NUMBER";

export default function Auth({ pageContent }: any) {
  const pathname = usePathname();
  const router = useRouter();
  
  // setting country codes for phone number input in sign up page.
  const [countryCodes, setCountryCodes] = useState([]);
  useEffect(() => {
    const getCountryCodes = cache(async (): Promise<any> => {
      try {
        const response = await axios.get(
          `${process?.env?.NEXT_PUBLIC_BASE_URL}/content/country-codes.json`
        );
        setCountryCodes(response.data);
      } catch (error) {
        // handle error
      }
    });
    getCountryCodes();
  }, []);


  return (
    <>
      {/* <Button
        color="primary"
        variant="solid"
        size="lg"
        href={"/auth/sign-up/"}
        as={Link}
        radius="full"
        className="transition-all duration-300 ease-in-out    active:scale-95    hover:scale-110  "
      >
        {pageContent?.join_now_button_text || "Join Now"}
      </Button> */}
      <Button
        color="primary"
        href={"/auth/sign-in/"}
        variant="solid"
        as={Link}
        radius="full"
        className="transition-all duration-300 ease-in-out    active:scale-95    hover:scale-105  "
      >
        {pageContent?.sign_in_button_text || "Sign In"}
      </Button>
      <Modal
        size="lg"
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: "dark:shadow-[0_0px_15px_#ffffff20] shadow-[0_0px_15px_#00000010] backdrop-blur-[20px] bg-[#d1e2ff47] dark:bg-[#00000040] py-2",
        }}
        isOpen={pathname?.startsWith("/auth")}
        onOpenChange={(e) => router.push("/")}
      >
        <ModalContent className="overflow-hidden">
          {(onClose) => (
            <>
              <AuthModalHeader pageContent={pageContent} />
              <AuthModalBody
                pageContent={pageContent}
                countryCodes={countryCodes}
              />
              <ModalFooter className="flex flex-col items-center justify-center gap-5 py-2 "></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

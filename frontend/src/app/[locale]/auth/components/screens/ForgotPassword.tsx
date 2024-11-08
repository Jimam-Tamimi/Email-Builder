"use client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Using icons from react-icons
import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";

export default function ForgotPassword({
  pageContent,
}: {
  pageContent: any;
}) {

  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission


    router.push("/auth/verify-email/");
  };

  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          variant={"underlined"}
          label={
            pageContent?.text_input_label_email_or_username ||
            "Email or Username"
          }
          {...register("usernameOrEmail", {
            required: "This field is required",
            minLength: {
              value: 3,
              message: "Minimum length is 3 characters",
            }, 
          })}
          isInvalid={!!errors?.usernameOrEmail}
          errorMessage={errors?.usernameOrEmail?.message?.toString() || "Error"}
        /> 
        <Button
          className="w-full hover:!scale-100 active:!scale-95 transition-all duration-300 ease-in-out mt-2"
          type="submit"
          color="primary"
          variant="shadow"
        >
          {pageContent?.forgot_password_button_text || "Search"}
        </Button>
      </form>

      <p className="flex justify-center items-center gap-1.5">
        <span>
          {pageContent?.text_already_have_account || "Already Have an Account?"}
        </span>
        <Link
          href={"/auth/sign-in/"}
          className="font-semibold tracking-wide text-blue-500 transition-all duration-300 cursor-pointer hover:text-blue-600"
        >
          {pageContent?.link_text_sign_in || "Sign In"}
        </Link>
      </p>
    </>
  );
}

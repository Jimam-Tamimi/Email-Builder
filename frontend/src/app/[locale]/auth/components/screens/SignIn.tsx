"use client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Using icons from react-icons
import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import useSignIn from "@/hooks/auth/useSignIn";
import { SignInFormDataType } from "@/types/auth";
import useCreateTemplate from "@/hooks/builder/useCreateTemplate";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

export default function SignIn({ pageContent }: { pageContent: any }) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFormDataType>();




  // handle sending data to the server for authentication
  const signInMutation = useSignIn();
  const onSubmit = (data: SignInFormDataType) => {
    // Handle form submission
    signInMutation.mutate(data, {
      onSuccess: async (data) => { 
        reset();
      },
    });
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
          })}
          isInvalid={!!errors?.usernameOrEmail}
          errorMessage={
            errors?.usernameOrEmail?.message?.toString() || "Email Error"
          }
        />
        <Input
          label={pageContent?.text_input_label_password || "Password"}
          variant="underlined"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => setIsPasswordShown(!isPasswordShown)}
              aria-label="toggle password visibility"
            >
              {isPasswordShown ? (
                <AiFillEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <AiFillEye className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isPasswordShown ? "text" : "password"}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 1,
              message: "Password must be at least 8 characters long",
            },
          })}
          isInvalid={!!errors?.password}
          errorMessage={
            errors?.password?.message?.toString() || "Password Error"
          }
        />
        <Checkbox className="mt-2" color="primary" {...register("rememberMe")}>
          {pageContent?.check_box_remember || "Remember Me"}
        </Checkbox>
        <Button
          className="w-full hover:!scale-100 active:!scale-95 transition-all duration-300 ease-in-out mt-2"
          type="submit"
          color="primary"
          variant="shadow"
        >
          {pageContent?.sign_in_button_text || "Sign In"}
        </Button>
      </form>

      <Link
        href={"/auth/forgot-password/"}
        className="font-semibold text-center tracking-wide text-blue-500 transition-all duration-300 cursor-pointer hover:text-blue-600"
      >
        {pageContent?.link_text_forgot_password || "Forgot Password"}
      </Link>

      <p className="flex justify-center items-center gap-1.5">
        <span>
          {pageContent?.text_dont_have_account || "Don't Have an Account?"}
        </span>
        <Link
          href={"/auth/sign-up/"}
          className="font-semibold tracking-wide text-blue-500 transition-all duration-300 cursor-pointer hover:text-blue-600"
        >
          {pageContent?.link_text_create || "Create One"}
        </Link>
      </p>
    </>
  );
}

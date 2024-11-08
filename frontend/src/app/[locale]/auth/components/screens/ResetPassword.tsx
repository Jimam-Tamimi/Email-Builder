"use client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Using icons from react-icons
import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";

export default function ResetPassword({ pageContent }: { pageContent: any }) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission to reset password
    toast.success("Dummy Password Reset Success!")
    router.push("/auth/sign-in/");
  };

  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Input
          isRequired
          label={pageContent?.text_input_label_password || "Password"}
          variant="underlined"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={(e) => setIsPasswordShown(!isPasswordShown)}
              aria-label="toggle password visibility"
            >
              {isPasswordShown ? (
                <AiFillEyeInvisible className="text-2xl text-default-700 pointer-events-none" />
              ) : (
                <AiFillEye className="text-2xl text-default-600 pointer-events-none" />
              )}
            </button>
          }
          type={isPasswordShown ? "text" : "password"}
            {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
            validate: (value) =>
              /^(?=.*[a-z])(?=.*[A-Z]+)(?=.*\d+)(?=.*[!@#$%^&*(){}\[\]":;,.<>?~`_+=|\\/-\s]+)[A-Za-z\d!@#$%^&*(){}\[\]":;,.<>?~`_+=|\\/-\s]{8,}$/.test(
              value
              ) ||
              "Password must contain at least one uppercase letter (e.g., A), one lowercase letter (e.g., a), one number (e.g., 1), and one special character (e.g., @)",
            })}
          isInvalid={!!errors?.password}
          errorMessage={errors?.password?.message?.toString() || "Error"}
        />
        <Input
          label={
            pageContent?.text_input_label_confirm_password || "Confirm Password"
          }
          isRequired
          variant="underlined"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={(e) => setIsPasswordShown(!isPasswordShown)}
              aria-label="toggle password visibility"
            >
              {isPasswordShown ? (
                <AiFillEyeInvisible className="text-2xl text-default-600 pointer-events-none" />
              ) : (
                <AiFillEye className="text-2xl text-default-600 pointer-events-none" />
              )}
            </button>
          }
          type={isPasswordShown ? "text" : "password"}
          {...register("confirmPassword", {
            required: "Confirm Password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          isInvalid={!!errors?.confirmPassword}
          errorMessage={errors?.confirmPassword?.message?.toString() || "Error"}
        />

        <Button
          className="w-full hover:!scale-100 active:!scale-95 transition-all duration-300 ease-in-out mt-5"
          type="submit"
          color="primary"
          variant="shadow"
        >
          {pageContent?.reset_password_button_text || "Reset"}
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

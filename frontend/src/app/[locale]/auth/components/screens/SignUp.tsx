"use client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { Input } from "@nextui-org/input";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Using icons from react-icons
import { cache, useState } from "react";
import { Link } from "@/i18n/routing";
import { Select, SelectItem } from "@nextui-org/select";
import Image from "next/image";
import getPageContent from "@/helpers/getPageContent";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { useSignUp } from "@/hooks/auth";
import { SignUpFormDataType } from "@/types/auth";

export default function SignIn({
  pageContent,
  countryCodes,
}: {
  pageContent: any;
  countryCodes: any;
}) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [countryCodeSearchValue, setCountryCodeSearchValue] = useState("");

  // Initialize react-hook-form
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormDataType>();

  // handle sending data to the server for authentication
  const signUpMutation = useSignUp();
  const onSubmit = (data: SignUpFormDataType) => {
    // Handle form submission
    console.log(data);

    
    toast.success("Dummy Registration Success!")
    return; // must remove return after setting up apis.
    signUpMutation.mutateAsync(data, {
      onSuccess: async (data) => {
        reset();
      },
    });
  };

  return (
    <>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="*:w-1/2 flex justify-between gap-5">
          <Input
            {...register("firstName", { required: "First name is required" })}
            type="text"
            isRequired
            variant={"underlined"}
            label={pageContent?.text_input_label_first_name || "First Name"}
            isInvalid={!!errors?.firstName}
            errorMessage={errors?.firstName?.message?.toString() || ""}
          />
          <Input
            {...register("lastName", { required: "Last name is required" })}
            isRequired
            type="text"
            variant={"underlined"}
            label={pageContent?.text_input_label_last_name || "Last Name"}
            isInvalid={!!errors?.lastName}
            errorMessage={errors?.lastName?.message?.toString() || ""}
          />
        </div>
        <Input
          {...register("username", { required: "Username is required" })}
          isRequired
          type="text"
          variant={"underlined"}
          label={pageContent?.text_input_label_username || "Username"}
          isInvalid={!!errors?.username}
          errorMessage={
            errors?.username?.message?.toString() || "Username Error"
          }
        />
        <Input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          isRequired
          type="email"
          variant={"underlined"}
          label={pageContent?.text_input_label_email || "Email"}
          isInvalid={!!errors?.email}
          errorMessage={errors?.email?.message?.toString() || "Email Error"}
        />

        <div className="flex justify-between items-stretch gap-5">
          <Autocomplete
            {...register("countryCode", {
              required: "Country code is required",
            })}
            type="tel"
            isRequired
            variant="underlined"
            className="w-[30%] scrollbar-hide"
            label={pageContent?.text_input_label_country_code || "Country Code"}
            value={countryCodeSearchValue}
            onInputChange={(e) => setCountryCodeSearchValue(e)}
          >
            {countryCodes
              .slice(0, 50)
              .map(
                (
                  country: { country_code: string; flag: string },
                  index: number
                ) => (
                  <AutocompleteItem
                    key={index}
                    value={country.country_code}
                    startContent={
                      <Image
                        alt="Flag"
                        src={country.flag}
                        width={20}
                        height={20}
                      />
                    }
                  >
                    {`${country.country_code}`}
                  </AutocompleteItem>
                )
              )}
          </Autocomplete>

          <Input
            {...register("phoneNumber", {
              required: "Phone number is required",
            })}
            type="tel"
            isRequired
            variant={"underlined"}
            label={pageContent?.text_input_label_phone_number || "Phone Number"}
            className="w-[70%]"
            isInvalid={!!errors?.phoneNumber}
            errorMessage={
              errors?.phoneNumber?.message?.toString() || "Phone Number Error"
            }
          />
        </div>
        <Input
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
          isRequired
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
                <AiFillEyeInvisible className="text-2xl text-default-700 pointer-events-none" />
              ) : (
                <AiFillEye className="text-2xl text-default-600 pointer-events-none" />
              )}
            </button>
          }
          type={isPasswordShown ? "text" : "password"}
          isInvalid={!!errors?.password}
          errorMessage={
            errors?.password?.message?.toString() || "Password Error"
          }
        />
        <Input
          {...register("confirmPassword", {
            required: "Confirm password is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          label={
            pageContent?.text_input_label_confirm_password || "Confirm Password"
          }
          isRequired
          variant="underlined"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => setIsPasswordShown(!isPasswordShown)}
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
          isInvalid={!!errors?.confirmPassword}
          errorMessage={
            errors?.confirmPassword?.message?.toString() ||
            "Confirm Password Error"
          }
        />

        <Checkbox
          {...register("terms", {
            required: "You must agree to the terms and conditions",
          })}
          color="primary"
          className="justify-center items-center mt-2 flex tracking-wide"
          isInvalid={!!errors?.terms}
        >
          <span
            className="space-y-1.5 tracking-wide"
            dangerouslySetInnerHTML={{
              __html:
                pageContent?.check_box_agree_terms ||
                `<span>I agree to the</span> <a class='font-semibold tracking-wide text-blue-500 transition-all duration-300 cursor-pointer hover:text-blue-600' href='#'> Terms & Conditions </a> <span>and</span> <a class='font-semibold tracking-wide text-blue-500 transition-all duration-300 cursor-pointer hover:text-blue-600' href='#'> Privacy Policy </a>`,
            }}
          ></span>
        </Checkbox>
        <Button
          className="w-full hover:!scale-100 active:!scale-95 transition-all duration-300 ease-in-out mt-5"
          color="primary"
          variant="shadow"
          type="submit"
        >
          {pageContent?.create_account_button_text || "Create Account"}
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

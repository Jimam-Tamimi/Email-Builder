"use client";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import OTPInput from "../../../../../components/utils/OTPInput";

// Define TypeScript types for form fields
interface VerifyNumberFormData {
  otp: string;
}

export default function VerifyNumber({ pageContent }: { pageContent: any }) {


  const router = useRouter()
  
  
  // Initialize React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VerifyNumberFormData>();

  
  // Function to handle form submission
  const onSubmit: SubmitHandler<VerifyNumberFormData> = (data) => {
    // Handle the form submission logic here
    console.log("OTP Code Submitted:", data);
    // You can send the OTP code to the server using axios or fetch here

    router.push("/auth/reset-password/");
    
  };

  return (
    <>
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit(onSubmit)} // Handling form submission
      >
        <Controller
          name="otp"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <OTPInput
              maxLength={4}
              containerClassName="w-[80%] my-10 "
              onChange={onChange}
              value={value}
            />
          )}
          rules={{
            required: "OTP code is required",
            maxLength: {
              value: 4,
              message: "OTP code must be 4 digits",
            },
            minLength: {
              value: 4,
              message: "OTP code must be 4 digits",
            }
          }}
        />

        {errors.otp && (
          <p className="text-red-500">{errors?.otp?.message}</p>
        )}

        <div className="space-y-5">
          <p className="tracking-wide flex justify-center items-center gap-2 mt-2">
            <span>
              {pageContent?.text_enter_code_sent_to ||
                "Enter the code sent to"}
            </span>
            <span>017****32</span>
          </p>

          {/* show this if countdown is completed */}
          <p className="flex font-sans justify-center items-center gap-1.5">
            <span>
              {pageContent?.text_didnt_receive_the_code ||
                "Didn't receive the code?"}
            </span>
            <span className="font-semibold tracking-wide text-blue-500 transition-all duration-300 cursor-pointer hover:text-blue-600">
              {pageContent?.text_resend_code || "Resend"}
            </span>
          </p>
        </div>

        <div className="flex w-full justify-center items-center gap-10 mt-8">
          <Button
            className="hover:!scale-105 active:!scale-95 transition-all duration-300 ease-in-out mt-2"
            color="primary"
            variant="bordered"
            href="/auth/forgot-password/"
            as={Link}
          >
            {pageContent?.back_button_text || "Back"}
          </Button>
          <Button
            className="hover:!scale-105 active:!scale-95 transition-all duration-300 ease-in-out mt-2"
            color="primary"
            variant="shadow"
            type="submit" // Submit the form when clicked
          >
            {pageContent?.continue_button_text || "Continue"}
          </Button>
        </div>
      </form>
    </>
  );
}

"use client";

import React from "react";
import { OTPInput as OTPInputPackage, SlotProps, OTPInputProps } from "input-otp";

interface CustomOTPInputProps  {
  maxLength: number;
  containerClassName?: string;
  onChange: (value: string) => void;
  value: string;

}

const OTPInput: React.FC<CustomOTPInputProps> = ({
  maxLength,
  containerClassName,
  onChange,
  value,
}) => {
  return (
    <OTPInputPackage
      maxLength={maxLength}
      containerClassName={`group flex items-center ${containerClassName}`}
      onChange={onChange}
      value={value}
      render={({ slots }) => (
        <>
          <div className="flex w-full  justify-stretch items-stretch  gap-8">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        </>
      )}
    />
  );
};

// Slot component styled with plain Tailwind CSS
const Slot: React.FC<SlotProps> = (props) => {
  return (
    <div
      className={`relative w-full h-14 text-2xl font-semibold
        flex items-center justify-center
        transition-all duration-300 ease-in-out   
        border-b border-gray-700 dark:border-gray-300   group-focus-within:border-blue-600
        outline-none ${props.isActive ? "border-b-4 " : ""}
      `}
    >
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  );
};

// FakeCaret component for simulating a blinking caret
const FakeCaret: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-gray-900" />
    </div>
  );
};

// FakeDash component for adding a dash between input sections
const FakeDash: React.FC = () => {
  return (
    <div className="flex w-6 justify-center items-center">
      <div className="w-3 h-1 bg-gray-300 rounded-full" />
    </div>
  );
};

export default OTPInput;

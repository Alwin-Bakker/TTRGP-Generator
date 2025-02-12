"use client";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function CustomInput({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full p-2 bg-gray-800 text-white border border-gray-600 rounded ${className}`}
    />
  );
}

"use client";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export default function CustomButton({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition ${className}`}
    >
      {children}
    </button>
  );
}

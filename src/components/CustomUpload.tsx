"use client";
import React from "react";

type UploadProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function CustomUpload({ className = "", ...props }: UploadProps) {
  return (
    <input
      type="file"
      {...props}
      className={`bg-gray-800 text-white p-2 border border-gray-600 rounded ${className}`}
    />
  );
}

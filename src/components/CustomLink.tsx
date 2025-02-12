"use client";
import Link, { LinkProps } from "next/link";
import React from "react";

type CustomLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

export default function CustomLink({ children, className = "", ...props }: CustomLinkProps) {
  return (
    <Link {...props} className={`text-white underline ${className}`}>
      {children}
    </Link>
  );
}

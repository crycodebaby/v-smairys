import React from "react";
import { cn } from "@/lib/utils";

type PublicPageBodyProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Standard page content wrapper for public routes.
 * Replaces ad-hoc nested `<main>` elements (root layout already provides `<main>`).
 */
export function PublicPageBody({
  children,
  className = "",
}: PublicPageBodyProps) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col", className)}>
      {children}
    </div>
  );
}

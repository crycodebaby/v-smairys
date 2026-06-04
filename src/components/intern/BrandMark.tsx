"use client";

import React, { useState } from "react";
import Image from "next/image";

type BrandMarkProps = {
  /** Kantenlänge in px. */
  size?: number;
  className?: string;
};

/**
 * Smairys-Logo (weiße Netz-Marke) für den dunklen internen Header.
 * Quelle: `public/logo/smairys-white.png`. Fällt bei Ladefehler auf die
 * Initiale „S" zurück, damit der Header nie leer ist.
 */
export function BrandMark({ size = 36, className = "" }: BrandMarkProps) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      className={
        "relative inline-flex flex-none items-center justify-center overflow-hidden rounded-xl " +
        "border border-white/10 bg-white/[0.06] backdrop-blur-xl " +
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_4px_14px_-6px_rgba(0,0,0,0.6)] " +
        className
      }
      style={{ width: size, height: size }}
    >
      {failed ? (
        <span className="text-[15px] font-bold tracking-tighter text-foreground">S</span>
      ) : (
        <Image
          src="/logo/smairys-white.png"
          alt="Smairys"
          width={size}
          height={size}
          priority
          onError={() => setFailed(true)}
          className="h-[78%] w-[78%] object-contain"
        />
      )}
    </span>
  );
}

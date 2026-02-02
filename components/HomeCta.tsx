"use client";

import { signIn } from "next-auth/react";
import type { ReactNode } from "react";

type HomeCtaProps = {
  children: ReactNode;
  className?: string;
};

export default function HomeCta({ children, className }: HomeCtaProps) {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/app" })}
      className={className}
    >
      {children}
    </button>
  );
}

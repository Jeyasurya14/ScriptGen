"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type HomeCtaProps = {
  children: ReactNode;
  className?: string;
};

export default function HomeCta({ children, className }: HomeCtaProps) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <button
      type="button"
      onClick={() => {
        if (session?.user?.email) {
          router.push("/generate");
          return;
        }
        signIn("google", { callbackUrl: "/generate" });
      }}
      className={className}
    >
      {children}
    </button>
  );
}

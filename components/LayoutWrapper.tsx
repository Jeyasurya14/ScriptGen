"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute =
    pathname === "/app" ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/generate") ||
    pathname?.startsWith("/referral") ||
    pathname?.startsWith("/tokens");

  return (
    <div className="flex min-h-screen flex-col bg-bg text-white">
      <Nav />
      <div className="flex flex-1 pt-[60px]">
        {isAppRoute ? <Sidebar /> : null}
        <main className={`min-w-0 flex-1 ${isAppRoute ? "md:pl-[220px]" : ""}`}>{children}</main>
      </div>
      {isAppRoute ? null : <Footer />}
    </div>
  );
}

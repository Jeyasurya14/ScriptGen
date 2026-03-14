"use client";

import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes that should have the Sidebar layout
  const appRoutes = ["/dashboard", "/generate", "/referral", "/tokens", "/scripts", "/templates"];
  const isAppRoute = appRoutes.some(route => pathname?.startsWith(route)) || pathname === "/app";

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Nav />
      <div className="flex flex-1 pt-[60px]">
        {isAppRoute && <Sidebar />}
        <main 
          className={`flex-1 transition-all duration-300 ${
            isAppRoute ? "md:pl-[220px]" : ""
          }`}
        >
          {children}
        </main>
      </div>
      {!isAppRoute && <Footer />}
    </div>
  );
}

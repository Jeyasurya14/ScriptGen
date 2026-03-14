"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileEdit, 
  LayoutDashboard, 
  Users, 
  History, 
  FileStack, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Button";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Script Generator", href: "/generate", icon: FileEdit },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Referral", href: "/referral", icon: Users },
    { name: "Recent Scripts", href: "/scripts", icon: History },
    { name: "Saved Templates", href: "/templates", icon: FileStack },
  ];

  return (
    <aside 
      className={`fixed left-0 top-[60px] h-[calc(100vh-60px)] bg-surface border-r border-surface2 transition-all duration-300 z-50 flex flex-col ${
        isCollapsed ? "w-[70px]" : "w-[220px]"
      } hidden md:flex`}
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-4 w-6 h-6 bg-surface2 border border-surface2 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-3 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? "bg-accent/10 text-accent2 shadow-[inset_0_0_20px_rgba(108,99,255,0.05)]" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-accent" : "group-hover:text-white"} />
              {!isCollapsed && (
                <span className="text-sm font-bold tracking-tight">{item.name}</span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full shadow-[0_0_10px_rgba(108,99,255,1)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Card */}
      {!isCollapsed && (
        <div className="p-4 mt-auto mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-surface2 to-surface border border-white/5 relative overflow-hidden group">
            {/* Gradient Glow */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/20 blur-3xl group-hover:bg-accent/30 transition-all" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-accent2 mb-2">
                <Sparkles size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Go Pro</span>
              </div>
              <p className="text-xs text-white/60 mb-3 font-medium">Unlock unlimited scripts and 4K images.</p>
              <Button size="sm" className="w-full text-[11px] h-8 bg-accent/20 border border-accent/30 hover:bg-accent hover:border-accent">
                ₹499/mo
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mini Upgrade for Collapsed */}
      {isCollapsed && (
        <div className="p-3 mb-6 mt-auto">
          <Link href="/pricing" className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all">
            <Sparkles size={18} />
          </Link>
        </div>
      )}
    </aside>
  );
}

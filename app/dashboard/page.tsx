"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FileText, Zap, Globe, Scissors, Clock } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonText } from "@/components/ui/Skeleton";

interface Script {
  id: string;
  title: string;
  channel_name: string;
  duration: number;
  content_type: string;
  created_at: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loadingScripts, setLoadingScripts] = useState(true);
  const [credits, setCredits] = useState<any>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);

  useEffect(() => {
    if (session) {
      fetchScripts();
      fetchCredits();
    }
  }, [session]);

  const fetchScripts = async () => {
    try {
      const res = await fetch("/api/scripts");
      if (res.ok) {
        const data = await res.json();
        setScripts(data.scripts || []);
      }
    } catch (e) {
      console.error("Failed to fetch scripts", e);
    } finally {
      setLoadingScripts(false);
    }
  };

  const fetchCredits = async () => {
    try {
      const res = await fetch("/api/credits");
      if (res.ok) {
        const data = await res.json();
        setCredits(data);
      }
    } catch (e) {
      console.error("Failed to fetch credits", e);
    } finally {
      setLoadingCredits(false);
    }
  };

  const stats = [
    { label: "Scripts Generated", value: scripts.length || 0, icon: FileText, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
    { label: "Tokens Remaining", value: credits?.totalTokens || 0, icon: Zap, color: "text-gold", bg: "bg-gold/10", border: "border-gold/20" },
    { label: "Avg SEO Score", value: scripts.length > 0 ? "85%" : "0%", icon: Globe, color: "text-green", bg: "bg-green/10", border: "border-green/20" },
    { label: "Shorts Extracted", value: scripts.length * 2 || 0, icon: Scissors, color: "text-red", bg: "bg-red/10", border: "border-red/20" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-10 min-h-screen animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-head font-bold text-white mb-2">Dashboard</h1>
        <p className="text-sm text-white/50">Overview of your script generation activity and performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:border-white/10">
            <CardBody className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.bg} ${stat.border} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white/50 uppercase tracking-wider">{stat.label}</p>
                <div className="text-2xl font-mono font-bold text-white mt-1">
                  {(loadingScripts && i === 0) || (loadingCredits && i === 1) ? (
                    <SkeletonText lines={1} className="w-16 h-6 mt-1" />
                  ) : (
                    stat.value
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Recent Scripts Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-head font-bold text-white">Recent Scripts</h2>
        <Card className="border-surface2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="text-[10px] font-bold uppercase tracking-widest text-white/40 border-b border-surface2 bg-surface2/30">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Language</th>
                  <th className="px-6 py-4">SEO Score</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface2">
                {loadingScripts ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><SkeletonText lines={1} className="w-48" /></td>
                      <td className="px-6 py-4"><SkeletonText lines={1} className="w-16" /></td>
                      <td className="px-6 py-4"><SkeletonText lines={1} className="w-12" /></td>
                      <td className="px-6 py-4"><SkeletonText lines={1} className="w-24" /></td>
                      <td className="px-6 py-4 text-right"><SkeletonText lines={1} className="w-16 h-5 rounded-full inline-block" /></td>
                    </tr>
                  ))
                ) : scripts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                      <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                      No scripts found. Start generating!
                    </td>
                  </tr>
                ) : (
                  scripts.map((script) => (
                    <tr 
                      key={script.id} 
                      className="hover:bg-surface2/50 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/generate?id=${script.id}`)}
                    >
                      <td className="px-6 py-4 font-bold text-white/90 group-hover:text-accent transition-colors max-w-[200px] truncate">
                        {script.title || "Untitled Script"}
                      </td>
                      <td className="px-6 py-4">English</td>
                      <td className="px-6 py-4 font-mono font-bold text-green">85%</td>
                      <td className="px-6 py-4 flex items-center gap-1.5 text-white/50 text-xs">
                        <Clock size={12} />
                        {new Date(script.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant="success">DONE</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

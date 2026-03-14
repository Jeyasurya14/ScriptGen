"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";
import { Users, Copy, Check, Share2, ArrowRight, Gift, Zap } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SkeletonText } from "@/components/ui/Skeleton";

export default function ReferralPage() {
  const { data: session } = useSession();
  const [referralData, setReferralData] = useState<{ code: string; link: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Mock stats for demo purposes
  const stats = [
    { label: "Total Referred", value: "0", icon: Users, color: "text-accent" },
    { label: "Tokens Earned", value: "0", icon: Zap, color: "text-gold" },
    { label: "Active Users", value: "0", icon: Check, color: "text-green" },
  ];

  const steps = [
    { title: "Share Code", desc: "Give your unique link to a friend.", icon: Share2 },
    { title: "Friend Signs Up", desc: "They create an account using your link.", icon: Users },
    { title: "Both Get Tokens", desc: "You both receive 15 free tokens!", icon: Gift },
  ];

  useEffect(() => {
    if (session) {
      fetchReferralData();
    }
  }, [session]);

  const fetchReferralData = async () => {
    try {
      const res = await fetch("/api/referral");
      if (res.ok) {
        const data = await res.json();
        setReferralData(data);
      }
    } catch (e) {
      console.error("Failed to fetch referral data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!referralData?.link) return;
    try {
      await navigator.clipboard.writeText(referralData.link);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-6 md:p-10 space-y-10 min-h-screen animate-fade-in">
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#141826', color: '#fff', border: '1px solid #141826' }}} />

      {/* Hero Card */}
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-accent via-accent2 to-gold overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent2/20 to-gold/20 blur-3xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-surface p-8 md:p-12 rounded-[23px] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-md space-y-4">
            <Badge variant="gold" className="px-3 py-1 text-xs">REFER & EARN</Badge>
            <h1 className="text-3xl md:text-4xl font-head font-bold text-white leading-tight">
              Invite friends, get <span className="text-gold">free tokens</span>.
            </h1>
            <p className="text-sm text-white/60 leading-relaxed">
              For every friend who signs up using your link, you both receive 15 free tokens to generate more AI scripts and assets.
            </p>
          </div>

          <div className="w-full md:w-auto bg-surface2 border border-white/5 rounded-2xl p-6 space-y-4">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest text-center">Your Referral Link</p>
            {loading ? (
              <SkeletonText lines={1} className="h-10 w-full md:w-64 rounded-xl" />
            ) : (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={referralData?.link || "Generating..."} 
                  className="w-full md:w-64 bg-surface px-4 py-3 rounded-xl border border-white/5 text-sm font-mono text-white/80 focus:outline-none"
                />
                <Button 
                  onClick={handleCopy} 
                  className="px-4 h-[46px] rounded-xl flex-shrink-0"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="space-y-6">
        <h2 className="text-xl font-head font-bold text-white text-center">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 bg-surface border border-surface2 p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-surface2 border border-white/5 flex items-center justify-center text-accent">
                <step.icon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-xs text-white/50 mt-2">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="md:hidden text-white/10 my-2">
                  <ArrowRight size={20} className="rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4 pt-4 border-t border-surface2">
        <h2 className="text-lg font-head font-bold text-white">Your Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardBody className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <stat.icon size={16} className={stat.color} />
                  <span className="text-xs font-bold text-white/50 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-3xl font-mono font-bold text-white">{stat.value}</div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

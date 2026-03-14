"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Zap, ShieldCheck } from "lucide-react";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    email?: string | null;
    name?: string | null;
  };
  theme?: { color: string };
}

export default function TokensPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  const packs = [
    { id: "30", tokens: 30, scripts: 3, price: 149 },
    { id: "100", tokens: 100, scripts: 10, price: 399, popular: true },
    { id: "300", tokens: 300, scripts: 30, price: 999 },
  ];

  const handleBuy = async (packId: string) => {
    if (!session) {
      toast.error("Please sign in to buy tokens.");
      return;
    }
    
    setProcessing(packId);
    
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packId }),
      });
      
      const order = await res.json();
      
      if (!res.ok) {
        throw new Error(order.error || "Failed to create order");
      }

      const options: RazorpayOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: order.businessName || "ScriptGen",
        description: `Token Pack`,
        order_id: order.orderId,
        handler: async (response) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          
          if (verifyRes.ok) {
            await updateSession();
            toast.success("Tokens added!");
            router.push("/generate");
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          email: session?.user?.email,
          name: session?.user?.name,
        },
        theme: { color: "#6C63FF" },
      };

      const RazorpayCtor = (window as any).Razorpay;
      if (!RazorpayCtor) throw new Error("Payment SDK unavailable");
      const razorpay = new RazorpayCtor(options);
      razorpay.open();
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto p-6 md:p-10 space-y-10 min-h-screen animate-fade-in flex flex-col">
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#141826', color: '#fff', border: '1px solid #141826' }}} />
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-head font-bold text-white">Choose your pack</h1>
        <p className="text-white/60">Generate high-converting YouTube scripts in seconds. One full script with all assets costs exactly 10 tokens.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-center">
        {packs.map((pack) => (
          <Card 
            key={pack.id} 
            className={`relative flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 ${
              pack.popular ? "border-accent shadow-[0_0_30px_-10px_rgba(108,99,255,0.4)] md:scale-105" : "border-surface2"
            }`}
          >
            {pack.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <Badge variant="accent" className="bg-accent text-white px-3 py-1 font-bold shadow-lg">BEST VALUE</Badge>
              </div>
            )}
            <CardBody className="p-8 text-center flex-1 flex flex-col justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mx-auto mb-2">
                <Zap size={28} className="fill-current" />
              </div>
              <h2 className="text-4xl font-mono font-bold text-white">{pack.tokens}</h2>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Tokens</p>
              <p className="text-sm text-white/60 mt-4 border-t border-white/5 pt-4">
                ~{pack.scripts} full scripts
              </p>
            </CardBody>
            <CardFooter className="p-6 bg-surface2/30 flex flex-col gap-4">
              <div className="text-center">
                <span className="text-2xl font-bold text-white">₹{pack.price}</span>
              </div>
              <Button 
                variant={pack.popular ? "primary" : "ghost"} 
                className={`w-full py-4 rounded-xl ${pack.popular ? "" : "bg-white/5 border-white/10"}`}
                onClick={() => handleBuy(pack.id)}
                loading={processing === pack.id}
                disabled={processing !== null}
              >
                Buy Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-auto pt-10 text-center flex flex-col items-center gap-2 text-xs text-white/30">
        <ShieldCheck size={20} className="text-white/20" />
        <p>Powered by Razorpay. Tokens never expire. All prices include GST.</p>
      </div>
    </div>
  );
}
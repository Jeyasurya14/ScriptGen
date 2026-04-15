"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { getTokenTotal } from "@/lib/credits";
import { TOKEN_PACKS } from "@/lib/token-packs";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve, reject) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export default function TokensPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const tokenBalance = useMemo(
    () =>
      session?.user?.tokenBalance?.totalTokens ??
      session?.user?.tokens ??
      getTokenTotal(session?.user?.credits ?? null),
    [session],
  );

  const handlePurchase = async (packId: string) => {
    setLoadingPack(packId);
    try {
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packId }),
      });
      const orderPayload = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderPayload.error || "Failed to create order");

      await loadRazorpayScript();
      const RazorpayCtor = window.Razorpay;
      if (!RazorpayCtor) throw new Error("Razorpay is unavailable");

      const selectedPack = TOKEN_PACKS.find((p) => p.id === packId);
      const rzp = new RazorpayCtor({
        key: orderPayload.keyId,
        amount: orderPayload.amount,
        currency: "INR",
        name: "ScriptGen",
        description: `${selectedPack?.label || packId} Token Pack`,
        order_id: orderPayload.orderId,
        prefill: { name: session?.user?.name, email: session?.user?.email },
        theme: { color: "#6C63FF" },
        handler: async (response: Record<string, unknown>) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            await update();
            toast.success("Tokens added!");
            router.push("/generate");
          } else {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        modal: { ondismiss: () => toast("Payment cancelled") },
      });
      rzp.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initiate payment.");
    } finally {
      setLoadingPack(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-xl font-semibold text-white">Buy Tokens</h1>
        <p className="mt-1 text-sm text-muted">
          Pay once. Tokens never expire. All prices in INR.
        </p>
      </div>

      {/* Balance bar */}
      <div className="mb-6 flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm">
        <Zap className="h-4 w-4 text-gold" />
        <span className="text-muted">Current balance:</span>
        <span className="font-semibold text-gold">{tokenBalance} tokens</span>
      </div>

      {/* Packs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {TOKEN_PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`relative rounded-lg border p-5 ${
              pack.featured ? "border-accent bg-accent/5" : "border-border bg-surface"
            }`}
          >
            {pack.featured ? (
              <p className="absolute right-3 top-3 rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Best Value
              </p>
            ) : null}

            <p className="text-xs font-medium text-muted">{pack.label}</p>
            <p className="mt-3 text-4xl font-bold text-white">{pack.tokens}</p>
            <p className="text-xs text-muted">tokens</p>
            <p className="mt-1 text-xs text-muted">{pack.scripts}</p>
            <p className="mt-4 text-2xl font-bold text-gold">₹{pack.price}</p>

            <ul className="mt-4 space-y-2 text-xs text-muted">
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-green" />
                Full 4-stage script generation
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-green" />
                SEO, B-Roll, Shorts & image assets
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-green" />
                One-time payment, no subscription
              </li>
            </ul>

            <Button
              variant={pack.featured ? "primary" : "ghost"}
              size="md"
              className="mt-5 w-full"
              loading={loadingPack === pack.id}
              disabled={loadingPack !== null}
              onClick={() => handlePurchase(pack.id)}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>

      {/* Trust footer */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-6 text-xs text-muted">
        {["🔒 Razorpay Secured", "⚡ Instant Credit", "♾️ Never Expire", "🇮🇳 INR Pricing"].map((badge) => (
          <span key={badge} className="flex items-center gap-1.5">
            {badge}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-green" />
        Token credits are added instantly after payment verification.
      </div>
    </div>
  );
}

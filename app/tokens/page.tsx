"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Zap } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { getTokenTotal } from "@/lib/credits";
import { TOKEN_PACKS } from "@/lib/token-packs";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

const TRUST_BADGES = [
  "🔒 Razorpay Secured",
  "⚡ Instant Credit",
  "♾️ Never Expire",
  "🇮🇳 INR Pricing",
];

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

      if (!orderRes.ok) {
        throw new Error(orderPayload.error || "Failed to create order");
      }

      await loadRazorpayScript();

      const RazorpayCtor = window.Razorpay;
      if (!RazorpayCtor) {
        throw new Error("Razorpay is unavailable");
      }

      const selectedPack = TOKEN_PACKS.find((pack) => pack.id === packId);

      const rzp = new RazorpayCtor({
        key: orderPayload.keyId,
        amount: orderPayload.amount,
        currency: "INR",
        name: "ScriptGen",
        description: `${selectedPack?.label || packId} Token Pack`,
        order_id: orderPayload.orderId,
        prefill: {
          name: session?.user?.name,
          email: session?.user?.email,
        },
        theme: { color: "#6C63FF" },
        handler: async (response: Record<string, unknown>) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          if (verifyRes.ok) {
            await update();
            toast.success("🎉 Tokens added!");
            router.push("/generate");
          } else {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        modal: {
          ondismiss: () => toast("Payment cancelled", { icon: "👋" }),
        },
      });

      rzp.open();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initiate payment. Please try again.");
    } finally {
      setLoadingPack(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-8">
      <div className="rounded-3xl border border-border bg-surface2/70 px-5 py-4 text-sm text-muted">
        Your current balance: <span className="font-semibold text-gold">⚡{tokenBalance} tokens</span>
      </div>

      <div className="max-w-2xl space-y-3">
        <h1 className="font-head text-4xl font-extrabold text-white">Top Up Your Tokens</h1>
        <p className="text-base text-muted">
          Pay once. Use anytime. Tokens never expire. All prices in INR.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {TOKEN_PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`relative rounded-[28px] border bg-[linear-gradient(180deg,rgba(20,24,38,0.98),rgba(14,18,32,0.98))] p-6 shadow-[0_24px_70px_rgba(5,7,16,0.24)] ${
              pack.featured ? "border-2 border-accent" : "border-border"
            }`}
          >
            {pack.featured ? (
              <div className="absolute right-3 top-3 rounded-full bg-accent px-2 py-1 text-[10px] font-bold tracking-[0.12em] text-white">
                BEST VALUE
              </div>
            ) : null}

            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{pack.label}</p>
            <div className="mt-4">
              <p className="font-head text-5xl font-extrabold text-accent2">{pack.tokens}</p>
              <p className="mt-1 text-sm text-muted">tokens</p>
            </div>
            <p className="mt-3 text-sm text-muted">{pack.scripts}</p>
            <p className="mt-6 font-head text-3xl font-bold text-gold">₹{pack.price}</p>

            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-green" />
                Full 4-stage script generation
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-green" />
                SEO, B-Roll, Shorts, and image assets
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-green" />
                One-time payment, no subscription
              </li>
            </ul>

            <Button
              variant={pack.featured ? "primary" : "ghost"}
              size="lg"
              className="mt-8 w-full"
              loading={loadingPack === pack.id}
              disabled={loadingPack !== null}
              onClick={() => handlePurchase(pack.id)}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>

      <Card>
        <CardBody className="flex flex-wrap items-center justify-center gap-3">
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface2 px-3 py-2 text-sm text-muted"
            >
              {badge}
            </span>
          ))}
        </CardBody>
      </Card>

      <div className="flex items-center justify-center gap-2 text-sm text-muted">
        <ShieldCheck className="h-4 w-4 text-green" />
        Payments are processed through Razorpay. Token credits are added instantly after verification.
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { getTokenTotal } from "@/lib/credits";
import { TOKEN_PACKS } from "@/lib/token-packs";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve, reject) => {
    if (document.getElementById("razorpay-script")) { resolve(true); return; }
    const s = document.createElement("script");
    s.id = "razorpay-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}

export default function TokensPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const tokenBalance = useMemo(
    () => session?.user?.tokenBalance?.totalTokens ?? session?.user?.tokens ?? getTokenTotal(session?.user?.credits ?? null),
    [session],
  );

  const handlePurchase = async (packId: string) => {
    setLoadingPack(packId);
    try {
      const orderRes = await fetch("/api/payment/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pack: packId }) });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || "Failed to create order");
      await loadRazorpayScript();
      const Ctor = window.Razorpay;
      if (!Ctor) throw new Error("Razorpay unavailable");
      const pack = TOKEN_PACKS.find((p) => p.id === packId);
      const rzp = new Ctor({
        key: order.keyId, amount: order.amount, currency: "INR",
        name: "ScriptGen", description: `${pack?.label || packId} Token Pack`,
        order_id: order.orderId,
        prefill: { name: session?.user?.name, email: session?.user?.email },
        theme: { color: "#6366f1" },
        handler: async (response: Record<string, unknown>) => {
          const verify = await fetch("/api/payment/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(response) });
          if (verify.ok) { await update(); toast.success("Tokens added successfully."); router.push("/generate"); }
          else toast.error("Payment verification failed. Contact support.");
        },
        modal: { ondismiss: () => toast("Payment cancelled.") },
      });
      rzp.open();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment failed.");
    } finally {
      setLoadingPack(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-white">Buy Tokens</h1>
        <p className="mt-0.5 text-sm text-muted">Pay once. No subscription. Tokens never expire.</p>
      </div>

      {/* Balance */}
      <div className="mb-6 flex items-center gap-2 rounded border border-border bg-surface px-4 py-3 text-sm">
        <span className="text-muted">Current balance</span>
        <span className="font-semibold text-white">{tokenBalance} tokens</span>
        <span className="ml-auto text-xs text-hint">≈ {Math.floor(tokenBalance / 10)} full scripts</span>
      </div>

      {/* Packs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {TOKEN_PACKS.map((pack) => (
          <div
            key={pack.id}
            className={`rounded border p-5 ${pack.featured ? "border-accent/40 bg-accent/5" : "border-border bg-surface"}`}
          >
            {pack.featured && (
              <span className="mb-3 inline-block rounded bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent2">
                Best value
              </span>
            )}

            <p className="text-xs text-muted">{pack.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{pack.tokens}</p>
            <p className="text-xs text-muted">tokens · {pack.scripts}</p>
            <p className="mt-4 text-xl font-semibold text-white">₹{pack.price}</p>

            <ul className="mt-4 space-y-1.5">
              {[
                "Full 4-stage script generation",
                "SEO, B-Roll, Shorts & image assets",
                "One-time payment",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-muted">
                  <Check className="h-3 w-3 shrink-0 text-green" />
                  {item}
                </li>
              ))}
            </ul>

            <Button
              variant={pack.featured ? "primary" : "ghost"}
              size="md"
              className="mt-5 w-full"
              loading={loadingPack === pack.id}
              disabled={loadingPack !== null}
              onClick={() => void handlePurchase(pack.id)}
            >
              Buy now
            </Button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border pt-6 text-xs text-muted">
        {["Razorpay secured", "Instant credit", "Tokens never expire", "INR pricing"].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-hint">
        <ShieldCheck className="h-3.5 w-3.5" />
        Token credits are added instantly after payment verification.
      </div>
    </div>
  );
}

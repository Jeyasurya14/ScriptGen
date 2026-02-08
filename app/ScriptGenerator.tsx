"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
// import { jsPDF } from "jspdf"; // Dynamic import used instead
import {
    FileText,
    Copy,
    Download,
    Check,
    Loader2,
    ChevronDown,
    Search,
    Sparkles,
    ImageIcon,
    List,
    Film,
    Scissors,
    LogIn,
    LogOut,
    User,
    CreditCard,
    X,
    History,
    Trash2,
    Clock,
    Settings2,
    ShieldCheck,
    Tag,
    Share2,
} from "lucide-react";

// Types
interface FormData {
    title: string;
    channelName: string;
    duration: number;
    contentType: string;
    difficulty: string;
    tone: string;
    language: string;
    includeCode: boolean;
    localContext: boolean;
    generateImages: boolean;
    includeChapters: boolean;
    includeBRoll: boolean;
    includeShorts: boolean;
    imageFormat: string;
}

interface RankedItem {
    text: string;
    score: number;
}

interface SEOData {
    titles: RankedItem[];
    description: string;
    tags: RankedItem[];
    thumbnails: RankedItem[];
    comment: string;
}

interface Timestamps {
    hookStart: number;
    hookEnd: number;
    introStart: number;
    introEnd: number;
    mainStart: number;
    mainEnd: number;
    demoStart: number;
    demoEnd: number;
    outroStart: number;
    outroEnd: number;
}

interface ImagePrompt {
    id: number;
    timestamp: string;
    scene: string;
    description: string;
    style: string;
    mood: string;
    colorPalette: string;
    aspectRatio: string;
}

interface Chapter {
    timestamp: string;
    title: string;
    description: string;
}

interface BRollSuggestion {
    id: number;
    timestamp: string;
    scene: string;
    suggestion: string;
    source: string; // "stock", "screen", "animation", "self-record"
    searchTerms: string[];
}

interface ShortClip {
    id: number;
    title: string;
    hook: string;
    content: string;
    cta: string;
    originalTimestamp: string;
    viralScore: number;
}

type ActiveTab = "script" | "seo" | "images" | "chapters" | "broll" | "shorts";

interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOrderResponse {
    keyId: string;
    amount: number;
    currency: string;
    orderId: string;
    businessName?: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayPaymentResponse) => void;
    prefill?: {
        email?: string | null;
        name?: string | null;
    };
    theme?: { color: string };
}

type RazorpayConstructor = new (options: RazorpayOptions) => { open: () => void };

// Tone options
const tones = [
    { value: "casual", label: "Casual Friend" },
    { value: "professional", label: "Professional" },
    { value: "humorous", label: "Humorous" },
    { value: "motivational", label: "Motivational" },
    { value: "storytelling", label: "Storytelling" },
];

// Language options
const languages = [
    { value: "English", label: "English (Global)" },
    { value: "Tamil", label: "Pure Tamil" },
    { value: "Thanglish", label: "Thanglish (Tamil + English)" },
    { value: "Hindi", label: "Hindi / Hinglish" },
];

// Image format options
const imageFormats = [
    { value: "landscape", label: "Landscape (16:9) - YouTube/Full Screen" },
    { value: "portrait", label: "Portrait (9:16) - Shorts/Reels/TikTok" },
    { value: "square", label: "Square (1:1) - Instagram/Thumbnails" },
];

const STORAGE_KEY = "scriptgen:lastState";

// Script templates - quick start presets
const scriptTemplates = [
    { id: "tutorial", label: "Tutorial", formData: { contentType: "Tutorial", duration: 10, tone: "casual", difficulty: "Beginner", titlePlaceholder: "e.g., How to use React useState" } },
    { id: "review", label: "Product Review", formData: { contentType: "Review", duration: 8, tone: "professional", difficulty: "Beginner", titlePlaceholder: "e.g., iPhone 16 Pro review after 1 month" } },
    { id: "explainer", label: "Explainers", formData: { contentType: "Educational", duration: 12, tone: "professional", difficulty: "Intermediate", titlePlaceholder: "e.g., What is API and how it works" } },
    { id: "vlog", label: "Vlog / Storytelling", formData: { contentType: "Vlog", duration: 8, tone: "casual", difficulty: "Beginner", titlePlaceholder: "e.g., A day in my life as a creator" } },
    { id: "ad", label: "Ad / Promo", formData: { contentType: "Entertainment", duration: 2, tone: "humorous", difficulty: "Beginner", titlePlaceholder: "e.g., Introducing our new product launch" } },
];

export default function ScriptGenerator() {
    // Form state
    const [formData, setFormData] = useState<FormData>({
        title: "",
        channelName: "",
        duration: 10,
        contentType: "Tutorial",
        difficulty: "Beginner",
        tone: "casual",
        language: "English",
        includeCode: false,
        localContext: false,
        generateImages: true,
        includeChapters: true,
        includeBRoll: true,
        includeShorts: true,
        imageFormat: "landscape",
    });

    // Output state
    const [script, setScript] = useState<string>("");
    const [hookSection, setHookSection] = useState<string>("");
    const [mainSection, setMainSection] = useState<string>("");
    const [demoSection, setDemoSection] = useState<string>("");
    const [productionNotesSection, setProductionNotesSection] = useState<string>("");
    const [seoData, setSeoData] = useState<SEOData | null>(null);
    const [imagesData, setImagesData] = useState<ImagePrompt[] | null>(null);
    const [chaptersData, setChaptersData] = useState<Chapter[] | null>(null);
    const [brollData, setBrollData] = useState<BRollSuggestion[] | null>(null);
    const [shortsData, setShortsData] = useState<ShortClip[] | null>(null);

    // UI state
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);
    const [copiedImageId, setCopiedImageId] = useState<number | null>(null);
    const [copiedItem, setCopiedItem] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>("script");
    const [error, setError] = useState<string>("");
    const [hasSavedState, setHasSavedState] = useState<boolean>(false);
    const generationAbortRef = useRef<AbortController | null>(null);

    // Auth and token state
    const { data: session } = useSession();
    const [credits, setCredits] = useState<{
        freeTokensUsed: number;
        freeTokensRemaining: number;
        paidTokens: number;
        canGenerate: boolean;
    } | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [processingPayment, setProcessingPayment] = useState<boolean>(false);
    const [selectedPackageId, setSelectedPackageId] = useState<string>("pro");
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState<string>("");
    const [promoLoading, setPromoLoading] = useState<boolean>(false);
    const [promoMessage, setPromoMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [referralLink, setReferralLink] = useState<string>("");
    const [referralLinkLoading, setReferralLinkLoading] = useState<boolean>(false);
    const [referralLinkError, setReferralLinkError] = useState<boolean>(false);
    const [referralCode, setReferralCode] = useState<string>("");
    const [referralCopied, setReferralCopied] = useState<boolean>(false);
    const [referralShared, setReferralShared] = useState<boolean>(false);
    const [canShare, setCanShare] = useState<boolean>(false);
    const [referralApplyCode, setReferralApplyCode] = useState<string>("");
    const [referralApplyLoading, setReferralApplyLoading] = useState<boolean>(false);
    const [referralApplyMessage, setReferralApplyMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const searchParams = useSearchParams();

    const tokenPackages = [
        { id: "starter", name: "Starter", tokens: 100, price: 149 },
        { id: "plus", name: "Plus", tokens: 250, price: 299 },
        { id: "growth", name: "Growth", tokens: 500, price: 499 },
        { id: "pro", name: "Pro", tokens: 1000, price: 899 },
        { id: "scale", name: "Scale", tokens: 2500, price: 1999 },
        { id: "enterprise", name: "Enterprise", tokens: 5000, price: 3499 },
    ];
    const tokenBreakdown = [
        { label: "Core script", tokens: 10 },
        { label: "SEO pack", tokens: 10 },
        { label: "Image prompts", tokens: 10 },
        { label: "Chapters", tokens: 10 },
        { label: "B-roll", tokens: 10 },
        { label: "Shorts", tokens: 10 },
    ];

    // Clean script: remove bullet symbols and unwanted characters for display and export
    const sanitizeScriptText = (text: string): string => {
        if (!text || typeof text !== "string") return text;
        return text
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width chars
            .split("\n")
            .map((line) => {
                const trimmed = line.trimEnd();
                // Remove only leading bullet symbols (• * ◆ ▪ ▸ ► ◦) and dash bullet
                return trimmed.replace(/^[\s]*[•*◆▪▸►◦]\s*/, "").replace(/^[\s]*-\s+/, "");
            })
            .join("\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
    };

    // Translation state
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [showTranslateDropdown, setShowTranslateDropdown] = useState<boolean>(false);
    const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false);

    // Script history state
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const [scriptHistory, setScriptHistory] = useState<{
        id: string;
        title: string;
        channel_name: string;
        duration: number;
        content_type: string;
        created_at: string;
    }[]>([]);
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

    const normalizeContentType = (value?: string) => {
        if (!value) return value;
        const key = value.toLowerCase();
        const map: Record<string, string> = {
            tutorial: "Tutorial",
            review: "Review",
            vlog: "Vlog",
            educational: "Educational",
            entertainment: "Entertainment",
        };
        return map[key] || value;
    };

    const normalizeDifficulty = (value?: string) => {
        if (!value) return value;
        const key = value.toLowerCase();
        const map: Record<string, string> = {
            beginner: "Beginner",
            intermediate: "Intermediate",
            advanced: "Advanced",
        };
        return map[key] || value;
    };

    const isActiveTab = (value: string): value is ActiveTab =>
        ["script", "seo", "images", "chapters", "broll", "shorts"].includes(value);

    const getErrorMessage = (err: unknown, fallback: string) =>
        err instanceof Error ? err.message : fallback;

    const isAbortError = (err: unknown) =>
        typeof err === "object" &&
        err !== null &&
        "name" in err &&
        (err as { name?: string }).name === "AbortError";

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed?.formData) {
                    const normalizedFormData = {
                        ...parsed.formData,
                        contentType: normalizeContentType(parsed.formData.contentType),
                        difficulty: normalizeDifficulty(parsed.formData.difficulty),
                    };
                    setFormData((prev) => ({ ...prev, ...normalizedFormData }));
                }
                if (typeof parsed?.script === "string") setScript(sanitizeScriptText(parsed.script));
                if (parsed?.seoData) setSeoData(parsed.seoData);
                if (parsed?.imagesData) setImagesData(parsed.imagesData);
                if (parsed?.chaptersData) setChaptersData(parsed.chaptersData);
                if (parsed?.brollData) setBrollData(parsed.brollData);
                if (parsed?.shortsData) setShortsData(parsed.shortsData);
                if (parsed?.activeTab && isActiveTab(parsed.activeTab)) {
                    setActiveTab(parsed.activeTab);
                }
                setHasSavedState(true);
            }
        } catch (err) {
            console.error("Failed to load saved state:", err);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                        formData,
                        script,
                        seoData,
                        imagesData,
                        chaptersData,
                        brollData,
                        shortsData,
                        activeTab
                    })
                );
                setHasSavedState(true);
            } catch (err) {
                console.error("Failed to save state:", err);
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [formData, script, seoData, imagesData, chaptersData, brollData, shortsData, activeTab]);

    const clearSavedState = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setHasSavedState(false);
        } catch (err) {
            console.error("Failed to clear saved state:", err);
        }
    };

    // Fetch tokens when session changes
    useEffect(() => {
        const fetchCredits = async () => {
            if (session?.user) {
                try {
                    const res = await fetch("/api/credits");
                    if (res.ok) {
                        const data = await res.json();
                        setCredits(data);
                    }
                } catch (err) {
                    console.error("Failed to fetch tokens:", err);
                }
            }
        };
        fetchCredits();
    }, [session]);

    // Fetch script history
    const fetchHistory = async () => {
        if (!session) return;
        setLoadingHistory(true);
        try {
            const res = await fetch("/api/scripts");
            if (res.ok) {
                const data = await res.json();
                setScriptHistory(data.scripts || []);
            }
        } catch (err) {
            console.error("Failed to fetch history:", err);
        } finally {
            setLoadingHistory(false);
        }
    };

    // Load a previous script
    const loadScript = async (scriptId: string) => {
        try {
            const res = await fetch(`/api/scripts/${scriptId}`);
            if (res.ok) {
                const data = await res.json();
                const s = data.script;
                // Populate form and outputs
                setFormData({
                    ...formData,
                    title: s.title || "",
                    channelName: s.channel_name || "",
                    duration: s.duration || 10,
                    contentType: normalizeContentType(s.content_type) || "Tutorial",
                });
                setScript(sanitizeScriptText(s.script_content || ""));
                setHookSection("");
                setMainSection("");
                setDemoSection("");
                setProductionNotesSection("");
                setSeoData(s.seo_data || null);
                setImagesData(s.images_data || null);
                setChaptersData(s.chapters_data || null);
                setBrollData(s.broll_data || null);
                setShortsData(s.shorts_data || null);
                setShowHistory(false);
                setActiveTab("script");
            }
        } catch (err) {
            console.error("Failed to load script:", err);
        }
    };

    // Delete a script
    const deleteScript = async (scriptId: string) => {
        if (!confirm("Delete this script?")) return;
        try {
            const res = await fetch(`/api/scripts/${scriptId}`, { method: "DELETE" });
            if (res.ok) {
                setScriptHistory(scriptHistory.filter(s => s.id !== scriptId));
            }
        } catch (err) {
            console.error("Failed to delete script:", err);
        }
    };

    // Calculate required tokens
    const calculateRequiredTokens = () => {
        let cost = 10; // Base script
        if (formData.generateImages) cost += 10;
        if (formData.includeChapters) cost += 10;
        if (formData.includeBRoll) cost += 10;
        if (formData.includeShorts) cost += 10;
        return cost;
    };

    // Fetch referral link when modal opens (logged-in user)
    useEffect(() => {
        if (!session || !showPaymentModal) return;
        if (referralLink) {
            setReferralLinkError(false);
            return;
        }
        setReferralLinkLoading(true);
        setReferralLinkError(false);
        fetch("/api/referral")
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data?.link) setReferralLink(data.link);
                if (data?.code) setReferralCode(data.code);
                setReferralLinkError(!data?.link);
            })
            .catch(() => setReferralLinkError(true))
            .finally(() => setReferralLinkLoading(false));
    }, [session, showPaymentModal, referralLink]);

    // Reset referral link state when modal closes (refetch on next open)
    useEffect(() => {
        if (!showPaymentModal) {
            setReferralLink("");
            setReferralLinkError(false);
            setReferralApplyMessage(null);
        }
    }, [showPaymentModal]);

    // Pre-fill referral code from ?ref param
    useEffect(() => {
        const ref = searchParams?.get("ref");
        if (ref && !referralApplyCode) setReferralApplyCode(String(ref).toUpperCase());
    }, [searchParams, referralApplyCode]);

    useEffect(() => {
        setCanShare(typeof navigator !== "undefined" && !!navigator.share);
    }, []);

    const handleCopyReferralLink = async () => {
        if (!referralLink) return;
        await navigator.clipboard.writeText(referralLink);
        setReferralCopied(true);
        setTimeout(() => setReferralCopied(false), 2000);
    };

    const handleShareReferralLink = async () => {
        if (!referralLink) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "ScriptGen - AI YouTube Script Generator",
                    text: "Get 15 free tokens when you sign up with my referral link!",
                    url: referralLink,
                });
                setReferralShared(true);
                setTimeout(() => setReferralShared(false), 2000);
            } catch (err) {
                if ((err as Error).name !== "AbortError") handleCopyReferralLink();
            }
        } else {
            handleCopyReferralLink();
        }
    };

    const handleReferralApply = async () => {
        if (!referralApplyCode.trim()) {
            setReferralApplyMessage({ type: "error", text: "Please enter a referral code" });
            return;
        }
        setReferralApplyLoading(true);
        setReferralApplyMessage(null);
        try {
            const res = await fetch("/api/referral", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: referralApplyCode.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                setReferralApplyMessage({ type: "success", text: data.message || `You both got 15 tokens!` });
                setReferralApplyCode("");
                const creditsRes = await fetch("/api/credits");
                if (creditsRes.ok) setCredits(await creditsRes.json());
            } else {
                setReferralApplyMessage({ type: "error", text: data.error || "Invalid referral code" });
            }
        } catch {
            setReferralApplyMessage({ type: "error", text: "Failed to apply referral code" });
        } finally {
            setReferralApplyLoading(false);
        }
    };

    // Handle payment
    const handlePromoCode = async () => {
        if (!promoCode.trim()) {
            setPromoMessage({ type: "error", text: "Please enter a promo code" });
            return;
        }

        setPromoLoading(true);
        setPromoMessage(null);

        try {
            const res = await fetch("/api/promo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: promoCode.trim() }),
            });

            const data = await res.json();

            if (res.ok) {
                setPromoMessage({ type: "success", text: `Success! ${data.tokensAdded} tokens added 🎉` });
                setPromoCode("");
                
                // Refresh credits
                const creditsRes = await fetch("/api/credits");
                if (creditsRes.ok) {
                    setCredits(await creditsRes.json());
                }
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    setShowPaymentModal(false);
                    setPromoMessage(null);
                }, 2000);
            } else {
                setPromoMessage({ type: "error", text: data.error || "Invalid promo code" });
            }
        } catch (err) {
            console.error("Promo code error:", err);
            setPromoMessage({ type: "error", text: "Failed to redeem promo code" });
        } finally {
            setPromoLoading(false);
        }
    };

    const handlePayment = async () => {
        setProcessingPayment(true);
        const selected = tokenPackages.find((pkg) => pkg.id === selectedPackageId) || tokenPackages[2];

        try {
            const res = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ packageId: selected.id }),
            });
            const order: RazorpayOrderResponse = await res.json();

            const options: RazorpayOptions = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: order.businessName || "ScriptGen",
                description: `${selected.tokens} Tokens`,
                order_id: order.orderId,
                handler: async (response: RazorpayPaymentResponse) => {
                    // Verify payment
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    if (verifyRes.ok) {
                        const creditsRes = await fetch("/api/credits");
                        if (creditsRes.ok) {
                            setCredits(await creditsRes.json());
                        }
                        setShowPaymentModal(false);
                        setToastMessage("Tokens added!");
                        setTimeout(() => setToastMessage(null), 2500);
                    }
                },
                prefill: {
                    email: session?.user?.email,
                    name: session?.user?.name,
                },
                theme: { color: "#2563eb" },
            };

            const RazorpayCtor = (window as Window & { Razorpay?: RazorpayConstructor }).Razorpay;
            if (!RazorpayCtor) throw new Error("Payment SDK unavailable");
            const razorpay = new RazorpayCtor(options);
            razorpay.open();
        } catch (err) {
            console.error("Payment failed:", err);
            setError(getErrorMessage(err, "Payment failed"));
        } finally {
            setProcessingPayment(false);
        }
    };


    // Calculate timestamps based on duration
    const generateTimestamps = (durationMinutes: number): Timestamps => {
        const totalSeconds = durationMinutes * 60;

        // Hook: 4%, Intro: 8%, Main: 58%, Demo: 18%, Outro: 12%
        const hookEnd = Math.round(totalSeconds * 0.04);
        const introEnd = Math.round(totalSeconds * 0.12); // 4% + 8%
        const mainEnd = Math.round(totalSeconds * 0.70); // 4% + 8% + 58%
        const demoEnd = Math.round(totalSeconds * 0.88); // 4% + 8% + 58% + 18%
        const outroEnd = totalSeconds;

        return {
            hookStart: 0,
            hookEnd,
            introStart: hookEnd,
            introEnd,
            mainStart: introEnd,
            mainEnd,
            demoStart: mainEnd,
            demoEnd,
            outroStart: demoEnd,
            outroEnd,
        };
    };

    // API call to generate a section
    const generateSection = async (
        stage: string,
        timestamps: Timestamps,
        previousContent: string = "",
        signal?: AbortSignal
    ): Promise<string> => {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
                type: "section",
                stage,
                formData,
                timestamps,
                previousContent
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to generate section");
        }

        const data = await response.json();
        return data.content;
    };

    // Regenerate a single section (hook, main, or demo) - costs 10 tokens
    const REGEN_TOKEN_COST = 10;
    const regenerateSection = async (stage: "hook_intro" | "main_content" | "demo_outro") => {
        if (!session || !script) return;
        const available = (credits?.freeTokensRemaining || 0) + (credits?.paidTokens || 0);
        if (available < REGEN_TOKEN_COST) {
            setShowPaymentModal(true);
            return;
        }
        setError("");
        setLoading(true);
        setProgress(`Regenerating ${stage === "hook_intro" ? "Hook" : stage === "main_content" ? "Main" : "Demo & Outro"}...`);
        try {
            const timestamps = generateTimestamps(formData.duration);
            let previousContent = "";
            if (stage === "main_content") previousContent = hookSection;
            if (stage === "demo_outro") previousContent = hookSection + (mainSection ? "\n\n" + mainSection : "");

            const newContent = await generateSection(stage, timestamps, previousContent);
            const cleaned = sanitizeScriptText(newContent);

            if (stage === "hook_intro") setHookSection(cleaned);
            if (stage === "main_content") setMainSection(cleaned);
            if (stage === "demo_outro") setDemoSection(cleaned);

            const notesPart = productionNotesSection ? "\n\n" + productionNotesSection : "";
            const full =
                stage === "hook_intro"
                    ? cleaned + (mainSection ? "\n\n" + mainSection : "") + (demoSection ? "\n\n" + demoSection : "") + notesPart
                    : stage === "main_content"
                        ? hookSection + "\n\n" + cleaned + (demoSection ? "\n\n" + demoSection : "") + notesPart
                        : hookSection + (mainSection ? "\n\n" + mainSection : "") + "\n\n" + cleaned + notesPart;
            setScript(sanitizeScriptText(full));

            await fetch("/api/credits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ count: REGEN_TOKEN_COST }),
            });
            const creditsRes = await fetch("/api/credits");
            if (creditsRes.ok) setCredits(await creditsRes.json());
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Failed to regenerate. Please try again."));
        } finally {
            setLoading(false);
            setProgress("");
        }
    };

    // Main generate function
    const generateScript = async () => {
        if (!session) {
            alert("Please sign in to generate scripts");
            signIn("google", { callbackUrl: "/app" });
            return;
        }

        // Check tokens
        const requiredTokens = calculateRequiredTokens();
        const availableTokens = (credits?.freeTokensRemaining || 0) + (credits?.paidTokens || 0);

        if (availableTokens < requiredTokens) {
            setShowPaymentModal(true);
            return;
        }

        generationAbortRef.current?.abort();
        const controller = new AbortController();
        generationAbortRef.current = controller;

        setLoading(true);
        setError("");
        setProgress("Stage 1/6: Initializing & Generating Hook...");
        setScript("");
        setHookSection("");
        setMainSection("");
        setDemoSection("");
        setProductionNotesSection("");
        setSeoData(null);
        setImagesData(null);
        setChaptersData(null);
        setBrollData(null);
        setShortsData(null);
        setActiveTab("script"); // Reset to script tab

        try {
            // API Key is now handled securely on the server
            // const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;


            const timestamps = generateTimestamps(formData.duration);
            let fullScript = "";

            // Stage 1: Hook & Intro
            const hookIntro = sanitizeScriptText(await generateSection("hook_intro", timestamps, "", controller.signal));
            setHookSection(hookIntro);
            fullScript = hookIntro;
            setScript(fullScript);
            setProgress("Stage 2/6: Generating Main Content...");

            // Stage 2: Main Content
            const mainContent = sanitizeScriptText(await generateSection("main_content", timestamps, fullScript, controller.signal));
            setMainSection(mainContent);
            fullScript += "\n\n" + mainContent;
            setScript(fullScript);
            setProgress("Stage 3/6: Generating Demo & Outro...");

            // Stage 3: Demo & Outro
            const demoOutro = sanitizeScriptText(await generateSection("demo_outro", timestamps, fullScript, controller.signal));
            setDemoSection(demoOutro);
            fullScript += "\n\n" + demoOutro;
            setScript(fullScript);
            setProgress("Stage 4/6: Generating Production Notes...");

            // Stage 4: Production Notes
            const productionNotes = sanitizeScriptText(await generateProductionNotes(fullScript, controller.signal));
            setProductionNotesSection(productionNotes);
            fullScript += "\n\n" + productionNotes;
            setScript(fullScript);
            setProgress("Stage 5/6: Generating SEO & Media Assets...");

            // Stage 5: Generate SEO, Images, Chapters, B-Roll in parallel (capture results for save)
            const seoPromise = generateSEOData(fullScript, controller.signal).catch((e) => {
                console.error("SEO generation failed", e);
                return null;
            });
            const imagesPromise = formData.generateImages
                ? generateImagePrompts(fullScript, timestamps, controller.signal).catch((e) => {
                    console.error("Image prompts generation failed", e);
                    return null;
                })
                : Promise.resolve(null);
            const chaptersPromise = formData.includeChapters
                ? generateChapters(fullScript, timestamps, controller.signal).catch((e) => {
                    console.error("Chapters generation failed", e);
                    return null;
                })
                : Promise.resolve(null);
            const brollPromise = formData.includeBRoll
                ? generateBRoll(fullScript, timestamps, controller.signal).catch((e) => {
                    console.error("B-Roll generation failed", e);
                    return null;
                })
                : Promise.resolve(null);

            const [seoResult, imagesResult, chaptersResult, brollResult] = await Promise.all([
                seoPromise,
                imagesPromise,
                chaptersPromise,
                brollPromise,
            ]);

            if (seoResult) setSeoData(seoResult);
            if (imagesResult) setImagesData(imagesResult);
            if (chaptersResult) setChaptersData(chaptersResult);
            if (brollResult) setBrollData(brollResult);

            // Shorts (Sequential or if enabled)
            let shortsResult: typeof shortsData = null;
            if (formData.includeShorts) {
                setProgress("Stage 6/6: Generating Shorts Clips...");
                try {
                    shortsResult = await generateShorts(fullScript, controller.signal);
                    setShortsData(shortsResult);
                } catch {
                    console.error("Shorts generation failed");
                }
            } else {
                setProgress("Finalizing...");
            }

            // Deduct tokens after successful generation
            try {
                await fetch("/api/credits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ count: requiredTokens })
                });
                const creditsRes = await fetch("/api/credits");
                if (creditsRes.ok) setCredits(await creditsRes.json());
            } catch {
                console.error("Failed to deduct tokens");
            }

            // Save to history using captured results (not stale state)
            try {
                await fetch("/api/scripts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: formData.title,
                        channelName: formData.channelName,
                        duration: formData.duration,
                        contentType: formData.contentType,
                        scriptContent: fullScript,
                        seoData: seoResult ?? null,
                        imagesData: imagesResult ?? null,
                        chaptersData: chaptersResult ?? null,
                        brollData: brollResult ?? null,
                        shortsData: shortsResult ?? null,
                    }),
                });
            } catch {
                console.error("Failed to save to history");
            }

            setProgress("");
        } catch (err: unknown) {
            if (isAbortError(err)) {
                setProgress("Generation canceled.");
                return;
            }
            setError(getErrorMessage(err, "An error occurred while generating the script."));
        } finally {
            setLoading(false);
            generationAbortRef.current = null;
        }
    };

    const cancelGeneration = () => {
        if (generationAbortRef.current) {
            generationAbortRef.current.abort();
            setProgress("Canceling...");
        }
    };




    // Generate production notes
    const generateProductionNotes = async (
        fullScript: string,
        signal?: AbortSignal
    ): Promise<string> => {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
                type: "production_notes",
                formData,
                fullScript
            }),
        });

        if (!response.ok) throw new Error("Failed to generate production notes");
        const data = await response.json();
        return data.content;
    };

    // Generate SEO data (pass fullScript when available for better description/tags)
    const generateSEOData = async (fullScript: string, signal?: AbortSignal): Promise<SEOData> => {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
                type: "seo",
                formData,
                fullScript: fullScript || undefined,
            }),
        });


        if (!response.ok) {
            throw new Error("Failed to generate SEO data");
        }

        const data = await response.json();
        let text = (data.content || "").trim();

        const coerceRanked = (items: Array<string | { text: string; score?: number }>, fallbackScore = 80): RankedItem[] =>
            (Array.isArray(items) ? items : [])
                .map((item) => {
                    if (typeof item === "string") {
                        return { text: item.trim(), score: fallbackScore };
                    }
                    if (item && typeof item === "object" && "text" in item) {
                        return { text: String(item.text || "").trim(), score: Number(item.score) || fallbackScore };
                    }
                    return { text: "", score: fallbackScore };
                })
                .filter((item) => item.text.length > 0);

        const parseJsonSEO = (raw: string): SEOData | null => {
            let str = raw.trim();
            const codeBlockMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (codeBlockMatch) str = codeBlockMatch[1].trim();
            const objectMatch = str.match(/\{[\s\S]*\}/);
            if (objectMatch) str = objectMatch[0];
            try {
                const parsed = JSON.parse(str);
                if (parsed && typeof parsed === "object") {
                    const titles = coerceRanked(parsed.titles || [], 88);
                    const description = typeof parsed.description === "string" ? parsed.description.trim() : "";
                    const tags = coerceRanked(parsed.tags || [], 78);
                    const thumbnails = coerceRanked(parsed.thumbnails || [], 84);
                    const comment = typeof parsed.comment === "string" ? parsed.comment.trim() : "";
                    if (titles.length > 0 || description || tags.length > 0 || thumbnails.length > 0 || comment) {
                        return { titles, description, tags, thumbnails, comment };
                    }
                }
            } catch {
                // fall through to legacy parsing
            }
            return null;
        };

        const parsedJson = parseJsonSEO(text);
        if (parsedJson) return parsedJson;

        // Parse the SEO data (legacy text format)
        const titlesMatch = text.match(/TITLES:\n([\s\S]*?)(?=\n\nDESCRIPTION:)/);
        const descMatch = text.match(/DESCRIPTION:\n([\s\S]*?)(?=\n\nTAGS:)/);
        const tagsMatch = text.match(/TAGS:\n([\s\S]*?)(?=\n\nTHUMBNAILS:)/);
        const thumbMatch = text.match(/THUMBNAILS:\n([\s\S]*?)(?=\n\nCOMMENT:)/);
        const commentMatch = text.match(/COMMENT:\n([\s\S]*?)$/);

        const titles = titlesMatch
            ? titlesMatch[1]
                .split("\n")
                .filter((line: string) => line.match(/^\d+\./))
                .map((line: string) => ({
                    text: line.replace(/^\d+\.\s*/, "").trim(),
                    score: 80,
                }))
            : [];

        const thumbnails = thumbMatch
            ? thumbMatch[1]
                .split("\n")
                .filter((line: string) => line.match(/^\d+\./))
                .map((line: string) => ({
                    text: line.replace(/^\d+\.\s*/, "").trim(),
                    score: 80,
                }))
            : [];

        const tags = tagsMatch
            ? tagsMatch[1]
                .trim()
                .split(",")
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag.length > 0)
                .map((tag: string) => ({ text: tag, score: 75 }))
            : [];

        return {
            titles,
            description: descMatch ? descMatch[1].trim() : "",
            tags,
            thumbnails,
            comment: commentMatch ? commentMatch[1].trim() : "",
        };
    };

    // Generate Image Prompts
    const generateImagePrompts = async (
        fullScript: string,
        timestamps: Timestamps,
        signal?: AbortSignal
    ): Promise<ImagePrompt[]> => {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
                type: "image_prompts",
                formData,
                fullScript,
                timestamps
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate image prompts");
        }

        const data = await response.json();
        const text = data.content || "";

        // Parse JSON response
        try {
            // Clean the response - remove any markdown code blocks if present
            const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
            const imagePrompts: ImagePrompt[] = JSON.parse(cleanedText);
            return imagePrompts;
        } catch {
            console.error("Failed to parse image prompts JSON:", text);
            // Return a fallback structure
            return [];
        }
    };

    // Generate YouTube Chapters
    const generateChapters = async (
        fullScript: string,
        timestamps: Timestamps,
        signal?: AbortSignal
    ): Promise<Chapter[]> => {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
                type: "chapters",
                formData,
                fullScript,
                timestamps
            }),
        });

        if (!response.ok) throw new Error("Failed to generate chapters");

        const data = await response.json();
        const text = data.content || "";
        try {
            return JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
        } catch {
            return [];
        }
    };

    // Generate B-Roll Suggestions
    const generateBRoll = async (
        fullScript: string,
        timestamps: Timestamps,
        signal?: AbortSignal
    ): Promise<BRollSuggestion[]> => {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
                type: "broll",
                formData,
                fullScript,
                timestamps
            }),
        });

        if (!response.ok) throw new Error("Failed to generate B-Roll");

        const data = await response.json();
        const text = data.content || "";
        try {
            const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
            if (Array.isArray(parsed)) return parsed;
            const arr = parsed?.items ?? parsed?.broll ?? parsed?.suggestions;
            return Array.isArray(arr) ? arr : [];
        } catch {
            return [];
        }
    };

    // Generate Shorts/Clips
    const generateShorts = async (
        fullScript: string,
        signal?: AbortSignal
    ): Promise<ShortClip[]> => {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
                type: "shorts",
                formData,
                fullScript
            }),
        });

        if (!response.ok) throw new Error("Failed to generate Shorts");

        const data = await response.json();
        const text = data.content || "";
        try {
            const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
            if (Array.isArray(parsed)) return parsed;
            const arr = parsed?.items ?? parsed?.shorts ?? parsed?.clips;
            return Array.isArray(arr) ? arr : [];
        } catch {
            return [];
        }
    };

    // Copy image prompt to clipboard
    const copyImagePrompt = async (prompt: ImagePrompt) => {
        const fullPrompt = `${prompt.description}

Style: ${prompt.style}
Mood: ${prompt.mood}
Colors: ${prompt.colorPalette}
Aspect Ratio: ${prompt.aspectRatio}`;

        try {
            await navigator.clipboard.writeText(fullPrompt);
            setCopiedImageId(prompt.id);
            setToastMessage("Copied!");
            setTimeout(() => { setCopiedImageId(null); setToastMessage(null); }, 2000);
        } catch {
            setError("Failed to copy to clipboard");
        }
    };

    // Generic copy function
    const copyToClipboardGeneric = async (text: string, itemId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedItem(itemId);
            setToastMessage("Copied!");
            setTimeout(() => { setCopiedItem(null); setToastMessage(null); }, 2000);
        } catch {
            setError("Failed to copy to clipboard");
        }
    };




    // Copy to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(script);
            setCopied(true);
            setToastMessage("Copied!");
            setTimeout(() => { setCopied(false); setToastMessage(null); }, 2000);
        } catch {
            setError("Failed to copy to clipboard");
        }
    };

    // Download as text file
    const downloadScript = () => {
        const blob = new Blob([script], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${formData.title.replace(/[^a-zA-Z0-9]/g, "_")}_script.txt`;
        document.body.appendChild(a);
        URL.revokeObjectURL(url);
    };

    // Download as PDF
    const downloadAsPDF = async () => {
        const { jsPDF } = await import("jspdf");
        const doc = new jsPDF();
        const lineHeight = 7;
        let y = 20;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        const maxLineWidth = doc.internal.pageSize.width - margin * 2;

        // Title
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text(formData.title || "YouTube Script", margin, y);
        y += 10;

        // Metadata
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Channel: ${formData.channelName} | Duration: ${formData.duration}min | Type: ${formData.contentType}`, margin, y);
        y += 15;

        // Line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, maxLineWidth + margin, y);
        y += 10;

        // Content
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        const splitText = doc.splitTextToSize(script, maxLineWidth);

        splitText.forEach((line: string) => {
            if (y > pageHeight - margin) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, margin, y);
            y += lineHeight;
        });

        // Add Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${i} of ${pageCount} - Generated by ScriptGen`, margin, pageHeight - 10);
        }

        doc.save(`${formData.title.replace(/[^a-zA-Z0-9]/g, "_")}_script.pdf`);
        setShowExportDropdown(false);
    };

    // Download as SRT (subtitles/captions)
    const downloadAsSRT = () => {
        const paragraphs = script.split(/\n{2,}/).filter((p) => p.trim());
        const totalSeconds = formData.duration * 60;
        const secPerParagraph = paragraphs.length > 0 ? totalSeconds / paragraphs.length : 4;
        const formatSRTTime = (sec: number) => {
            const h = Math.floor(sec / 3600);
            const m = Math.floor((sec % 3600) / 60);
            const s = Math.floor(sec % 60);
            const ms = Math.floor((sec % 1) * 1000);
            return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")},${ms.toString().padStart(3, "0")}`;
        };
        const srtLines: string[] = [];
        let currentTime = 0;
        paragraphs.forEach((para, i) => {
            const nextTime = Math.min(currentTime + secPerParagraph, totalSeconds);
            srtLines.push(`${i + 1}`);
            srtLines.push(`${formatSRTTime(currentTime)} --> ${formatSRTTime(nextTime)}`);
            srtLines.push(para.trim().replace(/\n/g, " "));
            srtLines.push("");
            currentTime = nextTime;
        });
        const blob = new Blob([srtLines.join("\n")], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${formData.title.replace(/[^a-zA-Z0-9]/g, "_")}_captions.srt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setShowExportDropdown(false);
    };

    // Download as Word Doc
    const downloadAsDOC = () => {
        const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        const postHtml = "</body></html>";

        // Convert newlines to breaks for HTML
        const htmlContent = `
            <h1>${formData.title}</h1>
            <p><strong>Channel:</strong> ${formData.channelName} | <strong>Duration:</strong> ${formData.duration}min</p>
            <hr/>
            <div style="font-family: Arial, sans-serif; white-space: pre-wrap;">
                ${script.replace(/\n/g, '<br/>')}
            </div>
        `;

        const html = preHtml + htmlContent + postHtml;
        const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);

        if (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1) {
            downloadLink.setAttribute("target", "_blank");
        }

        downloadLink.href = url;
        downloadLink.download = `${formData.title.replace(/[^a-zA-Z0-9]/g, "_")}_script.doc`;
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setShowExportDropdown(false);
    };

    // Translate Script
    const translateScript = async (targetLanguage: string) => {
        if (!script || !session) return;

        setIsTranslating(true);
        setShowTranslateDropdown(false);
        setError("");

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "translate",
                    formData,
                    targetLanguage,
                    fullScript: script
                }),
            });

            if (!response.ok) throw new Error("Translation failed");

            const data = await response.json();
            const translatedScript = data.content || "";

            setScript(sanitizeScriptText(translatedScript));

            // Auto-update language setting visually (optional, but good for UX)
            // setFormData({...formData, language: targetLanguage}); 

        } catch (err: unknown) {
            setError(getErrorMessage(err, "Translation failed. Please try again."));
        } finally {
            setIsTranslating(false);
        }
    };

    const requiredTokens = calculateRequiredTokens();
    const totalTokens = credits ? credits.freeTokensRemaining + credits.paidTokens : 0;
    const estimatedWords = Math.round(formData.duration * 130);
    const tabs: { id: ActiveTab; label: string }[] = [
        { id: "script", label: "Script" },
        { id: "seo", label: "SEO" },
        { id: "images", label: "Images" },
        { id: "chapters", label: "Chapters" },
        { id: "broll", label: "B-Roll" },
        { id: "shorts", label: "Shorts" },
    ];

    return (
        <div className="min-h-screen bg-white">
            <script src="https://checkout.razorpay.com/v1/checkout.js" async />

            {toastMessage && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 text-sm shadow-lg animate-fade-in"
                >
                    <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        {toastMessage}
                    </span>
                </div>
            )}

            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4">
                    <div className="bg-white w-full max-w-md max-h-[92vh] sm:max-h-[90vh] border border-gray-200 flex flex-col overflow-hidden sm:rounded-xl shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">Recharge Tokens</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 text-gray-500 hover:text-gray-900 rounded-md transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                Secure payment via Razorpay. Card details are never stored.
                            </p>
                            <div className="text-sm text-gray-600 space-y-2">
                                <p>Script: 10 tokens. Each feature: +10 tokens.</p>
                                <div className="space-y-1 text-xs">
                                    {tokenBreakdown.map((item) => (
                                        <div key={item.label} className="flex justify-between">
                                            <span>{item.label}</span>
                                            <span className="text-gray-900 font-medium">{item.tokens}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                {tokenPackages.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        onClick={() => setSelectedPackageId(pkg.id)}
                                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                            selectedPackageId === pkg.id
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{pkg.name}</p>
                                                <p className="text-xs text-gray-500">{pkg.tokens} tokens</p>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">₹{pkg.price}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handlePayment}
                                disabled={processingPayment}
                                className="w-full py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-colors"
                            >
                                {processingPayment ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Pay with Razorpay"}
                            </button>
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                    <Tag className="w-3.5 h-3.5" />
                                    Promo code
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && handlePromoCode()}
                                        placeholder="Enter code"
                                        className="flex-1 min-w-0 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={handlePromoCode}
                                        disabled={promoLoading || !promoCode.trim()}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 transition-colors"
                                    >
                                        {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                    </button>
                                </div>
                                {promoMessage && (
                                    <div className={`mt-2 p-2 rounded-lg text-xs ${
                                        promoMessage.type === "success"
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                    }`}>
                                        {promoMessage.text}
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 border-t border-gray-200 space-y-3">
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Share2 className="w-3.5 h-3.5" />
                                    Invite friends, get 15 tokens each
                                </p>
                                {referralLink ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={referralLink}
                                            className="flex-1 min-w-0 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-600 truncate"
                                            aria-label="Your referral link"
                                        />
                                        <button onClick={handleCopyReferralLink} className="px-3 py-2 text-xs font-medium text-white bg-gray-700 hover:bg-gray-800 rounded-lg flex-shrink-0" title="Copy">
                                            {referralCopied ? <Check className="w-4 h-4" /> : "Copy"}
                                        </button>
                                        {canShare && (
                                            <button onClick={handleShareReferralLink} className="px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex-shrink-0" title="Share">
                                                {referralShared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                                            </button>
                                        )}
                                    </div>
                                ) : referralLinkError ? (
                                    <p className="text-xs text-amber-600">Could not load referral link.</p>
                                ) : referralLinkLoading ? (
                                    <p className="text-xs text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</p>
                                ) : null}
                                <p className="text-[11px] text-gray-500">{searchParams?.get("ref") ? "You have a referral code — apply below:" : "Have a referral code? Apply below:"}</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={referralApplyCode}
                                        onChange={(e) => setReferralApplyCode(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && handleReferralApply()}
                                        placeholder="Enter code"
                                        className="flex-1 min-w-0 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={handleReferralApply}
                                        disabled={referralApplyLoading || !referralApplyCode.trim()}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                                    >
                                        {referralApplyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                    </button>
                                </div>
                                {referralApplyMessage && (
                                    <p className={`text-xs ${referralApplyMessage.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
                                        {referralApplyMessage.text}
                                    </p>
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
                                <p>PCI DSS compliant · Instant delivery</p>
                                <a href="/refund-policy" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 underline underline-offset-1 mt-1 inline-block">
                                    Refund Policy
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showHistory && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl p-4 max-w-lg w-full max-h-[80vh] flex flex-col border border-gray-200 shadow-xl">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">History</h3>
                            <button onClick={() => setShowHistory(false)} className="p-2 text-gray-500 hover:text-gray-900 rounded-md">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loadingHistory ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : scriptHistory.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                    <p>No scripts yet</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {scriptHistory.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer group"
                                            onClick={() => loadScript(item.id)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate text-sm">{item.title}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                    <span>{item.duration} min</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteScript(item.id); }}
                                                className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <header className="app-bar fixed top-0 left-0 right-0 z-[var(--z-sticky)] bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <a href="/" className="flex items-center gap-2 text-slate-900 font-semibold text-lg tracking-tight">
                            <span className="text-blue-600">ScriptGen</span>
                        </a>
                        <span className="hidden sm:block h-5 w-px bg-slate-200" aria-hidden />
                        <span className="hidden sm:block text-sm font-medium text-slate-600">Script Generator</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {session ? (
                            <>
                                <button
                                    onClick={() => { setShowHistory(true); fetchHistory(); }}
                                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                    title="History"
                                >
                                    <History className="w-4 h-4" />
                                    <span className="hidden sm:inline">History</span>
                                </button>
                                {credits && (
                                    <button
                                        onClick={() => setShowPaymentModal(true)}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                    >
                                        <CreditCard className="w-4 h-4 text-slate-500" />
                                        <span>{totalTokens} tokens</span>
                                    </button>
                                )}
                                <span className="h-6 w-px bg-slate-200 mx-1" aria-hidden />
                                {session.user?.image ? (
                                    <Image src={session.user.image} alt="" width={32} height={32} className="w-8 h-8 rounded-full ring-2 ring-slate-100" unoptimized />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center ring-2 ring-slate-100">
                                        <User className="w-4 h-4 text-slate-600" />
                                    </div>
                                )}
                                <button onClick={() => signOut()} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Sign Out">
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => signIn("google", { callbackUrl: "/app" })}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all hover:shadow"
                            >
                                Sign in
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="pt-16 min-h-screen bg-slate-50/80">
                {!session ? (
                    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-16 bg-gradient-to-b from-slate-50/80 to-white">
                        <div className="w-full max-w-md surface-raised rounded-2xl p-10 text-center shadow-xl border border-slate-200/80">
                            <p className="text-overline mb-3">AI Script Generator</p>
                            <h1 className="text-headline text-slate-900 mb-3">Scripts that convert & scale</h1>
                            <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                                Professional, SEO-optimized YouTube scripts in seconds. Sign in to get 30 free tokens.
                            </p>
                            <div className="grid grid-cols-1 gap-3 text-left mb-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-blue-600" /></div>
                                    <span>Script, SEO, chapters, B-roll, Shorts</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"><Check className="w-4 h-4 text-blue-600" /></div>
                                    <span>English, Tamil, Thanglish, Hindi</span>
                                </div>
                            </div>
                            <button
                                onClick={() => signIn("google", { callbackUrl: "/app" })}
                                className="w-full py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-xl transition-all"
                            >
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
                        {/* Generator — enterprise card */}
                        <div className="w-full border-b border-slate-200 bg-white px-4 sm:px-6 py-6">
                            <div className="max-w-5xl mx-auto">
                                <div className="surface-raised surface-raised-hover p-6 sm:p-8 rounded-2xl space-y-6">
                                    <div>
                                        <p className="text-overline mb-2">Video topic</p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g. How to build a habit in 21 days"
                                                className="flex-1 min-w-0 px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base font-medium"
                                            />
                                            <button
                                                onClick={generateScript}
                                                disabled={loading || !formData.title.trim()}
                                                className="sm:w-auto w-full py-3.5 px-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 flex-shrink-0 shadow-sm hover:shadow"
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                {loading ? "Generating…" : "Generate script"}
                                            </button>
                                        </div>
                                        {loading && progress && (
                                            <p className="flex items-center gap-2 text-sm text-slate-500 mt-3">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                {progress}
                                            </p>
                                        )}
                                        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
                                    </div>

                                    <div className="border-t border-slate-200 pt-6">
                                        <p className="text-overline mb-3">Template & parameters</p>
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            {scriptTemplates.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setFormData({ ...formData, contentType: t.formData.contentType, duration: t.formData.duration, tone: t.formData.tone, difficulty: t.formData.difficulty })}
                                                    className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${formData.contentType === t.formData.contentType ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"}`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                {[5, 8, 10, 12, 15, 20].map(m => <option key={m} value={m}>{m} min</option>)}
                                            </select>
                                            <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                {languages.map(l => <option key={l.value} value={l.value}>{l.value}</option>)}
                                            </select>
                                            <select value={formData.tone} onChange={(e) => setFormData({ ...formData, tone: e.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize">
                                                {tones.map(t => <option key={t.value} value={t.value}>{t.value}</option>)}
                                            </select>
                                            <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 pt-6">
                                        <p className="text-overline mb-3">Add-ons</p>
                                        <div className="flex flex-wrap items-center gap-4">
                                            {[
                                                { key: "includeChapters", label: "Chapters", icon: List },
                                                { key: "includeBRoll", label: "B-Roll", icon: Film },
                                                { key: "includeShorts", label: "Shorts", icon: Scissors },
                                                { key: "generateImages", label: "Images", icon: ImageIcon },
                                                { key: "includeCode", label: "Code", icon: FileText },
                                            ].map(({ key, label, icon: Icon }) => (
                                                <label key={key} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
                                                    <input type="checkbox" checked={(formData as unknown as Record<string, boolean>)[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                    <Icon className="w-4 h-4 text-slate-400" />
                                                    {label}
                                                </label>
                                            ))}
                                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">{requiredTokens} tokens</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Output */}
                        <section className="flex-1 flex flex-col min-h-0 min-w-0 bg-white">
                            <div className="flex border-b border-slate-200 overflow-x-auto bg-white flex-shrink-0 px-4 sm:px-6">
                                <div className="max-w-5xl mx-auto w-full flex gap-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab === tab.id ? "text-blue-600 border-blue-600" : "text-slate-500 border-transparent hover:text-slate-900"}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                                </div>
                            </div>
                            <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6">
                                <div className="max-w-5xl mx-auto">
                                {activeTab === "script" ? (
                                    script ? (
                                        <div className="space-y-4">
                                            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setShowTranslateDropdown(!showTranslateDropdown)}
                                                            disabled={isTranslating}
                                                            className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors disabled:opacity-50"
                                                        >
                                                            {isTranslating ? "Translating…" : "Translate"}
                                                            <ChevronDown className="inline-block w-4 h-4 ml-1 align-middle" />
                                                        </button>
                                                        {showTranslateDropdown && (
                                                            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-20">
                                                                {languages.map((lang) => (
                                                                    <button
                                                                        key={lang.value}
                                                                        onClick={() => translateScript(lang.value)}
                                                                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                                    >
                                                                        {lang.label.split(" ")[0]}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {hookSection && (
                                                        <div className="flex gap-1.5 pl-2 border-l border-gray-200">
                                                            {(["hook_intro", "main_content", "demo_outro"] as const).map((stage) => (
                                                                <button
                                                                    key={stage}
                                                                    onClick={() => regenerateSection(stage)}
                                                                    disabled={loading}
                                                                    className="px-2 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 disabled:opacity-50"
                                                                    title={`Regenerate ${stage === "hook_intro" ? "Hook" : stage === "main_content" ? "Main" : "Outro"} (10 tokens)`}
                                                                >
                                                                    {stage === "hook_intro" ? "Hook" : stage === "main_content" ? "Main" : "Outro"}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <button
                                                        onClick={copyToClipboard}
                                                        className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white text-gray-600 hover:text-gray-900"
                                                    >
                                                        {copied ? "Copied" : "Copy"}
                                                    </button>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setShowExportDropdown(!showExportDropdown)}
                                                            className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white text-gray-600 hover:text-gray-900 flex items-center gap-1"
                                                        >
                                                            Export
                                                            <ChevronDown className="w-4 h-4" />
                                                        </button>
                                                        {showExportDropdown && (
                                                            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg border border-gray-200 shadow-lg py-1 z-20">
                                                                <button onClick={downloadAsPDF} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">PDF</button>
                                                                <button onClick={downloadAsDOC} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">Word</button>
                                                                <button onClick={() => { downloadScript(); setShowExportDropdown(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">Text</button>
                                                                <button onClick={downloadAsSRT} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900">SRT</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6 overflow-auto">
                                                <div
                                                    className="text-gray-800 text-[15px] leading-[1.75] tracking-tight whitespace-pre-wrap"
                                                    style={{ fontFamily: "var(--font-inter), ui-sans-serif, sans-serif" }}
                                                >
                                                    {script}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 text-sm">
                                            <FileText className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="font-medium text-gray-900">No script yet</p>
                                            <p className="mt-1">Enter a topic and click Generate</p>
                                        </div>
                                    )
                                ) : activeTab === "seo" ? (
                                    seoData ? (
                                        <div className="space-y-6">
                                            {/* Alternative Titles */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Alternative Titles</h3>
                                                <ul className="space-y-2">
                                                    {seoData.titles.map((title, index) => (
                                                        <li key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 flex items-center justify-between gap-3">
                                                            <span>{index + 1}. {title.text}</span>
                                                            <span className="text-xs text-blue-600 font-medium">Score {title.score}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Description</h3>
                                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                                                    {seoData.description}
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags ({seoData.tags.length})</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {seoData.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs flex items-center gap-2"
                                                        >
                                                            {tag.text}
                                                            <span className="text-[10px] text-blue-600">({tag.score})</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Thumbnail Suggestions */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 mb-3">Thumbnail Text Suggestions</h3>
                                                <ul className="space-y-2">
                                                    {seoData.thumbnails.map((thumb, index) => (
                                                        <li key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center justify-between gap-3">
                                                            <span>{index + 1}. {thumb.text}</span>
                                                            <span className="text-xs text-cyan-600 font-medium">Score {thumb.score}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* First Comment */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900 mb-3">First Comment to Pin</h3>
                                                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                                                    {seoData.comment}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 text-sm">
                                            <Search className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="font-medium text-gray-900">No SEO data yet</p>
                                            <p className="mt-1">Generate a script first</p>
                                        </div>
                                    )
                                ) : activeTab === "images" ? (
                                    imagesData && imagesData.length > 0 ? (
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">AI Image Prompts</h3>
                                                    <p className="text-sm text-gray-500">{imagesData.length} prompts generated for your video</p>
                                                </div>
                                            </div>

                                            {/* Image Prompt Cards */}
                                            <div className="space-y-4 max-h-[70vh] overflow-auto">
                                                {imagesData.map((prompt) => <div
                                                    key={prompt.id}
                                                    className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-blue-200 transition-colors group"
                                                >
                                                    {/* Header Row */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg">
                                                                {prompt.timestamp}
                                                            </span>
                                                            <span className={`px-2 py-1 text-xs font-medium rounded-lg ${prompt.scene === "Hook" ? "bg-amber-500/20 text-amber-400" :
                                                                prompt.scene === "Intro" ? "bg-blue-500/20 text-blue-400" :
                                                                    prompt.scene === "Main Content" ? "bg-amber-500/20 text-amber-400" :
                                                                        prompt.scene === "Demo" ? "bg-cyan-500/20 text-cyan-400" :
                                                                            "bg-gray-100 text-gray-600"
                                                                }`}>
                                                                {prompt.scene}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => copyImagePrompt(prompt)}
                                                            className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600"
                                                        >
                                                            {copiedImageId === prompt.id ? (
                                                                <>
                                                                    <Check className="w-3 h-3 text-green-400" />
                                                                    Copied!
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3 h-3" />
                                                                    Copy
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>

                                                    {/* Description */}
                                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed font-medium">
                                                        {prompt.description}
                                                    </p>

                                                    {/* Metadata Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                        <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                            <span className="text-xs text-gray-500 block mb-0.5">Style</span>
                                                            <span className="text-xs font-semibold text-gray-700">{prompt.style}</span>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                            <span className="text-xs text-gray-500 block mb-0.5">Mood</span>
                                                            <span className="text-xs font-semibold text-gray-700">{prompt.mood}</span>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                            <span className="text-xs text-gray-500 block mb-0.5">Colors</span>
                                                            <span className="text-xs font-semibold text-gray-700">{prompt.colorPalette}</span>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-2 border border-gray-200">
                                                            <span className="text-xs text-gray-500 block mb-0.5">Ratio</span>
                                                            <span className="text-xs font-semibold text-gray-700">{prompt.aspectRatio}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 text-sm">
                                            <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="font-medium text-gray-900">No image prompts yet</p>
                                            <p className="mt-1">Generate a script first</p>
                                        </div>
                                    )
                                ) : activeTab === "chapters" ? (
                                    chaptersData && chaptersData.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">YouTube Chapters</h3>
                                                    <p className="text-sm text-gray-500">Copy and paste into your video description</p>
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboardGeneric(
                                                        chaptersData.map(c => `${c.timestamp} ${c.title}`).join('\n'),
                                                        'all-chapters'
                                                    )}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                                >
                                                    {copiedItem === 'all-chapters' ? (
                                                        <><Check className="w-4 h-4" /> Copied!</>
                                                    ) : (
                                                        <><Copy className="w-4 h-4" /> Copy All</>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4 overflow-auto border border-gray-200">
                                                <pre className="text-gray-800 text-sm font-mono leading-relaxed">
                                                    {chaptersData.map(c => `${c.timestamp} ${c.title}`).join('\n')}
                                                </pre>
                                            </div>

                                            <div className="space-y-2 mt-4">
                                                {chaptersData.map((chapter, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-mono rounded-lg border border-blue-200">
                                                            {chapter.timestamp}
                                                        </span>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900">{chapter.title}</p>
                                                            <p className="text-xs text-gray-500">{chapter.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 text-sm">
                                            <List className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="font-medium text-gray-900">No chapters yet</p>
                                            <p className="mt-1">Generate a script first</p>
                                        </div>
                                    )
                                ) : activeTab === "broll" ? (
                                    brollData && brollData.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">B-Roll Suggestions</h3>
                                                    <p className="text-sm text-gray-500">{brollData.length} clips suggested for your video</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 max-h-[70vh] overflow-auto">
                                                {brollData.map((broll) => (
                                                    <div key={broll.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-cyan-200 transition-colors">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-lg border border-cyan-500/20">
                                                                    {broll.timestamp}
                                                                </span>
                                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${broll.source === "stock" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                                    broll.source === "screen" ? "bg-violet-500/10 text-violet-400 border-violet-500/20" :
                                                                        broll.source === "animation" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                                    }`}>
                                                                    {broll.source}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-700 mb-3">{broll.suggestion}</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {broll.searchTerms.map((term, i) => (
                                                                <span key={i} className="px-2 py-1 bg-white text-gray-600 text-xs rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                                                    {term}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 text-sm">
                                            <Film className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="font-medium text-gray-900">No B-Roll yet</p>
                                            <p className="mt-1">Generate a script first</p>
                                        </div>
                                    )
                                ) : activeTab === "shorts" ? (
                                    shortsData && shortsData.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">YouTube Shorts Clips</h3>
                                                    <p className="text-sm text-gray-500">{shortsData.length} viral-worthy clips extracted</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 max-h-[70vh] overflow-auto">
                                                {shortsData.map((short) => (
                                                    <div key={short.id} className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-violet-200 transition-colors">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">{short.title}</h4>
                                                                <span className="text-xs text-gray-500">From: {short.originalTimestamp}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${short.viralScore >= 80 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                                                    short.viralScore >= 60 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                                                                        "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                                                    }`}>
                                                                    {short.viralScore}% Viral
                                                                </span>
                                                                <button
                                                                    onClick={() => copyToClipboardGeneric(
                                                                        `${short.hook}\n\n${short.content}\n\n${short.cta}`,
                                                                        `short-${short.id}`
                                                                    )}
                                                                    className="flex items-center gap-1 px-2.5 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                                                                >
                                                                    {copiedItem === `short-${short.id}` ? (
                                                                        <><Check className="w-3 h-3 text-emerald-400" /> Copied!</>
                                                                    ) : (
                                                                        <><Copy className="w-3 h-3" /> Copy</>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="p-3 bg-rose-500/10 rounded-lg border-l-4 border-rose-500">
                                                                <span className="text-xs font-bold text-rose-400 tracking-wide">HOOK</span>
                                                                <p className="text-sm text-gray-800 font-medium mt-1">{short.hook}</p>
                                                            </div>
                                                            <div className="p-3 bg-blue-500/10 rounded-lg border-l-4 border-blue-500">
                                                                <span className="text-xs font-bold text-blue-400 tracking-wide">CONTENT</span>
                                                                <p className="text-sm text-gray-700 mt-1">{short.content}</p>
                                                            </div>
                                                            <div className="p-3 bg-emerald-500/10 rounded-lg border-l-4 border-emerald-500">
                                                                <span className="text-xs font-bold text-emerald-400 tracking-wide">CTA</span>
                                                                <p className="text-sm text-gray-800 font-medium mt-1">{short.cta}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 text-sm">
                                            <Scissors className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="font-medium text-gray-900">No Shorts yet</p>
                                            <p className="mt-1">Generate a script first</p>
                                        </div>
                                    )
                                ) : null}
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}

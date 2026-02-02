"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
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
    Share2,
    ShieldCheck,
    Lock,
    Tag,
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
    { value: "Thunglish", label: "Thunglish (Tamil + English)" },
    { value: "English", label: "English (Global)" },
    { value: "Tamil", label: "Pure Tamil" },
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
        language: "Thunglish",
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
    const [referralCode, setReferralCode] = useState<string>("");
    const [referralCopied, setReferralCopied] = useState<boolean>(false);
    const [referralApplyCode, setReferralApplyCode] = useState<string>("");
    const [referralApplyLoading, setReferralApplyLoading] = useState<boolean>(false);
    const [referralApplyMessage, setReferralApplyMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const searchParams = useSearchParams();

    const tokenPackages = [
        { id: "starter", name: "Starter", tokens: 100, price: 99 },
        { id: "plus", name: "Plus", tokens: 200, price: 179 },
        { id: "growth", name: "Growth", tokens: 300, price: 249 },
        { id: "pro", name: "Pro", tokens: 500, price: 399 },
        { id: "scale", name: "Scale", tokens: 1000, price: 699 },
        { id: "enterprise", name: "Enterprise", tokens: 1500, price: 999 },
    ];
    const tokenBreakdown = [
        { label: "Core script", tokens: 10 },
        { label: "SEO pack", tokens: 10 },
        { label: "Image prompts", tokens: 10 },
        { label: "Chapters", tokens: 10 },
        { label: "B-roll", tokens: 10 },
        { label: "Shorts", tokens: 10 },
    ];

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
                if (typeof parsed?.script === "string") setScript(parsed.script);
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
                setScript(s.script_content || "");
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

    // Handle payment
    // Fetch referral link when modal opens (logged in user)
    useEffect(() => {
        if (session && showPaymentModal && !referralLink) {
            fetch("/api/referral")
                .then((r) => r.ok ? r.json() : null)
                .then((data) => {
                    if (data?.link) setReferralLink(data.link);
                    if (data?.code) setReferralCode(data.code);
                })
                .catch(() => {});
        }
    }, [session, showPaymentModal, referralLink]);

    // Pre-fill referral code from ?ref param
    useEffect(() => {
        const ref = searchParams?.get("ref");
        if (ref && !referralApplyCode) setReferralApplyCode(ref);
    }, [searchParams, referralApplyCode]);

    const handleCopyReferralLink = async () => {
        if (!referralLink) return;
        await navigator.clipboard.writeText(referralLink);
        setReferralCopied(true);
        setTimeout(() => setReferralCopied(false), 2000);
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
                setReferralApplyMessage({ type: "success", text: data.message || `You both got 25 tokens!` });
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
                name: "Thunglish Script Generator",
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

            if (stage === "hook_intro") setHookSection(newContent);
            if (stage === "main_content") setMainSection(newContent);
            if (stage === "demo_outro") setDemoSection(newContent);

            const notesPart = productionNotesSection ? "\n\n" + productionNotesSection : "";
            const full =
                stage === "hook_intro"
                    ? newContent + (mainSection ? "\n\n" + mainSection : "") + (demoSection ? "\n\n" + demoSection : "") + notesPart
                    : stage === "main_content"
                        ? hookSection + "\n\n" + newContent + (demoSection ? "\n\n" + demoSection : "") + notesPart
                        : hookSection + (mainSection ? "\n\n" + mainSection : "") + "\n\n" + newContent + notesPart;
            setScript(full);

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
            const hookIntro = await generateSection("hook_intro", timestamps, "", controller.signal);
            setHookSection(hookIntro);
            fullScript = hookIntro;
            setScript(fullScript);
            setProgress("Stage 2/6: Generating Main Content...");

            // Stage 2: Main Content
            const mainContent = await generateSection("main_content", timestamps, fullScript, controller.signal);
            setMainSection(mainContent);
            fullScript += "\n\n" + mainContent;
            setScript(fullScript);
            setProgress("Stage 3/6: Generating Demo & Outro...");

            // Stage 3: Demo & Outro
            const demoOutro = await generateSection("demo_outro", timestamps, fullScript, controller.signal);
            setDemoSection(demoOutro);
            fullScript += "\n\n" + demoOutro;
            setScript(fullScript);
            setProgress("Stage 4/6: Generating Production Notes...");

            // Stage 4: Production Notes
            const productionNotes = await generateProductionNotes(fullScript, controller.signal);
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
            return JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
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
            return JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
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

            setScript(translatedScript);

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
        <div className="min-h-screen bg-slate-50/80 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-br from-blue-50/90 via-slate-50/50 to-violet-50/70 pointer-events-none" />
            {/* Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" async />

            {/* Toast */}
            {toastMessage && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium shadow-lg animate-fade-in"
                >
                    <span className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        {toastMessage}
                    </span>
                </div>
            )}

            {/* Payment Modal - z-[60] so it appears above sticky header (z-50) */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4">
                    <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[92vh] sm:max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
                        <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 pb-2 sm:pb-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Recharge Tokens</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 -m-2 text-slate-400 hover:text-slate-600 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-green-50 border border-green-100">
                                <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-800 font-medium leading-relaxed">
                                    Secure payment via Razorpay. Your card details are never stored.
                                </p>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    Script costs <span className="font-semibold">10 tokens</span>. Each selected feature costs{" "}
                                    <span className="font-semibold">10 tokens</span> extra.
                                </p>
                                <div className="grid gap-2 text-xs text-slate-600">
                                    {tokenBreakdown.map((item) => (
                                        <div key={item.label} className="flex items-center justify-between gap-3 min-w-0">
                                            <span className="truncate">{item.label}</span>
                                            <span className="font-semibold text-slate-800 flex-shrink-0">{item.tokens} tokens</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-2 sm:gap-3">
                                {tokenPackages.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        onClick={() => setSelectedPackageId(pkg.id)}
                                        className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all min-h-[60px] sm:min-h-0 ${
                                            selectedPackageId === pkg.id
                                                ? "border-blue-600 bg-blue-50 shadow-sm"
                                                : "border-slate-200 hover:border-slate-300"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-3 min-w-0">
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-900">{pkg.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {pkg.tokens} tokens • {Math.floor(pkg.tokens / 10)} generations
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 flex-shrink-0">₹{pkg.price}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handlePayment}
                                disabled={processingPayment}
                                className="w-full py-3.5 sm:py-3 text-slate-900 rounded-xl font-semibold bg-amber-400 brand-glow hover:bg-amber-500 transition-colors disabled:opacity-50 min-h-[48px]"
                            >
                                {processingPayment ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Buy tokens with Razorpay"}
                            </button>
                            <div className="pt-4 border-t border-slate-200">
                                <p className="text-xs font-medium text-slate-600 mb-2 flex items-center gap-1">
                                    <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                                    Have a promo code?
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && handlePromoCode()}
                                        placeholder="Enter code"
                                        className="flex-1 min-w-0 px-3 py-3 sm:py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={handlePromoCode}
                                        disabled={promoLoading || !promoCode.trim()}
                                        className="px-4 py-3 sm:py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] flex-shrink-0"
                                    >
                                        {promoLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Apply"}
                                    </button>
                                </div>
                                {promoMessage && (
                                    <div className={`mt-2 p-3 rounded-xl text-xs font-medium ${
                                        promoMessage.type === "success"
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                    }`}>
                                        {promoMessage.text}
                                    </div>
                                )}
                            </div>
                            {/* Referral - Invite friends */}
                            <div className="pt-4 border-t border-slate-200 space-y-3">
                                <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                    <Share2 className="w-3.5 h-3.5 flex-shrink-0" />
                                    Invite friends, get 25 tokens each
                                </p>
                                {referralLink ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={referralLink}
                                            className="flex-1 min-w-0 px-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-600 truncate"
                                        />
                                        <button
                                            onClick={handleCopyReferralLink}
                                            className="px-3 py-2.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex-shrink-0"
                                        >
                                            {referralCopied ? <Check className="w-4 h-4" /> : "Copy"}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500">Your referral link will appear when you open this modal.</p>
                                )}
                                <p className="text-[11px] text-slate-500">
                                    Have a referral code? Apply below:
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={referralApplyCode}
                                        onChange={(e) => setReferralApplyCode(e.target.value.toUpperCase())}
                                        onKeyDown={(e) => e.key === "Enter" && handleReferralApply()}
                                        placeholder="Enter friend's code"
                                        className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <button
                                        onClick={handleReferralApply}
                                        disabled={referralApplyLoading || !referralApplyCode.trim()}
                                        className="px-3 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50 flex-shrink-0"
                                    >
                                        {referralApplyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                    </button>
                                </div>
                                {referralApplyMessage && (
                                    <div className={`p-3 rounded-xl text-xs ${
                                        referralApplyMessage.type === "success"
                                            ? "bg-green-50 text-green-700 border border-green-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                    }`}>
                                        {referralApplyMessage.text}
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex flex-col items-center gap-2 text-xs text-slate-500 text-center">
                                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                                    <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>PCI DSS compliant • Instant token delivery</span>
                                </div>
                                <span>No subscription • Pay once, use your tokens anytime</span>
                                <a
                                    href="/refund-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                                >
                                    Not satisfied? See our Refund Policy
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* History Modal - z-[60] above header */}
            {showHistory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                <History className="w-5 h-5 text-blue-600" />
                                Script History
                            </h3>
                            <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loadingHistory ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                </div>
                            ) : scriptHistory.length === 0 ? (
                                <div className="text-center py-8 text-slate-500">
                                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p>No scripts yet</p>
                                    <p className="text-sm">Generated scripts will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {scriptHistory.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer group transition-colors"
                                            onClick={() => loadScript(item.id)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 truncate">{item.title}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.created_at).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    })}
                                                    <span className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-600">
                                                        {item.duration}min
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteScript(item.id); }}
                                                className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
                <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-amber-400" />
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href="/"
                                        className="text-base font-semibold text-slate-900 hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-1"
                                    >
                                        Script<span className="text-blue-600">Gen</span>
                                    </a>
                                    <a
                                        href="/"
                                        className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors hidden sm:inline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded px-2 py-1"
                                    >
                                        Home
                                    </a>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                                    YouTube script generator
                                </p>
                            </div>
                        </div>

                        {/* Auth & Credits */}
                        <div className="flex items-center gap-3 sm:gap-6">
                            {session ? (
                                <>
                                    {/* History Button */}
                                    <button
                                        onClick={() => { setShowHistory(true); fetchHistory(); }}
                                        className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                                        title="Script History"
                                    >
                                        <History className="w-5 h-5" />
                                        <span className="hidden sm:inline text-sm font-medium">History</span>
                                    </button>

                                    {/* Tokens Display */}
                                    {credits && (
                                        <div className="flex items-center gap-2">
                                            {totalTokens < 20 && (
                                                <button
                                                    onClick={() => setShowPaymentModal(true)}
                                                    className="text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
                                                >
                                                    Low balance — Recharge
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setShowPaymentModal(true)}
                                                className="flex items-center gap-2 px-3 sm:px-4 py-1.5 brand-pill rounded-full shadow-inner hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
                                                title="Recharge tokens or use promo code"
                                            >
                                                <CreditCard className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                                <span className="text-sm font-semibold text-amber-900">
                                                    {totalTokens} tokens
                                                </span>
                                                <span className="text-xs font-medium text-amber-700/80 hidden sm:inline">· Recharge</span>
                                            </button>
                                        </div>
                                    )}

                                    {/* User Avatar */}
                                    <div className="flex items-center gap-4 sm:pl-4 sm:border-l sm:border-slate-200">
                                        {session.user?.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt=""
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full ring-2 ring-blue-500/20 shadow-lg"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center ring-2 ring-blue-500/20">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                        )}
                                    <button
                                            onClick={() => signOut()}
                                        className="flex text-slate-500 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-500/10"
                                            title="Sign Out"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => signIn("google", { callbackUrl: "/app" })}
                                    className="flex items-center gap-2 px-6 py-2.5 text-white text-sm font-semibold rounded-lg bg-blue-700 brand-glow hover:bg-blue-800 transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span className="hidden sm:inline">Sign in with Google</span>
                                    <span className="sm:hidden">Sign in</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 relative z-10">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        Create YouTube scripts with AI
                    </h2>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-xl mx-auto">
                        Configure your video, then generate script, SEO, chapters, and more. Secure payment via Razorpay.
                    </p>
                </div>
                <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/80 text-slate-600 text-sm shadow-sm">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span>
                        Your card details are never stored. PCI DSS compliant • Instant token delivery.
                    </span>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Left Panel - Configuration (Protected) */}
                    <div className="w-full lg:w-2/5">
                        <div className="brand-card rounded-2xl p-6 sm:p-8 lg:sticky lg:top-28">
                            {!session ? (
                                /* Login Required Panel */
                                <div className="relative text-center py-10 sm:py-12 max-w-sm mx-auto px-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-600" />
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center mx-auto mb-5 ring-4 ring-blue-500/5">
                                        <Sparkles className="w-7 h-7 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">Get started</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-[260px] mx-auto">
                                        Sign in with Google. 50 free tokens, no card required.
                                    </p>
                                    <div className="flex flex-col gap-3 text-left max-w-[260px] mx-auto">
                                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-700 text-sm">
                                            <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span>Script + SEO + chapters</span>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-100 text-slate-700 text-sm">
                                            <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span>Image prompts, B-roll, shorts</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => signIn("google", { callbackUrl: "/app" })}
                                        className="w-full mt-6 py-3 px-4 text-white text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-blue-500/30"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Sign in with Google
                                    </button>
                                </div>
                            ) : (
                                /* Authenticated - Show Configuration */
                                <div className="space-y-6 sm:space-y-7">
                                    {/* Header */}
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200/80">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 text-blue-600">
                                                <Settings2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-slate-900">Configuration</h2>
                                                <p className="text-xs text-slate-500">Set your video details</p>
                                            </div>
                                        </div>
                                        {credits && (
                                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 font-semibold text-sm">
                                                <CreditCard className="w-4 h-4" />
                                                {totalTokens} tokens
                                            </span>
                                        )}
                                    </div>

                                    {/* Section 1: Quick start */}
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Quick start</p>
                                        <div className="flex flex-wrap gap-2">
                                            {scriptTemplates.map((t) => (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData({
                                                            ...formData,
                                                            contentType: t.formData.contentType,
                                                            duration: t.formData.duration,
                                                            tone: t.formData.tone,
                                                            difficulty: t.formData.difficulty,
                                                        })
                                                    }
                                                    className={`inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all ${
                                                        formData.contentType === t.formData.contentType
                                                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                                                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                                                    }`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Section 2: Video basics */}
                                    <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Video basics</p>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder={
                                                    scriptTemplates.find((t) => t.formData.contentType === formData.contentType)?.formData.titlePlaceholder ||
                                                    "e.g., React useState hook complete guide"
                                                }
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Channel <span className="text-slate-400 font-normal">(optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.channelName}
                                                onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                                                placeholder="Your channel name"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Section 3: Duration */}
                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/60 to-slate-50/80 border border-blue-100/80 space-y-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</p>
                                        <div className="flex flex-wrap gap-2">
                                            {[5, 8, 10, 12, 15, 20].map((m) => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, duration: m })}
                                                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                                                        formData.duration === m
                                                            ? "bg-blue-600 text-white shadow-md"
                                                            : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                                                    }`}
                                                >
                                                    {m} min
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-3 bg-slate-200/80 rounded-full relative overflow-hidden">
                                                <div
                                                    className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-200"
                                                    style={{ width: `${((formData.duration - 5) / 15) * 100}%` }}
                                                />
                                                <input
                                                    type="range"
                                                    min="5"
                                                    max="20"
                                                    step="1"
                                                    value={formData.duration}
                                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div
                                                    className="absolute h-5 w-5 bg-white rounded-full shadow-lg border-2 border-blue-600 top-1/2 -translate-y-1/2 pointer-events-none ring-4 ring-blue-500/10"
                                                    style={{ left: `calc(${((formData.duration - 5) / 15) * 100}% - 10px)` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-blue-600 w-12">{formData.duration} min</span>
                                        </div>
                                        <p className="text-xs text-slate-500">~{estimatedWords} words</p>
                                    </div>

                                    {/* Section 4: Style */}
                                    <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Style</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Content Type</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.contentType}
                                                        onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                                                        className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 appearance-none cursor-pointer"
                                                    >
                                                        <option value="Tutorial">Tutorial / How-to</option>
                                                        <option value="Review">Product Review</option>
                                                        <option value="Vlog">Vlog / Storytelling</option>
                                                        <option value="Educational">Educational</option>
                                                        <option value="Entertainment">Entertainment</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Difficulty</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.difficulty}
                                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                                        className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 appearance-none cursor-pointer"
                                                    >
                                                        <option value="Beginner">Beginner</option>
                                                        <option value="Intermediate">Intermediate</option>
                                                        <option value="Advanced">Advanced</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tone</label>
                                            <div className="relative">
                                                <select
                                                    value={formData.tone}
                                                    onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 appearance-none cursor-pointer"
                                                >
                                                    {tones.map((t) => (
                                                        <option key={t.value} value={t.value}>{t.label}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 5: Language */}
                                    <div className="p-5 rounded-2xl border-2 border-blue-100/80 bg-gradient-to-br from-blue-50/40 to-white space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Language</p>
                                            <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">AI Optimized</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, language: lang.value })}
                                                    className={`px-4 py-3 text-sm font-semibold rounded-xl border-2 transition-all ${
                                                        formData.language === lang.value
                                                            ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                                            : "bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                                                    }`}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {formData.language === "Thunglish" && "60% Tamil + 40% English (high retention)"}
                                            {formData.language === "English" && "International standard English"}
                                            {formData.language === "Tamil" && "Pure Tamil, tech terms in English"}
                                            {formData.language === "Hindi" && "Hinglish – natural conversational style"}
                                        </p>
                                    </div>

                                    {/* Section 6: Options & Premium */}
                                    <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Options</p>
                                        <div className="flex flex-wrap gap-4">
                                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-white/60 transition-colors min-h-[48px]">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.includeCode}
                                                    onChange={(e) => setFormData({ ...formData, includeCode: e.target.checked })}
                                                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-slate-700">Include code examples</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-white/60 transition-colors min-h-[48px]">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.localContext}
                                                    onChange={(e) => setFormData({ ...formData, localContext: e.target.checked })}
                                                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-slate-700">Tamil Nadu context</span>
                                            </label>
                                        </div>
                                        <div className="pt-4 border-t border-slate-200/80">
                                            <p className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-amber-500" />
                                                Premium (10 tokens each)
                                            </p>
                                            <div className="grid gap-2 sm:grid-cols-2">
                                                {[
                                                    { key: "includeChapters", label: "Chapters", icon: List },
                                                    { key: "includeBRoll", label: "B-Roll", icon: Film },
                                                    { key: "includeShorts", label: "Shorts", icon: Scissors },
                                                    { key: "generateImages", label: "Image prompts", icon: ImageIcon },
                                                ].map(({ key, label, icon: Icon }) => (
                                                    <label
                                                        key={key}
                                                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 hover:border-blue-200 cursor-pointer transition-colors"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={(formData as unknown as Record<string, boolean>)[key]}
                                                            onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                                                            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <Icon className="w-4 h-4 text-slate-500" />
                                                        <span className="text-sm font-medium text-slate-700">{label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {formData.generateImages && (
                                                <div className="mt-3 pl-8">
                                                    <select
                                                        value={formData.imageFormat}
                                                        onChange={(e) => setFormData({ ...formData, imageFormat: e.target.value })}
                                                        className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        {imageFormats.map((f) => (
                                                            <option key={f.value} value={f.value}>{f.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Generate Button */}
                                    <div className="pt-2 space-y-3">
                                        <button
                                            onClick={generateScript}
                                            disabled={loading || !formData.title.trim()}
                                            className="w-full py-4 px-5 text-white text-base font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Generating Magic...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-5 h-5" />
                                                    Generate Script
                                                </>
                                            )}
                                        </button>
                                        {loading && (
                                            <button
                                                onClick={cancelGeneration}
                                                className="w-full py-3 px-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                                            >
                                                Cancel Generation
                                            </button>
                                        )}
                                        <div className="mt-2 text-center text-xs text-slate-400 space-y-1">
                                            {totalTokens < requiredTokens && (
                                                <p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPaymentModal(true)}
                                                        className="text-amber-600 hover:text-amber-700 font-medium underline underline-offset-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 rounded"
                                                    >
                                                        Not enough tokens — recharge
                                                    </button>
                                                </p>
                                            )}
                                            <p>Script costs 10 tokens + 10 per selected feature</p>
                                        </div>
                                        {hasSavedState && (
                                            <button
                                                onClick={clearSavedState}
                                                className="w-full text-xs text-slate-500 hover:text-slate-700 underline underline-offset-4"
                                            >
                                                Clear saved draft on this device
                                            </button>
                                        )}
                                    </div>

                                    {/* Progress Indicator */}
                                    {progress && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                <span className="text-sm text-blue-700">{progress}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Output */}
                    <div className="w-full lg:w-3/5">
                        <div className="rounded-2xl min-h-[600px] flex flex-col relative overflow-hidden bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-xl shadow-slate-200/30">
                            {/* Accent Top Border */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-blue-600"></div>

                            {/* Tabs Header */}
                            <div className="flex items-center justify-between px-2 pt-2 border-b border-slate-200/80 bg-slate-50/50">
                                <div className="flex items-center gap-1 overflow-x-auto w-full no-scrollbar pb-0">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`relative flex-shrink-0 px-5 py-3 text-sm font-medium transition-all rounded-t-lg z-10 ${activeTab === tab.id
                                                ? "bg-white text-blue-600 border border-slate-200/80 border-b-0 shadow-sm -mb-px"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-white/60 border border-transparent"
                                                }`}
                                        >
                                            {activeTab === tab.id && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-t"></div>
                                            )}
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-5 md:p-6 bg-white/50 min-h-[400px]">
                                {activeTab === "script" ? (
                                    script ? (
                                        <>
                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {/* Translate Dropdown */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowTranslateDropdown(!showTranslateDropdown)}
                                                        disabled={isTranslating}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 bg-white text-slate-600 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
                                                    >
                                                        {isTranslating ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Translating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Sparkles className="w-4 h-4 text-amber-500" />
                                                                Translate
                                                                <ChevronDown className="w-3 h-3 ml-1" />
                                                            </>
                                                        )}
                                                    </button>

                                                    {showTranslateDropdown && (
                                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-10">
                                                            {languages.map((lang) => (
                                                                <button
                                                                    key={lang.value}
                                                                    onClick={() => translateScript(lang.value)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                                                                >
                                                                    To {lang.label.split(" ")[0]}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Regenerate Section */}
                                                {hookSection && (
                                                    <div className="flex flex-wrap gap-1">
                                                        <button
                                                            onClick={() => regenerateSection("hook_intro")}
                                                            disabled={loading}
                                                            className="px-2 py-1.5 text-xs font-medium border border-slate-200 bg-white text-slate-600 rounded-md hover:bg-slate-50 disabled:opacity-50"
                                                            title="Regenerate Hook & Intro (10 tokens)"
                                                        >
                                                            Regenerate Hook
                                                        </button>
                                                        <button
                                                            onClick={() => regenerateSection("main_content")}
                                                            disabled={loading}
                                                            className="px-2 py-1.5 text-xs font-medium border border-slate-200 bg-white text-slate-600 rounded-md hover:bg-slate-50 disabled:opacity-50"
                                                            title="Regenerate Main (10 tokens)"
                                                        >
                                                            Regenerate Main
                                                        </button>
                                                        <button
                                                            onClick={() => regenerateSection("demo_outro")}
                                                            disabled={loading}
                                                            className="px-2 py-1.5 text-xs font-medium border border-slate-200 bg-white text-slate-600 rounded-md hover:bg-slate-50 disabled:opacity-50"
                                                            title="Regenerate Demo & Outro (10 tokens)"
                                                        >
                                                            Regenerate Outro
                                                        </button>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={copyToClipboard}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 bg-white text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check className="w-4 h-4 text-green-600" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4" />
                                                            Copy
                                                        </>
                                                    )}
                                                </button>


                                                {/* Export Dropdown */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowExportDropdown(!showExportDropdown)}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 bg-white text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Export
                                                        <ChevronDown className="w-3 h-3 ml-1" />
                                                    </button>

                                                    {showExportDropdown && (
                                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-10">
                                                            <button
                                                                onClick={downloadAsPDF}
                                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                                            >
                                                                <FileText className="w-4 h-4 text-red-500" />
                                                                Export as PDF
                                                            </button>
                                                            <button
                                                                onClick={downloadAsDOC}
                                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                                            >
                                                                <FileText className="w-4 h-4 text-blue-600" />
                                                                Export as Word
                                                            </button>
                                                            <button
                                                                onClick={() => { downloadScript(); setShowExportDropdown(false); }}
                                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                                            >
                                                                <FileText className="w-4 h-4 text-slate-500" />
                                                                Export as Text
                                                            </button>
                                                            <button
                                                                onClick={downloadAsSRT}
                                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                                            >
                                                                <Film className="w-4 h-4 text-emerald-600" />
                                                                Export as SRT (captions)
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Script Display - Paper Look */}
                                            <div className="bg-slate-50 rounded-lg p-6 overflow-auto max-h-[70vh] border border-slate-200 shadow-inner">
                                                <pre className="text-slate-800 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                                                    {script}
                                                </pre>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <p className="text-base font-medium text-slate-600">No script generated yet</p>
                                            <p className="text-sm mt-1 text-slate-500">Configure your video settings and click Generate</p>
                                        </div>
                                    )
                                ) : activeTab === "seo" ? (
                                    seoData ? (
                                        <div className="space-y-6">
                                            {/* Alternative Titles */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900 mb-3">Alternative Titles</h3>
                                                <ul className="space-y-2">
                                                    {seoData.titles.map((title, index) => (
                                                        <li key={index} className="p-2 bg-slate-50 rounded-md text-sm text-slate-700 flex items-center justify-between gap-3">
                                                            <span>{index + 1}. {title.text}</span>
                                                            <span className="text-xs text-slate-500">Score {title.score}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900 mb-3">Description</h3>
                                                <div className="p-3 bg-slate-50 rounded-md text-sm text-slate-700 whitespace-pre-wrap">
                                                    {seoData.description}
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900 mb-3">Tags ({seoData.tags.length})</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {seoData.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs flex items-center gap-2"
                                                        >
                                                            {tag.text}
                                                            <span className="text-[10px] text-blue-500">({tag.score})</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Thumbnail Suggestions */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900 mb-3">Thumbnail Text Suggestions</h3>
                                                <ul className="space-y-2">
                                                    {seoData.thumbnails.map((thumb, index) => (
                                                        <li key={index} className="p-2 bg-slate-50 rounded-md text-sm font-medium text-slate-700 flex items-center justify-between gap-3">
                                                            <span>{index + 1}. {thumb.text}</span>
                                                            <span className="text-xs text-slate-500">Score {thumb.score}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* First Comment */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900 mb-3">First Comment to Pin</h3>
                                                <div className="p-3 bg-slate-50 rounded-md text-sm text-slate-700 whitespace-pre-wrap">
                                                    {seoData.comment}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <Search className="w-8 h-8" />
                                            </div>
                                            <p className="text-base font-medium text-slate-600">No SEO data generated yet</p>
                                            <p className="text-sm mt-1 text-slate-500">SEO data will be generated after the script</p>
                                        </div>
                                    )
                                ) : activeTab === "images" ? (
                                    imagesData && imagesData.length > 0 ? (
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">AI Image Prompts</h3>
                                                    <p className="text-sm text-zinc-400">{imagesData.length} prompts generated for your video</p>
                                                </div>
                                            </div>

                                            {/* Image Prompt Cards */}
                                            <div className="space-y-4 max-h-[70vh] overflow-auto">
                                                {imagesData.map((prompt) => <div
                                                    key={prompt.id}
                                                    className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                                                >
                                                    {/* Header Row */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                                                {prompt.timestamp}
                                                            </span>
                                                            <span className={`px-2 py-1 text-xs font-medium rounded border ${prompt.scene === "Hook" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                                prompt.scene === "Intro" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                                                                    prompt.scene === "Main Content" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                                                        prompt.scene === "Demo" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                                                                            "bg-slate-50 text-slate-600 border border-slate-200"
                                                                }`}>
                                                                {prompt.scene}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => copyImagePrompt(prompt)}
                                                            className="flex items-center gap-1 px-2 py-1 text-xs border border-slate-200 rounded hover:bg-slate-100 transition-colors text-slate-500 hover:text-blue-600"
                                                        >
                                                            {copiedImageId === prompt.id ? (
                                                                <>
                                                                    <Check className="w-3 h-3 text-green-600" />
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
                                                    <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                                                        {prompt.description}
                                                    </p>

                                                    {/* Metadata Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                        <div className="bg-slate-50 rounded p-2 border border-slate-100">
                                                            <span className="text-xs text-slate-400 block mb-0.5">Style</span>
                                                            <span className="text-xs font-semibold text-slate-700">{prompt.style}</span>
                                                        </div>
                                                        <div className="bg-slate-50 rounded p-2 border border-slate-100">
                                                            <span className="text-xs text-slate-400 block mb-0.5">Mood</span>
                                                            <span className="text-xs font-semibold text-slate-700">{prompt.mood}</span>
                                                        </div>
                                                        <div className="bg-slate-50 rounded p-2 border border-slate-100">
                                                            <span className="text-xs text-slate-400 block mb-0.5">Colors</span>
                                                            <span className="text-xs font-semibold text-slate-700">{prompt.colorPalette}</span>
                                                        </div>
                                                        <div className="bg-slate-50 rounded p-2 border border-slate-100">
                                                            <span className="text-xs text-slate-400 block mb-0.5">Ratio</span>
                                                            <span className="text-xs font-semibold text-slate-700">{prompt.aspectRatio}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <p className="text-base font-medium text-slate-600">No image prompts generated yet</p>
                                            <p className="text-sm mt-1 text-slate-500">Image prompts will be generated after the script</p>
                                        </div>
                                    )
                                ) : activeTab === "chapters" ? (
                                    chaptersData && chaptersData.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900">YouTube Chapters</h3>
                                                    <p className="text-sm text-slate-500">Copy and paste into your video description</p>
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboardGeneric(
                                                        chaptersData.map(c => `${c.timestamp} ${c.title}`).join('\n'),
                                                        'all-chapters'
                                                    )}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                                                >
                                                    {copiedItem === 'all-chapters' ? (
                                                        <><Check className="w-4 h-4" /> Copied!</>
                                                    ) : (
                                                        <><Copy className="w-4 h-4" /> Copy All</>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="bg-slate-50 rounded-lg p-4 overflow-auto border border-slate-200">
                                                <pre className="text-slate-700 text-sm font-mono leading-relaxed">
                                                    {chaptersData.map(c => `${c.timestamp} ${c.title}`).join('\n')}
                                                </pre>
                                            </div>

                                            <div className="space-y-2 mt-4">
                                                {chaptersData.map((chapter, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-mono rounded border border-blue-100">
                                                            {chapter.timestamp}
                                                        </span>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-slate-800">{chapter.title}</p>
                                                            <p className="text-xs text-slate-500">{chapter.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <List className="w-8 h-8" />
                                            </div>
                                            <p className="text-base font-medium text-slate-600">No chapters generated yet</p>
                                            <p className="text-sm mt-1 text-slate-500">Chapters will be generated after the script</p>
                                        </div>
                                    )
                                ) : activeTab === "broll" ? (
                                    brollData && brollData.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">B-Roll Suggestions</h3>
                                                    <p className="text-sm text-zinc-400">{brollData.length} clips suggested for your video</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 max-h-[70vh] overflow-auto">
                                                {brollData.map((broll) => (
                                                    <div key={broll.id} className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50 hover:border-blue-500/30 transition-colors">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded border border-blue-500/20">
                                                                    {broll.timestamp}
                                                                </span>
                                                                <span className={`px-2 py-1 text-xs font-medium rounded border ${broll.source === "stock" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                                    broll.source === "screen" ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" :
                                                                        broll.source === "animation" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                                                                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                                    }`}>
                                                                    {broll.source}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-zinc-300 mb-2">{broll.suggestion}</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {broll.searchTerms.map((term, i) => (
                                                                <span key={i} className="px-2 py-0.5 bg-black/40 text-zinc-400 text-xs rounded border border-zinc-700/50">
                                                                    {term}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <Film className="w-8 h-8" />
                                            </div>
                                            <p className="text-base font-medium text-slate-600">No B-Roll suggestions yet</p>
                                            <p className="text-sm mt-1 text-slate-500">B-Roll will be generated after the script</p>
                                        </div>
                                    )
                                ) : activeTab === "shorts" ? (
                                    shortsData && shortsData.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-slate-900">YouTube Shorts Clips</h3>
                                                    <p className="text-sm text-slate-500">{shortsData.length} viral-worthy clips extracted</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4 max-h-[70vh] overflow-auto">
                                                {shortsData.map((short) => (
                                                    <div key={short.id} className="bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h4 className="font-bold text-slate-800">{short.title}</h4>
                                                                <span className="text-xs text-slate-500">From: {short.originalTimestamp}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-2 py-1 text-xs font-bold rounded ${short.viralScore >= 80 ? "bg-green-100 text-green-700" :
                                                                    short.viralScore >= 60 ? "bg-amber-100 text-amber-700" :
                                                                        "bg-orange-100 text-orange-700"
                                                                    }`}>
                                                                    {short.viralScore}% Viral
                                                                </span>
                                                                <button
                                                                    onClick={() => copyToClipboardGeneric(
                                                                        `${short.hook}\n\n${short.content}\n\n${short.cta}`,
                                                                        `short-${short.id}`
                                                                    )}
                                                                    className="flex items-center gap-1 px-2 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 transition-colors text-slate-500"
                                                                >
                                                                    {copiedItem === `short-${short.id}` ? (
                                                                        <><Check className="w-3 h-3 text-green-600" /> Copied!</>
                                                                    ) : (
                                                                        <><Copy className="w-3 h-3" /> Copy</>
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
                                                                <span className="text-xs font-bold text-red-600 tracking-wide">HOOK</span>
                                                                <p className="text-sm text-slate-700 font-medium">{short.hook}</p>
                                                            </div>
                                                            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                                                                <span className="text-xs font-bold text-blue-600 tracking-wide">CONTENT</span>
                                                                <p className="text-sm text-slate-700">{short.content}</p>
                                                            </div>
                                                            <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                                                                <span className="text-xs font-bold text-green-600 tracking-wide">CTA</span>
                                                                <p className="text-sm text-slate-700 font-medium">{short.cta}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <Scissors className="w-8 h-8" />
                                            </div>
                                            <p className="text-base font-medium text-slate-600">No Shorts clips generated yet</p>
                                            <p className="text-sm mt-1 text-slate-500">Shorts will be extracted after the script</p>
                                        </div>
                                    )
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div >
            </main >
        </div >
    );
}

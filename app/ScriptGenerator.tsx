"use client";

import { useState, useEffect, useRef } from "react";
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
    Lock,
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
            fullScript = hookIntro;
            setScript(fullScript);
            setProgress("Stage 2/6: Generating Main Content...");

            // Stage 2: Main Content
            const mainContent = await generateSection("main_content", timestamps, fullScript, controller.signal);
            fullScript += "\n\n" + mainContent;
            setScript(fullScript);
            setProgress("Stage 3/6: Generating Demo & Outro...");

            // Stage 3: Demo & Outro
            const demoOutro = await generateSection("demo_outro", timestamps, fullScript, controller.signal);
            fullScript += "\n\n" + demoOutro;
            setScript(fullScript);
            setProgress("Stage 4/6: Generating Production Notes...");

            // Stage 4: Production Notes
            const productionNotes = await generateProductionNotes(fullScript, controller.signal);
            fullScript += "\n\n" + productionNotes;
            setScript(fullScript);
            setProgress("Stage 5/6: Generating SEO & Media Assets...");

            // Stage 5: Generate SEO, Images, Chapters, B-Roll in parallel
            const promises: Promise<void>[] = [];

            // SEO Data (Always included)
            promises.push(
                generateSEOData(controller.signal)
                    .then((seo) => setSeoData(seo))
                    .catch(() => console.error("SEO generation failed"))
            );

            // Image Prompts (if enabled)
            if (formData.generateImages) {
                promises.push(
                    generateImagePrompts(fullScript, timestamps, controller.signal)
                        .then((images) => setImagesData(images))
                        .catch(() => console.error("Image prompts generation failed"))
                );
            }

            // Chapters (if enabled)
            if (formData.includeChapters) {
                promises.push(
                    generateChapters(fullScript, timestamps, controller.signal)
                        .then((chapters) => setChaptersData(chapters))
                        .catch(() => console.error("Chapters generation failed"))
                );
            }

            // B-Roll (if enabled)
            if (formData.includeBRoll) {
                promises.push(
                    generateBRoll(fullScript, timestamps, controller.signal)
                        .then((broll) => setBrollData(broll))
                        .catch(() => console.error("B-Roll generation failed"))
                );
            }

            // Execute parallel promises
            await Promise.all(promises);

            // Shorts (Sequential or if enabled)
            if (formData.includeShorts) {
                setProgress("Stage 6/6: Generating Shorts Clips...");
                try {
                    const shorts = await generateShorts(fullScript, controller.signal);
                    setShortsData(shorts);
                } catch {
                    console.error("Shorts generation failed");
                }
            } else {
                setProgress("Finalizing...");
            }

            // Deduct tokens after successful generation
            try {
                // Pass the count of tokens to deduct
                await fetch("/api/credits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ count: requiredTokens })
                });

                // Refresh credits
                const creditsRes = await fetch("/api/credits");
                if (creditsRes.ok) {
                    setCredits(await creditsRes.json());
                }
            } catch {
                console.error("Failed to deduct tokens");
            }

            // Save to history
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
                        seoData: seoData,
                        imagesData: imagesData,
                        chaptersData: chaptersData,
                        brollData: brollData,
                        shortsData: shortsData,
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

    // Generate SEO data
    const generateSEOData = async (signal?: AbortSignal): Promise<SEOData> => {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
            body: JSON.stringify({
                type: "seo",
                formData
            }),
        });


        if (!response.ok) {
            throw new Error("Failed to generate SEO data");
        }

        const data = await response.json();
        const text = data.content || "";

        const coerceRanked = (items: Array<string | { text: string; score?: number }>, fallbackScore = 80) =>
            items
                .map((item) => {
                    if (typeof item === "string") {
                        return { text: item.trim(), score: fallbackScore };
                    }
                    return { text: item.text?.trim() || "", score: item.score ?? fallbackScore };
                })
                .filter((item) => item.text.length > 0);

        const parseJsonSEO = (raw: string) => {
            try {
                const parsed = JSON.parse(raw);
                if (parsed && parsed.titles && parsed.description) return parsed;
            } catch {
                // ignore
            }
            const match = raw.match(/\{[\s\S]*\}/);
            if (!match) return null;
            try {
                const parsed = JSON.parse(match[0]);
                if (parsed && parsed.titles && parsed.description) return parsed;
            } catch {
                return null;
            }
            return null;
        };

        const parsedJson = parseJsonSEO(text);
        if (parsedJson) {
            return {
                titles: coerceRanked(parsedJson.titles || [], 88),
                description: parsedJson.description || "",
                tags: coerceRanked(parsedJson.tags || [], 78),
                thumbnails: coerceRanked(parsedJson.thumbnails || [], 84),
                comment: parsedJson.comment || "",
            };
        }

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

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Recharge Tokens</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-green-50 border border-green-100">
                            <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <p className="text-sm text-green-800 font-medium">
                                Secure payment via Razorpay. Your card details are never stored.
                            </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 space-y-3">
                            <p className="text-sm text-slate-700">
                                Script costs <span className="font-semibold">10 tokens</span>. Each selected feature costs{" "}
                                <span className="font-semibold">10 tokens</span> extra.
                            </p>
                            <div className="grid gap-2 text-xs text-slate-600">
                                {tokenBreakdown.map((item) => (
                                    <div key={item.label} className="flex items-center justify-between">
                                        <span>{item.label}</span>
                                        <span className="font-semibold text-slate-800">{item.tokens} tokens</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-3 mb-4">
                            {tokenPackages.map((pkg) => (
                                <button
                                    key={pkg.id}
                                    onClick={() => setSelectedPackageId(pkg.id)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                                        selectedPackageId === pkg.id
                                            ? "border-blue-600 bg-blue-50 shadow-sm"
                                            : "border-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">{pkg.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {pkg.tokens} tokens • {Math.floor(pkg.tokens / 10)} generations
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-900">₹{pkg.price}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handlePayment}
                            disabled={processingPayment}
                            className="w-full py-3 text-slate-900 rounded-lg font-semibold bg-amber-400 brand-glow hover:bg-amber-500 transition-colors disabled:opacity-50"
                        >
                            {processingPayment ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Buy tokens with Razorpay"}
                        </button>
                        <div className="mt-4 flex flex-col items-center gap-2 text-xs text-slate-500 text-center">
                            <div className="flex items-center gap-2">
                                <Lock className="w-3.5 h-3.5" />
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
            )}

            {/* History Modal */}
            {showHistory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                                        className="flex items-center gap-2 text-slate-900 hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
                                    >
                                        <Image src="/logo-sg.svg" alt="" width={28} height={28} className="rounded" />
                                        <span className="text-lg font-bold tracking-tight">SG</span>
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
                                        <div className="hidden sm:flex items-center gap-2">
                                            {totalTokens < 20 && (
                                                <button
                                                    onClick={() => setShowPaymentModal(true)}
                                                    className="text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1"
                                                >
                                                    Low balance — Recharge
                                                </button>
                                            )}
                                            <div className="flex items-center gap-2 px-4 py-1.5 brand-pill rounded-full shadow-inner">
                                                <CreditCard className="w-4 h-4 text-amber-600" />
                                                <span className="text-sm font-semibold text-amber-900">
                                                    {totalTokens} tokens
                                                </span>
                                            </div>
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

            <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
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
                                /* Authenticated - Show Configuration */
                                <div className="brand-card rounded-2xl p-6 sm:p-8 h-full relative overflow-hidden">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Settings2 className="w-5 h-5 text-slate-400" />
                                            <h2 className="text-lg font-semibold text-slate-800">Configuration</h2>
                                        </div>
                                        {credits && (
                                            <span className="text-xs px-3 py-1 brand-pill rounded-full font-semibold">
                                                {totalTokens} tokens
                                            </span>
                                        )}
                                    </div>

                                    {/* Video Title */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Video Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g., React useState hook complete guide"
                                            className="w-full px-4 py-2.5 bg-white/90 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 text-slate-900 placeholder-slate-400 transition-all shadow-sm"
                                        />
                                    </div>

                                    {/* Channel Name */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Channel Name <span className="text-slate-400 normal-case font-normal">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.channelName}
                                            onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                                            placeholder="Your channel name"
                                            className="w-full px-4 py-2.5 bg-white/90 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 text-slate-900 placeholder-slate-400 transition-all shadow-sm"
                                        />
                                    </div>

                                    {/* Duration Slider */}
                                    <div className="mb-8">
                                        <label className="block text-sm font-medium text-slate-700 mb-4">
                                            Video Duration: <span className="font-bold text-blue-600">{formData.duration} minutes</span>
                                        </label>
                                        <div className="w-full bg-slate-100 rounded-full h-2 relative">
                                            <input
                                                type="range"
                                                min="5"
                                                max="20"
                                                step="1"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                                className="absolute w-full h-full opacity-0 z-10 cursor-pointer"
                                            />
                                            <div
                                                className="absolute h-full bg-blue-600 rounded-full transition-all duration-150"
                                                style={{ width: `${((formData.duration - 5) / 15) * 100}%` }}
                                            ></div>
                                            <div
                                                className="absolute h-5 w-5 bg-blue-700 rounded-full shadow-md border-2 border-white top-1/2 -translate-y-1/2 transition-all duration-150 pointer-events-none"
                                                style={{ left: `${((formData.duration - 5) / 15) * 100}%`, transform: `translate(-50%, -50%)` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                                            <span>5 min</span>
                                            <span>20 min</span>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-500">
                                            Estimated length: ~{estimatedWords} words
                                        </p>
                                    </div>
                                    {/* Content Type & Difficulty */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Content Type
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={formData.contentType}
                                                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-2.5 bg-white/90 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 text-slate-900 appearance-none cursor-pointer transition-all shadow-sm"
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
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Difficulty Level
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={formData.difficulty}
                                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-2.5 bg-white/90 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 text-slate-900 appearance-none cursor-pointer transition-all shadow-sm"
                                                >
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Advanced">Advanced</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Language */}
                                    <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span>
                                                Project Language
                                            </label>
                                            <span className="text-xs text-amber-900 font-semibold bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                                                AI Optimized
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.value}
                                                    onClick={() => setFormData({ ...formData, language: lang.value })}
                                                    className={`px-3 py-2.5 text-sm font-semibold rounded-lg border transition-all ${formData.language === lang.value
                                                        ? "bg-blue-700 border-blue-700 text-white shadow-md shadow-blue-500/20"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                        }`}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 italic px-1">
                                            {formData.language === "Thunglish" && "ℹ️ 60% Tamil + 40% English Mix (High Retention)"}
                                            {formData.language === "English" && "ℹ️ International Standard English"}
                                            {formData.language === "Tamil" && "ℹ️ Pure Tamil with English Technical Terms"}
                                            {formData.language === "Hindi" && "ℹ️ Hinglish - Natural conversational style"}
                                        </p>
                                    </div>

                                    {/* Tone & Style */}
                                    <div className="mt-5">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Tone
                                        </label>
                                        <select
                                            value={formData.tone}
                                            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white/90 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 text-slate-900 transition-all shadow-sm"
                                        >
                                            {tones.map((t) => (
                                                <option key={t.value} value={t.value}>
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Advanced Settings */}
                                    <div className="mt-5 space-y-3">
                                        <div className="flex items-center gap-5">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.includeCode}
                                                    onChange={(e) => setFormData({ ...formData, includeCode: e.target.checked })}
                                                    className="w-4 h-4 text-blue-700 bg-white border-slate-300 rounded focus:ring-blue-600 transition-colors"
                                                />
                                                <span className="text-sm text-slate-600 group-hover:text-slate-900">Include code examples</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.localContext}
                                                    onChange={(e) => setFormData({ ...formData, localContext: e.target.checked })}
                                                    className="w-4 h-4 text-blue-700 bg-white border-slate-300 rounded focus:ring-blue-600 transition-colors"
                                                />
                                                <span className="text-sm text-slate-600 group-hover:text-slate-900">Add Tamil Nadu context</span>
                                            </label>
                                        </div>

                                        {/* Image Settings Divider */}
                                        <div className="mt-5 pt-4 border-t border-slate-200">
                                            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-amber-500" />
                                                Premium Features (₹9 each)
                                            </h4>

                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors -ml-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.includeChapters}
                                                        onChange={(e) => setFormData({ ...formData, includeChapters: e.target.checked })}
                                                        className="w-5 h-5 text-blue-700 bg-white border-slate-300 rounded focus:ring-blue-600"
                                                    />
                                                    <div>
                                                        <span className="text-sm font-medium text-slate-700">Generate YouTube Chapters</span>
                                                    </div>
                                                </label>

                                                <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors -ml-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.includeBRoll}
                                                        onChange={(e) => setFormData({ ...formData, includeBRoll: e.target.checked })}
                                                        className="w-5 h-5 text-blue-700 bg-white border-slate-300 rounded focus:ring-blue-600"
                                                    />
                                                    <div>
                                                        <span className="text-sm font-medium text-slate-700">B-Roll Suggestions</span>
                                                    </div>
                                                </label>

                                                <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors -ml-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.includeShorts}
                                                        onChange={(e) => setFormData({ ...formData, includeShorts: e.target.checked })}
                                                        className="w-5 h-5 text-blue-700 bg-white border-slate-300 rounded focus:ring-blue-600"
                                                    />
                                                    <div>
                                                        <span className="text-sm font-medium text-slate-700">Viral Shorts Ideas</span>
                                                    </div>
                                                </label>

                                                <div className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors -ml-2">
                                                    <label className="flex items-center gap-3 cursor-pointer group flex-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.generateImages}
                                                            onChange={(e) => setFormData({ ...formData, generateImages: e.target.checked })}
                                                            className="w-5 h-5 text-blue-700 bg-white border-slate-300 rounded focus:ring-blue-600"
                                                        />
                                                        <div>
                                                            <span className="text-sm font-medium text-slate-700">Generate AI Image Prompts</span>
                                                        </div>
                                                    </label>

                                                    {formData.generateImages && (
                                                        <select
                                                            value={formData.imageFormat}
                                                            onChange={(e) => setFormData({ ...formData, imageFormat: e.target.value })}
                                                            className="w-32 px-2 py-1 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
                                                        >
                                                            {imageFormats.map((format) => (
                                                                <option key={format.value} value={format.value}>
                                                                    {format.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Generate Button */}
                                    <div className="mt-8 space-y-3">
                                        <button
                                            onClick={generateScript}
                                            disabled={loading || !formData.title.trim()}
                                            className="w-full py-3.5 px-4 text-white font-bold rounded-xl bg-blue-700 brand-glow hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:transform active:scale-[0.98]"
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

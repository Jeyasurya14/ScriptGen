"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
// import { jsPDF } from "jspdf"; // Dynamic import used instead
import {
    FileText,
    Triangle,
    Copy,
    Download,
    Check,
    Loader2,
    ChevronDown,
    ChevronUp,
    Search,
    Video,
    Settings,
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
    Shield,
    Settings2,
    ArrowRight
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

interface SEOData {
    titles: string[];
    description: string;
    tags: string[];
    thumbnails: string[];
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

// Content type options
const contentTypes = [
    { value: "tutorial", label: "Tutorial / How-to" },
    { value: "story", label: "Story / Experience" },
    { value: "review", label: "Review / Analysis" },
    { value: "comparison", label: "Comparison" },
    { value: "problem", label: "Problem Solving" },
    { value: "career", label: "Career Advice" },
];

// Tone options
const tones = [
    { value: "casual", label: "Casual Friend" },
    { value: "professional", label: "Professional" },
    { value: "humorous", label: "Humorous" },
    { value: "motivational", label: "Motivational" },
    { value: "storytelling", label: "Storytelling" },
];

// Difficulty levels
const difficulties = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
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

export default function ScriptGenerator() {
    // Form state
    const [formData, setFormData] = useState<FormData>({
        title: "",
        channelName: "",
        duration: 10,
        contentType: "tutorial",
        difficulty: "beginner",
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
    const [activeTab, setActiveTab] = useState<"script" | "seo" | "images" | "chapters" | "broll" | "shorts">("script");
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Auth and credits state
    const { data: session, status } = useSession();
    const [credits, setCredits] = useState<{
        freeScriptsUsed: number;
        freeScriptsRemaining: number;
        paidCredits: number;
        canGenerate: boolean;
    } | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
    const [processingPayment, setProcessingPayment] = useState<boolean>(false);

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

    // Fetch credits when session changes
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
                    console.error("Failed to fetch credits:", err);
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
                    contentType: s.content_type || "tutorial",
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

    // Save script to history
    const saveToHistory = async () => {
        if (!session || !script) return;
        try {
            await fetch("/api/scripts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formData.title,
                    channelName: formData.channelName,
                    duration: formData.duration,
                    contentType: formData.contentType,
                    scriptContent: script,
                    seoData: seoData,
                    imagesData: imagesData,
                    chaptersData: chaptersData,
                    brollData: brollData,
                    shortsData: shortsData,
                }),
            });
        } catch (err) {
            console.error("Failed to save script:", err);
        }
    };

    // Calculate required credits
    const calculateRequiredCredits = () => {
        let cost = 1; // Base script
        if (formData.generateImages) cost += 1;
        if (formData.includeChapters) cost += 1;
        if (formData.includeBRoll) cost += 1;
        if (formData.includeShorts) cost += 1;
        return cost;
    };

    // Handle payment
    const handlePayment = async () => {
        setProcessingPayment(true);
        // Calculate missing credits or just buy a fixed bundle? 
        // User said "pay 9rs for each". Let's allow buying the exact required amount if they are short, or default to 1.
        // Actually, let's keep it simple: Buy the required amount for the CURRENT configuration.
        const required = calculateRequiredCredits();
        const available = (credits?.freeScriptsRemaining || 0) + (credits?.paidCredits || 0);
        const needed = Math.max(1, required - available > 0 ? required - available : 1);

        try {
            const res = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credits: needed }),
            });
            const order = await res.json();

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "Thunglish Script Generator",
                description: `${needed} Script Credit${needed > 1 ? 's' : ''} (₹9/each)`,
                order_id: order.orderId,
                handler: async (response: any) => {
                    // Verify payment
                    const verifyRes = await fetch("/api/payment/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    if (verifyRes.ok) {
                        // Refresh credits
                        const creditsRes = await fetch("/api/credits");
                        if (creditsRes.ok) {
                            setCredits(await creditsRes.json());
                        }
                        setShowPaymentModal(false);
                    }
                },
                prefill: {
                    email: session?.user?.email,
                    name: session?.user?.name,
                },
                theme: { color: "#2563eb" },
            };

            const razorpay = new (window as any).Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error("Payment failed:", err);
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

    // Format seconds to MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // API call to generate a section
    const generateSection = async (
        stage: string,
        timestamps: Timestamps,
        previousContent: string = ""
    ): Promise<string> => {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
            signIn("google", { callbackUrl: "/" });
            return;
        }

        // Check credits
        const requiredCredits = calculateRequiredCredits();
        const availableCredits = (credits?.freeScriptsRemaining || 0) + (credits?.paidCredits || 0);

        if (availableCredits < requiredCredits) {
            setShowPaymentModal(true);
            return;
        }

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
            const hookIntro = await generateSection("hook_intro", timestamps);
            fullScript = hookIntro;
            setScript(fullScript);
            setProgress("Stage 2/6: Generating Main Content...");

            // Stage 2: Main Content
            const mainContent = await generateSection("main_content", timestamps, fullScript);
            fullScript += "\n\n" + mainContent;
            setScript(fullScript);
            setProgress("Stage 3/6: Generating Demo & Outro...");

            // Stage 3: Demo & Outro
            const demoOutro = await generateSection("demo_outro", timestamps, fullScript);
            fullScript += "\n\n" + demoOutro;
            setScript(fullScript);
            setProgress("Stage 4/6: Generating Production Notes...");

            // Stage 4: Production Notes
            const productionNotes = await generateProductionNotes(fullScript);
            fullScript += "\n\n" + productionNotes;
            setScript(fullScript);
            setProgress("Stage 5/6: Generating SEO & Media Assets...");

            // Stage 5: Generate SEO, Images, Chapters, B-Roll in parallel
            const promises: Promise<void>[] = [];

            // SEO Data (Always included)
            promises.push(
                generateSEOData()
                    .then((seo) => setSeoData(seo))
                    .catch(() => console.error("SEO generation failed"))
            );

            // Image Prompts (if enabled)
            if (formData.generateImages) {
                promises.push(
                    generateImagePrompts(fullScript, timestamps)
                        .then((images) => setImagesData(images))
                        .catch(() => console.error("Image prompts generation failed"))
                );
            }

            // Chapters (if enabled)
            if (formData.includeChapters) {
                promises.push(
                    generateChapters(fullScript, timestamps)
                        .then((chapters) => setChaptersData(chapters))
                        .catch(() => console.error("Chapters generation failed"))
                );
            }

            // B-Roll (if enabled)
            if (formData.includeBRoll) {
                promises.push(
                    generateBRoll(fullScript, timestamps)
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
                    const shorts = await generateShorts(fullScript);
                    setShortsData(shorts);
                } catch {
                    console.error("Shorts generation failed");
                }
            } else {
                setProgress("Finalizing...");
            }

            // Deduct credit after successful generation
            try {
                // Pass the count of credits to deduct
                await fetch("/api/credits", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ count: requiredCredits })
                });

                // Refresh credits
                const creditsRes = await fetch("/api/credits");
                if (creditsRes.ok) {
                    setCredits(await creditsRes.json());
                }
            } catch {
                console.error("Failed to deduct credit");
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
        } catch (err: any) {
            setError(err.message || "An error occurred while generating the script.");
        } finally {
            setLoading(false);
        }
    };




    // Generate production notes
    const generateProductionNotes = async (
        fullScript: string
    ): Promise<string> => {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
    const generateSEOData = async (): Promise<SEOData> => {
        const { title, contentType } = formData;

        const systemPrompt = `You are a YouTube SEO expert who specializes in Tamil tech content. You understand the YouTube algorithm, trending keywords, and what makes Tamil tech videos go viral. You've helped channels grow from 0 to 1M+ subscribers.`;

        const userPrompt = `Create OPTIMIZED SEO data for this Tamil tech YouTube video.

VIDEO TITLE: ${title}
CONTENT TYPE: ${contentType}

Generate SEO-optimized content that will help this video rank and get clicks:

═══════════════════════════════════════════════════════════════

TITLES:
Create 5 alternative titles. Each should be:
- Under 60 characters
- Include primary keyword
- Have emotional trigger or curiosity element
- Mix of Tamil and English for broader reach

1. [Power word + Topic + Benefit] - e.g., "🔥 React Hooks Complete Guide - இனி Confusion இல்ல!"
2. [Question format] - e.g., "useState எப்படி Work ஆகுது? 90% Developers இது Miss பண்றாங்க"
3. [How-to format] - e.g., "React useState கத்துக்கணுமா? இந்த Video போதும்!"
4. [Number/List format] - e.g., "5 useState Mistakes நீங்க பண்ணிருக்கலாம் | React Tutorial Tamil"
5. [Controversial/Bold] - e.g., "useState தெரியாம React எழுதாதீங்க! 🚫"

DESCRIPTION:
Write a 250-300 word YouTube description that:
- Opens with a hook (first 150 characters visible in search)
- Includes primary and secondary keywords naturally
- Has timestamps for main sections
- Includes call-to-action
- Has social links placeholder
- Ends with relevant hashtags

Format:
[Opening hook - 2 lines]

📚 What You'll Learn:
• Point 1
• Point 2
• Point 3

⏱️ Timestamps:
0:00 - Introduction
[Add more based on typical structure]

🔗 Resources:
[Placeholder for links]

👋 Connect:
[Social media placeholders]

#TamilTech #[Topic]Tags #[More relevant tags]

TAGS:
Generate 18-22 comma-separated tags including:
- Primary keyword variations
- Tamil keywords (in English letters)
- Related tech terms
- Long-tail keywords
- Competitor video keywords

Example: React tutorial Tamil, useState hook Tamil, React hooks explain, Tamil tech tutorial, learn React Tamil, web development Tamil...

THUMBNAILS:
3 thumbnail text options (3-5 words max, ALL CAPS works best):

1. [Emotion + Topic] - e.g., "useState 🤯 EXPLAINED!"
2. [Problem/Solution] - e.g., "REACT CONFUSION? ❌➡️✅"
3. [Benefit focused] - e.g., "MASTER REACT HOOKS 🎯"

COMMENT:
Write a pinned first comment in Thunglish that:
- Asks an engaging question
- Creates discussion
- Hints at future content
- Feels personal and friendly

Example format:
"Dei friends! 🔥 Ivlo vara antha [topic] pathi detailed ah paathom. Ungalukku innum enna topic la video venum? Comment pannunga da! Like panna marakatheenga! 👍

Next video la [related topic] pathi paakalam, interested ah? 🤔"`;

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "seo",
                formData
            }),
        });


        if (!response.ok) {
            throw new Error("Failed to generate SEO data");
        }

        const data = await response.json();
        const text = data.choices[0].message.content;

        // Parse the SEO data
        const titlesMatch = text.match(/TITLES:\n([\s\S]*?)(?=\n\nDESCRIPTION:)/);
        const descMatch = text.match(/DESCRIPTION:\n([\s\S]*?)(?=\n\nTAGS:)/);
        const tagsMatch = text.match(/TAGS:\n([\s\S]*?)(?=\n\nTHUMBNAILS:)/);
        const thumbMatch = text.match(/THUMBNAILS:\n([\s\S]*?)(?=\n\nCOMMENT:)/);
        const commentMatch = text.match(/COMMENT:\n([\s\S]*?)$/);

        const titles = titlesMatch
            ? titlesMatch[1]
                .split("\n")
                .filter((line: string) => line.match(/^\d+\./))
                .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
            : [];

        const thumbnails = thumbMatch
            ? thumbMatch[1]
                .split("\n")
                .filter((line: string) => line.match(/^\d+\./))
                .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
            : [];

        return {
            titles,
            description: descMatch ? descMatch[1].trim() : "",
            tags: tagsMatch ? tagsMatch[1].trim().split(",").map((tag: string) => tag.trim()) : [],
            thumbnails,
            comment: commentMatch ? commentMatch[1].trim() : "",
        };
    };

    // Generate Image Prompts
    const generateImagePrompts = async (
        fullScript: string,
        timestamps: Timestamps
    ): Promise<ImagePrompt[]> => {
        const { title, contentType, includeCode, imageFormat } = formData;

        const aspectRatio = imageFormat === "portrait" ? "9:16" : imageFormat === "square" ? "1:1" : "16:9";
        const formatHint = imageFormat === "portrait" ? "vertical mobile-first" : imageFormat === "square" ? "centered balanced" : "cinematic wide";

        // Concise system prompt - establishes expertise efficiently
        const systemPrompt = `Expert AI image prompt engineer. Create Midjourney/DALL-E 3/SDXL-ready prompts. Output: JSON array only, no markdown.`;

        // Optimized user prompt - essential info only, high signal-to-noise ratio
        const userPrompt = `Generate 8 ${aspectRatio} image prompts for: "${title}"
Type: ${contentType}${includeCode ? " (coding tutorial)" : ""}
Composition: ${formatHint}

Timeline:
Hook ${formatTime(timestamps.hookStart)}-${formatTime(timestamps.hookEnd)} | Intro ${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)} | Main ${formatTime(timestamps.mainStart)}-${formatTime(timestamps.mainEnd)} | Demo ${formatTime(timestamps.demoStart)}-${formatTime(timestamps.demoEnd)} | Outro ${formatTime(timestamps.outroStart)}-${formatTime(timestamps.outroEnd)}

Context: ${fullScript.substring(0, 800)}

Distribution: 2 Hook, 1 Intro, 3 Main, 1 Demo, 1 Outro

JSON format:
[{"id":1,"timestamp":"0:00-0:24","scene":"Hook","description":"[40-60 words: subject, composition, lighting, angle, quality modifiers like 8K, ultra detailed]","style":"[specific art style]","mood":"[atmosphere]","colorPalette":"[3 colors]","aspectRatio":"${aspectRatio}"}]

Requirements per prompt:
- Include lighting (rim/ambient/neon), depth (bokeh/layers), camera (lens/angle)
- Style: Cyberpunk/Photorealistic/Minimalist/Cinematic/Neon-futuristic
${includeCode ? "- Show: IDE screens, code snippets, terminal outputs, tech devices" : "- Show: Concept diagrams, infographics, professional visuals"}
- Optimized for ${aspectRatio} framing`;

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
        const text = data.choices[0].message.content;

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
        timestamps: Timestamps
    ): Promise<Chapter[]> => {
        const { title } = formData;

        const prompt = `Generate YouTube video chapters for: "${title}"

Timeline: Hook 0:00-${formatTime(timestamps.hookEnd)} | Intro ${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)} | Main ${formatTime(timestamps.mainStart)}-${formatTime(timestamps.mainEnd)} | Demo ${formatTime(timestamps.demoStart)}-${formatTime(timestamps.demoEnd)} | Outro ${formatTime(timestamps.outroStart)}-${formatTime(timestamps.outroEnd)}

Script summary: ${fullScript.substring(0, 600)}

Create 6-10 chapters. JSON array only:
[{"timestamp":"0:00","title":"Short engaging title (max 5 words)","description":"One line about this section"}]

Rules:
- First chapter MUST be 0:00
- Titles: engaging, curiosity-inducing
- Cover all major topic transitions`;

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "chapters",
                formData,
                fullScript,
                timestamps
            }),
        });

        if (!response.ok) throw new Error("Failed to generate chapters");

        const data = await response.json();
        const text = data.choices[0].message.content;
        try {
            return JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
        } catch {
            return [];
        }
    };

    // Generate B-Roll Suggestions
    const generateBRoll = async (
        fullScript: string,
        timestamps: Timestamps
    ): Promise<BRollSuggestion[]> => {
        const { title, contentType, includeCode } = formData;

        const prompt = `Generate B-Roll suggestions for: "${title}"
Type: ${contentType}${includeCode ? " (coding)" : ""}

Timeline: Hook-${formatTime(timestamps.hookEnd)} | Intro-${formatTime(timestamps.introEnd)} | Main-${formatTime(timestamps.mainEnd)} | Demo-${formatTime(timestamps.demoEnd)} | Outro-${formatTime(timestamps.outroEnd)}

Script: ${fullScript.substring(0, 500)}

Create 10-12 B-Roll suggestions. JSON array only:
[{"id":1,"timestamp":"0:00-0:24","scene":"Hook","suggestion":"Specific B-Roll description","source":"stock|screen|animation|self-record","searchTerms":["term1","term2","term3"]}]

Sources:
- stock: Pexels/Pixabay clips (general visuals)
- screen: Screen recordings (demos, code, tutorials)
- animation: Motion graphics, text animations
- self-record: Camera footage you film

${includeCode ? "Focus on: IDE screenshots, terminal outputs, code animations, typing sequences" : "Focus on: concept visuals, reactions, professional footage"}`;

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "broll",
                formData,
                fullScript,
                timestamps
            }),
        });

        if (!response.ok) throw new Error("Failed to generate B-Roll");

        const data = await response.json();
        const text = data.choices[0].message.content;
        try {
            return JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
        } catch {
            return [];
        }
    };

    // Generate Shorts/Clips
    const generateShorts = async (
        fullScript: string
    ): Promise<ShortClip[]> => {
        const { title, contentType } = formData;

        const prompt = `Extract 4 viral YouTube Shorts from this video: "${title}"
Type: ${contentType}

Full script:
${fullScript.substring(0, 1200)}

Create 4 standalone 30-60 second Shorts. JSON array only:
[{"id":1,"title":"Catchy Shorts title (curiosity/value)","hook":"Opening line (first 3 sec - must grab attention)","content":"Main content script (20-40 sec, complete thought, valuable standalone)","cta":"Closing CTA (like/follow/comment prompt)","originalTimestamp":"2:30-3:15","viralScore":85}]

Viral Score criteria (1-100):
- Hook strength (0-25)
- Standalone value (0-25) 
- Shareability (0-25)
- Engagement potential (0-25)

Focus on: surprising facts, quick tips, relatable moments, controversy/opinions`;

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                type: "shorts",
                formData,
                fullScript
            }),
        });

        if (!response.ok) throw new Error("Failed to generate Shorts");

        const data = await response.json();
        const text = data.choices[0].message.content;
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
            setTimeout(() => setCopiedImageId(null), 2000);
        } catch {
            setError("Failed to copy to clipboard");
        }
    };

    // Generic copy function
    const copyToClipboardGeneric = async (text: string, itemId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedItem(itemId);
            setTimeout(() => setCopiedItem(null), 2000);
        } catch {
            setError("Failed to copy to clipboard");
        }
    };




    // Copy to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(script);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
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
        const blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });

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
            const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
            if (!apiKey) throw new Error("API configuration missing");

            const systemPrompt = `You are a professional translator for YouTube scripts.
Your task is to translate the following script to ${targetLanguage}.

RULES:
1. Maintain ALL timestamps exactly as they are [00:00].
2. Keep the original tone (Casual/Professional).
3. Keep technical terms in English (e.g., React, API, Database).
4. Do not translate proper nouns or channel names.
5. Ensure the flow is natural for a native speaker of ${targetLanguage}.
${targetLanguage === "Thunglish" ? "6. Mix Tamil and English naturally (60% Tamil, 40% English)." : ""}
${targetLanguage === "Hindi" ? "6. Use Hinglish (Hindi + English tech terms) for a natural tech review feel." : ""}

Input format: Full script text
Output format: Translated script text ONLY. No other text.`;

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-4.0-mini",
                    max_tokens: 4000,
                    temperature: 0.5,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: script },
                    ],
                }),
            });

            if (!response.ok) throw new Error("Translation failed");

            const data = await response.json();
            const translatedScript = data.choices[0].message.content;

            setScript(translatedScript);

            // Auto-update language setting visually (optional, but good for UX)
            // setFormData({...formData, language: targetLanguage}); 

        } catch (err: any) {
            setError(err.message || "Translation failed. Please try again.");
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" async />

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Purchase Script Credit</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                            <p className="text-2xl font-bold text-yellow-600">₹9</p>
                            <p className="text-sm text-slate-600">per script generation</p>
                        </div>
                        <ul className="text-sm text-slate-600 mb-4 space-y-2">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Full script with SEO data</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Image prompts included</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Chapters, B-Roll & Shorts</li>
                        </ul>
                        <button
                            onClick={handlePayment}
                            disabled={processingPayment}
                            className="w-full py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50"
                        >
                            {processingPayment ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Pay with Razorpay"}
                        </button>
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
            <header className="sticky top-0 z-50 transition-all duration-300 border-b border-slate-200 bg-white shadow-sm">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-blue-900/10">
                                <img
                                    src="/scriptgen-logo.png"
                                    alt="SCRIPTGEN"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                                    SCRIPT<span className="text-blue-600">GEN</span>
                                </h1>
                                <p className="text-xs text-slate-500 font-medium">
                                    Viral scripts for <span className="text-blue-600">Any Creator</span> in Tamil, Hindi & English
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

                                    {/* Credits Display */}
                                    {credits && (
                                        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full shadow-inner">
                                            <CreditCard className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm font-medium text-slate-700">
                                                {credits.freeScriptsRemaining > 0
                                                    ? `${credits.freeScriptsRemaining} free`
                                                    : `${credits.paidCredits} credits`}
                                            </span>
                                        </div>
                                    )}

                                    {/* User Avatar */}
                                    <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                                        {session.user?.image ? (
                                            <img src={session.user.image} alt="" className="w-10 h-10 rounded-full ring-2 ring-blue-500/20 shadow-lg" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center ring-2 ring-blue-500/20">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => signOut()}
                                            className="hidden sm:flex text-slate-500 hover:text-red-500 transition-colors p-2 rounded-md hover:bg-red-500/10"
                                            title="Sign Out"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => signIn("google", { callbackUrl: "/" })}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
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

            <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Left Panel - Configuration (Protected) */}
                    <div className="w-full lg:w-2/5">
                        <div className="glass-card rounded-2xl p-6 sm:p-8 lg:sticky lg:top-28">
                            {!session ? (
                                /* Login Required Panel */
                                <div className="text-center py-12 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-blue-50/50">
                                        <Sparkles className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Join the Creator Studio</h3>
                                    <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                                        Unlock professional AI script generation, multi-language support, and viral features.
                                    </p>
                                    <div className="flex flex-col gap-3 mt-4 text-left px-8">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="p-1 bg-green-100 rounded-full">
                                                <Check className="w-3 h-3 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">2 Free High-Quality Scripts</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="p-1 bg-green-100 rounded-full">
                                                <Check className="w-3 h-3 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">Full SEO Metadata (Title, Tags, Desc)</span>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="p-1 bg-green-100 rounded-full">
                                                <Check className="w-3 h-3 text-green-600" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">AI Image Prompts for Thumbnails</span>
                                        </div>
                                    </div>

                                    <div className="px-8">
                                        <button
                                            onClick={() => signIn("google", { callbackUrl: "/" })}
                                            className="w-full mt-8 py-3.5 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all duration-200 flex items-center justify-center gap-3"
                                        >
                                            <LogIn className="w-5 h-5" />
                                            Get Started with Google
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-center gap-2 mt-6">
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <p className="text-xs font-medium text-slate-400">
                                            No credit card required for free trial
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Authenticated - Show Configuration */
                                /* Authenticated - Show Configuration */
                                <div className="bg-white rounded-2xl p-6 sm:p-8 h-full border border-slate-200 shadow-sm relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Settings2 className="w-5 h-5 text-slate-400" />
                                            <h2 className="text-lg font-semibold text-slate-800">Configuration</h2>
                                        </div>
                                        {credits && (
                                            <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full font-medium">
                                                {credits.freeScriptsRemaining > 0
                                                    ? `${credits.freeScriptsRemaining} free left`
                                                    : `${credits.paidCredits} credits`}
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
                                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all shadow-sm"
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
                                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder-slate-400 transition-all shadow-sm"
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
                                                className="absolute h-full bg-blue-500 rounded-full transition-all duration-150"
                                                style={{ width: `${((formData.duration - 5) / 15) * 100}%` }}
                                            ></div>
                                            <div
                                                className="absolute h-5 w-5 bg-blue-600 rounded-full shadow-md border-2 border-white top-1/2 -translate-y-1/2 transition-all duration-150 pointer-events-none"
                                                style={{ left: `${((formData.duration - 5) / 15) * 100}%`, transform: `translate(-50%, -50%)` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-xs text-slate-400 font-medium">
                                            <span>5 min</span>
                                            <span>20 min</span>
                                        </div>
                                    </div>
                                    {/* Content Type & Difficulty */}
                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Content Type
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={formData.contentType}
                                                    onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 appearance-none cursor-pointer transition-all shadow-sm"
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
                                                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 appearance-none cursor-pointer transition-all shadow-sm"
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
                                    <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                                Project Language
                                            </label>
                                            <span className="text-xs text-blue-700 font-medium bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                                                AI Optimized
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {["English", "Tamil", "Hindi"].map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => setFormData({ ...formData, language: lang })}
                                                    className={`px-3 py-2.5 text-sm font-medium rounded-lg border transition-all ${formData.language === lang
                                                        ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
                                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                        }`}
                                                >
                                                    {lang}
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
                                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-all shadow-sm"
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
                                                    className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 transition-colors"
                                                />
                                                <span className="text-sm text-slate-600 group-hover:text-slate-900">Include code examples</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.localContext}
                                                    onChange={(e) => setFormData({ ...formData, localContext: e.target.checked })}
                                                    className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 transition-colors"
                                                />
                                                <span className="text-sm text-slate-600 group-hover:text-slate-900">Add Tamil Nadu context</span>
                                            </label>
                                        </div>

                                        {/* Image Settings Divider */}
                                        <div className="mt-5 pt-4 border-t border-slate-100">
                                            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-blue-600" />
                                                Premium Features (₹9 each)
                                            </h4>

                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors -ml-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.includeChapters}
                                                        onChange={(e) => setFormData({ ...formData, includeChapters: e.target.checked })}
                                                        className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
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
                                                        className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
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
                                                        className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
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
                                                            className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                                                        />
                                                        <div>
                                                            <span className="text-sm font-medium text-slate-700">Generate AI Image Prompts</span>
                                                        </div>
                                                    </label>

                                                    {formData.generateImages && (
                                                        <select
                                                            value={formData.imageFormat}
                                                            onChange={(e) => setFormData({ ...formData, imageFormat: e.target.value })}
                                                            className="w-32 px-2 py-1 bg-white border border-slate-300 rounded-md text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                                    <div className="mt-8">
                                        <button
                                            onClick={generateScript}
                                            disabled={loading || !formData.title.trim()}
                                            className="w-full py-3.5 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-md active:transform active:scale-[0.98]"
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
                                        <p className="text-center text-xs text-slate-400 mt-2">
                                            Consumes 1 credit or 1 free generation
                                        </p>
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
                        <div className="bg-white rounded-2xl min-h-[600px] flex flex-col shadow-sm border border-slate-200 relative overflow-hidden">
                            {/* Accent Top Border */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>

                            {/* Tabs Header */}
                            <div className="flex items-center justify-between px-2 pt-2 border-b border-slate-200 bg-slate-50">
                                <div className="flex items-center gap-2 overflow-x-auto w-full no-scrollbar pb-0">
                                    {[
                                        { id: "script", label: "Script" },
                                        { id: "seo", label: "SEO" },
                                        { id: "images", label: "Images" },
                                        { id: "chapters", label: "Chapters" },
                                        { id: "broll", label: "B-Roll" },
                                        { id: "shorts", label: "Shorts" },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`relative flex-shrink-0 px-6 py-3 text-sm font-semibold transition-all rounded-t-lg z-10 ${activeTab === tab.id
                                                ? "bg-white text-blue-600 border-t border-l border-r border-slate-200 shadow-[0_-2px_6px_rgba(0,0,0,0.02)]"
                                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border-transparent"
                                                }`}
                                        >
                                            {activeTab === tab.id && (
                                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-lg"></div>
                                            )}
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-3 sm:p-4 md:p-6">
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
                                                        className="flex items-center gap-2 px-3 py-2 text-sm border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                                                    >
                                                        {isTranslating ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Translating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Sparkles className="w-4 h-4" />
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
                                                    className="flex items-center gap-2 px-3 py-2 text-sm border border-blue-200 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
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
                                                        className="flex items-center gap-2 px-3 py-2 text-sm border border-blue-200 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
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
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                            <FileText className="w-16 h-16 mb-4 opacity-50" />
                                            <p className="text-lg font-medium">No script generated yet</p>
                                            <p className="text-sm mt-1">Configure your video settings and click Generate</p>
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
                                                        <li key={index} className="p-2 bg-slate-50 rounded-md text-sm text-slate-700">
                                                            {index + 1}. {title}
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
                                                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Thumbnail Suggestions */}
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-900 mb-3">Thumbnail Text Suggestions</h3>
                                                <ul className="space-y-2">
                                                    {seoData.thumbnails.map((thumb, index) => (
                                                        <li key={index} className="p-2 bg-slate-50 rounded-md text-sm font-medium text-slate-700">
                                                            {index + 1}. {thumb}
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
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                            <Search className="w-16 h-16 mb-4 opacity-50" />
                                            <p className="text-lg font-medium">No SEO data generated yet</p>
                                            <p className="text-sm mt-1">SEO data will be generated after the script</p>
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
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                            <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                                            <p className="text-lg font-medium">No image prompts generated yet</p>
                                            <p className="text-sm mt-1">Image prompts will be generated after the script</p>
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
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                            <List className="w-16 h-16 mb-4 opacity-50" />
                                            <p className="text-lg font-medium">No chapters generated yet</p>
                                            <p className="text-sm mt-1">Chapters will be generated after the script</p>
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
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                            <Film className="w-16 h-16 mb-4 opacity-50" />
                                            <p className="text-lg font-medium">No B-Roll suggestions yet</p>
                                            <p className="text-sm mt-1">B-Roll will be generated after the script</p>
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
                                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                            <Scissors className="w-16 h-16 mb-4 opacity-50" />
                                            <p className="text-lg font-medium">No Shorts clips generated yet</p>
                                            <p className="text-sm mt-1">Shorts will be extracted after the script</p>
                                        </div>
                                    )
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div >
            </main >

            {/* Footer */}
            <footer className="mt-12 py-8 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-slate-500">
                        SCRIPTGEN • Built for Creators Worldwide
                    </p>
                </div>
            </footer>
        </div >
    );
}

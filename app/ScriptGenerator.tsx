"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
    FileText,
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
} from "lucide-react";

// Types
interface FormData {
    title: string;
    channelName: string;
    duration: number;
    contentType: string;
    difficulty: string;
    tone: string;
    thunglishRatio: number;
    includeCode: boolean;
    localContext: boolean;
    generateImages: boolean;
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
        thunglishRatio: 70,
        includeCode: false,
        localContext: false,
        generateImages: true,
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

    // Handle payment
    const handlePayment = async () => {
        setProcessingPayment(true);
        try {
            const res = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credits: 1 }),
            });
            const order = await res.json();

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "Thunglish Script Generator",
                description: "1 Script Credit",
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
        apiKey: string,
        previousContent: string = ""
    ): Promise<string> => {
        const { thunglishRatio, includeCode, title, contentType, tone, difficulty, channelName, localContext } = formData;

        // Build system message for consistent high-quality output
        const systemMessage = `You are a MASTER YouTube script writer who specializes in Tamil tech content. You have 10+ years of experience creating viral tech videos for Tamil-speaking audiences.

YOUR EXPERTISE:
- You understand the Tamil tech YouTube ecosystem perfectly
- You know exactly how to blend Tamil and English naturally (Thunglish)
- You create scripts that feel like a friend explaining tech, not a lecture
- Your hooks have 95%+ retention rates
- Your explanations are crystal clear yet entertaining

THUNGLISH MASTERY (${thunglishRatio}% Tamil, ${100 - thunglishRatio}% English):

TAMIL USAGE - Use Tamil for:
• Emotional expressions: "Dei!", "Macha!", "Thalaiva!", "Semma!", "Vera level!"
• Connecting phrases: "theriyuma", "paaru", "purinjicha", "solren", "kelunga"
• Explanations: "Inga paaru", "Athanala dhan", "Appo enna nadakkum na"
• Reactions: "Adhirchi!", "Bayangaram!", "Kalaakku!", "Mass!"
• Casual speech: "pannalam", "paapom", "panna porom"

ENGLISH USAGE - Keep English for:
• Technical terms: React, JavaScript, API, useState, async, function, variable
• Code syntax: const, let, import, export, return
• Tool names: VS Code, Node.js, npm, Git
• Industry terms: frontend, backend, deployment, debugging

NATURAL FLOW EXAMPLES:
✅ "Dei, antha useState hook la enna nadakkuthu theriyuma? State manage panna romba easy da!"
✅ "Seri friends, ippo namma oru React component create pannalam, itha parunga..."  
✅ "Inga paaru, antha async function call aagumbothu, JavaScript engine enna pannuthu na..."
✅ "Macha, itha neenga purinjicha, interview la vera level ah perform pannuveenga!"

NEVER DO:
❌ Don't use formal Tamil like textbooks
❌ Don't translate technical terms to Tamil
❌ Don't make it sound robotic or scripted
❌ Don't use outdated Tamil phrases

TONE: ${tone === 'casual' ? 'Like explaining to your best friend over chai' : tone === 'professional' ? 'Confident expert but still approachable' : tone === 'humorous' ? 'Fun, witty, with tech memes and jokes' : tone === 'motivational' ? 'Inspiring, you-can-do-it energy' : 'Storytelling with suspense and engagement'}

${localContext ? `TAMIL NADU CONTEXT: Include references that Tamil audience relates to - Chennai IT corridors, Zoho/Freshworks success stories, local tech meetups, relatable salary/job scenarios, comparison with local examples.` : ''}`;

        let userPrompt = "";

        if (stage === "hook_intro") {
            userPrompt = `Create a KILLER hook and intro for this Tamil tech YouTube video.

VIDEO DETAILS:
📌 Title: ${title}
${channelName ? `📺 Channel: ${channelName}` : ""}
🎯 Difficulty: ${difficulty}
⏱️ Hook: ${formatTime(timestamps.hookStart)} - ${formatTime(timestamps.hookEnd)}
⏱️ Intro: ${formatTime(timestamps.introStart)} - ${formatTime(timestamps.introEnd)}

HOOK REQUIREMENTS (${formatTime(timestamps.hookStart)}-${formatTime(timestamps.hookEnd)}):
The hook must grab attention in the FIRST 3 SECONDS. Use one of these proven patterns:
- SHOCK: Start with a surprising fact or controversial statement
- QUESTION: Ask something that makes them curious
- PROMISE: Tell them exactly what transformation they'll get
- PROBLEM: Describe a pain point they're facing right now
- STORY: Start mid-action in an interesting scenario

Write the hook in Thunglish that sounds like you're bursting with excitement to share this!

INTRO REQUIREMENTS (${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)}):
- Quick channel intro (if channel name provided)
- Clear promise of what they'll learn
- Create curiosity loop ("Itha paathutu neenga shock aaveenga!")
- Add engagement hook ("Comment la sollunga...")

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

VIDEO SCRIPT: ${title}

[${formatTime(timestamps.hookStart)}-${formatTime(timestamps.hookEnd)}] 🎯 HOOK
Visual: [specific visual direction]

[Write 3-5 powerful sentences that HOOK the viewer instantly]

💡 Why This Hook Works: [explain the psychology - curiosity gap, fear of missing out, etc.]

---

[${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)}] 🎬 INTRO  
Visual: [specific visual direction]

[Write engaging intro - greet audience, introduce yourself briefly if channel name given, explain what's coming, build anticipation]

🗣️ Engagement Prompt: [specific question to boost comments]`;

        } else if (stage === "main_content") {
            userPrompt = `Continue this Tamil tech YouTube script with the MAIN CONTENT section.

VIDEO: ${title}
CONTENT TYPE: ${contentType}
${includeCode ? "⚠️ CODE REQUIRED: This is a coding tutorial - include complete, working code examples!" : ""}

TIMESTAMP RANGE: ${formatTime(timestamps.mainStart)} - ${formatTime(timestamps.mainEnd)}

PREVIOUS SCRIPT:
${previousContent.substring(0, 1500)}

MAIN CONTENT REQUIREMENTS:
1. Break into 3-4 logical subsections with timestamps
2. Each subsection should have a clear mini-goal
3. Use analogies Tamil audience understands
4. Keep energy high throughout
5. Add "checkpoint" moments ("Ivlo vara clear ah? Comment la sollunga!")

${includeCode ? `
🔥 CODE EXPLANATION RULES (CRITICAL - FOLLOW EXACTLY):

STEP 1: Show the COMPLETE working code first
\`\`\`javascript
// Full code here - no placeholders, must be real working code
\`\`\`

STEP 2: Line-by-line breakdown with this EXACT format:

"Seri da, ippo antha code ah line by line 🔍 paapom!"

📍 Line 1: \`const [count, setCount] = useState(0);\`
"Inga paaru macha, 'const' use pannirkrom - ithu variable declare panrathu. Square brackets la 'count' and 'setCount' nu rendu iruku. 'count' la current value store aagum, 'setCount' use panni value ah update pannalam. 'useState(0)' - ithu initial value 0 nu set pannuthu. Basically, antha line namma state ah initialize pannuthu da!"

📍 Line 2: [next line of code]
"[Natural Thunglish explanation - be detailed!]"

[CONTINUE FOR EVERY SINGLE LINE - NO SKIPPING!]

🎯 Code Summary:
"Overall ah paatha, antha code [summarize what the complete code does in Thunglish]"

⚠️ Common Mistakes:
"Indha code la romba per enna thapu pannuvanga na: [explain 2-3 common errors]"
` : `
Explain concepts clearly with:
- Real-world analogies
- Practical examples
- Visual descriptions for editing
`}

FORMAT YOUR RESPONSE:

[${formatTime(timestamps.mainStart)}-SUBSECTION_END_TIME] 📚 SUBSECTION 1: [Title]
Visual: [visual direction]

[Detailed content with natural Thunglish]

---

[Continue with more subsections...]`;

        } else if (stage === "demo_outro") {
            userPrompt = `Complete this Tamil tech YouTube script with DEMO and OUTRO sections.

VIDEO: ${title}
DEMO: ${formatTime(timestamps.demoStart)} - ${formatTime(timestamps.demoEnd)}
OUTRO: ${formatTime(timestamps.outroStart)} - ${formatTime(timestamps.outroEnd)}

PREVIOUS SCRIPT:
${previousContent.substring(0, 2000)}

DEMO SECTION REQUIREMENTS (${formatTime(timestamps.demoStart)}-${formatTime(timestamps.demoEnd)}):
${includeCode ? `
🖥️ LIVE CODING DEMO:
- Start fresh - "Seri, ippo namma scratch la irundhu build pannalam!"
- Show every step in real-time
- Explain what you're typing and why
- Show the output at each stage
- Demonstrate what happens with wrong code
- Show the final working result with celebration!

Include:
1. Complete step-by-step implementation
2. Console outputs / visual results
3. At least 2 common errors and how to fix them
4. Final "WOW" moment when it works
` : `
📱 PRACTICAL DEMO:
- Show real-world application
- Step-by-step walkthrough
- Highlight key actions
- Show before/after results
`}

OUTRO SECTION REQUIREMENTS (${formatTime(timestamps.outroStart)}-${formatTime(timestamps.outroEnd)}):

Create a memorable outro that:
1. Summarizes 3 key takeaways (in Thunglish)
2. Reinforces the value they got
3. Strong call-to-action (like, subscribe, comment with specific question)
4. Teases next video to keep them wanting more
5. Warm, friendly sign-off that builds community

FORMAT YOUR RESPONSE:

[${formatTime(timestamps.demoStart)}-${formatTime(timestamps.demoEnd)}] 🛠️ PRACTICAL DEMO
Visual: Full screen recording / Split screen with face cam

"Seri friends, ippo real ah implement pannalam! Excitement ah?"

[Step-by-step demo content]

---

[${formatTime(timestamps.outroStart)}-${formatTime(timestamps.outroEnd)}] 👋 OUTRO
Visual: Back to talking head, maybe with graphics overlay

"Semma da! 🔥 Ippo namma paathatha oru quick recap paapom:

1️⃣ [Key takeaway 1]
2️⃣ [Key takeaway 2]  
3️⃣ [Key takeaway 3]"

[Strong call-to-action]

[Next video tease]

"Seri friends, next video la ______ pathi paapom! Athuvum vera level content dhan!"

"Like button ah oru thatta thattunga 👍, Subscribe button ah press pannunga 🔔, Comment la _____ pathi ungal experience sollunga!"

"See you in the next video! Take care, bye da! 🙏"`;
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4.1",
                max_tokens: 3500,
                temperature: 0.8,
                messages: [
                    {
                        role: "system",
                        content: systemMessage,
                    },
                    {
                        role: "user",
                        content: userPrompt,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    };

    // Generate production notes
    const generateProductionNotes = async (
        apiKey: string,
        fullScript: string
    ): Promise<string> => {
        const { title, includeCode } = formData;

        const systemPrompt = `You are an expert YouTube video producer and editor who specializes in Tamil tech content. You understand exactly what makes tech tutorials visually engaging and easy to follow. Your production notes are used by professional video editors.`;

        const userPrompt = `Create DETAILED production notes for this Tamil tech YouTube video.

VIDEO TITLE: ${title}

SCRIPT SUMMARY:
${fullScript.substring(0, 2500)}

Generate comprehensive production notes that a video editor can directly use:

═══════════════════════════════════════════════════════════════
📹 PRODUCTION NOTES: ${title}
═══════════════════════════════════════════════════════════════

🎬 B-ROLL SHOTS NEEDED:
List 6-8 SPECIFIC B-roll shots with exact descriptions:
1. [Timestamp range] - [Exact description of what to show]
2. [Continue for each...]

Example format:
1. [0:15-0:20] - Close-up of hands typing on mechanical keyboard with code visible on screen
2. [1:30-1:45] - Stock footage of server room with blinking lights

---

🎨 GRAPHICS & ANIMATIONS:
List 4-6 specific graphics to create:
${includeCode ? `
- Animated code snippet appearing line by line
- Variable/function name callouts with arrows
- Before/After code comparison split screen
- Error message popup graphics
- Console output overlay
` : `
- Key concept text animations
- Diagram/flowchart for explaining concepts
- List animations for main points
`}

---

${includeCode ? `
💻 CODE DISPLAY REQUIREMENTS:
- IDE Theme: Dark theme (Dracula/One Dark recommended)
- Font: Fira Code or JetBrains Mono, 18px minimum
- Line highlighting: Yellow/green glow on current line being explained
- Zoom: 150% when explaining specific lines
- Show line numbers: YES
- Show file tabs: When switching between files
- Terminal/Console: Side panel or bottom panel, clearly visible

📍 CODE MOMENTS TO HIGHLIGHT:
- Each import statement (briefly)
- Function declarations (zoom in)
- Variable assignments (highlight the value)
- Return statements (emphasize)
- Error-causing lines (red highlight)
- Fixed code (green highlight with checkmark)

` : `
🖥️ SCREEN RECORDING NOTES:
- Resolution: 1080p minimum
- Cursor highlighting: Enable with yellow circle
- Zoom on important elements
- Clean desktop, hide personal items
`}

---

🎵 BACKGROUND MUSIC GUIDE:
| Section | Music Style | Energy Level | Volume |
|---------|-------------|--------------|--------|
| Hook | Upbeat electronic | High 🔥 | 30% |
| Intro | Motivational tech | Medium-High | 25% |
| Main Content | Lo-fi ambient | Low-Medium | 15% |
${includeCode ? `| Code Explanation | Minimal/None | Very Low | 10% |` : ''}
| Demo | Building momentum | Medium | 20% |
| Outro | Uplifting, achievement | High | 30% |

Recommended: Epidemic Sound / Artlist tracks - search "tech tutorial", "coding", "productivity"

---

📝 TEXT OVERLAYS TO ADD:
List 6-8 key phrases that should appear on screen:
${includeCode ? `
1. Function/variable names when first introduced
2. Key syntax to remember
3. "Pro Tip:" callouts
4. Common error messages
5. Output examples
` : `
1. Main topic title
2. Key points as bullet lists
3. Important terms with definitions
4. Step numbers for processes
`}

---

✂️ EDITING NOTES:

TRANSITIONS:
- Between sections: Simple cut or subtle zoom
- Concept to example: Whip pan or dissolve
- Code to output: Split second freeze + slide

PACING:
- Hook: Fast cuts, high energy
- Explanation: Slower, let it breathe
- Code walkthrough: Match narration speed exactly
- Demo: Real-time with minor speedups for typing

EFFECTS TO USE:
${includeCode ? `
- Code zoom: Smooth 1.5x zoom on specific lines
- Highlight box: Rounded rectangle around important code
- Arrow annotations: Point to specific syntax
- Typing animation: For code reveal moments
- Error shake: Screen shake for error demonstrations
- Success pop: Confetti or checkmark for working code
` : `
- Zoom punches on key words
- Lower thirds for topic labels
- Callout boxes for definitions
- Progress indicators for multi-step processes
`}

---

📱 THUMBNAIL NOTES:
- Main subject: ${includeCode ? 'Code snippet or error message' : 'Key visual representing the topic'}
- Expression: Excited/surprised face (if using face)
- Text: Maximum 3-4 words, bold sans-serif
- Colors: High contrast, brand consistent
- Elements: Arrow pointing to key thing, emoji optional`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4.1",
                max_tokens: 3000,
                temperature: 0.7,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: userPrompt,
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate production notes");
        }

        const data = await response.json();
        return data.choices[0].message.content;
    };

    // Generate SEO data
    const generateSEOData = async (apiKey: string): Promise<SEOData> => {
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

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4.1",
                max_tokens: 2500,
                temperature: 0.7,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: userPrompt,
                    },
                ],
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
        apiKey: string,
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

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4.1",
                max_tokens: 2500,
                temperature: 0.7,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
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
        apiKey: string,
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

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4.1",
                max_tokens: 1000,
                temperature: 0.6,
                messages: [{ role: "user", content: prompt }],
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
        apiKey: string,
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

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4.1",
                max_tokens: 1500,
                temperature: 0.7,
                messages: [{ role: "user", content: prompt }],
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
        apiKey: string,
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

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: "gpt-4.1",
                max_tokens: 2000,
                temperature: 0.8,
                messages: [{ role: "user", content: prompt }],
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

    // Main generate function
    const generateScript = async () => {
        // Check if user is logged in
        if (!session) {
            setError("Please sign in to generate scripts.");
            signIn("google");
            return;
        }

        // Check if user has credits
        if (credits && !credits.canGenerate) {
            setShowPaymentModal(true);
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

        if (!apiKey) {
            setError("API key not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your .env.local file.");
            return;
        }

        if (!formData.title.trim()) {
            setError("Please enter a video title.");
            return;
        }

        setLoading(true);
        setError("");
        setScript("");
        setSeoData(null);
        setImagesData(null);
        setChaptersData(null);
        setBrollData(null);
        setShortsData(null);
        setProgress("Stage 1/6: Generating Hook & Intro...");

        try {
            const timestamps = generateTimestamps(formData.duration);
            let fullScript = "";

            // Stage 1: Hook & Intro
            const hookIntro = await generateSection("hook_intro", timestamps, apiKey);
            fullScript = hookIntro;
            setScript(fullScript);
            setProgress("Stage 2/6: Generating Main Content...");

            // Stage 2: Main Content
            const mainContent = await generateSection("main_content", timestamps, apiKey, fullScript);
            fullScript += "\n\n" + mainContent;
            setScript(fullScript);
            setProgress("Stage 3/6: Generating Demo & Outro...");

            // Stage 3: Demo & Outro
            const demoOutro = await generateSection("demo_outro", timestamps, apiKey, fullScript);
            fullScript += "\n\n" + demoOutro;
            setScript(fullScript);
            setProgress("Stage 4/6: Generating Production Notes...");

            // Stage 4: Production Notes
            const productionNotes = await generateProductionNotes(apiKey, fullScript);
            fullScript += "\n\n" + productionNotes;
            setScript(fullScript);
            setProgress("Stage 5/6: Generating SEO & Media Assets...");

            // Stage 5: Generate SEO, Images, Chapters, B-Roll in parallel
            const promises: Promise<void>[] = [];

            // SEO Data
            promises.push(
                generateSEOData(apiKey)
                    .then((seo) => setSeoData(seo))
                    .catch(() => console.error("SEO generation failed"))
            );

            // Image Prompts (if enabled)
            if (formData.generateImages) {
                promises.push(
                    generateImagePrompts(apiKey, fullScript, timestamps)
                        .then((images) => setImagesData(images))
                        .catch(() => console.error("Image prompts generation failed"))
                );
            }

            // Chapters
            promises.push(
                generateChapters(apiKey, fullScript, timestamps)
                    .then((chapters) => setChaptersData(chapters))
                    .catch(() => console.error("Chapters generation failed"))
            );

            // B-Roll
            promises.push(
                generateBRoll(apiKey, fullScript, timestamps)
                    .then((broll) => setBrollData(broll))
                    .catch(() => console.error("B-Roll generation failed"))
            );

            await Promise.all(promises);
            setProgress("Stage 6/6: Generating Shorts Clips...");

            // Stage 6: Generate Shorts (after we have full script)
            try {
                const shorts = await generateShorts(apiKey, fullScript);
                setShortsData(shorts);
            } catch {
                console.error("Shorts generation failed");
            }

            // Deduct credit after successful generation
            try {
                await fetch("/api/credits", { method: "POST" });
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
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred while generating the script.");
        } finally {
            setLoading(false);
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
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                            <p className="text-2xl font-bold text-blue-600">₹9</p>
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
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
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
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Video className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                                    Thunglish Script Generator
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                                    Professional scripts for Tamil tech YouTube creators
                                </p>
                            </div>
                        </div>

                        {/* Auth & Credits */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {session ? (
                                <>
                                    {/* History Button */}
                                    <button
                                        onClick={() => { setShowHistory(true); fetchHistory(); }}
                                        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                                        title="Script History"
                                    >
                                        <History className="w-4 h-4 text-slate-600" />
                                        <span className="hidden sm:inline text-sm font-medium text-slate-700">History</span>
                                    </button>

                                    {/* Credits Display */}
                                    {credits && (
                                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                                            <CreditCard className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-medium text-slate-700">
                                                {credits.freeScriptsRemaining > 0
                                                    ? `${credits.freeScriptsRemaining} free`
                                                    : `${credits.paidCredits} credits`}
                                            </span>
                                        </div>
                                    )}

                                    {/* User Avatar */}
                                    <div className="flex items-center gap-2">
                                        {session.user?.image ? (
                                            <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="w-4 h-4 text-blue-600" />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => signOut()}
                                            className="hidden sm:flex items-center gap-1 px-2 py-1 text-sm text-slate-600 hover:text-slate-900"
                                        >
                                            <LogOut className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button
                                    onClick={() => signIn("google")}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
                        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 lg:sticky lg:top-24">
                            {!session ? (
                                /* Login Required Panel */
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <LogIn className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-semibold text-slate-900 mb-2">
                                        Sign in to Generate Scripts
                                    </h2>
                                    <p className="text-slate-600 mb-6 text-sm">
                                        Create professional Thunglish scripts for your Tamil tech YouTube channel
                                    </p>

                                    {/* Features List */}
                                    <div className="text-left bg-slate-50 rounded-lg p-4 mb-6">
                                        <p className="text-xs font-semibold text-slate-500 uppercase mb-3">What you get:</p>
                                        <ul className="space-y-2 text-sm text-slate-700">
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span><strong>2 Free Scripts</strong> to start</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span>Complete script with SEO data</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span>AI image prompts included</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span>YouTube chapters & B-Roll suggestions</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <span>Shorts clips extraction</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => signIn("google")}
                                        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Sign in with Google
                                    </button>

                                    <p className="text-xs text-slate-500 mt-4">
                                        Only ₹9 per script after free trial
                                    </p>
                                </div>
                            ) : (
                                /* Authenticated - Show Configuration */
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Settings className="w-5 h-5 text-slate-600" />
                                            <h2 className="text-lg font-medium text-slate-900">Configuration</h2>
                                        </div>
                                        {credits && (
                                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
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
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                        />
                                    </div>

                                    {/* Channel Name */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Channel Name <span className="text-slate-400">(optional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.channelName}
                                            onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                                            placeholder="Your channel name"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                                        />
                                    </div>

                                    {/* Duration Slider */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Video Duration: <span className="font-semibold text-blue-600">{formData.duration} minutes</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="5"
                                            max="20"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                                            <span>5 min</span>
                                            <span>20 min</span>
                                        </div>
                                    </div>

                                    {/* Content Type */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Content Type
                                        </label>
                                        <select
                                            value={formData.contentType}
                                            onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
                                        >
                                            {contentTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Tone */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Tone
                                        </label>
                                        <select
                                            value={formData.tone}
                                            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
                                        >
                                            {tones.map((t) => (
                                                <option key={t.value} value={t.value}>
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Advanced Options Toggle */}
                                    <button
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
                                    >
                                        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        Advanced Options
                                    </button>

                                    {/* Advanced Options */}
                                    {showAdvanced && (
                                        <div className="bg-slate-50 rounded-lg p-4 mb-5 border border-slate-200">
                                            {/* Difficulty Level */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Difficulty Level
                                                </label>
                                                <select
                                                    value={formData.difficulty}
                                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
                                                >
                                                    {difficulties.map((d) => (
                                                        <option key={d.value} value={d.value}>
                                                            {d.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Thunglish Ratio */}
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                                    Thunglish Ratio: <span className="font-semibold text-blue-600">{formData.thunglishRatio}% Tamil</span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="50"
                                                    max="90"
                                                    value={formData.thunglishRatio}
                                                    onChange={(e) => setFormData({ ...formData, thunglishRatio: parseInt(e.target.value) })}
                                                    className="w-full"
                                                />
                                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                                    <span>50% Tamil</span>
                                                    <span>90% Tamil</span>
                                                </div>
                                            </div>

                                            {/* Checkboxes */}
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.includeCode}
                                                        onChange={(e) => setFormData({ ...formData, includeCode: e.target.checked })}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-slate-700">Include code examples</span>
                                                </label>
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.localContext}
                                                        onChange={(e) => setFormData({ ...formData, localContext: e.target.checked })}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-slate-700">Add Tamil Nadu context</span>
                                                </label>
                                            </div>

                                            {/* Image Settings Divider */}
                                            <div className="mt-5 pt-4 border-t border-slate-200">
                                                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4" />
                                                    Image Prompt Settings
                                                </h4>

                                                {/* Generate Images Toggle */}
                                                <label className="flex items-center gap-3 cursor-pointer mb-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.generateImages}
                                                        onChange={(e) => setFormData({ ...formData, generateImages: e.target.checked })}
                                                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                                    />
                                                    <div>
                                                        <span className="text-sm text-slate-700">Generate AI Image Prompts</span>
                                                        <p className="text-xs text-slate-500">Creates 10 production-ready prompts for AI image generators</p>
                                                    </div>
                                                </label>

                                                {/* Image Format Selector - Only show if generateImages is true */}
                                                {formData.generateImages && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                                            Image Format
                                                        </label>
                                                        <select
                                                            value={formData.imageFormat}
                                                            onChange={(e) => setFormData({ ...formData, imageFormat: e.target.value })}
                                                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white text-sm"
                                                        >
                                                            {imageFormats.map((format) => (
                                                                <option key={format.value} value={format.value}>
                                                                    {format.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {formData.imageFormat === "portrait"
                                                                ? "Optimized for YouTube Shorts, Instagram Reels, TikTok"
                                                                : formData.imageFormat === "square"
                                                                    ? "Perfect for thumbnails and social media posts"
                                                                    : "Standard YouTube and desktop video format"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Error Message */}
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Generate Button */}
                                    <button
                                        onClick={generateScript}
                                        disabled={loading || !formData.title.trim()}
                                        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                Generate Script
                                            </>
                                        )}
                                    </button>

                                    {/* Progress Indicator */}
                                    {progress && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                                <span className="text-sm text-blue-700">{progress}</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Output */}
                    <div className="w-full lg:w-3/5">
                        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            {/* Tabs */}
                            <div className="tabs-container border-b border-slate-200">
                                <button
                                    onClick={() => setActiveTab("script")}
                                    className={`flex-shrink-0 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${activeTab === "script"
                                        ? "tab-active"
                                        : "tab-inactive"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <FileText className="w-4 h-4" />
                                        <span className="hidden xs:inline sm:inline">Script</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("seo")}
                                    className={`flex-shrink-0 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${activeTab === "seo"
                                        ? "tab-active"
                                        : "tab-inactive"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <Search className="w-4 h-4" />
                                        <span className="hidden xs:inline sm:inline">SEO</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("images")}
                                    className={`flex-shrink-0 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${activeTab === "images"
                                        ? "tab-active"
                                        : "tab-inactive"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        <span className="hidden xs:inline sm:inline">Images</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("chapters")}
                                    className={`flex-shrink-0 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${activeTab === "chapters"
                                        ? "tab-active"
                                        : "tab-inactive"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <List className="w-4 h-4" />
                                        <span className="hidden xs:inline sm:inline">Chapters</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("broll")}
                                    className={`flex-shrink-0 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${activeTab === "broll"
                                        ? "tab-active"
                                        : "tab-inactive"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <Film className="w-4 h-4" />
                                        <span className="hidden xs:inline sm:inline">B-Roll</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab("shorts")}
                                    className={`flex-shrink-0 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium transition-colors ${activeTab === "shorts"
                                        ? "tab-active"
                                        : "tab-inactive"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <Scissors className="w-4 h-4" />
                                        <span className="hidden xs:inline sm:inline">Shorts</span>
                                    </div>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-3 sm:p-4 md:p-6">
                                {activeTab === "script" ? (
                                    script ? (
                                        <>
                                            {/* Action Buttons */}
                                            <div className="flex gap-2 mb-4">
                                                <button
                                                    onClick={copyToClipboard}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50 transition-colors text-slate-700"
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
                                                <button
                                                    onClick={downloadScript}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50 transition-colors text-slate-700"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </button>
                                            </div>

                                            {/* Script Display */}
                                            <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-[70vh]">
                                                <pre className="text-slate-100 text-sm whitespace-pre-wrap font-mono leading-relaxed">
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
                                                    <h3 className="text-lg font-semibold text-slate-900">AI Image Prompts</h3>
                                                    <p className="text-sm text-slate-500">{imagesData.length} prompts generated for your video</p>
                                                </div>
                                            </div>

                                            {/* Image Prompt Cards */}
                                            <div className="space-y-4 max-h-[70vh] overflow-auto">
                                                {imagesData.map((prompt) => (
                                                    <div
                                                        key={prompt.id}
                                                        className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-4 border border-slate-200 hover:border-blue-300 transition-colors"
                                                    >
                                                        {/* Header Row */}
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                                                                    {prompt.timestamp}
                                                                </span>
                                                                <span className={`px-2 py-1 text-xs font-medium rounded ${prompt.scene === "Hook" ? "bg-red-100 text-red-700" :
                                                                    prompt.scene === "Intro" ? "bg-orange-100 text-orange-700" :
                                                                        prompt.scene === "Main Content" ? "bg-green-100 text-green-700" :
                                                                            prompt.scene === "Demo" ? "bg-purple-100 text-purple-700" :
                                                                                "bg-cyan-100 text-cyan-700"
                                                                    }`}>
                                                                    {prompt.scene}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => copyImagePrompt(prompt)}
                                                                className="flex items-center gap-1 px-2 py-1 text-xs border border-slate-300 rounded hover:bg-white transition-colors text-slate-600"
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
                                                        <p className="text-sm text-slate-800 mb-3 leading-relaxed">
                                                            {prompt.description}
                                                        </p>

                                                        {/* Metadata Grid */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                            <div className="bg-white rounded p-2">
                                                                <span className="text-xs text-slate-500 block">Style</span>
                                                                <span className="text-xs font-medium text-slate-700">{prompt.style}</span>
                                                            </div>
                                                            <div className="bg-white rounded p-2">
                                                                <span className="text-xs text-slate-500 block">Mood</span>
                                                                <span className="text-xs font-medium text-slate-700">{prompt.mood}</span>
                                                            </div>
                                                            <div className="bg-white rounded p-2">
                                                                <span className="text-xs text-slate-500 block">Colors</span>
                                                                <span className="text-xs font-medium text-slate-700">{prompt.colorPalette}</span>
                                                            </div>
                                                            <div className="bg-white rounded p-2">
                                                                <span className="text-xs text-slate-500 block">Ratio</span>
                                                                <span className="text-xs font-medium text-slate-700">{prompt.aspectRatio}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
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
                                                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                >
                                                    {copiedItem === 'all-chapters' ? (
                                                        <><Check className="w-4 h-4" /> Copied!</>
                                                    ) : (
                                                        <><Copy className="w-4 h-4" /> Copy All</>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="bg-slate-900 rounded-lg p-4 overflow-auto">
                                                <pre className="text-slate-100 text-sm font-mono leading-relaxed">
                                                    {chaptersData.map(c => `${c.timestamp} ${c.title}`).join('\n')}
                                                </pre>
                                            </div>

                                            <div className="space-y-2 mt-4">
                                                {chaptersData.map((chapter, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-mono rounded">
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
                                                    <h3 className="text-lg font-semibold text-slate-900">B-Roll Suggestions</h3>
                                                    <p className="text-sm text-slate-500">{brollData.length} clips suggested for your video</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3 max-h-[70vh] overflow-auto">
                                                {brollData.map((broll) => (
                                                    <div key={broll.id} className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-lg p-4 border border-slate-200">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
                                                                    {broll.timestamp}
                                                                </span>
                                                                <span className={`px-2 py-1 text-xs font-medium rounded ${broll.source === "stock" ? "bg-green-100 text-green-700" :
                                                                    broll.source === "screen" ? "bg-blue-100 text-blue-700" :
                                                                        broll.source === "animation" ? "bg-yellow-100 text-yellow-700" :
                                                                            "bg-pink-100 text-pink-700"
                                                                    }`}>
                                                                    {broll.source}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-slate-800 mb-2">{broll.suggestion}</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {broll.searchTerms.map((term, i) => (
                                                                <span key={i} className="px-2 py-0.5 bg-white text-slate-600 text-xs rounded border border-slate-200">
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
                                                    <div key={short.id} className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-slate-200">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h4 className="font-semibold text-slate-900">{short.title}</h4>
                                                                <span className="text-xs text-slate-500">From: {short.originalTimestamp}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-2 py-1 text-xs font-bold rounded ${short.viralScore >= 80 ? "bg-green-500 text-white" :
                                                                    short.viralScore >= 60 ? "bg-yellow-500 text-white" :
                                                                        "bg-orange-500 text-white"
                                                                    }`}>
                                                                    {short.viralScore}% Viral
                                                                </span>
                                                                <button
                                                                    onClick={() => copyToClipboardGeneric(
                                                                        `${short.hook}\n\n${short.content}\n\n${short.cta}`,
                                                                        `short-${short.id}`
                                                                    )}
                                                                    className="flex items-center gap-1 px-2 py-1 text-xs border border-slate-300 rounded hover:bg-white transition-colors"
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
                                                            <div className="p-2 bg-white rounded border-l-4 border-red-500">
                                                                <span className="text-xs font-semibold text-red-600">HOOK</span>
                                                                <p className="text-sm text-slate-700">{short.hook}</p>
                                                            </div>
                                                            <div className="p-2 bg-white rounded border-l-4 border-blue-500">
                                                                <span className="text-xs font-semibold text-blue-600">CONTENT</span>
                                                                <p className="text-sm text-slate-700">{short.content}</p>
                                                            </div>
                                                            <div className="p-2 bg-white rounded border-l-4 border-green-500">
                                                                <span className="text-xs font-semibold text-green-600">CTA</span>
                                                                <p className="text-sm text-slate-700">{short.cta}</p>
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
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-12 py-6 border-t border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-slate-500">
                        Thunglish Script Generator • Built for Tamil Tech YouTube Creators
                    </p>
                </div>
            </footer>
        </div>
    );
}

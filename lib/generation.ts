
export interface FormData {
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

export interface Timestamps {
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

// Format seconds to MM:SS
const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const constructSectionPrompt = (
    stage: string,
    formData: FormData,
    timestamps: Timestamps,
    previousContent: string = ""
) => {
    const { language, title, channelName, difficulty } = formData;

    // Build system message based on selected language
    let languageInstruction = "";

    if (language === "English") {
        languageInstruction = `
LANGUAGE STYLE: INTERNATIONAL ENGLISH
- Use clear, energetic, universally understood English
- Style: Like MKBHD or MrBeast - high retention, zero fluff
- Simplify complex topics but don't dumb them down
- Use "Guys", "Friends" for connection
`;
    } else if (language === "Hindi") {
        languageInstruction = `
LANGUAGE STYLE: HINGLISH (Hindi + English Tech Terms)
- Speak like a friendly Indian tech YouTuber (e.g., Technical Guruji style)
- Use natural connecting words: "Doston", "Yeh dekho", "Matlab", "Samjhe?"
- Keep all technical terms in English (React, API, Code)
- Start with high energy: "Namaste Doston!"
`;
    } else if (language === "Tamil") {
        languageInstruction = `
LANGUAGE STYLE: PURE TAMIL (With English Tech Terms)
- Use clear, standard spoken Tamil
- Avoid heavy Thunglish mixing - keep it more formal but friendly
- Use English ONLY for technical identifiers (Variable names, libraries)
`;
    } else {
        // Default: Thunglish
        languageInstruction = `
LANGUAGE STYLE: THUNGLISH (Tamil + English Mix - 60% Tamil, 40% English)
- You know exactly how to blend Tamil and English naturally
- Use Tamil for: "Dei!", "Macha!", "Theriyuma", "Kelunga", "Super ah irukku"
- Use English for: Tech terms, connecting phrases ("So basically...", "Actually...")
- Tone: Like explaining to a best friend over chai
`;
    }

    const systemPrompt = `You are a MASTER YouTube script writer with 10+ years of experience creating viral tech videos.

YOUR EXPERTISE:
- You understand the YouTube ecosystem perfectly
- Your hooks have 95%+ retention rates
- Your explanations are crystal clear yet entertaining

${languageInstruction}

FINAL OUTPUT RULE:
Provide ONLY the raw script content for the requested section. Do not include markdown code blocks or JSON wrappers.
`;

    let userPrompt = "";

    if (stage === "hook_intro") {
        userPrompt = `Create a KILLER hook and intro for this Tamil tech YouTube video.

VIDEO DETAILS:
📌 Title: ${title}
${channelName ? `📺 Channel: ${channelName}` : ""}
🎯 Difficulty: ${difficulty}
⏱️ Hook: ${formatTime(timestamps.hookStart)} - ${formatTime(timestamps.hookEnd)}
⏱️ Intro: ${formatTime(timestamps.introStart)} - ${formatTime(timestamps.introEnd)}

HOOK REQUIREMENTS:
- Grab attention in FIRST 3 SECONDS
- Use SHOCK, QUESTION, or PROMISE pattern
- Sound excited!

INTRO REQUIREMENTS:
- Clear promise of value
- Curiosity loop
- Engagement hook

FORMAT:
[${formatTime(timestamps.hookStart)}-${formatTime(timestamps.hookEnd)}] 🎯 HOOK
Visual: [...]
[Script Content]

[${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)}] 🎬 INTRO
Visual: [...]
[Script Content]`;

    } else if (stage === "main_content") {
        userPrompt = `Continue with MAIN CONTENT.
previous: ${previousContent.substring(previousContent.length - 500)}

REQUIREMENTS:
- Break into subsections
- Use analogies
- High energy
${formData.includeCode ? "- SHOW WORKING CODE FIRST then explain line-by-line" : ""}

FORMAT:
[Timestamp] 📚 SUBSECTION
[Content]`;
    } else if (stage === "demo_outro") {
        userPrompt = `Complete with DEMO and OUTRO.
previous: ${previousContent.substring(previousContent.length - 500)}

REQUIREMENTS:
- Step-by-step practical demo
- Strong outro with 3 key takeaways
- Call to action

FORMAT:
[Timestamp] 🛠️ DEMO
[Content]

[Timestamp] 👋 OUTRO
[Content]`;
    }

    return { systemPrompt, userPrompt, model: "gpt-4o-mini", max_tokens: 2000 };
};

export const constructProductionNotesPrompt = (formData: FormData, fullScript: string) => {
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

    return { systemPrompt, userPrompt, model: "gpt-4-turbo", max_tokens: 3000 };
};

export const constructSEOPrompt = (formData: FormData) => {
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

    return { systemPrompt, userPrompt, model: "gpt-4-turbo", max_tokens: 2500 };
};

export const constructImagePromptsPrompt = (
    formData: FormData,
    fullScript: string,
    timestamps: Timestamps
) => {
    const { title, contentType, includeCode, imageFormat } = formData;

    const aspectRatio = imageFormat === "portrait" ? "9:16" : imageFormat === "square" ? "1:1" : "16:9";
    const formatHint = imageFormat === "portrait" ? "vertical mobile-first" : imageFormat === "square" ? "centered balanced" : "cinematic wide";

    const systemPrompt = `Expert AI image prompt engineer. Create Midjourney/DALL-E 3/SDXL-ready prompts. Output: JSON array only, no markdown.`;

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

    return { systemPrompt, userPrompt, model: "gpt-4-turbo", max_tokens: 2500 };
};

export const constructChaptersPrompt = (
    formData: FormData,
    fullScript: string,
    timestamps: Timestamps
) => {
    const { title } = formData;

    const userPrompt = `Generate YouTube video chapters for: "${title}"

Timeline: Hook 0:00-${formatTime(timestamps.hookEnd)} | Intro ${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)} | Main ${formatTime(timestamps.mainStart)}-${formatTime(timestamps.mainEnd)} | Demo ${formatTime(timestamps.demoStart)}-${formatTime(timestamps.demoEnd)} | Outro ${formatTime(timestamps.outroStart)}-${formatTime(timestamps.outroEnd)}

Script summary: ${fullScript.substring(0, 600)}

Create 6-10 chapters. JSON array only:
[{"timestamp":"0:00","title":"Short engaging title (max 5 words)","description":"One line about this section"}]

Rules:
- First chapter MUST be 0:00
- Titles: engaging, curiosity-inducing
- Cover all major topic transitions`;

    return { systemPrompt: "You are a YouTube chapter generator.", userPrompt, model: "gpt-4-turbo", max_tokens: 1000 };
};

export const constructBRollPrompt = (
    formData: FormData,
    fullScript: string,
    timestamps: Timestamps
) => {
    const { title, contentType, includeCode } = formData;

    const userPrompt = `Generate B-Roll suggestions for: "${title}"
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

    return { systemPrompt: "You are a B-Roll suggestion generator.", userPrompt, model: "gpt-4-turbo", max_tokens: 1500 };
};

export const constructShortsPrompt = (
    formData: FormData,
    fullScript: string
) => {
    const { title, contentType } = formData;

    const userPrompt = `Extract 4 viral YouTube Shorts from this video: "${title}"
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

    return { systemPrompt: "You are a viral content extractor.", userPrompt, model: "gpt-4-turbo", max_tokens: 2000 };
};

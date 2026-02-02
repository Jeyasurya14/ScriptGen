
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

const truncateText = (text: string, maxChars: number): string =>
    text.length > maxChars ? `${text.slice(0, maxChars).trim()}…` : text;

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
        languageInstruction = "Use clear international English. Energetic, no fluff.";
    } else if (language === "Hindi") {
        languageInstruction = "Use Hinglish. Keep technical terms in English.";
    } else if (language === "Tamil") {
        languageInstruction = "Use spoken Tamil; keep technical terms in English.";
    } else {
        languageInstruction = "Use Thunglish (Tamil+English mix).";
    }

    const systemPrompt = `You are an expert YouTube script writer.
Prioritize retention, clarity, and brevity. No filler, no repetition.
${languageInstruction}
Output only the script content.`;

    let userPrompt = "";

    if (stage === "hook_intro") {
        userPrompt = `Write hook + intro.
Title: ${title}
${channelName ? `Channel: ${channelName}` : ""}
Difficulty: ${difficulty}
Hook: ${formatTime(timestamps.hookStart)}-${formatTime(timestamps.hookEnd)}
Intro: ${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)}
Requirements: attention in first 3 seconds, clear value promise, curiosity loop.
Format:
[${formatTime(timestamps.hookStart)}-${formatTime(timestamps.hookEnd)}] HOOK
Visual: ...
Script...
[${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)}] INTRO
Visual: ...
Script...`;

    } else if (stage === "main_content") {
        userPrompt = `Write main content.
Previous: ${truncateText(previousContent, 400)}
Requirements: 3-5 subsections, punchy lines, clear steps, 1 analogy per subsection.
${formData.includeCode ? "Show working code first, then explain briefly." : ""}
Format:
[Timestamp] SUBSECTION
Script...`;
    } else if (stage === "demo_outro") {
        userPrompt = `Write demo + outro.
Previous: ${truncateText(previousContent, 400)}
Requirements: step-by-step demo, 3 crisp takeaways, short CTA.
Format:
[Timestamp] DEMO
Script...
[Timestamp] OUTRO
Script...`;
    }

    return { systemPrompt, userPrompt, model: "gpt-4o-mini", max_tokens: 1400 };
};

export const constructProductionNotesPrompt = (formData: FormData, fullScript: string) => {
    const { title, includeCode } = formData;

    const systemPrompt = `You are a professional YouTube video producer. Create practical, concise production notes.`;

    const userPrompt = `Create production notes that look premium and scannable.
Use tasteful emojis, clean separators, and a compact table where asked. Keep it concise.
Title: ${title}
Script summary: ${truncateText(fullScript, 1200)}
Output sections (use this order and headings):
1) 🎬 B-ROLL (6-8 items, timestamp + description)
2) 🎨 GRAPHICS (4-6 items)
${includeCode ? `
- Code snippet reveal
- Function callouts
- Before/after split
- Error vs fix overlay
` : `
- Key concept text
- Diagram/flowchart
- Step list animation
`}
3) 📝 ON-SCREEN TEXT (6-8 items)
${includeCode ? `
1. Function names
2. Key syntax
3. Pro tips
4. Error messages
5. Output examples
` : `
1. Title
2. Key points
3. Definitions
4. Step numbers
`}
4) ✂️ EDITING NOTES (transitions + pacing)
5) 🎵 BACKGROUND MUSIC GUIDE (compact table with: Section | Style | Energy | Volume)
6) 🖼️ THUMBNAIL NOTES (subject + 3-4 word text)`;

    return { systemPrompt, userPrompt, model: "gpt-4o-mini", max_tokens: 1400 };
};

export const constructSEOPrompt = (formData: FormData) => {
    const { title, contentType } = formData;

    const systemPrompt = `You are a YouTube SEO expert. Provide high-performing, professional outputs. Be concise.`;

    const userPrompt = `Create a professional SEO pack for YouTube.
Title: ${title}
Type: ${contentType}

Return ONLY valid JSON with this shape:
{
  "titles": [{"text":"...", "score": 0-100}],
  "description": "string",
  "tags": [{"text":"...", "score": 0-100}],
  "thumbnails": [{"text":"...", "score": 0-100}],
  "comment": "string"
}

Rules:
- 5 titles, <=60 chars, include primary keyword, distinct angles.
- Description 170-230 words: hook (2 lines), 3 bullets, timestamps, CTA, hashtags.
- 18-22 tags, mix primary/secondary/long-tail, no duplicates.
- 3 thumbnail texts (3-5 words), high contrast language.
- Comment: professional, engaging, 2-3 lines, invite feedback.
Add score based on rank potential (higher is better).`;

    return { systemPrompt, userPrompt, model: "gpt-4o-mini", max_tokens: 1200, expectsJson: true };
};

export const constructImagePromptsPrompt = (
    formData: FormData,
    fullScript: string,
    timestamps: Timestamps
) => {
    const { title, contentType, includeCode, imageFormat } = formData;

    const aspectRatio = imageFormat === "portrait" ? "9:16" : imageFormat === "square" ? "1:1" : "16:9";
    const formatHint = imageFormat === "portrait" ? "vertical mobile-first" : imageFormat === "square" ? "centered balanced" : "cinematic wide";

    const systemPrompt = `Image prompt engineer. Output JSON array only.`;

    const userPrompt = `Generate 8 ${aspectRatio} image prompts for: "${title}"
Type: ${contentType}${includeCode ? " (coding tutorial)" : ""}
Composition: ${formatHint}

Timeline:
Hook ${formatTime(timestamps.hookStart)}-${formatTime(timestamps.hookEnd)} | Intro ${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)} | Main ${formatTime(timestamps.mainStart)}-${formatTime(timestamps.mainEnd)} | Demo ${formatTime(timestamps.demoStart)}-${formatTime(timestamps.demoEnd)} | Outro ${formatTime(timestamps.outroStart)}-${formatTime(timestamps.outroEnd)}

Context: ${truncateText(fullScript, 500)}

Distribution: 2 Hook, 1 Intro, 3 Main, 1 Demo, 1 Outro

JSON format:
[{"id":1,"timestamp":"0:00-0:24","scene":"Hook","description":"[40-60 words: subject, composition, lighting, angle, quality modifiers like 8K, ultra detailed]","style":"[specific art style]","mood":"[atmosphere]","colorPalette":"[3 colors]","aspectRatio":"${aspectRatio}"}]

Requirements per prompt:
- Include lighting (rim/ambient/neon), depth (bokeh/layers), camera (lens/angle)
- Style: Cyberpunk/Photorealistic/Minimalist/Cinematic/Neon-futuristic
${includeCode ? "- Show: IDE screens, code snippets, terminal outputs, tech devices" : "- Show: Concept diagrams, infographics, professional visuals"}
- Optimized for ${aspectRatio} framing`;

    return { systemPrompt, userPrompt, model: "gpt-4o-mini", max_tokens: 1200 };
};

export const constructChaptersPrompt = (
    formData: FormData,
    fullScript: string,
    timestamps: Timestamps
) => {
    const { title } = formData;

    const userPrompt = `Generate YouTube video chapters for: "${title}"

Timeline: Hook 0:00-${formatTime(timestamps.hookEnd)} | Intro ${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)} | Main ${formatTime(timestamps.mainStart)}-${formatTime(timestamps.mainEnd)} | Demo ${formatTime(timestamps.demoStart)}-${formatTime(timestamps.demoEnd)} | Outro ${formatTime(timestamps.outroStart)}-${formatTime(timestamps.outroEnd)}

Script summary: ${truncateText(fullScript, 400)}

Create 6-10 chapters. JSON array only:
[{"timestamp":"0:00","title":"Short engaging title (max 5 words)","description":"One line about this section"}]

Rules:
- First chapter MUST be 0:00
- Titles: engaging, curiosity-inducing
- Cover all major topic transitions`;

    return { systemPrompt: "You are a YouTube chapter generator.", userPrompt, model: "gpt-4o-mini", max_tokens: 600 };
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

Script: ${truncateText(fullScript, 350)}

Create 10-12 B-Roll suggestions. JSON array only:
[{"id":1,"timestamp":"0:00-0:24","scene":"Hook","suggestion":"Specific B-Roll description","source":"stock|screen|animation|self-record","searchTerms":["term1","term2","term3"]}]

Sources:
- stock: Pexels/Pixabay clips (general visuals)
- screen: Screen recordings (demos, code, tutorials)
- animation: Motion graphics, text animations
- self-record: Camera footage you film

${includeCode ? "Focus on: IDE screenshots, terminal outputs, code animations, typing sequences" : "Focus on: concept visuals, reactions, professional footage"}`;

    return { systemPrompt: "You are a B-Roll suggestion generator.", userPrompt, model: "gpt-4o-mini", max_tokens: 800 };
};

export const constructShortsPrompt = (
    formData: FormData,
    fullScript: string
) => {
    const { title, contentType } = formData;

    const userPrompt = `Extract 4 viral YouTube Shorts from this video: "${title}"
Type: ${contentType}

Full script:
${truncateText(fullScript, 900)}

Create 4 standalone 30-60 second Shorts. JSON array only:
[{"id":1,"title":"Catchy Shorts title (curiosity/value)","hook":"Opening line (first 3 sec - must grab attention)","content":"Main content script (20-40 sec, complete thought, valuable standalone)","cta":"Closing CTA (like/follow/comment prompt)","originalTimestamp":"2:30-3:15","viralScore":85}]

Viral Score criteria (1-100):
- Hook strength (0-25)
- Standalone value (0-25) 
- Shareability (0-25)
- Engagement potential (0-25)

Focus on: surprising facts, quick tips, relatable moments, controversy/opinions`;

    return { systemPrompt: "You are a viral content extractor.", userPrompt, model: "gpt-4o-mini", max_tokens: 1200 };
};

export const constructTranslatePrompt = (targetLanguage: string, fullScript: string) => {
    const systemPrompt = `You are a professional translator for YouTube scripts. Preserve structure and timestamps. No extra text.`;

    const rules = [
        "Maintain ALL timestamps exactly as they are [00:00].",
        "Keep the original tone (Casual/Professional).",
        "Keep technical terms in English (e.g., React, API, Database).",
        "Do not translate proper nouns or channel names.",
        `Ensure the flow is natural for a native speaker of ${targetLanguage}.`,
        "Preserve line breaks, headings, lists, and tables exactly.",
        "Do not add or remove sections.",
    ];

    if (targetLanguage === "Thunglish") {
        rules.push("Mix Tamil and English naturally (60% Tamil, 40% English).");
    }

    if (targetLanguage === "Hindi") {
        rules.push("Use Hinglish (Hindi + English tech terms) for a natural tech review feel.");
    }

    const userPrompt = `Translate the following script to ${targetLanguage}.

RULES:
${rules.map((rule, index) => `${index + 1}. ${rule}`).join("\n")}

Input format: Full script text
Output format: Translated script text ONLY. No other text.

SCRIPT:
${fullScript}`;

    return { systemPrompt, userPrompt, model: "gpt-4o-mini", max_tokens: 1400 };
};

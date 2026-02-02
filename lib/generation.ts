
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

// Optimized truncation - adaptive based on content importance
const truncateText = (text: string, maxChars: number): string =>
    text.length > maxChars ? `${text.slice(0, maxChars).trim()}…` : text;

// Compact time range string
const timeRange = (start: number, end: number): string => `${formatTime(start)}-${formatTime(end)}`;

export const constructSectionPrompt = (
    stage: string,
    formData: FormData,
    timestamps: Timestamps,
    previousContent: string = ""
) => {
    const { language, title, channelName, difficulty, includeCode } = formData;

    // Compact language instruction
    const langMap: Record<string, string> = {
        English: "Clear English, energetic.",
        Hindi: "Hinglish, tech terms in English.",
        Tamil: "Spoken Tamil, tech terms in English.",
    };
    const langInst = langMap[language] || "Thunglish (Tamil+English mix).";

    // Ultra-compact system prompt
    const systemPrompt = `YouTube script writer. ${langInst} No filler. Output script only.`;

    let userPrompt = "";
    const prev = previousContent ? `Prev:${truncateText(previousContent, 300)}\n` : "";

    if (stage === "hook_intro") {
        userPrompt = `Hook+Intro for "${title}"${channelName ? ` [${channelName}]` : ""} (${difficulty})
Hook:${timeRange(timestamps.hookStart, timestamps.hookEnd)} Intro:${timeRange(timestamps.introStart, timestamps.introEnd)}
Format:[time]SECTION\\nVisual:...\\nScript...
Require:3s attention grab,value promise,curiosity loop.`;

    } else if (stage === "main_content") {
        userPrompt = `${prev}Main content. 3-5 subsections,punchy,clear steps,1 analogy each.${includeCode ? " Code first,explain briefly." : ""}
Format:[time]SUBSECTION\\nScript...`;

    } else if (stage === "demo_outro") {
        userPrompt = `${prev}Demo+Outro. Step-by-step demo,3 takeaways,short CTA.
Format:[time]DEMO\\n...[time]OUTRO\\n...`;
    }

    // Reduced max_tokens: 1400 → 1100
    return { systemPrompt, userPrompt, model: "gpt-4.1", max_tokens: 1100 };
};

export const constructProductionNotesPrompt = (formData: FormData, fullScript: string) => {
    const { title, includeCode } = formData;

    // Compact system prompt
    const systemPrompt = `YouTube producer. Concise production notes.`;

    // Reduced script context: 1200 → 800
    const userPrompt = `Production notes for "${title}"
Script:${truncateText(fullScript, 800)}

Output (compact,emojis ok):
🎬 B-ROLL (6-8,timestamp+desc)
🎨 GRAPHICS (4-6)${includeCode ? ": code reveal,callouts,before/after,error overlay" : ": concept text,diagram,step animation"}
📝 ON-SCREEN TEXT (6-8)${includeCode ? ": functions,syntax,tips,errors,output" : ": title,points,definitions,steps"}
✂️ EDITING (transitions+pacing)
🎵 MUSIC (table:Section|Style|Energy|Vol)
🖼️ THUMBNAIL (subject+3-4 words)`;

    return { systemPrompt, userPrompt, model: "gpt-4o-mini", max_tokens: 1000 };
};

export const constructSEOPrompt = (formData: FormData, fullScript?: string) => {
    const { title, contentType } = formData;
    // Reduced context: 800 → 500
    const scriptContext = fullScript ? truncateText(fullScript, 500) : "";

    // Minimal system prompt
    const systemPrompt = `YouTube SEO expert. Output ONLY valid JSON.`;

    const userPrompt = fullScript
        ? `SEO pack for "${title}" (${contentType})
Script:${scriptContext}

JSON only:{"titles":[{"text":"..","score":85}],"description":"..","tags":[{"text":"..","score":80}],"thumbnails":[{"text":"..","score":82}],"comment":".."}

Rules:titles(5,<=60ch,keyword)|description(150-200w,hook+bullets+CTA+hashtags)|tags(15-20,no dupes)|thumbnails(3,3-5w)|comment(2 lines)`
        : `SEO pack for "${title}" (${contentType})

JSON only:{"titles":[{"text":"..","score":85}],"description":"..","tags":[{"text":"..","score":80}],"thumbnails":[{"text":"..","score":82}],"comment":".."}

Rules:titles(5,<=60ch)|description(150-200w)|tags(15-20)|thumbnails(3,3-5w)|comment(2 lines)`;

    // Reduced max_tokens: 1200 → 900
    return { systemPrompt, userPrompt, model: "gpt-4.1", max_tokens: 900, expectsJson: true };
};

export const constructImagePromptsPrompt = (
    formData: FormData,
    fullScript: string,
    timestamps: Timestamps
) => {
    const { title, contentType, includeCode, imageFormat } = formData;

    const ar = imageFormat === "portrait" ? "9:16" : imageFormat === "square" ? "1:1" : "16:9";
    const comp = imageFormat === "portrait" ? "vertical" : imageFormat === "square" ? "centered" : "cinematic wide";

    // Ultra-compact system prompt
    const systemPrompt = `Image prompt generator. JSON array only.`;

    // Reduced context: 500 → 350
    const userPrompt = `8 ${ar} prompts for "${title}" (${contentType}${includeCode ? ",coding" : ""})
Comp:${comp}
Timeline:H${timeRange(timestamps.hookStart, timestamps.hookEnd)}|I${timeRange(timestamps.introStart, timestamps.introEnd)}|M${timeRange(timestamps.mainStart, timestamps.mainEnd)}|D${timeRange(timestamps.demoStart, timestamps.demoEnd)}|O${timeRange(timestamps.outroStart, timestamps.outroEnd)}
Context:${truncateText(fullScript, 350)}

Dist:2Hook,1Intro,3Main,1Demo,1Outro

JSON:[{"id":1,"timestamp":"0:00-0:24","scene":"Hook","description":"[40-50w:subject,comp,lighting,angle,8K]","style":"..","mood":"..","colorPalette":"3colors","aspectRatio":"${ar}"}]

Include:lighting(rim/neon),depth(bokeh),camera angle.${includeCode ? " Show:IDE,code,terminal." : ""}`;

    return { systemPrompt, userPrompt, model: "gpt-4o-mini", max_tokens: 900 };
};

export const constructChaptersPrompt = (
    formData: FormData,
    fullScript: string,
    timestamps: Timestamps
) => {
    const { title } = formData;

    // Reduced context: 400 → 300
    const userPrompt = `Chapters for "${title}"
Timeline:H0:00-${formatTime(timestamps.hookEnd)}|I${formatTime(timestamps.introStart)}-${formatTime(timestamps.introEnd)}|M${formatTime(timestamps.mainStart)}-${formatTime(timestamps.mainEnd)}|D${formatTime(timestamps.demoStart)}-${formatTime(timestamps.demoEnd)}|O${formatTime(timestamps.outroStart)}-${formatTime(timestamps.outroEnd)}
Script:${truncateText(fullScript, 300)}

6-10 chapters, JSON:[{"timestamp":"0:00","title":"max 5 words","description":"1 line"}]
First=0:00. Engaging titles.`;

    return { systemPrompt: "Chapter generator.", userPrompt, model: "gpt-4o-mini", max_tokens: 450 };
};

export const constructBRollPrompt = (
    formData: FormData,
    fullScript: string,
    timestamps: Timestamps
) => {
    const { title, contentType, includeCode } = formData;

    // Reduced context: 350 → 250
    const userPrompt = `B-Roll for "${title}" (${contentType}${includeCode ? ",coding" : ""})
Timeline:H-${formatTime(timestamps.hookEnd)}|I-${formatTime(timestamps.introEnd)}|M-${formatTime(timestamps.mainEnd)}|D-${formatTime(timestamps.demoEnd)}|O-${formatTime(timestamps.outroEnd)}
Script:${truncateText(fullScript, 250)}

10-12 suggestions, JSON:[{"id":1,"timestamp":"0:00-0:24","scene":"Hook","suggestion":"desc","source":"stock|screen|animation|self-record","searchTerms":["t1","t2","t3"]}]

Sources:stock=Pexels clips,screen=recordings,animation=motion graphics,self-record=camera.${includeCode ? " Focus:IDE,terminal,code." : ""}`;

    return { systemPrompt: "B-Roll generator.", userPrompt, model: "gpt-4o-mini", max_tokens: 600 };
};

export const constructShortsPrompt = (
    formData: FormData,
    fullScript: string
) => {
    const { title, contentType } = formData;

    // Reduced context: 900 → 600
    const userPrompt = `Extract 4 Shorts from "${title}" (${contentType})
Script:${truncateText(fullScript, 600)}

JSON:[{"id":1,"title":"catchy","hook":"3s attention grab","content":"20-40s script","cta":"like/follow prompt","originalTimestamp":"2:30-3:15","viralScore":85}]

Score(1-100):hook(25)+value(25)+shareability(25)+engagement(25)
Focus:surprising facts,quick tips,relatable moments.`;

    // Reduced max_tokens: 1200 → 900
    return { systemPrompt: "Viral Shorts extractor.", userPrompt, model: "gpt-4.1", max_tokens: 900 };
};

export const constructTranslatePrompt = (targetLanguage: string, fullScript: string) => {
    // Compact system prompt
    const systemPrompt = `Translator. Preserve timestamps,structure. Output translation only.`;

    // Compact rules based on language
    let langRule = "";
    if (targetLanguage === "Thunglish") {
        langRule = " Mix Tamil+English(60/40).";
    } else if (targetLanguage === "Hindi") {
        langRule = " Use Hinglish for tech.";
    }

    const userPrompt = `Translate to ${targetLanguage}.${langRule}
Keep:timestamps,tone,tech terms in English,proper nouns,formatting.
No additions/removals.

SCRIPT:
${fullScript}`;

    // Reduced max_tokens: 1400 → 1100
    return { systemPrompt, userPrompt, model: "gpt-4.1", max_tokens: 1100 };
};

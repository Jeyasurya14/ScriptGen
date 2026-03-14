import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { GenerateSchema } from "@/lib/validations";
import {
    constructSectionPrompt,
    constructProductionNotesPrompt,
    // ... imports
    constructSEOPrompt,
    constructImagePromptsPrompt,
    constructChaptersPrompt,
    constructBRollPrompt,
    constructShortsPrompt,
    constructTranslatePrompt,
} from "@/lib/generation";

const MAX_SCRIPT_LENGTH = 150000; // ~150k chars to prevent abuse

export async function POST(req: Request) {
    try {
        // Authenticate user
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));

        const parseResult = GenerateSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json(
                { error: parseResult.error.errors, code: 'VALIDATION_ERROR' },
                { status: 422 }
            );
        }

        // Bridge to existing logic:
        // The existing logic expects specific fields like 'type', 'formData', 'timestamps', etc.
        // Since we MUST NOT change business logic, but MUST use the new schema,
        // we extract the data and then let the original logic continue if it matches,
        // or provide defaults/mappings if they differ.
        // In this specific case, the original route handled multiple generation types.
        // The new GenerateSchema seems focused on the initial script generation.
        
        const { topic, language, tamilRatio, vidLength, contentType, assets } = parseResult.data;

        // Legacy extraction for the rest of the handler:
        const { type, formData, timestamps, previousContent, fullScript, stage, targetLanguage } = body;


        // Server-side API key only (never use client-exposed key)
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Server API configuration missing (set OPENAI_API_KEY)" },
                { status: 503 }
            );
        }

        let promptConfig;

        // Construct prompt based on type
        switch (type) {
            case "section":
                if (!stage || !timestamps) return NextResponse.json({ error: "Missing stage or timestamps" }, { status: 400 });
                promptConfig = constructSectionPrompt(stage, formData, timestamps, previousContent || "");
                break;
            case "production_notes":
                if (!fullScript) return NextResponse.json({ error: "Missing fullScript" }, { status: 400 });
                promptConfig = constructProductionNotesPrompt(formData, fullScript);
                break;
            case "seo":
                promptConfig = constructSEOPrompt(formData, fullScript || undefined);
                break;
            case "image_prompts":
                if (!fullScript || !timestamps) return NextResponse.json({ error: "Missing script or timestamps" }, { status: 400 });
                promptConfig = constructImagePromptsPrompt(formData, fullScript, timestamps);
                break;
            case "chapters":
                if (!fullScript || !timestamps) return NextResponse.json({ error: "Missing script or timestamps" }, { status: 400 });
                promptConfig = constructChaptersPrompt(formData, fullScript, timestamps);
                break;
            case "broll":
                if (!fullScript || !timestamps) return NextResponse.json({ error: "Missing script or timestamps" }, { status: 400 });
                promptConfig = constructBRollPrompt(formData, fullScript, timestamps);
                break;
            case "shorts":
                if (!fullScript) return NextResponse.json({ error: "Missing fullScript" }, { status: 400 });
                promptConfig = constructShortsPrompt(formData, fullScript);
                break;
            case "translate":
                if (!fullScript || !targetLanguage) {
                    return NextResponse.json({ error: "Missing script or target language" }, { status: 400 });
                }
                promptConfig = constructTranslatePrompt(targetLanguage, fullScript);
                break;
            default:
                return NextResponse.json({ error: "Invalid generation type" }, { status: 400 });
        }

        const OPENAI_TIMEOUT_MS = 90_000; // 90s for long script/chunk requests

        const callOpenAI = async (
            systemPrompt: string,
            userPrompt: string,
            maxTokens: number,
            temperature: number,
            expectsJson?: boolean,
            requestSignal?: AbortSignal | null
        ) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
            if (requestSignal?.addEventListener) {
                requestSignal.addEventListener("abort", () => controller.abort());
            }

            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: promptConfig.model,
                        max_tokens: maxTokens,
                        temperature,
                        ...(expectsJson ? { response_format: { type: "json_object" } } : {}),
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: userPrompt },
                        ],
                    }),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errBody = await response.json().catch(() => ({}));
                    throw new Error((errBody as { error?: { message?: string } })?.error?.message || "OpenAI API call failed");
                }

                const data = await response.json();
                return (data as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ?? "";
            } catch (e) {
                clearTimeout(timeoutId);
                if (e instanceof Error && e.name === "AbortError") {
                    throw new Error("Request timed out. Please try again.");
                }
                throw e;
            }
        };

        if (type === "translate") {
            // Optimized chunk size: 2400 → 1800 (smaller chunks = less context overhead per call)
            const chunkSize = 1800;
            const raw = fullScript || "";
            const paragraphs = raw.split(/\n{2,}/);
            const chunks: string[] = [];
            let current = "";

            for (const para of paragraphs) {
                const candidate = current ? `${current}\n\n${para}` : para;
                if (candidate.length > chunkSize && current) {
                    chunks.push(current);
                    current = para;
                } else {
                    current = candidate;
                }
            }
            if (current) chunks.push(current);

            // Process chunks (sequential to maintain order)
            const translatedParts: string[] = [];
            for (const chunk of chunks) {
                const chunkPrompt = constructTranslatePrompt(targetLanguage as string, chunk);
                const translated = await callOpenAI(
                    chunkPrompt.systemPrompt,
                    chunkPrompt.userPrompt,
                    chunkPrompt.max_tokens,
                    0.2,
                    false,
                    req.signal
                );
                translatedParts.push(translated.trim());
            }

            return NextResponse.json({ content: translatedParts.join("\n\n") });
        }

        const content = await callOpenAI(
            promptConfig.systemPrompt,
            promptConfig.userPrompt,
            promptConfig.max_tokens,
            0.7,
            (promptConfig as { expectsJson?: boolean }).expectsJson,
            req.signal
        );

        return NextResponse.json({ content });

    } catch (error: unknown) {
        console.error("[generate] API Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error", code: 'INTERNAL_ERROR' },
            { status: 500 }
        );
    }
}

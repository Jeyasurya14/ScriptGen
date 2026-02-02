
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
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

// Validation Schema
const GenerateSchema = z.object({
    type: z.enum(["section", "production_notes", "seo", "image_prompts", "chapters", "broll", "shorts", "translate"]),
    formData: z.any(), // validate deeper if needed, but 'any' allows flexibility for now
    timestamps: z.any().optional(),
    previousContent: z.string().optional(),
    fullScript: z.string().optional(),
    stage: z.string().optional(),
    targetLanguage: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        // Authenticate user
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        // Validate input
        const parseResult = GenerateSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: "Invalid input", details: parseResult.error }, { status: 400 });
        }

        const { type, formData, timestamps, previousContent, fullScript, stage, targetLanguage } = parseResult.data;


        // Use server-side API key
        const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Server API configuration missing (set OPENAI_API_KEY)" },
                { status: 500 }
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

        const callOpenAI = async (
            systemPrompt: string,
            userPrompt: string,
            maxTokens: number,
            temperature: number,
            expectsJson?: boolean
        ) => {
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
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || "OpenAI API call failed");
            }

            const data = await response.json();
            return data.choices[0].message.content as string;
        };

        if (type === "translate") {
            const chunkSize = 2400;
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

            const translatedParts: string[] = [];
            for (const chunk of chunks) {
                const chunkPrompt = constructTranslatePrompt(targetLanguage as string, chunk);
                const translated = await callOpenAI(
                    chunkPrompt.systemPrompt,
                    chunkPrompt.userPrompt,
                    chunkPrompt.max_tokens,
                    0.2,
                    false
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
            (promptConfig as { expectsJson?: boolean }).expectsJson
        );

        return NextResponse.json({ content });

    } catch (error: unknown) {
        console.error("Generate API Error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

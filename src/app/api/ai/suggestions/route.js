import { OpenAI } from "openai";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { context } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API Key not configured" },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `
    You are "The Hub's" AI Copilot. You are a high-performance productivity coach.
    
    USER CONTEXT:
    ${JSON.stringify(context, null, 2)}

    TASK:
    Generate 3 short, punchy, and highly relevant suggestions/insights based strictly on the user's data.
    
    TONE:
    - Professional but slightly edgy ("Deep Space" vibes).
    - Ruthless about bottlenecks.
    - Encouraging about streaks.
    - Use emojis.

    OUTPUT FORMAT:
    You must return a valid JSON object with a SINGLE key "suggestions" containing an array of objects.
    Example: { "suggestions": [{ "type": "warning", "text": "...", "action": "poker" }] }
    `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        const responseContent = completion.choices[0].message.content;
        const parsed = JSON.parse(responseContent); // Expecting { suggestions: [...] } or just array? 
        // Let's refine prompt to ensure key "suggestions" is present or handle array directly.

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json(
            { error: "Failed to generate insights" },
            { status: 500 }
        );
    }
}

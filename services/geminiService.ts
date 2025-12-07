import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeminiAliasResponse } from "../types";

// Initialize Gemini
// Note: In a production app, never expose API keys on the client side. 
// This is for demonstration purposes as per the system prompt requirements.
// In Next.js, client-side env vars must use NEXT_PUBLIC_ prefix
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

export const generateSmartAlias = async (url: string): Promise<GeminiAliasResponse | null> => {
  try {
    const model = "gemini-2.5-flash";

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        suggestedAlias: {
          type: Type.STRING,
          description: "A short, catchy, kebab-case alias for the URL (max 15 chars).",
        },
        category: {
          type: Type.STRING,
          description: "A single word category (e.g., Tech, News, Social).",
        },
        summary: {
          type: Type.STRING,
          description: "A very brief 5-10 word summary of what the link is likely about.",
        },
        tags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Array of 2-3 relevant tags.",
        },
      },
      required: ["suggestedAlias", "category", "summary", "tags"],
    };

    const prompt = `Analyze this URL: "${url}". 
    Create a custom short alias for it. 
    If the URL is a youtube video, try to guess the context from the ID or parameters if possible, otherwise generic.
    If it is a generic site, use the domain name or path.
    Return JSON.`;

    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const text = result.text;
    if (!text) return null;

    return JSON.parse(text) as GeminiAliasResponse;
  } catch (error) {
    console.error("Error generating smart alias:", error);
    return null;
  }
};
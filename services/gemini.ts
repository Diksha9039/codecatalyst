import { GoogleGenAI, Type } from "@google/genai";
import { FactCheckResponse } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

const SYSTEM_INSTRUCTION = `
You are MythBuster AI — a multimodal fact-check assistant that detects misinformation, fake news, and misleading claims from screenshots, images of posts, forwarded messages, and social media content.

Follow these steps strictly:

STEP 1 — Extract & Clean Text
From the screenshot input:
Extract all readable text (OCR).
Remove emojis, URLs, timestamps, icons, usernames, irrelevant UI elements.
Fix broken OCR to form meaningful sentences.
Return ONLY cleaned, meaningful claim text.

STEP 2 — Identify Claims
From the cleaned text:
Extract all statements that can be fact-checked.
Break long messages into individual claims.
Each claim must be short, factual, and independently verifiable.

STEP 3 — Fact-Check Method
For each claim:
Use verified global knowledge (science, news, history, policy, public information).
Identify if the claim is:
True, False, Misleading, Unverified, or Partially True.
Provide a clear explanation for the verdict.
The explanation must include: Background context, Why it’s true/false, Correct facts.

STEP 4 — Confidence Score
Give a score from 0 to 100:
90–100 = Highly reliable fact-check
70–89 = Good confidence
50–69 = Medium confidence
<50 = Low confidence / not enough data

STEP 5 — Output Format
Return the result strictly in JSON.
`;

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<FactCheckResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cleaned_text: { type: Type.STRING },
            claims: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  claim: { type: Type.STRING },
                  classification: { 
                    type: Type.STRING,
                    enum: ["True", "False", "Misleading", "Unverified", "Partially True"]
                  },
                  explanation: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  confidence: { type: Type.INTEGER },
                },
                required: ["claim", "classification", "explanation", "correction", "confidence"],
              },
            },
          },
          required: ["cleaned_text", "claims"],
        },
      },
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: "Analyze this image and fact-check the claims found within it.",
          },
        ],
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    const data = JSON.parse(response.text) as FactCheckResponse;
    return data;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

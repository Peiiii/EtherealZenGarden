
import { GoogleGenAI, Type } from "@google/genai";
import { FlowerConfig, PetalShape, LeafShape } from "../types";

export const generateAIFlower = async (prompt: string): Promise<Partial<FlowerConfig>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Design a unique botanical flower based on this theme: "${prompt}". Provide parameters for a procedural 3D model.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          petalColor: { type: Type.STRING, description: "Hex color code" },
          petalCount: { type: Type.NUMBER },
          petalSize: { type: Type.NUMBER },
          petalShape: { type: Type.STRING, enum: Object.values(PetalShape) },
          stemHeight: { type: Type.NUMBER },
          leafCount: { type: Type.NUMBER },
          centerColor: { type: Type.STRING, description: "Hex color code" }
        },
        required: ["petalColor", "petalCount", "petalSize", "petalShape", "stemHeight", "leafCount", "centerColor"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI flower", e);
    return {};
  }
};

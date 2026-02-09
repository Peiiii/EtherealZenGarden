
import { GoogleGenAI, Type } from "@google/genai";
import { FlowerConfig, PetalShape, LeafShape } from "../types";

export const generateAIFlower = async (prompt: string): Promise<Partial<FlowerConfig>> => {
  // Initialize AI client using environment variable API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Use gemini-3-pro-preview for tasks requiring high creative reasoning
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Design a unique botanical flower based on this theme: "${prompt}". Provide parameters for a procedural 3D model.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          petalColor: { type: Type.STRING, description: "Hex color code" },
          petalCount: { type: Type.NUMBER },
          petalSize: { type: Type.NUMBER },
          petalShape: { type: Type.STRING, description: `Shape name: ${Object.values(PetalShape).join(', ')}` },
          stemHeight: { type: Type.NUMBER },
          leafCount: { type: Type.NUMBER },
          centerColor: { type: Type.STRING, description: "Hex color code" }
        },
        required: ["petalColor", "petalCount", "petalSize", "petalShape", "stemHeight", "leafCount", "centerColor"]
      }
    }
  });

  // Access the text property directly (it's a getter, not a method)
  const jsonStr = response.text?.trim();
  if (!jsonStr) {
    console.error("Empty response from AI");
    return {};
  }

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse AI flower JSON", e);
    return {};
  }
};

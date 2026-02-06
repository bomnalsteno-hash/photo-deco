import { GoogleGenAI } from "@google/genai";
import { ArtStyle } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getBase64Data = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generatePrompt = async (
  imageFile: File,
  style: ArtStyle
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await getBase64Data(imageFile);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: imageFile.type } },
          { text: `Analyze this image. The user has selected the style: "${style}". Generate the prompt following the output format rules strictly.` },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Failed to generate prompt.";
  } catch (error) {
    console.error("Gemini Prompt Generation Error:", error);
    throw new Error("Failed to create art direction.");
  }
};

export const generateStylizedImage = async (
  originalImageFile: File,
  prompt: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await getBase64Data(originalImageFile);

  try {
    // Using Nano Banana (gemini-2.5-flash-image) for generation/editing
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: originalImageFile.type } },
          { text: prompt },
        ],
      },
      // Note: responseMimeType and responseSchema are NOT supported for this model.
    });

    // Extract image from parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error("Failed to generate the final artwork.");
  }
};

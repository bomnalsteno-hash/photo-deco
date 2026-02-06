import { GoogleGenAI } from "@google/genai";
import { ArtStyle } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// In-memory caches scoped to the browser session
const base64Cache = new Map<string, string>();
const imageAnalysisCache = new Map<string, string>();

const getImageSignature = (file: File): string => {
  const anyFile = file as any;
  const lastModified = anyFile.lastModified ?? "";
  return `${file.name}-${file.size}-${lastModified}`;
};

const getBase64Data = async (file: File): Promise<string> => {
  const signature = getImageSignature(file);
  const cached = base64Cache.get(signature);
  if (cached) return cached;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      base64Cache.set(signature, base64);
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getOrCreateImageAnalysis = async (
  ai: GoogleGenAI,
  imageFile: File
): Promise<string> => {
  const signature = getImageSignature(imageFile);
  const cachedAnalysis = imageAnalysisCache.get(signature);
  if (cachedAnalysis) return cachedAnalysis;

  const base64Data = await getBase64Data(imageFile);

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: { data: base64Data, mimeType: imageFile.type },
        },
        {
          text: [
            "이 사진을 낙서 스타일로 꾸미기 위한 기초 분석을 해주세요.",
            "피사체의 종류, 위치, 자세, 시선 방향, 배경의 주요 사물, 드로잉 포인트가 될 수 있는 부분들을 자세히 서술하세요.",
            "추후 다른 스타일 프롬프트에 재사용할 수 있도록, 스타일에 의존하지 않는 중립적인 설명만 작성하세요.",
          ].join("\n"),
        },
      ],
    },
    config: {
      // SYSTEM_INSTRUCTION는 '시맨틱 아트 디렉터' 관점에서 분석하도록 돕는 역할
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.4,
    },
  });

  const analysis = response.text || "";
  imageAnalysisCache.set(signature, analysis);
  return analysis;
};

export const generatePrompt = async (
  imageFile: File,
  style: ArtStyle
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing.");

  const ai = new GoogleGenAI({ apiKey });

  try {
    // 1) 이미지 분석은 같은 사진에 대해서는 한 번만 수행하여 캐싱
    const analysis = await getOrCreateImageAnalysis(ai, imageFile);

    // 2) 스타일별 프롬프트 생성은 텍스트 기반으로만 수행 (비용이 훨씬 저렴함)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            text: [
              "다음은 사진에 대한 상세 분석입니다. 이 내용을 토대로 이미지 생성 모델에 전달할 최종 프롬프트를 만들어 주세요.",
              "",
              "=== 사진 분석 ===",
              analysis,
              "",
              "=== 요청 스타일 ===",
              `선택된 스타일: "${style}"`,
              "",
              "위 정보를 기반으로, SYSTEM_INSTRUCTION에서 정의된 출력 포맷과 규칙을 엄격히 따르는 최종 프롬프트를 한 번만 생성하세요.",
            ].join("\n"),
          },
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

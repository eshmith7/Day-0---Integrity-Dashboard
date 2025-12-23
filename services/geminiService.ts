import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTacticalResponse = async (
  prompt: string,
  contextMetrics?: string
): Promise<string> => {
  const ai = getAiClient();
  
  const systemInstruction = `You are "Integrity AI," a ruthless, high-performance tactical advisor for a Titan operating in War-Mode. 
  Your tone is surgical, minimalist, and military-grade. 
  Do not use fluff. 
  Focus on actionable intelligence, strategy, and biological optimization.
  Current User Context: ${contextMetrics || "No live telemetry."}`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Signal interrupted. No data.";
  } catch (error) {
    console.error("Gemini Tactical Link Failed:", error);
    return "Tactical link offline. Check connection.";
  }
};

export const analyzeIntelImage = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const ai = getAiClient();

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: prompt || "Analyze this tactical intel. Identify key threats or opportunities for optimization.",
          },
        ],
      },
    });

    return response.text || "Analysis complete. No significant data found.";
  } catch (error) {
    console.error("Gemini Vision Link Failed:", error);
    return "Vision link offline. Image packet rejected.";
  }
};

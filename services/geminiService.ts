import { GoogleGenAI, Type } from "@google/genai";
import { EventColor } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseEventNaturalLanguage = async (
  input: string,
  referenceDate: string
): Promise<{
  title: string;
  start: string;
  end: string;
  description: string;
  color: string;
} | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Current Date: ${referenceDate}. User Input: "${input}". 
      Extract event details. If time is not specified, assume all day or standard business hours. 
      Format dates as ISO 8601 strings (YYYY-MM-DDTHH:mm:ss).
      Suggest a color enum value based on the event type (Blue=Work, Green=Personal, Red=Urgent/Important, Purple=Social, Orange=Family, Gray=Other).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            start: { type: Type.STRING, description: "ISO 8601 start date time" },
            end: { type: Type.STRING, description: "ISO 8601 end date time" },
            description: { type: Type.STRING },
            color: { 
              type: Type.STRING, 
              enum: [
                "bg-blue-100 text-blue-700 border-blue-200",
                "bg-red-100 text-red-700 border-red-200",
                "bg-green-100 text-green-700 border-green-200",
                "bg-purple-100 text-purple-700 border-purple-200",
                "bg-orange-100 text-orange-700 border-orange-200",
                "bg-gray-100 text-gray-700 border-gray-200"
              ]
            },
          },
          required: ["title", "start", "end", "color"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing event with Gemini:", error);
    return null;
  }
};
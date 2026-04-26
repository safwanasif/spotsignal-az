import { classifyImage, buildRiskExplanation } from "./mockAi";
import {
  classifyImageWithGemini,
  generateRiskExplanationWithGemini
} from "./gemini";
import type {
  ImageCategory,
  LanguagePreference,
  PersonalRiskResult,
  ReportFormValues,
  UserReport,
  WeatherContext
} from "../../types/domain";

export async function classifyReportImage(values: ReportFormValues): Promise<{
  category: ImageCategory;
  confidence: "low" | "medium" | "high";
  source: "Gemini API" | "Mock AI";
}> {
  if (values.imageDataUrl && values.imageMimeType) {
    try {
      const result = await classifyImageWithGemini(values.imageDataUrl, values.imageMimeType);
      return {
        ...result,
        source: "Gemini API"
      };
    } catch (error) {
      console.warn("Using mock image classification fallback:", error);
    }
  }

  return {
    ...classifyImage(values.imageName),
    source: "Mock AI"
  };
}

export async function generateRiskExplanation(
  report: UserReport,
  risk: PersonalRiskResult,
  weather: WeatherContext,
  language: LanguagePreference
): Promise<{
  explanation: string;
  source: "Gemini API" | "Mock AI";
}> {
  try {
    const explanation = await generateRiskExplanationWithGemini(
      report,
      risk,
      weather,
      language
    );

    return {
      explanation,
      source: "Gemini API"
    };
  } catch (error) {
    console.warn("Using mock explanation fallback:", error);
    return {
      explanation: buildRiskExplanation(report, language),
      source: "Mock AI"
    };
  }
}

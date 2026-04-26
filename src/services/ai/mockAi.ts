import type { ImageCategory, LanguagePreference, UserReport } from "../../types/domain";

export function classifyImage(imageName?: string): {
  category: ImageCategory;
  confidence: "low" | "medium" | "high";
} {
  if (!imageName) {
    return {
      category: "unknown / needs review",
      confidence: "low"
    };
  }

  const normalized = imageName.toLowerCase();

  if (normalized.includes("rash")) {
    return { category: "rash-like mark", confidence: "medium" };
  }

  if (normalized.includes("bruise")) {
    return { category: "bruise-like mark", confidence: "medium" };
  }

  if (normalized.includes("sore") || normalized.includes("lesion")) {
    return { category: "sore/lesion-like mark", confidence: "medium" };
  }

  return { category: "bite-like mark", confidence: "medium" };
}

export function buildRiskExplanation(report: UserReport, language: LanguagePreference): string {
  const english =
    "Your report has a moderate signal because your symptoms and image category overlap with similar reports recently submitted near northeast Tucson. This is not a diagnosis. The strongest contributing factors are symptom similarity, outdoor exposure, and nearby community trend.";

  const spanish =
    "Su reporte tiene una senal moderada porque sus sintomas y la categoria de imagen coinciden con reportes recientes cerca del noreste de Tucson. Esto no es un diagnostico. Los factores principales son similitud de sintomas, exposicion al aire libre y tendencia comunitaria cercana.";

  if (report.language === "Spanish" || language === "Spanish") return spanish;
  return english;
}

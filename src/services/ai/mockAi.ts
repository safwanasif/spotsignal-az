import type {
  ImageCategory,
  LanguagePreference,
  RiskFactor,
  SignalAudit,
  UserReport
} from "../../types/domain";

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

export function buildSignalAudit(
  report: UserReport,
  score: number,
  factors: RiskFactor[]
): SignalAudit {
  const strongestFactor =
    [...factors].sort((a, b) => b.weight - a.weight)[0]?.label ?? "Submitted symptoms";
  const uncertainty = report.exposureTypes.includes("Outdoor/vector")
    ? "Weather and outdoor context can make a vector-like pattern more plausible, but they do not prove exposure or causation."
    : "Self-reports are early signals and can include unrelated illnesses, duplicate reports, or incomplete timing.";
  const missingData = report.exposureTypes.includes("Foodborne")
    ? "Needs repeated onset timing, shared food-setting detail, and clinic or inspection comparison."
    : report.exposureTypes.includes("Close-contact")
      ? "Needs clinic or campus-health comparison before escalation."
      : "Needs clinic, lab, vector, animal, or partner-feed comparison before public health action.";

  return {
    source: "Mock AI",
    thresholdReason: `${strongestFactor} is the strongest model driver behind the ${score}/100 signal.`,
    uncertainty,
    missingData,
    reviewerNextStep:
      "Keep the signal in human review, compare against partner data if the pattern repeats, and avoid public claims from a single report."
  };
}

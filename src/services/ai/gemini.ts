import type {
  ImageCategory,
  LanguagePreference,
  PatternTriage,
  PersonalRiskResult,
  SignalAudit,
  SurveillancePattern,
  UserReport,
  WeatherContext
} from "../../types/domain";

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_GEMINI_MODEL = "gemini-3-flash-preview";
const DEFAULT_GEMMA_MODEL = "gemma-4-31b-it";
const allowedCategories: ImageCategory[] = [
  "bite-like mark",
  "rash-like mark",
  "bruise-like mark",
  "sore/lesion-like mark",
  "swelling/redness",
  "unknown / needs review"
];
const allowedPatterns: SurveillancePattern[] = [
  "vector-like",
  "respiratory-close-contact",
  "foodborne-like",
  "travel-associated",
  "one-health-animal-environment",
  "heat-environmental",
  "general-monitor"
];

interface GeminiTextPart {
  text: string;
}

interface GeminiInlineImagePart {
  inline_data: {
    mime_type: string;
    data: string;
  };
}

type GeminiPart = GeminiTextPart | GeminiInlineImagePart;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

interface ImageClassificationResponse {
  category?: ImageCategory;
  confidence?: "low" | "medium" | "high";
}

interface SignalAuditResponse {
  thresholdReason?: string;
  uncertainty?: string;
  missingData?: string;
  reviewerNextStep?: string;
}

interface PatternTriageResponse {
  pattern?: SurveillancePattern;
  confidence?: "low" | "medium" | "high";
  routingReason?: string;
  promotedContext?: string[];
  reviewWindow?: "monitor" | "24h" | "48h";
}

function getApiKey(): string | undefined {
  return import.meta.env.VITE_GEMINI_API_KEY;
}

function getModel(): string {
  return import.meta.env.VITE_GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
}

function getGemmaModel(): string {
  return import.meta.env.VITE_GEMMA_MODEL ?? DEFAULT_GEMMA_MODEL;
}

function readGeminiText(response: GeminiResponse): string {
  return (
    response.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

function stripJsonFences(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseJsonResponse<T>(text: string): T | undefined {
  try {
    return JSON.parse(stripJsonFences(text)) as T;
  } catch {
    return undefined;
  }
}

function dataUrlToBase64(dataUrl?: string): string | undefined {
  if (!dataUrl) return undefined;
  const [, base64] = dataUrl.split(",");
  return base64;
}

async function callGemini(parts: GeminiPart[], model = getModel()): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("Missing VITE_GEMINI_API_KEY");
  }

  const response = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts
        }
      ],
      generationConfig: {
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini request failed with ${response.status}: ${message}`);
  }

  return readGeminiText((await response.json()) as GeminiResponse);
}

export async function classifyImageWithGemini(
  imageDataUrl?: string,
  imageMimeType?: string
): Promise<{
  category: ImageCategory;
  confidence: "low" | "medium" | "high";
}> {
  const base64Image = dataUrlToBase64(imageDataUrl);

  if (!base64Image || !imageMimeType) {
    throw new Error("No image bytes available for Gemini classification");
  }

  const text = await callGemini([
    {
      text:
        "Classify the visible skin mark into exactly one broad, non-diagnostic category. Allowed categories: bite-like mark, rash-like mark, bruise-like mark, sore/lesion-like mark, swelling/redness, unknown / needs review. Do not diagnose. Return only JSON like {\"category\":\"bite-like mark\",\"confidence\":\"medium\"}."
    },
    {
      inline_data: {
        mime_type: imageMimeType,
        data: base64Image
      }
    }
  ]);

  const parsed = parseJsonResponse<ImageClassificationResponse>(text);
  const category = parsed?.category;
  const confidence = parsed?.confidence;

  if (!category || !allowedCategories.includes(category)) {
    return {
      category: "unknown / needs review",
      confidence: "low"
    };
  }

  return {
    category,
    confidence: confidence ?? "medium"
  };
}

export async function generateRiskExplanationWithGemini(
  report: UserReport,
  risk: PersonalRiskResult,
  weather: WeatherContext,
  language: LanguagePreference
): Promise<string> {
  const text = await callGemini([
    {
      text: `Write a calm, non-diagnostic SpotSignal AZ explanation in ${language}. Keep it to 2 to 3 sentences. Never say the user has a disease, never say a place caused illness, and mention that human review handles cluster interpretation. If Epydemix relevance is primary, explain that Arizona contact-matrix data helps reviewers understand whether close-contact settings could amplify similar symptoms. If Epydemix relevance is background, do not present it as a main driver.

Report:
- Symptoms: ${report.symptoms.join(", ")}
- Image category: ${report.imageCategory} (${report.imageConfidence} confidence)
- Exposure types: ${report.exposureTypes.join(", ")}
- Privacy level: ${report.privacyLevel}
- Signal level: ${risk.signalLevel}
- Score: ${risk.score}
- AI triage pattern: ${risk.aiTriage.pattern} (${risk.aiTriage.confidence})
- Factors: ${risk.factors.map((factor) => factor.label).join(", ")}
- Weather context: ${weather.summary}
- Epydemix relevance: ${risk.epydemix.relevance}
- Epydemix contact context: ${risk.epydemix.summary}`
    }
  ]);

  if (!text) {
    throw new Error("Gemini returned an empty explanation");
  }

  return text;
}

export async function generatePatternTriageWithGemma(
  report: UserReport,
  weather: WeatherContext
): Promise<PatternTriage> {
  const text = await callGemini(
    [
      {
        text: `You are Gemma inside SpotSignal AZ. Classify the incoming self-report packet into one surveillance routing pattern. This classification affects risk scoring and reviewer workflow, so be conservative. Return only JSON with keys pattern, confidence, routingReason, promotedContext, reviewWindow.

Allowed patterns: vector-like, respiratory-close-contact, foodborne-like, travel-associated, one-health-animal-environment, heat-environmental, general-monitor.
Allowed confidence: low, medium, high.
Allowed reviewWindow: monitor, 24h, 48h.
promotedContext must be 2 to 4 short strings.

Report:
- Symptoms: ${report.symptoms.join(", ")}
- Place/exposure: ${report.exposureTypes.join(", ")}
- Privacy: ${report.privacyLevel}
- Image category: ${report.imageCategory} (${report.imageConfidence})
- Weather: ${weather.summary}`
      }
    ],
    getGemmaModel()
  );

  const parsed = parseJsonResponse<PatternTriageResponse>(text);

  if (!parsed?.pattern || !allowedPatterns.includes(parsed.pattern)) {
    throw new Error("Gemma returned an invalid triage pattern");
  }

  return {
    source: "Gemma API",
    pattern: parsed.pattern,
    confidence: parsed.confidence ?? "low",
    routingReason: parsed.routingReason ?? "Gemma routed this report using symptoms and exposure context.",
    promotedContext: parsed.promotedContext?.slice(0, 4) ?? ["symptoms", "exposure context"],
    reviewWindow: parsed.reviewWindow ?? "monitor"
  };
}

export async function generateSignalAuditWithGemma(
  report: UserReport,
  risk: PersonalRiskResult
): Promise<SignalAudit> {
  const text = await callGemini(
    [
      {
        text: `You are the Gemma signal auditor inside SpotSignal AZ. Audit the AI-generated risk profile for a participatory surveillance prototype. Return only JSON with keys thresholdReason, uncertainty, missingData, reviewerNextStep. Keep each value under 24 words. Be conservative, non-diagnostic, and human-in-the-loop.

Report:
- Symptoms: ${report.symptoms.join(", ")}
- Exposure types: ${report.exposureTypes.join(", ")}
- Privacy level: ${report.privacyLevel}
- Zone: ${report.zoneId}
- Image category: ${report.imageCategory} (${report.imageConfidence})

Risk profile:
- Signal level: ${risk.signalLevel}
- Score: ${risk.score}
- Factors: ${risk.factors
          .map((factor) => `${factor.label} ${factor.weight}pts`)
          .join("; ")}
- Weather source: ${risk.weather.source}
- Weather summary: ${risk.weather.summary}
- Epydemix relevance: ${risk.epydemix.relevance}
- Epydemix summary: ${risk.epydemix.summary}`
      }
    ],
    getGemmaModel()
  );

  const parsed = parseJsonResponse<SignalAuditResponse>(text);

  if (
    !parsed?.thresholdReason ||
    !parsed.uncertainty ||
    !parsed.missingData ||
    !parsed.reviewerNextStep
  ) {
    throw new Error("Gemma returned an incomplete signal audit");
  }

  return {
    source: "Gemma API",
    thresholdReason: parsed.thresholdReason,
    uncertainty: parsed.uncertainty,
    missingData: parsed.missingData,
    reviewerNextStep: parsed.reviewerNextStep
  };
}

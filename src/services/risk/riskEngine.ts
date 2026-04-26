import { communityTrends } from "../../data/mockTrends";
import { getPlaceById } from "../../data/places";
import { scoreToSignal } from "../../lib/signal";
import {
  generateRiskExplanation,
  classifyReportImage,
  generatePatternTriage,
  generateSignalAudit
} from "../ai/aiService";
import {
  buildRiskExplanation,
  buildPatternTriage,
  buildSignalAudit,
  classifyImage
} from "../ai/mockAi";
import {
  getEpydemixContext,
  getLocalEpydemixFallback
} from "../epydemix/epydemixData";
import { getWeatherContext } from "../weather/mockWeather";
import { getWeatherContextForPlace } from "../weather/weatherService";
import type {
  EpydemixContext,
  GeoZone,
  PatternTriage,
  PersonalRiskResult,
  ReportFormValues,
  RiskFactor,
  UserReport,
  WeatherContext
} from "../../types/domain";

export function createReport(values: ReportFormValues): UserReport {
  const place = getPlaceById(values.placeId);
  const image = classifyImage(values.imageName);

  return {
    ...values,
    id: `report-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    zoneId: place.zoneId,
    imageCategory: image.category,
    imageConfidence: image.confidence,
    imageSource: "Mock AI"
  };
}

export async function createReportWithApis(values: ReportFormValues): Promise<UserReport> {
  const place = getPlaceById(values.placeId);
  const image = await classifyReportImage(values);

  return {
    ...values,
    id: `report-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    zoneId: place.zoneId,
    imageCategory: image.category,
    imageConfidence: image.confidence,
    imageSource: image.source
  };
}

export function calculatePersonalRisk(
  report: UserReport,
  weatherOverride?: WeatherContext,
  epydemixOverride?: EpydemixContext,
  explanationOverride?: string,
  explanationSource: PersonalRiskResult["explanationSource"] = "Mock AI",
  triageOverride?: PatternTriage
): PersonalRiskResult {
  const trend = communityTrends.find((item) => item.zoneId === report.zoneId);
  const weather = weatherOverride ?? getWeatherContext(report.zoneId);
  const place = getPlaceById(report.placeId);
  const epydemix = epydemixOverride ?? getLocalEpydemixFallback(place.type);
  const aiTriage = triageOverride ?? buildPatternTriage(report);
  const factors: RiskFactor[] = [];

  const symptomScore = Math.min(report.symptoms.length * 8, 32);
  factors.push({
    label: "Symptom similarity",
    weight: symptomScore,
    explanation: `${report.symptoms.join(", ")} overlap with the demo cluster profile.`
  });

  if (report.imageCategory !== "unknown / needs review") {
    factors.push({
      label: "Image context",
      weight: 14,
      explanation: `Optional image was categorized as ${report.imageCategory} with ${report.imageConfidence} confidence.`
    });
  }

  if (report.exposureTypes.includes("Outdoor/vector")) {
    factors.push({
      label: "Outdoor exposure",
      weight: 14,
      explanation: "Recent outdoor activity can be relevant to vector or environmental monitoring."
    });
  }

  if (trend) {
    factors.push({
      label: "Nearby community trend",
      weight: Math.min(trend.similarReports7d, 22),
      explanation: `${trend.similarReports7d} similar reports were seen in this zone over the last 7 days.`
    });
  }

  if (weather.vectorSuitability === "elevated") {
    factors.push({
      label: "Weather context",
      weight: 12,
      explanation: weather.summary
    });
  }

  if (epydemix.relevance === "primary") {
    const epydemixWeight = Math.min(
      Math.max(Math.round(epydemix.strongestLayer.relativeToAll * 7), 3),
      10
    );

    factors.push({
      label: "Epydemix contact context",
      weight: epydemixWeight,
      explanation: epydemix.summary
    });
  }

  if (aiTriage.confidence !== "low") {
    factors.push({
      label: "AI pattern triage",
      weight: aiTriage.confidence === "high" ? 12 : 8,
      explanation: `${aiTriage.pattern} routing: ${aiTriage.routingReason}`
    });
  }

  const score = Math.min(
    factors.reduce((total, factor) => total + factor.weight, 0),
    100
  );

  return {
    score,
    signalLevel: scoreToSignal(score),
    explanation: explanationOverride ?? buildRiskExplanation(report, report.language),
    factors,
    nextSteps: [
      "This is not a diagnosis and does not mean the location caused illness.",
      "Track symptoms and consider contacting a clinician if symptoms worsen or feel urgent.",
      "Your report helps public health reviewers notice patterns without showing individual pins."
    ],
    weather,
    epydemix,
    aiTriage,
    aiAudit: buildSignalAudit(report, score, factors),
    explanationSource
  };
}

export async function buildRiskAssessment(values: ReportFormValues): Promise<{
  report: UserReport;
  risk: PersonalRiskResult;
}> {
  const report = await createReportWithApis(values);
  const place = getPlaceById(report.placeId);
  const [weather, epydemix] = await Promise.all([
    getWeatherContextForPlace(place),
    getEpydemixContext(place, report)
  ]);
  const aiTriage = await generatePatternTriage(report, weather);
  const baseRisk = calculatePersonalRisk(
    report,
    weather,
    epydemix,
    undefined,
    "Mock AI",
    aiTriage
  );
  const aiExplanation = await generateRiskExplanation(
    report,
    baseRisk,
    weather,
    report.language
  );
  const riskWithExplanation: PersonalRiskResult = {
    ...baseRisk,
    explanation: aiExplanation.explanation,
    explanationSource: aiExplanation.source
  };
  const aiAudit = await generateSignalAudit(report, riskWithExplanation);

  return {
    report,
    risk: {
      ...riskWithExplanation,
      aiAudit
    }
  };
}

export function applyReportToZones(zones: GeoZone[], report: UserReport): GeoZone[] {
  return zones.map((zone) => {
    if (zone.id !== report.zoneId) return zone;

    return {
      ...zone,
      signalLevel: zone.signalLevel === "review" ? "review" : "watch",
      reportCount7d: zone.reportCount7d + 1,
      trend: "New report reinforces the current cluster watch pattern",
      factors: Array.from(
        new Set([...zone.factors, report.imageCategory, ...report.exposureTypes])
      )
    };
  });
}

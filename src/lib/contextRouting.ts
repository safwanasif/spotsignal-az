import { getPlaceById } from "../data/places";
import type { PersonalRiskResult, UserReport } from "../types/domain";

export type ContextFit = "primary" | "supporting" | "background" | "planned";

export interface RoutedContextLayer {
  id: string;
  name: string;
  fit: ContextFit;
  sourceStatus: string;
  reason: string;
  reviewerUse: string;
}

function hasAny(report: UserReport, values: string[]) {
  return report.exposureTypes.some((type) => values.includes(type));
}

export function getRoutedContextLayers(
  report: UserReport,
  risk: PersonalRiskResult
): RoutedContextLayer[] {
  const place = getPlaceById(report.placeId);
  const outdoorRelevant = hasAny(report, ["Outdoor/vector", "Water/environmental"]);
  const closeContactRelevant = hasAny(report, ["Close-contact"]);
  const travelRelevant = hasAny(report, ["Travel-associated"]) || place.type === "Airport";
  const foodRelevant = hasAny(report, ["Foodborne"]);
  const animalRelevant = hasAny(report, ["Animal/zoonotic"]);

  return [
    {
      id: "weather-vector",
      name: "Weather / vector context",
      fit: outdoorRelevant ? "primary" : "background",
      sourceStatus: risk.weather.source,
      reason: outdoorRelevant
        ? `${place.label} is a ${place.type.toLowerCase()} report, so heat, humidity, rain, and vector suitability are relevant context.`
        : "Weather is checked but is not a main driver for this report type.",
      reviewerUse: outdoorRelevant
        ? "Use this to decide whether an outdoor/vector-like cluster deserves monitoring or comparison against mosquito/vector surveillance."
        : "Keep as background context only."
    },
    {
      id: "epydemix-contact",
      name: "Epydemix contact context",
      fit: closeContactRelevant ? "primary" : foodRelevant || travelRelevant ? "supporting" : "background",
      sourceStatus: risk.epydemix.source,
      reason: closeContactRelevant
        ? `${place.type} reports can involve repeated close-contact interactions, so Arizona contact matrices help interpret possible spread settings.`
        : foodRelevant || travelRelevant
          ? `${place.type} can involve shared spaces, so contact context is supporting evidence rather than the main driver.`
          : "Contact matrices are checked, but they are not the main context for this report.",
      reviewerUse: closeContactRelevant
        ? "Use this to compare home, school, work, and community contact layers before requesting more reports or clinic comparison."
        : "Use only as a secondary lens unless more close-contact reports appear."
    },
    {
      id: "cdc-travel",
      name: "CDC travel notices",
      fit: travelRelevant ? "primary" : "background",
      sourceStatus: "Live RSS on Data Sources page",
      reason: travelRelevant
        ? `${place.label} is travel-associated, so current travel notices can help reviewers check whether symptoms overlap with known advisories.`
        : "CDC travel notices stay in the background unless the report includes recent travel.",
      reviewerUse: travelRelevant
        ? "Use this to compare symptom patterns against current CDC travel advisories before escalating a travel-associated signal."
        : "Do not treat travel notices as evidence for a non-travel report."
    },
    {
      id: "airline-routes",
      name: "Airline routes / timetables",
      fit: travelRelevant ? "planned" : "background",
      sourceStatus: "Planned integration",
      reason: travelRelevant
        ? "Route and timetable context would help identify whether similar travel reports share plausible pathways."
        : "Not active because this report does not involve a travel pathway.",
      reviewerUse: travelRelevant
        ? "Future deployment could compare anonymized travel pathway overlap without exposing individual itineraries."
        : "No reviewer action needed."
    },
    {
      id: "one-health-feeds",
      name: "One Health partner feeds",
      fit: animalRelevant ? "planned" : "background",
      sourceStatus: "Future public health integration",
      reason: animalRelevant
        ? `${place.type} reports may involve animal or environmental exposure, so animal/environment partner feeds would be useful in deployment.`
        : "Not active unless the report involves animal, farm, or environmental exposure.",
      reviewerUse: animalRelevant
        ? "Future deployment could compare aggregate reports against animal health, environmental, or vector partner signals."
        : "No reviewer action needed."
    }
  ];
}

import type {
  EpydemixContext,
  EpydemixLayerSummary,
  PlaceOption,
  UserReport
} from "../../types/domain";

const BASE_URL =
  "https://raw.githubusercontent.com/epistorm/epydemix-data/main/data/United_States_Arizona";
const CONTACT_SOURCE = "mistry_2021";

type ContactLayer = EpydemixLayerSummary["layer"];

const fallbackContext: EpydemixContext = {
  location: "United_States_Arizona",
  contactSource: "fallback",
  source: "Local fallback",
  sourceUrl: "https://www.epydemix.org/",
  setting: "Community setting",
  relevance: "background",
  relevantLayers: [
    {
      layer: "community",
      averageContacts: 0.41,
      relativeToAll: 0.82
    }
  ],
  strongestLayer: {
    layer: "community",
    averageContacts: 0.41,
    relativeToAll: 0.82
  },
  populationTotal: 335893238,
  summary:
    "Epydemix live data was unavailable, so SpotSignal is using a local contact-pattern fallback."
};

export function getLocalEpydemixFallback(setting = "Community setting"): EpydemixContext {
  return {
    ...fallbackContext,
    setting
  };
}

function matrixUrl(layer: ContactLayer): string {
  return `${BASE_URL}/contact_matrices/${CONTACT_SOURCE}/contacts_matrix_${layer}.csv`;
}

function parseMatrix(csv: string): number[][] {
  return csv
    .trim()
    .split(/\r?\n/)
    .map((row) =>
      row
        .split(",")
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
    )
    .filter((row) => row.length > 0);
}

function parsePopulationTotal(csv: string): number {
  return csv
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .reduce((total, row) => {
      const [, value] = row.split(",");
      const numericValue = Number(value);
      return total + (Number.isFinite(numericValue) ? numericValue : 0);
    }, 0);
}

function averageMatrix(matrix: number[][]): number {
  const values = matrix.flat().filter((value) => Number.isFinite(value));
  if (values.length === 0) return 0;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function settingLayers(place: PlaceOption, report: UserReport): ContactLayer[] {
  if (!isContactPatternRelevant(place, report)) return [];

  if (place.type === "Shared housing") return ["home", "school", "community"];
  if (place.type === "School") return ["school", "community"];
  if (place.type === "Restaurant") return ["community", "work"];
  if (place.type === "Airport") return ["community", "work"];
  if (place.type === "Farm/ranch") return ["work", "community"];

  if (report.exposureTypes.includes("Close-contact")) return ["community", "home"];
  if (report.exposureTypes.includes("Travel-associated")) return ["community", "work"];

  return ["community"];
}

function isContactPatternRelevant(place: PlaceOption, report: UserReport): boolean {
  if (["Shared housing", "School", "Restaurant", "Airport", "Farm/ranch"].includes(place.type)) {
    return true;
  }

  return report.exposureTypes.some((exposure) =>
    ["Close-contact", "Foodborne", "Travel-associated", "Animal/zoonotic"].includes(exposure)
  );
}

function buildSummary(
  place: PlaceOption,
  layers: EpydemixLayerSummary[],
  populationTotal: number,
  relevance: EpydemixContext["relevance"]
): string {
  if (relevance === "background") {
    return `Epydemix Arizona contact matrices were checked, but they are not a main driver for this ${place.type.toLowerCase()} report. For outdoor/vector-style signals, SpotSignal relies more on symptoms, image context, weather, exposure type, and nearby report trends.`;
  }

  const layerNames = layers.map((layer) => layer.layer).join(", ");
  const totalText =
    populationTotal > 0
      ? ` The Arizona age-structure file is used behind the scenes to keep this context state-specific.`
      : "";

  return `Epydemix Arizona contact matrices are useful here because ${place.type.toLowerCase()} reports can involve person-to-person mixing across ${layerNames} settings. SpotSignal uses this as reviewer context: if similar symptoms rise in the same place and time window, close-contact spread becomes more plausible and worth monitoring. It does not diagnose, prove transmission, or decide public health action on its own.${totalText}`;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Epydemix fetch failed with ${response.status}`);
  }

  return response.text();
}

export async function getEpydemixContext(
  place: PlaceOption,
  report: UserReport
): Promise<EpydemixContext> {
  try {
    const relevantLayerNames = settingLayers(place, report);
    const allLayerUrl = matrixUrl("all");
    const populationUrl = `${BASE_URL}/demographic/age_distribution.csv`;
    const relevance: EpydemixContext["relevance"] =
      relevantLayerNames.length > 0 ? "primary" : "background";

    const [allCsv, populationCsv, ...layerCsvs] = await Promise.all([
      fetchText(allLayerUrl),
      fetchText(populationUrl),
      ...relevantLayerNames.map((layer) => fetchText(matrixUrl(layer)))
    ]);

    const allAverage = averageMatrix(parseMatrix(allCsv)) || 1;
    const populationTotal = parsePopulationTotal(populationCsv);
    const relevantLayers = layerCsvs.map((csv, index) => {
      const averageContacts = averageMatrix(parseMatrix(csv));

      return {
        layer: relevantLayerNames[index],
        averageContacts,
        relativeToAll: averageContacts / allAverage
      };
    });
    const strongestLayer = [...relevantLayers].sort(
      (a, b) => b.averageContacts - a.averageContacts
    )[0] ?? {
      layer: "community",
      averageContacts: 0,
      relativeToAll: 0
    };

    return {
      location: "United_States_Arizona",
      contactSource: CONTACT_SOURCE,
      source: "Epydemix GitHub data",
      sourceUrl: "https://github.com/epistorm/epydemix-data",
      setting: place.type,
      relevance,
      relevantLayers,
      strongestLayer,
      populationTotal,
      summary: buildSummary(place, relevantLayers, populationTotal, relevance)
    };
  } catch (error) {
    console.warn("Using Epydemix fallback:", error);
    return {
      ...fallbackContext,
      setting: place.type,
      summary: `Epydemix live data was unavailable. Contact-pattern context is not being used as a main driver for this ${place.type.toLowerCase()} signal.`
    };
  }
}

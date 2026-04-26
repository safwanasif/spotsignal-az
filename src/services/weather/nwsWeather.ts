import type { PlaceOption, WeatherContext } from "../../types/domain";

interface NwsPointResponse {
  properties?: {
    forecastHourly?: string;
  };
}

interface NwsForecastPeriod {
  temperature?: number;
  shortForecast?: string;
  relativeHumidity?: {
    value?: number | null;
  };
}

interface NwsHourlyForecastResponse {
  properties?: {
    periods?: NwsForecastPeriod[];
  };
}

const NWS_TIMEOUT_MS = 7000;

function withTimeout(): AbortController {
  const controller = new AbortController();
  window.setTimeout(() => controller.abort(), NWS_TIMEOUT_MS);
  return controller;
}

function heatRiskForTemperature(temperatureF: number): WeatherContext["heatRisk"] {
  if (temperatureF >= 105) return "high";
  if (temperatureF >= 95) return "moderate";
  return "low";
}

function vectorSuitabilityFor(
  temperatureF: number,
  humidityPercent: number,
  recentRain: boolean
): WeatherContext["vectorSuitability"] {
  if (temperatureF >= 65 && temperatureF <= 95 && (humidityPercent >= 40 || recentRain)) {
    return "elevated";
  }

  if (temperatureF >= 60 && humidityPercent >= 30) {
    return "moderate";
  }

  return "low";
}

function buildWeatherSummary(
  temperatureF: number,
  humidityPercent: number,
  recentRain: boolean,
  vectorSuitability: WeatherContext["vectorSuitability"]
): string {
  if (vectorSuitability === "elevated") {
    return `NOAA/NWS forecast context shows ${temperatureF}F and ${humidityPercent}% humidity${
      recentRain ? " with rain/showers in the forecast" : ""
    }, which may support mosquito activity in outdoor areas.`;
  }

  return `NOAA/NWS forecast context shows ${temperatureF}F and ${humidityPercent}% humidity. Weather is not strongly elevating this signal right now.`;
}

export async function fetchNwsWeatherContext(place: PlaceOption): Promise<WeatherContext> {
  const controller = withTimeout();
  const pointUrl = `https://api.weather.gov/points/${place.latitude.toFixed(4)},${place.longitude.toFixed(4)}`;
  const pointResponse = await fetch(pointUrl, {
    headers: {
      Accept: "application/geo+json"
    },
    signal: controller.signal
  });

  if (!pointResponse.ok) {
    throw new Error(`NWS point lookup failed with ${pointResponse.status}`);
  }

  const pointData = (await pointResponse.json()) as NwsPointResponse;
  const hourlyUrl = pointData.properties?.forecastHourly;

  if (!hourlyUrl) {
    throw new Error("NWS point response did not include an hourly forecast URL");
  }

  const forecastResponse = await fetch(hourlyUrl, {
    headers: {
      Accept: "application/geo+json"
    },
    signal: controller.signal
  });

  if (!forecastResponse.ok) {
    throw new Error(`NWS hourly forecast failed with ${forecastResponse.status}`);
  }

  const forecastData = (await forecastResponse.json()) as NwsHourlyForecastResponse;
  const currentPeriod = forecastData.properties?.periods?.[0];

  if (!currentPeriod?.temperature) {
    throw new Error("NWS hourly forecast did not include current temperature");
  }

  const temperatureF = currentPeriod.temperature;
  const humidityPercent = Math.round(currentPeriod.relativeHumidity?.value ?? 35);
  const shortForecast = currentPeriod.shortForecast ?? "";
  const recentRain = /rain|shower|storm|thunder/i.test(shortForecast);
  const heatRisk = heatRiskForTemperature(temperatureF);
  const vectorSuitability = vectorSuitabilityFor(
    temperatureF,
    humidityPercent,
    recentRain
  );

  return {
    zoneId: place.zoneId,
    temperatureF,
    humidityPercent,
    recentRain,
    heatRisk,
    vectorSuitability,
    summary: buildWeatherSummary(
      temperatureF,
      humidityPercent,
      recentRain,
      vectorSuitability
    ),
    source: "NOAA/NWS API"
  };
}

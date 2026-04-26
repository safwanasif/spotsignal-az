import type { WeatherContext } from "../../types/domain";

export function getWeatherContext(zoneId: string): WeatherContext {
  if (zoneId === "sabino-catalina") {
    return {
      zoneId,
      temperatureF: 87,
      humidityPercent: 42,
      recentRain: true,
      heatRisk: "moderate",
      vectorSuitability: "elevated",
      summary:
        "Warm temperatures and recent rain may support mosquito activity in outdoor areas.",
      source: "Mock weather"
    };
  }

  return {
    zoneId,
    temperatureF: 84,
    humidityPercent: 31,
    recentRain: false,
    heatRisk: "moderate",
    vectorSuitability: "low",
    summary: "Weather context is not strongly elevating this signal right now.",
    source: "Mock weather"
  };
}

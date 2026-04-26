import { getWeatherContext } from "./mockWeather";
import { fetchNwsWeatherContext } from "./nwsWeather";
import type { PlaceOption, WeatherContext } from "../../types/domain";

export async function getWeatherContextForPlace(
  place: PlaceOption
): Promise<WeatherContext> {
  try {
    return await fetchNwsWeatherContext(place);
  } catch (error) {
    console.warn("Using mock weather fallback:", error);
    return getWeatherContext(place.zoneId);
  }
}

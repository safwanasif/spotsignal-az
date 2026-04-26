import type { PlaceOption } from "../types/domain";

export const placeOptions: PlaceOption[] = [
  {
    id: "sabino-canyon",
    label: "Sabino Canyon",
    zoneId: "sabino-catalina",
    type: "Hiking trail",
    latitude: 32.3093,
    longitude: -110.8234,
    exposureCategories: ["Outdoor/vector", "Water/environmental"]
  },
  {
    id: "ua-dorm",
    label: "University dorm",
    zoneId: "university",
    type: "Shared housing",
    latitude: 32.2319,
    longitude: -110.9501,
    exposureCategories: ["Close-contact"]
  },
  {
    id: "downtown-restaurant",
    label: "Downtown restaurant",
    zoneId: "downtown",
    type: "Restaurant",
    latitude: 32.2226,
    longitude: -110.9747,
    exposureCategories: ["Foodborne", "Close-contact"]
  },
  {
    id: "tucson-farmers-market",
    label: "Tucson farmers market",
    zoneId: "downtown",
    type: "Food market",
    latitude: 32.2217,
    longitude: -110.9697,
    exposureCategories: ["Foodborne", "Close-contact"]
  },
  {
    id: "tucson-airport",
    label: "Tucson Airport",
    zoneId: "south-tucson",
    type: "Airport",
    latitude: 32.1161,
    longitude: -110.941,
    exposureCategories: ["Travel-associated", "Close-contact"]
  },
  {
    id: "tucson-transit-center",
    label: "Tucson transit center",
    zoneId: "downtown",
    type: "Transit hub",
    latitude: 32.2218,
    longitude: -110.9668,
    exposureCategories: ["Travel-associated", "Close-contact"]
  },
  {
    id: "south-tucson-clinic",
    label: "South Tucson clinic",
    zoneId: "south-tucson",
    type: "Clinic waiting area",
    latitude: 32.1995,
    longitude: -110.9682,
    exposureCategories: ["Close-contact"]
  },
  {
    id: "marana-ranch",
    label: "Marana ranch/farm",
    zoneId: "marana",
    type: "Farm/ranch",
    latitude: 32.4367,
    longitude: -111.2254,
    exposureCategories: ["Animal/zoonotic", "Outdoor/vector"]
  },
  {
    id: "tucson-animal-event",
    label: "Tucson animal event",
    zoneId: "south-tucson",
    type: "Animal event",
    latitude: 32.1807,
    longitude: -110.9563,
    exposureCategories: ["Animal/zoonotic", "Close-contact"]
  },
  {
    id: "oro-valley-park",
    label: "Oro Valley park",
    zoneId: "oro-valley",
    type: "Park",
    latitude: 32.3909,
    longitude: -110.9665,
    exposureCategories: ["Outdoor/vector", "Water/environmental"]
  },
  {
    id: "mount-lemmon-trailhead",
    label: "Mount Lemmon trailhead",
    zoneId: "sabino-catalina",
    type: "Mountain trail",
    latitude: 32.3217,
    longitude: -110.7907,
    exposureCategories: ["Outdoor/vector", "Animal/zoonotic"]
  },
  {
    id: "reid-park",
    label: "Reid Park",
    zoneId: "downtown",
    type: "Urban park",
    latitude: 32.2118,
    longitude: -110.9235,
    exposureCategories: ["Outdoor/vector", "Close-contact"]
  },
  {
    id: "tucson-mall",
    label: "Tucson Mall",
    zoneId: "oro-valley",
    type: "Indoor shopping center",
    latitude: 32.2889,
    longitude: -110.9742,
    exposureCategories: ["Close-contact"]
  },
  {
    id: "kino-sports-complex",
    label: "Kino Sports Complex",
    zoneId: "south-tucson",
    type: "Sports event venue",
    latitude: 32.1677,
    longitude: -110.9337,
    exposureCategories: ["Close-contact", "Outdoor/vector"]
  },
  {
    id: "santa-cruz-river-path",
    label: "Santa Cruz River path",
    zoneId: "south-tucson",
    type: "River path",
    latitude: 32.2071,
    longitude: -110.9972,
    exposureCategories: ["Water/environmental", "Outdoor/vector"]
  },
  {
    id: "banner-waiting-area",
    label: "Hospital waiting area",
    zoneId: "university",
    type: "Healthcare waiting room",
    latitude: 32.2376,
    longitude: -110.9466,
    exposureCategories: ["Close-contact"]
  },
  {
    id: "vail-school",
    label: "Vail school",
    zoneId: "vail",
    type: "School",
    latitude: 32.0479,
    longitude: -110.712,
    exposureCategories: ["Close-contact"]
  },
  {
    id: "vail-childcare",
    label: "Vail childcare center",
    zoneId: "vail",
    type: "Childcare/school",
    latitude: 32.0453,
    longitude: -110.7138,
    exposureCategories: ["Close-contact"]
  },
  {
    id: "green-valley-center",
    label: "Green Valley senior center",
    zoneId: "sahuarita",
    type: "Community center",
    latitude: 31.8543,
    longitude: -110.9937,
    exposureCategories: ["Close-contact"]
  },
  {
    id: "sahuarita-lake",
    label: "Sahuarita lake",
    zoneId: "sahuarita",
    type: "Lake/park",
    latitude: 31.9573,
    longitude: -110.9556,
    exposureCategories: ["Water/environmental", "Outdoor/vector"]
  }
];

export function getPlaceById(placeId: string): PlaceOption {
  return placeOptions.find((place) => place.id === placeId) ?? placeOptions[0];
}
